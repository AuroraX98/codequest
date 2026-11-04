"""Run the 65 reviewed Go programs and their changed cases. Usage: python tests/go-native.py PATH_TO_GO [CASE]"""
import concurrent.futures,hashlib,json,os,subprocess,sys,time
from pathlib import Path
root=Path(__file__).resolve().parents[1];go=Path(sys.argv[1]).resolve();out=root/'docs/go-wording-v1';work=root.parent/'go-native-check';work.mkdir(exist_ok=True)
env={**os.environ,'GOPROXY':'off','GOSUMDB':'off','GOTOOLCHAIN':'local','GOWORK':'off','GOENV':'off','GOFLAGS':'-buildvcs=false -p=2','CGO_ENABLED':'0','GOCACHE':str(work/'cache'),'GOPATH':str(work/'gopath'),'GOMODCACHE':str(work/'modcache')}
def read(p):return json.loads(p.read_text(encoding='utf8'))
def save(p,x):p.write_text(json.dumps(x,indent=2,ensure_ascii=False)+'\n',encoding='utf8')
cases=read(root/'docs/go-core-v1/compiler-evidence/case-manifest.json');examples=read(out/'examples.json');mapped=[]
def sources(c):return {**c.get('extraFiles',{}),c.get('filename','main.go'):c['code']}
for e in examples:
 c=next(c for c in cases if c['id']==e['id']+'-worked');fs=sources(c);assert fs.keys()==e['files'].keys() and all(fs[k].strip()==e['files'][k].strip() for k in fs),e['id']
 c['code']=e['files'][c.get('filename','main.go')];c['extraFiles']={k:v for k,v in e['files'].items() if k!=c.get('filename','main.go')};mapped.append({'lesson':e['id'],'case':c['id'],'files':{k:hashlib.sha256(v.encode()).hexdigest() for k,v in e['files'].items()}})
if len(sys.argv)>2:cases=[c for c in cases if c['id']==sys.argv[2]];assert cases
def run(c):
 p=work/c['id'];p.mkdir(exist_ok=True);fs=sources(c);fs.setdefault('go.mod','module example.test/lesson\ngo 1.27.0\n')
 for name,src in fs.items():
  f=(p/name).resolve();assert f.is_relative_to(p.resolve());f.parent.mkdir(exist_ok=True,parents=True);f.write_text(src,encoding='utf8')
 result={'id':c['id'],'outcome':c['outcome'],'files':list(fs),'actions':[]};start=time.monotonic()
 def call(cmd,stdin=None):
  proc=subprocess.run(cmd,cwd=p,env=env,input=stdin,capture_output=True,text=True,encoding='utf8',timeout=180)
  result['actions'].append({'command':[Path(cmd[0]).name,*cmd[1:]],'exit':proc.returncode,'stdout':proc.stdout,'stderr':proc.stderr});return proc.returncode,proc.stdout+proc.stderr
 try:
  if c.get('mode')=='test':
   ec,txt=call([str(go),'test','-count=1',*c['testArgs'],'.']);markers=c['outputContains'];markers=[markers] if isinstance(markers,str) else markers
   result['passed']=(ec!=0 and c['errorContains'] in txt) if c['outcome']=='runtime-failure' else ec==0 and all(m in txt for m in markers)
  elif c['outcome']=='tool-failure':
   ec,txt=call([str(go),*c['command']]);result['passed']=ec!=0 and c['errorContains'] in txt
  else:
   exe=p/'lesson.exe';exe.unlink(missing_ok=True);ec,txt=call([str(go),'build','-o',str(exe.name),'.'])
   if c['outcome']=='compile-failure':result['passed']=ec!=0 and c['errorContains'] in txt
   elif ec:result['passed']=False
   else:
    ec,txt=call([str(exe)],c.get('stdin',''));result['passed']=ec==0 and txt.rstrip()==c['expected'].rstrip()
    if 'testCommand' in c:
     ec,txt=call([str(go),*c['testCommand']]);result['passed'] &= (ec!=0)==c['testExpectedFailure'] and c['testExpectedContains'] in txt
    if c['id']=='go-49-worked':result['savedFileHex']=(p/'notes.txt').read_bytes().hex();result['passed'] &= result['savedFileHex']==b'ready'.hex()
 except Exception as exc:result.update(passed=False,error=str(exc))
 result['seconds']=round(time.monotonic()-start,3);return result
results=[]
with concurrent.futures.ThreadPoolExecutor(max_workers=2) as pool:
 for r in pool.map(run,cases):
  results.append(r)
  if len(results)%10==0 or not r['passed']:print(f"{len(results)}/{len(cases)} {r['id']} {'PASS' if r['passed'] else 'FAIL'}",flush=True)
report={'status':'PASS' if all(r['passed'] for r in results) else 'FAIL','compiler':subprocess.check_output([str(go),'version'],env=env,text=True).strip(),'examples':len(mapped),'caseCount':len(results),'passed':sum(r['passed'] for r in results),'results':results}
save(out/('native-results.json' if len(sys.argv)==2 else sys.argv[2]+'-native-result.json'),report)
if len(sys.argv)==2:save(out/'native-example-map.json',{'examples':mapped,'status':report['status']})
print({k:v for k,v in report.items() if k!='results'},flush=True);sys.exit(report['status']!='PASS')
