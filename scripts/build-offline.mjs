import { build } from "vite";
import react from "@vitejs/plugin-react";
import { readFile, writeFile, readdir, stat, rename } from "node:fs/promises";
import path from "node:path";
import { createHash } from "node:crypto";
const root = process.cwd(),
  publicRoot = path.join(root, "public");
await build({
  configFile: false,
  root: path.join(root, "offline"),
  base: "/offline-assets/",
  publicDir: false,
  plugins: [react()],
  css: { postcss: path.join(root, "postcss.config.mjs") },
  build: {
    outDir: path.join(publicRoot, "offline-assets"),
    emptyOutDir: true,
    sourcemap: false,
  },
});
await rename(
  path.join(publicRoot, "offline-assets/index.html"),
  path.join(publicRoot, "offline.html"),
);
// The host can add instrumentation to HTML responses. Base64 text transports
// keep the source bytes intact; the download verifies and reconstructs HTML.
const transports = new Map([
  ["/offline.html", "/offline-assets/offline-shell.base64.txt"],
  ["/runner/frame.html", "/runner/frame.base64.txt"],
]);
for (const [logical, transport] of transports) {
  const bytes = await readFile(path.join(publicRoot, logical.slice(1)));
  await writeFile(
    path.join(publicRoot, transport.slice(1)),
    bytes.toString("base64"),
    "ascii",
  );
}
async function paths(dir) {
  let out = [];
  for (const entry of await readdir(dir)) {
    const p = path.join(dir, entry);
    if ((await stat(p)).isDirectory()) out.push(...(await paths(p)));
    else out.push(p);
  }
  return out;
}
const vendors = JSON.parse(
  await readFile(path.join(publicRoot, "vendor/manifest.json"), "utf8"),
);
const list = [
  path.join(publicRoot, "offline.html"),
  path.join(publicRoot, "runner/frame.html"),
  path.join(publicRoot, "favicon.svg"),
  path.join(publicRoot, "companion/codequest-swift-runner.py"),
  path.join(publicRoot, "companion/README.txt"),
  path.join(publicRoot, "manifest.webmanifest"),
  path.join(publicRoot, "vendor/manifest.json"),
  ...(await paths(path.join(publicRoot, "offline-assets"))).filter(
    (file) =>
      ![...transports.values()].some(
        (transport) => file === path.join(publicRoot, transport.slice(1)),
      ),
  ),
  ...vendors.map((v) => path.join(publicRoot, v.path.slice(1))),
];
const files = [];
for (const file of list) {
  const bytes = await readFile(file);
  const url = "/" + path.relative(publicRoot, file).split(path.sep).join("/");
  const transportPath = transports.get(url);
  const encoded = transportPath
    ? await readFile(path.join(publicRoot, transportPath.slice(1)))
    : undefined;
  files.push({
    path: url,
    size: bytes.length,
    sha256: createHash("sha256").update(bytes).digest("hex"),
    ...(transportPath && encoded
      ? {
          transport: {
            path: transportPath,
            size: encoded.length,
            sha256: createHash("sha256").update(encoded).digest("hex"),
            encoding: "base64",
          },
        }
      : {}),
  });
}
const version = createHash("sha256")
  .update(JSON.stringify(files))
  .digest("hex")
  .slice(0, 20);
await writeFile(
  path.join(publicRoot, "offline-pack.json"),
  JSON.stringify(
    {
      version,
      files,
      size: files.reduce((n, f) => n + (f.transport?.size ?? f.size), 0),
    },
    null,
    2,
  ),
);
console.log(
  JSON.stringify({
    offlinePack: version,
    files: files.length,
    megabytes:
      Math.round(
        files.reduce((n, f) => n + (f.transport?.size ?? f.size), 0) / 100000,
      ) / 10,
  }),
);
