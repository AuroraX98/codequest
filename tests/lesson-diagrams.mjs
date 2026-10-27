import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, writeFile, rm, symlink } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import ts from 'typescript';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { JSDOM } from 'jsdom';

const cwd = path.resolve(new URL('..', import.meta.url).pathname);
const temp = await mkdtemp(path.join(tmpdir(), 'codequest-diagrams-'));
const files = ['lib/diagram-drawing.ts', 'lib/diagram-web-platform.ts', 'lib/diagram-javascript-python.ts', 'lib/diagram-sql-swift-typescript.ts', 'lib/lesson-diagrams.ts', 'lib/lesson-visuals.ts', 'components/LessonDiagram.tsx'];
const passed = [];
const failures = [];
const check = async (name, fn) => { try { await fn(); passed.push(name); } catch (error) { failures.push({ name, error }); } };
try {
  await symlink(path.join(cwd, 'node_modules'), path.join(temp, 'node_modules'), process.platform === 'win32' ? 'junction' : 'dir');
  for (const file of files) {
    const src = await readFile(path.join(cwd, file), 'utf8');
    const { outputText, diagnostics } = ts.transpileModule(src, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext, jsx: ts.JsxEmit.ReactJSX }, reportDiagnostics: true });
    assert.equal((diagnostics || []).filter(d => d.category === ts.DiagnosticCategory.Error).length, 0, file);
    const out = path.join(temp, file.replace(/\.tsx?$/, '.mjs'));
    await mkdir(path.dirname(out), { recursive: true });
    await writeFile(out, outputText.replace(/from\s+(['"])(\.\.?\/[^'"]+)\1/g, 'from "$2.mjs"'));
  }
  const { lessonVisuals } = await import(pathToFileURL(path.join(temp, 'lib/lesson-visuals.mjs')).href);
  const { lessonDiagrams, authoredLessonDiagrams, getLessonDiagram } = await import(pathToFileURL(path.join(temp, 'lib/lesson-diagrams.mjs')).href);
  const { default: LessonDiagram } = await import(pathToFileURL(path.join(temp, 'components/LessonDiagram.mjs')).href);
  await check('exactly one authored diagram for every one of the 115 lesson guides', () => {
    assert.equal(Object.keys(lessonVisuals).length, 115);
    assert.equal(authoredLessonDiagrams.length, 115);
    assert.equal(new Set(authoredLessonDiagrams.map(d => d.id)).size, 115, 'duplicate diagram IDs');
    assert.deepEqual(Object.keys(lessonDiagrams).sort(), Object.keys(lessonVisuals).sort());
    assert.equal(getLessonDiagram('unsupported-lesson'), undefined);
    assert.equal(getLessonDiagram('__proto__'), undefined);
    assert.equal(getLessonDiagram('constructor'), undefined);
  });
  await check('authored scenes have bounded geometry and useful accessible explanations', () => {
    for (const d of authoredLessonDiagrams) {
      assert.equal(d.width, 760, d.id);
      assert.ok(d.height >= 260 && d.height <= 650, d.id + ': height');
      assert.ok(d.description.length >= 90, d.id + ': description is not meaningful');
      assert.ok(d.marks.length >= 10, d.id + ': insufficient diagram geometry');
      assert.ok(d.marks.some(m => ['line', 'path', 'rect', 'circle'].includes(m.kind)), d.id);
      for (const m of d.marks) {
        if (m.kind === 'path') { assert.ok(m.d.startsWith('M '), d.id + ': invalid path'); continue; }
        assert.ok(Number.isFinite(m.x) && Number.isFinite(m.y), d.id + ': non-finite position');
        assert.ok(m.x >= 0 && m.x <= d.width && m.y >= 0 && m.y <= d.height, d.id + ': anchor outside scene ' + JSON.stringify(m));
        if (m.kind === 'rect') assert.ok(m.w > 0 && m.h > 0 && m.x + m.w <= d.width && m.y + m.h <= d.height, d.id + ': rect outside scene ' + JSON.stringify(m));
        if (m.kind === 'circle') assert.ok(m.x - m.r >= 0 && m.y - m.r >= 0 && m.x + m.r <= d.width && m.y + m.r <= d.height, d.id + ': circle outside');
        if (m.kind === 'line') assert.ok(m.x2 >= 0 && m.x2 <= d.width && m.y2 >= 0 && m.y2 <= d.height, d.id + ': line outside');
        if (m.kind === 'text') assert.ok(m.size >= 14 && m.size <= 32, d.id + ': readable text size');
      }
    }
  });
  await check('115 scenes render actual accessible SVG with valid arrow marker references', () => {
    for (const d of authoredLessonDiagrams) {
      const html = renderToStaticMarkup(React.createElement(LessonDiagram, { visual: lessonVisuals[d.id] }));
      const document = new JSDOM(html).window.document;
      const svg = document.querySelector('svg');
      assert.ok(svg, d.id + ': missing SVG');
      assert.equal(svg.getAttribute('role'), 'img', d.id);
      assert.equal(svg.querySelector('title').textContent, lessonVisuals[d.id].title);
      assert.equal(svg.querySelector('desc').textContent, d.description);
      for (const id of svg.getAttribute('aria-labelledby').split(' ')) assert.ok(document.getElementById(id), d.id + ': dangling accessible label');
      for (const shape of svg.querySelectorAll('[marker-end]')) {
        const id = shape.getAttribute('marker-end').slice(5, -1);
        assert.ok(document.getElementById(id), d.id + ': dangling arrow');
      }
      assert.ok(svg.querySelectorAll('rect, circle, line, path').length >= 4, d.id);
      assert.equal(document.querySelector('[role="region"]').getAttribute('tabindex'), '0');
      assert.match(svg.getAttribute('style'), /min-width:760px/);
      assert.match(document.querySelector('figcaption').textContent, /swipe sideways/);
      assert.equal(document.querySelectorAll('script, foreignObject, iframe, image').length, 0, d.id);
    }
  });
  await check('sibling diagrams have unique SVG identifiers and all IDs belong to actual lessons', async () => {
    const lessons = JSON.parse(await readFile(path.join(cwd, 'content/lessons.json'), 'utf8'));
    assert.deepEqual(Object.keys(lessonDiagrams).sort(), lessons.map(lesson => lesson.id).sort());
    const html = renderToStaticMarkup(React.createElement('div', null,
      React.createElement(LessonDiagram, { visual: lessonVisuals['css-02'] }),
      React.createElement(LessonDiagram, { visual: lessonVisuals['css-04'] }),
    ));
    const document = new JSDOM(html).window.document;
    const ids = [...document.querySelectorAll('[id]')].map(node => node.id);
    assert.equal(new Set(ids).size, ids.length, 'sibling arrows and accessible names cannot collide');
  });
  await check('diagram families are explicitly authored and not sourced from generic prose cards', async () => {
    assert.ok(new Set(authoredLessonDiagrams.map(d => d.family)).size >= 50);
    for (const file of files.filter(f => /diagram-(web|javascript|sql)/.test(f))) {
      const src = await readFile(path.join(cwd, file), 'utf8');
      assert.doesNotMatch(src, /visual\.items|guide\.items|lessonVisuals/);
      assert.match(src, /scene\("[a-z-]+-\d{2}"/);
    }
  });
  const labels = id => lessonDiagrams[id].marks.filter(m => m.kind === 'text').map(m => m.text).join(' | ');
  await check('CSS dimensions, wrapping and position diagrams encode the authored geometry', () => {
    const boxModel = lessonDiagrams['css-02'].marks.filter(m => m.kind === 'rect');
    assert.ok(boxModel.some(m => m.w === 656)); // 328px at 2x
    assert.ok(boxModel.some(m => m.w === 600)); // 300px at 2x
    assert.ok(boxModel.some(m => m.w === 544)); // 272px at 2x
    const grid = lessonDiagrams['css-04'].marks.filter(m => m.kind === 'rect');
    assert.equal(grid.filter(m => m.w === 150).length, 4);
    assert.equal(grid.filter(m => m.w === 12).length, 3);
    assert.match(labels('css-03'), /324px container.*212px container/);
    assert.match(labels('css-07'), /x = 160px.*y = 90px/);
  });
  await check('SQL scenes preserve rows, NULL, ties, and rollback values', () => {
    assert.match(labels('sql-05'), /Nora.*Garden Gate.*Nora.*Sea Path.*Luis.*Sky Notes.*Imani.*NULL/);
    assert.match(labels('sql-04'), /Music.*NULL/);
    assert.match(labels('sql-07'), /Art \/ 1.*10.*10.*3.*Art \/ 2.*25.*35.*1.*Art \/ 3.*25.*60.*1/);
    assert.match(labels('sql-09'), /ROLLBACK restores X = 8 and Y = 9/);
  });
  await check('audited grouping destinations, branch labels, and accessible phone preserve meaning', () => {
    const grouped = lessonDiagrams['sql-04'].marks.filter(m => m.kind === 'path');
    assert.ok(grouped.some(m => m.tone === 'green' && /L 350 99$/.test(m.d)), 'Art must target the center of its output row');
    assert.ok(grouped.some(m => m.tone === 'purple' && /L 350 135$/.test(m.d)), 'Music must target the center of its output row');
    const branches = lessonDiagrams['swift-03'];
    for (const [index, label] of ['drawing', 'knitting', 'origami', 'default'].entries()) {
      const rowY = 40 + index * 65;
      const mark = branches.marks.find(m => m.kind === 'text' && m.text === label);
      assert.ok(mark && mark.x === 375 && mark.y === rowY + 27.5, label + ': label stays inside its case boundary');
      assert.ok(branches.marks.some(m => m.kind === 'line' && m.x2 === 310 && m.y2 === rowY + 22.5), label + ': incoming branch terminates before label');
      assert.ok(branches.marks.some(m => m.kind === 'line' && m.x === 440 && m.x2 === 505 && m.y === rowY + 22.5 && m.y2 === m.y), label + ': result connection stays outside label');
    }
    assert.match(lessonDiagrams['sql-11'].description, /trimmed to 555 0100 with its internal space preserved/);
    assert.doesNotMatch(lessonDiagrams['sql-11'].description, /5550100/);
    assert.match(labels('sql-11'), /555 0100 · selected/);
  });
  await check('references, generic types and request guards retain their actual mechanisms', () => {
    assert.match(labels('swift-07'), /original.*sameObject.*separate.*Counter A.*0 → 1.*Counter B.*total: 0/);
    const shared = lessonDiagrams['swift-07'].marks.filter(m => m.kind === 'line' && m.x2 === 470 && m.y2 === 85);
    assert.equal(shared.length, 2, 'the two names must point to the same object');
    assert.match(labels('typescript-04'), /Shelf<number>.*11.*22.*Shelf<string>.*amber/);
    assert.match(labels('typescript-07'), /resolve 7 → return same loading-8 state/);
  });
  await check('diagrams are display-only and unknown lessons do not get fabricated illustrations', async () => {
    const component = await readFile(path.join(cwd, 'components/LessonDiagram.tsx'), 'utf8');
    assert.doesNotMatch(component, /fetch\(|localStorage|sessionStorage|indexedDB|dangerouslySetInnerHTML|eval\(/);
    assert.equal(renderToStaticMarkup(React.createElement(LessonDiagram, { visual: { id: 'unknown' } })), '');
  });
} finally { await rm(temp, { recursive: true, force: true }); }
for (const name of passed) console.log('PASS', name);
for (const { name, error } of failures) console.error('FAIL', name, '\n', error.stack || error);
console.log(`${passed.length} checks passed; ${failures.length} failed.`);
if (failures.length) process.exitCode = 1;
