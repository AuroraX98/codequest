"use client";

import { useEffect, useId, useRef, useState } from "react";
import {
  addLessonNote,
  deleteLessonNote,
  exportLessonNotesMarkdown,
  lessonNotesError,
  lessonNotesFilename,
  loadLessonNotes,
  maxLessonNoteLength,
  maxLessonQuoteLength,
  updateLessonNote,
  type LessonNote,
  type LessonNoteSource,
} from "../lib/lesson-notes";

export type LessonNotesProps = {
  scope: string;
  lessonId: string;
  lessonTitle: string;
  sectionIndex: number;
  sectionKey: string;
  sectionTitle: string;
  sectionText: string;
  selectedQuote?: {
    text: string;
    requestId: number;
    source?: LessonNoteSource;
  };
};
type Draft = {
  id: string;
  body: string;
  quote: string;
  source: LessonNoteSource;
};
type PendingQuote = { text: string; source: LessonNoteSource };

// A new account or lesson never renders the previous context's state.
export default function LessonNotes(props: LessonNotesProps) {
  return (
    <NotesPanel
      key={JSON.stringify([props.scope, props.lessonId])}
      {...props}
    />
  );
}

function NotesPanel({
  scope,
  lessonId,
  lessonTitle,
  sectionIndex,
  sectionKey,
  sectionTitle,
  sectionText,
  selectedQuote,
}: LessonNotesProps) {
  const id = useId();
  const source = (): LessonNoteSource => ({
    lessonId,
    lessonTitle,
    sectionIndex,
    sectionKey,
    sectionTitle,
    sectionText,
  });
  const [draft, setDraft] = useState<Draft>(() => ({
    id: crypto.randomUUID(),
    body: "",
    quote: "",
    source: source(),
  }));
  const [pendingQuote, setPendingQuote] = useState<PendingQuote | null>(null);
  const [notes, setNotes] = useState<LessonNote[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(!!scope);
  const [retry, setRetry] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [editing, setEditing] = useState<{
    id: string;
    body: string;
    original: LessonNote;
  } | null>(null);
  const [deleting, setDeleting] = useState<{
    id: string;
    updatedAt: string;
  } | null>(null);
  const details = useRef<HTMLDetailsElement>(null);
  const textarea = useRef<HTMLTextAreaElement>(null);
  const active = useRef(false);
  const working = useRef(false);
  const handledQuote = useRef<number | undefined>(undefined);

  useEffect(() => {
    active.current = true;
    return () => {
      active.current = false;
    };
  }, []);

  useEffect(() => {
    if (!scope) return;
    let current = true;
    loadLessonNotes(scope, lessonId)
      .then((saved) => {
        if (!current) return;
        setNotes(saved);
        setLoaded(true);
        setLoading(false);
        setError("");
      })
      .catch((failure) => {
        if (!current) return;
        setLoading(false);
        setError(lessonNotesError(failure));
      });
    return () => {
      current = false;
    };
  }, [scope, lessonId, retry]);

  useEffect(() => {
    if (!selectedQuote || handledQuote.current === selectedQuote.requestId)
      return;
    handledQuote.current = selectedQuote.requestId;
    const incoming: PendingQuote = {
      text: selectedQuote.text,
      source: selectedQuote.source ?? {
        lessonId,
        lessonTitle,
        sectionIndex,
        sectionKey,
        sectionTitle,
        sectionText,
      },
    };
    if (incoming.source.lessonId !== lessonId) return;
    if (details.current) details.current.open = true;
    // The selected passage is a user action coming from another component.
    // Do not overwrite a reflection or an existing unsaved passage.
    // The request is a discrete cross-component user event, not derived render state.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPendingQuote(incoming);
    setDraft((previous) => {
      if (previous.body || previous.quote || working.current) return previous;
      return {
        ...previous,
        body: "",
        quote: incoming.text,
        source: incoming.source,
      };
    });
    textarea.current?.focus();
  }, [
    selectedQuote,
    lessonId,
    lessonTitle,
    sectionIndex,
    sectionKey,
    sectionTitle,
    sectionText,
  ]);

  const visiblePending =
    pendingQuote &&
    (pendingQuote.text !== draft.quote ||
      pendingQuote.source.sectionText !== draft.source.sectionText ||
      pendingQuote.source.sectionKey !== draft.source.sectionKey);
  const draftSource = draft.body || draft.quote ? draft.source : source();
  const tooLong =
    draft.body.length > maxLessonNoteLength ||
    draft.quote.length > maxLessonQuoteLength;
  const canSave =
    loaded && !busy && !tooLong && !!(draft.body.trim() || draft.quote.trim());

  async function perform(
    action: () => Promise<LessonNote[]>,
    done: () => void,
    message: string,
  ) {
    if (working.current || !loaded || !scope) return;
    working.current = true;
    setBusy(true);
    setError("");
    setStatus("Saving to your account…");
    try {
      const saved = await action();
      if (!active.current) return;
      setNotes(saved);
      done();
      setStatus(message);
    } catch (failure) {
      if (!active.current) return;
      setError(lessonNotesError(failure));
      setStatus("");
    } finally {
      if (active.current) {
        working.current = false;
        setBusy(false);
      }
    }
  }

  const save = () => {
    if (!canSave) return;
    const submitted = draft;
    void perform(
      () =>
        addLessonNote(
          scope,
          submitted.source,
          submitted.body,
          submitted.quote,
          submitted.id,
        ),
      () => {
        setDraft({
          id: crypto.randomUUID(),
          body: "",
          quote: "",
          source: source(),
        });
        // Clear only the selection used by this save, not a newer request.
        setPendingQuote((pending) =>
          pending?.text === submitted.quote &&
          pending.source.sectionText === submitted.source.sectionText &&
          pending.source.sectionKey === submitted.source.sectionKey
            ? null
            : pending,
        );
      },
      "Note saved to your account.",
    );
  };

  const exportNotes = () => {
    if (!loaded || !notes.length || busy) return;
    try {
      const file = new Blob(
        [exportLessonNotesMarkdown(lessonId, lessonTitle, notes)],
        { type: "text/markdown;charset=utf-8" },
      );
      const url = URL.createObjectURL(file);
      const link = document.createElement("a");
      link.href = url;
      link.download = lessonNotesFilename(lessonId);
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      setError("");
      setStatus(
        "Markdown download started. Open the downloaded file in Obsidian if you use it. Unsaved drafts are not included.",
      );
    } catch {
      setError(
        "This browser could not download your notes. Your saved notes and draft are unchanged.",
      );
    }
  };

  return (
    <details ref={details} data-lesson-notes className="lesson-notes">
      <summary>
        My notes{" "}
        <span>
          Private account notes
          {loaded && notes.length ? ` · ${notes.length}` : ""}
        </span>
      </summary>
      <div className="lesson-notes-content">
        <p className="lesson-notes-privacy">
          Saved notes are private to your CodeQuest account, not sent to AI.
          Open the same account on another device and refresh to see saved
          notes. Internet is required to load or save. Unsaved drafts stay only
          in this open page.
        </p>
        {!scope ? (
          <p role="status">Sign in to keep notes for your account.</p>
        ) : (
          <>
            {loading && <p role="status">Loading account notes…</p>}
            {error && (
              <p className="lesson-notes-error" role="alert">
                {error}
              </p>
            )}
            {!loading && !loaded && (
              <button
                type="button"
                onClick={() => {
                  setLoading(true);
                  setError("");
                  setRetry((value) => value + 1);
                }}
              >
                Retry loading notes
              </button>
            )}
            <div className="lesson-notes-compose">
              <h4>Add a reflection</h4>
              <p className="lesson-note-meta">
                For {draftSource.sectionTitle}. Save before leaving this lesson
                or closing the page.
              </p>
              {visiblePending && (
                <div className="lesson-notes-pending" role="status">
                  <p>
                    You selected another passage. Keep your current draft, or
                    use the new passage with this reflection.
                  </p>
                  <blockquote className="lesson-note-quote">
                    {pendingQuote.text}
                  </blockquote>
                  <div className="lesson-notes-actions">
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => {
                        setDraft((previous) => ({
                          ...previous,
                          quote: pendingQuote.text,
                          source: pendingQuote.source,
                        }));
                        setPendingQuote(null);
                        textarea.current?.focus();
                      }}
                    >
                      Use new passage
                    </button>
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => setPendingQuote(null)}
                    >
                      Keep current draft
                    </button>
                  </div>
                </div>
              )}
              {draft.quote && (
                <div>
                  <p className="lesson-note-meta">
                    Selected passage (kept exactly as selected)
                  </p>
                  <blockquote
                    className="lesson-note-quote"
                    data-note-draft-quote
                  >
                    {draft.quote}
                  </blockquote>
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => {
                      setDraft((previous) => ({ ...previous, quote: "" }));
                      setPendingQuote(null);
                    }}
                  >
                    Remove passage from draft
                  </button>
                </div>
              )}
              <label htmlFor={`${id}-reflection`}>My thoughts or ideas</label>
              <textarea
                ref={textarea}
                id={`${id}-reflection`}
                rows={4}
                value={draft.body}
                disabled={busy}
                aria-describedby={`${id}-hint`}
                placeholder="What does this mean to you? A passage is optional."
                onChange={(event) =>
                  setDraft((previous) => ({
                    ...previous,
                    source:
                      previous.body || previous.quote
                        ? previous.source
                        : source(),
                    body: event.target.value,
                  }))
                }
              />
              <p id={`${id}-hint`} className="lesson-note-meta">
                {draft.body.length.toLocaleString()} /{" "}
                {maxLessonNoteLength.toLocaleString()} characters. Nothing is
                saved until you choose Save note.
              </p>
              {tooLong && (
                <p className="lesson-notes-error" role="alert">
                  Your note or selected passage is over{" "}
                  {maxLessonNoteLength.toLocaleString()} characters. Shorten it
                  before saving. Nothing has been truncated.
                </p>
              )}
              {notes.some((note) => note.id === draft.id) && (
                <div className="lesson-notes-pending" role="status">
                  <p>
                    A saved copy of this draft is listed below. Retry Save note
                    if its contents are unchanged, or start a separate note if
                    you want to keep both versions.
                  </p>
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() =>
                      setDraft((previous) => ({
                        ...previous,
                        id: crypto.randomUUID(),
                      }))
                    }
                  >
                    Start a separate note with this draft
                  </button>
                </div>
              )}
              <div className="lesson-notes-actions">
                <button
                  type="button"
                  data-note-save
                  disabled={!canSave}
                  onClick={save}
                >
                  {busy ? "Saving…" : "Save note"}
                </button>
              </div>
            </div>
            <div className="lesson-notes-heading">
              <h4>Saved notes for this lesson</h4>
              <button
                type="button"
                data-notes-refresh
                disabled={busy || loading}
                onClick={() => {
                  setLoading(true);
                  setLoaded(false);
                  setError("");
                  setStatus("");
                  setRetry((value) => value + 1);
                }}
              >
                Refresh saved notes
              </button>
              <button
                type="button"
                data-notes-export
                disabled={!loaded || !notes.length || busy}
                onClick={exportNotes}
              >
                Export Markdown
              </button>
            </div>
            <p className="lesson-note-meta">
              The exported .md file can be added to an Obsidian vault. CodeQuest
              does not connect to or change your vault.
            </p>
            {loaded && !notes.length && (
              <p>
                No saved notes yet. Add a reflection, or highlight lesson text
                and choose Add note.
              </p>
            )}
            {!loaded && notes.length > 0 && (
              <p className="lesson-note-meta" role="status">
                Showing the last loaded notes. They may be out of date until
                refresh succeeds.
              </p>
            )}
            {editing && !notes.some((note) => note.id === editing.id) && (
              <div className="lesson-note-item" data-note-orphan-edit>
                <p role="status">
                  This note is no longer saved in your account. Your unsaved
                  reflection is kept below so you can copy it before closing the
                  editor.
                </p>
                {editing.original.quote && (
                  <blockquote className="lesson-note-quote">
                    {editing.original.quote}
                  </blockquote>
                )}
                <label htmlFor={`${id}-orphan`}>
                  Unsaved reflection for {editing.original.anchor.sectionTitle}
                </label>
                <textarea
                  id={`${id}-orphan`}
                  rows={4}
                  value={editing.body}
                  onChange={(event) =>
                    setEditing({ ...editing, body: event.target.value })
                  }
                />
                <button type="button" onClick={() => setEditing(null)}>
                  Close this unsaved editor
                </button>
              </div>
            )}
            <ol className="lesson-note-list">
              {notes.map((note) => (
                <li
                  key={note.id}
                  className="lesson-note-item"
                  data-note-id={note.id}
                >
                  <p className="lesson-note-meta">
                    <strong>{note.anchor.sectionTitle}</strong> · Section{" "}
                    {note.anchor.sectionIndex + 1} ·{" "}
                    <time dateTime={note.updatedAt}>
                      {new Date(note.updatedAt).toLocaleString()}
                    </time>
                  </p>
                  {note.quote && (
                    <blockquote
                      className="lesson-note-quote"
                      data-note-saved-quote
                    >
                      {note.quote}
                    </blockquote>
                  )}
                  {editing?.id === note.id ? (
                    <div>
                      {editing.original.updatedAt !== note.updatedAt && (
                        <div className="lesson-notes-error" role="status">
                          <p>
                            This note changed after you started editing. Your
                            draft is below. Latest saved reflection:
                          </p>
                          <p className="lesson-note-body">
                            {note.body || "(No reflection)"}
                          </p>
                          <button
                            type="button"
                            disabled={busy}
                            onClick={() =>
                              setEditing({ ...editing, original: note })
                            }
                          >
                            Keep my draft over this version
                          </button>
                        </div>
                      )}
                      <label htmlFor={`${id}-edit-${note.id}`}>
                        Edit my reflection
                      </label>
                      <textarea
                        id={`${id}-edit-${note.id}`}
                        rows={4}
                        value={editing.body}
                        disabled={busy}
                        onChange={(event) =>
                          setEditing({ ...editing, body: event.target.value })
                        }
                      />
                      <p className="lesson-note-meta">
                        {editing.body.length.toLocaleString()} /{" "}
                        {maxLessonNoteLength.toLocaleString()} characters. The
                        original passage and source stay unchanged.
                      </p>
                      <div className="lesson-notes-actions">
                        <button
                          type="button"
                          data-note-save-edit
                          disabled={
                            busy ||
                            !loaded ||
                            editing.original.updatedAt !== note.updatedAt ||
                            editing.body.length > maxLessonNoteLength ||
                            !(editing.body.trim() || note.quote.trim())
                          }
                          onClick={() => {
                            const body = editing.body;
                            void perform(
                              () =>
                                updateLessonNote(
                                  scope,
                                  lessonId,
                                  editing.original,
                                  body,
                                  editing.original.updatedAt,
                                ),
                              () => setEditing(null),
                              "Changes saved to your account.",
                            );
                          }}
                        >
                          Save changes
                        </button>
                        <button
                          type="button"
                          disabled={busy}
                          onClick={() => setEditing(null)}
                        >
                          Cancel edit
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      {note.body && (
                        <p className="lesson-note-body">{note.body}</p>
                      )}
                      <div className="lesson-notes-actions">
                        <button
                          type="button"
                          data-note-edit
                          disabled={busy || !loaded || !!editing}
                          onClick={() => {
                            setEditing({
                              id: note.id,
                              body: note.body,
                              original: note,
                            });
                            setDeleting(null);
                          }}
                        >
                          Edit reflection
                        </button>
                        <button
                          type="button"
                          data-note-delete
                          disabled={busy || !loaded || !!editing}
                          onClick={() =>
                            setDeleting({
                              id: note.id,
                              updatedAt: note.updatedAt,
                            })
                          }
                        >
                          Delete note
                        </button>
                      </div>
                    </>
                  )}
                  {deleting?.id === note.id && (
                    <div
                      className="lesson-note-confirm"
                      role="group"
                      aria-label="Confirm note deletion"
                    >
                      <p>
                        Delete this note from your account on all devices? It
                        cannot be undone in CodeQuest. Export first if you want
                        a copy.
                      </p>
                      <div className="lesson-notes-actions">
                        <button
                          type="button"
                          data-note-confirm-delete
                          disabled={busy || !loaded}
                          onClick={() =>
                            void perform(
                              () =>
                                deleteLessonNote(
                                  scope,
                                  lessonId,
                                  note.id,
                                  deleting.updatedAt,
                                ),
                              () => setDeleting(null),
                              "Note deleted from your account.",
                            )
                          }
                        >
                          Yes, delete note
                        </button>
                        <button
                          type="button"
                          data-note-cancel-delete
                          disabled={busy}
                          onClick={() => setDeleting(null)}
                        >
                          Keep note
                        </button>
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ol>
            <p className="lesson-notes-status" role="status" aria-live="polite">
              {status}
            </p>
          </>
        )}
      </div>
    </details>
  );
}
