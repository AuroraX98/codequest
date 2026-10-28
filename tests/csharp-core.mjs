import {historicalPythonBaseline} from './python-authorized-baseline.mjs';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {createHash} from 'node:crypto';
const read=p=>fs.readFile(p,'utf8');
const lessons=JSON.parse(await read('content/lessons.json')),catalog=JSON.parse(await read('content/catalog.json')),terms=JSON.parse(await read('content/terminology.json'));
const baseline=JSON.parse(await read('docs/csharp-core-v1/preservation-baseline.json')),frozen=JSON.parse(await read('docs/csharp-core-v1/all-fifty-seven.json'));
const canonical=x=>Array.isArray(x)?x.map(canonical):x&&typeof x==='object'?Object.fromEntries(Object.keys(x).sort().map(k=>[k,canonical(x[k])])):x;
const hash=x=>createHash('sha256').update(JSON.stringify(canonical(historicalPythonBaseline(x)))).digest('hex');
assert.equal(lessons.length,1088);assert.equal(terms.length,942);assert.equal(hash(lessons.slice(0,303)),baseline.lessons303);const priorUnits=JSON.parse(await read('docs/cpp-core-v1/preservation-baseline.json')).units360;assert.equal(hash(priorUnits.slice(0,303)),baseline.units303);assert.deepEqual(historicalPythonBaseline(catalog.units.slice(0,303)).map(({content_status,...u})=>u),priorUnits.slice(0,303).map(({content_status,...u})=>u));
for(const old of baseline.terms212){const current=terms.find(t=>t.id===old.id);assert.ok(current);for(const key of Object.keys(old).filter(k=>!['links','languages'].includes(k)))assert.deepEqual(current[key],old[key]);for(const lang of old.languages??[])assert.ok(current.languages.includes(lang));if(!old.languages)assert.equal(current.languages,undefined);for(const link of old.links??[])assert.ok(current.links.some(l=>JSON.stringify(l)===JSON.stringify(link)));}
assert.deepEqual(historicalPythonBaseline(lessons.slice(303,360)),frozen.lessons);assert.deepEqual(catalog.units.slice(303,360).map(({content_status,...u})=>u),frozen.units.map(({content_status,...u})=>u));
const csharp=catalog.units.filter(u=>u.track==='csharp');assert.equal(csharp.length,63);assert.deepEqual(csharp.map(u=>u.id),Array.from({length:63},(_,i)=>'csharp-'+String(i+1).padStart(2,'0')));
assert.deepEqual(new Set(csharp.map(u=>u.level)),new Set(['beginner','intermediate','advanced']));
for(const unit of frozen.units){const n=Number(unit.id.split('-')[1]);assert.ok(unit.prerequisite_ids.includes('csharp-'+String(n-1).padStart(2,'0')));for(const p of unit.prerequisite_ids)assert.ok(catalog.units.find(u=>u.id===p));}
for(const l of frozen.lessons){assert.equal(l.learningMode,'concept');assert.equal(l.runtime,'javascript');assert.equal(l.starter,'');assert.equal(l.solution,'');assert.equal(l.filename,'');assert.deepEqual(l.checks,[]);assert.equal(l.math,null);assert.ok(l.explanation.length);assert.ok(l.quiz.choices[l.quiz.answer]);assert.ok(l.externalNotes);}
const heads=JSON.parse(await read('docs/csharp-core-v1/all-headings.json'));assert.equal(Object.keys(heads).length,57);
for(const [id,entries]of Object.entries(heads)){const l=lessons.find(l=>l.id===id);assert.equal(entries[0].index,0);for(const e of entries){assert.ok(l.explanation[e.index]);assert.doesNotMatch(e.title,/^Try a changed case$|^Optional local setup$|^Example$/i);}}
const support=JSON.parse(await read('docs/csharp-core-v1/all-support-maps.json'));const rows=Object.values(support).flat();assert.equal(new Set(rows.map(r=>r.id)).size,57);
const allowedCategories=new Set(['basics','collections','data','flow','software','language-tools','web','security','ai']);
for(const t of terms.slice(212,264)){assert.ok(allowedCategories.has(t.category));assert.ok(t.languages.includes('csharp'));assert.ok(t.languages.every(x=>['csharp','cpp','java','c','kotlin','go','rust','php','ruby'].includes(x)));for(const link of t.links??[])assert.ok(lessons.find(l=>l.id===link.lessonId)?.explanation[link.paragraph]);}
for(const id of ['csharp-core-30','csharp-core-40','csharp-core-41','csharp-core-56'])assert.equal(terms.find(t=>t.id===id).links[0].paragraph,1);
console.log('PASS bounded C#63 (57 additions), three levels/ordered prerequisites, exact frozen lesson objects, preserved303 lessons/units and212 term definitions,264 terms,57 semantic support records/grouped TOCs, honest no-runtime concept contracts. Later C# compiler evidence is independently recorded.');
