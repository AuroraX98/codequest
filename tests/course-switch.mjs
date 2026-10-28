import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import vm from 'node:vm';
import ts from 'typescript';
import React,{act} from 'react';
import{createRoot}from'react-dom/client';
import{JSDOM}from'jsdom';
const source=await fs.readFile('components/CodeQuest.tsx','utf8');
const handlers=source.slice(source.indexOf('  const prefs = async'),source.indexOf('  const answer = async'));
const chooser=source.match(/onClick=\{\(\) =>\s*(prefs\(\{ track: id, level: "beginner" \}\)|changeCourse\(id\))\.catch/)[1];
const dom=new JSDOM('<div id="root"></div>',{url:'https://fixture.test/#path?lesson=csharp-01'});globalThis.window=dom.window;globalThis.document=dom.window.document;globalThis.IS_REACT_ACT_ENVIRONMENT=true;
const units=[{id:'csharp-01',track:'csharp',level:'beginner'},{id:'python-01',track:'python',level:'beginner'}];
let exposed,requests=[],saved=[],loads=[],profile={activeUnit:'csharp-01',track:'csharp',level:'beginner'},persisted={activeId:'csharp-01'},draft='untouched C# draft';
const request=({settings})=>new Promise(resolve=>requests.push({settings,resolve:()=>{profile={...profile,...settings};resolve({profile,progress:[]});}}));
const body=`return function Harness(){
const {useState,useRef,useEffect}=React;
const [state,setState]=useState({profile:{...profile},progress:[]}),[activeId,setActiveId]=useState(persisted.activeId),[view,setView]=useState("path"),[phase,setPhase]=useState("learn"),[paragraph,setParagraph]=useState(0),[concept,setConceptTarget]=useState(),[error,setError]=useState("");
const studioMode="course",orderedUnits=units,completionLock=useRef(false),navigationSequence=useRef(0),navigationPending=useRef(""),navigationPreferences=useRef(Promise.resolve()),abort=useRef(null);
const saveCode=async()=>{saved.push(draft);},loadLesson=(id,records)=>loads.push(id),setNoteSection=()=>{},setSearch=()=>{};
const routeHash=x=>JSON.stringify(x);
${handlers}
const choose=id=>${chooser};
const isConcept=activeId.startsWith("csharp");

useEffect(()=>{persisted.activeId=activeId;window.history.replaceState(null,"","#path?lesson="+activeId);},[activeId]);
expose({choose,setView,state,activeId,view,error});
return React.createElement("div",null,React.createElement("span",{"data-track":true},state.profile.track),React.createElement("span",{"data-active":true},activeId),React.createElement("button",null,"Projects"));
}`;
const code=ts.transpileModule(body,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.None}}).outputText;
const context={React,units,profile,persisted,requests,saved,loads,draft,request,window:dom.window,expose:x=>exposed=x};vm.createContext(context);
const Harness=vm.runInContext('(function(){'+code+'})()',context);let root=createRoot(document.getElementById('root'));
const flush=()=>act(async()=>{await new Promise(r=>setTimeout(r,0));});
const click=async id=>{await act(async()=>{exposed.choose(id);});await flush();};
const resolve=async i=>{await act(async()=>requests[i].resolve());await flush();};
try{
 await act(async()=>root.render(React.createElement(Harness)));
 await click('python');await resolve(0);
 assert.equal(exposed.activeId,'python-01','Course choice must replace the stale C# active lesson');
 assert.equal(exposed.state.profile.activeUnit,'python-01');assert.equal(exposed.view,'path');assert.ok(document.querySelector('button'),'Projects visible for selected Python');
 await click('csharp');await click('python');
 // A later navigation cannot be overwritten by an older request resolving late.
 await resolve(1);await flush();if(requests[2])await resolve(2);
 assert.equal(exposed.activeId,'python-01');assert.equal(exposed.state.profile.track,'python');
 assert.equal(persisted.activeId,'python-01');assert.match(dom.window.location.hash,/python-01/);assert.ok(saved.every(x=>x==='untouched C# draft'));
 await act(async()=>root.unmount());root=createRoot(document.getElementById('root'));context.profile=profile;await act(async()=>root.render(React.createElement(Harness)));
 assert.equal(exposed.activeId,'python-01');assert.ok(document.querySelector('button'));
 console.log('PASS actual CodeQuest selection handlers in React: C#→Python, rapid C#→Python with delayed saves, reload route, Projects capability and untouched drafts.');
}finally{await act(async()=>root.unmount());dom.window.close();}
