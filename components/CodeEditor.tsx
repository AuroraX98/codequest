"use client";
import { useEffect, useRef } from "react";
import {
  EditorView,
  keymap,
  lineNumbers,
  highlightActiveLine,
  drawSelection,
} from "@codemirror/view";
import { EditorState } from "@codemirror/state";
import {
  defaultKeymap,
  history,
  historyKeymap,
  indentWithTab,
} from "@codemirror/commands";
import {
  syntaxHighlighting,
  defaultHighlightStyle,
  indentOnInput,
  bracketMatching,
} from "@codemirror/language";
import { codeLanguage } from "../lib/code-language";
import type { Runtime } from "../lib/types";
export default function CodeEditor({
  code,
  onChange,
  runtime,
  unitId,
}: {
  code: string;
  onChange: (s: string) => void;
  runtime: Runtime;
  unitId: string;
}) {
  const mount = useRef<HTMLDivElement>(null);
  const editor = useRef<EditorView | null>(null);
  const change = useRef(onChange);
  useEffect(() => {
    change.current = onChange;
  }, [onChange]);
  useEffect(() => {
    if (!mount.current) return;
    const lang = codeLanguage(runtime) ?? [];
    const view = new EditorView({
      parent: mount.current,
      state: EditorState.create({
        doc: code,
        extensions: [
          lineNumbers(),
          history(),
          drawSelection(),
          highlightActiveLine(),
          indentOnInput(),
          bracketMatching(),
          syntaxHighlighting(defaultHighlightStyle),
          lang,
          keymap.of([...defaultKeymap, ...historyKeymap, indentWithTab]),
          EditorView.contentAttributes.of({
            "aria-label": "Project code editor",
            spellcheck: "false",
          }),
          EditorView.updateListener.of((u) => {
            if (u.docChanged) change.current(u.state.doc.toString());
          }),
          EditorView.theme({
            "&": {
              minHeight: "320px",
              fontSize: "15px",
              backgroundColor: "var(--editor)",
            },
            ".cm-content": {
              fontFamily: "ui-monospace, SFMono-Regular, Consolas, monospace",
              padding: "18px 8px",
            },
            ".cm-gutters": {
              backgroundColor: "transparent",
              border: "none",
              color: "var(--muted)",
              paddingLeft: "8px",
            },
            ".cm-activeLine": { backgroundColor: "var(--soft)" },
            ".cm-activeLineGutter": { backgroundColor: "transparent" },
            ".cm-scroller": { overflow: "auto" },
            "&.cm-focused": { outline: "none" },
          }),
        ],
      }),
    });
    editor.current = view;
    return () => {
      view.destroy();
      editor.current = null;
    }; // The document is synchronized separately; edits must not recreate the editor and clear undo.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unitId, runtime]);
  useEffect(() => {
    const v = editor.current;
    if (v && v.state.doc.toString() !== code)
      v.dispatch({
        changes: { from: 0, to: v.state.doc.length, insert: code },
      });
  }, [code]);
  return <div ref={mount} className="code-editor" />;
}
