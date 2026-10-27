import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import vm from "node:vm";
import ts from "typescript";

const source = await readFile("lib/lesson-completion.ts", "utf8");
const compiled = ts.transpileModule(source, {
  compilerOptions: {
    target: ts.ScriptTarget.ES2022,
    module: ts.ModuleKind.CommonJS,
  },
}).outputText;
const fixture = { exports: {} };
vm.runInNewContext(compiled, { module: fixture, exports: fixture.exports });
const {
  getReadingSectionKeys,
  isReadingSectionKey,
  getLessonCompletion,
  pythonBasicsReadingKeys,
} = fixture.exports;
const lessons = JSON.parse(await readFile("content/lessons.json", "utf8"));
const catalog = JSON.parse(await readFile("content/catalog.json", "utf8"));
assert.deepEqual(new Set(lessons.map(lesson => lesson.id)), new Set(catalog.units.map(unit => unit.id)));
const timestamp = "2026-10-21T08:00:00.000Z";
const record = (
  lessonId,
  sectionKey,
  checked = true,
  updatedAt = timestamp,
) => ({
  lessonId,
  sectionKey,
  checked,
  markedAt: checked ? updatedAt : null,
  updatedAt,
});
let totalSections = 0;
for (const lesson of lessons) {
  const keys = getReadingSectionKeys(lesson);
  const expectedReadTotal =
    lesson.id === "python-01" ? 6 : lesson.explanation.length;
  assert.equal(keys.length, expectedReadTotal);
  assert.equal(new Set(keys).size, expectedReadTotal);
  assert.ok(keys.every((key) => isReadingSectionKey(lesson, key)));
  assert.ok(!isReadingSectionKey(lesson, "text:00"));
  assert.ok(!isReadingSectionKey(lesson, "text:-1"));
  assert.ok(!isReadingSectionKey(lesson, "text:9999"));
  const empty = getLessonCompletion(lesson);
  assert.equal(empty.readCompleted, 0);
  assert.equal(empty.readTotal, expectedReadTotal);
  assert.equal(empty.completed, 0);
  assert.equal(empty.total, expectedReadTotal + 2);
  assert.equal(empty.percent, 0);
  assert.equal(empty.isComplete, false);
  assert.equal(empty.legacyReadingUnknown, false);
  assert.equal(empty.math.available, !!lesson.math);
  assert.equal(empty.math.passed, false);

  const progress = {
    unitId: lesson.id,
    quizPassed: 0,
    mathPassed: 0,
    completedAt: null,
  };
  const read = keys.map((key) => record(lesson.id, key));
  const frozenInput = JSON.stringify({ lesson, progress, read });
  const readOnly = getLessonCompletion(lesson, progress, read);
  assert.equal(readOnly.readCompleted, expectedReadTotal);
  assert.equal(readOnly.completed, expectedReadTotal);
  assert.equal(
    readOnly.isComplete,
    false,
    "Reading cannot stand in for quiz/project.",
  );
  const doneProgress = {
    ...progress,
    quizPassed: 1,
    mathPassed: 1,
    completedAt: timestamp,
  };
  const full = getLessonCompletion(lesson, doneProgress, read);
  assert.equal(full.completed, full.total);
  assert.equal(full.percent, 100);
  assert.equal(full.isComplete, true);
  assert.equal(full.math.passed, !!lesson.math);
  const noMath = getLessonCompletion(
    lesson,
    { ...doneProgress, mathPassed: 0 },
    read,
  );
  assert.equal(noMath.total, full.total, "Math never changes the denominator.");
  assert.equal(
    noMath.percent,
    full.percent,
    "Optional math never changes the core score.",
  );
  const legacy = getLessonCompletion(lesson, doneProgress);
  assert.equal(
    legacy.readCompleted,
    0,
    "Never backfill read marks from completedAt.",
  );
  assert.equal(legacy.completed, 2);
  assert.equal(
    legacy.projectCompleted,
    true,
    "Preserve existing project completion.",
  );
  assert.equal(legacy.legacyReadingUnknown, true);
  assert.equal(legacy.isComplete, false);
  const other = getLessonCompletion(
    lesson,
    { ...doneProgress, unitId: "another-lesson" },
    read.map((r) => ({ ...r, lessonId: "another-lesson" })),
  );
  assert.equal(other.completed, 0, "Other lessons contribute no points.");
  const attempts = getLessonCompletion(lesson, {
    ...progress,
    lastRun: timestamp,
    quizAttempts: 99,
    buildAttempts: 99,
    notes: 10,
    visualsOpened: 10,
    tutorUsed: 10,
  });
  assert.equal(
    attempts.completed,
    0,
    "Attempts, notes, diagrams and tutoring are not achievements.",
  );
  const invalidPass = getLessonCompletion(lesson, {
    ...progress,
    quizPassed: 2,
    mathPassed: 2,
  });
  assert.equal(invalidPass.quizPassed, false);
  assert.equal(invalidPass.math.passed, false);
  assert.equal(
    JSON.stringify({ lesson, progress, read }),
    frozenInput,
    "Pure calculation never changes inputs.",
  );
  totalSections += expectedReadTotal;
}

const python = lessons.find((lesson) => lesson.id === "python-01");
assert.equal(python.explanation.length, 7);
assert.equal(
  JSON.stringify(getReadingSectionKeys(python)),
  JSON.stringify([
    "concept:program",
    "concept:values",
    "concept:strings",
    "concept:names",
    "concept:assignment",
    "concept:output",
  ]),
);
assert.equal(
  JSON.stringify(pythonBasicsReadingKeys),
  JSON.stringify(getReadingSectionKeys(python)),
);
for (let i = 0; i < 7; i++)
  assert.equal(isReadingSectionKey(python, `text:${i}`), false);
assert.equal(
  getLessonCompletion(
    python,
    undefined,
    python.explanation.map((_, i) => record(python.id, `text:${i}`)),
  ).completed,
  0,
);
const javascript = lessons.find((lesson) => lesson.id === "javascript-01");
assert.equal(isReadingSectionKey(javascript, "concept:program"), false);
const first = record(javascript.id, "text:0");
const unchecked = record(
  javascript.id,
  "text:0",
  false,
  "2026-10-21T08:00:00.001Z",
);
for (const input of [
  [first, first],
  [first, unchecked],
  [unchecked, first],
]) {
  const score = getLessonCompletion(javascript, undefined, input);
  assert.equal(
    score.completed,
    input.includes(unchecked) ? 0 : 1,
    "Deduplicate by section and latest revision, not list order.",
  );
}
assert.equal(
  getLessonCompletion(javascript, undefined, [{ ...first, markedAt: null }])
    .completed,
  0,
);
assert.equal(
  getLessonCompletion(javascript, undefined, [record(javascript.id, "unknown")])
    .completed,
  0,
);
console.log(
  `Passed pure completion tests for all ${lessons.length} lessons / ${totalSections} primary reading sections: stable denominator, six Python rooms, no supplementary duplication, no attempt credit, saved quiz/project credit, legacy preservation, optional math separation, lesson isolation, revision deduplication and no input mutation.`,
);
