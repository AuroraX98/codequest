import {historicalPythonBaseline} from './python-authorized-baseline.mjs';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
import ts from 'typescript';
const read=p=>fs.readFile(p,'utf8');
const lessons=JSON.parse(await read('content/lessons.json')),catalog=JSON.parse(await read('content/catalog.json')),terms=JSON.parse(await read('content/terminology.json'));
const base=JSON.parse(await read('docs/new-languages/preservation-baseline.json'));
const canonical=x=>Array.isArray(x)?x.map(canonical):x&&typeof x==='object'?Object.fromEntries(Object.keys(x).sort().map(k=>[k,canonical(x[k])])):x;
const hash=x=>createHash('sha256').update(JSON.stringify(canonical(historicalPythonBaseline(x)))).digest('hex');
assert.equal(hash(lessons.slice(0,243)),base.lessons243);
assert.equal(hash(catalog.units.slice(0,243)),base.units243);
// Follow-on terminology correction intentionally neutralizes examples and scopes three language-specific terms.
for(const old of base.terminology150){const current=terms.find(t=>t.id===old.id);for(const k of ['id','name','aliases','category','kind'])assert.deepEqual(current[k],old[k]);if(!['tuple','indentation'].includes(old.id))assert.equal(current.meaning,old.meaning);for(const l of old.links??[])assert.ok(current.links.some(x=>JSON.stringify(x)===JSON.stringify(l)));if(!old.languages?.length&&!['prop','attribute','selector'].includes(old.id))assert.ok(!current.languages?.length);}
const app=await read('components/CodeQuest.tsx');assert.ok(app.includes('conceptOnly ? "concept lessons" : "lessons"'));assert.ok(!app.includes('id === "ai" ? "concept lessons"'));
assert.equal(lessons.length,1088);assert.equal(terms.length,942);assert.equal(new Set(catalog.units.map(u=>u.track)).size,21);
const tracks=['csharp','cpp','java','c','kotlin','go','rust','php','ruby','r'];
const names={'csharp':'C#',cpp:'C++',java:'Java',c:'C',kotlin:'Kotlin',go:'Go',rust:'Rust',php:'PHP',ruby:'Ruby',r:'R'};
const dir=path.resolve('.sites-runtime/new-language-test');await fs.mkdir(dir,{recursive:true});const done=new Set();
async function compile(file){if(done.has(file))return;done.add(file);let out=ts.transpileModule(await read('lib/'+file+'.ts'),{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext}}).outputText;for(const match of out.matchAll(/from ["']\.\/([^"']+)["']/g))await compile(match[1]);out=out.replace(/from ["']\.\/([^"']+)["']/g,'from "./$1.mjs"');await fs.writeFile(path.join(dir,file+'.mjs'),out);}
try{
 for(const file of ['navigation','lesson-completion','lesson-step-flow','code-language'])await compile(file);
 const {normalizeRoute,parseRoute,routeHash}=await import(path.join(dir,'navigation.mjs'));
 const {buildLessonSteps}=await import(path.join(dir,'lesson-step-flow.mjs'));
 const {codeLabel,codeLanguage}=await import(path.join(dir,'code-language.mjs'));
 const {getReadingSectionKeys,getLessonCompletion}=await import(path.join(dir,'lesson-completion.mjs'));
 let examples=0;
 for(const track of tracks){
  const units=catalog.units.filter(u=>u.track===track && Number(u.id.split('-').at(-1))<=6);assert.equal(units.length,6,track);
  assert.equal(codeLabel(track),names[track]);assert.equal(codeLanguage(track),null,'no fabricated parser/runtime');
  assert.ok(terms.some(t=>t.languages?.includes(track)));
  for(const u of units){
   const l=lessons.find(l=>l.id===u.id);assert.equal(l.learningMode,'concept');assert.equal(l.runtime,'javascript');assert.equal(l.starter,'');assert.equal(l.solution,'');assert.deepEqual(l.checks,[]);assert.ok(l.externalNotes);
   for(const id of u.prerequisite_ids??[])assert.ok(catalog.units.some(x=>x.id===id));
   for(const view of ['quest','terminology','path','progress']){const r=normalizeRoute({activeId:l.id,view,phase:'learn',paragraph:1},l.id,catalog.units,lessons);assert.equal(r.view,view);assert.equal(parseRoute(routeHash(r),l.id,catalog.units,lessons).activeId,l.id);}
   for(const input of [{view:'studio',phase:'build'},{view:'quest',phase:'build'},{view:'quest',phase:'math'}]){const r=normalizeRoute({...input,activeId:l.id},l.id,catalog.units,lessons);assert.equal(r.view,'studio');assert.equal(r.phase,'build');}
   const keys=getReadingSectionKeys(l);assert.equal(keys.length,l.explanation.length);
   const marks=keys.map(sectionKey=>({lessonId:l.id,sectionKey,checked:true}));const s=getLessonCompletion(l,{unitId:l.id,quizPassed:1},marks);assert.equal(s.percent,100);assert.equal(s.projectCompleted,false);
   assert.ok(getLessonCompletion(l,{unitId:l.id,quizPassed:1},marks.slice(1)).percent<100);
   for(const p of l.explanation){const steps=buildLessonSteps(p,l.runtime);for(const m of p.matchAll(/```([^\n]*)\n([\s\S]*?)```/g)){const language=m[1].trim();if(language===track){assert.ok(steps.some(s=>s.kind==='example'&&s.language===track),l.id+' code remains example');examples++;}}assert.equal(steps.filter(s=>s.kind==='practice').length,0,'only authored language checks, no JS-generated exercise');}
  }
 }
 console.log('PASS all60 lessons/10 new tracks: preserved243 objects/150 term identities,698 terms, route roundtrip/legacy redirect, actual reading completion, '+examples+' correctly labeled source examples, no new parser/runtime or generated JavaScript checks.');
}finally{await fs.rm(dir,{recursive:true,force:true});}
