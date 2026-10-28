import {historicalTypeScriptBaseline} from './python-authorized-baseline.mjs';
import assert from 'node:assert/strict';import fs from 'node:fs/promises';import{createHash}from'node:crypto';import{historicalCFamilyBaseline,historicalBenchmarkBaseline}from'./python-authorized-baseline.mjs';
const read=async p=>JSON.parse(await fs.readFile(p,'utf8'));
const canonical=x=>Array.isArray(x)?x.map(canonical):x&&typeof x==='object'?Object.fromEntries(Object.keys(x).sort().map(k=>[k,canonical(x[k])])):x;
const hash=x=>createHash('sha256').update(JSON.stringify(canonical(x))).digest('hex');
const root='docs/c-family-function-remediation/',lessons=await read('content/lessons.json'),units=(await read('content/catalog.json')).units,terms=await read('content/terminology.json'),base=await read(root+'preservation-baseline.json'),deltas=await read(root+'paragraph-deltas.json');
assert.equal(lessons.length,1088);assert.equal(terms.length,942);assert.equal(deltas.length,36);assert.equal(new Set(deltas.map(d=>d.lessonId)).size,34);
assert.equal(hash(historicalCFamilyBaseline(lessons.slice(0,928))),base.lessons928);assert.equal(hash(historicalBenchmarkBaseline(units.slice(0,928))),base.units928);assert.equal(hash(terms.slice(0,782)),base.terms782);
for(const l of historicalTypeScriptBaseline(lessons.slice(0,928)))assert.equal(l.explanation.length,base.paragraphCounts[l.id]);
for(const d of deltas)assert.equal(lessons.find(l=>l.id===d.lessonId).explanation[d.paragraph],d.after);
for(const l of await read(root+'lessons-proposed.json'))assert.deepEqual(lessons.find(x=>x.id===l.id),l);
const support=await read(root+'function-evidence.json');assert.equal(support.length,42);
for(const entry of support)assert.equal(lessons.find(l=>l.id===entry.lessonId).explanation[entry.paragraph],entry.visibleText);
const rerun=await read(root+'integration-rerun/results.json');assert.equal(rerun.length,21);assert.ok(rerun.every(r=>r.passed));
const cases=await read(root+'execution-cases.json');for(const result of rerun){const c=cases.find(c=>c.id===result.id);assert.equal(createHash('sha256').update(c.code).digest('hex'),result.codeSHA256);}
console.log('PASS exact36 authorized paragraphs/34 lessons,42 function anchors,21 fresh native reruns; all other928 lesson fields,units,terms,paragraph counts unchanged.');
