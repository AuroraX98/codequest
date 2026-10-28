import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import ts from 'typescript';
import React,{act} from 'react';
import {createRoot} from 'react-dom/client';
import {JSDOM} from 'jsdom';
const read=p=>fs.readFile(new URL('../'+p,import.meta.url),'utf8');
const terms=JSON.parse(await read('content/terminology.json')),lessons=JSON.parse(await read('content/lessons.json')),units=JSON.parse(await read('content/catalog.json')).units;
assert.ok(terms.length>=942,'Minimum retained term baseline; SQL gate checks exact current total');assert.equal(new Set(terms.map(t=>t.id)).size,terms.length);
for(const t of terms){assert.ok(t.name&&t.meaning&&t.category);assert.ok(['term','acronym','slang'].includes(t.kind));if(t.kind==='slang')assert.ok(t.context);for(const l of t.links??[]){assert.ok(lessons.find(x=>x.id===l.lessonId)?.explanation[l.paragraph]);assert.notEqual(l.lessonId,'python-01');}}
const dir=new URL('../.sites-runtime/terminology-test/',import.meta.url);await fs.mkdir(dir,{recursive:true});
for(const [file,name]of [['lib/course-order.ts','course-order'],['lib/terminology.ts','terminology'],['lib/study-label.ts','study-label'],['lib/navigation.ts','navigation'],['components/Terminology.tsx','terminology-view']]){
 let source=await read(file);source=source.replace("import data from '../content/terminology.json';",'const data='+JSON.stringify(terms)+';').replace("import catalog from '../content/catalog.json';",'const catalog='+JSON.stringify({units})+';');
 let out=ts.transpileModule(source,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext,jsx:ts.JsxEmit.ReactJSX}}).outputText.replaceAll("'../lib/terminology'","'./terminology.mjs'").replaceAll("'../lib/study-label'","'./study-label.mjs'").replaceAll('"../lib/course-order"','"./course-order.mjs"');
 await fs.writeFile(new URL(name+'.mjs',dir),out);
}
const {terminologyMatches,terminologyInLanguage,readTerminologyState,taughtTermLinks}=await import(new URL('terminology.mjs',dir));
assert.ok(terms.some(t=>terminologyMatches(t,'API')));assert.ok(terms.some(t=>terminologyMatches(t,'debug')));assert.ok(terms.filter(t=>terminologyMatches(t,'class')).length>1);assert.ok(terms.some(t=>terminologyMatches(t,'token')));
assert.equal(readTerminologyState('{broken').query,'');assert.equal(readTerminologyState('{"view":"evil","category":"secret"}').view,'tiles');assert.equal(readTerminologyState('{"query":"x","category":"secret"}').category,'all');
for(const t of terms)assert.equal(taughtTermLinks(t,lessons).length,(t.links??[]).length);
const {normalizeRoute,parseRoute,routeHash}=await import(new URL('navigation.mjs',dir));
for(const id of ['python-01','ai-01']){const route=normalizeRoute({view:'terminology',phase:'build',activeId:id,paragraph:0},id,units,lessons);assert.equal(route.view,'terminology');assert.deepEqual(parseRoute(routeHash(route),id,units,lessons),route);}
const dom=new JSDOM('<div id="root"></div>',{url:'https://fixture.test'});for(const [k,v]of Object.entries({window:dom.window,document:dom.window.document,localStorage:dom.window.localStorage,IS_REACT_ACT_ENVIRONMENT:true}))Object.defineProperty(globalThis,k,{configurable:true,value:v});
localStorage.setItem('codequest-terminology:a',JSON.stringify({query:'API',category:'all',view:'tiles',selectedId:''}));
const {courseNames,compareCourseNames}=await import(new URL('course-order.mjs',dir));
const {default:View}=await import(new URL('terminology-view.mjs',dir));const root=createRoot(document.getElementById('root'));let target;
const render=scope=>act(async()=>root.render(React.createElement(View,{scope,lessons,languageNames:courseNames,onStudy:l=>target=l})));
try{
 await render('a');const courseLabels=[...document.querySelectorAll('select')[1].options].slice(1).map(o=>o.textContent);assert.deepEqual(courseLabels,[...courseLabels].sort(compareCourseNames));const ids=()=>[...document.querySelectorAll('[data-term-id]')].map(n=>n.dataset.termId);const before=ids();assert.ok(before.length&&before.length<terms.length);assert.equal(document.querySelector('input').value,'API');
 const list=[...document.querySelectorAll('button')].find(b=>b.textContent==='List');await act(async()=>list.click());assert.equal(list.getAttribute('aria-pressed'),'true');assert.deepEqual(ids(),before);assert.ok(document.querySelector('.terminology-results.list'));
 assert.equal(JSON.parse(localStorage.getItem('codequest-terminology:a')).view,'list');
 await render('b');assert.equal(document.querySelector('input').value,'');assert.equal(ids().length,terms.length);assert.equal(document.querySelectorAll('button button').length,0);
 const language=document.querySelectorAll('select')[1];await act(async()=>{language.value='python';language.dispatchEvent(new dom.window.Event('change',{bubbles:true}));});
 for(const id of ids()){const t=terms.find(t=>t.id===id);assert.ok(!t.languages?.length||t.languages.includes('python'));}
 assert.equal(JSON.parse(localStorage.getItem('codequest-terminology:b')).language,'python');
 for(const track of [...new Set(units.map(u=>u.track))]){
  await act(async()=>{language.value=track;language.dispatchEvent(new dom.window.Event('change',{bubbles:true}));});
  assert.ok(ids().length,track+': terms available');
  const expected=terms.filter(t=>terminologyInLanguage(t,track)).map(t=>t.id);assert.deepEqual(ids(),expected);
  for(const term of terms.filter(t=>terminologyInLanguage(t,track)))for(const link of taughtTermLinks(term,lessons,track))assert.equal(units.find(u=>u.id===link.lessonId).track,track);
  for(const id of ids()){const t=terms.find(t=>t.id===id);assert.ok(!t.languages?.length||t.languages.includes(track));}
  if(track==='csharp'){assert.ok(ids().includes('csharp-console-writeline'));assert.ok(ids().includes('variable'));assert.ok(!ids().includes('python-set'));assert.doesNotMatch(document.querySelector('.terminology-results').textContent,/Python|print\(|__init__|json.loads|def greet|next\(\)/);assert.match(document.querySelector('.terminology-results').textContent,/System.Console.WriteLine/);}
  const filtered=ids();const list=[...document.querySelectorAll('button')].find(b=>b.textContent==='List');await act(async()=>list.click());assert.deepEqual(ids(),filtered);const tiles=[...document.querySelectorAll('button')].find(b=>b.textContent==='Tiles');await act(async()=>tiles.click());assert.deepEqual(ids(),filtered);
 }
 await act(async()=>{language.value='csharp';language.dispatchEvent(new dom.window.Event('change',{bubbles:true}));});
 const study=document.querySelector('.project-study-button');await act(async()=>study.click());assert.ok(lessons.some(l=>l.id===target.lessonId));assert.equal(units.find(u=>u.id===target.lessonId).track,'csharp');
 for(const track of [...new Set(units.map(u=>u.track))]){
  const scoped=terms.filter(t=>terminologyInLanguage(t,track));const example=scoped.find(t=>t.languages?.includes(track))??scoped[0];
  const query=example.name;const key='search-'+track;localStorage.setItem('codequest-terminology:'+key,JSON.stringify({language:track,query,category:'all',view:'list',selectedId:''}));
  await render(key);assert.deepEqual(ids(),scoped.filter(t=>terminologyMatches(t,query)).map(t=>t.id));
  const button=[...document.querySelectorAll('button')].find(b=>b.textContent==='Tiles');await act(async()=>button.click());assert.deepEqual(ids(),scoped.filter(t=>terminologyMatches(t,query)).map(t=>t.id));
 }
 await render('a');assert.equal(document.querySelector('input').value,'API');assert.ok(document.querySelector('.terminology-results.list'));
 assert.equal(document.querySelectorAll('[onmouseover],iframe,script').length,0);
}finally{await act(async()=>root.unmount());dom.window.close();await fs.rm(dir,{recursive:true,force:true});}
const app=await read('components/CodeQuest.tsx');assert.ok(app.indexOf('label: "Courses"')<app.indexOf('label: "Terminology"'));assert.ok(app.indexOf('label: "Terminology"')<app.indexOf('label: "Progress"'));
console.log(terms.length+' unique terms, '+terms.reduce((n,t)=>n+(t.links?.length??0),0)+' valid links, aliases, List/Tile consistency across all21 course filters and scoped searches, scoped persistence and real Study callbacks pass (React/JSDOM, not browser).');
