"use client";
import { useEffect, useRef, useState } from "react";
import CodeEditor from "./CodeEditor";
import { runProject } from "../lib/runner";
import type { Lesson, RunResult } from "../lib/types";
import type { CourseProject } from "../lib/course-projects";
import { loadCourseProject, saveCourseProject, type CourseProjectDraft } from "../lib/course-project-storage";

type Props = { finishBlockedReason?: string; project: CourseProject; lesson: Lesson; scope: string; initialCode?: string; onCompleteCore: (code: string, checks: RunResult["checks"]) => Promise<void> };
export default function CourseProjectStudio({ project, lesson, scope, initialCode, onCompleteCore, finishBlockedReason }: Props) {
  const [draft, setDraft] = useState<CourseProjectDraft | null>(null);
  const [result, setResult] = useState<RunResult | null>(null);
  const [running, setRunning] = useState(false);
  const [finishing, setFinishing] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const frame = useRef<HTMLIFrameElement>(null);
  const abort = useRef<AbortController | null>(null);
  const generation = useRef(0);
  const latest = useRef<CourseProjectDraft | null>(null);
  const saveQueue = useRef<Promise<unknown>>(Promise.resolve());
  useEffect(() => {
    const id = ++generation.current;
    setDraft(null); latest.current = null; setResult(null); setError(""); setRunning(false); setFinishing(false);
    loadCourseProject(scope, project, initialCode).then(value => { if (id === generation.current) { latest.current = value; setDraft(value); setStatus("Saved on this device"); } }).catch(() => { if (id === generation.current) setError("Could not load your saved project. Reload before editing."); });
    return () => { generation.current++; abort.current?.abort(); };
  }, [scope, project.id, project.version]);
  const persist = async (next: CourseProjectDraft) => {
    latest.current = next; setDraft(next); setStatus("Saving on this device…");
    const id = generation.current;
    const pending = saveQueue.current.catch(() => {}).then(() => saveCourseProject(scope, project, next));
    saveQueue.current = pending;
    try { await pending; if (generation.current === id) setStatus("Saved on this device"); }
    catch { if (generation.current === id) { setStatus("Not saved"); setError("Your device could not save this change. Copy your code before leaving."); } throw new Error("Project could not be saved."); }
  };
  if (!draft) return <div className="panel" role="status">{error || "Loading your project…"}</div>;
  const step = project.steps[draft.step];
  const source = `${draft.step}:${draft.code}`;
  const passed = result?.source === source && !result.error && result.checks.length === step.checks.length && result.checks.every(c => c.passed);
  const completed = draft.completedSource === draft.code;
  async function run() {
    if (!latest.current || running || !frame.current) return;
    const snapshot = latest.current; const id = generation.current;
    setRunning(true); setResult(null); setError(""); abort.current = new AbortController();
    try {
      await saveQueue.current;
      const answer = await runProject(frame.current, { ...lesson, filename: project.filename, starter: project.starter, checks: project.steps[snapshot.step].checks, extraFiles: [] }, snapshot.code, abort.current.signal);
      if (id === generation.current) setResult({ ...answer, source: `${snapshot.step}:${snapshot.code}` });
    } catch (e) { if (id === generation.current) setError((e as Error).message); }
    finally { if (id === generation.current) setRunning(false); }
  }
  async function next() {
    if (!passed || !latest.current || running || finishing) return;
    setFinishing(true);
    const snapshot = latest.current;
    if (snapshot.step === project.steps.length - 1 && finishBlockedReason) { setError(finishBlockedReason); setFinishing(false); return; }
    setError("");
    try {
      if (snapshot.step < project.steps.length - 1) { await persist({ ...snapshot, step: snapshot.step + 1, updatedAt: new Date().toISOString() }); setResult(null); }
      else {
        if (project.core) await onCompleteCore(snapshot.code, result!.checks);
        await persist({ ...snapshot, completedSource: snapshot.code, updatedAt: new Date().toISOString() });
      }
    } catch (e) { setError((e as Error).message); }
    finally { setFinishing(false); }
  }
  return <section className="build-area" aria-label={project.title}>
    <div className="panel project-brief">
      <span className="small-tag">{project.core ? "COURSE PROJECT" : "EXTRA PRACTICE"} · STEP {draft.step + 1} OF {project.steps.length}</span>
      <h3>{project.title}</h3><p>{step.instruction}</p>
      <p className="muted">Use what you have covered. Change one thing, run it, then continue.</p>
    </div>
    <div className="panel editor-panel">
      <div className="editor-bar"><span>{project.filename}</span><span role="status">{status}</span></div>
      <CodeEditor code={draft.code} onChange={code => { if (finishing) return; setResult(null); void persist({ ...draft, code, completedSource: undefined, updatedAt: new Date().toISOString() }).catch(() => {}); }} runtime={lesson.runtime} unitId={`${scope}:${project.id}`} />
      <div className="editor-actions"><button className="primary" disabled={running || finishing} onClick={run}>{running ? "Running…" : "Run code"}</button>{running && <button className="secondary" onClick={() => abort.current?.abort()}>Stop</button>}
        <button className="secondary" disabled={running || finishing || draft.step === 0} onClick={() => { setResult(null); void persist({ ...draft, step: draft.step - 1, updatedAt: new Date().toISOString() }).catch(() => {}); }}>Back</button>
        <button className="primary" title={finishBlockedReason} disabled={!passed || running || finishing || completed || (draft.step === project.steps.length - 1 && !!finishBlockedReason)} onClick={next}>{draft.step < project.steps.length - 1 ? "Next" : project.core ? "Finish course project" : "Finish practice"}</button>
      </div>
    </div>
    <div className="panel result-panel guided-project-results"><h3>What your code did</h3><iframe ref={frame} title="Isolated guided project runner" sandbox="allow-scripts" className="worker-frame" src="about:blank" />
      {result && <><pre>{result.output.join("\n") || "No output yet."}</pre>{result.error && <p role="alert">{result.error}</p>}{result.checks.length > 0 && <ul className="guided-project-checks">{result.checks.map(c => <li key={c.label}><span className="guided-check-icon" aria-label={c.passed ? "Passed" : "Not passed"}>{c.passed ? "✓" : "○"}</span><span>{c.label}</span></li>)}</ul>}</>}
      {completed && <p role="status">{project.core ? "Course project complete." : "Practice complete. This extra project does not change your course XP."}</p>}
      {error && <p role="alert">{error}</p>}
      <p className="muted guided-project-save-note">Draft and step progress are saved on this device, not synced to other devices.</p>
    </div>
  </section>;
}
