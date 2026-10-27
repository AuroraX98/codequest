import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import ts from 'typescript';

const root = new URL('../', import.meta.url);
async function importTypescript(relative) {
  const source = await readFile(new URL(relative, root), 'utf8');
  const compiled = ts.transpileModule(source, {
    fileName: relative,
    reportDiagnostics: true,
    compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext },
  });
  assert.equal(compiled.diagnostics?.length ?? 0, 0, `Syntax diagnostics in ${relative}`);
  return import(`data:text/javascript;base64,${Buffer.from(compiled.outputText).toString('base64')}`);
}
const lessons = JSON.parse(await readFile(new URL('content/lessons.json', root), 'utf8'));
const catalog = JSON.parse(await readFile(new URL('content/catalog.json', root), 'utf8'));
const { lessonVisuals, getLessonVisual } = await importTypescript('lib/lesson-visuals.ts');
const ids = lessons.map(lesson => lesson.id).sort();
assert.equal(new Set(ids).size, lessons.length);
assert.deepEqual(Object.keys(lessonVisuals).sort(), ids, 'Exactly one guide for every current lesson, no phantom IDs');
assert.deepEqual(catalog.units.map(unit => unit.id).sort(), ids, 'Catalog and lesson IDs must agree');
const kinds = new Set(['sequence', 'compare', 'collection', 'branch', 'layers']);
const titles = new Set();
let coveredPages = 0;
for (const lesson of lessons) {
  const guide = lessonVisuals[lesson.id];
  assert.equal(guide.id, lesson.id);
  assert.ok(kinds.has(guide.kind), `${lesson.id}: supported presentation kind`);
  assert.ok(Number.isInteger(guide.paragraph) && guide.paragraph >= 0 && guide.paragraph < lesson.explanation.length,
    `${lesson.id}: explanation index must exist`);
  assert.ok(guide.title.length >= 10 && guide.title.length <= 90, `${lesson.id}: compact meaningful title`);
  assert.ok(!titles.has(guide.title), `${lesson.id}: no repeated generic titles`);
  titles.add(guide.title);
  assert.ok(guide.intro.length >= 24 && guide.intro.length <= 260, `${lesson.id}: bounded specific setup`);
  assert.ok(guide.takeaway.length >= 25 && guide.takeaway.length <= 270, `${lesson.id}: useful bounded conclusion`);
  assert.ok(!guide.limit || guide.limit.length <= 300, `${lesson.id}: bounded caveat`);
  assert.ok(guide.items.length >= 3 && guide.items.length <= 5, `${lesson.id}: scannable worked example`);
  assert.ok(new Set(guide.items.map(item => item.label)).size === guide.items.length, `${lesson.id}: distinct labels`);
  for (const item of guide.items) {
    assert.ok(item.label.length > 0 && item.label.length <= 100, `${lesson.id}: bounded label`);
    assert.ok(item.value.length >= 1 && item.value.length <= 190, `${lesson.id}: concrete bounded value`);
    assert.ok(item.detail && item.detail.length >= 12 && item.detail.length <= 220, `${lesson.id}: explain each example step`);
  }
  // These guards catch empty definition-card templates, not a substitute for editorial review.
  assert.ok(guide.items.filter(item => /[#0-9"'=:<>()[\]{}]|→|\.(js|md|json|sqlite)\b|\b(NULL|True|False|true|false|nil|undefined)\b/.test(item.label + ' ' + item.value) || (item.value.length >= 8 && lesson.explanation.join(' ').includes(item.value))).length >= 1,
    `${lesson.id}: at least one actual value, field, expression, or file in the worked guide`);
  const text = JSON.stringify(guide);
  assert.doesNotMatch(text, /<\s*\/?\s*(?:script|iframe|object|embed|img|svg|style|link|meta)\b/i, `${lesson.id}: no executable HTML markup`);
  assert.doesNotMatch(text, /(?:javascript:|data:text\/html|dangerouslySetInnerHTML|onerror\s*=|onload\s*=)/i, `${lesson.id}: no active HTML payload`);
  assert.doesNotMatch(text, /\b(?:TODO|TBD|Lorem ipsum|placeholder visual)\b/i);
  for (let paragraph = 0; paragraph < lesson.explanation.length; paragraph++) {
    if (paragraph === guide.paragraph) {
      assert.equal(getLessonVisual(lesson.id, paragraph), guide);
      coveredPages++;
    } else {
      assert.equal(getLessonVisual(lesson.id, paragraph), undefined, `${lesson.id}: do not repeat guide on unrelated pages`);
    }
  }
  assert.equal(getLessonVisual(lesson.id, -1), undefined);
  assert.equal(getLessonVisual(lesson.id, lesson.explanation.length), undefined);
  assert.equal(getLessonVisual(lesson.id, NaN), undefined);
}
for (const id of ['missing-lesson', '__proto__', 'constructor', 'toString']) assert.equal(getLessonVisual(id, 0), undefined);
const textOf = id => JSON.stringify(lessonVisuals[id]);
// Protect the most important beginner and language-specific accuracy boundaries.
assert.match(textOf('python-01'), /Pepper is 5 years old/);
assert.match(textOf('python-01'), /Names refer to values/);
assert.match(textOf('javascript-01'), /const prevents reassigning a name/);
assert.match(textOf('javascript-22'), /changed\[0\] === tasks\[0\] → true/);
assert.match(textOf('javascript-22'), /changed\[1\] === tasks\[1\] → false/);
assert.match(textOf('css-02'), /328px/);
assert.match(textOf('css-02'), /272px/);
assert.match(textOf('css-07'), /left edge/);
assert.match(textOf('python-06'), /stop is not included/);
assert.match(textOf('python-09'), /no index 0/);
assert.match(textOf('python-16'), /input order, not finishing order/);
assert.match(textOf('sql-04'), /COUNT\(minutes\): 1/);
assert.match(textOf('sql-05'), /Imani/);
assert.match(textOf('sql-07'), /rank 3/);
assert.match(textOf('swift-07'), /copies the reference, not the object/);
assert.match(textOf('typescript-05'), /not runtime loops or validation/);
assert.match(textOf('react-04'), /not a complete ARIA menu-widget/);
assert.match(textOf('backend-02'), /Separate reader process/);
assert.match(textOf('backend-05'), /Saved, but reload failed/);
assert.equal(coveredPages, lessons.length);
const tracks = Object.groupBy(catalog.units, unit => unit.track);
assert.equal(Object.keys(tracks).length, 10);
for (const [track, units] of Object.entries(tracks)) {
  assert.ok(units.every(unit => lessonVisuals[unit.id]), `${track}: full lesson-level guide coverage`);
}
console.log(`Passed ${lessons.length} guides across ${Object.keys(tracks).length} tracks: ${coveredPages}/${lessons.reduce((n, lesson) => n + lesson.explanation.length, 0)} explanation pages have a guide. Every page retains its original text; coverage is not every concept.`);

const { lessonHeadings, getLessonHeadings } = await importTypescript('lib/lesson-headings.ts');
assert.deepEqual(Object.keys(lessonHeadings).sort(), ids, 'Headings cover exactly the current lessons');
let headingCount = 0;
for (const lesson of lessons) {
  const headings = getLessonHeadings(lesson.id);
  assert.equal(headings.length, lesson.explanation.length, `${lesson.id}: one heading per original explanation page`);
  assert.equal(new Set(headings).size, headings.length, `${lesson.id}: every heading identifies its own section`);
  for (const heading of headings) {
    assert.equal(heading.trim(), heading);
    assert.ok(heading.length >= 10 && heading.length <= 65, `${lesson.id}: bounded meaningful heading: ${heading}`);
    assert.ok(heading.split(/\s+/).length >= 2);
    assert.doesNotMatch(heading, /^(?:step|part|page|section|example|explanation)\s*\d*$/i);
    assert.doesNotMatch(heading, /^(?:here is|this example|this complete|a second example|continue after|run this)\b/i);
    assert.doesNotMatch(heading, /\b(?:TODO|TBD|placeholder)\b|<[^>]*>/i);
  }
  const copy = getLessonHeadings(lesson.id);
  copy[0] = 'Not a saved heading';
  assert.notEqual(getLessonHeadings(lesson.id)[0], copy[0], 'Callers cannot mutate the saved titles');
  headingCount += headings.length;
}
for (const id of ['missing-lesson', '__proto__', 'constructor', 'toString']) assert.deepEqual(getLessonHeadings(id), []);
assert.equal(headingCount, lessons.reduce((n, lesson) => n + lesson.explanation.length, 0));
assert.deepEqual(getLessonHeadings('python-01'), [
  'Programs, values and text', 'Names and assignment', 'Calling print',
  'Building text with f-strings', 'Trace Pepper’s introduction',
  'Change inputs and compare', 'Reassignment and your first project',
]);
console.log(`Passed ${headingCount} authored section titles for ${lessons.length} lessons; no blank or numbered-placeholder headings.`);
