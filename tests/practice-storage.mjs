import assert from "node:assert/strict";
import { mkdtemp, readFile, writeFile, rm, symlink } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import ts from "typescript";
import "fake-indexeddb/auto";
const temp = await mkdtemp(path.join(tmpdir(), "codequest-practice-storage-"));
try {
  await symlink(
    path.resolve("node_modules"),
    path.join(temp, "node_modules"),
    "dir",
  );
  for (const name of [
    "practice-storage",
    "practice-project",
    "device-db",
    "ai-providers",
  ]) {
    const compiled = ts
      .transpileModule(await readFile(`lib/${name}.ts`, "utf8"), {
        compilerOptions: {
          target: ts.ScriptTarget.ES2022,
          module: ts.ModuleKind.ESNext,
        },
      })
      .outputText.replace(/from "\.\/([^\"]+)"/g, 'from "./$1.mjs"');
    await writeFile(path.join(temp, `${name}.mjs`), compiled);
  }
  const storage = await import(path.join(temp, "practice-storage.mjs"));
  const { readDevice } = await import(path.join(temp, "device-db.mjs"));
  const scope = "e".repeat(64),
    otherScope = "f".repeat(64);
  const fixture = (title = "Three apples") => ({
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    baseUnitId: "javascript-01",
    difficulty: "beginner",
    provider: "deepseek",
    model: "deepseek-flash",
    project: {
      title,
      task: "Store the number three in answer.",
      explanation: [
        "A variable gives a value a name.\n```javascript\nconst apples = 2;\n```\nThis stores two.",
        "A different value gives a different result.\n```javascript\nconst apples = 4;\n```\nThis stores four.",
        "Use const to name your answer before running the check.",
      ],
      steps: ["Read the example.", "Change the value.", "Run the practice."],
      requirements: ["answer is three"],
      starter: "const answer = 0;",
      solution: "const answer = 3;",
      filename: "practice.js",
      checks: [{ label: "Stores three", expression: "answer === 3" }],
      hints: ["Use the number three.", "Put it after the equals sign."],
      runtime: "javascript",
      manualReview: false,
    },
  });
  const project = fixture();
  await storage.addPractice(
    scope,
    storage.starterPractice(project, "verified"),
  );
  assert.equal((await storage.loadPractices(otherScope)).drafts.length, 0);
  let record = await storage.loadPractices(scope);
  assert.equal(record.activeId, project.id);
  await Promise.all([
    storage.savePractice(scope, project.id, "const answer = 1;", {}),
    storage.savePractice(scope, project.id, "const answer = 2;", {}),
  ]);
  record = await storage.loadPractices(scope);
  assert.equal(record.drafts[0].code, "const answer = 2;");
  assert.deepEqual(
    record.drafts[0].versions.map((version) => version.code),
    ["const answer = 0;", "const answer = 1;"],
  );
  for (let index = 3; index < 27; index++)
    await storage.savePractice(
      scope,
      project.id,
      `const answer = ${index};`,
      {},
    );
  record = await storage.loadPractices(scope);
  assert.equal(record.drafts[0].versions.length, 20);
  assert.equal(record.drafts[0].versions.at(-1).code, "const answer = 25;");
  await assert.rejects(
    storage.completePractice(scope, project.id, "outdated code", {}, false),
    /changed/,
  );
  const completed = await storage.completePractice(
    scope,
    project.id,
    record.drafts[0].code,
    {},
    false,
  );
  assert.equal(
    completed.drafts[0].completed.sourceHash,
    await storage.practiceSourceHash(record.drafts[0].code, {}),
  );
  const oldHash = completed.drafts[0].completed.sourceHash;
  await storage.savePractice(scope, project.id, "const answer = 3;", {});
  assert.notEqual(
    await storage.practiceSourceHash("const answer = 3;", {}),
    oldHash,
  );
  assert.equal(
    storage.practiceSource("code", { "b.txt": "b", "a.txt": "a" }),
    storage.practiceSource("code", { "a.txt": "a", "b.txt": "b" }),
  );
  await assert.rejects(
    storage.savePractice(scope, project.id, "code", {
      "../secret.txt": "invalid",
    }),
    /known project files/,
  );
  await assert.rejects(
    storage.savePractice(scope, project.id, "a".repeat(60001), {}),
    /valid project code/,
  );
  // Backups contain only practice records, with no identity/settings/key state.
  const backup = storage.exportPracticeBackup(
    await storage.loadPractices(scope),
  );
  assert.ok(!backup.includes(scope));
  assert.ok(!backup.includes("draftScope"));
  assert.ok(!backup.includes("apiKey"));
  const imported = storage.parsePracticeBackup(backup);
  assert.equal(imported[0].reference, "unverified");
  assert.equal(imported[0].completed, undefined);
  await storage.importPractices(otherScope, imported);
  assert.equal((await storage.loadPractices(otherScope)).drafts.length, 1);
  await storage.importPractices(scope, storage.parsePracticeBackup(backup));
  record = await storage.loadPractices(scope);
  assert.equal(record.drafts.length, 2);
  assert.notEqual(record.drafts[0].project.id, record.drafts[1].project.id);
  assert.equal(record.drafts[0].code, "const answer = 3;");
  assert.throws(() => storage.parsePracticeBackup('{"format":"wrong"}'));
  assert.throws(() =>
    storage.parsePracticeBackup(
      JSON.stringify({
        format: "codequest-practice-1",
        practices: Array.from({ length: 21 }, () => imported[0]),
      }),
    ),
  );
  const manipulated = JSON.parse(backup);
  manipulated.practices[0].project.project.checks[0].expression =
    "fetch('https://example.invalid')";
  assert.throws(
    () => storage.parsePracticeBackup(JSON.stringify(manipulated)),
    /could not be validated/,
  );
  for (let index = 0; index < 22; index++)
    await storage.addPractice(
      scope,
      storage.starterPractice(fixture(`Project ${index}`), "unverified"),
    );
  record = await storage.loadPractices(scope);
  assert.equal(record.drafts.length, 20);
  assert.equal(record.drafts[0].project.project.title, "Project 2");
  const actualStored = await readDevice(
    "meta",
    storage.practiceStorageKey(scope),
  );
  assert.deepEqual(Object.keys(actualStored).sort(), [
    "activeId",
    "drafts",
    "scope",
  ]);
  assert.equal((await storage.loadPractices(otherScope)).drafts.length, 1);
  console.log(
    "Passed account-isolated atomic practice saves, concurrent version preservation, 20-project/version caps, completion source hashes, checked file boundaries, portable backup restore without trusted claims, and separate account metadata.",
  );
} finally {
  await rm(temp, { recursive: true, force: true });
}
