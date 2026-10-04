type DownloadInfo = {
  name: string;
  version: string;
  size: number;
  paths: string[];
  downloadedAt: string;
};
export type PackStatus = {
  ready: boolean;
  size: number;
  downloadedAt?: string;
  error?: string;
};
async function config() {
  if (!("caches" in window)) return null;
  const r = await (
    await caches.open("codequest-download-config-v1")
  ).match(new URL("/__codequest_downloads__", location.origin).href);
  return r ? ((await r.json()) as DownloadInfo) : null;
}
export async function packStatus(): Promise<PackStatus> {
  const d = await config();
  if (!d) return { ready: false, size: 0 };
  const cache = await caches.open(d.name);
  const results = await Promise.all(
    d.paths.map((p) => cache.match(new URL(p, location.origin).href)),
  );
  return {
    ready: results.every(Boolean),
    size: d.size,
    downloadedAt: d.downloadedAt,
    error: results.every(Boolean)
      ? undefined
      : "Some downloads are missing. Reconnect to repair the pack.",
  };
}
export async function registerOffline() {
  if (!("serviceWorker" in navigator) || !window.isSecureContext)
    throw new Error(
      "Offline downloads need a supported browser and a secure page.",
    );
  const registration = await navigator.serviceWorker.register("/sw.js", {
    scope: "/",
    updateViaCache: "none",
  });
  await navigator.serviceWorker.ready;
  await registration.update();
  const replacement = registration.installing ?? registration.waiting;
  if (replacement && replacement.state !== "activated") {
    await new Promise<void>((resolve, reject) => {
      const timeout = setTimeout(
        () =>
          finish(
            new Error(
              "The offline update is still preparing. Try again in a moment.",
            ),
          ),
        30000,
      );
      const changed = () => {
        if (replacement.state === "activated") finish();
        if (replacement.state === "redundant")
          finish(
            new Error(
              "The offline update could not start. Reconnect and try again.",
            ),
          );
      };
      const finish = (error?: Error) => {
        clearTimeout(timeout);
        replacement.removeEventListener("statechange", changed);
        if (error) reject(error);
        else resolve();
      };
      replacement.addEventListener("statechange", changed);
      changed();
    });
  }
  return registration;
}
export async function downloadPack(
  progress: (done: number, total: number) => void,
) {
  const registration = await registerOffline();
  await navigator.storage?.persist?.().catch(() => false);
  return new Promise<void>((resolve, reject) => {
    const channel = new MessageChannel();
    const timeout = setTimeout(() => {
      channel.port1.close();
      reject(
        new Error(
          "The download took too long. Your earlier pack is kept; try again online.",
        ),
      );
    }, 240000);
    channel.port1.onmessage = (e) => {
      const d = e.data;
      if (d.type === "progress") progress(d.done, d.total);
      if (d.type === "ready" || d.type === "error") {
        clearTimeout(timeout);
        channel.port1.close();
        if (d.type === "ready") resolve();
        else reject(new Error(d.message));
      }
    };
    registration.active?.postMessage({ type: "download-pack" }, [
      channel.port2,
    ]);
  });
}
export async function removePack() {
  for (const name of await caches.keys())
    if (
      name.startsWith("codequest-static-") ||
      name === "codequest-download-config-v1"
    )
      await caches.delete(name);
}
const bundles = new Map<
  string,
  Promise<Record<string, { bytes: ArrayBuffer; type: string }>>
>();
const canonicalHTML = {
  "/runner/frame.html": "/runner/frame",
  "/offline.html": "/offline",
} as const;
const htmlCarriers = {
  "/offline.html": "/offline-assets/offline-shell.base64.txt",
  "/runner/frame.html": "/runner/frame.base64.txt",
} as const;
type HTMLDownload = {
  path: string;
  size: number;
  sha256: string;
  transport: {
    path: string;
    size: number;
    sha256: string;
    encoding: "base64";
  };
};
function validHTMLDownload(
  value: unknown,
  path: string,
): value is HTMLDownload {
  if (!value || typeof value !== "object") return false;
  const file = value as HTMLDownload;
  const carrier = htmlCarriers[path as keyof typeof htmlCarriers];
  return !!(
    carrier &&
    file.path === path &&
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
async function sha256(bytes: ArrayBuffer) {
  return Array.from(
    new Uint8Array(await crypto.subtle.digest("SHA-256", bytes)),
    (value) => value.toString(16).padStart(2, "0"),
  ).join("");
}
async function verifiedHTML(path: string) {
  const list = await fetch("/offline-pack.json", {
    credentials: "same-origin",
    cache: "no-store",
  });
  if (!expectedStaticResponse("/offline-pack.json", list))
    throw new Error("Static download list unavailable.");
  const manifest: unknown = await list.json();
  const files = (manifest as { files?: unknown[] } | null)?.files;
  if (!Array.isArray(files))
    throw new Error("Static download list unavailable.");
  const matching = files.filter(
    (value) => (value as { path?: string } | null)?.path === path,
  );
  const file = matching[0];
  if (matching.length !== 1 || !validHTMLDownload(file, path))
    throw new Error("Static HTML download unavailable.");
  const response = await fetch(file.transport.path, {
    credentials: "same-origin",
  });
  if (!expectedStaticResponse(file.transport.path, response))
    throw new Error("Static HTML download unavailable.");
  const encoded = await response.arrayBuffer();
  if (
    encoded.byteLength !== file.transport.size ||
    (await sha256(encoded)) !== file.transport.sha256
  )
    throw new Error("Static HTML download incomplete.");
  const text = new TextDecoder().decode(encoded);
  if (
    !/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(
      text,
    )
  )
    throw new Error("Static HTML download incomplete.");
  const decoded = atob(text);
  const bytes = new Uint8Array(decoded.length);
  for (let i = 0; i < decoded.length; i++) bytes[i] = decoded.charCodeAt(i);
  if (
    bytes.byteLength !== file.size ||
    (await sha256(bytes.buffer)) !== file.sha256
  )
    throw new Error("Static HTML download incomplete.");
  return new Response(bytes.buffer, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
export function expectedStaticResponse(
  path: string,
  response: { ok: boolean; redirected: boolean; url: string },
  origin = location.origin,
) {
  if (!response.ok) return false;
  try {
    const requested = new URL(path, origin);
    if (requested.origin !== origin || requested.search || requested.hash)
      return false;
    if (!response.redirected) return true;
    const canonical =
      canonicalHTML[requested.pathname as keyof typeof canonicalHTML];
    if (!canonical) return false;
    const actual = new URL(response.url);
    return (
      actual.origin === origin &&
      actual.pathname === canonical &&
      !actual.search &&
      !actual.hash
    );
  } catch {
    return false;
  }
}
export async function staticResponse(path: string) {
  try {
    if (navigator.onLine) {
      if (Object.prototype.hasOwnProperty.call(htmlCarriers, path))
        return await verifiedHTML(path);
      const r = await fetch(path, { credentials: "same-origin" });
      if (expectedStaticResponse(path, r)) return r;
    }
  } catch {}
  const d = await config();
  const r = d
    ? await (
        await caches.open(d.name)
      ).match(new URL(path, location.origin).href)
    : undefined;
  if (!r)
    throw new Error(
      "This coding tool is not downloaded. Reconnect and choose Download offline pack in Settings.",
    );
  return r;
}
export function runnerAssets(runtime: string) {
  if (!["python", "sql", "typescript", "react"].includes(runtime))
    return Promise.resolve({});
  let promise = bundles.get(runtime);
  if (!promise) {
    promise = (async () => {
      const list = (await (
        await staticResponse("/vendor/manifest.json")
      ).json()) as {
        source: string;
        path: string;
        sha256: string;
        type: string;
      }[];
      const files = list.filter((f) =>
        f.path.startsWith(
          "/vendor/" + (runtime === "python" ? "pyodide" : runtime) + "/",
        ),
      );
      const assets: Record<string, { bytes: ArrayBuffer; type: string }> = {};
      await Promise.all(
        files.map(async (f) => {
          const bytes = await (await staticResponse(f.path)).arrayBuffer();
          const hash = Array.from(
            new Uint8Array(await crypto.subtle.digest("SHA-256", bytes)),
            (v) => v.toString(16).padStart(2, "0"),
          ).join("");
          if (hash !== f.sha256)
            throw new Error(
              "A coding tool needs a fresh download. Repair the offline pack in Settings.",
            );
          assets[f.source] = { bytes, type: f.type };
        }),
      );
      return assets;
    })();
    bundles.set(runtime, promise);
    promise.catch(() => bundles.delete(runtime));
  }
  return promise;
}
