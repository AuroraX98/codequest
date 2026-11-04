import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import net from 'node:net';
import {spawn} from 'node:child_process';
const scratch=path.resolve('../backend-runtime');
await new Promise((resolve,reject)=>{const probe=net.createServer();probe.once('error',reject);probe.listen(3000,'127.0.0.1',()=>probe.close(resolve));});
async function start(cwd,file='server.mjs'){
 const child=spawn(process.execPath,[file],{cwd,env:{...process.env,ALICE_PASSWORD:'disposable-alice',BOB_PASSWORD:'disposable-bob'},stdio:['ignore','pipe','pipe'],windowsHide:true});
 let err='';child.stderr.on('data',d=>err+=d);
 await new Promise((resolve,reject)=>{const timer=setTimeout(()=>reject(new Error('server start timed out '+err)),10000);child.once('exit',code=>{clearTimeout(timer);reject(new Error('server exited '+code+' '+err));});child.stdout.once('data',()=>{clearTimeout(timer);resolve();});});
 return child;
}
async function stop(p){if(p.exitCode!==null)return;const done=new Promise(resolve=>p.once('exit',resolve));p.kill();await done;}
async function req(route,body,cookie){
 const r=await fetch('http://127.0.0.1:3000'+route,{method:body===undefined?'GET':'POST',headers:{'Content-Type':'application/json',...(cookie?{Cookie:cookie}:{})},...(body===undefined?{}:{body:JSON.stringify(body)})});
 return {status:r.status,body:await r.json(),cookie:r.headers.get('set-cookie')?.split(';')[0]};
}
const results=[];
let p=await start(scratch,'backend-01-example.mjs');
try{
 assert.deepEqual((await req('/visits')).body,[]);
 assert.equal((await req('/visits',{minutes:25})).status,201);
 for(const minutes of [0,181,1.5,'25'])assert.equal((await req('/visits',{minutes})).status,400);
 const rows=(await req('/visits')).body;assert.equal(rows.length,1);assert.equal(rows[0].minutes,25);assert.equal(typeof rows[0].id,'string');
 results.push({id:'backend-01-example',status:'PASS',checks:['GET','valid POST','invalid POST','unchanged record count on rejection']});
}finally{await stop(p);}
for(const id of ['backend-01','backend-02','backend-05']){
 const src=path.join(scratch,id),dir=fs.mkdtempSync(path.join(scratch,id+'-http-'));
 for(const name of fs.readdirSync(src))fs.copyFileSync(path.join(src,name),path.join(dir,name));
 p=await start(dir);
 try{
  if(id==='backend-05'){
   assert.equal((await req('/entries')).status,401);
   assert.equal((await req('/login',{user:'alice',password:'wrong'})).status,401);
   const alice=await req('/login',{user:'alice',password:'disposable-alice'}),bob=await req('/login',{user:'bob',password:'disposable-bob'});
   assert.equal(alice.status,200);assert.equal(bob.status,200);
   assert.equal((await req('/entries',{minutes:25},alice.cookie)).status,201);
   assert.equal((await req('/entries',{minutes:0},alice.cookie)).status,400);
   assert.equal((await req('/entries',undefined,alice.cookie)).body.length,1);
   assert.deepEqual((await req('/entries',undefined,bob.cookie)).body,[]);
   await stop(p);p=await start(dir);
   assert.equal((await req('/entries',undefined,alice.cookie)).status,401);
   const login=await req('/login',{user:'alice',password:'disposable-alice'});
   assert.equal((await req('/entries',undefined,login.cookie)).body.length,1);
  }else{
   await new Promise((resolve,reject)=>{const test=spawn(process.execPath,['--test','test.mjs'],{cwd:dir,stdio:['ignore','pipe','pipe'],windowsHide:true});let msg='';test.stdout.on('data',d=>msg+=d);test.stderr.on('data',d=>msg+=d);test.once('exit',code=>code===0?resolve():reject(new Error(msg)));});
   if(id==='backend-02'){await stop(p);p=await start(dir);assert.equal((await req('/entries')).body.length,1);}
  }
  results.push({id,status:'PASS',checks:id==='backend-05'?['login failures','save','invalid input','two-user separation','restart persistence','session cleared at restart']:['downloaded HTTP tests',...(id==='backend-02'?['restart persistence']:[])]});
 }finally{await stop(p);}
}
const file='docs/backend-wording-v1/runtime-results.json';const report=JSON.parse(fs.readFileSync(file,'utf8'));report.http=results;report.results.find(r=>r.id==='backend-01').example='PASS: real local HTTP';fs.writeFileSync(file,JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(results,null,2));

