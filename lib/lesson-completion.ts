/** Completion records describe saved activities, not a learner's mastery. */
export type LessonReadingRecord = {
  lessonId: string;
  sectionKey: string;
  checked: boolean;
  markedAt: string | null;
  updatedAt: string;
};

export type CompletionLesson = {
  learningMode?: string;
  id: string;
  explanation: readonly string[];
  math?: unknown;
};
export type CompletionProgress = {
  unitId: string;
  quizPassed: number;
  mathPassed: number;
  completedAt: string | null;
};
export type LessonCompletion = {
  readCompleted: number;
  readTotal: number;
  quizPassed: boolean;
  projectCompleted: boolean;
  completed: number;
  total: number;
  percent: number;
  isComplete: boolean;
  legacyReadingUnknown: boolean;
  math: { available: boolean; passed: boolean };
};

// Python Basics teaches these six primary rooms. Its original seven text pages
// remain supplementary and must never create a second set of reading points.
export const pythonBasicsReadingKeys = [
  "concept:program",
  "concept:values",
  "concept:strings",
  "concept:names",
  "concept:assignment",
  "concept:output",
] as const;

export function getReadingSectionKeys(lesson: CompletionLesson): string[] {
  return lesson.id === "python-01"
    ? [...pythonBasicsReadingKeys]
    : lesson.explanation.map((_, index) => `text:${index}`);
}

export function isReadingSectionKey(
  lesson: CompletionLesson,
  sectionKey: string,
): boolean {
  return getReadingSectionKeys(lesson).includes(sectionKey);
}

export function getLessonCompletion(
  lesson: CompletionLesson,
  progress: CompletionProgress | null | undefined,
  reading: readonly LessonReadingRecord[] = [],
): LessonCompletion {
  const keys = getReadingSectionKeys(lesson);
  const keySet = new Set(keys);
  const saved = new Map<string, LessonReadingRecord>();
  for (const record of reading) {
    if (record.lessonId !== lesson.id || !keySet.has(record.sectionKey))
      continue;
    // A stale duplicate must not bring a newer unchecked section back to life.
    const previous = saved.get(record.sectionKey);
    if (!previous || record.updatedAt > previous.updatedAt)
      saved.set(record.sectionKey, record);
  }
  const readCompleted = [...saved.values()].filter(
    (record) => record.checked === true && record.markedAt !== null,
  ).length;
  const ownProgress = progress?.unitId === lesson.id ? progress : undefined;
  const quizPassed = ownProgress?.quizPassed === 1;
  const needsProject = lesson.learningMode !== "concept";
  const projectCompleted = needsProject && !!ownProgress?.completedAt;
  const completed =
    readCompleted + Number(quizPassed) + Number(projectCompleted);
  // Fixed core denominator: reading, the saved quiz pass, and saved project
  // completion. Turning optional math on/off never moves this goalpost.
  const total = keys.length + 1 + Number(needsProject);
  return {
    readCompleted,
    readTotal: keys.length,
    quizPassed,
    projectCompleted,
    completed,
    total,
    percent: Math.round((completed / total) * 100),
    isComplete: completed === total,
    // A pre-existing completed project does not prove any pages were read.
    // Preserve that project achievement without fabricating reading history.
    legacyReadingUnknown: projectCompleted && saved.size === 0,
    math: {
      available: !!lesson.math,
      passed: !!lesson.math && ownProgress?.mathPassed === 1,
    },
  };
}
