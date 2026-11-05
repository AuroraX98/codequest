"use client";

import { createContext, useContext, useEffect, useId, useRef, useState, type ReactNode } from "react";
import { glossaryMatches, type GlossaryTerm } from "../lib/lesson-glossary";
import styles from "./LessonGlossary.module.css";

type Help = { active: string | null; panelId: string; scopeId: string; runtime: string; includedTerms?: string[]; toggle: (term: GlossaryTerm, button: HTMLButtonElement) => void };
const GlossaryContext = createContext<Help | null>(null);

/** Text is never rewritten, evaluated, or sent anywhere. Code stays unlinked. */
export function GlossaryText({ text }: { text: string }) {
  const context = useContext(GlossaryContext);
  if (!context) return <>{text}</>;
  const matches = glossaryMatches(text, context.runtime).filter(match => !context.includedTerms || context.includedTerms.includes(match.term.id));
  const parts: ReactNode[] = [];
  let start = 0;
  for (const match of matches) {
    parts.push(text.slice(start, match.from));
    parts.push(<button key={match.from} type="button" className={styles.term} data-glossary-term={match.term.id} data-glossary-scope={context.scopeId}
      aria-label={`Explain ${match.text}`} aria-expanded={context.active === match.term.id} aria-controls={context.panelId}
      onClick={event => context.toggle(match.term, event.currentTarget)}>{match.text}</button>);
    start = match.to;
  }
  parts.push(text.slice(start));
  return <>{parts}</>;
}

export function GlossaryScope({ children, text, runtime, scopeKey = text, wordsLabel = "Words in this step", includedTerms }: { children: ReactNode; text: string; runtime: string; scopeKey?: string | number; wordsLabel?: string; includedTerms?: string[] }) {
  return <Scope key={scopeKey} text={text} runtime={runtime} wordsLabel={wordsLabel} includedTerms={includedTerms}>{children}</Scope>;
}
function Scope({ children, runtime, includedTerms }: { children: ReactNode; text: string; runtime: string; wordsLabel: string; includedTerms?: string[] }) {
  const [active, setActive] = useState<GlossaryTerm | null>(null);
  const region = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement | null>(null);
  const id = useId();
  function close(restoreFocus: boolean) {
    setActive(null);
    if (restoreFocus && trigger.current?.isConnected) trigger.current.focus({ preventScroll: true });
  }
  useEffect(() => {
    if (!active) return;
    const key = (event: KeyboardEvent) => {
      if (event.key === "Escape") { event.preventDefault(); setActive(null); if (trigger.current?.isConnected) trigger.current.focus({ preventScroll: true }); }
    };
    const outside = (event: Event) => {
      const target = event.target as Element | null;
      if (!target || region.current?.contains(target) || target.closest?.('[data-glossary-term]')?.getAttribute('data-glossary-scope') === id) return;
      setActive(null);
    };
    document.addEventListener("keydown", key);
    document.addEventListener("pointerdown", outside);
    // Keyboard activation also dispatches click, even when there was no pointer event.
    document.addEventListener("click", outside);
    return () => { document.removeEventListener("keydown", key); document.removeEventListener("pointerdown", outside); document.removeEventListener("click", outside); };
  }, [active, id]);
  const context: Help = { active: active?.id ?? null, panelId: `${id}-definition`, scopeId: id, runtime, includedTerms, toggle: (term, button) => {
    trigger.current = button;
    setActive(current => current?.id === term.id ? null : term);
  } };
  return <GlossaryContext.Provider value={context}>
    {children}
    <div ref={region} id={`${id}-definition`} hidden={!active} className={styles.definition} role="region" aria-labelledby={`${id}-name`} data-glossary-definition>
      {active && <>
        <div className={styles.heading}><strong id={`${id}-name`}>{active.name}</strong><button type="button" className={styles.close} aria-label="Close word explanation" onClick={() => close(true)}>Close</button></div>
        <p>{active.meaning}</p>
        {active.example && <p className={styles.example}><span>Example</span>{active.example}</p>}
      </>}
    </div>
    <span className={styles.srOnly} role="status" aria-live="polite">{active ? `${active.name}. ${active.meaning} ${active.example ? "Example: "+active.example : ""}` : ""}</span>
  </GlossaryContext.Provider>;
}
