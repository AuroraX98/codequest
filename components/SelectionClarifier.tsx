"use client";
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type RefObject,
} from "react";
import { createPortal } from "react-dom";
import { Sparkles, X } from "lucide-react";
import {
  maxSelectedPassage,
  selectedLessonPassage,
} from "../lib/lesson-selection";

type Passage = { text: string; left: number; top: number; bottom: number };
export default function SelectionClarifier({
  root,
  context,
  online,
  enabled,
  connected,
  busy,
  provider,
  dark,
  onExplain,
  onSettings,
}: {
  root: RefObject<HTMLElement | null>;
  context: string;
  online: boolean;
  enabled: boolean;
  connected: boolean;
  busy: boolean;
  provider: string;
  dark: boolean;
  onExplain: (text: string) => void;
  onSettings: () => void;
}) {
  const [passage, setPassage] = useState<Passage | null>(null);
  const [position, setPosition] = useState({ left: 12, top: 12 });
  const popup = useRef<HTMLDivElement>(null);
  const interacting = useRef(false);
  const dismissed = useRef("");
  const dismiss = () => {
    dismissed.current = passage?.text ?? "";
    setPassage(null);
  };
  useEffect(() => {
    setPassage(null);
    dismissed.current = "";
    interacting.current = false;
    let frame = 0;
    const read = () => {
      if (
        interacting.current ||
        popup.current?.contains(document.activeElement)
      )
        return;
      const selected =
        root.current &&
        selectedLessonPassage(root.current, window.getSelection());
      if (!selected || selected.text === dismissed.current) {
        setPassage(null);
        return;
      }
      const rect = selected.range.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > window.innerHeight) {
        setPassage(null);
        return;
      }
      setPassage({
        text: selected.text,
        left: rect.left,
        top: rect.top,
        bottom: rect.bottom,
      });
    };
    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(read);
    };
    const down = (event: PointerEvent) => {
      if (popup.current?.contains(event.target as Node)) {
        interacting.current = true;
        return;
      }
      interacting.current = false;
      dismissed.current = "";
      setPassage(null);
    };
    const up = (event: PointerEvent) => {
      interacting.current = false;
      if (!popup.current?.contains(event.target as Node)) schedule();
    };
    const key = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        const focusedInPopup = popup.current?.contains(document.activeElement);
        dismissed.current = window.getSelection()?.toString() ?? "";
        setPassage(null);
        if (focusedInPopup) root.current?.focus({ preventScroll: true });
      } else schedule();
    };
    const shortcut = (event: KeyboardEvent) => {
      if (event.altKey && event.key === "Enter" && popup.current) {
        event.preventDefault();
        const action = popup.current.querySelector<HTMLButtonElement>(
          "[data-explain]:not(:disabled), [data-settings]",
        );
        (
          action ?? popup.current.querySelector<HTMLButtonElement>("button")
        )?.focus();
      }
    };
    const hide = (event: Event) => {
      if (event.target instanceof Node && popup.current?.contains(event.target))
        return;
      dismissed.current = window.getSelection()?.toString() ?? "";
      setPassage(null);
    };
    document.addEventListener("selectionchange", schedule);
    document.addEventListener("pointerdown", down);
    document.addEventListener("pointerup", up);
    document.addEventListener("pointercancel", up);
    document.addEventListener("keyup", key);
    document.addEventListener("keydown", shortcut);
    window.addEventListener("scroll", hide, true);
    window.addEventListener("resize", hide);
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("selectionchange", schedule);
      document.removeEventListener("pointerdown", down);
      document.removeEventListener("pointerup", up);
      document.removeEventListener("pointercancel", up);
      document.removeEventListener("keyup", key);
      document.removeEventListener("keydown", shortcut);
      window.removeEventListener("scroll", hide, true);
      window.removeEventListener("resize", hide);
    };
  }, [context, root]);
  useLayoutEffect(() => {
    if (!passage || !popup.current) return;
    const box = popup.current.getBoundingClientRect();
    const top =
      passage.bottom + 8 + box.height <= window.innerHeight - 12
        ? passage.bottom + 8
        : passage.top - box.height - 8;
    setPosition({
      left: Math.max(
        12,
        Math.min(passage.left, window.innerWidth - box.width - 12),
      ),
      top: Math.max(12, Math.min(top, window.innerHeight - box.height - 12)),
    });
  }, [passage, online, enabled, connected]);
  if (!passage) return null;
  const tooLong = passage.text.length > maxSelectedPassage;
  const reason = tooLong
    ? "Select a shorter passage (up to 2,000 characters)."
    : !enabled
      ? "AI assistance is off. You can enable it in Settings."
      : !online
        ? "Reconnect to ask your AI assistant."
        : !connected
          ? "Connect your AI assistant in Settings first."
          : "";
  return createPortal(
    <div
      ref={popup}
      className={`selection-popover${dark ? " dark" : ""}`}
      role="group"
      aria-label="Clarify selected passage"
      style={position}
    >
      <div className="selection-popover-heading">
        <b>
          <Sparkles size={16} /> Ask {connected ? provider : "your assistant"}
        </b>
        <button
          type="button"
          className="text-button"
          aria-label="Dismiss clarification"
          onClick={dismiss}
        >
          <X size={16} />
        </button>
      </div>
      <blockquote>{passage.text}</blockquote>
      {reason && <p role="status">{reason}</p>}
      <div className="button-row">
        <button
          data-explain
          type="button"
          className="primary"
          disabled={!!reason || busy}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => {
            const text = passage.text;
            dismiss();
            onExplain(text);
          }}
        >
          {busy ? "Assistant is answering…" : "Explain this"}
        </button>
        {!tooLong && online && (!enabled || !connected) && (
          <button
            data-settings
            type="button"
            className="text-button"
            onClick={() => {
              dismiss();
              onSettings();
            }}
          >
            Open AI settings
          </button>
        )}
      </div>
      <p className="selection-shortcut">Alt + Enter focuses the action.</p>
    </div>,
    document.body,
  );
}
