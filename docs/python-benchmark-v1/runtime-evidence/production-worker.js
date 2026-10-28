importScripts('https://cdn.jsdelivr.net/pyodide/v0.27.7/full/pyodide.js');
onmessage=async(e)=>{
  let output=[];
  const capabilityError=(error)=>{
    const message=String(error.message||error);
    if(message.startsWith("This browser cannot run this Python async operation"))return error;
    return /stack switch|JSPI|WebAssembly[.](?:Suspending|promising)|suspending function/i.test(message)
      ? new Error("This browser cannot run this Python async operation with the bundled interpreter. Use a browser with WebAssembly promise integration (JSPI), or run this example locally in Python. Your code is unchanged. Details: "+message)
      : error;
  };
  try{
    const p=await loadPyodide({indexURL:'https://cdn.jsdelivr.net/pyodide/v0.27.7/full/',stdout:s=>output.push(s),stderr:s=>output.push(s)});
    for(const f of e.data.files||[]){if(/^[A-Za-z0-9_.-]+$/.test(f.name))p.FS.writeFile('/home/pyodide/'+f.name,f.code);}
    await p.loadPackagesFromImports(e.data.code);
    const value=await p.runPythonAsync(e.data.code);
    if(value&&typeof value.destroy==='function')value.destroy();
    const captured=p.toPy(output);
    try{p.globals.set('__output',captured);}finally{captured.destroy();}
    const checks=[];
    for(const c of e.data.checks){
      try{checks.push({label:c.label,passed:!!(await p.runPythonAsync(c.expression))});}
      catch(error){const reported=capabilityError(error);if(reported!==error)throw reported;checks.push({label:c.label,passed:false});}
    }
    postMessage({output,checks});
  }catch(error){postMessage({output,checks:[],error:String(capabilityError(error).message||error)});}
};