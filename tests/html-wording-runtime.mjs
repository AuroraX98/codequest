import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import {JSDOM,VirtualConsole} from 'jsdom';
const lessons=JSON.parse(await fs.readFile('content/lessons.json','utf8')).filter(l=>l.id.startsWith('html-'));
const outcomes=[],failures=[],nativePending=[];
const fence=/```(\w*)\n([\s\S]*?)```/g;
async function run(code,checks){
 const vc=new VirtualConsole();
 const dom=new JSDOM('<div id="root"></div>',{url:'https://practice.example/',runScripts:'outside-only',virtualConsole:vc});
 const root=dom.window.document.getElementById('root');
 root.innerHTML=code;
 for(const script of root.querySelectorAll('script'))script.remove();
 try{
  const results=[];
  for(const c of checks){
   try{results.push({label:c.label,passed:!!(await dom.window.eval('('+c.expression+')'))});}
   catch(e){results.push({label:c.label,passed:false,error:e.message});}
  }
  return results;
 }finally{dom.window.close();}
}
let examples=0,bridges=0,checks=0,projects=0;
for(const lesson of lessons){
 let html='';
 for(const [section,text]of lesson.explanation.entries()){
  for(const [,lang,code]of text.matchAll(fence)){
   examples++;
   if(lang==='html'){
    html=code;
    const dom=new JSDOM(code,{url:'https://practice.example/',runScripts:'outside-only'});
    outcomes.push({lesson:lesson.id,section:section+1,mode:'HTML parsing only',nodes:dom.window.document.querySelectorAll('*').length});
    dom.window.close();
   }else if(lang==='javascript'){
    const dom=new JSDOM(html,{url:'https://practice.example/',runScripts:'outside-only'});
    try{
     dom.window.eval(code);
     if(lesson.id==='html-42')assert.equal(dom.window.document.querySelector('#stage').textContent,'The paragraph was parsed before this deferred script ran.');
     if(lesson.id==='html-43')assert.equal(dom.window.document.querySelector('#cards article h2').textContent,'Reading note');
     bridges++;outcomes.push({lesson:lesson.id,section:section+1,mode:'JavaScript bridge with parsed DOM; no native scheduling claim',passed:true});
    }catch(e){failures.push({lesson:lesson.id,section:section+1,error:e.message});}
    finally{dom.window.close();}
   }else if(lang==='vtt'){
    assert.ok(code.startsWith('WEBVTT\n\n'));
    const times=code.match(/(\d\d):(\d\d):(\d\d\.\d{3}) --> (\d\d):(\d\d):(\d\d\.\d{3})/);
    assert.ok(times);assert.ok(Number(times[4])*3600+Number(times[5])*60+Number(times[6])>Number(times[1])*3600+Number(times[2])*60+Number(times[3]));
    outcomes.push({lesson:lesson.id,section:section+1,mode:'caption cue timing',passed:true});
   }else throw Error('Unhandled example language '+lang);
  }
 }
 if(lesson.learningMode==='concept')continue;
 projects++;checks+=lesson.checks.length;
 for(const variant of ['solution','starter','empty']){
  const all=await run(variant==='empty'?'':lesson[variant],lesson.checks);
  const evaluated=lesson.id==='html-15'?all.slice(0,-1):all;
  try{
   if(variant==='solution')assert.ok(evaluated.every(x=>x.passed),JSON.stringify(evaluated.filter(x=>!x.passed)));
   else assert.ok(all.some(x=>!x.passed),'Incomplete markup passed every check');
   if(lesson.id==='html-15'&&variant==='solution')nativePending.push({lesson:lesson.id,check:all.at(-1).label,reason:'JSDOM does not implement native modal lifecycle; use the app in a real browser.'});
   outcomes.push({lesson:lesson.id,variant,checks:all,mode:'DOM simulation'});
  }catch(e){failures.push({lesson:lesson.id,variant,error:e.message});}
 }
}
const result={status:failures.length?'FAIL':'PASS with native modal verification pending',lessons:46,projects,checks,examples,bridges,outcomes,failures,nativePending,limits:['HTML parsing is tolerant and does not establish source conformance.','Media placeholders were not fetched or played.','DOM checks do not establish layout, screen-reader behavior or native event behavior.','Inline HTML script scheduling requires a separate browser page.']};
await fs.writeFile('docs/html-wording-v1/runtime-results.json',JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify({...result,outcomes:undefined},null,2));
if(failures.length)process.exitCode=1;

