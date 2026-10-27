import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import { createRequire } from "node:module";
import { DatabaseSync } from "node:sqlite";
import vm from "node:vm";
import ts from "typescript";

const require = createRequire(import.meta.url);
const load = async (file, imports = {}) => {
  const fixture = { exports: {} };
  const compiled = ts.transpileModule(await readFile(file, "utf8"), {
    compilerOptions: {
      target: ts.ScriptTarget.ES2022,
      module: ts.ModuleKind.CommonJS,
      esModuleInterop: true,
    },
  }).outputText;
  vm.runInNewContext(
    compiled,
    {
      module: fixture,
      exports: fixture.exports,
      require: (id) => (id in imports ? imports[id] : require(id)),
      crypto,
      Request,
      Response,
      Headers,
      URL,
      TextEncoder,
      TextDecoder,
      Uint8Array,
      Date,
      console: { error() {} },
      fetch() {
        throw new Error("Reading marks never call providers or the network.");
      },
    },
    { filename: file },
  );
  return fixture.exports;
};
const database = new DatabaseSync(":memory:");
let statements = 0;
const d1 = {
  prepare(sql) {
    statements++;
    assert.match(sql, /^(SELECT|INSERT|UPDATE)\b/);
    assert.match(
      sql,
      /lesson_reading/,
      "Reading must not change progress, notes, profiles, or credentials.",
    );
    let params = [];
    return {
      bind(...values) {
        params = values;
        return this;
      },
      async first() {
        return database.prepare(sql).get(...params) ?? null;
      },
      async all() {
        return { results: database.prepare(sql).all(...params) };
      },
    };
  },
};
try {
  const journal = JSON.parse(
    await readFile("drizzle/meta/_journal.json", "utf8"),
  );
  const migrations = (await readdir("drizzle"))
    .filter((file) => file.endsWith(".sql"))
    .sort();
  assert.equal(journal.entries.length, migrations.length);
  assert.equal(journal.entries[0].tag, "0000_large_puppet_master");
  assert.equal(journal.entries[0].when, 1791000016964);
  assert.equal(journal.entries[1].tag, "0001_slow_hercules");
  assert.equal(journal.entries[1].when, 1792568204701);
  assert.equal(migrations[2], "0002_explicit_lesson_reading.sql");
  database.exec(await readFile("drizzle/" + migrations[0], "utf8"));
  const userA = "authenticated-owner-A",
    userB = "authenticated-owner-B";
  const timestamp = "2026-01-01T00:00:00.000Z";
  database
    .prepare(
      "INSERT INTO profiles(user_id,settings,encrypted_key,created_at) VALUES(?,?,?,?)",
    )
    .run(
      userA,
      '{"mathEnabled":true}',
      "unchanged-test-placeholder",
      timestamp,
    );
  database
    .prepare(
      "INSERT INTO progress(user_id,unit_id,code,quiz_passed,math_passed,completed_at,last_run,updated_at) VALUES(?,?,?,?,?,?,?,?)",
    )
    .run(
      userA,
      "python-01",
      "print('old')",
      1,
      1,
      timestamp,
      timestamp,
      timestamp,
    );
  const originalProfile = JSON.stringify(
    database.prepare("SELECT * FROM profiles").all(),
  );
  const originalProgress = JSON.stringify(
    database.prepare("SELECT * FROM progress").all(),
  );
  for (const migration of migrations.slice(1)) {
    const sql = await readFile("drizzle/" + migration, "utf8");
    assert.doesNotMatch(
      sql,
      /\b(DROP|DELETE|ALTER|UPDATE|INSERT)\b/i,
      "Additive migrations cannot rewrite or backfill existing data.",
    );
    database.exec(sql);
  }
  assert.equal(
    database.prepare("SELECT COUNT(*) AS n FROM lesson_reading").get().n,
    0,
    "No invented read history on upgrade.",
  );
  let user = userA;
  const server = await load("lib/server.ts", {
    "cloudflare:workers": { env: { DB: d1 } },
    "../app/chatgpt-auth": {
      getChatGPTUser: async () => (user ? { userId: user } : null),
    },
    "./ai-keys": {},
    "./profile": { defaultProfile: {}, normalizeProfile: (value) => value },
  });
  const lessons = JSON.parse(await readFile("content/lessons.json", "utf8"));
  const model = await load("lib/lesson-completion.ts");
  const route = await load("app/api/reading/route.ts", {
    "../../../content/lessons.json": lessons,
    "../../../lib/lesson-completion": model,
    "../../../lib/server": server,
  });
  const scopeA = await server.accountScope(userA),
    scopeB = await server.accountScope(userB);
  assert.notEqual(scopeA, scopeB);
  const get = (scope = scopeA, headers = {}) =>
    route.GET(
      new Request(
        `https://reading.example/api/reading?scope=${encodeURIComponent(scope)}`,
        { headers },
      ),
    );
  const post = (input, options = {}) =>
    route.POST(
      new Request("https://reading.example/api/reading", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...options.headers },
        body: options.raw ?? JSON.stringify(input),
      }),
    );
  const input = (patch = {}) => ({
    accountScope: scopeA,
    lessonId: "python-01",
    sectionKey: "concept:program",
    checked: true,
    expectedUpdatedAt: null,
    ...patch,
  });
  const checked = async (pending, status = 200) => {
    const response = await pending;
    assert.equal(response.status, status, await response.clone().text());
    assert.equal(
      response.headers.get("Cache-Control"),
      "no-store",
      "Never cache private reading or errors.",
    );
    return response.json();
  };
  const snapshot = () =>
    JSON.stringify(
      database
        .prepare(
          "SELECT * FROM lesson_reading ORDER BY user_id,lesson_id,section_key",
        )
        .all(),
    );
  let rejectionCases = 0;
  const reject = async (operation, status, beforeDatabase = true) => {
    const rows = snapshot(),
      before = statements;
    await checked(operation(), status);
    if (beforeDatabase)
      assert.equal(
        statements,
        before,
        "Reject invalid identity/input before querying data.",
      );
    assert.equal(
      snapshot(),
      rows,
      "Rejected operations change no reading data.",
    );
    rejectionCases++;
  };
  for (let i = 0; i < 3; i++)
    assert.deepEqual(
      (await checked(get())).reading,
      [],
      "Opening or reloading never marks anything read.",
    );
  let saved = await checked(post(input()));
  assert.equal(saved.accountScope, scopeA);
  assert.equal(saved.record.lessonId, "python-01");
  assert.equal(saved.record.sectionKey, "concept:program");
  assert.equal(saved.record.checked, true);
  assert.equal(saved.record.markedAt, saved.record.updatedAt);
  assert.match(
    saved.record.updatedAt,
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/,
  );
  assert.ok(
    !JSON.stringify(saved).includes(userA),
    "Never return raw authenticated principal.",
  );
  assert.equal(
    database.prepare("SELECT user_id FROM lesson_reading").get().user_id,
    userA,
  );
  assert.deepEqual(
    (await checked(get())).reading,
    [saved.record],
    "Fresh account reload returns the saved mark.",
  );
  await reject(() => post(input()), 409, false);
  const marked = saved.record;
  saved = await checked(
    post(input({ checked: false, expectedUpdatedAt: marked.updatedAt })),
  );
  assert.equal(saved.record.checked, false);
  assert.equal(saved.record.markedAt, null);
  assert.ok(saved.record.updatedAt > marked.updatedAt);
  assert.equal(
    database.prepare("SELECT COUNT(*) AS n FROM lesson_reading").get().n,
    1,
    "Unchecked revision stays to prevent stale resurrection.",
  );
  await reject(() => post(input()), 409, false);
  await reject(
    () => post(input({ expectedUpdatedAt: marked.updatedAt })),
    409,
    false,
  );
  const unchecked = saved.record;
  const simultaneous = await Promise.all([
    post(input({ checked: true, expectedUpdatedAt: unchecked.updatedAt })),
    post(input({ checked: false, expectedUpdatedAt: unchecked.updatedAt })),
  ]);
  assert.deepEqual(
    simultaneous.map((r) => r.status).sort(),
    [200, 409],
    "Only one concurrent revision wins.",
  );
  saved.record = (await checked(get())).reading[0];
  assert.equal(saved.record.checked, true);
  assert.ok(saved.record.updatedAt > unchecked.updatedAt);
  assert.equal(saved.record.markedAt, saved.record.updatedAt);

  await reject(() => get(scopeB), 403);
  await reject(() => post(input({ accountScope: scopeB })), 403);
  user = userB;
  await reject(() => get(scopeA), 403);
  await reject(() => post(input()), 403);
  assert.deepEqual((await checked(get(scopeB))).reading, []);
  await reject(
    () =>
      post(
        input({
          accountScope: scopeB,
          expectedUpdatedAt: saved.record.updatedAt,
          checked: false,
        }),
      ),
    409,
    false,
  );
  const ownerB = await checked(
    post(input({ accountScope: scopeB, checked: false })),
  );
  assert.equal(
    ownerB.record.checked,
    false,
    "Accounts can independently mark the same section.",
  );
  assert.equal((await checked(get(scopeB))).reading[0].checked, false);
  user = userA;
  assert.equal(
    (await checked(get())).reading[0].checked,
    true,
    "Another account cannot alter this owner's marks.",
  );

  for (const patch of [
    { accountScope: undefined },
    { accountScope: "invalid" },
    { userId: userB },
    { user_id: userB },
    { extra: true },
    { lessonId: "unknown" },
    { lessonId: "" },
    { lessonId: "x".repeat(201) },
    { sectionKey: "text:0" },
    { sectionKey: "text:6" },
    { sectionKey: "concept:unknown" },
    { sectionKey: "text:00" },
    { sectionKey: "concept:program", lessonId: "javascript-01" },
    { sectionKey: "text:99999", lessonId: "javascript-01" },
    { sectionKey: "text:-1", lessonId: "javascript-01" },
    { sectionKey: "text:0 OR 1=1", lessonId: "javascript-01" },
    { checked: undefined },
    { checked: 1 },
    { checked: "true" },
    { expectedUpdatedAt: undefined },
    { expectedUpdatedAt: "yesterday" },
    { expectedUpdatedAt: timestamp.replace(".000", "") },
    { markedAt: timestamp },
    { updatedAt: timestamp },
  ])
    await reject(() => post(input(patch)), 400);
  await reject(() => post(input(), { raw: "{broken" }), 400);
  await reject(() => post(input(), { raw: new Uint8Array([0xff]) }), 400);
  await reject(() => post(input(), { raw: "x".repeat(4097) }), 413);
  await reject(
    () => post(input(), { headers: { "Content-Length": "4097" } }),
    413,
  );
  await reject(
    () => post(input(), { headers: { "Content-Type": "text/plain" } }),
    415,
  );
  await reject(() => get("invalid"), 400);
  await reject(() => get(scopeA, { Origin: "https://other.example" }), 403);
  await reject(
    () => post(input(), { headers: { Origin: "https://other.example" } }),
    403,
  );
  user = null;
  await reject(() => get(), 401);
  await reject(() => post(input()), 401);
  user = userA;

  // Catalog-wide account read endpoint; every canonical key works and remains
  // separate from supplementary pages, unrelated lessons, and all old progress.
  user = "authenticated-catalog-owner";
  const scopeAll = await server.accountScope(user);
  let count = 0;
  for (const lesson of lessons) {
    for (const key of model.getReadingSectionKeys(lesson)) {
      const result = await checked(
        post(
          input({
            accountScope: scopeAll,
            lessonId: lesson.id,
            sectionKey: key,
          }),
        ),
      );
      assert.equal(result.record.lessonId, lesson.id);
      assert.equal(result.record.sectionKey, key);
      count++;
    }
  }
  const all = (await checked(get(scopeAll))).reading;
  assert.equal(all.length, count);
  assert.equal(new Set(all.map((r) => r.lessonId)).size, 115);
  assert.equal(all.filter((r) => r.lessonId === "python-01").length, 6);
  for (const lesson of lessons) {
    const score = model.getLessonCompletion(lesson, undefined, all);
    assert.equal(
      score.readCompleted,
      model.getReadingSectionKeys(lesson).length,
    );
    assert.equal(score.completed, score.readTotal);
    assert.equal(
      score.isComplete,
      false,
      "Read marks do not create quiz/project achievements.",
    );
  }
  const insert = database.prepare(
    "INSERT INTO lesson_reading(user_id,lesson_id,section_key,checked,marked_at,updated_at) VALUES(?,?,?,?,?,?)",
  );
  insert.run(user, "retired-lesson", "text:0", 1, timestamp, timestamp);
  insert.run(user, "python-01", "text:0", 1, timestamp, timestamp);
  insert.run(user, "javascript-01", "text:9999", 1, timestamp, timestamp);
  assert.equal(
    (await checked(get(scopeAll))).reading.length,
    count,
    "Unknown/supplementary legacy keys are not exposed as current reading.",
  );
  assert.equal(
    database
      .prepare("SELECT COUNT(*) AS n FROM lesson_reading WHERE user_id=?")
      .get(user).n,
    count + 3,
    "Reading never deletes out-of-catalog records.",
  );
  assert.equal(
    JSON.stringify(database.prepare("SELECT * FROM profiles").all()),
    originalProfile,
  );
  assert.equal(
    JSON.stringify(database.prepare("SELECT * FROM progress").all()),
    originalProgress,
    "Old completion, code, quiz, math and timestamps remain byte-for-byte unchanged.",
  );
  console.log(
    `Passed reading API tests using real generated SQLite migrations: ${count} canonical sections across 115 lessons, ${rejectionCases} rejected stale/invalid/unauthorized cases, authenticated account isolation, explicit mark/unmark, atomic concurrency, no-store responses, bounded input, no fabricated reading backfill, and unchanged old progress/profile data.`,
  );
} finally {
  database.close();
}
