import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import vm from 'node:vm';
import {JSDOM} from 'jsdom';
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const root='docs/function-example-reconstruction/';
// The 35 edits and their checksums describe this published edition.
// Newer lessons and headings are checked by tests/reviewed-catalog.py.
const reviewedRelease='323e395e56b07795681ce31bf1d343131e2bfe53';
function historicalContent(file) {
  const raw=execFileSync('git',['show',reviewedRelease+':content/'+file],{
    encoding:'utf8',maxBuffer:32*1024*1024
  });
  return JSON.parse(raw);
}
const lessons=historicalContent('lessons.json'),deltas=read(root+'paragraph-deltas.json'),baseline=read(root+'baseline.json');
const hash=x=>createHash('sha256').update(JSON.stringify(x)).digest('hex');
const restored=structuredClone(lessons),keys=new Set();
assert.equal(lessons.length,1221);assert.equal(new Set(lessons.map(l=>l.id)).size,1221);
assert.equal(new Set(historicalContent('catalog.json').units.map(u=>u.track)).size,21);
assert.equal(deltas.length,35);
for(const d of deltas){const key=d.lessonId+':'+d.paragraph;assert.ok(!keys.has(key));keys.add(key);const l=restored.find(l=>l.id===d.lessonId);assert.equal(l.explanation[d.paragraph],d.after,key);l.explanation[d.paragraph]=d.before;}
assert.equal(hash(restored),baseline.lessonsHash,'Only reviewed paragraphs change; all IDs/section positions/exercises preserved');
assert.equal(hash(historicalContent('catalog.json')),baseline.catalogHash);assert.equal(hash(historicalContent('terminology.json')),baseline.terminologyHash);
const inventory=[...read(root+'python-js-inventory.json').lessons,...read(root+'six-inventory.json').lessons,...read(root+'c-family-coverage.json'),...read(root+'backend-inventory.json'),...fs.readFileSync(root+'web-swift-sql-inventory.jsonl','utf8').trim().split('\n').map(line=>JSON.parse(line))];
const ids=inventory.map(r=>r.id??r.lessonId);assert.equal(new Set(ids).size,ids.length);assert.deepEqual(ids.sort(),lessons.map(l=>l.id).sort(),'One inventory record per current lesson; this structural check is not a semantic certificate');
for(const l of lessons)for(const [i,t] of l.explanation.entries())assert.equal((t.match(/```/g)??[]).length,[...t.matchAll(/^```([a-zA-Z0-9_-]*)[^\S\r\n]*\r?\n([\s\S]*?)^```[^\S\r\n]*(?:\r?\n|$)/gm)].length*2,l.id+':'+i);
const lesson=id=>lessons.find(l=>l.id===id);
const blocks=(id,i)=>[...lesson(id).explanation[i].matchAll(/```javascript\n([\s\S]*?)\n```/g)].map(m=>m[1]);
let scenarios=0;
for(const [id,i,expected]of [
 ['developer-toolkit-11',5,['small','large',null]],
 ['backend-12',4,[{allowed:false,state:{start:0,used:2}},{allowed:true,state:{start:10,used:1}},2]],
 ['backend-14',4,[{status:304,body:null,etag:'"card-3"'},{status:200,body:{title:'Public card'},etag:'"card-3"'}]],
 ['developer-toolkit-14',3,['B',null]]]){
 const out=[];vm.runInNewContext(blocks(id,i).at(-1),{console:{log:x=>out.push(x)}},{timeout:1000});assert.deepEqual(JSON.parse(JSON.stringify(out)),expected,id);scenarios++;
}
assert.equal(execFileSync(process.execPath,['--input-type=module','-e',blocks('backend-05',4).at(-1)],{encoding:'utf8',timeout:5000}),'32\n');scenarios++;
const out=[];vm.runInNewContext(lesson('backend-06').starter.split('function pageEntries')[0]+'\nconsole.log(parsePage({limit:"2",offset:"1"}));console.log(parsePage({limit:"0"}));console.log(parsePage({}));',{console:{log:x=>out.push(x)}},{timeout:1000});assert.deepEqual(JSON.parse(JSON.stringify(out)),[{limit:2,offset:1},null,{limit:5,offset:0}]);scenarios++;
for(const fail of [false,true]){
 const calls=[],output={textContent:''};const fetch=async(url,options)=>{calls.push({url,options});return options?{ok:!fail,json:async()=>({error:'Rejected'})}:{ok:true,json:async()=>[{minutes:45}]};};
 const result=await vm.runInNewContext(blocks('backend-05',2)[0]+'\nsaveMinutes(45, output)',{fetch,output},{timeout:1000});assert.equal(result,undefined);assert.equal(calls.length,fail?1:2);assert.equal(JSON.parse(calls[0].options.body).minutes,45);if(fail)assert.equal(output.textContent,'Rejected');else assert.deepEqual(JSON.parse(output.textContent),[{minutes:45}]);scenarios++;
}
for(let repeat=0;repeat<2;repeat++){const dom=new JSDOM('',{runScripts:'outside-only'});try{const out=[];dom.window.console.log=x=>out.push(x);dom.window.eval(blocks('react-09',6)[0]);assert.deepEqual(out,['Signal received',true]);dom.window.dispatchEvent(new dom.window.Event('lesson-ping'));assert.deepEqual(out,['Signal received',true]);scenarios++;}finally{dom.window.close();}}
console.log(`PASS archived reconstruction at ${reviewedRelease.slice(0,7)}: 1221 lessons, 35 declared paragraph changes, ${scenarios} runtime scenarios.`);
