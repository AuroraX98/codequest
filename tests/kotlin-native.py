"""Run all Kotlin/JVM fixtures in isolated folders.
Usage: python tests/kotlin-native.py PATH_TO_KOTLINC_HOME PATH_TO_JDK [CASE_ID]
"""
import concurrent.futures,hashlib,json,os,subprocess,sys,time,zipfile
from pathlib import Path
root=Path(__file__).resolve().parents[1];home=Path(sys.argv[1]).resolve();jdk=Path(sys.argv[2]).resolve()
out=root/'docs/kotlin-wording-v1';work=root.parent/'kotlin-native-check';work.mkdir(exist_ok=True)
java=jdk/'bin'/('java.exe' if sys.platform=='win32' else 'java')
coroutines=home/'lib/kotlinx-coroutines-core-jvm.jar'
with zipfile.ZipFile(coroutines) as z:coroutine_version=z.read('META-INF/kotlinx_coroutines_core.version').decode().strip()
compiler=[str(java),'--enable-native-access=ALL-UNNAMED','--sun-misc-unsafe-memory-access=allow','-Xmx768m','-Duser.language=en','-Dfile.encoding=UTF-8','-Dkotlin.home='+str(home),'-cp',str(home/'lib/*'),'org.jetbrains.kotlin.cli.jvm.K2JVMCompiler']
version=subprocess.run(compiler+['-version'],capture_output=True,text=True,encoding='utf8',check=True).stderr.strip()
cases=json.loads((root/'docs/kotlin-core-v1/compiler-evidence/case-manifest.json').read_text(encoding='utf8'))
examples=json.loads((out/'examples.json').read_text(encoding='utf8'))
def casefiles(c):return {'Main.kt':c['code'],**c.get('extraFiles',{})}
mapping=[]
for e in examples:
 c=next(c for c in cases if c['id']==e['id']+'-worked');files=casefiles(c)
 assert set(e['files'])==set(files),(e['id'],set(e['files']),set(files))
 for name,source in e['files'].items():assert source.strip()==files[name].strip(),(e['id'],name)
 c['code']=e['files']['Main.kt'];c['extraFiles']={k:v for k,v in e['files'].items() if k!='Main.kt'}
 mapping.append({'lesson':e['id'],'case':c['id'],'sourceSha256':hashlib.sha256(e['code'].encode()).hexdigest(),'files':{k:hashlib.sha256(v.encode()).hexdigest() for k,v in e['files'].items()},'match':'displayed files compiled; historical fixture matches apart from outer whitespace'})
if len(sys.argv)>3:cases=[c for c in cases if c['id']==sys.argv[3]];assert cases
def run(c):
 folder=work/c['id'];folder.mkdir(exist_ok=True);files=casefiles(c)
 for name,code in files.items():
  path=(folder/name).resolve();assert path.is_relative_to(folder.resolve());path.parent.mkdir(exist_ok=True,parents=True);path.write_text(code,encoding='utf8')
 jar=folder/'lesson.jar'
 # A stale JAR must never stand in for a failed build.
 if jar.exists():jar.unlink()
 command=compiler+list(files)+['-language-version','2.4','-jvm-target','21','-Werror','-include-runtime','-d',str(jar)]
 if c.get('coroutine'):command+=['-cp',str(coroutines)]
 result={'id':c['id'],'lesson':c['lessonId'],'expectedOutcome':c['outcome'],'sources':list(files)};start=time.monotonic()
 try:
  build=subprocess.run(command,cwd=folder,capture_output=True,text=True,encoding='utf8',timeout=90)
  result.update(compileExit=build.returncode,compileDiagnostics=build.stderr)
  if c['outcome']=='compile-failure':result['passed']=build.returncode!=0 and c['errorContains'].lower() in build.stderr.lower()
  elif build.returncode:result['passed']=False
  else:
   cp=str(jar)+(os.pathsep+str(coroutines) if c.get('coroutine') else '')
   execution=subprocess.run([str(java),'-Dstdout.encoding=UTF-8','-Dstderr.encoding=UTF-8','-Duser.language=en','-cp',cp,c.get('className','MainKt')],cwd=folder,input=c.get('stdin',''),capture_output=True,text=True,encoding='utf8',timeout=15)
   result.update(runExit=execution.returncode,stdout=execution.stdout,stderr=execution.stderr,expected=c['expected'])
   result['passed']=(execution.returncode!=0 and c['errorContains'].lower() in execution.stderr.lower()) if c['outcome']=='runtime-failure' else execution.returncode==0 and execution.stdout.rstrip()==c['expected'].rstrip()
   if c['id']=='kotlin-50-worked':
    result['savedFileHex']=(folder/'notes.txt').read_bytes().hex();result['passed'] &= result['savedFileHex']=='41c3a9'
 except Exception as error:result.update(passed=False,error=str(error))
 result['seconds']=round(time.monotonic()-start,3);return result
results=[]
with concurrent.futures.ThreadPoolExecutor(max_workers=2) as pool:
 for result in pool.map(run,cases):
  results.append(result)
  if not result['passed'] or len(results)%10==0:print(f"{len(results)}/{len(cases)} {result['id']} {'PASS' if result['passed'] else 'FAIL'}",flush=True)
report={'status':'PASS' if all(r['passed'] for r in results) else 'FAIL','compiler':version,'platform':sys.platform,'jvmTarget':'21','coroutines':coroutine_version,'coroutinesSha256':hashlib.sha256(coroutines.read_bytes()).hexdigest(),'caseCount':len(results),'passed':sum(r['passed'] for r in results),'examples':len(mapping),'results':results}
name='native-results.json' if len(sys.argv)==3 else sys.argv[3]+'-native-result.json'
(out/name).write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
if len(sys.argv)==3:(out/'native-example-map.json').write_text(json.dumps({'status':report['status'],'examples':mapping},indent=2)+'\n')
print(json.dumps({k:v for k,v in report.items() if k!='results'}),flush=True)
sys.exit(0 if report['status']=='PASS' else 1)
