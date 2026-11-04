import assert from "node:assert/strict";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import ts from "typescript";
const tmp = new URL("../.sites-runtime/navigation-test.mjs", import.meta.url);
try {
  await mkdir(new URL("../.sites-runtime/", import.meta.url), {
    recursive: true,
  });
  await writeFile(
    tmp,
    ts.transpileModule(
      await readFile(new URL("../lib/navigation.ts", import.meta.url), "utf8"),
      {
        compilerOptions: {
          target: ts.ScriptTarget.ES2022,
          module: ts.ModuleKind.ES2022,
        },
      },
    ).outputText,
  );
  const { parseRoute, routeHash, normalizeRoute, topicMatches } = await import(
    tmp.href
  );
  const units = [{ id: "python-01" }, { id: "javascript-01" }],
    lessons = [
      { id: "python-01", explanation: Array(7).fill("") },
      { id: "javascript-01", explanation: ["one", "two"] },
    ];
  for (const view of ["quest", "studio", "path", "settings", "progress"])
    for (const studioMode of ["course", "practice"]) {
      const route = {
        view,
        studioMode,
        phase: "build",
        activeId: "python-01",
        paragraph: 3,
      };
      assert.deepEqual(
        parseRoute(routeHash(route), "javascript-01", units, lessons),
        {...route, studioMode: "course", view:view === "quest" ? "studio" : view},
        `Return from ${view} retains the lesson and idea in course project mode`,
      );
    }
  for (const activeId of ["python-01", "javascript-01"]) {
    const legacy = parseRoute(
      `#studio?lesson=${activeId}&step=learn&mode=practice&idea=2`,
      "python-01", units, lessons,
    );
    assert.deepEqual(legacy, {
      view: "studio", studioMode: "course", phase: "build", activeId, paragraph: 1,
    }, "An old AI practice link opens the matching course project");
    assert.ok(!routeHash(legacy).includes("mode=practice"));
    assert.equal(normalizeRoute({ ...legacy, studioMode: "practice", phase: "learn" },
      "python-01", units, lessons).phase, "build", "Old saved locations open Projects");
  }
  assert.equal(parseRoute("#bogus", "python-01", units, lessons), null);
  assert.equal(
    parseRoute(
      "#quest?lesson=unknown&step=execute&idea=-99",
      "python-01",
      units,
      lessons,
    ).paragraph,
    0,
  );
  assert.equal(
    parseRoute(
      "#quest?lesson=python-01&idea=999",
      "javascript-01",
      units,
      lessons,
    ).paragraph,
    6,
  );
  assert.equal(
    parseRoute("#quest?idea=NaN", "python-01", units, lessons).paragraph,
    0,
  );
  assert.equal(
    normalizeRoute(null, "python-01", units, lessons).activeId,
    "python-01",
  );
  assert.equal(
    normalizeRoute("bad stored value", "python-01", units, lessons).view,
    "quest",
  );
  assert.ok(topicMatches("Loops", "Weekly schedule", "repeat"));
  assert.ok(topicMatches("Python Basics", "Pet name", "variables"));
  assert.ok(topicMatches("Functions", "A helper", "  FUNCTION "));
  assert.ok(!topicMatches("Functions", "A helper", "totally unrelated"));
  console.log(
    "Navigation preserves lessons and ideas; old AI practice links open course projects; malformed links and saved positions remain bounded; beginner search wording works.",
  );
} finally {
  await rm(tmp, { force: true });
}
