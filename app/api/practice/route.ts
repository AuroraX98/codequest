import { z } from "zod";
import { askProvider, AssistantError } from "../../../lib/ai-transport";
import { providers } from "../../../lib/ai-providers";
import {
  owner,
  profile,
  accountScope,
  aiConnection,
  checkOrigin,
  db,
  errorResponse,
} from "../../../lib/server";
import {
  practiceInputSchema,
  createPracticePrompt,
  parseGeneratedPractice,
  validatePracticeProject,
  PracticeValidationError,
  practiceValidationFailure,
} from "../../../lib/practice-project";
import lessons from "../../../content/lessons.json";
import catalog from "../../../content/catalog.json";
import type { Lesson, Unit } from "../../../lib/types";
export const dynamic = "force-dynamic";
const maximumBodyBytes = 8192;
class BodyError extends Error {}
async function inputBody(req: Request) {
  const declared = req.headers.get("content-length");
  if (declared && Number(declared) > maximumBodyBytes) throw new BodyError();
  const reader = req.body?.getReader();
  if (!reader) throw new BodyError();
  const chunks: Uint8Array[] = [];
  let size = 0;
  for (;;) {
    const { value, done } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > maximumBodyBytes) {
      await reader.cancel();
      throw new BodyError();
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
    throw new BodyError();
  }
}
export async function POST(req: Request) {
  try {
    checkOrigin(req);
    const user = await owner();
    const input = practiceInputSchema.parse(await inputBody(req));
    const scope = await accountScope(user);
    if (input.deviceScope !== scope)
      return Response.json(
        { error: "Sign into the original learning account." },
        { status: 403 },
      );
    const p = await profile(user);
    if (JSON.parse(p!.settings).aiEnabled === false)
      return Response.json(
        { error: "AI assistance is turned off in Settings." },
        { status: 403 },
      );
    const base = (lessons as Lesson[]).find(
      (lesson) => lesson.id === input.baseUnitId,
    );
    const unit = (catalog.units as Unit[]).find(
      (unit) => unit.id === input.baseUnitId,
    );
    if (!base || !unit)
      return Response.json(
        { error: "Choose a known course topic first." },
        { status: 400 },
      );
    const connection = await aiConnection(user, p);
    if (!connection)
      return Response.json(
        {
          error:
            "Connect your own AI provider in Settings to generate practice.",
          setupRequired: true,
        },
        { status: 409 },
      );
    if (connection.provider !== input.expectedProvider)
      return Response.json(
        {
          error:
            "Your AI provider changed. Check Settings before generating again.",
        },
        { status: 409 },
      );
    if (input.idea?.includes(connection.key))
      return Response.json(
        { error: "Describe your project idea without including an API key." },
        { status: 400 },
      );
    const day = new Date().toISOString().slice(0, 10);
    await db()
      .prepare("INSERT OR IGNORE INTO activity(user_id,day) VALUES(?,?)")
      .bind(user, day)
      .run();
    await db()
      .prepare(
        "UPDATE activity SET tutor_used=tutor_used+1 WHERE user_id=? AND day=?",
      )
      .bind(user, day)
      .run();
    const text = await askProvider(
      connection.provider,
      connection.key,
      createPracticePrompt(base, unit, input.difficulty),
      [
        {
          role: "user",
          content: JSON.stringify({
            idea:
              input.idea ||
              "Create a relatable practice project for this topic.",
          }),
        },
      ],
      fetch,
      { maxOutputTokens: 6000 },
    );
    // Identity and connection may have changed while the model was answering.
    if ((await owner()) !== user || (await accountScope(user)) !== scope)
      return Response.json(
        {
          error:
            "Your account changed. Generate practice again in the original account.",
        },
        { status: 409 },
      );
    const latestProfile = await profile(user);
    const latestConnection = await aiConnection(user, latestProfile);
    if (
      JSON.parse(latestProfile!.settings).aiEnabled === false ||
      !latestConnection ||
      latestConnection.provider !== connection.provider ||
      latestConnection.key !== connection.key
    )
      return Response.json(
        {
          error:
            "Your AI settings changed. Check Settings before generating again.",
        },
        { status: 409 },
      );
    if (text.includes(connection.key))
      return Response.json(
        practiceValidationFailure(new PracticeValidationError("external_data")),
        { status: 502 },
      );
    let project;
    try {
      project = parseGeneratedPractice(text, base);
    } catch (error) {
      return Response.json(practiceValidationFailure(error), { status: 502 });
    }
    const result = validatePracticeProject({
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      baseUnitId: base.id,
      difficulty: input.difficulty,
      provider: connection.provider,
      model: providers[connection.provider].model,
      project,
    });
    return Response.json(result, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    if (error instanceof AssistantError)
      return Response.json({ error: error.message }, { status: error.status });
    if (error instanceof BodyError || error instanceof z.ZodError)
      return Response.json(
        {
          error:
            "Choose a course topic and difficulty. Keep your project idea below 500 characters and the request below 8 KB.",
        },
        { status: 400 },
      );
    return errorResponse(error);
  }
}
