"use client";
import { projectChecks, projectProofPasses, hasTypeContracts } from "../lib/project-checks";
import { useCallback, useEffect, useEffectEvent, useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  Braces,
  Check,
  ChevronRight,
  Code2,
  Download,
  Flame,
  History,
  Lightbulb,
  Map,
  MessageCircle,
  Play,
  RotateCcw,
  Settings,
  Sparkles,
  Square,
  Star,
  Trophy,
  Upload,
  X,
  Zap,
} from "lucide-react";
import { validBookmarks, mergeBookmarks, latestBookmark, isExplicitLessonLink, type CourseBookmarks, type CourseBookmark } from "../lib/course-resume";
import { defaultProfile } from "../lib/profile";
import { deviceStatusLabel } from "../lib/device-status-label";
import { courseLearningOrder, courseLessonList } from "../lib/course-learning-order";
import LocalCourseProject from "./LocalCourseProject";
import { localProjectExamples } from "../lib/local-course-project";
import { studyLabel } from "../lib/study-label";
import { LearningClient, type DeviceStatus } from "../lib/learning-client";
import AIConnectionSettings from "./AIConnectionSettings";
import APIKeyFileSettings, {
  type APIKeyFileSettingsHandle,
} from "./APIKeyFileSettings";
import { providers, selectedModel } from "../lib/ai-providers";
import LearningSettings from "./LearningSettings";
import LessonContent, { InlineCode } from "./LessonContent";
import { GlossaryScope } from "./LessonGlossary";
import CodeEditor from "./CodeEditor";
import CourseProjectStudio from "./CourseProjectStudio";
import { projectsForLesson, missingProjectReading } from "../lib/course-projects";
import SelectionClarifier from "./SelectionClarifier";
import PythonInputLesson from "./PythonInputLesson";
import CourseTools from "./CourseTools";
import {compareCourseNames} from "../lib/course-order";
import CourseDescription from "./CourseDescription";
import CourseChooser from "./CourseChooser";
import type { PythonTool } from "../lib/python-tools";
import PythonConceptLab from "./PythonConceptLab";

import LessonContents from "./LessonContents";
import LessonStepFlow from "./LessonStepFlow";
import {getUnitContents} from "../lib/unit-toc";
import UnitTableOfContents from "./UnitTableOfContents";
import Terminology from "./Terminology";
import LessonCompletion from "./LessonCompletion";
import SavedLearning from "./SavedLearning";
import ProgressStats from "./ProgressStats";
import SavedDeviceProjects, {type DeviceProjectTarget} from "./SavedDeviceProjects";
import ReadingMark from "./ReadingMark";
import { useReadingProgress } from "../lib/reading-client";
import { getLessonHeadings } from "../lib/lesson-headings";
import { pythonConcepts, reviewedPythonFirstLesson } from "../lib/python-concepts";
import { clarificationQuestion } from "../lib/lesson-selection";
import { readProject, writeProject } from "../lib/project-files";
import { runProject } from "../lib/runner";
import {
  normalizeRoute,
  parseRoute,
  routeHash,
  topicMatches,
  type QuestRoute,
} from "../lib/navigation";
import type {
  Unit,
  Lesson,
  QuestState,
  RunResult,
  Question,
  Profile,
} from "../lib/types";

const names: Record<string, string> = {
  "csharp": "C#",
  "cpp": "C++",
  "java": "Java",
  "c": "C",
  "kotlin": "Kotlin",
  "go": "Go",
  "rust": "Rust",
  "php": "PHP",
  "ruby": "Ruby",
  "r": "R",

  ai: "AI",
  javascript: "JavaScript",
  python: "Python",
  html: "HTML",
  css: "CSS",
  sql: "SQL",
  swift: "Swift",
  typescript: "TypeScript",
  react: "React",
  backend: "Back-end development",
  "developer-toolkit": "Developer toolkit",
};
const symbols: Record<string, string> = {
  "csharp": "C#",
  "cpp": "C++",
  "java": "Jv",
  "c": "C",
  "kotlin": "Kt",
  "go": "Go",
  "rust": "Rs",
  "php": "PHP",
  "ruby": "Rb",
  "r": "R",

  ai: "AI",
  javascript: "JS",
  python: "Py",
  html: "<>",
  css: "#",
  sql: "DB",
  swift: "Sw",
  typescript: "TS",
  react: "⚛",
  backend: "API",
  "developer-toolkit": "⌘",
};
const empty: QuestState = {
  draftScope: "",
  profile: defaultProfile,
  progress: [],
  xp: 0,
  streak: 0,
  todayCompleted: 0,
  completed: 0,
  keyConnected: false,
  aiProvider: null,
  tutorUsed: 0,
  recentDays: [],
};
type Chat = { question: string; answer: string };
type ApiReply = QuestState & {
  error?: string;
  state: QuestState;
  correct: boolean;
  feedback: string;
  history: { id: string; code: string; createdAt: string }[];
  chat: Chat[];
  answer: string;
};
const readResponse = (r: Response) => r.json() as Promise<ApiReply>;
function download(name: string, text: string) {
  const url = URL.createObjectURL(
    new Blob([text], { type: "text/plain;charset=utf-8" }),
  );
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
function Choices({
  q,
  onAnswer,
  passed,
}: {
  q: Question;
  onAnswer: (n: number) => void;
  passed: boolean;
}) {
  return (
    <div className="choices" role="group" aria-label={q.question}>
      {q.choices.map((v, i) => (
        <button key={i} className="choice" onClick={() => onAnswer(i)}>
          {passed && i === q.answer ? (
            <Check size={18} />
          ) : (
            <span className="choice-letter">{String.fromCharCode(65 + i)}</span>
          )}
          <span>
            <InlineCode text={v} />
          </span>
          <ChevronRight size={17} />
        </button>
      ))}
    </div>
  );
}
export default function CodeQuest({
  units,
  lessons,
  localMode = false,
}: {
  units: Unit[];
  lessons: Lesson[];
  localMode?: boolean;
}) {
  const orderedUnits = useMemo(() => courseLearningOrder(units), [units]);
  const device = useMemo(() => new LearningClient(lessons, empty), [lessons]);
  const request = useCallback((action: Parameters<LearningClient["mutate"]>[0]) =>
    device.mutate(action) as Promise<ApiReply>, [device]);
  const [deviceStatus, setDeviceStatus] = useState<DeviceStatus>({
    online: true,
    pending: 0,
    syncing: false,
    storageAvailable: true,
    conflict: null,
    error: "",
  });
  const [helperText, setHelperText] = useState("");
  const [selectedCourseProject, setSelectedCourseProject] = useState("");
  const [progressProject, setProgressProject] = useState<DeviceProjectTarget & {scope: string}>();
  const [returnToProject, setReturnToProject] = useState<string | null>(null);
  const [state, setState] = useState<QuestState>(empty),
    [ready, setReady] = useState(false),
    [view, setView] = useState("quest"),
    [terminologyReturn, setTerminologyReturn] = useState(false),
    [tocOpen, setTocOpen] = useState(false),
    [coursesOpen, setCoursesOpen] = useState(true),
    [editorJump, setEditorJump] = useState(0),
    [inputJump, setInputJump] = useState<{index:number;token:number}>(),
    [studioMode, setStudioMode] = useState<"course" | "practice">("course"),
    [phase, setPhase] = useState("learn"),
    [activeId, setActiveId] = useState("javascript-01"),
    [code, setCode] = useState(""),
    [projectFiles, setProjectFiles] = useState<Record<string, string>>({}),
    [currentFile, setCurrentFile] = useState(""),
    [result, setResult] = useState<RunResult | null>(null),
    [running, setRunning] = useState(false),
    [completing, setCompleting] = useState(false),
    [saveStatus, setSaveStatus] = useState("Loading your quest…"),
    [error, setError] = useState(""),
    [feedback, setFeedback] = useState(""),
    [paragraph, setParagraph] = useState(0),
    [conceptTarget, setConceptTarget] = useState<string | undefined>(undefined),
    [hint, setHint] = useState(-1),
    [chat, setChat] = useState<Chat[]>([]),
    [question, setQuestion] = useState(""),
    [tutorMode, setTutorMode] = useState("explain"),
    [tutorBusy, setTutorBusy] = useState(false),
    [pendingPassage, setPendingPassage] = useState(""),
    [history, setHistory] = useState<
      { id: string; code: string; createdAt: string }[]
    >([]),
    [showHistory, setShowHistory] = useState(false),
    [search, setSearch] = useState(""),
    [celebrate, setCelebrate] = useState(false),
    [runnerToken, setRunnerToken] = useState(""),
    [manualReviewed, setManualReviewed] = useState(false),
    [navigationReady, setNavigationReady] = useState(false);
  const [courseBookmarks, setCourseBookmarks] = useState<CourseBookmarks>({});
  const bookmarksRef = useRef<CourseBookmarks>({});
  const [resumeOffer, setResumeOffer] = useState<CourseBookmark | null>(null);
  const bookmarkSignature = useRef("");
  const reading = useReadingProgress(state.draftScope);
  const [tutorHidden, setTutorHidden] = useState(true);
  const [flowBackTarget, setFlowBackTarget] = useState<string | null>(null);
  // The side-by-side contents list becomes a full row above the lesson on a phone.
  // Close it when entering that layout, so the current idea stays in view.
  useEffect(() => {
    const dock = window.matchMedia("(min-width: 1100px)");
    const onLayoutChange = (event: MediaQueryListEvent) => {
      if (!event.matches) setTocOpen(false);
    };
    dock.addEventListener("change", onLayoutChange);
    return () => dock.removeEventListener("change", onLayoutChange);
  }, []);
  // eslint-disable-next-line react-hooks/set-state-in-effect -- Consume the backward-entry marker after the new keyed reader mounts.
  useEffect(() => setFlowBackTarget(null), [activeId, paragraph]);
  useEffect(() => {
    try {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- Restore the account-specific browser preference after hydration.
      setTutorHidden(
        state.draftScope
          ? localStorage.getItem(
              "codequest-buddy-hidden-" + state.draftScope,
            ) !== "false"
          : true,
      );
    } catch {
      setTutorHidden(true);
    }
  }, [state.draftScope]);
  const toggleTutor = () => {
    const next = !tutorHidden;
    setTutorHidden(next);
    try {
      if (state.draftScope)
        localStorage.setItem(
          "codequest-buddy-hidden-" + state.draftScope,
          String(next),
        );
    } catch {
      /* The visibility choice still works for this visit. */
    }
  };
  const [, setNoteSection] = useState<{
    lessonId: string;
    key: string;
  } | null>(null);
  const [, setLabContext] = useState<{
    code: string;
    explanation: string;
  } | null>(null);
  const frame = useRef<HTMLIFrameElement>(null),
    abort = useRef<AbortController | null>(null),
    codeRef = useRef(""),
    filesRef = useRef<Record<string, string>>({}),
    unitRef = useRef(activeId),
    draftScope = useRef(""),
    saving = useRef<Promise<unknown>>(Promise.resolve()),
    isDirty = useRef(false),
    completionLock = useRef(false),
    backupFile = useRef<HTMLInputElement>(null),
    conceptStart = useRef<HTMLDivElement>(null),
    theoryFocusRequested = useRef(false),
    lessonArea = useRef<HTMLElement>(null),
    tutorPanel = useRef<HTMLElement>(null),
    tutorAbort = useRef<AbortController | null>(null),
    tutorSequence = useRef(0),
    tutorFlight = useRef(false),
    tutorContextRef = useRef(""),
    apiKeyFileSettings = useRef<APIKeyFileSettingsHandle>(null),
    mainContent = useRef<HTMLElement>(null),
    navigationReplace = useRef(true),
    navigationPreferences = useRef<Promise<unknown>>(Promise.resolve()),
    navigationSequence = useRef(0),
    navigationPending = useRef(""),
    lastLocation = useRef(""),
    previousView = useRef(""),
    viewScroll = useRef<Record<string, number>>({});
  useEffect(() => {
    if (!theoryFocusRequested.current) return;
    theoryFocusRequested.current = false;
    conceptStart.current?.focus({ preventScroll: true });
    conceptStart.current?.scrollIntoView({ block: "start", behavior: "auto" });
  }, [paragraph]);
  const unit =
    units.find((u) => u.id === activeId) ??
    units.find((u) => u.id === "javascript-01") ??
    units[0];
  const lesson = lessons.find((l) => l.id === unit?.id);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- Restore the selected saved project when the account or lesson changes.
    try { setSelectedCourseProject(localStorage.getItem(`codequest-project-choice:${state.draftScope}:${activeId}`) ?? ""); }
    catch { setSelectedCourseProject(""); }
  }, [state.draftScope, activeId]);
  const chooseCourseProject = (id: string) => {
    setProgressProject(undefined);
    setSelectedCourseProject(id);
    try { localStorage.setItem(`codequest-project-choice:${state.draftScope}:${activeId}`, id); } catch {}
  };
  const isConcept = lesson?.learningMode === "concept";
  // Concept-only tracks can retain a JavaScript project runtime; reading help follows the taught language.
  const readingLanguage = isConcept && unit && ["csharp", "cpp", "java", "c", "kotlin", "go", "rust", "php", "ruby", "r"].includes(unit.track) ? unit.track : lesson?.runtime ?? "";
  useEffect(()=>{if(!editorJump || view !== "studio" || studioMode !== "course" || phase !== "build")return;const frame=requestAnimationFrame(()=>{const target=document.getElementById("course-project-editor");target?.scrollIntoView({block:"start"});target?.focus({preventScroll:true});});return()=>cancelAnimationFrame(frame);},[editorJump,view,studioMode,phase]);

  const syncLabel = deviceStatusLabel(deviceStatus, localMode);
  const availableCourseProjects = projectsForLesson(activeId);
  const openedProject = progressProject?.scope === state.draftScope && progressProject.lessonId === activeId ? progressProject : undefined;
  const selectedProject = availableCourseProjects.find(p => p.id === (openedProject?.guidedId ?? selectedCourseProject)) ?? availableCourseProjects[0];
  const projectReadingMissing = lesson ? missingProjectReading(lesson, reading.records) : [];
  const progress = state.progress.find((p) => p.unitId === unit?.id);
  const tutorContext = [
    state.draftScope,
    activeId,
    view,
    phase,
    paragraph,
    state.aiProvider,
    selectedModel(state.aiProvider ?? "deepseek", state.profile.aiModels?.[state.aiProvider ?? "deepseek"]).id,
    state.keyConnected,
    state.profile.aiEnabled,
    deviceStatus.online,
  ].join(":");
  useEffect(() => {
    tutorContextRef.current = tutorContext;
    tutorSequence.current++;
    tutorAbort.current?.abort();
    tutorFlight.current = false;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- Clear cancelled external requests when the tutor context changes.
    setTutorBusy(false);
    setPendingPassage("");
    return () => {
      tutorAbort.current?.abort();
    };
  }, [tutorContext]);
  const visible = useMemo(
    () =>
      orderedUnits.filter(
        (u) =>
          u.track === state.profile.track &&
          u.level === state.profile.level &&
          topicMatches(u.topic, u.project.title, search),
      ),
    [orderedUnits, state.profile.track, state.profile.level, search],
  );
  const courseLessons = useMemo(() => courseLessonList(orderedUnits, lessons, unit?.track), [orderedUnits, lessons, unit?.track]);
  const courseIndex = courseLessons.findIndex(item => item.id === activeId);
  const nextLesson = courseIndex >= 0 ? courseLessons[courseIndex + 1] : undefined;
  const missingReadingKey = isConcept ? projectReadingMissing[0] : undefined;
  const missingParagraph = missingReadingKey ? Number(missingReadingKey.split(":")[1]) : 0;
  const missingHeading = lesson && missingReadingKey ? getLessonHeadings(lesson.id)[missingParagraph] : "";
  const canFinishConcept = reading.loaded && reading.online && !reading.error &&
    !missingReadingKey && !Object.values(reading.pending).some(Boolean);
  const draftKey = (id: string) =>
    "codequest-draft-" + draftScope.current + "-" + id;
  const loadLesson = (
    id: string,
    records: QuestState["progress"],
    resetPosition = true,
  ) => {
    const lesson = lessons.find((l) => l.id === id);
    if (!lesson) return;
    const saved = records.find((p) => p.unitId === id)?.code;
    let local: string | null = null;
    try {
      if (draftScope.current) local = localStorage.getItem(draftKey(id));
    } catch {}
    const initial = readProject(local ?? saved, lesson);
    filesRef.current = initial.files;
    setProjectFiles(initial.files);
    setCurrentFile(lesson.filename);
    codeRef.current = initial.code;
    unitRef.current = id;
    setCode(initial.code);
    isDirty.current = !!local && local !== saved;
    setResult(null);
    setFeedback("");
    if (resetPosition) setParagraph(0);
    setHint(-1);
    setHelperText("");
    setHistory([]);
    setChat([]);
    setManualReviewed(false);
    setShowHistory(false);
    abort.current?.abort();
    device
      .detail(id)
      .then((d) => {
        if (unitRef.current === id) {
          setHistory(d.history ?? []);
          setChat(d.chat ?? []);
        }
      })
      .catch(() => {});
  };
  const saveCode = async () => {
    const snapshot = writeProject(codeRef.current, filesRef.current),
      id = unitRef.current;
    if (!isDirty.current) {
      await saving.current;
      return;
    }
    setSaveStatus("Saving…");
    const task = saving.current
      .catch(() => {})
      .then(() => request({ action: "save", unitId: id, code: snapshot }));
    saving.current = task;
    const d = await task;
    setState((s) => ({ ...s, progress: d.progress }));
    if (
      writeProject(codeRef.current, filesRef.current) === snapshot &&
      unitRef.current === id &&
      saving.current === task
    ) {
      isDirty.current = false;
      try {
        localStorage.removeItem(draftKey(id));
      } catch {}
      setSaveStatus(
        device.status.pending
          ? "Saved on this device · waiting to sync"
          : "Your work is saved",
      );
    }
  };
  const autosave = useEffectEvent(() => {
    saveCode().catch((e) => {
      setError(e.message);
      setSaveStatus("Save failed — draft kept on this device");
    });
  });
  useEffect(() => {
    const off = device.subscribe((s, d) => {
      setState(s);
      setDeviceStatus(d);
      if (!isDirty.current)
        setSaveStatus(
          d.pending
            ? "Saved on this device · waiting to sync"
            : "Your work is saved",
        );
    });
    device
      .initialize()
      .then(async (d) => {
        draftScope.current = d.draftScope;
        let saved: Partial<QuestRoute> = {};
        try {
          saved = JSON.parse(
            localStorage.getItem("codequest-navigation-" + d.draftScope) ??
              "{}",
          );
        } catch {}
        let localBookmarks: CourseBookmarks = {};
        try { localBookmarks = validBookmarks(JSON.parse(localStorage.getItem("codequest-course-resume-" + d.draftScope) ?? "{}"), units, lessons); } catch {}
        const bookmarks = mergeBookmarks(validBookmarks(d.profile.courseBookmarks, units, lessons), localBookmarks);
        // Migrate the previous single-browser bookmark without resetting any progress.
        const oldUnit = units.find(u => u.id === saved.activeId);
        if (oldUnit && !bookmarks[oldUnit.track] && (saved.view === "quest" || (saved.view === "studio" && saved.studioMode !== "practice"))) {
          bookmarks[oldUnit.track] = { ...normalizeRoute(saved, oldUnit.id, units, lessons), savedAt: new Date().toISOString() };
        }
        bookmarksRef.current = bookmarks;
        setCourseBookmarks(bookmarks);
        const latest = latestBookmark(bookmarks);
        const linked = parseRoute(location.hash, d.profile.activeUnit, units, lessons);
        const restored = safeRoute(
          (isExplicitLessonLink(location.hash) ? linked : null) ??
          (latest ? { ...latest, ...(linked && linked.view !== "quest" ? {view: linked.view} : {}) } : null) ??
          linked ?? normalizeRoute(saved, d.profile.activeUnit, units, lessons), d,
        );
        if (latest && (restored.view === "quest" || restored.view === "studio") && isExplicitLessonLink(location.hash) && routeHash(restored) !== routeHash(latest)) setResumeOffer(latest);
        if (restored.activeId !== d.profile.activeUnit) {
          const selected = units.find((u) => u.id === restored.activeId)!;
          d = await request({
            action: "preferences",
            settings: {
              activeUnit: selected.id,
              track: selected.track,
              level: selected.level,
            },
          });
        }
        setState(d);
        setActiveId(restored.activeId);
        loadLesson(restored.activeId, d.progress, false);
        setView(restored.view);
        setStudioMode(restored.studioMode);
        setPhase(restored.phase);
        setParagraph(restored.paragraph);
        setConceptTarget(restored.concept);
        if (restored.concept) setNoteSection({lessonId: restored.activeId,key:"concept:"+restored.concept});
        setReady(true);
        setNavigationReady(true);
        setSaveStatus(
          device.status.pending
            ? "Saved on this device · waiting to sync"
            : "Your work is saved",
        );
      })
      .catch((e) => {
        setError(e.message);
        setSaveStatus("Saved progress is unavailable");
      });
    const online = () => device.connectivity(true).catch(() => {}),
      offline = () => device.connectivity(false).catch(() => {});
    window.addEventListener("online", online);
    window.addEventListener("offline", offline);
    const retry = setInterval(() => {
      if (
        navigator.onLine &&
        device.current.profile.autoSync &&
        (device.status.pending || !device.status.online)
      )
        device.sync().catch(() => {});
    }, 15000);
    return () => {
      off();
      window.removeEventListener("online", online);
      window.removeEventListener("offline", offline);
      clearInterval(retry);
    };
    // Loading a different save must never replace the open editor automatically.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [device]);
  function safeRoute(route: QuestRoute, account: QuestState): QuestRoute {
    const concept = lessons.find(l => l.id === route.activeId)?.learningMode === "concept";
    if (route.view === "quest" && route.phase === "build") return {...route, view:"studio"};
    if (route.phase === "math") return { ...route, view:"studio", phase: "build" };
    if (
      route.phase === "done" &&
      !account.progress.some(
        (p) => p.unitId === route.activeId && p.completedAt,
      )
    )
      return { ...route, view: concept ? "quest" : "studio", phase: concept ? "practice" : "build" };
    return route;
  }
  const applyLocation = useEffectEvent(async () => {
    const linked = parseRoute(location.hash, activeId, units, lessons);
    const parsed = linked?.view === "quest" && !isExplicitLessonLink(location.hash)
      ? latestBookmark(bookmarksRef.current) ?? linked : linked;
    if (!parsed) {
      navigationSequence.current++;
      navigationPending.current = "";
      historyReplaceCurrent();
      return;
    }
    const target = safeRoute(parsed, state),
      signature = routeHash(target);
    if (
      signature === routeHash({ view, studioMode, phase, activeId, paragraph, concept: conceptTarget })
    ) {
      if (
        navigationPending.current &&
        navigationPending.current !== signature
      ) {
        navigationSequence.current++;
        navigationPending.current = "";
      }
      window.history.replaceState(window.history.state, "", signature);
      return;
    }
    if (navigationPending.current === signature) return;
    navigationPending.current = signature;
    const sequence = ++navigationSequence.current;
    try {
      if (target.activeId !== unitRef.current) {
        await saveCode();
        if (sequence !== navigationSequence.current) return;
        loadLesson(target.activeId, device.current.progress, false);
      }
      navigationReplace.current = true;
      setActiveId(target.activeId);
      setView(target.view);
      setStudioMode(target.studioMode);
      setPhase(target.phase);
      setParagraph(target.paragraph);
      setConceptTarget(target.concept);
      if (target.concept) setNoteSection({lessonId: target.activeId,key:"concept:"+target.concept});
      window.history.replaceState(window.history.state, "", signature);
    } catch (e) {
      if (sequence !== navigationSequence.current) return;
      setError((e as Error).message);
      historyReplaceCurrent();
    } finally {
      if (sequence === navigationSequence.current)
        navigationPending.current = "";
    }
  });
  function historyReplaceCurrent() {
    window.history.replaceState(
      window.history.state,
      "",
      routeHash({ view, studioMode, phase, activeId, paragraph, concept: conceptTarget }),
    );
  }
  useEffect(() => {
    if (!navigationReady) return;
    const changed = () => {
      void applyLocation();
    };
    window.addEventListener("popstate", changed);
    window.addEventListener("hashchange", changed);
    return () => {
      window.removeEventListener("popstate", changed);
      window.removeEventListener("hashchange", changed);
    };
  }, [navigationReady]);
  useEffect(() => {
    if (!navigationReady) return;
    const route = { view, studioMode, phase, activeId, paragraph, concept: conceptTarget },
      hash = routeHash(route);
    if (navigationPending.current && navigationPending.current !== hash) {
      navigationSequence.current++;
      navigationPending.current = "";
    }
    if (location.hash !== hash) {
      if (navigationReplace.current)
        window.history.replaceState(window.history.state, "", hash);
      else window.history.pushState(null, "", hash);
    }
    navigationReplace.current = false;
    try {
      localStorage.setItem(
        "codequest-navigation-" + draftScope.current,
        JSON.stringify(route),
      );
    } catch {}
    if ((view === "quest" || (view === "studio" && studioMode === "course")) && !resumeOffer) {
      const selected = units.find(u => u.id === activeId);
      const bookmarkRoute = { ...route, studioMode: "course" as const };
      const signature = routeHash(bookmarkRoute);
      if (selected && signature !== bookmarkSignature.current) {
        bookmarkSignature.current = signature;
        const bookmark = { ...bookmarkRoute, savedAt: new Date().toISOString() };
        const updated = { ...bookmarksRef.current, [selected.track]: bookmark };
        bookmarksRef.current = updated;
        setCourseBookmarks(updated);
        try { localStorage.setItem("codequest-course-resume-" + draftScope.current, JSON.stringify(updated)); } catch {}
        // Queue immediately, using the same account-scoped offline sync as code drafts.
        void request({ action: "preferences", settings: { courseBookmarks: { [selected.track]: bookmark } } }).catch(e => {
          bookmarkSignature.current = "";
          setError("Your study position could not sync to your account: " + e.message);
        });
      }
    }
    const labels: Record<string, string> = {
      quest: "Your quest",
      studio: "Build studio",
      path: "Skill path",
      terminology: "Terminology",
      tools: "Tools and concepts",
      progress: "Your progress",
      settings: "Settings",
    };
    document.title =
      (labels[view] ?? "Your quest") +
      (view === "quest" || (view === "studio" && studioMode === "course")
        ? " · " + (lesson?.title ?? "Course")
        : "") +
      " — CodeQuest";
    if (
      lastLocation.current &&
      lastLocation.current.split("&idea=")[0] !== hash.split("&idea=")[0]
    ) {
      mainContent.current?.focus({ preventScroll: true });
      window.scrollTo({
        top:
          previousView.current !== view ? (viewScroll.current[view] ?? 0) : 0,
        behavior: "instant",
      });
    }
    lastLocation.current = hash;
    previousView.current = view;
  }, [
    view,
    studioMode,
    phase,
    activeId,
    paragraph,
    conceptTarget,
    navigationReady,
    request,
    units,
    lesson?.title,
    resumeOffer,
  ]);
  useEffect(() => {
    const saveScroll = () => {
      if (previousView.current)
        viewScroll.current[previousView.current] = window.scrollY;
    };
    window.addEventListener("scroll", saveScroll, { passive: true });
    return () => window.removeEventListener("scroll", saveScroll);
  }, []);
  useEffect(() => {
    if (!ready || !lesson || !isDirty.current) return;
    const timer = setTimeout(autosave, 1000);
    return () => clearTimeout(timer);
  }, [code, projectFiles, activeId, ready, lesson]);
  useEffect(() => {
    const warn = (e: BeforeUnloadEvent) => {
      if (isDirty.current) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, []);
  const changeCode = (s: string) => {
    if (completionLock.current) return;
    codeRef.current = s;
    setCode(s);
    isDirty.current = true;
    setSaveStatus("Unsaved changes");
    setResult(null);
    try {
      localStorage.setItem(
        draftKey(unitRef.current),
        writeProject(s, filesRef.current),
      );
    } catch {
      setError(
        "The device draft could not be stored. Keep this tab open until the server save finishes.",
      );
    }
  };
  const changeFile = (value: string) => {
    if (completionLock.current) return;
    if (!lesson) return;
    if (currentFile === lesson.filename) {
      changeCode(value);
      return;
    }
    const next = { ...filesRef.current, [currentFile]: value };
    filesRef.current = next;
    setProjectFiles(next);
    isDirty.current = true;
    setSaveStatus("Unsaved changes");
    setResult(null);
    try {
      localStorage.setItem(
        draftKey(unitRef.current),
        writeProject(codeRef.current, next),
      );
    } catch {
      setError(
        "Your device draft could not be stored. Keep this tab open until the server save finishes.",
      );
    }
  };
  const restoreProject = (raw: string) => {
    if (completionLock.current) return;
    if (!lesson) return;
    const project = readProject(raw, lesson);
    filesRef.current = project.files;
    setProjectFiles(project.files);
    setCurrentFile(lesson.filename);
    changeCode(project.code);
  };
  const prefs = async (p: Partial<Profile>) => {
    const d = await request({ action: "preferences", settings: p });
    setState(d);
    if (phase === "math") setPhase("build");
  };
  const select = async (id: string, entry?: Pick<PythonTool, "paragraph" | "concept">, destination: "quest" | "path" | "studio" = "quest", projectTarget?: DeviceProjectTarget) => {
    if (completionLock.current) return;
    const sequence = ++navigationSequence.current;
    const nextPhase = destination === "studio" ? "build" : "learn";
    navigationPending.current = routeHash({
      view: destination,
      studioMode: destination === "studio" ? "course" : studioMode,
      phase: nextPhase,
      activeId: id,
      paragraph: entry?.paragraph ?? 0,
      concept: entry?.concept,
    });
    try {
      await saveCode();
      if (sequence !== navigationSequence.current) return;
      abort.current?.abort();
      const u = units.find((v) => v.id === id)!;
      // Serialize remote navigation preferences so an older response cannot
      // overwrite the newest selected course on storage-limited browsers.
      const pending = navigationPreferences.current.catch(() => {}).then(() => {
        if (sequence !== navigationSequence.current) return null;
        return request({
          action: "preferences",
          settings: { activeUnit: id, track: u.track, level: u.level },
        });
      });
      navigationPreferences.current = pending;
      const d = await pending;
      if (!d) return;
      if (sequence !== navigationSequence.current) return;
      setState(d);
      setActiveId(id);
      loadLesson(id, d.progress);
      setParagraph(entry?.paragraph ?? 0);
      setConceptTarget(entry?.concept);
      if (id === "python-input" && entry) setInputJump({index: entry.paragraph, token: Date.now()});
      if (entry?.concept) setNoteSection({lessonId:id,key:"concept:"+entry.concept});
      if (destination === "studio") {
        setStudioMode("course");
        setProgressProject(projectTarget && {...projectTarget, scope:d.draftScope});
      }
      setView(destination);
      setPhase(nextPhase);
      setResumeOffer(null);
    } catch (e) {
      if (sequence === navigationSequence.current)
        setError((e as Error).message);
    } finally {
      if (sequence === navigationSequence.current)
        navigationPending.current = "";
    }
  };
  const resumeCourse = async (bookmark: CourseBookmark, destination?: "path") => {
    if (completionLock.current) return;
    const sequence = ++navigationSequence.current;
    const selected = units.find(u => u.id === bookmark.activeId);
    if (!selected) return;
    const restored = safeRoute(bookmark, device.current);
    navigationPending.current = routeHash({ ...restored, view: destination ?? restored.view });
    try {
      await saveCode();
      if (sequence !== navigationSequence.current) return;
      abort.current?.abort();
      const pending = navigationPreferences.current.catch(() => {}).then(() => {
        if (sequence !== navigationSequence.current) return null;
        return request({ action: "preferences", settings: { activeUnit: selected.id, track: selected.track, level: selected.level } });
      });
      navigationPreferences.current = pending;
      const d = await pending;
      if (!d || sequence !== navigationSequence.current) return;
      setState(d);
      loadLesson(selected.id, d.progress, false);
      setActiveId(selected.id);
      setParagraph(restored.paragraph);
      setConceptTarget(restored.concept);
      setStudioMode(restored.studioMode);
      setPhase(restored.phase);
      setView(destination ?? restored.view);
      setResumeOffer(null);
    } finally {
      if (sequence === navigationSequence.current) navigationPending.current = "";
    }
  };
  const finishConcept = async () => {
    if (!canFinishConcept || completionLock.current) return;
    const id = activeId;
    completionLock.current = true;
    setCompleting(true);
    try {
      await reading.refresh();
      const data = await request({action:"completeConcept", unitId:id});
      if (unitRef.current !== id) return;
      setState(data);
      if (nextLesson) {
        completionLock.current = false;
        await select(nextLesson.id);
      }
      if (unitRef.current === id) setPhase("done");
    } catch (error) {
      setError((error as Error).message);
    } finally {
      completionLock.current = false;
      setCompleting(false);
    }
  };
  const changeCourse = async (track: string) => {
    const bookmark = bookmarksRef.current[track];
    if (bookmark) { setSearch(""); await resumeCourse(bookmark, "path"); return; }
    const target = orderedUnits.find(u => u.track === track && u.level === "beginner")
      ?? orderedUnits.find(u => u.track === track);
    if (!target) throw new Error("This course has no available lesson yet.");
    setSearch("");
    await select(target.id, undefined, "path");
  };
  const answer = async (kind: "quiz" | "math", n: number) => {
    try {
      const d = await request({ action: kind, unitId: activeId, answer: n });
      setState(d.state);
      setFeedback(
        (d.correct ? "You got it. " : "Try once more. ") + (d.feedback ?? ""),
      );
    } catch (e) {
      setError((e as Error).message);
    }
  };
  const run = async () => {
    if (!lesson || running) return;
    const runId = activeId,
      runSource = activeId + ":" + writeProject(code, projectFiles);
    setRunning(true);
    setError("");
    setResult(null);
    await saveCode().catch((e) => setError(e.message));
    abort.current = new AbortController();
    try {
      let r: RunResult;
      if (lesson.runtime === "swift") {
        if (!runnerToken)
          throw new Error(
            "Start the Mac runner from Settings, then paste its temporary token here. SwiftUI projects open in Xcode.",
          );
        const response = await fetch(state.profile.runnerUrl + "/run", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + runnerToken,
          },
          body: JSON.stringify({
            code,
            checks: lesson.checks,
            typecheck: lesson.checks.length === 0,
          }),
          signal: abort.current.signal,
        });
        r = (await response.json()) as RunResult;
        if (!response.ok) throw new Error(r.error ?? "Could not run Swift.");
      } else
        r = await runProject(
          frame.current!,
          {
            ...lesson,
            extraFiles: Object.entries(projectFiles).map(([name, code]) => ({
              name,
              code,
            })),
          },
          code,
          abort.current.signal,
        );
      if (unitRef.current === runId) setResult({ ...r, source: runSource });
    } catch (e) {
      if (unitRef.current !== runId) return;
      setResult({
        output: [],
        checks: [],
        error:
          (e as Error).name === "AbortError"
            ? "Run stopped."
            : (e as Error).message,
      });
    } finally {
      setRunning(false);
    }
  };
  const passed =
    !!result &&
    result.source === activeId + ":" + writeProject(code, projectFiles) &&
    !result.error &&
    lesson &&
    (projectProofPasses(lesson, result.checks) ||
      (!lesson.checks.length &&
        lesson.runtime === "swift" &&
        !!result.manual &&
        manualReviewed));
  const complete = async () => {
    if (!result || !lesson || !passed || completionLock.current) return;
    const completionUnit = activeId,
      completionSource = writeProject(code, projectFiles);
    completionLock.current = true;
    setCompleting(true);
    try {
      if (lesson.externalNotes && !hasTypeContracts(lesson) && !manualReviewed)
        throw new Error(
          "Review your local project steps and tick the confirmation first.",
        );
      await saveCode();
      if (
        unitRef.current !== completionUnit ||
        writeProject(codeRef.current, filesRef.current) !== completionSource
      )
        throw new Error(
          "Your project changed. Run its checks again before finishing.",
        );
      const d = await request({
        action: "complete",
        unitId: completionUnit,
        code: completionSource,
        checks: result.checks,
        manualReview: manualReviewed,
      });
      setState(d);
      if (
        unitRef.current !== completionUnit ||
        writeProject(codeRef.current, filesRef.current) !== completionSource
      )
        return;
      setPhase("done");
      if (!state.profile.calm && state.profile.rewardsEnabled) {
        setCelebrate(true);
        setTimeout(() => setCelebrate(false), 3000);
      }
    } catch (e) {
      setError((e as Error).message);
    } finally {
      completionLock.current = false;
      setCompleting(false);
    }
  };
  const ask = async (passage?: string) => {
    const selected = passage !== undefined;
    const q = selected ? clarificationQuestion(passage) : question.trim();
    if (
      !q.trim() ||
      !lesson ||
      tutorFlight.current ||
      !state.profile.aiEnabled ||
      !state.keyConnected ||
      !deviceStatus.online
    )
      return;
    const id = activeId,
      scope = device.scope,
      context = tutorContext,
      expectedProvider = state.aiProvider ?? "deepseek",
      expectedModel = selectedModel(expectedProvider, state.profile.aiModels?.[expectedProvider]).id,
      sequence = ++tutorSequence.current;
    const current = () =>
      sequence === tutorSequence.current &&
      tutorContextRef.current === context &&
      unitRef.current === id &&
      device.scope === scope &&
      device.current.profile.aiEnabled &&
      device.current.keyConnected &&
      (device.current.aiProvider ?? "deepseek") === expectedProvider &&
      selectedModel(expectedProvider, device.current.profile.aiModels?.[expectedProvider]).id === expectedModel &&
      device.status.online;
    tutorFlight.current = true;
    tutorAbort.current = new AbortController();
    setTutorBusy(true);
    setError("");
    if (selected) {
      setPendingPassage(passage);
      setTutorHidden(false);
      requestAnimationFrame(() => {
        tutorPanel.current?.focus({ preventScroll: true });
        tutorPanel.current?.scrollIntoView({
          block: "nearest",
          behavior: "auto",
        });
      });
    } else setQuestion("");
    try {
      await device.sync(true);
      if (!current()) return;
      if (device.status.pending)
        throw new Error(
          "Sync your learning settings before asking the AI assistant.",
        );
      const r = await fetch("/api/tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: tutorAbort.current.signal,
        body: JSON.stringify({
          unitId: id,
          expectedProvider,
          expectedModel,
          deviceScope: scope,
          question: q,
          code: code.slice(0, 15000),
          mode: selected ? "explain" : tutorMode,
          history: chat.slice(-6).flatMap((c) => [
            { role: "user", content: c.question },
            { role: "assistant", content: c.answer },
          ]),
        }),
      });
      const d = await readResponse(r);
      if (!current()) return;
      if (!r.ok) throw new Error(d.error);
      setChat((c) => [...c, { question: q, answer: d.answer }]);
      const refreshed = await fetch("/api/quest").then((r) => readResponse(r));
      if (current() && refreshed.profile && refreshed.draftScope === scope)
        setState((s) => ({ ...s, tutorUsed: refreshed.tutorUsed }));
    } catch (e) {
      if (!current() || (e as Error).name === "AbortError") return;
      setError((e as Error).message);
      if (!selected) setQuestion((draft) => draft || q);
    } finally {
      if (sequence === tutorSequence.current) {
        tutorFlight.current = false;
        setTutorBusy(false);
        setPendingPassage("");
      }
    }
  };
  const exportBackup = async () => {
    await saveCode();
    const d = device.current;
    download(
      "codequest-backup.json",
      JSON.stringify(
        {
          format: "codequest-1",
          exportedAt: new Date().toISOString(),
          profile: d.profile,
          progress: d.progress,
        },
        null,
        2,
      ),
    );
  };
  const importBackup = async (file: File) => {
    try {
      if (file.size > 7_000_000)
        throw new Error("Choose a backup smaller than 7 MB.");
      const data = JSON.parse(await file.text());
      if (data.format !== "codequest-1" || !Array.isArray(data.progress))
        throw new Error("Choose a CodeQuest backup file.");
      await saveCode();
      if (completionLock.current)
        throw new Error(
          "Wait for project completion to finish, then restore your files.",
        );
      const d = await request({ action: "import", backup: data.progress });
      setState(d);
      const restored = d.progress.find(
        (p: { unitId: string }) => p.unitId === activeId,
      );
      if (restored) {
        const restoredProject = readProject(restored.code, lesson!);
        codeRef.current = restoredProject.code;
        filesRef.current = restoredProject.files;
        setProjectFiles(restoredProject.files);
        setCode(restoredProject.code);
        setResult(null);
      }
      setFeedback(
        "Your project files were restored. Completion records stay tied to checked lessons.",
      );
    } catch (e) {
      setError((e as Error).message);
    }
  };
  useEffect(() => {
    const context = (
      navigator as unknown as {
        modelContext?: {
          registerTool: (tool: unknown) => void;
          unregisterTool: (name: string) => void;
        };
      }
    ).modelContext;
    if (!context) return;
    try {
      context.registerTool({
        name: "open_lesson",
        description: "Open a visible CodeQuest lesson by ID.",
        inputSchema: {
          type: "object",
          properties: { id: { type: "string" } },
          required: ["id"],
        },
        execute: async ({ id }: { id: string }) => {
          if (!units.some((u) => u.id === id))
            throw new Error("Unknown lesson");
          await select(id);
          return { content: [{ type: "text", text: "Opened " + id }] };
        },
      });
      context.registerTool({
        name: "run_project",
        description: "Run the current project and show its checks.",
        inputSchema: { type: "object", properties: {} },
        execute: async () => {
          setPhase("build");
          await run();
          return {
            content: [{ type: "text", text: "Project run displayed." }],
          };
        },
      });
      context.registerTool({
        name: "show_skill_path",
        description: "Show courses and progress.",
        inputSchema: { type: "object", properties: {} },
        execute: async () => {
          setView("path");
          return { content: [{ type: "text", text: "Skill path shown." }] };
        },
      });
    } catch {}
    return () => {
      for (const n of ["open_lesson", "run_project", "show_skill_path"])
        try {
          context.unregisterTool(n);
        } catch {}
    }; // Tool registration observes current project actions.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeId, code, ready, running]);
  return (
    <div
      className={
        "app simple-learning " +
        state.profile.theme +
        (state.profile.calm ? " calm" : "") +
        (!state.profile.analogiesEnabled ? " no-analogies" : "") +
        (!state.profile.rewardsEnabled ? " no-rewards" : "") +
        (state.profile.largeText ? " large-reading" : "")
      }
    >
      <a
        className="skip-link"
        href="#main-content"
        onClick={(event) => {
          event.preventDefault();
          mainContent.current?.focus();
          mainContent.current?.scrollIntoView({ block: "start" });
        }}
      >
        Skip to learning content
      </a>
      <header className="topbar">
        <a
          className="brand"
          href="#quest"
          aria-label="CodeQuest home"
          onClick={(event) => {
            event.preventDefault();
            setView("quest");
          }}
        >
          <span className="brand-icon">
            <Code2 size={26} />
          </span>
          <span>
            CodeQuest<small>A little practice. A real skill.</small>
          </span>
        </a>
        <div className="top-stats">
          <span>
            <Flame size={19} /> {state.streak} day
            {state.streak !== 1 ? "s" : ""}
          </span>
          <span className="xp">
            <Zap size={19} />
            {state.xp} XP
          </span>
          <button
            className="icon-button"
            onClick={() => setView("settings")}
            aria-label="Settings"
          >
            <Settings size={21} />
          </button>
        </div>
        <div className="workspace-toolbar">
          <button id="unit-toc-toggle" type="button" className="secondary unit-toc-toggle" disabled={!ready || !lesson} aria-expanded={tocOpen && (view === "quest" || (view === "studio" && studioMode === "course"))} aria-controls="unit-table-of-contents" onKeyDown={event=>{if(event.key === "Escape" && tocOpen){event.preventDefault();event.stopPropagation();setTocOpen(false);}}} onClick={()=>{if(view !== "quest" && !(view === "studio" && studioMode === "course")){setView("quest");setPhase("learn");setTocOpen(true);}else setTocOpen(value=>!value);}}>Table of Contents <Map size={17}/></button>
          <nav aria-label="Main navigation">
            {[
              { id: "quest", label: "Learn", icon: BookOpen },
              { id: "studio", label: "Projects", icon: Braces },
              { id: "path", label: "Courses", icon: Map },
              { id: "terminology", label: "Terminology", icon: BookOpen },
              { id: "progress", label: "Progress", icon: Trophy },
            ].map((n) => (
              <button
                key={n.id}
                className={view === n.id ? "nav-item active" : "nav-item"}
                aria-current={view === n.id ? "page" : undefined}
                onClick={() => {
                  setView(n.id);
                  if (n.id === "studio") setPhase("build");
                  if (n.id === "quest") setPhase("learn");
                }}
              >
                <n.icon size={20} />
                {n.label}
                {view === n.id && <span className="nav-dot" />}
              </button>
            ))}
          </nav>
          <div className="buddy-visibility">
            {(state.profile.aiEnabled || state.profile.hintsEnabled) && <button type="button" className="secondary buddy-toggle-button" disabled={!ready || !lesson} aria-controls="coding-buddy-panel" aria-expanded={!tutorHidden && (view === "quest" || (view === "studio" && studioMode === "course"))} onClick={()=>{if(view !== "quest" && !(view === "studio" && studioMode === "course")){setView("quest");setPhase("learn");if(tutorHidden)toggleTutor();}else toggleTutor();}}>{tutorHidden || !(view === "quest" || (view === "studio" && studioMode === "course")) ? "Show coding buddy" : "Hide coding buddy"}<MessageCircle size={16}/></button>}
          </div>
        </div>
      </header>
      <div className={"shell" + (tocOpen && ready && lesson && (view === "quest" || (view === "studio" && studioMode === "course")) ? " toc-docked" : "")}>

        {ready && lesson && (view === "quest" || (view === "studio" && studioMode === "course")) && (
                      <UnitTableOfContents open={tocOpen} title={lesson.title}
                        courseName={names[unit.track]} lessons={courseLessons} lessonId={activeId}
                        onLesson={id => {
                          if (!window.matchMedia("(min-width: 1100px)").matches) setTocOpen(false);
                          void select(id);
                        }} items={lesson.id === "python-01" ? pythonConcepts.map((c,i)=>({label:reviewedPythonFirstLesson[c.id].title,paragraphIndex:i})) : getUnitContents(lesson)} active={lesson.id === "python-01" ? pythonConcepts.findIndex(c=>c.id===conceptTarget) : paragraph} onClose={()=>{setTocOpen(false);document.getElementById("unit-toc-toggle")?.focus();}} onSelect={index=>{
                        if (!window.matchMedia("(min-width: 1100px)").matches) setTocOpen(false);
                        theoryFocusRequested.current = true; setView("quest"); setPhase("learn");
                        if(lesson.id === "python-01") {const concept=pythonConcepts[index];setConceptTarget(concept.id);setNoteSection({lessonId:lesson.id,key:"concept:"+concept.id});}
                        else {setParagraph(index);setNoteSection({lessonId:lesson.id,key:"text:"+index});if(lesson.id === "python-input")setInputJump({index,token:Date.now()});}
                      }}/>
        )}
        <main
          id="main-content"
          ref={mainContent}
          tabIndex={-1}
          aria-label="Learning workspace"
          inert={completing}
        >
          {ready && syncLabel && (
            <div className="device-status" role="status">
              <span>{syncLabel}</span>
              {(deviceStatus.pending > 0 ||
                deviceStatus.conflict ||
                deviceStatus.error) && (
                <button
                  className="text-button"
                  onClick={() => setView("settings")}
                >
                  Review sync
                </button>
              )}
            </div>
          )}
          {error && (
            <div className="notice error" role="alert">
              <span>{error}</span>
              <button onClick={() => setError("")} aria-label="Dismiss error">
                <X size={18} />
              </button>
            </div>
          )}
          {!ready && (
            <div className="panel loading">
              <Sparkles size={30} />
              <h1>Getting your quest ready…</h1>
              <p>Your courses and saved projects will appear here.</p>
              <button onClick={() => location.reload()} className="secondary">
                Try loading again
              </button>
            </div>
          )}
          {ready && resumeOffer && <div className="notice" role="status"><span>You opened a lesson link. Your saved place is {lessons.find(l => l.id === resumeOffer.activeId)?.title}, idea {resumeOffer.paragraph + 1}.</span><button className="primary" onClick={() => void resumeCourse(resumeOffer).catch(e => setError(e.message))}>Resume where I left off</button><button className="secondary" onClick={() => setResumeOffer(null)}>Stay at this lesson</button></div>}
          {ready && terminologyReturn && view === "quest" && <div className="notice"><span>Your terminology search is kept.</span><button type="button" className="secondary" onClick={()=>{setView("terminology");setTerminologyReturn(false);}}>Back to Terminology</button></div>}
          {ready && returnToProject && phase === "learn" && <div className="notice"><span>Your project draft is waiting.</span><button className="secondary" onClick={() => { chooseCourseProject(returnToProject); setReturnToProject(null); setView("studio"); setPhase("build"); }}>Back to project</button></div>}
          {ready && view === "studio" && (
            <div
              className="button-row studio-mode"
              role="group"
              aria-label="Build studio mode"
            >
              <button
                className={studioMode === "course" ? "primary" : "secondary"}
                aria-pressed={studioMode === "course"}
                onClick={() => setStudioMode("course")}
              >
                Course project
              </button>
              {(!isConcept || (unit && lesson && localProjectExamples(unit,lesson).length > 0)) && <button type="button" className="secondary editor-jump-button" aria-controls="course-project-editor" onClick={()=>{setStudioMode("course");setPhase("build");setEditorJump(value=>value+1);}}>Editor <Braces size={17}/></button>}
            </div>
          )}
          {ready &&
            (view === "quest" ||
              (view === "studio" && studioMode === "course")) &&
            lesson &&
            unit && (
              <>
                <div
                  className={"workspace" + (tutorHidden ? " buddy-hidden" : "")}
                >
                  <section
                    className="lesson-area"
                    ref={lessonArea}
                    tabIndex={-1}
                  >
                    <SelectionClarifier
                      root={lessonArea}
                      context={tutorContext}
                      online={deviceStatus.online}
                      enabled={state.profile.aiEnabled}
                      connected={state.keyConnected}
                      busy={tutorBusy}
                      provider={providers[state.aiProvider ?? "deepseek"].name}
                      dark={state.profile.theme === "dark"}
                      onExplain={(text) => {
                        void ask(text);
                      }}
                      onSettings={() => setView("settings")}
                    />
                    <div className="lesson-heading">
                      <div>
                        <p className="eyebrow">
                          {(view === "studio" && studioMode === "course" ? "Current lesson · " : "") + names[unit.track] + " · " + unit.level}
                        </p>
                        <h1>{lesson.title}</h1>
                        {view === "studio" && studioMode === "course" && (
                          <p className="project-lesson-context">These projects are for this lesson. Choose a different lesson to see its projects.</p>
                        )}
                      </div>

                    </div>
                    {view === "quest" && (["python", "javascript", "html", "css", "typescript", "react", "sql", "swift"].includes(unit.track) || ["backend", "developer-toolkit", "ai"].includes(unit.track)) && !!unit.prerequisite_ids?.length && (
                      <aside className="project-prerequisites" aria-label="Earlier ideas for this lesson">
                        <p>Earlier ideas you can revisit:</p>
                        <div className="project-study-links">
                          {unit.prerequisite_ids.map(id => units.find(item => item.id === id)).filter((item): item is Unit => !!item).map(prior => (
                            <button key={prior.id} className="secondary project-study-button" onClick={() => select(prior.id)}>
                              {studyLabel(prior.topic)}
                            </button>
                          ))}
                        </div>
                      </aside>
                    )}
                    {view === "quest" && <div
                      className="phase-nav"
                      role="group"
                      aria-label="Lesson steps"
                    >
                      {[
                        { id: "learn", name: "Learn", n: 1 },
                        { id: "practice", name: "Try it", n: 2 },
                      ].map((p) => (
                        <button
                          key={p.id}
                          className={phase === p.id ? "selected" : ""}
                          aria-pressed={phase === p.id}
                          onClick={() => {
                            setPhase(p.id);
                            if (!window.matchMedia("(min-width: 1100px)").matches) setTocOpen(false);
                            setFeedback("");
                          }}
                        >
                          <span>
                            {(p.id === "practice" && progress?.quizPassed) ? (
                              <Check size={13} />
                            ) : (
                              p.n
                            )}
                          </span>
                          {p.name}
                        </button>
                      ))}
                    </div>}
                    {phase === "learn" && (
                      <div className="panel lesson-card">
                        <span className="small-tag">ONE IDEA AT A TIME</span>
                        <button className="text-button" onClick={()=>setView("tools")}>Browse tools and concepts</button>
                        {lesson.id === "python-input" && <PythonInputLesson lesson={lesson} jumpTo={inputJump} resumeScope={state.draftScope} onContinue={()=>setPhase("practice")} onParagraphChange={setParagraph} renderReadingMark={index=><ReadingMark reading={reading} lessonId={lesson.id} sectionKey={"text:"+index} sectionTitle={getLessonHeadings(lesson.id)[index]} />} />}
                        {lesson.id === "python-01" && (
                          <PythonConceptLab
                            key={state.draftScope + ":" + lesson.id}
                            lesson={lesson}
                            simple
                            targetConcept={conceptTarget}
                            resumeScope={state.draftScope}
                            onContinue={() => setPhase("practice")}
                            renderReadingMark={(id, title) => (
                              <ReadingMark
                                reading={reading}
                                lessonId={lesson.id}
                                sectionKey={"concept:" + id}
                                sectionTitle={title}
                              />
                            )}
                            onConceptChange={(id) => {
                              setConceptTarget(id);
                              setNoteSection({
                                lessonId: lesson.id,
                                key: "concept:" + id,
                              });
                            }}
                            onContextChange={(next) =>
                              setLabContext((previous) =>
                                previous?.code === next.code &&
                                previous.explanation === next.explanation
                                  ? previous
                                  : next,
                              )
                            }
                          />
                        )}
                        {!["python-01", "python-input"].includes(lesson.id) && <details
                          className={
                            "original-lesson" +
                            (lesson.id === "python-01"
                              ? " supplementary-reading"
                              : " primary-reading")
                          }
                          open={!["python-01", "python-input"].includes(lesson.id) || paragraph > 0}
                          onToggle={(event) => {
                            if (event.currentTarget.open)
                              setNoteSection({
                                lessonId: lesson.id,
                                key: "text:" + paragraph,
                              });
                          }}
                        >
                          <summary>
                            {lesson.id === "python-01"
                              ? "Written lesson"
                              : "Written lesson"}
                          </summary>
                          <div
                            className="concept"
                            ref={conceptStart}
                            tabIndex={-1}
                            role="region"
                            aria-label={`Theory idea ${paragraph + 1} of ${lesson.explanation.length}`}
                          >
                            <LessonContents
                              lessonId={lesson.id}
                              simple
                              index={paragraph}
                              onSelect={(index) => {
                                setParagraph(index);
                                setNoteSection({
                                  lessonId: lesson.id,
                                  key: "text:" + index,
                                });
                              }}
                            >
                              <LessonStepFlow
                                key={lesson.id + ":" + paragraph}
                                resumeKey={state.draftScope ? `codequest-microstep-${state.draftScope}:${lesson.id}:${paragraph}` : undefined}
                                referenceVisual={{ unitId: lesson.id, paragraph }}
                                title={getLessonHeadings(lesson.id)[paragraph]}
                                text={
                                  lesson.explanation[
                                    Math.min(
                                      paragraph,
                                      lesson.explanation.length - 1,
                                    )
                                  ]
                                }
                                runtime={readingLanguage}
                            reviewedLesson={lesson.id.startsWith("python-") || lesson.id.startsWith("javascript-") || lesson.id.startsWith("html-") || lesson.id.startsWith("css-") || lesson.id.startsWith("typescript-") || lesson.id.startsWith("react-") || lesson.id.startsWith("sql-") || lesson.id.startsWith("swift-") || lesson.id.startsWith("backend-") || lesson.id.startsWith("developer-toolkit-") || lesson.id.startsWith("ai-") || lesson.id.startsWith("csharp-") || lesson.id.startsWith("cpp-") || lesson.id.startsWith("java-") || lesson.id.startsWith("c-") || lesson.id.startsWith("kotlin-") || lesson.id.startsWith("rust-") || lesson.id.startsWith("php-") || lesson.id.startsWith("ruby-") || lesson.id.startsWith("r-") || lesson.id.startsWith("go-")}
                                startAtEnd={
                                  flowBackTarget === lesson.id + ":" + paragraph
                                }
                                backDisabled={paragraph === 0}
                                onBack={() => {
                                  theoryFocusRequested.current = true;
                                  setFlowBackTarget(
                                    lesson.id +
                                      ":" +
                                      Math.max(0, paragraph - 1),
                                  );
                                  setNoteSection({
                                    lessonId: lesson.id,
                                    key: "text:" + Math.max(0, paragraph - 1),
                                  });
                                  setParagraph((p) => Math.max(0, p - 1));
                                }}
                                onNext={() => {
                                  if (
                                    paragraph <
                                    lesson.explanation.length - 1
                                  ) {
                                    theoryFocusRequested.current = true;
                                    setNoteSection({
                                      lessonId: lesson.id,
                                      key: "text:" + (paragraph + 1),
                                    });
                                    setParagraph((p) => p + 1);
                                  } else setPhase("practice");
                                }}
                                completion={
                                  !["python-01", "python-input"].includes(lesson.id) ? (
                                    <ReadingMark
                                      reading={reading}
                                      lessonId={lesson.id}
                                      sectionKey={"text:" + paragraph}
                                      sectionTitle={
                                        getLessonHeadings(lesson.id)[paragraph]
                                      }
                                    />
                                  ) : undefined
                                }
                              />

                            </LessonContents>
                          </div>
                        </details>}


                      </div>
                    )}
                    <div className="lesson-utilities">
                      <details className="progress-disclosure">
                        <summary>Lesson progress</summary>
                        <LessonCompletion
                          lesson={lesson}
                          progress={progress}
                          reading={reading}
                        />
                      </details>
                    </div>
                    {phase === "practice" && (
                      <div className="panel lesson-card">
                        <span className="small-tag">A QUICK CHECK</span>
                        <LessonContent
                          glossary
                          text={lesson.quiz.question}
                          runtime={readingLanguage}
                          as="h3"
                        />
                        <p>
                          Take your time. If you miss it, you can try again.
                        </p>
                        <Choices
                          q={lesson.quiz}
                          passed={!!progress?.quizPassed}
                          onAnswer={(n) => answer("quiz", n)}
                        />
                        {feedback && (
                          <div className="notice" role="status">
                            <InlineCode text={feedback} />
                          </div>
                        )}
                        {!!progress?.quizPassed && !isConcept && (
                          <button
                            className="primary"
                            onClick={() => {
                              setView("studio"); setPhase("build");
                              setFeedback("");
                            }}
                          >
                            Build your project <ArrowRight size={17} />
                          </button>
                        )}
                      </div>
                    )}
                    {phase === "practice" && isConcept && !!progress?.quizPassed && <div className="panel concept-finish">
                      {progress.completedAt ? <>
                        <p>This lesson is complete.</p>
                        <button className="primary" onClick={() => nextLesson ? void select(nextLesson.id) : setView("path")}>
                          {nextLesson ? "Next lesson: " + nextLesson.title : "Back to courses"}
                        </button>
                      </> : <>
                        {missingReadingKey && reading.loaded && <div className="concept-reading-step">
                          <p>If you’ve read “{missingHeading}”, mark it here.</p>
                          <ReadingMark key={missingReadingKey} reading={reading} lessonId={lesson.id} sectionKey={missingReadingKey} sectionTitle={missingHeading} />
                          <button className="secondary" onClick={() => {
                            setParagraph(missingParagraph);
                            setNoteSection({lessonId: lesson.id, key: missingReadingKey});
                            setPhase("learn");
                          }}>Read this idea</button>
                        </div>}
                        {!reading.loaded && !reading.error && reading.online && <p>Loading your reading progress…</p>}
                        {!reading.online && <p>Reconnect to save lesson completion. You can keep learning offline.</p>}
                        {reading.error && !missingReadingKey && <p role="alert">{reading.error}</p>}
                        {reading.error && (!reading.loaded || !missingReadingKey) && <button className="secondary" onClick={() => void reading.refresh()}>Reload reading progress</button>}
                        <button className="primary" disabled={completing || !canFinishConcept} onClick={() => void finishConcept()}>
                          {completing ? "Saving…" : nextLesson ? "Finish and continue to " + nextLesson.title : "Finish lesson"}
                        </button>
                        {!canFinishConcept && <button className="secondary" onClick={() => nextLesson ? void select(nextLesson.id) : setView("path")}>
                          {nextLesson ? "Next lesson without finishing: " + nextLesson.title : "Back to courses"}
                        </button>}
                      </>}
                    </div>}
                    {phase === "build" && isConcept && <LocalCourseProject key={`${state.draftScope}:${lesson.id}`} unit={unit} lesson={lesson} scope={state.draftScope} initialExampleId={openedProject?.exampleId} onStudy={index=>{setView("quest");setPhase("learn");setParagraph(index);}} />}
                    {phase === "build" && !isConcept && selectedProject && (
                      <>
                        <div className="panel project-brief"><h3>Choose a Python Basics project</h3>
                          <p>Use the same small set of skills in different situations.</p>
                          <div className="course-project-choices">{availableCourseProjects.map(project => <button key={project.id} className={selectedProject.id === project.id ? "primary" : "secondary"} aria-pressed={selectedProject.id === project.id} onClick={() => chooseCourseProject(project.id)}>{project.title}</button>)}</div>
                          <p>{selectedProject.description ?? (selectedProject.core ? "Create a short introduction from a name and an age." : "Change an age and let your program calculate next year’s age.")}</p>
                          <p><strong>What you will make:</strong> {selectedProject.outcome ?? (selectedProject.core ? "A printed pet introduction using named values." : "A numeric result that updates when the starting age changes.")}</p>
                          <section className="project-skills"><h4>Skills this project uses</h4><p>{(selectedProject.skills ?? ["Strings", "Number values", "Names", "Assignment", "print", ...(selectedProject.quantitative ? ["Adding one"] : [])]).join(" · ")}</p>
                            <div className="project-study-links">{pythonConcepts.map(concept => <button className="secondary project-study-button" key={concept.id} onClick={() => { setReturnToProject(selectedProject.id); setView("quest"); setPhase("learn"); setConceptTarget(concept.id); }}>{studyLabel(reviewedPythonFirstLesson[concept.id].title)}</button>)}</div>
                            <p className="muted">Finish requires saved reading marks for these skills and a passed Try it exercise. You can edit and run before finishing.</p>
                          </section>
                        </div>
                        <div id="course-project-editor" tabIndex={-1}><CourseProjectStudio key={JSON.stringify([state.draftScope, selectedProject.id, selectedProject.version])} project={selectedProject} lesson={lesson} finishBlockedReason={!reading.loaded ? "Reading progress is loading. You can edit and run while it loads." : reading.error ? "Reading progress could not be checked. You can keep editing; retry before finishing." : projectReadingMissing.length ? "Finish requires the reading marks listed in Skills this project uses. You can edit and run now." : undefined} scope={state.draftScope} initialCode={selectedProject.core ? progress?.code : undefined} onCompleteCore={async (source, checks) => {
                          if (!reading.loaded || reading.error || projectReadingMissing.length) throw new Error("Save the six reading marks before finishing. Your draft is kept.");
                          if (!progress?.quizPassed) throw new Error("Finish the Try it exercise before finishing the course project. Your draft is saved here.");
                          if (completionLock.current) throw new Error("Project completion is already being saved.");
                          completionLock.current = true;
                          try {
                            await request({ action: "save", unitId: lesson.id, code: source });
                            const completed = await request({ action: "complete", unitId: lesson.id, code: source, checks });
                            setState(completed);
                          } finally { completionLock.current = false; }
                          if (unitRef.current === lesson.id) restoreProject(source);
                        }} /></div>

                      </>
                    )}
                    {phase === "build" && !isConcept && !selectedProject && (
                      <div className="build-area">
                        <div className="panel project-brief">
                          <div className="heading-row">
                            <h3>{unit.project.title}</h3>
                            <span className="small-tag">MADE BY YOU</span>
                          </div>
                          <GlossaryScope key={lesson.id} text={[unit.project.task, ...lesson.steps].join(" ")} runtime={readingLanguage} wordsLabel="Words in these instructions">
                          <p><InlineCode text={unit.project.task} /></p>
                          {hasTypeContracts(lesson) && <p className="type-contract-notice">These checks test your types as well as your results. Keep type checking enabled. Do not use comments that tell TypeScript to skip errors for this exercise.</p>}
                          <ol className="steps">
                            {lesson.steps.map((s, i) => (
                              <li key={i}>
                                <InlineCode text={s} />
                              </li>
                            ))}
                          </ol>
                          </GlossaryScope>
                          <details>
                            <summary>What finished looks like</summary>
                            <p>{unit.project.done_when}</p>
                            {projectChecks(lesson).map((c) => (
                              <p key={c.label} className="check-line">
                                <Check size={16} />
                                {c.label}
                              </p>
                            ))}
                          </details>
                          {lesson.externalNotes && (
                            <div className="external-note">
                              <b>{hasTypeContracts(lesson) ? "Optional type-error practice" : "Part of this project runs on your computer"}</b>
                              <p>{lesson.externalNotes}</p>
                              {!hasTypeContracts(lesson) && <label className="checkbox">
                                <input
                                  type="checkbox"
                                  checked={manualReviewed}
                                  onChange={(e) =>
                                    setManualReviewed(e.target.checked)
                                  }
                                />
                                I’ve also checked the steps in my local project.
                              </label>}
                            </div>
                          )}
                        </div>
                        <div id="course-project-editor" tabIndex={-1} className="panel editor-panel">
                          <div className="editor-bar">
                            <span>
                              <Code2 size={17} />
                              {Object.keys(projectFiles).length ? (
                                <select
                                  aria-label="Project file"
                                  value={currentFile}
                                  onChange={(e) =>
                                    setCurrentFile(e.target.value)
                                  }
                                >
                                  <option value={lesson.filename}>
                                    {lesson.filename}
                                  </option>
                                  {Object.keys(projectFiles).map((name) => (
                                    <option key={name} value={name}>
                                      {name}
                                    </option>
                                  ))}
                                </select>
                              ) : (
                                lesson.filename
                              )}
                            </span>
                            <span className="save-indicator" role="status">
                              {saveStatus}
                            </span>
                          </div>
                          <CodeEditor
                            code={
                              currentFile === lesson.filename
                                ? code
                                : (projectFiles[currentFile] ?? "")
                            }
                            onChange={changeFile}
                            runtime={
                              currentFile.endsWith(".py")
                                ? "python"
                                : currentFile.endsWith(".sql")
                                  ? "sql"
                                  : currentFile.endsWith(".html")
                                    ? "html"
                                    : currentFile.endsWith(".css")
                                      ? "css"
                                      : lesson.runtime
                            }
                            unitId={activeId + ":" + currentFile}
                          />
                          <div className="editor-actions">
                            <button
                              className="primary"
                              onClick={run}
                              disabled={running}
                            >
                              <Play size={16} />
                              {running ? "Running…" : "Run project"}
                            </button>
                            {running && (
                              <button
                                className="secondary"
                                onClick={() => abort.current?.abort()}
                              >
                                <Square size={14} />
                                Stop
                              </button>
                            )}
                            <button
                              className="icon-button"
                              aria-label="Start again from starter code"
                              onClick={async () => {
                                if (
                                  !confirm(
                                    "Replace your code with the starter? Your current code will be saved first and available in History.",
                                  )
                                )
                                  return;
                                const id = activeId,
                                  scope = device.scope;
                                try {
                                  await saveCode();
                                  if (
                                    unitRef.current !== id ||
                                    device.scope !== scope
                                  )
                                    return;
                                  restoreProject(lesson.starter);
                                } catch (e) {
                                  setError((e as Error).message);
                                }
                              }}
                            >
                              <RotateCcw size={18} />
                            </button>
                            <button
                              className="icon-button"
                              onClick={async () => {
                                const id = activeId,
                                  scope = device.scope;
                                try {
                                  await saveCode();
                                  const d = await device.detail(id);
                                  if (
                                    unitRef.current !== id ||
                                    device.scope !== scope
                                  )
                                    return;
                                  setHistory(d.history);
                                  setShowHistory((v) => !v);
                                } catch (e) {
                                  setError((e as Error).message);
                                }
                              }}
                              aria-label="Saved code history"
                              aria-expanded={showHistory}
                              aria-controls="course-code-history"
                            >
                              <History size={18} />
                            </button>
                            <button
                              className="icon-button"
                              onClick={() =>
                                download(
                                  currentFile,
                                  currentFile === lesson.filename
                                    ? code
                                    : (projectFiles[currentFile] ?? ""),
                                )
                              }
                              aria-label="Download code"
                            >
                              <Download size={18} />
                            </button>
                          </div>
                        </div>
                        {showHistory && (
                          <div
                            className="panel history-panel"
                            id="course-code-history"
                          >
                            <h3>Your earlier saves</h3>
                            <p>
                              Pick a version to restore it. Your current code is
                              saved first.
                            </p>
                            {!history.length && (
                              <p>Your next saved change will appear here.</p>
                            )}
                            {history.map((h) => (
                              <button
                                className="history-row"
                                key={h.id}
                                onClick={async () => {
                                  const id = activeId,
                                    scope = device.scope;
                                  try {
                                    await saveCode();
                                    if (
                                      unitRef.current !== id ||
                                      device.scope !== scope
                                    )
                                      return;
                                    restoreProject(h.code);
                                    setShowHistory(false);
                                  } catch (e) {
                                    setError((e as Error).message);
                                  }
                                }}
                              >
                                <History size={17} />
                                {new Date(h.createdAt).toLocaleString()}
                                <span>Restore</span>
                              </button>
                            ))}
                          </div>
                        )}
                        {lesson.extraFiles
                          ?.filter((f) => f.name !== "setup.sql")
                          .map((f) => (
                            <details
                              key={f.name}
                              className="panel companion-file"
                            >
                              <summary>
                                {f.name} <Download size={16} />
                              </summary>
                              <pre>{projectFiles[f.name] ?? f.code}</pre>
                              <button
                                className="secondary"
                                onClick={() =>
                                  download(
                                    f.name,
                                    projectFiles[f.name] ?? f.code,
                                  )
                                }
                              >
                                Download this file
                              </button>
                            </details>
                          ))}
                        <div className="panel result-panel">
                          <div className="heading-row">
                            <h3>
                              {["html", "css", "react"].includes(
                                lesson.runtime,
                              ) ||
                              (lesson.runtime === "javascript" &&
                                !!lesson.extraFiles?.some((f) =>
                                  f.name.endsWith(".html"),
                                ))
                                ? "Your live preview"
                                : "What your code did"}
                            </h3>
                            {passed && (
                              <span className="success-label">
                                <Check size={16} />
                                {result?.manual
                                  ? "Local review confirmed"
                                  : "Checks passed"}
                              </span>
                            )}
                          </div>
                          <iframe
                            ref={frame}
                            title="Isolated project preview"
                            sandbox="allow-scripts"
                            className={
                              ["html", "css", "react"].includes(
                                lesson.runtime,
                              ) ||
                              (lesson.runtime === "javascript" &&
                                !!lesson.extraFiles?.some((f) =>
                                  f.name.endsWith(".html"),
                                ))
                                ? "code-preview"
                                : "worker-frame"
                            }
                            src="about:blank"
                            onLoad={() => {
                              if (frame.current)
                                frame.current.dataset.ready = "yes";
                            }}
                          />
                          <p className="sr-only" role="status">
                            {running
                              ? "Running your project."
                              : result
                                ? result.error
                                  ? "Your project needs a change. Check the error below."
                                  : `${result.checks.filter((c) => c.passed).length} of ${result.checks.length} checks passed. ${result.checks.every((c) => c.passed) ? "Review your result below." : "Check the suggestions below."}`
                                : ""}
                          </p>
                          {!result && (
                            <p className="muted">
                              Run your project to see what happens.
                            </p>
                          )}
                          {result?.error && (
                            <pre className="run-error" role="alert">
                              {result.error}
                            </pre>
                          )}
                          {result?.output.length ? (
                            <pre className="output">
                              {result.output.join("\n")}
                            </pre>
                          ) : (
                            result &&
                            !result.error &&
                            !(
                              ["html", "css", "react"].includes(
                                lesson.runtime,
                              ) ||
                              (lesson.runtime === "javascript" &&
                                !!lesson.extraFiles?.some((f) =>
                                  f.name.endsWith(".html"),
                                ))
                            ) && (
                              <p className="muted">
                                Your code ran without printed output.
                              </p>
                            )
                          )}
                          {result?.checks.map((c, i) => (
                            <div
                              key={i}
                              className={
                                "check-result " + (c.passed ? "pass" : "fail")
                              }
                            >
                              {c.passed ? (
                                <Check size={17} />
                              ) : (
                                <RotateCcw size={17} />
                              )}
                              <span>{c.label}</span>
                              <small>
                                {c.passed ? "Passed" : "Try a change"}
                              </small>
                            </div>
                          ))}
                          {result?.manual && !result.error && (
                            <p className="notice">
                              The Swift file compiled. Check its screen in
                              Xcode, then confirm the local review above.
                            </p>
                          )}
                          {passed && (
                            <button
                              className="primary"
                              onClick={complete}
                            >
                              Finish this quest{" "}
                              <ArrowRight size={17} />
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                    {phase === "done" && (
                      <div className="panel done-card">
                        <div className="reward-icon">
                          <Trophy size={46} />
                        </div>
                        <p className="eyebrow">{isConcept ? "LESSON COMPLETE" : "YOU MADE IT WORK"}</p>
                        <h2>{isConcept ? "One more idea explored." : "One more skill is yours."}</h2>
                        <p>{isConcept ? "Your reading marks and understanding check are saved. You can revisit the ideas any time." : <>You finished {unit.project.title}. Your code and progress are saved.</>}</p>
                        <div className="reward">
                          <Zap size={24} />
                          100 XP earned for this quest
                        </div>
                        <p className="muted">
                          You can always revisit a quest. Its XP is awarded
                          once.
                        </p>
                        {nextLesson && <button className="primary" onClick={() => void select(nextLesson.id)}>
                          Next lesson: {nextLesson.title} <ArrowRight size={17} />
                        </button>}
                        <button
                          className="text-button"
                          onClick={() => setView("path")}
                        >
                          Back to courses
                        </button>
                      </div>
                    )}
                  </section>
                  {(state.profile.aiEnabled || state.profile.hintsEnabled) && (
                    <aside
                      className="tutor-panel panel"
                      id="coding-buddy-panel"
                      hidden={tutorHidden}
                      ref={tutorPanel}
                      tabIndex={-1}
                      aria-label="AI assistant and lesson help"
                    >
                      <div className="tutor-heading">
                        <span className="tutor-icon">
                          <Sparkles size={23} />
                        </span>
                        <div>
                          <h3>
                            {state.keyConnected && state.profile.aiEnabled
                              ? `Your ${providers[state.aiProvider ?? "deepseek"].name} buddy`
                              : "Your coding buddy"}
                          </h3>
                          <small>
                            {!state.profile.aiEnabled
                              ? "AI off · lesson help available"
                              : !deviceStatus.online
                                ? "Lesson help works offline"
                                : state.keyConnected
                                  ? selectedModel(state.aiProvider ?? "deepseek", state.profile.aiModels?.[state.aiProvider ?? "deepseek"]).name
                                  : "Hints here. AI when you connect."}
                          </small>
                        </div>
                        <span className="status-dot" />
                      </div>
                      <p>Stuck on a word or a step? We can make it smaller.</p>
                      {state.profile.hintsEnabled && (
                        <div className="tutor-shortcuts">
                          <button
                            onClick={() =>
                              setHint((h) =>
                                Math.min(h + 1, lesson.hints.length - 1),
                              )
                            }
                          >
                            <Lightbulb size={16} />
                            Give me a hint
                          </button>
                          <button
                            onClick={() => {
                              if (
                                !state.profile.aiEnabled ||
                                !state.keyConnected ||
                                !deviceStatus.online
                              ) {
                                setHelperText(lesson.steps.join("\n\n"));
                                return;
                              }
                              setTutorMode("steps");
                              setQuestion(
                                "Break the next step into smaller actions for me.",
                              );
                            }}
                          >
                            <BookOpen size={16} />
                            Make the steps smaller
                          </button>
                          <button
                            onClick={() => {
                              if (
                                !state.profile.aiEnabled ||
                                !state.keyConnected ||
                                !deviceStatus.online
                              ) {
                                setHelperText(lesson.explanation[paragraph]);
                                return;
                              }
                              setTutorMode("explain");
                              setQuestion(
                                "Explain this idea using something familiar and simple.",
                              );
                            }}
                          >
                            <MessageCircle size={16} />
                            Explain it simply
                          </button>
                        </div>
                      )}
                      {state.profile.hintsEnabled && hint >= 0 && (
                        <div className="authored-hint">
                          <span className="eyebrow">
                            LESSON HINT {hint + 1}
                          </span>
                          <LessonContent
                          glossary
                            text={lesson.hints[hint]}
                            runtime={readingLanguage}
                          />
                        </div>
                      )}
                      {helperText && state.profile.hintsEnabled && (
                        <div className="authored-hint">
                          <span className="eyebrow">FROM THIS LESSON</span>
                          <LessonContent
                          glossary
                            text={helperText}
                            runtime={readingLanguage}
                          />
                        </div>
                      )}
                      {state.profile.aiEnabled && !deviceStatus.online && (
                        <p className="notice">
                          Live AI answers need internet. Your lesson hints are
                          ready here.
                        </p>
                      )}
                      {state.profile.aiEnabled &&
                        deviceStatus.online &&
                        !state.keyConnected && (
                          <div className="connect-card">
                            <p>
                              Connect your API key to ask your own questions.
                            </p>
                            <button
                              className="secondary"
                              onClick={() => setView("settings")}
                            >
                              Choose an AI assistant <ArrowRight size={15} />
                            </button>
                          </div>
                        )}
                      {state.profile.aiEnabled && deviceStatus.online && (
                        <>
                          <div className="chat-log" aria-live="polite">
                            {chat.map((c, i) => (
                              <div key={i}>
                                <p className="chat-question">{c.question}</p>
                                <LessonContent
                          glossary
                                  text={c.answer}
                                  runtime={readingLanguage}
                                  className="chat-answer"
                                />
                              </div>
                            ))}
                            {pendingPassage && (
                              <blockquote className="pending-passage">
                                <b>Explaining your selection</b>
                                <span>{pendingPassage}</span>
                              </blockquote>
                            )}
                            {tutorBusy && (
                              <p className="muted">Your buddy is thinking…</p>
                            )}
                          </div>
                          <form
                            onSubmit={(e) => {
                              e.preventDefault();
                              ask();
                            }}
                          >
                            <label className="sr-only" htmlFor="question">
                              Ask your coding buddy
                            </label>
                            <textarea
                              id="question"
                              value={question}
                              onChange={(e) => setQuestion(e.target.value)}
                              placeholder="What does this part mean?"
                              maxLength={3000}
                              rows={3}
                            />
                            <div className="tutor-form-foot">
                              <select
                                value={tutorMode}
                                onChange={(e) => setTutorMode(e.target.value)}
                                aria-label="Kind of tutor help"
                              >
                                <option value="explain">Explain</option>
                                <option value="hint">Hint</option>
                                <option value="steps">Small steps</option>
                                <option value="review">Review code</option>
                              </select>
                              <button
                                className="primary"
                                disabled={
                                  !state.keyConnected ||
                                  tutorBusy ||
                                  !question.trim()
                                }
                                type="submit"
                              >
                                Ask <ArrowRight size={15} />
                              </button>
                            </div>

                          </form>
                        </>
                      )}
                      <div className="tutor-reminder">
                        <Star size={16} />
                        <small>
                          Needing an explanation is part of learning.
                        </small>
                      </div>
                    </aside>
                  )}
                </div>
              </>
            )}
          {ready && view === "terminology" && <Terminology scope={state.draftScope} lessons={lessons} languageNames={names} onStudy={link=>{setTerminologyReturn(true);void select(link.lessonId,{paragraph:link.paragraph,concept:link.concept});}} />}
          {ready && view === "tools" && <CourseTools units={units} lessons={lessons} initialTrack={state.profile.track} onOpen={item=>void select(item.lessonId,item)} onCourse={track=>{void changeCourse(track).catch(e=>setError(e.message));}} />}
          {ready && view === "path" && (
            <>
              <div className="page-title">
                <p className="eyebrow">YOUR SKILL PATH</p>
                <h1>Pick your next adventure.</h1>
                <p>
                  Start at beginner, then build toward the next level. You can
                  revisit any lesson.
                </p>
              </div>
              {courseBookmarks[state.profile.track] && <div className="panel notice"><span>Continue {lessons.find(l => l.id === courseBookmarks[state.profile.track].activeId)?.title} · idea {courseBookmarks[state.profile.track].paragraph + 1}</span><button className="primary" onClick={() => void resumeCourse(courseBookmarks[state.profile.track]).catch(e => setError(e.message))}>Resume course</button></div>}
              <div className="compact-course-picker"><label htmlFor="phone-course">Course</label><select id="phone-course" value={state.profile.track} onChange={event => void changeCourse(event.target.value).catch(e => setError(e.message))}>{Object.entries(names).sort((a,b)=>compareCourseNames(a[1],b[1])).map(([id,name])=><option key={id} value={id}>{name}</option>)}</select><CourseDescription track={state.profile.track} /></div>
              <CourseChooser open={coursesOpen} onToggle={()=>setCoursesOpen(v=>!v)} onTools={()=>setView("tools")} track={state.profile.track} name={names[state.profile.track]}>

              <div className="track-grid">
                {Object.entries(names).sort((a,b)=>compareCourseNames(a[1],b[1])).map(([id, name]) => {
                  const courseUnits = units.filter((u) => u.track === id),
                    count = courseUnits.length,
                    conceptOnly = courseUnits.every(u => lessons.find(l => l.id === u.id)?.learningMode === "concept"),
                    done = state.progress.filter(
                      (p) =>
                        p.completedAt &&
                        units.find((u) => u.id === p.unitId)?.track === id,
                    ).length;
                  return (
                    <button
                      className={
                        "track-card panel " +
                        (state.profile.track === id ? "chosen" : "")
                      }
                      key={id}
                      aria-pressed={state.profile.track === id}
                      onClick={() =>
                        changeCourse(id).catch((e) => setError(e.message))
                      }
                    >
                      <span className="track-icon">{symbols[id]}</span>
                      <b>{name}</b>
                      <CourseDescription track={id} />
                      <span className="muted">{count} {conceptOnly ? "concept lessons" : "lessons"}</span>
                      <div className="meter">
                        <span style={{ width: (done / count) * 100 + "%" }} />
                      </div>
                      <small>{done} {"lessons"} completed</small>
                    </button>
                  );
                })}
              </div>
              </CourseChooser>
              <div className="path-toolbar">
                <div
                  className="segmented"
                  role="group"
                  aria-label="Course level"
                >
                  {["beginner", "intermediate", "advanced"].filter(level => units.some(u => u.track === state.profile.track && u.level === level)).map((l) => (
                    <button
                      key={l}
                      className={state.profile.level === l ? "selected" : ""}
                      aria-pressed={state.profile.level === l}
                      onClick={() =>
                        prefs({ level: l }).catch((e) => setError(e.message))
                      }
                    >
                      {l}
                    </button>
                  ))}
                </div>
                <input
                  id="course-topic-search"
                  aria-label="Search topics"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Find a topic…"
                />
              </div>
              {["react", "typescript"].includes(state.profile.track) && (
                <p className="notice">
                  Start with JavaScript variables, functions, arrays, and
                  objects before this course. React also uses HTML and CSS.
                </p>
              )}
              <div className="path-search-summary" role="status">
                <p>
                  Searching {names[state.profile.track]} · {state.profile.level}
                  . {visible.length} {visible.length === 1 ? "topic" : "topics"}{" "}
                  found, in learning order.
                </p>
                {search && (
                  <button className="text-button" onClick={() => { setSearch(""); document.getElementById("course-topic-search")?.focus(); }}>
                    Clear search <X size={14} />
                  </button>
                )}
              </div>
              <div className="path-list">
                {visible.map((u) => {
                  const l = lessons.find((l) => l.id === u.id),
                    done = state.progress.find(
                      (p) => p.unitId === u.id,
                    )?.completedAt;
                  return (
                    <button
                      className={"path-item panel " + (done ? "finished" : "")}
                      key={u.id}
                      onClick={() => select(u.id)}
                      disabled={!l}
                    >
                      <span className="path-number">
                        {done ? (
                          <Check size={23} />
                        ) : (
                          orderedUnits
                            .filter(
                              (item) =>
                                item.track === u.track &&
                                item.level === u.level,
                            )
                            .findIndex((item) => item.id === u.id) + 1
                        )}
                      </span>
                      <div>
                        <small>
                          {names[u.track]} · {u.level}
                        </small>
                        <h3>{u.topic}</h3>
                        <p>{l?.learningMode === "concept" ? "Read · explore · check your understanding" : u.project.title}</p>
                        <span className="path-meta">
                          {l ? l.estimatedMinutes + " min" : "Content loading"}

                        </span>
                        {l && (
                          <LessonCompletion
                            compact
                            lesson={l}
                            progress={state.progress.find(
                              (p) => p.unitId === u.id,
                            )}
                            reading={reading}
                          />
                        )}
                      </div>
                      <ChevronRight size={22} />
                    </button>
                  );
                })}
                {!visible.length && (
                  <div className="panel">
                    <p>
                      No topics match in {names[state.profile.track]} ·{" "}
                      {state.profile.level}. Try another word, choose a
                      different course above, or clear your search.
                    </p>
                    <button className="secondary" onClick={() => { setSearch(""); document.getElementById("course-topic-search")?.focus(); }}>
                      Show topics in this course
                    </button>
                  </div>
                )}
              </div>
              <div className="panel career-paths">
                <h3>Ways to put your skills together</h3>
                <p>Connect your topics into larger projects.</p>
                <div className="career-grid">
                  {[
                    {
                      name: "Front-end developer",
                      tracks: "HTML → CSS → JavaScript → TypeScript → React",
                      start: "html-01",
                    },
                    {
                      name: "Full-stack developer",
                      tracks: "Front end → SQL → Back-end development",
                      start: "html-01",
                    },
                    {
                      name: "Back-end developer",
                      tracks: "JavaScript → SQL → Back-end development",
                      start: "javascript-01",
                    },
                    {
                      name: "Python developer",
                      tracks: "Python → SQL → Developer toolkit",
                      start: "python-01",
                    },
                  ].map((p) => (
                    <button
                      key={p.name}
                      className="career-card"
                      onClick={() => select(p.start)}
                    >
                      <Code2 size={22} />
                      <b>{p.name}</b>
                      <small>{p.tracks}</small>
                      <ArrowRight size={18} />
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
          {ready && view === "progress" && (
            <>
              <div className="page-title">
                <p className="eyebrow">LOOK HOW FAR YOU’VE COME</p>
                <h1>Your progress, one step at a time.</h1>
                <p>
                  See what you’ve finished and reopen saved work from any course.
                </p>
              </div>
              <ProgressStats state={state} />
              <div className="panel milestones">
                <h3>Your milestones</h3>
                <div className="badges">
                  {[
                    { name: "First small win", goal: 1 },
                    { name: "Getting the hang of it", goal: 5 },
                    { name: "Builder in the making", goal: 15 },
                    { name: "A steady explorer", goal: 30 },
                    { name: "A growing toolkit", goal: 60 },
                  ].map((b) => (
                    <div
                      key={b.name}
                      className={
                        "badge " + (state.completed >= b.goal ? "earned" : "")
                      }
                    >
                      <Star size={27} />
                      <b>{b.name}</b>
                      <small>{state.completed >= b.goal ? "Earned" : "Goal"} · {b.goal} {b.goal === 1 ? "finished lesson" : "finished lessons"}</small>
                    </div>
                  ))}
                </div>
              </div>
              <SavedLearning lessons={lessons} units={units} progress={state.progress} reading={reading} courseNames={names}
                onLesson={(id, idea) => void select(id, id === "python-01"
                  ? {paragraph: 0, concept: pythonConcepts[idea]?.id}
                  : {paragraph: idea})}
                onProject={id => {
                  const core = projectsForLesson(id).find(project=>project.core);
                  void select(id, undefined, "studio", core ? {lessonId:id, guidedId:core.id} : undefined);
                }}
              />
              <SavedDeviceProjects key={state.draftScope} scope={state.draftScope} units={units} lessons={lessons} names={names}
                onOpen={target=>void select(target.lessonId, undefined, "studio", target)} />
            </>
          )}
          {ready && view === "settings" && (
            <>
              <div className="page-title">
                <p className="eyebrow">MAKE IT YOURS</p>
                <h1>A comfortable place to learn.</h1>
                <p>Choose your pace and connect your coding buddy.</p>
                {localMode && (
                  <p role="status">
                    Local mode · No ChatGPT sign-in. Progress and encrypted AI
                    keys stay on this computer. Each copy has one local learner;
                    use a separate computer account for another person.
                  </p>
                )}
              </div>
              <div className="settings-grid">
                <LearningSettings
                  localMode={localMode}
                  beforeResolve={saveCode}
                  profile={state.profile}
                  prefs={prefs}
                  device={device}
                  status={deviceStatus}
                  onError={setError}
                  onResolved={() => {
                    loadLesson(activeId, device.current.progress);
                  }}
                />
                <section className="panel">
                  <h3>Your learning rhythm</h3>
                  <label className="setting-row">
                    <span>
                      <b>Calm mode</b>
                      <small>
                        Keep progress; soften the rewards and motion.
                      </small>
                    </span>
                    <input
                      type="checkbox"
                      checked={state.profile.calm}
                      onChange={(e) =>
                        prefs({ calm: e.target.checked }).catch((e) =>
                          setError(e.message),
                        )
                      }
                    />
                  </label>
                  <label className="setting-row setting-field">
                    <span>
                      <b>Appearance</b>
                      <small>Purple accents on charcoal surfaces.</small>
                    </span>
                    <select
                      value={state.profile.theme}
                      onChange={(e) =>
                        prefs({ theme: e.target.value }).catch((e) =>
                          setError(e.message),
                        )
                      }
                    >
                      <option value="light">Charcoal</option>
                      <option value="dark">Deep charcoal</option>
                    </select>
                  </label>
                  <label className="setting-row setting-field">
                    <span>
                      <b>Daily goal</b>
                      <small>Lessons to finish each day. One is a good start.</small>
                    </span>
                    <input
                      type="number"
                      min={1}
                      max={10}
                      value={state.profile.dailyGoal}
                      onChange={(e) => {
                        const v = Number(e.target.value);
                        if (v >= 1 && v <= 10)
                          prefs({ dailyGoal: v }).catch((e) =>
                            setError(e.message),
                          );
                      }}
                    />
                  </label>
                  <p className="muted">
                    Days and streaks use UTC. Missing a day never removes
                    completed work.
                  </p>
                </section>
                <AIConnectionSettings
                  localMode={localMode}
                  key={state.draftScope}
                  state={state}
                  online={deviceStatus.online}
                  request={request}
                  onSaved={(next, message) => {
                    setChat([]);
                    setState(next);
                    setFeedback(message);
                  }}
                  onError={setError}
                  beforeConnectionChange={() =>
                    apiKeyFileSettings.current?.disableAuto() ??
                    Promise.resolve()
                  }
                />
                <section className="panel">
                  <h3>Your work stays with you</h3>
                  <p>
                    Your code, answers, settings, and progress save to{" "}
                    {localMode
                      ? "the local database on this computer"
                      : "your private account"}
                    . Earlier versions are available in each project’s History.
                  </p>
                  <div className="button-row">
                    <button
                      className="secondary"
                      onClick={() =>
                        exportBackup().catch((e) => setError(e.message))
                      }
                    >
                      <Download size={17} />
                      Download backup
                    </button>
                    <button
                      className="secondary"
                      onClick={() => backupFile.current?.click()}
                    >
                      <Upload size={17} />
                      Restore project files
                    </button>
                  </div>
                  <input
                    ref={backupFile}
                    className="sr-only"
                    type="file"
                    accept=".json,application/json"
                    onChange={(e) => {
                      if (e.target.files?.[0]) importBackup(e.target.files[0]);
                      e.target.value = "";
                    }}
                  />
                  {feedback && <p role="status">{feedback}</p>}
                </section>
                <section className="panel">
                  <h3>Swift on your Mac</h3>
                  <p>
                    Swift uses your Mac’s compiler. Download the small local
                    runner and follow its setup steps. SwiftUI screens open in
                    Xcode.
                  </p>
                  <a
                    className="secondary"
                    href="/companion/codequest-swift-runner.py"
                    download
                  >
                    <Download size={17} />
                    Download Mac runner
                  </a>
                  <a
                    className="text-button"
                    href="/companion/README.txt"
                    download
                  >
                    Download setup steps
                  </a>
                  <label htmlFor="runner-token">Temporary runner token</label>
                  <input
                    id="runner-token"
                    type="password"
                    autoComplete="off"
                    value={runnerToken}
                    onChange={(e) => setRunnerToken(e.target.value)}
                    placeholder="Shown when the runner starts"
                  />
                  <small className="muted">
                    Kept in this open tab only. Your browser may ask to allow a
                    local connection.
                  </small>
                </section>
              </div>
            </>
          )}
          {ready &&
            !lesson &&
            (view === "quest" ||
              (view === "studio" && studioMode === "course")) && (
              <div className="panel">
                <h2>Your course is being prepared.</h2>
                <button className="primary" onClick={() => setView("path")}>
                  Explore the catalog
                </button>
              </div>
            )}
          <APIKeyFileSettings
            localMode={localMode}
            ref={apiKeyFileSettings}
            state={state}
            lesson={activeId}
            online={deviceStatus.online}
            visible={ready && view === "settings"}
            request={request}
            onSaved={(next, message) => {
              setChat([]);
              setState(next);
              setFeedback(message);
            }}
          />
          <footer>
            CodeQuest · Built around your pace.
            <span>
              Original lessons and projects · <a href="/third-party/README.txt" target="_blank" rel="noopener">Third-party software notices</a>
            </span>
          </footer>
        </main>
      </div>
      {celebrate && (
        <div className="celebration" aria-hidden="true">
          {Array.from({ length: 18 }, (_, i) => (
            <span
              key={i}
              style={{
                left: i * 5.7 + "%",
                animationDelay: (i % 5) * 0.08 + "s",
                background: i % 2 ? "#b397f0" : "#7050cf",
              }}
            >
              ✦
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
