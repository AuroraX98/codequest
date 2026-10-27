/** Native-Python oracle and DOM checks for the bounded generator illustration. */
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
const temp = await mkdtemp(path.join(tmpdir(), "codequest-generator-scene-"));
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
  throw new Error("No requests allowed");
};
for (const method of ["setItem", "removeItem", "clear"])
  dom.window.Storage.prototype[method] = (...args) => {
    writes.push(args);
    throw new Error("No persistence allowed");
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
    "components/PythonGeneratorScene.tsx",
    "lib/python-generator-scene.ts",
  ]) {
    const source = await readFile(path.join(repo, file), "utf8");
    assert(
      !/\b(fetch|localStorage|sessionStorage|indexedDB|runProject|useEffect|setTimeout|setInterval)\b/.test(
        source,
      ),
      `${file}: unexpected runtime/persistence API`,
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
    generatorModes,
    generatorStateAt,
    generatorNextLabel,
    generatorExplanation,
    makeGeneratorScenario,
    generatorTuple,
  } = await import(
    pathToFileURL(path.join(temp, "lib/python-generator-scene.mjs")).href
  );
  const { default: Scene, PythonGeneratorPicture } = await import(
    pathToFileURL(path.join(temp, "components/PythonGeneratorScene.mjs")).href
  );
  const cases = generatorModes.map((mode) => makeGeneratorScenario(mode));
  assert.deepEqual(
    cases.map((model) => model.expectedOutput),
    [["(3, 22)"], ["(2, 16)", "(0, 0)"], ["(0, 0)"]],
  );
  assert.deepEqual(
    cases.map((model) => model.states.length),
    [13, 14, 4],
  );
  assert.deepEqual(
    cases[0].states
      .filter((state) => state.phase === "yielded")
      .map((state) => state.yielded),
    [2, 8, 12],
  );
  assert.deepEqual(
    cases[1].states
      .filter((state) => state.phase === "yielded")
      .map((state) => state.yielded),
    [6, 10],
  );
  assert.deepEqual(
    cases[0].states
      .filter((state) => state.phase === "collected")
      .map((state) => [state.count, state.total]),
    [
      [1, 2],
      [2, 10],
      [3, 22],
    ],
  );
  for (const model of cases) {
    const original = [...model.source];
    for (let index = 0; index < model.states.length; index++) {
      const state = model.states[index],
        previous = model.states[index - 1];
      assert.equal(generatorStateAt(model, index), state);
      assert(generatorNextLabel(model, state));
      assert(generatorExplanation(model, state));
      assert(state.cursor >= 0 && state.cursor <= model.source.length);
      assert.equal(state.returned !== null, state.phase === "returned");
      assert.equal(
        state.results.length,
        state.call - 1 + Number(state.phase === "returned"),
      );
      if (
        ["ready", "requested", "exhausted", "returned"].includes(state.phase)
      ) {
        assert.equal(state.input, null);
        assert.equal(state.yielded, null);
      }
      if (state.phase === "yielded") {
        assert.equal(previous.phase, "requested");
        assert.equal(state.cursor, previous.cursor + 1);
        assert.equal(state.count, previous.count);
        assert.equal(state.total, previous.total);
        assert.equal(state.yielded, model.source[previous.cursor] * 2);
      }
      if (state.phase === "collected") {
        assert.equal(previous.phase, "yielded");
        assert.equal(state.cursor, previous.cursor);
        assert.equal(state.count, previous.count + 1);
        assert.equal(state.total, previous.total + previous.yielded);
      }
      if (state.phase === "exhausted") {
        assert.equal(previous.phase, "requested");
        assert.equal(state.count, previous.count);
        assert.equal(state.total, previous.total);
        assert.equal(state.cursor, model.source.length);
      }
      if (state.phase === "returned") assert.equal(previous.phase, "exhausted");
      if (state.call === 2) {
        assert.equal(
          state.cursor,
          model.source.length,
          "Same iterator cannot rewind on the second call",
        );
        assert.equal(state.count, 0);
        assert.equal(state.total, 0);
        assert(state.exhausted);
      }
    }
    assert.deepEqual(
      model.source,
      original,
      "Source is not consumed or mutated",
    );
    assert.deepEqual(
      model.states.at(-1).results.map(generatorTuple),
      model.expectedOutput,
    );
    assert.equal(generatorStateAt(model, -100), model.states[0]);
    assert.equal(generatorStateAt(model, 0.9), model.states[0]);
    assert.equal(generatorStateAt(model, 9999), model.states.at(-1));
    for (const invalid of [
      NaN,
      Infinity,
      -Infinity,
      "2",
      null,
      undefined,
      {},
      [],
    ])
      assert.equal(generatorStateAt(model, invalid), model.states[0]);
  }
  for (const invalid of [
    "",
    "LIST",
    "one_shot",
    "print(999)",
    null,
    false,
    1,
    NaN,
    Infinity,
    {},
    [],
    Symbol("bad"),
    ...Array.from({ length: 200 }, (_, i) => `invalid-${i}-'\n`),
  ]) {
    const model = makeGeneratorScenario(invalid);
    assert.equal(model.mode, "list");
    assert.equal(model.code, cases[0].code);
  }

  // Run each complete generated script in native Python. Then instrument that
  // exact summarize definition with a real iterator to check every diagram state.
  const oracle = spawnSync(
    process.env.PYTHON || "python3",
    [
      "-c",
      String.raw`
import ast, contextlib, io, json, sys
cases = json.load(sys.stdin)
checked = 0
for model in cases:
    tree = ast.parse(model['code'])
    for node in ast.walk(tree):
        assert not isinstance(node, (ast.Import, ast.ImportFrom, ast.While, ast.With, ast.AsyncFunctionDef))
    stdout = io.StringIO()
    env = {'__builtins__': {'print': print, 'iter': iter}}
    with contextlib.redirect_stdout(stdout):
        exec(compile(tree, '<generator-scene>', 'exec'), env)
    assert stdout.getvalue().splitlines() == model['expectedOutput']
    if model['mode'] == 'one-shot':
        exhausted = object()
        assert next(env['one_shot'], exhausted) is exhausted

    original = list(model['source'])
    source = list(original)
    observations, results = [], []
    summary_frame = None
    current_call = 0
    first_loop = True
    def record(phase, input_value=None, value=None, returned=None):
        local = summary_frame.f_locals
        observations.append({
            'phase': phase, 'call': current_call,
            'cursor': probe.cursor,
            'count': local['count'], 'total': local['total'],
            'input': input_value, 'yielded': value,
            'exhausted': probe.exhausted or phase in ('exhausted', 'returned'),
            'returned': list(returned) if returned is not None else None,
            'results': [list(result) for result in results],
        })
    class Probe:
        def __init__(self, values):
            self.values = iter(values)
            self.cursor, self.exhausted = 0, False
        def __iter__(self):
            return self
        def __next__(self):
            record('requested')
            try:
                value = next(self.values)
            except StopIteration:
                self.exhausted = True
                record('exhausted')
                raise
            self.cursor += 1
            return value
    probe = Probe(source)
    last_input, last_yield = None, None
    def trace(frame, event, arg):
        global summary_frame, current_call, first_loop, last_input, last_yield
        if frame.f_code.co_name == 'summarize':
            if event == 'call':
                summary_frame = frame
                current_call += 1
                first_loop = True
            elif event == 'line' and frame.f_lineno == 3:
                if first_loop:
                    record('ready')
                    first_loop = False
                else:
                    record('collected', last_input, last_yield)
            elif event == 'return':
                results.append(arg)
                record('returned', returned=arg)
        elif frame.f_code.co_name == '<genexpr>' and event == 'return' and arg is not None:
            last_input, last_yield = frame.f_locals['n'], arg
            record('yielded', last_input, last_yield)
        return trace
    exec(compile(ast.Module(body=[tree.body[0]], type_ignores=[]), '<generator-function>', 'exec'), env)
    sys.settrace(trace)
    try:
        for call in range(model['calls']):
            env['summarize'](probe)
    finally:
        sys.settrace(None)
    assert source == original, 'Source list changed'
    assert observations == model['states'], (model['mode'], observations, model['states'])
    checked += len(observations)
print('Native Python: %d complete scripts and %d demand/yield/tally/return states verified.' % (len(cases), checked))
`,
    ],
    { input: JSON.stringify(cases), encoding: "utf8", maxBuffer: 5_000_000 },
  );
  assert.equal(oracle.status, 0, oracle.stderr);
  console.log(oracle.stdout.trim());

  root = createRoot(mount);
  const render = async (key) =>
    act(async () => root.render(React.createElement(Scene, { key })));
  const click = async (element) => {
    assert(element);
    await act(async () => element.click());
  };
  const select = async (element, value) =>
    act(async () => {
      element.value = value;
      element.dispatchEvent(new dom.window.Event("change", { bubbles: true }));
    });
  const next = () => mount.querySelector("[data-generator-next]");
  const status = () =>
    mount.querySelector("[data-generator-status]").textContent;
  const source = () => mount.querySelector("[data-generator-source]");
  const reset = () =>
    [...mount.querySelectorAll("button")].find(
      (button) => button.textContent === "Reset scene",
    );
  const decodedDownload = () =>
    decodeURIComponent(
      mount
        .querySelector("a[download]")
        .getAttribute("href")
        .split(",")
        .slice(1)
        .join(","),
    );
  for (const model of cases) {
    await render(model.mode);
    await select(mount.querySelectorAll("select")[0], model.mode);
    assert(!source().open, "Source must begin closed");
    assert.equal(decodedDownload(), model.code);
    assert.equal(
      mount.querySelector("a[download]").download,
      "generator-what-if.py",
    );
    assert.equal(source().querySelector("code").textContent, model.code);
    assert.equal(
      source().querySelectorAll("pre")[1].textContent,
      model.expectedOutput.join("\n"),
    );
    await select(mount.querySelectorAll("select")[1], model.prediction);
    const entries = () =>
      [...mount.querySelectorAll("[data-source-entry] text")].map((el) =>
        Number(el.textContent),
      );
    for (let index = 0; index < model.states.length; index++) {
      const state = model.states[index];
      assert.equal(
        mount.querySelector("svg title").textContent,
        `Generator request station, call ${state.call}, ${state.phase}`,
      );
      assert.equal(next().textContent, generatorNextLabel(model, state));
      assert(status().includes(generatorExplanation(model, state)));
      assert.deepEqual(
        entries(),
        model.source,
        "Source stays visibly unchanged in every phase",
      );
      assert.equal(mount.querySelectorAll("select")[1].disabled, index !== 0);
      assert.equal(next().disabled, index === model.states.length - 1);
      const result = mount.querySelector("[data-generator-results] pre");
      if (state.results.length)
        assert.equal(
          result.textContent,
          state.results
            .map((value, i) => `Call ${i + 1}: ${generatorTuple(value)}`)
            .join("\n"),
        );
      else assert.equal(result, null);
      if (index < model.states.length - 1) await click(next());
    }
    assert.match(status(), /Your prediction matches/);
    await click(next());
    assert.match(status(), /Your prediction matches/);
    await click(reset());
    assert.equal(mount.querySelectorAll("select")[0].value, model.mode);
    assert.equal(mount.querySelectorAll("select")[1].value, "");
    assert(!next().disabled);
    assert(!mount.querySelector("[data-generator-results]"));
    assert.equal(
      mount.querySelector("svg title").textContent,
      "Generator request station, call 1, ready",
    );
  }
  await render("wrong-guess");
  await select(mount.querySelectorAll("select")[1], "(3, 11)");
  for (let i = 1; i < cases[0].states.length; i++) await click(next());
  assert.match(
    status(),
    /Compare your prediction: the final call returns \(3, 22\)/,
  );
  source().open = true;
  await select(mount.querySelectorAll("select")[0], "one-shot");
  assert(!source().open, "Changing mode closes stale source");
  assert.equal(mount.querySelectorAll("select")[1].value, "");
  assert(!next().disabled);
  assert(!mount.querySelector("[data-generator-results]"));
  await select(mount.querySelectorAll("select")[0], "unrecognized");
  assert.equal(mount.querySelectorAll("select")[0].value, "list");
  assert.equal(decodedDownload(), cases[0].code);

  await act(async () =>
    root.render(
      React.createElement(
        React.Fragment,
        null,
        ...[1, 2].map((key) => React.createElement(Scene, { key })),
      ),
    ),
  );
  const ids = [...mount.querySelectorAll("[id]")].map((el) => el.id);
  assert.equal(ids.length, new Set(ids).size, "Instance IDs are unique");
  for (const element of mount.querySelectorAll("[aria-labelledby]"))
    for (const id of element.getAttribute("aria-labelledby").split(" "))
      assert(document.getElementById(id), `Missing ARIA reference ${id}`);
  for (const svg of mount.querySelectorAll("svg")) {
    assert(svg.querySelector("title"));
    assert(svg.querySelector("desc"));
    assert.equal(svg.getAttribute("viewBox"), "0 0 360 548");
    assert.equal(svg.querySelector("rect").getAttribute("fill"), "#1b2030");
  }
  assert.equal(mount.querySelectorAll("[role=status]").length, 2);
  assert.equal(mount.querySelectorAll("figcaption").length, 2);
  assert([...mount.querySelectorAll("details")].every((el) => !el.open));
  await click(mount.querySelector("[data-generator-next]"));
  assert.deepEqual(
    [...mount.querySelectorAll("svg title")].map((el) => el.textContent),
    [
      "Generator request station, call 1, requested",
      "Generator request station, call 1, ready",
    ],
  );
  for (const model of cases)
    for (const state of model.states) {
      const html = renderToStaticMarkup(
        React.createElement(PythonGeneratorPicture, { model, state, id: "qa" }),
      );
      assert(!/NaN|undefined/.test(html));
      assert(html.includes("The source list"));
    }
  assert.equal(requests.length, 0, "No API/network requests");
  assert.equal(writes.length, 0, "No storage or progress writes");
  console.log(
    "PASS: all 3 bounded modes, all 31 intermediate states, native Python outputs, exhausted iterator reuse, controls, predictions, resets, downloads, unique accessible IDs, SSR, enum fuzz and no writes.",
  );
} finally {
  if (root) await act(async () => root.unmount());
  dom.window.close();
  await rm(temp, { recursive: true, force: true });
}
