import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import { createRequire } from "node:module";
import { DatabaseSync } from "node:sqlite";
import vm from "node:vm";
import ts from "typescript";

const require = createRequire(import.meta.url);
const load = async (file, imports = {}) => {
  const fixtureModule = { exports: {} };
  const compiled = ts.transpileModule(await readFile(file, "utf8"), {
    compilerOptions: {
      target: ts.ScriptTarget.ES2022,
      module: ts.ModuleKind.CommonJS,
      esModuleInterop: true,
    },
  }).outputText;
  vm.runInNewContext(
    compiled,
    {
      module: fixtureModule,
      exports: fixtureModule.exports,
      require: (id) => (id in imports ? imports[id] : require(id)),
      crypto,
      Request,
      Response,
      Headers,
      URL,
      TextEncoder,
      TextDecoder,
      Uint8Array,
      Date,
      console: { error() {} },
      fetch() {
        throw new Error("No provider or network calls are permitted in notes.");
      },
    },
    { filename: file },
  );
  return fixtureModule.exports;
};
const database = new DatabaseSync(":memory:");
let statements = 0;
const d1 = {
  prepare(sql) {
    statements++;
    assert.match(
      sql,
      /^(SELECT|INSERT|UPDATE)\b/,
      "No runtime table creation, pruning, or unrelated writes.",
    );
    assert.match(
      sql,
      /lesson_notes/,
      "Notes must never touch progress, credentials, or AI usage.",
    );
    let params = [];
    return {
      bind(...values) {
        params = values;
        return this;
      },
      async first() {
        return database.prepare(sql).get(...params) ?? null;
      },
      async all() {
        return { results: database.prepare(sql).all(...params) };
      },
    };
  },
};
try {
  // Apply real generated migrations, not a hand-written test schema. Existing rows survive.
  const journal = JSON.parse(
    await readFile("drizzle/meta/_journal.json", "utf8"),
  );
  const migrations = (await readdir("drizzle"))
    .filter((file) => file.endsWith(".sql"))
    .sort();
  assert.equal(journal.entries[0].tag, "0000_large_puppet_master");
  assert.equal(journal.entries[0].when, 1791000016964);
  assert.equal(journal.entries.length, migrations.length);
  database.exec(await readFile("drizzle/0000_large_puppet_master.sql", "utf8"));
  database
    .prepare("INSERT INTO profiles(user_id,settings,created_at) VALUES(?,?,?)")
    .run("preexisting-owner", '{"track":"python"}', "2026-01-01T00:00:00.000Z");
  for (const migration of migrations.slice(1)) {
    const sql = await readFile("drizzle/" + migration, "utf8");
    assert.doesNotMatch(
      sql,
      /\b(DROP|DELETE|ALTER)\b/i,
      "Notes migration is additive.",
    );
    database.exec(sql);
  }
  assert.equal(
    database
      .prepare("SELECT settings FROM profiles WHERE user_id=?")
      .get("preexisting-owner").settings,
    '{"track":"python"}',
  );
  const lessons = JSON.parse(await readFile("content/lessons.json", "utf8"));
  const headings = await load("lib/lesson-headings.ts");
  const concepts = await load("lib/python-concepts.ts");
  const userA = "authenticated-owner-A",
    userB = "authenticated-owner-B";
  let user = userA;
  // Test the actual production authentication, origin, and scope helpers.
  const server = await load("lib/server.ts", {
    "cloudflare:workers": { env: { DB: d1 } },
    "../app/chatgpt-auth": {
      getChatGPTUser: async () => (user ? { userId: user } : null),
    },
    "./ai-keys": {},
    "./profile": { defaultProfile: {}, normalizeProfile: (value) => value },
  });
  const route = await load("app/api/notes/route.ts", {
    "../../../content/lessons.json": lessons,
    "../../../lib/lesson-headings": headings,
    "../../../lib/python-concepts": concepts,
    "../../../lib/server": server,
  });
  const scopeA = await server.accountScope(userA),
    scopeB = await server.accountScope(userB);
  assert.notEqual(scopeA, scopeB);
  const lesson = lessons.find((item) => item.id === "python-01");
  const otherLesson = lessons.find((item) => item.id === "javascript-01");
  const fingerprint = async (text) => {
    const digest = await crypto.subtle.digest(
      "SHA-256",
      new TextEncoder().encode(text),
    );
    return Array.from(new Uint8Array(digest), (byte) =>
      byte.toString(16).padStart(2, "0"),
    ).join("");
  };
  const makeNote = async (source = lesson, index = 0) => ({
    id: crypto.randomUUID(),
    anchor: {
      lessonId: source.id,
      lessonTitle: source.title,
      sectionKey: `text:${index}`,
      sectionIndex: index,
      sectionTitle: headings.getLessonHeadings(source.id)[index],
      sectionFingerprint: await fingerprint(source.explanation[index]),
    },
    quote:
      '  A selected passage:\nprint("Pepper")\r\n```text\n🚀 café e\u0301\t  ',
    body: " My reflection.\nKeep spacing and `code` exactly.  ",
    createdAt: "2000-01-01T00:00:00.000Z",
    updatedAt: "2000-01-01T00:00:00.000Z",
  });
  const post = (input, options = {}) =>
    route.POST(
      new Request("https://notes.example/api/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(options.headers ?? {}),
        },
        body: options.raw ?? JSON.stringify(input),
      }),
    );
  const saveInput = (note, expectedUpdatedAt = null, deviceScope = scopeA) => ({
    action: "save",
    deviceScope,
    lessonId: note.anchor.lessonId,
    note,
    expectedUpdatedAt,
  });
  const get = (lessonId = lesson.id, scope = scopeA, options = {}) =>
    route.GET(
      new Request(
        `https://notes.example/api/notes?lesson=${encodeURIComponent(lessonId)}&scope=${encodeURIComponent(scope)}`,
        options,
      ),
    );
  const checked = async (promise, status = 200) => {
    const response = await promise;
    assert.equal(response.status, status, await response.clone().text());
    assert.equal(
      response.headers.get("Cache-Control"),
      "no-store",
      "Private data and errors are never cached.",
    );
    return response.json();
  };
  const noDatabase = async (operation, status) => {
    const before = statements;
    await checked(operation(), status);
    assert.equal(
      statements,
      before,
      "Rejected identity/input must not query another user's data.",
    );
  };
  const pristine = async () =>
    JSON.stringify(
      database.prepare("SELECT * FROM lesson_notes ORDER BY user_id,id").all(),
    );
  let cases = 0;
  const reject = async (operation, status, beforeDB = true) => {
    const before = await pristine();
    if (beforeDB) await noDatabase(operation, status);
    else await checked(operation(), status);
    assert.equal(
      await pristine(),
      before,
      "Rejected operation preserves all account notes.",
    );
    cases++;
  };
  const draft = await makeNote();
  assert.deepEqual((await checked(get())).notes, [], "Read-only empty list.");
  assert.equal(
    database.prepare("SELECT COUNT(*) AS n FROM lesson_notes").get().n,
    0,
  );
  let saved = await checked(post(saveInput(draft)));
  assert.equal(saved.draftScope, scopeA);
  assert.equal(
    saved.note.quote,
    draft.quote,
    "Exact Unicode, line breaks, spaces, and code survive.",
  );
  assert.equal(saved.note.body, draft.body);
  assert.deepEqual(saved.note.anchor, draft.anchor);
  assert.notEqual(
    saved.note.createdAt,
    draft.createdAt,
    "Client dates are not authoritative.",
  );
  assert.equal(saved.note.createdAt, saved.note.updatedAt);
  assert.deepEqual(saved.notes, [saved.note]);
  assert.ok(
    !JSON.stringify(saved).includes(userA),
    "Raw principal is never returned.",
  );
  assert.equal(
    database.prepare("SELECT user_id FROM lesson_notes").get().user_id,
    userA,
  );
  assert.deepEqual(
    (await checked(get())).notes,
    saved.notes,
    "Same account sees saved note in a fresh read.",
  );
  assert.deepEqual(
    (await checked(get(otherLesson.id))).notes,
    [],
    "Separate lesson list.",
  );
  cases++;

  await reject(
    () => post(saveInput({ ...draft, body: "collision replacement" })),
    409,
    false,
  );
  const replay = await checked(post(saveInput(draft)));
  assert.deepEqual(
    replay.note,
    saved.note,
    "Retry of a committed new note is idempotent.",
  );
  assert.equal(replay.notes.length, 1);
  cases++;

  const original = saved.note;
  saved = await checked(
    post(
      saveInput(
        {
          ...original,
          body: "Updated reflection",
          updatedAt: "2001-01-01T00:00:00.000Z",
        },
        original.updatedAt,
      ),
    ),
  );
  assert.equal(saved.note.body, "Updated reflection");
  assert.equal(saved.note.quote, draft.quote);
  assert.equal(saved.note.createdAt, original.createdAt);
  assert.ok(
    saved.note.updatedAt > original.updatedAt,
    "Server version always advances.",
  );
  await reject(
    () =>
      post(
        saveInput({ ...original, body: "Stale overwrite" }, original.updatedAt),
      ),
    409,
    false,
  );
  for (const note of [
    { ...saved.note, quote: saved.note.quote + "changed" },
    { ...saved.note, createdAt: "2002-01-01T00:00:00.000Z" },
    ...Object.entries({
      lessonTitle: "Different",
      sectionTitle: "Different",
      sectionKey: "concept:program",
      sectionIndex: 1,
      sectionFingerprint: "0".repeat(64),
    }).map(([key, value]) => ({
      ...saved.note,
      anchor: { ...saved.note.anchor, [key]: value },
    })),
  ])
    await reject(() => post(saveInput(note, saved.note.updatedAt)), 409, false);
  const simultaneous = await Promise.all([
    post(
      saveInput({ ...saved.note, body: "Concurrent A" }, saved.note.updatedAt),
    ),
    post(
      saveInput({ ...saved.note, body: "Concurrent B" }, saved.note.updatedAt),
    ),
  ]);
  assert.deepEqual(
    simultaneous.map((response) => response.status).sort(),
    [200, 409],
    "One compare-and-swap wins; no silent last-writer overwrite.",
  );
  saved.note = (await checked(get())).notes[0];
  cases++;

  // Authorization is the server's principal, not an opaque client-provided scope.
  await reject(() => get(lesson.id, scopeB), 403);
  await reject(() => post(saveInput(draft, null, scopeB)), 403);
  user = userB;
  await reject(() => get(lesson.id, scopeA), 403);
  await reject(() => post(saveInput(draft)), 403);
  assert.deepEqual((await checked(get(lesson.id, scopeB))).notes, []);
  await reject(
    () =>
      post(
        saveInput(
          { ...saved.note, body: "Owner B cannot edit A" },
          saved.note.updatedAt,
          scopeB,
        ),
      ),
    409,
    false,
  );
  await reject(
    () =>
      post({
        action: "delete",
        deviceScope: scopeB,
        lessonId: lesson.id,
        id: saved.note.id,
        expectedUpdatedAt: saved.note.updatedAt,
      }),
    409,
    false,
  );
  const secondOwner = await checked(
    post(saveInput({ ...draft, body: "Independent B note" }, null, scopeB)),
  );
  assert.equal(
    secondOwner.note.id,
    draft.id,
    "A UUID collision in another account does not block independent notes.",
  );
  assert.equal(
    (await checked(get(lesson.id, scopeB))).notes[0].body,
    "Independent B note",
  );
  user = userA;
  assert.equal((await checked(get())).notes[0].body, saved.note.body);
  cases++;

  for (const [patch, status] of [
    [{ deviceScope: undefined }, 400],
    [{ deviceScope: "invalid" }, 400],
    [{ action: "upsert" }, 400],
    [{ extra: "unknown" }, 400],
    [{ lessonId: "unknown" }, 400],
    [{ expectedUpdatedAt: undefined }, 400],
    [{ expectedUpdatedAt: "yesterday" }, 400],
    [{ note: { ...draft, id: "bad-id" } }, 400],
    [{ note: { ...draft, createdAt: "not-a-date" } }, 400],
    [{ note: { ...draft, body: " ", quote: "\n" } }, 400],
    [{ note: { ...draft, body: "a".repeat(12001) } }, 400],
    [{ note: { ...draft, quote: "a".repeat(12001) } }, 400],
    [{ note: { ...draft, extra: "unknown" } }, 400],
    [
      {
        note: {
          ...draft,
          anchor: { ...draft.anchor, lessonId: otherLesson.id },
        },
      },
      400,
    ],
    ...[
      { sectionIndex: 1000 },
      { sectionIndex: -1 },
      { sectionIndex: 0.5 },
      { sectionKey: undefined },
      { sectionKey: "text:1" },
      { sectionKey: "text:00" },
      { sectionKey: "concept:unknown" },
      { lessonTitle: "not current" },
      { sectionTitle: "not current" },
      { sectionFingerprint: "a".repeat(64) },
      { extra: "bad" },
    ].map((anchor) => [
      { note: { ...draft, anchor: { ...draft.anchor, ...anchor } } },
      400,
    ]),
  ])
    await reject(() => post({ ...saveInput(draft), ...patch }), status);
  await reject(() => post(saveInput(draft), { raw: "{broken" }), 400);
  await reject(
    () => post(saveInput(draft), { raw: "a".repeat(192 * 1024 + 1) }),
    413,
  );
  await reject(
    () =>
      post(saveInput(draft), {
        headers: { "Content-Length": String(192 * 1024 + 1) },
      }),
    413,
  );
  await reject(
    () => post(saveInput(draft), { headers: { "Content-Type": "text/plain" } }),
    415,
  );
  await reject(
    () => post(saveInput(draft), { raw: new Uint8Array([0xff]) }),
    400,
  );
  await reject(() => get("unknown"), 400);
  await reject(() => get(lesson.id, "invalid"), 400);
  await reject(
    () =>
      get(lesson.id, scopeA, { headers: { Origin: "https://other.example" } }),
    403,
  );
  await reject(
    () =>
      post(saveInput(draft), { headers: { Origin: "https://other.example" } }),
    403,
  );
  user = null;
  await reject(() => get(), 401);
  await reject(() => post(saveInput(draft)), 401);
  user = userA;

  const deleteInput = {
    action: "delete",
    deviceScope: scopeA,
    lessonId: lesson.id,
    id: saved.note.id,
    expectedUpdatedAt: saved.note.updatedAt,
  };
  await reject(
    () => post({ ...deleteInput, expectedUpdatedAt: original.updatedAt }),
    409,
    false,
  );
  await reject(
    () => post({ ...deleteInput, lessonId: otherLesson.id }),
    409,
    false,
  );
  await reject(
    () => post({ ...deleteInput, expectedUpdatedAt: undefined }),
    400,
  );
  assert.deepEqual((await checked(post(deleteInput))).notes, []);
  assert.deepEqual((await checked(get())).notes, []);
  const tombstone = database
    .prepare("SELECT * FROM lesson_notes WHERE user_id=? AND id=?")
    .get(userA, draft.id);
  assert.ok(
    tombstone.deleted_at,
    "Delete is a tombstone, not permanent deletion.",
  );
  assert.equal(
    tombstone.quote,
    draft.quote,
    "Tombstone retains original content for future recovery.",
  );
  assert.equal(tombstone.body, saved.note.body);
  await reject(() => post(saveInput(draft)), 409, false);
  await reject(
    () =>
      post(
        saveInput({ ...saved.note, body: "Resurrect" }, saved.note.updatedAt),
      ),
    409,
    false,
  );
  await reject(() => post(deleteInput), 409, false);
  user = userB;
  assert.equal(
    (await checked(get(lesson.id, scopeB))).notes.length,
    1,
    "A's deletion does not delete B's colliding identity.",
  );
  user = userA;
  cases++;

  // The limit is enforced inside the insert, including concurrent creates at 199.
  const cap = await makeNote(otherLesson);
  const insert = database.prepare(
    "INSERT INTO lesson_notes(user_id,id,lesson_id,lesson_title,section_key,section_index,section_title,section_fingerprint,quote,body,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?,?,?,?,?)",
  );
  for (let i = 0; i < 199; i++)
    insert.run(
      userA,
      crypto.randomUUID(),
      otherLesson.id,
      cap.anchor.lessonTitle,
      cap.anchor.sectionKey,
      cap.anchor.sectionIndex,
      cap.anchor.sectionTitle,
      cap.anchor.sectionFingerprint,
      cap.quote,
      "Seed " + i,
      cap.createdAt,
      cap.updatedAt,
    );
  const creates = await Promise.all(
    Array.from({ length: 8 }, (_, i) =>
      post(
        saveInput({ ...cap, id: crypto.randomUUID(), body: "Concurrent " + i }),
      ),
    ),
  );
  assert.equal(creates.filter((response) => response.status === 200).length, 1);
  assert.equal(creates.filter((response) => response.status === 409).length, 7);
  const capped = (await checked(get(otherLesson.id))).notes;
  assert.equal(capped.length, 200);
  await reject(() => post(saveInput(cap)), 409, false);
  const removed = capped[0];
  await checked(
    post({
      action: "delete",
      deviceScope: scopeA,
      lessonId: otherLesson.id,
      id: removed.id,
      expectedUpdatedAt: removed.updatedAt,
    }),
  );
  await checked(post(saveInput(cap)));
  assert.equal(
    (await checked(get(otherLesson.id))).notes.length,
    200,
    "Deleted notes do not consume active-note capacity.",
  );
  // Retry must still work at capacity without adding another row.
  await checked(post(saveInput(cap)));
  assert.equal((await checked(get(otherLesson.id))).notes.length, 200);
  cases++;

  // Concept rooms have stable identities independent of original text paragraphs.
  user = "authenticated-concept-owner";
  const conceptScope = await server.accountScope(user);
  for (const [index, concept] of concepts.pythonConcepts.entries()) {
    const conceptDraft = await makeNote();
    conceptDraft.anchor = {
      lessonId: lesson.id,
      lessonTitle: lesson.title,
      sectionKey: `concept:${concept.id}`,
      sectionIndex: index,
      sectionTitle: concept.title,
      sectionFingerprint: await fingerprint(
        [concept.short, concept.why, concept.imagine, concept.limit].join(
          "\n\n",
        ),
      ),
    };
    conceptDraft.quote =
      concept.explore[0].text + "\n" + concept.explore[0].example;
    const conceptSaved = await checked(
      post(saveInput(conceptDraft, null, conceptScope)),
    );
    assert.deepEqual(conceptSaved.note.anchor, conceptDraft.anchor);
    assert.equal(
      conceptSaved.note.quote,
      conceptDraft.quote,
      "Room selections may include exact exploration/token text.",
    );
    await reject(
      () =>
        post(
          saveInput(
            {
              ...conceptSaved.note,
              anchor: {
                ...conceptSaved.note.anchor,
                sectionKey: `text:${index}`,
              },
            },
            conceptSaved.note.updatedAt,
            conceptScope,
          ),
        ),
      409,
      false,
    );
    await reject(
      () =>
        post(
          saveInput(
            {
              ...conceptDraft,
              id: crypto.randomUUID(),
              anchor: { ...conceptDraft.anchor, sectionIndex: (index + 1) % 6 },
            },
            null,
            conceptScope,
          ),
        ),
      400,
    );
    await reject(
      () =>
        post(
          saveInput(
            {
              ...conceptDraft,
              id: crypto.randomUUID(),
              anchor: {
                ...conceptDraft.anchor,
                lessonId: otherLesson.id,
                lessonTitle: otherLesson.title,
              },
            },
            null,
            conceptScope,
          ),
        ),
      400,
    );
    const edited = await checked(
      post(
        saveInput(
          { ...conceptSaved.note, body: "A room reflection" },
          conceptSaved.note.updatedAt,
          conceptScope,
        ),
      ),
    );
    assert.equal(edited.note.body, "A room reflection");
    cases++;
  }
  assert.equal((await checked(get(lesson.id, conceptScope))).notes.length, 6);

  // Every course has a usable canonical original-text anchor, not just Python.
  user = "authenticated-catalog-owner";
  const catalogScope = await server.accountScope(user);
  for (const source of lessons) {
    const note = await makeNote(source);
    const result = await checked(post(saveInput(note, null, catalogScope)));
    assert.equal(result.note.anchor.lessonId, source.id);
    assert.equal(result.note.anchor.sectionKey, "text:0");
    cases++;
  }
  console.log(
    `Passed ${cases} authenticated notes server groups: real SQLite migrations, principal/lesson isolation, strict bounded input, origin/auth rejection, exact quotes, authoritative timestamps, idempotent create, atomic stale-version protection, immutable anchors, soft deletion, resurrection prevention, and 200-note concurrent cap. No external calls.`,
  );
} finally {
  database.close();
}
