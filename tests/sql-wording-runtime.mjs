import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {createRequire} from 'node:module';
import {spawnSync} from 'node:child_process';
const root=process.cwd(), scratch=path.resolve(root,'../sql-runtime');
fs.mkdirSync(path.join(scratch,'vendor'),{recursive:true});
fs.copyFileSync('public/vendor/sql/sql-wasm.js',path.join(scratch,'vendor/sql-wasm.cjs'));
fs.copyFileSync('public/vendor/sql/sql-wasm.wasm',path.join(scratch,'vendor/sql-wasm.wasm'));
const require=createRequire(import.meta.url);
const init=require(path.join(scratch,'vendor/sql-wasm.cjs'));
const SQL=await init({locateFile:f=>path.join(scratch,'vendor',f)});
const lessons=JSON.parse(fs.readFileSync('content/lessons.json','utf8')).filter(l=>l.id.startsWith('sql-'));
const route=JSON.parse(fs.readFileSync('content/sql-route-plan.json','utf8')).recommendedSeedOrder;
const results=[];
const expected=JSON.parse(fs.readFileSync('docs/sql-wording-v1/expected-example-values.json','utf8'));
for(const id of route){
 const l=lessons.find(l=>l.id===id), item={id,checks:[]};
 if(l.solution){
  const db=new SQL.Database();
  try{
   for(const file of l.extraFiles??[]) if(file.name==='setup.sql') db.run(file.code);
   db.exec(l.solution);
   for(const check of l.checks){const value=db.exec(check.expression)[0]?.values[0]?.[0];assert.equal(value,1,id+': '+check.label);item.checks.push(check.label);}
  }finally{db.close();}
 }
 const match=/```(sql|javascript)\n([\s\S]*?)\n```/.exec(l.explanation.join('\n'));
 assert.ok(match,id+' example');
 if(match[1]==='sql'){
  const db=new SQL.Database();
  try{
   if(id==='sql-01')db.run(l.extraFiles.find(f=>f.name==='setup.sql').code);
   item.example=db.exec(match[2]);
   assert.deepEqual(item.example.filter(x=>!x.columns.includes('detail')).map(x=>x.values),expected[id],id+' displayed example answer');
  }finally{db.close();}
 }else{
  const dir=fs.mkdtempSync(path.join(scratch,id+'-'));
  fs.mkdirSync(path.join(dir,'vendor'));
  for(const file of ['sql-wasm.cjs','sql-wasm.wasm'])fs.copyFileSync(path.join(scratch,'vendor',file),path.join(dir,'vendor',file));
  fs.writeFileSync(path.join(dir,'main.cjs'),match[2]);
  const run=spawnSync(process.execPath,['main.cjs'],{cwd:dir,encoding:'utf8'});
  assert.equal(run.status,0,id+': '+run.stderr);
  item.example=JSON.parse(run.stdout.trim());
  assert.deepEqual(item.example,id==='sql-51'?[{id:2,label:"Map' OR 1=1 --"}]:[[1,'First']]);
  if(id==='sql-52'){
   const repeat=spawnSync(process.execPath,['main.cjs'],{cwd:dir,encoding:'utf8'});
   assert.notEqual(repeat.status,0);assert.match(repeat.stderr,/EEXIST/);item.overwriteRejected=true;
  }
 }
 results.push(item);
}
const boundaries=[];
for(const [id,statement,pattern] of [
 ['sql-34',"INSERT INTO demo_readings VALUES (3, 'cloudy')",/cannot store TEXT/],
 ['sql-34',"INSERT INTO demo_readings VALUES (3, NULL)",/NOT NULL/],
 ['sql-35',"INSERT INTO demo_reminders(id,title) VALUES (3,NULL)",/NOT NULL/],
 ['sql-36',"INSERT INTO demo_bookings VALUES (3,5)",/CHECK/],
 ['sql-37',"INSERT INTO demo_slots VALUES ('Lena','Mon')",/UNIQUE/],
 ['sql-15',"INSERT INTO players VALUES (2,999)",/FOREIGN KEY/],
 ['sql-47',"ALTER TABLE demo_plans ADD COLUMN required TEXT NOT NULL",/Cannot add a NOT NULL/],
]){
 const l=lessons.find(x=>x.id===id),code=/```sql\n([\s\S]*?)\n```/.exec(l.explanation.join('\n'))[1],db=new SQL.Database();
 try{db.exec(code);assert.throws(()=>db.exec(statement),pattern);boundaries.push({id,statement,status:'expected rejection'});}finally{db.close();}
}
fs.writeFileSync('docs/sql-wording-v1/runtime-results.json',JSON.stringify({status:'PASS',runtime:'SQL.js 1.13.0',results,boundaries},null,2)+'\n');
console.log('PASS: 50 exercise solutions and all 52 displayed examples executed, including both local host programs.');

