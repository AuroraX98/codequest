"""Run the reviewed Rust fixtures with the official standalone Windows GNU tools."""
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
from tempfile import TemporaryDirectory
import json,subprocess,sys,os
r=Path(__file__).resolve().parents[1];chain=Path(sys.argv[1]).resolve();rustc=chain/'bin/rustc.exe';cargo=chain/'bin/cargo.exe'
env=dict(os.environ,PATH=os.pathsep.join(map(str,[chain/'lib/rustlib/x86_64-pc-windows-gnu/bin/self-contained',chain/'bin',os.environ['PATH']])),RUSTC=str(rustc),RUSTFLAGS='-C link-self-contained=yes',CARGO_NET_OFFLINE='true')
cases=json.loads((r/'docs/rust-core-v1/compiler-evidence/case-manifest.json').read_text(encoding='utf8'))
def check(c):
 with TemporaryDirectory(prefix='cq-rust-') as temp:
  p=Path(temp);env2=dict(env,CARGO_HOME=str(p/'cargo-home'))
  def run(cmd,stdin=''):return subprocess.run(cmd,cwd=p,env=env2,input=stdin,stdout=subprocess.PIPE,stderr=subprocess.PIPE,encoding='utf8',errors='replace',timeout=90)
  for name,code in {**c.get('extraFiles',{}),c.get('filename','main.rs'):c['code']}.items():
   f=p/name;f.parent.mkdir(exist_ok=True,parents=True);f.write_text(code,encoding='utf8')
  mode=c.get('mode');outcome=c['outcome'];args=c.get('args',[])
  if mode=='cargo-test' or mode=='cargo':
   proc=run([str(cargo),'test' if mode=='cargo-test' else 'run','--offline','--quiet']+(['--','--format','pretty'] if mode=='cargo-test' else []))
  else:
   proc=run([str(rustc),'--edition=2024','-C','link-self-contained=yes','main.rs','-o','lesson.exe'])
   if outcome!='compile-failure':
    assert proc.returncode==0,(c['id'],proc.stderr)
    proc=run([str(p/'lesson.exe'),*args],c.get('stdin',''))
  log=proc.stdout+'\n'+proc.stderr
  assert (proc.returncode==0)==(outcome=='success'),(c['id'],log)
  if outcome=='success' and mode!='cargo-test':
   assert proc.stdout.strip()==c['expected'].strip(),(c['id'],proc.stdout,c['expected'])
  if mode=='cargo-test' and outcome=='success':
   for marker in c.get('outputContains',[]):assert marker in log,(c['id'],marker,log)
  if outcome!='success':assert c['errorContains'] in log,(c['id'],log)
  if c['id']=='rust-58-worked':assert (p/'notes.txt').read_bytes()==b'ready'
  return {'id':c['id'],'outcome':outcome,'pass':True}
with ThreadPoolExecutor(max_workers=4) as pool:rows=list(pool.map(check,cases))
(r/'docs/rust-wording-v1/native-results.json').write_text(json.dumps(rows,indent=2)+'\n')
print(len(rows),'native Rust fixtures passed')
