import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import vm from 'node:vm';
import ts from 'typescript';
function load(path, dependencies={}) { const exports={}; vm.runInNewContext(ts.transpileModule(readFileSync(path,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,{exports,require:id=>dependencies[id]}); return exports; }
const completion=load('lib/lesson-completion.ts');
const catalog=load('lib/project-catalog.ts');
const {courseProjects,missingProjectReading}=load('lib/course-projects.ts',{'./lesson-completion':completion,'./project-catalog':catalog});
const lessons=JSON.parse(readFileSync('content/lessons.json','utf8'));
const lesson=lessons.find(l=>l.id==='python-01');
assert.equal(courseProjects.length,10);
assert.equal(missingProjectReading(lesson,[]).length,6);
const records=completion.pythonBasicsReadingKeys.map(sectionKey=>({lessonId:lesson.id,sectionKey,checked:true,markedAt:'2026-01-01',updatedAt:'2026-01-01'}));
assert.equal(missingProjectReading(lesson,records).length,0);
assert.equal(missingProjectReading(lesson,[...records,{...records[0],checked:false,markedAt:null,updatedAt:'2026-02-01'}]).length,1);
assert.equal(JSON.stringify(courseProjects[0].steps.at(-1).checks),JSON.stringify(lesson.checks));
const sources=[['pet_name = "Milo"','pet_name = "Milo"\npet_age = 3','pet_name = "Milo"\npet_age = 3\nprint(pet_name, "is", pet_age, "years old.")'],['pet_age = 5','pet_age = 5\nnext_age = pet_age + 1','pet_age = 5\nnext_age = pet_age + 1\nprint(next_age)','pet_age = 8\nnext_age = pet_age + 1\nprint(next_age)']];
for (let p=0;p<sources.length;p++) for(let n=0;n<courseProjects[p].steps.length;n++) {
 const fixture={code:sources[p][n],checks:courseProjects[p].steps[n].checks};
 execFileSync('python',['-c',`import json,io,contextlib\nf=json.loads(${JSON.stringify(JSON.stringify(fixture))})\ns={}\no=io.StringIO()\nwith contextlib.redirect_stdout(o):exec(f['code'],s)\ns['__output']=o.getvalue().splitlines()\nassert all(eval(c['expression'],s) for c in f['checks'])`]);
}
const cq=readFileSync('components/CodeQuest.tsx','utf8');
assert.ok(!cq.includes('name: "Math"'));
assert.ok(!cq.includes('Try the math connection'));
for(const path of ['lib/learning-client.ts','app/api/quest/route.ts']) assert.ok(!readFileSync(path,'utf8').includes('math && !p.'));
console.log('Passed guided project steps in real Python, read-marker isolation/revocation, core proof alignment and global Math removal guards.');
