"""Fresh C17 checks. Usage: python tests/c-native.py PATH_TO_GCC [CASE_ID]."""
import concurrent.futures,ctypes,hashlib,json,os,re,subprocess,sys,time
from pathlib import Path
root=Path(__file__).resolve().parents[1];gcc=Path(sys.argv[1]).resolve()
output=root/'docs/c-wording-v1';work=root.parent/'c-native-check';work.mkdir(exist_ok=True)
if os.name=='nt':ctypes.windll.kernel32.SetErrorMode(0x0001|0x0002)
cases=json.loads((root/'docs/c-core-v1/compiler-evidence/case-manifest.json').read_text())
examples=json.loads((output/'examples.json').read_text())
mapping=[]
for e in examples:
 case=next(c for c in cases if c['id']==e['id']+'-worked')
 files={'main.c':case['code'],**case.get('extraFiles',{})}
 assert set(e['files'])==set(files),e['id']
 for name,source in e['files'].items():assert source.rstrip()==files[name].rstrip(),(e['id'],name)
 mapping.append({'lesson':e['id'],'case':case['id'],'sourceSha256':hashlib.sha256(e['code'].encode()).hexdigest(),'files':{k:hashlib.sha256(v.rstrip().encode()).hexdigest() for k,v in e['files'].items()},'match':'each displayed file matches its native case after trailing-whitespace normalization'})
version=subprocess.run([gcc,'--version'],capture_output=True,text=True,check=True).stdout.splitlines()[0]
def run(case):
 folder=work/case['id'];folder.mkdir(exist_ok=True)
 for name,code in {'main.c':case['code'],**case.get('extraFiles',{})}.items():
  dest=(folder/name).resolve();assert dest.is_relative_to(folder.resolve());dest.write_text(code,encoding='utf8')
 extra=list(dict.fromkeys(case.get('compileArgs',[])+case.get('linkArgs',[])))
 flags=['-std=c17','-Wall','-Wextra','-Wpedantic','-Werror',*extra]
 command=[str(gcc),*flags,*case.get('sources',['main.c']),'-o','example.exe']
 result={'id':case['id'],'lesson':case['lessonId'],'expectedOutcome':case['outcome'],'flags':flags,'sources':case.get('sources',['main.c'])}
 started=time.monotonic()
 try:
  build=subprocess.run(command,cwd=folder,capture_output=True,text=True,timeout=180)
  result.update(compileExit=build.returncode,compileDiagnostics=build.stderr)
  if case['outcome']=='compile-failure':
   expected={'c-27-changed':r'const-qualified|read-only','c-43-changed':r'undefined.*score','c-44-changed':r'undefined.*helper','c-55-changed':r'unused variable','c-56-changed':r'undefined.*score'}[case['id']]
   result.update(expectedDiagnostic=expected,passed=build.returncode!=0 and bool(re.search(expected,build.stderr,re.I)))
  elif build.returncode!=0:result['passed']=False
  else:
   execution=subprocess.run([str(folder/'example.exe'),*case.get('args',[])],cwd=folder,input=case.get('stdin',''),capture_output=True,text=True,timeout=15)
   result.update(runExit=execution.returncode,stdout=execution.stdout,stderr=execution.stderr,expected=case['expected'],expectedExit=case.get('expectedExit',0))
   result['passed']=execution.returncode==case.get('expectedExit',0) and execution.stdout.rstrip()==case['expected'].rstrip()
   if case.get('expectedWarning'):
    result['expectedWarning']=case['expectedWarning'];result['passed'] &= case['expectedWarning'] in build.stderr
   if case['id']=='c-48-worked':
    result['fileContents']=(folder/'lesson.txt').read_text();result['passed'] &= result['fileContents']=='ready'
 except Exception as error:result.update(passed=False,error=str(error))
 result['seconds']=round(time.monotonic()-started,3);return result
selected=[c for c in cases if len(sys.argv)<3 or c['id']==sys.argv[2]]
results=[]
with concurrent.futures.ThreadPoolExecutor(max_workers=2) as pool:
 for result in pool.map(run,selected):
  results.append(result)
  if not result['passed'] or len(results)%10==0:print(json.dumps(result) if len(selected)==1 else f"{len(results)}/{len(selected)} {result['id']} {'PASS' if result['passed'] else 'FAIL'}",flush=True)
passed=all(r['passed'] for r in results)
report={'status':'PASS' if passed else 'FAIL','compiler':version,'platform':sys.platform,'standard':'C17','caseCount':len(results),'passed':sum(r['passed'] for r in results),'examples':len(mapping),'results':results,'limits':['Fresh results use GCC on Windows, not the historical Linux environment.','No fresh sanitizer result.','No interactive debugger or physical-phone test.']}
if len(sys.argv)<3:
 (output/'native-results.json').write_text(json.dumps(report,indent=2)+'\n')
 (output/'native-example-map.json').write_text(json.dumps({'status':report['status'],'examples':mapping},indent=2)+'\n')
print(json.dumps({k:v for k,v in report.items() if k not in ['results','limits']}),flush=True)
sys.exit(0 if passed else 1)

