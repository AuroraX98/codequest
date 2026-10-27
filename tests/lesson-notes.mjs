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
import { pathToFileURL } from "node:url";
import ts from "typescript";
import { JSDOM } from "jsdom";
import React, { act } from "react";

const temp = await mkdtemp(path.join(tmpdir(), "codequest-lesson-notes-"));
const dom = new JSDOM('<div id="mount"></div>', {
  url: "https://fixture.example",
  pretendToBeVisual: true,
});
const previous = {
  window: globalThis.window,
  document: globalThis.document,
  HTMLElement: globalThis.HTMLElement,
  IS_REACT_ACT_ENVIRONMENT: globalThis.IS_REACT_ACT_ENVIRONMENT,
  fetch: globalThis.fetch,
};
Object.assign(globalThis, {
  window: dom.window,
  document: dom.window.document,
  HTMLElement: dom.window.HTMLElement,
  IS_REACT_ACT_ENVIRONMENT: true,
});
let root;
let networkRequests = 0;
const serverNotes = new Map();
let serverVersion = 0;
const networkCalls = [];
const scope = "a".repeat(64),
  otherScope = "b".repeat(64);
const source = {
  lessonId: "python-01",
  lessonTitle: "Names & values",
  sectionIndex: 0,
  sectionKey: "text:0",
  sectionTitle: "Giving values a name",
  sectionText: 'Use a name.\nif ready:\n    print("hello")\n',
};
const exactQuote = '  if ready:\n    print("hello")\n';
const fixture = {
  override: null,
  calls: [],
  apiFailure: null,
  commitThenThrow: false,
};
globalThis.fetch = async (url, options) => {
  networkRequests++;
  networkCalls.push({ url, options });
  assert.ok(
    url === "/api/notes" || url.startsWith("/api/notes?"),
    "Only the private notes endpoint may be used",
  );
  assert.equal(options.credentials, "same-origin");
  assert.equal(options.cache, "no-store");
  assert.ok(!options.headers.Authorization);
  if (fixture.apiFailure) return fixture.apiFailure(url, options);
  const input = options.body ? JSON.parse(options.body) : null;
  const params = new URL(url, "https://fixture.example").searchParams;
  const scope = input?.deviceScope ?? params.get("scope");
  const lessonId = input?.lessonId ?? params.get("lesson");
  const key = JSON.stringify([scope, lessonId]);
  const notes = serverNotes.get(key) ?? [];
  const response = (notes, status = 200, extra = {}) =>
    Response.json({ draftScope: scope, notes, ...extra }, { status });
  if (!input) return response(notes);
  assert.equal(options.headers["Content-Type"], "application/json");
  const current = notes.find(
    (note) => note.id === (input.note?.id ?? input.id),
  );
  if (input.action === "delete") {
    if (!current || current.updatedAt !== input.expectedUpdatedAt)
      return response(notes, 409, {
        error: "This note changed. Reload your notes before trying again.",
      });
    const next = notes.filter((note) => note.id !== input.id);
    serverNotes.set(key, next);
    return response(next);
  }
  if (input.expectedUpdatedAt === null && current) {
    if (
      current.body === input.note.body &&
      current.quote === input.note.quote &&
      JSON.stringify(current.anchor) === JSON.stringify(input.note.anchor)
    )
      return response(notes);
    return response(notes, 409, {
      error: "This note changed. Reload your notes before trying again.",
    });
  }
  if (
    input.expectedUpdatedAt !== null &&
    (!current || current.updatedAt !== input.expectedUpdatedAt)
  )
    return response(notes, 409, {
      error: "This note changed. Reload your notes before trying again.",
    });
  const now = new Date(
    Date.UTC(2026, 9, 21, 12, 0, 0, ++serverVersion),
  ).toISOString();
  const saved = {
    ...input.note,
    createdAt: current?.createdAt ?? now,
    updatedAt: now,
  };
  const next = current
    ? notes.map((note) => (note.id === current.id ? saved : note))
    : [...notes, saved];
  serverNotes.set(key, next);
  if (fixture.commitThenThrow) {
    fixture.commitThenThrow = false;
    throw new Error("Response lost after commit");
  }
  return response(next);
};
globalThis.__lessonNotesFixture = fixture;
try {
  await mkdir(path.join(temp, "lib"));
  await mkdir(path.join(temp, "components"));
  await symlink(
    path.resolve("node_modules"),
    path.join(temp, "node_modules"),
    "dir",
  );
  for (const file of ["lib/lesson-notes.ts", "components/LessonNotes.tsx"]) {
    const compiled = ts
      .transpileModule(await readFile(file, "utf8"), {
        compilerOptions: {
          target: ts.ScriptTarget.ES2022,
          module: ts.ModuleKind.ESNext,
          jsx: ts.JsxEmit.ReactJSX,
        },
      })
      .outputText.replace(/from "(\.\.?\/[^\"]+)"/g, 'from "$1.mjs"');
    const output =
      file === "lib/lesson-notes.ts"
        ? "lib/lesson-notes-real.mjs"
        : "components/LessonNotes.mjs";
    await writeFile(path.join(temp, output), compiled);
  }
  const storage = await import(
    pathToFileURL(path.join(temp, "lib/lesson-notes-real.mjs")).href
  );
  fixture.real = storage;
  await writeFile(
    path.join(temp, "lib/lesson-notes.mjs"),
    `
    export * from './lesson-notes-real.mjs';
    const call = (name, args) => {
      const fixture = globalThis.__lessonNotesFixture;
      fixture.calls.push({name, args});
      if (fixture.override) {
        const result = fixture.override(name, args);
        if (result !== undefined) return result;
      }
      return fixture.real[name](...args);
    };
    export const loadLessonNotes = (...args) => call('loadLessonNotes', args);
    export const addLessonNote = (...args) => call('addLessonNote', args);
    export const updateLessonNote = (...args) => call('updateLessonNote', args);
    export const deleteLessonNote = (...args) => call('deleteLessonNote', args);
  `,
  );

  // Exact quote, immutable source, account/lesson separation and server acknowledgement.
  assert.deepEqual(await storage.loadLessonNotes(scope, source.lessonId), []);
  let notes = await storage.addLessonNote(
    scope,
    source,
    "My own understanding.",
    exactQuote,
  );
  assert.equal(notes[0].quote, exactQuote);
  assert.equal(
    notes[0].anchor.sectionFingerprint,
    await storage.lessonSectionFingerprint(source.sectionText),
  );
  const first = structuredClone(notes[0]);
  notes = await storage.updateLessonNote(
    scope,
    source.lessonId,
    first,
    "Edited reflection",
    first.updatedAt,
  );
  assert.equal(notes[0].quote, exactQuote);
  assert.deepEqual(notes[0].anchor, first.anchor);
  assert.equal(notes[0].createdAt, first.createdAt);
  assert.deepEqual(
    await storage.loadLessonNotes(otherScope, source.lessonId),
    [],
  );
  assert.deepEqual(await storage.loadLessonNotes(scope, "python-02"), []);
  await assert.rejects(
    storage.updateLessonNote(
      otherScope,
      source.lessonId,
      first,
      "Cannot edit someone else's note",
      first.updatedAt,
    ),
    /changed/,
  );
  await assert.rejects(
    storage.deleteLessonNote(
      otherScope,
      source.lessonId,
      first.id,
      first.updatedAt,
    ),
    /changed/,
  );
  assert.equal(
    (await storage.loadLessonNotes(scope, source.lessonId)).length,
    1,
  );
  await Promise.all([
    storage.addLessonNote(scope, source, "Concurrent one"),
    storage.addLessonNote(
      scope,
      {
        ...source,
        sectionIndex: 1,
        sectionKey: "text:1",
        sectionTitle: "Another section",
      },
      "Concurrent two",
    ),
  ]);
  notes = await storage.loadLessonNotes(scope, source.lessonId);
  assert.equal(notes.length, 3);
  assert.equal(new Set(notes.map((note) => note.id)).size, 3);
  assert.ok(
    notes.some((note) => note.anchor.sectionTitle === "Another section"),
  );
  await assert.rejects(
    storage.addLessonNote(
      scope,
      source,
      "",
      "x".repeat(storage.maxLessonQuoteLength + 1),
    ),
    /shorter passage/,
  );
  await assert.rejects(
    storage.addLessonNote(
      scope,
      source,
      "x".repeat(storage.maxLessonNoteLength + 1),
    ),
    /within/,
  );
  await assert.rejects(
    storage.addLessonNote("", source, "No identity"),
    /Sign in/,
  );
  await assert.rejects(
    storage.addLessonNote(scope, source, "   "),
    /Write a reflection/,
  );
  assert.equal(
    (await storage.loadLessonNotes(scope, source.lessonId)).length,
    3,
  );

  // Failures don't synthesize saved data; wrong-account responses are rejected.
  fixture.apiFailure = async () => {
    throw new Error("Offline");
  };
  await assert.rejects(
    storage.addLessonNote(scope, source, "Must not be persisted"),
    /Could not confirm/,
  );
  fixture.apiFailure = null;
  assert.equal(
    (await storage.loadLessonNotes(scope, source.lessonId)).length,
    3,
  );
  fixture.apiFailure = async () =>
    Response.json({ draftScope: otherScope, notes: [first] });
  await assert.rejects(
    storage.loadLessonNotes(scope, source.lessonId),
    /account changed/,
  );
  fixture.apiFailure = async () =>
    Response.json({
      draftScope: scope,
      notes: [{ ...first, anchor: { ...first.anchor, lessonId: "wrong" } }],
    });
  await assert.rejects(
    storage.loadLessonNotes(scope, source.lessonId),
    /invalid source/,
  );
  fixture.apiFailure = null;
  await assert.rejects(
    storage.updateLessonNote(
      scope,
      source.lessonId,
      first,
      "Stale edit",
      first.updatedAt,
    ),
    /changed/,
  );
  // A committed create whose response was lost retries using the same stable draft ID.
  const retryId = crypto.randomUUID();
  fixture.commitThenThrow = true;
  await assert.rejects(
    storage.addLessonNote(
      scope,
      { ...source, lessonId: "retry-test" },
      "Retry me",
      exactQuote,
      retryId,
    ),
    /Could not confirm/,
  );
  const retried = await storage.addLessonNote(
    scope,
    { ...source, lessonId: "retry-test" },
    "Retry me",
    exactQuote,
    retryId,
  );
  assert.equal(retried.length, 1);
  assert.equal(retried[0].id, retryId);

  // Portable export excludes account identifiers, safely contains arbitrary Markdown/HTML,
  // preserves passage whitespace, and never imports an unrelated lesson.
  const special = {
    ...first,
    quote: "```\n[[vault-link]] <script>alert(1)</script>\n```\n",
    body: "````\n# my words\n",
  };
  const exported = storage.exportLessonNotesMarkdown(
    source.lessonId,
    "A [title]\n<script>",
    [special, { ...first, anchor: { ...first.anchor, lessonId: "another" } }],
  );
  assert.ok(exported.includes(special.quote));
  assert.ok(exported.includes(special.body));
  assert.match(exported, /`````text/);
  assert.ok(exported.includes("\\[title\\] \\<script\\>"));
  assert.ok(!exported.includes(scope));
  assert.ok(!exported.includes("draftScope"));
  assert.equal((exported.match(/## 1\./g) ?? []).length, 1);
  assert.equal(
    storage.lessonNotesFilename("../../example"),
    "codequest-------example-notes.md",
  );

  // UI integration uses the actual API client against the private endpoint fixture.
  const { createRoot } = await import("react-dom/client");
  const { default: LessonNotes } = await import(
    pathToFileURL(path.join(temp, "components/LessonNotes.mjs")).href
  );
  root = createRoot(document.getElementById("mount"));
  let props = { scope, ...source };
  const render = async () =>
    act(async () => {
      root.render(React.createElement(LessonNotes, props));
    });
  const flush = async () =>
    act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 15));
    });
  const click = async (selector) =>
    act(async () => {
      const button = document.querySelector(selector);
      assert.ok(button, selector);
      button.click();
    });
  const text = () => document.body.textContent;
  const fill = async (selector, value) =>
    act(async () => {
      const input = document.querySelector(selector);
      Object.getOwnPropertyDescriptor(
        dom.window.HTMLTextAreaElement.prototype,
        "value",
      ).set.call(input, value);
      input.dispatchEvent(new dom.window.Event("input", { bubbles: true }));
    });
  const settled = async () => {
    await flush();
    await flush();
  };
  await render();
  await settled();
  assert.match(text(), /private to your CodeQuest account, not sent to AI/);
  assert.match(text(), /Another section/);
  assert.equal(document.querySelector("details").open, false);
  assert.deepEqual(
    fixture.calls.map((call) => call.name),
    ["loadLessonNotes"],
    "Opening the component must not write",
  );
  props = { ...props, selectedQuote: { text: exactQuote, requestId: 1 } };
  await render();
  await flush();
  assert.equal(document.querySelector("details").open, true);
  assert.equal(
    document.querySelector("[data-note-draft-quote]").textContent,
    exactQuote,
  );
  assert.equal(document.activeElement, document.querySelector("textarea"));
  assert.equal(
    fixture.calls.filter((call) => call.name === "addLessonNote").length,
    0,
  );
  await fill("textarea", "UI reflection kept on failure");
  fixture.override = (name) =>
    name === "addLessonNote"
      ? Promise.reject(
          new Error("Could not confirm this save. Your draft is still here."),
        )
      : undefined;
  await click("[data-note-save]");
  await settled();
  assert.match(text(), /Could not confirm/);
  assert.equal(
    document.querySelector("textarea").value,
    "UI reflection kept on failure",
  );
  assert.equal(
    document.querySelector("[data-note-draft-quote]").textContent,
    exactQuote,
  );
  assert.equal(document.querySelectorAll("[data-note-id]").length, 3);
  fixture.override = null;
  await click("[data-note-save]");
  await settled();
  assert.equal(document.querySelector("textarea").value, "");
  assert.equal(document.querySelectorAll("[data-note-id]").length, 4);
  assert.match(text(), /Note saved to your account/);
  const saved = (await storage.loadLessonNotes(scope, source.lessonId)).at(-1);
  assert.equal(saved.body, "UI reflection kept on failure");
  assert.equal(saved.quote, exactQuote);
  const uiCreateCalls = fixture.calls.filter(
    (call) => call.name === "addLessonNote",
  );
  assert.equal(
    uiCreateCalls[0].args[4],
    uiCreateCalls[1].args[4],
    "Retry must retain the draft identity",
  );

  // Editing keeps the exact stored quote and anchor, with explicit Save changes.
  await click(`[data-note-id="${saved.id}"] [data-note-edit]`);
  await fill(`[data-note-id="${saved.id}"] textarea`, "Edited in UI");
  assert.equal(
    (await storage.loadLessonNotes(scope, source.lessonId)).at(-1).body,
    saved.body,
  );
  await click("[data-note-save-edit]");
  await settled();
  const edited = (await storage.loadLessonNotes(scope, source.lessonId)).at(-1);
  assert.equal(edited.body, "Edited in UI");
  assert.equal(edited.quote, exactQuote);
  assert.deepEqual(edited.anchor, saved.anchor);

  // The first Delete only asks, Keep note cancels, and only confirmation writes.
  await click(`[data-note-id="${saved.id}"] [data-note-delete]`);
  assert.equal(
    (await storage.loadLessonNotes(scope, source.lessonId)).length,
    4,
  );
  assert.equal(
    fixture.calls.filter((call) => call.name === "deleteLessonNote").length,
    0,
  );
  await click("[data-note-cancel-delete]");
  assert.equal(document.querySelector("[data-note-confirm-delete]"), null);
  await click(`[data-note-id="${saved.id}"] [data-note-delete]`);
  await click("[data-note-confirm-delete]");
  await settled();
  assert.equal(
    (await storage.loadLessonNotes(scope, source.lessonId)).length,
    3,
  );

  // Download is a local .md file, not an Obsidian connection or network request.
  const priorCreate = URL.createObjectURL,
    priorRevoke = URL.revokeObjectURL;
  let download, exportedBlob;
  URL.createObjectURL = (blob) => {
    exportedBlob = blob;
    return "blob:test-notes";
  };
  URL.revokeObjectURL = () => {};
  dom.window.HTMLAnchorElement.prototype.click = function () {
    download = this.download;
  };
  await click("[data-notes-export]");
  assert.equal(download, "codequest-python-01-notes.md");
  assert.ok((await exportedBlob.text()).includes(exactQuote));
  assert.ok(!(await exportedBlob.text()).includes(scope));
  URL.createObjectURL = priorCreate;
  URL.revokeObjectURL = priorRevoke;

  // Late reads cannot reveal a previous account's notes, even for the same lesson.
  let releaseRead;
  fixture.override = (name, args) =>
    name === "loadLessonNotes" && args[0] === "c".repeat(64)
      ? new Promise((resolve) => {
          releaseRead = resolve;
        })
      : undefined;
  props = { ...source, scope: "c".repeat(64) };
  await render();
  assert.match(text(), /Loading/);
  props = { ...source, scope: otherScope };
  await render();
  await settled();
  await act(async () => releaseRead([first]));
  await flush();
  assert.equal(document.querySelectorAll("[data-note-id]").length, 0);
  assert.ok(!text().includes("My own understanding."));

  // A late save remains bound to the initiating account and never overwrites the new UI.
  let releaseSave;
  fixture.override = (name, args) =>
    name === "addLessonNote"
      ? new Promise((resolve, reject) => {
          releaseSave = () =>
            storage.addLessonNote(...args).then(resolve, reject);
        })
      : undefined;
  props = {
    ...source,
    scope,
    selectedQuote: { text: exactQuote, requestId: 2 },
  };
  await render();
  await settled();
  await fill("textarea", "A late account-scoped save");
  await click("[data-note-save]");
  assert.equal(document.querySelector("[data-note-save]").disabled, true);
  props = { ...source, scope: otherScope };
  await render();
  await settled();
  await act(async () => {
    await releaseSave();
  });
  await settled();
  assert.equal(document.querySelectorAll("[data-note-id]").length, 0);
  assert.equal(document.querySelector("textarea").value, "");
  assert.equal(
    (await storage.loadLessonNotes(otherScope, source.lessonId)).length,
    0,
  );
  assert.equal(
    (await storage.loadLessonNotes(scope, source.lessonId)).at(-1).body,
    "A late account-scoped save",
  );

  // Section changes preserve drafts and anchors; another lesson resets them.
  fixture.override = null;
  props = {
    ...source,
    scope: otherScope,
    selectedQuote: { text: "first", requestId: 3 },
  };
  await render();
  await settled();
  await fill("textarea", "Keep my idea");
  props = { ...props, selectedQuote: { text: "second", requestId: 4 } };
  await render();
  await flush();
  assert.equal(
    document.querySelector("[data-note-draft-quote]").textContent,
    "first",
  );
  assert.equal(document.querySelector("textarea").value, "Keep my idea");
  assert.match(text(), /Use new passage/);
  props = {
    ...source,
    scope: otherScope,
    sectionIndex: 2,
    sectionKey: "text:2",
    sectionTitle: "Third section",
  };
  await render();
  await settled();
  assert.equal(document.querySelector("textarea").value, "Keep my idea");
  assert.equal(
    document.querySelector("[data-note-draft-quote]").textContent,
    "first",
  );
  assert.match(text(), /For Giving values a name/);
  props = { ...source, scope: otherScope, lessonId: "python-03" };
  await render();
  await settled();
  assert.equal(document.querySelectorAll("[data-note-id]").length, 0);

  // Oversize quotes stay exact and unsaved instead of being silently truncated.
  const hugeQuote = "q".repeat(storage.maxLessonQuoteLength + 1);
  props = { ...props, selectedQuote: { text: hugeQuote, requestId: 5 } };
  await render();
  await flush();
  assert.equal(
    document.querySelector("[data-note-draft-quote]").textContent,
    hugeQuote,
  );
  assert.equal(document.querySelector("[data-note-save]").disabled, true);
  assert.match(text(), /Nothing has been truncated/);
  // A blank reflection follows the current source; highlighted concept notes override it.
  props = {
    ...source,
    scope: otherScope,
    lessonId: "source-test",
    sectionIndex: 1,
    sectionKey: "text:1",
    sectionTitle: "Current section",
  };
  await render();
  await settled();
  await fill("textarea", "Reflection without a quote");
  await click("[data-note-save]");
  await settled();
  const reflectionOnly = (
    await storage.loadLessonNotes(otherScope, "source-test")
  )[0];
  assert.equal(reflectionOnly.quote, "");
  assert.equal(reflectionOnly.anchor.sectionKey, "text:1");
  const conceptSource = {
    ...source,
    lessonId: "source-test",
    sectionIndex: 0,
    sectionKey: "concept:program",
    sectionTitle: "What is a program?",
    sectionText: "A sequence of instructions.\n\nWhy.\n\nImagine.\n\nLimit.",
  };
  props = {
    ...props,
    selectedQuote: {
      text: "A sequence of instructions.",
      requestId: 6,
      source: conceptSource,
    },
  };
  await render();
  await flush();
  assert.match(text(), /For What is a program\?/);
  await fill("textarea", "My concept-room idea");
  await click("[data-note-save]");
  await settled();
  const conceptNote = (
    await storage.loadLessonNotes(otherScope, "source-test")
  ).at(-1);
  assert.equal(conceptNote.anchor.sectionKey, "concept:program");
  assert.equal(
    conceptNote.anchor.sectionFingerprint,
    await storage.lessonSectionFingerprint(conceptSource.sectionText),
  );
  assert.ok(
    storage
      .exportLessonNotesMarkdown("source-test", source.lessonTitle, [
        conceptNote,
      ])
      .includes("concept:program"),
  );

  // Explicit refresh reveals a conflict without erasing the user's edit.
  await click(`[data-note-id="${conceptNote.id}"] [data-note-edit]`);
  await fill(`[data-note-id="${conceptNote.id}"] textarea`, "My unsaved edit");
  await storage.updateLessonNote(
    otherScope,
    "source-test",
    conceptNote,
    "Written on another device",
    conceptNote.updatedAt,
  );
  await click("[data-note-save-edit]");
  await settled();
  assert.match(text(), /changed/);
  assert.equal(
    document.querySelector(`[data-note-id="${conceptNote.id}"] textarea`).value,
    "My unsaved edit",
  );
  await click("[data-notes-refresh]");
  await settled();
  assert.match(text(), /Written on another device/);
  assert.equal(document.querySelector("[data-note-save-edit]").disabled, true);
  await act(async () =>
    [...document.querySelectorAll("button")]
      .find(
        (button) => button.textContent === "Keep my draft over this version",
      )
      .click(),
  );
  await click("[data-note-save-edit]");
  await settled();
  const resolved = (
    await storage.loadLessonNotes(otherScope, "source-test")
  ).at(-1);
  assert.equal(resolved.body, "My unsaved edit");
  assert.equal(resolved.quote, conceptNote.quote);
  // A deleted note's in-progress reflection stays accessible outside the saved list.
  await click(`[data-note-id="${resolved.id}"] [data-note-edit]`);
  await fill(
    `[data-note-id="${resolved.id}"] textarea`,
    "Do not lose this reflection",
  );
  await storage.deleteLessonNote(
    otherScope,
    "source-test",
    resolved.id,
    resolved.updatedAt,
  );
  await click("[data-notes-refresh]");
  await settled();
  assert.equal(
    document.querySelector("[data-note-orphan-edit] textarea").value,
    "Do not lose this reflection",
  );

  // Explicit offline state sends nothing and keeps an unsaved draft in the UI.
  const navigatorDescriptor = Object.getOwnPropertyDescriptor(
    globalThis,
    "navigator",
  );
  Object.defineProperty(globalThis, "navigator", {
    configurable: true,
    value: { onLine: false },
  });
  const beforeOffline = networkRequests;
  await assert.rejects(
    storage.loadLessonNotes(otherScope, "source-test"),
    /offline/,
  );
  assert.equal(networkRequests, beforeOffline);
  if (navigatorDescriptor)
    Object.defineProperty(globalThis, "navigator", navigatorDescriptor);
  else delete globalThis.navigator;

  assert.ok(networkRequests > 0);
  assert.ok(networkCalls.every(({ url }) => url.startsWith("/api/notes")));
  for (const file of ["lib/lesson-notes.ts", "components/LessonNotes.tsx"]) {
    const sourceText = await readFile(file, "utf8");
    assert.ok(
      !/XMLHttpRequest|localStorage|indexedDB|api-key|encryptedKey|device-db/.test(
        sourceText,
      ),
    );
  }
  console.log(
    "Passed authenticated notes client boundaries, exact quotes/immutable anchors, server-only acknowledgement, safe retries and stale-edit conflicts, explicit save/edit/delete, account/lesson races, draft preservation across sections, selection focus, local Markdown export, and zero AI/credential access.",
  );
} finally {
  if (root) await act(async () => root.unmount());
  dom.window.close();
  Object.assign(globalThis, previous);
  delete globalThis.__lessonNotesFixture;
  await rm(temp, { recursive: true, force: true });
}
