import assert from "node:assert/strict";
import vm from "node:vm";
import { readFile } from "node:fs/promises";
import { webcrypto, createHash } from "node:crypto";
const origin = "https://test.example",
  stores = new Map(),
  handlers = {},
  fetches = [];
let offline = false,
  manifest;
const caches = {
  async open(n) {
    if (!stores.has(n)) stores.set(n, new Map());
    const s = stores.get(n);
    return {
      async match(k) {
        return s.get(typeof k === "string" ? k : k.url)?.clone();
      },
      async put(k, r) {
        s.set(typeof k === "string" ? k : k.url, r.clone());
      },
    };
  },
  async keys() {
    return [...stores.keys()];
  },
  async delete(n) {
    return stores.delete(n);
  },
};
let asset = "safe static lesson";
const hash = (s) => createHash("sha256").update(s).digest("hex");
const make = (version) => {
  const encoded = Buffer.from(asset).toString("base64");
  return {
    version,
    files: [
      {
        path: "/offline.html",
        size: Buffer.byteLength(asset),
        sha256: hash(asset),
        transport: {
          path: "/offline-assets/offline-shell.base64.txt",
          size: encoded.length,
          sha256: hash(encoded),
          encoding: "base64",
        },
      },
    ],
    size: encoded.length,
  };
};
manifest = make("a".repeat(20));
const sandbox = {
  self: {
    location: { origin },
    addEventListener: (n, f) => (handlers[n] = f),
    skipWaiting() {},
    clients: { claim() {} },
  },
  caches,
  URL,
  Response,
  crypto: webcrypto,
  Uint8Array,
  TextDecoder,
  atob,
  console,
  fetch: async (req) => {
    fetches.push(req);
    if (offline) throw new TypeError("offline");
    const u = typeof req === "string" ? req : req.url;
    return u.endsWith("/offline-pack.json")
      ? new Response(JSON.stringify(manifest))
      : new Response(Buffer.from(asset).toString("base64"));
  },
};
vm.runInNewContext(await readFile("public/sw.js", "utf8"), sandbox);
async function download() {
  let messages = [],
    promise;
  handlers.message({
    data: { type: "download-pack" },
    ports: [{ postMessage: (x) => messages.push(x) }],
    waitUntil: (p) => (promise = p),
  });
  await promise;
  return messages;
}
assert.equal((await download()).at(-1).type, "ready");
assert.ok(stores.get("codequest-static-" + manifest.version));
// A broken replacement pack never displaces the working one.
manifest = make("b".repeat(20));
manifest.files[0].sha256 = "0".repeat(64);
assert.equal((await download()).at(-1).type, "error");
assert.ok(!stores.has("codequest-static-" + manifest.version));
for (const url of [
  "/api/quest",
  "/api/tutor",
  "/signin-with-chatgpt",
  "/auth/callback",
  "https://evil.example/vendor/x",
]) {
  let intercepted = false;
  handlers.fetch({
    request: {
      url: url.startsWith("https") ? url : origin + url,
      method: "GET",
      mode: "cors",
    },
    respondWith() {
      intercepted = true;
    },
  });
  assert.equal(intercepted, false, url);
}
offline = true;
let nav;
handlers.fetch({
  request: { url: origin + "/", method: "GET", mode: "navigate" },
  respondWith: (p) => (nav = p),
});
assert.equal(await (await nav).text(), asset);
assert.ok(
  [...stores.values()].every((s) =>
    [...s.keys()].every((k) => !k.includes("/api/") && !k.includes("signin")),
  ),
);
console.log(
  "Passed 5 cache flows: verified download, failed update preservation, API/auth/cross-origin bypass, offline navigation, static-only entries.",
);
