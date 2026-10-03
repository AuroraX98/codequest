import fs from "node:fs/promises";
import vm from "node:vm";
import path from "node:path";
import os from "node:os";
import assert from "node:assert/strict";
import ts from "typescript";
import { JSDOM } from "jsdom";
import { transformSync } from "@babel/core";
import React from "react";

const lessons = JSON.parse(await fs.readFile("content/lessons.json", "utf8"));
const catalog = JSON.parse(await fs.readFile("content/catalog.json", "utf8"));
assert.equal(lessons.length, 103);
assert.equal(new Set(lessons.map((l) => l.id)).size, 103);
assert.deepEqual(
  new Set(lessons.map((l) => l.id)),
  new Set(catalog.units.map((u) => u.id)),
);
const failures = [];
let passed = 0,
  needsBrowser = [];
const temp = await fs.mkdtemp(path.join(os.tmpdir(), "codequest-types-"));
for (const l of lessons) {
  try {
    assert.ok(l.explanation.length >= 3, l.id + " explanations");
    assert.ok(l.steps.length >= 3);
    assert.ok(l.hints.length >= 3);
    assert.notEqual(l.starter, l.solution);
    assert.ok(l.quiz.answer >= 0 && l.quiz.answer < l.quiz.choices.length);
    const u = catalog.units.find((u) => u.id === l.id);
    assert.equal(!!l.math, !!u.math.level, l.id + " math");
    if (l.math)
      assert.ok(l.math.answer >= 0 && l.math.answer < l.math.choices.length);
    if (["python", "sql", "swift"].includes(l.runtime)) continue;
    // jsdom cannot measure layout, resolved transforms, or motion preferences.
    // These lessons are checked in the real browser preview instead.
    if (["css-04", "css-06", "css-07"].includes(l.id)) {
      needsBrowser.push({
        id: l.id,
        label: "Layout, transform, and motion checks in a real browser",
      });
      continue;
    }
    let code = l.solution;
    if (l.runtime === "typescript") {
      const filename = path.join(temp, l.id + ".ts");
      await fs.writeFile(filename, code);
      const options = {
        target: ts.ScriptTarget.ES2020,
        strict: true,
        noEmit: true,
        skipLibCheck: true,
      };
      const program = ts.createProgram([filename], options);
      const errors = ts
        .getPreEmitDiagnostics(program)
        .filter((d) => d.category === ts.DiagnosticCategory.Error);
      assert.equal(
        errors.length,
        0,
        errors
          .map((d) => ts.flattenDiagnosticMessageText(d.messageText, " "))
          .join("\n"),
      );
      code = ts.transpileModule(code, {
        compilerOptions: { target: ts.ScriptTarget.ES2020 },
      }).outputText;
    }
    const domMode =
      ["html", "css", "react"].includes(l.runtime) ||
      l.extraFiles?.some((f) => f.name.endsWith(".html"));
    const output = [];
    if (!domMode) {
      const context = vm.createContext({
        console: {
          log: (...v) =>
            output.push(
              v
                .map((x) =>
                  typeof x === "object" ? JSON.stringify(x) : String(x),
                )
                .join(" "),
            ),
        },
        __output: output,
        __checks: l.checks,
        setTimeout,
        clearTimeout,
        AbortController,
        URL,
        TextEncoder,
        fetch: () =>
          Promise.reject(new Error("Real network disabled in solution tests")),
      });
      const script = new vm.Script(
        "(async()=>{" +
          code +
          "\nlet results=[];for(const c of __checks){try{results.push({label:c.label,passed:!!(await eval(c.expression))})}catch(e){results.push({label:c.label,passed:false,error:e.message})}}return results;})()",
      );
      const results = await script.runInContext(context, { timeout: 2000 });
      assert.ok(
        results.every((c) => c.passed),
        JSON.stringify(results),
      );
      passed++;
      continue;
    }
    const fixture =
      l.runtime === "html"
        ? code
        : ((l.extraFiles ?? []).find((f) => f.name.endsWith(".html"))?.code ??
          '<div id="root"></div>');
    const dom = new JSDOM(
      '<!doctype html><html><body><div id="root">' +
        (l.runtime === "react" ? "" : fixture) +
        "</div></body></html>",
      {
        runScripts: "outside-only",
        pretendToBeVisual: true,
        url: "https://sandbox.example/",
      },
    );
    const w = dom.window;
    w.console = {
      ...console,
      log: (...v) => output.push(v.map(String).join(" ")),
    };
    w.__checks = l.checks;
    w.__output = output;
    if (l.runtime === "css") {
      const style = w.document.createElement("style");
      style.textContent = code;
      w.document.head.append(style);
    }
    if (l.runtime === "javascript") {
      const result = await w.eval(
        "(async()=>{" +
          code +
          "\nlet results=[];for(const c of __checks){try{results.push({label:c.label,passed:!!(await eval(c.expression))})}catch(e){results.push({label:c.label,passed:false,error:e.message})}}return results;})()",
      );
      assert.ok(
        result.every((c) => c.passed),
        JSON.stringify(result),
      );
    } else if (l.runtime === "react") {
      Object.assign(globalThis, {
        window: w,
        document: w.document,
        HTMLElement: w.HTMLElement,
        Element: w.Element,
        Event: w.Event,
      });
      const { createRoot } = await import("react-dom/client");
      w.React = React;
      const jsx = transformSync(code, {
        presets: [["@babel/preset-react", { runtime: "classic" }]],
        filename: "App.jsx",
      }).code;
      const App = w.eval(jsx + "\nApp");
      const root = createRoot(w.document.getElementById("root"));
      root.render(React.createElement(App));
      await new Promise((r) => setTimeout(r, 350));
      for (const c of l.checks) {
        let ok;
        try {
          ok = !!(await w.eval("(" + c.expression + ")"));
        } catch (e) {
          throw new Error(c.label + ": " + e.message);
        }
        assert.ok(ok, c.label);
      }
      root.unmount();
    } else {
      for (const c of l.checks) {
        let ok;
        try {
          ok = !!(await w.eval("(" + c.expression + ")"));
        } catch (e) {
          throw new Error(c.label + ": " + e.message);
        }
        if (!ok && l.runtime === "css") {
          needsBrowser.push({ id: l.id, label: c.label });
          continue;
        }
        assert.ok(ok, c.label);
      }
    }
    w.close();
    passed++;
  } catch (e) {
    failures.push({ id: l.id, error: e.message });
  }
}
await fs.rm(temp, { recursive: true, force: true });
const report = { catalog: lessons.length, passed, failures, needsBrowser };
await fs.writeFile(
  ".sites-runtime/solution-report.json",
  JSON.stringify(report, null, 2),
);
console.log(JSON.stringify(report, null, 2));
if (failures.length) process.exitCode = 1;
