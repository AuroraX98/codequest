import assert from "node:assert/strict";
import { readFile, mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import vm from "node:vm";
import { createRequire } from "node:module";
import { spawnSync } from "node:child_process";
import ts from "typescript";
import { z } from "zod";

const temp = await mkdtemp(path.join(tmpdir(), "codequest-practice-server-"));
const sqlite = path.join(temp, "fixture.sqlite");
const require = createRequire(import.meta.url);
const query = (sql, params = []) => {
  const code =
    "import sqlite3,json,sys\nc=sqlite3.connect(sys.argv[1]);c.row_factory=sqlite3.Row\nsql,p=json.loads(sys.stdin.read());r=c.execute(sql,p);out=[dict(x) for x in r.fetchall()];c.commit();c.close();print(json.dumps(out))";
  const result = spawnSync("python3", ["-c", code, sqlite], {
    input: JSON.stringify([sql, params]),
    encoding: "utf8",
  });
  assert.equal(result.status, 0, result.stderr);
  return JSON.parse(result.stdout);
};
const load = async (file, imports = {}) => {
  const module = { exports: {} };
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
      module,
      exports: module.exports,
      require: (id) => (id in imports ? imports[id] : require(id)),
      z,
      crypto,
      Request,
      Response,
      TextEncoder,
      TextDecoder,
      Uint8Array,
      Date,
      fetch: () => {
        throw new Error("Live networking disabled");
      },
      AbortSignal,
    },
    { filename: file },
  );
  return module.exports;
};
try {
  query(
    "CREATE TABLE activity(user_id TEXT,day TEXT,tutor_used INTEGER NOT NULL DEFAULT 0,PRIMARY KEY(user_id,day))",
  );
  const providers = await load("lib/ai-providers.ts");
  const practice = await load("lib/practice-project.ts", {
    "./ai-providers": providers,
  });
  const transport = await load("lib/ai-transport.ts", {
    "./ai-providers": providers,
  });
  const lessons = JSON.parse(await readFile("content/lessons.json", "utf8"));
  const catalog = JSON.parse(await readFile("content/catalog.json", "utf8"));
  const scope = "a".repeat(64),
    originalUser = "fixture-practice-user";
  let user = originalUser,
    enabled = true;
  let connection = {
    provider: "deepseek",
    key: "synthetic-personal-practice-key",
  };
  let calls = [],
    writes = 0,
    answer,
    afterProvider,
    providerFailure;
  const generated = (runtime = "javascript") => ({
    title: "A small score keeper",
    task: "Store a score and show it.",
    explanation: [
      "A variable is a name for a value. A number holds an amount.",
      `Read this first example.\n\n\`\`\`${runtime}\n${runtime === "python" ? "score = 2\nprint(score)" : "const score = 2;\nconsole.log(score);"}\n\`\`\`\nIt shows 2.`,
      `Read this second example.\n\n\`\`\`${runtime}\n${runtime === "python" ? "points = 3\nprint(points)" : "const points = 3;\nconsole.log(points);"}\n\`\`\`\nIt shows 3.`,
    ],
    steps: [
      "Choose a score.",
      "Store it using the name score.",
      "Show the score.",
    ],
    requirements: ["The score is 5."],
    starter: runtime === "python" ? "score = 0" : "const score = 0;",
    filename: {
      javascript: "main.js",
      python: "main.py",
      typescript: "main.ts",
      sql: "answer.sql",
      html: "index.html",
      css: "styles.css",
      react: "App.jsx",
      swift: "main.swift",
    }[runtime],
    checks: [{ label: "The score is five", expression: "score == 5" }],
    hints: [
      "Store a number.",
      "Change the value on the right of the equals sign.",
    ],
    solution:
      runtime === "python"
        ? "score = 5\nprint(score)"
        : "const score = 5;\nconsole.log(score);",
  });
  const server = {
    owner: async () => {
      if (!user) throw new Error("Unauthorized");
      return user;
    },
    checkOrigin: (req) => {
      if (req.headers.get("Origin") === "https://wrong.example")
        throw new Error("Wrong origin");
    },
    accountScope: async () => scope,
    profile: async () => ({ settings: JSON.stringify({ aiEnabled: enabled }) }),
    aiConnection: async () => connection,
    errorResponse: (error) =>
      Response.json(
        {
          error:
            error.message === "Unauthorized" ? "Sign in." : "Request rejected.",
        },
        { status: error.message === "Unauthorized" ? 401 : 403 },
      ),
    db: () => ({
      prepare(sql) {
        assert.match(
          sql,
          /^(INSERT OR IGNORE INTO activity|UPDATE activity SET tutor_used)/,
          "Practice must never award XP or alter official progress",
        );
        let params;
        return {
          bind(...value) {
            params = value;
            return this;
          },
          async run() {
            writes++;
            query(sql, params);
            return {};
          },
        };
      },
    }),
  };
  const route = await load("app/api/practice/route.ts", {
    "../../../lib/server": server,
    "../../../lib/practice-project": practice,
    "../../../lib/ai-providers": providers,
    "../../../content/lessons.json": lessons,
    "../../../content/catalog.json": catalog,
    "../../../lib/ai-transport": {
      AssistantError: transport.AssistantError,
      askProvider: async (...args) => {
        calls.push(args);
        if (providerFailure)
          throw new transport.AssistantError("Provider unavailable", 504);
        if (afterProvider) await afterProvider();
        return answer;
      },
    },
  });
  const input = {
    baseUnitId: "javascript-01",
    difficulty: "beginner",
    idea: "A score keeper",
    deviceScope: scope,
    expectedProvider: "deepseek",
  };
  const send = (patch = {}, options = {}) =>
    route.POST(
      new Request("https://fixture.example/api/practice", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(options.headers ?? {}),
        },
        body: options.raw ?? JSON.stringify({ ...input, ...patch }),
      }),
    );
  const usage = () =>
    query("SELECT SUM(tutor_used) AS used FROM activity")[0].used ?? 0;
  let assertions = 0;
  for (const provider of providers.providerIds) {
    connection = { provider, key: "synthetic-personal-practice-key" };
    answer = JSON.stringify(generated());
    const before = usage();
    const response = await send({ expectedProvider: provider });
    assert.equal(response.status, 200);
    const result = await response.json();
    const validated = practice.validatePracticeProject(result);
    assert.equal(validated.project.runtime, "javascript");
    assert.equal(validated.provider, provider);
    assert.equal(validated.baseUnitId, input.baseUnitId);
    assert.ok(!JSON.stringify(result).includes(connection.key));
    assert.equal(usage(), before + 1);
    assert.equal(calls.at(-1)[5].maxOutputTokens, 6000);
    const lesson = practice.practiceLesson(validated);
    assert.equal(lesson.id, validated.id);
    assert.equal(lesson.math, null);
    assert.ok(!("xp" in result));
    const request = transport.providerRequest(
      provider,
      "synthetic",
      "Tutor",
      [],
    );
    const generation = transport.providerRequest(
      provider,
      "synthetic",
      "Generate",
      [],
      { maxOutputTokens: 6000 },
    );
    assert.equal(
      request.body.max_tokens ?? request.body.max_output_tokens,
      provider === "openai" ? 6000 : 1600,
    );
    assert.equal(
      generation.body.max_tokens ?? generation.body.max_output_tokens,
      6000,
    );
    let sentBudget;
    const payload =
      provider === "deepseek"
        ? {
            choices: [
              { finish_reason: "stop", message: { content: "Fixture reply" } },
            ],
          }
        : provider === "anthropic"
          ? {
              stop_reason: "end_turn",
              content: [{ type: "text", text: "Fixture reply" }],
            }
          : {
              status: "completed",
              output: [
                {
                  type: "message",
                  content: [{ type: "output_text", text: "Fixture reply" }],
                },
              ],
            };
    const forwarded = await transport.askProvider(
      provider,
      "synthetic",
      "Fixture",
      [],
      async (_url, options) => {
        const sent = JSON.parse(options.body);
        sentBudget = sent.max_tokens ?? sent.max_output_tokens;
        assert.equal(options.redirect, "manual");
        return Response.json(payload);
      },
      { maxOutputTokens: 6000 },
    );
    assert.equal(forwarded, "Fixture reply");
    assert.equal(sentBudget, 6000);
    assertions++;
  }
  connection = { provider: "deepseek", key: "synthetic-personal-practice-key" };
  const gate = async (name, patch, options, expected) => {
    const used = usage(),
      count = calls.length,
      previousWrites = writes;
    const response = await send(patch, options);
    assert.equal(response.status, expected, name);
    assert.equal(usage(), used, name + " usage unchanged");
    assert.equal(calls.length, count, name + " no provider contact");
    assert.equal(writes, previousWrites, name + " no usage writes");
    assertions++;
  };
  await gate("wrong scope", { deviceScope: "b".repeat(64) }, {}, 403);
  await gate("missing scope", { deviceScope: undefined }, {}, 400);
  await gate("provider changed", { expectedProvider: "openai" }, {}, 409);
  await gate("key pasted into idea", { idea: connection.key }, {}, 400);
  await gate("unknown topic", { baseUnitId: "not-a-lesson" }, {}, 400);
  await gate("invalid difficulty", { difficulty: "impossible" }, {}, 400);
  await gate("long idea", { idea: "x".repeat(501) }, {}, 400);
  await gate("unexpected field", { runtime: "swift" }, {}, 400);
  await gate("bad JSON", {}, { raw: "{broken" }, 400);
  await gate("oversized bytes", {}, { raw: "x".repeat(8193) }, 400);
  await gate(
    "oversized declaration",
    {},
    { headers: { "Content-Length": "8193" } },
    400,
  );
  await gate(
    "wrong origin",
    {},
    { headers: { Origin: "https://wrong.example" } },
    403,
  );
  enabled = false;
  await gate("AI disabled", {}, {}, 403);
  enabled = true;
  connection = null;
  await gate("no personal key", {}, {}, 409);
  connection = { provider: "deepseek", key: "synthetic-personal-practice-key" };
  user = null;
  await gate("anonymous", {}, {}, 401);
  user = originalUser;
  const wrapped = JSON.stringify(generated());
  answer = "```json\n" + wrapped + "\n```";
  assert.equal(
    (await send()).status,
    200,
    "One exact outer JSON fence is accepted",
  );
  answer = "```JSON\r\n" + wrapped + "\r\n```";
  assert.equal((await send()).status, 200, "An exact outer fence accepts CRLF");
  const marker = "MODEL_SECRET_FIELD_sk-proj-private_marker_123456789";
  for (const [bad, category] of [
    ["Here is your project:\n" + wrapped, "invalid_json"],
    [wrapped + "\nTrailing prose", "invalid_json"],
    [wrapped + wrapped, "invalid_json"],
    ["```json\n" + wrapped + "\n```\nExtra text", "invalid_json"],
    [JSON.stringify({ ...generated(), [marker]: marker }), "unexpected_fields"],
    [
      JSON.stringify({ ...generated(), filename: marker + "/main.js" }),
      "invalid_filename",
    ],
    [JSON.stringify({ ...generated(), title: undefined }), "invalid_fields"],
    [JSON.stringify({ ...generated(), task: "x".repeat(1401) }), "too_large"],
    [
      JSON.stringify({
        ...generated(),
        explanation: ["Intro", "Terms", "No code examples"],
      }),
      "missing_examples",
    ],
    [
      JSON.stringify({
        ...generated(),
        hints: [generated().solution, "Hint two"],
      }),
      "solution_exposed",
    ],
    [
      JSON.stringify({ ...generated(), starter: generated().solution }),
      "starter_complete",
    ],
    [JSON.stringify({ ...generated(), checks: [] }), "missing_checks"],
    [
      JSON.stringify({
        ...generated(),
        extraFiles: [{ name: "helper.js", code: "" }],
      }),
      "invalid_file_layout",
    ],
    [
      JSON.stringify({
        ...generated(),
        task: "Go to https://private.example/" + marker,
      }),
      "external_data",
    ],
    [
      JSON.stringify({
        ...generated(),
        solution: "fetch('/private/local-fixture')",
      }),
      "unsupported_services",
    ],
    [
      JSON.stringify({
        ...generated(),
        solution: "import stuff from 'local-fixture-module';",
      }),
      "unsupported_dependencies",
    ],
    ['{"title":"' + marker + '","task":', "invalid_json"],
    ["x".repeat(60001), "too_large"],
  ]) {
    answer = bad;
    const response = await send();
    const error = await response.json();
    assert.equal(response.status, 502);
    assert.equal(error.validationCode, category);
    assert.equal(typeof error.error, "string");
    assert.ok(!JSON.stringify(error).includes(marker));
    assert.ok(!JSON.stringify(error).includes(connection.key));
    assertions++;
  }
  const maliciousError = new practice.PracticeValidationError("invalid_fields");
  maliciousError.message = marker;
  assert.ok(
    !JSON.stringify(
      practice.practiceValidationFailure(maliciousError),
    ).includes(marker),
  );
  maliciousError.validationCode = marker;
  assert.equal(
    practice.practiceValidationFailure(maliciousError).validationCode,
    "invalid_fields",
  );
  maliciousError.validationCode = "__proto__";
  assert.equal(
    practice.practiceValidationFailure(maliciousError).validationCode,
    "invalid_fields",
  );
  const petProject = generated("python");
  petProject.solution =
    'pet_name = "Pepper"\npet_age = 3\nprint(f"{pet_name} is {pet_age} years old.")';
  petProject.starter = 'pet_name = ""\npet_age = 0';
  const pythonBase = lessons.find((lesson) => lesson.id === "python-01");
  const partialExample = {
    ...petProject,
    explanation: [
      'A name stores text. For example, pet_name = "Pepper" stores one pet name. The project still needs the age and full introduction.',
      ...petProject.explanation.slice(1),
    ],
  };
  assert.equal(
    practice.parseGeneratedPractice(JSON.stringify(partialExample), pythonBase)
      .runtime,
    "python",
    "One shared line does not expose the whole three-line answer",
  );
  assert.throws(
    () =>
      practice.parseGeneratedPractice(
        JSON.stringify({
          ...petProject,
          hints: [petProject.solution, "Hint two"],
        }),
        pythonBase,
      ),
    (error) =>
      practice.practiceValidationFailure(error).validationCode ===
      "solution_exposed",
    "A complete three-line pet answer in hints is rejected",
  );
  for (const bad of [
    '{"title":',
    "```json\n{}\n```",
    JSON.stringify({ ...generated(), runtime: "python" }),
    JSON.stringify({ ...generated(), filename: "../main.js" }),
    JSON.stringify({ ...generated(), checks: [] }),
    JSON.stringify({ ...generated(), task: "Visit https://example.com" }),
    JSON.stringify({
      ...generated(),
      solution: "import thing from 'external';",
    }),
    JSON.stringify({ ...generated(), solution: "fetch('/api/private')" }),
    JSON.stringify({
      ...generated(),
      explanation: ["Only one idea", "No examples", "Still no examples"],
    }),
    JSON.stringify({ ...generated(), title: connection.key }),
    "x".repeat(60001),
  ]) {
    answer = bad;
    const response = await send();
    assert.equal(response.status, 502);
    const data = await response.json();
    assert.ok(!JSON.stringify(data).includes(bad));
    assert.ok(!JSON.stringify(data).includes(connection.key));
    assertions++;
  }
  answer = JSON.stringify(generated());
  for (const change of [
    () => {
      user = "other-user";
    },
    () => {
      enabled = false;
    },
    () => {
      connection = { provider: "openai", key: "other-synthetic-key" };
    },
    () => {
      connection = { provider: "deepseek", key: "new-synthetic-key" };
    },
    () => {
      connection = null;
    },
  ]) {
    afterProvider = change;
    assert.equal((await send()).status, 409);
    user = originalUser;
    enabled = true;
    connection = {
      provider: "deepseek",
      key: "synthetic-personal-practice-key",
    };
    afterProvider = undefined;
    assertions++;
  }
  providerFailure = true;
  assert.equal((await send()).status, 504);
  providerFailure = false;
  assertions++;
  for (const runtime of [
    "javascript",
    "typescript",
    "python",
    "sql",
    "html",
    "css",
    "react",
    "swift",
  ]) {
    const base = lessons.find(
      (lesson) => lesson.runtime === runtime && lesson.checks.length,
    );
    const parsed = practice.parseGeneratedPractice(
      JSON.stringify(generated(runtime)),
      base,
    );
    assert.equal(parsed.runtime, runtime);
    const prompt = practice.createPracticePrompt(
      base,
      catalog.units.find((unit) => unit.id === base.id),
      "advanced",
    );
    assert.match(prompt, /Any additional concept must be explained/);
    assert.match(prompt, /at least two small worked examples/);
    assert.ok(prompt.length < 30000);
    assertions++;
  }
  const manual = lessons.find(
    (lesson) => lesson.runtime === "swift" && !lesson.checks.length,
  );
  const manualContent = { ...generated("swift"), checks: [] };
  assert.equal(
    practice.parseGeneratedPractice(JSON.stringify(manualContent), manual)
      .manualReview,
    true,
  );
  assert.throws(() =>
    practice.parseGeneratedPractice(
      JSON.stringify(manualContent),
      lessons.find((lesson) => lesson.id === "swift-01"),
    ),
  );
  assert.throws(() =>
    practice.parseGeneratedPractice(
      JSON.stringify({
        ...generated("python"),
        solution: "import requests\nscore = 5",
      }),
      lessons.find((lesson) => lesson.runtime === "python"),
    ),
  );
  assert.throws(() =>
    practice.parseGeneratedPractice(
      JSON.stringify({
        ...generated(),
        extraFiles: [{ name: "main.js", code: "" }],
      }),
      lessons.find((lesson) => lesson.runtime === "javascript"),
    ),
  );
  assert.throws(() =>
    transport.providerRequest("deepseek", "synthetic", "", [], {
      maxOutputTokens: 6001,
    }),
  );
  assert.throws(() =>
    transport.providerAnswer("deepseek", {
      choices: [
        {
          finish_reason: "length",
          message: { content: "truncated private output" },
        },
      ],
    }),
  );
  assert.throws(() =>
    transport.providerAnswer("anthropic", {
      stop_reason: "max_tokens",
      content: [{ type: "text", text: "truncated" }],
    }),
  );
  assert.throws(() =>
    transport.providerAnswer("openai", { status: "incomplete", output: [] }),
  );
  const usedBefore = usage();
  answer = JSON.stringify(generated());
  await Promise.all(Array.from({ length: 8 }, () => send()));
  assert.equal(usage(), usedBefore + 8);
  console.log(
    `Passed ${assertions} practice generation cases plus malformed/dependency/manual/truncation checks, eight concurrent atomic usage increments, all runtime prompt contracts, preserved tutor budgets, and zero official XP writes. All provider responses used fixtures; real SQLite counters executed.`,
  );
} finally {
  await rm(temp, { recursive: true, force: true });
}
