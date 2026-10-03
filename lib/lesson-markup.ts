import { classHighlighter, highlightTree } from "@lezer/highlight";
import { codeLanguage } from "./code-language";
export type LessonBlock =
  | { kind: "prose"; text: string }
  | { kind: "code"; code: string; language: string };
export function lessonBlocks(
  text: string,
  defaultLanguage: string,
): LessonBlock[] {
  const blocks: LessonBlock[] = [];
  const fences =
    /^```([a-zA-Z0-9_-]*)[^\S\r\n]*\r?\n([\s\S]*?)^```[^\S\r\n]*(?:\r?\n|$)/gm;
  let cursor = 0;
  for (const match of text.matchAll(fences)) {
    const prose = text.slice(cursor, match.index);
    if (prose.trim()) blocks.push({ kind: "prose", text: prose });
    blocks.push({
      kind: "code",
      code: match[2],
      language: match[1] || defaultLanguage,
    });
    cursor = match.index! + match[0].length;
  }
  if (text.slice(cursor).trim())
    blocks.push({ kind: "prose", text: text.slice(cursor) });
  return blocks;
}
export type CodeToken = { text: string; className?: string };
export function codeTokens(code: string, language: string): CodeToken[] {
  const parser = codeLanguage(language)?.language.parser;
  if (!parser) return [{ text: code }];
  const tokens: CodeToken[] = [];
  let cursor = 0;
  highlightTree(parser.parse(code), classHighlighter, (from, to, className) => {
    if (cursor < from) tokens.push({ text: code.slice(cursor, from) });
    tokens.push({ text: code.slice(from, to), className });
    cursor = to;
  });
  if (cursor < code.length) tokens.push({ text: code.slice(cursor) });
  return tokens;
}
