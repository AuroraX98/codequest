import assert from "node:assert/strict";
import { mkdtemp, mkdir, readFile, writeFile, rm, symlink } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";
import ts from "typescript";
import { JSDOM } from "jsdom";
import React, { act } from "react";

const temp = await mkdtemp(path.join(tmpdir(), "codequest-reading-ui-"));
const scope = "a".repeat(64), otherScope = "b".repeat(64);
const priorGlobals = Object.fromEntries(["window", "document", "HTMLElement", "IS_REACT_ACT_ENVIRONMENT", "fetch", "navigator"].map(name => [name, Object.getOwnPropertyDescriptor(globalThis, name)]));
const dom = new JSDOM('<div id="mount"></div>', { url: "https://fixture.example", pretendToBeVisual: true });
let isOnline = true;
Object.assign(globalThis, { window: dom.window, document: dom.window.document, HTMLElement: dom.window.HTMLElement, IS_REACT_ACT_ENVIRONMENT: true });
Object.defineProperty(globalThis, "navigator", { value: { userAgent: "Test browser", get onLine() { return isOnline; } }, configurable: true });
let root;
let calls = [], server = new Map(), revision = 0, override;
const deferred = () => {
  let resolve, reject;
  const promise = new Promise((a, b) => { resolve = a; reject = b; });
  return { promise, resolve, reject };
};
const stamp = () => new Date(Date.UTC(2026, 9, 21, 8, 0, 0, ++revision)).toISOString();
const record = (lessonId = "test-01", sectionKey = "text:0", checked = true) => {
  const at = stamp();
  return { lessonId, sectionKey, checked, markedAt: checked ? at : null, updatedAt: at };
};
const stateKey = (scope, lessonId, sectionKey) => JSON.stringify([scope, lessonId, sectionKey]);
function reset() { calls = []; server = new Map(); override = undefined; isOnline = true; }
async function normalFetch(url, options) {
  const body = options.body ? JSON.parse(options.body) : null;
  const currentScope = body?.accountScope ?? new URL(url, "https://fixture.example").searchParams.get("scope");
  if (!body) {
    const reading = [...server].filter(([key]) => JSON.parse(key)[0] === currentScope).map(([, record]) => record);
    return Response.json({ accountScope: currentScope, reading });
  }
  assert.deepEqual(Object.keys(body).sort(), ["accountScope", "checked", "expectedUpdatedAt", "lessonId", "sectionKey"].sort());
  const key = stateKey(currentScope, body.lessonId, body.sectionKey);
  const prior = server.get(key);
  if ((prior?.updatedAt ?? null) !== body.expectedUpdatedAt) return Response.json({ error: "changed" }, { status: 409 });
  const saved = record(body.lessonId, body.sectionKey, body.checked);
  server.set(key, saved);
  return Response.json({ accountScope: currentScope, record: saved });
}
globalThis.fetch = async (url, options) => {
  assert.ok(url === "/api/reading" || url.startsWith("/api/reading?"));
  assert.equal(options.credentials, "same-origin");
  assert.equal(options.cache, "no-store");
  assert.equal(options.headers.Accept, "application/json");
  assert.ok(!options.headers.Authorization);
  calls.push({ url, options });
  return override ? override(url, options) : normalFetch(url, options);
};
const posts = () => calls.filter(call => call.options.method === "POST");
const gets = () => calls.filter(call => call.options.method === "GET");
try {
  await mkdir(path.join(temp, "lib"));
  await mkdir(path.join(temp, "components"));
  await symlink(path.resolve("node_modules"), path.join(temp, "node_modules"), "dir");
  for (const file of ["lib/lesson-completion.ts", "lib/reading-client.ts", "components/ReadingMark.tsx", "components/LessonCompletion.tsx"]) {
    const compiled = ts.transpileModule(await readFile(file, "utf8"), { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext, jsx: ts.JsxEmit.ReactJSX } }).outputText.replace(/from "(\.\.?\/[^\"]+)"/g, 'from "$1.mjs"');
    await writeFile(path.join(temp, file.replace(/\.tsx?$/, ".mjs")), compiled);
  }
  const { ReadingClient, useReadingProgress, readingRecordKey } = await import(pathToFileURL(path.join(temp, "lib/reading-client.mjs")));
  const { getLessonCompletion, getReadingSectionKeys } = await import(pathToFileURL(path.join(temp, "lib/lesson-completion.mjs")));
  const { default: ReadingMark } = await import(pathToFileURL(path.join(temp, "components/ReadingMark.mjs")));
  const { default: LessonCompletion } = await import(pathToFileURL(path.join(temp, "components/LessonCompletion.mjs")));
  const { createRoot } = await import("react-dom/client");
  const lesson = { id: "test-01", title: "Test lesson", explanation: ["First section", "Second section"], math: { question: "Optional" } };
  const progress = { unitId: lesson.id, quizPassed: 0, mathPassed: 0, completedAt: null };

  // Fixed-denominator percentages. Every required activity is needed for 100%.
  for (let mask = 0; mask < 16; mask++) {
    const marks = [0, 1].map(index => record(lesson.id, `text:${index}`, !!(mask & 1 << index)));
    const result = getLessonCompletion(lesson, { ...progress, quizPassed: +(!!(mask & 4)), completedAt: mask & 8 ? stamp() : null, mathPassed: 1 }, marks);
    assert.ok(result.percent >= 0 && result.percent <= 100);
    assert.equal(result.percent, [0, 1, 2, 3].filter(bit => mask & 1 << bit).length * 25);
    assert.equal(result.isComplete, mask === 15);
    assert.equal(result.total, 4);
  }
  assert.equal(getLessonCompletion(lesson, progress, []).readCompleted, 0);
  assert.equal(getLessonCompletion(lesson, { ...progress, completedAt: stamp() }, []).legacyReadingUnknown, true);
  const python = { ...lesson, id: "python-01", explanation: Array(7).fill("Supplement") };
  assert.equal(getReadingSectionKeys(python).length, 6);
  assert.equal(getLessonCompletion(python, undefined, Array.from({ length: 7 }, (_, i) => record(python.id, `text:${i}`))).readCompleted, 0);

  // All records load once, never creating reading marks from a GET.
  reset();
  let client = new ReadingClient(scope);
  await Promise.all([client.initialize(), client.initialize()]);
  assert.equal(gets().length, 1);
  assert.equal(posts().length, 0);
  assert.equal(client.getSnapshot().loaded, true);
  assert.deepEqual(client.getSnapshot().records, []);
  assert.equal(await client.setChecked(lesson.id, "text:0", true), true);
  const first = client.getSnapshot().records[0];
  assert.equal(first.checked, true);
  assert.equal(JSON.parse(posts()[0].options.body).expectedUpdatedAt, null);
  assert.equal(await client.setChecked(lesson.id, "text:0", false), true);
  assert.equal(JSON.parse(posts()[1].options.body).expectedUpdatedAt, first.updatedAt);
  assert.equal(client.getSnapshot().records[0].markedAt, null);

  // No optimistic success, repeated click deduplication, and concurrent sections.
  reset(); client = new ReadingClient(scope); await client.initialize();
  const firstSave = deferred(), secondSave = deferred();
  override = (_url, options) => JSON.parse(options.body).sectionKey === "text:0" ? firstSave.promise : secondSave.promise;
  const saveOne = client.setChecked(lesson.id, "text:0", true);
  const saveTwo = client.setChecked(lesson.id, "text:1", true);
  assert.equal(await client.setChecked(lesson.id, "text:0", true), false);
  await client.refresh();
  assert.equal(gets().length, 1, "Refresh never races a pending save");
  assert.equal(posts().length, 2);
  assert.equal(client.getSnapshot().records.length, 0);
  secondSave.resolve(Response.json({ accountScope: scope, record: record(lesson.id, "text:1") }));
  await saveTwo;
  firstSave.resolve(Response.json({ accountScope: scope, record: record(lesson.id, "text:0") }));
  await saveOne;
  assert.equal(client.getSnapshot().records.length, 2, "Out-of-order saves preserve both sections");

  // Conflict blocks destructive retries until a fresh account snapshot arrives.
  reset(); client = new ReadingClient(scope); await client.initialize();
  server.set(stateKey(scope, lesson.id, "text:0"), record(lesson.id));
  assert.equal(await client.setChecked(lesson.id, "text:0", true), false);
  const key = readingRecordKey(lesson.id, "text:0");
  assert.match(client.getSnapshot().errors[key], /another tab or device/);
  assert.equal(client.getSnapshot().needsRefresh[key], true);
  assert.equal(await client.setChecked(lesson.id, "text:0", true), false);
  assert.equal(posts().length, 1);
  await client.refresh();
  assert.equal(client.getSnapshot().records[0].checked, true);
  assert.equal(client.getSnapshot().needsRefresh[key], undefined);

  // Lost acknowledgements are uncertain, not reported as saved or blindly retried.
  reset(); client = new ReadingClient(scope); await client.initialize();
  override = async (url, options) => { await normalFetch(url, options); throw new TypeError("Lost response"); };
  assert.equal(await client.setChecked(lesson.id, "text:0", true), false);
  assert.equal(client.getSnapshot().records.length, 0);
  assert.match(client.getSnapshot().errors[key], /whether.*saved/);
  assert.equal(client.getSnapshot().needsRefresh[key], true);
  override = undefined; await client.refresh();
  assert.equal(client.getSnapshot().records[0].checked, true);

  // Offline clicks do not write to the network or any local queue.
  reset(); client = new ReadingClient(scope); await client.initialize();
  isOnline = false;
  assert.equal(await client.setChecked(lesson.id, "text:0", true), false);
  assert.equal(posts().length, 0);
  assert.equal(client.getSnapshot().records.length, 0);
  assert.match(client.getSnapshot().errors[key], /offline.*Nothing has been queued/i);
  assert.equal(client.getSnapshot().needsRefresh[key], false);
  isOnline = true;

  // Foreign, malformed, auth-failed and unconfirmed responses never count as saved.
  for (const response of [
    () => Response.json({ accountScope: otherScope, record: record(lesson.id) }),
    () => Response.json({ accountScope: scope, record: record("different-lesson") }),
    () => Response.json({ accountScope: scope, record: { ...record(lesson.id), markedAt: null } }),
    () => Response.json({ error: "Sign in" }, { status: 401 }),
    () => new Response("sign in", { headers: { "Content-Type": "text/html" } }),
  ]) {
    reset(); client = new ReadingClient(scope); await client.initialize();
    override = response;
    assert.equal(await client.setChecked(lesson.id, "text:0", true), false);
    assert.equal(client.getSnapshot().records.length, 0);
    assert.equal(client.getSnapshot().needsRefresh[key], true);
  }
  reset(); client = new ReadingClient(scope);
  override = () => Response.json({ accountScope: otherScope, reading: [record(lesson.id)] });
  await client.initialize();
  assert.equal(client.getSnapshot().loaded, false);
  assert.equal(client.getSnapshot().records.length, 0);

  // Cancel invalidates both stale responses and stale event handlers.
  reset(); client = new ReadingClient(scope); await client.initialize();
  const cancelled = deferred(); override = () => cancelled.promise;
  const lateSave = client.setChecked(lesson.id, "text:0", true);
  client.cancel();
  cancelled.resolve(Response.json({ accountScope: scope, record: record(lesson.id) }));
  assert.equal(await lateSave, false);
  assert.equal(client.getSnapshot().records.length, 0);
  assert.equal(await client.setChecked(lesson.id, "text:1", true), false);
  assert.equal(posts().length, 1);

  // Render 115 score badges with a single shared loader. UI changes never save.
  reset();
  root = createRoot(document.getElementById("mount"));
  let observed;
  function Harness({ account = scope, section = "text:0", complete = false, many = false }) {
    const reading = useReadingProgress(account);
    observed = reading;
    return React.createElement("main", null,
      React.createElement(LessonCompletion, { lesson, progress: complete ? { ...progress, quizPassed: 1, completedAt: stamp() } : progress, reading }),
      React.createElement(ReadingMark, { reading, lessonId: lesson.id, sectionKey: section, sectionTitle: section === "text:0" ? "First section" : "Second section" }),
      ...(many ? Array.from({ length: 115 }, (_, i) => React.createElement("button", { key: i, type: "button" }, React.createElement(LessonCompletion, { lesson: { ...lesson, id: `test-${i}` }, progress, reading, compact: true }))) : []),
    );
  }
  const render = async props => { await act(async () => { root.render(React.createElement(Harness, props)); }); };
  const click = async node => { assert.ok(node); await act(async () => { node.click(); }); };
  const checkbox = () => document.querySelector('[role="checkbox"]');
  await render({ many: true });
  assert.equal(gets().length, 1);
  assert.equal(posts().length, 0);
  assert.equal(document.querySelectorAll(".lesson-completion-compact").length, 115);
  assert.equal(checkbox().getAttribute("aria-checked"), "false");
  assert.match(checkbox().getAttribute("aria-label"), /First section/);
  assert.ok(document.getElementById(checkbox().getAttribute("aria-describedby")));
  await click(document.querySelector("summary"));
  await render({ section: "text:1", many: true });
  assert.equal(posts().length, 0, "Expanding details and changing section are not reading actions");
  assert.equal(gets().length, 1);

  // Pending marks are announced; navigating does not move that mark to another section.
  await render({ section: "text:0" });
  const pendingUI = deferred(); override = () => pendingUI.promise;
  await click(checkbox());
  assert.equal(posts().length, 1);
  assert.equal(checkbox().disabled, true);
  assert.equal(checkbox().getAttribute("aria-busy"), "true");
  assert.equal(checkbox().getAttribute("aria-checked"), "false");
  assert.match(document.querySelector('[role="status"]').textContent, /Saving/);
  await render({ section: "text:1" });
  assert.equal(checkbox().disabled, false);
  assert.equal(checkbox().getAttribute("aria-checked"), "false");
  await act(async () => { pendingUI.resolve(Response.json({ accountScope: scope, record: record(lesson.id, "text:0") })); });
  assert.equal(checkbox().getAttribute("aria-checked"), "false");
  await render({ section: "text:0" });
  assert.equal(checkbox().getAttribute("aria-checked"), "true");
  assert.match(document.querySelector('[role="status"]').textContent, /Last confirmed/);
  assert.equal(document.querySelector('[role="progressbar"]').getAttribute("aria-valuenow"), "25");

  // A new account synchronously discards the previous account's visible score.
  const oldScopePending = deferred(); override = (_url, options) => options.method === "POST" ? oldScopePending.promise : normalFetch(_url, options);
  await click(checkbox());
  const accountLoad = deferred(); override = () => accountLoad.promise;
  await render({ account: otherScope });
  assert.equal(checkbox().getAttribute("aria-checked"), "false");
  assert.equal(checkbox().disabled, true);
  assert.equal(document.querySelector('[role="progressbar"]').hasAttribute("aria-valuenow"), false, "Unknown reading is never presented as a factual zero score");
  await act(async () => { oldScopePending.resolve(Response.json({ accountScope: scope, record: record(lesson.id, "text:0", false) })); });
  assert.equal(observed.records.length, 0);
  await act(async () => { accountLoad.resolve(Response.json({ accountScope: otherScope, reading: [] })); });
  assert.equal(document.querySelector('[role="progressbar"]').getAttribute("aria-valuenow"), "0");

  // Existing completion is retained without pretending the reading was recorded.
  override = undefined;
  await render({ account: otherScope, complete: true });
  assert.equal(document.querySelector('[role="progressbar"]').getAttribute("aria-valuenow"), "50");
  assert.match(document.querySelector(".completion-legacy").textContent, /earlier project completion is kept/);
  assert.match(document.querySelector(".completion-math").textContent, /Separate from this score/);

  // Accessible conflict and refresh flow does not pretend the write succeeded.
  override = () => Response.json({ error: "changed" }, { status: 409 });
  await click(checkbox());
  assert.equal(checkbox().getAttribute("aria-checked"), "false");
  assert.equal(checkbox().disabled, true);
  assert.match(document.querySelector('[role="alert"]').textContent, /another tab or device/);
  assert.match(document.querySelector(".completion-caption").textContent, /Last confirmed/);
  override = undefined;
  await click(document.querySelector(".reading-reload"));
  assert.equal(checkbox().disabled, false);

  // Offline event keeps prior values visible but prevents an account save.
  isOnline = false;
  await act(async () => { window.dispatchEvent(new window.Event("offline")); });
  assert.equal(checkbox().disabled, true);
  assert.match(document.querySelector('[role="status"]').textContent, /not saved or queued/);
  assert.match(document.querySelector(".completion-caption").textContent, /Last confirmed/);

  await act(async () => root.unmount()); root = undefined;
  console.log("Reading completion UI/client passed: percentages, one account fetch, explicit saves, revisions/conflicts, uncertain outcomes, offline, scope/section races, no auto-write, and accessible controls.");
} finally {
  if (root) await act(async () => root.unmount());
  dom.window.close();
  for (const [name, descriptor] of Object.entries(priorGlobals)) {
    if (descriptor) Object.defineProperty(globalThis, name, descriptor);
    else delete globalThis[name];
  }
  await rm(temp, { recursive: true, force: true });
}
