"use client";

import { useId, useMemo, useState } from "react";
import { anatomyPages, anatomyTokenDisplay, anatomyTokenWidth, codeAnatomy, supportsCodeAnatomy } from "../lib/code-anatomy";
import { codeLabel } from "../lib/code-language";
import styles from "./CodeAnatomy.module.css";
import { GlossaryText } from "./LessonGlossary";

/** All code is rendered as text. This component never evaluates or changes it. */
export default function CodeAnatomy({ code, language, collapseExplanations = false }: { code: string; language: string; collapseExplanations?: boolean }) {
  if (!supportsCodeAnatomy(language)) return null;
  return <CodeAnatomyContent key={JSON.stringify([code, language])} code={code} language={language} collapseExplanations={collapseExplanations} />;
}

function CodeAnatomyContent({ code, language, collapseExplanations = false }: { code: string; language: string; collapseExplanations?: boolean }) {
  const model = useMemo(() => codeAnatomy(code, language), [code, language]);
  const [lineIndex, setLineIndex] = useState(() => Math.max(0, model.lines.findIndex(line => line.text.trim())));
  const [pageIndex, setPageIndex] = useState(0);
  const id = useId();
  const line = model.lines[lineIndex];
  const pages = line ? anatomyPages(line) : [];
  const parts = pages[pageIndex] ?? [];
  const width = Math.max(460, 36 + parts.reduce((sum, token) => sum + anatomyTokenWidth(token), 0));
  const left = (width - parts.reduce((sum, token) => sum + anatomyTokenWidth(token), 0)) / 2;
  const positions = parts.map((token, index) => ({ token, x: left + parts.slice(0, index).reduce((sum, part) => sum + anatomyTokenWidth(part), 0) + anatomyTokenWidth(token) / 2 }));
  const firstPart = pages.slice(0, pageIndex).reduce((count, page) => count + page.length, 0) + 1;
  const totalParts = pages.reduce((count, page) => count + page.length, 0);
  if (!line) return null;

  return <div className={styles.anatomy} data-code-anatomy={model.language}>
    <div className={styles.toolbar}>
      <span className={styles.heading}>Code, piece by piece</span>
      {model.lines.length > 1 && <label className={styles.linePicker}>
        <span>Line</span>
        <select aria-label="Choose a code line to break down" value={lineIndex} onChange={event => { setLineIndex(Number(event.target.value)); setPageIndex(0); }}>
          {model.lines.map((item, index) => <option key={item.number} value={index}>{item.number} · {item.text.trim().slice(0, 55) || "blank line"}</option>)}
        </select>
      </label>}
    </div>
    {parts.length > 0 ? <>
      <div className={styles.viewport} role="region" tabIndex={0} aria-label={`Code anatomy for line ${line.number}. Scroll sideways if needed.`}>
        <svg className={styles.diagram} width={width} height={170} viewBox={`0 0 ${width} 170`} role="img" aria-labelledby={`${id}-title ${id}-description`} style={{ minWidth: Math.min(width, 560) }}>
          <title id={`${id}-title`}>{`${codeLabel(language)} line ${line.number}, parts ${firstPart}–${firstPart + parts.length - 1}`}</title>
          <desc id={`${id}-description`}>{parts.map(token => `${token.label}: ${token.text}. ${token.explanation} ${token.plainExplanation}`).join(" ")}</desc>
          <rect x="2" y="6" width={width - 4} height="92" rx="20" fill="#f5f6f7" />
          {positions.map(({ token, x }, index) => <g key={`${token.from}:${index}`} className={styles[token.tone]}>
            <text x={x} y="66" textAnchor="middle" className={styles.code} xmlSpace="preserve">{anatomyTokenDisplay(token)}</text>
            <line x1={x} y1="82" x2={x} y2="118" stroke="currentColor" strokeWidth="2" />
            <text x={x} y="145" textAnchor="middle" className={styles.partLabel}>{token.label}</text>
          </g>)}
        </svg>
      </div>
      {pages.length > 1 && <div className={styles.partNavigation} aria-label="Parts of this code line">
        <button type="button" disabled={pageIndex === 0} onClick={() => setPageIndex(index => index - 1)}>Previous parts</button>
        <span aria-live="polite">Parts {firstPart}–{firstPart + parts.length - 1} of {totalParts}</span>
        <button type="button" disabled={pageIndex === pages.length - 1} onClick={() => setPageIndex(index => index + 1)}>Next parts</button>
      </div>}
      <details open={!collapseExplanations} className={styles.explanations} key={`${lineIndex}:${pageIndex}`}>
        <summary>What each part does</summary>
        <ol start={firstPart}>
          {parts.map((token, index) => <li key={`${token.from}:${index}`}>
            <span className={`${styles.term} ${styles[token.tone]}`}>{token.label}</span>{" "}
            <code>{token.label === "Indent" ? "leading whitespace" : token.text}</code>
            <p className={styles.technical}><GlossaryText text={token.explanation} /></p>
            <p className={styles.plain} data-anatomy-plain><GlossaryText text={token.plainExplanation} /></p>
          </li>)}
        </ol>
      </details>
    </> : <p className={styles.empty}>A blank line separates ideas and makes the code easier to read.</p>}
    <p className={styles.note}>Spacing is widened for the labels. {parts.some(token => anatomyTokenDisplay(token) !== token.text && token.label !== "Indent") ? "Long pieces are shortened here. " : ""}Original code stays unchanged.</p>
  </div>;
}
