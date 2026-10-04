import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import vm from "node:vm";
import { webcrypto, createHash } from "node:crypto";
import ts from "typescript";
const origin = "https://fixture.example";
const hash = (value) => createHash("sha256").update(value).digest("hex");
const carriers = {
  "/offline.html": "/offline-assets/offline-shell.base64.txt",
  "/runner/frame.html": "/runner/frame.base64.txt",
};
const htmlFile = (path, text) => {
  const encoded = Buffer.from(text).toString("base64");
  return {
    path,
    size: Buffer.byteLength(text),
    sha256: hash(text),
    transport: {
      path: carriers[path],
      size: encoded.length,
      sha256: hash(encoded),
      encoding: "base64",
    },
  };
};
const frame = "<!doctype html><p>online engine — café</p>";
const onlineManifest = { files: [htmlFile("/runner/frame.html", frame)] };
const stores = new Map();
const caches = {
  async open(name) {
    if (!stores.has(name)) stores.set(name, new Map());
    const store = stores.get(name);
    return {
      async match(key) {
        return store.get(typeof key === "string" ? key : key.url)?.clone();
      },
      async put(key, response) {
        store.set(typeof key === "string" ? key : key.url, response.clone());
      },
    };
  },
  async keys() {
    return [...stores.keys()];
  },
  async delete(name) {
    return stores.delete(name);
  },
};
const redirect = (text, path, status = 200) => {
  const response = new Response(text, {
    status,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Content-Encoding": "gzip",
      "Content-Length": "999",
      "Content-Security-Policy": "default-src 'none'",
    },
  });
  Object.defineProperties(response, {
    redirected: { value: true },
    url: { value: path },
  });
  return response;
};
let network,
  fetchCount = 0;
const navigator = { onLine: true };
const module = { exports: {} };
vm.runInNewContext(
  ts.transpileModule(await readFile("lib/offline-pack.ts", "utf8"), {
    compilerOptions: {
      target: ts.ScriptTarget.ES2022,
      module: ts.ModuleKind.CommonJS,
    },
  }).outputText,
  {
    module,
    exports: module.exports,
    URL,
    Response,
    Uint8Array,
    TextDecoder,
    atob,
    crypto: webcrypto,
    window: { caches },
    caches,
    location: { origin },
    navigator,
    fetch: async (path) => {
      fetchCount++;
      return network(path);
    },
  },
);
const { expectedStaticResponse, staticResponse, runnerAssets } = module.exports;
const handlers = {};
let manifest,
  assetBodies = {},
  downloadBad = false,
  carrierOverride;
const swFetches = [];
const sw = {
  self: {
    location: { origin },
    addEventListener: (name, callback) => {
      handlers[name] = callback;
    },
    skipWaiting() {},
    clients: { claim() {} },
  },
  caches,
  URL,
  Response,
  Headers,
  Uint8Array,
  TextDecoder,
  atob,
  crypto: webcrypto,
  fetch: async (request) => {
    const path = new URL(
      typeof request === "string" ? request : request.url,
      origin,
    ).pathname;
    swFetches.push(path);
    if (path === "/offline-pack.json") return Response.json(manifest);
    const logical = Object.keys(carriers).find(
      (logical) => carriers[logical] === path,
    );
    if (logical)
      return carrierOverride
        ? carrierOverride(logical, path)
        : new Response(
            downloadBad && logical === "/runner/frame.html"
              ? "corrupted"
              : Buffer.from(assetBodies[logical]).toString("base64"),
            {
              headers: {
                "Content-Type": "text/plain",
                "Content-Encoding": "gzip",
                "Content-Length": "999",
              },
            },
          );
    throw new TypeError("Offline fixture");
  },
};
vm.runInNewContext(await readFile("public/sw.js", "utf8"), sw);
for (const [request, target, allowed] of [
  ["/runner/frame.html", origin + "/runner/frame", true],
  ["/offline.html", origin + "/offline", true],
  ["/runner/frame.html", "https://other.example/runner/frame", false],
  ["/runner/frame.html", origin + "/signin-with-chatgpt", false],
  ["/runner/frame.html", origin + "/other", false],
  ["/runner/frame.html", origin + "/runner/frame?token=private", false],
  ["/runner/frame.html", origin + "/runner/frame#private", false],
  ["/runner/frame.html?private=1", origin + "/runner/frame", false],
  ["/vendor/unknown.html", origin + "/vendor/unknown", false],
  ["/api/quest", origin + "/runner/frame", false],
  ["https://other.example/runner/frame.html", origin + "/runner/frame", false],
  [carriers["/runner/frame.html"], origin + "/runner/frame", false],
]) {
  const response = redirect("fixture", target);
  assert.equal(
    expectedStaticResponse(request, response, origin),
    allowed,
    request + " client",
  );
  assert.equal(
    sw.expectedStaticResponse(request, response),
    allowed,
    request + " service worker",
  );
}
assert.equal(
  expectedStaticResponse(
    "/runner/frame.html",
    redirect("missing", origin + "/runner/frame", 404),
    origin,
  ),
  false,
);
const online = (path) =>
  path === "/offline-pack.json"
    ? Response.json(onlineManifest)
    : new Response(Buffer.from(frame).toString("base64"));
network = online;
const fresh = await staticResponse("/runner/frame.html");
assert.equal(fresh.redirected, false);
assert.equal(fresh.headers.get("Content-Type"), "text/html; charset=utf-8");
assert.equal(
  await fresh.text(),
  frame,
  "Online verified text carrier works without an offline pack and preserves Unicode",
);
await (
  await caches.open("safe-pack")
).put(origin + "/runner/frame.html", new Response("cached engine"));
await (
  await caches.open("codequest-download-config-v1")
).put(
  origin + "/__codequest_downloads__",
  Response.json({ name: "safe-pack" }),
);
network = () => redirect("private login HTML", origin + "/signin-with-chatgpt");
assert.equal(
  await (await staticResponse("/runner/frame.html")).text(),
  "cached engine",
);
await caches.delete("codequest-download-config-v1");
await assert.rejects(
  () => staticResponse("/runner/frame.html"),
  /not downloaded/,
);
await (
  await caches.open("codequest-download-config-v1")
).put(
  origin + "/__codequest_downloads__",
  Response.json({ name: "safe-pack" }),
);
navigator.onLine = false;
const before = fetchCount;
assert.equal(
  await (await staticResponse("/runner/frame.html")).text(),
  "cached engine",
);
assert.equal(fetchCount, before);
navigator.onLine = true;
await caches.delete("codequest-download-config-v1");
const corruptions = [
  { ...onlineManifest.files[0], sha256: "0".repeat(64) },
  { ...onlineManifest.files[0], size: onlineManifest.files[0].size + 1 },
  {
    ...onlineManifest.files[0],
    transport: { ...onlineManifest.files[0].transport, sha256: "0".repeat(64) },
  },
  {
    ...onlineManifest.files[0],
    transport: {
      ...onlineManifest.files[0].transport,
      size: onlineManifest.files[0].transport.size + 1,
    },
  },
  {
    ...onlineManifest.files[0],
    transport: { ...onlineManifest.files[0].transport, encoding: "plain" },
  },
  ...[
    "https://other.example/runner/frame.base64.txt",
    "/api/quest",
    "/signin-with-chatgpt",
    "/other.txt",
  ].map((path) => ({
    ...onlineManifest.files[0],
    transport: { ...onlineManifest.files[0].transport, path },
  })),
];
for (const invalid of corruptions) {
  const requested = [];
  network = (path) => {
    requested.push(path);
    return path === "/offline-pack.json"
      ? Response.json({ files: [invalid] })
      : online(path);
  };
  await assert.rejects(
    () => staticResponse("/runner/frame.html"),
    /not downloaded/,
  );
  assert.ok(
    requested.every(
      (path) =>
        path === "/offline-pack.json" ||
        path === carriers["/runner/frame.html"],
    ),
  );
}
network = (path) =>
  path === "/offline-pack.json"
    ? Response.json({
        files: [onlineManifest.files[0], onlineManifest.files[0]],
      })
    : online(path);
await assert.rejects(
  () => staticResponse("/runner/frame.html"),
  /not downloaded/,
);
for (const bad of [
  "x".repeat(onlineManifest.files[0].transport.size),
  "%".repeat(onlineManifest.files[0].transport.size),
]) {
  const transport = { ...onlineManifest.files[0].transport, sha256: hash(bad) };
  network = (path) =>
    path === "/offline-pack.json"
      ? Response.json({ files: [{ ...onlineManifest.files[0], transport }] })
      : new Response(bad);
  await assert.rejects(
    () => staticResponse("/runner/frame.html"),
    /not downloaded/,
  );
}
network = (path) =>
  path === "/offline-pack.json"
    ? Response.json(onlineManifest)
    : redirect(
        Buffer.from(frame).toString("base64"),
        origin + "/signin-with-chatgpt",
      );
await assert.rejects(
  () => staticResponse("/runner/frame.html"),
  /not downloaded/,
);
const vendor = "verified Python fixture";
const vendorManifest = [
  {
    source: "https://cdn.jsdelivr.net/fixture.js",
    path: "/vendor/pyodide/fixture.js",
    type: "application/javascript",
    sha256: hash(vendor),
  },
];
network = (path) =>
  path === "/vendor/manifest.json"
    ? Response.json(vendorManifest)
    : new Response("wrong bytes");
await assert.rejects(() => runnerAssets("python"), /fresh download/);
network = (path) =>
  path === "/vendor/manifest.json"
    ? Response.json(vendorManifest)
    : new Response(vendor);
const verified = await runnerAssets("python");
assert.equal(
  new TextDecoder().decode(verified[vendorManifest[0].source].bytes),
  vendor,
);
assetBodies = {
  "/offline.html": "offline shell",
  "/runner/frame.html": "isolated engine",
};
manifest = {
  version: "a".repeat(20),
  files: Object.entries(assetBodies).map(([path, value]) =>
    htmlFile(path, value),
  ),
  size: Object.values(assetBodies).reduce(
    (sum, text) => sum + Buffer.from(text).toString("base64").length,
    0,
  ),
};
const download = async () => {
  const messages = [];
  let pending;
  handlers.message({
    data: { type: "download-pack" },
    ports: [{ postMessage: (value) => messages.push(value) }],
    waitUntil: (value) => {
      pending = value;
    },
  });
  await pending;
  return messages;
};
assert.equal((await download()).at(-1).type, "ready");
const stored = await (
  await caches.open("codequest-static-" + manifest.version)
).match(origin + "/offline.html");
assert.equal(stored.redirected, false);
assert.deepEqual(
  new Uint8Array(await stored.clone().arrayBuffer()),
  new TextEncoder().encode(assetBodies["/offline.html"]),
);
assert.equal(stored.headers.has("Content-Encoding"), false);
assert.equal(stored.headers.has("Content-Length"), false);
assert.equal(stored.headers.get("Content-Type"), "text/html; charset=utf-8");
assert.equal(stored.headers.get("X-Content-Type-Options"), "nosniff");
assert.equal(await stored.text(), assetBodies["/offline.html"]);
assert.ok(
  ![...stores.get("codequest-static-" + manifest.version).keys()].some((path) =>
    path.endsWith("base64.txt"),
  ),
);
const workingManifest = structuredClone(manifest);
for (const kind of [
  "encoded-hash",
  "decoded-hash",
  "encoded-size",
  "decoded-size",
  "wrong-path",
  "wrong-encoding",
  "missing-transport",
  "invalid-base64",
  "carrier-redirect",
  "external-carrier-redirect",
]) {
  manifest = structuredClone(workingManifest);
  manifest.version = "c".repeat(20);
  const entry = manifest.files[1];
  carrierOverride = undefined;
  if (kind === "encoded-hash") entry.transport.sha256 = "0".repeat(64);
  if (kind === "decoded-hash") entry.sha256 = "0".repeat(64);
  if (kind === "encoded-size") entry.transport.size++;
  if (kind === "decoded-size") entry.size++;
  if (kind === "wrong-path") entry.transport.path = "/api/quest";
  if (kind === "wrong-encoding") entry.transport.encoding = "plain";
  if (kind === "missing-transport") delete entry.transport;
  if (kind === "invalid-base64") {
    const invalid = "%".repeat(entry.transport.size);
    entry.transport.sha256 = hash(invalid);
    carrierOverride = (logical) =>
      new Response(
        logical === entry.path
          ? invalid
          : Buffer.from(assetBodies[logical]).toString("base64"),
      );
  }
  if (kind.endsWith("carrier-redirect"))
    carrierOverride = (logical) =>
      logical === entry.path
        ? redirect(
            Buffer.from(assetBodies[logical]).toString("base64"),
            kind === "external-carrier-redirect"
              ? "https://other.example/runner/frame.base64.txt"
              : origin + "/runner/frame",
          )
        : new Response(Buffer.from(assetBodies[logical]).toString("base64"));
  const before = swFetches.length;
  assert.equal((await download()).at(-1).type, "error", kind);
  assert.ok(!stores.has("codequest-static-" + manifest.version), kind);
  assert.ok(stores.has("codequest-static-" + workingManifest.version), kind);
  assert.ok(
    swFetches
      .slice(before)
      .every(
        (path) =>
          path === "/offline-pack.json" ||
          Object.values(carriers).includes(path),
      ),
    kind,
  );
}
carrierOverride = undefined;
downloadBad = true;
manifest = { ...workingManifest, version: "b".repeat(20) };
assert.equal((await download()).at(-1).type, "error");
assert.ok(!stores.has("codequest-static-" + manifest.version));
assert.ok(stores.has("codequest-static-" + "a".repeat(20)));
let navigation;
handlers.fetch({
  request: { url: origin + "/", method: "GET", mode: "navigate" },
  respondWith: (value) => {
    navigation = value;
  },
});
const offline = await navigation;
assert.equal(offline.redirected, false);
assert.equal(await offline.text(), "offline shell");
handlers.fetch({
  request: { url: origin + "/offline", method: "GET", mode: "navigate" },
  respondWith: (value) => {
    navigation = value;
  },
});
assert.equal(await (await navigation).text(), "offline shell");
for (const path of [
  "/api/practice",
  "/api/quest",
  "/signin-with-chatgpt",
  "https://other.example/vendor/file.js",
]) {
  let intercepted = false;
  handlers.fetch({
    request: { url: new URL(path, origin).href, method: "GET", mode: "cors" },
    respondWith() {
      intercepted = true;
    },
  });
  assert.equal(intercepted, false);
}
console.log(
  "Passed fixed HTML carriers with encoded and decoded SHA-256/size checks, Unicode preservation, synthesized HTML MIME, rejected malformed/base64/path/redirect metadata, online/no-pack and offline cache fallback, unchanged vendor integrity, failed-pack preservation, canonical offline navigation, and API/auth/cross-origin bypass. All responses were local fixtures.",
);
