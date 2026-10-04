import assert from "node:assert/strict";
import { mkdtemp, readFile, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import ts from "typescript";
import "fake-indexeddb/auto";

const temp = await mkdtemp(path.join(tmpdir(), "codequest-action-scope-"));
try {
  for (const name of ["learning-client", "device-db", "profile"]) {
    const source = await readFile(`lib/${name}.ts`, "utf8");
    const compiled = ts
      .transpileModule(source, {
        compilerOptions: {
          target: ts.ScriptTarget.ES2022,
          module: ts.ModuleKind.ESNext,
        },
      })
      .outputText.replace(/from "\.\/([^\"]+)"/g, 'from "./$1.mjs"');
    await writeFile(path.join(temp, name + ".mjs"), compiled);
  }
  const { LearningClient } = await import(
    path.join(temp, "learning-client.mjs")
  );
  const { defaultProfile } = await import(path.join(temp, "profile.mjs"));
  const { readDevice } = await import(path.join(temp, "device-db.mjs"));
  const lessons = JSON.parse(await readFile("content/lessons.json", "utf8"));
  Object.defineProperty(globalThis, "navigator", {
    value: { onLine: true },
    configurable: true,
  });
  const state = (scope) => ({
    draftScope: scope,
    profile: { ...defaultProfile, autoSync: false },
    progress: [],
    xp: 0,
    completed: 0,
    streak: 0,
    todayCompleted: 0,
    recentDays: [],
    keyConnected: false,
    aiProvider: null,
    tutorUsed: 0,
  });
  const response = (value) => Response.json(value);
  let passed = 0;
  for (const action of ["key", "disconnect"]) {
    for (const stage of [
      "success",
      "implicit-success",
      "sync",
      "remote",
      "post",
      "supplied-scope",
      "response-scope",
    ]) {
      const ownScope = crypto.randomUUID().replaceAll("-", "").repeat(2);
      const otherScope = crypto.randomUUID().replaceAll("-", "").repeat(2);
      const own = state(ownScope),
        other = state(otherScope);
      let remote = own,
        reads = 0,
        release;
      let reached;
      const paused = new Promise((resolve) => {
        reached = resolve;
      });
      const posts = [];
      globalThis.fetch = async (_url, options = {}) => {
        if (!options.method) {
          reads++;
          if (
            (stage === "sync" && reads === 2) ||
            (stage === "remote" && reads === 3)
          ) {
            reached();
            await new Promise((resolve) => {
              release = resolve;
            });
          }
          return response(remote);
        }
        const body = JSON.parse(options.body);
        posts.push(body);
        if (stage === "post") {
          reached();
          await new Promise((resolve) => {
            release = resolve;
          });
        }
        return response(
          stage === "response-scope"
            ? other
            : {
                ...own,
                keyConnected: action === "key",
                aiProvider: action === "key" ? "deepseek" : null,
              },
        );
      };
      const client = new LearningClient(lessons, own);
      await client.initialize();
      const request = {
        action,
        ...(stage === "implicit-success"
          ? {}
          : {
              deviceScope: stage === "supplied-scope" ? otherScope : ownScope,
            }),
        ...(action === "key"
          ? { provider: "deepseek", key: "synthetic-never-a-real-key" }
          : {}),
      };
      const outcome = client.mutate(request).then(
        (value) => ({ value }),
        (error) => ({ error }),
      );
      if (["sync", "remote", "post"].includes(stage)) {
        await paused;
        client.scope = otherScope;
        client.current = other;
        remote = other;
        release();
      }
      const result = await outcome;
      if (stage.endsWith("success")) {
        assert.ok(!result.error, `${action}: ordinary connection action works`);
        assert.equal(posts.length, 1);
        assert.equal(posts[0].deviceScope, ownScope);
        assert.equal(client.current.draftScope, ownScope);
      } else {
        assert.ok(
          result.error,
          `${action}/${stage}: switched scope must reject`,
        );
        assert.match(result.error.message, /account/i);
        assert.equal(
          posts.length,
          ["post", "response-scope"].includes(stage) ? 1 : 0,
        );
        if (posts.length) assert.equal(posts[0].deviceScope, ownScope);
        assert.equal(
          client.current.draftScope,
          ["sync", "remote", "post"].includes(stage) ? otherScope : ownScope,
        );
        if (stage === "post") assert.equal(client.current.keyConnected, false);
      }
      const saved = await readDevice("accounts", ownScope);
      assert.ok(!JSON.stringify(saved).includes("synthetic-never-a-real-key"));
      passed++;
    }
  }
  console.log(
    `Passed ${passed} key/disconnect cases: deferred sync and identity reads, supplied scope mismatch, delayed responses, and ordinary same-account success. No real credentials or provider calls.`,
  );
} finally {
  await rm(temp, { recursive: true, force: true });
}
