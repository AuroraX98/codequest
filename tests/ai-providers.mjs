import assert from 'node:assert/strict';
import {mkdtemp,readFile,writeFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';import path from 'node:path';import ts from 'typescript';
const temp=await mkdtemp(path.join(tmpdir(),'codequest-providers-'));
try {
for(const f of ['ai-providers','ai-keys','ai-transport']){const source=await readFile(`lib/${f}.ts`,'utf8');const js=ts.transpileModule(source,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext}}).outputText.replace(/from "\.\/([^"]+)"/g,'from "./$1.mjs"');await writeFile(path.join(temp,f+'.mjs'),js);}
const {providerIds,providers}=await import(path.join(temp,'ai-providers.mjs'));
const {sealConnection,openConnection,storedConnection}=await import(path.join(temp,'ai-keys.mjs'));
const {providerRequest,providerAnswer,askProvider}=await import(path.join(temp,'ai-transport.mjs'));
const secret=crypto.getRandomValues(new Uint8Array(32));const key='test-only-synthetic-key';
const messages=[{role:'user',content:'What is a variable?'},{role:'assistant',content:'A name for a value.'},{role:'user',content:'Explain that again.'}];
const payloads={deepseek:{choices:[{finish_reason:'stop',message:{content:'Helpful reply'}}]},openai:{status:'completed',output:[{type:'reasoning',summary:[]},{type:'message',content:[{type:'output_text',text:'Helpful reply'},{type:'output_text',text:'Another point'}]}]},anthropic:{stop_reason:'end_turn',content:[{type:'text',text:'Helpful reply'},{type:'text',text:'Another point'}]}};
const urls={deepseek:'https://api.deepseek.com/chat/completions',openai:'https://api.openai.com/v1/responses',anthropic:'https://api.anthropic.com/v1/messages'};
for(const provider of providerIds){
 const sealed=await sealConnection(provider,key,'learner',secret);assert.ok(!sealed.includes(key));assert.equal(storedConnection(sealed).provider,provider);assert.deepEqual(await openConnection(sealed,'learner',secret),{provider,key});
 await assert.rejects(openConnection(sealed,'different-learner',secret),/Reconnect/);
 const changed=JSON.parse(sealed);changed.provider=provider==='openai'?'anthropic':'openai';await assert.rejects(openConnection(JSON.stringify(changed),'learner',secret),/Reconnect/);
 const r=providerRequest(provider,key,'Teaching instructions',messages);assert.equal(r.url,urls[provider]);assert.equal(r.body.model,providers[provider].model);
 if(provider==='anthropic'){assert.equal(r.headers['x-api-key'],key);assert.equal(r.headers['anthropic-version'],'2023-06-01');assert.equal(r.body.system,'Teaching instructions');assert.deepEqual(r.body.messages,messages);}
 else {assert.equal(r.headers.Authorization,'Bearer '+key);if(provider==='openai'){assert.equal(r.body.store,false);assert.deepEqual(r.body.reasoning,{effort:'low'});assert.equal(r.body.instructions,'Teaching instructions');assert.deepEqual(r.body.input,messages);}else {assert.deepEqual(r.body.messages.slice(1),messages);assert.deepEqual(r.body.thinking,{type:'disabled'});}}
 let calls=0;const answer=await askProvider(provider,key,'Teaching instructions',messages,async(url,opts)=>{calls++;assert.equal(url,urls[provider]);assert.equal(opts.redirect,'manual');assert.equal(opts.cache,'no-store');return Response.json(payloads[provider]);});assert.equal(calls,1);assert.match(answer,/Helpful reply/);
 for(const status of [301,302,307,308,401,403,402,429,500]){calls=0;await assert.rejects(askProvider(provider,key,'',messages,async()=>{calls++;return new Response('private upstream error '+key,{status});}),e=>!e.message.includes(key));assert.equal(calls,1);}
 await assert.rejects(askProvider(provider,key,'',messages,async()=>{throw new Error('private '+key);}),e=>e.status===504&&!e.message.includes(key));
 await assert.rejects(askProvider(provider,key,'',messages,async()=>new Response('invalid JSON')),/unreadable/);
 assert.throws(()=>providerAnswer(provider,{}));
}
assert.equal(providerAnswer('openai',payloads.openai),'Helpful reply\nAnother point');assert.equal(providerAnswer('anthropic',payloads.anthropic),'Helpful reply\nAnother point');
assert.throws(()=>providerAnswer('openai',{status:'incomplete',output:payloads.openai.output,incomplete_details:{reason:'max_output_tokens'}}),/finish/);
assert.throws(()=>providerAnswer('openai',{status:'completed',output:[{type:'reasoning'}]}),/empty/);
assert.throws(()=>providerAnswer('openai',{status:'completed',output:[null,{type:'message',content:[null,{type:'output_text',text:5}]}]}),/empty/);
for(const stop_reason of ['max_tokens','model_context_window_exceeded','tool_use','refusal']) assert.throws(()=>providerAnswer('anthropic',{...payloads.anthropic,stop_reason}),/finish/);
assert.throws(()=>providerAnswer('deepseek',{choices:[{finish_reason:'length',message:{content:'partial'}}]}),/finish/);
const iv=crypto.getRandomValues(new Uint8Array(12));const imported=await crypto.subtle.importKey('raw',secret,'AES-GCM',false,['encrypt']);const cipher=new Uint8Array(await crypto.subtle.encrypt({name:'AES-GCM',iv},imported,new TextEncoder().encode(key)));const legacy=btoa(String.fromCharCode(...iv))+'.'+btoa(String.fromCharCode(...cipher));assert.deepEqual(await openConnection(legacy,'learner',secret),{provider:'deepseek',key});
console.log('Passed provider routing, conversation history, response parsing, sanitized failures/no fallback, provider/account-bound encryption, and legacy DeepSeek compatibility.');
}finally{await rm(temp,{recursive:true,force:true});}
