import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {createRequire} from 'node:module';
import {JSDOM, VirtualConsole} from 'jsdom';
const root=process.cwd(), dir=path.join(root,'.codequest-local/js-wording-native');
await fs.mkdir(dir,{recursive:true});
const lessons=JSON.parse(await fs.readFile('content/lessons.json','utf8')).filter(l=>l.id.startsWith('javascript-'));
const outcomes=[],failures=[];
const AsyncFunction=Object.getPrototypeOf(async function(){}).constructor;
const fence=/```(\w*)\n([\s\S]*?)```/g;
const print=(...v)=>v.map(x=>typeof x==='object'?JSON.stringify(x):String(x)).join(' ');
async function execute(code,checks=[],html=''){
 const output=[],domErrors=[];const virtualConsole=new VirtualConsole();virtualConsole.on('jsdomError',e=>domErrors.push(e.message));
 const dom=new JSDOM(html,{url:'https://practice.example/',virtualConsole});
 const unhandled=[]; const onRejection=reason=>unhandled.push(String(reason));
 process.on('unhandledRejection',onRejection);
 const timers=new Set();
 const later=(fn,ms,...args)=>{const t=setTimeout(fn,ms,...args);timers.add(t);return t;};
 try{
  const names=['console','document','window','Event','MouseEvent','HTMLElement','setTimeout','clearTimeout','fetch','__checks','__output'];
  const args=[{log:(...v)=>output.push(print(...v)),warn:(...v)=>output.push(print(...v))},dom.window.document,dom.window,dom.window.Event,dom.window.MouseEvent,dom.window.HTMLElement,later,clearTimeout,()=>{throw Error('External network disabled in course checks')},checks,output];
  const fn=new AsyncFunction(...names,code+'\nconst results=[];for(const c of __checks){try{results.push({label:c.label,passed:!!(await eval(c.expression))})}catch(e){results.push({label:c.label,passed:false,error:e.message})}}await Promise.resolve();return results;');
  let timeout;const results=await Promise.race([fn(...args),new Promise((_,reject)=>{timeout=setTimeout(()=>reject(Error('Timeout')),3000)})]).finally(()=>clearTimeout(timeout));
  await new Promise(resolve=>setImmediate(resolve));
  return {output,checks:results,unhandled,domErrors};
 }finally{for(const t of timers)clearTimeout(t);dom.window.close();process.removeListener('unhandledRejection',onRejection)}
}
function native(file,code,args=[]){
 const full=path.join(dir,file);return fs.writeFile(full,code).then(()=>{const result=spawnSync(process.execPath,[...args,full],{cwd:dir,encoding:'utf8',timeout:15000});return{status:result.status,output:result.stdout.trim().split(/\r?\n/),error:result.stderr.trim()};});
}
for(const l of lessons){
 let html=l.extraFiles?.find(x=>x.name.endsWith('.html'))?.code||'';
 for(const [i,s] of l.explanation.entries()){
  const blocks=[...s.matchAll(fence)];for(const b of blocks)if(b[1]==='html')html=b[2];
  for(const [j,b]of blocks.entries()){
   if(b[1]!=='javascript')continue;
   const key=l.id+':section'+(i+1);let r;
   try{
    if(l.id==='javascript-16'&&/module\.exports/.test(b[2])){r=await native('totals.cjs',b[2]);assert.equal(r.status,0);}
    else if(l.id==='javascript-16'&&/require\("\.\/totals"\)/.test(b[2])){await fs.writeFile(path.join(dir,'package.json'),'{"type":"commonjs"}');await fs.copyFile(path.join(dir,'totals.cjs'),path.join(dir,'totals.js'));r=await native('report.cjs',b[2]);assert.equal(r.status,0,r.error);}
    else if(l.id==='javascript-16'&&/require\("lodash"\)/.test(b[2])){const resolved=createRequire(path.join(dir,'package.json')).resolve('lodash');r=await native('lodash-report.cjs',b[2].replace('require("lodash")','require('+JSON.stringify(resolved)+')'));assert.equal(r.status,0,r.error);}
    else if(l.id==='javascript-46'&&/\bexport\b/.test(b[2])){r=await native('counter.mjs',b[2]);assert.equal(r.status,0,r.error);}
    else if(l.id==='javascript-46'){r=await native('main.mjs',b[2]);assert.equal(r.status,0,r.error);}
    else if(l.id==='javascript-62'&&/node:test/.test(b[2])){r=await native('clamp.test.mjs',b[2],['--test','--test-reporter=tap']);assert.equal(r.status,0,r.error);assert.ok(r.output.some(x=>/ok 1 - lower boundary/.test(x)));const bad=await native('clamp-failing.test.mjs',b[2].replace('clamp(-1), 0','clamp(-1), 1'),['--test','--test-reporter=tap']);assert.notEqual(bad.status,0);assert.ok(bad.output.some(x=>/not ok 1 - lower boundary/.test(x)));}
    else {r=await execute(b[2],[],html);assert.deepEqual(r.unhandled,[],key+' no unhandled rejection');assert.deepEqual(r.domErrors,[],key+' no DOM error');}
    const expected=blocks.slice(j+1).find(x=>x[1]==='text');
    if(expected)assert.equal(r.output.join('\n'),expected[2].trimEnd(),key+' printed output');
    outcomes.push({key,mode:'status'in r?'native Node':'Node + DOM simulation',...r});
   }catch(e){failures.push({key,error:e.message,code:b[2]})}
  }
 }
 if(l.learningMode!=='concept'){
  for(const which of ['solution','starter']){
   try{
    const r=await execute(l[which],l.checks,l.extraFiles?.find(x=>x.name.endsWith('.html'))?.code||'');
    if(which==='solution'){assert.deepEqual(r.unhandled,[],l.id+' solution handles its rejections');assert.deepEqual(r.domErrors,[],l.id+' no DOM error');assert.equal(r.checks.filter(x=>!x.passed).length,0,JSON.stringify(r.checks.filter(x=>!x.passed)));}
    else assert.ok(r.checks.some(x=>!x.passed),l.id+' starter must not pass everything');
    outcomes.push({key:l.id+':'+which,mode:'Node + DOM simulation',...r});
   }catch(e){if(which==='starter'&&!(e instanceof assert.AssertionError))outcomes.push({key:l.id+':starter',mode:'incomplete starter rejected',error:e.message});else failures.push({key:l.id+':'+which,error:e.message})}
  }
 }
}
// Check the actual downloaded CommonJS files and the live-binding module boundary.
const download=lessons.find(l=>l.id==='javascript-16');
for(const file of download.extraFiles)await fs.writeFile(path.join(dir,file.name),file.code);
const downloaded=spawnSync(process.execPath,['report.js'],{cwd:dir,encoding:'utf8',timeout:10000});
assert.equal(downloaded.status,0,downloaded.stderr);assert.equal(downloaded.stdout.trim(),'Total minutes: 60');
outcomes.push({key:'javascript-16:downloaded-files',mode:'native Node with installed dependency',output:downloaded.stdout.trim()});
const live=await native('twice.mjs','import {count,increment} from "./counter.mjs"; increment(); increment(); console.log(count);');
assert.equal(live.status,0);assert.deepEqual(live.output,['2']);
const forbidden=await native('forbidden.mjs','import {count} from "./counter.mjs"; count=9;');
assert.notEqual(forbidden.status,0);assert.match(forbidden.error,/TypeError/);
outcomes.push({key:'javascript-46:live-and-readonly',mode:'native Node',twice:live.output,assignmentRejected:true});
// Mutation checks prove that the strengthened exercise checks reject known false positives.
for(const [id,mutate]of [
 ['javascript-14',s=>s.replace('const data = await fetchData(); showSuccess(data);','await fetchData();')],
 ['javascript-17',s=>s.replace(/visited\+\+/g,'visited += 0')]
]){
 const l=lessons.find(x=>x.id===id),bad=mutate(l.solution);assert.notEqual(bad,l.solution,id+' mutant changes code');
 const r=await execute(bad,l.checks);assert.ok(r.checks.some(x=>!x.passed),id+' mutant rejected');outcomes.push({key:id+':mutant',checks:r.checks});
}
const report={status:failures.length?'FAIL':'PASS',lessons:69,projects:68,checks:lessons.reduce((n,l)=>n+l.checks.length,0),examples:outcomes.filter(x=>x.key.includes(':section')).length,outcomes,failures,limits:['Node execution with JSDOM for DOM examples is not a real-browser layout or interaction test.','Local modules and Node test runner executed separately.','No external network requests; browser-storage companion uses disposable simulated storage.']};
await fs.writeFile('docs/javascript-wording-v1/runtime-results.json',JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({...report,outcomes:undefined},null,2));if(failures.length)process.exitCode=1;

