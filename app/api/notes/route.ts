import { z } from "zod";
import lessons from "../../../content/lessons.json";
import { getLessonHeadings } from "../../../lib/lesson-headings";
import { pythonConcepts } from "../../../lib/python-concepts";
import type { LessonNote } from "../../../lib/lesson-notes";
import {
  accountScope,
  checkOrigin,
  db,
  errorResponse,
  owner,
} from "../../../lib/server";

export const dynamic = "force-dynamic";
const maximumBodyBytes = 192 * 1024;
const maximumNotes = 200;
const maximumTextLength = 12000;
const scopeSchema = z.string().regex(/^[a-f0-9]{64}$/);
const lessonIdSchema = z.string().min(1).max(200);
const timestampSchema = z.string().datetime({ precision: 3 });
const noteSchema = z
  .object({
    id: z.string().uuid(),
    anchor: z
      .object({
        lessonId: lessonIdSchema,
        lessonTitle: z.string().min(1).max(1000),
        sectionKey: z.string().regex(/^(text:[0-9]{1,4}|concept:[a-z]+)$/),
        sectionIndex: z.number().int().min(0).max(1000),
        sectionTitle: z.string().min(1).max(1000),
        sectionFingerprint: z.string().regex(/^[a-f0-9]{64}$/),
      })
      .strict(),
    quote: z.string().max(maximumTextLength),
    body: z.string().max(maximumTextLength),
    createdAt: timestampSchema,
    updatedAt: timestampSchema,
  })
  .strict()
  .refine((note) => !!(note.body.trim() || note.quote.trim()));
const inputSchema = z.discriminatedUnion("action", [
  z
    .object({
      action: z.literal("save"),
      deviceScope: scopeSchema,
      lessonId: lessonIdSchema,
      note: noteSchema,
      expectedUpdatedAt: timestampSchema.nullable(),
    })
    .strict(),
  z
    .object({
      action: z.literal("delete"),
      deviceScope: scopeSchema,
      lessonId: lessonIdSchema,
      id: z.string().uuid(),
      expectedUpdatedAt: timestampSchema,
    })
    .strict(),
]);

class InputError extends Error {
  constructor(
    message: string,
    public status = 400,
  ) {
    super(message);
  }
}
const conflictMessage =
  "This note changed or was deleted on another device. Your draft has not overwritten it. Reload your notes before trying again.";
function privateResponse(response: Response) {
  const headers = new Headers(response.headers);
  headers.set("Cache-Control", "no-store");
  return new Response(response.body, { status: response.status, headers });
}
function json(value: unknown, status = 200) {
  return Response.json(value, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}
function failure(error: unknown) {
  if (error instanceof InputError)
    return json({ error: error.message }, error.status);
  if (error instanceof z.ZodError)
    return json(
      {
        error:
          "This note request is invalid. Keep the reflection and selected passage within 12,000 characters each.",
      },
      400,
    );
  return privateResponse(errorResponse(error));
}
async function inputBody(req: Request): Promise<unknown> {
  if (
    req.headers.get("content-type")?.split(";")[0].trim().toLowerCase() !==
    "application/json"
  )
    throw new InputError("Send notes as JSON.", 415);
  const declared = req.headers.get("content-length");
  if (declared && Number(declared) > maximumBodyBytes)
    throw new InputError(
      "This note request is too large. Nothing was saved.",
      413,
    );
  const reader = req.body?.getReader();
  if (!reader) throw new InputError("This note request is empty.");
  const chunks: Uint8Array[] = [];
  let size = 0;
  for (;;) {
    const { value, done } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > maximumBodyBytes) {
      await reader.cancel();
      throw new InputError(
        "This note request is too large. Nothing was saved.",
        413,
      );
    }
    chunks.push(value);
  }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  try {
    return JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(bytes));
  } catch {
    throw new InputError(
      "This note request could not be read. Nothing was saved.",
    );
  }
}
function knownLesson(id: string) {
  const lesson = lessons.find((item) => item.id === id);
  if (!lesson)
    throw new InputError("Choose a known lesson before opening notes.");
  return lesson;
}
type NoteRow = {
  id: string;
  lesson_id: string;
  lesson_title: string;
  section_key: string;
  section_index: number;
  section_title: string;
  section_fingerprint: string;
  quote: string;
  body: string;
  created_at: string;
  updated_at: string;
};
const columns =
  "id,lesson_id,lesson_title,section_key,section_index,section_title,section_fingerprint,quote,body,created_at,updated_at";
function publicNote(row: NoteRow): LessonNote {
  return {
    id: row.id,
    anchor: {
      lessonId: row.lesson_id,
      lessonTitle: row.lesson_title,
      sectionKey: row.section_key,
      sectionIndex: row.section_index,
      sectionTitle: row.section_title,
      sectionFingerprint: row.section_fingerprint,
    },
    quote: row.quote,
    body: row.body,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
async function listNotes(user: string, lessonId: string) {
  const result = await db()
    .prepare(
      `SELECT ${columns} FROM lesson_notes WHERE user_id=? AND lesson_id=? AND deleted_at IS NULL ORDER BY created_at,id LIMIT ?`,
    )
    .bind(user, lessonId, maximumNotes)
    .all<NoteRow>();
  return result.results.map(publicNote);
}
function nextTimestamp(previous?: string) {
  // Distinct versions even if two writes occur within the same millisecond.
  return new Date(
    Math.max(Date.now(), previous ? Date.parse(previous) + 1 : 0),
  ).toISOString();
}
async function validateNewAnchor(
  note: LessonNote,
  lesson: ReturnType<typeof knownLesson>,
) {
  const anchor = note.anchor;
  let section: string | undefined;
  let title: string | undefined;
  if (anchor.sectionKey === `text:${anchor.sectionIndex}`) {
    section = lesson.explanation[anchor.sectionIndex];
    title = getLessonHeadings(lesson.id)[anchor.sectionIndex];
  } else if (lesson.id === "python-01") {
    const concept = pythonConcepts[anchor.sectionIndex];
    if (concept && anchor.sectionKey === `concept:${concept.id}`) {
      section = [
        concept.short,
        concept.why,
        concept.imagine,
        concept.limit,
      ].join("\n\n");
      title = concept.title;
    }
  }
  if (
    section === undefined ||
    anchor.lessonTitle !== lesson.title ||
    anchor.sectionTitle !== title
  )
    throw new InputError(
      "This note's lesson section changed. Keep your draft and reopen the current section.",
    );
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(section),
  );
  const fingerprint = Array.from(new Uint8Array(digest), (v) =>
    v.toString(16).padStart(2, "0"),
  ).join("");
  if (anchor.sectionFingerprint !== fingerprint)
    throw new InputError(
      "This note's lesson section changed. Keep your draft and reopen the current section.",
    );
}

export async function GET(req: Request) {
  try {
    checkOrigin(req);
    const user = await owner();
    const params = new URL(req.url).searchParams;
    const scope = scopeSchema.parse(params.get("scope"));
    const draftScope = await accountScope(user);
    if (scope !== draftScope)
      return json({ error: "Sign into the original learning account." }, 403);
    const lessonId = lessonIdSchema.parse(params.get("lesson"));
    knownLesson(lessonId);
    return json({ draftScope, notes: await listNotes(user, lessonId) });
  } catch (error) {
    return failure(error);
  }
}

export async function POST(req: Request) {
  try {
    checkOrigin(req);
    const user = await owner();
    const input = inputSchema.parse(await inputBody(req));
    const draftScope = await accountScope(user);
    if (input.deviceScope !== draftScope)
      return json({ error: "Sign into the original learning account." }, 403);
    const lesson = knownLesson(input.lessonId);
    if (input.action === "delete") {
      const now = nextTimestamp(input.expectedUpdatedAt);
      const deleted = await db()
        .prepare(
          "UPDATE lesson_notes SET deleted_at=?,updated_at=? WHERE user_id=? AND id=? AND lesson_id=? AND updated_at=? AND deleted_at IS NULL RETURNING id",
        )
        .bind(now, now, user, input.id, input.lessonId, input.expectedUpdatedAt)
        .first<{ id: string }>();
      if (!deleted) return json({ error: conflictMessage }, 409);
      return json({ draftScope, notes: await listNotes(user, input.lessonId) });
    }
    const { note, expectedUpdatedAt } = input;
    if (note.anchor.lessonId !== input.lessonId)
      throw new InputError("This note belongs to a different lesson.");
    let saved: NoteRow | null;
    if (expectedUpdatedAt === null) {
      await validateNewAnchor(note, lesson);
      const now = nextTimestamp();
      // The count and insert are one statement: simultaneous saves cannot exceed the cap.
      // ON CONFLICT never overwrites, including a deleted note with the same identity.
      saved = await db()
        .prepare(
          `INSERT INTO lesson_notes(user_id,id,lesson_id,lesson_title,section_key,section_index,section_title,section_fingerprint,quote,body,created_at,updated_at)
         SELECT ?,?,?,?,?,?,?,?,?,?,?,? WHERE (SELECT COUNT(*) FROM lesson_notes WHERE user_id=? AND lesson_id=? AND deleted_at IS NULL) < ?
         ON CONFLICT(user_id,id) DO NOTHING RETURNING ${columns}`,
        )
        .bind(
          user,
          note.id,
          input.lessonId,
          note.anchor.lessonTitle,
          note.anchor.sectionKey,
          note.anchor.sectionIndex,
          note.anchor.sectionTitle,
          note.anchor.sectionFingerprint,
          note.quote,
          note.body,
          now,
          now,
          user,
          input.lessonId,
          maximumNotes,
        )
        .first<NoteRow>();
    } else {
      const now = nextTimestamp(expectedUpdatedAt);
      // Only the reflection changes. Exact original quote, anchor, and creation time
      // are required, including for older notes whose lesson text has since changed.
      saved = await db()
        .prepare(
          `UPDATE lesson_notes SET body=?,updated_at=? WHERE user_id=? AND id=? AND lesson_id=? AND updated_at=? AND deleted_at IS NULL
         AND lesson_title=? AND section_key=? AND section_index=? AND section_title=? AND section_fingerprint=? AND quote=? AND created_at=? RETURNING ${columns}`,
        )
        .bind(
          note.body,
          now,
          user,
          note.id,
          input.lessonId,
          expectedUpdatedAt,
          note.anchor.lessonTitle,
          note.anchor.sectionKey,
          note.anchor.sectionIndex,
          note.anchor.sectionTitle,
          note.anchor.sectionFingerprint,
          note.quote,
          note.createdAt,
        )
        .first<NoteRow>();
    }
    if (!saved) {
      if (expectedUpdatedAt === null) {
        // A committed create may lose its network response. Replaying that same
        // identity and content is safe; a collision never overwrites a note.
        const existing = await db()
          .prepare(
            `SELECT ${columns} FROM lesson_notes WHERE user_id=? AND id=? AND lesson_id=? AND deleted_at IS NULL`,
          )
          .bind(user, note.id, input.lessonId)
          .first<NoteRow>();
        if (
          existing &&
          existing.lesson_title === note.anchor.lessonTitle &&
          existing.section_key === note.anchor.sectionKey &&
          existing.section_index === note.anchor.sectionIndex &&
          existing.section_title === note.anchor.sectionTitle &&
          existing.section_fingerprint === note.anchor.sectionFingerprint &&
          existing.quote === note.quote &&
          existing.body === note.body
        )
          return json({
            draftScope,
            note: publicNote(existing),
            notes: await listNotes(user, input.lessonId),
          });
      }
      const count = await db()
        .prepare(
          "SELECT COUNT(*) AS total FROM lesson_notes WHERE user_id=? AND lesson_id=? AND deleted_at IS NULL",
        )
        .bind(user, input.lessonId)
        .first<{ total: number }>();
      return json(
        {
          error:
            expectedUpdatedAt === null && count && count.total >= maximumNotes
              ? "This lesson already has 200 notes. Export your notes and delete one before adding another."
              : conflictMessage,
        },
        409,
      );
    }
    return json({
      draftScope,
      note: publicNote(saved),
      notes: await listNotes(user, input.lessonId),
    });
  } catch (error) {
    return failure(error);
  }
}
