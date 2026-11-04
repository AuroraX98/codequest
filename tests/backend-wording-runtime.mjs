import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {spawnSync} from 'node:child_process';
import {DatabaseSync} from 'node:sqlite';
const lessons=JSON.parse(fs.readFileSync('content/lessons.json','utf8')).filter(l=>l.id.startsWith('backend-'));
const scratch=path.resolve('../backend-runtime');fs.mkdirSync(scratch,{recursive:true});
const expected={
'04':[{status:401},{status:403},40],'05':[{available:18,saved:8},{available:24,saved:2},{available:24,saved:2},{available:24,saved:2}],
'06':[[5,8],[8,2,5]],'07':[{status:400,body:{error:'Check the supplied values'}}],'08':['Continue','Sky'],
'10':['public, max-age=60','no-store'],'11':[true,201,false,null],'12':[false,true],'13':[true,false],'14':[true,false],
'15':['list'],'16':['/notes'],'17':['2'],'18':[{ok:true,value:{minutes:5}}],'19':[true],'20':['Moon notes'],'21':[true],
'22':[{title:'Moon'}],'23':[{id:1,title:'Moon'}],'24':[{status:204,body:null}],
'25':[[{id:1,created:10},{id:2,created:10}]],'26':[{id:9,title:'Sea'}],
'27':[[{id:1,title:'Moon'},{id:2,title:'Sea'}]],'28':[[{id:1,title:'Moon'},{id:2,title:'Ocean'}]],'29':[[{id:1},{id:3}]],'30':[false],
'31':[{status:200,record:{id:1,title:'Sea',version:4}}],'32':[{sql:'SELECT id, title FROM notes WHERE id = ?',params:['7']}],
'33':['sign-in'],'34':[true],'35':[true],'36':[true],'37':[{requestId:'r1',status:500}],'38':[true],'39':[100],'40':['unknown'],'41':[true],'42':[false],'43':['stop']};
function runJS(l,code){const ctx=vm.createContext({console:{log(){}},URL});vm.runInContext(code,ctx,{timeout:1500});return l.checks.map(c=>Boolean(vm.runInContext(c.expression,ctx,{timeout:1500})));}
function runSQL(l,code){const db=new DatabaseSync(':memory:');try{for(const f of l.extraFiles??[])if(f.name==='setup.sql')db.exec(f.code);db.exec(code);return l.checks.map(c=>Object.values(db.prepare(c.expression).get())[0]===1);}finally{db.close();}}
const results=[];
for(const l of lessons){
 const checks=l.runtime==='sql'?runSQL(l,l.solution):runJS(l,l.solution);
 assert.ok(checks.every(Boolean),l.id+' solution');const record={id:l.id,solutionChecks:checks.length};
 const code=/\x60\x60\x60\w+\n([\s\S]*?)\n\x60\x60\x60/.exec(l.explanation.join('\n'))[1];
 if(['backend-01','backend-02'].includes(l.id)){fs.writeFileSync(path.join(scratch,l.id+'-example.mjs'),code);record.example='separate local run';}
 else if(l.runtime==='sql'){
  const db=new DatabaseSync(':memory:');try{
   db.exec(code);
   if(l.id==='backend-03')assert.deepEqual(db.prepare('SELECT * FROM demo_report ORDER BY user_id').all().map(r=>Object.values(r)),[['x',2,2,18],['y',2,1,18]]);
   else{assert.deepEqual(db.prepare('SELECT * FROM tasks').all().map(r=>Object.values(r)),[[1,'Read',0]]);assert.equal(db.prepare('PRAGMA user_version').get().user_version,2);}
  }finally{db.close();}
  record.example='PASS';
 }else{
  const logs=[];vm.runInNewContext(code,{console:{log:v=>logs.push(v)},URL},{timeout:1500});
  assert.deepEqual(JSON.parse(JSON.stringify(logs)),expected[l.id.slice(-2)],l.id+' displayed output');
  record.example='PASS';
 }
 results.push(record);
}
const dbDir=fs.mkdtempSync(path.join(scratch,'saved-'));
const storage=path.join(scratch,'backend-02-example.mjs');
for(const args of [[storage,'save'],[storage]]){
 const run=spawnSync(process.execPath,args,{cwd:dbDir,encoding:'utf8'});assert.equal(run.status,0,run.stderr);
 assert.match(run.stdout,/id: 'x', minutes: 35/);assert.match(run.stdout,/id: 'y', minutes: 12/);
}
const db=new DatabaseSync(path.join(dbDir,'demo-practice.sqlite'));
assert.deepEqual(db.prepare('SELECT * FROM notes ORDER BY id').all().map(r=>Object.values(r)),[['x',35],['y',12]]);db.close();
const repeat=spawnSync(process.execPath,[storage,'save'],{cwd:dbDir,encoding:'utf8'});assert.notEqual(repeat.status,0);assert.match(repeat.stderr,/UNIQUE constraint/);
results.find(r=>r.id==='backend-02').example='PASS: write, process exit, separate reopen, duplicate save rejected';
const backup=lessons.find(l=>l.id==='backend-13').extraFiles.find(f=>f.name==='backup-demo.py');
const backupPath=path.join(scratch,backup.name);fs.writeFileSync(backupPath,backup.code);
const py=spawnSync('python',[backupPath],{encoding:'utf8'});assert.equal(py.status,0,py.stderr);assert.match(py.stdout,/reopened and verified/);
for(const id of ['backend-01','backend-02','backend-05']){
 const folder=path.join(scratch,id);fs.mkdirSync(folder,{recursive:true});
 for(const f of lessons.find(l=>l.id===id).extraFiles)fs.writeFileSync(path.join(folder,f.name),f.code);
}
fs.writeFileSync('docs/backend-wording-v1/runtime-results.json',JSON.stringify({runtime:process.version,status:'PASS',results,backupCompanion:'PASS',http:'pending separate check'},null,2)+'\n');
console.log(JSON.stringify({solutions:results.length,checks:results.reduce((n,r)=>n+r.solutionChecks,0),examples:42,sqliteReopen:'PASS',backup:'PASS',httpExample:'pending'}));

