import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {createRequire} from 'node:module';
import {execFileSync} from 'node:child_process';
import {performance} from 'node:perf_hooks';
import ts from 'typescript';
import {registerClientReference,renderToReadableStream} from 'react-server-dom-webpack/server.edge';
const require=createRequire(import.meta.url);
const client=registerClientReference(()=>{},'codequest-client','default');
const manifest={'codequest-client':{id:'codequest-client',chunks:[],name:'default'}};
let authenticated=false;
async function measure(source){
 const mod={exports:{}};
 vm.runInNewContext(ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX,esModuleInterop:true}}).outputText,{exports:mod.exports,module:mod,require:p=>{
  if(p==='./chatgpt-auth')return {requireChatGPTUser:async()=>{authenticated=true;return {userId:'fixture'};}};
  if(p.includes('components/CodeQuest'))return {default:client,__esModule:true};
  if(p.includes('content/'))return JSON.parse(fs.readFileSync(p.replace('../',''),'utf8'));
  return require(p);
 }});
 const start=performance.now();const element=await mod.exports.default();
 const stream=renderToReadableStream(element,manifest);
 const payload=await new Response(stream).text();return {bytes:Buffer.byteLength(payload),milliseconds:Math.round(performance.now()-start),props:element.props};
}
const before=await measure(execFileSync('git',['show','8da8542c3dd26bded9f82ed2f0aef2e36bcb31ba:app/page.tsx'],{encoding:'utf8'}));
authenticated=false;
const after=await measure(fs.readFileSync('app/page.tsx','utf8'));
assert.ok(authenticated,'Server authentication remains required');
assert.deepEqual(Object.keys(after.props),['localMode']);
assert.equal(after.props.localMode,false);
assert.ok(after.bytes<2000);assert.ok(before.bytes>1000000);
console.log(JSON.stringify({before:{bytes:before.bytes,milliseconds:before.milliseconds},after:{bytes:after.bytes,milliseconds:after.milliseconds},authenticated:true}));
