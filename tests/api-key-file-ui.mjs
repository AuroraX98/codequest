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

const temp = await mkdtemp(path.join(tmpdir(), "codequest-key-file-ui-"));
const dom = new JSDOM('<div id="mount"></div>', {
  url: "https://fixture.example",
});
const prior = {
  window: globalThis.window,
  document: globalThis.document,
  IS_REACT_ACT_ENVIRONMENT: globalThis.IS_REACT_ACT_ENVIRONMENT,
};
Object.assign(globalThis, {
  window: dom.window,
  document: dom.window.document,
  IS_REACT_ACT_ENVIRONMENT: true,
});
const fixture = { metadata: new Map() };
globalThis.__keyFileUIFixture = fixture;
const scope = "c".repeat(64);
const calls = { read: 0, query: 0, prompt: 0, requests: [] };
const key = "synthetic-ui-file-key-not-real";
dom.window.showOpenFilePicker = async () => [];
const handle = {
  name: "codequest-api-key.json",
  async getFile() {
    calls.read++;
    return {
      size: 100,
      text: async () => JSON.stringify({ provider: "deepseek", apiKey: key }),
    };
  },
  async queryPermission() {
    calls.query++;
    return "granted";
  },
  async requestPermission() {
    calls.prompt++;
    return "granted";
  },
};
fixture.metadata.set("api-key-file:" + scope, {
  enabled: true,
  handle,
  provider: "deepseek",
});
let root;
try {
  await mkdir(path.join(temp, "lib"));
  await mkdir(path.join(temp, "components"));
  await symlink(
    path.resolve("node_modules"),
    path.join(temp, "node_modules"),
    "dir",
  );
  await writeFile(
    path.join(temp, "lib/device-db.mjs"),
    `
export async function readDevice(store, key) { return globalThis.__keyFileUIFixture.metadata.get(key); }
export async function writeDevice(store, key, value) { globalThis.__keyFileUIFixture.metadata.set(key, {...value}); }
`,
  );
  for (const file of [
    "lib/api-key-file.ts",
    "components/APIKeyFileSettings.tsx",
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
  const { default: Settings } = await import(
    path.join(temp, "components/APIKeyFileSettings.mjs")
  );
  const ref = React.createRef();
  let props = {
    ref,
    state: {
      draftScope: scope,
      profile: { aiEnabled: true },
      keyConnected: false,
    },
    lesson: "python-01",
    online: true,
    visible: false,
    request: async (action) => {
      calls.requests.push(action);
      return { draftScope: scope, keyConnected: action.action === "key" };
    },
    onSaved: () => {},
  };
  root = createRoot(document.getElementById("mount"));
  const render = async () =>
    act(async () => {
      root.render(React.createElement(Settings, props));
      await new Promise((r) => setTimeout(r, 0));
    });
  const flush = async () =>
    act(async () => {
      await new Promise((r) => setTimeout(r, 0));
    });
  // The controller reads on app opening even when settings are not visible.
  await render();
  await flush();
  assert.equal(document.querySelector("section"), null);
  assert.equal(calls.requests.length, 1);
  assert.equal(calls.read, 1);
  assert.equal(calls.prompt, 0);
  props = { ...props, visible: true };
  await render();
  assert.match(document.body.textContent, /API key file \(optional\)/);
  assert.ok(!document.body.textContent.includes(key));
  assert.equal(calls.requests.length, 1);
  props = { ...props, online: false };
  await render();
  props = { ...props, online: true };
  await render();
  await flush();
  assert.equal(calls.requests.length, 2);
  assert.equal(calls.prompt, 0);
  await act(async () => ref.current.disableAuto());
  assert.equal(fixture.metadata.get("api-key-file:" + scope).enabled, false);
  // A different account starts with permission off and no implicit file access.
  const freshScope = "d".repeat(64);
  delete dom.window.showOpenFilePicker;
  props = { ...props, state: { ...props.state, draftScope: freshScope } };
  await render();
  await flush();
  assert.equal(document.querySelector('input[type="checkbox"]').checked, false);
  assert.equal(calls.requests.length, 2);
  assert.match(document.body.textContent, /including Safari/);
  // A browser advertising the handle API can fall back honestly if it rejects.
  dom.window.showOpenFilePicker = async () => {
    throw new dom.window.DOMException(
      "Unsupported fixture picker",
      "NotSupportedError",
    );
  };
  props = { ...props, state: { ...props.state, draftScope: "e".repeat(64) } };
  await render();
  await flush();
  await act(async () =>
    document.querySelector('input[type="checkbox"]').click(),
  );
  await flush();
  const choose = () =>
    [...document.querySelectorAll("button")].find((button) =>
      button.textContent.includes("Choose JSON file"),
    );
  await act(async () => choose().click());
  await flush();
  assert.match(
    document.body.textContent,
    /Press Choose JSON file again to read a file once/,
  );
  assert.match(document.body.textContent, /including Safari/);
  assert.equal(calls.requests.length, 2);
  console.log(
    "Passed always-mounted file controller, one read on opening/reconnect, hidden settings operation, plaintext-free UI, default-off account isolation, and supported-picker failure fallback.",
  );
} finally {
  if (root) await act(async () => root.unmount());
  dom.window.close();
  Object.assign(globalThis, prior);
  delete globalThis.__keyFileUIFixture;
  await rm(temp, { recursive: true, force: true });
}
