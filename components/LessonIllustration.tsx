import { memo } from "react";
import {
  Atom, Blocks, Boxes, Braces, ChartColumn, CircuitBoard, Code2, Coffee,
  Cog, Database, FileCode, Gem, GitBranch, Network, Palette, PanelsTopLeft,
  Server, Smartphone, Terminal, Workflow, type LucideIcon,
} from "lucide-react";
import { codeTokens, lessonBlocks } from "../lib/lesson-markup";
import type { Lesson } from "../lib/types";
import styles from "./LessonIllustration.module.css";

type CourseKey = { label: string; icon: LucideIcon };
const courseKeys: Record<string, CourseKey> = {
  html: { label: "</>", icon: PanelsTopLeft },
  css: { label: "{}", icon: Palette },
  javascript: { label: "JS", icon: Braces },
  python: { label: "Py", icon: Terminal },
  sql: { label: "SQL", icon: Database },
  swift: { label: "Sw", icon: Smartphone },
  typescript: { label: "TS", icon: Braces },
  react: { label: "JSX", icon: Atom },
  backend: { label: "API", icon: Network },
  "developer-toolkit": { label: ">_", icon: GitBranch },
  ai: { label: "AI", icon: CircuitBoard },
  csharp: { label: "C#", icon: Blocks },
  cpp: { label: "C++", icon: Boxes },
  java: { label: "J", icon: Coffee },
  c: { label: "C", icon: FileCode },
  kotlin: { label: "Kt", icon: Smartphone },
  go: { label: "Go", icon: Workflow },
  rust: { label: "Rs", icon: Cog },
  php: { label: "PHP", icon: Server },
  ruby: { label: "Rb", icon: Gem },
  r: { label: "R", icon: ChartColumn },
};

// Keep the whole authored example or one explicitly marked term. Cutting an
// arbitrary line from a longer example can change its meaning.
function displayExample(text: string, track: string) {
  const blocks = lessonBlocks(text, track);
  for (const block of blocks) {
    if (block.kind !== "code" || /^(text|output|plaintext|console)$/i.test(block.language)) continue;
    const code = block.code.trimEnd();
    const lines = code.split(/\r?\n/);
    if (code && lines.length <= 2 && lines.every(line => line.length <= 18 && !line.includes("\t"))) {
      return { code, language: block.language };
    }
  }
  for (const block of blocks) {
    if (block.kind !== "prose") continue;
    for (const match of block.text.matchAll(/`([^`\n]+)`/g)) {
      const code = match[1];
      if (code.length >= 2 && code.length <= 18 && /[\p{L}_]/u.test(code) && !code.includes("\t")) {
        return { code, language: track };
      }
    }
  }
  return undefined;
}

type Props = {
  lesson: Lesson;
  track: string;
  paragraph?: number;
  showExample?: boolean;
};

export default memo(function LessonIllustration({ lesson, track, paragraph = 0, showExample = true }: Props) {
  const { label, icon: Icon } = courseKeys[track] ?? { label: "<>", icon: Code2 };
  const key = lesson.id === "python-93" ? "#" : label;
  const example = showExample ? displayExample(lesson.explanation[paragraph] ?? "", track) : undefined;
  return (
    <figure className="lesson-instrument" aria-hidden="true">
      <div className="lesson-display">
        <div className="lesson-display-edge"><i /><i /><i /></div>
        {example ? (
          <pre><code>{codeTokens(example.code, example.language).map((token, index) =>
            <span key={index} className={token.className}>{token.text}</span>
          )}</code></pre>
        ) : (
          <div className={styles.emblem}>
            <Icon size={29} strokeWidth={1.5} />
            <span className={styles.lines}><i /><i /><i /></span>
          </div>
        )}
      </div>
      <span className="lesson-keycap"><span className={key.length > 1 ? styles.letters : undefined}>{key}</span></span>
    </figure>
  );
});
