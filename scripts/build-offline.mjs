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
  ...(await paths(path.join(publicRoot, "offline-assets"))),
  ...vendors.map((v) => path.join(publicRoot, v.path.slice(1))),
];
const files = [];
for (const file of list) {
  const bytes = await readFile(file);
  const url = "/" + path.relative(publicRoot, file).split(path.sep).join("/");
  files.push({
    path: url,
    size: bytes.length,
    sha256: createHash("sha256").update(bytes).digest("hex"),
  });
}
const version = createHash("sha256")
  .update(JSON.stringify(files))
  .digest("hex")
  .slice(0, 20);
await writeFile(
  path.join(publicRoot, "offline-pack.json"),
  JSON.stringify(
    { version, files, size: files.reduce((n, f) => n + f.size, 0) },
    null,
    2,
  ),
);
console.log(
  JSON.stringify({
    offlinePack: version,
    files: files.length,
    megabytes: Math.round(files.reduce((n, f) => n + f.size, 0) / 100000) / 10,
  }),
);
