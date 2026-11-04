"""Run source fixtures independently of the browser; each one gets a fresh temp folder."""
import json,sys,subprocess,os
from pathlib import Path
from tempfile import TemporaryDirectory
from concurrent.futures import ThreadPoolExecutor
c=sys.argv[1];exe=Path(sys.argv[2]).resolve();r=Path(__file__).resolve().parents[1]
cases=json.loads((r/f'docs/{c}-core-v1/compiler-evidence/case-manifest.json').read_text(encoding='utf8'))
def normalize(s):return '\n'.join(l.rstrip() for l in s.replace('\r\n','\n').strip().splitlines())
def run(case):
 with TemporaryDirectory(prefix='cq-'+c+'-') as td:
  p=Path(td);name={'php':'main.php','ruby':'main.rb','r':'main.R'}[c];env=dict(os.environ)
  env.update(HOME=td,TMPDIR=td,R_USER=td,LANGUAGE='en',LANG='C.UTF-8')
  if c=='r' and os.name=='nt':env.update(LC_ALL='English_United States.utf8',LANG='English_United States.utf8')
  flags={'php':['-n','-d','extension_dir='+str(exe.parent/'ext'),'-d','extension=mbstring','-d','extension=pdo_sqlite','-d','display_errors=stderr','-d','log_errors=0'],'ruby':['-EUTF-8:UTF-8'],'r':['--vanilla','--encoding=UTF-8']}[c]
  for f,s in {**case.get('extraFiles',{}),name:case['code']}.items():
   file=p/f;file.parent.mkdir(exist_ok=True,parents=True);file.write_text(s,encoding='utf8')
  output=subprocess.run([str(exe),*flags,name,*case.get('args',[])],input=case.get('stdin',''),capture_output=True,encoding='utf8',errors='replace',timeout=30,cwd=p,env=env)
  log=output.stdout+'\n'+output.stderr;good=case['outcome']=='success'
  assert (output.returncode==0)==good,(case['id'],log)
  if good and case.get('expected') is not None:assert normalize(output.stdout)==normalize(case['expected']),(case['id'],output.stdout,case['expected'],output.stderr)
  if good:
   for marker in case.get('outputContains',[]):assert marker in log,(case['id'],marker,log)
  else:assert case['errorContains'] in log,(case['id'],log)
  for art in case.get('artifacts',[]):
   data=(p/art['path']).read_bytes();assert len(data)>=art['minBytes'] and data.startswith(b'%PDF'),case['id']
  return {'id':case['id'],'outcome':case['outcome'],'pass':True}
with ThreadPoolExecutor(max_workers=4) as pool:results=list(pool.map(run,cases))
(r/f'docs/{c}-wording-v1/native-results.json').write_text(json.dumps(results,indent=2)+'\n',encoding='utf8')
print(len(results),'native',c,'fixtures passed')
