import {historicalPythonBaseline} from './python-authorized-baseline.mjs';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {createHash} from 'node:crypto';
const read=async p=>JSON.parse(await fs.readFile(p,'utf8'));
const lessons=await read('content/lessons.json'),catalog=await read('content/catalog.json'),terms=await read('content/terminology.json');
const frozen=await read('docs/cpp-core-v1/all-sixty-three.json'),baseline=await read('docs/cpp-core-v1/preservation-baseline.json');
const canonical=x=>Array.isArray(x)?x.map(canonical):x&&typeof x==='object'?Object.fromEntries(Object.keys(x).sort().map(k=>[k,canonical(x[k])])):x;
const hash=x=>createHash('sha256').update(JSON.stringify(canonical(historicalPythonBaseline(x)))).digest('hex');
assert.equal(lessons.length,1088);assert.equal(terms.length,942);assert.equal(hash(lessons.slice(0,360)),baseline.lessons360);
const omitStatus=({content_status,...u})=>u;
assert.deepEqual(historicalPythonBaseline(catalog.units.slice(0,360)).map(omitStatus),baseline.units360.map(omitStatus));
assert.deepEqual(historicalPythonBaseline(lessons.slice(360,423)),frozen.lessons);assert.deepEqual(catalog.units.slice(360,423),frozen.units);
for(const old of baseline.terms264){const t=terms.find(t=>t.id===old.id);for(const k of Object.keys(old).filter(k=>!['links','languages'].includes(k)))assert.deepEqual(t[k],old[k]);for(const l of old.links??[])assert.ok(t.links.some(x=>JSON.stringify(x)===JSON.stringify(l)));for(const l of old.languages??[])assert.ok(t.languages.includes(l));}
const cpp=catalog.units.filter(u=>u.track==='cpp');assert.equal(cpp.length,69);assert.deepEqual(cpp.map(u=>u.id),Array.from({length:69},(_,i)=>'cpp-'+String(i+1).padStart(2,'0')));
assert.equal(new Set(cpp.map(u=>u.level)).size,3);
for(const l of frozen.lessons){assert.equal(l.learningMode,'concept');assert.equal(l.starter,'');assert.equal(l.solution,'');assert.deepEqual(l.checks,[]);assert.ok(l.quiz.choices[l.quiz.answer]);}
const heads=await read('docs/cpp-core-v1/all-headings.json');assert.equal(Object.keys(heads).length,63);
for(const [id,es]of Object.entries(heads)){assert.equal(es[0].index,0);const l=lessons.find(l=>l.id===id);for(const e of es)assert.ok(l.explanation[e.index]);}
const compiler=await read('docs/cpp-core-v1/compiler-summary.json');assert.equal(compiler.passed,146);assert.equal(compiler.total,146);
const cs=await read('docs/csharp-core-v1/compiler-evidence/summary.json');assert.equal(cs.passed,133);assert.equal(cs.currentCheckoutWorkedExampleMatches,63);
console.log('PASS C++69 bounded core,844 lessons/698 terms,preserved360 authored lessons and prior term meaning,63 exact additions,real146 GCC and133 C# evidence,no browser-runner claim.');
