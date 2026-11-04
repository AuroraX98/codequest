import assert from 'node:assert/strict';
import fs from 'node:fs';
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const baseline=read('docs/wording-review/python-protected-fields.json');
const lessons=read('content/lessons.json').filter(l=>l.id.startsWith('python-'));
const route=read('content/python-route-plan.json').recommendedSeedOrder;
const headings=read('content/python-reviewed-headings.json');
const units=read('content/catalog.json').units;
const briefBaseline=read('docs/wording-review/python-project-briefs-baseline.json');
const briefReview=read('docs/wording-review/python-project-briefs-deltas.json');
assert.deepEqual(briefReview.reviewed,route,'Every Python exercise brief reviewed in course order');
for(const before of briefBaseline){
 const after=structuredClone(units.find(u=>u.id===before.id));
 for(const field of ['task','done_when'])after.project[field]=before.project[field];
 assert.deepEqual(after,before,`${before.id}: all other course metadata preserved`);
}
for(const change of briefReview.changes){
 assert.ok(['project.task','project.done_when'].includes(change.field));
 assert.equal(units.find(u=>u.id===change.lesson).project[change.field.split('.')[1]],change.after);
}
assert.equal(lessons.length,92);
assert.deepEqual(route,baseline.route);
let reviewed=0;
for(const before of baseline.lessons){
 const after=lessons.find(l=>l.id===before.id);
 assert.ok(after,before.id);
 for(const key of ['title','starter','solution','checks','runtime','filename'])assert.deepEqual(after[key],before[key],`${before.id}: ${key} preserved`);
 assert.equal(after.explanation.length,before.sectionCount,`${before.id}: section identities`);
 assert.equal(after.quiz.answer,before.quizAnswer,`${before.id}: quiz answer identity`);
 assert.equal(after.quiz.choices.length,before.quizChoices,`${before.id}: quiz choices`);
 const record=`docs/wording-review/${before.id}-deltas.json`;
 if(!fs.existsSync(record))continue;
 reviewed++;
 if(headings[before.id]){
  assert.equal(headings[before.id].length,after.explanation.length,`${before.id}: matching heading count`);
  assert.equal(new Set(headings[before.id].map(h=>h.toLowerCase().trim())).size,headings[before.id].length,`${before.id}: distinct navigation labels`);
 }
 const delta=read(record);
 for(const change of delta.changes){
  assert.ok(['explanation','summary','steps','quiz','hints'].includes(change.field),`${before.id}: only reviewed wording changes`);
  assert.deepEqual(after[change.field],change.after,`${before.id}: audit describes current source`);
 }
 for(const section of after.explanation){
  assert.equal((section.match(/^```/gm)||[]).length%2,0,`${before.id}: closed fences`);
  assert.ok(!/^\s*<(details|summary|pre|script|iframe)\b/im.test(section),`${before.id}: no unsupported HTML widgets`);
 }
 assert.ok(after.explanation.some(s=>s.includes('```python')),`${before.id}: actual code visual source`);
}
if(process.argv.includes('--complete')){
 assert.equal(reviewed,92,'Complete the entire Python course before publication');
 assert.equal(Object.keys(headings).length,92,'Review headings for the entire Python course before publication');
}
console.log(`PASS Python wording integrity: ${reviewed}/92 reviewed; course order, section identities, project code, checks and quiz answers preserved.`);
