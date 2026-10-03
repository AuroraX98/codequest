import { env } from "cloudflare:workers";
import { getChatGPTUser } from "../app/chatgpt-auth";
import type { Profile, QuestState, Progress } from "./types";
import { openConnection, sealConnection, storedConnection } from "./ai-keys";
import type { AIProvider } from "./ai-providers";
import { defaultProfile, normalizeProfile } from "./profile";
export const defaults: Profile = defaultProfile;
export async function accountScope(user: string) {
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode("codequest-drafts:" + user),
  );
  return Array.from(new Uint8Array(digest), (v) =>
    v.toString(16).padStart(2, "0"),
  ).join("");
}

export function db() {
  const b = (env as unknown as { DB?: D1Database }).DB;
  if (!b) throw new Error("The saved-progress database is not connected.");
  return b;
}
export async function owner() {
  const u = await getChatGPTUser();
  if (!u)
    throw new Response(
      JSON.stringify({ error: "Sign in to save your learning." }),
      { status: 401, headers: { "Content-Type": "application/json" } },
    );
  return u.userId;
}
export function checkOrigin(req: Request) {
  const origin = req.headers.get("origin");
  if (origin && origin !== new URL(req.url).origin)
    throw new Response(
      JSON.stringify({ error: "This request must come from your app." }),
      { status: 403, headers: { "Content-Type": "application/json" } },
    );
}
export async function profile(user: string) {
  await db()
    .prepare(
      "INSERT OR IGNORE INTO profiles(user_id,settings,created_at) VALUES(?,?,?)",
    )
    .bind(user, JSON.stringify(defaults), new Date().toISOString())
    .run();
  return await db()
    .prepare("SELECT * FROM profiles WHERE user_id=?")
    .bind(user)
    .first<{ settings: string; encrypted_key: string | null }>();
}
export async function state(user: string): Promise<QuestState> {
  const p = await profile(user);
  const rows = await db()
    .prepare(
      "SELECT unit_id AS unitId,code,quiz_passed AS quizPassed,math_passed AS mathPassed,completed_at AS completedAt,last_run AS lastRun,updated_at AS updatedAt FROM progress WHERE user_id=?",
    )
    .bind(user)
    .all<Progress>();
  const days = await db()
    .prepare(
      "SELECT day,completed AS count,tutor_used FROM activity WHERE user_id=? ORDER BY day DESC LIMIT 370",
    )
    .bind(user)
    .all<{ day: string; count: number; tutor_used: number }>();
  const today = new Date().toISOString().slice(0, 10);
  let streak = 0;
  const set = new Set(
    days.results.filter((d) => d.count > 0).map((d) => d.day),
  );
  const cursor = new Date(today + "T12:00:00Z");
  if (!set.has(today)) cursor.setUTCDate(cursor.getUTCDate() - 1);
  while (set.has(cursor.toISOString().slice(0, 10))) {
    streak++;
    cursor.setUTCDate(cursor.getUTCDate() - 1);
  }
  const completed = rows.results.filter((r) => r.completedAt).length;
  const draftScope = await accountScope(user);
  const { aiDisconnected, ...settings } = JSON.parse(p!.settings);
  const aiProvider = p?.encrypted_key
    ? storedConnection(p.encrypted_key).provider
    : null;
  return {
    draftScope,
    profile: normalizeProfile(settings),
    progress: rows.results,
    xp: completed * 100,
    completed,
    streak,
    todayCompleted: days.results.find((d) => d.day === today)?.count ?? 0,
    keyConnected: !!aiProvider,
    aiProvider,
    tutorUsed: days.results.find((d) => d.day === today)?.tutor_used ?? 0,
    recentDays: days.results.map((d) => ({ day: d.day, count: d.count })),
  };
}
function secret() {
  const key = (env as unknown as { AI_KEY_ENCRYPTION_KEY?: string })
    .AI_KEY_ENCRYPTION_KEY;
  if (!key)
    throw new Error(
      "Secure key storage needs a server setting before you can connect an AI assistant.",
    );
  return Uint8Array.from(atob(key), (c) => c.charCodeAt(0));
}
export async function encryptConnection(
  provider: AIProvider,
  value: string,
  user: string,
) {
  return sealConnection(provider, value, user, secret());
}
export async function aiConnection(
  user: string,
  row?: { settings: string; encrypted_key: string | null } | null,
) {
  const p = row ?? (await profile(user));
  if (p?.encrypted_key) return openConnection(p.encrypted_key, user, secret());
  return null;
}
export function errorResponse(e: unknown) {
  if (e instanceof Response) return e;
  console.error(
    "Request failed:",
    e instanceof Error ? e.message : "Unknown error",
  );
  return Response.json(
    {
      error:
        e instanceof Error
          ? e.message
          : "Something went wrong. Please try again.",
    },
    { status: 500 },
  );
}
