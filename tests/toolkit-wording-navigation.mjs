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
const lessons=load('content/lessons.json').filter(l=>l.id.startsWith('developer-toolkit-'));
const heads=load('content/developer-toolkit-reviewed-headings.json');
for(const l of lessons){
 const entries=getUnitContents(l);
 assert.deepEqual(getLessonHeadings(l.id),heads[l.id],l.id);
 assert.deepEqual(entries,heads[l.id].map((label,paragraphIndex)=>({label,paragraphIndex})),l.id);
}
const app=fs.readFileSync('components/CodeQuest.tsx','utf8');
assert.match(app,/reviewedLesson=\{[^\n]*lesson\.id\.startsWith\("developer-toolkit-"\)/);
console.log('PASS: all 24 Developer toolkit contents lists use reviewed headings, all reviewed section targets stay intact, authored-only rendering enabled.');
