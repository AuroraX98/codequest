import assert from 'node:assert/strict';import fs from 'node:fs';import path from 'node:path';import vm from 'node:vm';import {createRequire}from'node:module';import ts from 'typescript';import React,{act}from'react';import{JSDOM}from'jsdom';
const require=createRequire(import.meta.url),cache=new Map();
const dom=new JSDOM('<div id="root"></div>',{url:'https://fixture.test'});
Object.assign(globalThis,{window:dom.window,document:dom.window.document,localStorage:dom.window.localStorage,IS_REACT_ACT_ENVIRONMENT:true});
const {createRoot}=await import('react-dom/client');
let copied='',download,blob;Object.defineProperty(globalThis,'navigator',{configurable:true,value:{clipboard:{writeText:async s=>{copied=s;}}}});
const oldCreate=URL.createObjectURL,oldRevoke=URL.revokeObjectURL;URL.createObjectURL=b=>(blob=b,'blob:fixture');URL.revokeObjectURL=()=>{};
dom.window.HTMLAnchorElement.prototype.click=function(){download=this.download;};
const stubEditor=({code,onChange})=>React.createElement('div',null,React.createElement('textarea',{'aria-label':'Local code',value:code,readOnly:true}),React.createElement('button',{onClick:()=>onChange('edited local code\n')},'Edit fixture'));
function load(file){
 file=path.resolve(file);if(cache.has(file))return cache.get(file);
 const m={exports:{}};cache.set(file,m.exports);
 const source=fs.readFileSync(file,'utf8');const js=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.ReactJSX,esModuleInterop:true}}).outputText;
 vm.runInNewContext(js,{module:m,exports:m.exports,require:id=>{
  if(id==='./CodeEditor')return {default:stubEditor,__esModule:true};
  if(id==='./LessonContent')return {default:({text})=>React.createElement('p',null,text),__esModule:true};
  if(id.startsWith('.')){const f=path.resolve(path.dirname(file),id);return load(fs.existsSync(f+'.ts')?f+'.ts':f+'.tsx');}
  return require(id);
 },localStorage,React,navigator:globalThis.navigator,document,URL,URLSearchParams,Blob,setTimeout,console});
 cache.set(file,m.exports);return m.exports;
}
const {localProjectExamples,localProjectStorageKey}=load('lib/local-course-project.ts');
const {normalizeRoute,routeHash,parseRoute}=load('lib/navigation.ts');
const {default:LocalProject}=load('components/LocalCourseProject.tsx');
const lessons=JSON.parse(fs.readFileSync('content/lessons.json')),units=JSON.parse(fs.readFileSync('content/catalog.json')).units;
const tracks=[...new Set(units.map(u=>u.track))];assert.equal(tracks.length,21);
for(const track of tracks){
 const unit=units.find(u=>u.track===track);
 const route=normalizeRoute({view:'studio',phase:'build',activeId:unit.id},unit.id,units,lessons);
 assert.equal(route.view,'studio');assert.equal(route.phase,'build');assert.equal(parseRoute(routeHash(route),unit.id,units,lessons).activeId,unit.id);
}
let count=0;
for(const unit of units){const l=lessons.find(l=>l.id===unit.id);for(const example of localProjectExamples(unit,l)){
 count++;assert.ok(l.explanation[example.paragraph].includes(example.code));assert.ok(!['text','output','console'].includes(example.language));assert.ok(example.filename.includes('.'));
 if(['csharp','cpp','java','c','kotlin','go','rust','php','ruby','r'].includes(unit.track))assert.notEqual(example.language,'javascript','never use inert runtime as source language');
}}
assert.ok(count>500);
const unit=units.find(u=>u.id==='csharp-07'),lesson=lessons.find(l=>l.id===unit.id),examples=localProjectExamples(unit,lesson);assert.equal(examples[0].standalone,true);assert.equal(examples[0].filename,'Program.cs');
const fence=String.fromCharCode(96).repeat(3);
const frag=localProjectExamples(unit,{...lesson,explanation:['A fragment.\n'+fence+'csharp\nx + 1\n'+fence]});assert.equal(frag[0].standalone,false);
const multi=localProjectExamples(unit,{...lesson,explanation:['Complete local C# example.\n'+fence+'csharp\nConsole.WriteLine(1);\n'+fence+'\nAn illustrative fragment.\n'+fence+'csharp\nx + 1\n'+fence]});
assert.equal(multi[0].standalone,true);assert.equal(multi[1].standalone,false,'complete label never leaks to another block');
const javaUnit=units.find(u=>u.id==='java-58'),javaLesson=lessons.find(l=>l.id===javaUnit.id);
assert.ok(localProjectExamples(javaUnit,javaLesson).some(e=>e.filename==='Labels.java'));

const root=createRoot(document.getElementById('root'));const render=(scope,id=lesson.id)=>act(async()=>root.render(React.createElement(LocalProject,{key:scope+id,scope,unit:units.find(u=>u.id===id),lesson:lessons.find(l=>l.id===id),onStudy:()=>{}})));
const click=async name=>{const button=[...document.querySelectorAll('button')].find(b=>b.textContent===name);assert.ok(button,name);await act(async()=>button.click());};
try{
 await render('account-a');assert.equal(document.querySelector('textarea').value,examples[0].code);assert.ok(document.body.textContent.includes('no in-app C# runner'));
 await click('Edit fixture');await click('Copy code');assert.equal(copied,'edited local code\n');
 await click('Download code');assert.equal(download,'Program.cs');assert.equal(await blob.text(),'edited local code\n');
 assert.ok(localStorage.getItem(localProjectStorageKey('account-a',lesson.id)).includes('edited local code'));
 await render('account-b');assert.equal(document.querySelector('textarea').value,examples[0].code);
 await render('account-a');assert.equal(document.querySelector('textarea').value,'edited local code\n');
 const multipleUnit=units.find(u=>localProjectExamples(u,lessons.find(l=>l.id===u.id)).length>1);
 const multiple=localProjectExamples(multipleUnit,lessons.find(l=>l.id===multipleUnit.id));
 await render('account-a',multipleUnit.id);await click('Edit fixture');
 const picker=document.querySelector('select');
 await act(async()=>{picker.value=multiple[1].id;picker.dispatchEvent(new dom.window.Event('change',{bubbles:true}));});
 assert.equal(document.querySelector('textarea').value,multiple[1].code,'another example does not inherit edited code');
 await act(async()=>{picker.value=multiple[0].id;picker.dispatchEvent(new dom.window.Event('change',{bubbles:true}));});
 assert.equal(document.querySelector('textarea').value,'edited local code\n','return restores the first example draft');
 await render('account-a','ai-01');assert.equal(document.querySelector('textarea'),null);assert.ok(document.body.textContent.includes('ideas and reasoning'));
 assert.ok(![...document.querySelectorAll('button')].some(b=>/Run code|Finish/.test(b.textContent)));
}finally{await act(async()=>root.unmount());dom.window.close();URL.createObjectURL=oldCreate;URL.revokeObjectURL=oldRevoke;}
const app=fs.readFileSync('components/CodeQuest.tsx','utf8');
assert.doesNotMatch(app,/filter\(n => n.id !== "studio"/);assert.doesNotMatch(app,/Cover the building blocks first|ideas still need a reading mark/);
assert.match(app,/if \(!reading.loaded \|\| reading.error \|\| projectReadingMissing.length\) throw new Error/);assert.match(app,/Skills this project uses/);
assert.doesNotMatch(fs.readFileSync('components/LocalCourseProject.tsx','utf8'),/runProject|action:\s*["']complete|fetch\(/);
console.log('PASS all21 Projects routes; '+count+' exact authored local examples, complete/fragment distinction, correct language/extension, no inert JS, scoped drafts, exact copy/download, no-code AI guidance, no fake Run/completion.');

const esmUnit=units.find(u=>u.id==='javascript-46'),esmLesson=lessons.find(l=>l.id===esmUnit.id);const esm=localProjectExamples(esmUnit,esmLesson);assert.deepEqual(esm.map(e=>e.filename),['counter.mjs','main.mjs']);assert.ok(esm.every(e=>e.language==='javascript'&&!e.standalone));
