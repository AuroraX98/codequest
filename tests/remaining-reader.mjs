import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {createRequire} from 'node:module';
import {execFileSync} from 'node:child_process';
import ts from 'typescript';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {JSDOM} from 'jsdom';
const require=createRequire(import.meta.url),cache=new Map();
function load(file){
 file=path.resolve(file);if(cache.has(file))return cache.get(file).exports;
 const mod={exports:{}};cache.set(file,mod);
 const code=ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.ReactJSX,esModuleInterop:true}}).outputText;
 vm.runInNewContext(code,{module:mod,exports:mod.exports,require:p=>p.startsWith('.')?load(path.resolve(path.dirname(file),p)+'.ts'):require(p),console,URL,setTimeout,clearTimeout},{filename:file});return mod.exports;
}
const {getLessonHeadings}=load('lib/lesson-headings.ts');
const {getReadingSectionKeys}=load('lib/lesson-completion.ts');
const Contents=load('components/LessonContents.tsx').default;
const Mark=load('components/ReadingMark.tsx').default;
const lessons=JSON.parse(fs.readFileSync('content/lessons.json','utf8'));
const base=execFileSync('git',['show','158079649b45ffa9050120e9519eba336e6ab64f:content/lessons.json'],{maxBuffer:32*1024*1024});
assert.deepEqual(fs.readFileSync('content/lessons.json'),base,'Published lesson content and progress identities must remain byte-identical');
const reading={scope:'fixture',records:[],loaded:true,loading:false,online:true,error:'',pending:{},errors:{},needsRefresh:{},refresh:async()=>{},setChecked:async()=>{throw Error('SSR must not mutate progress');}};
let sections=0;
for(const lesson of lessons.slice(1175)){
 const headings=getLessonHeadings(lesson.id),keys=getReadingSectionKeys(lesson);
 assert.equal(headings.length,lesson.explanation.length,lesson.id);
 assert.equal(new Set(headings).size,headings.length);
 for(let i=0;i<headings.length;i++){
  assert.ok(headings[i].trim());assert.equal(keys[i],'text:'+i);
  for(const simple of [true,false]){
   const html=renderToStaticMarkup(React.createElement(Contents,{lessonId:lesson.id,index:i,onSelect:()=>{},simple},React.createElement(Mark,{reading,lessonId:lesson.id,sectionKey:keys[i],sectionTitle:headings[i]})));
   const doc=new JSDOM(html).window.document;
   const region=doc.querySelector('[data-annotation-section="'+keys[i]+'"]');
   assert.ok(region);const headingId=region.getAttribute('aria-labelledby');assert.ok(headingId);
   const heading=doc.getElementById(headingId);assert.ok(heading?.textContent.includes(headings[i]));
   assert.equal(doc.querySelector('[role="checkbox"]').getAttribute('aria-label'),'Mark \u201c'+headings[i]+'\u201d as read');
   if(simple)assert.equal(doc.querySelector('.lab-eyebrow').textContent,`Idea ${i+1} of ${headings.length}`);
   else assert.equal(doc.querySelectorAll('.contents-section').length,headings.length);
   assert.ok(!html.includes('undefined'));assert.ok(!html.includes('of 0'));
  }
  sections++;
 }
}
assert.equal(sections,276);
console.log('PASS: 46 lessons, 276 stable section keys, 552 actual reader/checkbox renders; published lesson bytes unchanged.');
