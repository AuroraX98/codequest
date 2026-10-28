import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import ts from 'typescript';
import React,{act,useState} from 'react';
import {createRoot} from 'react-dom/client';
import {JSDOM} from 'jsdom';
const dir=new URL('../.sites-runtime/unit-toc-test/',import.meta.url);await fs.mkdir(dir,{recursive:true});
const read=p=>fs.readFile(new URL('../'+p,import.meta.url),'utf8');
await fs.writeFile(new URL('toc.mjs',dir),ts.transpileModule(await read('components/UnitTableOfContents.tsx'),{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext,jsx:ts.JsxEmit.ReactJSX}}).outputText);
const dom=new JSDOM('<div id="root"></div>',{url:'https://fixture.test'});for(const [k,v]of Object.entries({window:dom.window,document:dom.window.document,IS_REACT_ACT_ENVIRONMENT:true}))Object.defineProperty(globalThis,k,{configurable:true,value:v});
const {default:Drawer}=await import(new URL('toc.mjs',dir));let selected=null,closed=0,studied=0;
function App(){const [open,setOpen]=useState(true),[active,setActive]=useState(2);return React.createElement(React.Fragment,null,React.createElement(Drawer,{open,title:'Current unit only',items:[{label:'First concept',paragraphIndex:0},{label:'contextlib.contextmanager() and a deliberately long readable concept name',paragraphIndex:3}],active,onClose:()=>{closed++;setOpen(false);},onSelect:i=>{selected=i;setActive(i);}}),React.createElement('main',null,React.createElement('button',{onClick:()=>studied++},'Keep studying')));}
const root=createRoot(document.getElementById('root'));
try{
 await act(async()=>root.render(React.createElement(App)));
 assert.equal(document.querySelectorAll('dialog,[aria-modal], [inert]').length,0);assert.ok(document.querySelector('aside').getAttribute('aria-labelledby'));assert.equal(document.querySelectorAll('nav button').length,2);assert.equal(document.querySelector('nav button').getAttribute('aria-current'),'step');
 await act(async()=>document.querySelectorAll('nav button')[1].click());assert.equal(selected,3);assert.ok(document.querySelector('aside'),'selection leaves panel open');assert.equal(closed,0);assert.equal(document.querySelectorAll('nav button')[1].getAttribute('aria-current'),'step');
 await act(async()=>document.querySelector('main button').click());assert.equal(studied,1);assert.ok(document.querySelector('aside'),'outside study interaction leaves panel open');
 document.querySelector('main button').focus();assert.equal(document.activeElement.textContent,'Keep studying');
 await act(async()=>document.querySelector('nav button').dispatchEvent(new dom.window.KeyboardEvent('keydown',{key:'Escape',bubbles:true})));assert.equal(document.querySelector('aside'),null);
 await act(async()=>root.render(React.createElement(App,{key:'new'})));await act(async()=>document.querySelector('[aria-label="Close Table of Contents"]').click());assert.equal(document.querySelector('aside'),null);
}finally{await act(async()=>root.unmount());dom.window.close();await fs.rm(dir,{recursive:true,force:true});}
const app=await read('components/CodeQuest.tsx'),css=await read('app/globals.css');
assert.doesNotMatch(app,/Lessons <Map|aria-haspopup="dialog"/);
assert.equal((app.match(/id="unit-toc-toggle"/g)||[]).length,1);assert.equal((app.match(/className="secondary buddy-toggle-button"/g)||[]).length,1);
const header=app.slice(app.indexOf('<header'),app.indexOf('</header>'));assert.ok(header.indexOf('unit-toc-toggle')<header.indexOf('aria-label="Main navigation"'));assert.ok(header.indexOf('aria-label="Main navigation"')<header.indexOf('buddy-toggle-button'));
assert.match(app,/pythonConcepts.map\(\(c,i\)=>\(\{label:c.title,paragraphIndex:i\}\)\)/);assert.match(css,/grid-template-columns:240px minmax\(0,1fr\)/);assert.match(css,/@media\(min-width:1440px\)/);assert.match(css,/max-height:260px/);assert.match(css,/overflow-wrap:anywhere/);assert.match(css,/prefers-reduced-motion:reduce/);assert.doesNotMatch(css,/unit-toc-drawer::backdrop|unit-toc-drawer \{position:fixed/);
console.log('PASS nonmodal TOC stays open on idea selection/outside study, current highlight, close/Escape, no focus trap, unique header toggles in order; responsive nonoverlap rules checked by source, geometry not browser-verified.');
