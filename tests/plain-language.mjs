import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, writeFile, rm, symlink, access } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import ts from 'typescript';
import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { renderToStaticMarkup } from 'react-dom/server';
import { JSDOM } from 'jsdom';

const cwd = fileURLToPath(new URL('..', import.meta.url));
const temp = await mkdtemp(path.join(tmpdir(), 'codequest-step-flow-'));
const compiled = new Set(), reports = [], externalCalls = [];
const check = async (name, run) => { await run(); reports.push(name); };
const normalize = text => text.replace(/\s+/g, ' ').trim();
async function compile(file) {
  if (compiled.has(file)) return;
  compiled.add(file);
  const dest = path.join(temp, file.replace(/\.tsx?$/, '.mjs'));
  await mkdir(path.dirname(dest), { recursive: true });
  if (file.endsWith('.css')) {
    await writeFile(dest + '.mjs', 'export default new Proxy({}, {get: (_, name) => String(name)});');
    return;
  }
  const output = ts.transpileModule(await readFile(path.join(cwd, file), 'utf8'), {
    compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext, jsx: ts.JsxEmit.ReactJSX }, reportDiagnostics: true,
  });
  assert.equal(output.diagnostics?.filter(d => d.category === ts.DiagnosticCategory.Error).length, 0, file);
  for (const match of output.outputText.matchAll(/from\s+(['"])(\.\.?\/[^'"]+)\1/g)) {
    const stem = path.posix.normalize(path.posix.join(path.posix.dirname(file), match[2]));
    let target;
    for (const candidate of match[2].endsWith('.css') ? [stem] : [stem + '.ts', stem + '.tsx']) {
      try { await access(path.join(cwd, candidate)); target = candidate; break; } catch {}
    }
    assert.ok(target, 'Resolved ' + match[2]);
    await compile(target);
  }
  await writeFile(dest, output.outputText.replace(/from\s+(['"])(\.\.?\/[^'"]+)\1/g, 'from "$2.mjs"'));
}
const importFile = file => import(pathToFileURL(path.join(temp, file.replace(/\.tsx?$/, '.mjs'))).href);
const dom = new JSDOM('<div id="root"></div>', { url: 'https://fixture.example/', pretendToBeVisual: true });
const savedGlobals = new Map();
function install(name, value) {
  savedGlobals.set(name, Object.getOwnPropertyDescriptor(globalThis, name));
  Object.defineProperty(globalThis, name, { configurable: true, writable: true, value });
}
let root;
try {
 await symlink(path.join(cwd,'node_modules'),path.join(temp,'node_modules'),'dir');
 await compile('components/LessonStepFlow.tsx'); await compile('lib/python-concepts.ts'); await compile('components/PairedLessonText.tsx');
 const {default:Flow}=await importFile('components/LessonStepFlow.tsx');
 const {buildLessonSteps,shortLessonThoughts}=await importFile('lib/lesson-step-flow.ts');
 const {default:PairedLessonText}=await importFile('components/PairedLessonText.tsx');
 const {codeAnatomy}=await importFile('lib/code-anatomy.ts');
 const {plainLanguagePairs,plainLessonExplanation}=await importFile('lib/plain-language.ts');
 const {pythonConcepts}=await importFile('lib/python-concepts.ts');
 const lessons=JSON.parse(await readFile('content/lessons.json','utf8'));
 let paired=0,unpaired=0,anatomyParts=0; const unique=new Set();
 await check('Reviewed pairs match exact source, are distinct, and never invent fallback text',()=>{
   const keys=new Set();for(const pair of plainLanguagePairs){
     const key=pair.runtime+'\0'+pair.source;
     if(keys.has(key)) assert.equal(plainLanguagePairs.find(p=>p.runtime+'\0'+p.source===key).simple,pair.simple);
     keys.add(key);assert.notEqual(pair.simple,pair.source);assert.ok(pair.simple.trim());
     assert.equal(plainLessonExplanation(pair.source,pair.runtime),pair.simple);
   }
   assert.equal(plainLessonExplanation('An uncovered sentence.','python'),null);
   for(const l of lessons)for(const text of l.explanation)for(const step of buildLessonSteps(text,l.runtime))if(step.kind==='explain'){
     if(plainLessonExplanation(step.text,l.runtime))paired++;else unpaired++;
     assert.ok(plainLessonExplanation(step.text,l.runtime),l.id+': '+step.text);
   }
   for(const concept of pythonConcepts)for(const step of buildLessonSteps(concept.short+' '+concept.why,'python'))if(step.kind==='explain')assert.ok(plainLessonExplanation(step.text,'python'),step.text);
   assert.equal(paired,4476);assert.equal(unpaired,0);
   const corpus=[];
   for(const l of lessons)for(const text of l.explanation)for(const step of buildLessonSteps(text,l.runtime))if(step.kind==='explain')corpus.push({source:step.text,runtime:l.runtime,lesson:l.id});
   for(const c of pythonConcepts)for(const text of [c.short,c.why,c.imagine,c.limit,...c.explore.map(b=>b.text)])for(const source of shortLessonThoughts(text))corpus.push({source,runtime:'python',lesson:'python-concepts'});
   const key=p=>JSON.stringify([p.lesson,p.runtime,p.source]);
   assert.deepEqual(plainLanguagePairs.map(key).sort(),corpus.map(key).sort(),'Every exact authored source has one counterpart; no invented source keys');
   for(const pair of plainLanguagePairs)assert.equal((pair.simple.match(/`/g)||[]).length%2,0,'Balanced inline code: '+pair.lesson);
 });
 await check('Every supplemental Python concept explanation keeps both visible layers and contextual words',()=>{
   let count=0;
   for(const c of pythonConcepts)for(const text of [c.short,c.why,c.imagine,c.limit,...c.explore.map(b=>b.text)]){
     const thoughts=shortLessonThoughts(text);
     const doc=new JSDOM(renderToStaticMarkup(React.createElement(PairedLessonText,{text,runtime:'python'}))).window.document;
     const originals=[...doc.querySelectorAll('[data-technical-reading]')];
     const simple=[...doc.querySelectorAll('[data-simple-reading]')];
     assert.equal(originals.length,thoughts.length);assert.equal(simple.length,thoughts.length);
     for(let i=0;i<thoughts.length;i++){
       assert.equal(originals[i].textContent,thoughts[i].replace(/`/g,''));
       assert.equal(simple[i].textContent,'In simple words'+plainLessonExplanation(thoughts[i],'python').replace(/`/g,''));
       assert.equal(simple[i].closest('details'),null);
     }
     count+=thoughts.length;doc.defaultView.close();
   }
   assert.equal(count,86);
 });
 await check('Every current anatomy part keeps technical wording plus a distinct jargon-free plain explanation',()=>{
   for(const l of lessons)for(const text of l.explanation)for(const step of buildLessonSteps(text,l.runtime))if(step.kind==='example'){
     for(const line of codeAnatomy(step.code,step.language).lines)for(const token of line.tokens)if(token.label){
       anatomyParts++;unique.add(token.explanation);assert.ok(token.plainExplanation);assert.notEqual(token.explanation,token.plainExplanation);
       assert.doesNotMatch(token.plainExplanation,/callable|invoked|annotation|binding|parenthesized|qualified name|declaration|reserved word|operands?/i);
     }
   }
   const tokens=codeAnatomy('print("Hello")','python').lines[0].tokens;
   assert.equal(tokens[0].explanation,'The callable being invoked. The following arguments are passed into it.');
   assert.match(tokens[0].plainExplanation,/text “Hello” to show/);
   assert.match(tokens[1].plainExplanation,/tell print what to show/);
   assert.match(tokens[2].plainExplanation,/outside quotes are not shown/);
   assert.equal(tokens[3].plainExplanation,'Closes this use of print.');
 });
 await check('Technical and simple layers are both visible in their same one-idea screen',()=>{
   const text='`print()` is a built-in function: a ready-made instruction Python provides for you to reuse.';
   const doc=new JSDOM(renderToStaticMarkup(React.createElement(Flow,{text,runtime:'python',onNext(){},onBack(){},backDisabled:true}))).window.document;
   const panel=doc.querySelector('[data-step-kind]');assert.equal(panel.dataset.stepKind,'explain');
   assert.match(panel.querySelector('[data-technical-reading]').textContent,/built-in function/);
   assert.match(panel.querySelector('[data-simple-reading]').textContent,/tool Python already includes/);
   assert.equal(panel.querySelector('[data-simple-reading]').closest('details'),null);
   assert.equal(panel.querySelectorAll('[data-technical-reading]').length,1);
   doc.defaultView.close();
 });
 console.log(`Passed ${reports.length} technical/plain pairing checks: ${plainLanguagePairs.length} reviewed entries; ${paired} current curriculum thoughts paired, ${unpaired} not yet paired; all six beginner concept-room microflows covered; ${anatomyParts} current example parts with ${unique.size} technical description forms have distinct simple counterparts.`);
}finally{dom.window.close();await rm(temp,{recursive:true,force:true});}
