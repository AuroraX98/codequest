import {historicalPythonBaseline} from './python-authorized-baseline.mjs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFile,writeFile,mkdir,rm} from 'node:fs/promises';
import ts from 'typescript';
const read=p=>readFile(new URL(p,import.meta.url),'utf8');
const lessons=JSON.parse(await read('../content/lessons.json')),catalog=JSON.parse(await read('../content/catalog.json'));
const ai=lessons.filter(l=>l.id.startsWith('ai-')),stdlib=lessons.filter(l=>/^python-(39|4[0-6])$/.test(l.id));
const canonical=x=>Array.isArray(x)?x.map(canonical):x&&typeof x==='object'?Object.fromEntries(Object.keys(x).sort().map(k=>[k,canonical(x[k])])):x;
const baseline=lessons.slice(0,201);
assert.equal(baseline.length,201);
assert.equal(createHash('sha256').update(JSON.stringify(canonical(historicalPythonBaseline(baseline)))).digest('hex'),'247ed2aab30c6162edaee709b22489cea115e095d447005e1dcc2593d93abe2a','All prior201 lesson objects preserved exactly');
assert.equal(lessons.length,1088);assert.equal(ai.length,24);assert.equal(stdlib.length,8);
assert.equal(new Set(catalog.units.map(u=>u.track)).size,21);
const maps=[...JSON.parse(await read('../docs/ai-and-stdlib/ai24-support-map.json')).lessons,...JSON.parse(await read('../docs/ai-and-stdlib/python-stdlib8-support-map.json'))];
assert.equal(new Set(maps.map(m=>m.id)).size,32);
for(const m of maps){const l=lessons.find(l=>l.id===m.id);for(const i of m.quiz_support_paragraphs)assert.ok(l.explanation[i]);}
for(const l of ai){assert.equal(l.starter,'');assert.equal(l.solution,'');assert.equal(l.filename,'');assert.deepEqual(l.checks,[]);assert.equal(l.math,null);assert.ok(l.explanation.length);assert.ok(l.quiz.choices[l.quiz.answer]);}
for(const l of stdlib){assert.equal(l.runtime,'python');assert.ok(l.checks.length);assert.ok(l.solution);}
const dir=new URL('../.sites-runtime/ai-mode-test/',import.meta.url);await mkdir(dir,{recursive:true});
try{
 for(const file of ['navigation','lesson-completion'])await writeFile(new URL(file+'.mjs',dir),ts.transpileModule(await read('../lib/'+file+'.ts'),{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext}}).outputText);
 const {normalizeRoute}=await import(new URL('navigation.mjs',dir));
 const {getLessonCompletion,getReadingSectionKeys}=await import(new URL('lesson-completion.mjs',dir));
 for(const l of ai){
  for(const input of [{view:'studio',phase:'build'},{view:'quest',phase:'math'},{view:'quest',phase:'build'}]){const r=normalizeRoute({...input,activeId:l.id},l.id,catalog.units,lessons);assert.equal(r.view,'studio');assert.equal(r.phase,'build');}
  const marks=getReadingSectionKeys(l).map(sectionKey=>({lessonId:l.id,sectionKey,checked:true,markedAt:'2026-01-01',updatedAt:'2026-01-01'}));
  const score=getLessonCompletion(l,{unitId:l.id,quizPassed:1,mathPassed:0,completedAt:null},marks);
  assert.equal(score.percent,100);assert.equal(score.projectCompleted,false);assert.equal(score.total,marks.length+1);
  assert.equal(getLessonCompletion(l,{unitId:l.id,quizPassed:1,mathPassed:0,completedAt:'2026-01-01'},[]).readCompleted,0);
 }
}finally{await rm(dir,{recursive:true,force:true});}
const app=await read('../components/CodeQuest.tsx');
assert.doesNotMatch(app,/Unlimited tutor requests|state\.tutorUsed\}\s+used/);
assert.match(app,/aria-expanded=\{!tutorHidden/);assert.match(app,/buddy-toggle-button/);
assert.match(app,/await reading.refresh\(\); const data = await request\(\{action:"completeConcept"/);
assert.match(app,/phase === "build" && !isConcept && !selectedProject/);
assert.doesNotMatch(app,/<LessonNotes\b/);
assert.doesNotMatch(app, /id: "build", name: "Build"/, 'No duplicate local Build tab');
assert.match(app, /if \(n.id === "quest"\) setPhase\("learn"\)/);
assert.match(app, /setReturnToProject\(null\); setView\("studio"\); setPhase\("build"\)/);
const css = await read('../app/globals.css');
assert.match(css, /\.simple-learning \.phase-nav button.selected/);
assert.match(css, /font-weight:750/);
assert.match(css, /\.buddy-visibility \.buddy-toggle-button:focus-visible/);
console.log('AI24 no-code contracts,32 support maps,844 lessons/21 tracks,8 real Python lessons,concept route/completion and scoped Buddy/notes guards pass. Not browser evidence.');
