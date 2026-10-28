import {historicalPythonBaseline} from './python-authorized-baseline.mjs';
import assert from 'node:assert/strict';
import {readFile,writeFile,mkdir,rm} from 'node:fs/promises';
import ts from 'typescript';
import {createHash} from 'node:crypto';
const read=p=>readFile(new URL('../'+p,import.meta.url),'utf8');
const lessons=JSON.parse(await read('content/lessons.json'));assert.equal(lessons.length,JSON.parse(await read('content/catalog.json')).units.length);
const canonical=x=>Array.isArray(x)?x.map(canonical):x&&typeof x==='object'?Object.fromEntries(Object.keys(x).sort().map(k=>[k,canonical(x[k])])):x;
assert.equal(createHash('sha256').update(JSON.stringify(canonical(historicalPythonBaseline(lessons.slice(0,233))))).digest('hex'),'e8c167ac832a5528fef753b42e02df27a180c82257aefab41764466b50bed1a8');
const dir=new URL('../.sites-runtime/toc-data-test/',import.meta.url);await mkdir(dir,{recursive:true});
try{
 for(const file of ['additional-unit-contents','lesson-headings','unit-toc']){
 const out=ts.transpileModule(await read('lib/'+file+'.ts'),{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext}}).outputText.replace(/(['"])\.\/(additional-unit-contents|lesson-headings)\1/g,'"./$2.mjs"');await writeFile(new URL(file+'.mjs',dir),out);
 }
 const {getUnitContents}=await import(new URL('unit-toc.mjs',dir));const {getLessonHeadings}=await import(new URL('lesson-headings.mjs',dir));const {additionalUnitContents}=await import(new URL('additional-unit-contents.mjs',dir));
 assert.equal(Object.keys(additionalUnitContents).length,JSON.parse(await read('content/catalog.json')).units.length-116);
 for(const l of lessons){const entries=getUnitContents(l);assert.ok(entries.length,l.id);assert.equal(entries[0].paragraphIndex,0);assert.equal(getLessonHeadings(l.id).length,l.explanation.length,l.id);
 for(const [i,e]of entries.entries()){assert.ok(e.label&&e.paragraphIndex>=0&&e.paragraphIndex<l.explanation.length);assert.ok(i===0||e.paragraphIndex>entries[i-1].paragraphIndex);if(i)assert.ok(l.explanation[e.paragraphIndex].replace(/```[\s\S]*?```/g,'').trim(),l.id+': code stays grouped');}
 if(additionalUnitContents[l.id])assert.equal(new Set(entries.map(e=>e.label)).size,entries.length);
 }
 assert.deepEqual(getLessonHeadings('unknown'),[]);
}finally{await rm(dir,{recursive:true,force:true});}
console.log('All current-unit maps valid; catalog-derived curated map count, stable paragraph indices, no standalone code-only anchors; all prior233 lesson objects unchanged except independently accepted historical deltas.');
