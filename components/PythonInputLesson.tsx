"use client";
import { useEffect, useState, type ReactNode } from "react";
import type { Lesson } from "../lib/types";
import LessonStepFlow from "./LessonStepFlow";

/** Typed-input demonstration; no Python stdin is invoked in the browser. */
export default function PythonInputLesson({
  lesson,
  resumeScope,
  onContinue,
  renderReadingMark,
  onParagraphChange,
}: {
  lesson: Lesson;
  resumeScope?: string;
  onContinue: () => void;
  renderReadingMark?: (paragraph: number) => ReactNode;
  onParagraphChange?: (paragraph: number) => void;
}) {
  const [part, setPart] = useState(0);
  const [ready, setReady] = useState(false);
  const [answer, setAnswer] = useState("");
  const [submitted, setSubmitted] = useState<string | null>(null);
  const key = `codequest-input-${resumeScope ?? "session"}:${lesson.id}`;
  useEffect(() => {
    if (resumeScope)
      try {
        const saved = JSON.parse(localStorage.getItem(key) ?? "null");
        if (
          Number.isInteger(saved?.part) &&
          saved.part >= 0 &&
          saved.part <= lesson.explanation.length
        )
          setPart(saved.part);
        if (typeof saved?.answer === "string") setAnswer(saved.answer);
        if (typeof saved?.submitted === "string") setSubmitted(saved.submitted);
      } catch {}
    setReady(true);
  }, [key, resumeScope, lesson.explanation.length]);
  useEffect(() => {
    if (ready && resumeScope)
      try {
        localStorage.setItem(key, JSON.stringify({ part, answer, submitted }));
      } catch {}
  }, [ready, key, resumeScope, part, answer, submitted]);
  useEffect(() => {
    if (ready && part < lesson.explanation.length) onParagraphChange?.(part);
  }, [ready, part, lesson.explanation.length, onParagraphChange]);
  if (!ready) return <p>Opening your tiny lesson…</p>;
  if (part < lesson.explanation.length)
    return (
      <LessonStepFlow
        title="input()"
        text={lesson.explanation[part]}
        runtime="python"
        resumeKey={resumeScope ? `${key}:part-${part}` : undefined}
        onNext={() => setPart(part + 1)}
        onBack={() => setPart(Math.max(0, part - 1))}
        backDisabled={part === 0}
        completion={renderReadingMark?.(part)}
      />
    );
  return (
    <section className="panel" aria-label="Try input">
      <p className="eyebrow">TRY IT · TYPED-INPUT SIMULATION</p>
      <p>This models a terminal exchange. It does not run Python.</p>
      <pre>
        <code>{'topic = input("What interests you? ")\nprint(topic)'}</code>
      </pre>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          setSubmitted(answer);
        }}
      >
        <label htmlFor="input-topic-answer">What interests you?</label>
        <input
          id="input-topic-answer"
          value={answer}
          onChange={(event) => {
            setAnswer(event.target.value);
            setSubmitted(null);
          }}
          autoComplete="off"
        />
        <button className="primary" type="submit">
          Submit answer
        </button>
      </form>
      {submitted !== null && (
        <div role="status">
          <p>
            <code>input()</code> returns{" "}
            <code>{JSON.stringify(submitted)}</code> — a string stored in{" "}
            <code>topic</code>.
          </p>
          <p>
            <code>print(topic)</code> displays:
          </p>
          <pre aria-label="Simulated printed output">
            {submitted || "(an empty line)"}
          </pre>
          <p>
            The question is the prompt, not the returned answer. Try typing 42:
            the answer is still text, <code>"42"</code>, not the number{" "}
            <code>42</code>.
          </p>
        </div>
      )}
      <nav aria-label="Input lesson steps" className="button-row">
        <button onClick={() => setPart(lesson.explanation.length - 1)}>
          Back
        </button>
        <button
          className="primary"
          disabled={submitted === null}
          onClick={onContinue}
        >
          Continue
        </button>
      </nav>
    </section>
  );
}
