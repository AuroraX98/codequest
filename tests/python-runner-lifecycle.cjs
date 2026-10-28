const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const root=process.cwd();
const ts=require(root+'/node_modules/typescript');
const src=fs.readFileSync(root+'/lib/runner.ts','utf8').replace('import { runnerAssets, staticResponse } from "./offline-pack";','const {runnerAssets,staticResponse}=globalThis.__assets;');
const js=ts.transpileModule(src,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
function setup(){
 let listeners=new Set(),timers=new Map(),counter=0;const posts=[];
 const c={exports:{},crypto:{randomUUID:()=>String(++counter)},DOMException,Promise,AbortController,
 __assets:{runnerAssets:async()=>({}),staticResponse:async()=>({text:async()=>'<html>fixture</html>'})},
 window:{addEventListener:(type,fn)=>listeners.add(fn),removeEventListener:(type,fn)=>listeners.delete(fn)},
 setTimeout:(fn,ms)=>{const id=++counter;timers.set(id,{fn,ms});return id;},clearTimeout:id=>timers.delete(id)};
 vm.createContext(c);vm.runInContext(js,c);
 const frame={srcdoc:'',onload:null,removeAttribute(){},contentWindow:{postMessage:x=>posts.push(x)}};
 return {c,frame,posts,listeners,timers,run:c.exports.runProject,emit:e=>[...listeners].forEach(f=>f(e))};
}
const tick=()=>new Promise(r=>setImmediate(r));
(async()=>{
 let s=setup(),ctrl=new AbortController(),p=s.run(s.frame,{runtime:'python'},'unchanged',ctrl.signal);await tick();s.frame.onload();assert.equal(s.posts[0].code,'unchanged');assert.equal([...s.timers.values()][0].ms,60000);
 s.emit({source:{},data:{id:s.posts[0].id,type:'result',result:{checks:[{passed:true}]}}});assert.equal(s.listeners.size,1);
 ctrl.abort();const result=await p;assert.match(result.error,/Run stopped/);assert.equal(s.frame.srcdoc,'');assert.equal(s.posts.at(-1).type,'stop');assert.equal(s.listeners.size,0);assert.equal(s.timers.size,0);
 s=setup();p=s.run(s.frame,{runtime:'python'},'while True: pass');await tick();s.frame.onload();[...s.timers.values()][0].fn();assert.match((await p).error,/too long/);assert.equal(s.frame.srcdoc,'');assert.equal(s.listeners.size,0);
 s=setup();p=s.run(s.frame,{runtime:'python'},'print(1)');await tick();s.frame.onload();const id=s.posts[0].id;s.emit({source:s.frame.contentWindow,data:{id,type:'result',result:{output:['1'],checks:[]}}});assert.equal((await p).output[0],'1');assert.equal(s.timers.size,0);
 const frameSource=fs.readFileSync(root+'/public/runner/frame.html','utf8');assert.match(frameSource,/worker\?\.terminate\(\)/);assert.match(frameSource,/worker\.onmessage[\s\S]*?worker\.terminate\(\)/);assert.match(frameSource,/type === "stop"\) worker\?\.terminate\(\)/);
 console.log('PASS actual runProject lifecycle under controlled clock: 60s timeout, abort/stop, stale-frame rejection, response cleanup; staged worker termination guards retained. Not browser-worker execution.');
})().catch(e=>{console.error(e);process.exitCode=1});
