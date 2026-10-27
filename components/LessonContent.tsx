"use client";
import { useMemo, useState, type ReactNode } from "react";
import { Check, Copy } from "lucide-react";
import { codeTokens, lessonBlocks } from "../lib/lesson-markup";
import { codeLabel } from "../lib/code-language";
import { lessonIdeas } from "../lib/lesson-ideas";
import CodeAnatomy from "./CodeAnatomy";
import { GlossaryScope, GlossaryText } from "./LessonGlossary";
export function InlineCode({ text }: { text: string }) {
  // Tokenize code first so asterisks inside it remain literal source text.
  const parts = text.split(/(`[^`\n]+`|\*\*)/g);
  const content: ReactNode[] = [];
  const renderPart = (part: string, key: number) =>
    part.startsWith("`") && part.endsWith("`") && part.length > 2 ? (
      <code className="inline-code" key={key}>
        {part.slice(1, -1)}
      </code>
    ) : (
      <GlossaryText text={part} key={key} />
    );
  for (let i = 0; i < parts.length; i++) {
    if (parts[i] === "**") {
      const end = parts.indexOf("**", i + 1);
      const inner = end > i ? parts.slice(i + 1, end) : [];
      if (inner.length && inner.join("").trim()) {
        content.push(
          <strong key={i}>
            {inner.map((part, offset) => renderPart(part, i + 1 + offset))}
          </strong>,
        );
        i = end;
        continue;
      }
    }
    content.push(renderPart(parts[i], i));
  }
  return <>{content}</>;
}
export function CodeExample({
  code,
  language,
  explain = false,
}: {
  code: string;
  language: string;
  explain?: boolean;
}) {
  return (
    <CodeExampleContent
      key={JSON.stringify([language, code])}
      code={code}
      language={language}
      explain={explain}
    />
  );
}
function CodeExampleContent({
  code,
  language,
  explain,
}: {
  code: string;
  language: string;
  explain: boolean;
}) {
  const tokens = useMemo(() => codeTokens(code, language), [code, language]);
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);
  const isOutput = language === "text" || language === "output";
  const source = (
    <figure className="code-example">
      <figcaption>
        <span>{codeLabel(language)}</span>
        {!isOutput && (
          <button
            type="button"
            className="text-button"
            aria-label={copied ? "Copied example code" : "Copy example code"}
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(code);
                setCopied(true);
                setCopyError(false);
              } catch {
                setCopyError(true);
              }
            }}
          >
            {copied ? <Check size={15} /> : <Copy size={15} />}{" "}
            {copied ? "Copied" : "Copy"}
          </button>
        )}
      </figcaption>
      <pre
        tabIndex={0}
        aria-label={`${codeLabel(language)} ${isOutput ? "result" : "code example"}`}
      >
        <code>
          {tokens.map((token, i) =>
            token.className ? (
              <span key={i} className={token.className}>
                {token.text}
              </span>
            ) : (
              token.text
            ),
          )}
        </code>
      </pre>
      <small className="sr-only" role="status">
        {copied ? "Example code copied." : ""}
      </small>
      {copyError && <small role="status">Select the code to copy it.</small>}
    </figure>
  );
  return explain && !isOutput ? (
    <div className="explained-code-example">
      <CodeAnatomy code={code} language={language} />
      <details className="example-source">
        <summary>Full code &amp; copy</summary>
        {source}
      </details>
    </div>
  ) : (
    source
  );
}

function InlineCodeExamples({
  text,
  runtime,
}: {
  text: string;
  runtime: string;
}) {
  const snippets = useMemo(
    () =>
      [
        ...new Set(
          Array.from(text.matchAll(/`([^`\n]+)`/g), (match) => match[1]),
        ),
      ].filter((value) => /\w\s*\(|[A-Za-z_]\w*\s*=(?!=)|^["']/.test(value)),
    [text],
  );
  const [selected, setSelected] = useState(0);
  if (!snippets.length) return null;
  const index = Math.min(selected, snippets.length - 1);
  return (
    <div className="inline-code-examples">
      {snippets.length > 1 && (
        <label className="inline-example-picker">
          Example
          <select
            aria-label="Choose an example to break down"
            value={index}
            onChange={(event) => setSelected(Number(event.target.value))}
          >
            {snippets.map((snippet, i) => (
              <option key={i} value={i}>
                {i + 1}. {snippet}
              </option>
            ))}
          </select>
        </label>
      )}
      <CodeAnatomy code={snippets[index]} language={runtime} />
    </div>
  );
}
export default function LessonContent({
  text,
  runtime,
  as: Tag = "p",
  className = "",
  bulletPoints = false,
  glossary = false,
}: {
  text: string;
  runtime: string;
  as?: "p" | "h3" | "h4";
  className?: string;
  bulletPoints?: boolean;
  glossary?: boolean;
}) {
  const blocks = useMemo(() => lessonBlocks(text, runtime), [text, runtime]);
  const content = (
    <div className={"lesson-content " + className}>
      {blocks.map((block, i) =>
        block.kind === "code" ? (
          <CodeExample
            key={`${i}:${block.code}`}
            code={block.code}
            language={block.language}
            explain={bulletPoints}
          />
        ) : (
          block.text
            .trim()
            .split(/\n\s*\n/)
            .map((paragraph, j) => {
              if (!bulletPoints || Tag !== "p")
                return (
                  <Tag key={`${i}:${j}`}>
                    <InlineCode text={paragraph.trim()} />
                  </Tag>
                );
              const ideas = lessonIdeas(paragraph);
              return (
                <div
                  key={`${i}:${j}`}
                  className={bulletPoints ? "reading-ideas" : undefined}
                >
                  <Tag>
                    <InlineCode text={ideas[0] ?? ""} />
                  </Tag>
                  {ideas.length > 1 && (
                    <ul className="idea-bullets">
                      {ideas.slice(1).map((idea, k) => (
                        <li key={k}>
                          <InlineCode text={idea} />
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })
        ),
      )}
      {bulletPoints && !blocks.some((block) => block.kind === "code") && (
        <InlineCodeExamples key={text} text={text} runtime={runtime} />
      )}
    </div>
  );
  return glossary ? <GlossaryScope text={text} runtime={runtime}>{content}</GlossaryScope> : content;
}
