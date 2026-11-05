// Focused production JSX/handler harness; network, storage and editor are not live.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {createRequire} from 'node:module';
import ts from 'typescript';
import React,{act} from 'react';
import {createRoot} from 'react-dom/client';
import {JSDOM} from 'jsdom';
const require=createRequire(import.meta.url),cache=new Map();
function load(file){
 file=path.resolve(file);if(cache.has(file))return cache.get(file);
 if(file.endsWith('.json'))return JSON.parse(fs.readFileSync(file,'utf8'));
 const m={exports:{}};
 const js=ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,esModuleInterop:true}}).outputText;
 vm.runInNewContext(js,{module:m,exports:m.exports,require:id=>id.startsWith('.')?load(path.resolve(path.dirname(file),id.endsWith('.json')?id:id+'.ts')):require(id),URLSearchParams});
 cache.set(file,m.exports);return m.exports;
}
const source=fs.readFileSync('components/CodeQuest.tsx','utf8');
const namesSource=source.slice(source.indexOf('const names:'),source.indexOf('const symbols:'));
const handlers=source.slice(source.indexOf('  const prefs = async'),source.indexOf('  const answer = async'));
const start=source.indexOf('<div className="lesson-heading">'),end=source.indexOf('{view === "quest" && ([',start);
assert.ok(start>0&&end>start);
const heading=source.slice(start,end).trim();
const units=JSON.parse(fs.readFileSync('content/catalog.json')).units;
const lessons=JSON.parse(fs.readFileSync('content/lessons.json'));
const orderedUnits=load('lib/course-learning-order.ts').courseLearningOrder(units);
const {parseRoute,routeHash}=load('lib/navigation.ts');
const {localProjectExamples}=load('lib/local-course-project.ts');
const {projectsForLesson}=load('lib/course-projects.ts');
const dom=new JSDOM('<div id="root"></div>',{url:'https://fixture.test'});
Object.assign(globalThis,{window:dom.window,document:dom.window.document,IS_REACT_ACT_ENVIRONMENT:true});
let exposed,saves=0,loads=0;
const body=`${namesSource}
return function Harness(){
 const {useState,useRef}=React;
 const [state,setState]=useState({profile:{activeUnit:'javascript-01',track:'javascript'},progress:[]});
 const [activeId,setActiveId]=useState('javascript-01'),[view,setView]=useState('path'),[studioMode,setStudioMode]=useState('course'),[phase,setPhase]=useState('learn'),[paragraph,setParagraph]=useState(0),[error,setError]=useState('');
 const navigationSequence=useRef(0),navigationPending=useRef(''),navigationPreferences=useRef(Promise.resolve()),completionLock=useRef(false),abort=useRef(null);
 const bookmarksRef=useRef({});
 const [,setResumeOffer]=useState(null);
 const setConceptTarget=()=>{},setNoteSection=()=>{},setSearch=()=>{};
 const request=async({settings})=>({profile:{...state.profile,...settings},progress:[]});
 ${handlers}
 const unit=units.find(u=>u.id===activeId)??units.find(u=>u.id==='javascript-01')??units[0];
 const lesson=lessons.find(l=>l.id===unit?.id);
 expose({select,changeCourse,activeId,state,error,openProjects:()=>{setView('studio');setPhase('build');},setStudioMode});
 return (view==='quest'||(view==='studio'&&studioMode==='course'))&&lesson&&unit?(${heading}):null;
}`;
const context={React,units,lessons,orderedUnits,routeHash,saveCode:async()=>{saves++;},loadLesson:()=>{loads++;},expose:x=>exposed=x};
vm.createContext(context);
const compiled=ts.transpileModule(body,{compilerOptions:{module:ts.ModuleKind.None,target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.React}}).outputText;
const Harness=vm.runInContext('(function(){'+compiled+'})()',context);
const names=vm.runInContext('(function(){'+ts.transpileModule(namesSource,{compilerOptions:{target:ts.ScriptTarget.ES2022}}).outputText+'return names;})()',context);
const root=createRoot(document.getElementById('root'));
const counts={ordinary:0,guided:0,local:0,exploration:0};
const tracks=[...new Set(units.map(u=>u.track))];
assert.equal(tracks.length,21);assert.equal(lessons.length,units.length);
function verify(unit){
 const lesson=lessons.find(l=>l.id===unit.id);
 assert.equal(exposed.activeId,unit.id);assert.equal(exposed.state.profile.activeUnit,unit.id);assert.equal(exposed.state.profile.track,unit.track);assert.equal(exposed.error,'');
 assert.equal(document.querySelectorAll('h1').length,1);
 assert.equal(document.querySelector('h1').textContent,lesson.title,unit.id);
 assert.equal(document.querySelector('.eyebrow').textContent,`Current lesson · ${names[unit.track]} · ${unit.level}`,unit.id);
 assert.equal(document.querySelector('.project-lesson-context').textContent,'These projects are for this lesson. Choose a different lesson to see its projects.');
}
try{
 await act(async()=>root.render(React.createElement(Harness)));
 for(const track of tracks){
  await act(async()=>exposed.changeCourse(track));
  const first=orderedUnits.find(u=>u.track===track&&u.level==='beginner')??orderedUnits.find(u=>u.track===track);
  await act(async()=>exposed.openProjects());verify(first);
  for(const unit of orderedUnits.filter(u=>u.track===track)){
   await act(async()=>exposed.select(unit.id));
   assert.equal(document.querySelector('.project-lesson-context'),null,'Learn mode does not claim Projects context');
   await act(async()=>exposed.openProjects());verify(unit);
   const lesson=lessons.find(l=>l.id===unit.id);
   const route=parseRoute(routeHash({view:'studio',studioMode:'course',phase:'build',activeId:unit.id,paragraph:0}),'javascript-01',units,lessons);
   assert.equal(route.activeId,unit.id);assert.equal(route.view,'studio');assert.equal(route.phase,'build');
   const branch=lesson.learningMode==='concept'?(localProjectExamples(unit,lesson).length?'local':'exploration'):(projectsForLesson(unit.id).length?'guided':'ordinary');counts[branch]++;
  }
 }
 // Every authored concept now has a local example. Exploration is a fallback for future lessons.
 assert.equal(counts.ordinary+counts.guided+counts.local+counts.exploration,units.length);
 assert.ok(counts.ordinary>0 && counts.guided>0 && counts.local>0);
 assert.equal(counts.exploration,0,'Every current concept lesson offers a local code example');
 assert.equal(saves,units.length+tracks.length);
 assert.equal(loads,saves);
 console.log('PASS rendered project headings and lesson links for '+tracks.length+' courses and '+lessons.length+' lessons; branches '+JSON.stringify(counts));
}finally{await act(async()=>root.unmount());dom.window.close();}
