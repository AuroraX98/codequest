import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {createRequire} from 'node:module';
import {spawnSync} from 'node:child_process';
import ts from 'typescript';
const require=createRequire(import.meta.url), cache=new Map();
function load(file){
  file=path.resolve(file);
  if(cache.has(file))return cache.get(file).exports;
  const entry={exports:{}};cache.set(file,entry);
  const source=ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
  vm.runInNewContext(source,{module:entry,exports:entry.exports,require:name=>name.startsWith('.')?load(path.resolve(path.dirname(file),name)+'.ts'):require(name),console});
  return entry.exports;
}
const {reviewedPythonFirstLesson:ideas}=load('lib/python-concepts.ts');
const {codeAnatomy}=load('lib/code-anatomy.ts');
const ids=['program','values','strings','names','assignment','output'];
assert.deepEqual(Object.keys(ideas),ids);
assert.ok(ideas.program.text.startsWith('A program is a list of instructions the computer follows.'));
for(const [id,idea] of Object.entries(ideas)){
  const {code,parts}=idea.example;
  const tokens=codeAnatomy(code,'python').lines.flatMap(line=>line.tokens).filter(t=>t.label);
  assert.equal(parts.length,tokens.length,`${id}: every displayed part needs a reviewed label`);
  for(const token of tokens){
    const part=parts.find(p=>p.from===token.from&&p.text===token.text);
    assert.ok(part,`${id}: missing exact annotation for ${token.text} at ${token.from}`);
    assert.equal(code.slice(part.from,part.from+part.text.length),part.text);
    assert.ok(part.label.trim()&&part.meaning.trim());
  }
  const result=spawnSync(process.env.PYTHON||(process.platform==='win32'?'python':'python3'),['-c',code],{encoding:'utf8'});
  assert.equal(result.status,0,`${id}: ${result.stderr}`);
  assert.equal(result.stdout.replace(/\r\n/g,'\n'),idea.result+'\n',`${id}: shown output matches executed Python`);
  assert.ok(!/\b(?:rebind|bind|evaluate|immutable|callable|literal|representation)\b/i.test(idea.text),`${id}: unexplained advanced words`);
}
const lesson=JSON.parse(fs.readFileSync('content/lessons.json')).find(l=>l.id==='python-01');
const result=spawnSync(process.env.PYTHON||(process.platform==='win32'?'python':'python3'),['-c',lesson.solution],{encoding:'utf8'});
assert.equal(result.status,0);
assert.equal(result.stdout.trim(),'Milo is 3 years old.');
assert.equal(lesson.quiz.answer,1);
console.log('PASS Python lesson 1: six ideas, six runnable examples with exact outputs, every visible code token has a source-matched reviewed label, preferred definition and original project outcome preserved.');
