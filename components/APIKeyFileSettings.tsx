"use client";
import {
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  type Ref,
} from "react";
import { Download, FileKey, FolderOpen } from "lucide-react";
import {
  APIKeyFileController,
  APIKeyFileError,
  StaleKeyFileOperation,
  blankAPIKeyFile,
  type KeyFileHandle,
} from "../lib/api-key-file";
import type { Action } from "../lib/learning-client";
import type { QuestState } from "../lib/types";

export type APIKeyFileSettingsHandle = { disableAuto(): Promise<void> };
type Props = {
  ref?: Ref<APIKeyFileSettingsHandle>;
  state: QuestState;
  lesson: string;
  online: boolean;
  visible: boolean;
  request: (action: Action) => Promise<QuestState>;
  onSaved: (state: QuestState, message: string) => void;
};
type PickerWindow = Window & {
  showOpenFilePicker?: (options: {
    multiple: boolean;
    types: { description: string; accept: Record<string, string[]> }[];
  }) => Promise<KeyFileHandle[]>;
};
function downloadBlank(text: string) {
  const url = URL.createObjectURL(
    new Blob([text], { type: "application/json" }),
  );
  const link = document.createElement("a");
  link.href = url;
  link.download = "codequest-api-key.json";
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
export default function APIKeyFileSettings(props: Props) {
  const latest = useRef(props);
  latest.current = props;
  const [, render] = useState(0);
  const [error, setError] = useState("");
  const [fallbackName, setFallbackName] = useState("");
  const [supported, setSupported] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);
  const pendingChooser = useRef<{ scope: string; lesson: string } | null>(null);
  const autoEdge = useRef(false);
  const controller = useMemo(
    () =>
      new APIKeyFileController(props.state.draftScope, {
        context: () => ({
          scope: latest.current.state.draftScope,
          lesson: latest.current.lesson,
          online: latest.current.online,
          aiEnabled: latest.current.state.profile.aiEnabled,
        }),
        request: (action) => latest.current.request(action),
        saved: (state, message) => latest.current.onSaved(state, message),
        changed: () => render((n) => n + 1),
      }),
    [props.state.draftScope],
  );
  const report = (failure: unknown) => {
    if (failure instanceof StaleKeyFileOperation) return;
    setError(
      failure instanceof APIKeyFileError
        ? failure.message
        : "The file action could not finish. Check your connection and file access, then try again.",
    );
  };
  useImperativeHandle(
    props.ref,
    () => ({ disableAuto: () => controller.disableAuto() }),
    [controller],
  );
  useEffect(() => {
    controller.activate();
    setSupported(
      typeof (window as PickerWindow).showOpenFilePicker === "function",
    );
    setFallbackName("");
    setError("");
    autoEdge.current = false;
    void controller.load().catch(report);
    return () => controller.dispose();
  }, [controller]);
  const metadata = controller.metadata;
  useEffect(() => {
    const allowed =
      supported &&
      controller.loaded &&
      metadata.enabled &&
      !!metadata.handle &&
      props.online &&
      props.state.profile.aiEnabled;
    if (!allowed) {
      autoEdge.current = false;
      return;
    }
    if (autoEdge.current) return;
    autoEdge.current = true;
    // A file chosen/read by a button already has a request in progress.
    if (!controller.busy) void controller.readHandle(false).catch(report);
  }, [
    controller,
    controller.loaded,
    metadata.enabled,
    metadata.handle,
    props.online,
    props.state.profile.aiEnabled,
    supported,
  ]);
  if (!props.visible) return null;
  const enabled = metadata.enabled;
  const busy = controller.busy;
  const canRead =
    enabled && props.online && props.state.profile.aiEnabled && !busy;
  const fileName = metadata.handle?.name || fallbackName;
  return (
    <section
      className="panel ai-connection-panel"
      aria-label="API key file settings"
    >
      <h3>
        <FileKey size={21} /> API key file (optional)
      </h3>
      <p>
        Keep your provider and key in a JSON file on your device. Reading it
        connects that assistant to your signed-in CodeQuest account.
      </p>
      <p className="muted">
        This local file contains your key as plain text. Keep it private and out
        of GitHub. CodeQuest saves a read key encrypted on the server; file
        contents and keys stay out of learning backups and offline downloads.
      </p>
      <label className="setting-row">
        <span>
          <b>Allow this device to read my API key file</b>
          <small>
            Off by default. This choice belongs to this account and browser.
          </small>
        </span>
        <input
          type="checkbox"
          checked={enabled}
          disabled={!controller.loaded || busy}
          onChange={(event) => {
            setError("");
            void controller.setEnabled(event.target.checked).catch(report);
          }}
        />
      </label>
      <p className="muted">
        Use <code>provider</code>: <code>deepseek</code>, <code>openai</code>,
        or <code>claude</code>, and <code>apiKey</code>: your key. An empty{" "}
        <code>apiKey</code> disconnects the assistant when you read the file.
      </p>
      <div className="button-row">
        <button
          className="secondary"
          onClick={() => downloadBlank(blankAPIKeyFile(metadata.provider))}
        >
          <Download size={16} /> Download blank template
        </button>
        <button
          className="secondary"
          disabled={!canRead}
          onClick={async () => {
            setError("");
            if (!supported) {
              pendingChooser.current = {
                scope: props.state.draftScope,
                lesson: props.lesson,
              };
              fileInput.current?.click();
              return;
            }
            const selected = controller;
            try {
              const handles = await (window as PickerWindow)
                .showOpenFilePicker!({
                multiple: false,
                types: [
                  {
                    description: "API key JSON file",
                    accept: { "application/json": [".json"] },
                  },
                ],
              });
              if (
                latest.current.state.draftScope !== selected.scope ||
                latest.current.lesson !== props.lesson
              )
                return;
              if (handles[0]) await selected.chooseHandle(handles[0]);
            } catch (failure) {
              const name = (failure as { name?: string }).name;
              if (
                ["NotSupportedError", "TypeError", "SecurityError"].includes(
                  name ?? "",
                )
              ) {
                setSupported(false);
                setError(
                  "This browser could not open a reusable file handle. Press Choose JSON file again to read a file once; the original will not be edited automatically.",
                );
              } else if (name !== "AbortError") report(failure);
            }
          }}
        >
          <FolderOpen size={16} /> Choose JSON file
        </button>
        {supported && (
          <button
            className="secondary"
            disabled={!canRead || !metadata.handle}
            onClick={() => {
              setError("");
              void controller.readHandle(true).catch(report);
            }}
          >
            Read file again
          </button>
        )}
      </div>
      <input
        ref={fileInput}
        type="file"
        accept=".json,application/json"
        className="sr-only"
        aria-label="Choose an API key JSON file"
        onChange={(event) => {
          const file = event.target.files?.[0];
          event.target.value = "";
          if (!file) return;
          const chosenFor = pendingChooser.current;
          pendingChooser.current = null;
          if (
            !chosenFor ||
            chosenFor.scope !== props.state.draftScope ||
            chosenFor.lesson !== props.lesson
          )
            return;
          setFallbackName(file.name);
          setError("");
          void controller.readOnce(file).catch(report);
        }}
      />
      <p>
        <b>{fileName ? `Selected file: ${fileName}` : "No file selected."}</b>
      </p>
      <p role="status">
        {error || (busy ? "Working with your key file…" : controller.message)}
      </p>
      <p className="muted">
        {supported
          ? "With file access enabled, CodeQuest reads the saved file once when you open the app or reconnect, while AI is on and you are online. It reads only if permission is already granted. If permission is needed, press Read file again. Changes to the file are not watched continuously."
          : "This browser, including Safari, can read a file once after you choose it. It cannot automatically reread or edit the original. Choose JSON file again after making changes. Clearing here downloads a blank replacement; your original stays unchanged until you replace it."}
      </p>
      {!props.online && (
        <p className="muted">
          Connect to the internet to read or disconnect a key. Lessons still
          work offline.
        </p>
      )}
      {!props.state.profile.aiEnabled && (
        <p className="muted">
          Turn on AI assistance to read a file. You can still clear and
          disconnect your key.
        </p>
      )}
      <div className="button-row">
        <button
          className="secondary"
          disabled={
            !props.online ||
            busy ||
            (!metadata.handle && !fallbackName && !props.state.keyConnected)
          }
          onClick={async () => {
            const confirmed = window.confirm(
              supported && metadata.handle
                ? "Clear apiKey in the original JSON file and disconnect this assistant? The provider stays in the file. Automatic file reading will turn off."
                : "Disconnect this assistant and download a blank replacement? Your original file will stay unchanged until you replace it. Automatic file reading will turn off.",
            );
            if (!confirmed) return;
            setError("");
            try {
              const result = await controller.clearKey(supported);
              if (result.replacement) downloadBlank(result.replacement);
            } catch (failure) {
              report(failure);
            }
          }}
        >
          Clear key and disconnect
        </button>
        <button
          className="text-button"
          disabled={busy || (!enabled && !fileName)}
          onClick={() => {
            setError("");
            setFallbackName("");
            void controller.disableAuto(true).catch(report);
          }}
        >
          Forget file
        </button>
      </div>
      <p className="muted">
        Turning file access off or forgetting a file stops future reads. It does
        not remove the encrypted server key. Disconnect assistant removes that
        saved key; revoking it at the provider stops it from working everywhere.
      </p>
    </section>
  );
}
