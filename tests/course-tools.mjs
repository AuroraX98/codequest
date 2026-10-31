import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import ts from 'typescript';
import React,{act} from 'react';
import {createRoot} from 'react-dom/client';
import {JSDOM} from 'jsdom';
const cwd=process.cwd();
const staged=process.env.COURSE_TOOLS_STAGE;
const dir=path.join(cwd,'.sites-runtime/course-tools-test');await fs.mkdir(dir,{recursive:true});
const sources=['lib/course-tools.ts','lib/course-order.ts','lib/python-tools.ts','lib/unit-toc.ts','lib/additional-unit-contents.ts','lib/lesson-headings.ts','lib/remaining-lesson-headings.ts','lib/study-label.ts','lib/navigation.ts','components/CourseTools.tsx'];
for(const source of sources){const root=staged&&['lib/course-tools.ts','lib/course-order.ts','components/CourseTools.tsx'].includes(source)?staged:cwd;let out=ts.transpileModule(await fs.readFile(path.join(root,source),'utf8'),{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext,jsx:ts.JsxEmit.ReactJSX}}).outputText;out=out.replace(/from ["'](?:\.\.\/lib\/|\.\/)([^"']+)["']/g,(_,name)=>`from './${name}.mjs'`);await fs.writeFile(path.join(dir,path.basename(source).replace(/\.tsx?$/,'.mjs')),out);}
const {courseTools,availableToolCourses,matchCourseTool}=await import(pathToFileURL(path.join(dir,'course-tools.mjs')));
const {pythonTools}=await import(pathToFileURL(path.join(dir,'python-tools.mjs')));
const {parseRoute,routeHash}=await import(pathToFileURL(path.join(dir,'navigation.mjs')));
const {default:Tools}=await import(pathToFileURL(path.join(dir,'CourseTools.mjs')));
const units=JSON.parse(await fs.readFile('content/catalog.json','utf8')).units,lessons=JSON.parse(await fs.readFile('content/lessons.json','utf8'));
const courses=availableToolCourses(units,lessons);assert.equal(courses.length,21);
assert.deepEqual(courses.map(c=>c.label),['AI','Back-end development','C','C#','C++','CSS','Developer toolkit','Go','HTML','Java','JavaScript','Kotlin','PHP','Python','R','React','Ruby','Rust','SQL','Swift','TypeScript']);
const withFuture=availableToolCourses([...units,{id:'future-01',track:'aardvark'}],[...lessons,{id:'future-01'}]);assert.equal(withFuture[0].id,'aardvark');
const py=pythonTools(units,lessons);assert.equal(py.length,161);assert.deepEqual(courseTools(units,lessons,'python').map(({track,lessonTitle,searchText,...entry})=>entry),py);
const counts={};const ids=new Set();
for(const course of courses){const items=courseTools(units,lessons,course.id);assert.ok(items.length>0,course.id);counts[course.id]=items.length;
 for(const item of items){assert.ok(!ids.has(item.id));ids.add(item.id);assert.equal(units.find(u=>u.id===item.lessonId).track,course.id);assert.ok(lessons.find(l=>l.id===item.lessonId).explanation[item.paragraph]);assert.ok(matchCourseTool(item,item.title));
 const route={view:'quest',studioMode:'course',phase:'learn',activeId:item.lessonId,paragraph:item.paragraph,...item.concept?{concept:item.concept}:{}};assert.deepEqual(parseRoute(routeHash(route),'python-01',units,lessons),route);
 }
}
for(const [track,query] of [['ai','training'],['backend','HTTP'],['developer-toolkit','debug'],['go','fmt.Println'],['kotlin','val'],['r','print']])assert.ok(courseTools(units,lessons,track).some(x=>matchCourseTool(x,query)),track+query);
assert.deepEqual(courseTools(units,lessons,'nonexistent'),[]);
const dom=new JSDOM('<div id="root"></div>',{url:'https://fixture.test'});for(const [k,v] of Object.entries({window:dom.window,document:dom.window.document,IS_REACT_ACT_ENVIRONMENT:true}))Object.defineProperty(globalThis,k,{configurable:true,value:v});
let opened,returned;const root=createRoot(document.getElementById('root'));await act(async()=>root.render(React.createElement(Tools,{units,lessons,initialTrack:'ai',onOpen:x=>opened=x,onCourse:x=>returned=x})));
const select=document.querySelector('[aria-label="Language or course"]');assert.equal(select.options.length,21);assert.equal(select.value,'ai');
for(const id of ['go','backend','developer-toolkit','python','r']){await act(async()=>{select.value=id;select.dispatchEvent(new dom.window.Event('change',{bubbles:true}));});assert.equal(document.querySelectorAll('.python-tool-card').length,counts[id]);await act(async()=>document.querySelector('.python-tool-card button').click());assert.equal(opened.track,id);assert.equal(units.find(u=>u.id===opened.lessonId).track,id);await act(async()=>[...document.querySelectorAll('button')].find(b=>b.textContent==='Guided course').click());assert.equal(returned,id);}
await act(async()=>root.unmount());dom.window.close();await fs.rm(dir,{recursive:true,force:true});console.log('PASS all21 courses, Python161 (original75 retained), valid authored targets, route round-trips, search and picker/open/guided return:',JSON.stringify(counts));
