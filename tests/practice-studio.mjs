import assert from "node:assert/strict";
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
import ts from "typescript";
import { JSDOM } from "jsdom";
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import "fake-indexeddb/auto";
const temp = await mkdtemp(path.join(tmpdir(), "codequest-practice-studio-"));
const dom = new JSDOM('<div id="mount"></div>', {
  pretendToBeVisual: true,
  url: "https://fixture.example",
});
Object.assign(globalThis, {
  window: dom.window,
  document: dom.window.document,
  IS_REACT_ACT_ENVIRONMENT: true,
  requestAnimationFrame: dom.window.requestAnimationFrame.bind(dom.window),
});
const scope = "9".repeat(64);
const fixture = () => ({
  id: crypto.randomUUID(),
  createdAt: new Date().toISOString(),
  baseUnitId: "javascript-01",
  difficulty: "beginner",
  provider: "deepseek",
  model: "deepseek-flash",
  project: {
    title: "A fresh apple count",
    task: "Store three in answer.",
    explanation: [
      "A variable names a value.\n```javascript\nconst apples = 2;\n```\nThis stores two.",
      "Values can change between examples.\n```javascript\nconst apples = 4;\n```\nThis stores four.",
      "Use const and an equals sign to save your answer.",
    ],
    steps: ["Read the example.", "Change the number.", "Run your code."],
    requirements: ["answer holds three"],
    starter: "const answer = 0;",
    solution: "const answer = 3;",
    filename: "practice.js",
    checks: [{ label: "Stores three", expression: "answer === 3" }],
    hints: ["Try a number.", "Use three."],
    runtime: "javascript",
    manualReview: false,
  },
});
const runtime = { calls: [], results: [] };
globalThis.__practiceRuntimeFixture = runtime;
const passed = {
  output: [],
  checks: [{ label: "Stores three", passed: true }],
};
const failed = {
  output: [],
  checks: [{ label: "Stores three", passed: false }],
};
const requests = [];
let generated = fixture(),
  waitForReply,
  responseStatus = 200;
globalThis.fetch = async (url, options) => {
  assert.equal(
    url,
    "/api/practice",
    "No course completion or key endpoint is called",
  );
  requests.push(JSON.parse(options.body));
  if (waitForReply) await waitForReply;
  return Response.json(generated, { status: responseStatus });
};
let root;
try {
  await mkdir(path.join(temp, "components"));
  await mkdir(path.join(temp, "lib"));
  await symlink(
    path.resolve("node_modules"),
    path.join(temp, "node_modules"),
    "dir",
  );
  for (const file of [
    "components/PracticeStudio.tsx",
    "lib/practice-storage.ts",
    "lib/practice-project.ts",
    "lib/device-db.ts",
    "lib/ai-providers.ts",
  ]) {
    const js = ts
      .transpileModule(await readFile(file, "utf8"), {
        compilerOptions: {
          target: ts.ScriptTarget.ES2022,
          module: ts.ModuleKind.ESNext,
          jsx: ts.JsxEmit.ReactJSX,
        },
      })
      .outputText.replace(/from "(\.\.?\/[^\"]+)"/g, 'from "$1.mjs"');
    await writeFile(path.join(temp, file.replace(/\.tsx?$/, ".mjs")), js);
  }
  await writeFile(
    path.join(temp, "components/CodeEditor.mjs"),
    `import React from 'react';export default function Editor({code,onChange}){return React.createElement('textarea',{'aria-label':'Fixture practice editor',value:code,onInput:event=>onChange(event.currentTarget.value)});}`,
  );
  await writeFile(
    path.join(temp, "components/LessonContent.mjs"),
    `import React from 'react';export default function Content({text}){return React.createElement('p',null,text);}export function InlineCode({text}){return text;}export function CodeExample({code}){return React.createElement('pre',null,code);}`,
  );
  await writeFile(
    path.join(temp, "lib/runner.mjs"),
    `export async function runProject(frame,lesson,code,signal){const fixture=globalThis.__practiceRuntimeFixture;fixture.calls.push({runtime:lesson.runtime,code});return fixture.results.shift()??{output:[],checks:[],error:'Fixture has no result'};}`,
  );
  const { default: Studio } = await import(
    path.join(temp, "components/PracticeStudio.mjs")
  );
  const storage = await import(path.join(temp, "lib/practice-storage.mjs"));
  let settingsOpened = 0;
  let props = {
    state: {
      draftScope: scope,
      profile: { aiEnabled: true },
      keyConnected: true,
      aiProvider: "deepseek",
      xp: 700,
    },
    online: true,
    visible: true,
    units: [
      {
        id: "javascript-01",
        track: "javascript",
        level: "beginner",
        topic: "Values and names",
      },
    ],
    lessons: [{ id: "javascript-01", runtime: "javascript" }],
    activeId: "javascript-01",
    runnerUrl: "",
    runnerToken: "",
    onOpenAISettings: () => settingsOpened++,
  };
  root = createRoot(document.getElementById("mount"));
  const flush = async (ms = 30) =>
    act(async () => {
      await new Promise((resolve) => setTimeout(resolve, ms));
    });
  const render = async () => {
    await act(async () => root.render(React.createElement(Studio, props)));
    await flush();
  };
  const button = (label) =>
    [...document.querySelectorAll("button")].find(
      (item) => item.textContent.trim() === label,
    );
  const click = async (label) => {
    assert.ok(button(label), "Button exists: " + label);
    await act(async () => button(label).click());
    await flush();
  };
  const edit = async (value) =>
    act(async () => {
      const field = document.querySelector(
        'textarea[aria-label="Fixture practice editor"]',
      );
      field.value = value;
      field.dispatchEvent(new dom.window.Event("input", { bubbles: true }));
    });
  await render();
  assert.equal(
    document.querySelector('select[aria-label="Practice difficulty"]').options
      .length,
    3,
  );
  props = { ...props, online: false };
  await render();
  assert.equal(button("Generate practice project").disabled, true);
  assert.equal(button("Open AI settings"), undefined);
  props = {
    ...props,
    online: true,
    state: { ...props.state, profile: { aiEnabled: false } },
  };
  await render();
  await click("Open AI settings");
  assert.equal(settingsOpened, 1);
  props = {
    ...props,
    state: {
      ...props.state,
      profile: { aiEnabled: true },
      keyConnected: false,
    },
  };
  await render();
  assert.equal(button("Generate practice project").disabled, true);
  assert.equal(requests.length, 0);
  props = { ...props, state: { ...props.state, keyConnected: true } };
  await render();
  runtime.results.push(passed, failed);
  await click("Generate practice project");
  await flush();
  assert.equal(requests[0].baseUnitId, "javascript-01");
  assert.equal(requests[0].difficulty, "beginner");
  assert.equal(requests[0].deviceScope, scope);
  assert.equal(requests[0].expectedProvider, "deepseek");
  assert.deepEqual(
    runtime.calls.slice(0, 2).map((call) => call.code),
    [generated.project.solution, generated.project.starter],
  );
  assert.equal(
    document.querySelector("textarea").value,
    generated.project.starter,
  );
  assert.ok(
    !document.body.textContent.includes(generated.project.solution),
    "Example solution stays hidden until requested",
  );
  assert.equal((await storage.loadPractices(scope)).drafts.length, 1);
  assert.ok(
    document.body.textContent.indexOf("UNDERSTAND IT FIRST") <
      document.body.textContent.indexOf("Your task"),
  );
  await click("Show example solution");
  assert.ok(document.body.textContent.includes(generated.project.solution));
  await click("Hide example solution");
  await edit(generated.project.solution);
  runtime.results.push(passed);
  await click("Run practice");
  await click("Mark practice complete");
  const complete = await storage.loadPractices(scope);
  assert.ok(complete.drafts[0].completed);
  assert.equal(props.state.xp, 700);
  assert.equal(requests.length, 1);
  await edit("const answer = 4;");
  await flush();
  assert.equal(button("Mark practice complete"), undefined);
  assert.ok(
    !document.body.textContent.includes("You completed this saved version"),
  );
  dom.window.confirm = () => true;
  await click("Reset starter");
  const reset = await storage.loadPractices(scope);
  assert.equal(reset.drafts[0].code, generated.project.starter);
  assert.ok(
    reset.drafts[0].versions.some(
      (version) => version.code === "const answer = 4;",
    ),
  );
  // Reject a generated project whose sample fails before adoption.
  generated = fixture();
  runtime.results.push(failed);
  await click("Generate practice project");
  await flush();
  assert.equal((await storage.loadPractices(scope)).drafts.length, 1);
  assert.match(
    document.body.textContent,
    /example did not pass its own checks/,
  );
  assert.match(
    document.querySelector('[role="status"]').textContent,
    /No new practice was saved/,
  );
  assert.ok(
    !document
      .querySelector('[role="status"]')
      .textContent.includes("Checking the example"),
  );
  // Reject already-complete starter projects as well.
  generated = fixture();
  runtime.results.push(passed, passed);
  await click("Generate practice project");
  await flush();
  assert.equal((await storage.loadPractices(scope)).drafts.length, 1);
  assert.match(document.body.textContent, /starter already passes every check/);
  assert.match(
    document.querySelector('[role="status"]').textContent,
    /Your existing work is still here/,
  );
  // Server/schema failures must clear the progress message as well as busy UI.
  generated = {
    error: "The AI returned a practice project that could not be validated.",
  };
  responseStatus = 502;
  await click("Generate practice project");
  await flush();
  assert.equal((await storage.loadPractices(scope)).drafts.length, 1);
  assert.match(document.body.textContent, /could not be validated/);
  assert.match(
    document.querySelector('[role="status"]').textContent,
    /No new practice was saved/,
  );
  assert.ok(
    !document
      .querySelector('[role="status"]')
      .textContent.includes("Creating a fresh project"),
  );
  responseStatus = 200;
  // A provider/AI change while generation is pending cannot adopt the reply.
  let release;
  waitForReply = new Promise((resolve) => {
    release = resolve;
  });
  generated = fixture();
  await act(async () => button("Generate practice project").click());
  await flush();
  props = { ...props, state: { ...props.state, aiProvider: "openai" } };
  await render();
  release();
  waitForReply = undefined;
  await flush();
  assert.equal((await storage.loadPractices(scope)).drafts.length, 1);
  assert.equal(runtime.calls.length, 6);
  // Hiding the pane preserves its saved local draft and controller state.
  props = { ...props, visible: false };
  await render();
  assert.equal(document.querySelector("section"), null);
  props = { ...props, visible: true };
  await render();
  assert.equal(document.querySelector("textarea").value, reset.drafts[0].code);
  console.log(
    "Passed practice difficulty/provider gating, reference/starter validation before adoption, theory-first editing, explicit solution reveal, source-bound completion without course XP, history-preserving reset, stale generation rejection, and saved state across navigation.",
  );
} finally {
  if (root) await act(async () => root.unmount());
  dom.window.close();
  delete globalThis.__practiceRuntimeFixture;
  await rm(temp, { recursive: true, force: true });
}
