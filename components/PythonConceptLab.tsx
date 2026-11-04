"use client";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { ArrowRight, Download, Play, RotateCcw, Square } from "lucide-react";
import {
  makePythonExperiment,
  pythonConcepts,
  reviewedPythonFirstLesson,
  type ConceptId,
  type ExperimentId,
} from "../lib/python-concepts";
import { runProject } from "../lib/runner";
import type { Lesson, RunResult } from "../lib/types";
import PythonConceptPicture from "./PythonConceptPicture";
import PythonConceptMetaphor from "./PythonConceptMetaphor";
import LessonStepFlow from "./LessonStepFlow";
import PairedLessonText from "./PairedLessonText";

export default function PythonConceptLab({
  lesson,
  onConceptChange,
  onContextChange,
  renderReadingMark,
  simple = false,
  resumeScope,
  targetConcept,
  onContinue,
}: {
  lesson: Lesson;
  simple?: boolean;
  resumeScope?: string;
  targetConcept?: string;
  onContinue?: () => void;
  renderReadingMark?: (id: ConceptId, title: string) => ReactNode;
  onConceptChange?: (id: ConceptId) => void;
  onContextChange?: (context: { code: string; explanation: string }) => void;
}) {
  const [concept, setConcept] = useState<ConceptId>("program");
  const [conceptResumeReady, setConceptResumeReady] = useState(false);
  useEffect(() => {
    if (pythonConcepts.some(item => item.id === targetConcept)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- Restore the saved concept or an explicit navigation target after hydration.
      setConcept(targetConcept as ConceptId);
    } else if (resumeScope) {
      try {
        const saved = localStorage.getItem(`codequest-concept-${resumeScope}:${lesson.id}`);
        if (pythonConcepts.some(item => item.id === saved)) setConcept(saved as ConceptId);
      } catch {}
    }
    setConceptResumeReady(true);
  }, [resumeScope, lesson.id, targetConcept]);
  useEffect(() => {
    if (!conceptResumeReady || !resumeScope) return;
    try { localStorage.setItem(`codequest-concept-${resumeScope}:${lesson.id}`, concept); } catch {}
  }, [conceptResumeReady, resumeScope, lesson.id, concept]);
  const [flowBackTarget, setFlowBackTarget] = useState<ConceptId | null>(null);
  // eslint-disable-next-line react-hooks/set-state-in-effect -- Consume the backward-entry marker after the keyed reader mounts.
  useEffect(() => setFlowBackTarget(null), [concept]);
  const [roomCollapsed, setRoomCollapsed] = useState(false);
  const [detail, setDetail] = useState(
    "Select any highlighted part of the code to understand its job.",
  );
  const [experiment, setExperiment] = useState<ExperimentId>("greeting");
  const pet = "Pepper";
  const age = 5;
  const [step, setStep] = useState(1);
  const [result, setResult] = useState<RunResult | null>(null);
  const [running, setRunning] = useState(false);
  const [notice, setNotice] = useState("");
  const [copied, setCopied] = useState(false);
  const busy = useRef(false);
  const rooms = useRef<HTMLDivElement>(null);
  const simpleHeading = useRef<HTMLHeadingElement>(null);
  const frame = useRef<HTMLIFrameElement>(null);
  const runId = useRef(0);
  const controller = useRef<AbortController | null>(null);
  const model = useMemo(
    () => makePythonExperiment(experiment, pet, age),
    [experiment, pet, age],
  );
  const current = pythonConcepts.find((c) => c.id === concept)!;
  const reviewed = reviewedPythonFirstLesson[concept];
  useEffect(() => {
    onContextChange?.({
      code: simple ? reviewed.example.code : model.code,
      explanation: simple ? reviewed.text : [
        current.title,
        current.short,
        current.why,
        current.imagine,
        current.limit,
      ].join("\n\n"),
    });
  }, [model.code, current, onContextChange, simple, reviewed]);
  const state = model.steps[Math.min(step, model.steps.length - 1)];
  useEffect(
    () => () => {
      runId.current++;
      controller.current?.abort();
    },
    [],
  );
  function invalidate() {
    busy.current = false;
    runId.current++;
    controller.current?.abort();
    setRunning(false);
    setResult(null);
    setStep(0);
    setNotice("Example selected. Step through its mechanism or run the code.");
    setCopied(false);
  }
  async function run() {
    if (busy.current || !frame.current) return;
    busy.current = true;
    const id = ++runId.current;
    const abort = new AbortController();
    controller.current = abort;
    setRunning(true);
    setResult(null);
    setNotice("Running this example in the bundled Python runtime…");
    try {
      const exercise = {
        ...lesson,
        checks: [
          {
            label: "Python output matches this walkthrough.",
            expression: `__output == ${JSON.stringify(model.expected)}`,
          },
        ],
      };
      const out = await runProject(
        frame.current,
        exercise,
        model.code,
        abort.signal,
      );
      if (id !== runId.current) return;
      const confirmed =
        out.checks.length === 1 &&
        out.checks[0].passed &&
        JSON.stringify(out.output) === JSON.stringify(model.expected);
      setResult(out);
      setNotice(
        out.error
          ? "Python could not finish this run. Your lesson and project are unchanged."
          : confirmed
            ? "Python ran this code and confirmed the output below."
            : "Python ran, but its output differs from this teaching model. Use the actual Python output and review the example.",
      );
    } catch (e) {
      if (id === runId.current)
        setNotice(
          `Could not run Python: ${e instanceof Error ? e.message : "runtime unavailable"}. You can still follow the walkthrough or run the downloaded file in PyCharm.`,
        );
    } finally {
      if (id === runId.current) {
        busy.current = false;
        setRunning(false);
      }
    }
  }
  function stop() {
    busy.current = false;
    runId.current++;
    controller.current?.abort();
    setRunning(false);
    setNotice(
      "Run stopped. Your code and original course project are unchanged.",
    );
  }
  function download() {
    const blob = new Blob(
      [
        `# CodeQuest: follow the names, values, and output.\n# Predict the output before running.\n${model.code}`,
      ],
      { type: "text/x-python;charset=utf-8" },
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "pepper_concept_lab.py";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setNotice(
      "Downloaded pepper_concept_lab.py. This is separate from your saved course project.",
    );
  }
  const activeRoom = (
    <>
      <section className="concept-explanation" aria-label="Selected concept">
        <div>
          <span className="lab-eyebrow">{current.title}</span>
          <PairedLessonText text={current.short} />
          <PairedLessonText text={current.why} />
        </div>
        <div className="imagination-card">
          <b>See it drawn</b>
          <PythonConceptMetaphor
            concept={concept}
            model={model}
            state={state}
            step={step}
            pet={pet}
            age={age}
          />
          <details className="technical-picture">
            <summary>Compare with the code-state diagram</summary>
            <PythonConceptPicture
              concept={concept}
              model={model}
              state={state}
              step={step}
              pet={pet}
              age={age}
            />
          </details>
          <details className="picture-analogy">
            <summary>Read the analogy</summary>
            <PairedLessonText text={current.imagine} />
          </details>
          <PairedLessonText text={current.limit} />
        </div>
      </section>
      <div
        className="experiment-tabs"
        role="group"
        aria-label="Choose an explained example"
      >
        {(
          [
            { id: "greeting", title: "Shared Pepper example" },
            { id: "rebind", title: "Two names, one object" },
            { id: "types", title: "Text versus numbers" },
          ] as const
        ).map((e) => (
          <button
            key={e.id}
            type="button"
            aria-pressed={experiment === e.id}
            onClick={() => {
              if (experiment !== e.id) {
                invalidate();
                setExperiment(e.id);
              }
              const pictureConcept: ConceptId =
                e.id === "types"
                  ? "strings"
                  : e.id === "rebind"
                    ? concept === "assignment"
                      ? "assignment"
                      : "names"
                    : "values";
              if (pictureConcept !== concept) {
                setRoomCollapsed(false);
                setConcept(pictureConcept);
                onConceptChange?.(pictureConcept);
                setDetail(
                  pythonConcepts.find((item) => item.id === pictureConcept)!
                    .short,
                );
                requestAnimationFrame(() =>
                  rooms.current
                    ?.querySelector<HTMLButtonElement>(
                      `[aria-controls="python-room-${pictureConcept}"]`,
                    )
                    ?.focus(),
                );
              }
            }}
          >
            {e.title}
          </button>
        ))}
      </div>
      <div className="walkthrough-controls">
        <button
          className="secondary"
          type="button"
          disabled={step === 0}
          onClick={() => setStep((s) => Math.max(0, s - 1))}
        >
          Back one line
        </button>
        <button
          className="primary"
          type="button"
          disabled={step >= model.lines.length}
          onClick={() => setStep((s) => Math.min(model.lines.length, s + 1))}
        >
          Next instruction <ArrowRight size={16} />
        </button>
        <button
          className="text-button"
          type="button"
          onClick={() => setStep(0)}
        >
          <RotateCcw size={16} /> Restart walkthrough
        </button>
        <span>
          {Math.min(step, model.lines.length)} / {model.lines.length}{" "}
          instructions
        </span>
      </div>
      <p className="walkthrough-note" role="status">
        {state.note}
      </p>
      <details className="lab-technical-workbench">
        <summary>Reveal the Python behind the picture</summary>
        <div className="lab-workbench">
          <section
            className="lab-source"
            aria-label="Interactive Python example"
          >
            <div className="lab-section-title">
              <b>The instructions</b>
              <span>Tap any code part</span>
            </div>
            <pre aria-label="Pepper example source">
              <code>
                {model.lines.map((line, i) => (
                  <span
                    className={
                      "lab-code-line " + (step === i + 1 ? "current" : "")
                    }
                    key={i}
                  >
                    <span className="lab-line-number" aria-hidden="true">
                      {i + 1}
                    </span>
                    <span>
                      {line.map((piece, j) =>
                        piece.concept ? (
                          <button
                            type="button"
                            className={
                              "code-piece " +
                              (piece.concept === concept ? "spotlight" : "")
                            }
                            key={j}
                            aria-label={`Explain ${piece.text.trim() || "space"} on line ${i + 1}`}
                            onClick={() => {
                              if (busy.current) stop();
                              setRoomCollapsed(false);
                              setConcept(piece.concept!);
                              onConceptChange?.(piece.concept!);
                              setDetail(
                                piece.meaning ||
                                  "This part contributes to the selected concept.",
                              );
                            }}
                          >
                            {piece.text}
                          </button>
                        ) : (
                          piece.text
                        ),
                      )}
                    </span>
                    {i < model.lines.length - 1 ? "\n" : ""}
                  </span>
                ))}
              </code>
            </pre>
            <div className="code-part-detail" role="status">
              <b>Why this part is here</b>
              <p>{detail}</p>
            </div>
          </section>
          <section
            className="lab-state"
            aria-label="Names and values after this instruction"
          >
            <div className="lab-section-title">
              <b>Inside this example</b>
              <span>
                {step === 0 ? "Before running" : `After line ${step}`}
              </span>
            </div>
            <div className="reference-scene">
              {state.bindings.length === 0 ? (
                <p className="lab-empty">No names are bound yet.</p>
              ) : (
                state.objects.map((object) => {
                  const names = state.bindings.filter(
                    (binding) => binding.object === object.id,
                  );
                  return (
                    <div className="reference-row" key={object.id}>
                      <div className="reference-names">
                        {names.map((binding) => (
                          <code className="name-tag" key={binding.name}>
                            {binding.name}
                          </code>
                        ))}
                      </div>
                      <span className="reference-arrow">
                        <ArrowRight size={20} />
                        <small>
                          {names.length > 1 ? "both refer to" : "refers to"}
                        </small>
                      </span>
                      <div className={"value-object " + object.type}>
                        <small>
                          {object.type === "str"
                            ? "str · text"
                            : "int · whole number"}{" "}
                          · {object.id}
                        </small>
                        <strong>
                          {object.type === "str"
                            ? JSON.stringify(object.value)
                            : object.value}
                        </strong>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
            <small className="scene-limit">
              Matching object labels mean the same reference in this
              walkthrough. Cards show roles, not real memory addresses.
            </small>
            <div className="visual-output">
              <b>Output display</b>
              <pre>
                {state.output.length
                  ? state.output.join("\n")
                  : "(nothing printed yet)"}
              </pre>
              <small>Output is separate from names and values.</small>
            </div>
          </section>
        </div>
      </details>
      <div className="lab-run-actions">
        <button
          type="button"
          className="primary"
          disabled={running}
          onClick={() => void run()}
        >
          <Play size={16} />
          {running ? "Running Python…" : "Run actual Python"}
        </button>
        {running && (
          <button type="button" className="secondary" onClick={stop}>
            <Square size={16} />
            Stop
          </button>
        )}
        <button type="button" className="secondary" onClick={download}>
          <Download size={16} />
          Download .py
        </button>
        <button
          type="button"
          className="text-button"
          onClick={async () => {
            const revision = runId.current;
            try {
              await navigator.clipboard.writeText(model.code);
              if (revision === runId.current) setCopied(true);
            } catch {
              if (revision !== runId.current) return;
              setNotice(
                "Clipboard access is unavailable. Use Download .py or select the code.",
              );
            }
          }}
        >
          {copied ? "Code copied" : "Copy code"}
        </button>
      </div>
      <p className="lab-status" role="status">
        {notice ||
          "The walkthrough is an authored explanation. Run actual Python to verify its output. These experiments do not mark a course lesson complete."}
      </p>
      {result && (
        <section className="actual-output" aria-label="Actual Python result">
          <b>Actual Python output</b>
          <pre>{result.error || result.output.join("\n") || "(no output)"}</pre>
        </section>
      )}
      <iframe
        ref={frame}
        title="Python concept experiment runner"
        className="lab-runner"
        sandbox="allow-scripts"
        aria-hidden="true"
        tabIndex={-1}
      />
      {renderReadingMark?.(concept, current.title)}
    </>
  );
  const conceptIndex = pythonConcepts.findIndex((item) => item.id === concept);
  function chooseConcept(index: number, atEnd = false) {
    if (busy.current) stop();
    const next = pythonConcepts[index];
    setFlowBackTarget(atEnd ? next.id : null);
    setConcept(next.id);
    setRoomCollapsed(false);
    onConceptChange?.(next.id);
    setDetail(next.short);
    requestAnimationFrame(() => simpleHeading.current?.focus());
  }
  if (simple)
    return (
      <section
        className="simple-concept-reader"
        aria-label="Python reading window"
      >
        <div className="reader-topline">
          <span className="lab-eyebrow">
            Idea {conceptIndex + 1} of {pythonConcepts.length}
          </span>
        </div>
        <div data-annotation-section={"concept:" + concept}>
          <h3 ref={simpleHeading} tabIndex={-1}>
            {reviewed.title}
          </h3>
          <LessonStepFlow
            key={concept}
            title={reviewed.title}
            text={
              reviewed.text +
              "\n\n```python\n" +
              reviewed.example.code +
              "\n```\n\n```text\n" + reviewed.result + "\n```"
            }
            resumeKey={resumeScope ? `codequest-microstep-${resumeScope}:${lesson.id}:concept:${concept}` : undefined}
            reviewedExample={reviewed.example}
            reviewedLesson
            inlinePractice={false}
            glossaryTerms={["program", "code", "value", "variable", "string", "assignment", "output", "function", "parentheses"]}
            runtime="python"
            startAtEnd={flowBackTarget === concept}
            backDisabled={conceptIndex === 0}
            onBack={() => chooseConcept(conceptIndex - 1, true)}
            onNext={() => {
              if (conceptIndex < pythonConcepts.length - 1)
                chooseConcept(conceptIndex + 1);
              else onContinue?.();
            }}
            completion={renderReadingMark?.(concept, reviewed.title)}
          />

        </div>
      </section>
    );
  return (
    <details className="concept-lab" open>
      <summary>
        <span className="lab-eyebrow">PICTURE IT, THEN TRY IT</span>
        <strong>Pepper’s Python concept lab</strong>
        <span className="lab-summary-note">
          Explore six connected ideas. Close this whenever you prefer the
          written lesson.
        </span>
      </summary>
      <div className="lab-content">
        <p className="lab-intro">
          One familiar example, six ways to understand it. You do not need to
          memorize every possibility before moving on.
        </p>
        <div
          className="python-concept-rooms"
          ref={rooms}
          role="group"
          aria-label="Explore a Python concept"
        >
          {pythonConcepts.map((c, i) => {
            const expanded = concept === c.id && !roomCollapsed;
            return (
              <section
                className={
                  "python-concept-room " + (expanded ? "expanded" : "")
                }
                key={c.id}
              >
                <h4>
                  <button
                    type="button"
                    aria-pressed={concept === c.id}
                    aria-expanded={expanded}
                    aria-controls={"python-room-" + c.id}
                    onClick={() => {
                      if (busy.current) stop();
                      setRoomCollapsed(
                        concept === c.id ? !roomCollapsed : false,
                      );
                      setConcept(c.id);
                      onConceptChange?.(c.id);
                      setDetail(c.short);
                    }}
                  >
                    <span className="contents-number">{i + 1}</span>
                    <span>
                      {c.title}
                      <small>{c.short}</small>
                    </span>
                    <span aria-hidden="true">{expanded ? "−" : "+"}</span>
                  </button>
                </h4>
                <div
                  id={"python-room-" + c.id}
                  data-annotation-section={"concept:" + c.id}
                  hidden={!expanded}
                  className="python-room-content"
                >
                  {expanded ? activeRoom : null}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </details>
  );
}
