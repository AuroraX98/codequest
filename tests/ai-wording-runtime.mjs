import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const lessons=JSON.parse(fs.readFileSync('content/lessons.json','utf8')).filter(l=>l.id.startsWith('ai-'));
const expected=JSON.parse(fs.readFileSync('docs/ai-wording-v1/example-outputs.json','utf8'));
const results=[];
for(const l of lessons){
 const blocks=[...l.explanation.join('\n').matchAll(/```javascript\n([\s\S]*?)\n```/g)];
 assert.equal(blocks.length,1,l.id);
 assert.equal(l.learningMode,'concept');assert.equal(l.solution,'');assert.equal(l.starter,'');assert.equal(l.checks.length,0);
 const output=[];vm.runInNewContext(blocks[0][1],{console:{log:(...xs)=>output.push(xs.map(String).join(' '))}},{timeout:1500});
 assert.deepEqual(output,expected[l.id],l.id);
 results.push({id:l.id,output,passed:true});
}
assert.equal(results.length,32);
fs.writeFileSync('docs/ai-wording-v1/runtime-results.json',JSON.stringify({status:'PASS',runtime:process.version,examples:32,results,limits:['These execute the displayed teaching examples, not trained AI models.','No remote AI services, data uploads, or paid API calls were used.']},null,2)+'\n');
console.log('PASS: all 32 exact AI examples produced their expected outputs; concept-only assessments remain intact.');
