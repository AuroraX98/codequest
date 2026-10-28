import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';
const read=p=>fs.readFileSync(p,'utf8');
const hash=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const manifest=JSON.parse(read('public/offline-pack.json'));
const root='public/third-party/';
const names=fs.readdirSync(root+'licenses');assert.equal(names.length,21);
for(const name of names){const p='/third-party/licenses/'+name;const item=manifest.files.find(f=>f.path===p);assert.ok(item,p);assert.equal(item.sha256,hash('public'+p));assert.ok(fs.existsSync('dist/client'+p));}
for(const name of ['README.txt','sources.json','vendor-integrity.json'])assert.ok(manifest.files.some(f=>f.path==='/third-party/'+name));
assert.match(read(root+'README.txt'),/remain under review/);
assert.match(read('components/CodeQuest.tsx'),/href="\/third-party\/README.txt"/);
assert.match(read('public/sw.js'),/path.startsWith\("\/third-party\/"\)/);
for(const name of ['file.svg','globe.svg','window.svg']){assert.ok(!fs.existsSync('public/'+name));assert.ok(!fs.existsSync('dist/client/'+name));assert.ok(!read('dist/server/index.js').includes('"/'+name+'"'));}
assert.ok(fs.existsSync('build/sites-vite-plugin.LICENSE'));assert.ok(fs.existsSync('vendor/shadcn-tailwind-4.13.0.LICENSE.md'));
console.log('PASS21 notice texts,24 notice artifacts in offline manifest, discoverable footer, retained original notices, three unused assets absent from clean build. Complete dependency/license closure not claimed.');
