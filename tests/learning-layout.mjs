import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, writeFile, rm, symlink } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import ts from 'typescript';
import postcss from 'postcss';
import React, { act } from 'react';
import { JSDOM } from 'jsdom';

// Exercise the actual app's visibility hooks, toggle, control, aside attributes,
// chat log, and controlled draft textarea in isolation from its network effects.
// This does not pretend to be an end-to-end app or measured browser layout test.
const cwd = fileURLToPath(new URL('..', import.meta.url));
const temp = await mkdtemp(path.join(tmpdir(), 'codequest-learning-layout-'));
const passed = [], failures = [];
const check = async (name, run) => {
  try { await run(); passed.push(name); }
  catch (error) { failures.push({ name, error }); }
};
const originalGlobals = new Map();
const installGlobal = (name, value) => {
  originalGlobals.set(name, Object.getOwnPropertyDescriptor(globalThis, name));
  Object.defineProperty(globalThis, name, { configurable: true, writable: true, value });
};
const dom = new JSDOM('<div id="mount"></div>', { pretendToBeVisual: true, url: 'https://fixture.example' });
const requests = [], submissions = [], storeReads = [], storeWrites = [];
const values = new Map();
const storage = {
  failRead: false, failWrite: false,
  getItem(key) { storeReads.push(key); if (this.failRead) throw new Error('Storage read blocked'); return values.get(key) ?? null; },
  setItem(key, value) { storeWrites.push({ key, value }); if (this.failWrite) throw new Error('Storage write blocked'); values.set(key, value); },
};
let root;
try {
  const file = 'components/CodeQuest.tsx';
  const source = await readFile(path.join(cwd, file), 'utf8');
  const ast = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const all = [];
  const visit = node => { all.push(node); ts.forEachChild(node, visit); };
  visit(ast);
  const codequest = ast.statements.find(node => ts.isFunctionDeclaration(node) && node.name?.text === 'CodeQuest');
  const opening = node => ts.isJsxElement(node) ? node.openingElement : ts.isJsxSelfClosingElement(node) ? node : null;
  const tag = node => opening(node)?.tagName.getText(ast);
  const attr = (node, name) => opening(node)?.attributes.properties.find(p => ts.isJsxAttribute(p) && p.name.getText(ast) === name);
  const byClass = name => all.find(node => attr(node, 'className')?.initializer?.text === name);
  const byId = id => all.find(node => attr(node, 'id')?.initializer?.text === id);
  const hook = codequest.body.statements.find(node => ts.isVariableStatement(node) && node.declarationList.declarations.some(d => d.name.getText(ast).includes('tutorHidden')));
  const effect = codequest.body.statements.find(node => ts.isExpressionStatement(node) && node.getText(ast).startsWith('useEffect(') && node.getText(ast).includes('codequest-buddy-hidden-'));
  const toggle = codequest.body.statements.find(node => ts.isVariableStatement(node) && node.declarationList.declarations.some(d => d.name.getText(ast) === 'toggleTutor'));
  const control = byClass('buddy-visibility');
  const pane = byId('coding-buddy-panel');
  const textarea = byId('question');
  const chatLog = byClass('chat-log');
  const workspace = all.find(node => tag(node) === 'div' && attr(node, 'className')?.initializer?.getText(ast).includes('buddy-hidden'));
  for (const [name, node] of Object.entries({ hook, effect, toggle, control, pane, textarea, chatLog, workspace })) assert.ok(node, 'Actual app integration node: ' + name);
  const parentExpression = node => { let current = node.parent; while (current && !ts.isJsxExpression(current)) current = current.parent; return current?.expression; };

  await check('Buddy visibility changes hiding, not mounting, chat, drafts, routes, or APIs', () => {
    assert.equal(attr(pane, 'hidden').initializer.expression.getText(ast), 'tutorHidden');
    assert.equal(attr(pane, 'key'), undefined, 'Hide/show must not remount the pane with a new key');
    assert.equal(attr(textarea, 'value').initializer.expression.getText(ast), 'question');
    assert.equal(attr(textarea, 'onChange').initializer.expression.getText(ast).replace(/\s/g, ''), '(e)=>setQuestion(e.target.value)');
    for (const node of [control, pane]) {
      const parent = parentExpression(node);
      assert.ok(ts.isBinaryExpression(parent) && parent.operatorToken.kind === ts.SyntaxKind.AmpersandAmpersandToken);
      assert.equal(parent.left.getText(ast).replace(/\s/g, ''), '(state.profile.aiEnabled||state.profile.hintsEnabled)');
    }
    const calls = [];
    const collect = node => { if (ts.isCallExpression(node)) calls.push(node.expression.getText(ast)); ts.forEachChild(node, collect); };
    collect(toggle);
    assert.deepEqual(calls, ['setTutorHidden', 'localStorage.setItem', 'String']);
    assert.doesNotMatch(toggle.getText(ast), /setQuestion|setChat|fetch|device\.|setParagraph|setPhase|setCode|setProgress|abort/);
    assert.match(effect.getText(ast), /\[state\.draftScope\]/);
  });

  await symlink(path.join(cwd, 'node_modules'), path.join(temp, 'node_modules'), process.platform === 'win32' ? 'junction' : 'dir');
  const fixture = `
    import React, { useState, useEffect, useRef } from 'react';
    const MessageCircle = () => null;
    const LessonContent = ({text, className}) => <p className={className}>{text}</p>;
    export default function Fixture({scope, enabled = true}) {
      const state = {draftScope: scope, profile: {aiEnabled: enabled, hintsEnabled: false}};
      const tutorPanel = useRef(null);
      const [question, setQuestion] = useState('');
      const [chat] = useState([{question:'Earlier question', answer:'Earlier answer'}]);
      const pendingPassage = '', tutorBusy = false;
      const lesson = {runtime:'python'};
      ${hook.getText(ast)}
      ${effect.getText(ast)}
      ${toggle.getText(ast)}
      return <form onSubmit={e => { e.preventDefault(); globalThis.__layoutSubmissions.push('submit'); }}>
        {(state.profile.aiEnabled || state.profile.hintsEnabled) && (${control.getText(ast)})}
        ${workspace.openingElement.getText(ast)}
          <section className="lesson-area">Lesson remains available</section>
          {(state.profile.aiEnabled || state.profile.hintsEnabled) && (
            ${pane.openingElement.getText(ast)}
              ${chatLog.getText(ast)}
              <label htmlFor="question">Ask your coding buddy</label>
              ${textarea.getText(ast)}
            </aside>
          )}
        </div>
      </form>;
    }
  `;
  const compiled = ts.transpileModule(fixture, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext, jsx: ts.JsxEmit.ReactJSX }, reportDiagnostics: true });
  assert.equal(compiled.diagnostics?.filter(d => d.category === ts.DiagnosticCategory.Error).length, 0);
  await writeFile(path.join(temp, 'fixture.mjs'), compiled.outputText);
  installGlobal('window', dom.window);
  installGlobal('document', dom.window.document);
  installGlobal('navigator', dom.window.navigator);
  installGlobal('IS_REACT_ACT_ENVIRONMENT', true);
  installGlobal('localStorage', storage);
  installGlobal('__layoutSubmissions', submissions);
  installGlobal('fetch', (...args) => { requests.push(args); throw new Error('Hide/show must not call an API'); });
  const { createRoot } = await import('react-dom/client');
  const { default: Fixture } = await import(pathToFileURL(path.join(temp, 'fixture.mjs')).href);
  root = createRoot(document.getElementById('mount'));
  const render = async (scope, enabled = true) => { await act(async () => root.render(React.createElement(Fixture, {scope, enabled}))); };
  const button = () => document.querySelector('.buddy-visibility button');
  const panel = () => document.getElementById('coding-buddy-panel');
  const click = async () => { await act(async () => button().click()); };
  const edit = async value => {
    await act(async () => {
      const field = document.getElementById('question');
      Object.getOwnPropertyDescriptor(dom.window.HTMLTextAreaElement.prototype, 'value').set.call(field, value);
      field.dispatchEvent(new dom.window.Event('input', { bubbles: true }));
    });
  };

  await check('Hide/show keeps the exact mounted pane, textarea draft, and existing answer nodes', async () => {
    await render('account-a');
    assert.equal(panel().hidden, true, 'A new account starts with the optional tutor hidden');
    assert.equal(button().getAttribute('aria-expanded'), 'false');
    assert.equal(storeWrites.length, 0, 'Restoring defaults does not write preferences');
    await click();
    assert.equal(panel().hidden, false);
    assert.equal(button().type, 'button');
    assert.equal(button().getAttribute('aria-controls'), panel().id);
    assert.equal(button().getAttribute('aria-expanded'), 'true');
    const paneNode = panel(), fieldNode = document.getElementById('question'), answerNode = document.querySelector('.chat-answer');
    const draft = 'Explain pet_name without sending this unfinished draft.';
    await edit(draft);
    await click();
    assert.equal(panel(), paneNode);
    assert.equal(document.getElementById('question'), fieldNode);
    assert.equal(document.querySelector('.chat-answer'), answerNode);
    assert.equal(fieldNode.value, draft);
    assert.equal(answerNode.textContent, 'Earlier answer');
    assert.equal(panel().hidden, true);
    assert.equal(button().textContent.trim(), 'Show coding buddy');
    assert.equal(button().getAttribute('aria-expanded'), 'false');
    assert.ok(document.querySelector('.workspace').classList.contains('buddy-hidden'));
    assert.equal(values.get('codequest-buddy-hidden-account-a'), 'true');
    await click();
    assert.equal(panel(), paneNode);
    assert.equal(panel().hidden, false);
    assert.equal(fieldNode.value, draft);
    assert.equal(document.querySelector('.chat-answer'), answerNode);
    assert.equal(button().textContent.trim(), 'Hide coding buddy');
    assert.equal(values.get('codequest-buddy-hidden-account-a'), 'false');
    assert.deepEqual(requests, []);
    assert.deepEqual(submissions, []);
  });

  await check('Persisted visibility is isolated by draftScope and restores after remount', async () => {
    await click();
    assert.equal(values.get('codequest-buddy-hidden-account-a'), 'true');
    const writesBeforeScopeChange = storeWrites.length;
    await render('account-b');
    assert.equal(panel().hidden, true);
    assert.equal(values.has('codequest-buddy-hidden-account-b'), false);
    assert.equal(storeWrites.length, writesBeforeScopeChange, 'Restoring a scope does not write preferences');
    values.set('codequest-buddy-hidden-account-b', 'false');
    await render('account-a');
    assert.equal(panel().hidden, true);
    await render('account-b');
    assert.equal(panel().hidden, false, 'An existing explicit Show preference overrides the new default');
    assert.equal(storeWrites.length, writesBeforeScopeChange, 'Restoring a saved Show choice does not overwrite it');
    await render('account-a');
    assert.equal(panel().hidden, true);
    await act(async () => root.unmount());
    root = createRoot(document.getElementById('mount'));
    await render('account-a');
    assert.equal(panel().hidden, true);
    assert.ok(storeReads.includes('codequest-buddy-hidden-account-a'));
    assert.ok(storeReads.includes('codequest-buddy-hidden-account-b'));
    assert.ok(storeWrites.every(write => /^codequest-buddy-hidden-account-[ab]$/.test(write.key)));
  });

  await check('Missing scope and denied storage leave in-visit hiding usable without unscoped persistence', async () => {
    await render('');
    assert.equal(panel().hidden, true);
    const before = storeWrites.length;
    await click();
    assert.equal(panel().hidden, false);
    assert.equal(storeWrites.length, before);
    storage.failRead = true;
    await render('account-c');
    assert.equal(panel().hidden, true);
    storage.failRead = false;
    storage.failWrite = true;
    await click();
    assert.equal(panel().hidden, false);
    assert.equal(values.has('codequest-buddy-hidden-account-c'), false);
    await click();
    assert.equal(panel().hidden, true);
    storage.failWrite = false;
    await render('account-c', false);
    assert.equal(panel(), null);
    assert.equal(button(), null);
    assert.ok(document.querySelector('.lesson-area'));
    assert.deepEqual(requests, []);
    assert.deepEqual(submissions, []);
  });

  await check('Opening or navigating original prose replaces a stale concept-room annotation context', async () => {
    const original = all.find(node => tag(node) === 'details' && attr(node, 'className')?.initializer?.getText(ast).includes('original-lesson'));
    const currentSource = codequest.body.statements.find(node => ts.isVariableStatement(node) && node.declarationList.declarations.some(d => d.name.getText(ast) === 'currentNoteSource'));
    assert.ok(original && currentSource);
    await mkdir(path.join(temp, 'components'));
    await mkdir(path.join(temp, 'lib'));
    for (const file of ['components/LessonContents.tsx', 'lib/lesson-headings.ts']) {
      const js = ts.transpileModule(await readFile(path.join(cwd, file), 'utf8'), {
        compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext, jsx: ts.JsxEmit.ReactJSX },
      }).outputText.replace(/from\s+(['"])(\.\.?\/[^'"]+)\1/g, 'from "$2.mjs"');
      await writeFile(path.join(temp, file.replace(/\.tsx?$/, '.mjs')), js);
    }
    const contextFixture = `
      import React, {useState, useRef} from 'react';
      import LessonContents from './components/LessonContents.mjs';
      import {getLessonHeadings} from './lib/lesson-headings.mjs';
      const LessonContent = ({text}) => <p>{text}</p>;
      const LessonVisual = () => null;
      // This suite owns app annotation callbacks. The actual microstep flow is
      // exercised by simple-reading.mjs and lesson-step-flow.mjs.
      const LessonStepFlow = ({onNext, onBack, backDisabled}) => <div className="concept-controls"><button type="button" disabled={backDisabled} onClick={onBack}>Back</button><button type="button" onClick={onNext}>Next</button></div>;
      const ArrowRight = () => null;
      const noteSource = (lesson, sectionKey) => ({sectionKey});
      export default function Fixture() {
        const lesson = {id:'python-01', runtime:'python', explanation:Array.from({length:7}, (_,i) => 'Original paragraph ' + i)};
        const [paragraph, setParagraph] = useState(0);
        const [phase, setPhase] = useState('learn');
        const [flowBackTarget, setFlowBackTarget] = useState(null);
        const [noteSection, setNoteSection] = useState({lessonId:lesson.id, key:'concept:names'});
        const conceptStart = useRef(null), theoryFocusRequested = useRef(false);
        ${currentSource.getText(ast)}
        return <>
          <button type="button" data-focus-concept onClick={() => setNoteSection({lessonId:lesson.id, key:'concept:names'})}>Focus Names</button>
          ${original.getText(ast)}
          <output data-context>{currentNoteSource?.sectionKey}</output>
          <output data-paragraph>{paragraph}</output><output data-phase>{phase}</output>
        </>;
      }
    `;
    await writeFile(path.join(temp, 'context-fixture.mjs'), ts.transpileModule(contextFixture, {
      compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext, jsx: ts.JsxEmit.ReactJSX },
    }).outputText);
    const {default: ContextFixture} = await import(pathToFileURL(path.join(temp, 'context-fixture.mjs')).href);
    await act(async () => root.render(React.createElement(ContextFixture)));
    const context = () => document.querySelector('[data-context]').textContent;
    const nativeClick = async node => { await act(async () => { node.focus(); node.click(); await new Promise(resolve => setTimeout(resolve, 0)); }); };
    const focusNames = () => nativeClick(document.querySelector('[data-focus-concept]'));
    const navButton = label => [...document.querySelectorAll('.concept-controls button')].find(node => node.textContent.trim() === label);
    assert.equal(context(), 'concept:names');
    await nativeClick(document.querySelector('.original-lesson > summary'));
    assert.equal(document.querySelector('.original-lesson').open, true);
    assert.equal(context(), 'text:0', 'Opening original prose must not leave notes and Ask ChatGPT attached to Names');
    await focusNames();
    await nativeClick(navButton('Next'));
    assert.equal(document.querySelector('[data-paragraph]').textContent, '1');
    assert.equal(context(), 'text:1', 'Next switches context to the newly displayed written paragraph');
    await focusNames();
    await nativeClick(navButton('Back'));
    assert.equal(context(), 'text:0', 'Back switches context to the newly displayed written paragraph');
    await focusNames();
    await nativeClick(document.querySelector('.reader-index nav button'));
    assert.equal(context(), 'text:0', 'Selecting the current written idea switches annotation context');
    assert.deepEqual(requests, []);
  });

  const css = postcss.parse(await readFile(path.join(cwd, 'app/globals.css'), 'utf8'));
  const rules = [];
  css.walkRules(rule => rules.push(rule));
  const applies = (rule, width) => {
    for (let parent = rule.parent; parent; parent = parent.parent) {
      if (parent.type !== 'atrule' || parent.name !== 'media') continue;
      const max = /max-width:\s*([\d.]+)px/.exec(parent.params);
      const min = /min-width:\s*([\d.]+)px/.exec(parent.params);
      if ((max && width > Number(max[1])) || (min && width < Number(min[1]))) return false;
      if (/prefers-/.test(parent.params)) return false;
    }
    return true;
  };
  const declarations = (selector, width = 1200) => {
    const result = {};
    for (const rule of rules) if (rule.selectors.includes(selector) && applies(rule, width)) {
      for (const node of rule.nodes) if (node.type === 'decl') result[node.prop] = node.value;
    }
    return result;
  };

  await check('Hidden buddy pane releases its layout column and mobile controls stack', () => {
    assert.equal(declarations('.workspace.buddy-hidden')['grid-template-columns'], 'minmax(0, 1fr)');
    const hidden = rules.find(rule => rule.selectors.includes('.tutor-panel[hidden]'));
    assert.ok(hidden.nodes.some(node => node.prop === 'display' && node.value === 'none' && node.important));
    assert.equal(declarations('.buddy-visibility', 320)['flex-direction'], 'column');
    assert.equal(declarations('.lesson-area', 320)['min-width'], '0');
  });

  await check('Justification reaches lesson and saved-note prose but not code blocks or selected source quotes', async () => {
    const justification = rules.filter(rule => rule.nodes.some(node => node.prop === 'text-align' && node.value === 'justify')).flatMap(rule => rule.selectors);
    const fixture = new JSDOM(`<section class="lesson-content"><p data-prose>Read this sentence.</p><figure class="code-example"><pre><code>if ready:\n    print("yes")</code></pre></figure></section><section class="lab-content"><p class="lab-intro" data-prose>A plain introduction.</p><div class="lab-source"><pre><code>pet_name = "Pepper"</code></pre></div><div class="lab-deeper"><div class="deeper-grid"><section><p data-prose>A deeper explanation.</p><pre>print(pet_name)</pre></section></div></div></section><section class="lesson-notes"><p class="lesson-note-body" data-prose>My saved reflection.</p><blockquote class="lesson-note-quote">    selected source text</blockquote></section>`);
    try {
      for (const element of fixture.window.document.querySelectorAll('[data-prose]')) assert.ok(justification.some(selector => element.matches(selector)), 'Prose selector covers ' + element.outerHTML);
      for (const element of fixture.window.document.querySelectorAll('pre, .lesson-note-quote')) assert.ok(justification.every(selector => !element.closest(selector)), 'No inherited block-code justification: ' + element.outerHTML);
    } finally { fixture.window.close(); }
    assert.equal(declarations('.code-example pre')['white-space'], 'pre');
    assert.equal(declarations('.code-example pre')['overflow-x'], 'auto');
    assert.equal(declarations('.lab-source > pre').overflow, 'auto');
    assert.equal(declarations('.code-piece')['white-space'], 'pre');
    for (const selector of ['.deeper-grid pre', '.visual-item pre', '.visual-output pre', '.actual-output pre']) {
      assert.equal(declarations(selector)['white-space'], 'pre-wrap');
      assert.equal(declarations(selector)['overflow-wrap'], 'anywhere');
    }
    const notes = await readFile(path.join(cwd, 'components/LessonNotes.tsx'), 'utf8');
    assert.match(notes, /className="lesson-note-body"/, 'The checked note class is the actual rendered class');
  });

  await check('Desktop reading is centered and bounded without narrowing code or changing phone padding', () => {
    for (const width of [1024, 1440, 1920]) {
      assert.equal(declarations('.workspace', width)['max-width'], '1190px');
      assert.equal(declarations('.workspace', width)['margin-inline'], 'auto');
      assert.equal(declarations('.workspace > .lesson-area', width)['max-width'], '860px');
      assert.equal(declarations('.workspace > .lesson-area', width)['justify-self'], 'center');
      assert.equal(declarations('.workspace.buddy-hidden', width)['max-width'], '860px');
      assert.equal(declarations('.workspace:has(> .lesson-area:last-child)', width)['max-width'], '860px');
    }
    for (const width of [320, 390, 540, 768]) {
      assert.equal(declarations('.workspace', width)['max-width'], undefined, 'Desktop cap does not change mobile layout');
      assert.equal(declarations('.workspace > .lesson-area', width)['max-width'], undefined);
    }
    const measure = declarations('.lesson-area .lesson-content > p');
    assert.equal(measure['max-width'], '66ch');
    assert.equal(measure['margin-inline'], 'auto');
    const bounded = rules.filter(rule => rule.nodes.some(node => node.prop === 'max-width' && node.value === '66ch')).flatMap(rule => rule.selectors);
    const fixture = new JSDOM('<section class="lesson-area"><div class="lesson-content"><p>Prose</p><figure><pre><code>code</code></pre></figure></div><svg></svg></section>');
    try {
      assert.ok(bounded.some(selector => fixture.window.document.querySelector('p').matches(selector)));
      for (const element of fixture.window.document.querySelectorAll('pre, code, svg')) assert.ok(bounded.every(selector => !element.closest(selector)), 'Code and illustrations keep their independently bounded width');
    } finally { fixture.window.close(); }
    assert.equal(declarations('.code-example pre')['white-space'], 'pre');
    assert.equal(declarations('.code-example pre')['overflow-x'], 'auto');
    assert.equal(declarations('.contents-reading', 390).padding, '10px');
  });

  await check('Narrow concept-room layout has no forced reference-grid width beyond its nested padding budget', () => {
    const px = value => Number.parseFloat(value) || 0;
    const horizontalPadding = style => {
      const values = (style.padding || '0').split(/\s+/).map(px);
      const left = values.length === 4 ? values[3] : values.length > 1 ? values[1] : values[0];
      const right = values.length > 1 ? values[1] : values[0];
      return px(style['padding-left'] ?? left) + px(style['padding-right'] ?? right);
    };
    const horizontalBox = style => horizontalPadding(style) + 2 * px(style.border || '0');
    const width = 320;
    const ancestors = ['.shell main', '.panel', '.concept-lab', '.lab-content', '.python-concept-room', '.python-room-content', '.lab-state', '.reference-scene'];
    const budget = width - ancestors.reduce((sum, selector) => sum + horizontalBox(declarations(selector, width)), 0);
    const grid = declarations('.reference-row', width);
    const tracks = grid['grid-template-columns'].match(/minmax\([^)]*\)|\d+(?:\.\d+)?px|\S+/g);
    const minimums = tracks.map(track => /^minmax\(/.test(track) ? px(track.slice(7).split(',')[0]) : /px$/.test(track) ? px(track) : 0);
    const required = minimums.reduce((sum, value) => sum + value, 0) + (tracks.length - 1) * px(grid.gap);
    assert.ok(required <= budget, `Reference grid needs at least ${required}px, but a ${width}px viewport leaves approximately ${budget}px after authored nested padding/borders. Use shrinkable minimums or stack the reference cards.`);
    assert.equal(declarations('.lab-workbench', width)['grid-template-columns'], '1fr');
    assert.equal(declarations('.deeper-grid', width)['grid-template-columns'], '1fr');
    assert.equal(declarations('.lab-inputs', width)['flex-wrap'], 'wrap');
    for (const selector of ['.lesson-contents', '.contents-section', '.contents-reading', '.python-concept-room', '.python-room-content', '.lab-workbench', '.lab-source', '.lab-state', '.value-object']) assert.equal(declarations(selector, width)['min-width'], '0', selector + ' permits shrinking');
    for (const selector of ['.value-object strong', '.name-tag']) assert.equal(declarations(selector, width)['overflow-wrap'], 'anywhere');
  });
} finally {
  if (root) await act(async () => root.unmount());
  dom.window.close();
  for (const [name, descriptor] of originalGlobals) {
    if (descriptor) Object.defineProperty(globalThis, name, descriptor);
    else delete globalThis[name];
  }
  await rm(temp, { recursive: true, force: true });
}
for (const name of passed) console.log('PASS ' + name);
for (const { name, error } of failures) console.error('FAIL ' + name + '\n' + error.stack);
if (failures.length) process.exitCode = 1;
else console.log(`Passed ${passed.length} isolated buddy-state and authored-CSS checks. Real-browser layout and keyboard behavior remain unmeasured.`);
