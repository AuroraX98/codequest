import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';

const lessons = JSON.parse(await readFile('content/lessons.json', 'utf8'));
assert.equal(lessons.length, 116);
assert.equal(lessons.filter(l => l.id.startsWith('python-')).length, 26);
for (const lesson of lessons) {
  assert.ok(lesson.steps.length >= 3, lesson.id);
  assert.ok(lesson.steps.every(step => typeof step === 'string' && step.trim()), lesson.id);
  assert.ok(lesson.quiz.question.trim(), lesson.id);
}
const invariant = structuredClone(lessons);
for (const lesson of invariant) { delete lesson.quiz; delete lesson.math; }
const canonical = x => Array.isArray(x) ? x.map(canonical) : x && typeof x === 'object'
  ? Object.fromEntries(Object.keys(x).sort().map(key => [key, canonical(x[key])])) : x;
assert.equal(createHash('sha256').update(JSON.stringify(canonical(invariant))).digest('hex'),
  '3596f5651a013ce3b9f212f15b300d4a55d3717d6460a70ff240bc1b330e6fc1',
  'Only quiz/math checks change; code, IDs, teaching explanations, project steps, checks and all other fields are exact');
const find = id => lessons.find(lesson => lesson.id === id);
const score = find('developer-toolkit-07');
assert.match(score.steps.join(' '), /Negative integers are allowed/);
assert.match(score.steps.join(' '), /Put your clampScore function in score\.mjs/);
assert.match(score.steps.join(' '), /node --test test\.mjs/);
assert.match(score.steps.join(' '), /Restore the working function/);
assert.ok(score.quiz.question.trim());
assert.ok(score.quiz.choices[score.quiz.answer]);
assert.match(find('developer-toolkit-08').steps.join(' '), /STORAGE_READY set to false/);
assert.match(find('backend-04').steps.join(' '), /at and just outside the allowed limits/);
assert.match(find('developer-toolkit-09').steps.join(' '), /project you are allowed to test/);
console.log(`Passed non-assessment curriculum invariant for all ${lessons.length} lessons and ${lessons.reduce((n,l)=>n+l.steps.length,0)} project steps, plus file-name, integer, boundary, recovery and safe-test wording checks.`);
