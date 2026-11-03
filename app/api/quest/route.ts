import { projectChecks, hasTypeContracts } from "../../../lib/project-checks";
import { z } from "zod";
import {
  db,
  owner,
  state,
  profile,
  checkOrigin,
  encryptConnection,
  errorResponse,
  defaults,
  accountScope,
} from "../../../lib/server";
import lessons from "../../../content/lessons.json";
import catalog from "../../../content/catalog.json";
import type { Lesson } from "../../../lib/types";
import { getReadingSectionKeys } from "../../../lib/lesson-completion";
export const dynamic = "force-dynamic";
function noStore(response: Response) {
  const headers = new Headers(response.headers);
  headers.set("Cache-Control", "no-store");
  return new Response(response.body, { status: response.status, headers });
}
function json(value: unknown, init: ResponseInit = {}) {
  return noStore(Response.json(value, init));
}
const units = new Map(catalog.units.map((u) => [u.id, u]));
const bodySchema = z.object({
  action: z.enum([
    "save",
    "quiz",
    "math",
    "complete",
    "completeConcept",
    "preferences",
    "key",
    "disconnect",
    "import",
  ]),
  deviceScope: z.string().length(64).optional(),
  expectedCode: z.string().max(60000).optional(),
  completedAt: z.string().datetime().optional(),
  unitId: z.string().optional(),
  code: z.string().max(60000).optional(),
  answer: z.number().int().optional(),
  manualReview: z.boolean().optional(),
  checks: z
    .array(z.object({ label: z.string().max(200), passed: z.boolean() }))
    .max(30)
    .optional(),
  key: z
    .string()
    .trim()
    .min(10)
    .max(500)
    .regex(/^[\x21-\x7E]+$/)
    .optional(),
  provider: z.enum(["deepseek", "openai", "anthropic"]).optional(),
  settings: z
    .object({
      courseBookmarks: z.record(z.string().max(40), z.object({
        view: z.enum(["quest", "studio"]), studioMode: z.literal("course"),
        phase: z.enum(["learn", "practice", "build", "done"]),
        activeId: z.string().max(60), paragraph: z.number().int().min(0).max(10000),
        concept: z.string().max(60).optional(), savedAt: z.string().datetime(),
      })).refine(value => Object.keys(value).length <= 40),
      track: z.string().max(40),
      level: z.enum(["beginner", "intermediate", "advanced"]),
      activeUnit: z.string().max(60),
      calm: z.boolean(),
      theme: z.enum(["light", "dark"]),
      dailyGoal: z.number().int().min(1).max(10),
      runnerUrl: z.string().max(200),
      aiEnabled: z.boolean(),
      hintsEnabled: z.boolean(),
      analogiesEnabled: z.boolean(),
      mathEnabled: z.boolean(),
      rewardsEnabled: z.boolean(),
      largeText: z.boolean(),
      autoSync: z.boolean(),
    })
    .partial()
    .optional(),
  backup: z
    .array(
      z.object({
        unitId: z.string(),
        code: z.string().max(60000),
        quizPassed: z.number().optional(),
        mathPassed: z.number().optional(),
      }),
    )
    .max(1000)
    .optional(),
});
async function ensure(user: string, id: string, code: string) {
  await db()
    .prepare(
      "INSERT OR IGNORE INTO progress(user_id,unit_id,code,updated_at) VALUES(?,?,?,?)",
    )
    .bind(user, id, code, new Date().toISOString())
    .run();
}
export async function GET(req: Request) {
  try {
    const user = await owner();
    const url = new URL(req.url);
    const unit = url.searchParams.get("unit");
    if (unit) {
      if (!units.has(unit))
        return json({ error: "Unknown lesson." }, { status: 404 });
      const history = await db()
        .prepare(
          "SELECT id,code,created_at AS createdAt FROM snapshots WHERE user_id=? AND unit_id=? ORDER BY created_at DESC LIMIT 30",
        )
        .bind(user, unit)
        .all();
      const chat = await db()
        .prepare(
          "SELECT question,answer,created_at AS createdAt FROM chats WHERE user_id=? AND unit_id=? ORDER BY created_at DESC LIMIT 12",
        )
        .bind(user, unit)
        .all();
      return json(
        {
          draftScope: await accountScope(user),
          history: history.results,
          chat: chat.results.reverse(),
        },
        { headers: { "Cache-Control": "no-store" } },
      );
    }
    return json(await state(user), {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (e) {
    return noStore(errorResponse(e));
  }
}
export async function POST(req: Request) {
  try {
    checkOrigin(req);
    const user = await owner();
    if (Number(req.headers.get("content-length") ?? 0) > 7_000_000)
      return json(
        { error: "This backup is too large." },
        { status: 413 },
      );
    const body = bodySchema.parse(await req.json());
    if (body.deviceScope && body.deviceScope !== (await accountScope(user)))
      return json(
        {
          error: "Sign into the account that created these device saves.",
          accountMismatch: true,
        },
        { status: 403 },
      );
    const now = new Date().toISOString();
    if (body.action === "preferences") {
      const p = await profile(user);
      const settings = {
        ...defaults,
        ...JSON.parse(p!.settings),
        ...body.settings,
      };
      delete settings.tutorLimit;
      if (!units.has(settings.activeUnit))
        return json(
          { error: "Choose a known lesson." },
          { status: 400 },
        );
      const allowed = [...new Set(catalog.units.map(unit => unit.track))];
      if (!allowed.includes(settings.track))
        return json(
          { error: "Choose a known course." },
          { status: 400 },
        );
      for (const [track, bookmark] of Object.entries(body.settings?.courseBookmarks ?? {})) {
        if (units.get(bookmark.activeId)?.track !== track) return json({ error: "Choose a known course bookmark." }, { status: 400 });
      }
      const runner = new URL(settings.runnerUrl);
      if (
        !["127.0.0.1", "localhost"].includes(runner.hostname) ||
        runner.protocol !== "http:"
      )
        return json(
          { error: "The Swift runner must be a local address." },
          { status: 400 },
        );
      const { courseBookmarks, ...otherSettings } = body.settings ?? {};
      const updates = [db().prepare("UPDATE profiles SET settings=json_patch(settings,?) WHERE user_id=?")
        .bind(JSON.stringify({ ...otherSettings, tutorLimit: null }), user)];
      for (const [track, bookmark] of Object.entries(courseBookmarks ?? {})) {
        const path = '$.courseBookmarks.' + track;
        // Atomic timestamp guard: delayed offline writes cannot erase a newer device's place.
        updates.push(db().prepare("UPDATE profiles SET settings=json_set(settings,?,json(?)) WHERE user_id=? AND (json_extract(settings,?) IS NULL OR json_extract(settings,?) < ?)")
          .bind(path, JSON.stringify(bookmark), user, path + '.savedAt', path + '.savedAt', bookmark.savedAt));
      }
      await db().batch(updates);
    } else if (body.action === "key") {
      if (!body.key)
        return json({ error: "Enter an API key." }, { status: 400 });
      await profile(user);
      await db()
        .prepare(
          "UPDATE profiles SET encrypted_key=?, settings=json_patch(settings,'{\"aiDisconnected\":false}') WHERE user_id=?",
        )
        .bind(
          await encryptConnection(body.provider ?? "deepseek", body.key, user),
          user,
        )
        .run();
    } else if (body.action === "disconnect") {
      await db()
        .prepare(
          "UPDATE profiles SET encrypted_key=NULL, settings=json_patch(settings,'{\"aiDisconnected\":true}') WHERE user_id=?",
        )
        .bind(user)
        .run();
    } else if (body.action === "import") {
      if (!body.backup)
        return json(
          { error: "Choose a CodeQuest backup." },
          { status: 400 },
        );
      for (const item of body.backup) {
        if (!units.has(item.unitId)) continue;
        await ensure(user, item.unitId, item.code);
        await db()
          .prepare(
            "UPDATE progress SET code=?,updated_at=? WHERE user_id=? AND unit_id=?",
          )
          .bind(item.code, now, user, item.unitId)
          .run();
      }
    } else {
      const id = body.unitId;
      if (!id || !units.has(id))
        return json({ error: "Unknown lesson." }, { status: 404 });
      const lesson = (lessons as Lesson[]).find((l) => l.id === id);
      if (!lesson)
        return json(
          { error: "This lesson is unavailable." },
          { status: 404 },
        );
      if (body.action === "completeConcept") {
        const respond = (value: unknown, status = 200) => json(value, {
          status, headers: { "Cache-Control": "no-store" },
        });
        if (lesson.learningMode !== "concept")
          return respond({ error: "This lesson requires its project completion flow." }, 400);
        if (!body.deviceScope)
          return respond({ error: "A verified account scope is required." }, 400);
        const keys = getReadingSectionKeys(lesson);
        if (!keys.length)
          return respond({ error: "This concept lesson has no reading steps." }, 400);
        // Both writes run in one D1 transaction and repeat the actual account
        // reading/quiz gate. No client reading claims or run proofs are accepted.
        const eligible = `user_id=? AND unit_id=? AND quiz_passed=1 AND (
          SELECT COUNT(*) FROM lesson_reading AS reading
          WHERE reading.user_id=progress.user_id AND reading.lesson_id=progress.unit_id
            AND reading.checked=1 AND reading.marked_at IS NOT NULL
            AND reading.section_key IN (${keys.map(() => "?").join(",")})
        )=?`;
        const args = [user, id, ...keys, keys.length];
        const writes = await db().batch([
          db().prepare(`INSERT INTO activity(user_id,day,completed)
            SELECT ?,?,1 WHERE EXISTS(SELECT 1 FROM progress WHERE ${eligible} AND completed_at IS NULL)
            ON CONFLICT(user_id,day) DO UPDATE SET completed=completed+1`)
            .bind(user, now.slice(0, 10), ...args),
          db().prepare(`UPDATE progress SET completed_at=COALESCE(completed_at,?),updated_at=? WHERE ${eligible}`)
            .bind(now, now, ...args),
        ]);
        if (!writes[1].meta.changes)
          return respond({ error: "Save every reading check and pass the practice question before finishing this concept lesson." }, 400);
        return respond(await state(user));
      }
      if (body.action === "complete" && lesson.learningMode === "concept")
        return json({ error: "Use concept completion after reading and the practice question." }, {
          status: 400, headers: { "Cache-Control": "no-store" },
        });
      await ensure(user, id, lesson.starter);
      if (body.action === "save") {
        if (body.code === undefined)
          return json({ error: "Code is required." }, { status: 400 });
        const previous = await db()
          .prepare("SELECT code FROM progress WHERE user_id=? AND unit_id=?")
          .bind(user, id)
          .first<{ code: string }>();
        if (previous?.code === body.code)
          return json(await state(user), {
            headers: { "Cache-Control": "no-store" },
          });
        const expected = body.expectedCode ?? previous?.code ?? lesson.starter;
        if (previous?.code !== expected)
          return json(
            {
              error: "This project has another saved copy.",
              conflict: true,
              unitId: id,
            },
            { status: 409 },
          );
        const writes = await db().batch([
          db()
            .prepare(
              "INSERT INTO snapshots(id,user_id,unit_id,code,created_at) SELECT ?,user_id,unit_id,code,? FROM progress WHERE user_id=? AND unit_id=? AND code=?",
            )
            .bind(crypto.randomUUID(), now, user, id, expected),
          db()
            .prepare(
              "UPDATE progress SET code=?,updated_at=? WHERE user_id=? AND unit_id=? AND code=?",
            )
            .bind(body.code, now, user, id, expected),
          db()
            .prepare(
              "DELETE FROM snapshots WHERE user_id=? AND unit_id=? AND id NOT IN (SELECT id FROM snapshots WHERE user_id=? AND unit_id=? ORDER BY created_at DESC LIMIT 30)",
            )
            .bind(user, id, user, id),
        ]);
        if (!writes[1].meta.changes)
          return json(
            {
              error: "This project changed during the save.",
              conflict: true,
              unitId: id,
            },
            { status: 409 },
          );
      }
      if (body.action === "quiz" || body.action === "math") {
        const q = body.action === "quiz" ? lesson.quiz : lesson.math;
        if (!q)
          return json(
            { error: "There is no math question for this topic." },
            { status: 400 },
          );
        const correct = body.answer === q.answer;
        if (correct)
          await db()
            .prepare(
              body.action === "quiz"
                ? "UPDATE progress SET quiz_passed=1 WHERE user_id=? AND unit_id=?"
                : "UPDATE progress SET math_passed=1 WHERE user_id=? AND unit_id=?",
            )
            .bind(user, id)
            .run();
        return json({
          correct,
          feedback: body.action === "math" ? q.feedback : q.explanation,
          state: await state(user),
        });
      }
      if (body.action === "complete") {
        const p = await db()
          .prepare(
            "SELECT code,quiz_passed,math_passed,completed_at FROM progress WHERE user_id=? AND unit_id=?",
          )
          .bind(user, id)
          .first<{
            code: string;
            quiz_passed: number;
            math_passed: number;
            completed_at: string | null;
          }>();
        if (!p?.quiz_passed)
          return json(
            { error: "Finish the practice question first." },
            { status: 400 },
          );
        const proof = body.checks;
        if (lesson.externalNotes && !hasTypeContracts(lesson) && !body.manualReview)
          return json(
            { error: "Check the steps in your local project first." },
            { status: 400 },
          );
        if (
          !lesson.checks.length &&
          !(lesson.runtime === "swift" && body.manualReview)
        )
          return json(
            { error: "Review this project in Xcode before finishing." },
            { status: 400 },
          );
        if (
          !proof ||
          proof.length !== projectChecks(lesson).length ||
          proof.some((c, i) => !c.passed || c.label !== projectChecks(lesson)[i].label)
        )
          return json(
            { error: "Run your project and pass its checks first." },
            { status: 400 },
          );
        if (body.code === undefined)
          return json(
            { error: "Save and run your code first." },
            { status: 400 },
          );
        if (p.code !== body.code)
          return json(
            {
              error:
                "Your saved project changed. Save it and run the checks again.",
              conflict: true,
              unitId: id,
            },
            { status: 409 },
          );
        const completedAt =
          body.completedAt &&
          Date.parse(body.completedAt) <= Date.now() + 300000
            ? body.completedAt
            : now;
        const day = completedAt.slice(0, 10);
        const completionWrites = await db().batch([
          db()
            .prepare(
              "INSERT INTO activity(user_id,day,completed) SELECT ?,?,1 WHERE EXISTS(SELECT 1 FROM progress WHERE user_id=? AND unit_id=? AND code=? AND completed_at IS NULL) ON CONFLICT(user_id,day) DO UPDATE SET completed=completed+1",
            )
            .bind(user, day, user, id, body.code),
          db()
            .prepare(
              "UPDATE progress SET completed_at=COALESCE(completed_at,?),last_run=?,updated_at=? WHERE user_id=? AND unit_id=? AND code=?",
            )
            .bind(
              completedAt,
              JSON.stringify({
                checks: proof,
                manualReview: !!body.manualReview,
                code: body.code,
              }),
              now,
              user,
              id,
              body.code,
            ),
        ]);
        if (!completionWrites[1].meta.changes)
          return json(
            {
              error: "Your saved project changed. Run its checks again.",
              conflict: true,
              unitId: id,
            },
            { status: 409 },
          );
      }
    }
    return json(await state(user), {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (e) {
    if (e instanceof z.ZodError)
      return json(
        { error: "Check the information and try again." },
        { status: 400 },
      );
    return noStore(errorResponse(e));
  }
}
