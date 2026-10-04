import assert from "node:assert/strict";
import { mkdtemp, readFile, writeFile, stat, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import vm from "node:vm";
import ts from "typescript";
import { prepareLocalRuntime } from "../scripts/local-runtime.mjs";

const source = await readFile(
  new URL("../build/local-mode-plugin.ts", import.meta.url),
  "utf8",
);
const compiled = ts.transpileModule(source, {
  compilerOptions: {
    target: ts.ScriptTarget.ES2022,
    module: ts.ModuleKind.CommonJS,
  },
}).outputText;
const loadedModule = { exports: {} };
vm.runInNewContext(
  compiled,
  {
    module: loadedModule,
    exports: loadedModule.exports,
    URL,
    Set,
    Object,
    Error,
  },
  {
    filename: "local-mode-plugin.ts",
  },
);
const { localRequestAllowed, localModeMiddleware, localMode } =
  loadedModule.exports;

function request(overrides = {}) {
  const headers = {
    host: "127.0.0.1:5173",
    "oai-authenticated-user-id": "spoofed-user",
    "oai-authenticated-user-email": "spoofed@example.invalid",
    "oai-authenticated-user-extra": "spoofed-extra",
    ...overrides.headers,
  };
  return {
    method: "POST",
    url: "/api/quest",
    socket: { remoteAddress: "127.0.0.1" },
    ...overrides,
    headers,
    rawHeaders: [
      ...Object.entries(headers).flat(),
      "OAI-Authenticated-User-ID",
      "duplicate-spoof",
    ],
  };
}

function dispatch(req) {
  let nextCalls = 0;
  const response = {
    statusCode: 200,
    headers: new Map(),
    setHeader(name, value) {
      this.headers.set(name.toLowerCase(), value);
    },
    end(body) {
      this.body = body;
      this.ended = true;
    },
  };
  localModeMiddleware(req, response, () => {
    nextCalls++;
  });
  return { response, nextCalls };
}

let cases = 0;
for (const [host, peer] of [
  ["127.0.0.1:5173", "127.0.0.1"],
  ["localhost:5173", "::ffff:127.0.0.1"],
  ["[::1]:5173", "::1"],
]) {
  for (const origin of [undefined, `http://${host}`]) {
    const req = request({
      headers: { host, ...(origin ? { origin } : {}) },
      socket: { remoteAddress: peer },
    });
    assert.equal(localRequestAllowed(req), true);
    const result = dispatch(req);
    assert.equal(result.nextCalls, 1);
    assert.ok(!result.response.ended);
    assert.equal(req.headers["oai-authenticated-user-id"], "codequest-local");
    assert.equal(
      req.headers["oai-authenticated-user-email"],
      "local@codequest.invalid",
    );
    assert.equal(req.headers["oai-authenticated-user-extra"], undefined);
    const identityPairs = [];
    for (let i = 0; i < req.rawHeaders.length; i += 2) {
      if (req.rawHeaders[i].toLowerCase().startsWith("oai-authenticated-user-"))
        identityPairs.push([req.rawHeaders[i], req.rawHeaders[i + 1]]);
    }
    assert.equal(
      identityPairs.length,
      4,
      "Injected identity has no caller duplicates",
    );
    assert.ok(
      identityPairs.every(([, value]) => !String(value).includes("spoof")),
    );
    cases++;
  }
}

for (const [label, overrides] of [
  ["LAN peer", { socket: { remoteAddress: "192.168.1.20" } }],
  ["missing peer", { socket: {} }],
  ["foreign Host", { headers: { host: "attacker.invalid:5173" } }],
  ["missing Host", { headers: { host: undefined } }],
  ["malformed Host", { headers: { host: "[::1" } }],
  ["foreign absolute URL", { url: "http://attacker.invalid/api/quest" }],
  ["foreign relative authority", { url: "//attacker.invalid/api/quest" }],
  ["different loopback authority", { url: "http://localhost:5173/api/quest" }],
  ["different port", { url: "http://127.0.0.1:9999/api/quest" }],
  ["null Origin", { headers: { origin: "null" } }],
  ["foreign Origin", { headers: { origin: "https://attacker.invalid" } }],
  [
    "different loopback Origin",
    { headers: { origin: "http://localhost:5173" } },
  ],
  ["cross-site fetch", { headers: { "sec-fetch-site": "cross-site" } }],
]) {
  const req = request(overrides);
  assert.equal(localRequestAllowed(req), false, label);
  const result = dispatch(req);
  assert.equal(result.nextCalls, 0, `${label}: blocked before app handler`);
  assert.equal(result.response.statusCode, 403, label);
  assert.equal(result.response.headers.get("cache-control"), "no-store");
  assert.equal(req.headers["oai-authenticated-user-id"], undefined);
  assert.ok(!req.rawHeaders.some((value) => String(value).includes("spoof")));
  cases++;
}

let installed;
localMode().configureServer({
  config: { server: { host: "127.0.0.1" } },
  middlewares: {
    use(value) {
      installed = value;
    },
  },
});
assert.equal(installed, localModeMiddleware);
for (const host of ["0.0.0.0", true, "localhost", undefined]) {
  assert.throws(
    () => localMode().configureServer({ config: { server: { host } } }),
    /127\.0\.0\.1/,
  );
}

const temp = await mkdtemp(path.join(tmpdir(), "codequest-local-mode-"));
try {
  const first = await prepareLocalRuntime(temp);
  assert.equal(Buffer.from(first.secret, "base64").length, 32);
  const keyPath = path.join(temp, ".codequest-local", "encryption-key");
  const firstKeyBytes = await readFile(keyPath);
  const second = await prepareLocalRuntime(temp);
  assert.equal(
    second.secret,
    first.secret,
    "Restarts preserve the encryption key",
  );
  assert.deepEqual(await readFile(keyPath), firstKeyBytes);
  assert.equal(second.statePath, path.join(temp, ".codequest-local", "state"));
  const configText = await readFile(second.configPath, "utf8");
  const config = JSON.parse(configText);
  assert.ok(
    !configText.includes(first.secret),
    "Migration config contains no encryption secret",
  );
  assert.ok(!config.vars && !config.secrets);
  assert.equal(config.d1_databases[0].binding, "DB");
  assert.equal(
    config.d1_databases[0].migrations_dir,
    path.join(temp, "drizzle"),
  );
  assert.equal(config.main, path.join(temp, "build", "sites-worker.ts"));
  if (process.platform !== "win32") {
    assert.equal((await stat(path.dirname(keyPath))).mode & 0o777, 0o700);
    assert.equal((await stat(keyPath)).mode & 0o777, 0o600);
  }
  await writeFile(keyPath, "damaged-synthetic-key");
  await assert.rejects(() => prepareLocalRuntime(temp), /key is damaged/);
  assert.equal(
    await readFile(keyPath, "utf8"),
    "damaged-synthetic-key",
    "Damaged key is never silently replaced",
  );
} finally {
  await rm(temp, { recursive: true, force: true });
}

console.log(
  `Passed ${cases} local request boundaries, identity replacement, loopback-only listener, persistent private key setup, secret-free migration config, and damaged-key recovery checks. No real credentials or provider requests.`,
);
