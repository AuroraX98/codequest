import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, writeFile, rm, symlink, access } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import ts from 'typescript';
import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { renderToStaticMarkup as _renderToStaticMarkup } from 'react-dom/server';
import { JSDOM } from 'jsdom';

const cwd = fileURLToPath(new URL('..', import.meta.url));
const temp = await mkdtemp(path.join(tmpdir(), 'codequest-glossary-'));
const compiled = new Set(), reports = [], externalCalls = [];
const check = async (name, run) => { await run(); reports.push(name); };
const _normalize = text => text.replace(/\s+/g, ' ').trim();
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
  await symlink(path.join(cwd, 'node_modules'), path.join(temp, 'node_modules'), process.platform === 'win32' ? 'junction' : 'dir');
  await compile('components/LessonStepFlow.tsx');
  const { default: Flow } = await importFile('components/LessonStepFlow.tsx');
  const { default: Content } = await importFile('components/LessonContent.tsx');
  const { glossaryMatches, glossaryTermsIn: _glossaryTermsIn, lessonGlossary } = await importFile('lib/lesson-glossary.ts');
  const { buildLessonSteps } = await importFile('lib/lesson-step-flow.ts');
  const lessons = JSON.parse(await readFile(path.join(cwd, 'content/lessons.json'), 'utf8'));
  const used = new Set(); let coveredLessons = 0, coveredSections = 0, matches = 0;
  await check('Lesson word help and Terminology use the same base definitions and appropriate course meanings', async()=>{
    const entries=JSON.parse(await readFile(path.join(cwd,'content/terminology.json'),'utf8'));
    const byId=new Map(entries.map(term=>[term.id,term]));
    for(const word of lessonGlossary) assert.equal(byId.get(word.id)?.meaning,word.meaning,word.id);
    assert.match(glossaryMatches('An index.', 'r')[0].term.meaning,/first position is 1/);
    assert.match(glossaryMatches('A token.', 'ai')[0].term.meaning,/piece a model uses/);
  });
  await check('Every curated entry has a short definition, example, and unique stable identity', () => {
    assert.equal(new Set(lessonGlossary.map(term => term.id)).size, lessonGlossary.length);
    for (const term of lessonGlossary) {
      assert.ok(term.name && term.meaning && term.example);
      assert.ok(term.meaning.length <= 300, term.id);
      assert.ok(term.example.length <= 230, term.id);
      assert.ok(term.aliases.includes(term.name));
    }
  });
  await check('Whole terms, phrase precedence, runtime meaning, and original text boundaries are safe', () => {
    const text = 'An API key is not an API. A function has parameters. my_function and dysfunction are names. `function` and https://example.org/function stay untouched.\n```python\nfunction = 3\n```';
    const found = glossaryMatches(text, 'python');
    assert.deepEqual(found.filter(match => ['api-key','api'].includes(match.term.id)).map(match => match.term.id), ['api-key','api']);
    assert.equal(found.filter(match => match.term.id === 'function').length, 1);
    for (const match of found) assert.equal(text.slice(match.from, match.to), match.text);
    assert.equal(glossaryMatches('An index.', 'sql')[0].term.id, 'sql-index');
    assert.equal(glossaryMatches('Change Double to return n * 3.', 'go').some(x => x.term.id === 'float'),false);
    assert.equal(glossaryMatches('An interface.', 'go')[0].term.id,'go-interface');
    assert.equal(glossaryMatches('An interface.', 'typescript')[0].term.id,'interface');
    assert.equal(glossaryMatches('An index.', 'python')[0].term.id, 'index');
    assert.equal(glossaryMatches('A class.', 'html')[0].term.id, 'css-class');
    assert.equal(glossaryMatches('A class.', 'python')[0].term.id, 'class');
    assert.equal(glossaryMatches('Set the value.', 'python').some(match => match.term.id === 'python-set'), false);
    assert.equal(glossaryMatches('A function is a named set of steps.', 'python').some(match => match.term.id === 'python-set'), false);
    assert.equal(glossaryMatches('A program is a list of instructions.', 'python').some(match => match.term.id === 'list'), false);
    assert.equal(glossaryMatches('The set contains two items.', 'python')[0].term.id, 'python-set');
    assert.equal(glossaryMatches('AI explains code.', 'python')[0].term.id, 'ai');
    assert.equal(glossaryMatches('model a player object', 'python').some(match => match.term.id === 'ai-model'), false);
  });
  await check('Coverage is measured against actual curriculum prose, not assumed for every word', () => {
    for (const lesson of lessons) {
      let found = 0;
      for (const text of lesson.explanation) {
        const hits = glossaryMatches(text, lesson.runtime);
        if (hits.length) coveredSections++;
        matches += hits.length;
        for (const match of hits) used.add(match.term.id);
        found += hits.length;
      }
      if (found) coveredLessons++;
      for (const text of lesson.steps) for (const match of glossaryMatches(text, lesson.runtime)) used.add(match.term.id);
      for (const step of buildLessonSteps(lesson.explanation.join('\n\n'), lesson.runtime)) if (step.kind === 'practice') {
        assert.ok(step.question.trim(), 'A practice check has a question');
        assert.ok(step.options.includes(step.answer), 'Its answer is one of the choices');
      }
    }
    assert.ok(coveredLessons > 0 && coveredLessons <= lessons.length); assert.ok(coveredSections > 700);
    assert.ok(used.has('ai')); assert.ok(used.has('parameter')); assert.ok(used.has('argument'));
  });
  install('window',dom.window); install('document',dom.window.document); install('navigator',dom.window.navigator); install('IS_REACT_ACT_ENVIRONMENT',true);
  install('fetch',(...args)=>{externalCalls.push(args);throw new Error('No glossary network calls');});
  for(const method of ['setItem','removeItem','clear']) dom.window.Storage.prototype[method]=(...args)=>{externalCalls.push(args);throw new Error('No glossary writes');};
  root=createRoot(document.getElementById('root'));
  let next=0, back=0;
  const base={text:'A function uses a parameter. A variable refers to a value.',runtime:'python',onNext:()=>next++,onBack:()=>back++,backDisabled:true};
  const render=async props=>{await act(async()=>root.render(React.createElement(Flow,{...base,...props})));};
  const click=async node=>{assert.ok(node);await act(async()=>{node.focus();node.click();});};
  const panel=()=>document.querySelector('[data-step-kind]');
  const term=id=>panel().querySelector(`[data-glossary-term="${id}"]`);
  const definition=()=>[...document.querySelectorAll('[data-glossary-definition]')].find(node=>!node.hidden);
  await check('reviewed terms keep ordinary words from opening unrelated coding definitions',async()=>{
    await render({text:'A program is a list of instructions the computer follows.',glossaryTerms:['program']});
    assert.ok(term('program'));
    assert.equal(term('list'),null,'Ordinary list does not link to Python collections');
    assert.ok(panel().textContent.includes('list of instructions'));
  });
  await check('Terms are native accessible buttons; opening one leaves the original thought unchanged',async()=>{
    await render({});
    const initial=panel().textContent;
    const button=term('function');assert.equal(button.type,'button');assert.equal(button.tabIndex,0);assert.equal(button.getAttribute('aria-expanded'),'false');
    assert.ok(document.getElementById(button.getAttribute('aria-controls')).hidden);
    await click(button);
    assert.equal(panel().textContent,initial);assert.equal(button.getAttribute('aria-expanded'),'true');assert.ok(definition());
    assert.match(definition().textContent,/Reusable instructions that do a task/);assert.match(definition().textContent,/A function can have a name/);assert.match(definition().textContent,/Example/);
    assert.equal(document.activeElement,button,'Disclosure leaves focus on its trigger');
  });
  await check('Repeated click toggles, another term replaces the definition, and Close restores focus',async()=>{
    await click(term('function'));assert.equal(definition(),undefined);
    await click(term('function'));await click(term('parameter'));
    assert.equal([...document.querySelectorAll('[data-glossary-definition]')].filter(node=>!node.hidden).length,1);
    assert.match(definition().textContent,/function definition/);
    await click(definition().querySelector('button'));assert.equal(definition(),undefined);assert.equal(document.activeElement,term('parameter'));
  });
  await check('Escape and outside pointer dismiss without advancing or writing progress',async()=>{
    await click(term('function'));
    await act(async()=>document.dispatchEvent(new dom.window.KeyboardEvent('keydown',{key:'Escape',bubbles:true,cancelable:true})));
    assert.equal(definition(),undefined);assert.equal(document.activeElement,term('function'));
    await click(term('parameter'));
    await act(async()=>document.body.dispatchEvent(new dom.window.Event('pointerdown',{bubbles:true})));
    assert.equal(definition(),undefined);assert.equal(next,0);assert.equal(back,0);
  });
  await check('Next, Back, and lesson changes close vocabulary help without redundant word lists',async()=>{
    await click(term('function'));await click(document.querySelector('[data-step-primary]'));
    assert.equal(definition(),undefined);assert.equal(document.activeElement,panel());assert.ok(term('variable'));
    await click(term('variable'));await click(document.querySelector('[data-step-back]'));
    assert.equal(definition(),undefined);assert.ok(term('function'));
    assert.equal(document.querySelector('[data-glossary-words]'),null);
    await click(term('parameter'));assert.ok(definition());
    await render({text:'An array has an index.',runtime:'javascript'});
    assert.equal(definition(),undefined);assert.equal(document.querySelector('[data-glossary-words]'),null);
    assert.equal(document.querySelector('[data-step-index]').dataset.stepIndex,'0');
  });
  await check('Code, HTML-like strings, original note wording, and unknown words remain intact',async()=>{
    const code='function_name = "<script>value</script>"\n';
    await act(async()=>root.render(React.createElement(Content,{text:'A **function** uses `a_variable`. Mysteryword stays plain.\n```python\n'+code+'```',runtime:'python',glossary:true})));
    assert.equal(document.querySelector('pre code').textContent,code);assert.equal(document.querySelectorAll('pre button,.inline-code button').length,0);
    assert.equal(document.querySelectorAll('script,img,iframe').length,0);assert.equal(document.querySelector('strong button').textContent,'function');
    assert.match(document.querySelector('.lesson-content p').textContent,/A function uses a_variable. Mysteryword stays plain./);
    assert.deepEqual(externalCalls,[]);
  });
  await check('Optional reference scopes replace each other rather than leaving two definitions open',async()=>{
    await act(async()=>root.render(React.createElement('div',null,
      React.createElement(Content,{text:'A function has a parameter.',runtime:'python',glossary:true}),
      React.createElement(Content,{text:'A variable refers to a value.',runtime:'python',glossary:true}))));
    const open=()=>[...document.querySelectorAll('[data-glossary-definition]')].filter(node=>!node.hidden);
    const first=document.querySelector('[data-glossary-term="function"]');
    const second=document.querySelector('[data-glossary-term="variable"]');
    await click(first);assert.equal(open().length,1);
    await click(second);assert.equal(open().length,1);assert.match(open()[0].textContent,/variable/i);
    await click(first);assert.equal(open().length,1);assert.match(open()[0].textContent,/function/i);
    await click(first);assert.equal(open().length,0);assert.deepEqual(externalCalls,[]);
  });
  console.log(`Passed ${reports.length} glossary checks. ${lessonGlossary.length} curated entries; ${used.size} matched entries in authored prose/instructions; ${coveredLessons}/${lessons.length} lessons, ${coveredSections}/${lessons.reduce((n,l)=>n+l.explanation.length,0)} written sections, ${matches} section-level matches. Native keyboard semantics and Escape/focus tested in DOM; no browser key activation or visual measurement claimed.`);
  for(const report of reports) console.log('  ✓ '+report);
} finally {
  if(root) await act(async()=>root.unmount());
  for(const [name,value] of savedGlobals) { if(value) Object.defineProperty(globalThis,name,value); else delete globalThis[name]; }
  dom.window.close(); await rm(temp,{recursive:true,force:true});
}
