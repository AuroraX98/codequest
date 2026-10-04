import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import vm from "node:vm";
import { spawnSync } from "node:child_process";
import ts from "typescript";
const require = createRequire(import.meta.url);
const load = async (file, imports = {}) => {
  const module = { exports: {} };
  vm.runInNewContext(
    ts.transpileModule(await readFile(file, "utf8"), {
      compilerOptions: {
        target: ts.ScriptTarget.ES2022,
        module: ts.ModuleKind.CommonJS,
        esModuleInterop: true,
      },
    }).outputText,
    {
      module,
      exports: module.exports,
      require: (id) => (id in imports ? imports[id] : require(id)),
      crypto,
      Request,
      Response,
      TextEncoder,
      TextDecoder,
      Uint8Array,
      Date,
      AbortSignal,
      fetch: () => {
        throw new Error("Live networking disabled");
      },
    },
    { filename: file },
  );
  return module.exports;
};
const providers = await load("lib/ai-providers.ts");
const practice = await load("lib/practice-project.ts", {
  "./ai-providers": providers,
});
const lessons = JSON.parse(await readFile("content/lessons.json", "utf8"));
const catalog = JSON.parse(await readFile("content/catalog.json", "utf8"));
const base = lessons.find((lesson) => lesson.id === "python-01");
const project = {
  title: "Meet a pet",
  task: "Store a name and age, then show an introduction.",
  explanation: [
    "A variable is a name for a value. Text uses quotes, and a whole number does not.",
    'Read this example.\n\n```python\nname = "Luna"\nprint(name)\n```\nprint shows Luna.',
    "Read a second example.\n\n```python\nage = 2\nprint(age)\n```\nprint shows 2.",
  ],
  steps: ["Store a pet name.", "Store its age.", "Show its introduction."],
  requirements: ["The name is Pepper and the age is 3."],
  starter: 'pet_name = ""\npet_age = 0',
  filename: "main.py",
  solution:
    'pet_name = "Pepper"\npet_age = 3\nprint(f"{pet_name} is {pet_age} years old.")',
  checks: [
    {
      label: "The pet's values match",
      expression: 'pet_name == "Pepper" and pet_age == 3',
    },
  ],
  hints: ["Put quotes around the name.", "Use a number for the age."],
};
const json = JSON.stringify(project);
const structured = {
  ...project,
  explanation: [
    "A variable gives a value a name.",
    "Text uses quotes; a whole number does not.",
    "print shows a value. An f-string puts values into text using braces.",
  ],
  examples: [
    {
      explanation: "Store and show a name.",
      code: 'name = "Luna"\nprint(name)',
      output: "Luna",
    },
    {
      explanation: "Store and show an age.",
      code: "age = 2\nprint(age)",
      output: "2",
    },
  ],
};
const secret = "synthetic-fixture-never-a-real-key";
const marker = "MODEL_PRIVATE_FIELD_VALUE_DO_NOT_RETURN";
let answer = json;
class AssistantError extends Error {}
const route = await load("app/api/practice/route.ts", {
  "../../../lib/practice-project": practice,
  "../../../lib/ai-providers": providers,
  "../../../content/lessons.json": lessons,
  "../../../content/catalog.json": catalog,
  "../../../lib/ai-transport": {
    AssistantError,
    askProvider: async () => answer,
  },
  "../../../lib/server": {
    checkOrigin() {},
    owner: async () => "fixture-user",
    profile: async () => ({ settings: "{}" }),
    accountScope: async () => "a".repeat(64),
    aiConnection: async () => ({ provider: "deepseek", key: secret }),
    db: () => ({
      prepare(sql) {
        assert.match(
          sql,
          /^(INSERT OR IGNORE INTO activity|UPDATE activity SET tutor_used)/,
        );
        return {
          bind() {
            return this;
          },
          async run() {
            return {};
          },
        };
      },
    }),
    errorResponse: () =>
      Response.json({ error: "Fixture rejected." }, { status: 500 }),
  },
});
const send = () =>
  route.POST(
    new Request("https://fixture.example/api/practice", {
      method: "POST",
      body: JSON.stringify({
        baseUnitId: base.id,
        difficulty: "beginner",
        deviceScope: "a".repeat(64),
        expectedProvider: "deepseek",
      }),
    }),
  );
let cases = 0;
for (const valid of [
  json,
  " \n" + json + "\n ",
  "```json\n" + json + "\n```",
  "```JSON\r\n" + json + "\r\n```",
]) {
  answer = valid;
  assert.equal((await send()).status, 200);
  cases++;
}
for (const [content, category] of [
  ["Here is a project:\n" + json, "invalid_json"],
  [json + " trailing text", "invalid_json"],
  [json + json, "invalid_json"],
  ["```json\n" + json + "\n```\nextra", "invalid_json"],
  ['{"title":"' + marker + '","task":', "invalid_json"],
  [JSON.stringify({ ...project, [marker]: marker }), "unexpected_fields"],
  [
    JSON.stringify({ ...project, filename: marker + "/main.py" }),
    "invalid_filename",
  ],
  [JSON.stringify({ ...project, title: undefined }), "invalid_fields"],
  [JSON.stringify({ ...project, task: "x".repeat(1401) }), "too_large"],
  [
    JSON.stringify({
      ...project,
      explanation: ["Intro", "Terms", "No worked examples"],
    }),
    "missing_examples",
  ],
  [
    JSON.stringify({ ...project, hints: [project.solution, "Another hint"] }),
    "solution_exposed",
  ],
  [
    JSON.stringify({ ...project, starter: project.solution }),
    "starter_complete",
  ],
  [JSON.stringify({ ...project, checks: [] }), "missing_checks"],
  [
    JSON.stringify({
      ...project,
      extraFiles: [{ name: "helper.js", code: "" }],
    }),
    "invalid_file_layout",
  ],
  [
    JSON.stringify({
      ...project,
      task: "Go to https://private.example/" + marker,
    }),
    "external_data",
  ],
  [
    JSON.stringify({
      ...project,
      solution: 'import os\nos.system("' + marker + '")',
    }),
    "unsupported_services",
  ],
  [
    JSON.stringify({
      ...project,
      solution: "import requests\n" + project.solution,
    }),
    "unsupported_dependencies",
  ],
  [JSON.stringify({ ...project, title: secret }), "external_data"],
  ["x".repeat(60001), "too_large"],
]) {
  answer = content;
  const response = await send(),
    result = await response.json();
  assert.equal(response.status, 502);
  assert.equal(result.validationCode, category);
  assert.equal(typeof result.error, "string");
  assert.ok(!JSON.stringify(result).includes(marker));
  assert.ok(!JSON.stringify(result).includes(secret));
  cases++;
}
const partial = {
  ...project,
  explanation: [
    'For example, pet_name = "Pepper" stores a name. The age and full introduction still need code.',
    ...project.explanation.slice(1),
  ],
};
assert.equal(
  practice.parseGeneratedPractice(JSON.stringify(partial), base).runtime,
  "python",
);
cases++;
answer = JSON.stringify(structured);
const structuredResponse = await send();
assert.equal(structuredResponse.status, 200);
const canonical = await structuredResponse.json();
assert.deepEqual(
  canonical.project.explanation.slice(0, 3),
  structured.explanation,
);
assert.equal(canonical.project.explanation.length, 5);
assert.equal(
  canonical.project.explanation[3],
  'Store and show a name.\n\n```python\nname = "Luna"\nprint(name)\n```\n\nPrinted output:\n\n```text\nLuna\n```',
);
assert.equal(
  canonical.project.explanation[4],
  "Store and show an age.\n\n```python\nage = 2\nprint(age)\n```\n\nPrinted output:\n\n```text\n2\n```",
);
assert.ok(!("examples" in canonical.project));
assert.equal(
  practice.validatePracticeProject(canonical).project.explanation.length,
  5,
);
assert.throws(() =>
  practice.validatePracticeProject({
    ...canonical,
    project: { ...canonical.project, examples: structured.examples },
  }),
);
cases++;
const noPrint = practice.parseGeneratedPractice(
  JSON.stringify({
    ...structured,
    examples: [
      { ...structured.examples[0], code: 'name = "Luna"', output: "" },
      structured.examples[1],
    ],
  }),
  base,
);
assert.ok(
  noPrint.explanation[3].endsWith("This example does not print anything."),
);
assert.ok(!noPrint.explanation[3].includes("```text"));
cases++;
for (const [runtime, suffix] of Object.entries({
  python: "py",
  javascript: "js",
  typescript: "ts",
  sql: "sql",
  html: "html",
  css: "css",
  react: "jsx",
  swift: "swift",
})) {
  const forced = practice.parseGeneratedPractice(
    JSON.stringify({ ...structured, filename: `main.${suffix}` }),
    { ...base, runtime, externalNotes: undefined },
  );
  assert.equal(forced.runtime, runtime);
  assert.ok(forced.explanation[3].includes(`\n\n\`\`\`${runtime}\n`));
  assert.ok(!("examples" in forced));
  cases++;
}
const four = [...structured.examples, ...structured.examples];
const ten = practice.parseGeneratedPractice(
  JSON.stringify({
    ...structured,
    explanation: [...structured.explanation, ...structured.explanation],
    examples: four,
  }),
  base,
);
assert.equal(ten.explanation.length, 10);
cases++;
const allowedLengths = {
  explanation: "e".repeat(600),
  code: "c".repeat(1200),
  output: "o".repeat(400),
};
assert.ok(
  practice.parseGeneratedPractice(
    JSON.stringify({
      ...structured,
      examples: [allowedLengths, ...structured.examples.slice(1)],
    }),
    base,
  ).explanation[3].length <= 2400,
);
cases++;
for (const [change, category] of [
  [{ examples: structured.examples.slice(0, 1) }, "invalid_fields"],
  [{ examples: [...four, structured.examples[0]] }, "too_large"],
  [{ examples: [] }, "invalid_fields"],
  [
    { explanation: Array(7).fill("A short teaching page."), examples: four },
    "too_large",
  ],
  [{ explanation: Array(9).fill("A short teaching page.") }, "too_large"],
  [
    {
      examples: [
        { ...structured.examples[0], [marker]: marker },
        structured.examples[1],
      ],
    },
    "unexpected_fields",
  ],
  [
    {
      examples: [
        { ...structured.examples[0], code: "```python\n" + marker + "\n```" },
        structured.examples[1],
      ],
    },
    "invalid_examples",
  ],
  [
    {
      examples: [
        { ...structured.examples[0], output: "```text\n" + marker + "\n```" },
        structured.examples[1],
      ],
    },
    "invalid_examples",
  ],
  [
    {
      examples: [
        {
          ...structured.examples[0],
          explanation: "~~~python\n" + marker + "\n~~~",
        },
        structured.examples[1],
      ],
    },
    "invalid_examples",
  ],
  [
    {
      examples: [
        { ...structured.examples[0], code: "x".repeat(1201) },
        structured.examples[1],
      ],
    },
    "too_large",
  ],
  [
    {
      examples: [
        { ...structured.examples[0], output: "x".repeat(401) },
        structured.examples[1],
      ],
    },
    "too_large",
  ],
  [
    {
      examples: [
        { ...structured.examples[0], explanation: "x".repeat(601) },
        structured.examples[1],
      ],
    },
    "too_large",
  ],
  [
    {
      examples: [
        { ...structured.examples[0], code: project.solution },
        structured.examples[1],
      ],
    },
    "solution_exposed",
  ],
  [
    {
      examples: [
        { ...structured.examples[0], output: project.solution },
        structured.examples[1],
      ],
    },
    "solution_exposed",
  ],
  [
    {
      examples: [
        { ...structured.examples[0], explanation: project.solution },
        structured.examples[1],
      ],
    },
    "solution_exposed",
  ],
]) {
  answer = JSON.stringify({ ...structured, ...change });
  const response = await send();
  const result = await response.json();
  assert.equal(response.status, 502);
  assert.equal(result.validationCode, category);
  assert.ok(!JSON.stringify(result).includes(marker));
  assert.ok(!JSON.stringify(result).includes(secret));
  cases++;
}
const forged = new practice.PracticeValidationError("invalid_fields");
forged.message = marker;
assert.ok(
  !JSON.stringify(practice.practiceValidationFailure(forged)).includes(marker),
);
for (const code of [marker, "__proto__", "toString"]) {
  forged.validationCode = code;
  assert.equal(
    practice.practiceValidationFailure(forged).validationCode,
    "invalid_fields",
  );
  cases++;
}
assert.match(
  practice.createPracticePrompt(
    base,
    catalog.units.find((unit) => unit.id === base.id),
    "beginner",
  ),
  /Use different names and values/,
);
assert.match(
  practice.createPracticePrompt(
    base,
    catalog.units.find((unit) => unit.id === base.id),
    "beginner",
  ),
  /must provide an examples array/,
);
console.log(
  `Passed ${cases} focused practice validation cases: strict structured examples, canonical merge/order/page bounds, unchanged backup shape, legacy fences, strict JSON boundaries, safe reasons, hidden complete answers, and allowed individual-line teaching overlap. No live AI calls or real credentials.`,
);
const contractPrompt = (runtime) => {
  const lesson = lessons.find(
    (lesson) => lesson.runtime === runtime && lesson.checks.length,
  );
  return practice.createPracticePrompt(
    lesson,
    catalog.units.find((unit) => unit.id === lesson.id),
    "beginner",
  );
};
const pythonPrompt = contractPrompt("python");
const pythonExpression = /Example check: `([^`]+)`/.exec(pythonPrompt)[1];
assert.match(pythonPrompt, /PYTHON LIST OF STRINGS/);
const pythonProof = spawnSync(
  "python3",
  [
    "-c",
    `expression = ${JSON.stringify(pythonExpression)}\nassert eval(expression, {"__output": ["Milo is 3 years old."]})\nassert not eval(expression, {"__output": "Milo is 3 years old."})\nassert not eval(expression, {"__output": ["Milo is 4 years old."]})`,
  ],
  { timeout: 5000, encoding: "utf8" },
);
assert.equal(pythonProof.status, 0, pythonProof.stderr);
for (const runtime of ["javascript", "typescript"]) {
  const prompt = contractPrompt(runtime);
  assert.match(prompt, /ARRAY OF STRINGS/);
  const expression = /Example check: `([^`]+)`/.exec(prompt)[1];
  const check = new Function("__output", `return (${expression});`);
  assert.equal(check(["Milo is 3 years old."]), true);
  assert.equal(check("Milo is 3 years old."), false);
  assert.equal(check(["Milo is 4 years old."]), false);
  assert.equal(check(["Milo is 3 years old.", "extra"]), false);
}
assert.match(contractPrompt("sql"), /first row\/first cell must be INTEGER 1/);
assert.match(
  contractPrompt("typescript"),
  /execution is a worker with no document\/window/,
);
for (const runtime of ["html", "css", "react"])
  assert.match(
    contractPrompt(runtime),
    /__output (?:are|is) not exposed|No learner (?:JavaScript )?variables or __output are exposed/,
  );
assert.match(contractPrompt("swift"), /no __output variable inside Swift/);
console.log(
  "Passed runtime prompt contracts for all eight tools; documented output checks executed with native Python and JavaScript on matching output, wrong types, wrong values, and extra lines. No live AI calls.",
);
