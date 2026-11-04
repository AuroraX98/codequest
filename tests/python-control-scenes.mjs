/** Generated Python is checked with Python itself; interaction checks use native DOM events. */
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
import { pathToFileURL, fileURLToPath } from "node:url";
import ts from "typescript";
import { JSDOM } from "jsdom";
import React, { act } from "react";
import { renderToStaticMarkup } from "react-dom/server";

const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const temp = await mkdtemp(path.join(tmpdir(), "codequest-control-scenes-"));
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
globalThis.fetch = async (...args) => {
  requests.push(args);
  throw new Error("No requests allowed.");
};
for (const name of ["setItem", "removeItem", "clear"]) {
  dom.window.Storage.prototype[name] = (...args) => {
    writes.push([name, ...args]);
    throw new Error("No storage writes allowed.");
  };
}
let root;
try {
  await mkdir(path.join(temp, "lib"));
  await mkdir(path.join(temp, "components"));
  await symlink(
    path.join(repo, "node_modules"),
    path.join(temp, "node_modules"), process.platform === "win32" ? "junction" : "dir");
  for (const file of [
    "lib/python-control-scenes.ts",
    "components/PythonControlScenes.tsx",
  ]) {
    const source = await readFile(path.join(repo, file), "utf8");
    assert.doesNotMatch(
      source,
      /dangerouslySetInnerHTML|\beval\s*\(|\bfetch\s*\(|localStorage|sessionStorage|runProject|setInterval|setTimeout/,
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
    assert.equal(compiled.diagnostics?.length ?? 0, 0, file);
    await writeFile(
      path.join(temp, file.replace(/\.tsx?$/, ".mjs")),
      compiled.outputText.replace(
        /from\s+(['"])(\.\.?\/[^'"]+)\1/g,
        'from "$2.mjs"',
      ),
    );
  }
  const {
    makeLightScenario,
    makeLoopScenario,
    boundedBrightness,
    schedulePresets,
  } = await import(
    pathToFileURL(path.join(temp, "lib/python-control-scenes.mjs")).href
  );
  const { default: Scenes } = await import(
    pathToFileURL(path.join(temp, "components/PythonControlScenes.mjs")).href
  );
  const brightnessInputs = [
    ...Array.from({ length: 241 }, (_, i) => i - 80),
    ...[0, 39, 40, 41, 80].flatMap((n) => [n - 0.9, n + 0.9]),
    NaN,
    Infinity,
    -Infinity,
  ];
  const lightCases = brightnessInputs.flatMap((value) =>
    ["<", "<=", '; print("INJECTED")'].map((op) =>
      makeLightScenario(value, op),
    ),
  );
  for (const model of lightCases) {
    assert.ok(
      Number.isInteger(model.brightness) &&
        model.brightness >= 0 &&
        model.brightness <= 80,
    );
    assert.ok(["<", "<="].includes(model.operator));
    assert.deepEqual(model.expected, [model.returned]);
    assert.equal(model.branch, model.condition ? "if" : "else");
  }
  for (const n of [39, 40, 41]) {
    assert.equal(makeLightScenario(n).branch, n < 40 ? "if" : "else");
    assert.equal(makeLightScenario(n, "<=").branch, n <= 40 ? "if" : "else");
  }
  assert.equal(boundedBrightness(NaN), 25);
  assert.equal(boundedBrightness(-10), 0);
  assert.equal(boundedBrightness(1000), 80);
  const loopCases = [];
  for (const preset of [
    "three",
    "two",
    "empty",
    "__proto__",
    "constructor",
    "<script>",
  ]) {
    for (const step of [-9, -1, 0, 0.9, 1, 1.8, 2, 3, 4, 100, NaN, Infinity]) {
      const model = makeLoopScenario(preset, step);
      assert.ok(Number.isInteger(model.step));
      assert.ok(model.step >= 0 && model.step <= model.totalSteps);
      assert.equal(model.bodyCount, model.days.length);
      assert.equal(model.afterCount, 1);
      assert.equal(model.totalSteps, model.bodyCount + 1);
      assert.equal(
        model.output.length,
        model.visits + (model.finished ? 1 : 0),
      );
      assert.ok(
        model.cards.every((card) =>
          ["current", "visited", "future"].includes(card.status),
        ),
      );
      assert.equal(
        model.cards.filter((card) => card.status === "current").length,
        model.currentDay ? 1 : 0,
      );
      const states = Array.from({ length: model.totalSteps + 1 }, (_, s) =>
        makeLoopScenario(model.preset, s),
      );
      loopCases.push({ model, states });
    }
  }
  assert.deepEqual(makeLoopScenario("three").days, [
    "Monday",
    "Wednesday",
    "Friday",
  ]);
  assert.deepEqual(makeLoopScenario("two").days, ["Saturday", "Sunday"]);
  assert.deepEqual(makeLoopScenario("empty", 1).output, ["Schedule finished"]);
  assert.equal(makeLoopScenario("empty", 1).visits, 0);
  assert.equal(
    makeLoopScenario("three", 3).finished,
    false,
    "Finishing the last visit does not run the outside print early.",
  );
  assert.deepEqual(
    makeLoopScenario("three", 4).cards.map((card) => card.status),
    ["visited", "visited", "visited"],
  );
  const changed = makeLoopScenario("three");
  changed.days.push("Extra");
  assert.equal(
    makeLoopScenario("three").days.length,
    3,
    "Caller cannot mutate the preset via returned days.",
  );

  const python = spawnSync(
    process.env.PYTHON || "python3",
    [
      "-c",
      String.raw`
import ast, contextlib, io, json, sys
cases = json.load(sys.stdin)
allowed = (ast.Module, ast.FunctionDef, ast.arguments, ast.arg, ast.If, ast.Compare,
           ast.Lt, ast.LtE, ast.Return, ast.Constant, ast.Name, ast.Load, ast.Store,
           ast.Expr, ast.Call, ast.Assign, ast.For, ast.List, ast.JoinedStr, ast.FormattedValue)
for model in cases['light']:
    tree = ast.parse(model['code'])
    assert len(tree.body) == 2
    for node in ast.walk(tree):
        assert isinstance(node, allowed), type(node).__name__
    env = {'__builtins__': {'print': print}}
    output = io.StringIO()
    with contextlib.redirect_stdout(output):
        exec(compile(tree, '<light>', 'exec'), env)
    assert output.getvalue() == model['expected'][0] + '\n', model
    # The function returns text but does not print anything itself.
    output = io.StringIO()
    with contextlib.redirect_stdout(output):
        returned = env['light_reminder'](model['brightness'])
    assert output.getvalue() == ''
    assert returned == model['returned']
    test = tree.body[0].body[0].test
    condition = eval(compile(ast.Expression(body=test), '<condition>', 'eval'), {}, {'brightness': model['brightness']})
    assert condition is model['condition']
    assert ('if' if condition else 'else') == model['branch']
for case in cases['loop']:
    model, states = case['model'], case['states']
    tree = ast.parse(model['code'])
    assert len(tree.body) == 3 and isinstance(tree.body[1], ast.For)
    assert len(tree.body[1].body) == 1, 'The repeated instruction must exist only once in source.'
    for node in ast.walk(tree):
        assert isinstance(node, allowed), type(node).__name__
    output, events = [], []
    env = {}
    def record(value):
        output.append(value)
        events.append({'output': list(output), 'day': env.get('day')})
    env['__builtins__'] = {'print': record}
    exec(compile(tree, '<loop>', 'exec'), env)
    assert output == model['expected'], (output, model)
    assert states[0]['output'] == []
    assert len(events) + 1 == len(states)
    for index, event in enumerate(events):
        state = states[index + 1]
        assert event['output'] == state['output'], (event, state)
        if index < len(model['days']):
            assert event['day'] == state['currentDay'] == model['days'][index]
            assert not state['finished']
        else:
            assert state['finished'] and state['currentDay'] is None
    assert model['output'] == states[model['step']]['output']
print('Verified', len(cases['light']), 'brightness models and', len(cases['loop']), 'loop models, including every intermediate output, with native Python.')
`,
    ],
    {
      input: JSON.stringify({ light: lightCases, loop: loopCases }),
      encoding: "utf8",
      maxBuffer: 8 * 1024 * 1024,
    },
  );
  assert.equal(python.status, 0, python.stderr || python.error?.message);
  console.log(python.stdout.trim());

  for (const unitId of [
    "python-01",
    "python-02",
    "python-05",
    "javascript-03",
    "__proto__",
    "constructor",
  ]) {
    assert.equal(
      renderToStaticMarkup(React.createElement(Scenes, { unitId })),
      "",
    );
  }
  root = createRoot(document.getElementById("mount"));
  const flush = () =>
    act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });
  const render = async (unitId) => {
    await act(async () => root.render(React.createElement(Scenes, { unitId })));
    await flush();
  };
  const click = async (element) => {
    assert.ok(element, "Clickable element exists");
    await act(async () => element.click());
    await flush();
  };
  const button = (text) =>
    [...document.querySelectorAll("button")].find(
      (el) => el.textContent.trim() === text,
    );
  const selectValue = async (select, value) => {
    assert.ok(select);
    await act(async () => {
      select.value = value;
      select.dispatchEvent(new dom.window.Event("change", { bubbles: true }));
    });
    await flush();
  };
  const inputValue = async (input, value) => {
    await act(async () => {
      Object.getOwnPropertyDescriptor(
        dom.window.HTMLInputElement.prototype,
        "value",
      ).set.call(input, value);
      input.dispatchEvent(new dom.window.Event("input", { bubbles: true }));
      input.dispatchEvent(new dom.window.Event("change", { bubbles: true }));
    });
    await flush();
  };
  const source = () =>
    document.querySelector('[aria-label="Corresponding Python source"]')
      .textContent;
  const download = () => document.querySelector("a[download]");
  const verifyDownload = (expected) => {
    assert.equal(source(), expected);
    assert.equal(
      decodeURIComponent(
        download().getAttribute("href").split(",").slice(1).join(","),
      ),
      expected,
    );
    assert.match(download().download, /\.py$/);
  };
  const verifyIds = () => {
    const ids = [...document.querySelectorAll("[id]")].map((el) => el.id);
    assert.equal(
      new Set(ids).size,
      ids.length,
      "All mounted instances have unique IDs.",
    );
    for (const element of document.querySelectorAll("[aria-labelledby]")) {
      for (const id of element.getAttribute("aria-labelledby").split(" "))
        assert.ok(
          document.getElementById(id),
          "Accessible naming target exists: " + id,
        );
    }
    for (const label of document.querySelectorAll("label[for]"))
      assert.ok(document.getElementById(label.htmlFor));
    for (const element of document.querySelectorAll("svg *")) {
      for (const attr of [...element.attributes])
        for (const match of attr.value.matchAll(/url\(#([^)]*)\)/g))
          assert.ok(document.getElementById(match[1]));
    }
  };
  await render("python-03");
  verifyIds();
  assert.ok(button("Reveal decision").disabled, "Predict before revealing.");
  assert.equal(
    document.querySelector(".pcs-code").open,
    false,
    "Python starts closed.",
  );
  assert.equal(document.querySelector(".pcs-result"), null);
  assert.match(
    document.querySelector(".pcs-limit").textContent,
    /reads no sensor and switches on no lamp/,
  );
  verifyDownload(makeLightScenario(25).code);
  await click(document.querySelector('input[value="if"]'));
  await click(button("Reveal decision"));
  assert.match(
    document.querySelector(".pcs-result").textContent,
    /You predicted it/,
  );
  assert.equal(
    document.querySelector(".pcs-output pre").textContent,
    "Turn on a lamp",
  );
  assert.ok(document.querySelector("input[type=radio]").matches(":disabled"));
  for (const brightness of [39, 40, 41]) {
    await click(button(String(brightness)));
    assert.ok(
      button("Reveal decision").disabled,
      "Changing brightness clears prediction.",
    );
    assert.equal(document.querySelector(".pcs-result"), null);
    await click(document.querySelector('input[value="if"]'));
    await click(button("Reveal decision"));
    assert.equal(
      document.querySelector(".pcs-output pre").textContent,
      makeLightScenario(brightness).returned,
    );
    verifyDownload(makeLightScenario(brightness).code);
  }
  await click(button("40"));
  document.querySelector(".pcs-code").open = true;
  await selectValue(document.querySelector("select"), "<=");
  assert.ok(button("Reveal decision").disabled);
  assert.equal(
    document.querySelector(".pcs-code").open,
    false,
    "A changed scenario closes its previous code.",
  );
  await click(document.querySelector('input[value="else"]'));
  await click(button("Reveal decision"));
  assert.equal(
    document.querySelector(".pcs-output pre").textContent,
    "Turn on a lamp",
  );
  assert.match(
    document.querySelector(".pcs-result").textContent,
    /added equals sign includes 40/,
  );
  verifyDownload(makeLightScenario(40, "<=").code);
  await inputValue(document.querySelector("input[type=range]"), "41");
  assert.equal(document.querySelector("input[type=number]").value, "41");
  assert.ok(button("Reveal decision").disabled);
  await inputValue(document.querySelector("input[type=number]"), "-5");
  assert.equal(document.querySelector("input[type=number]").value, "0");
  assert.equal(
    document.querySelector("g[clip-path] rect").getAttribute("fill"),
    "rgb(31, 48, 74)",
    "Darkness uses broadly compatible SVG RGB.",
  );
  const lampShade = document.querySelector(
    'path[d="M233 50H275L288 90H220Z"]',
  ).outerHTML;
  assert.match(document.querySelector("svg").textContent, /lamp stays off/);
  await inputValue(document.querySelector("input[type=number]"), "999");
  assert.equal(document.querySelector("input[type=number]").value, "80");
  assert.equal(
    document.querySelector("g[clip-path] rect").getAttribute("fill"),
    "rgb(159, 205, 225)",
    "Daylight brightens the window, not the lamp.",
  );
  assert.equal(
    document.querySelector('path[d="M233 50H275L288 90H220Z"]').outerHTML,
    lampShade,
  );
  assert.match(document.querySelector("svg").textContent, /lamp stays off/);
  await click(document.querySelector('input[value="else"]'));
  await click(button("Reveal decision"));
  await click(button("Reset prediction"));
  assert.equal(document.querySelector(".pcs-result"), null);
  assert.equal(
    document.querySelector("input[type=number]").value,
    "80",
    "Reset preserves the chosen scenario.",
  );
  assert.equal(document.querySelector("input[type=radio]:checked"), null);

  await render("python-04");
  verifyIds();
  assert.equal(document.querySelector(".pcs-code").open, false);
  for (const preset of schedulePresets) {
    await selectValue(document.querySelectorAll("select")[0], preset.id);
    let model = makeLoopScenario(preset.id);
    assert.ok(button(model.nextLabel).disabled);
    assert.match(
      document.querySelector(".pcs-output").textContent,
      /Nothing printed yet/,
    );
    verifyDownload(model.code);
    await selectValue(
      document.querySelectorAll("select")[1],
      String(model.bodyCount),
    );
    assert.ok(
      button(model.nextLabel).disabled,
      "Both predictions are required.",
    );
    await selectValue(document.querySelectorAll("select")[2], "1");
    for (let step = 1; step <= model.totalSteps; step++) {
      await click(button(model.nextLabel));
      model = makeLoopScenario(preset.id, step);
      assert.equal(
        document.querySelector(".pcs-output pre").textContent,
        model.output.join("\n"),
      );
      assert.match(
        document.querySelector(".pcs-result").textContent,
        new RegExp(
          `${model.visits} body visits · ${model.finished ? 1 : 0} finish prints so far`,
        ),
      );
      assert.ok(document.querySelectorAll("select")[1].matches(":disabled"));
      if (step === model.bodyCount)
        assert.doesNotMatch(
          document.querySelector(".pcs-output").textContent,
          /Schedule finished/,
          "Last visit does not print finish early.",
        );
    }
    assert.ok(button("Schedule complete").disabled);
    assert.match(
      document.querySelector(".pcs-result").textContent,
      /You predicted both counts/,
    );
    if (preset.id === "empty")
      assert.match(
        document.querySelector(".pcs-result").textContent,
        /No items means no visits/,
      );
    const html = document.querySelector("[data-scene]").innerHTML;
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 40));
    });
    assert.equal(
      document.querySelector("[data-scene]").innerHTML,
      html,
      "No auto-stepping or implicit progress.",
    );
    await click(button("Reset walkthrough"));
    assert.match(
      document.querySelector(".pcs-output").textContent,
      /Nothing printed yet/,
    );
    assert.equal(document.querySelectorAll("select")[1].value, "");
    assert.equal(document.querySelectorAll("select")[2].value, "");
  }
  // Changing the list halfway through resets visits, output and predictions.
  await selectValue(document.querySelectorAll("select")[0], "three");
  await selectValue(document.querySelectorAll("select")[1], "0");
  await selectValue(document.querySelectorAll("select")[2], "0");
  await click(button("Visit Monday"));
  await selectValue(document.querySelectorAll("select")[0], "empty");
  assert.ok(button("Continue after the loop").disabled);
  assert.match(
    document.querySelector(".pcs-output").textContent,
    /Nothing printed yet/,
  );
  await selectValue(document.querySelectorAll("select")[1], "3");
  await selectValue(document.querySelectorAll("select")[2], "0");
  await click(button("Continue after the loop"));
  assert.match(
    document.querySelector(".pcs-result").textContent,
    /Compare your prediction: 0 body visits, 1 finish print/,
  );
  await act(async () =>
    root.render(
      React.createElement(
        React.Fragment,
        null,
        ...["python-03", "python-03", "python-04", "python-04"].map(
          (unitId, index) =>
            React.createElement(Scenes, { unitId, key: index }),
        ),
      ),
    ),
  );
  verifyIds();
  assert.equal(document.querySelectorAll("svg[role=img]").length, 4);
  assert.equal(requests.length, 0);
  assert.equal(writes.length, 0);
  console.log(
    "PASS: DOM predictions, 39/40/41 boundaries, <= rule changes, range/number bounds, every schedule step, empty list, reset/list invalidation, exact .py downloads, closed source disclosures, unique SVG IDs, and no fetch/storage/automatic progress.",
  );
} finally {
  if (root) await act(async () => root.unmount());
  dom.window.close();
  await rm(temp, { recursive: true, force: true });
}
