"use client";

import { useId } from "react";
import {
  findReadingRecord,
  readingRecordKey,
  type ReadingProgress,
} from "../lib/reading-client";

export type ReadingMarkProps = {
  reading: ReadingProgress;
  lessonId: string;
  sectionKey: string;
  sectionTitle: string;
};

export default function ReadingMark({
  reading,
  lessonId,
  sectionKey,
  sectionTitle,
}: ReadingMarkProps) {
  const id = useId();
  const key = readingRecordKey(lessonId, sectionKey);
  const record = findReadingRecord(reading.records, lessonId, sectionKey);
  const checked = record?.checked === true;
  const pending = !!reading.pending[key];
  const error = reading.errors[key] || reading.error;
  const needsRefresh = !!reading.needsRefresh[key];
  const disabled =
    !reading.scope ||
    !reading.loaded ||
    reading.loading ||
    pending ||
    needsRefresh ||
    !reading.online;
  const pendingAnywhere = Object.values(reading.pending).some(Boolean);
  const caption = pending
    ? "Saving to your account…"
    : !reading.scope
      ? "Sign in to save reading progress."
      : reading.loading
        ? "Loading account reading progress…"
        : !reading.online
          ? "Offline. Reading changes are not saved or queued."
          : record
            ? `Last confirmed ${new Date(record.updatedAt).toLocaleString()}.`
            : reading.loaded
              ? "Only your click marks this section as read."
              : "Account reading progress is not loaded yet.";

  return (
    <div className="reading-mark" data-section-key={sectionKey}>
      <button
        type="button"
        role="checkbox"
        aria-checked={checked}
        aria-label={`Mark “${sectionTitle}” as read`}
        aria-describedby={`${id}-status${error ? ` ${id}-error` : ""}`}
        aria-busy={pending}
        disabled={disabled}
        className={"reading-mark-button" + (checked ? " is-read" : "")}
        onClick={() => {
          void reading.setChecked(lessonId, sectionKey, !checked);
        }}
      >
        <span className="reading-mark-box" aria-hidden="true">
          {checked ? "✓" : ""}
        </span>
        <span>
          {pending ? "Saving…" : checked ? "Marked as read" : "Mark as read"}
        </span>
      </button>
      <span id={`${id}-status`} className="reading-mark-status" role="status">
        {caption}
      </span>
      {!!error && (
        <div className="reading-mark-error">
          <span id={`${id}-error`} role="alert">
            {error}
          </span>
          <button
            type="button"
            className="reading-reload"
            disabled={
              !reading.scope ||
              reading.loading ||
              pendingAnywhere ||
              !reading.online
            }
            onClick={() => {
              void reading.refresh();
            }}
          >
            Reload reading progress
          </button>
        </div>
      )}
    </div>
  );
}
