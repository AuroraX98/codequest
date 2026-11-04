import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import net from 'node:net';
import {spawn,spawnSync} from 'node:child_process';
const scratch=path.resolve('../toolkit-runtime');
const npm=path.join(path.dirname(process.execPath),'node_modules/npm/bin/npm-cli.js');assert.ok(fs.existsSync(npm));
const report=JSON.parse(fs.readFileSync('docs/developer-toolkit-wording-v1/runtime-results.json','utf8'));
for(const [id,greeting] of [['03','Launched the demo'],['05','Clean start works']]){
 const dir=fs.mkdtempSync(path.join(scratch,'launch-'+id+'-'));
 fs.copyFileSync(path.join(scratch,'developer-toolkit-'+id,'example.json'),path.join(dir,'package.json'));fs.writeFileSync(path.join(dir,'main.js'),'console.log('+JSON.stringify(greeting)+');\n');
 function run(args){const r=spawnSync(process.execPath,[npm,...args],{cwd:dir,encoding:'utf8'});assert.equal(r.status,0,r.stderr);return r.stdout;}
 if(id==='05')run(['install','--no-audit','--no-fund']);
 assert.ok(run(['start']).includes(greeting));
 if(id==='05'){
  const clean=fs.mkdtempSync(path.join(scratch,'clean-'));for(const file of ['main.js','package.json','package-lock.json'])fs.copyFileSync(path.join(dir,file),path.join(clean,file));
  let r=spawnSync(process.execPath,[npm,'ci','--no-audit','--no-fund'],{cwd:clean,encoding:'utf8'});assert.equal(r.status,0,r.stderr);r=spawnSync(process.execPath,[npm,'start'],{cwd:clean,encoding:'utf8'});assert.equal(r.status,0);assert.ok(r.stdout.includes(greeting));
 }
 report.results.find(r=>r.id.endsWith('-'+id)).example='PASS: JSON parsed and npm start executed'+(id==='05'?', clean-copy npm ci and start passed':'');
}
for(const port of [3030,3000])await new Promise((resolve,reject)=>{const server=net.createServer();server.once('error',reject);server.listen(port,'127.0.0.1',()=>server.close(resolve));});
async function serverCheck(file,port,ready,expected,version){
 const p=spawn(process.execPath,[file],{cwd:path.dirname(file),env:{...process.env,STORAGE_READY:ready?'true':'false',RELEASE_ID:version},windowsHide:true,stdio:['ignore','pipe','pipe']});
 let err='';p.stderr.on('data',d=>err+=d);
 try{
  let response;for(let i=0;i<60;i++){if(p.exitCode!==null)throw new Error(err);try{response=await fetch('http://127.0.0.1:'+port+'/health');break;}catch{await new Promise(r=>setTimeout(r,50));}}
  assert.ok(response,'server started');assert.equal(response.status,ready?200:503);assert.deepEqual(await response.json(),{status:expected,version});
  if(port===3030)assert.equal((await fetch('http://127.0.0.1:'+port+'/missing')).status,404);
 }finally{if(p.exitCode===null){const stopped=new Promise(r=>p.once('exit',r));p.kill();await stopped;}}
}
for(const ready of [true,false]){
 await serverCheck(path.join(scratch,'developer-toolkit-08/example.mjs'),3030,ready,ready?200:503,'review-example');
 await serverCheck(path.join(scratch,'developer-toolkit-08/server.mjs'),3000,ready,ready?'ready':'not-ready','review-download');
}
report.results.find(r=>r.id.endsWith('-08')).example='PASS: exact local HTTP example, ready and unavailable replies, version, and 404';
report.downloadedHealthServer='PASS: ready and unavailable local HTTP responses';
fs.writeFileSync('docs/developer-toolkit-wording-v1/runtime-results.json',JSON.stringify(report,null,2)+'\n');console.log('PASS: package launch, clean-copy installation, and both health servers.');

