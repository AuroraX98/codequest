import data from '../content/terminology.json';
import catalog from '../content/catalog.json';
import type {Lesson} from './types';
import type {ConceptId} from './python-concepts';
export type TermLink = {lessonId:string; paragraph:number; concept?:ConceptId};
export type TerminologyEntry = {id:string; name:string; aliases:string[]; category:string; kind:'term'|'acronym'|'slang'; meaning:string; example?:string; context?:string; links?:TermLink[]; languages?:string[]};
export const terminology = data as TerminologyEntry[];
export const terminologyCategoryLabels:Record<string,string>={basics:'Basics',collections:'Collections & objects',data:'Data & databases',flow:'Program flow',software:'Software & teamwork','language-tools':'Language features',web:'Web & interfaces',security:'Security & access',ai:'AI & machine learning'};
export const terminologyCategories = [...new Set(terminology.map(t=>t.category))].sort();
const normalize = (s:string) => s.normalize('NFKC').toLowerCase().replace(/[()]/g,'').trim();
export function terminologyMatches(term:TerminologyEntry, query:string) {
  const haystack=normalize([term.name,...term.aliases,term.meaning,term.category,term.context??''].join(' '));
  return normalize(query).split(/\s+/).filter(Boolean).every(word=>haystack.includes(word));
}
const lessonCourses=new Map(catalog.units.map(unit=>[unit.id,unit.track]));
export function terminologyInLanguage(term:TerminologyEntry,language:string){return language==='all'||!term.languages?.length||term.languages.includes(language);}
export function taughtTermLinks(term:TerminologyEntry, lessons:Lesson[], language='all'):TermLink[] {
 return (term.links??[]).filter(link=> {const lesson=lessons.find(l=>l.id===link.lessonId);return lesson&&(language==='all'||lessonCourses.get(link.lessonId)===language)&&Number.isInteger(link.paragraph)&&link.paragraph>=0&&link.paragraph<lesson.explanation.length;});
}
export type TerminologyState={query:string;category:string;language:string;view:'list'|'tiles';selectedId:string};
export const defaultTerminologyState:TerminologyState={query:'',category:'all',language:'all',view:'tiles',selectedId:''};
export function readTerminologyState(raw:string|null):TerminologyState {
 try {const s=JSON.parse(raw??'null'); if(!s||typeof s!=='object')return {...defaultTerminologyState};return {query:typeof s.query==='string'?s.query.slice(0,160):'',category:terminologyCategories.includes(s.category)?s.category:'all',language:typeof s.language==='string'&&/^[a-z-]{1,30}$/.test(s.language)?s.language:'all',view:s.view==='list'?'list':'tiles',selectedId:terminology.some(t=>t.id===s.selectedId)?s.selectedId:''};}catch{return {...defaultTerminologyState};}
}
