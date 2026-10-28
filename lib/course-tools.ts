import type {Lesson,Unit} from './types';
import {pythonTools,type PythonTool} from './python-tools';
import {compareCourseNames,courseNames} from './course-order';
import {getUnitContents} from './unit-toc';
export type CourseTool=PythonTool & {track:string;lessonTitle:string;searchText:string};
export {courseNames} from "./course-order";
export function availableToolCourses(units:Unit[],lessons:Lesson[]){
 const ids=new Set(lessons.map(l=>l.id));
 return [...new Set(units.filter(u=>ids.has(u.id)).map(u=>u.track))].map(id=>({id,label:courseNames[id]??id})).sort((a,b)=>compareCourseNames(a.label,b.label));
}
/** References existing authored sections; never duplicates lessons or changes progress IDs. */
export function courseTools(units:Unit[],lessons:Lesson[],track:string):CourseTool[]{
 const byId=new Map(lessons.map(l=>[l.id,l]));
 if(track==='python')return pythonTools(units,lessons).map(item=>({...item,track,lessonTitle:byId.get(item.lessonId)!.title,searchText:item.hint}));
 return units.filter(u=>u.track===track).flatMap(unit=>{
  const lesson=byId.get(unit.id);if(!lesson)return [];
  const anchors=getUnitContents(lesson);
  return anchors.flatMap((anchor,index)=>{
   if(!lesson.explanation[anchor.paragraphIndex])return [];
   // Include the whole grouped section in search, not just incidental words elsewhere in a lesson.
   const end=anchors[index+1]?.paragraphIndex??lesson.explanation.length;
   return [{id:`course-tool-${track}-${unit.id}-${anchor.paragraphIndex}`,title:anchor.label,kind:'Concept' as const,lessonId:unit.id,paragraph:anchor.paragraphIndex,hint:lesson.title,level:unit.level,track,lessonTitle:lesson.title,searchText:lesson.explanation.slice(anchor.paragraphIndex,end).join(' ')}];
  });
 }).sort((a,b)=>['beginner','intermediate','advanced'].indexOf(a.level)-['beginner','intermediate','advanced'].indexOf(b.level));
}
export function matchCourseTool(item:CourseTool,query:string){
 const normalize=(s:string)=>s.toLowerCase().replace(/[()]/g,'');
 const haystack=normalize(`${item.title} ${item.kind} ${item.hint} ${item.lessonTitle} ${item.searchText}`);
 return normalize(query).trim().split(/\s+/).filter(Boolean).every(word=>haystack.includes(word));
}
