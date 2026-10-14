"use client";
import { useEffect, useId, useRef } from "react";
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
  HighlightStyle,
  indentOnInput,
  bracketMatching,
} from "@codemirror/language";
import { tags } from "@lezer/highlight";
import { codeLanguage } from "../lib/code-language";
import type { Runtime } from "../lib/types";
const charcoalHighlight = HighlightStyle.define([
  { tag: [tags.keyword, tags.bool, tags.operator], color: "#c6a1ff" },
  { tag: [tags.string, tags.regexp], color: "#9ed8ae" },
  { tag: [tags.number, tags.literal], color: "#ffc39d" },
  { tag: tags.comment, color: "#a9b4c2", fontStyle: "italic" },
  {
    tag: [tags.typeName, tags.propertyName, tags.attributeName, tags.tagName],
    color: "#99c8ff",
  },
]);
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
  const keyboardHelpId = useId();
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
          syntaxHighlighting(charcoalHighlight),
          lang,
          keymap.of([...defaultKeymap, ...historyKeymap, indentWithTab]),
          EditorView.contentAttributes.of({
            "aria-label": "Project code editor",
            "aria-describedby": keyboardHelpId,
            spellcheck: "false",
          }),
          EditorView.updateListener.of((u) => {
            if (u.docChanged) change.current(u.state.doc.toString());
          }),
          EditorView.theme(
            {
              "&": {
                minHeight: "320px",
                fontSize: "15px",
                backgroundColor: "var(--editor)",
              },
              ".cm-content": {
                fontFamily: "ui-monospace, SFMono-Regular, Consolas, monospace",
                padding: "18px 8px",
                caretColor: "var(--text)",
              },
              ".cm-cursor, .cm-dropCursor": { borderLeftColor: "var(--text)" },
              ".cm-selectionBackground, &.cm-focused .cm-selectionBackground": {
                backgroundColor: "#7050cf66",
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
              "&.cm-focused": {
                outline: "2px solid var(--accent)",
                outlineOffset: "-2px",
              },
            },
            { dark: true },
          ),
        ],
      }),
    });
    editor.current = view;
    return () => {
      view.destroy();
      editor.current = null;
    }; // The document is synchronized separately; edits must not recreate the editor and clear undo.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unitId, runtime, keyboardHelpId]);
  useEffect(() => {
    const v = editor.current;
    if (v && v.state.doc.toString() !== code)
      v.dispatch({
        changes: { from: 0, to: v.state.doc.length, insert: code },
      });
  }, [code]);
  return (
    <>
      <div ref={mount} className="code-editor" />
      <p id={keyboardHelpId} className="editor-keyboard-help muted">
        Tab indents code (moves it to the right). To leave the editor, press
        Escape, then Tab. Ctrl + Z (Command + Z on Mac) undoes an edit.
      </p>
    </>
  );
}
