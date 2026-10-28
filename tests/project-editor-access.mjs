import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import ts from 'typescript';
import React,{act} from 'react';
import {createRoot} from 'react-dom/client';
import {JSDOM} from 'jsdom';
const dir=new URL('../.sites-runtime/editor-access-test/',import.meta.url);await fs.mkdir(dir,{recursive:true});
const read=p=>fs.readFile(new URL('../'+p,import.meta.url),'utf8');
let source=await read('components/CourseProjectStudio.tsx');
source=source.replace('import CodeEditor from "./CodeEditor";','const CodeEditor = ({code,onChange}:any) => <textarea aria-label="Project code" value={code} onChange={e=>onChange(e.target.value)}/>;')
.replace('import { runProject } from "../lib/runner";','const runProject = async()=>({output:["test"],checks:[{label:"Works",passed:true}]});')
.replace(/import \{ loadCourseProject,[^\n]+/,'const loadCourseProject=async()=>({step:0,code:"print(1)",updatedAt:""}); const saveCourseProject=async()=>{};');
await fs.writeFile(new URL('studio.mjs',dir),ts.transpileModule(source,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext,jsx:ts.JsxEmit.ReactJSX}}).outputText);
const dom=new JSDOM('<div id="root"></div>',{url:'https://fixture.test'});for(const [k,v]of Object.entries({window:dom.window,document:dom.window.document,IS_REACT_ACT_ENVIRONMENT:true}))Object.defineProperty(globalThis,k,{configurable:true,value:v});
const {default:Studio}=await import(new URL('studio.mjs',dir));const root=createRoot(document.getElementById('root'));let finished=0;
const project={id:'test',version:1,title:'Example',filename:'main.py',core:true,steps:[{instruction:'Apply the idea',checks:[{label:'Works',expression:'true'}]}]};
const render=reason=>act(async()=>root.render(React.createElement(Studio,{project,lesson:{runtime:'python'},scope:'test',finishBlockedReason:reason,onCompleteCore:async()=>finished++})));
try{
 await render('Six ideas still need reading marks.');assert.equal(document.querySelectorAll('textarea').length,1);const button=name=>[...document.querySelectorAll('button')].find(b=>b.textContent===name);
 assert.equal(button('Run code').disabled,false);await act(async()=>button('Run code').click());assert.equal(document.querySelector('.guided-project-results pre').textContent,'test');assert.equal(document.querySelectorAll('.guided-project-checks li').length,1);assert.equal(document.querySelector('.guided-check-icon').getAttribute('aria-label'),'Passed');assert.equal(button('Finish course project').disabled,true);assert.equal(finished,0);
 await render(undefined);assert.equal(document.querySelectorAll('textarea').length,1);assert.equal(document.querySelector('textarea').value,'print(1)');assert.equal(button('Finish course project').disabled,false);await act(async()=>button('Finish course project').click());assert.equal(finished,1);
}finally{await act(async()=>root.unmount());dom.window.close();await fs.rm(dir,{recursive:true,force:true});}
const app=await read('components/CodeQuest.tsx');assert.match(app,/Editor <Braces/);assert.match(app,/setStudioMode\("course"\);setPhase\("build"\);setEditorJump/);assert.match(app,/target\?\.scrollIntoView/);assert.match(app,/if \(!reading.loaded \|\| reading.error \|\| projectReadingMissing.length\) throw new Error/);assert.match(app,/Finish the Try it exercise before finishing/);assert.doesNotMatch(app,/: <CourseProjectStudio/);
console.log('PASS one editor visible before read marks; Run available; final Finish remains blocked, valid code preserved, then completion enabled after readiness. Editor jump selects course mode; core quiz/server path unchanged. Runner mocked here; real Python behavior covered separately.');

const css=await read('app/globals.css');assert.match(css,/\.guided-project-results > :is\(h3, p, pre, ul\) \{ margin: 0; \}/);assert.match(css,/grid-template-columns: 1.25em minmax\(0, 1fr\)/);assert.match(css,/white-space: pre-wrap/);
