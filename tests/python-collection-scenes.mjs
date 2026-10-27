/** Native-Python oracle and DOM checks for bounded, display-only what-if scenes. */
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import {
  mkdtemp,
  mkdir,
  readFile,
  writeFile,
  rm,
  symlink,
} from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import ts from "typescript";
import { JSDOM } from "jsdom";
import React, { act } from "react";
import { renderToStaticMarkup } from "react-dom/server";

const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const temp = await mkdtemp(path.join(tmpdir(), "codequest-collection-scenes-"));
const dom = new JSDOM('<div id="mount"></div>', {
  pretendToBeVisual: true,
  url: "https://fixture.example",
});
Object.assign(globalThis, {
  window: dom.window,
  document: dom.window.document,
  IS_REACT_ACT_ENVIRONMENT: true,
});
const { createRoot } = await import("react-dom/client");
const requests = [],
  writes = [];
globalThis.fetch = (...args) => {
  requests.push(args);
  throw new Error("Scenes must not make requests");
};
dom.window.Storage.prototype.setItem = (...args) => {
  writes.push(args);
  throw new Error("Scenes must not store state");
};
dom.window.Storage.prototype.removeItem = (...args) => {
  writes.push(args);
  throw new Error("Scenes must not remove data");
};
const mount = document.querySelector("#mount");
let root;
try {
  await mkdir(path.join(temp, "components"));
  await mkdir(path.join(temp, "lib"));
  await symlink(
    path.join(repo, "node_modules"),
    path.join(temp, "node_modules"),
  );
  for (const file of [
    "components/PythonCollectionScenes.tsx",
    "lib/python-collection-scenes.ts",
  ]) {
    const source = await readFile(path.join(repo, file), "utf8");
    assert(
      !/\b(fetch|localStorage|sessionStorage|indexedDB|runProject|useEffect)\b/.test(
        source,
      ),
      `${file}: unexpected runtime or persistence API`,
    );
    const js = ts
      .transpileModule(source, {
        compilerOptions: {
          target: ts.ScriptTarget.ES2022,
          module: ts.ModuleKind.ESNext,
          jsx: ts.JsxEmit.ReactJSX,
        },
      })
      .outputText.replace(/from\s+(['"])(\.\.?\/[^'"]+)\1/g, 'from "$2.mjs"');
    await writeFile(path.join(temp, file.replace(/\.tsx?$/, ".mjs")), js);
  }
  const {
    makeCollectionScenario,
    makeRecipeScenario,
    pythonAmounts,
    collectibleChoices,
    scaleFactors,
  } = await import(
    pathToFileURL(path.join(temp, "lib/python-collection-scenes.mjs")).href
  );
  const { default: Scene } = await import(
    pathToFileURL(path.join(temp, "components/PythonCollectionScenes.mjs")).href
  );
  const cases = [];
  for (const item of collectibleChoices)
    for (const empty of [false, true]) {
      const model = makeCollectionScenario(item, empty);
      assert.equal(model.states.length, 2);
      assert.equal(model.states[0].trayId, model.states[1].trayId);
      assert.equal(model.states[1].appendReturn, "None");
      assert.equal(model.prediction.count, model.initial.length + 1);
      assert.equal(model.prediction.lastIndex, model.final.length - 1);
      assert.deepEqual(model.states[0].items, model.initial);
      assert.deepEqual(model.states[1].items, model.final);
      assert.deepEqual(model.final.slice(0, -1), model.initial);
      assert.equal(model.states[0].lastIndex, empty ? null : 2);
      assert.equal(model.states[0].lastItem, empty ? null : "feather");
      assert(model.states.every((state) => !state.output.length));
      cases.push({ kind: "list", model });
    }
  for (const factor of scaleFactors)
    for (const empty of [false, true]) {
      const model = makeRecipeScenario(factor, empty);
      assert.equal(model.states.length, model.original.length + 3);
      assert.equal(model.prediction.count, model.original.length);
      assert.equal(model.prediction.values, pythonAmounts(model.final));
      for (let step = 0; step < model.states.length; step++) {
        const state = model.states[step];
        assert.notEqual(state.originalId, state.batchId);
        assert.deepEqual(state.original, model.original);
        assert.deepEqual(
          state.batch,
          model.final.slice(0, Math.min(step, model.original.length)),
        );
        assert.equal(state.returned, step > model.original.length);
        assert.equal(state.printed, step > model.original.length + 1);
        assert.equal(state.callerResult === null, !state.returned);
        if (!state.printed) assert.deepEqual(state.output, []);
      }
      assert.deepEqual(model.states.at(-1).output, model.expectedOutput);
      cases.push({ kind: "recipe", model });
    }
  assert.deepEqual(makeRecipeScenario(0).expectedOutput, [
    "[0, 0.0, 0]",
    "[1, 0.5, 4]",
  ]);
  assert.deepEqual(makeRecipeScenario(0.5).expectedOutput, [
    "[0.5, 0.25, 2.0]",
    "[1, 0.5, 4]",
  ]);
  assert.deepEqual(makeRecipeScenario(2).expectedOutput, [
    "[2, 1.0, 8]",
    "[1, 0.5, 4]",
  ]);
  assert.deepEqual(makeRecipeScenario(3).expectedOutput, [
    "[3, 1.5, 12]",
    "[1, 0.5, 4]",
  ]);
  assert.equal(makeCollectionScenario("not-an-item").chosen, "button");
  for (const invalid of [-1, 1, 4, NaN, Infinity, "3", "print(99)"])
    assert.equal(makeRecipeScenario(invalid).factor, 3);

  // Execute all generated scripts in native Python, checking intermediate list identity,
  // each actual loop append, Python int/float display, delayed return and exact stdout.
  const oracle = spawnSync(
    process.env.PYTHON || "python3",
    [
      "-c",
      String.raw`
import ast, contextlib, io, json, sys
cases = json.load(sys.stdin)
count = 0
for case in cases:
    model, kind = case['model'], case['kind']
    tree = ast.parse(model['code'])
    for node in ast.walk(tree):
        assert not isinstance(node, (ast.Import, ast.ImportFrom, ast.While, ast.With, ast.AsyncFunctionDef))
    env = {'__builtins__': {'print': print, 'len': len}}
    stdout = io.StringIO()
    if kind == 'list':
        exec(compile(ast.Module(body=tree.body[:1], type_ignores=[]), '<list-scene>', 'exec'), env)
        original = env['items']
        assert original == model['initial']
        assert len(original) == model['states'][0]['count']
        assert (len(original) - 1 if original else None) == model['states'][0]['lastIndex']
        returned = eval(compile(ast.Expression(body=tree.body[1].value), '<list-scene>', 'eval'), env)
        assert returned is None
        assert env['items'] is original
        assert original == model['final']
        assert str(original) == model['expectedOutput'][0]
        with contextlib.redirect_stdout(stdout):
            exec(compile(ast.Module(body=tree.body[2:], type_ignores=[]), '<list-scene>', 'exec'), env)
        count += 2
    else:
        traced, returned = [], []
        def trace(frame, event, arg):
            if frame.f_code.co_name == 'scale':
                if event == 'line' and frame.f_lineno == 3:
                    traced.append(list(frame.f_locals['scaled']))
                if event == 'return':
                    returned.append(arg)
            return trace
        with contextlib.redirect_stdout(stdout):
            sys.settrace(trace)
            try:
                exec(compile(tree, '<recipe-scene>', 'exec'), env)
            finally:
                sys.settrace(None)
        assert env['result'] is not env['original']
        assert len(returned) == 1 and returned[0] is env['result']
        assert str(env['original']) == model['expectedOutput'][1]
        assert str(env['result']) == model['expectedOutput'][0]
        assert len(traced) == len(model['original']) + 1
        for index, values in enumerate(traced):
            state = model['states'][index]
            assert values == [entry['value'] for entry in state['batch']]
            assert len(values) == state['processed']
            for value, expected in zip(values, state['batch']):
                assert type(value).__name__ == expected['kind'], (value, expected)
            assert not state['returned'] and state['callerResult'] is None
            count += 1
        assert model['states'][-2]['returned'] and not model['states'][-2]['printed']
        assert not model['states'][-2]['output']
    assert stdout.getvalue().splitlines() == model['expectedOutput'], (model['code'], stdout.getvalue(), model['expectedOutput'])
print('Native Python: %d scripts, %d pre-return states validated' % (len(cases), count))
`,
    ],
    { input: JSON.stringify(cases), encoding: "utf8", maxBuffer: 5_000_000 },
  );
  assert.equal(oracle.status, 0, oracle.stderr);
  console.log(oracle.stdout.trim());

  const render = async (unitId, key = unitId) => {
    await act(async () =>
      root.render(React.createElement(Scene, { unitId, key })),
    );
  };
  const buttons = () => [...mount.querySelectorAll("button")];
  const button = (text) => {
    const result = buttons().find((el) => el.textContent === text);
    assert(result, `Missing button: ${text}`);
    return result;
  };
  const click = async (element) => {
    await act(async () => element.click());
  };
  const select = async (element, value) => {
    await act(async () => {
      element.value = String(value);
      element.dispatchEvent(new dom.window.Event("change", { bubbles: true }));
    });
  };
  const status = () =>
    mount.querySelector("[data-collection-status]").textContent;
  const source = () => mount.querySelector("[data-collection-source]");
  const download = () => mount.querySelector("a[download]");
  const decodedDownload = () =>
    decodeURIComponent(
      download().getAttribute("href").split(",").slice(1).join(","),
    );
  root = createRoot(mount);
  await render("html-01");
  assert.equal(mount.innerHTML, "");
  let domScenarios = 0;
  for (const empty of [false, true]) {
    const item = "button";
    await render("python-05", `list-${empty}-${item}`);
    assert(!source().open, "Python code must be optional and closed");
    const selects = mount.querySelectorAll("select");
    assert.equal(selects.length, 2, "Only count and index predictions remain");
    assert(!mount.textContent.includes("New find to append"));
    assert(
      ![...mount.querySelectorAll("option")].some((el) =>
        ["button", "shell", "stamp"].includes(el.value),
      ),
      "No cosmetic item substitution control remains",
    );
    if (empty) await click(mount.querySelector("input[type=checkbox]"));
    const model = makeCollectionScenario(item, empty);
    assert.equal(decodedDownload(), model.code);
    assert.equal(download().download, "collector-what-if.py");
    assert.equal(source().querySelector("code").textContent, model.code);
    assert.equal(
      source().querySelectorAll("pre")[1].textContent,
      model.expectedOutput.join("\n"),
    );
    await select(selects[0], model.prediction.count);
    await select(selects[1], model.prediction.lastIndex);
    await click(button(`Append ${item}`));
    assert.match(status(), /Your prediction matches/);
    assert.match(status(), /append returns None/);
    assert(button(`Append ${item}`).disabled);
    assert.equal(
      mount.querySelector("svg").querySelector("title").textContent,
      `One collector tray, ${model.prediction.count} entries`,
    );
    assert(
      mount
        .querySelector("svg")
        .textContent.includes(`index ${model.prediction.lastIndex}`),
    );
    await click(button("Reset tray"));
    assert.equal(selects[0].value, "");
    assert.equal(selects[1].value, "");
    assert(!button(`Append ${item}`).disabled);
    assert.equal(
      mount.querySelector("svg").querySelector("title").textContent,
      `One collector tray, ${model.initial.length} entries`,
    );
    if (empty) assert.match(status(), /no last item or last index/);
    // Changing between populated and empty input resets the completed sequence.
    await click(button(`Append ${item}`));
    await click(mount.querySelector("input[type=checkbox]"));
    assert(!button(`Append ${item}`).disabled);
    assert.equal(selects[0].value, "");
    domScenarios++;
  }
  for (const empty of [false, true]) {
    const factor = 3;
    await render("python-08", `recipe-${empty}-${factor}`);
    assert(!source().open);
    assert.equal(
      mount.querySelector("input[type=range]"),
      null,
      "No number-only multiplier control remains",
    );
    assert(!mount.textContent.includes("Turn the factor dial"));
    assert(!mount.textContent.includes("What if you change the batch size"));
    if (empty) await click(mount.querySelector("input[type=checkbox]"));
    const model = makeRecipeScenario(factor, empty);
    assert.equal(decodedDownload(), model.code);
    assert.equal(download().download, "recipe-what-if.py");
    assert.equal(source().querySelector("code").textContent, model.code);
    const selects = mount.querySelectorAll("select");
    assert.equal(selects.length, 2, "Only count and value predictions remain");
    await select(selects[0], model.prediction.count);
    await select(selects[1], model.prediction.firstValue ?? "none");
    for (let n = 0; n < model.original.length; n++) {
      assert(!mount.querySelector("[data-collection-output]"));
      assert(
        !buttons().some(
          (el) => el.textContent === "Return new batch to caller",
        ),
        "Return must not appear before processing all items",
      );
      await click(button(`Scale ingredient ${n + 1}`));
      assert(
        mount
          .querySelector("svg")
          .textContent.includes(`NEW BATCH · ${n + 1} entries`),
      );
    }
    assert.match(status(), /Return is after the loop/);
    assert(!mount.querySelector("[data-collection-output]"));
    await click(button("Return new batch to caller"));
    assert.match(status(), /Your prediction matches/);
    assert.match(status(), /Nothing printed yet/);
    assert(!mount.querySelector("[data-collection-output]"));
    await click(button("Print at caller"));
    assert.equal(
      mount.querySelector("[data-collection-output]").textContent,
      model.expectedOutput.join("\n"),
    );
    assert(button("Caller has printed").disabled);
    await click(button("Reset recipe"));
    assert(!mount.querySelector("[data-collection-output]"));
    assert.equal(selects[0].value, "");
    assert.equal(selects[1].value, "");
    assert.equal(
      decodedDownload(),
      model.code,
      "Reset retains the fixed multiplier and input shape",
    );
    assert(
      mount.querySelector("svg").textContent.includes("NEW BATCH · 0 entries"),
    );
    domScenarios++;
  }
  // Wrong guesses get a non-punitive explanation. Changes clear old guesses/results.
  await render("python-05", "wrong-list");
  await select(mount.querySelectorAll("select")[0], 0);
  await select(mount.querySelectorAll("select")[1], "none");
  await click(button("Append button"));
  assert.match(status(), /Compare your prediction/);
  source().open = true;
  await click(mount.querySelector("input[type=checkbox]"));
  assert(!source().open, "New scenario closes stale Python reveal");
  assert(!button("Append button").disabled);
  assert.equal(mount.querySelectorAll("select")[0].value, "");
  assert.equal(decodedDownload(), makeCollectionScenario("button", true).code);
  await render("python-08", "wrong-recipe");
  await select(mount.querySelectorAll("select")[0], 9);
  await select(mount.querySelectorAll("select")[1], 0);
  for (let n = 1; n <= 3; n++) await click(button(`Scale ingredient ${n}`));
  await click(button("Return new batch to caller"));
  assert.match(status(), /Compare your prediction/);
  source().open = true;
  await click(mount.querySelector("input[type=checkbox]"));
  assert(!source().open, "Changed input shape closes stale Python reveal");
  assert(
    button("Return new batch to caller"),
    "Empty input still reaches return without a loop visit",
  );
  assert.equal(mount.querySelectorAll("select")[0].value, "");
  assert(!mount.querySelector("[data-collection-output]"));
  assert.equal(decodedDownload(), makeRecipeScenario(3, true).code);

  // Duplicate scene instances retain independent controls and unique accessible IDs.
  await act(async () =>
    root.render(
      React.createElement(
        React.Fragment,
        null,
        ...["python-05", "python-05", "python-08", "python-08"].map(
          (unitId, i) => React.createElement(Scene, { unitId, key: i }),
        ),
      ),
    ),
  );
  const ids = [...mount.querySelectorAll("[id]")].map((el) => el.id);
  assert.equal(ids.length, new Set(ids).size);
  for (const element of mount.querySelectorAll("[aria-labelledby]"))
    for (const id of element.getAttribute("aria-labelledby").split(" "))
      assert(document.getElementById(id), `Missing ARIA reference ${id}`);
  for (const svg of mount.querySelectorAll("svg")) {
    assert(svg.querySelector("title"));
    assert(svg.querySelector("desc"));
    assert.match(svg.getAttribute("viewBox"), /^0 0 360 /);
  }
  assert.equal(mount.querySelectorAll("[role=status]").length, 4);
  assert.equal(mount.querySelectorAll("summary").length, 4);
  assert.equal(mount.querySelectorAll("figcaption").length, 4);
  assert(
    [...mount.querySelectorAll("[data-collection-source]")].every(
      (el) => !el.open,
    ),
  );
  await click(
    [...mount.querySelectorAll("button")].find(
      (el) => el.textContent === "Append button",
    ),
  );
  assert.equal(
    [...mount.querySelectorAll("[data-collection-scene=list] svg title")]
      .map((el) => el.textContent)
      .join("|"),
    "One collector tray, 4 entries|One collector tray, 3 entries",
  );
  const html = renderToStaticMarkup(
    React.createElement(Scene, { unitId: "python-08" }),
  );
  assert(html.includes("not running Python"));
  assert(!html.includes("NaN"));
  assert.equal(requests.length, 0, "No API activity");
  assert.equal(writes.length, 0, "No storage or progress writes");
  console.log(
    `PASS: all 14 bounded scenarios, ${domScenarios} complete DOM flows, Python int/float fidelity, empty cases, delayed return/print, reset, predictions, downloads, unique IDs and no automatic writes.`,
  );
} finally {
  if (root) await act(async () => root.unmount());
  dom.window.close();
  await rm(temp, { recursive: true, force: true });
}
