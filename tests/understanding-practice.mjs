import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import ts from 'typescript';
const output = ts.transpileModule(await readFile('lib/understanding-practice.ts','utf8'), {compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText;
const {understandingPractice: practice} = await import('data:text/javascript;base64,'+Buffer.from(output).toString('base64'));
const cases = [
 ['pet_age = 5','python','The value becomes text instead of a number.'],
 ['const points = 12;','javascript','The value becomes text instead of a number.'],
 ['pet_age = 5\npet_age = pet_age + 1','python','6'],
 ['count = 0\ncount = count + 0','python','0'],
 ['pet_name = "Pepper"\nprint(pet_name)','python','pet_name'],
 ['print("Hello")','python','Hello'],
 ['print("Pepper", 5)','python','Pepper 5'],
 ['console.log("Hi");','javascript','Hi'],
 ['pet_name = "Pepper"','python','"Clover"'],
 ['<a href="guide.html">Read guide</a>','html','Its visible words change; its destination stays the same.'],
 ['.note { color: blue; }','css','The same matched elements get a different text color.'],
];
for (const [code,lang,answer] of cases) {
 const q=practice(code,lang);
 assert.equal(q.answer,answer,code);
 assert.ok(q.options.length>=3 && q.options.length<=4,code);
 assert.equal(new Set(q.options).size,q.options.length);
 assert.equal(q.options.filter(x=>x===answer).length,1);
 assert.doesNotMatch(q.question,/Choose the|function name|opening parenthesis/);
 assert.ok(q.explanation.length>35);
 assert.ok(q.preparation.length>0,code+": essential rule is explicit");
 assert.ok(q.preparation.every(text=>typeof text === "string" && text.length>20));
}
for(const [code,lang] of [['unknown(state)','python'],['print("Hi")','output'],['x = 9007199254740992\nx = x + 1','python'],['if condition:\n  print("Hi")','python'],['SELECT * FROM unknown','sql']]) assert.equal(practice(code,lang),null);
const python = code=>execFileSync('python',['-c',code],{encoding:'utf8'}).trim();
assert.equal(python('pet_age = 5\npet_age = pet_age + 1\nprint(pet_age)'), '6');
assert.equal(python('pet_name = "Pepper"\nprint("pet_name")'), 'pet_name');
assert.equal(python('print("Pepper", 5)'), 'Pepper 5');
assert.equal(python('pet_age = "5"\nprint(type(pet_age).__name__)'), 'str');
console.log('PASS 11 reviewed microchecks, 5 safe omissions, unique keys/WHY, and 4 CPython answer verifications.');
