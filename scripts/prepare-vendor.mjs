import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL('../', import.meta.url));
const manifest = JSON.parse(await readFile(path.join(root, 'public/vendor/manifest.json'), 'utf8'));
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
let downloaded = 0;
for (const asset of manifest) {
  if (!asset.path.startsWith('/vendor/') || asset.path.includes('..')) throw new Error('Invalid runtime path.');
  const file = path.join(root, 'public', asset.path.slice(1));
  const cached = await readFile(file).catch(() => null);
  if (cached && cached.length === asset.size && sha(cached) === asset.sha256) continue;
  const source = new URL(asset.source);
  if (source.protocol !== 'https:' || source.hostname !== 'cdn.jsdelivr.net') throw new Error('Unexpected runtime source.');
  const response = await fetch(source, {signal: AbortSignal.timeout(60000)});
  if (!response.ok) throw new Error(`Runtime download failed (${response.status}): ${asset.path}`);
  const bytes = Buffer.from(await response.arrayBuffer());
  if (bytes.length !== asset.size || sha(bytes) !== asset.sha256) throw new Error(`Runtime verification failed: ${asset.path}`);
  await mkdir(path.dirname(file), {recursive:true});
  await writeFile(file, bytes);
  downloaded++;
}
console.log(`Verified ${manifest.length} pinned runtime files; downloaded ${downloaded}.`);
