import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import ts from 'typescript';
import { z } from 'zod';

function compile(source, imports) {
  const module = { exports: {} };
  const js = ts.transpileModule(source, {compilerOptions: {
    target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS, esModuleInterop:true,
  }}).outputText;
  vm.runInNewContext(js, {module, exports: module.exports,
    require: id => { assert.ok(id in imports, id); return imports[id]; },
    Request, Response, Headers, URL, Date, console,
  });
  return module.exports;
}
const models = compile(await readFile('lib/ai-providers.ts','utf8'), {});
let settings = {track:'python', activeUnit:'python-01', runnerUrl:'http://127.0.0.1:4319'};
let savedProvider = 'deepseek', savedKey = 'original-encrypted-key';
function patch(value) {
  settings = {...settings, ...value, aiModels:{...settings.aiModels, ...value.aiModels}};
}
const database = {
  prepare(sql) {
    let args;
    return { bind(...values) { args=values; return this; }, async run() {
      if (sql.includes('SET encrypted_key=?')) {
        savedKey=args[0]; patch(JSON.parse(args[1]));
      } else if (sql.includes('settings=json_patch')) patch(JSON.parse(args[0]));
      else assert.fail('Unexpected write: '+sql);
      return {};
    } };
  },
  batch: statements => Promise.all(statements.map(statement=>statement.run())),
};
const route = compile(await readFile('app/api/quest/route.ts','utf8'), {
  'zod':{z}, '../../../lib/ai-providers':models,
  '../../../lib/project-checks':{}, '../../../lib/lesson-completion':{},
  '../../../content/catalog.json':{units:[{id:'python-01',track:'python'}]},
  '../../../content/lessons.json':[],
  '../../../lib/server':{
    checkOrigin(){}, owner:async()=> 'learner', accountScope:async()=> 'a'.repeat(64),
    defaults:settings, profile:async()=> ({settings:JSON.stringify(settings)}), db:()=>database,
    encryptConnection:async(provider,key)=>{savedProvider=provider; return 'sealed:'+key;},
    state:async()=>({profile:settings,aiProvider:savedProvider,keyConnected:true}),
    errorResponse:error=>Response.json({error:error.message},{status:500}),
  },
});
const send=body=>route.POST(new Request('https://fixture.example/api/quest',{
  method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(body),
}));
for (const [provider, model] of [
  ['anthropic','claude-opus-5-5'],['anthropic','claude-sonnet-5-5'],
  ['anthropic','claude-fable-5-1'],['openai','gpt-6-astra'],
]) {
  let response=await send({action:'key',provider,model,key:'synthetic-test-key'});
  assert.equal(response.status,200);
  assert.equal((await response.json()).profile.aiModels[provider],model);
  const keyBefore=savedKey;
  response=await send({action:'preferences',settings:{aiModels:{[provider]:model}}});
  assert.equal(response.status,200);
  assert.equal(savedKey,keyBefore,'Changing models keeps the encrypted key');
}
const before=JSON.stringify(settings), keyBefore=savedKey;
assert.equal((await send({action:'key',provider:'openai',model:'claude-opus-5-5',key:'synthetic-key'})).status,400);
assert.equal((await send({action:'preferences',settings:{aiModels:{anthropic:'gpt-6-astra'}}})).status,400);
assert.equal((await send({action:'preferences',settings:{aiModels:{unknown:'model'}}})).status,400);
assert.equal(JSON.stringify(settings),before);
assert.equal(savedKey,keyBefore);
assert.equal(settings.aiModels.anthropic,'claude-fable-5-1');
assert.equal(settings.aiModels.openai,'gpt-6-astra');
console.log('Passed all four model saves, model changes without replacing keys, separate provider choices, and invalid-model rejection. No real keys or provider calls.');
