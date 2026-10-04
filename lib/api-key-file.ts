import type { AIProvider } from "./ai-providers";
import type { Action } from "./learning-client";
import type { QuestState } from "./types";
import { readDevice, writeDevice } from "./device-db";

export const maxAPIKeyFileBytes = 8192;
export type KeyFileProvider = "deepseek" | "openai" | "claude";
export type KeyFileHandle = {
  name: string;
  getFile(): Promise<File>;
  queryPermission(options: {
    mode: "read" | "readwrite";
  }): Promise<PermissionState>;
  requestPermission(options: {
    mode: "read" | "readwrite";
  }): Promise<PermissionState>;
  createWritable(): Promise<{
    write(value: string): Promise<void>;
    close(): Promise<void>;
    abort?(): Promise<void>;
  }>;
};
// No file text, parsed document, API key or error from a file enters metadata.
export type APIKeyFileMetadata = {
  enabled: boolean;
  handle: KeyFileHandle | null;
  provider: KeyFileProvider;
};
export const keyFileMetadataKey = (scope: string) => `api-key-file:${scope}`;
export function keyFileMetadata(
  enabled = false,
  handle: KeyFileHandle | null = null,
  provider: KeyFileProvider = "deepseek",
): APIKeyFileMetadata {
  return { enabled, handle, provider };
}
export class APIKeyFileError extends Error {}
export class StaleKeyFileOperation extends Error {}
const safeError = (message: string) => new APIKeyFileError(message);
export function parseAPIKeyFile(text: string) {
  if (new TextEncoder().encode(text).length > maxAPIKeyFileBytes)
    throw safeError("Choose a JSON key file smaller than 8 KB.");
  let value: unknown;
  try {
    value = JSON.parse(text);
  } catch {
    throw safeError(
      "This file is not valid JSON. Use the blank template and keep its quotes and commas.",
    );
  }
  if (!value || typeof value !== "object" || Array.isArray(value))
    throw safeError("Use the JSON template with provider and apiKey fields.");
  const document = value as Record<string, unknown>;
  if (
    !["deepseek", "openai", "claude"].includes(String(document.provider)) ||
    typeof document.apiKey !== "string" ||
    Object.keys(document).some((key) => !["provider", "apiKey"].includes(key))
  )
    throw safeError(
      "Use provider deepseek, openai, or claude and an apiKey text field. Keep only those two fields.",
    );
  const apiKey = document.apiKey.trim();
  if (
    apiKey &&
    (apiKey.length < 10 ||
      apiKey.length > 500 ||
      !/^[\x21-\x7E]+$/.test(apiKey))
  )
    throw safeError(
      "The key must contain 10–500 characters without spaces or line breaks. An empty key disconnects the assistant.",
    );
  return {
    provider: document.provider as KeyFileProvider,
    apiKey,
    adapter: (document.provider === "claude"
      ? "anthropic"
      : document.provider) as AIProvider,
  };
}
export const blankAPIKeyFile = (provider: KeyFileProvider = "deepseek") =>
  JSON.stringify({ provider, apiKey: "" }, null, 2) + "\n";
export type KeyFileContext = {
  scope: string;
  lesson: string;
  online: boolean;
  aiEnabled: boolean;
};
export function canAutomaticallyReadKeyFile(
  metadata: APIKeyFileMetadata,
  context: KeyFileContext,
  permission: PermissionState,
) {
  return (
    !!context.scope &&
    metadata.enabled &&
    !!metadata.handle &&
    context.online &&
    context.aiEnabled &&
    permission === "granted"
  );
}
type Hooks = {
  context: () => KeyFileContext;
  request: (action: Action) => Promise<QuestState>;
  saved: (state: QuestState, message: string) => void;
  changed: () => void;
  read?: (key: string) => Promise<APIKeyFileMetadata | undefined>;
  write?: (key: string, metadata: APIKeyFileMetadata) => Promise<void>;
};
export class APIKeyFileController {
  metadata = keyFileMetadata();
  loaded = false;
  busy = false;
  message = "File access is off. Your current assistant stays connected.";
  private epoch = 0;
  private loading?: Promise<void>;
  private flight?: Promise<unknown>;
  private disposed = false;
  constructor(
    readonly scope: string,
    private hooks: Hooks,
  ) {}
  private sameAccount() {
    return (
      !this.disposed &&
      !!this.scope &&
      this.hooks.context().scope === this.scope
    );
  }
  private notify() {
    if (this.sameAccount()) this.hooks.changed();
  }
  dispose() {
    this.disposed = true;
    this.epoch++;
  }
  activate() {
    this.disposed = false;
  }
  private async persist() {
    if (!this.sameAccount()) throw new StaleKeyFileOperation();
    const clean = keyFileMetadata(
      this.metadata.enabled,
      this.metadata.handle,
      this.metadata.provider,
    );
    try {
      await (
        this.hooks.write ?? ((key, value) => writeDevice("meta", key, value))
      )(keyFileMetadataKey(this.scope), clean);
    } catch {
      throw safeError(
        "This browser could not save file access. Automatic reading is off; choose the file again when needed.",
      );
    }
    if (!this.sameAccount()) throw new StaleKeyFileOperation();
  }
  load() {
    return (this.loading ??= (async () => {
      if (!this.sameAccount()) return;
      try {
        const saved = await (
          this.hooks.read ??
          ((key) => readDevice<APIKeyFileMetadata>("meta", key))
        )(keyFileMetadataKey(this.scope));
        if (!this.sameAccount()) return;
        const handle = saved?.handle;
        this.metadata = keyFileMetadata(
          saved?.enabled === true,
          handle &&
            typeof handle.getFile === "function" &&
            typeof handle.queryPermission === "function"
            ? handle
            : null,
          saved && ["deepseek", "openai", "claude"].includes(saved.provider)
            ? saved.provider
            : "deepseek",
        );
      } catch {
        this.message =
          "File access could not be restored. Choose the file again when needed.";
      }
      this.loaded = true;
      this.notify();
    })());
  }
  private run<T>(work: (check: () => void) => Promise<T>): Promise<T> {
    if (this.busy)
      return Promise.reject(
        safeError("Wait for the current file action to finish."),
      );
    const context = { ...this.hooks.context() };
    const epoch = ++this.epoch;
    const check = () => {
      const now = this.hooks.context();
      if (
        !this.sameAccount() ||
        this.epoch !== epoch ||
        now.lesson !== context.lesson
      )
        throw new StaleKeyFileOperation();
      if (!this.metadata.enabled || !now.online || !now.aiEnabled)
        throw safeError(
          "Enable file access and AI assistance, and connect to the internet before reading a key.",
        );
    };
    this.busy = true;
    this.notify();
    let flight!: Promise<T>;
    flight = (async () => {
      try {
        check();
        return await work(check);
      } catch (error) {
        if (error instanceof StaleKeyFileOperation) throw error;
        if (error instanceof APIKeyFileError) throw error;
        throw safeError(
          "The file action did not finish. Check file access and your connection, then try again.",
        );
      } finally {
        if (this.flight === flight) this.flight = undefined;
        this.busy = false;
        this.notify();
      }
    })();
    this.flight = flight;
    return flight;
  }
  async disableAuto(forget = false) {
    this.epoch++;
    const flight = this.flight;
    await this.load();
    if (!this.sameAccount()) throw new StaleKeyFileOperation();
    const hadFileAccess = this.metadata.enabled || !!this.metadata.handle;
    this.metadata = keyFileMetadata(
      false,
      forget ? null : this.metadata.handle,
      this.metadata.provider,
    );
    this.message = forget
      ? "File forgotten. The app will not read it. Your saved assistant key is unchanged."
      : "Automatic file reading is off. Your saved assistant key is unchanged.";
    this.notify();
    // Finish any already-sent key save before the manual disconnect follows.
    if (hadFileAccess || forget) await this.persist();
    await flight?.catch(() => {});
    this.notify();
  }
  async setEnabled(enabled: boolean) {
    if (!enabled) return this.disableAuto();
    await this.load();
    if (!this.sameAccount()) throw new StaleKeyFileOperation();
    this.metadata.enabled = true;
    try {
      await this.persist();
    } catch (error) {
      this.metadata.enabled = false;
      this.notify();
      throw error;
    }
    this.message =
      "File access is allowed on this account and device. Choose a JSON file to connect.";
    this.notify();
  }
  private async document(file: Pick<File, "size" | "text">, check: () => void) {
    if (file.size > maxAPIKeyFileBytes)
      throw safeError("Choose a JSON key file smaller than 8 KB.");
    const text = await file.text();
    check();
    return parseAPIKeyFile(text);
  }
  private async connect(
    document: ReturnType<typeof parseAPIKeyFile>,
    check: () => void,
  ) {
    check();
    this.metadata.provider = document.provider;
    if (!document.apiKey) {
      const lesson = this.hooks.context().lesson;
      this.metadata.enabled = false;
      this.epoch++;
      await this.persist();
      if (!this.sameAccount() || this.hooks.context().lesson !== lesson)
        throw new StaleKeyFileOperation();
      const state = await this.hooks.request({
        action: "disconnect",
        deviceScope: this.scope,
      });
      if (
        !this.sameAccount() ||
        this.hooks.context().lesson !== lesson ||
        state.draftScope !== this.scope
      )
        throw new StaleKeyFileOperation();
      this.message =
        "The file has an empty key. Automatic reading is off and your assistant is disconnected.";
      this.hooks.saved(state, this.message);
    } else {
      await this.persist();
      check();
      const state = await this.hooks.request({
        action: "key",
        provider: document.adapter,
        key: document.apiKey,
        deviceScope: this.scope,
      });
      check();
      if (state.draftScope !== this.scope) throw new StaleKeyFileOperation();
      this.message =
        "The file key was read and saved encrypted to your account. Ask the assistant a question to test it.";
      this.hooks.saved(state, this.message);
    }
    this.notify();
  }
  chooseHandle(handle: KeyFileHandle) {
    return this.run(async (check) => {
      const permission = await handle.queryPermission({ mode: "read" });
      check();
      if (permission !== "granted")
        throw safeError(
          "File permission is needed. Use Read file again to allow access.",
        );
      this.metadata.handle = handle;
      await this.persist();
      check();
      const file = await handle.getFile();
      check();
      await this.connect(await this.document(file, check), check);
    });
  }
  readOnce(file: Pick<File, "size" | "text">) {
    return this.run(async (check) => {
      // Upload-style choosers do not grant a persistent handle.
      this.metadata.handle = null;
      await this.connect(await this.document(file, check), check);
    });
  }
  readHandle(manual = false) {
    if (!this.sameAccount()) return Promise.reject(new StaleKeyFileOperation());
    if (this.busy)
      return Promise.reject(
        safeError("Wait for the current file action to finish."),
      );
    const handle = this.metadata.handle;
    if (!handle)
      return Promise.reject(safeError("Choose the JSON file first."));
    const context = { ...this.hooks.context() };
    if (!this.metadata.enabled || !context.online || !context.aiEnabled) {
      if (!manual) return Promise.resolve();
      return Promise.reject(
        safeError(
          "Enable file access and AI assistance, and connect to the internet before reading a key.",
        ),
      );
    }
    // Invoke a prompt-capable call directly from the user's button gesture.
    const permission = manual
      ? handle.requestPermission({ mode: "read" })
      : handle.queryPermission({ mode: "read" });
    return this.run(async (check) => {
      const granted = await permission;
      check();
      if (
        !canAutomaticallyReadKeyFile(
          this.metadata,
          this.hooks.context(),
          granted,
        )
      ) {
        this.message =
          "File permission is needed. Use Read file again to allow access; the app will not prompt at startup.";
        this.notify();
        return;
      }
      const file = await handle.getFile();
      check();
      await this.connect(await this.document(file, check), check);
    });
  }
  async clearKey(allowWrite = true) {
    const handle = allowWrite ? this.metadata.handle : null;
    const context = { ...this.hooks.context() };
    if (!this.sameAccount() || !context.online)
      throw safeError(
        "Connect to the internet before clearing and disconnecting a key.",
      );
    // Ask for write permission while the explicit button gesture is active.
    const permission = handle
      ? handle
          .requestPermission({ mode: "readwrite" })
          .catch(() => "denied" as PermissionState)
      : undefined;
    await this.disableAuto();
    const check = () => {
      if (!this.sameAccount() || this.hooks.context().lesson !== context.lesson)
        throw new StaleKeyFileOperation();
    };
    this.busy = true;
    this.notify();
    let written = false;
    let writeFailed = false;
    try {
      check();
      if (handle) {
        try {
          if ((await permission) !== "granted")
            throw safeError("Write permission was not granted.");
          check();
          const file = await handle.getFile();
          check();
          const document = await this.document(file, check);
          this.metadata.provider = document.provider;
          await this.persist();
          check();
          const writer = await handle.createWritable();
          try {
            check();
            await writer.write(blankAPIKeyFile(document.provider));
            check();
            await writer.close();
            written = true;
          } catch (error) {
            await writer.abort?.().catch(() => {});
            throw error;
          }
        } catch (error) {
          if (error instanceof StaleKeyFileOperation) throw error;
          writeFailed = true;
        }
      }
      check();
      let state: QuestState;
      try {
        state = await this.hooks.request({
          action: "disconnect",
          deviceScope: this.scope,
        });
      } catch {
        throw safeError(
          written
            ? "The file key is blank and automatic reading is off, but the server key could not be disconnected. Retry Disconnect assistant when online."
            : "Automatic reading is off, but the server key could not be disconnected. The original file is unchanged. Retry Disconnect assistant when online.",
        );
      }
      check();
      if (state.draftScope !== this.scope) throw new StaleKeyFileOperation();
      this.message = written
        ? "The original file now has an empty key. Automatic reading is off and your assistant is disconnected."
        : writeFailed
          ? "Your assistant is disconnected and automatic reading is off. The original file could not be changed; edit its apiKey to an empty string yourself."
          : "Your assistant is disconnected and automatic reading is off. Replace your original file with the downloaded blank copy; the original is unchanged until you replace it.";
      this.hooks.saved(state, this.message);
      return {
        written,
        replacement: !handle ? blankAPIKeyFile(this.metadata.provider) : null,
      };
    } finally {
      this.busy = false;
      this.notify();
    }
  }
}
