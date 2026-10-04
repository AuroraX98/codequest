import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import path from "node:path";
const publicRoot = path.resolve("public");
const manifest = JSON.parse(
  await readFile(path.join(publicRoot, "offline-pack.json"), "utf8"),
);
const expected = new Map([
  ["/offline.html", "/offline-assets/offline-shell.base64.txt"],
  ["/runner/frame.html", "/runner/frame.base64.txt"],
]);
const digest = (bytes) => createHash("sha256").update(bytes).digest("hex");
assert.equal(
  manifest.version,
  digest(JSON.stringify(manifest.files)).slice(0, 20),
  "Version includes transport metadata",
);
assert.equal(
  new Set(manifest.files.map((file) => file.path)).size,
  manifest.files.length,
  "No duplicate logical entries",
);
let downloadBytes = 0;
for (const file of manifest.files) {
  assert.match(
    file.path,
    /^\/(?:offline\.html|runner\/frame\.html|offline-assets\/|vendor\/|companion\/|favicon\.svg|manifest\.webmanifest)/,
  );
  const original = await readFile(path.join(publicRoot, file.path.slice(1)));
  assert.equal(original.length, file.size, `Original size: ${file.path}`);
  assert.equal(digest(original), file.sha256, `Original hash: ${file.path}`);
  if (expected.has(file.path)) {
    assert.ok(file.transport, `HTML requires a carrier: ${file.path}`);
    assert.equal(file.transport.path, expected.get(file.path));
    assert.equal(file.transport.encoding, "base64");
    const carrier = await readFile(
      path.join(publicRoot, file.transport.path.slice(1)),
    );
    assert.equal(carrier.length, file.transport.size);
    assert.equal(digest(carrier), file.transport.sha256);
    const text = carrier.toString("ascii");
    assert.match(
      text,
      /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/,
      "Canonical base64 without whitespace",
    );
    assert.equal(
      original.toString("base64"),
      text,
      "Transport preserves exact original source",
    );
    const decoded = Buffer.from(text, "base64");
    assert.deepEqual(decoded, original);
    assert.equal(digest(decoded), file.sha256);
    assert.ok(
      !manifest.files.some((entry) => entry.path === file.transport.path),
      "Carrier is not double-counted",
    );
    downloadBytes += carrier.length;
  } else {
    assert.equal(
      file.transport,
      undefined,
      "Only approved HTML aliases use carriers",
    );
    downloadBytes += original.length;
  }
}
assert.equal(manifest.files.filter((file) => file.transport).length, 2);
assert.equal(
  manifest.size,
  downloadBytes,
  "Pack size counts actual transport bytes",
);
const shell = await readFile(path.join(publicRoot, "offline.html"), "utf8");
for (const [, reference] of shell.matchAll(/(?:src|href)="(\/[^"#?]+)"/g)) {
  assert.ok(
    manifest.files.some((file) => file.path === reference),
    `Shell dependency is included: ${reference}`,
  );
}
console.log(
  `Passed all ${manifest.files.length} offline artifact sizes/hashes, two exact base64 HTML transports, decoded source fidelity, manifest version/download size, and shell dependency coverage.`,
);
