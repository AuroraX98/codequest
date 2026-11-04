import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import ts from 'typescript';
const require=createRequire(import.meta.url);
const lessons=JSON.parse(fs.readFileSync('content/lessons.json','utf8')).filter(l=>l.runtime==='typescript');
const frame=fs.readFileSync('public/runner/frame.html','utf8');
const start=frame.indexOf('function createContractCompiler');
const source=frame.slice(start,frame.indexOf('const engine=',start)).trim().replaceAll('\\\\','\\');
const prototype=fs.readFileSync('docs/typescript-core-v1/compiler-prototype/contract-engine.cjs','utf8');
assert.equal(source,prototype.slice(prototype.indexOf('function createContractCompiler'),prototype.indexOf('module.exports')).trim(),'Use the exact production compiler contract engine');
const createContractCompiler=vm.runInNewContext('('+source+')');
const libdir=path.dirname(require.resolve('typescript'));
const names=['lib.es5.d.ts','lib.es2015.core.d.ts','lib.es2015.collection.d.ts','lib.es2015.iterable.d.ts','lib.es2015.symbol.d.ts','lib.es2015.symbol.wellknown.d.ts','lib.es2015.promise.d.ts','lib.es2015.proxy.d.ts','lib.es2015.reflect.d.ts','lib.es2015.generator.d.ts','lib.dom.d.ts','lib.decorators.d.ts','lib.decorators.legacy.d.ts'];
const engine=createContractCompiler(ts,Object.fromEntries(names.map(n=>[n,fs.readFileSync(path.join(libdir,n),'utf8')])));
const report={compiler:ts.version,examples:[],projects:[],localWorkflows:[]};
const failures=[];
async function run(code,checks=[]){
 const output=[];const context=vm.createContext({console:{log:(...a)=>output.push(a.map(v=>typeof v==='object'?JSON.stringify(v):String(v)).join(' '))},setTimeout,clearTimeout,__checks:checks,__output:output});
 const result=await new vm.Script('(async()=>{'+code+'\nconst results=[];for(const c of __checks){try{results.push({label:c.label,passed:!!(await eval(c.expression))})}catch(e){results.push({label:c.label,passed:false,error:e.message})}}return results;})()').runInContext(context,{timeout:3000});
 await new Promise(resolve=>setTimeout(resolve,10));
 return {output,checks:result};
}
for(const lesson of lessons){
 if(!['typescript-15','typescript-48'].includes(lesson.id))for(const [index,paragraph] of lesson.explanation.entries())for(const m of paragraph.matchAll(/```typescript\n([\s\S]*?)```/g)){
  const errors=engine.compile(m[1]);let result={};
  if(!errors.length)try{result=await run(ts.transpileModule(m[1].replace(/^export /gm,''),{compilerOptions:engine.options}).outputText);}catch(error){result={error:String(error)};}
  const row={id:lesson.id,section:index+1,passed:!errors.length&&!result.error,errors,...result};report.examples.push(row);if(!row.passed)failures.push(row);
 }
 if(lesson.learningMode!=='concept'){
  const assessment=engine.check(lesson.solution,lesson.typeAssertions||[],lesson.typeVariants||[]);
  let runtime={};if(assessment.ok)try{runtime=await run(engine.transpileLearnerOnly(lesson.solution),lesson.checks);}catch(error){runtime={error:String(error)};}
  const row={id:lesson.id,passed:assessment.ok&&!runtime.error&&runtime.checks?.every(c=>c.passed),typeChecks:assessment.checks,errors:assessment.errors,...runtime};report.projects.push(row);if(!row.passed)failures.push(row);
 }
 if(report.projects.length%10===0)console.log('Checked through '+lesson.id);
}
const scratch=path.resolve('../typescript-native');fs.mkdirSync(scratch,{recursive:true});
for(const id of ['typescript-15','typescript-48','typescript-49']){
 const lesson=lessons.find(l=>l.id===id),dir=path.join(scratch,id);fs.mkdirSync(dir,{recursive:true});fs.writeFileSync(path.join(dir,'package.json'),'{"type":"commonjs"}');
 const files={};for(const paragraph of lesson.explanation){const name=paragraph.match(/(?:File: `|as )(\w[\w.-]*\.(?:ts|js|json))/)?.[1];const code=paragraph.match(/```\w+\n([\s\S]*?)```/)?.[1];if(name&&code){files[name]=code;fs.writeFileSync(path.join(dir,name),code);}}
 const modes=id==='typescript-49'?['es5','es2015']:['default'];
 for(const mode of modes){
  const options={strict:true,noEmitOnError:true,types:[],target:mode==='es5'?ts.ScriptTarget.ES5:ts.ScriptTarget.ES2015,module:ts.ModuleKind.CommonJS,outDir:path.join(dir,'out-'+mode),lib:['lib.es2015.d.ts','lib.dom.d.ts']};
  const roots=Object.keys(files).filter(n=>n.endsWith('.ts')).map(n=>path.join(dir,n));assert.ok(roots.length,id+' files found');
  const program=ts.createProgram(roots,options);const errors=ts.getPreEmitDiagnostics(program).filter(d=>d.category===ts.DiagnosticCategory.Error).map(d=>ts.flattenDiagnosticMessageText(d.messageText,' '));assert.deepEqual(errors,[],id);program.emit();
  if(files['labels.js'])fs.writeFileSync(path.join(options.outDir,'labels.js'),files['labels.js']);
  const outputs=[];const entry=path.join(options.outDir,'main.js');const localRequire=createRequire(entry);
  const context=vm.createContext({console:{log:(...a)=>outputs.push(a.join(' '))},exports:{},require:localRequire});new vm.Script(fs.readFileSync(entry,'utf8')).runInContext(context,{timeout:1000});
  const expected=id==='typescript-15'?'Badge: Reader':id==='typescript-48'?'Label: Stars':'4,10';assert.deepEqual(outputs,[expected],id);
  report.localWorkflows.push({id,mode,passed:true,output:outputs});
 }
}
report.status=failures.length?'FAIL':'PASS';report.failures=failures;
fs.writeFileSync('docs/typescript-wording-v1/example-results.json',JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({status:report.status,examples:report.examples.length,projects:report.projects.length,localWorkflows:report.localWorkflows.length,failures},null,2));
assert.equal(failures.length,0);
