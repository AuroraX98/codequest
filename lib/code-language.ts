import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";
import { sql, SQLDialect, SQLite } from "@codemirror/lang-sql";
// The runner uses SQLite. Include its window and write-result words, which
// the installed parser's older keyword list omits.
const courseSQLite = SQLDialect.define({
  ...SQLite.spec,
  keywords: SQLite.spec.keywords + " over partition range unbounded preceding following filter returning strict window exclude groups ties generated always materialized",
});
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
      return sql({ dialect: courseSQLite });
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
    "csharp": "C#",
    "cpp": "C++",
    "java": "Java",
    "c": "C",
    "kotlin": "Kotlin",
    "go": "Go",
    "rust": "Rust",
    "php": "PHP",
    "ruby": "Ruby",
    "r": "R",

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
    vtt: "WebVTT captions",
    webvtt: "WebVTT captions",
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
