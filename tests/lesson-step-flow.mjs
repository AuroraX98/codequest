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
  await symlink(path.join(cwd, 'node_modules'), path.join(temp, 'node_modules'), 'dir');
  await compile('components/LessonStepFlow.tsx');
  const { default: Flow } = await importFile('components/LessonStepFlow.tsx');
  const { buildLessonSteps, codePartPractice, shortLessonThoughts, distinctLessonReference } = await importFile('lib/lesson-step-flow.ts');
  const { lessonBlocks } = await importFile('lib/lesson-markup.ts');
  const { codeAnatomy } = await importFile('lib/code-anatomy.ts');
  const { default: Content } = await importFile('components/LessonContent.tsx');
  const lessons = JSON.parse(await readFile(path.join(cwd, 'content/lessons.json'), 'utf8'));
  let sections = 0, ideas = 0, examples = 0, exercises = 0;

  await check('Every authored section preserves canonical prose and examples without duplicate optional text', () => {
    const doc = new JSDOM('').window.document;
    for (const lesson of lessons) for (const text of lesson.explanation) {
      sections++;
      const steps = buildLessonSteps(text, lesson.runtime), blocks = lessonBlocks(text, lesson.runtime);
      const prose = steps.filter(step => step.kind === 'explain');
      assert.equal(normalize(prose.map(step => step.text).join(' ')), normalize(blocks.filter(block => block.kind === 'prose').map(block => block.text).join(' ')), lesson.id);
      for (const idea of prose) {
        assert.equal((idea.text.match(/`/g)?.length ?? 0) % 2, 0, lesson.id + ': inline code remains whole');
        // Long whole sentences are kept rather than cut into incomplete fragments.
      }
      for (const step of steps.filter(step => step.kind === 'practice')) {
        exercises++;
        assert.ok(step.options.length >= 3 && step.options.length <= 4);
        assert.equal(new Set(step.options).size, step.options.length);
        assert.equal(step.options.filter(option => option === step.answer).length, 1);
        assert.notEqual(step.role, 'Code');
        assert.notEqual(step.role, 'Symbol');
      }
      ideas += prose.length;
      examples += steps.filter(step => step.kind === 'example').length;
      doc.body.innerHTML = renderToStaticMarkup(React.createElement(Flow, { text, runtime: lesson.runtime, onNext() {}, onBack() {}, backDisabled: true }));
      assert.equal(doc.querySelector('[data-lesson-reference]'), null, lesson.id + ': no duplicate source expander');
      assert.equal(doc.querySelectorAll('[data-step-kind]').length, 1);

    }
    doc.defaultView.close();
    assert.equal(sections, lessons.reduce((sum, lesson) => sum + lesson.explanation.length, 0));
    assert.ok(examples > 249, 'Includes inline examples as well as fenced blocks');
    assert.ok(exercises > 0);
  });

  await check('Optional references keep only distinct clarification across shared templates', () => {
    const text = 'Instructions that Python follows. A program turns a task you can describe into precise steps the computer can repeat.\n\n```python\nprint("Hello")\n```';
    assert.equal(distinctLessonReference(text, text, 'python'), '');
    assert.equal(distinctLessonReference(text, text.slice(text.indexOf('A program')), 'python'), '');
    assert.equal(distinctLessonReference('First thought. Second thought.', 'Second thought. A new clarification.', 'python'), 'A new clarification.');
    assert.ok(buildLessonSteps(text, 'python').some(s => s.kind === 'example' && s.code.includes('print("Hello")')));
    assert.ok(buildLessonSteps(text, 'python').some(s => s.kind === 'explain' && s.text.startsWith('A program turns')));
  });

  await check('Short thoughts keep authored inline and bold units intact', () => {
    const text = 'Read `print("Hello. Stay together!")` once. ' + 'Choose these ordinary words carefully so that the next idea stays small without changing the text. '.repeat(4) + '**Keep this whole bold phrase together.**';
    const thoughts = shortLessonThoughts(text);
    assert.equal(normalize(thoughts.join(' ')), normalize(text));
    assert.ok(thoughts.every(thought => thought.length <= 190));
    assert.deepEqual(shortLessonThoughts('Use **not** here. **Read this next.** Then continue.'), ['Use **not** here.', '**Read this next.**', 'Then continue.']);
    assert.equal(shortLessonThoughts('Keep `name`’s value and **not**, punctuation.')[0], 'Keep `name`’s value and **not**, punctuation.');
    const longSentence = 'This is ' + 'one very long description '.repeat(12) + 'that remains a complete idea.';
    assert.deepEqual(shortLessonThoughts(longSentence), [longSentence]);
    assert.ok(thoughts.some(thought => thought.includes('`print("Hello. Stay together!")`')));
    assert.ok(thoughts.some(thought => thought.includes('**Keep this whole bold phrase together.**')));
  });

  await check('Examples follow their idea, deduplicate inline snippets, and never quiz an ambiguous role', () => {
    const text = 'Use `print("Hello")` to show text. Then use `print("Hello")` again.';
    assert.deepEqual(buildLessonSteps(text, 'python').map(step => step.kind), ['explain', 'example', 'practice', 'explain']);
    assert.equal(codePartPractice('print("Hello")', 'python').answer, 'Hello');
    for (const code of ['first(second())', 'a + b + c']) {
      assert.equal(codePartPractice(code, 'python'), null, 'Unknown state does not get a fabricated quiz');
    }
    const values = codePartPractice('pet_age = 5', 'python');
    assert.match(values.question, /replaced with "5"/);
    assert.equal(values.answer, 'The value becomes text instead of a number.');
    assert.match(values.explanation, /Quotation marks/);
    assert.equal(codePartPractice('pet_age = 5\npet_age = pet_age + 1', 'python').answer, '6');
    assert.equal(codePartPractice('pet_name = "Pepper"\nprint(pet_name)', 'python').answer, 'pet_name');
    assert.equal(codePartPractice('print("Pepper", 5)', 'python').answer, 'Pepper 5');
    assert.equal(codePartPractice('"hello"', 'python'), null, 'Do not invent distractors');
    assert.equal(codePartPractice('mystery(thing)', 'unrecognized'), null);
    const output = buildLessonSteps('```output\nHello <img>\n```', 'python');
    assert.deepEqual(output, [{kind: 'output', code: 'Hello <img>\n', language: 'output'}]);
    for (const language of ['text', 'output', 'plaintext', 'plain', 'TEXT']) assert.equal(codePartPractice('print("Hello")', language), null);
  });

  install('window', dom.window); install('document', dom.window.document); install('navigator', dom.window.navigator); install('IS_REACT_ACT_ENVIRONMENT', true);
  install('fetch', (...args) => { externalCalls.push(args); throw new Error('No network while reading or checking'); });
  for (const method of ['setItem', 'removeItem', 'clear']) dom.window.Storage.prototype[method] = (...args) => { externalCalls.push(args); throw new Error('No storage writes'); };
  root = createRoot(document.getElementById('root'));
  let next = 0, back = 0, saved = 0;
  const text = 'Use `print("Hello")` to show text. You can move on after this thought.';
  const completion = React.createElement('button', { type: 'button', onClick: () => saved++ }, 'Mark as read');
  const base = { text, runtime: 'python', onNext: () => next++, onBack: () => back++, backDisabled: true, completion };
  const render = async props => { await act(async () => root.render(React.createElement(Flow, { ...base, ...props }))); };
  const click = async node => { assert.ok(node); await act(async () => { node.focus(); node.click(); }); };
  const primary = () => document.querySelector('[data-step-primary]');
  const panel = () => document.querySelector('[data-step-kind]');

  await check('Next replaces one thought with example and practice; Back stays local and preserves parent progress', async () => {
    await render({});
    assert.equal(panel().dataset.stepKind, 'explain');
    assert.equal(panel().querySelectorAll('p').length, 1);
    assert.equal(panel().querySelector('[data-code-anatomy]'), null);
    assert.equal(document.querySelector('[data-step-back]').disabled, true);
    assert.equal(document.querySelector('[data-step-completion]'), null);
    const first = panel();
    await click(primary());
    assert.equal(first.isConnected, false);
    assert.equal(panel().dataset.stepKind, 'example');
    assert.equal(document.activeElement, panel(), 'Focus follows replacing content without scrolling');
    assert.equal(panel().querySelectorAll('[data-code-anatomy]').length, 1);
    await click(primary());
    assert.equal(panel().dataset.stepKind, 'practice');
    assert.equal(primary().textContent, 'Check');
    assert.equal(primary().disabled, true);
    assert.equal(document.querySelectorAll('input[type="radio"]').length, 4);
    assert.equal(document.querySelectorAll('input[type="radio"]:checked').length, 0);
    const wrong = [...document.querySelectorAll('input')].find(input => input.value !== 'Hello');
    await click(wrong); await click(primary());
    assert.match(panel().querySelector('[role="status"]').textContent, /Here's the answer.*Hello/s);
    assert.equal(primary().textContent, 'Continue');
    await click(primary());
    assert.equal(panel().dataset.stepKind, 'explain');
    assert.equal(panel().textContent, 'You can move on after this thought.');
    assert.ok(document.querySelector('[data-step-completion]'));
    assert.equal(saved, 0);
    await click(document.querySelector('[data-step-completion] button'));
    assert.equal(saved, 1);
    await click(document.querySelector('[data-step-back]'));
    assert.equal(panel().dataset.stepKind, 'practice');
    assert.equal(document.querySelector('[data-step-completion]'), null);
    assert.equal(primary().disabled, true, 'Returning to a question resets its local answer');
    await click([...document.querySelectorAll('input')].find(input => input.value === 'Hello'));
    await click(primary());
    assert.match(panel().querySelector('[role="status"]').textContent, /That's right/);
    await click(primary()); await click(primary());
    assert.equal(next, 1);
    assert.equal(back, 0);
    assert.equal(saved, 1);
    assert.deepEqual(externalCalls, []);
  });

  await check('Final practice gates manual completion, source changes reset, and first Back invokes parent only when allowed', async () => {
    await render({ text: 'Use `print("Only")`.', referenceText: 'A distinct clarification.', backDisabled: false });
    assert.equal(document.querySelector('[data-lesson-step-flow]').dataset.stepIndex, '0');
    await click(document.querySelector('[data-step-back]'));
    assert.equal(back, 1);
    await click(primary()); await click(primary());
    assert.equal(panel().dataset.stepKind, 'practice');
    assert.equal(document.querySelector('[data-step-completion]'), null);
    await click(document.querySelector('input')); await click(primary());
    assert.ok(document.querySelector('[data-step-completion]'));
    assert.equal(saved, 1);
    await click(document.querySelector('[data-lesson-reference] summary'));
    assert.equal(document.querySelector('[data-lesson-reference]').open, true);
    await render({ text: 'A different short thought.' });
    assert.equal(document.querySelector('[data-lesson-step-flow]').dataset.stepIndex, '0');
    assert.equal(document.querySelector('[data-lesson-reference]'), null);
    assert.equal(panel().dataset.stepKind, 'explain');
    assert.deepEqual(externalCalls, []);
    await render({ text: 'First thought. Final thought.', startAtEnd: true });
    assert.equal(panel().textContent, 'Final thought.');
    assert.equal(document.querySelector('[data-lesson-step-flow]').dataset.stepIndex, '1');
    await click(document.querySelector('[data-step-back]'));
    assert.equal(panel().textContent, 'First thought.');

  });

  await check('Device-local resume restores valid step and feedback, isolates accounts, and rejects stale source', async () => {
    const values = new Map();
    install('localStorage', {getItem: key => values.get(key) ?? null, setItem: (key, value) => values.set(key, value)});
    await render({resumeKey:'account-a:lesson'});
    await click(primary());
    assert.equal(panel().querySelector('details').open, false, 'Optional token prose begins collapsed');
    await click(primary());
    await click([...document.querySelectorAll('input')].find(input => input.value === 'Hello'));
    await click(primary());
    await render({resumeKey:'account-b:lesson'});
    assert.equal(panel().dataset.stepKind, 'explain');
    await render({resumeKey:'account-a:lesson'});
    assert.equal(panel().dataset.stepKind, 'practice');
    assert.match(panel().textContent, /That's right/);
    assert.equal(primary().textContent, 'Continue');
    await render({resumeKey:'account-a:lesson', text:'Changed curriculum.'});
    assert.equal(panel().dataset.stepKind, 'explain');
    assert.equal(panel().textContent, 'Changed curriculum.');
    assert.deepEqual(externalCalls, [], 'No server progress or network side effects');
  });

  await check('Source is escaped, output is never diagrammed, and controls remain native', async () => {
    const evil = '<img src=x onerror="alert(1)"><script>alert("no")</script>';
    await render({ text: '```html\n' + evil + '\n```' });
    assert.equal(document.querySelectorAll('img,script,iframe,[onclick],[onerror]').length, 0);
    assert.equal(document.querySelector('[data-lesson-reference]'), null);
    assert.ok(buildLessonSteps('```html\n' + evil + '\n```', 'html').some(step => step.kind === 'example' && step.code.trim() === evil));
    await render({ text: '```output\n' + evil + '\n```' });
    assert.equal(panel().dataset.stepKind, 'output');
    assert.equal(document.querySelector('[data-code-anatomy]'), null);
    assert.equal(panel().querySelector('pre code').textContent, evil + '\n');
    assert.ok([...document.querySelectorAll('button')].every(button => button.type === 'button'));
    assert.deepEqual(externalCalls, []);
    const css = await readFile(path.join(cwd, 'components/LessonStepFlow.module.css'), 'utf8');
    assert.doesNotMatch(css, /animation\s*:|transition\s*:/);
    assert.match(css, /@media \(max-width: 480px\)/);
  });

  console.log(`Passed ${reports.length} step-flow checks across ${sections} sections: ${ideas} short thoughts, ${examples} examples, ${exercises} reviewed understanding exercises.`);
  for (const report of reports) console.log('• ' + report);
} finally {
  if (root) await act(async () => root.unmount());
  dom.window.close();
  for (const [name, descriptor] of savedGlobals) {
    if (descriptor) Object.defineProperty(globalThis, name, descriptor); else delete globalThis[name];
  }
  await rm(temp, { recursive: true, force: true });
}
