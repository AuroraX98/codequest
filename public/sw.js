/* Static learning downloads only. No API, auth, account response, or cross-origin cache. */
const CONFIG = "codequest-download-config-v1";
const KEY = new URL("/__codequest_downloads__", self.location.origin).href;
const allowed = (path) =>
  path === "/offline.html" ||
  path === "/runner/frame.html" ||
  path === "/runner/frame.base64.txt" ||
  path === "/favicon.svg" ||
  path === "/companion/codequest-swift-runner.py" ||
  path === "/companion/README.txt" ||
  path === "/manifest.webmanifest" ||
  path === "/offline-pack.json" ||
  path.startsWith("/offline-assets/") ||
  path.startsWith("/vendor/");
const htmlCarriers = {
  "/offline.html": "/offline-assets/offline-shell.base64.txt",
  "/runner/frame.html": "/runner/frame.base64.txt",
};
function validHTMLDownload(file) {
  const carrier = htmlCarriers[file.path];
  return !!(
    carrier &&
    Number.isSafeInteger(file.size) &&
    file.size > 0 &&
    file.size <= 2000000 &&
    /^[a-f0-9]{64}$/.test(file.sha256) &&
    file.transport &&
    file.transport.encoding === "base64" &&
    file.transport.path === carrier &&
    file.transport.size === 4 * Math.ceil(file.size / 3) &&
    /^[a-f0-9]{64}$/.test(file.transport.sha256)
  );
}
async function sha256(bytes) {
  return Array.from(
    new Uint8Array(await crypto.subtle.digest("SHA-256", bytes)),
    (value) => value.toString(16).padStart(2, "0"),
  ).join("");
}
async function decodedHTML(file, encoded) {
  if (
    encoded.byteLength !== file.transport.size ||
    (await sha256(encoded)) !== file.transport.sha256
  )
    throw new Error("A download was incomplete. Reconnect and download again.");
  const text = new TextDecoder().decode(encoded);
  if (
    !/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(
      text,
    )
  )
    throw new Error("A download was incomplete. Reconnect and download again.");
  const decoded = atob(text);
  const bytes = new Uint8Array(decoded.length);
  for (let i = 0; i < decoded.length; i++) bytes[i] = decoded.charCodeAt(i);
  if (
    bytes.byteLength !== file.size ||
    (await sha256(bytes.buffer)) !== file.sha256
  )
    throw new Error("A download was incomplete. Reconnect and download again.");
  return new Response(bytes.buffer, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
function expectedStaticResponse(path, response) {
  if (!response.ok) return false;
  try {
    const requested = new URL(path, self.location.origin);
    if (
      requested.origin !== self.location.origin ||
      !allowed(requested.pathname) ||
      requested.search ||
      requested.hash
    )
      return false;
    if (!response.redirected) return true;
    const canonical = {
      "/runner/frame.html": "/runner/frame",
      "/offline.html": "/offline",
    }[requested.pathname];
    if (!canonical) return false;
    const actual = new URL(response.url);
    return (
      actual.origin === self.location.origin &&
      actual.pathname === canonical &&
      !actual.search &&
      !actual.hash
    );
  } catch {
    return false;
  }
}
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
  if (!expectedStaticResponse("/offline-pack.json", response))
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
      const html = Object.prototype.hasOwnProperty.call(htmlCarriers, f.path);
      if ((html && !validHTMLDownload(f)) || (!html && f.transport))
        throw new Error("Unexpected file in the offline pack.");
      const transport = html
        ? new URL(f.transport.path, self.location.origin)
        : url;
      const r = await fetch(transport.href, {
        credentials: "same-origin",
        cache: "reload",
      });
      if (!expectedStaticResponse(transport.href, r))
        throw new Error(
          "A coding tool could not download. Your earlier pack is kept.",
        );
      const buffer = await r.clone().arrayBuffer();
      if (
        !html &&
        (buffer.byteLength !== f.size || (await sha256(buffer)) !== f.sha256)
      )
        throw new Error(
          "A download was incomplete. Reconnect and download again.",
        );
      // Cache verified bytes with an ordinary response so an offline navigation
      // does not inherit the hosting layer's canonical redirect metadata.
      let stored = html ? await decodedHTML(f, buffer) : r;
      if (!html && r.redirected) {
        const headers = new Headers(r.headers);
        // fetch already decoded these bytes. Keep content type and security
        // headers, while removing metadata for the compressed network body.
        headers.delete("Content-Encoding");
        headers.delete("Content-Length");
        stored = new Response(buffer, {
          status: r.status,
          statusText: r.statusText,
          headers,
        });
      }
      await cache.put(url.href, stored);
      bytes += html ? f.transport.size : f.size;
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
    (url.pathname === "/" ||
      url.pathname === "/offline.html" ||
      url.pathname === "/offline");
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
