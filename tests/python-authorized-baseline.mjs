import fs from 'node:fs';
import {historicalRemainingBaseline} from './remaining-historical-baseline.mjs';
const swiftCoreDeltas=JSON.parse(fs.readFileSync('docs/swift-core-v1/existing-field-deltas.json','utf8'));
export function historicalSwiftCoreBaseline(value){
 if(!Array.isArray(value))return value;const rows=historicalRemainingBaseline(value);
 for(const d of [...swiftCoreDeltas].reverse()){const row=rows.find(x=>x?.id===d.id&&(d.kind==='lesson'?Array.isArray(x.explanation):'track' in x));if(!row)continue;const path=d.field.split('.');let cur=row;for(const k of path.slice(0,-1))cur=cur[k];const k=path.at(-1);if(JSON.stringify(cur[k])===JSON.stringify(d.after)){if(d.before===null&&d.kind==='unit'&&k==='prerequisite_ids')delete cur[k];else cur[k]=structuredClone(d.before);}}
 return rows;
}

const sqlCoreDeltas=JSON.parse(fs.readFileSync('docs/sql-core-v1/existing-field-deltas.json','utf8'));
export function historicalSQLCoreBaseline(value){
 if(!Array.isArray(value))return value;const rows=historicalSwiftCoreBaseline(value);
 for(const d of [...sqlCoreDeltas].reverse()){const row=rows.find(x=>x?.id===d.id&&(d.kind==='lesson'?Array.isArray(x.explanation):'track' in x));if(!row)continue;const path=d.field.split('.');let cur=row;for(const k of path.slice(0,-1))cur=cur[k];const k=path.at(-1);if(JSON.stringify(cur[k])===JSON.stringify(d.after)){if(d.before===null&&d.kind==='unit'&&k==='prerequisite_ids')delete cur[k];else cur[k]=structuredClone(d.before);}}
 return rows;
}

const reactCoreDeltas=JSON.parse(fs.readFileSync('docs/react-core-v1/existing-field-deltas.json','utf8'));
export function historicalReactCoreBaseline(value){
 if(!Array.isArray(value))return value;const rows=historicalSQLCoreBaseline(value);
 for(const d of [...reactCoreDeltas].reverse()){const row=rows.find(x=>x?.id===d.id&&(d.kind==='lesson'?Array.isArray(x.explanation):'track' in x));if(!row)continue;let cur=row;for(const k of d.path.slice(0,-1))cur=cur[k];const k=d.path.at(-1);if(JSON.stringify(cur[k])===JSON.stringify(d.after)){if(d.before===null&&d.kind==='unit'&&k==='prerequisite_ids')delete cur[k];else cur[k]=structuredClone(d.before);}}
 return rows;
}

const reactRunnerDeltas=JSON.parse(fs.readFileSync('docs/react-runner-scope-v1/existing-check-deltas.json','utf8'));
export function historicalReactRunnerBaseline(value){
 if(!Array.isArray(value))return value;const rows=historicalReactCoreBaseline(value);
 for(const d of reactRunnerDeltas){const l=rows.find(l=>l?.id===d.id&&Array.isArray(l.checks));if(!l)continue;const i=Number(d.path.split('.')[1]);if(l.checks[i].expression===d.after)l.checks[i].expression=d.before;}
 return rows;
}

const tsDeltas=JSON.parse(fs.readFileSync('docs/typescript-core-v1/existing-field-deltas.json','utf8'));
export function historicalTypeScriptBaseline(value){
 if(!Array.isArray(value))return value;
 const rows=historicalReactRunnerBaseline(value);
 for(const d of [...tsDeltas].reverse()){
  const row=rows.find(x=>x?.id===d.id&&(d.target==='lesson'?Array.isArray(x.explanation):'track' in x));if(!row)continue;
  const path=d.path.split('.');let cur=row;for(const k of path.slice(0,-1))cur=cur[k];const key=path.at(-1);
  if(JSON.stringify(cur[key])===JSON.stringify(d.after)){if(d.operation==='add')delete cur[key];else cur[key]=structuredClone(d.before);}
 }
 return rows;
}

const cssDeltas=JSON.parse(fs.readFileSync('docs/css-core-v1/existing-field-deltas.json','utf8'));
export function historicalCSSBaseline(value){
 if(!Array.isArray(value))return value;
 const rows=historicalTypeScriptBaseline(value);
 for(const d of [...cssDeltas].reverse()){
  const row=rows.find(x=>x?.id===d.id&&(d.kind==='lesson'?Array.isArray(x.explanation):'track' in x));if(!row)continue;
  let cur=row;for(const k of d.path.slice(0,-1))cur=cur[k];const key=d.path.at(-1);
  if(JSON.stringify(cur[key])===JSON.stringify(d.after)){if(d.before===null&&d.kind==='unit'&&key==='prerequisite_ids')delete cur[key];else cur[key]=structuredClone(d.before);}
 }
 return rows;
}

const htmlDeltas=JSON.parse(fs.readFileSync('docs/html-core-v1/existing-field-deltas.json','utf8'));
export function historicalHTMLBaseline(value){
 if(!Array.isArray(value))return value;
 const rows=historicalCSSBaseline(value);
 for(const d of [...htmlDeltas].reverse()){
  const row=rows.find(x=>x?.id===d.id&&(d.kind==='lesson'?Array.isArray(x.explanation):'track' in x));
  if(row&&JSON.stringify(row[d.field])===JSON.stringify(d.after))row[d.field]=structuredClone(d.before);
 }
 return rows;
}

const javascriptDeltas=JSON.parse(fs.readFileSync('docs/javascript-core-v1/existing-field-deltas.json','utf8'));
export function historicalJavaScriptBaseline(value){
 if(!Array.isArray(value))return value;
 const rows=historicalHTMLBaseline(value);
 for(const d of [...javascriptDeltas].reverse()){const row=rows.find(x=>x?.id===d.id&&Array.isArray(x.explanation));if(row&&row.explanation[d.paragraph]===d.after)row.explanation[d.paragraph]=d.before;}
 return rows;
}
const original11Deltas=JSON.parse(fs.readFileSync('docs/original11-function-remediation/paragraph-deltas.json','utf8'));
export function historicalOriginal11Baseline(value){
 if(!Array.isArray(value))return value;
 const rows=historicalJavaScriptBaseline(value);
 for(const d of [...original11Deltas].reverse()){const row=rows.find(x=>x?.id===d.lessonId&&Array.isArray(x.explanation));if(row&&row.explanation[d.paragraph]===d.after)row.explanation[d.paragraph]=d.before;}
 return rows;
}
const benchmarkDeltas=JSON.parse(fs.readFileSync('docs/python-benchmark-v1/authorized-deltas.json','utf8'));
export function historicalBenchmarkBaseline(value){
 if(!Array.isArray(value))return value;
 const rows=historicalOriginal11Baseline(value);
 for(const d of [...benchmarkDeltas].reverse()){
  const row=rows.find(x=>x?.id===d.id&&(d.kind==='paragraph'?Array.isArray(x.explanation):'track' in x));
  if(!row)continue;
  if(d.kind==='paragraph'&&row.explanation[d.paragraph]===d.after)row.explanation[d.paragraph]=d.before;
  if(d.kind==='unit'&&JSON.stringify(row[d.field])===JSON.stringify(d.after)){if(d.beforePresent===false)delete row[d.field];else row[d.field]=d.before;}
 }
 return rows;
}
const sixDeltas=JSON.parse(fs.readFileSync('docs/six-course-function-remediation/paragraph-deltas.json','utf8'));
export function historicalSixCourseBaseline(value){
 if(!Array.isArray(value))return value;
 const rows=historicalBenchmarkBaseline(value);
 for(const d of [...sixDeltas].reverse()){const row=rows.find(x=>x?.id===d.lessonId&&Array.isArray(x.explanation));if(row&&row.explanation[d.paragraph]===d.after)row.explanation[d.paragraph]=d.before;}
 return rows;
}
const cDeltas=JSON.parse(fs.readFileSync('docs/c-family-function-remediation/paragraph-deltas.json','utf8'));
export function historicalCFamilyBaseline(value){
 if(!Array.isArray(value))return value;
 const rows=historicalSixCourseBaseline(value);
 for(const d of [...cDeltas].reverse()){
  const row=rows.find(x=>x?.id===d.lessonId&&Array.isArray(x.explanation));
  if(row&&row.explanation[d.paragraph]===d.after)row.explanation[d.paragraph]=d.before;
 }
 return rows;
}
const deltas=JSON.parse(fs.readFileSync('docs/python-core-v1/existing-field-deltas.json','utf8'));
/** Reconstruct historical content only for historical preservation hashes.
 * The Python core suite separately asserts every authorized after-value. */
export function historicalPythonBaseline(value){
 if(!Array.isArray(value))return value;
 const rows=historicalCFamilyBaseline(value);
 for(const d of [...deltas].reverse()){
  const row=rows.find(x=>x?.id===d.id && (d.kind==='lesson'?'explanation' in x:'track' in x));
  if(row && JSON.stringify(row[d.field])===JSON.stringify(d.after))row[d.field]=d.before;
 }
 for(const row of rows)if(row?.track==='python'&&['python-39','python-41'].includes(row.id))row.level='beginner';
 return rows;
}
