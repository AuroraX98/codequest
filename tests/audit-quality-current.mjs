import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {createRequire} from 'node:module';
import ts from 'typescript';
const require=createRequire(import.meta.url),cache=new Map();
function load(file){file=path.resolve(file);if(cache.has(file))return cache.get(file).exports;const mod={exports:{}};cache.set(file,mod);if(file.endsWith('.json'))return mod.exports=JSON.parse(fs.readFileSync(file,'utf8'));const code=ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,esModuleInterop:true}}).outputText;vm.runInNewContext(code,{module:mod,exports:mod.exports,require:p=>p.startsWith('.')?load(path.resolve(path.dirname(file),p)+(path.extname(p)?'':'.ts')):require(p),console});return mod.exports;}
const {buildLessonSteps}=load('lib/lesson-step-flow.ts'),{plainLessonExplanation}=load('lib/plain-language.ts'),{getLessonHeadings}=load('lib/lesson-headings.ts');
const lessons=JSON.parse(fs.readFileSync('content/lessons.json')),units=JSON.parse(fs.readFileSync('content/catalog.json')).units;
const counts={lessons:lessons.length,sections:0,thoughts:0,reviewedPlainThoughts:0,examples:0,understandingChecks:0},issues=[],courses={};
for(const l of lessons){const u=units.find(u=>u.id===l.id);if(!u)throw Error(l.id);const c=courses[u.track]??={lessons:0,sections:0,examples:0,topics:[]};c.lessons++;c.topics.push({id:l.id,title:l.title,topic:u.topic,level:u.level,mode:l.learningMode??'code'});if(getLessonHeadings(l.id).length!==l.explanation.length)throw Error('Headings '+l.id);
for(const [i,text]of l.explanation.entries()){counts.sections++;c.sections++;const steps=buildLessonSteps(text,l.runtime);for(const s of steps){if(s.kind==='example'){counts.examples++;c.examples++;}if(s.kind==='practice')counts.understandingChecks++;if(s.kind==='explain'){counts.thoughts++;const plain=plainLessonExplanation(s.text,l.runtime);if(plain)counts.reviewedPlainThoughts++;const shown=plain??s.text;const words=shown.split(/\s+/).length;if(words>55)issues.push({lesson:l.id,section:i,words,text:shown});}}}}
issues.sort((a,b)=>b.words-a.words);
const report={date:'2026-11-03',source:'version77 plus reviewed changes',counts,courses,longThoughts:issues};fs.writeFileSync(process.argv[2]??'docs/quality-current.json',JSON.stringify(report,null,2));console.log(JSON.stringify({counts,courses:Object.fromEntries(Object.entries(courses).map(([k,v])=>[k,v.lessons])),longThoughts:issues.length,worst:issues.slice(0,5)},null,2));
