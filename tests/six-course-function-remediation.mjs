import {historicalTypeScriptBaseline} from './python-authorized-baseline.mjs';
import assert from 'node:assert/strict';import fs from 'node:fs';import{createHash}from'node:crypto';import{historicalSixCourseBaseline,historicalBenchmarkBaseline}from'./python-authorized-baseline.mjs';
const read=p=>JSON.parse(fs.readFileSync(p,'utf8')),root='docs/six-course-function-remediation/';
const canonical=x=>Array.isArray(x)?x.map(canonical):x&&typeof x==='object'?Object.fromEntries(Object.keys(x).sort().map(k=>[k,canonical(x[k])])):x;
const hash=x=>createHash('sha256').update(JSON.stringify(canonical(x))).digest('hex');
const lessons=read('content/lessons.json'),units=read('content/catalog.json').units,terms=read('content/terminology.json'),base=read(root+'preservation-baseline.json'),deltas=read(root+'paragraph-deltas.json');
assert.equal(lessons.length,1088);assert.equal(terms.length,942);assert.equal(deltas.length,105);assert.equal(new Set(deltas.map(d=>d.lessonId)).size,91);
assert.equal(hash(historicalSixCourseBaseline(lessons.slice(0,928))),base.lessons);assert.equal(hash(historicalBenchmarkBaseline(units.slice(0,928))),base.units);assert.equal(hash(terms.slice(0,782)),base.terms);
const by=new Map(lessons.map(l=>[l.id,l]));for(const l of historicalTypeScriptBaseline(lessons.slice(0,928)))assert.equal(l.explanation.length,base.paragraphCounts[l.id]);
for(const d of deltas)assert.equal(by.get(d.lessonId).explanation[d.paragraph],d.after);
for(const p of ['ruby-r/updated-lessons.json','jvm-systems/staged-lessons.json'])for(const l of read(root+p))assert.deepEqual(by.get(l.id),l);
let anchors=0;for(const e of read(root+'ruby-r/before-after-evidence.json'))for(const key of ['purpose','inputs','resultOrEffect','example'])for(const a of e.after[key]??[]){assert.ok(by.get(a.lessonId).explanation[a.paragraph].includes(a.quote));anchors++;}
for(const a of read(root+'jvm-systems/target-evidence.json')){assert.ok(by.get(a.lessonId).explanation[a.paragraph].includes(a.quote));anchors++;}
const rr=read(root+'ruby-r/verification-summary.json');assert.equal(rr.newSnippetPass,28);assert.equal(rr.contractProbePass,13);assert.equal(rr.unexpectedWarnings,0);
for(const[p,h]of Object.entries(rr.files))assert.equal(createHash('sha256').update(fs.readFileSync(root+'ruby-r/'+p)).digest('hex'),h);
const j=read(root+'jvm-systems/runtime-reconciliation.json');assert.equal(j.status,'pass');assert.equal(j.executions,131);assert.equal(j.results.length,131);assert.ok(j.results.every(r=>r.status==='pass'));assert.equal(j.allCurrentSourceHashesMatch,true);
console.log('PASS 105 exact paragraphs/91 lessons, '+anchors+' visible support anchors; all928 IDs, quizzes, checks, paragraph positions, units and terms preserved;28 snippets+13 probes+131 JVM/systems outcomes verified.');
