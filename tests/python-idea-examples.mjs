import assert from 'node:assert/strict';
import { readFile, mkdtemp, symlink, rm } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { build } from 'esbuild';
import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { renderToStaticMarkup } from 'react-dom/server';
import { JSDOM } from 'jsdom';

const temp = await mkdtemp(path.join(tmpdir(), 'codequest-idea-examples-'));
const lessons = JSON.parse(await readFile('content/lessons.json', 'utf8')).filter(l => l.id.startsWith('python-'));
const sourceHashes = JSON.parse(await readFile('content/python-idea-example-sources.json', 'utf8'));
const savedGlobals = new Map();
const dom = new JSDOM('<div id="root"></div>', { url: 'https://fixture.example/', pretendToBeVisual: true });
let root;
const install = (name, value) => {
  savedGlobals.set(name, Object.getOwnPropertyDescriptor(globalThis, name));
  Object.defineProperty(globalThis, name, { configurable: true, writable: true, value });
};
try {
  await symlink(path.resolve('node_modules'), path.join(temp, 'node_modules'));
  await build({
    stdin: { contents: `export {default as Flow} from './components/LessonStepFlow'; export {buildLessonSteps} from './lib/lesson-step-flow'; export {pythonIdeaExamples} from './lib/python-idea-examples'; export {reviewedPythonFirstLesson} from './lib/python-concepts';`, resolveDir: process.cwd(), loader: 'ts' },
    outfile: path.join(temp, 'test.mjs'), bundle: true, platform: 'node', format: 'esm', packages: 'external',
    plugins: [{name: 'css-modules', setup(b) { b.onLoad({filter: /\.module\.css$/}, () => ({contents: 'export default new Proxy({}, {get: (_, name) => String(name)});', loader: 'js'})); }}],
  });
  const {Flow, buildLessonSteps, pythonIdeaExamples, reviewedPythonFirstLesson} = await import(pathToFileURL(path.join(temp, 'test.mjs')));
  const base = {runtime: 'python', reviewedLesson: true, onNext() {}, onBack() {}, backDisabled: true};
  let sections = 0, thoughts = 0, exampleCount = 0;
  for (const lesson of lessons) {
    assert.equal(sourceHashes[lesson.id].length, lesson.explanation.length, lesson.id);
    for (const [section, text] of lesson.explanation.entries()) {
      const label = `${lesson.id}:${section}`;
      assert.equal(createHash('sha256').update(text).digest('hex'), sourceHashes[lesson.id][section], `${label}: re-review examples when source changes`);
      const context = pythonIdeaExamples(lesson.id, section);
      const steps = buildLessonSteps(text, 'python', {authoredOnly: true});
      const explanations = steps.filter(s => s.kind === 'explain');
      assert.ok(context, `${label}: missing examples`);
      assert.equal(context.thoughtExamples.length, explanations.length, label);
      assert.ok(context.examples.length > 0, label);
      for (const example of context.examples) {
        assert.ok(example.code.trim() && example.note.trim(), `${label}: empty context`);
        assert.ok(['python', 'bash', 'text'].includes(example.language), label);
        if (example.output !== undefined) assert.equal(typeof example.output, 'string');
      }
      for (const [index, thought] of explanations.entries()) {
        const chosen = context.thoughtExamples[index];
        assert.ok(Number.isInteger(chosen) && chosen >= 0 && chosen < context.examples.length, `${label} thought ${index}: ${thought.text}`);
      }
      const markup = renderToStaticMarkup(React.createElement(Flow, {...base, text, ideaExamples: context}));
      if (steps[0].kind === 'explain') {
        assert.ok(markup.includes('data-idea-example'), `${label}: first thought has visible context`);
        assert.ok(markup.includes('Example for this idea'));
      }
      sections++; thoughts += explanations.length; exampleCount += context.examples.length;
    }
  }
  assert.equal(lessons.length, 95);
  assert.equal(sections, 596);
  assert.equal(thoughts, 2590);
  assert.equal(pythonIdeaExamples('javascript-01', 0), undefined);
  assert.equal(pythonIdeaExamples('python-02', 99), undefined);

  install('window', dom.window); install('document', dom.window.document); install('navigator', dom.window.navigator);
  install('localStorage', dom.window.localStorage); install('IS_REACT_ACT_ENVIRONMENT', true);
  let networkCalls = 0, completed = 0;
  install('fetch', () => { networkCalls++; throw Error('Reading must work offline'); });
  root = createRoot(document.getElementById('root'));
  const render = async props => act(async () => root.render(React.createElement(Flow, {...base, ...props})));
  const click = async selector => act(async () => { const node = document.querySelector(selector); assert.ok(node, selector); node.click(); });
  const panel = () => document.querySelector('[data-step-kind]');
  const currentCode = () => panel().querySelector('[data-idea-example] pre code')?.textContent;
  // Walk several real lessons, including the user's exact screenshot and a defined function.
  for (const [lessonId, section] of [['python-02', 6], ['python-02', 0], ['python-03', 5], ['python-input', 0], ['python-86', 2]]) {
    const text = lessons.find(l => l.id === lessonId).explanation[section];
    const context = pythonIdeaExamples(lessonId, section);
    const steps = buildLessonSteps(text, 'python', {authoredOnly: true});
    await render({text, ideaExamples: context, completion: React.createElement('button', {onClick: () => completed++}, 'Mark as read')});
    let thought = 0;
    for (let index = 0; index < steps.length; index++) {
      assert.equal(Number(document.querySelector('[data-lesson-step-flow]').dataset.stepIndex), index);
      if (steps[index].kind === 'explain') {
        assert.equal(currentCode(), context.examples[context.thoughtExamples[thought++]].code);
        assert.equal(panel().querySelector('[data-idea-example]').closest('details'), null, 'Example is visible without an expander');
        if (lessonId === 'python-02' && section === 6 && steps[index].text === 'This shows `True False False`.') {
          assert.match(currentCode(), /measurement = 11/);
          assert.match(currentCode(), /limit = 12/);
          assert.match(currentCode(), /print\(measurement < limit, measurement == limit, measurement > limit\)/);
          assert.match(panel().querySelector('[data-idea-example]').textContent, /True False False/);
          await click('[data-step-back]'); await click('[data-step-primary]');
          assert.equal(currentCode(), context.examples[context.thoughtExamples[thought - 1]].code);
        }
      } else assert.equal(panel().querySelector('[data-idea-example]'), null, 'Do not duplicate the standalone example');
      if (index < steps.length - 1) await click('[data-step-primary]');
    }
  }
  const measurement = lessons.find(l => l.id === 'python-02').explanation[6];
  const resumeKey = 'test-account:python-02:6';
  localStorage.setItem(resumeKey, JSON.stringify({flowVersion: 4, text: measurement, runtime: 'python', reviewedLesson: true, inlinePractice: true, index: 3}));
  await render({text: measurement, resumeKey, ideaExamples: pythonIdeaExamples('python-02', 6)});
  assert.equal(Number(document.querySelector('[data-lesson-step-flow]').dataset.stepIndex), 3, 'Existing saved step still resumes');
  assert.match(currentCode(), /measurement = 11/);
  for (const concept of Object.values(reviewedPythonFirstLesson)) {
    await render({text: concept.text, explanationExample: {...concept.example, output: concept.result, note: 'The output shows what these instructions display.'}});
    assert.equal(currentCode(), concept.example.code, concept.title);
    assert.ok(panel().querySelector('[data-idea-example]').textContent.includes(concept.result));
  }
  await render({text: 'An ordinary explanation.', runtime: 'javascript'});
  assert.equal(panel().querySelector('[data-idea-example]'), null);
  await render({text: 'An example with text.', explanationExample: {code: '<img src=x onerror="alert(1)">', language: 'text', output: '<script>alert(1)</script>', note: 'Literal characters.'}});
  assert.equal(panel().querySelectorAll('img,script,[onerror]').length, 0);
  assert.equal(networkCalls, 0);
  assert.equal(completed, 0, 'Viewing examples never completes reading');
  console.log(`PASS ${lessons.length} Python lessons, ${sections} sections, ${thoughts} thought mappings, ${exampleCount} examples; screenshot regression, changing examples, first lesson, input, Back/Next, saved position, escaping, offline reading, manual completion.`);
} finally {
  if (root) await act(async () => root.unmount());
  dom.window.close();
  for (const [name, value] of savedGlobals) {
    if (value) Object.defineProperty(globalThis, name, value); else delete globalThis[name];
  }
  await rm(temp, {recursive: true, force: true});
}
