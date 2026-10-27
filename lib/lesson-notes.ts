/** Private account notes. Only authenticated server acknowledgement counts as saved. */
export const maxLessonNotes = 200;
export const maxLessonNoteLength = 12000;
export const maxLessonQuoteLength = 12000;

export type LessonNoteAnchor = {
  lessonId: string;
  lessonTitle: string;
  sectionIndex: number;
  sectionKey: string;
  sectionTitle: string;
  sectionFingerprint: string;
};
export type LessonNote = {
  id: string;
  anchor: LessonNoteAnchor;
  quote: string;
  body: string;
  createdAt: string;
  updatedAt: string;
};
export type LessonNoteSource = Omit<LessonNoteAnchor, "sectionFingerprint"> & {
  sectionText: string;
};
type RecordEnvelope = {
  scope: string;
  lessonId: string;
  notes: LessonNote[];
};

function requireText(value: unknown, name: string, max: number) {
  if (typeof value !== "string" || !value.trim() || value.length > max)
    throw new Error(`This note has an invalid ${name}.`);
  return value;
}
function requireScope(scope: string, lessonId: string) {
  if (!/^[a-f0-9]{64}$/.test(scope))
    throw new Error("Sign in to your learning account before opening notes.");
  requireText(lessonId, "lesson", 200);
}
function requireContents(body: string, quote: string) {
  if (typeof body !== "string" || body.length > maxLessonNoteLength)
    throw new Error(
      `Keep your note within ${maxLessonNoteLength.toLocaleString()} characters.`,
    );
  if (typeof quote !== "string" || quote.length > maxLessonQuoteLength)
    throw new Error(
      `Select a shorter passage (up to ${maxLessonQuoteLength.toLocaleString()} characters). Nothing was shortened or saved.`,
    );
  if (!body.trim() && !quote.trim())
    throw new Error("Write a reflection or select a passage before saving.");
}

export async function lessonSectionFingerprint(sectionText: string) {
  if (typeof sectionText !== "string" || sectionText.length > 250000)
    throw new Error("This lesson section is too large to attach to a note.");
  if (!globalThis.crypto?.subtle)
    throw new Error(
      "Your browser cannot securely identify this lesson section. Keep your draft open and try a supported browser.",
    );
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(sectionText),
  );
  return Array.from(new Uint8Array(digest), (byte) =>
    byte.toString(16).padStart(2, "0"),
  ).join("");
}

function readRecord(
  value: unknown,
  scope: string,
  lessonId: string,
): RecordEnvelope {
  if (value === undefined) return { scope, lessonId, notes: [] };
  const input = value as RecordEnvelope;
  if (
    !input ||
    input.scope !== scope ||
    input.lessonId !== lessonId ||
    !Array.isArray(input.notes) ||
    input.notes.length > maxLessonNotes
  )
    throw new Error(
      "These saved notes could not be read safely. No notes were changed.",
    );
  const ids = new Set<string>();
  for (const note of input.notes) {
    if (!note || typeof note !== "object")
      throw new Error("A saved note could not be read. No notes were changed.");
    requireText(note.id, "identity", 100);
    if (ids.has(note.id))
      throw new Error(
        "Duplicate note identities were found. No notes were changed.",
      );
    ids.add(note.id);
    const anchor = note.anchor;
    if (
      !anchor ||
      anchor.lessonId !== lessonId ||
      !Number.isSafeInteger(anchor.sectionIndex) ||
      anchor.sectionIndex < 0 ||
      !/^[a-f0-9]{64}$/.test(anchor.sectionFingerprint)
    )
      throw new Error(
        "A saved note has an invalid source. No notes were changed.",
      );
    requireText(anchor.lessonTitle, "lesson title", 1000);
    requireText(anchor.sectionTitle, "section title", 1000);
    requireText(anchor.sectionKey, "section key", 200);
    requireContents(note.body, note.quote);
    if (
      !Number.isFinite(Date.parse(note.createdAt)) ||
      !Number.isFinite(Date.parse(note.updatedAt))
    )
      throw new Error(
        "A saved note has an invalid date. No notes were changed.",
      );
  }
  // Return only known note fields. Account metadata is never exported.
  return {
    scope,
    lessonId,
    notes: input.notes.map((note) => ({
      id: note.id,
      anchor: {
        lessonId,
        lessonTitle: note.anchor.lessonTitle,
        sectionIndex: note.anchor.sectionIndex,
        sectionKey: note.anchor.sectionKey,
        sectionTitle: note.anchor.sectionTitle,
        sectionFingerprint: note.anchor.sectionFingerprint,
      },
      quote: note.quote,
      body: note.body,
      createdAt: note.createdAt,
      updatedAt: note.updatedAt,
    })),
  };
}

async function requestNotes(
  scope: string,
  lessonId: string,
  body?: Record<string, unknown>,
) {
  requireScope(scope, lessonId);
  if (typeof navigator !== "undefined" && navigator.onLine === false)
    throw new Error(
      "You're offline. Reconnect to load or save account notes. Keep your unsaved draft open.",
    );
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20000);
  let response: Response;
  let value: { draftScope?: unknown; notes?: unknown; error?: unknown };
  try {
    response = await fetch(
      body
        ? "/api/notes"
        : `/api/notes?${new URLSearchParams({ lesson: lessonId, scope })}`,
      {
        method: body ? "POST" : "GET",
        credentials: "same-origin",
        cache: "no-store",
        headers: {
          Accept: "application/json",
          ...(body ? { "Content-Type": "application/json" } : {}),
        },
        ...(body
          ? { body: JSON.stringify({ ...body, deviceScope: scope, lessonId }) }
          : {}),
        signal: controller.signal,
      },
    );
    value = await response.json();
  } catch {
    throw new Error(
      body
        ? "Could not confirm this change with your account. Your draft is still here. Reconnect and retry, or refresh saved notes before editing further."
        : "Could not load your account notes. Reconnect and retry; saved notes may be out of date.",
    );
  } finally {
    clearTimeout(timeout);
  }
  if (!value || typeof value !== "object" || Array.isArray(value))
    throw new Error(
      "The notes server returned an unreadable response. Keep your draft open and retry.",
    );
  if (!response.ok)
    throw new Error(
      typeof value.error === "string"
        ? value.error.slice(0, 1000)
        : "Your account notes could not be updated. Keep your draft open and retry.",
    );
  if (value.draftScope !== scope)
    throw new Error(
      "Your learning account changed. These notes were not loaded into the current account. Sign into the original account to continue.",
    );
  return readRecord({ scope, lessonId, notes: value.notes }, scope, lessonId)
    .notes;
}

export async function loadLessonNotes(
  scope: string,
  lessonId: string,
): Promise<LessonNote[]> {
  return requestNotes(scope, lessonId);
}

function confirmedNote(notes: LessonNote[], submitted: LessonNote) {
  const saved = notes.find((note) => note.id === submitted.id);
  if (
    !saved ||
    saved.body !== submitted.body ||
    saved.quote !== submitted.quote ||
    Object.keys(submitted.anchor).some(
      (key) =>
        saved.anchor[key as keyof LessonNoteAnchor] !==
        submitted.anchor[key as keyof LessonNoteAnchor],
    )
  )
    throw new Error(
      "The server did not confirm this note's contents. Your draft is still here. Refresh saved notes before trying again.",
    );
  return notes;
}

export async function addLessonNote(
  scope: string,
  source: LessonNoteSource,
  body: string,
  quote = "",
  id = crypto.randomUUID(),
) {
  requireScope(scope, source.lessonId);
  requireContents(body, quote);
  requireText(source.lessonTitle, "lesson title", 1000);
  requireText(source.sectionTitle, "section title", 1000);
  requireText(source.sectionKey, "section key", 200);
  if (!Number.isSafeInteger(source.sectionIndex) || source.sectionIndex < 0)
    throw new Error("This lesson section could not be identified.");
  // Snapshot all user input before the asynchronous fingerprint operation.
  const anchor: LessonNoteAnchor = {
    lessonId: source.lessonId,
    lessonTitle: source.lessonTitle,
    sectionIndex: source.sectionIndex,
    sectionKey: source.sectionKey,
    sectionTitle: source.sectionTitle,
    sectionFingerprint: "",
  };
  anchor.sectionFingerprint = await lessonSectionFingerprint(
    source.sectionText,
  );
  const now = new Date().toISOString();
  const note: LessonNote = {
    id,
    anchor,
    body,
    quote,
    createdAt: now,
    updatedAt: now,
  };
  return confirmedNote(
    await requestNotes(scope, anchor.lessonId, {
      action: "save",
      note,
      expectedUpdatedAt: null,
    }),
    note,
  );
}

/** Editing changes only the reflection and requires the version the user opened. */
export async function updateLessonNote(
  scope: string,
  lessonId: string,
  original: LessonNote,
  body: string,
  expectedUpdatedAt: string,
) {
  requireContents(body, original.quote);
  if (
    original.anchor.lessonId !== lessonId ||
    original.updatedAt !== expectedUpdatedAt
  )
    throw new Error(
      "This note's source or version changed. Reload your notes before editing.",
    );
  const note = { ...original, body };
  return confirmedNote(
    await requestNotes(scope, lessonId, {
      action: "save",
      note,
      expectedUpdatedAt,
    }),
    note,
  );
}

export async function deleteLessonNote(
  scope: string,
  lessonId: string,
  id: string,
  expectedUpdatedAt: string,
) {
  const notes = await requestNotes(scope, lessonId, {
    action: "delete",
    id,
    expectedUpdatedAt,
  });
  if (notes.some((note) => note.id === id))
    throw new Error(
      "The server did not confirm this deletion. Refresh saved notes before trying again.",
    );
  return notes;
}

export function lessonNotesError(error: unknown) {
  if (error instanceof Error && error.message) return error.message;
  return "Could not confirm this change with your account. Your draft is still here; try again.";
}

function heading(text: string) {
  return text
    .replace(/[\r\n]+/g, " ")
    .replace(/([\\`*_{}\[\]()#+.!|<>~-])/g, "\\$1");
}
function fenced(text: string) {
  // A longer fence cannot be closed by any fence in the user's exact content.
  const fence = "`".repeat(
    Math.max(
      3,
      ...Array.from(text.matchAll(/`+/g), (match) => match[0].length + 1),
    ),
  );
  return `${fence}text\n${text}\n${fence}`;
}
export function exportLessonNotesMarkdown(
  lessonId: string,
  lessonTitle: string,
  notes: LessonNote[],
) {
  const current = notes.filter((note) => note.anchor.lessonId === lessonId);
  return [
    `# ${heading(lessonTitle)} — My notes`,
    "Exported from CodeQuest saved notes. This file is yours to save or import into Obsidian; it is not a live sync.",
    `Lesson: ${heading(lessonId)}`,
    ...current.map((note, index) =>
      [
        `## ${index + 1}. ${heading(note.anchor.sectionTitle)}`,
        `Created: ${note.createdAt}  \nUpdated: ${note.updatedAt}`,
        `Source: ${heading(note.anchor.lessonTitle)} / section ${note.anchor.sectionIndex + 1} (${heading(note.anchor.sectionKey)})  \nSection fingerprint (SHA-256): ${note.anchor.sectionFingerprint}`,
        ...(note.quote ? ["### Selected passage", fenced(note.quote)] : []),
        ...(note.body ? ["### My reflection", fenced(note.body)] : []),
      ].join("\n\n"),
    ),
    "",
  ].join("\n\n");
}

export function lessonNotesFilename(lessonId: string) {
  return `codequest-${lessonId.replace(/[^a-zA-Z0-9_-]/g, "-").slice(0, 100) || "lesson"}-notes.md`;
}
