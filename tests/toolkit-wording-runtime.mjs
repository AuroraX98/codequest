import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {spawnSync} from 'node:child_process';
const root=process.cwd(), scratch=path.resolve('../toolkit-runtime');
fs.mkdirSync(scratch,{recursive:true});
const ls=JSON.parse(fs.readFileSync('content/lessons.json','utf8')).filter(l=>l.id.startsWith('developer-toolkit-'));
const results=[], examples=new Map();
const clone=v=>JSON.parse(JSON.stringify(v));
const expected={ '01':['Let us build something!'],'02':[5,false],'06':[72,80,null],'10':['Hi','Hello'],'11':['small',null],'12':[7],'13':[false],'14':['sort'],'21':[1] };
for(const l of ls){
 const item={id:l.id};
 if(l.checks.length){
  const output=[];const ctx=vm.createContext({console:{log:(...v)=>output.push(v.map(x=>typeof x==='string'?x:JSON.stringify(x)).join(' '))},__output:output,URL});
  vm.runInContext(l.solution,ctx,{timeout:1500});
  for(const c of l.checks)assert.ok(vm.runInContext(c.expression,ctx,{timeout:1500}),l.id+' '+c.label);
  item.solutionChecks=l.checks.length;
 }else item.understandingOnly=true;
 const m=/\x60\x60\x60(\w+)\n([\s\S]*?)\n\x60\x60\x60/.exec(l.explanation.join('\n'));assert.ok(m);examples.set(l.id.slice(-2),m[2]);item.exampleLanguage=m[1];
 if(expected[l.id.slice(-2)]){
  const log=[];vm.runInNewContext(m[2],{console:{log:x=>log.push(x)}},{timeout:1500});
  assert.deepEqual(clone(log),expected[l.id.slice(-2)],l.id);item.example='PASS';
 }else if(l.id.endsWith('-20')){
  assert.throws(()=>vm.runInNewContext(m[2],{console},{timeout:1500}),/Reduce of empty array/);item.example='PASS: expected empty-array error';
 }else if(m[1]==='json'){
  item.parsed=JSON.parse(m[2]);item.example='PASS: valid JSON';
 }else if(l.id.endsWith('-07')){
  const p=path.join(scratch,'score-test.mjs');fs.writeFileSync(p,m[2]);const run=spawnSync(process.execPath,['--test',p],{encoding:'utf8'});assert.equal(run.status,0,run.stderr+run.stdout);
  const bad=path.join(scratch,'score-bad-test.mjs');fs.writeFileSync(bad,m[2].replace('return Math.max(0, Math.min(100, value));','return value;'));assert.notEqual(spawnSync(process.execPath,['--test',bad]).status,0);item.example='PASS: working tests and deliberate mutation rejected';
 }else item.example='pending specialized check';
 results.push(item);
 const dir=path.join(scratch,l.id);fs.mkdirSync(dir,{recursive:true});
 for(const f of l.extraFiles??[])fs.writeFileSync(path.join(dir,f.name),f.code);
 fs.writeFileSync(path.join(dir,'example.'+({bash:'sh',javascript:'mjs',json:'json',html:'html'}[m[1]]??'txt')),m[2]);
}
const git=process.env.GIT_EXECUTABLE || 'git';
function g(dir,args,success=true){const run=spawnSync(git,args,{cwd:dir,encoding:'utf8'});if(success)assert.equal(run.status,0,args.join(' ')+'\n'+run.stderr);return run;}
function repo(prefix){const dir=fs.mkdtempSync(path.join(scratch,prefix+'-'));g(dir,['init','-b','main']);g(dir,['config','user.name','Practice Learner']);g(dir,['config','user.email','learner@example.invalid']);return dir;}
function commit(dir,msg){g(dir,['add','.']);g(dir,['commit','-m',msg]);}
function block(id,initial,edit=()=>{}){let dir=initial;const output=[];for(const line of examples.get(id).split('\n')){if(!line.trim())continue;if(line.startsWith('#')){edit(dir);continue;}const args=(line.match(/"[^"]*"|'[^']*'|\S+/g)??[]).map(x=>/^["']/.test(x)?x.slice(1,-1):x);if(args[0]==='cd'){const target=path.resolve(dir,args[1]);assert.ok(target.startsWith(scratch+path.sep));dir=target;continue;}assert.equal(args.shift(),'git');output.push(g(dir,args).stdout);}results.find(r=>r.id.endsWith('-'+id)).example='PASS: exact Git commands in disposable repository';return {dir,output};}
let dir=fs.mkdtempSync(path.join(scratch,'first-'));fs.mkdirSync(path.join(dir,'history-demo'));fs.writeFileSync(path.join(dir,'history-demo/main.js'),"console.log('Hello');\n");({dir}=block('04',dir));assert.equal(g(dir,['rev-list','--count','HEAD']).stdout.trim(),'1');
fs.writeFileSync(path.join(dir,'main.js'),"console.log('Hello, reader');\n");commit(dir,'Improve greeting');fs.writeFileSync(path.join(dir,'main.js'),"console.log('broken');\n");g(dir,['restore','--source=HEAD','--','main.js']);assert.match(fs.readFileSync(path.join(dir,'main.js'),'utf8'),/Hello, reader/);
dir=repo('stash');fs.writeFileSync(path.join(dir,'note.txt'),'first\n');commit(dir,'First note');fs.writeFileSync(path.join(dir,'note.txt'),'draft\n');block('15',dir);assert.equal(fs.readFileSync(path.join(dir,'note.txt'),'utf8').trim(),'draft');assert.match(g(dir,['stash','list']).stdout,/practice draft/);
dir=repo('index');fs.writeFileSync(path.join(dir,'note.txt'),'Moon\n');commit(dir,'Moon');fs.writeFileSync(path.join(dir,'note.txt'),'Sea\n');g(dir,['add','note.txt']);fs.writeFileSync(path.join(dir,'note.txt'),'Sky\n');let report=block('16',dir);assert.match(report.output[0],/-Sea\n\+Sky/);assert.match(report.output[1],/-Moon\n\+Sea/);
dir=repo('ignored');fs.writeFileSync(path.join(dir,'debug.log'),'old\n');commit(dir,'Track harmless log');fs.writeFileSync(path.join(dir,'.gitignore'),'debug.log\n');fs.writeFileSync(path.join(dir,'debug.log'),'new\n');report=block('17',dir);assert.match(report.output[0],/debug.log/);assert.match(report.output[1],/M debug.log/);
dir=repo('conflict');fs.writeFileSync(path.join(dir,'greeting.txt'),'Hello\n');commit(dir,'Greeting');g(dir,['switch','-c','named']);fs.writeFileSync(path.join(dir,'greeting.txt'),'Hello, Mira\n');commit(dir,'Add name');g(dir,['switch','main']);fs.writeFileSync(path.join(dir,'greeting.txt'),'Hello!\n');commit(dir,'Add punctuation');assert.equal(g(dir,['merge','named'],false).status,1);block('18',dir,d=>fs.writeFileSync(path.join(d,'greeting.txt'),'Hello, Mira!\n'));assert.equal(g(dir,['ls-files','-u']).stdout,'');assert.equal(fs.readFileSync(path.join(dir,'greeting.txt'),'utf8'),'Hello, Mira!\n');g(dir,['commit','-m','Keep name and punctuation']);
dir=repo('revert');fs.writeFileSync(path.join(dir,'label.txt'),'Save\n');commit(dir,'Save label');fs.writeFileSync(path.join(dir,'label.txt'),'Send\n');commit(dir,'Mistaken label');const original=g(dir,['rev-parse','HEAD']).stdout.trim();block('19',dir);assert.equal(fs.readFileSync(path.join(dir,'label.txt'),'utf8').trim(),'Save');assert.equal(g(dir,['rev-list','--count','HEAD']).stdout.trim(),'3');g(dir,['cat-file','-e',original]);
dir=repo('package');for(const file of ['package.json','package-lock.json'])fs.writeFileSync(path.join(dir,file),'{"version":"1.0.0"}\n');commit(dir,'Package version');for(const file of ['package.json','package-lock.json'])fs.writeFileSync(path.join(dir,file),'{"version":"1.1.0"}\n');report=block('22',dir);assert.match(report.output[0],/1.1.0/);report=block('24',dir);assert.match(report.output[0],/^[0-9a-f]{40}/);assert.match(report.output[1],/package.json/);
const scoreDir=path.join(scratch,'developer-toolkit-07');fs.writeFileSync(path.join(scoreDir,'score.mjs'),'export '+ls.find(l=>l.id.endsWith('-07')).solution);let run=spawnSync(process.execPath,['--test','test.mjs'],{cwd:scoreDir,encoding:'utf8'});assert.equal(run.status,0,run.stdout+run.stderr);
const profileDir=path.join(scratch,'developer-toolkit-14');run=spawnSync(process.execPath,['--cpu-prof','profile-demo.js'],{cwd:profileDir,encoding:'utf8'});assert.equal(run.status,0);assert.ok(fs.readdirSync(profileDir).some(f=>f.endsWith('.cpuprofile')));
fs.writeFileSync('docs/developer-toolkit-wording-v1/runtime-results.json',JSON.stringify({status:'PASS with remaining HTTP/HTML checks',runtime:process.version,results,downloadedScoreTest:'PASS',nativeProfile:'PASS'},null,2)+'\n');
console.log(JSON.stringify({solutionLessons:results.filter(r=>r.solutionChecks).length,checks:results.reduce((n,r)=>n+(r.solutionChecks??0),0),examplesPassed:results.filter(r=>r.example.startsWith('PASS')).length,pending:results.filter(r=>!r.example.startsWith('PASS')).map(r=>r.id)}));

