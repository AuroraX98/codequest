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
export async function staticResponse(path: string) {
  try {
    if (navigator.onLine) {
      const r = await fetch(path, { credentials: "same-origin" });
      if (r.ok && !r.redirected) return r;
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
