import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import vm from "node:vm";
import ts from "typescript";
const modules = new Map();
const rows = new Map();
const env = {
  DEEPSEEK_API_KEY: "synthetic-shared-key-must-never-be-used",
  AI_KEY_ENCRYPTION_KEY: btoa(
    String.fromCharCode(...new Uint8Array(32).fill(7)),
  ),
};
env.DB = {
  prepare(sql) {
    let params = [];
    return {
      bind(...values) {
        params = values;
        return this;
      },
      async run() {
        if (sql.startsWith("INSERT OR IGNORE") && !rows.has(params[0]))
          rows.set(params[0], { settings: params[1], encrypted_key: null });
        return {};
      },
      async first() {
        return rows.get(params[0]) ?? null;
      },
      async all() {
        return { results: [] };
      },
    };
  },
};
const load = async (file) => {
  if (modules.has(file)) return modules.get(file);
  const imports = {};
  if (file === "lib/server.ts") {
    imports["cloudflare:workers"] = { env };
    imports["../app/chatgpt-auth"] = {
      getChatGPTUser: async () => ({ userId: "learner-a" }),
    };
    imports["./ai-keys"] = await load("lib/ai-keys.ts");
    imports["./profile"] = await load("lib/profile.ts");
  }
  if (file === "lib/ai-keys.ts")
    imports["./ai-providers"] = await load("lib/ai-providers.ts");
  const module = { exports: {} };
  const js = ts.transpileModule(await readFile(file, "utf8"), {
    compilerOptions: {
      target: ts.ScriptTarget.ES2022,
      module: ts.ModuleKind.CommonJS,
    },
  }).outputText;
  vm.runInNewContext(
    js,
    {
      module,
      exports: module.exports,
      require: (id) => {
        assert.ok(id in imports, "Unexpected dependency " + id);
        return imports[id];
      },
      crypto,
      TextEncoder,
      TextDecoder,
      Uint8Array,
      atob,
      btoa,
      Response,
      Date,
      console,
    },
    { filename: file },
  );
  modules.set(file, module.exports);
  return module.exports;
};
const server = await load("lib/server.ts");
rows.set("learner-b", {
  settings: JSON.stringify({ aiEnabled: true, tutorLimit: 20 }),
  encrypted_key: null,
});
assert.equal(await server.aiConnection("learner-b"), null);
let state = await server.state("learner-b");
assert.equal(state.keyConnected, false);
assert.equal(state.aiProvider, null);
assert.ok(!("tutorLimit" in state.profile));
for (const provider of ["deepseek", "openai", "anthropic"]) {
  const value = "synthetic-personal-key-" + provider;
  const encrypted = await server.encryptConnection(
    provider,
    value,
    "learner-a",
  );
  assert.ok(!encrypted.includes(value));
  rows.set("learner-a", { settings: "{}", encrypted_key: encrypted });
  const own = await server.aiConnection("learner-a");
  assert.equal(own.provider, provider);
  assert.equal(own.key, value);
  assert.equal(await server.aiConnection("learner-b"), null);
  state = await server.state("learner-a");
  assert.equal(state.aiProvider, provider);
  assert.equal(state.keyConnected, true);
  assert.ok(!JSON.stringify(state).includes(value));
  assert.ok(!JSON.stringify(state).includes(encrypted));
  await assert.rejects(
    () =>
      server.aiConnection("learner-b", {
        settings: "{}",
        encrypted_key: encrypted,
      }),
    /Reconnect/,
  );
}
rows.set("learner-a", {
  settings: JSON.stringify({ aiDisconnected: true }),
  encrypted_key: null,
});
assert.equal(await server.aiConnection("learner-a"), null);
assert.equal((await server.state("learner-a")).keyConnected, false);
console.log(
  "Passed account-only keys for all three providers, encrypted storage, public-state exclusion, cross-account decryption rejection, disconnect and shared-key fallback removal. No real credentials or provider calls.",
);
