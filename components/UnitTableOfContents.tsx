"use client";
import {useId} from 'react';
import {X} from 'lucide-react';
export default function UnitTableOfContents({open,title,items,active,onClose,onSelect}:{open:boolean;title:string;items:{label:string;paragraphIndex:number}[];active:number;onClose:()=>void;onSelect:(index:number)=>void}) {
 const id=useId();
 if(!open)return null;
 return <aside id="unit-table-of-contents" className="unit-toc-drawer" aria-labelledby={id+'-title'} onKeyDown={e=>{if(e.key==='Escape'){e.stopPropagation();onClose();}}}>
  <div className="unit-toc-inner"><div className="unit-toc-heading"><h2 id={id+'-title'}>Table of Contents</h2><button type="button" className="secondary" onClick={onClose} aria-label="Close Table of Contents"><X size={20}/></button></div>
  <p>{title}</p><nav aria-label={'Ideas in '+title}>{items.map((item,index)=><button type="button" key={index} className="secondary" aria-current={active>=item.paragraphIndex && (index===items.length-1 || active<items[index+1].paragraphIndex)?'step':undefined} onClick={()=>onSelect(item.paragraphIndex)}><span>{index+1}.</span><span>{item.label}</span></button>)}</nav></div>
 </aside>;
}
