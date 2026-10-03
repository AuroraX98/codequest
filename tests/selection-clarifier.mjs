import assert from "node:assert/strict";
import { readFile, writeFile, rm } from "node:fs/promises";
import ts from "typescript";
import { JSDOM } from "jsdom";
import React, { act } from "react";
import { createRoot } from "react-dom/client";
const files = ["lib/lesson-selection.ts", "components/SelectionClarifier.tsx"];
const dom = new JSDOM(
  '<div id="mount"></div><section id="lesson" tabindex="-1"><p id="prose">A variable is a name. <code id="inline">pet_name</code></p><pre id="code"><span>if ready:</span>\n    <span>print("go")</span>\n</pre><p id="long"></p><p id="cross">Before <button>Control</button> after</p><div contenteditable="true">Editable</div></section><p id="outside">Outside text</p>',
  { pretendToBeVisual: true, url: "https://fixture.example" },
);
Object.assign(globalThis, {
  window: dom.window,
  document: dom.window.document,
  Node: dom.window.Node,
  HTMLElement: dom.window.HTMLElement,
  IS_REACT_ACT_ENVIRONMENT: true,
  requestAnimationFrame: dom.window.requestAnimationFrame.bind(dom.window),
  cancelAnimationFrame: dom.window.cancelAnimationFrame.bind(dom.window),
});
dom.window.Range.prototype.getBoundingClientRect = () => ({
  left: 80,
  top: 80,
  bottom: 110,
  width: 160,
  height: 30,
});
const lesson = document.getElementById("lesson"),
  root = createRoot(document.getElementById("mount")),
  sent = [];
let settingsOpened = 0;
let props = {
  root: { current: lesson },
  context: "python-01:learn:2",
  online: true,
  enabled: true,
  connected: true,
  busy: false,
  provider: "DeepSeek",
  dark: false,
  onExplain: (text) => sent.push(text),
  onSettings: () => settingsOpened++,
};
try {
  for (const file of files) {
    const js = ts
      .transpileModule(await readFile(file, "utf8"), {
        compilerOptions: {
          target: ts.ScriptTarget.ES2022,
          module: ts.ModuleKind.ESNext,
          jsx: ts.JsxEmit.ReactJSX,
        },
      })
      .outputText.replace(
        /from "(\.\.?\/[^\"]+)"/g,
        'from "$1.selection-test.mjs"',
      );
    await writeFile(file.replace(/\.tsx?$/, ".selection-test.mjs"), js);
  }
  const { default: Clarifier } =
    await import("../components/SelectionClarifier.selection-test.mjs");
  const { selectedLessonPassage, clarificationQuestion } =
    await import("../lib/lesson-selection.selection-test.mjs");
  const render = async () =>
    act(async () => root.render(React.createElement(Clarifier, props)));
  const flush = async () =>
    act(async () => {
      document.dispatchEvent(new dom.window.Event("selectionchange"));
      await new Promise((r) => setTimeout(r, 25));
    });
  const select = async (node, start = 0, end = node.textContent.length) => {
    await act(async () => {
      document.dispatchEvent(
        new dom.window.Event("pointerdown", { bubbles: true }),
      );
      const range = document.createRange();
      range.setStart(node, start);
      range.setEnd(node, end);
      window.getSelection().removeAllRanges();
      window.getSelection().addRange(range);
    });
    await flush();
  };
  const button = () => document.querySelector("[data-explain]");
  const popup = () => document.querySelector(".selection-popover");
  await render();
  await select(document.getElementById("inline").firstChild);
  assert.equal(popup().querySelector("blockquote").textContent, "pet_name");
  assert.equal(sent.length, 0);
  // Pointer interaction can collapse selection before click. The saved quote must survive.
  await act(async () => {
    button().dispatchEvent(
      new dom.window.Event("pointerdown", { bubbles: true }),
    );
    window.getSelection().removeAllRanges();
    document.dispatchEvent(new dom.window.Event("selectionchange"));
    await new Promise((r) => setTimeout(r, 25));
  });
  assert.ok(button());
  await act(async () => button().click());
  assert.deepEqual(sent, ["pet_name"]);
  assert.equal(popup(), null);
  // Preserve whitespace and highlighted spans in a selected code example.
  const code = document.getElementById("code");
  await act(async () => {
    const range = document.createRange();
    range.selectNodeContents(code);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
    document.dispatchEvent(new dom.window.Event("pointerdown"));
  });
  await flush();
  assert.equal(
    popup().querySelector("blockquote").textContent,
    'if ready:\n    print("go")\n',
  );
  document.dispatchEvent(
    new dom.window.KeyboardEvent("keydown", {
      key: "Enter",
      altKey: true,
      bubbles: true,
    }),
  );
  assert.equal(document.activeElement, button());
  assert.equal(sent.length, 1);
  await act(async () => button().click());
  assert.equal(sent[1], 'if ready:\n    print("go")\n');
  assert.match(clarificationQuestion(sent[1]), /    print\("go"\)/);
  // Normalized range endpoints also accept a backwards inline selection.
  const inline = document.getElementById("inline").firstChild;
  await select(inline);
  await act(async () => {
    window.getSelection().collapse(inline, 8);
    window.getSelection().extend(inline, 0);
  });
  await flush();
  assert.equal(
    selectedLessonPassage(lesson, window.getSelection()).text,
    "pet_name",
  );
  await act(async () =>
    document.dispatchEvent(
      new dom.window.KeyboardEvent("keyup", { key: "Escape" }),
    ),
  );
  assert.equal(popup(), null);
  await flush();
  assert.equal(popup(), null);
  for (const variant of [
    { online: false, enabled: true, connected: true, text: "Reconnect" },
    {
      online: true,
      enabled: false,
      connected: true,
      text: "AI assistance is off",
    },
    {
      online: true,
      enabled: true,
      connected: false,
      text: "Connect your AI assistant",
    },
  ]) {
    props = { ...props, ...variant, context: props.context + "x" };
    await render();
    await select(inline);
    assert.equal(button().disabled, true);
    assert.ok(popup().textContent.includes(variant.text));
    const count = sent.length;
    await act(async () => button().click());
    assert.equal(sent.length, count);
  }
  await act(async () => document.querySelector("[data-settings]").click());
  assert.equal(settingsOpened, 1);
  props = {
    ...props,
    online: true,
    enabled: true,
    connected: true,
    context: "new-page",
  };
  await render();
  document.getElementById("long").textContent = "x".repeat(2001);
  await select(document.getElementById("long").firstChild);
  assert.equal(button().disabled, true);
  assert.match(popup().textContent, /shorter passage/);
  assert.equal(sent.length, 2);
  await select(document.getElementById("outside").firstChild);
  assert.equal(popup(), null);
  await select(document.querySelector("[contenteditable]").firstChild);
  assert.equal(popup(), null);
  await act(async () => {
    const range = document.createRange();
    range.selectNodeContents(document.getElementById("cross"));
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
  });
  await flush();
  assert.equal(popup(), null);
  await select(inline);
  assert.ok(popup());
  props = { ...props, context: "another-lesson" };
  await render();
  assert.equal(popup(), null);
  await select(inline);
  await act(async () =>
    popup()
      .querySelector("blockquote")
      .dispatchEvent(new dom.window.Event("scroll", { bubbles: true })),
  );
  assert.ok(popup());
  await act(async () => window.dispatchEvent(new dom.window.Event("scroll")));
  assert.equal(popup(), null);
  console.log(
    "Passed quote snapshots, inline/backwards/multiline selection, zero automatic sends, keyboard focus/Escape, unavailable/oversize gates, excluded controls/editable/outside ranges, page reset, and scroll dismissal.",
  );
} finally {
  await act(async () => root.unmount());
  for (const file of files)
    await rm(file.replace(/\.tsx?$/, ".selection-test.mjs"), { force: true });
  dom.window.close();
}
