import assert from 'node:assert/strict';
import {mkdtemp,readFile,writeFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import ts from 'typescript';
const temp=await mkdtemp(path.join(tmpdir(),'codequest-resume-'));
try {
 for(const name of ['course-resume','navigation']) {
  const source=await readFile(`lib/${name}.ts`,'utf8');
  const js=ts.transpileModule(source,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext}}).outputText.replace(/from "\.\/([^"]+)"/g,'from "./$1.mjs"');
  await writeFile(path.join(temp,name+'.mjs'),js);
 }
 const {validBookmarks,mergeBookmarks,latestBookmark,isExplicitLessonLink}=await import(pathToFileURL(path.join(temp,'course-resume.mjs')).href);
 const units=[{id:'python-01',track:'python'},{id:'javascript-02',track:'javascript'}];
 const lessons=units.map(u=>({...u,explanation:['first','second','third']}));
 const old={view:'quest',studioMode:'course',phase:'learn',activeId:'python-01',paragraph:1,concept:'names',savedAt:'2026-11-03T12:00:00.000Z'};
 const recent={...old,paragraph:2,savedAt:'2026-11-03T14:00:00.000Z'};
 assert.deepEqual(validBookmarks(null,units,lessons),{});
 assert.deepEqual(validBookmarks([],units,lessons),{});
 assert.deepEqual(validBookmarks({javascript:old},units,lessons),{},'Reject a bookmark belonging to another course');
 assert.deepEqual(validBookmarks({python:{...old,savedAt:'invalid'}},units,lessons),{});
 assert.deepEqual(validBookmarks({python:{...old,view:'settings'}},units,lessons),{});
 assert.deepEqual(validBookmarks({python:{...old,view:'studio',studioMode:'practice'}},units,lessons),{});
 assert.equal(validBookmarks({python:{...old,paragraph:999}},units,lessons).python.paragraph,2);
 assert.equal(validBookmarks({python:{...old,paragraph:-2}},units,lessons).python.paragraph,0);
 assert.deepEqual(validBookmarks({python:recent},units,lessons).python,recent);
 const js={...old,activeId:'javascript-02',concept:undefined};
 const merged=mergeBookmarks({python:recent},{python:old,javascript:js});
 assert.equal(merged.python,recent);assert.equal(merged.javascript,js);assert.equal(latestBookmark(merged),recent);
 assert.equal(latestBookmark({}),undefined);
 assert.equal(isExplicitLessonLink('#quest?lesson=python-01&idea=2'),true);
 assert.equal(isExplicitLessonLink('#quest'),false);assert.equal(isExplicitLessonLink('#quest?idea=2'),false);
 console.log('PASS course resume: per-course normalization, damaged records, paragraph bounds, newest-wins merge, explicit links.');
}finally{await rm(temp,{recursive:true,force:true});}
