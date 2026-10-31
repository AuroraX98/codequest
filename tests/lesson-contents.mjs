import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, writeFile, rm, symlink } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import ts from 'typescript';
import postcss from 'postcss';
import React, { act } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { JSDOM } from 'jsdom';

// Compile only to a disposable directory. Parallel test runs never write or import
// generated files beside production source and cannot race over a shared bundle.
const cwd = path.resolve(new URL('..', import.meta.url).pathname);
const temp = await mkdtemp(path.join(tmpdir(), 'codequest-lesson-contents-'));
const failures = [];
const passed = [];
const check = async (name, run) => {
  try { await run(); passed.push(name); }
  catch (error) { failures.push({ name, error }); }
};
const originalGlobals = new Map();
const installGlobal = (key, value) => {
  originalGlobals.set(key, Object.getOwnPropertyDescriptor(globalThis, key));
  Object.defineProperty(globalThis, key, { configurable: true, writable: true, value });
};
const dom = new JSDOM('<div id="mount"></div>', { pretendToBeVisual: true, url: 'https://fixture.example/#quest?lesson=fixture-a&step=learn&idea=1' });
const writes = [];
let root;
let headingCount = 0;
let visualCount = 0;
const forbidden = target => (...args) => {
  writes.push({ target, args });
  throw new Error('Display-only lesson components must not write data: ' + target);
};
const fixtureHeadings = {
  'fixture-a': ['Name the inputs', 'Trace the calculation', 'Read the result'],
  'fixture-b': ['Choose a color', 'Display the color'],
  'fixture-html': ['<img src="bad" onerror="alert(1)">'],
};
const malicious = '<script>alert("not executed")</script><img src="bad" onerror="alert(1)">';
const fixtureVisuals = Object.fromEntries(['sequence', 'compare', 'collection', 'branch', 'layers'].map(kind => [kind, {
  id: kind, kind, paragraph: 1, title: 'Follow a concrete ' + kind, intro: malicious,
  items: [
    { label: 'Input ' + malicious, value: '20 coins', detail: malicious },
    { label: 'Calculation', value: '20 - 7 = 13' },
    { label: 'Result', value: malicious, detail: '13 coins remain' },
  ], takeaway: 'Subtract once: 13 coins remain. ' + malicious, limit: malicious,
}]));
const compile = async (bundle, files) => {
  const dir = path.join(temp, bundle);
  await mkdir(dir, { recursive: true });
  if (files.includes('components/LessonContent.tsx')) files = [...new Set([...files, 'components/CodeAnatomy.tsx', 'components/LessonGlossary.tsx', 'lib/lesson-glossary.ts', 'lib/code-anatomy.ts'])];
  if (files.includes('lib/lesson-headings.ts')) files = [...new Set([...files, 'lib/additional-unit-contents.ts', 'lib/remaining-lesson-headings.ts'])];
  for (const file of files) {
    const source = await readFile(path.join(cwd, file), 'utf8');
    const js = ts.transpileModule(source, {
      compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext, jsx: ts.JsxEmit.ReactJSX },
      reportDiagnostics: true,
    });
    const errors = (js.diagnostics || []).filter(d => d.category === ts.DiagnosticCategory.Error);
    assert.equal(errors.length, 0, file + ': ' + errors.map(d => ts.flattenDiagnosticMessageText(d.messageText, '\n')).join('\n'));
    const output = path.join(dir, file.replace(/\.tsx?$/, '.mjs'));
    await mkdir(path.dirname(output), { recursive: true });
    await writeFile(output, js.outputText.replace(/from\s+(['"])(\.\.?\/[^'"]+)\1/g, 'from "$2.mjs"'));
  }
  if (files.includes('components/CodeAnatomy.tsx')) await writeFile(path.join(dir, 'components/CodeAnatomy.module.css.mjs'), 'export default new Proxy({}, {get: (_, key) => String(key)});');
  if (files.includes('components/CodeAnatomy.tsx')) await writeFile(path.join(dir, 'components/LessonGlossary.module.css.mjs'), 'export default new Proxy({}, {get: (_, key) => String(key)});');
  return dir;
};
const importFile = (dir, file) => import(pathToFileURL(path.join(dir, file)).href);
const readOnlyFiles = ['content/lessons.json', 'content/catalog.json', 'lib/navigation.ts', 'lib/learning-client.ts', 'lib/profile.ts'];
const readOnlySnapshots = await Promise.all(readOnlyFiles.map(file => readFile(path.join(cwd, file), 'utf8')));

try {
  await symlink(path.join(cwd, 'node_modules'), path.join(temp, 'node_modules'), process.platform === 'win32' ? 'junction' : 'dir');
  installGlobal('window', dom.window);
  installGlobal('document', dom.window.document);
  installGlobal('navigator', dom.window.navigator);
  installGlobal('IS_REACT_ACT_ENVIRONMENT', true);
  installGlobal('fetch', forbidden('fetch'));
  installGlobal('localStorage', dom.window.localStorage);
  installGlobal('sessionStorage', dom.window.sessionStorage);
  installGlobal('indexedDB', { open: forbidden('indexedDB.open'), deleteDatabase: forbidden('indexedDB.deleteDatabase') });
  dom.window.fetch = forbidden('window.fetch');
  for (const name of ['setItem', 'removeItem', 'clear']) dom.window.Storage.prototype[name] = forbidden('Storage.' + name);
  const { createRoot } = await import('react-dom/client');
  const fixtureDir = await compile('fixtures', ['components/LessonContents.tsx', 'components/LessonVisual.tsx', 'components/LessonDiagram.tsx']);
  await mkdir(path.join(fixtureDir, 'lib'));
  await writeFile(path.join(fixtureDir, 'lib/lesson-diagrams.mjs'), 'export function getLessonDiagram() { return undefined; }');
  await writeFile(path.join(fixtureDir, 'components/PythonLessonScene.mjs'), 'export function getPythonLessonScene() { return undefined; } export default function PythonLessonScene() { return null; }');
  await writeFile(path.join(fixtureDir, 'lib/lesson-headings.mjs'), `const headings = ${JSON.stringify(fixtureHeadings)}; export function getLessonHeadings(id) { return headings[id] || []; }`);
  await writeFile(path.join(fixtureDir, 'lib/lesson-visuals.mjs'), `const visuals = ${JSON.stringify(fixtureVisuals)}; export function getLessonVisual(id, paragraph) { const visual = visuals[id]; return visual && visual.paragraph === paragraph ? visual : undefined; }`);
  const { default: Contents } = await importFile(fixtureDir, 'components/LessonContents.mjs');
  const { default: Visual } = await importFile(fixtureDir, 'components/LessonVisual.mjs');
  root = createRoot(document.getElementById('mount'));
  let selected = { lessonId: 'fixture-a', index: 0 };
  const selections = [];
  const pageText = () => `Original explanation for ${selected.lessonId}, section ${selected.index}: <b>literal code remains text</b>.`;
  const view = () => React.createElement(Contents, {
    ...selected,
    onSelect: index => { selections.push(index); selected = { ...selected, index }; root.render(view()); },
  }, React.createElement('article', { 'data-current-explanation': '' }, pageText()));
  const render = async (lessonId, index) => {
    selected = { lessonId, index };
    await act(async () => root.render(view()));
  };
  const buttons = () => [...document.querySelectorAll('.contents-section h4 > button')];
  const regions = () => [...document.querySelectorAll('[role="region"]')];
  const expanded = () => regions().filter(region => !region.hidden);
  const click = async index => { await act(async () => buttons()[index].click()); };

  await check('Accordion starts with the current section open, titled, and source text intact', async () => {
    await render('fixture-a', 0);
    assert.equal(document.querySelector('section').getAttribute('aria-label'), 'Lesson table of contents');
    assert.equal(buttons().length, fixtureHeadings['fixture-a'].length);
    fixtureHeadings['fixture-a'].forEach((heading, i) => assert.ok(buttons()[i].textContent.includes(heading)));
    assert.equal(expanded().length, 1);
    assert.equal(expanded()[0], regions()[0]);
    assert.equal(expanded()[0].textContent, pageText());
    assert.equal(document.querySelectorAll('[data-current-explanation]').length, 1);
    assert.equal(document.querySelectorAll('article b').length, 0);
  });

  await check('Choosing a different heading calls onSelect once and changes displayed explanation', async () => {
    await click(1);
    assert.deepEqual(selections, [1]);
    assert.equal(selected.index, 1);
    assert.equal(expanded().length, 1);
    assert.equal(expanded()[0], regions()[1]);
    assert.equal(expanded()[0].textContent, pageText());
    assert.equal(regions()[0].textContent, '');
  });

  await check('The active heading collapses and reopens without changing the selected lesson page', async () => {
    await click(1);
    assert.equal(expanded().length, 0);
    assert.equal(regions()[1].textContent, pageText(), 'Collapse hides rather than strips the current explanation');
    assert.deepEqual(selections, [1, 1], 'Reselect the same page to refresh annotation context');
    assert.equal(selected.index, 1);
    await click(1);
    assert.equal(expanded()[0], regions()[1]);
    assert.deepEqual(selections, [1, 1, 1]);
    assert.equal(selected.index, 1);
  });

  await check('External Next and Back navigation opens the newly selected region, including a previously collapsed page', async () => {
    await render('fixture-a', 0);
    await click(0);
    assert.equal(expanded().length, 0);
    await render('fixture-a', 1);
    assert.equal(expanded().length, 1);
    assert.equal(expanded()[0], regions()[1]);
    await render('fixture-a', 0);
    assert.equal(expanded().length, 1, 'Returning with Back must not preserve a stale collapsed key');
    assert.equal(expanded()[0], regions()[0]);
  });

  await check('External lesson changes use the new headings and current explanation', async () => {
    await render('fixture-b', 1);
    assert.equal(buttons().length, 2);
    assert.ok(buttons()[1].textContent.includes('Display the color'));
    assert.equal(expanded().length, 1);
    assert.equal(expanded()[0], regions()[1]);
    assert.equal(expanded()[0].textContent, pageText());
  });

  await check('Switching lessons at the same page index clears stale collapse state', async () => {
    await render('fixture-a', 0);
    await click(0);
    assert.equal(expanded().length, 0);
    await render('fixture-b', 0);
    assert.equal(expanded().length, 1);
    await render('fixture-a', 0);
    assert.equal(expanded().length, 1, 'Returning to a lesson must open its newly selected current section');
    assert.equal(expanded()[0], regions()[0]);
  });

  await check('Accordion uses focusable native buttons with valid unique accessible region relationships', async () => {
    await render('fixture-a', 2);
    const ids = [...document.querySelectorAll('[id]')].map(node => node.id);
    assert.equal(new Set(ids).size, ids.length);
    for (const [index, button] of buttons().entries()) {
      assert.ok(button instanceof dom.window.HTMLButtonElement);
      assert.equal(button.type, 'button');
      assert.equal(button.tabIndex, 0);
      assert.equal(button.disabled, false);
      assert.equal(button.getAttribute('role'), null, 'Do not replace native button keyboard semantics');
      assert.equal(button.getAttribute('aria-expanded'), String(index === 2));
      const controlled = document.getElementById(button.getAttribute('aria-controls'));
      assert.equal(controlled, regions()[index]);
      assert.equal(controlled.getAttribute('aria-labelledby'), button.id);
      button.focus();
      assert.equal(document.activeElement, button);
    }
    // jsdom does not synthesize the browser's Enter/Space-to-click default action.
    // The native button contract is tested here; real key activation is browser QA.
  });

  await check('Two independent accordions have distinct IDs and markup strings stay escaped', () => {
    const html = renderToStaticMarkup(React.createElement(React.Fragment, null,
      React.createElement(Contents, { lessonId: 'fixture-html', index: 0, onSelect() {} }, malicious),
      React.createElement(Contents, { lessonId: 'fixture-html', index: 0, onSelect() {} }, malicious)));
    const doc = new JSDOM(html).window.document;
    const ids = [...doc.querySelectorAll('[id]')].map(node => node.id);
    assert.equal(new Set(ids).size, ids.length);
    assert.ok(doc.body.textContent.includes(malicious));
    assert.equal(doc.querySelectorAll('script,img,iframe,object,embed').length, 0);
  });

  await check('Optional visuals render only on their authored page, with concrete list items and safely escaped text', () => {
    for (const [kind, guide] of Object.entries(fixtureVisuals)) {
      assert.equal(renderToStaticMarkup(React.createElement(Visual, { unitId: kind, paragraph: 0 })), '');
      assert.equal(renderToStaticMarkup(React.createElement(Visual, { unitId: kind, paragraph: 2 })), '');
      const doc = new JSDOM(renderToStaticMarkup(React.createElement(Visual, { unitId: kind, paragraph: 1 }))).window.document;
      assert.equal(doc.querySelector('details').open, false, 'Extra visual explanation starts collapsed');
      assert.ok(doc.querySelector('summary').textContent.includes(guide.title));
      assert.equal(doc.querySelectorAll('[role="list"]').length, 1);
      assert.equal(doc.querySelectorAll('[role="listitem"]').length, guide.items.length);
      assert.deepEqual([...doc.querySelectorAll('.visual-item pre')].map(node => node.textContent), guide.items.map(item => item.value));
      assert.ok(doc.body.textContent.includes(guide.intro));
      assert.ok(doc.body.textContent.includes(guide.takeaway));
      assert.ok(doc.body.textContent.includes(guide.limit));
      assert.equal(doc.querySelectorAll('script,img,iframe,object,embed,form,input,button').length, 0);
      assert.equal(doc.querySelectorAll('[onerror],[onclick],[srcdoc]').length, 0);
      if (kind === 'sequence' || kind === 'layers') {
        assert.deepEqual([...doc.querySelectorAll('.visual-position')].map(node => node.textContent), guide.items.map((_, i) => `${kind === 'sequence' ? 'Step' : 'Layer'} ${i + 1}`));
      }
    }
    assert.equal(renderToStaticMarkup(React.createElement(Visual, { unitId: 'missing', paragraph: 1 })), '');
  });

  await check('Learners can hide/reopen visuals with the native summary and wrong-page navigation removes the guide', async () => {
    await act(async () => root.render(React.createElement(Visual, { unitId: 'sequence', paragraph: 1 })));
    const details = document.querySelector('details.lesson-visual');
    assert.equal(details.open, false);
    const summary = details.querySelector('summary');
    await act(async () => summary.click());
    assert.equal(details.open, true);
    await act(async () => summary.click());
    assert.equal(details.open, false);
    await act(async () => root.render(React.createElement(Visual, { unitId: 'sequence', paragraph: 0 })));
    assert.equal(document.querySelector('.lesson-visual'), null);
    await act(async () => root.render(React.createElement(Visual, { unitId: 'layers', paragraph: 1 })));
    assert.equal(document.querySelectorAll('.visual-item').length, 3);
    assert.equal(document.querySelector('details.lesson-visual').open, false);
  });

  await check('Mobile styles wrap visual source and avoid fixed-width lesson containers', async () => {
    const css = postcss.parse(await readFile(path.join(cwd, 'app/globals.css'), 'utf8'));
    const rules = [];
    css.walkRules(rule => rules.push(rule));
    const rule = selector => rules.find(rule => rule.selector === selector && rule.parent.type === 'root');
    const declarations = selector => Object.fromEntries(rule(selector).nodes.filter(n => n.type === 'decl').map(n => [n.prop, n.value]));
    for (const selector of ['.lesson-contents', '.contents-section', '.contents-reading', '.visual-item']) {
      assert.equal(declarations(selector)['min-width'], '0', selector + ' permits shrinking');
      assert.ok(!/\d+px/.test(declarations(selector).width || ''), selector + ' has no fixed pixel width');
    }
    assert.equal(declarations('.contents-section h4 > button').width, '100%');
    assert.equal(declarations('.visual-item pre')['white-space'], 'pre-wrap');
    assert.equal(declarations('.visual-item pre')['overflow-wrap'], 'anywhere');
    assert.match(declarations('.visual-items')['grid-template-columns'], /min\(100%,\s*170px\)/);
    assert.ok(rules.some(rule => rule.selector === '.visual-items' && rule.parent.type === 'atrule' && /max-width:\s*540px/.test(rule.parent.params) && rule.nodes.some(n => n.prop === 'grid-template-columns' && n.value === '1fr')));
    assert.equal(declarations('.contents-reading[hidden]').display, 'none');
  });

  await check('The app preserves main written reading and removes supplementary Python expansion', async () => {
    const file = 'components/CodeQuest.tsx';
    const source = await readFile(path.join(cwd, file), 'utf8');
    assert.ok(source.includes('!["python-01", "python-input"].includes(lesson.id) && <details'));
    assert.ok(source.includes('<UnitTableOfContents'), 'Unit-level TOC replaces per-reader All ideas UI');
    assert.doesNotMatch(source, /More explanation · written lesson|A familiar way to picture it|What you’ll build/);
    const ast = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
    const all = [];
    const visit = node => { all.push(node); ts.forEachChild(node, visit); };
    visit(ast);
    const opening = node => ts.isJsxElement(node) ? node.openingElement : ts.isJsxSelfClosingElement(node) ? node : null;
    const tag = node => opening(node)?.tagName.getText(ast);
    const attr = (node, name) => opening(node)?.attributes.properties.find(p => ts.isJsxAttribute(p) && p.name.getText(ast) === name);
    const original = all.filter(node => tag(node) === 'details' && attr(node, 'className')?.initializer?.getText(ast).includes('original-lesson'));
    assert.equal(original.length, 1, 'One original-lesson details container');
    const container = original[0];
    const children = container.children.filter(node => !(ts.isJsxText(node) && !node.text.trim()));
    assert.equal(tag(children[0]), 'summary', 'Native details has its summary first');
    assert.match(attr(container, 'open').initializer.expression.getText(ast).replace(/\s/g, ''), /^!\["python-01","python-input"\]\.includes\(lesson\.id\)\|\|paragraph>0$/);
    const descendants = all.filter(node => node.pos >= container.pos && node.end <= container.end);
    assert.equal(descendants.filter(node => tag(node) === 'LessonContents').length, 1);
    assert.equal(descendants.filter(node => tag(node) === 'LessonStepFlow').length, 1);
    assert.equal(descendants.filter(node => tag(node) === 'LessonContent').length, 0, 'Whole written sections are replaced by the microstep flow');
    assert.equal(descendants.filter(node => tag(node) === 'LessonVisual').length, 0, 'Removed supplemental visual is not resurrected; the one LessonStepFlow above remains the reading renderer');
    assert.equal(descendants.filter(node => tag(node) === 'PythonConceptLab').length, 0, 'Concept rooms are not repeated inside reading sections');
    assert.equal(all.filter(node => tag(node) === 'PythonConceptLab').length, 1);
    const contents = descendants.find(node => tag(node) === 'LessonContents');
    assert.equal(attr(contents, 'lessonId').initializer.expression.getText(ast), 'lesson.id');
    assert.equal(attr(contents, 'index').initializer.expression.getText(ast), 'paragraph');
    const select = attr(contents, 'onSelect').initializer.expression;
    const calls = [];
    const findCalls = node => { if (ts.isCallExpression(node)) calls.push(node); ts.forEachChild(node, findCalls); };
    findCalls(select);
    assert.deepEqual(new Set(calls.map(node => node.expression.getText(ast))), new Set(['setParagraph', 'setNoteSection']), 'A TOC click changes position and annotation context only, not progress or completion');
    const reading = descendants.find(node => tag(node) === 'LessonStepFlow');
    assert.equal(attr(reading, 'text').initializer.expression.getText(ast).replace(/\s/g, '').replace(/,\)/g, ')'), 'lesson.explanation[Math.min(paragraph,lesson.explanation.length-1)]');
    assert.equal(attr(reading, 'runtime').initializer.expression.getText(ast), 'lesson.runtime');
    assert.equal(attr(reading, 'backDisabled').initializer.expression.getText(ast).replace(/\s/g, ''), 'paragraph===0');
    const backText = attr(reading, 'onBack').initializer.expression.getText(ast).replace(/\s/g, '');
    const nextText = attr(reading, 'onNext').initializer.expression.getText(ast).replace(/\s/g, '');
    assert.ok(backText.includes('setParagraph((p)=>Math.max(0,p-1))'), 'Parent Back is bounded at the first written section');
    assert.ok(nextText.includes('setParagraph((p)=>p+1)'));
    assert.ok(nextText.includes('elsesetPhase("practice")'));
    assert.doesNotMatch(backText + nextText, /setChecked|fetch|setProgress|saveProgress/, 'Section navigation cannot save completion');
    assert.ok(attr(reading, 'completion'), 'Manual read checkbox is delegated to the final microstep');
  });

  await check('Display components have no progress, storage, route, network, or executable markup side effects', async () => {
    for (const file of ['components/LessonContents.tsx', 'components/LessonVisual.tsx']) {
      const source = await readFile(path.join(cwd, file), 'utf8');
      assert.doesNotMatch(source, /\b(?:fetch|XMLHttpRequest|WebSocket|eval|Function|localStorage|sessionStorage|indexedDB|runProject|setProgress|saveProgress|pushState|replaceState)\s*[.(]/, file);
      assert.doesNotMatch(source, /dangerouslySetInnerHTML|\bsrcDoc\s*=|<script\b|<iframe\b/, file);
      const parsed = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
      const imports = parsed.statements.filter(ts.isImportDeclaration).map(node => node.moduleSpecifier.text);
      assert.ok(imports.every(name => ['react', 'lucide-react', '../lib/lesson-headings', '../lib/lesson-visuals', './LessonDiagram', './PythonLessonScene'].includes(name)), file + ' imports only presentation dependencies');
    }
    assert.deepEqual(writes, []);
    assert.equal(dom.window.location.hash, '#quest?lesson=fixture-a&step=learn&idea=1');
    assert.equal(dom.window.localStorage.length, 0);
    assert.equal(dom.window.sessionStorage.length, 0);
    for (const [index, file] of readOnlyFiles.entries()) assert.equal(await readFile(path.join(cwd, file), 'utf8'), readOnlySnapshots[index], file + ' was not modified');
  });

  if (!process.argv.includes('--fixtures-only')) {
    await check('Every authored visual guide is valid, page-specific, concrete, and display-only', async () => {
      const dir = await compile('real-visuals', ['components/LessonVisual.tsx', 'lib/lesson-visuals.ts', 'components/LessonDiagram.tsx', 'lib/lesson-diagrams.ts', 'lib/diagram-drawing.ts', 'lib/diagram-web-platform.ts', 'lib/diagram-sql-swift-typescript.ts', 'lib/diagram-javascript-python.ts', 'components/PythonLessonScene.tsx', 'components/PythonControlScenes.tsx', 'components/PythonCollectionScenes.tsx', 'lib/python-control-scenes.ts', 'lib/python-collection-scenes.ts', 'components/PythonGeneratorScene.tsx', 'lib/python-generator-scene.ts', 'components/PythonCsvScene.tsx', 'lib/python-csv-scene.ts']);
      const { default: RealVisual } = await importFile(dir, 'components/LessonVisual.mjs');
      const { getPythonLessonScene } = await importFile(dir, 'components/PythonLessonScene.mjs');
      const { lessonVisuals, getLessonVisual } = await importFile(dir, 'lib/lesson-visuals.mjs');
      const lessons = JSON.parse(readOnlySnapshots[0]);
      const rendered = new JSDOM('');
      const doc = rendered.window.document;
      assert.ok(Object.keys(lessonVisuals).every(id => lessons.some(lesson => lesson.id === id)), 'Finite visual coverage refers only to existing lessons');
      for (const lesson of lessons) {
        const guide = lessonVisuals[lesson.id];
        if (!guide) continue;
        assert.equal(guide.id, lesson.id);
        assert.ok(Number.isInteger(guide.paragraph) && guide.paragraph >= 0 && guide.paragraph < lesson.explanation.length, lesson.id + ': valid authored page');
        assert.ok(['sequence', 'compare', 'collection', 'branch', 'layers'].includes(guide.kind));
        assert.ok(guide.title.trim() && guide.intro.trim() && guide.takeaway.trim());
        assert.ok(guide.items.length >= 2 && guide.items.every(item => item.label.trim() && item.value.trim()), lesson.id + ': labeled concrete items');
        const before = JSON.stringify(guide);
        for (let index = 0; index < lesson.explanation.length; index++) {
          assert.equal(getLessonVisual(lesson.id, index), index === guide.paragraph ? guide : undefined);
          if (index !== guide.paragraph && !getPythonLessonScene(lesson.id, index)) assert.equal(renderToStaticMarkup(React.createElement(RealVisual, { unitId: lesson.id, paragraph: index })), '');
        }
        doc.body.innerHTML = renderToStaticMarkup(React.createElement(RealVisual, { unitId: lesson.id, paragraph: guide.paragraph }));
        assert.equal(doc.querySelectorAll('details.lesson-visual').length, 1);
        assert.equal(doc.querySelectorAll('[role="listitem"]').length, guide.items.length);
        assert.deepEqual([...doc.querySelectorAll('.visual-item pre')].map(node => node.textContent), guide.items.map(item => item.value));
        assert.equal(doc.querySelectorAll('script,img,iframe,object,embed,form,[onerror],[onclick],[srcdoc]').length, 0);
        const interactiveScene = Boolean(getPythonLessonScene(lesson.id, guide.paragraph));
        assert.equal(doc.querySelectorAll('button').length > 0, interactiveScene, lesson.id + ': only authored what-if scenes have actions');
        assert.ok(doc.body.textContent.includes(guide.takeaway));
        assert.equal(JSON.stringify(guide), before);
      }
      rendered.window.close();
      for (const id of ['missing', '__proto__', 'constructor', 'toString']) assert.equal(getLessonVisual(id, 0), undefined);
      assert.deepEqual(writes, []);
    });
    await check('Authored headings cover every current section; finite visuals render only where authored', async () => {
      const realDir = await compile('real', ['components/LessonContents.tsx', 'components/LessonVisual.tsx', 'components/LessonContent.tsx', 'lib/lesson-headings.ts', 'lib/lesson-visuals.ts', 'lib/lesson-markup.ts', 'lib/lesson-ideas.ts', 'lib/code-language.ts', 'lib/navigation.ts', 'components/LessonDiagram.tsx', 'lib/lesson-diagrams.ts', 'lib/diagram-drawing.ts', 'lib/diagram-web-platform.ts', 'lib/diagram-sql-swift-typescript.ts', 'lib/diagram-javascript-python.ts', 'components/PythonLessonScene.tsx', 'components/PythonControlScenes.tsx', 'components/PythonCollectionScenes.tsx', 'lib/python-control-scenes.ts', 'lib/python-collection-scenes.ts', 'components/PythonGeneratorScene.tsx', 'lib/python-generator-scene.ts', 'components/PythonCsvScene.tsx', 'lib/python-csv-scene.ts']);
      const { default: RealContents } = await importFile(realDir, 'components/LessonContents.mjs');
      const { default: RealVisual } = await importFile(realDir, 'components/LessonVisual.mjs');
      const { getPythonLessonScene } = await importFile(realDir, 'components/PythonLessonScene.mjs');
      const { default: LessonContent } = await importFile(realDir, 'components/LessonContent.mjs');
      const { getLessonHeadings, lessonHeadings } = await importFile(realDir, 'lib/lesson-headings.mjs');
      const { lessonVisuals, getLessonVisual } = await importFile(realDir, 'lib/lesson-visuals.mjs');
      const { routeHash, parseRoute } = await importFile(realDir, 'lib/navigation.mjs');
      const lessons = JSON.parse(readOnlySnapshots[0]);
      const catalog = JSON.parse(readOnlySnapshots[1]);
      const renderedDom = new JSDOM('');
      const doc = renderedDom.window.document;
      assert.equal(lessons.length, catalog.units.length);
      assert.ok(lessons.length >= 116);
      const sectionCount = lessons.reduce((count, lesson) => count + lesson.explanation.length, 0);
      assert.deepEqual(new Set(Object.keys(lessonHeadings)), new Set(lessons.map(lesson => lesson.id)));
      assert.ok(Object.keys(lessonVisuals).every(id => lessons.some(lesson => lesson.id === id)), 'Finite visual coverage refers only to existing lessons');
      for (const lesson of lessons) {
        const headings = getLessonHeadings(lesson.id);
        assert.equal(headings.length, lesson.explanation.length, lesson.id + ': exactly one heading per explanation');
        assert.ok(new Set(headings).size > 0, lesson.id + ': group labels intentionally repeat across grouped example paragraphs');
        for (const heading of headings) {
          assert.equal(typeof heading, 'string');
          assert.ok(heading.trim().length >= 4 && heading.length <= 120, lesson.id + ': concise nonempty title');
          assert.doesNotMatch(heading, /^(?:(?:section|paragraph|idea|step|part|page)\s+\d+|\d+|explanation|read more)$/i, lesson.id + ': meaningful heading, not a numbered placeholder');
        }
        headingCount += headings.length;
        const guide = lessonVisuals[lesson.id];
        if (guide) {
        assert.ok(Number.isInteger(guide.paragraph) && guide.paragraph >= 0 && guide.paragraph < lesson.explanation.length, lesson.id + ': valid visual page');
        assert.ok(['sequence', 'compare', 'collection', 'branch', 'layers'].includes(guide.kind));
        assert.ok(guide.title.trim() && guide.intro.trim() && guide.takeaway.trim());
        assert.ok(guide.items.length >= 2 && guide.items.every(item => item.label.trim() && item.value.trim()), lesson.id + ': concrete labeled values');
        }
        const visualBefore = JSON.stringify(guide);
        for (let index = 0; index < lesson.explanation.length; index++) {
          const text = lesson.explanation[index];
          const reading = React.createElement(LessonContent, { text, runtime: lesson.runtime });
          doc.body.innerHTML = renderToStaticMarkup(reading);
          const standalone = doc.body.textContent;
          const html = renderToStaticMarkup(React.createElement(RealContents, { lessonId: lesson.id, index, onSelect() { throw new Error('Static render must not navigate'); } },
            React.createElement('div', { 'data-original-lesson': '' }, reading),
            React.createElement(RealVisual, { unitId: lesson.id, paragraph: index })));
          doc.body.innerHTML = html;
          const active = [...doc.querySelectorAll('.contents-section > [role="region"]')].filter(region => !region.hidden);
          assert.equal(doc.querySelectorAll('.contents-section h4 > button').length, headings.length, lesson.id);
          assert.equal(active.length, 1, lesson.id + ':' + index);
          assert.equal(active[0].getAttribute('aria-labelledby'), doc.querySelectorAll('.contents-section h4 > button')[index].id);
          assert.equal(doc.querySelector('[data-original-lesson]').textContent, standalone, lesson.id + ':' + index + ': existing lesson rendering is unchanged');
          const originalGuide = guide?.paragraph === index;
          const hasVisual = originalGuide || Boolean(getPythonLessonScene(lesson.id, index));
          assert.equal(doc.querySelectorAll('.lesson-visual').length, Number(hasVisual), lesson.id + ':' + index + ': visual only on authored page');
          assert.equal(getLessonVisual(lesson.id, index), originalGuide ? guide : undefined);
          if (hasVisual) {
            visualCount++;
            assert.equal(doc.querySelectorAll('.visual-item[role="listitem"]').length, originalGuide ? guide.items.length : 0);
            assert.deepEqual([...doc.querySelectorAll('.visual-item pre')].map(node => node.textContent), originalGuide ? guide.items.map(item => item.value) : []);
            if (!originalGuide) { assert.equal(lesson.id, 'python-23'); assert.equal(index, 2); assert.ok(doc.querySelector('[data-csv-scene] svg')); }
          }
          assert.equal(doc.querySelectorAll('script,img,iframe,object,embed').length, 0);
          const route = { view: 'quest', studioMode: 'course', phase: 'learn', activeId: lesson.id, paragraph: index };
          assert.equal(routeHash(route), `#quest?lesson=${lesson.id}&step=learn&idea=${index + 1}`);
          assert.deepEqual(parseRoute(routeHash(route), lesson.id, catalog.units, lessons), route, lesson.id + ':' + index + ': existing deep links round trip');
        }
        assert.equal(JSON.stringify(guide), visualBefore, lesson.id + ': renderer leaves authored data unchanged');
      }
      renderedDom.window.close();
      assert.equal(headingCount, sectionCount);
      assert.equal(visualCount, Object.keys(lessonVisuals).length + 1, 'Authored guides plus the additional CSV scene; new lessons do not invent visuals');
      for (const id of ['missing', '__proto__', 'constructor', 'toString']) assert.deepEqual(getLessonHeadings(id), []);
      for (const id of ['missing', '__proto__', 'constructor', 'toString']) assert.equal(getLessonVisual(id, 0), undefined);
      assert.deepEqual(writes, []);
    });
  }
} finally {
  if (root) await act(async () => root.unmount());
  dom.window.close();
  for (const [key, descriptor] of originalGlobals) {
    if (descriptor) Object.defineProperty(globalThis, key, descriptor);
    else delete globalThis[key];
  }
  await rm(temp, { recursive: true, force: true });
}
for (const name of passed) console.log('PASS ' + name);
for (const { name, error } of failures) console.error('FAIL ' + name + '\n' + error.stack);
if (failures.length) process.exitCode = 1;
else console.log(`Passed ${passed.length} lesson contents/visual checks${headingCount ? ` across ${headingCount} sections and ${visualCount} authored visuals` : ' (fixture-only run)'}. Native keyboard activation and measured mobile layout require real-browser QA.`);
