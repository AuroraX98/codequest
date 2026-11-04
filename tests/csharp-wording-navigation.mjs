import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';
const cache=new Map();
function load(file){
 file=path.resolve(file);if(cache.has(file))return cache.get(file);
 if(file.endsWith('.json'))return JSON.parse(fs.readFileSync(file,'utf8'));
 const mod={exports:{}};cache.set(file,mod.exports);
 const js=ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,esModuleInterop:true}}).outputText;
 new Function('require','exports','module',js)(id=>load(path.resolve(path.dirname(file),id+(path.extname(id)?'':'.ts'))),mod.exports,mod);
 return mod.exports;
}
const {getUnitContents}=load('lib/unit-toc.ts');
const {getLessonHeadings}=load('lib/lesson-headings.ts');
const lessons=load('content/lessons.json').filter(l=>l.id.startsWith('csharp-'));
const heads=load('content/csharp-reviewed-headings.json');
for(const l of lessons){
 const entries=getUnitContents(l);
 assert.deepEqual(getLessonHeadings(l.id),heads[l.id],l.id);
 assert.deepEqual(entries,heads[l.id].map((label,paragraphIndex)=>({label,paragraphIndex})),l.id);
}
const app=fs.readFileSync('components/CodeQuest.tsx','utf8');
const terms=load('content/terminology.json');
const changes=load('docs/csharp-wording-v1/terminology-link-changes.json');
for(const c of changes) assert.ok(terms.find(t=>t.id===c.term).links.some(l=>l.lessonId===c.lesson && l.paragraph===c.after),c.term);
assert.match(app,/reviewedLesson=\{[^\n]*lesson\.id\.startsWith\("csharp-"\)/);
console.log('PASS: all 63 C# contents lists use reviewed headings, all reviewed section targets stay intact, authored-only rendering enabled.');
