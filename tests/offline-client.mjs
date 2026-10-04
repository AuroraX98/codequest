import assert from 'node:assert/strict';
import {mkdtemp,readFile,writeFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';import path from 'node:path';
import ts from 'typescript';import 'fake-indexeddb/auto';
const temp=await mkdtemp(path.join(tmpdir(),'codequest-client-'));
for(const f of ['learning-client','device-db','profile']){let source=await readFile(`lib/${f}.ts`,'utf8');let js=ts.transpileModule(source,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext}}).outputText.replace(/from "\.\/([^"]+)"/g,'from "./$1.mjs"');await writeFile(path.join(temp,f+'.mjs'),js);}
const {LearningClient}=await import(path.join(temp,'learning-client.mjs'));const {defaultProfile}=await import(path.join(temp,'profile.mjs'));const {readDevice}=await import(path.join(temp,'device-db.mjs'));
const lessons=JSON.parse(await readFile('content/lessons.json','utf8'));const l=lessons.find(l=>l.id==='javascript-02');
Object.defineProperty(globalThis,'navigator',{value:{onLine:true},configurable:true});
let remote={draftScope:'a'.repeat(64),profile:{...defaultProfile,autoSync:false},progress:[],xp:0,completed:0,streak:0,todayCompleted:0,recentDays:[],keyConnected:false,tutorUsed:0};
let available=true,posts=[],pause,paused,release,dropAck=false;let client;
const response=(value,status=200)=>new Response(JSON.stringify(value),{status,headers:{'content-type':'application/json'}});
globalThis.fetch=async(url,options={})=>{
 if(!available)throw new TypeError('offline');
 if(!options.method){if(url.includes('?unit='))return response({draftScope:remote.draftScope,history:[],chat:[]});return response(remote);}
 const a=JSON.parse(options.body);posts.push(a);
 if(a.deviceScope!==remote.draftScope)return response({error:'Account mismatch'},403);
 let p=remote.progress.find(p=>p.unitId===a.unitId);
 if(a.action==='save'){
  if(p?.code!==a.code && (p?.code??l.starter)!==a.expectedCode)return response({conflict:true},409);
  if(!p){p={unitId:a.unitId,code:l.starter,quizPassed:0,mathPassed:0,completedAt:null,lastRun:null,updatedAt:''};remote.progress.push(p);}p.code=a.code;
 }else if(a.action==='key'){remote.keyConnected=true;remote.aiProvider=a.provider??'deepseek';}
 else if(a.action==='disconnect'){remote.keyConnected=false;remote.aiProvider=null;}
 else if(a.action==='preferences')remote.profile={...remote.profile,...a.settings};
 else if(a.action==='quiz'||a.action==='math'){p??=remote.progress.find(p=>p.unitId===a.unitId);if(a.answer===l[a.action]?.answer)p[a.action==='quiz'?'quizPassed':'mathPassed']=1;}
 else if(a.action==='complete'){if(!p.completedAt){p.completedAt=a.completedAt;remote.xp+=100;remote.completed++;}}
 const committed=structuredClone(remote);
 if(pause){pause=false;paused();await new Promise(r=>release=r);}
 if(dropAck){dropAck=false;throw new TypeError('connection lost after commit');}
 return response(committed);
};
client=new LearningClient(lessons,remote);await client.initialize();
await client.mutate({action:'save',unitId:l.id,code:'first'});
pause=true;let reached=new Promise(r=>paused=r);let flight=client.sync(true);await reached;
await client.mutate({action:'save',unitId:l.id,code:'second'});release();await flight;
assert.equal(remote.progress[0].code,'second');assert.equal(client.status.pending,0);
// A delayed second-tab acknowledgment cannot roll the device back.
await client.mutate({action:'save',unitId:l.id,code:'third'});pause=true;reached=new Promise(r=>paused=r);flight=client.sync(true);await reached;
await client.mutate({action:'save',unitId:l.id,code:'fourth'});const tabB=new LearningClient(lessons,remote);await tabB.initialize();await tabB.sync(true);release();await flight;
assert.equal(client.current.progress[0].code,'fourth');assert.equal(client.status.pending,0);
// Reload after a disconnected save, and reject account switches before any POST.
available=false;await client.mutate({action:'save',unitId:l.id,code:'offline latest'});
let reload=new LearningClient(lessons,remote);await reload.initialize();assert.equal(reload.current.progress[0].code,'offline latest');assert.equal(reload.status.online,false);
available=true;remote.draftScope='b'.repeat(64);const count=posts.length;await reload.sync(true);assert.equal(posts.length,count);assert.equal(reload.status.pending,1);remote.draftScope='a'.repeat(64);
// Conflict, edit once more, choose account, and retain the newest device version.
remote.progress[0].code='other device';await reload.sync(true);assert.ok(reload.status.conflict);
await reload.mutate({action:'save',unitId:l.id,code:'newest device copy'});await reload.resolve('account');
assert.equal(reload.current.progress[0].code,'other device');assert.equal(reload.status.pending,0);assert.ok((await reload.detail(l.id)).history.some(h=>h.code==='newest device copy'));
// A confirmed starter reset saves the current edit before replacing it, even offline.
available=false;
const justEdited='const temperature = 19; // saved immediately before reset';
await reload.mutate({action:'save',unitId:l.id,code:justEdited});
await reload.mutate({action:'save',unitId:l.id,code:l.starter});
assert.equal(reload.current.progress[0].code,l.starter);
assert.ok((await reload.detail(l.id)).history.some(h=>h.code===justEdited));
available=true;await reload.sync(true);
assert.equal(remote.progress[0].code,l.starter);assert.equal(reload.status.pending,0);
assert.ok((await reload.detail(l.id)).history.some(h=>h.code===justEdited));
// Lost acknowledgment replay remains safe.
await reload.mutate({action:'save',unitId:l.id,code:'committed once'});dropAck=true;await reload.sync(true);assert.equal(reload.status.pending,1);await reload.sync(true);assert.equal(reload.status.pending,0);assert.equal(remote.progress[0].code,'committed once');
await reload.mutate({action:'quiz',unitId:l.id,answer:l.quiz.answer});if(l.math)await reload.mutate({action:'math',unitId:l.id,answer:l.math.answer});
await reload.sync(true);await reload.mutate({action:'complete',unitId:l.id,code:'committed once',checks:l.checks.map(c=>({label:c.label,passed:true}))});dropAck=true;await reload.sync(true);await reload.sync(true);assert.equal(remote.xp,100);assert.equal(reload.status.pending,0);assert.ok(remote.progress[0].completedAt);
// Successful and failed connection actions never persist a credential in the outbox.
const marker='test-only-key-that-must-never-be-cached';
await reload.mutate({action:'key',provider:'openai',key:marker});
assert.equal(reload.current.aiProvider,'openai');
const saved=await readDevice('accounts','a'.repeat(64));assert.ok(!JSON.stringify(saved).includes(marker));assert.equal(saved.queue.length,0);
available=false;const offlineProvider=new LearningClient(lessons,remote);await offlineProvider.initialize();assert.equal(offlineProvider.current.aiProvider,'openai');
Object.defineProperty(globalThis,'navigator',{value:{onLine:false},configurable:true});
await assert.rejects(offlineProvider.mutate({action:'key',provider:'anthropic',key:marker}),/internet connection/);
assert.ok(!JSON.stringify(await readDevice('accounts','a'.repeat(64))).includes(marker));
Object.defineProperty(globalThis,'navigator',{value:{onLine:true},configurable:true});available=true;
await reload.mutate({action:'disconnect'});assert.equal(reload.current.aiProvider,null);
// Account-scoped storage has no API key fields.
assert.ok(!JSON.stringify(await readDevice('accounts','a'.repeat(64))).includes('encrypted_key'));
console.log('Passed 10 offline client flows: in-flight edits, delayed cross-tab acknowledgment, reload, account switch, conflict recovery, starter reset history preservation, lost acknowledgment, completion replay, credential exclusion and offline provider metadata.');
await rm(temp,{recursive:true,force:true});
