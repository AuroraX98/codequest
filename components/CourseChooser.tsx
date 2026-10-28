import type {ReactNode} from 'react';
import CourseDescription from './CourseDescription';
export default function CourseChooser({open,onToggle,onTools,track,name,children}:{open:boolean;onToggle:()=>void;onTools:()=>void;track:string;name:string;children:ReactNode}) {
 return <>
  <div className="segmented course-chooser-actions" role="group" aria-label="Learning path">
   <button type="button" className="selected" aria-pressed="true">Guided course</button>
   <button type="button" onClick={onTools}>Tools and concepts</button>
   <button type="button" id="course-chooser-toggle" aria-expanded={open} aria-controls="course-chooser" onClick={onToggle}>{open?'Hide courses':'Show courses'}</button>
  </div>
  <div id="course-chooser" hidden={!open}>{open?children:null}</div>
  {!open&&<section className="selected-course-overview panel" aria-labelledby="selected-course-heading">
   <h2 id="selected-course-heading" tabIndex={-1}>{name}</h2>
   <CourseDescription track={track}/>
  </section>}
 </>;
}
