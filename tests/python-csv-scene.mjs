import assert from "node:assert/strict";
import {
  mkdtemp,
  mkdir,
  readFile,
  writeFile,
  rm,
  symlink,
} from "node:fs/promises";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath, pathToFileURL } from "node:url";
import ts from "typescript";
import React, { act } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { JSDOM } from "jsdom";
const repo = fileURLToPath(new URL("..", import.meta.url)),
  temp = await mkdtemp(path.join(tmpdir(), "cq-csv-scene-"));
const dom = new JSDOM('<div id="mount"></div>', {
  url: "https://fixture.example",
  pretendToBeVisual: true,
});
const originals = new Map(),
  requests = [],
  writes = [];
let root;
function global(name, value) {
  originals.set(name, Object.getOwnPropertyDescriptor(globalThis, name));
  Object.defineProperty(globalThis, name, {
    value,
    writable: true,
    configurable: true,
  });
}
try {
  await symlink(
    path.join(repo, "node_modules"),
    path.join(temp, "node_modules"), process.platform === "win32" ? "junction" : "dir");
  for (const file of [
    "lib/python-csv-scene.ts",
    "components/PythonCsvScene.tsx",
  ]) {
    const source = await readFile(path.join(repo, file), "utf8");
    assert.doesNotMatch(
      source,
      /dangerouslySetInnerHTML|\b(?:fetch|eval|runProject)\s*\(|localStorage|sessionStorage|setTimeout|setInterval/,
    );
    const compiled = ts.transpileModule(source, {
      fileName: file,
      reportDiagnostics: true,
      compilerOptions: {
        target: ts.ScriptTarget.ES2022,
        module: ts.ModuleKind.ESNext,
        jsx: ts.JsxEmit.ReactJSX,
      },
    });
    assert.equal(compiled.diagnostics?.length ?? 0, 0);
    const dest = path.join(temp, file.replace(/\.tsx?$/, ".mjs"));
    await mkdir(path.dirname(dest), { recursive: true });
    await writeFile(
      dest,
      compiled.outputText.replace(
        /from\s+(['"])(\.\.?\/[^'"]+)\1/g,
        'from "$2.mjs"',
      ),
    );
  }
  const { makeCsvScenario, csvPresets } = await import(
    pathToFileURL(path.join(temp, "lib/python-csv-scene.mjs"))
  );
  const { default: Scene, CsvPicture } = await import(
    pathToFileURL(path.join(temp, "components/PythonCsvScene.mjs"))
  );
  const cases = csvPresets.flatMap((p) =>
    ["csv", "split"].map((m) => makeCsvScenario(p.id, m)),
  );
  const py = spawnSync(
    "python3",
    [
      "-c",
      String.raw`
import json,sys,csv,io,contextlib
for m in json.load(sys.stdin):
    reader=csv.DictReader(io.StringIO(m['text']))
    assert reader.fieldnames == ['item','quantity']
    rows=list(reader)
    assert rows == m['rows']
    fields=[rows[0]['item'],rows[0]['quantity']] if rows else []
    assert fields == m['csvFields']
    assert all(isinstance(value,str) for row in rows for value in row.values())
    naive=m['row'].split(',') if rows else []
    assert naive == m['naiveFields']
    assert (fields if m['method']=='csv' else naive) == m['fields']
    output=io.StringIO()
    with contextlib.redirect_stdout(output): exec(m['code'], {})
    assert output.getvalue().splitlines() == m['expectedOutput']
print('Native Python: 8 CSV/split cases, exact fields, string types, header-only behavior and downloadable scripts verified.')
`,
    ],
    { input: JSON.stringify(cases), encoding: "utf8" },
  );
  assert.equal(py.status, 0, py.stderr);
  process.stdout.write(py.stdout);
  assert.deepEqual(makeCsvScenario("comma").fields, ["Pens, blue", "2"]);
  assert.equal(makeCsvScenario("comma", "split").fieldCount, 3);
  assert.deepEqual(makeCsvScenario("quote").fields, ['Pen "blue"', "2"]);
  assert.equal(makeCsvScenario("quote", "split").naiveMatches, false);
  assert.equal(makeCsvScenario("plain", "split").naiveMatches, true);
  assert.equal(makeCsvScenario("empty").rows.length, 0);
  for (const bad of [
    "__proto__",
    "constructor",
    "<script>",
    undefined,
    null,
    42,
    {},
    [],
    NaN,
  ]) {
    assert.equal(makeCsvScenario(bad).preset, "comma");
    assert.equal(makeCsvScenario("comma", bad).method, "csv");
  }
  for (const m of cases) {
    const before = JSON.stringify(m);
    Object.freeze(m);
    for (const revealed of [false, true]) {
      const html = renderToStaticMarkup(
        React.createElement(CsvPicture, {
          model: m,
          revealed,
          id: `p-${m.preset}-${m.method}-${revealed}`,
        }),
      );
      assert.match(html, /<svg/);
      assert.match(html, /<rect width="360" height="430"/);
      assert.equal(JSON.stringify(m), before);
    }
  }
  global("window", dom.window);
  global("document", dom.window.document);
  global("navigator", dom.window.navigator);
  global("IS_REACT_ACT_ENVIRONMENT", true);
  global("fetch", async (...a) => {
    requests.push(a);
    throw Error("No fetch allowed");
  });
  for (const method of ["setItem", "removeItem", "clear"])
    dom.window.Storage.prototype[method] = (...a) => {
      writes.push(a);
      throw Error("No storage writes");
    };
  const { createRoot } = await import("react-dom/client");
  root = createRoot(document.getElementById("mount"));
  const render = async () =>
    act(async () => root.render(React.createElement(Scene)));
  const selects = () => [...document.querySelectorAll("select")];
  const change = async (index, value) =>
    act(async () => {
      selects()[index].value = value;
      selects()[index].dispatchEvent(
        new dom.window.Event("change", { bubbles: true }),
      );
    });
  const click = async (label) =>
    act(async () => {
      const b = [...document.querySelectorAll("button")].find(
        (b) => b.textContent === label,
      );
      assert.ok(b, label);
      b.click();
    });
  await render();
  for (const preset of csvPresets) {
    await change(0, preset.id);
    for (const method of ["csv", "split"]) {
      await change(1, method);
      const model = makeCsvScenario(preset.id, method);
      assert.equal(selects()[2].value, "");
      assert.equal(document.querySelector("[data-csv-source]").open, false);
      assert.ok(
        [...document.querySelectorAll("button")].find(
          (b) => b.textContent === "Reveal the fields" && !b.disabled,
        ),
      );
      await change(2, String(model.fieldCount));
      await click("Reveal the fields");
      assert.match(
        document.querySelector("[role=status]").textContent,
        /Your prediction matches/,
      );
      assert.ok(
        [...document.querySelectorAll("button")].find(
          (b) => b.textContent === "Reveal the fields" && b.disabled,
        ),
      );
      if (model.hasRow) {
        assert.match(
          document.querySelector("[role=status]").textContent,
          method === "csv"
            ? /Both are strings/
            : model.naiveMatches
              ? /does not make naive splitting safe/
              : /does not decode/,
        );
      }
      const a = document.querySelector("a[download]");
      assert.equal(
        decodeURIComponent(a.href.split(",").slice(1).join(",")),
        model.code,
      );
      assert.equal(a.download, "csv-boundaries-what-if.py");
      const source = document.querySelector("[data-csv-source]");
      source.open = true;
      await click("Reset prediction");
      assert.equal(selects()[2].value, "");
      assert.doesNotMatch(
        document.querySelector("[role=status]").textContent,
        /Your prediction matches/,
      );
      await change(0, preset.id === "plain" ? "comma" : "plain");
      assert.equal(document.querySelector("[data-csv-source]").open, false);
      await change(0, preset.id);
    }
  }
  await change(0, "comma");
  await change(1, "csv");
  await change(2, "3");
  await click("Reveal the fields");
  assert.match(
    document.querySelector("[role=status]").textContent,
    /Compare your prediction/,
  );
  await click("Reset prediction");
  await click("Reveal the fields");
  assert.match(
    document.querySelector("[role=status]").textContent,
    /Here is the consequence/,
  );
  await act(async () =>
    root.render(
      React.createElement(
        React.Fragment,
        null,
        React.createElement(Scene),
        React.createElement(Scene),
      ),
    ),
  );
  const ids = [...document.querySelectorAll("[id]")].map((n) => n.id);
  assert.equal(new Set(ids).size, ids.length);
  for (const svg of document.querySelectorAll("svg[role=img]"))
    for (const id of svg.getAttribute("aria-labelledby").split(" "))
      assert.ok(document.getElementById(id));
  assert.deepEqual(requests, []);
  assert.deepEqual(writes, []);
  console.log(
    "PASS: 8 complete DOM flows, quoted commas/escaped quotes/header-only, predictions/reset, source downloads, no mutation, invalid enums, unique IDs and no network/storage/score writes.",
  );
} finally {
  if (root) await act(async () => root.unmount());
  dom.window.close();
  for (const [k, v] of originals) {
    if (v) Object.defineProperty(globalThis, k, v);
    else delete globalThis[k];
  }
  await rm(temp, { recursive: true, force: true });
}
