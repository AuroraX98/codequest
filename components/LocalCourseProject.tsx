"use client";
import {useState} from "react";
import type {Lesson,Unit} from "../lib/types";
import {localProjectExamples,localProjectStorageKey} from "../lib/local-course-project";
import {codeLabel} from "../lib/code-language";
import {studyLabel} from "../lib/study-label";
import CodeEditor from "./CodeEditor";
import LessonContent from "./LessonContent";

export default function LocalCourseProject({unit,lesson,scope,onStudy,initialExampleId}:{unit:Unit;lesson:Lesson;scope:string;initialExampleId?:string;onStudy:(paragraph:number)=>void}){
  const examples=localProjectExamples(unit,lesson);
  const storageKey=localProjectStorageKey(scope,lesson.id);
  const [drafts,setDrafts]=useState<Record<string,string>>(()=>{
    if(!scope)return {};
    try{const value=JSON.parse(localStorage.getItem(storageKey)??"{}");return value&&typeof value==="object"?Object.fromEntries(Object.entries(value).filter(([,v])=>typeof v==="string")) as Record<string,string>:{};}catch{return {};}
  });
  const [selected,setSelected]=useState(examples.find(e=>e.id===initialExampleId)?.id??examples[0]?.id??"");
  const [status,setStatus]=useState("Local practice is separate from course completion.");
  const [showSetup,setShowSetup]=useState(false);
  const example=examples.find(e=>e.id===selected)??examples[0];
  const code=example?(drafts[example.id]??example.code):"";
  const change=(value:string)=>{
    if(!example)return;
    const next={...drafts,[example.id]:value};setDrafts(next);
    if(!scope){setStatus("Account storage is not ready. Keep this tab open or download your work.");return;}
    try{localStorage.setItem(storageKey,JSON.stringify(next));setStatus("Draft saved on this device only.");}
    catch{setStatus("Could not save this draft on this device. Copy or download it before leaving.");}
  };
  const download=()=>{
    if(!example)return;
    const url=URL.createObjectURL(new Blob([code],{type:"text/plain;charset=utf-8"}));
    const a=document.createElement("a");a.href=url;a.download=example.filename;a.click();
    setTimeout(()=>URL.revokeObjectURL(url),1000);setStatus("Downloaded your current code. It has not been run or checked.");
  };
  return <section className="build-area" aria-label="Local course project">
    <div className="panel project-brief">
      <span className="small-tag">{example?"LOCAL PRACTICE":"EXPLORATION PROJECT"}</span>
      <h3>{unit.project.title}</h3><p>{unit.project.task}</p>
      <p>{unit.project.done_when}</p>
      {!example&&<><p>This lesson practices ideas and reasoning, not a computer program. There is no code editor for this project; the guidance above is the activity.</p><button className="secondary project-study-button" onClick={()=>onStudy(0)}>{studyLabel(lesson.title)}</button></>}
    </div>
    {example&&<>
      <div className="panel project-skills">
        <h3>Skills this project uses</h3>
        <p>Use the selected example and its lesson instructions. Local edits and downloads do not mark this lesson complete.</p>
        <button className="secondary project-study-button" onClick={()=>onStudy(example.paragraph)}>{studyLabel(lesson.title)}</button>
        {examples.length>1&&<label>Worked example<select value={example.id} onChange={e=>{setSelected(e.target.value);setShowSetup(false);setStatus("Each example keeps its own device-local draft.");}}>{examples.map(e=><option key={e.id} value={e.id}>{e.title} · {codeLabel(e.language)} · {e.standalone?"complete example":"snippet / fragment"}</option>)}</select></label>}
        <p>{example.standalone?"The lesson identifies this as a complete local example. Its stated toolchain, files and setup are still required.":"This is an illustrative snippet or fragment, not a certified standalone program. Read its context before adapting it into a local project."}</p>
      </div>
      <div id="course-project-editor" tabIndex={-1} className="panel editor-panel">
        <div className="editor-bar"><span>{codeLabel(example.language)} · {example.filename}</span><span role="status">{status}</span></div>
        <CodeEditor code={code} onChange={change} runtime={example.language} unitId={`${scope}:${lesson.id}:${example.id}`} />
        <div className="editor-actions">
          <button className="primary" aria-expanded={showSetup} onClick={()=>setShowSetup(v=>!v)}>Run locally guidance</button>
          <button className="secondary" onClick={async()=>{try{await navigator.clipboard.writeText(code);setStatus("Copied your current code.");}catch{setStatus("Copy was unavailable. Select the code or download it.");}}}>Copy code</button>
          <button className="secondary" onClick={download}>Download code</button>
        </div>
        <p className="notice">This lesson has no in-app {codeLabel(example.language)} runner. These controls do not execute code, verify results or award completion.</p>
        {showSetup&&<div className="local-project-setup">
          <h3>Use the lesson’s local setup</h3>
          <p>{example.standalone?"Save the example with the filename required by its instructions, install the stated tools, and follow the commands taught in the lesson. Downloading alone does not run it.":"Do not assume this fragment can run by itself. First supply the surrounding program and setup taught in the lesson; no generic run command is provided."}</p>
          {example.context&&<LessonContent text={example.context} runtime={example.language}/>}
          {lesson.externalNotes&&<p>{lesson.externalNotes}</p>}
          <button className="secondary project-study-button" onClick={()=>onStudy(example.paragraph)}>Read setup and example context</button>
        </div>}
      </div>
    </>}
  </section>;
}
