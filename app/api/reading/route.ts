import { z } from "zod";
import lessons from "../../../content/lessons.json";
import {
  isReadingSectionKey,
  type LessonReadingRecord,
} from "../../../lib/lesson-completion";
import {
  accountScope,
  checkOrigin,
  db,
  errorResponse,
  owner,
} from "../../../lib/server";

export const dynamic = "force-dynamic";
const maximumBodyBytes = 4096;
const scopeSchema = z.string().regex(/^[a-f0-9]{64}$/);
const inputSchema = z
  .object({
    accountScope: scopeSchema,
    lessonId: z.string().min(1).max(200),
    sectionKey: z.string().min(1).max(100),
    checked: z.boolean(),
    expectedUpdatedAt: z.string().datetime({ precision: 3 }).nullable(),
  })
  .strict();
const knownLessons = new Map(lessons.map((lesson) => [lesson.id, lesson]));
const columns = "lesson_id,section_key,checked,marked_at,updated_at";
type ReadingRow = {
  lesson_id: string;
  section_key: string;
  checked: number;
  marked_at: string | null;
  updated_at: string;
};
class InputError extends Error {
  constructor(
    message: string,
    public status = 400,
  ) {
    super(message);
  }
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
      { error: "This reading request is invalid. Nothing was changed." },
      400,
    );
  const response = errorResponse(error);
  const headers = new Headers(response.headers);
  headers.set("Cache-Control", "no-store");
  return new Response(response.body, { status: response.status, headers });
}
async function inputBody(req: Request): Promise<unknown> {
  if (
    req.headers.get("content-type")?.split(";")[0].trim().toLowerCase() !==
    "application/json"
  )
    throw new InputError("Send reading changes as JSON.", 415);
  const declared = req.headers.get("content-length");
  if (declared && Number(declared) > maximumBodyBytes)
    throw new InputError(
      "This reading request is too large. Nothing was changed.",
      413,
    );
  const reader = req.body?.getReader();
  if (!reader) throw new InputError("This reading request is empty.");
  const chunks: Uint8Array[] = [];
  let size = 0;
  for (;;) {
    const { value, done } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > maximumBodyBytes) {
      await reader.cancel();
      throw new InputError(
        "This reading request is too large. Nothing was changed.",
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
      "This reading request could not be read. Nothing was changed.",
    );
  }
}
function publicRecord(row: ReadingRow): LessonReadingRecord {
  return {
    lessonId: row.lesson_id,
    sectionKey: row.section_key,
    checked: row.checked === 1,
    markedAt: row.marked_at,
    updatedAt: row.updated_at,
  };
}
function knownRecord(row: ReadingRow) {
  const lesson = knownLessons.get(row.lesson_id);
  return !!lesson && isReadingSectionKey(lesson, row.section_key);
}
function nextTimestamp(previous?: string) {
  return new Date(
    Math.max(Date.now(), previous ? Date.parse(previous) + 1 : 0),
  ).toISOString();
}

export async function GET(req: Request) {
  try {
    checkOrigin(req);
    const user = await owner();
    const scope = scopeSchema.parse(new URL(req.url).searchParams.get("scope"));
    const authenticatedScope = await accountScope(user);
    if (scope !== authenticatedScope)
      return json({ error: "Sign into the original learning account." }, 403);
    const result = await db()
      .prepare(
        `SELECT ${columns} FROM lesson_reading WHERE user_id=? ORDER BY lesson_id,section_key`,
      )
      .bind(user)
      .all<ReadingRow>();
    // Future/retired content is retained in storage, never deleted or counted
    // against today's lesson catalog. Merely opening a lesson creates no marks.
    return json({
      accountScope: authenticatedScope,
      reading: result.results.filter(knownRecord).map(publicRecord),
    });
  } catch (error) {
    return failure(error);
  }
}

export async function POST(req: Request) {
  try {
    checkOrigin(req);
    const user = await owner();
    const input = inputSchema.parse(await inputBody(req));
    const authenticatedScope = await accountScope(user);
    if (input.accountScope !== authenticatedScope)
      return json({ error: "Sign into the original learning account." }, 403);
    const lesson = knownLessons.get(input.lessonId);
    if (!lesson || !isReadingSectionKey(lesson, input.sectionKey))
      throw new InputError(
        "Choose a current primary reading section. Nothing was changed.",
      );
    const now = nextTimestamp(input.expectedUpdatedAt ?? undefined);
    const markedAt = input.checked ? now : null;
    let saved: ReadingRow | null;
    if (input.expectedUpdatedAt === null) {
      // Never overwrite an existing mark, including an unchecked tombstone.
      saved = await db()
        .prepare(
          `INSERT INTO lesson_reading(user_id,lesson_id,section_key,checked,marked_at,updated_at) VALUES(?,?,?,?,?,?) ON CONFLICT(user_id,lesson_id,section_key) DO NOTHING RETURNING ${columns}`,
        )
        .bind(
          user,
          input.lessonId,
          input.sectionKey,
          Number(input.checked),
          markedAt,
          now,
        )
        .first<ReadingRow>();
    } else {
      // Atomic compare-and-swap prevents an older device overwriting a newer
      // mark or unmark. Unchecking keeps the row and advances its revision.
      saved = await db()
        .prepare(
          `UPDATE lesson_reading SET checked=?,marked_at=?,updated_at=? WHERE user_id=? AND lesson_id=? AND section_key=? AND updated_at=? RETURNING ${columns}`,
        )
        .bind(
          Number(input.checked),
          markedAt,
          now,
          user,
          input.lessonId,
          input.sectionKey,
          input.expectedUpdatedAt,
        )
        .first<ReadingRow>();
    }
    if (!saved)
      return json(
        {
          error:
            "This reading mark changed on another device. Reload saved reading before trying again.",
        },
        409,
      );
    return json({
      accountScope: authenticatedScope,
      record: publicRecord(saved),
    });
  } catch (error) {
    return failure(error);
  }
}
