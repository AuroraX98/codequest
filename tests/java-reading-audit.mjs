import fs from 'node:fs';
import ts from 'typescript';
function compile(file,imports={}){
 const mod={exports:{}};
 const js=ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
 new Function('require','exports','module',js)(name=>imports[name]??{},mod.exports,mod);return mod.exports;
}
const ideas=compile('lib/lesson-ideas.ts');
const {shortLessonThoughts}=compile('lib/lesson-step-flow.ts',{'./lesson-ideas':ideas});
const lessons=JSON.parse(fs.readFileSync('content/lessons.json','utf8')).filter(l=>l.id.startsWith('java-'));
const short=[];
for(const lesson of lessons)for(const [i,section] of lesson.explanation.entries()){
 const prose=section.replace(/```[\s\S]*?```/g,'');
 for(const thought of shortLessonThoughts(prose))if(thought.length<35||/\?\s*$|\.\.\.$/.test(thought))short.push({lesson:lesson.id,paragraph:i,thought});
}
console.log(JSON.stringify(short,null,2));
