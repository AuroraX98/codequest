"use client";

import { useId, useMemo, useState, useSyncExternalStore } from "react";
import { anatomyPages, anatomyTokenDisplay, anatomyTokenWidth, codeAnatomy, supportsCodeAnatomy } from "../lib/code-anatomy";
import { codeLabel } from "../lib/code-language";
import styles from "./CodeAnatomy.module.css";
import { GlossaryText } from "./LessonGlossary";

export type ReviewedCodePart = { from: number; text: string; label: string; meaning: string };
export type ReviewedCodeExample = { code: string; language: string; parts: ReviewedCodePart[] };
type AnatomyProps = { code: string; language: string; collapseExplanations?: boolean; reviewedExample?: ReviewedCodeExample };

const narrowSnapshot = () => typeof window !== "undefined" && typeof window.matchMedia === "function" && window.matchMedia("(max-width: 540px)").matches;
const wideServerSnapshot = () => false;
function subscribeViewport(notify: () => void) {
  if (typeof window.matchMedia !== "function") return () => {};
  const query = window.matchMedia("(max-width: 540px)");
  query.addEventListener("change", notify);
  return () => query.removeEventListener("change", notify);
}

/** All code is rendered as text. This component never evaluates or changes it. */
export default function CodeAnatomy({ code, language, collapseExplanations = false, reviewedExample }: AnatomyProps) {
  if (!supportsCodeAnatomy(language)) return null;
  return <CodeAnatomyContent key={JSON.stringify([code, language])} code={code} language={language} collapseExplanations={collapseExplanations} reviewedExample={reviewedExample} />;
}

function CodeAnatomyContent({ code, language, collapseExplanations = false, reviewedExample }: AnatomyProps) {
  const narrow = useSyncExternalStore(subscribeViewport, narrowSnapshot, wideServerSnapshot);
  const model = useMemo(() => {
    const parsed = codeAnatomy(code, language);
    // Markdown fences retain a final newline. It does not move any token offset.
    if (!reviewedExample || reviewedExample.language !== parsed.language || (reviewedExample.code !== code && reviewedExample.code + "\n" !== code)) return parsed;
    return { ...parsed, lines: parsed.lines.map(line => ({ ...line, tokens: line.tokens.map(token => {
      const part = reviewedExample.parts.find(item => item.from === token.from && item.text === token.text && code.slice(item.from, item.from + item.text.length) === item.text);
      return part ? { ...token, label: part.label, plainExplanation: part.meaning } : token;
    }) })) };
  }, [code, language, reviewedExample]);
  const [lineIndex, setLineIndex] = useState(() => Math.max(0, model.lines.findIndex(line => line.text.trim())));
  const [pageIndex, setPageIndex] = useState(0);
  const [selectedPart, setSelectedPart] = useState(0);
  const id = useId();
  const line = model.lines[lineIndex];
  const pages = line ? anatomyPages(line) : [];
  const parts = pages[pageIndex] ?? [];
  const visibleParts = narrow ? parts.slice(selectedPart, selectedPart + 1) : parts;
  const width = Math.max(narrow ? 260 : 460, 36 + visibleParts.reduce((sum, token) => sum + anatomyTokenWidth(token), 0));
  const left = (width - visibleParts.reduce((sum, token) => sum + anatomyTokenWidth(token), 0)) / 2;
  const positions = visibleParts.map((token, index) => ({ token, x: left + visibleParts.slice(0, index).reduce((sum, part) => sum + anatomyTokenWidth(part), 0) + anatomyTokenWidth(token) / 2 }));
  const firstPart = pages.slice(0, pageIndex).reduce((count, page) => count + page.length, 0) + 1;
  const totalParts = pages.reduce((count, page) => count + page.length, 0);
  if (!line) return null;

  return <div className={styles.anatomy} data-code-anatomy={model.language}>
    <div className={styles.toolbar}>
      <span className={styles.heading}>Code, piece by piece</span>
      {model.lines.length > 1 && <label className={styles.linePicker}>
        <span>Line</span>
        <select aria-label="Choose a code line to break down" value={lineIndex} onChange={event => { setLineIndex(Number(event.target.value)); setPageIndex(0); setSelectedPart(0); }}>
          {model.lines.map((item, index) => <option key={item.number} value={index}>{item.number} · {item.text.trim().slice(0, 55) || "blank line"}</option>)}
        </select>
      </label>}
    </div>
    {parts.length > 0 ? <>
      {narrow && <pre className={styles.sourceLine} tabIndex={0} aria-label={`Original code, line ${line.number}`}><code>{line.text}</code></pre>}
      <div className={styles.viewport} role="region" tabIndex={0} aria-label={`Code anatomy for line ${line.number}. Scroll sideways if needed.`}>
        <svg className={styles.diagram} width={width} height={170} viewBox={`0 0 ${width} 170`} role="img" aria-labelledby={`${id}-title ${id}-description`} style={{ minWidth: narrow ? 0 : Math.min(width, 560) }}>
          <title id={`${id}-title`}>{`${codeLabel(language)} line ${line.number}, parts ${firstPart + (narrow ? selectedPart : 0)}–${narrow ? firstPart + selectedPart : firstPart + parts.length - 1}`}</title>
          <desc id={`${id}-description`}>{visibleParts.map(token => `${token.label}: ${token.text}. ${token.plainExplanation}`).join(" ")}</desc>
          <rect x="2" y="6" width={width - 4} height="92" rx="20" fill="#f5f6f7" />
          {positions.map(({ token, x }, index) => <g key={`${token.from}:${index}`} className={styles[token.tone]}>
            <text x={x} y="66" textAnchor="middle" className={styles.code} xmlSpace="preserve">{anatomyTokenDisplay(token)}</text>
            <line x1={x} y1="82" x2={x} y2="118" stroke="currentColor" strokeWidth="2" />
            <text x={x} y="145" textAnchor="middle" className={styles.partLabel}>{token.label}</text>
          </g>)}
        </svg>
      </div>
      {pages.length > 1 && <div className={styles.partNavigation} aria-label="Parts of this code line">
        <button type="button" disabled={pageIndex === 0} onClick={() => { setPageIndex(index => index - 1); setSelectedPart(0); }}>Previous parts</button>
        <span aria-live="polite">Parts {firstPart}–{firstPart + parts.length - 1} of {totalParts}</span>
        <button type="button" disabled={pageIndex === pages.length - 1} onClick={() => { setPageIndex(index => index + 1); setSelectedPart(0); }}>Next parts</button>
      </div>}
      <div className={styles.explanations} data-focused-code-parts>
        <p className={styles.pickHint}>Choose one part to see what it does.</p>
        <div className={styles.partChoices} role="group" aria-label="Code parts">
          {parts.map((token, index) => <button type="button" key={`${token.from}:${index}`} aria-pressed={selectedPart === index} aria-controls={`${id}-part`} onClick={() => setSelectedPart(index)}>{firstPart + index}. {token.label}</button>)}
        </div>
        {parts[selectedPart] && <div id={`${id}-part`} className={styles.partMeaning} aria-live="polite" aria-atomic="true" data-active-code-part>
          <strong>{parts[selectedPart].label}</strong>{" "}<code>{parts[selectedPart].label === "Indent" ? "leading whitespace" : parts[selectedPart].text}</code>
          <p className={styles.plain} data-anatomy-plain><GlossaryText text={parts[selectedPart].plainExplanation} /></p>
          {parts[selectedPart].explanation !== parts[selectedPart].plainExplanation && <details open={collapseExplanations ? undefined : true}><summary>Technical meaning</summary><p className={styles.technical}><GlossaryText text={parts[selectedPart].explanation} /></p></details>}
        </div>}
      </div>
    </> : <p className={styles.empty}>A blank line separates ideas and makes the code easier to read.</p>}
    <p className={styles.note}>Spacing is widened for the labels. {parts.some(token => anatomyTokenDisplay(token) !== token.text && token.label !== "Indent") ? "Long pieces are shortened here. " : ""}Original code stays unchanged.</p>
  </div>;
}
