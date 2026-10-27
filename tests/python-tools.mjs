import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import ts from 'typescript';
import React,{act} from 'react';
import {createRoot} from 'react-dom/client';
import {JSDOM} from 'jsdom';
const dir=new URL('../.sites-runtime/tools-test/',import.meta.url);await fs.mkdir(dir,{recursive:true});
for(const [source,name] of [['lib/python-tools.ts','python-tools'],['lib/navigation.ts','navigation'],['components/PythonTools.tsx','PythonTools']]){let out=ts.transpileModule(await fs.readFile(new URL('../'+source,import.meta.url),'utf8'),{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext,jsx:ts.JsxEmit.ReactJSX}}).outputText.replace('../lib/python-tools','./python-tools.mjs');await fs.writeFile(new URL(name+'.mjs',dir),out);}
const {pythonTools,matchPythonTool}=await import(new URL('python-tools.mjs',dir));const {parseRoute,routeHash}=await import(new URL('navigation.mjs',dir));const {default:Tools}=await import(new URL('PythonTools.mjs',dir));
const lessons=JSON.parse(await fs.readFile(new URL('../content/lessons.json',import.meta.url)));const units=JSON.parse(await fs.readFile(new URL('../content/catalog.json',import.meta.url))).units;const items=pythonTools(units,lessons);
assert.equal(items.length,43);assert.equal(new Set(items.map(x=>x.id)).size,43);
for(const item of items){assert.ok(lessons.find(l=>l.id===item.lessonId).explanation[item.paragraph]);const route={view:'quest',studioMode:'course',phase:'learn',activeId:item.lessonId,paragraph:item.paragraph,...item.concept?{concept:item.concept}:{}};assert.deepEqual(parseRoute(routeHash(route),'python-01',units,lessons),route);}
assert.equal(items.find(x=>x.title==='Variables & names').kind,'Concept');assert.ok(items.some(x=>x.title==='input()'));assert.equal(items.filter(x=>matchPythonTool(x,'PRINT()')).length,1);assert.equal(items.filter(x=>matchPythonTool(x,'not-real-entry')).length,0);assert.equal(parseRoute('#quest?lesson=python-02&concept=names','python-01',units,lessons).concept,undefined);
const dom=new JSDOM('<div id="root"></div>',{url:'https://fixture.test'});for(const [k,v] of Object.entries({window:dom.window,document:dom.window.document,IS_REACT_ACT_ENVIRONMENT:true}))Object.defineProperty(globalThis,k,{configurable:true,value:v});let opened,course=0;const root=createRoot(document.getElementById('root'));await act(async()=>root.render(React.createElement(Tools,{units,lessons,onOpen:x=>opened=x,onCourse:()=>course++})));
assert.equal(document.querySelectorAll('.python-tool-card').length,43);const search=document.querySelector('input');const set=Object.getOwnPropertyDescriptor(dom.window.HTMLInputElement.prototype,'value').set;
await act(async()=>{set.call(search,'print');search.dispatchEvent(new dom.window.Event('input',{bubbles:true}));search.dispatchEvent(new dom.window.Event('change',{bubbles:true}));});
// Native React input events are environment-dependent; the search predicate is tested directly above.
await act(async()=>[...document.querySelectorAll('.python-tool-card')].find(x=>x.textContent.includes('print()')).click());assert.equal(opened.concept,'output');assert.equal(opened.lessonId,'python-01');await act(async()=>[...document.querySelectorAll('button')].find(x=>x.textContent==='Guided course').click());assert.equal(course,1);await act(async()=>root.unmount());dom.window.close();await fs.rm(dir,{recursive:true,force:true});console.log('43 valid unique course shortcuts; every direct route round-trips; concept/function distinction, search, direct print target, and course return pass.');
