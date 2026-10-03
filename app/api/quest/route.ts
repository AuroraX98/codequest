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
export const dynamic = "force-dynamic";
const units = new Map(catalog.units.map((u) => [u.id, u]));
const bodySchema = z.object({
  action: z.enum([
    "save",
    "quiz",
    "math",
    "complete",
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
    .max(103)
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
        return Response.json({ error: "Unknown lesson." }, { status: 404 });
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
      return Response.json(
        {
          draftScope: await accountScope(user),
          history: history.results,
          chat: chat.results.reverse(),
        },
        { headers: { "Cache-Control": "no-store" } },
      );
    }
    return Response.json(await state(user), {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (e) {
    return errorResponse(e);
  }
}
export async function POST(req: Request) {
  try {
    checkOrigin(req);
    const user = await owner();
    if (Number(req.headers.get("content-length") ?? 0) > 7_000_000)
      return Response.json(
        { error: "This backup is too large." },
        { status: 413 },
      );
    const body = bodySchema.parse(await req.json());
    if (body.deviceScope && body.deviceScope !== (await accountScope(user)))
      return Response.json(
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
        return Response.json(
          { error: "Choose a known lesson." },
          { status: 400 },
        );
      const allowed = [
        "javascript",
        "python",
        "html",
        "css",
        "sql",
        "swift",
        "typescript",
        "react",
        "backend",
        "developer-toolkit",
      ];
      if (!allowed.includes(settings.track))
        return Response.json(
          { error: "Choose a known course." },
          { status: 400 },
        );
      const runner = new URL(settings.runnerUrl);
      if (
        !["127.0.0.1", "localhost"].includes(runner.hostname) ||
        runner.protocol !== "http:"
      )
        return Response.json(
          { error: "The Swift runner must be a local address." },
          { status: 400 },
        );
      await db()
        .prepare(
          "UPDATE profiles SET settings=json_patch(settings,?) WHERE user_id=?",
        )
        .bind(JSON.stringify({ ...body.settings, tutorLimit: null }), user)
        .run();
    } else if (body.action === "key") {
      if (!body.key)
        return Response.json({ error: "Enter an API key." }, { status: 400 });
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
        return Response.json(
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
        return Response.json({ error: "Unknown lesson." }, { status: 404 });
      const lesson = (lessons as Lesson[]).find((l) => l.id === id);
      if (!lesson)
        return Response.json(
          { error: "This lesson is unavailable." },
          { status: 404 },
        );
      await ensure(user, id, lesson.starter);
      if (body.action === "save") {
        if (body.code === undefined)
          return Response.json({ error: "Code is required." }, { status: 400 });
        const previous = await db()
          .prepare("SELECT code FROM progress WHERE user_id=? AND unit_id=?")
          .bind(user, id)
          .first<{ code: string }>();
        if (previous?.code === body.code)
          return Response.json(await state(user), {
            headers: { "Cache-Control": "no-store" },
          });
        const expected = body.expectedCode ?? previous?.code ?? lesson.starter;
        if (previous?.code !== expected)
          return Response.json(
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
          return Response.json(
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
          return Response.json(
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
        return Response.json({
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
        const settings = {
          ...defaults,
          ...JSON.parse((await profile(user))!.settings),
        };
        if (
          !p?.quiz_passed ||
          (settings.mathEnabled && lesson.math && !p.math_passed)
        )
          return Response.json(
            { error: "Finish the practice and math question first." },
            { status: 400 },
          );
        const proof = body.checks;
        if (lesson.externalNotes && !body.manualReview)
          return Response.json(
            { error: "Check the steps in your local project first." },
            { status: 400 },
          );
        if (
          !lesson.checks.length &&
          !(lesson.runtime === "swift" && body.manualReview)
        )
          return Response.json(
            { error: "Review this project in Xcode before finishing." },
            { status: 400 },
          );
        if (
          !proof ||
          proof.length !== lesson.checks.length ||
          proof.some((c, i) => !c.passed || c.label !== lesson.checks[i].label)
        )
          return Response.json(
            { error: "Run your project and pass its checks first." },
            { status: 400 },
          );
        if (body.code === undefined)
          return Response.json(
            { error: "Save and run your code first." },
            { status: 400 },
          );
        if (p.code !== body.code)
          return Response.json(
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
          return Response.json(
            {
              error: "Your saved project changed. Run its checks again.",
              conflict: true,
              unitId: id,
            },
            { status: 409 },
          );
      }
    }
    return Response.json(await state(user), {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (e) {
    if (e instanceof z.ZodError)
      return Response.json(
        { error: "Check the information and try again." },
        { status: 400 },
      );
    return errorResponse(e);
  }
}
