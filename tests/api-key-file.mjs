import assert from "node:assert/strict";
import { mkdtemp, readFile, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import ts from "typescript";
import "fake-indexeddb/auto";

const temp = await mkdtemp(path.join(tmpdir(), "codequest-key-file-"));
const syntheticKey = "synthetic-local-file-key-not-real";
const scope = "a".repeat(64);
const nextScope = "b".repeat(64);
try {
  for (const name of ["api-key-file", "device-db"]) {
    const source = await readFile(
      new URL(`../lib/${name}.ts`, import.meta.url),
      "utf8",
    );
    const compiled = ts
      .transpileModule(source, {
        compilerOptions: {
          target: ts.ScriptTarget.ES2022,
          module: ts.ModuleKind.ESNext,
        },
      })
      .outputText.replace(/from "\.\/([^\"]+)"/g, 'from "./$1.mjs"');
    await writeFile(path.join(temp, `${name}.mjs`), compiled);
  }
  const {
    APIKeyFileController,
    APIKeyFileError,
    StaleKeyFileOperation,
    parseAPIKeyFile,
    blankAPIKeyFile,
    keyFileMetadata,
    keyFileMetadataKey,
    canAutomaticallyReadKeyFile,
    maxAPIKeyFileBytes,
  } = await import(path.join(temp, "api-key-file.mjs"));
  const { readDevice, writeDevice } = await import(
    path.join(temp, "device-db.mjs")
  );
  const text = (provider = "deepseek", apiKey = syntheticKey) =>
    JSON.stringify({ provider, apiKey });
  const file = (content) => ({
    size: new TextEncoder().encode(content).length,
    text: async () => content,
  });
  const deferred = () => {
    let resolve;
    const promise = new Promise((r) => {
      resolve = r;
    });
    return { promise, resolve };
  };
  function fixture(provider = "deepseek") {
    let contents = text(provider);
    let permission = "granted";
    let writePermission = "granted";
    let failWrite = false;
    let failRequest = false;
    const counts = { query: 0, permission: 0, read: 0, write: 0, abort: 0 };
    const handle = {
      name: "codequest-api-key.json",
      async getFile() {
        counts.read++;
        return file(contents);
      },
      async queryPermission() {
        counts.query++;
        return permission;
      },
      async requestPermission({ mode }) {
        counts.permission++;
        return mode === "readwrite" ? writePermission : "granted";
      },
      async createWritable() {
        let pending;
        return {
          async write(value) {
            counts.write++;
            if (failWrite) throw new Error(syntheticKey);
            pending = value;
          },
          async close() {
            contents = pending;
          },
          async abort() {
            counts.abort++;
          },
        };
      },
    };
    const context = {
      scope,
      lesson: "python-01",
      online: true,
      aiEnabled: true,
    };
    const saved = new Map();
    const requests = [];
    const events = [];
    const responses = [];
    const hooks = {
      context: () => context,
      request: async (action) => {
        events.push(action.action);
        requests.push(action);
        if (failRequest) throw new Error(syntheticKey);
        return {
          draftScope: context.scope,
          keyConnected: action.action === "key",
        };
      },
      saved: (state, message) => responses.push({ state, message }),
      changed: () => {},
      read: async (key) => saved.get(key),
      write: async (key, metadata) => {
        assert.deepEqual(Object.keys(metadata).sort(), [
          "enabled",
          "handle",
          "provider",
        ]);
        assert.ok(!JSON.stringify(metadata).includes(syntheticKey));
        events.push(
          metadata.enabled ? "metadata-enabled" : "metadata-disabled",
        );
        saved.set(key, { ...metadata });
      },
    };
    const controller = new APIKeyFileController(scope, hooks);
    return {
      controller,
      hooks,
      handle,
      context,
      saved,
      requests,
      responses,
      counts,
      events,
      contents: () => contents,
      setContents: (value) => {
        contents = value;
      },
      setPermission: (value) => {
        permission = value;
      },
      setWritePermission: (value) => {
        writePermission = value;
      },
      failWrite: () => {
        failWrite = true;
      },
      failRequest: () => {
        failRequest = true;
      },
    };
  }
  // Parser validation never includes file contents in failures.
  for (const provider of ["deepseek", "openai", "claude"]) {
    const parsed = parseAPIKeyFile(text(provider));
    assert.equal(
      parsed.adapter,
      provider === "claude" ? "anthropic" : provider,
    );
    assert.equal(parseAPIKeyFile(blankAPIKeyFile(provider)).apiKey, "");
  }
  assert.equal(
    parseAPIKeyFile(text("deepseek", "  " + syntheticKey + "  ")).apiKey,
    syntheticKey,
  );
  for (const invalid of [
    "{broken:" + syntheticKey,
    "[]",
    "null",
    text("anthropic"),
    text("deepseek", "short"),
    text("deepseek", "a".repeat(501)),
    text("deepseek", "invalid\nheader"),
    JSON.stringify({
      provider: "deepseek",
      apiKey: syntheticKey,
      other: syntheticKey,
    }),
    " ".repeat(maxAPIKeyFileBytes + 1),
  ]) {
    assert.throws(
      () => parseAPIKeyFile(invalid),
      (error) =>
        error instanceof APIKeyFileError &&
        !error.message.includes(syntheticKey),
    );
  }
  let f = fixture("claude");
  await f.controller.load();
  assert.equal(f.controller.metadata.enabled, false);
  await assert.rejects(f.controller.chooseHandle(f.handle));
  assert.equal(f.counts.read, 0);
  await f.controller.setEnabled(true);
  await f.controller.chooseHandle(f.handle);
  assert.equal(f.requests[0].provider, "anthropic");
  assert.equal(f.requests[0].deviceScope, scope);
  assert.equal(f.counts.permission, 0);
  assert.equal(f.controller.metadata.provider, "claude");
  assert.ok(
    !JSON.stringify(f.saved.get(keyFileMetadataKey(scope))).includes(
      syntheticKey,
    ),
  );
  // Automatic reading is gated, and permission prompts require a manual action.
  for (const field of ["online", "aiEnabled"]) {
    const reads = f.counts.read,
      queries = f.counts.query,
      requests = f.requests.length;
    f.context[field] = false;
    await f.controller.readHandle(false);
    assert.equal(f.counts.query, queries);
    assert.equal(f.counts.read, reads);
    assert.equal(f.requests.length, requests);
    f.context[field] = true;
  }
  f.setPermission("prompt");
  const requests = f.requests.length;
  await f.controller.readHandle(false);
  assert.equal(f.requests.length, requests);
  assert.equal(f.counts.permission, 0);
  assert.match(f.controller.message, /will not prompt at startup/);
  await f.controller.readHandle(true);
  assert.equal(f.counts.permission, 1);
  assert.equal(f.requests.length, requests + 1);
  assert.equal(
    canAutomaticallyReadKeyFile(f.controller.metadata, f.context, "denied"),
    false,
  );
  assert.equal(
    canAutomaticallyReadKeyFile(f.controller.metadata, f.context, "granted"),
    true,
  );
  await f.controller.disableAuto();
  const disabledReads = f.counts.read;
  await f.controller.readHandle(false);
  assert.equal(f.counts.read, disabledReads);
  // An empty file disables automatic reads before it disconnects the server.
  await f.controller.setEnabled(true);
  f.setContents(blankAPIKeyFile("claude"));
  f.events.length = 0;
  await f.controller.readHandle(true);
  assert.equal(f.controller.metadata.enabled, false);
  assert.deepEqual(f.events, ["metadata-disabled", "disconnect"]);
  assert.equal(f.requests.at(-1).action, "disconnect");
  // A chooser fallback reads once and never persists the key or file object.
  f = fixture("openai");
  await f.controller.setEnabled(true);
  await f.controller.readOnce(file(text("openai")));
  assert.equal(f.controller.metadata.handle, null);
  assert.equal(f.controller.metadata.provider, "openai");
  const replacement = await f.controller.clearKey();
  assert.equal(replacement.written, false);
  assert.deepEqual(JSON.parse(replacement.replacement), {
    provider: "openai",
    apiKey: "",
  });
  assert.match(f.controller.message, /original is unchanged/);
  // Supported clearing writes only a blank key while preserving the provider.
  f = fixture("claude");
  await f.controller.setEnabled(true);
  await f.controller.chooseHandle(f.handle);
  f.events.length = 0;
  assert.equal((await f.controller.clearKey()).written, true);
  assert.deepEqual(JSON.parse(f.contents()), {
    provider: "claude",
    apiKey: "",
  });
  assert.equal(f.controller.metadata.enabled, false);
  assert.ok(
    f.events.indexOf("metadata-disabled") < f.events.indexOf("disconnect"),
  );
  // A browser without picker support never edits even a previously saved handle.
  f = fixture("claude");
  await f.controller.setEnabled(true);
  await f.controller.chooseHandle(f.handle);
  const fallbackClear = await f.controller.clearKey(false);
  assert.equal(f.counts.write, 0);
  assert.ok(f.contents().includes(syntheticKey));
  assert.deepEqual(JSON.parse(fallbackClear.replacement), { provider: "claude", apiKey: "" });
  assert.equal(f.requests.at(-1).action, "disconnect");
  // Permission/write failures still disable automatic reads and disconnect.
  for (const failure of ["permission", "write"]) {
    f = fixture();
    await f.controller.setEnabled(true);
    await f.controller.chooseHandle(f.handle);
    if (failure === "permission") f.setWritePermission("denied");
    else f.failWrite();
    assert.equal((await f.controller.clearKey()).written, false);
    assert.equal(f.controller.metadata.enabled, false);
    assert.equal(f.requests.at(-1).action, "disconnect");
    assert.ok(f.contents().includes(syntheticKey));
    assert.ok(!f.controller.message.includes(syntheticKey));
    assert.match(f.controller.message, /could not be changed/);
  }
  f = fixture();
  await f.controller.setEnabled(true);
  await f.controller.chooseHandle(f.handle);
  f.failRequest();
  await assert.rejects(
    f.controller.clearKey(),
    (error) =>
      !error.message.includes(syntheticKey) &&
      /server key could not be disconnected/.test(error.message),
  );
  assert.equal(f.controller.metadata.enabled, false);
  // Reject scope/lesson changes that occur while file content is being read.
  for (const changed of ["scope", "lesson"]) {
    f = fixture();
    await f.controller.setEnabled(true);
    const reading = deferred(),
      started = deferred();
    const operation = f.controller.readOnce({
      size: 100,
      text: async () => {
        started.resolve();
        return reading.promise;
      },
    });
    const rejected = assert.rejects(operation, StaleKeyFileOperation);
    await started.promise;
    f.context[changed] = changed === "scope" ? nextScope : "python-02";
    reading.resolve(text());
    await rejected;
    assert.equal(f.requests.length, 0);
    assert.equal(f.saved.has(keyFileMetadataKey(nextScope)), false);
  }
  // Manual disconnect waits for any already-sent key save, then wins.
  f = fixture();
  await f.controller.setEnabled(true);
  const saving = deferred(),
    sent = deferred();
  f.hooks.request = async (action) => {
    f.requests.push(action);
    sent.resolve();
    await saving.promise;
    return { draftScope: scope };
  };
  const operation = f.controller.readOnce(file(text()));
  const rejected = assert.rejects(operation, StaleKeyFileOperation);
  await sent.promise;
  const disable = f.controller.disableAuto();
  saving.resolve();
  await rejected;
  await disable;
  assert.equal(f.controller.metadata.enabled, false);
  assert.equal(f.responses.length, 0);
  await f.controller.disableAuto(true);
  assert.equal(f.controller.metadata.handle, null);
  // Real IndexedDB metadata stores only permission, handle, provider. The
  // cloneable stand-in models handle identity, not the contents of its file.
  const handleIdentity = {
    kind: "file",
    name: "codequest-api-key.json",
    fixtureId: 1,
  };
  await writeDevice(
    "meta",
    keyFileMetadataKey(scope),
    keyFileMetadata(true, handleIdentity, "openai"),
  );
  const stored = await readDevice("meta", keyFileMetadataKey(scope));
  assert.deepEqual(Object.keys(stored).sort(), [
    "enabled",
    "handle",
    "provider",
  ]);
  assert.ok(!JSON.stringify(stored).includes(syntheticKey));
  assert.equal(
    await readDevice("meta", keyFileMetadataKey(nextScope)),
    undefined,
  );
  console.log(
    "Passed key-file parsing/size, opt-in/automatic gates, permission prompts, empty-key disconnect, file clearing/failure, Safari replacement, account/lesson races, manual-disconnect ordering, and plaintext-free IndexedDB metadata.",
  );
} finally {
  await rm(temp, { recursive: true, force: true });
}
