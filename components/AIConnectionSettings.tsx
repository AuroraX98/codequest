"use client";
import { useState } from "react";
import { ArrowRight, Check, Sparkles } from "lucide-react";
import { providers, providerIds, type AIProvider } from "../lib/ai-providers";
import type { QuestState } from "../lib/types";
import type { Action } from "../lib/learning-client";
export default function AIConnectionSettings({
  state,
  online,
  request,
  onSaved,
  onError,
  beforeConnectionChange,
  localMode = false,
}: {
  localMode?: boolean;
  state: QuestState;
  online: boolean;
  request: (action: Action) => Promise<QuestState>;
  onSaved: (state: QuestState, message: string) => void;
  onError: (message: string) => void;
  beforeConnectionChange?: () => Promise<void>;
}) {
  const current = state.keyConnected ? (state.aiProvider ?? "deepseek") : null;
  const [changing, setChanging] = useState(false);
  const [selection, setSelection] = useState<AIProvider | null>(null);
  const [key, setKey] = useState("");
  const [busy, setBusy] = useState(false);
  const close = () => {
    setKey("");
    setSelection(null);
    setChanging(false);
  };
  return (
    <section className="panel ai-connection-panel">
      <h3>
        <Sparkles size={21} /> Your AI assistant
      </h3>
      <p>
        Explain a term, get a small hint, break down a step, or review your
        code.
      </p>
      {current && (
        <div className="active-assistant" aria-live="polite">
          <span className="connection connected">
            <Check size={16} /> {providers[current].choice} connected
          </span>
          <p>
            <b>{providers[current].modelName}</b> · Key saved. Ask a question to
            test it.
          </p>
          {!changing && (
            <div className="button-row">
              <button
                className="secondary"
                disabled={!online || busy}
                onClick={() => {
                  close();
                  setChanging(true);
                }}
              >
                Change provider
              </button>
              <button
                className="text-button"
                disabled={!online || busy}
                onClick={async () => {
                  setBusy(true);
                  try {
                    await beforeConnectionChange?.();
                    onSaved(
                      await request({ action: "disconnect" }),
                      "Your AI assistant is disconnected. You can keep learning.",
                    );
                    close();
                  } catch (e) {
                    onError((e as Error).message);
                  } finally {
                    setBusy(false);
                  }
                }}
              >
                Disconnect assistant
              </button>
            </div>
          )}
        </div>
      )}
      {(!current || changing) && (
        <div className="provider-setup">
          <p>
            {changing
              ? "Choose a replacement. Your current assistant stays connected until you save the new key."
              : "Choose the assistant you use."}
          </p>
          <div
            className="provider-choices"
            role="group"
            aria-label="AI providers"
          >
            {providerIds.map((id) => (
              <button
                key={id}
                className={
                  "provider-choice " + (selection === id ? "selected" : "")
                }
                aria-pressed={selection === id}
                disabled={!online || busy}
                onClick={() => {
                  setSelection(id);
                  setKey("");
                }}
              >
                <span className="provider-symbol">
                  {id === "deepseek" ? "D" : id === "openai" ? "O" : "C"}
                </span>
                <span>
                  <b>{providers[id].choice}</b>
                  <small>{providers[id].modelName}</small>
                </span>
                {selection === id ? (
                  <Check size={18} />
                ) : (
                  <ArrowRight size={18} />
                )}
              </button>
            ))}
          </div>
          {selection && (
            <form
              onSubmit={async (event) => {
                event.preventDefault();
                if (busy || !online) return;
                setBusy(true);
                try {
                  await beforeConnectionChange?.();
                  const next = await request({
                    action: "key",
                    provider: selection,
                    key: key.trim(),
                  });
                  onSaved(
                    next,
                    `${providers[selection].name} is connected. Ask a question to test your key.`,
                  );
                  close();
                } catch (e) {
                  onError((e as Error).message);
                } finally {
                  setBusy(false);
                }
              }}
            >
              <label htmlFor="ai-provider-key">
                {providers[selection].name} API key
              </label>
              <input
                id="ai-provider-key"
                type="password"
                value={key}
                onChange={(e) => setKey(e.target.value)}
                autoComplete="off"
                spellCheck={false}
                maxLength={500}
                placeholder="Paste your API key here"
              />
              <div className="button-row">
                <button
                  className="primary"
                  disabled={key.trim().length < 10 || !online || busy}
                >
                  {busy ? "Saving…" : `Connect ${providers[selection].name}`}
                </button>
                <a
                  href={providers[selection].keyUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-button"
                >
                  Get {selection === "openai" ? "an" : "a"}{" "}
                  {providers[selection].name} API key <ArrowRight size={15} />
                </a>
              </div>
            </form>
          )}
          {(changing || selection) && (
            <button className="text-button" disabled={busy} onClick={close}>
              Cancel
            </button>
          )}
          <p className="muted">
            Use a key from your provider’s developer account. API usage is
            billed separately from ChatGPT or Claude subscriptions.
          </p>
        </div>
      )}
      {!online && (
        <p className="muted">
          Connect or change an assistant when you’re online. Lessons and saved
          projects still work offline.
        </p>
      )}
      <p className="muted">
        {localMode
          ? "Your key is encrypted in the local database on this computer"
          : "Your key is encrypted on the server"}{" "}
        and excluded from offline storage and downloads. When you ask, your
        question, current code, lesson notes, and recent chat go to{" "}
        {current ? providers[current].name : "your chosen provider"}.
      </p>
      <p className="muted">
        Tutor requests are unlimited in CodeQuest. Your provider’s API charges
        and limits still apply.
      </p>
    </section>
  );
}
