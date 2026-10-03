import assert from "node:assert/strict";
import { readFile, mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { createRequire } from "node:module";
import { spawnSync } from "node:child_process";
import vm from "node:vm";
import ts from "typescript";
import { z } from "zod";
const temp = await mkdtemp(path.join(tmpdir(), "codequest-unlimited-"));
const database = path.join(temp, "fixture.sqlite");
const query = (sql, params = []) => {
  const py =
    "import sys,json,sqlite3\nsql,params=json.loads(sys.stdin.read())\nc=sqlite3.connect(sys.argv[1]);c.row_factory=sqlite3.Row\nr=c.execute(sql,params);rows=[dict(x) for x in r.fetchall()];c.commit();print(json.dumps(rows));c.close()";
  const r = spawnSync("python3", ["-c", py, database], {
    input: JSON.stringify([sql, params]),
    encoding: "utf8",
  });
  assert.equal(r.status, 0, r.stderr);
  return JSON.parse(r.stdout);
};
try {
  query(
    "CREATE TABLE activity(user_id TEXT,day TEXT,tutor_used INTEGER NOT NULL DEFAULT 0,PRIMARY KEY(user_id,day))",
  );
  query(
    "CREATE TABLE chats(id TEXT,user_id TEXT,unit_id TEXT,question TEXT,answer TEXT,created_at TEXT)",
  );
  let settings = { aiEnabled: true, tutorLimit: 20 },
    connection = { provider: "deepseek", key: "synthetic-test-only" },
    calls = [],
    providerFailure = false;
  const scope = "a".repeat(64),
    user = "fixture-learner",
    day = new Date().toISOString().slice(0, 10);
  class AssistantError extends Error {
    constructor(message, status) {
      super(message);
      this.status = status;
    }
  }
  const server = {
    checkOrigin() {},
    owner: async () => user,
    profile: async () => ({ settings: JSON.stringify(settings) }),
    accountScope: async () => scope,
    aiConnection: async () => connection,
    errorResponse: (e) => Response.json({ error: e.message }, { status: 500 }),
    db: () => ({
      prepare(sql) {
        let params = [];
        return {
          bind(...p) {
            params = p;
            return this;
          },
          async run() {
            query(sql, params);
            return {};
          },
          async first() {
            return query(sql, params)[0] ?? null;
          },
        };
      },
    }),
  };
  const source = await readFile("app/api/tutor/route.ts", "utf8");
  const js = ts.transpileModule(source, {
    compilerOptions: {
      target: ts.ScriptTarget.ES2022,
      module: ts.ModuleKind.CommonJS,
      esModuleInterop: true,
    },
  }).outputText;
  const require = createRequire(import.meta.url);
  const route = { exports: {} };
  const mapped = {
    "../../../lib/server": server,
    "../../../lib/ai-transport": {
      AssistantError,
      askProvider: async (provider, key, system, messages) => {
        calls.push({ provider, system, messages });
        if (providerFailure)
          throw new AssistantError("Provider rate limit", 429);
        return "A plain explanation.";
      },
    },
    "../../../lib/ai-providers": {
      providers: {
        deepseek: { model: "test-deepseek" },
        openai: { model: "test-openai" },
        anthropic: { model: "test-anthropic" },
      },
    },
    "../../../content/lessons.json": JSON.parse(
      await readFile("content/lessons.json", "utf8"),
    ),
    "../../../content/catalog.json": JSON.parse(
      await readFile("content/catalog.json", "utf8"),
    ),
    zod: { z },
  };
  vm.runInNewContext(
    js,
    {
      module: route,
      exports: route.exports,
      require: (id) => (id in mapped ? mapped[id] : require(id)),
      Request,
      Response,
      crypto,
      Date,
      console,
    },
    { filename: "actual-tutor-route.cjs" },
  );
  const body = {
    unitId: "python-01",
    question: "Explain a variable.",
    code: "",
    mode: "explain",
    deviceScope: scope,
  };
  const send = (extra = {}) =>
    route.exports.POST(
      new Request("https://fixture.example/api/tutor", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...body, ...extra }),
      }),
    );
  const used = () =>
    query("SELECT tutor_used FROM activity WHERE user_id=? AND day=?", [
      user,
      day,
    ])[0]?.tutor_used ?? 0;
  let checked = 0;
  for (const provider of ["deepseek", "openai", "anthropic"])
    for (const cap of [1, 20, 100])
      for (const count of [cap - 1, cap, cap + 1, 10000]) {
        settings = { aiEnabled: true, tutorLimit: cap };
        connection = { provider, key: "synthetic-test-only" };
        query(
          "INSERT OR REPLACE INTO activity(user_id,day,tutor_used) VALUES(?,?,?)",
          [user, day, count],
        );
        const r = await send({ expectedProvider: provider });
        assert.equal(r.status, 200);
        assert.equal((await r.json()).provider, provider);
        assert.equal(used(), count + 1);
        assert.equal(calls.at(-1).provider, provider);
        checked++;
      }
  const count = used(),
    before = calls.length;
  settings.aiEnabled = false;
  assert.equal((await send()).status, 403);
  settings.aiEnabled = true;
  connection = null;
  assert.equal((await send()).status, 409);
  connection = { provider: "deepseek", key: "synthetic-test-only" };
  assert.equal((await send({ expectedProvider: "openai" })).status, 409);
  assert.equal((await send({ deviceScope: "b".repeat(64) })).status, 403);
  assert.equal((await send({ unitId: "missing" })).status, 400);
  assert.equal(used(), count);
  assert.equal(calls.length, before);
  providerFailure = true;
  assert.equal((await send()).status, 429);
  assert.equal(used(), count + 1);
  providerFailure = false;
  assert.equal((await send()).status, 200);
  assert.equal(used(), count + 2);
  const total = used();
  const parallel = await Promise.all(Array.from({ length: 8 }, () => send()));
  assert.ok(parallel.every((r) => r.status === 200));
  assert.equal(used(), total + 8);
  // This is a quoted learning selection; it follows the same provider route.
  const selected = 'pet_name = "Pepper"\nprint(pet_name)';
  const q =
    "Please clarify the selected passage.\n\nSelected passage:\n" + selected;
  assert.equal(
    (await send({ question: q, mode: "explain", expectedProvider: "deepseek" }))
      .status,
    200,
  );
  assert.equal(calls.at(-1).messages.at(-1).content, q);
  assert.match(calls.at(-1).system, /Quoted passages/);
  console.log(
    `Passed ${checked} former-cap boundary/provider cases, concurrent atomic counts, AI-off/account/provider gates, external rate-limit propagation and selected-passage routing. No real provider calls.`,
  );
} finally {
  await rm(temp, { recursive: true, force: true });
}
