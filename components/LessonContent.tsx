"use client";
import { useMemo, useState } from "react";
import { Check, Copy } from "lucide-react";
import { codeTokens, lessonBlocks } from "../lib/lesson-markup";
import { codeLabel } from "../lib/code-language";
export function InlineCode({ text }: { text: string }) {
  const parts = text.split(/(`[^`\n]+`)/g);
  return (
    <>
      {parts.map((part, i) =>
        part.startsWith("`") && part.endsWith("`") && part.length > 2 ? (
          <code className="inline-code" key={i}>
            {part.slice(1, -1)}
          </code>
        ) : (
          part
        ),
      )}
    </>
  );
}
export function CodeExample({
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
            aria-label="Copy example code"
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
