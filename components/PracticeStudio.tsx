"use client";
import { useEffect, useRef, useState } from "react";
import {
  Check,
  Download,
  History,
  Lightbulb,
  Play,
  RotateCcw,
  Sparkles,
  Square,
  Upload,
} from "lucide-react";
import CodeEditor from "./CodeEditor";
import LessonContent, { CodeExample, InlineCode } from "./LessonContent";
import { providers } from "../lib/ai-providers";
import {
  practiceLesson,
  validatePracticeProject,
  type PracticeDifficulty,
  type PracticeProject,
} from "../lib/practice-project";
import {
  addPractice,
  completePractice,
  exportPracticeBackup,
  importPractices,
  loadPractices,
  parsePracticeBackup,
  practiceSource,
  practiceSourceHash,
  savePractice,
  selectPractice,
  starterPractice,
  type PracticeDraft,
  type PracticeRecord,
} from "../lib/practice-storage";
import { runProject } from "../lib/runner";
import type { Lesson, QuestState, RunResult, Unit } from "../lib/types";

type Props = {
  state: QuestState;
  online: boolean;
  visible: boolean;
  units: Unit[];
  lessons: Lesson[];
  activeId: string;
  runnerUrl: string;
  runnerToken: string;
  onOpenAISettings: () => void;
};
function download(name: string, content: string, json = false) {
  const url = URL.createObjectURL(
    new Blob([content], {
      type: json ? "application/json" : "text/plain;charset=utf-8",
    }),
  );
  const link = document.createElement("a");
  link.href = url;
  link.download = name;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
function checksPassed(
  result: RunResult,
  project: PracticeProject,
  manual: boolean,
) {
  if (result.error) return false;
  const checks = project.project.checks;
  return checks.length
    ? result.checks.length === checks.length &&
        result.checks.every(
          (check, index) => check.passed && check.label === checks[index].label,
        )
    : project.project.manualReview && !!result.manual && manual;
}
export default function PracticeStudio(props: Props) {
  const scope = props.state.draftScope;
  const latest = useRef(props);
  latest.current = props;
  const mounted = useRef(false);
  const frame = useRef<HTMLIFrameElement>(null);
  const importing = useRef<HTMLInputElement>(null);
  const abort = useRef<AbortController | null>(null);
  const sequence = useRef(0);
  const saving = useRef<Promise<unknown>>(Promise.resolve());
  const local = useRef<{
    id: string;
    code: string;
    files: Record<string, string>;
    dirty: boolean;
  }>({ id: "", code: "", files: {}, dirty: false });
  const [record, setRecord] = useState<PracticeRecord>({
    scope,
    activeId: null,
    drafts: [],
  });
  const [loaded, setLoaded] = useState(false);
  const [baseUnitId, setBaseUnitId] = useState(props.activeId);
  const [difficulty, setDifficulty] = useState<PracticeDifficulty>("beginner");
  const [idea, setIdea] = useState("");
  const [active, setActive] = useState("");
  const [code, setCode] = useState("");
  const [files, setFiles] = useState<Record<string, string>>({});
  const [currentFile, setCurrentFile] = useState("");
  const [busy, setBusy] = useState<"" | "generate" | "validate" | "run">("");
  const [error, setError] = useState("");
  const [status, setStatus] = useState("Loading saved practice…");
  const [result, setResult] = useState<RunResult | null>(null);
  const [manual, setManual] = useState(false);
  const [theory, setTheory] = useState(0);
  const [showSolution, setShowSolution] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [hint, setHint] = useState(-1);
  const [completedCurrent, setCompletedCurrent] = useState(false);
  const draft = record.drafts.find((item) => item.project.id === active);
  const project = draft?.project;
  const course = props.lessons.find((item) => item.id === baseUnitId);
  const allowed =
    props.online && props.state.profile.aiEnabled && props.state.keyConnected;
  const context = [
    scope,
    props.state.aiProvider,
    props.state.keyConnected,
    props.state.profile.aiEnabled,
    props.online,
    props.visible,
    props.activeId,
    baseUnitId,
    difficulty,
  ].join(":");
  const contextRef = useRef(context);
  contextRef.current = context;
  const adopt = (item: PracticeDraft) => {
    local.current = {
      id: item.project.id,
      code: item.code,
      files: item.files,
      dirty: false,
    };
    setActive(item.project.id);
    setCode(item.code);
    setFiles(item.files);
    setCurrentFile(item.project.project.filename);
    setResult(null);
    setManual(false);
    setTheory(0);
    setHint(-1);
    setShowSolution(false);
    setShowHistory(false);
    setStatus("Practice saved on this device.");
  };
  const validScope = () =>
    mounted.current && latest.current.state.draftScope === scope;
  const save = async () => {
    const snapshot = { ...local.current, files: { ...local.current.files } };
    if (!snapshot.id || !snapshot.dirty) return;
    const task = saving.current
      .catch(() => {})
      .then(() =>
        savePractice(scope, snapshot.id, snapshot.code, snapshot.files),
      );
    saving.current = task;
    const next = await task;
    if (!validScope()) return;
    setRecord(next);
    if (
      local.current.id === snapshot.id &&
      practiceSource(local.current.code, local.current.files) ===
        practiceSource(snapshot.code, snapshot.files)
    ) {
      local.current.dirty = false;
      setStatus("Practice saved on this device.");
    }
  };
  const report = (failure: unknown) => {
    if (!validScope() || (failure as { name?: string }).name === "AbortError")
      return;
    setError(
      failure instanceof Error
        ? failure.message
        : "This practice action could not finish. Your draft is still here.",
    );
  };
  useEffect(() => {
    mounted.current = true;
    void loadPractices(scope)
      .then((next) => {
        if (!validScope()) return;
        setRecord(next);
        const item = next.drafts.find(
          (value) => value.project.id === next.activeId,
        );
        if (item) adopt(item);
        else setStatus("Generate a practice project when you are ready.");
        setLoaded(true);
      })
      .catch((failure) => {
        report(failure);
        setLoaded(true);
      });
    return () => {
      mounted.current = false;
      abort.current?.abort();
      const snapshot = local.current;
      if (snapshot.id && snapshot.dirty)
        saving.current = saving.current
          .catch(() => {})
          .then(() =>
            savePractice(scope, snapshot.id, snapshot.code, snapshot.files),
          )
          .catch(() => {});
    };
    // Account identity is also the component key; pending work never moves accounts.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scope]);
  useEffect(() => {
    sequence.current++;
    abort.current?.abort();
    setBusy("");
  }, [context]);
  useEffect(() => {
    if (!local.current.dirty) return;
    const timer = setTimeout(() => void save().catch(report), 350);
    return () => clearTimeout(timer);
    // The saved snapshot must follow the latest document, including extra files.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code, files, active]);
  useEffect(() => {
    let cancelled = false;
    setCompletedCurrent(false);
    if (draft?.completed)
      void practiceSourceHash(code, files).then((hash) => {
        if (!cancelled)
          setCompletedCurrent(hash === draft.completed?.sourceHash);
      });
    return () => {
      cancelled = true;
    };
  }, [draft?.completed, code, files]);
  useEffect(() => {
    const warn = (event: BeforeUnloadEvent) => {
      if (local.current.dirty) {
        event.preventDefault();
        event.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, []);
  async function execute(
    practice: PracticeProject,
    source: string,
    extra: Record<string, string>,
    signal: AbortSignal,
  ) {
    const lesson = practiceLesson(practice);
    if (practice.project.runtime === "swift") {
      if (!latest.current.runnerToken)
        throw new Error(
          "Start the Mac companion in Settings and enter its temporary token before running Swift practice.",
        );
      const response = await fetch(latest.current.runnerUrl + "/run", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + latest.current.runnerToken,
        },
        body: JSON.stringify({
          code: source,
          checks: lesson.checks,
          typecheck: practice.project.manualReview,
        }),
        signal,
      });
      const reply = (await response.json()) as RunResult;
      if (!response.ok)
        throw new Error(
          reply.error ?? "The Mac companion could not run this practice.",
        );
      return reply;
    }
    if (!frame.current)
      throw new Error(
        "The practice preview is not open. Open AI practice and run again.",
      );
    return runProject(
      frame.current,
      {
        ...lesson,
        extraFiles: Object.entries(extra).map(([name, code]) => ({
          name,
          code,
        })),
      },
      source,
      signal,
    );
  }
  async function generate() {
    if (!allowed || busy || !course || !loaded) return;
    setError("");
    const captured = contextRef.current;
    const requestNumber = ++sequence.current;
    const controller = new AbortController();
    abort.current = controller;
    const current = () =>
      validScope() &&
      sequence.current === requestNumber &&
      contextRef.current === captured &&
      !controller.signal.aborted;
    setBusy("generate");
    setStatus("Creating a fresh project and explaining the ideas it needs…");
    try {
      await save();
      if (!current()) return;
      const response = await fetch("/api/practice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          baseUnitId,
          difficulty,
          idea: idea.trim(),
          deviceScope: scope,
          expectedProvider: props.state.aiProvider,
        }),
      });
      const reply = await response.json();
      if (!current()) return;
      if (!response.ok) {
        const detail =
          reply && typeof reply === "object" && "error" in reply
            ? reply.error
            : undefined;
        throw new Error(
          typeof detail === "string"
            ? detail
            : "The assistant could not create a practice project. Try again.",
        );
      }
      const created = validatePracticeProject(reply);
      if (
        created.baseUnitId !== baseUnitId ||
        created.difficulty !== difficulty ||
        created.provider !== props.state.aiProvider ||
        created.project.runtime !== course.runtime
      )
        throw new Error(
          "This reply did not match your selected topic and assistant. Generate a new project.",
        );
      let reference: PracticeDraft["reference"] = "unverified";
      const initial = starterPractice(created, reference);
      if (
        created.project.runtime !== "swift" ||
        (props.runnerToken && !created.project.manualReview)
      ) {
        setBusy("validate");
        setStatus(
          "Checking the example solution and starter in the isolated runner…",
        );
        await new Promise<void>((resolve) =>
          requestAnimationFrame(() => resolve()),
        );
        if (!current()) return;
        const sample = await execute(
          created,
          created.project.solution,
          initial.files,
          controller.signal,
        );
        if (!current()) return;
        if (!checksPassed(sample, created, false)) {
          const detail = sample.error
            ? ` The runner reported: ${sample.error.slice(0, 700)}`
            : sample.checks.some((check) => !check.passed)
              ? ` Checks to fix: ${sample.checks
                  .filter((check) => !check.passed)
                  .map((check) => check.label)
                  .join("; ")
                  .slice(0, 700)}.`
              : " The runner did not return all required checks.";
          throw new Error(
            "The generated example did not pass its own checks. This project was not saved. Generate another project." +
              detail,
          );
        }
        const starter = await execute(
          created,
          created.project.starter,
          initial.files,
          controller.signal,
        );
        if (!current()) return;
        if (checksPassed(starter, created, false))
          throw new Error(
            "The generated starter already passes every check. This project was not saved. Generate another project with work left to do.",
          );
        reference = "verified";
      }
      const next = await addPractice(scope, { ...initial, reference });
      if (!current()) return;
      setRecord(next);
      adopt(next.drafts.find((item) => item.project.id === created.id)!);
      setStatus(
        reference === "verified"
          ? "Your project is ready. The example passed its checks; start with the theory below."
          : "Your project is saved. Its generated example has not been verified; use the Mac companion and any required local review before trusting the checks.",
      );
    } catch (failure) {
      if (current()) {
        setStatus(
          "No new practice was saved. Your existing work is still here. Try generating again.",
        );
        report(failure);
      }
    } finally {
      if (sequence.current === requestNumber) {
        setBusy("");
        if (!current())
          setStatus("Generation stopped. Your saved practices are still here.");
      }
    }
  }
  async function run() {
    if (!project || busy) return;
    const snapshot = { ...local.current, files: { ...local.current.files } };
    const source = practiceSource(snapshot.code, snapshot.files);
    const requestNumber = ++sequence.current;
    const controller = new AbortController();
    abort.current = controller;
    setBusy("run");
    setResult(null);
    setError("");
    try {
      await save();
      if (
        !validScope() ||
        local.current.id !== project.id ||
        controller.signal.aborted
      )
        return;
      const reply = await execute(
        project,
        snapshot.code,
        snapshot.files,
        controller.signal,
      );
      if (
        validScope() &&
        sequence.current === requestNumber &&
        local.current.id === project.id &&
        practiceSource(local.current.code, local.current.files) === source
      )
        setResult({ ...reply, source });
    } catch (failure) {
      if (sequence.current === requestNumber) report(failure);
    } finally {
      if (sequence.current === requestNumber) setBusy("");
    }
  }
  const change = (value: string) => {
    if (!project || value.length > 60000) {
      setError("Keep each practice file below 60,000 characters.");
      return;
    }
    if (currentFile === project.project.filename) {
      local.current.code = value;
      setCode(value);
    } else {
      const next = { ...local.current.files, [currentFile]: value };
      local.current.files = next;
      setFiles(next);
    }
    local.current.dirty = true;
    setStatus("Saving your practice draft…");
    setResult(null);
  };
  const passed =
    !!project &&
    !!result &&
    result.source === practiceSource(code, files) &&
    checksPassed(result, project, manual) &&
    (!project.project.externalNotes || manual);
  async function switchPractice(id: string) {
    try {
      await save();
      if (!validScope()) return;
      abort.current?.abort();
      sequence.current++;
      setBusy("");
      const next = await selectPractice(scope, id);
      if (!validScope()) return;
      const item = next.drafts.find((value) => value.project.id === id);
      if (item) {
        setRecord(next);
        adopt(item);
      }
    } catch (failure) {
      report(failure);
    }
  }
  if (!props.visible) return null;
  return (
    <section aria-label="AI practice studio">
      <div className="page-title">
        <p className="eyebrow">EXTRA PRACTICE, YOUR WAY</p>
        <h1>Build something new.</h1>
        <p>
          Choose a topic and difficulty. Your assistant creates a fresh project
          with the explanations you need before you try it.
        </p>
      </div>
      <div className="panel content-flow">
        <h3>
          <Sparkles size={20} /> Create a practice project
        </h3>
        <label className="setting-row setting-field">
          <span>
            <b>Course topic</b>
            <small>Practice a skill from any course.</small>
          </span>
          <select
            aria-label="Practice course topic"
            value={baseUnitId}
            disabled={!!busy}
            onChange={(event) => setBaseUnitId(event.target.value)}
          >
            {props.units.map((unit) => (
              <option key={unit.id} value={unit.id}>
                {unit.track} · {unit.level} · {unit.topic}
              </option>
            ))}
          </select>
        </label>
        <label className="setting-row setting-field">
          <span>
            <b>Practice difficulty</b>
            <small>
              Beginner gives more guidance; advanced asks for more independent
              work.
            </small>
          </span>
          <select
            aria-label="Practice difficulty"
            value={difficulty}
            disabled={!!busy}
            onChange={(event) =>
              setDifficulty(event.target.value as PracticeDifficulty)
            }
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </label>
        <div className="form-field">
          <label htmlFor="practice-idea">Your idea (optional)</label>
          <input
            id="practice-idea"
            value={idea}
            maxLength={500}
            disabled={!!busy}
            placeholder="For example: a pet tracker, a small game, or a reading list"
            onChange={(event) => setIdea(event.target.value)}
          />
        </div>
        <div className="button-row">
          <button
            className="primary"
            disabled={!allowed || !!busy || !loaded}
            onClick={() => void generate()}
          >
            <Sparkles size={17} />
            {busy === "generate"
              ? "Creating project…"
              : busy === "validate"
                ? "Checking the project…"
                : "Generate practice project"}
          </button>
          {busy && (
            <button
              className="secondary"
              onClick={() => {
                abort.current?.abort();
                setStatus("Stopping… Your saved drafts stay here.");
              }}
            >
              <Square size={15} /> Stop
            </button>
          )}
        </div>
        {!allowed && (
          <p className="notice">
            {!props.online
              ? "Creating a new project needs internet. Saved practice and downloaded browser runtimes still work offline."
              : !props.state.profile.aiEnabled
                ? "Turn on AI assistance to create a project."
                : "Connect your own AI assistant to create a practice project."}
            {props.online && (
              <button className="text-button" onClick={props.onOpenAISettings}>
                Open AI settings
              </button>
            )}
          </p>
        )}
        <p className="muted">
          {props.state.keyConnected
            ? providers[props.state.aiProvider ?? "deepseek"].name
            : "Your chosen assistant"}{" "}
          creates the project. Provider API charges and limits apply. Generated
          checks help you practice; they are not a guarantee that every possible
          case is correct. Practice completion is separate from course XP.
        </p>
        <p role="status">{status}</p>
        {error && (
          <p className="notice" role="alert">
            {error}
          </p>
        )}
      </div>
      <div className="panel content-flow">
        <h3>Your saved practice</h3>
        <p className="muted">
          The latest 20 projects and 20 earlier versions per project stay with
          this account on this browser. Download a separate practice backup to
          move them to another device.
        </p>
        {!!record.drafts.length && (
          <select
            aria-label="Saved practice project"
            value={active}
            disabled={!!busy}
            onChange={(event) => void switchPractice(event.target.value)}
          >
            {record.drafts.map((item) => (
              <option key={item.project.id} value={item.project.id}>
                {item.project.project.title} · {item.project.difficulty}
              </option>
            ))}
          </select>
        )}
        <div className="button-row">
          <button
            className="secondary"
            disabled={!record.drafts.length}
            onClick={async () => {
              try {
                await save();
                const next = await loadPractices(scope);
                if (validScope())
                  download(
                    "codequest-practice-backup.json",
                    exportPracticeBackup(next),
                    true,
                  );
              } catch (failure) {
                report(failure);
              }
            }}
          >
            <Download size={16} /> Download practice backup
          </button>
          <button
            className="secondary"
            disabled={!!busy || !loaded}
            onClick={() => importing.current?.click()}
          >
            <Upload size={16} /> Restore practice backup
          </button>
        </div>
        <input
          className="sr-only"
          ref={importing}
          type="file"
          accept=".json,application/json"
          aria-label="Restore practice backup"
          onChange={async (event) => {
            const file = event.target.files?.[0];
            event.target.value = "";
            if (!file) return;
            try {
              if (file.size > 12000000)
                throw new Error("Choose a practice backup smaller than 12 MB.");
              const incoming = parsePracticeBackup(await file.text());
              if (!validScope()) return;
              await save();
              if (!validScope()) return;
              const next = await importPractices(scope, incoming);
              if (!validScope()) return;
              setRecord(next);
              const restored = next.drafts.at(-1);
              if (restored) adopt(restored);
              setStatus(
                "Practice restored. Imported checks and completion claims need a fresh run on this device.",
              );
            } catch (failure) {
              report(failure);
            }
          }}
        />
      </div>
      {project && draft && (
        <>
          <section className="panel lesson-card">
            <span className="small-tag">UNDERSTAND IT FIRST</span>
            <h2>{project.project.title}</h2>
            <p className="muted">
              {project.difficulty} · Based on{" "}
              {props.units.find((unit) => unit.id === project.baseUnitId)
                ?.topic ?? "a coding topic"}{" "}
              · Created by {providers[project.provider].name}
            </p>
            <p className="notice">
              {draft.reference === "verified"
                ? "The example solution passed these generated checks, and the starter left work to do. The checks may still miss other cases."
                : "The example solution has not been verified here. Review the explanations and run the project before relying on its checks."}
            </p>
            <div className="concept">
              <span className="small-tag">ONE IDEA AT A TIME</span>
              <LessonContent
                text={project.project.explanation[theory] ?? ""}
                runtime={project.project.runtime}
              />
              <div className="concept-controls">
                <span>
                  {theory + 1} of {project.project.explanation.length}
                </span>
                <button
                  className="text-button"
                  disabled={theory === 0}
                  onClick={() => setTheory((value) => value - 1)}
                >
                  Back
                </button>
                <button
                  className="secondary"
                  disabled={theory >= project.project.explanation.length - 1}
                  onClick={() => setTheory((value) => value + 1)}
                >
                  Next explanation
                </button>
              </div>
            </div>
            <h3>Your task</h3>
            <LessonContent
              text={project.project.task}
              runtime={project.project.runtime}
            />
            <ol className="steps">
              {project.project.steps.map((step, index) => (
                <li key={index}>
                  <InlineCode text={step} />
                </li>
              ))}
            </ol>
            <h4>What your finished project should do</h4>
            <ul className="steps">
              {project.project.requirements.map((item, index) => (
                <li key={index}>
                  <InlineCode text={item} />
                </li>
              ))}
            </ul>
            {project.project.externalNotes && (
              <LessonContent
                text={project.project.externalNotes}
                runtime={project.project.runtime}
              />
            )}
          </section>
          <div className="panel editor-panel practice-editor">
            <div className="editor-title">
              <h3>Make it work</h3>
              <span className="small-tag">{project.project.runtime}</span>
            </div>
            {(project.project.extraFiles?.length ?? 0) > 0 && (
              <div
                className="button-row"
                role="group"
                aria-label="Practice files"
              >
                {[project.project.filename, ...Object.keys(files)].map(
                  (name) => (
                    <button
                      className={
                        currentFile === name ? "secondary" : "text-button"
                      }
                      aria-pressed={currentFile === name}
                      key={name}
                      onClick={() => setCurrentFile(name)}
                    >
                      {name}
                    </button>
                  ),
                )}
              </div>
            )}
            <CodeEditor
              code={
                currentFile === project.project.filename
                  ? code
                  : (files[currentFile] ?? "")
              }
              onChange={change}
              runtime={
                currentFile.endsWith(".py")
                  ? "python"
                  : currentFile.endsWith(".sql")
                    ? "sql"
                    : currentFile.endsWith(".html")
                      ? "html"
                      : currentFile.endsWith(".css")
                        ? "css"
                        : project.project.runtime
              }
              unitId={project.id + ":" + currentFile}
            />
            <div className="editor-actions">
              <button
                className="primary"
                disabled={!!busy}
                onClick={() => void run()}
              >
                <Play size={16} />
                {busy === "run" ? "Running…" : "Run practice"}
              </button>
              {busy === "run" && (
                <button
                  className="secondary"
                  onClick={() => abort.current?.abort()}
                >
                  <Square size={15} /> Stop
                </button>
              )}
              <button
                className="secondary"
                disabled={!!busy}
                onClick={async () => {
                  if (
                    !window.confirm(
                      "Replace all practice files with their starters? Your current version will be saved in practice History first.",
                    )
                  )
                    return;
                  try {
                    await save();
                    if (!validScope() || local.current.id !== project.id)
                      return;
                    const starter = starterPractice(project, draft.reference);
                    const next = await savePractice(
                      scope,
                      project.id,
                      starter.code,
                      starter.files,
                    );
                    if (validScope() && local.current.id === project.id) {
                      setRecord(next);
                      adopt(
                        next.drafts.find(
                          (item) => item.project.id === project.id,
                        )!,
                      );
                    }
                  } catch (failure) {
                    report(failure);
                  }
                }}
              >
                <RotateCcw size={16} /> Reset starter
              </button>
              <button
                className="secondary"
                onClick={() => setShowHistory((value) => !value)}
              >
                <History size={16} /> History
              </button>
              <button
                className="secondary"
                onClick={() =>
                  download(
                    currentFile,
                    currentFile === project.project.filename
                      ? code
                      : (files[currentFile] ?? ""),
                  )
                }
              >
                <Download size={16} /> Download this file
              </button>
            </div>
            {showHistory && (
              <div className="history-list">
                {!draft.versions.length && (
                  <p>
                    No earlier versions yet. Your next change keeps the previous
                    version here.
                  </p>
                )}
                {[...draft.versions].reverse().map((version) => (
                  <button
                    className="secondary"
                    key={version.id}
                    onClick={async () => {
                      try {
                        await save();
                        if (!validScope() || local.current.id !== project.id)
                          return;
                        const next = await savePractice(
                          scope,
                          project.id,
                          version.code,
                          version.files,
                        );
                        if (validScope() && local.current.id === project.id) {
                          setRecord(next);
                          adopt(
                            next.drafts.find(
                              (item) => item.project.id === project.id,
                            )!,
                          );
                        }
                      } catch (failure) {
                        report(failure);
                      }
                    }}
                  >
                    Restore {new Date(version.savedAt).toLocaleString()}
                  </button>
                ))}
              </div>
            )}
            {project.project.runtime === "swift" && !props.runnerToken && (
              <p className="notice">
                Swift practice needs the Mac companion and its temporary token.
                Configure it in Settings, then return here.
                <button
                  className="text-button"
                  onClick={props.onOpenAISettings}
                >
                  Open Settings
                </button>
              </p>
            )}
            {(project.project.manualReview ||
              !!project.project.externalNotes) && (
              <label className="setting-row">
                <span>
                  <b>I checked the required local steps</b>
                  <small>
                    Confirm the screen or external setup yourself; a browser run
                    cannot prove those steps.
                  </small>
                </span>
                <input
                  type="checkbox"
                  checked={manual}
                  onChange={(event) => setManual(event.target.checked)}
                />
              </label>
            )}
            {result?.error && <p className="notice">{result.error}</p>}
            {result?.output.length ? (
              <pre className="output">{result.output.join("\n")}</pre>
            ) : null}
            {result?.checks.map((check, index) => (
              <div
                className={"check-result " + (check.passed ? "pass" : "fail")}
                key={index}
              >
                {check.passed ? <Check size={16} /> : <RotateCcw size={16} />}
                <span>{check.label}</span>
                <small>{check.passed ? "Passed" : "Try a change"}</small>
              </div>
            ))}
            {passed && (
              <button
                className="primary"
                disabled={completedCurrent}
                onClick={async () => {
                  try {
                    const snapshot = {
                      ...local.current,
                      files: { ...local.current.files },
                    };
                    await save();
                    if (
                      !validScope() ||
                      result?.source !==
                        practiceSource(local.current.code, local.current.files)
                    )
                      return;
                    const next = await completePractice(
                      scope,
                      project.id,
                      snapshot.code,
                      snapshot.files,
                      manual,
                    );
                    if (validScope()) {
                      setRecord(next);
                      setStatus(
                        "Practice complete. Your checked version is saved; course progress and XP are separate.",
                      );
                    }
                  } catch (failure) {
                    report(failure);
                  }
                }}
              >
                <Check size={16} />{" "}
                {completedCurrent
                  ? "Practice complete"
                  : "Mark practice complete"}
              </button>
            )}
            {completedCurrent && (
              <p className="notice">
                You completed this saved version. Editing it starts another
                attempt.
              </p>
            )}
          </div>
          <section className="panel content-flow">
            <h3>A little help when you need it</h3>
            <div className="button-row">
              <button
                className="secondary"
                disabled={hint >= project.project.hints.length - 1}
                onClick={() => setHint((value) => value + 1)}
              >
                <Lightbulb size={16} /> Give me a hint
              </button>
              <button
                className="text-button"
                onClick={() => setShowSolution((value) => !value)}
              >
                {showSolution
                  ? "Hide example solution"
                  : "Show example solution"}
              </button>
            </div>
            {hint >= 0 && (
              <LessonContent
                text={project.project.hints[hint]}
                runtime={project.project.runtime}
              />
            )}
            {showSolution && (
              <>
                <p className="muted">
                  This is one generated example. Try your own approach first;
                  passing its checks does not prove every possible case.
                </p>
                <CodeExample
                  code={project.project.solution}
                  language={
                    project.project.runtime === "react"
                      ? "jsx"
                      : project.project.runtime
                  }
                />
              </>
            )}
          </section>
        </>
      )}
      <iframe
        ref={frame}
        className="code-preview"
        title="Isolated AI practice preview"
        sandbox="allow-scripts"
        referrerPolicy="no-referrer"
        aria-hidden={busy === "validate" || undefined}
        style={
          busy === "validate"
            ? { position: "absolute", left: -10000, width: 700, height: 300 }
            : undefined
        }
        hidden={
          busy !== "validate" &&
          (!project ||
            !(
              ["html", "css", "react"].includes(project.project.runtime) ||
              (project.project.runtime === "javascript" &&
                project.project.extraFiles?.some((file) =>
                  file.name.endsWith(".html"),
                ))
            ))
        }
      />
    </section>
  );
}
