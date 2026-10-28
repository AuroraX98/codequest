import {tmpdir} from 'node:os';
import assert from 'node:assert/strict';
import {readFile,mkdtemp,writeFile,rm} from 'node:fs/promises';
import {createRequire} from 'node:module';
import {DatabaseSync} from 'node:sqlite';
import vm from 'node:vm';
import ts from 'typescript';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import 'fake-indexeddb/auto';
const require=createRequire(import.meta.url);
const lessons=JSON.parse(await readFile('content/lessons.json','utf8'));
const catalog=JSON.parse(await readFile('content/catalog.json','utf8'));
const newTracks=['csharp','cpp','java','c','go','kotlin','rust','php','ruby','r'];
const newLessons=newTracks.flatMap(track=>{const units=catalog.units.filter(u=>u.track===track);assert.ok(units.length>=6,`${track}: at least six integrated foundation lessons`);return units.map(u=>{const l=lessons.find(l=>l.id===u.id);assert.ok(l,`${u.id}: catalog lesson exists`);assert.equal(l.learningMode,'concept',u.id);return l;});});
newLessons.push(...lessons.filter(l=>(l.id.startsWith('ai-')&&Number(l.id.slice(3))>=25)||(l.id.startsWith('developer-toolkit-')&&Number(l.id.split('-').at(-1))>=16)));
const nativeModule=lessons.find(l=>l.id==='javascript-46');assert.equal(nativeModule.learningMode,'concept');newLessons.push(nativeModule);for(const id of ['sql-51','sql-52']){const local=lessons.find(l=>l.id===id);assert.equal(local.learningMode,'concept');newLessons.push(local);}
const htmlConcept=lessons.find(l=>l.id==='html-42');assert.equal(htmlConcept.learningMode,'concept');newLessons.push(htmlConcept);
const cssPrint=lessons.find(l=>l.id==='css-47');assert.equal(cssPrint.learningMode,'concept');newLessons.push(cssPrint);
newLessons.push(...lessons.filter(l=>['typescript-48','typescript-49'].includes(l.id)));
const concept={id:'concept-fixture',learningMode:'concept',runtime:'concept',starter:'',checks:[],explanation:['Inputs are supplied.','Outputs are produced.'],quiz:{question:'Which result?',choices:['A','B'],answer:1,explanation:'B follows the rule.'}};
const coding=lessons.find(x=>x.id==='javascript-01');
const scope='a'.repeat(64);let user='owner-a',beforeBatch;
const database=new DatabaseSync(':memory:');
database.exec(`CREATE TABLE profiles(user_id TEXT PRIMARY KEY,settings TEXT);CREATE TABLE progress(user_id TEXT,unit_id TEXT,code TEXT DEFAULT '',quiz_passed INTEGER DEFAULT 0,math_passed INTEGER DEFAULT 0,completed_at TEXT,last_run TEXT,updated_at TEXT,PRIMARY KEY(user_id,unit_id));CREATE TABLE activity(user_id TEXT,day TEXT,completed INTEGER,PRIMARY KEY(user_id,day));CREATE TABLE lesson_reading(user_id TEXT,lesson_id TEXT,section_key TEXT,checked INTEGER,marked_at TEXT,updated_at TEXT,PRIMARY KEY(user_id,lesson_id,section_key));`);
function statement(sql){let args=[];return {bind(...v){args=v;return this},async first(){return database.prepare(sql).get(...args)??null},async all(){return {results:database.prepare(sql).all(...args)}},async run(){return {meta:{changes:Number(database.prepare(sql).run(...args).changes)}}}}};
const d1={prepare:statement,async batch(statements){if(beforeBatch){const f=beforeBatch;beforeBatch=null;f()}database.exec('BEGIN');try{const r=[];for(const s of statements)r.push(await s.run());database.exec('COMMIT');return r}catch(e){database.exec('ROLLBACK');throw e}}};
const state=async()=>({draftScope:scope,progress:database.prepare('SELECT unit_id AS unitId,completed_at AS completedAt,last_run AS lastRun,quiz_passed AS quizPassed FROM progress WHERE user_id=?').all(user)});
database.prepare('INSERT INTO profiles VALUES(?,?)').run('owner-a',JSON.stringify({runnerUrl:'http://127.0.0.1:8765',activeUnit:coding.id,track:'javascript'}));
database.prepare('INSERT INTO profiles VALUES(?,?)').run('owner-b',JSON.stringify({track:'javascript'}));
const server={db:()=>d1,owner:async()=>{if(!user)throw Error('signed out');return user},state,accountScope:async u=>u==='owner-a'?scope:'b'.repeat(64),checkOrigin:req=>{if(req.headers.get('origin')!=='https://fixture.example')throw Error('origin')},errorResponse:e=>Response.json({error:e.message},{status:403}),profile:async u=>database.prepare('SELECT settings FROM profiles WHERE user_id=?').get(u),defaults:{},encryptConnection:()=>{throw Error('not used')}};
const completionModule={exports:{}};
vm.runInNewContext(ts.transpileModule(await readFile('lib/lesson-completion.ts','utf8'),{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.CommonJS}}).outputText,{module:completionModule,exports:completionModule.exports});
const completion=completionModule.exports;
const checksModule={exports:{}};vm.runInNewContext(ts.transpileModule(await readFile('lib/project-checks.ts','utf8'),{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.CommonJS}}).outputText,{module:checksModule,exports:checksModule.exports});
const fixture={exports:{}};
const source=ts.transpileModule(await readFile('app/api/quest/route.ts','utf8'),{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.CommonJS,esModuleInterop:true}}).outputText;
vm.runInNewContext(source,{module:fixture,exports:fixture.exports,require:id=>id==='../../../lib/project-checks'?checksModule.exports:id==='../../../lib/server'?server:id==='../../../lib/lesson-completion'?completion:id==='../../../content/lessons.json'?[concept,...lessons]:id==='../../../content/catalog.json'?{...catalog,units:[{id:concept.id,track:'ai'},...catalog.units]}:require(id),crypto,Request,Response,Headers,URL,Date});
const post=(body,origin='https://fixture.example')=>fixture.exports.POST(new Request('https://fixture.example/api/quest',{method:'POST',headers:{origin,'content-type':'application/json'},body:JSON.stringify(body)}));
const finish={action:'completeConcept',unitId:concept.id,deviceScope:scope};
const done=()=>database.prepare('SELECT completed_at,last_run FROM progress WHERE user_id=? AND unit_id=?').get('owner-a',concept.id);
const activity=()=>database.prepare('SELECT coalesce(sum(completed),0) AS count FROM activity').get().count;
try{
 assert.equal((await post(finish)).status,400,'no quiz/reading cannot finish');assert.equal(activity(),0);
 assert.equal((await post({...finish,deviceScope:'b'.repeat(64)})).status,403,'wrong account scope');
 assert.equal((await post(finish,'https://attacker.example')).status,403,'origin');
 assert.equal((await post({...finish,deviceScope:undefined})).status,400,'explicit scope required');
 assert.equal((await post({...finish,unitId:coding.id})).status,400,'coding cannot use concept gate');
 await post({action:'quiz',unitId:concept.id,answer:1,deviceScope:scope});
 for(const key of ['text:0','text:1'])database.prepare('INSERT INTO lesson_reading VALUES(?,?,?,?,?,?)').run('owner-b',concept.id,key,1,'now','now');
 assert.equal((await post(finish)).status,400,'other owner reading does not count');
 database.prepare('INSERT INTO lesson_reading VALUES(?,?,?,?,?,?)').run('owner-a',concept.id,'text:0',1,'now','now');
 database.prepare('INSERT INTO lesson_reading VALUES(?,?,?,?,?,?)').run('owner-a',concept.id,'text:99',1,'now','now');
 assert.equal((await post(finish)).status,400,'extra key cannot replace canonical key');
 database.prepare('INSERT INTO lesson_reading VALUES(?,?,?,?,?,?)').run('owner-a',concept.id,'text:1',1,null,'now');
 assert.equal((await post(finish)).status,400,'checked without timestamp is not real saved mark');
 database.exec("UPDATE lesson_reading SET marked_at='now' WHERE user_id='owner-a' AND section_key='text:1'");
 database.exec("UPDATE progress SET quiz_passed=0 WHERE unit_id='concept-fixture'");
 assert.equal((await post(finish)).status,400,'all reading does not replace quiz');
 database.exec("UPDATE progress SET quiz_passed=1 WHERE unit_id='concept-fixture'");
 beforeBatch=()=>database.exec("UPDATE lesson_reading SET checked=0 WHERE user_id='owner-a' AND section_key='text:1'");
 assert.equal((await post(finish)).status,400,'gate evaluated in transaction after concurrent uncheck');assert.equal(activity(),0);assert.equal(done().completed_at,null);
 database.exec("UPDATE lesson_reading SET checked=1 WHERE user_id='owner-a' AND section_key='text:1'");
 const ok=await post({...finish,code:'fake',checks:[{label:'fake',passed:true}],completedAt:'2020-01-01T00:00:00.000Z'});assert.equal(ok.status,200);assert.equal(ok.headers.get('cache-control'),'no-store');assert.ok(done().completed_at);assert.equal(done().last_run,null,'never fabricated run');assert.equal(activity(),1);
 assert.equal((await post(finish)).status,200);assert.equal(activity(),1,'idempotent activity');
 assert.equal((await post({...finish,action:'complete',manualReview:true,checks:[],code:''})).status,400,'no bypass via coding complete');
 await post({action:'quiz',unitId:coding.id,answer:coding.quiz.answer,deviceScope:scope});
 const normal=await post({action:'complete',unitId:coding.id,deviceScope:scope,code:coding.starter,checks:coding.checks.map(c=>({label:c.label,passed:true}))});
 assert.equal(normal.status,200,'normal coding completion preserved');
 assert.ok(database.prepare('SELECT last_run FROM progress WHERE unit_id=?').get(coding.id).last_run);
 // Compiler contracts are completion evidence, not only display rows.
 for(const typed of lessons.filter(l=>l.runtime==='typescript'&&l.learningMode!=='concept')){
  await post({action:'quiz',unitId:typed.id,answer:typed.quiz.answer,deviceScope:scope});
  const proof=checksModule.exports.projectChecks(typed).map(c=>({label:c.label,passed:true}));
  const request={action:'complete',unitId:typed.id,deviceScope:scope,code:typed.starter};
  for(const checks of [typed.checks.map(c=>({label:c.label,passed:true})),proof.slice(1),proof.map((c,i)=>i?c:{...c,passed:false}),proof.map((c,i)=>i?c:{...c,label:'Wrong'})])assert.equal((await post({...request,checks})).status,400,typed.id+': incomplete or wrong compiler proof');
  assert.equal((await post({...request,checks:proof})).status,200,typed.id+': exact combined proof');
 }
 console.log('PASS actual server completion for46 TypeScript projects: omitted/failed/wrong compiler proof rejected, combined proof accepted.');
 // Exercise the integrated data, not fabricated per-track fixtures. SQLite marks
 // stand in for already acknowledged reading writes; key generation is production code.
 const beforeNew=activity();
 for(const lesson of newLessons){
  const keys=completion.getReadingSectionKeys(lesson);assert.ok(keys.length>0,lesson.id);
  const request={action:'completeConcept',unitId:lesson.id,deviceScope:scope};
  const record=()=>database.prepare('SELECT completed_at,last_run,quiz_passed FROM progress WHERE user_id=? AND unit_id=?').get(user,lesson.id);
  const wrong=(lesson.quiz.answer+1)%lesson.quiz.choices.length;
  assert.equal((await post({action:'quiz',unitId:lesson.id,answer:wrong,deviceScope:scope})).status,200);
  for(const key of keys.slice(0,-1))database.prepare('INSERT INTO lesson_reading VALUES(?,?,?,?,?,?)').run(user,lesson.id,key,1,'2026-10-27T00:00:00Z','2026-10-27T00:00:00Z');
  assert.equal((await post(request)).status,400,lesson.id+': missing read and wrong quiz');
  database.prepare('INSERT INTO lesson_reading VALUES(?,?,?,?,?,?)').run(user,lesson.id,keys.at(-1),1,'2026-10-27T00:00:00Z','2026-10-27T00:00:00Z');
  assert.equal((await post(request)).status,400,lesson.id+': canonical reading cannot replace quiz');
  assert.equal(record().completed_at,null);
  await post({action:'quiz',unitId:lesson.id,answer:lesson.quiz.answer,deviceScope:scope});
  database.prepare('UPDATE lesson_reading SET checked=0 WHERE user_id=? AND lesson_id=? AND section_key=?').run(user,lesson.id,keys.at(-1));
  assert.equal((await post(request)).status,400,lesson.id+': passed quiz cannot replace missing read');
  database.prepare('UPDATE lesson_reading SET checked=1 WHERE user_id=? AND lesson_id=? AND section_key=?').run(user,lesson.id,keys.at(-1));
  const response=await post({...request,code:'fabricated',checks:[{label:'fake compiler',passed:true}]});
  assert.equal(response.status,200,lesson.id);assert.equal(response.headers.get('cache-control'),'no-store');
  assert.ok(record().completed_at,lesson.id);assert.equal(record().last_run,null,lesson.id+': no fabricated code run');
  const count=activity();assert.equal((await post(request)).status,200);assert.equal(activity(),count,lesson.id+': no duplicate completion reward');
  assert.equal((await post({...request,action:'complete',manualReview:true,checks:[]})).status,400,lesson.id+': no coding completion bypass');
 }
 assert.equal(activity()-beforeNew,newLessons.length,'exactly one real completion activity per new lesson');
 for(const track of newTracks){
  const activeUnit=catalog.units.find(u=>u.track===track).id;
  const response=await post({action:'preferences',deviceScope:scope,settings:{track,activeUnit}});
  assert.equal(response.status,200,track+': catalog-derived track accepted');
  assert.equal(response.headers.get('cache-control'),'no-store');
  const saved=JSON.parse(database.prepare('SELECT settings FROM profiles WHERE user_id=?').get(user).settings);
  assert.equal(saved.track,track);assert.equal(saved.activeUnit,activeUnit);
 }
 assert.equal((await post({action:'preferences',deviceScope:scope,settings:{track:'not-a-course'}})).status,400,'unknown track rejected');
 assert.equal(JSON.parse(database.prepare('SELECT settings FROM profiles WHERE user_id=?').get('owner-b').settings).track,'javascript','profile writes isolated by account');
 console.log('PASS integrated new-course coverage: '+newLessons.length+' lessons across10 tracks plus native JavaScript46 and SQL51/52, production canonical reading keys, wrong/correct quiz gates, idempotent completion, no fake code run, persisted catalog-derived preferences.');
 console.log('PASS server concept gates: account/origin, quiz, all saved canonical marks, atomic eligibility, idempotence, no fake last_run, coding-route separation.');
}finally{database.close()}
const temp=await mkdtemp(path.join(tmpdir(),'codequest-concept-client-'));
try{
 for(const name of ['learning-client','device-db','profile','project-checks']){const js=ts.transpileModule(await readFile(`lib/${name}.ts`,'utf8'),{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext}}).outputText.replace(/from "\.\/([^\"]+)"/g,'from "./$1.mjs"');await writeFile(path.join(temp,name+'.mjs'),js)}
 const {LearningClient}=await import(pathToFileURL(path.join(temp,'learning-client.mjs')));
 const {defaultProfile}=await import(pathToFileURL(path.join(temp,'profile.mjs')));
 const {readDevice}=await import(pathToFileURL(path.join(temp,'device-db.mjs')));
 for(const typed of lessons.filter(l=>l.runtime==='typescript'&&l.learningMode!=='concept')){
  const state={profile:defaultProfile,progress:[{unitId:typed.id,code:typed.starter,quizPassed:1,completedAt:null}],xp:0,completed:0,recentDays:[],streak:0,todayCompleted:0};
  const typedClient=new LearningClient([typed],state);const proof=checksModule.exports.projectChecks(typed).map(c=>({label:c.label,passed:true}));
  const request={action:'complete',unitId:typed.id,code:typed.starter};
  for(const checks of [typed.checks.map(c=>({label:c.label,passed:true})),proof.slice(1),proof.map((c,i)=>i?c:{...c,passed:false}),proof.map((c,i)=>i?c:{...c,label:'Wrong'})])assert.throws(()=>typedClient.apply(state,{...request,checks},'now'),/checks/,typed.id);
  assert.ok(typedClient.apply(state,{...request,checks:proof},'now').progress[0].completedAt);
 }
 console.log('PASS actual offline apply for46 TypeScript projects: compiler evidence required, exact combined proof accepted.');

 Object.defineProperty(globalThis,'navigator',{value:{onLine:true},configurable:true});
 let remote={draftScope:scope,profile:{...defaultProfile,autoSync:false},progress:[],xp:0,completed:0,streak:0,todayCompleted:0,recentDays:[],keyConnected:false,tutorUsed:0};
 const posts=[];let reject=false,wrongScope=false;
 globalThis.fetch=async(_url,options={})=>{if(!options.method)return Response.json(remote);const a=JSON.parse(options.body);posts.push(a);if(a.action==='quiz'){remote.progress=[{unitId:concept.id,code:'',quizPassed:1,mathPassed:0,completedAt:null,lastRun:null}];return Response.json({state:remote,correct:true,feedback:'ok'})}if(a.action==='completeConcept'){if(reject)return Response.json({error:'Read first'},{status:400});remote.progress[0].completedAt=new Date().toISOString();remote.completed=1;return Response.json({...remote,draftScope:wrongScope?'b'.repeat(64):scope})}throw Error('unexpected')};
 const client=new LearningClient([concept,coding],remote);await client.initialize();
 navigator.onLine=false;await assert.rejects(client.mutate(finish),/Reconnect/);assert.equal(posts.length,0);assert.equal(client.current.completed,0);
 navigator.onLine=true;await client.mutate({action:'quiz',unitId:concept.id,answer:1});assert.equal(client.status.pending,1);
 reject=true;await assert.rejects(client.mutate(finish),/Read first/);assert.deepEqual(posts.map(x=>x.action),['quiz','completeConcept']);assert.equal(client.current.completed,0);assert.equal(client.status.pending,0);assert.equal((await readDevice('accounts',scope)).queue.length,0,'concept completion never queued');
 reject=false;await client.mutate(finish);assert.equal(client.current.completed,1);assert.equal(client.current.progress[0].lastRun,null);assert.equal(client.status.pending,0);
 await assert.rejects(client.mutate({...finish,unitId:coding.id}),/project completion/);
 await assert.rejects(client.mutate({...finish,deviceScope:'b'.repeat(64)}),/Account changed/);
 const before=JSON.stringify(client.current);wrongScope=true;await assert.rejects(client.mutate(finish),/Account changed/);assert.equal(JSON.stringify(client.current),before);
 console.log('PASS client online-only concept completion: flush quiz first, server rejection leaves incomplete, no queued/optimistic completion, authoritative adoption and account guards.');
}finally{await rm(temp,{recursive:true,force:true})}
