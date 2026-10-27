"use client";

import { useId } from "react";
import { getLessonCompletion } from "../lib/lesson-completion";
import type { ReadingProgress } from "../lib/reading-client";
import type { Lesson, Progress } from "../lib/types";

export type LessonCompletionProps = {
  lesson: Lesson;
  progress?: Progress | null;
  reading: ReadingProgress;
  /** A non-interactive inline badge, safe inside a course navigation button. */
  compact?: boolean;
};

export default function LessonCompletion({
  lesson,
  progress,
  reading,
  compact = false,
}: LessonCompletionProps) {
  const id = useId();
  const score = getLessonCompletion(lesson, progress, reading.records);
  const known = reading.loaded;
  const stale =
    !!reading.error ||
    !reading.online ||
    Object.values(reading.needsRefresh).some(Boolean);
  const status = known
    ? `${score.percent}% complete${stale ? ", last confirmed reading" : ""}`
    : reading.loading
      ? "Loading lesson completion"
      : "Lesson completion unavailable until reading progress loads";

  if (compact) {
    return (
      <span
        className="lesson-completion-compact"
        aria-label={`${lesson.title}: ${status}`}
      >
        <span aria-hidden="true">{known ? `${score.percent}%` : "—"}</span>
        <span className="completion-mini-track" aria-hidden="true">
          <span style={{ width: `${known ? score.percent : 0}%` }} />
        </span>
        {stale && known && (
          <span className="completion-saved-label">Last confirmed</span>
        )}
      </span>
    );
  }

  return (
    <section className="lesson-completion" aria-labelledby={`${id}-title`}>
      <div className="completion-topline">
        <span id={`${id}-title`}>Lesson completion</span>
        <strong aria-live="polite">{known ? `${score.percent}%` : "—"}</strong>
      </div>
      <div
        className="completion-track"
        role="progressbar"
        aria-label={`${lesson.title} completion`}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={known ? score.percent : undefined}
        aria-valuetext={status}
        aria-busy={reading.loading}
      >
        <span style={{ width: `${known ? score.percent : 0}%` }} />
      </div>
      <p className="completion-caption">
        {known
          ? `${score.completed} of ${score.total} steps${stale ? " · Last confirmed reading progress" : ""}`
          : reading.loading
            ? "Loading your account reading progress…"
            : "Load reading progress to see your completion score."}
      </p>
      {!!reading.error && (
        <div className="completion-load-error">
          <span role="alert">{reading.error}</span>
          <button
            type="button"
            className="reading-reload"
            disabled={
              !reading.scope ||
              reading.loading ||
              !reading.online ||
              Object.values(reading.pending).some(Boolean)
            }
            onClick={() => {
              void reading.refresh();
            }}
          >
            Reload reading progress
          </button>
        </div>
      )}
      <details className="completion-details">
        <summary>What counts?</summary>
        <ul>
          <li>
            <span>Reading you mark as read</span>
            <strong>
              {known ? score.readCompleted : "—"}/{score.readTotal}
            </strong>
          </li>
          <li>
            <span>Practice quiz passed</span>
            <strong>{score.quizPassed ? "1/1" : "0/1"}</strong>
          </li>
          <li>
            <span>Project completion recorded</span>
            <strong>{score.projectCompleted ? "1/1" : "0/1"}</strong>
          </li>
        </ul>
        <p>
          Each required step counts equally. Opening a section, diagrams, notes
          and tutor use do not count as reading.
        </p>
        <p>
          Completion tracks saved activities, not mastery. Attempts alone do not
          count; a quiz pass and recorded project completion do.
        </p>

        {known && score.legacyReadingUnknown && (
          <p className="completion-legacy">
            Your earlier project completion is kept. Reading has not been
            recorded yet.
          </p>
        )}
      </details>
    </section>
  );
}
