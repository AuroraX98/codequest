import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import ts from 'typescript';
import {JSDOM} from 'jsdom';
const source=await fs.readFile('lib/runner.ts','utf8');
const code=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
const mod={exports:{}};new Function('require','exports','module',code)(()=>({}),mod.exports,mod);
const dom=new JSDOM('');const old=Object.getOwnPropertyDescriptor(globalThis,'DOMParser');
Object.defineProperty(globalThis,'DOMParser',{configurable:true,value:dom.window.DOMParser});
try{
 const frame=await fs.readFile('public/runner/frame.html','utf8');
 const lessons=JSON.parse(await fs.readFile('content/lessons.json','utf8'));
 for(const lesson of lessons)assert.equal(mod.exports.projectSandbox(lesson,frame),lesson.id==='html-15'?'allow-scripts allow-forms':'allow-scripts');
 for(const unsafe of [frame.replace("form-action 'none';",''),frame.replace("form-action 'none';","form-action *;"),'<p>form-action \'none\';</p>']){
  assert.throws(()=>mod.exports.projectSandbox({id:'html-15',runtime:'html'},unsafe),/updated offline files/);
 }
 assert.equal(mod.exports.projectSandbox({id:'html-15',runtime:'javascript'},frame),'allow-scripts');
 const policy=new dom.window.DOMParser().parseFromString(frame,'text/html').querySelector('meta[http-equiv="Content-Security-Policy"]').content;
 assert.match(policy,/default-src 'none'/);assert.match(policy,/connect-src 'none'/);assert.match(policy,/form-action 'none'/);
 assert.doesNotMatch(mod.exports.projectSandbox({id:'html-15',runtime:'html'},frame),/allow-same-origin|allow-popups|allow-top-navigation/);
 console.log('PASS: dialog-only form permission across all 1,221 lessons; old or unprotected frames fail closed; network form submission policy remains none.');
}finally{if(old)Object.defineProperty(globalThis,'DOMParser',old);else delete globalThis.DOMParser;dom.window.close();}

