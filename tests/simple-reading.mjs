import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, writeFile, rm, symlink, access } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import ts from 'typescript';
import postcss from 'postcss';
import React, { act } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { JSDOM } from 'jsdom';

// Real components and extracted app integration, not browser layout measurements.
// Native semantics and DOM focus are checked here; browser keyboard activation,
// screen-reader output, and measured mobile layout still need browser QA.
const cwd = fileURLToPath(new URL('..', import.meta.url));
const temp = await mkdtemp(path.join(tmpdir(), 'codequest-simple-reading-'));
const dom = new JSDOM('<div id="mount"></div>', { pretendToBeVisual: true, url: 'https://fixture.example/' });
const savedGlobals = new Map();
const install = (name, value) => {
  savedGlobals.set(name, Object.getOwnPropertyDescriptor(globalThis, name));
  Object.defineProperty(globalThis, name, { configurable: true, writable: true, value });
};
const passed = [], failures = [], externalCalls = [], progressWrites = [];
const check = async (name, run) => {
  process.stderr.write('RUN ' + name + '\n');
  try { await run(); passed.push(name); }
  catch (error) { failures.push({ name, error }); }
};
const forbidden = name => (...args) => {
  externalCalls.push({ name, args });
  throw new Error('Reading or navigating must not call ' + name);
};
const compiled = new Set();
async function compile(file) {
  if (compiled.has(file)) return;
  compiled.add(file);
  const dest = path.join(temp, file.replace(/\.tsx?$/, '.mjs'));
  await mkdir(path.dirname(dest), { recursive: true });
  if (file === 'lib/runner.ts') {
    await writeFile(dest, 'export const runProject = (...args) => globalThis.__simpleForbiddenRun(...args);');
    return;
  }
  if (file.endsWith('.css')) {
    // Node does not load stylesheets. CSS declarations are checked separately.
    await writeFile(dest + '.mjs', 'export default new Proxy({}, {get: (_, key) => String(key)});');
    return;
  }
  const result = ts.transpileModule(await readFile(path.join(cwd, file), 'utf8'), {
    compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext, jsx: ts.JsxEmit.ReactJSX },
    reportDiagnostics: true,
  });
  assert.equal(result.diagnostics?.filter(d => d.category === ts.DiagnosticCategory.Error).length, 0, file);
  const dependencies = [...result.outputText.matchAll(/from\s+(['"])(\.\.?\/[^'"]+)\1/g)].map(match => match[2]);
  for (const dependency of dependencies) {
    const stem = path.posix.normalize(path.posix.join(path.posix.dirname(file), dependency));
    let resolved;
    for (const candidate of dependency.endsWith('.css') ? [stem] : [stem + '.ts', stem + '.tsx']) {
      try { await access(path.join(cwd, candidate)); resolved = candidate; break; } catch {}
    }
    assert.ok(resolved, `${file}: dependency ${dependency}`);
    await compile(resolved);
  }
  await writeFile(dest, result.outputText.replace(/from\s+(['"])(\.\.?\/[^'"]+)\1/g, 'from "$2.mjs"'));
}
const importFile = file => import(pathToFileURL(path.join(temp, file.replace(/\.tsx?$/, '.mjs'))).href);
const lessons = JSON.parse(await readFile(path.join(cwd, 'content/lessons.json'), 'utf8'));
const catalog = JSON.parse(await readFile(path.join(cwd, 'content/catalog.json'), 'utf8'));
const source = await readFile(path.join(cwd, 'components/CodeQuest.tsx'), 'utf8');
const ast = ts.createSourceFile('CodeQuest.tsx', source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
const nodes = [];
const visit = node => { nodes.push(node); ts.forEachChild(node, visit); };
visit(ast);
const opening = node => ts.isJsxElement(node) ? node.openingElement : ts.isJsxSelfClosingElement(node) ? node : null;
const tag = node => opening(node)?.tagName.getText(ast);
const attr = (node, name) => opening(node)?.attributes.properties.find(p => ts.isJsxAttribute(p) && p.name.getText(ast) === name);
const hasClass = (node, name) => attr(node, 'className')?.initializer?.getText(ast).includes(name);
const app = ast.statements.find(node => ts.isFunctionDeclaration(node) && node.name?.text === 'CodeQuest');
const original = nodes.find(node => tag(node) === 'details' && hasClass(node, 'original-lesson'));
let root;
try {
  await symlink(path.join(cwd, 'node_modules'), path.join(temp, 'node_modules'), process.platform === 'win32' ? 'junction' : 'dir');
  for (const file of ['components/LessonContents.tsx', 'components/LessonContent.tsx', 'components/PythonConceptLab.tsx', 'components/ReadingMark.tsx', 'components/LessonVisual.tsx', 'components/LessonStepFlow.tsx', 'lib/lesson-completion.ts', 'lib/lesson-step-flow.ts']) await compile(file);
  install('window', dom.window);
  install('document', dom.window.document);
  install('navigator', dom.window.navigator);
  install('IS_REACT_ACT_ENVIRONMENT', true);
  install('requestAnimationFrame', dom.window.requestAnimationFrame.bind(dom.window));
  install('fetch', forbidden('fetch'));
  install('__simpleForbiddenRun', forbidden('runProject'));
  for (const method of ['setItem', 'removeItem', 'clear']) dom.window.Storage.prototype[method] = forbidden('Storage.' + method);
  const { createRoot } = await import('react-dom/client');
  root = createRoot(document.getElementById('mount'));
  const { default: Contents } = await importFile('components/LessonContents.tsx');
  const { default: Content } = await importFile('components/LessonContent.tsx');
  const { default: Lab } = await importFile('components/PythonConceptLab.tsx');
  const { default: Mark } = await importFile('components/ReadingMark.tsx');
  const { default: Visual } = await importFile('components/LessonVisual.tsx');
  const { getLessonHeadings } = await importFile('lib/lesson-headings.ts');
  const { lessonBlocks } = await importFile('lib/lesson-markup.ts');
  const { lessonIdeas } = await importFile('lib/lesson-ideas.ts');
  const { buildLessonSteps } = await importFile('lib/lesson-step-flow.ts');
  const { pythonConcepts } = await importFile('lib/python-concepts.ts');
  const { getReadingSectionKeys, pythonBasicsReadingKeys } = await importFile('lib/lesson-completion.ts');
  const { readingRecordKey } = await importFile('lib/reading-client.ts');
  const reading = {
    scope: 'a'.repeat(64), records: [], loaded: true, loading: false, online: true,
    error: '', pending: {}, errors: {}, needsRefresh: {},
    refresh: forbidden('reading.refresh'),
    setChecked: async (...args) => { progressWrites.push(args); return true; },
  };
  const render = async node => { await act(async () => root.render(node)); };
  const click = async node => {
    assert.ok(node, 'The requested native control exists');
    await act(async () => { node.focus(); node.click(); await new Promise(resolve => setTimeout(resolve, 25)); });
  };
  const visible = node => {
    if (node.closest('[hidden]')) return false;
    for (let ancestor = node.parentElement; ancestor; ancestor = ancestor.parentElement) {
      if (ancestor.tagName === 'DETAILS' && !ancestor.open && !ancestor.querySelector(':scope > summary')?.contains(node)) return false;
    }
    return true;
  };
  const flow = () => document.querySelector('[data-lesson-step-flow]');
  const stepPanel = () => document.querySelector('[data-step-kind]');
  const primary = () => document.querySelector('[data-step-primary]');
  const back = () => document.querySelector('[data-step-back]');
  const visibleMarks = () => [...document.querySelectorAll('.reading-mark')].filter(visible);
  const walkToLastStep = async ({ expectedKey, markExpected = true, contextCheck = () => {} }) => {
    const total = Number(flow().dataset.stepTotal);
    assert.ok(total >= 1);
    for (let index = 0; index < total; index++) {
      assert.equal(Number(flow().dataset.stepIndex), index);
      assert.equal(document.querySelectorAll('[data-step-kind]').length, 1, 'One current microstep panel, not stacked steps');
      assert.equal(document.querySelector('[data-lesson-reference]'), null, 'Removed explanation disclosure stays absent');
      assert.equal(primary().type, 'button');
      assert.equal(back().type, 'button');
      assert.equal(primary().tabIndex, 0);
      assert.equal(back().tabIndex, 0);
      const kind = stepPanel().dataset.stepKind;
      if (kind === 'explain') {
        assert.equal([...document.querySelectorAll('[data-code-anatomy]')].filter(visible).length, 0, 'Future visual steps are not shown under explanation');
        assert.equal(document.querySelectorAll('[data-step-kind] fieldset').length, 0);
      }
      if (kind === 'example') assert.equal(stepPanel().querySelectorAll('[data-code-anatomy]').length, 1);
      const eligible = index === total - 1 && kind !== 'practice' && markExpected;
      assert.equal(visibleMarks().length, Number(eligible), 'Read control appears only after the final microstep');
      if (kind === 'practice') {
        assert.equal(primary().disabled, true, 'Checking requires an explicit selection');
        const options = [...stepPanel().querySelectorAll('input[type="radio"]')];
        assert.ok(options.length >= 3);
        await click(options[0]);
        assert.equal(primary().disabled, false);
        await click(primary());
        assert.equal(Number(flow().dataset.stepIndex), index, 'Check reveals feedback without moving to another step');
        assert.match(stepPanel().querySelector('[role="status"]').textContent, /That's right|Here's the answer/);
        assert.equal(visibleMarks().length, Number(index === total - 1 && markExpected));
      }
      if (index === total - 1 && markExpected) assert.equal(visibleMarks()[0].dataset.sectionKey, expectedKey);
      contextCheck();
      assert.deepEqual(progressWrites, [], 'Microsteps and practice feedback never save official progress');
      if (index < total - 1) {
        const oldPanel = stepPanel();
        await click(primary());
        assert.notEqual(stepPanel(), oldPanel, 'The panel is replaced, not appended');
        assert.equal(document.activeElement, stepPanel(), 'DOM focus moves to the new microstep');
      }
    }
  };

  await check('Every catalog lesson and authored section remains available', () => {
    assert.equal(lessons.length, catalog.units.length);
    assert.equal(new Set(lessons.map(lesson => lesson.id)).size, lessons.length);
    assert.ok(lessons.length >= 116, 'Original curriculum is retained alongside additions');
    assert.ok(new Set(catalog.units.map(unit => unit.track)).size >= 10);
    assert.ok(lessons.filter(lesson => lesson.runtime === 'python').length >= 26);
    assert.ok(lessons.every(lesson => lesson.explanation.length > 0));
    assert.deepEqual(new Set(lessons.map(lesson => lesson.id)), new Set(catalog.units.map(unit => unit.id)));
    for (const lesson of lessons) assert.equal(getLessonHeadings(lesson.id).length, lesson.explanation.length, lesson.id);
  });

  await check('Sentence bullets retain prose wording, inline code, punctuation, and exact fenced code for every section', () => {
    const sample = 'Use `file.read()` once. Keep 3.14 unchanged. Dr. Pepper is a name. What next? Read the result!';
    for (const text of ['Use `name`.', 'Use `name`’s value.', 'Use **not**, then continue.']) {
      assert.equal(buildLessonSteps(text, 'python').filter(step => step.kind === 'explain').map(step => step.text).join(' '), text, 'Inline code and bold retain punctuation adjacency');
    }
    assert.equal(lessonIdeas(sample).join(' '), sample);
    assert.ok(lessonIdeas(sample).every(idea => (idea.match(/`/g)?.length ?? 0) % 2 === 0));
    for (const lesson of lessons) {
    const doc = new JSDOM('').window.document;
    for (const text of lesson.explanation) {
      doc.body.innerHTML = renderToStaticMarkup(React.createElement(Content, { text, runtime: lesson.runtime }));
      const originalWords = [...doc.querySelectorAll('.lesson-content p')].map(node => node.textContent).join(' ').replace(/\s+/g, ' ').trim();
      const originalCode = [...doc.querySelectorAll('.code-example pre code')].map(node => node.textContent);
      const normalize = text => text.replace(/\s+/g, ' ').trim();
      const proseSource = lessonBlocks(text, lesson.runtime).filter(block => block.kind === 'prose').map(block => block.text).join(' ');
      const stepSource = buildLessonSteps(text, lesson.runtime).filter(step => step.kind === 'explain' && step.purpose !== 'exercise-preparation').map(step => step.text).join(' ');
      assert.equal(normalize(stepSource), normalize(proseSource), lesson.id + ': microsteps retain the original prose, markup, and punctuation adjacency');
      doc.body.innerHTML = renderToStaticMarkup(React.createElement(Content, { text, runtime: lesson.runtime, bulletPoints: true }));
      const bulletWords = [...doc.querySelectorAll('.reading-ideas > p, .idea-bullets > li')].map(node => node.textContent).join(' ').replace(/\s+/g, ' ').trim();
      assert.equal(bulletWords, originalWords, lesson.id + ': all prose words and punctuation preserved in order');
      assert.deepEqual([...doc.querySelectorAll('.code-example pre code')].map(node => node.textContent), originalCode, lesson.id + ': original code bytes preserved');
      assert.deepEqual(originalCode, lessonBlocks(text, lesson.runtime).filter(block => block.kind === 'code').map(block => block.code));
      assert.equal(doc.querySelectorAll('script, iframe, img, [onclick], [onerror]').length, 0);
    }
    doc.defaultView.close();
    global.gc?.();
    }
  });

  await check('Simple code examples show one breakdown while exact source and copy remain behind a closed disclosure', async () => {
    const source = 'pet_name = "Pepper"\nprint(pet_name)\n';
    await render(React.createElement(Content, { text: 'Read one example.\n\n```python\n' + source + '```', runtime: 'python', bulletPoints: true }));
    assert.equal(document.querySelectorAll('[data-code-anatomy]').length, 1);
    const details = document.querySelector('details.example-source');
    assert.equal(details.open, false);
    assert.equal(details.querySelector('summary').textContent, 'Full code & copy');
    assert.equal(details.querySelector('pre code').textContent, source);
    assert.equal(details.querySelector('button').type, 'button');
    assert.equal(details.querySelector('button').getAttribute('aria-label'), 'Copy example code');
    await click(details.querySelector('summary'));
    assert.equal(details.open, true);
    assert.equal(details.querySelector('pre code').textContent, source);
    await render(React.createElement(Content, { text: '```python\nprint("Next")\n```', runtime: 'python', bulletPoints: true }));
    assert.equal(document.querySelector('details.example-source').open, false, 'Changing the example resets its disclosure');
    assert.equal(document.querySelector('pre code').textContent, 'print("Next")\n');
    await render(React.createElement(Content, { text: 'Try `print("one")` or `print("two")`.', runtime: 'python', bulletPoints: true }));
    const picker = document.querySelector('select[aria-label="Choose an example to break down"]');
    assert.ok(picker, 'Inline alternatives use a labeled native select');
    assert.equal(picker.options.length, 2);
    assert.equal(document.querySelectorAll('[data-code-anatomy]').length, 1, 'Only the selected inline example is expanded');
    await act(async () => { picker.value = '1'; picker.dispatchEvent(new dom.window.Event('change', { bubbles: true })); });
    assert.equal(picker.value, '1');
    assert.equal(document.querySelectorAll('[data-code-anatomy]').length, 1);
    assert.ok(document.querySelector('[data-code-anatomy]').textContent.includes('two'));
    assert.deepEqual(progressWrites, []);
    assert.deepEqual(externalCalls, []);
  });

  await check('Simple written reading mounts one current idea; unit TOC replaces the retired All ideas disclosure', async () => {
    const lesson = lessons.find(item => item.id === 'python-02');
    const selections = [];
    let index = 0;
    const view = () => React.createElement(Contents, { lessonId: lesson.id, index, simple: true,
      onSelect: next => { selections.push(next); index = next; root.render(view()); },
    }, React.createElement(Content, { text: lesson.explanation[index], runtime: lesson.runtime, bulletPoints: true }));
    await render(view());
    assert.equal(document.querySelectorAll('.simple-reader').length, 1);
    assert.equal(document.querySelectorAll('.contents-section').length, 0, 'No repeated accordion windows');
    assert.equal(document.querySelectorAll('.simple-reader [role="region"]').length, 1);
    const region = document.querySelector('.simple-reader [role="region"]');
    assert.equal(document.getElementById(region.getAttribute('aria-labelledby')).textContent, getLessonHeadings(lesson.id)[0]);
    assert.equal(region.dataset.annotationSection, 'text:0');
    assert.equal(document.querySelector('.reader-index'), null, 'Retired All ideas menu is absent');
    assert.ok(nodes.some(node => tag(node) === 'UnitTableOfContents'), 'The app owns one unit-level contents drawer');
    // Emulate its controlled index prop; the real drawer click is covered in unit-toc.mjs.
    index = lesson.explanation.length - 1;
    await render(view());
    assert.deepEqual(selections, [], 'Changing a controlled index does not auto-select or save');
    assert.equal(document.querySelectorAll('.simple-reader [role="region"]').length, 1);
    assert.equal(document.querySelector('.simple-reader [role="region"]').dataset.annotationSection, 'text:' + (lesson.explanation.length - 1));
    assert.equal(document.querySelector('.simple-reader h3').textContent, getLessonHeadings(lesson.id).at(-1));
    assert.deepEqual(progressWrites, []);
  });

  await check('Python replaces explanation, visual, and practice microsteps with native Back/Next boundaries and no automatic saves', async () => {
    const changes = [], contexts = [];
    let continues = 0;
    await render(React.createElement(Lab, {
      key: 'simple-python', lesson: lessons.find(lesson => lesson.id === 'python-01'), simple: true,
      onConceptChange: id => changes.push(id), onContextChange: context => contexts.push(context),
      onContinue: () => continues++, renderReadingMark: (id, title) => React.createElement(Mark, { reading, lessonId: 'python-01', sectionKey: 'concept:' + id, sectionTitle: title }),
    }));
    assert.equal(document.querySelectorAll('.simple-concept-reader').length, 1);
    assert.equal(document.querySelectorAll('.python-concept-room').length, 0);
    assert.equal(back().disabled, true);
    await click(back());
    assert.deepEqual(changes, []);
    const initialText = stepPanel().textContent;
    await click(primary());
    assert.equal(Number(flow().dataset.stepIndex), 1);
    await click(back());
    assert.equal(Number(flow().dataset.stepIndex), 0);
    assert.equal(stepPanel().textContent, initialText, 'Back restores the prior microstep');
    assert.deepEqual(changes, [], 'Microsteps do not change the parent concept');
    for (let index = 0; index < pythonConcepts.length; index++) {
      const concept = pythonConcepts[index];
      assert.equal(document.querySelector('.simple-concept-reader h3').textContent, concept.title);
      assert.equal(document.querySelectorAll('.simple-concept-reader > [data-annotation-section]').length, 1);
      assert.equal(document.querySelector('.simple-concept-reader > [data-annotation-section]').dataset.annotationSection, 'concept:' + concept.id);
      assert.equal(document.querySelector('.reader-index'), null, 'Retired per-reader index stays absent');
      for (const details of document.querySelectorAll('details.simple-more')) assert.equal(details.open, false);
      assert.equal(back().disabled, index === 0);
      assert.ok(contexts.at(-1).explanation.includes(concept.short));
      await walkToLastStep({ expectedKey: 'concept:' + concept.id });
      await click(primary());
    }
    assert.deepEqual(changes, pythonConcepts.slice(1).map(concept => concept.id));
    assert.equal(continues, 1);
    assert.equal(document.querySelector('.simple-concept-reader h3').textContent, pythonConcepts.at(-1).title);
    while (Number(flow().dataset.stepIndex) > 0) await click(back());
    await click(back());
    assert.equal(document.querySelector('.simple-concept-reader h3').textContent, pythonConcepts.at(-2).title);
    assert.equal(Number(flow().dataset.stepIndex), Number(flow().dataset.stepTotal) - 1, 'Back across a concept boundary opens the previous final microstep');
    for (let guard = 0; document.querySelector('.simple-concept-reader h3').textContent !== pythonConcepts[0].title && guard < 200; guard++) await click(back());
    while (Number(flow().dataset.stepIndex) > 0) await click(back());
    assert.equal(document.querySelector('.simple-concept-reader h3').textContent, pythonConcepts[0].title);
    assert.equal(document.querySelector('.reader-index'), null, 'Retired per-reader index stays absent');
    assert.equal(back().disabled, true);
    assert.deepEqual(progressWrites, []);
    assert.deepEqual(externalCalls, []);
  });

  await check('The actual written Back/Next controls preserve page bounds, note contexts, and explicit reading saves', async () => {
    assert.ok(original, 'Actual written-lesson integration is present');
    const noteSource = ast.statements.find(node => ts.isFunctionDeclaration(node) && node.name?.text === 'noteSource');
    const currentSource = app.body.statements.find(node => ts.isVariableStatement(node) && node.declarationList.declarations.some(declaration => declaration.name.getText(ast) === 'currentNoteSource'));
    const fixture = `
      import React, {useState, useRef, useEffect} from 'react';
      import LessonContents from './components/LessonContents.mjs';
      import LessonContent from './components/LessonContent.mjs';
      import LessonStepFlow from './components/LessonStepFlow.mjs';
      import LessonVisual from './components/LessonVisual.mjs';
      import ReadingMark from './components/ReadingMark.mjs';
      import {getLessonHeadings} from './lib/lesson-headings.mjs';
      import {pythonConcepts} from './lib/python-concepts.mjs';
      const ArrowRight = () => null;
      // The code inspector has its own real-component suite; this fixture owns navigation.
      const CodeAnatomy = () => null;
      ${noteSource.getText(ast)}
      export default function WrittenFixture({lesson, reading}) {
        const state = { draftScope: undefined };
        const [paragraph, setParagraph] = useState(0), [phase, setPhase] = useState('learn');
        const [noteSection, setNoteSection] = useState(null);
        const [flowBackTarget, setFlowBackTarget] = useState(null);
        useEffect(() => setFlowBackTarget(null), [lesson.id, paragraph]);
        const conceptStart = useRef(null), theoryFocusRequested = useRef(false);
        ${currentSource.getText(ast)}
        return <>${original.getText(ast)}<output data-note-context>{JSON.stringify(currentNoteSource)}</output><output data-page>{paragraph}</output><output data-phase>{phase}</output></>;
      }
    `;
    await writeFile(path.join(temp, 'written-fixture.mjs'), ts.transpileModule(fixture, {
      compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext, jsx: ts.JsxEmit.ReactJSX },
    }).outputText);
    const { default: Written } = await importFile('written-fixture.mjs');
    const lesson = lessons.find(item => item.id === 'python-02');
    await render(React.createElement(Written, { lesson, reading }));
    assert.equal(document.querySelector('.original-lesson').open, true, 'The primary written window is open');
    assert.equal(back().disabled, true);
    await click(back());
    assert.equal(document.querySelector('[data-page]').textContent, '0');
    for (let index = 0; index < lesson.explanation.length; index++) {
      const contextCheck = () => {
        const context = JSON.parse(document.querySelector('[data-note-context]').textContent);
        assert.equal(context.sectionKey, 'text:' + index);
        assert.equal(context.sectionText, lesson.explanation[index], 'Every microstep keeps the original full-paragraph note fingerprint source');
        assert.equal(document.querySelectorAll('.simple-reader').length, 1);
      };
      await walkToLastStep({ expectedKey: 'text:' + index, contextCheck });
      await click(primary());
    }
    assert.equal(document.querySelector('[data-phase]').textContent, 'practice');
    assert.equal(document.querySelector('[data-page]').textContent, String(lesson.explanation.length - 1));
    assert.deepEqual(progressWrites, []);
    while (Number(flow().dataset.stepIndex) > 0) await click(back());
    await click(back());
    assert.equal(document.querySelector('[data-page]').textContent, String(lesson.explanation.length - 2));
    assert.equal(Number(flow().dataset.stepIndex), Number(flow().dataset.stepTotal) - 1, 'Written Back crosses into the previous final microstep');
    for (let guard = 0; Number(document.querySelector('[data-page]').textContent) > 0 && guard < 300; guard++) await click(back());
    while (Number(flow().dataset.stepIndex) > 0) await click(back());
    assert.equal(JSON.parse(document.querySelector('[data-note-context]').textContent).sectionKey, 'text:0');
    assert.deepEqual(progressWrites, []);
    assert.equal(visibleMarks().length, 0);
    await walkToLastStep({ expectedKey: 'text:0' });
    await click(visibleMarks()[0].querySelector('button'));
    assert.deepEqual(progressWrites, [[lesson.id, 'text:0', true]], 'Only the explicit mark-as-read click writes an unchanged section key');
    progressWrites.length = 0;
  });

  await check('Account reading keys stay unchanged and Python supplementary text does not add completion points', () => {
    assert.deepEqual([...pythonBasicsReadingKeys], ['concept:program', 'concept:values', 'concept:strings', 'concept:names', 'concept:assignment', 'concept:output']);
    for (const lesson of lessons) {
      const expected = lesson.id === 'python-01' ? [...pythonBasicsReadingKeys] : lesson.explanation.map((_, index) => 'text:' + index);
      assert.deepEqual(getReadingSectionKeys(lesson), expected, lesson.id);
      for (const key of expected) assert.equal(readingRecordKey(lesson.id, key), JSON.stringify([lesson.id, key]));
    }
    const readingSource = nodes.filter(node => tag(node) === 'ReadingMark');
    assert.ok(readingSource.some(node => attr(node, 'sectionKey')?.initializer?.expression?.getText(ast).includes('"concept:" + id')));
    assert.ok(readingSource.some(node => attr(node, 'sectionKey')?.initializer?.expression?.getText(ast).includes('"text:" + paragraph')));
  });

  await check('Visuals and optional explanation start collapsed, while the app uses simple mode and keeps note utilities', async () => {
    for (const lesson of lessons) for (let paragraph = 0; paragraph < lesson.explanation.length; paragraph++) {
      const markup = renderToStaticMarkup(React.createElement(Visual, { unitId: lesson.id, paragraph }));
      if (markup) {
        const doc = new JSDOM(markup).window.document;
        for (const details of doc.querySelectorAll('details.lesson-visual')) assert.equal(details.open, false, lesson.id + ':' + paragraph);
        doc.defaultView.close();
      }
    }
    for (const name of ['LessonContents', 'PythonConceptLab']) {
      const instance = nodes.find(node => tag(node) === name);
      assert.ok(attr(instance, 'simple'), name + ': app explicitly selects simple mode');
    }
    const stepper = nodes.find(node => tag(node) === 'LessonStepFlow' && node.pos > original.pos && node.end < original.end);
    assert.ok(stepper, 'The app routes written reading through replacing microsteps');
    assert.ok(attr(stepper, 'completion'), 'Manual reading completion is supplied to the last microstep');
    for (const name of ['analogy', 'project-preview']) {
      assert.ok(!nodes.some(node => tag(node) === 'details' && hasClass(node, name)), name + ': redundant panel remains removed');
    }
    assert.ok(!nodes.some(node => tag(node) === 'LessonNotes'), 'Requested My notes UI removal remains in effect');
    assert.ok((await readFile(path.join(cwd, 'components/LessonNotes.tsx'), 'utf8')).includes('export default'), 'Notes component/data implementation is retained, not deleted');
    assert.ok(!nodes.some(node => tag(node) === 'AskChatGPT'), 'Requested ChatGPT handoff removal remains in effect');
  });

  await check('Authored simple-mode CSS centers one column, permits shrinking, and keeps the reader readable on narrow screens', async () => {
    const css = postcss.parse(await readFile(path.join(cwd, 'app/globals.css'), 'utf8'));
    const rules = [];
    css.walkRules(rule => rules.push(rule));
    const matching = selector => rules.filter(rule => rule.selectors.includes(selector));
    const decls = selector => Object.assign({}, ...matching(selector).map(rule => Object.fromEntries(rule.nodes.filter(node => node.type === 'decl').map(node => [node.prop, node.value]))));
    for (const selector of ['.simple-reader', '.simple-concept-reader']) assert.equal(decls(selector)['min-width'], '0');
    assert.equal(decls('.simple-learning .shell').display, 'block', 'Navigation does not reserve a side column');
    assert.equal(decls('.workspace.buddy-hidden')['grid-template-columns'], 'minmax(0, 1fr)');
    assert.equal(decls('.simple-learning .workspace.buddy-hidden')['max-width'], '760px');
    assert.equal(decls('.simple-learning .reading-ideas p')['text-align'], 'left');
    assert.equal(decls('.simple-learning .idea-bullets')['max-width'], '66ch');
    assert.ok(matching('.simple-learning .lesson-card').some(rule => rule.parent.type === 'atrule' && /max-width/.test(rule.parent.params)));
    assert.equal(decls('.reader-index nav button').width, '100%');
    assert.equal(decls('.simple-learning .concept-controls')['flex-wrap'], 'wrap');
  });

  await check('Reading and navigation cause no network, runtime, storage, or unsolicited progress writes', () => {
    assert.deepEqual(externalCalls, []);
    assert.deepEqual(progressWrites, []);
    assert.equal(dom.window.localStorage.length, 0);
    assert.equal(dom.window.sessionStorage.length, 0);
  });
} finally {
  if (root) await act(async () => root.unmount());
  dom.window.close();
  for (const [name, descriptor] of savedGlobals) {
    if (descriptor) Object.defineProperty(globalThis, name, descriptor);
    else delete globalThis[name];
  }
  await rm(temp, { recursive: true, force: true });
}
for (const name of passed) console.log('PASS ' + name);
for (const { name, error } of failures) console.error('FAIL ' + name + '\n' + error.stack);
if (failures.length) process.exitCode = 1;
else console.log(`Passed ${passed.length} simple-reading component/integration checks. Browser keyboard and measured layout remain unverified by this DOM suite.`);
