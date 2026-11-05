import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtemp, mkdir, readFile, writeFile, rm, symlink } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import ts from 'typescript';
import { JSDOM } from 'jsdom';
import React, { act } from 'react';

const temp = await mkdtemp(path.join(tmpdir(), 'codequest-python-concept-lab-'));
const dom = new JSDOM('<div id="mount"></div>', {
  pretendToBeVisual: true,
  url: 'https://fixture.example',
});
Object.assign(globalThis, {
  window: dom.window,
  document: dom.window.document,
  IS_REACT_ACT_ENVIRONMENT: true,
  requestAnimationFrame: dom.window.requestAnimationFrame.bind(dom.window),
});
// Import the event system after the DOM exists so React onChange handling is real.
const { createRoot } = await import('react-dom/client');
const runtime = { calls: [], results: [] };
globalThis.__conceptLabRuntimeFixture = runtime;
const externalRequests = [];
globalThis.fetch = async (...args) => {
  externalRequests.push(args);
  throw new Error('An experiment must not mutate official progress or fetch APIs.');
};
const clipboard = { copied: [], fail: false, pending: null };
Object.defineProperty(globalThis, 'navigator', {
  configurable: true,
  value: { clipboard: { writeText: async (text) => {
    if (clipboard.fail) throw new Error('Clipboard denied');
    clipboard.copied.push(text);
    if (clipboard.pending) await clipboard.pending;
  } } },
});
const downloads = [], blobs = new Map(), revoked = [];
const originalCreateObjectURL = URL.createObjectURL;
const originalRevokeObjectURL = URL.revokeObjectURL;
URL.createObjectURL = blob => {
  const url = 'blob:fixture-' + blobs.size;
  blobs.set(url, blob);
  return url;
};
URL.revokeObjectURL = url => revoked.push(url);
dom.window.HTMLAnchorElement.prototype.click = function () {
  downloads.push({ href: this.href, download: this.download });
};
let root;
try {
  await mkdir(path.join(temp, 'components'));
  await mkdir(path.join(temp, 'lib'));
  await symlink(path.resolve('node_modules'), path.join(temp, 'node_modules'), process.platform === 'win32' ? 'junction' : 'dir');
  for (const file of ['lib/diagram-web-platform.ts', 'lib/diagram-javascript-python.ts', 'lib/diagram-sql-swift-typescript.ts', 'components/LessonVisual.tsx', 'components/LessonDiagram.tsx', 'components/PythonLessonScene.tsx', 'components/PythonControlScenes.tsx', 'components/PythonCollectionScenes.tsx', 'components/PythonGeneratorScene.tsx', 'components/PythonCsvScene.tsx', 'lib/lesson-visuals.ts', 'lib/lesson-diagrams.ts', 'lib/diagram-drawing.ts', 'lib/python-control-scenes.ts', 'lib/python-collection-scenes.ts', 'lib/python-generator-scene.ts', 'lib/python-csv-scene.ts', 'components/PythonConceptLab.tsx', 'components/PairedLessonText.tsx', 'components/PythonConceptPicture.tsx', 'components/PythonConceptMetaphor.tsx', 'components/LessonContent.tsx', 'components/LessonStepFlow.tsx', 'lib/lesson-step-flow.ts', 'lib/understanding-practice.ts', 'lib/plain-language.ts', 'lib/plain-beginner-python.ts', 'lib/plain-html-readings.ts', 'lib/plain-css-readings.ts', 'lib/plain-python-foundations.ts', 'lib/plain-python-advanced.ts', 'lib/plain-typescript-readings.ts', 'lib/plain-react-readings.ts', 'lib/plain-backend-readings.ts', 'lib/plain-javascript-readings.ts', 'lib/plain-sql-readings.ts', 'lib/plain-swift-readings.ts', 'lib/plain-developer-readings.ts', 'components/CodeAnatomy.tsx', 'components/LessonGlossary.tsx', 'lib/lesson-glossary.ts', 'lib/term-senses.ts', 'lib/code-anatomy.ts', 'lib/swift-code-words.ts', 'lib/csharp-reviewed-anatomy.ts', 'lib/cpp-reviewed-anatomy.ts', 'lib/java-reviewed-anatomy.ts', 'lib/c-reviewed-anatomy.ts', 'lib/kotlin-reviewed-anatomy.ts', 'lib/rust-reviewed-anatomy.ts', 'lib/php-reviewed-anatomy.ts', 'lib/ruby-reviewed-anatomy.ts', 'lib/r-reviewed-anatomy.ts', 'lib/go-reviewed-anatomy.ts', 'lib/term-lesson-visuals.ts', 'lib/lesson-markup.ts', 'lib/lesson-ideas.ts', 'lib/code-language.ts', 'lib/python-concepts.ts']) {
    const js = ts.transpileModule(await readFile(file, 'utf8'), {
      compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext, jsx: ts.JsxEmit.ReactJSX },
    }).outputText.replace(/from\s+(['"])(\.\.?\/[^'"]+)\1/g, 'from "$2.mjs"');
    await writeFile(path.join(temp, file.replace(/\.tsx?$/, '.mjs')), js);
  }
  await writeFile(path.join(temp, 'components/CodeAnatomy.module.css.mjs'), 'export default new Proxy({}, {get: (_, key) => String(key)});');
  await writeFile(path.join(temp, 'components/LessonGlossary.module.css.mjs'), 'export default new Proxy({}, {get: (_, key) => String(key)});');
  await writeFile(path.join(temp, 'components/LessonStepFlow.module.css.mjs'), 'export default new Proxy({}, {get: (_, key) => String(key)});');
  await writeFile(path.join(temp, 'lib/runner.mjs'), [
    'export async function runProject(frame, lesson, code, signal) {',
    'const fixture = globalThis.__conceptLabRuntimeFixture;',
    'fixture.calls.push({frame, lesson, code, signal});',
    'const next = fixture.results.shift();',
    'if (next === undefined) throw new Error("No fixture result queued");',
    'return typeof next === "function" ? next() : next;',
    '}',
  ].join('\n'));
  const { makePythonExperiment, pythonConcepts } = await import(pathToFileURL(path.join(temp, 'lib/python-concepts.mjs')).href);
  const { default: Lab } = await import(pathToFileURL(path.join(temp, 'components/PythonConceptLab.mjs')).href);

  // Execute every generated Python statement, not a second JS simulation.
  // The Python validator rejects unexpected AST nodes BEFORE execution.
  const names = [
    'Pepper', 'PEPPER', '', '5', 'Nothing yet.', 'The name disappears',
    'Clover the cat', '"quoted"', "O'Malley", 'back\\slash',
    '\nline\nbreak\n', 'tab\tname', 'carriage\rreturn', '\u0000null',
    '\b\fcontrol', 'éclair', 'straße', 'İstanbul', 'σίσυφος', 'кошка',
    '猫 🐈', 'e\u0301', 'a'.repeat(39) + '🐈', '🐈'.repeat(41),
    '\ud800', '\udfff', '"; print("INJECTED"); #',
    '{__import__("os")}', '\\nprint("INJECTED")', '<script>alert(1)</script>',
  ];
  const ages = [...Array.from({length: 100}, (_, n) => n), -99, 999, 4.9, -0.9, NaN, Infinity, -Infinity];
  const cases = [];
  for (const id of ['greeting', 'rebind', 'types']) {
    for (const name of names) {
      for (const age of ages) {
        const model = makePythonExperiment(id, name, age);
        assert.equal(model.lines.length + 1, model.steps.length, 'One state per source statement');
        assert.equal(model.code, model.lines.map(line => line.map(piece => piece.text).join('')).join('\n') + '\n');
        assert.equal(new Set(model.options).size, model.options.length, 'Unique choices: ' + id + ' ' + JSON.stringify(name));
        assert.equal(model.options.length, 3);
        assert.ok(model.answer >= 0 && model.answer < model.options.length);
        assert.deepEqual(model.steps[0].bindings, []);
        assert.deepEqual(model.steps[0].output, []);
        assert.deepEqual(model.steps.at(-1).output, model.expected);
        assert.ok(model.lines.flat().filter(piece => piece.concept).every(piece => piece.meaning && pythonConcepts.some(c => c.id === piece.concept)));
        for (const state of model.steps) {
          assert.equal(new Set(state.objects.map(o => o.id)).size, state.objects.length);
          assert.equal(new Set(state.bindings.map(b => b.name)).size, state.bindings.length);
          assert.ok(state.bindings.every(b => state.objects.some(o => o.id === b.object)));
        }
        cases.push({ id, model });
      }
    }
  }
  assert.equal(makePythonExperiment('greeting', 'Pepper', 5).code, 'pet_name = "Pepper"\npet_age = 5\nprint(f"{pet_name} is {pet_age} years old.")\n');
  for (let age = 0; age <= 99; age++) {
    assert.deepEqual(makePythonExperiment('greeting', 'Pepper', age).expected, ['Pepper is ' + age + ' years old.']);
    assert.deepEqual(makePythonExperiment('types', 'Pepper', age).expected, [String(age) + '1']);
  }
  for (const [input, expected] of [[-99, 0], [999, 99], [4.9, 4], [-0.9, 0], [NaN, 5], [Infinity, 5], [-Infinity, 5]]) {
    assert.deepEqual(makePythonExperiment('greeting', 'Pepper', input).expected, ['Pepper is ' + expected + ' years old.']);
  }
  assert.equal(makePythonExperiment('rebind', 'a'.repeat(39) + '🐈', 5).expected[0], 'a'.repeat(39) + '🐈');
  assert.equal(makePythonExperiment('rebind', '🐈'.repeat(41), 5).expected[0], '🐈'.repeat(40));
  assert.equal(makePythonExperiment('rebind', '\ud800', 5).expected[0], '\uFFFD');
  assert.equal(makePythonExperiment('rebind', 'a\u0000b', 5).expected[0], 'a\uFFFDb');
  assert.match(pythonConcepts.find(c => c.id === 'strings').limit, /immutable/);
  assert.match(pythonConcepts.find(c => c.id === 'names').limit, /Rebinding one name does not automatically rebind another/);
  assert.match(pythonConcepts.find(c => c.id === 'assignment').explore.at(-1).text, /does not modify the original string/);
  const python = spawnSync(process.env.PYTHON || (process.platform === 'win32' ? 'python' : 'python3'), ['-c', String.raw`
import ast, contextlib, io, json, sys
cases = json.load(sys.stdin)
allowed = (ast.Module, ast.Assign, ast.Expr, ast.Name, ast.Store, ast.Load,
           ast.Constant, ast.Call, ast.Attribute, ast.BinOp, ast.Add,
           ast.JoinedStr, ast.FormattedValue)
for case in cases:
    model, kind = case['model'], case['id']
    tree = ast.parse(model['code'])
    assert len(tree.body) == len(model['lines']), ('Injected statement', model['code'])
    for node in ast.walk(tree):
        assert isinstance(node, allowed), ('Unexpected AST node', type(node).__name__, model['code'])
        if isinstance(node, ast.Name):
            assert node.id in ('pet_name', 'pet_age', 'original_name', 'print'), ('Injected name', node.id)
        if isinstance(node, ast.Call):
            assert not node.keywords
            assert ((isinstance(node.func, ast.Name) and node.func.id == 'print')
                    or (isinstance(node.func, ast.Attribute) and node.func.attr == 'upper' and not node.args)), ('Injected call', model['code'])
        if isinstance(node, ast.Attribute):
            assert node.attr == 'upper' and isinstance(node.value, ast.Name) and node.value.id == 'pet_name'
    env = {'__builtins__': {'print': print}}
    output = io.StringIO()
    for index, statement in enumerate(tree.body, start=1):
        with contextlib.redirect_stdout(output):
            exec(compile(ast.Module(body=[statement], type_ignores=[]), '<concept-lab>', 'exec'), env)
        state = model['steps'][index]
        actual_output = output.getvalue()
        assert actual_output == ''.join(line + '\n' for line in state['output']), (kind, index, repr(actual_output), state['output'], model['code'])
        bound = {b['name'] for b in state['bindings']}
        assert bound == set(env) - {'__builtins__'}, (kind, index, bound, set(env))
        for binding in state['bindings']:
            obj = next(o for o in state['objects'] if o['id'] == binding['object'])
            actual = env[binding['name']]
            assert type(actual).__name__ == obj['type'], (kind, index, binding, actual)
            assert str(actual) == obj['value'], (kind, index, binding, repr(actual), repr(obj['value']))
        if kind == 'rebind' and index == 2:
            assert env['pet_name'] is env['original_name'], 'Name assignment preserves the same reference'
        if kind == 'rebind' and index >= 3:
            original = next(o['value'] for o in state['objects'] if o['id'] == 'text1')
            assert env['original_name'] == original, 'Rebinding does not mutate the original string'
    lines = output.getvalue().split('\n')[:-1]
    assert lines == model['expected'], (kind, lines, model['expected'])
    assert eval('__output == ' + json.dumps(model['expected'], ensure_ascii=False), {'__output': lines})
print('Verified', len(cases), 'generated Python examples and all intermediate states.')
`
], {
    input: JSON.stringify(cases), encoding: 'utf8', maxBuffer: 8 * 1024 * 1024,
  });
  assert.equal(python.status, 0, python.stderr || python.error?.message);
  console.log(python.stdout.trim());

  // Also exercise the exact bundled runtime and its stdout batching. Native
  // Python alone would miss, for example, Pyodide dropping embedded NUL bytes.
  const pyodideLoader = path.join(temp, 'pyodide.cjs');
  await writeFile(pyodideLoader, await readFile('public/vendor/pyodide/pyodide.js'));
  const pyodideSource = [
    'const assert = require("node:assert/strict");',
    'const fs = require("node:fs");',
    'const { loadPyodide } = require(process.argv[1]);',
    '(async () => {',
    'const cases = JSON.parse(fs.readFileSync(0, "utf8"));',
    'const output = [];',
    'const p = await loadPyodide({ indexURL: process.argv[2], stdout: text => output.push(text), stderr: text => output.push(text) });',
    'for (const {id, model} of cases) {',
    'output.length = 0;',
    'p.runPython(model.code);',
    'assert.deepEqual(output, model.expected, id + ": " + model.code);',
    'const captured = p.toPy(output);',
    'try { p.globals.set("__output", captured); assert.equal(p.runPython("__output == " + JSON.stringify(model.expected)), true); } finally { captured.destroy(); }',
    '}',
    'console.log("Verified " + cases.length + " examples with the actual bundled Pyodide runtime and runner check expressions.");',
    '})().catch(error => { console.error(error); process.exit(1); });',
  ].join('\n');
  const bundled = spawnSync(process.execPath, ['-e', pyodideSource, pyodideLoader, path.resolve('public/vendor/pyodide')], {
    input: JSON.stringify(cases.filter((_, index) => index % ages.length === 5)),
    encoding: 'utf8', maxBuffer: 8 * 1024 * 1024, timeout: 60000,
  });
  assert.equal(bundled.status, 0, bundled.stderr || bundled.error?.message);
  console.log(bundled.stdout.trim());

  const lesson = Object.freeze({
    id: 'python-01', title: 'Pet profile', runtime: 'python', filename: 'pet_profile.py',
    starter: '# Keep the original project', solution: 'print("Original project")',
    checks: Object.freeze([{ label: 'Official completion check', expression: 'False' }]),
  });
  const originalLesson = structuredClone(lesson);
  root = createRoot(document.getElementById('mount'));
  const flush = async () => act(async () => { await new Promise(resolve => setTimeout(resolve, 0)); });
  const button = label => [...document.querySelectorAll('button')].find(el => el.textContent.trim() === label);
  const click = async label => {
    assert.ok(button(label), 'Button exists: ' + label);
    await act(async () => { button(label).click(); });
    await flush();
  };
  const clickNode = async node => {
    assert.ok(node);
    await act(async () => { node.click(); });
    await flush();
  };
  const _edit = async (selector, value) => {
    const field = document.querySelector(selector);
    assert.ok(field, selector);
    await act(async () => {
      Object.getOwnPropertyDescriptor(dom.window.HTMLInputElement.prototype, 'value').set.call(field, value);
      field.dispatchEvent(new dom.window.Event('input', { bubbles: true }));
    });
    await flush();
  };
  const actualOutput = () => document.querySelector('.actual-output pre')?.textContent;
  const status = () => document.querySelector('.lab-status').textContent;
  const room = id => document.querySelector('[aria-controls="python-room-' + id + '"]');
  const openRoom = async id => {
    if (room(id).getAttribute('aria-expanded') !== 'true') await clickNode(room(id));
  };
  const pending = () => {
    let resolve, reject;
    const promise = new Promise((res, rej) => { resolve = res; reject = rej; });
    runtime.results.push(promise);
    return { resolve, reject };
  };
  const passed = output => ({ output, checks: [{label: 'Python output matches this walkthrough.', passed: true}] });
  const acknowledged = [];
  await act(async () => root.render(React.createElement(Lab, { lesson,
    renderReadingMark: (id, title) => React.createElement('button', {'data-reading-id': id, onClick: () => acknowledged.push(id)}, 'Read ' + title)
  })));
  assert.equal(document.querySelector('.concept-lab').open, true);
  assert.equal(document.querySelectorAll('.python-concept-room > h4 > button').length, 6);
  assert.equal(document.querySelector('.lab-inputs'), null, 'Cosmetic name/age swaps are removed');
  assert.equal(document.querySelector('.what-if-intro'), null, 'The generic change-one-thing warmup is removed');
  assert.equal(document.querySelectorAll('.experiment-tabs button').length, 3);
  assert.doesNotMatch(document.body.textContent, /Change Pepper.s details|change one name or age|Try a new pet profile/);
  assert.match(document.querySelector('.lab-state').textContent, /After line 1/);
  assert.match(document.querySelector('.visual-output pre').textContent, /nothing printed yet/);
  assert.equal(document.querySelector('iframe').getAttribute('sandbox'), 'allow-scripts');
  assert.match(status(), /do not mark a course lesson complete/);
  assert.doesNotMatch(document.body.textContent, /Build it yourself in PyCharm|Go deeper into|PREDICT BEFORE YOU RUN/);
  assert.equal(document.querySelector('.lab-technical-workbench').open, false, 'Code is revealed on request after the concept, not used as its picture');
  await clickNode(document.querySelector('.lab-technical-workbench > summary'));
  assert.equal(document.querySelector('.lab-technical-workbench').open, true);

  for (const concept of pythonConcepts) {
    const beforeMarks = acknowledged.length;
    await openRoom(concept.id);
    assert.equal(acknowledged.length, beforeMarks, 'Opening a concept is not a reading acknowledgement');
    const mark = document.querySelector('[data-reading-id]');
    assert.equal(mark.dataset.readingId, concept.id, 'Only the active concept has its own reading action');
    await clickNode(mark);
    assert.equal(acknowledged.at(-1), concept.id);

    assert.equal(room(concept.id).getAttribute('aria-pressed'), 'true');
    assert.equal(document.querySelectorAll('.python-concept-room > h4 > button[aria-expanded="true"]').length, 1);
    assert.equal(document.querySelectorAll('.python-room-content:not([hidden])').length, 1);
    assert.ok([...document.querySelectorAll('.concept-explanation [data-technical-reading]')].map(p => p.textContent).join(' ').includes(concept.short.replace(/`/g, '')), 'Original technical concept remains visible beside plain counterparts');
    assert.equal(document.querySelector('.lab-inputs, .what-if-intro, input[type=number]'), null, 'No cosmetic swap panel returns in any concept room');
    const picture = document.querySelector('.imagination-card svg[role="img"]');
    assert.ok(picture, 'An actual inline drawing is visible for every concept, not just an imagination prompt');
    assert.ok(picture.querySelector('title')?.textContent);
    assert.ok(picture.querySelector('desc')?.textContent);
    assert.ok(picture.querySelectorAll('path, rect, circle').length > 4);
    assert.equal(document.querySelector('.picture-analogy').open, false, 'The analogy is optional supporting prose');
    assert.equal(document.querySelector('.technical-picture').open, false, 'Code-state diagrams are secondary to the metaphor');
    assert.equal(document.querySelector('.imagination-card > svg, .imagination-card > figure svg, .imagination-card > div svg') === null, false, 'The primary conceptual drawing is not hidden in a technical details panel');
    assert.equal(document.querySelectorAll('.deeper-grid section').length, 0);
  }
  await clickNode(document.querySelector('[aria-label="Explain = on line 1"]'));
  assert.equal(room('assignment').getAttribute('aria-expanded'), 'true');
  assert.match(document.querySelector('.code-part-detail').textContent, /right, then bind/);
  await clickNode(document.querySelector('[aria-label="Explain print on line 3"]'));
  assert.equal(room('output').getAttribute('aria-expanded'), 'true');
  assert.match(document.querySelector('.code-part-detail').textContent, /built-in function/);

  await act(async () => { const back = button('Back one line'); back.click(); back.click(); });
  assert.match(document.querySelector('.lab-state').textContent, /Before running/);
  await click('Restart walkthrough');
  assert.match(document.querySelector('.lab-state').textContent, /No names are bound yet/);
  assert.equal(button('Back one line').disabled, true);
  for (let index = 1; index <= 3; index++) {
    await click('Next instruction');
    assert.match(document.querySelector('.lab-state').textContent, new RegExp('After line ' + index));
  }
  assert.equal(button('Next instruction').disabled, true);
  assert.equal(document.querySelector('.visual-output pre').textContent, 'Pepper is 5 years old.');
  await click('Back one line');
  assert.match(document.querySelector('.visual-output pre').textContent, /nothing printed yet/);
  await act(async () => { const next = button('Next instruction'); next.click(); next.click(); });
  assert.match(document.querySelector('.lab-state').textContent, /After line 3/);
  assert.doesNotMatch(document.querySelector('.lab-state').textContent, /After line 4/);

  assert.equal(document.querySelector('.lab-prediction'), null);
  assert.equal(document.querySelector('.lab-deeper'), null);
  runtime.results.push(passed(['Pepper is 5 years old.']));
  await click('Run actual Python');
  assert.equal(actualOutput(), 'Pepper is 5 years old.');
  assert.match(status(), /confirmed the output/);
  assert.equal(runtime.calls.at(-1).lesson.runtime, 'python');
  assert.notDeepEqual(runtime.calls.at(-1).lesson.checks, lesson.checks);
  assert.equal(runtime.calls.at(-1).code, makePythonExperiment('greeting', 'Pepper', 5).code);

  await click('Two names, one object');
  assert.equal(actualOutput(), undefined, 'Example changes invalidate visible results');
  assert.equal(document.querySelector('.prediction-correct'), null, 'Example changes invalidate predictions');
  assert.match(document.querySelector('.lab-state').textContent, /Before running/);
  assert.match(document.querySelector('pre[aria-label="Pepper example source"]').textContent, /original_name/);
  await click('Shared Pepper example');
  assert.match(document.querySelector('pre[aria-label="Pepper example source"]').textContent, /pet_age = 5/);

  // Same-tick double clicks must launch one runtime even before rerender.
  const double = pending();
  const beforeDouble = runtime.calls.length;
  await act(async () => { const run = button('Run actual Python'); run.click(); run.click(); });
  assert.equal(runtime.calls.length, beforeDouble + 1, 'Double clicks start exactly one run');
  assert.equal(button('Running Python…').disabled, true);
  await click('Stop');
  assert.equal(runtime.calls.at(-1).signal.aborted, true);
  assert.match(status(), /Run stopped/);
  await act(async () => double.resolve(passed(['STALE STOP RESULT'])));
  assert.equal(actualOutput(), undefined);
  assert.match(status(), /Run stopped/);

  // A late reply cannot overwrite a subsequent execution of another example.
  const stale = pending();
  await click('Run actual Python');
  const oldSignal = runtime.calls.at(-1).signal;
  await click('Text versus numbers');
  assert.equal(oldSignal.aborted, true);
  const latest = pending();
  await click('Run actual Python');
  await act(async () => stale.resolve(passed(['STALE EDIT RESULT'])));
  assert.equal(actualOutput(), undefined);
  assert.equal(button('Running Python…').disabled, true, 'An old run cannot clear the current busy state');
  await act(async () => latest.resolve(passed(['51'])));
  assert.equal(actualOutput(), '51');
  assert.match(status(), /confirmed the output/);

  // The six rooms retain the shared experiment, but removing its iframe must
  // cancel any active run and late replies must not revive a hidden execution.
  await openRoom('names');
  assert.equal(actualOutput(), '51');
  assert.equal(document.querySelector('.experiment-tabs button[aria-pressed=true]').textContent, 'Text versus numbers');
  const collapsed = pending();
  await click('Run actual Python');
  const collapseSignal = runtime.calls.at(-1).signal;
  await clickNode(room('names'));
  assert.equal(collapseSignal.aborted, true);
  assert.equal(document.querySelector('iframe'), null);
  assert.equal(document.querySelector('.python-room-content:not([hidden])'), null);
  await openRoom('names');
  assert.equal(document.querySelector('.experiment-tabs button[aria-pressed=true]').textContent, 'Text versus numbers');
  assert.equal(document.querySelector('.lab-inputs'), null);
  assert.match(status(), /Run stopped/);
  await act(async () => collapsed.resolve(passed(['STALE COLLAPSED RESULT'])));
  assert.equal(actualOutput(), undefined);
  const switched = pending();
  await click('Run actual Python');
  const switchSignal = runtime.calls.at(-1).signal;
  await openRoom('output');
  assert.equal(switchSignal.aborted, true);
  assert.equal(button('Run actual Python').disabled, false);
  await act(async () => switched.resolve(passed(['STALE ROOM RESULT'])));
  assert.equal(actualOutput(), undefined);
  assert.equal(document.querySelectorAll('iframe').length, 1);

  // Missing checks or mismatched output cannot be called verified success.
  runtime.results.push({ output: ['51'], checks: [] });
  await click('Run actual Python');
  assert.doesNotMatch(status(), /confirmed the output/);
  runtime.results.push(passed(['Wrong output despite a passed check']));
  await click('Run actual Python');
  assert.doesNotMatch(status(), /confirmed the output/);
  runtime.results.push({ output: [], checks: [], error: 'Python failed intentionally' });
  await click('Run actual Python');
  assert.match(actualOutput(), /Python failed intentionally/);
  assert.match(status(), /could not finish/);
  runtime.results.push(() => { throw new Error('Runtime unavailable fixture'); });
  await click('Run actual Python');
  assert.match(status(), /Runtime unavailable fixture/);
  assert.equal(button('Run actual Python').disabled, false);

  await click('Two names, one object');
  assert.equal(room('names').getAttribute('aria-expanded'), 'true', 'Tag what-if opens the matching metaphor');
  assert.equal(actualOutput(), undefined);
  await click('Next instruction');
  await click('Next instruction');
  assert.equal(document.querySelectorAll('.reference-row').length, 1, 'Two name tags share one value card');
  assert.deepEqual([...document.querySelectorAll('.reference-row .name-tag')].map(el => el.textContent), ['pet_name', 'original_name']);
  assert.equal(document.querySelector('.reference-row .value-object small').textContent, 'str · text · text1');
  await click('Next instruction');
  assert.deepEqual(Object.fromEntries([...document.querySelectorAll('.reference-row')].map(el => [el.querySelector('.name-tag').textContent, el.querySelector('.value-object strong').textContent])), {original_name:'"Pepper"', pet_name:'"PEPPER"'});
  assert.equal(document.querySelector('.prediction-options'), null);

  await click('Text versus numbers');
  assert.equal(room('strings').getAttribute('aria-expanded'), 'true', 'Text what-if opens the matching metaphor');
  await click('Next instruction');
  assert.match(document.querySelector('.reference-row').textContent, /str · text/);
  await click('Next instruction');
  assert.equal(document.querySelector('.visual-output pre').textContent, '51');
  assert.equal(document.querySelector('.prediction-options'), null);
  await click('Copy code');
  assert.equal(clipboard.copied.at(-1), makePythonExperiment('types', 'Pepper', 5).code);
  assert.ok(button('Code copied'));
  await click('Shared Pepper example');
  assert.ok(button('Copy code'), 'Example changes reset copied status');
  let finishCopy;
  clipboard.pending = new Promise(resolve => { finishCopy = resolve; });
  await click('Copy code');
  await click('Two names, one object');
  await act(async () => finishCopy());
  clipboard.pending = null;
  assert.ok(button('Copy code'), 'An old clipboard operation cannot mark different code as copied');
  clipboard.fail = true;
  await click('Copy code');
  assert.match(status(), /Clipboard access is unavailable/);
  clipboard.fail = false;
  await click('Download .py');
  assert.equal(downloads.at(-1).download, 'pepper_concept_lab.py');
  const downloadText = await blobs.get(downloads.at(-1).href).text();
  assert.match(downloadText, /Predict the output before running/);
  assert.doesNotMatch(downloadText, /change one thing|new pet profile|write a new version/);
  assert.ok(downloadText.includes(makePythonExperiment('rebind', 'Pepper', 5).code));
  assert.match(status(), /separate from your saved course project/);
  await act(async () => { await new Promise(resolve => setTimeout(resolve, 1050)); });
  assert.ok(revoked.includes(downloads.at(-1).href), 'Download object URLs are released');

  const unmounted = pending();
  await click('Run actual Python');
  const unmountSignal = runtime.calls.at(-1).signal;
  await act(async () => root.unmount());
  root = null;
  assert.equal(unmountSignal.aborted, true, 'Unmount cancels the active runtime');
  await act(async () => unmounted.resolve(passed(['STALE UNMOUNT RESULT'])));
  assert.equal(document.getElementById('mount').textContent, '');
  assert.deepEqual(lesson, originalLesson, 'The original Pepper lesson remains unchanged');
  assert.equal(externalRequests.length, 0, 'No official progress, XP, project, or reset endpoint is called');
  root = createRoot(document.getElementById('mount'));
  await act(async () => root.render(React.createElement(Lab, {lesson, simple:true})));
  const simpleText = document.getElementById('mount').textContent;
  for (const removed of ['In simple words', 'Words in this step', 'Words in this explanation', 'More ways to explore', 'Explore the full example']) assert.ok(!simpleText.includes(removed), removed + ' removed');
  assert.equal((simpleText.match(/A program is a list of instructions the computer follows\./g) || []).length, 1);
  assert.equal(document.querySelector('[data-lesson-reference]'),null,'Repeated core teaching is not hidden in a duplicate optional panel');
  let sawWhy=false,sawCode=false;
  for(let step=0;step<10 && !(sawWhy&&sawCode);step++){
    const visible=document.querySelector('[data-step-primary]').closest('section');
    sawWhy ||= visible.textContent.includes('This one uses print to show the word Hello on the screen.');
    sawCode ||= [...visible.querySelectorAll('pre code')].some(code=>code.textContent.trim()==='print("Hello")');
    if(sawWhy&&sawCode)break;
    const next=document.querySelector('[data-step-primary]');
    assert.equal(next.disabled,false,'Essential explanation precedes required practice');
    await clickNode(next);
  }
  assert.ok(sawWhy,'Program explanation remains in visible sequential teaching');
  assert.ok(sawCode,'Hello example remains in visible sequential teaching');
  assert.ok(document.querySelector('[data-step-primary]'));
  console.log('Passed all six expandable concept rooms, token explanations, bounded trace navigation, removed cosmetic swaps, removed prediction/deeper panels, example invalidation, actual Python verification, double clicks, stop/unmount/room cancellation, collapse/reopen retention, stale run/copy rejection, error handling, copy/download, and original-project/progress isolation.');
} finally {
  if (root) await act(async () => root.unmount());
  dom.window.close();
  delete globalThis.__conceptLabRuntimeFixture;
  URL.createObjectURL = originalCreateObjectURL;
  URL.revokeObjectURL = originalRevokeObjectURL;
  await rm(temp, { recursive: true, force: true });
}
