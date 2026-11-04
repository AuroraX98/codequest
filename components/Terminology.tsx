"use client";
import {useEffect,useId,useState} from 'react';
import {ArrowRight,LayoutGrid,List} from 'lucide-react';
import {compareCourseNames} from "../lib/course-order";
import {studyLabel} from '../lib/study-label';
import {terminology,terminologyCategories,terminologyCategoryLabels,terminologyMatches,terminologyInLanguage,taughtTermLinks,readTerminologyState,defaultTerminologyState,type TermLink} from '../lib/terminology';
import type {Lesson} from '../lib/types';
export default function Terminology({scope,lessons,languageNames,onStudy}:{scope:string;lessons:Lesson[];languageNames:Record<string,string>;onStudy:(link:TermLink)=>void}) {
 const uid=useId(),key=scope?`codequest-terminology:${scope}`:'';
 const [state,setState]=useState(defaultTerminologyState),[loadedKey,setLoadedKey]=useState('');
 // eslint-disable-next-line react-hooks/set-state-in-effect -- Restore account-specific browser filters after hydration before persisting them.
 useEffect(()=>{setLoadedKey('');try{setState(readTerminologyState(key?localStorage.getItem(key):null));}catch{setState({...defaultTerminologyState});}setLoadedKey(key);},[key]);
 useEffect(()=>{if(key&&loadedKey===key)try{localStorage.setItem(key,JSON.stringify(state));}catch{}},[key,loadedKey,state]);
 const visible=terminology.filter(t=>(state.category==='all'||t.category===state.category)&&terminologyInLanguage(t,state.language)&&terminologyMatches(t,state.query));
 return <section className="terminology" aria-labelledby={uid+'-title'}>
  <div className="page-title"><p className="eyebrow">LOOK SOMETHING UP</p><h1 id={uid+'-title'}>Terminology</h1><p>Clear meanings for coding, software and AI words—including common slang. This collection has {terminology.length} terms, not every term you might encounter.</p></div>
  <div className="terminology-toolbar">
   <label htmlFor={uid+'-search'}>Find a term, abbreviation or meaning<input id={uid+'-search'} type="search" maxLength={160} value={state.query} onChange={e=>setState(s=>({...s,query:e.target.value}))} placeholder="Try API, debugging, token…" /></label>
   <label htmlFor={uid+'-category'}>Category<select id={uid+'-category'} value={state.category} onChange={e=>setState(s=>({...s,category:e.target.value}))}><option value="all">All categories</option>{terminologyCategories.map(c=><option key={c} value={c}>{terminologyCategoryLabels[c]??c}</option>)}</select></label>
   <label htmlFor={uid+'-language'}>Language or course<select id={uid+'-language'} value={state.language} onChange={e=>setState(s=>({...s,language:e.target.value}))}><option value="all">All languages and courses</option>{Object.entries(languageNames).sort((a,b)=>compareCourseNames(a[1],b[1])).map(([key,name])=><option key={key} value={key}>{name}</option>)}</select></label>
   <div className="terminology-view" role="group" aria-label="Terminology display">
    <button type="button" className="secondary" aria-pressed={state.view==='list'} onClick={()=>setState(s=>({...s,view:'list'}))}><List size={18}/>List</button>
    <button type="button" className="secondary" aria-pressed={state.view==='tiles'} onClick={()=>setState(s=>({...s,view:'tiles'}))}><LayoutGrid size={18}/>Tiles</button>
   </div>
  </div>
  <p className="muted terminology-summary" role="status">{visible.length} of {terminology.length} terms{state.language!=='all'?` · ${languageNames[state.language]??state.language} and shared concepts · Study links stay in this course`:''} · Search and display choices stay on this device.</p>
  <div className={'terminology-results '+state.view}>
   {visible.map(term=><article className={'panel terminology-entry'+(state.selectedId===term.id?' recently-viewed':'')} key={term.id} data-term-id={term.id}>
    <div className="terminology-heading"><h2>{term.name}</h2><span className="small-tag">{terminologyCategoryLabels[term.category]??term.category}</span>{state.language!=='all'&&!term.languages?.length&&<span className="small-tag">Shared concept</span>}{term.kind==='slang'&&<span className="small-tag">Slang / informal</span>}{term.kind==='acronym'&&<span className="small-tag">Abbreviation</span>}</div>
    <p>{term.meaning}</p>
    {term.context&&<p className="terminology-context"><strong>Context: </strong>{term.context}</p>}
    {term.example&&<p className="terminology-example"><strong>Example: </strong>{term.example}</p>}
    {!!term.aliases.filter(a=>a.toLowerCase()!==term.name.toLowerCase()).length&&<p className="muted terminology-aliases">Also look for: {term.aliases.filter(a=>a.toLowerCase()!==term.name.toLowerCase()).join(' · ')}</p>}
    {!!taughtTermLinks(term,lessons,state.language).length&&<div className="project-study-links">{taughtTermLinks(term,lessons,state.language).map(link=><button type="button" className="secondary project-study-button" key={link.lessonId+':'+link.paragraph+':'+(link.concept??'')} onClick={()=>{setState(s=>({...s,selectedId:term.id}));onStudy(link);}}>{studyLabel(lessons.find(l=>l.id===link.lessonId)!.title)}<ArrowRight size={16}/></button>)}</div>}
   </article>)}
  </div>
  {!visible.length&&<div className="panel"><p>No term matches those filters. Try a shorter word or another category.</p><button type="button" className="secondary" onClick={()=>setState(s=>({...s,query:'',category:'all',language:'all'}))}>Clear filters</button></div>}
 </section>;
}
