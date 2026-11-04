"""Fresh native C++23 checks. Usage: python tests/cpp-native.py PATH_TO_ZIG."""
import concurrent.futures,ctypes,hashlib,json,os,subprocess,sys,time
from pathlib import Path
root=Path(__file__).resolve().parents[1]
zig=Path(sys.argv[1]).resolve()
output=root/'docs/cpp-wording-v1';work=root.parent/'cpp-native-check';work.mkdir(exist_ok=True)
if os.name=='nt':ctypes.windll.kernel32.SetErrorMode(0x0001|0x0002)
parts=['original-six','foundations','ownership-and-generic','library-and-concurrency']
cases=[c for p in parts for c in json.loads((root/f'docs/cpp-core-v1/{p}/execution-cases.json').read_text())]
examples=json.loads((output/'examples.json').read_text())
mapping=[]
for e in examples:
 case=next(c for c in cases if c['id']==e['id']+'-worked')
 files={'main.cpp':case['code'],**case.get('extraFiles',{})}
 assert set(e['files'])==set(files),e['id']
 for name,source in e['files'].items():assert source.rstrip()==files[name].rstrip(),(e['id'],name)
 mapping.append({'lesson':e['id'],'case':case['id'],'sourceSha256':hashlib.sha256(e['code'].encode()).hexdigest(),'files':{k:hashlib.sha256(v.rstrip().encode()).hexdigest() for k,v in e['files'].items()},'match':'each displayed file matches native case after trailing-whitespace normalization'})
version=subprocess.run([zig,'version'],capture_output=True,text=True,check=True).stdout.strip()
def run(case):
 folder=work/case['id'];folder.mkdir(exist_ok=True)
 files={'main.cpp':case['code'],**case.get('extraFiles',{})}
 for name,code in files.items():
  dest=(folder/name).resolve();assert dest.is_relative_to(folder.resolve());dest.write_text(code,encoding='utf8')
 flags=['-std=c++23','-Wall','-Wextra','-Wpedantic','-Werror']
 command=[str(zig),'c++',*flags,*case.get('sources',['main.cpp']),'-o','example.exe']
 started=time.monotonic()
 result={'id':case['id'],'lesson':case['lessonId'],'expectedOutcome':case['outcome'],'flags':flags,'sources':case.get('sources',['main.cpp'])}
 try:
  build=subprocess.run(command,cwd=folder,capture_output=True,text=True,timeout=180)
  result.update(compileExit=build.returncode,compileDiagnostics=build.stderr)
  if case['outcome']=='compile-failure':result['passed']=build.returncode!=0 and bool(build.stderr.strip())
  elif build.returncode!=0:result['passed']=False
  else:
   execution=subprocess.run([str(folder/'example.exe')],cwd=folder,input=case.get('stdin',''),capture_output=True,text=True,timeout=15)
   result.update(runExit=execution.returncode,stdout=execution.stdout,stderr=execution.stderr,expected=case['expected'])
   if case['outcome']=='runtime-failure':result['passed']=execution.returncode!=0 and case.get('errorContains','').lower() in execution.stderr.lower()
   else:result['passed']=execution.returncode==0 and execution.stdout.rstrip()==case['expected'].rstrip()
 except Exception as error:result.update(passed=False,error=str(error))
 result['seconds']=round(time.monotonic()-started,3)
 return result
results=[]
with concurrent.futures.ThreadPoolExecutor(max_workers=2) as pool:
 for result in pool.map(run,cases):
  results.append(result)
  if not result['passed'] or len(results)%10==0:print(f"{len(results)}/{len(cases)} {result['id']} {'PASS' if result['passed'] else 'FAIL'}",flush=True)
passed=all(r['passed'] for r in results)
report={'status':'PASS' if passed else 'FAIL','compiler':f'Zig {version} bundled Clang and libc++','platform':sys.platform,'standard':'C++23','caseCount':len(results),'passed':sum(r['passed'] for r in results),'examples':len(mapping),'results':results,'limits':['No claim of GCC execution from this fresh run.','No fresh sanitizer result.','No interactive debugger or physical-phone execution.']}
(output/'native-results.json').write_text(json.dumps(report,indent=2)+'\n')
(output/'native-example-map.json').write_text(json.dumps({'status':report['status'],'examples':mapping},indent=2)+'\n')
print(json.dumps({k:v for k,v in report.items() if k not in ['results','limits']}),flush=True)
sys.exit(0 if passed else 1)
