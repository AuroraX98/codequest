"use client";

import { useEffect, useId, useMemo, useRef, useState, type ReactNode } from "react";
import { buildLessonSteps, distinctLessonReference, type LessonStep } from "../lib/lesson-step-flow";
import CodeAnatomy from "./CodeAnatomy";
import { codeAnatomy } from "../lib/code-anatomy";
import LessonContent, { CodeExample, InlineCode } from "./LessonContent";
import styles from "./LessonStepFlow.module.css";
import { GlossaryScope, GlossaryText } from "./LessonGlossary";

export type LessonStage = {
  index: number;
  total: number;
  kind: LessonStep["kind"];
  isLast: boolean;
};
export type LessonStepFlowProps = {
  text: string;
  runtime: string;
  referenceText?: string;
  referenceVisual?: ReactNode;
  resumeKey?: string;
  title?: string;
  onNext: () => void;
  onBack: () => void;
  backDisabled: boolean;
  completion?: ReactNode;
  startAtEnd?: boolean;
  onStageChange?: (stage: LessonStage) => void;
};

/** Navigation resumes on this device when scoped. Only manual completion saves completed progress. */
export default function LessonStepFlow(props: LessonStepFlowProps) {
  return <StepFlow key={JSON.stringify([props.runtime, props.text, props.resumeKey])} {...props} />;
}

function StepFlow({ text, runtime, referenceText = text, referenceVisual, resumeKey, title, onNext, onBack, backDisabled, completion, startAtEnd = false, onStageChange }: LessonStepFlowProps) {
  const steps = useMemo(() => buildLessonSteps(text, runtime), [text, runtime]);
  const extraReference = useMemo(() => distinctLessonReference(text, referenceText, runtime), [text, referenceText, runtime]);
  const [index, setIndex] = useState(() => startAtEnd ? steps.length - 1 : 0);
  const [selection, setSelection] = useState<string | null>(null);
  const [result, setResult] = useState<"correct" | "revealed" | null>(null);
  const [resumeReady, setResumeReady] = useState(false);
  useEffect(() => {
    if (resumeKey && !startAtEnd) {
      try {
        const saved = JSON.parse(localStorage.getItem(resumeKey) ?? "null");
        if (saved?.flowVersion === 2 && saved.text === text && saved.runtime === runtime && Number.isInteger(saved.index) && saved.index >= 0 && saved.index < steps.length) {
          setIndex(saved.index);
          const savedStep = steps[saved.index];
          if (savedStep.kind === "practice" && savedStep.options.includes(saved.selection)) {
            setSelection(saved.selection);
            if (saved.result === "correct" && saved.selection === savedStep.answer) setResult("correct");
            else if (saved.result === "revealed") setResult("revealed");
          }
        }
      } catch { /* Private browsing or unavailable storage must not block learning. */ }
    }
    setResumeReady(true);
  }, [resumeKey, text, runtime, steps, startAtEnd]);
  useEffect(() => {
    if (!resumeReady || !resumeKey) return;
    try { localStorage.setItem(resumeKey, JSON.stringify({ flowVersion: 2, text, runtime, index, selection, result })); } catch {}
  }, [resumeReady, resumeKey, text, runtime, index, selection, result]);
  const panel = useRef<HTMLDivElement>(null);
  const previousIndex = useRef(index);
  const stageCallback = useRef(onStageChange);
  const id = useId();
  const step = steps[index];
  const glossaryText = useMemo(() => step.kind === "explain" ? step.text : step.kind === "practice" ? step.question + " " + (result ? step.explanation : "") : step.kind === "output" ? "output code" : codeAnatomy(step.code, step.language).lines.flatMap(line => line.tokens.map(token => token.label + " " + token.explanation)).join(" "), [step, result, runtime]);
  const isLast = index === steps.length - 1;
  const canContinue = step.kind !== "practice" || result !== null;
  const stageLabel = step.kind === "explain" ? "One idea" : step.kind === "example" ? "See it" : step.kind === "practice" ? "Your turn" : "The result";

  useEffect(() => {
    if (index !== previousIndex.current) panel.current?.focus({ preventScroll: true });
    previousIndex.current = index;
  }, [index]);
  useEffect(() => { stageCallback.current = onStageChange; }, [onStageChange]);
  useEffect(() => {
    stageCallback.current?.({ index, total: steps.length, kind: step.kind, isLast });
  }, [index, steps.length, step.kind, isLast]);

  function goTo(next: number) {
    setSelection(null);
    setResult(null);
    setIndex(next);
  }
  function advance() {
    if (step.kind === "practice" && !result) {
      if (selection !== null) setResult(selection === step.answer ? "correct" : "revealed");
      return;
    }
    if (isLast) onNext();
    else goTo(index + 1);
  }

  return <section className={styles.flow} data-lesson-step-flow data-step-index={index} data-step-total={steps.length} aria-label={title ? `${title}: one step at a time` : "One step at a time"}>
    <div className={styles.progress} aria-live="polite" aria-atomic="true">
      <span>{stageLabel}</span>
      <span title={resumeKey ? "Your place is saved on this device, not synced across devices." : undefined}>Step {index + 1} of {steps.length}</span>
    </div>
    <GlossaryScope scopeKey={index} runtime={runtime} text={glossaryText}>
    <div className={styles.panel} key={index} ref={panel} tabIndex={-1} data-step-kind={step.kind} aria-label={`${stageLabel}, step ${index + 1} of ${steps.length}`}>
      {step.kind === "explain" && <>
        <p className={styles.thought} data-technical-reading><InlineCode text={step.text} /></p>
      </>}
      {step.kind === "example" && <>
        <p className={styles.hint}>See what each part does.</p>
        <CodeAnatomy code={step.code} language={step.language} collapseExplanations />
      </>}
      {step.kind === "output" && <>
        <p className={styles.hint}>This is the output, not code to type.</p>
        <CodeExample code={step.code} language={step.language} />
      </>}
      {step.kind === "practice" && <>
        <fieldset className={styles.practice} disabled={result !== null} aria-describedby={result ? `${id}-feedback` : undefined}>
          <legend><GlossaryText text={step.question} /></legend>
          <pre className={styles.practiceCode} tabIndex={0} aria-label="Code for this question"><code>{step.code}</code></pre>
          <div className={styles.choices}>
            {step.options.map((option) => <label key={option} className={`${styles.choice}${selection === option ? ` ${styles.selected}` : ""}${result && option === step.answer ? ` ${styles.answer}` : ""}`}>
              <input type="radio" name={`${id}-answer`} value={option} checked={selection === option} onChange={() => setSelection(option)} />
              <code>{option}</code>
              {result && option === step.answer && <span className={styles.answerLabel}>Answer</span>}
            </label>)}
          </div>
        </fieldset>
        {result && <div id={`${id}-feedback`} className={styles.feedback} role="status">
          <p><strong>{result === "correct" ? "That's right." : "Here's the answer."}</strong> The answer is <code>{step.answer}</code>{/[.!?]$/.test(step.answer) ? "" : "."}</p>
          <p><GlossaryText text={step.explanation} /></p>
          <p className={styles.plain} data-practice-plain><GlossaryText text={step.plainExplanation} /></p>
        </div>}
      </>}
    </div>
    </GlossaryScope>
    {isLast && canContinue && completion && <div className={styles.completion} data-step-completion>{completion}</div>}
    <nav className={styles.navigation} aria-label="Reading steps">
      <button type="button" className={styles.back} data-step-back disabled={index === 0 && backDisabled} onClick={() => index > 0 ? goTo(index - 1) : onBack()}>Back</button>
      <button type="button" className={styles.primary} data-step-primary disabled={step.kind === "practice" && !result && selection === null} onClick={advance}>
        {step.kind === "practice" && !result ? "Check" : isLast || result ? "Continue" : "Next"}
      </button>
    </nav>
    {(extraReference || referenceVisual) && <details key={`${index}:reference`} className={styles.reference} data-lesson-reference>
      <summary>Tell me more</summary>
      <div className={styles.referenceContent}>
        {extraReference && <LessonContent text={extraReference} runtime={runtime} glossary />}
        {referenceVisual}
      </div>
    </details>}
  </section>;
}
