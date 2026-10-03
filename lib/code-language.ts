import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";
import { sql } from "@codemirror/lang-sql";
// Use the same language parsers for lesson examples and the editable project.
export function codeLanguage(language: string) {
  switch (language.toLowerCase()) {
    case "python":
    case "py":
      return python();
    case "html":
      return html();
    case "css":
      return css();
    case "sql":
      return sql();
    case "javascript":
    case "js":
      return javascript();
    case "typescript":
    case "ts":
      return javascript({ typescript: true });
    case "react":
    case "jsx":
      return javascript({ jsx: true });
    case "tsx":
      return javascript({ jsx: true, typescript: true });
    default:
      return null;
  }
}
export function codeLabel(language: string) {
  const labels: Record<string, string> = {
    python: "Python",
    py: "Python",
    javascript: "JavaScript",
    js: "JavaScript",
    typescript: "TypeScript",
    ts: "TypeScript",
    react: "React · JSX",
    jsx: "React · JSX",
    tsx: "React · TypeScript",
    html: "HTML",
    css: "CSS",
    sql: "SQL",
    swift: "Swift",
    bash: "Terminal",
    sh: "Terminal",
    shell: "Terminal",
    json: "JSON",
    text: "Text",
    output: "Output",
  };
  return labels[language.toLowerCase()] ?? "Code";
}
