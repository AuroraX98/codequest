/** Staged only. Compiler diagnostics are evidence; assertion sources are never emitted. */
function createContractCompiler(ts,libs){
 const options={target:ts.ScriptTarget.ES2015,strict:true,noEmitOnError:true,lib:Object.keys(libs)};
 const cached=new Map();
 function compile(source,assertion){
  const sources={'main.ts':source};if(assertion!==undefined)sources['__course_assertion.ts']='{\n'+assertion+'\n}';
  const host={getSourceFile:(n,l)=>{if(sources[n]!==undefined)return ts.createSourceFile(n,sources[n],l,true);const key=n.replace(/^.*\//,'');if(!libs[key])return undefined;if(!cached.has(key))cached.set(key,ts.createSourceFile(n,libs[key],l,true));return cached.get(key)},getDefaultLibFileName:()=> 'lib.es5.d.ts',writeFile:()=>{},getCurrentDirectory:()=>'',getDirectories:()=>[],fileExists:n=>sources[n]!==undefined||!!libs[n.replace(/^.*\//,'')],readFile:n=>sources[n]??libs[n.replace(/^.*\//,'')],getCanonicalFileName:n=>n,useCaseSensitiveFileNames:()=>true,getNewLine:()=> '\n'};
  return ts.getPreEmitDiagnostics(ts.createProgram(Object.keys(sources),options,host)).filter(d=>d.category===ts.DiagnosticCategory.Error).map(d=>({code:d.code,file:d.file?.fileName,start:d.start??-1,length:d.length??0,message:ts.flattenDiagnosticMessageText(d.messageText,' ')}));
 }
 function check(source,assertions=[],variants=[]){
  const file=ts.createSourceFile('main.ts',source,options.target,true);const baseline=compile(source);if(baseline.length)return{ok:false,stage:'learner-compile',errors:baseline,checks:[]};
  // A project claiming compiler-checked contracts cannot turn off those diagnostics.
  if((assertions.length||variants.length)&&(file.checkJsDirective?.enabled===false||file.commentDirectives?.length))return{ok:false,stage:'suppression-policy',errors:[{message:'This exercise verifies compiler contracts. Remove diagnostic-suppression directives; failing examples belong in the separate study fixtures.'}],checks:[]};
  const checks=[];
  for(const a of assertions){const errors=compile(source,a.code);const pass=a.expect==='reject'?errors.length>0&&errors.every(e=>e.file==='__course_assertion.ts'&&a.diagnosticCodes?.includes(e.code)&&e.start>=2&&e.start+e.length<=a.code.length+2):errors.length===0;checks.push({label:a.label,passed:pass,expect:a.expect,errors});}
  for(const v of variants){let changed=false;const transformed=ts.transform(file,[context=>node=>{const visit=n=>{if(ts.isTypeAliasDeclaration(n)&&n.name.text===v.alias){changed=true;const parsed=ts.createSourceFile('variant.ts','type __Variant = '+v.appendType+';',options.target,true);const extra=ts.getSynthesizedDeepClone(parsed.statements[0].type);function reset(n){ts.setTextRange(n,{pos:-1,end:-1});ts.forEachChild(n,reset)}reset(extra);return ts.factory.updateTypeAliasDeclaration(n,n.modifiers,n.name,n.typeParameters,ts.factory.createUnionTypeNode([n.type,extra]));}return ts.visitEachChild(n,visit,context)};return ts.visitNode(node,visit)}]);const mutated=ts.createPrinter().printFile(transformed.transformed[0]);transformed.dispose();const mfile=ts.createSourceFile('main.ts',mutated,options.target,true);let target=mfile.statements.find(n=>ts.isFunctionDeclaration(n)&&n.name?.text===v.functionName);if(!target){for(const statement of mfile.statements){if(ts.isVariableStatement(statement)){const declaration=statement.declarationList.declarations.find(n=>ts.isIdentifier(n.name)&&n.name.text===v.functionName);if(declaration?.initializer&&(ts.isArrowFunction(declaration.initializer)||ts.isFunctionExpression(declaration.initializer)))target=declaration;}}}const errors=changed?compile(mutated):[];const pass=mfile.parseDiagnostics.length===0&&!!target&&errors.length>0&&errors.every(e=>e.file==='main.ts'&&v.diagnosticCodes.includes(e.code)&&e.start>=target.pos&&e.start+e.length<=target.end);checks.push({label:v.label,passed:pass,expect:'reject extended variant',errors,mutated});}
  return{ok:checks.every(c=>c.passed),stage:'contracts',errors:[],checks};
 }
 return{options,compile,check,transpileLearnerOnly:source=>ts.transpileModule(source,{compilerOptions:options}).outputText};
}
module.exports={createContractCompiler};
