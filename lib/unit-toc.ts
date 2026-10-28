import {additionalUnitContents} from "./additional-unit-contents";
import {getLessonHeadings} from './lesson-headings';
import type {Lesson} from './types';
export type UnitContentsEntry={label:string;paragraphIndex:number};
/** Ordinary headings retain their real paragraph targets; pure code belongs to its preceding idea. */
export function getUnitContents(lesson:Lesson):UnitContentsEntry[] {
 if(additionalUnitContents[lesson.id])return additionalUnitContents[lesson.id].map(entry=>({...entry}));
 return getLessonHeadings(lesson.id).flatMap((label,paragraphIndex)=>{
  const prose=lesson.explanation[paragraphIndex]?.replace(/```[\s\S]*?```/g,'').trim();
  return paragraphIndex===0||prose?[{label,paragraphIndex}]:[];
 });
}
