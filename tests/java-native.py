"""Run every Java course fixture with a local Java 25 JDK, in isolated folders.
Usage: python tests/java-native.py PATH_TO_JDK
"""
import concurrent.futures,hashlib,json,re,subprocess,sys,time
from pathlib import Path
root=Path(__file__).resolve().parents[1];jdk=Path(sys.argv[1]).resolve()
out=root/'docs/java-wording-v1';work=root.parent/'java-native-check';work.mkdir(exist_ok=True)
exe='.exe' if sys.platform=='win32' else ''
javac=jdk/'bin'/('javac'+exe);java=jdk/'bin'/('java'+exe)
cases=json.loads((root/'docs/java-core-v1/compiler-evidence/case-manifest.json').read_text(encoding='utf8'))
examples=json.loads((out/'examples.json').read_text(encoding='utf8'))
def casefiles(c):return {c.get('filename','Main.java'):c['code'],**c.get('extraFiles',{})}
mapping=[]
for e in examples:
 c=next(c for c in cases if c['id']==e['id']+'-worked');files=casefiles(c)
 assert set(e['files'])==set(files),(e['id'],set(e['files']),set(files))
 reflow=[]
 for name,source in e['files'].items():
  if source.strip()!=files[name].strip():
   assert (e['id'],name) in [('java-58','study/Labels.java'),('java-60','tools/Scale.java')],(e['id'],name)
   # Historical helpers compressed their method onto one line. Preserve quoted text
   # while confirming that only spacing differs; compile the displayed files below.
   lex=lambda s:re.findall(r'"(?:\\.|[^"\\])*"|\S',s)
   assert lex(source)==lex(files[name]),(e['id'],name)
   reflow.append(name)
 c['code']=e['files'][c.get('filename','Main.java')]
 c['extraFiles']={k:v for k,v in e['files'].items() if k!=c.get('filename','Main.java')}
 mapping.append({'lesson':e['id'],'case':c['id'],'sourceSha256':hashlib.sha256(e['code'].encode()).hexdigest(),'files':{k:hashlib.sha256(v.encode()).hexdigest() for k,v in e['files'].items()},'match':'compiled displayed files exactly; historical fixture matches apart from documented spacing','reflowedHistoricalHelpers':reflow})
version=subprocess.run([javac,'-version'],capture_output=True,text=True,check=True).stdout.strip()
def run(c):
 folder=work/c['id'];folder.mkdir(exist_ok=True);files=casefiles(c)
 for name,code in files.items():
  path=(folder/name).resolve();assert path.is_relative_to(folder.resolve());path.parent.mkdir(exist_ok=True,parents=True);path.write_text(code,encoding='utf8')
 classes=folder/'classes';classes.mkdir(exist_ok=True)
 sources=c.get('sources',list(files))
 command=[str(javac),'-J-Duser.language=en','--release','25','-encoding','UTF-8','-Xlint:all','-d','classes',*sources]
 result={'id':c['id'],'lesson':c['lessonId'],'expectedOutcome':c['outcome'],'sources':sources};start=time.monotonic()
 try:
  build=subprocess.run(command,cwd=folder,capture_output=True,text=True,encoding='utf8',timeout=90)
  result.update(compileExit=build.returncode,compileDiagnostics=build.stderr)
  if c['outcome']=='compile-failure':result['passed']=build.returncode!=0 and c['errorContains'] in build.stderr
  elif build.returncode:result['passed']=False
  else:
   launch=[str(java),'-Dstdout.encoding=UTF-8','-Dstderr.encoding=UTF-8','-Duser.language=en']
   launch+=['--module-path','classes','-m',c['moduleName']+'/'+c.get('className','Main')] if c.get('moduleName') else ['-cp','classes',c.get('className','Main')]
   execution=subprocess.run(launch,cwd=folder,input=c.get('stdin',''),capture_output=True,text=True,encoding='utf8',timeout=15)
   result.update(runExit=execution.returncode,stdout=execution.stdout,stderr=execution.stderr,expected=c['expected'])
   result['passed']=(execution.returncode!=0 and c['errorContains'] in execution.stderr) if c['outcome']=='runtime-failure' else (execution.returncode==0 and execution.stdout.rstrip()==c['expected'].rstrip())
 except Exception as error:result.update(passed=False,error=str(error))
 result['seconds']=round(time.monotonic()-start,3);return result
results=[]
with concurrent.futures.ThreadPoolExecutor(max_workers=2) as pool:
 for result in pool.map(run,cases):
  results.append(result)
  if not result['passed'] or len(results)%10==0:print(f"{len(results)}/{len(cases)} {result['id']} {'PASS' if result['passed'] else 'FAIL'}",flush=True)
passed=all(r['passed'] for r in results)
report={'status':'PASS' if passed else 'FAIL','compiler':version,'platform':sys.platform,'standard':'Java 25, no preview flags','caseCount':len(results),'passed':sum(r['passed'] for r in results),'examples':len(mapping),'results':results,'limits':['Checks run on Windows with the recorded JDK.','No physical-phone or screen-reader claim.','Each file-writing example runs only in its own practice folder.']}
(out/'native-results.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
(out/'native-example-map.json').write_text(json.dumps({'status':report['status'],'examples':mapping},indent=2)+'\n')
print(json.dumps({k:v for k,v in report.items() if k not in ['results','limits']}),flush=True)
sys.exit(0 if passed else 1)
