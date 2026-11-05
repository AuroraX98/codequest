import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import {createRequire} from 'node:module';
import ts from 'typescript';

const require = createRequire(import.meta.url);
const cache = new Map();
function load(file) {
  if (cache.has(file)) return cache.get(file);
  const source = readFileSync(file, 'utf8');
  if (file.endsWith('.json')) return JSON.parse(source);
  const module = {exports: {}};
  const compiled = ts.transpileModule(source, {compilerOptions: {
    module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true
  }}).outputText;
  const resolve = name => {
    if (!name.startsWith('.')) return require(name);
    return load(path.resolve(path.dirname(file), name.endsWith('.json') ? name : name + '.ts'));
  };
  vm.runInNewContext(compiled, {module, exports: module.exports, require: resolve});
  cache.set(file, module.exports);
  return module.exports;
}

const lessons = load('content/lessons.json');
const terms = load('content/terminology.json');
const units = load('content/catalog.json').units;
const courseOrder = load('lib/course-learning-order.ts').courseLearningOrder;
const ordered = courseOrder(units);
const {buildLessonSteps} = load('lib/lesson-step-flow.ts');
const {codeAnatomy} = load('lib/code-anatomy.ts');
const expected = [
  ['comment', 'python-93', 'python-01', 'Start a comment'],
  ['keyword', 'python-94', 'python-03', 'Keyword'],
  ['api-key', 'python-95', 'python-21', 'Setting name'],
  ['boilerplate', 'java-73', 'java-01', 'Program frame'],
  ['rubber-duck-debugging', 'developer-toolkit-25', 'developer-toolkit-02', 'Take two away'],
  ['refactoring', 'developer-toolkit-26', 'developer-toolkit-07', 'Same total'],
  ['technical-debt', 'developer-toolkit-27', 'developer-toolkit-08', 'Second copy'],
  ['hotfix', 'developer-toolkit-28', 'developer-toolkit-09', 'Add the fixed line'],
  ['pull-request', 'developer-toolkit-29', 'developer-toolkit-10', 'Proposed line'],
  ['lgtm', 'developer-toolkit-30', 'developer-toolkit-29', 'Review message'],
];
const newIds = new Set(expected.map(row => row[1]));
const original = units.filter(unit => !newIds.has(unit.id));
assert.deepEqual(ordered.filter(unit => !newIds.has(unit.id)).map(unit => unit.id), courseOrder(original).map(unit => unit.id));
for (const [termId, id, after, focus] of expected) {
  const term = terms.find(t => t.id === termId);
  const lesson = lessons.find(l => l.id === id);
  const unit = units.find(u => u.id === id);
  const route = ordered.filter(u => u.track === unit.track);
  assert.equal(route[route.findIndex(u => u.id === id) - 1].id, after, id);
  assert.equal(lesson.learningMode, 'concept');
  assert.equal(lesson.explanation.length, 1);
  assert.equal(term.links.length, 1);
  assert.deepEqual(term.languages, [unit.track]);
  const link = term.links[0];
  assert.equal(link.lessonId, id);
  assert.equal(link.paragraph, 0);
  assert.equal(link.evidence, term.meaning);
  assert.ok(lesson.explanation[0].startsWith(term.meaning));
  assert.equal(load('content/' + unit.track + '-reviewed-headings.json')[id][0], link.idea);
  const steps = buildLessonSteps(lesson.explanation[0], lesson.runtime, {authoredOnly: true});
  const examples = steps.filter(step => step.kind === 'example');
  assert.equal(examples.length, 1, id);
  const [{code, language}] = examples;
  assert.equal(code, link.example + '\n');
  const visual = codeAnatomy(code, language);
  assert.ok(visual.lines.flatMap(line => line.tokens).some(part => part.label === focus), id);
  for (const line of visual.lines) {
    assert.equal(line.tokens.map(part => part.text).join(''), line.text);
    for (const part of line.tokens) {
      assert.equal(code.slice(part.from, part.to), part.text);
      assert.ok(part.label && part.plainExplanation);
    }
  }
  assert.ok(lesson.quiz.choices[lesson.quiz.answer]);
}
assert.deepEqual(terms.filter(t => !t.links?.length).map(t => t.id).sort(), ['bikeshedding','yak-shaving']);
console.log('All ten terms have one lesson, one reader example, specific visual labels, a quiz, and their exact course link. Both general references remain.');
