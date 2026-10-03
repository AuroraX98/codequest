/* Static learning downloads only. No API, auth, account response, or cross-origin cache. */
const CONFIG = "codequest-download-config-v1";
const KEY = new URL("/__codequest_downloads__", self.location.origin).href;
const allowed = (path) =>
  path === "/offline.html" ||
  path === "/runner/frame.html" ||
  path === "/favicon.svg" ||
  path === "/companion/codequest-swift-runner.py" ||
  path === "/companion/README.txt" ||
  path === "/manifest.webmanifest" ||
  path === "/offline-pack.json" ||
  path.startsWith("/offline-assets/") ||
  path.startsWith("/vendor/");
async function active() {
  const config = await caches.open(CONFIG);
  const r = await config.match(KEY);
  return r ? await r.json() : null;
}
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) =>
  event.waitUntil(self.clients.claim()),
);
let downloading;
async function download(port) {
  const response = await fetch("/offline-pack.json", {
    credentials: "same-origin",
    cache: "no-store",
  });
  if (!response.ok || response.redirected)
    throw new Error("Open the signed-in app online before downloading.");
  const manifest = await response.json();
  if (
    !/^[a-f0-9]{20}$/.test(manifest.version) ||
    !Array.isArray(manifest.files) ||
    !manifest.files.length
  )
    throw new Error("The download list is unavailable.");
  const name = "codequest-static-" + manifest.version;
  const cache = await caches.open(name);
  const old = await active();
  let bytes = 0;
  try {
    for (let i = 0; i < manifest.files.length; i++) {
      const f = manifest.files[i],
        url = new URL(f.path, self.location.origin);
      if (
        url.origin !== self.location.origin ||
        !allowed(url.pathname) ||
        url.search ||
        url.hash ||
        url.pathname === "/offline-pack.json"
      )
        throw new Error("Unexpected file in the offline pack.");
      const r = await fetch(url.href, {
        credentials: "same-origin",
        cache: "reload",
      });
      if (!r.ok || r.redirected)
        throw new Error(
          "A coding tool could not download. Your earlier pack is kept.",
        );
      const buffer = await r.clone().arrayBuffer();
      const hash = Array.from(
        new Uint8Array(await crypto.subtle.digest("SHA-256", buffer)),
        (v) => v.toString(16).padStart(2, "0"),
      ).join("");
      if (buffer.byteLength !== f.size || hash !== f.sha256)
        throw new Error(
          "A download was incomplete. Reconnect and download again.",
        );
      await cache.put(url.href, r);
      bytes += f.size;
      port.postMessage({
        type: "progress",
        done: i + 1,
        total: manifest.files.length,
        bytes,
      });
    }
    if (
      !(await cache.match(new URL("/offline.html", self.location.origin).href))
    )
      throw new Error("The offline app did not download.");
    await cache.put(
      new URL("/offline-pack.json", self.location.origin).href,
      new Response(JSON.stringify(manifest), {
        headers: { "Content-Type": "application/json" },
      }),
    );
    await (
      await caches.open(CONFIG)
    ).put(
      KEY,
      new Response(
        JSON.stringify({
          name,
          version: manifest.version,
          size: manifest.size,
          paths: manifest.files.map((f) => f.path),
          downloadedAt: new Date().toISOString(),
        }),
        { headers: { "Content-Type": "application/json" } },
      ),
    );
    for (const key of await caches.keys())
      if (key.startsWith("codequest-static-") && key !== name)
        await caches.delete(key);
    port.postMessage({ type: "ready", size: manifest.size });
  } catch (e) {
    if (old?.name !== name) await caches.delete(name);
    throw e;
  }
}
self.addEventListener("message", (event) => {
  const port = event.ports[0];
  if (!port || event.data?.type !== "download-pack") return;
  if (downloading) {
    port.postMessage({
      type: "error",
      message: "A download is already running in another tab.",
    });
    return;
  }
  downloading = download(port)
    .catch((e) => port.postMessage({ type: "error", message: e.message }))
    .finally(() => {
      downloading = null;
    });
  event.waitUntil(downloading);
});
self.addEventListener("fetch", (event) => {
  const req = event.request,
    url = new URL(req.url);
  if (
    req.method !== "GET" ||
    url.origin !== self.location.origin ||
    url.pathname.startsWith("/api/") ||
    url.pathname.includes("signin") ||
    url.pathname.includes("auth")
  )
    return;
  const navigation =
    req.mode === "navigate" &&
    (url.pathname === "/" || url.pathname === "/offline.html");
  if (!navigation && !allowed(url.pathname)) return;
  event.respondWith(
    (async () => {
      try {
        return await fetch(req);
      } catch (error) {
        const info = await active();
        if (!info) throw error;
        const cache = await caches.open(info.name);
        const fallback = await cache.match(
          navigation
            ? new URL("/offline.html", self.location.origin).href
            : new URL(url.pathname, self.location.origin).href,
        );
        if (fallback) return fallback;
        throw error;
      }
    })(),
  );
});
