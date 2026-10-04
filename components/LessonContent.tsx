"use client";
import { useMemo, useState, type ReactNode } from "react";
import { Check, Copy } from "lucide-react";
import { codeTokens, lessonBlocks } from "../lib/lesson-markup";
import { codeLabel } from "../lib/code-language";
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
      part
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
}: {
  code: string;
  language: string;
}) {
  return (
    <CodeExampleContent
      key={JSON.stringify([language, code])}
      code={code}
      language={language}
    />
  );
}
function CodeExampleContent({
  code,
  language,
}: {
  code: string;
  language: string;
}) {
  const tokens = useMemo(() => codeTokens(code, language), [code, language]);
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);
  const isOutput = language === "text" || language === "output";
  return (
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
}
export default function LessonContent({
  text,
  runtime,
  as: Tag = "p",
  className = "",
}: {
  text: string;
  runtime: string;
  as?: "p" | "h3" | "h4";
  className?: string;
}) {
  const blocks = useMemo(() => lessonBlocks(text, runtime), [text, runtime]);
  return (
    <div className={"lesson-content " + className}>
      {blocks.map((block, i) =>
        block.kind === "code" ? (
          <CodeExample
            key={`${i}:${block.code}`}
            code={block.code}
            language={block.language}
          />
        ) : (
          block.text
            .trim()
            .split(/\n\s*\n/)
            .map((paragraph, j) => (
              <Tag key={`${i}:${j}`}>
                <InlineCode text={paragraph.trim()} />
              </Tag>
            ))
        ),
      )}
    </div>
  );
}
