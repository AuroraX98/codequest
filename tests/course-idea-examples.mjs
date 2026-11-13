import assert from 'node:assert/strict';
import {readFile, mkdtemp, symlink, rm} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {build} from 'esbuild';
import React, {act} from 'react';
import {createRoot} from 'react-dom/client';
import {renderToStaticMarkup} from 'react-dom/server';
import {JSDOM} from 'jsdom';

const readJson = async name => JSON.parse(await readFile(name, 'utf8'));
const lessons = await readJson('content/lessons.json');
const sourceHashes = Object.assign({}, ...await Promise.all(['web', 'systems', 'applied'].map(group => readJson(`content/course-idea-sources-${group}.json`))));
const tables = Object.assign({}, ...await Promise.all(['web', 'systems', 'applied'].map(group => readJson(`content/course-idea-examples-${group}.json`))));
const otherLessons = lessons.filter(lesson => !lesson.id.startsWith('python-'));
assert.deepEqual(Object.keys(tables).sort(), otherLessons.map(lesson => lesson.id).sort(), 'Every other lesson has an explicit example mapping');
assert.deepEqual(Object.keys(sourceHashes).sort(), Object.keys(tables).sort());
const temp = await mkdtemp(path.join(tmpdir(), 'codequest-all-course-examples-'));
const dom = new JSDOM('<div id="root"></div>', {url:'https://fixture.example/', pretendToBeVisual:true});
const globals = new Map();
const install = (name, value) => {
  globals.set(name, Object.getOwnPropertyDescriptor(globalThis, name));
  Object.defineProperty(globalThis, name, {configurable:true, writable:true, value});
};
let root;
try {
  await symlink(path.resolve('node_modules'), path.join(temp, 'node_modules'));
  await build({stdin:{contents:`export {default as Flow} from './components/LessonStepFlow'; export {buildLessonSteps} from './lib/lesson-step-flow'; export {courseIdeaExamples} from './lib/course-idea-examples';`, resolveDir:process.cwd(), loader:'ts'}, outfile:path.join(temp,'test.mjs'), bundle:true, platform:'node', format:'esm', packages:'external', plugins:[{name:'css', setup(b){b.onLoad({filter:/\.module\.css$/},()=>({contents:'export default new Proxy({}, {get:(_, name)=>String(name)});',loader:'js'}));}}]});
  const {Flow, buildLessonSteps, courseIdeaExamples} = await import(pathToFileURL(path.join(temp,'test.mjs')));
  const trackOf = lesson => lesson.id.replace(/-[^-]+$/, '');
  const displayLanguage = lesson => ['c','cpp','csharp','java','kotlin','go','rust','php','ruby','r'].includes(trackOf(lesson)) ? trackOf(lesson) : lesson.runtime;
  const base = {reviewedLesson:true, onNext(){}, onBack(){}, backDisabled:true};
  let sections=0, thoughts=0, examples=0, companionFiles=0;
  const tracks = new Map();
  const fixtures = [];
  for (const lesson of lessons) {
    const language = displayLanguage(lesson);
    if (!tracks.has(trackOf(lesson))) { tracks.set(trackOf(lesson),lesson); fixtures.push([lesson,0]); }
    if (tables[lesson.id]) {
      assert.equal(tables[lesson.id].sections.length, lesson.explanation.length,lesson.id);
      assert.equal(sourceHashes[lesson.id].length,lesson.explanation.length,lesson.id);
      for (const example of tables[lesson.id].examples) {
        assert.ok(example.code.trim() && example.language.trim() && example.note.trim(), `${lesson.id}: nonempty concrete context`);
        if(example.output!==undefined) assert.equal(typeof example.output,'string');
        if(example.stdin!==undefined) assert.equal(typeof example.stdin,'string');
        for(const file of example.files??[]) {
          assert.ok(file.name.trim() && file.code.trim() && file.language.trim(),`${lesson.id}: complete companion file`);
          companionFiles++;
        }
      }
      examples+=tables[lesson.id].examples.length;
    }
    for (const [section,text] of lesson.explanation.entries()) {
      const label=`${lesson.id}:${section}`;
      if(tables[lesson.id]) assert.equal(createHash('sha256').update(text).digest('hex'),sourceHashes[lesson.id][section],`${label}: review mappings after lesson edits`);
      const context=courseIdeaExamples(lesson.id,section);
      const steps=buildLessonSteps(text,language,{authoredOnly:true});
      const explanations=steps.filter(step=>step.kind==='explain');
      assert.ok(context,label);
      assert.equal(context.thoughtExamples.length,explanations.length,label);
      for(const [index,thought] of explanations.entries()) {
        const chosen=context.thoughtExamples[index];
        assert.ok(Number.isInteger(chosen) && chosen>=0 && chosen<context.examples.length,`${label}:${index} ${thought.text}`);
      }
      if(steps[0].kind==='explain') {
        const markup=renderToStaticMarkup(React.createElement(Flow,{...base,text,runtime:language,ideaExamples:context}));
        assert.ok(markup.includes('data-idea-example'),`${label}: first explanation shows its example`);
      }
      if(tables[lesson.id] && (new Set(context.thoughtExamples).size>1 || context.thoughtExamples.some(i=>context.examples[i].files?.length)) && fixtures.length<65) fixtures.push([lesson,section]);
      sections++;thoughts+=explanations.length;
    }
  }
  assert.equal(tracks.size,21);
  assert.equal(courseIdeaExamples('missing-lesson',0),undefined);
  assert.equal(courseIdeaExamples('javascript-01',999),undefined);
  install('window',dom.window);install('document',dom.window.document);install('navigator',dom.window.navigator);install('localStorage',dom.window.localStorage);install('IS_REACT_ACT_ENVIRONMENT',true);
  let networkCalls=0,completed=0,copied;
  install('fetch',()=>{networkCalls++;throw Error('Examples must be available offline');});
  Object.defineProperty(navigator,'clipboard',{value:{writeText:async text=>{copied=text;}}});
  root=createRoot(document.getElementById('root'));
  const render=async props=>act(async()=>root.render(React.createElement(Flow,{...base,...props})));
  const click=async selector=>act(async()=>{const node=document.querySelector(selector);assert.ok(node,selector);node.click();});
  const verifyExample=context=>{
    const panel=document.querySelector('[data-idea-example]');assert.ok(panel);
    assert.equal(panel.closest('details'),null,'Examples are immediately visible');
    const codes=[...panel.querySelectorAll('pre code')].map(node=>node.textContent);
    assert.deepEqual(codes,[...(context.files??[]).map(file=>file.code),context.code,...(context.stdin!==undefined?[context.stdin]:[]),...(context.output!==undefined?[context.output]:[])]);
  };
  const journeys=[...new Map(fixtures.map(fixture=>[fixture[0].id+':'+fixture[1],fixture])).values()];
  for(const [lesson,section] of journeys) {
    const text=lesson.explanation[section],runtime=displayLanguage(lesson),context=courseIdeaExamples(lesson.id,section);
    const steps=buildLessonSteps(text,runtime,{authoredOnly:true});let thought=0;
    await render({key:lesson.id+':'+section,text,runtime,ideaExamples:context,completion:React.createElement('button',{onClick:()=>completed++},'Mark as read')});
    for(let index=0;index<steps.length;index++) {
      assert.equal(Number(document.querySelector('[data-lesson-step-flow]').dataset.stepIndex),index);
      if(steps[index].kind==='explain') {
        const example=context.examples[context.thoughtExamples[thought++]];verifyExample(example);
        if(index>0){await click('[data-step-back]');await click('[data-step-primary]');verifyExample(example);}
      } else assert.equal(document.querySelector('[data-idea-example]'),null);
      if(index<steps.length-1)await click('[data-step-primary]');
    }
  }
  const escaped={code:'const label = "<img src=x onerror=alert(1)>";\nconsole.log(label);',language:'javascript',note:'This string is displayed literally.',files:[{name:'<script>.json',code:'{"label":"<script>alert(1)</script>"}',language:'json'}]};
  await render({text:'A filename and a string are shown as text.',runtime:'javascript',explanationExample:escaped});
  verifyExample(escaped);
  assert.equal(document.querySelectorAll('img,script,[onerror]').length,0);
  await click('[data-idea-example] [aria-label="Copy example code"]');
  assert.equal(copied,escaped.files[0].code,'Companion copy preserves exact code');
  await click('[data-idea-example] [aria-label="Copy example code"]');
  assert.equal(copied,escaped.code,'Main example copy preserves exact code');
  const savedLesson=lessons.find(lesson=>lesson.id==='java-02'),savedText=savedLesson.explanation[0];
  const savedSteps=buildLessonSteps(savedText,'java',{authoredOnly:true});
  const resumeKey='example-account:java-02:0';
  localStorage.setItem(resumeKey,JSON.stringify({flowVersion:4,text:savedText,runtime:'java',reviewedLesson:true,inlinePractice:true,index:1}));
  await render({text:savedText,runtime:'java',resumeKey,ideaExamples:courseIdeaExamples('java-02',0)});
  assert.equal(Number(document.querySelector('[data-lesson-step-flow]').dataset.stepIndex),1);
  assert.equal(document.querySelector('[data-technical-reading]').textContent,savedSteps[1].text.replaceAll('`',''));
  assert.equal(networkCalls,0);assert.equal(completed,0,'Reading examples never marks a lesson complete');
  console.log(`PASS ${tracks.size} courses, ${lessons.length} lessons, ${sections} sections, ${thoughts} explanation mappings; ${examples} additional-course examples, ${companionFiles} companion files; ${journeys.length} reader journeys, Back/Next, resume, copying, escaping, offline reading, manual completion.`);
} finally {
  if(root)await act(async()=>root.unmount());dom.window.close();
  for(const [name,value] of globals){if(value)Object.defineProperty(globalThis,name,value);else delete globalThis[name];}
  await rm(temp,{recursive:true,force:true});
}
