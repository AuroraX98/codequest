const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const source=(()=>{const frame=fs.readFileSync('public/runner/frame.html','utf8');const match=frame.match(/source = (\"importScripts\('https:\/\/cdn\.jsdelivr\.net\/pyodide\/[^\n]+);/);if(!match)throw Error('Python worker source not found');return JSON.parse(match[1]);})();
async function run({code='student',checks=['first','second'],failure,codeFailure}={}){
 const order=[],messages=[],files=[],destroyed=[];let opts;
 const p={FS:{writeFile:(...x)=>files.push(x)},loadPackagesFromImports:async()=>order.push('imports'),globals:{set:(key,_x)=>order.push(key)},toPy:_x=>({destroy:()=>destroyed.push('capture')}),
 runPython(){throw Error('Synchronous execution must not be used');},
 async runPythonAsync(code){order.push('start:'+code);await new Promise(r=>setTimeout(r,2));if(code==='student'&&codeFailure)throw Error(codeFailure);if(code===failure?.code)throw Error(failure.message);order.push('end:'+code);if(code==='student'){opts.stdout('done');return {destroy:()=>destroyed.push('value')}}return code!=='false';}};
 const c={importScripts(){},loadPyodide:async o=>(opts=o,p),postMessage:x=>messages.push(x),onmessage:null};
 vm.createContext(c);vm.runInContext(source,c);
 await c.onmessage({data:{code,files:[{name:'data.txt',code:'x'},{name:'../escape',code:'bad'}],checks:checks.map(label=>({label,expression:label}))}});
 return {order,messages,files,destroyed};
}
(async()=>{
 let r=await run();assert.deepEqual(r.order,['imports','start:student','end:student','__output','start:first','end:first','start:second','end:second']);assert.equal(r.messages.length,1);assert.deepEqual(r.destroyed,['value','capture']);assert.equal(r.files.length,1);assert.equal(r.messages[0].checks.every(c=>c.passed),true);
 r=await run({checks:['first','false','broken','second'],failure:{code:'broken',message:'NameError: bad'}});assert.deepEqual(Array.from(r.messages[0].checks,c=>c.passed),[true,false,false,true]);
 r=await run({failure:{code:'first',message:'RuntimeError: Cannot stack switch because JSPI is unavailable'}});assert.match(r.messages[0].error,/This browser cannot run/);assert.equal(r.messages[0].checks.length,0);assert.equal(r.order.includes('start:second'),false);assert.equal(r.messages[0].output[0],'done');
 r=await run({codeFailure:'SyntaxError'});assert.match(r.messages[0].error,/SyntaxError/);assert.equal(r.order.includes('__output'),false);
 const a=await run(),b=await run();assert.notEqual(a.messages[0].output,b.messages[0].output);assert.equal(a.messages[0].output.length,1);assert.equal(b.messages[0].output.length,1);
 console.log('PASS staged worker contract: sequential async execution/check ordering, false/error separation, capability failure, companion paths, cleanup, independent contexts. Mock contract only; actual Pyodide evidence separate.');
})().catch(e=>{console.error(e);process.exitCode=1});
