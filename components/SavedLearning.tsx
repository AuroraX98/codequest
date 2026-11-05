import { useMemo } from "react";
import { ArrowRight, BookOpen } from "lucide-react";
import {
  getReadingSectionKeys,
  type LessonReadingRecord,
} from "../lib/lesson-completion";
import type { ReadingProgress } from "../lib/reading-client";
import type { Lesson, Progress, Unit } from "../lib/types";

type Props = {
  lessons: Lesson[];
  units: Unit[];
  progress: Progress[];
  reading: ReadingProgress;
  courseNames: Record<string, string>;
  onLesson: (id: string, idea: number) => void;
  onProject: (id: string) => void;
};

function savedRows(
  lessons: Lesson[],
  progress: Progress[],
  reading: ReadingProgress["records"],
) {
  const byId = new Map(lessons.map((lesson) => [lesson.id, lesson]));
  const work = new Map(progress.map((row) => [row.unitId, row]));
  const marks = new Map<string, Map<string, LessonReadingRecord>>();
  for (const mark of reading) {
    const group =
      marks.get(mark.lessonId) ?? new Map<string, LessonReadingRecord>();
    const previous = group.get(mark.sectionKey);
    if (!previous || mark.updatedAt > previous.updatedAt)
      group.set(mark.sectionKey, mark);
    marks.set(mark.lessonId, group);
  }
  const ids = new Set([...work.keys(), ...marks.keys()]);
  return Array.from(ids)
    .flatMap((id) => {
      const lesson = byId.get(id),
        row = work.get(id),
        group = marks.get(id);
      const keys = lesson ? getReadingSectionKeys(lesson) : [];
      const checked = new Map<string, LessonReadingRecord>();
      for (const key of keys) {
        const mark = group?.get(key);
        if (mark?.checked && mark.markedAt) checked.set(key, mark);
      }
      if (!row && !checked.size) return [];
      const nextIdea = keys.findIndex((key) => !checked.has(key));
      let updated = row?.updatedAt ?? "";
      for (const mark of checked.values())
        if (mark.updatedAt > updated) updated = mark.updatedAt;
      return [
        {
          id,
          lesson,
          row,
          updated,
          nextIdea: Math.max(0, nextIdea),
          readCount: checked.size,
          total: keys.length,
        },
      ];
    })
    .sort(
      (a, b) => b.updated.localeCompare(a.updated) || a.id.localeCompare(b.id),
    );
}

export default function SavedLearning({
  lessons,
  units,
  progress,
  reading,
  courseNames,
  onLesson,
  onProject,
}: Props) {
  const rows = useMemo(
    () => savedRows(lessons, progress, reading.records),
    [lessons, progress, reading.records],
  );
  const tracks = useMemo(
    () => new Map(units.map((unit) => [unit.id, unit.track])),
    [units],
  );
  return (
    <section className="panel saved-learning" aria-label="Your saved learning">
      <h3>Your saved learning</h3>
      {!reading.loaded && !reading.error && (
        <p role="status">Loading saved reading…</p>
      )}
      {reading.error && (
        <div role="status">
          <p>{reading.error}</p>
          <button
            type="button"
            className="secondary"
            disabled={reading.loading || !reading.online}
            onClick={() => void reading.refresh()}
          >
            Reload saved reading
          </button>
        </div>
      )}
      {reading.loaded && !reading.error && !rows.length && (
        <p className="muted">
          Your lesson list starts when you mark an idea as read, try a quiz, or
          save lesson code.
        </p>
      )}
      {rows.map(({ id, lesson, row, nextIdea, readCount, total }) => {
        if (!lesson)
          return (
            <p key={id}>
              {id} · Archived lesson ·{" "}
              {row?.completedAt ? "Finished" : "In progress"}
            </p>
          );
        const course = tracks.get(id);
        const hasProject =
          lesson.learningMode !== "concept" &&
          row &&
          (row.completedAt || row.lastRun || row.code !== lesson.starter);
        return (
          <div className="saved-learning-item" key={id}>
            <button
              type="button"
              className="portfolio-row"
              onClick={() => onLesson(id, nextIdea)}
            >
              <BookOpen size={20} aria-hidden="true" />
              <span>
                <b>{lesson.title}</b>
                <small>
                  {course && courseNames[course]} ·{" "}
                  {row?.completedAt ? "Finished" : "In progress"}
                  {reading.loaded &&
                    ` · ${readCount} of ${total} ideas marked as read`}
                </small>
              </span>
              <ArrowRight size={18} aria-hidden="true" />
            </button>
            {hasProject && (
              <button
                type="button"
                className="secondary saved-project-link"
                aria-label={`Open saved project for ${lesson.title}`}
                onClick={() => onProject(id)}
              >
                Open saved project
              </button>
            )}
          </div>
        );
      })}
    </section>
  );
}
