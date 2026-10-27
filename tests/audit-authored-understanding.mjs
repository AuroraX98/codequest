import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
// Editorial audit covers every authored quiz and optional math check. Runtime project
// tasks are construction/application tasks, not token-recognition multiple choice.
const audit = {
  "changedQuiz": [
    "html-01",
    "html-03",
    "html-05",
    "html-06",
    "html-07",
    "html-08",
    "css-01",
    "css-03",
    "css-05",
    "css-06",
    "javascript-05",
    "javascript-06",
    "javascript-07",
    "javascript-08",
    "javascript-09",
    "javascript-11",
    "javascript-12",
    "javascript-14",
    "javascript-16",
    "javascript-17",
    "python-09",
    "python-19",
    "python-16",
    "python-21",
    "sql-01",
    "sql-02",
    "sql-08",
    "swift-01",
    "swift-03",
    "swift-04",
    "swift-05",
    "swift-06",
    "swift-07",
    "swift-08",
    "swift-09",
    "typescript-01",
    "typescript-02",
    "typescript-04",
    "typescript-05",
    "typescript-06",
    "react-04",
    "react-03",
    "react-05",
    "backend-03",
    "developer-toolkit-01",
    "developer-toolkit-02",
    "developer-toolkit-03",
    "developer-toolkit-04",
    "developer-toolkit-05",
    "developer-toolkit-09",
    "sql-10",
    "sql-12",
    "sql-13",
    "css-04",
    "javascript-10",
    "javascript-15",
    "python-01",
    "python-02",
    "python-06",
    "python-07",
    "python-10",
    "python-14",
    "python-15",
    "python-17",
    "python-18",
    "sql-06"
  ],
  "retainedQuiz": [
    "javascript-01",
    "html-02",
    "html-04",
    "css-02",
    "css-07",
    "javascript-02",
    "javascript-03",
    "javascript-04",
    "javascript-13",
    "javascript-18",
    "javascript-19",
    "python-03",
    "python-04",
    "python-05",
    "python-08",
    "python-11",
    "python-12",
    "python-13",
    "python-20",
    "sql-03",
    "sql-04",
    "sql-05",
    "sql-07",
    "sql-09",
    "swift-02",
    "swift-10",
    "swift-11",
    "swift-12",
    "typescript-03",
    "typescript-07",
    "react-01",
    "react-02",
    "react-06",
    "backend-01",
    "backend-02",
    "backend-04",
    "backend-05",
    "developer-toolkit-06",
    "developer-toolkit-07",
    "developer-toolkit-08",
    "javascript-20",
    "javascript-21",
    "javascript-22",
    "javascript-23",
    "python-22",
    "python-23",
    "python-24",
    "python-25",
    "sql-11",
    "python-input"
  ],
  "changedMath": [
    "css-04",
    "javascript-03",
    "javascript-04",
    "javascript-05",
    "javascript-07",
    "javascript-10",
    "javascript-12",
    "javascript-14",
    "javascript-17",
    "javascript-18",
    "python-01",
    "python-02",
    "python-06",
    "python-07",
    "python-10",
    "python-12",
    "python-14",
    "python-15",
    "python-18",
    "typescript-04",
    "backend-01",
    "developer-toolkit-02",
    "developer-toolkit-09",
    "typescript-06"
  ]
};
const lessons = JSON.parse(await readFile(new URL('../content/lessons.json', import.meta.url), 'utf8'));
const canonical = x => Array.isArray(x) ? x.map(canonical) : x && typeof x === 'object'
  ? Object.fromEntries(Object.keys(x).sort().map(k => [k, canonical(x[k])])) : x;
const baselineIds = new Set([...audit.changedQuiz, ...audit.retainedQuiz]);
const invariant = lessons.filter(l => baselineIds.has(l.id) && l.id !== "python-01").map(({quiz, ...l}) => ({...l, ...(l.math ? {math: Object.fromEntries(Object.entries(l.math).filter(([k]) => !['question','choices','answer','feedback'].includes(k)))} : {})}));
assert.equal(createHash('sha256').update(JSON.stringify(canonical(invariant))).digest('hex'), '16352a12b4165539e9e62fec637ac1698f396c748b3215a38ef468200776f59b', 'Original audited lesson source remains unchanged except deliberately revised Python Basics; ten additive lessons validated below');
assert.deepEqual([...audit.changedQuiz, ...audit.retainedQuiz].sort(), lessons.filter(l => baselineIds.has(l.id)).map(l => l.id).sort());
let mathCount = 0;
for (const lesson of lessons) {
  for (const [kind, check] of [['quiz', lesson.quiz], ['math', lesson.math]]) {
    if (!check) continue;
    if (kind === 'math') mathCount++;
    assert.ok(check.question.trim(), lesson.id + ': prompt');
    assert.ok(check.choices.length >= 2, lesson.id + ': choices');
    assert.equal(new Set(check.choices).size, check.choices.length, lesson.id + ': unique options');
    assert.ok(Number.isInteger(check.answer) && check.answer >= 0 && check.answer < check.choices.length, lesson.id + ': answer index');
    assert.ok((kind === 'quiz' ? check.explanation : check.feedback).trim(), lesson.id + ': why feedback');
  }
}
assert.equal(lessons.length, 126);
assert.equal(new Set(lessons.map(l => l.id)).size, lessons.length);
assert.equal(mathCount, 84);
const quiz = id => lessons.find(l => l.id === id).quiz;
const answer = id => {const q = quiz(id); return q.choices[q.answer];};
assert.equal(answer('javascript-05'), JSON.stringify(['map','water','hat'][1]));
assert.equal(answer('javascript-10'), String([15,30,50,25].filter(x => x >= 30).length));
assert.equal(answer('javascript-17'), ['Q','R','S'].slice(1)[0]);
assert.equal(answer('python-06'), JSON.stringify([2,5,9,14,20].slice(2,4)).replace(',', ', '));
assert.equal(answer('python-17'), String(Math.max(0, Math.min(10, -3))));
assert.equal(answer('sql-06'), String([60,80,100].filter(x => x > (60+80+100)/3)[0]));
assert.equal(answer('backend-03'), String((10+30)/2));
assert.equal(answer('typescript-01').startsWith('A type mismatch'), true);
assert.equal(answer('html-01'), 'park.html');
assert.equal(answer('javascript-12').startsWith('Nothing visible'), true);
console.log('126 quiz + 84 retained math records validated; original 115 unaffected lesson source invariant preserved, revised Python Basics and ten additive lessons covered by dedicated project/batch checks.');
