import json,subprocess,pathlib,urllib.request,urllib.error,time,os
ls=json.load(open('content/lessons.json'));root=pathlib.Path('.sites-runtime/local-server-test').resolve();base='http://127.0.0.1:3000';total=[]
def req(path='/entries',body=None,cookie=None):
 r=urllib.request.Request(base+path,data=None if body is None else json.dumps(body).encode(),headers={'Content-Type':'application/json',**({'Cookie':cookie} if cookie else {})})
 try:
  x=urllib.request.urlopen(r);return x.status,json.loads(x.read()),x.headers.get('Set-Cookie')
 except urllib.error.HTTPError as x:return x.code,None,None
def start(folder):
 p=subprocess.Popen(['/usr/local/bin/node','server.mjs'],cwd=folder,stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL,env={**os.environ,'ALICE_PASSWORD':'local-fixture-alice','BOB_PASSWORD':'local-fixture-bob'})
 for _ in range(50):
  if p.poll() is not None:raise RuntimeError('Lesson server exited')
  try:req();return p
  except urllib.error.URLError:time.sleep(.1)
 raise RuntimeError('Server not ready')
try:urllib.request.urlopen(base+'/');raise RuntimeError('Port 3000 already in use; no existing server changed')
except urllib.error.URLError:pass
for id in ['backend-01','backend-02','backend-05']:
 folder=root/id;folder.mkdir(exist_ok=True);db=folder/'practice.sqlite'
 if db.exists():db.unlink() # Disposable fixture database only.
 for f in next(x for x in ls if x['id']==id)['extraFiles']:(folder/f['name']).write_text(f['code'])
 p=start(folder)
 try:
  if id=='backend-05':
   assert req()[0]==401
   assert req('/login',{'user':'alice','password':'wrong'})[0]==401
   a=req('/login',{'user':'alice','password':'local-fixture-alice'})[2];b=req('/login',{'user':'bob','password':'local-fixture-bob'})[2]
   assert req(body={'minutes':25},cookie=a)[0]==201
   assert len(req(cookie=a)[1])==1 and req(cookie=b)[1]==[]
   assert req(body={'minutes':0},cookie=a)[0]==400
  else:
   subprocess.run(['/usr/local/bin/node','--test','test.mjs'],cwd=folder,check=True,stdout=subprocess.DEVNULL)
  if id in ['backend-02','backend-05']:
   p.terminate();p.wait();p=start(folder)
   if id=='backend-05':a=req('/login',{'user':'alice','password':'local-fixture-alice'})[2];assert len(req(cookie=a)[1])==1
   else:assert len(req()[1])==1
  total.append(id)
 finally:p.terminate();p.wait()
print(json.dumps({'local_servers_passed':total,'checks':'real HTTP, boundary validation, database restart, account separation'}))
