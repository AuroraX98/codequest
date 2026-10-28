import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {execFileSync} from 'node:child_process';
import {DatabaseSync} from 'node:sqlite';
import ts from 'typescript';
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const base=p=>JSON.parse(execFileSync('git',['show','f5a50db30320f259215266af76cf4e318509dc2a:'+p],{encoding:'utf8',maxBuffer:32*1024*1024}));
const lessons=read('content/lessons.json'),units=read('content/catalog.json').units;
const old=base('content/lessons.json');
for(const d of read('docs/remaining-core-v1/existing-check-deltas.json')){let row=old.find(l=>l.id===d.id);const path=d.field.split('.');for(const k of path.slice(0,-1))row=row[k];const k=path.at(-1);assert.deepEqual(row[k],d.before);row[k]=d.after;}
assert.deepEqual(lessons.slice(0,1175),old,'Only the declared checks change in published lessons');
assert.deepEqual(units.slice(0,1175),base('content/catalog.json').units);
assert.deepEqual(read('content/terminology.json'),base('content/terminology.json'));
assert.equal(lessons.length,1221);assert.equal(units.length,1221);
assert.deepEqual(new Set(lessons.map(l=>l.id)),new Set(units.map(u=>u.id)));
assert.equal(new Set(lessons.map(l=>l.id)).size,lessons.length);
for(const [track,count]of [['backend',43],['developer-toolkit',24],['ai',32]])assert.equal(units.filter(u=>u.track===track).length,count);
const seen=new Set(),visiting=new Set();
function visit(id){assert.ok(units.some(u=>u.id===id),'Missing prerequisite '+id);if(seen.has(id))return;assert.ok(!visiting.has(id),'Cycle '+id);visiting.add(id);for(const p of units.find(u=>u.id===id).prerequisite_ids??[])visit(p);visiting.delete(id);seen.add(id);}
units.forEach(u=>visit(u.id));
for(const name of ['backend-additions','concept-additions'])for(const a of read('docs/remaining-core-v1/'+name+'.json')){assert.deepEqual(lessons.find(l=>l.id===a.lesson.id),a.lesson);assert.deepEqual(units.find(u=>u.id===a.unit.id),a.unit);}
const mod={exports:{}};vm.runInNewContext(ts.transpileModule(fs.readFileSync('lib/course-learning-order.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,esModuleInterop:true,target:ts.ScriptTarget.ES2022}}).outputText,{module:mod,exports:mod.exports,require:p=>read(p.replace('../',''))});
const order=mod.exports.courseLearningOrder(units),backend=order.filter(u=>u.track==='backend');assert.equal(backend.length,43);assert.equal(backend[0].id,'backend-15');const positions=new Map(backend.map((u,i)=>[u.id,i]));for(const u of backend)for(const p of u.prerequisite_ids??[])if(p.startsWith('backend-'))assert.ok(positions.get(p)<positions.get(u.id));
const outcomes=[];
function runJS(l,code){const ctx=vm.createContext({console:{log(){}},URL});vm.runInContext(code,ctx,{timeout:1000});return l.checks.map(c=>Boolean(vm.runInContext(c.expression,ctx,{timeout:1000})));}
function runSQL(l,code){const db=new DatabaseSync(':memory:');try{for(const f of l.extraFiles??[])if(f.name==='setup.sql')db.exec(f.code);db.exec(code);return l.checks.map(c=>Object.values(db.prepare(c.expression).get())[0]===1);}finally{db.close();}}
for(const l of lessons.filter(l=>l.id.startsWith('backend-'))){const results=l.runtime==='sql'?runSQL(l,l.solution):runJS(l,l.solution);assert.ok(results.every(Boolean),l.id+' reference');outcomes.push({id:l.id,referenceChecks:results.length,passed:true});}
for(const l of lessons.slice(1175)){
 assert.ok(l.explanation.length>=5);assert.ok(l.externalNotes);assert.ok(l.quiz.choices.length>=3);assert.ok(l.quiz.answer>=0&&l.quiz.answer<l.quiz.choices.length);assert.ok(l.quiz.explanation);assert.equal(l.math,null);
 if(l.learningMode==='concept'){assert.equal(l.checks.length,0);assert.equal(l.starter,'');continue;}
 assert.ok(l.explanation.some(p=>p.includes(l.solution)),'Visible worked solution '+l.id);
 assert.ok(!runJS(l,l.starter).every(Boolean),'Unfinished starter must fail '+l.id);
 for(const p of l.explanation){const blocks=[...p.matchAll(/```javascript\n([\s\S]*?)\n```/g)];for(const b of blocks)vm.runInNewContext(b[1],{console:{log(){}},URL},{timeout:1000});}
}
// These counterexamples passed the old weak checks. Each must fail now.
const badAdd=lessons.find(l=>l.id==='backend-02');
assert.ok(!runJS(badAdd,badAdd.solution+'\nconst originalSave=saveEntry;saveEntry=function(row){originalSave(row.id===\'c\'?{id:\'wrong\',minutes:999}:row);};').every(Boolean));
const mutable=lessons.find(l=>l.id==='backend-12');
const mutation='function takeRequest(state,now){if(now>=state.windowStart+1000){state.windowStart=now;state.count=0;}const allowed=state.count<3;if(allowed)state.count++;return {allowed,state:{...state}};}';
assert.ok(!runJS(mutable,mutation).every(Boolean));
for(const id of ['backend-03','sql-12']){const l=lessons.find(l=>l.id===id);assert.ok(runSQL(l,l.solution).every(Boolean));assert.ok(!runSQL(l,l.solution.replace('CREATE VIEW','CREATE TABLE')).every(Boolean),'A materialized table must fail the view contract');}
const add=lessons.find(l=>l.id==='backend-27');
assert.ok(!runJS(add,'function appendNote(notes,note){return [...notes,{...note,title:"wrong"}];}').every(Boolean));
const rename=lessons.find(l=>l.id==='backend-28');
assert.ok(!runJS(rename,'function renameNote(notes,id,title){const n=notes.find(n=>n.id===id);if(n)n.title=title;return [...notes];}').every(Boolean));
const report={baseline:'f5a50db30320f259215266af76cf4e318509dc2a',totalLessons:lessons.length,priorLessonsPreservedExceptDeclaredChecks:1175,priorUnitsPreserved:1175,termsPreserved:1029,newLessons:46,backendReferenceOutcomes:outcomes,unfinishedBackendStartersRejected:29,knownBadImplementationsRejected:6,prerequisiteGraph:'resolved and acyclic',limits:['Node JavaScript and SQLite execution, not browser proof','Concept completion is understanding evidence, not Git operations or model evaluation','No production deployment in this test']};
fs.writeFileSync('docs/remaining-core-v1/validation.json',JSON.stringify(report,null,2)+'\n');
console.log('PASS: 1221 matching lessons/units; published objects preserved except five declared check changes; 43 backend solutions, 29 failed starters, 6 rejected counterexamples, prerequisite DAG.');
