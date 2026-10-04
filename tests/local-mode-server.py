"""Run against a fresh local learner: phase setup, then restart npm run local, then verify."""
import json,sys,urllib.request,urllib.error, pathlib, sqlite3,subprocess
base='http://127.0.0.1:5173'
phase=sys.argv[1] if len(sys.argv)>1 else 'setup'
def call(path='/api/quest',body=None,headers=None):
 h={'Content-Type':'application/json',**(headers or {})}
 req=urllib.request.Request(base+path,data=None if body is None else json.dumps(body).encode(),headers=h)
 try:
  r=urllib.request.urlopen(req,timeout=25); data=r.read(); return r.status,data,json.loads(data) if 'application/json' in r.headers.get('Content-Type','') else None,r.geturl()
 except urllib.error.HTTPError as e: return e.code,e.read(),None,e.geturl()
if phase=='hosted':
 class NoRedirect(urllib.request.HTTPRedirectHandler):
  def redirect_request(self,req,fp,code,msg,headers,newurl): return None
 try: urllib.request.build_opener(NoRedirect()).open(base+'/',timeout=25)
 except urllib.error.HTTPError as e:
  assert e.code in [302,303,307,308] and e.headers['Location'].startswith('/signin-with-chatgpt'), 'Default Home did not require sign-in'
 else: raise AssertionError('Default Home opened without sign-in')
 assert call()[0]==401, 'Default learning API did not require sign-in'
 print('Passed default Home sign-in redirect and no-cookie API rejection; local mode remains opt-in.')
 sys.exit(0)
status,_,s,_=call();assert status==200 and s['draftScope'], 'No-cookie local API failed'
scope=s['draftScope'];unit='javascript-01';lessons=json.loads(pathlib.Path('content/lessons.json').read_text());lesson=next(x for x in lessons if x['id']==unit)
def mutate(b):
 status,_,d,_=call(body={'deviceScope':scope,**b}); assert status==200, 'Local learning mutation failed';return d
if phase=='setup':
 assert not s['keyConnected'] and not s['progress'] and s['completed']==0, 'Use a fresh disposable local learner for this test'
 status,body,_,url=call('/');assert status==200 and '/signin-with-chatgpt' not in url and b'CodeQuest' in body
 for headers in [{'Origin':'https://unrelated.example'},{'Origin':'null'},{'Sec-Fetch-Site':'cross-site'},{'Host':'unrelated.example'}]:
  assert call(headers=headers)[0]==403,'Foreign request was accepted'
 spoof=call(headers={'oai-authenticated-user-id':'other-user','oai-authenticated-user-email':'other@example.invalid'})[2]
 assert spoof['draftScope']==scope, 'A supplied identity changed the local learner'
 for url in ['/.codequest-local/encryption-key','/@fs/'+str(pathlib.Path('.codequest-local/encryption-key').resolve())]:
  assert call(url)[0] in [403,404], 'A private runtime file was exposed'
 fixture=pathlib.Path('.dev.vars.codequest-local-test');created=False
 try:
  with fixture.open('x') as f: f.write('SYNTHETIC_TEST_VALUE=never-serve-this-test-file\n');created=True
  assert call('/.dev.vars.codequest-local-test')[0] in [403,404], 'A private dev-vars file was exposed'
 finally:
  if created: fixture.unlink()
 mutate({'action':'preferences','settings':{'dailyGoal':2,'aiEnabled':False}})
 mutate({'action':'save','unitId':unit,'code':lesson['solution']})
 q=mutate({'action':'quiz','unitId':unit,'answer':lesson['quiz']['answer']});assert q['correct']
 if lesson.get('math'): assert mutate({'action':'math','unitId':unit,'answer':lesson['math']['answer']})['correct']
 done=mutate({'action':'complete','unitId':unit,'code':lesson['solution'],'checks':[{'label':x['label'],'passed':True} for x in lesson['checks']]})
 assert next(x for x in done['progress'] if x['unitId']==unit)['completedAt'] and done['xp']>0
 assert mutate({'action':'complete','unitId':unit,'code':lesson['solution'],'checks':[{'label':x['label'],'passed':True} for x in lesson['checks']]})['xp']==done['xp']
 mutate({'action':'key','provider':'deepseek','key':'synthetic-local-mode-test-key'})
 detail=call('/api/quest?unit='+unit)[2]; assert detail['history'] and detail['draftScope']==scope
 mutate({'action':'import','backup':[{'unitId':unit,'code':lesson['solution']}]})
 print('Passed no-sign-in Home/API, foreign requests, spoofed identity, private-file denial, settings, save/history, quiz/math, completion/replay, backup import and synthetic key storage. Restart, then run verify.')
else:
 assert s['profile']['dailyGoal']==2 and not s['profile']['aiEnabled'] and s['keyConnected'] and s['aiProvider']=='deepseek'
 p=next(x for x in s['progress'] if x['unitId']==unit); assert p['code']==lesson['solution'] and p['completedAt'] and s['xp']>0
 # Confirm disabled AI stops before any provider request.
 assert call('/api/tutor',{'deviceScope':scope,'unitId':unit,'question':'Explain','mode':'explain','code':''})[0]==403
 # Decrypt only our known synthetic connection, using the reused local key.
 ciphertext=None
 for file in pathlib.Path('.codequest-local/state').rglob('*.sqlite'):
  conn=sqlite3.connect(file)
  if conn.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='profiles'").fetchone():
   row=conn.execute("SELECT encrypted_key FROM profiles WHERE user_id='codequest-local'").fetchone()
   if row: ciphertext=row[0]
  conn.close()
 assert ciphertext, 'Synthetic connection missing from local database'
 program="""const fs=require('node:fs'),vm=require('node:vm'),ts=require('typescript'),assert=require('node:assert/strict');
 const load=(file,imports={})=>{const m={exports:{}};vm.runInNewContext(ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,{module:m,exports:m.exports,require:id=>imports[id],crypto,Uint8Array,TextEncoder,TextDecoder,atob,btoa,JSON,Error});return m.exports};
 const providers=load('lib/ai-providers.ts'),keys=load('lib/ai-keys.ts',{'./ai-providers':providers});const x=JSON.parse(fs.readFileSync(0,'utf8'));
 keys.openConnection(x.cipher,'codequest-local',Uint8Array.from(Buffer.from(x.secret,'base64'))).then(c=>{assert.equal(c.key,'synthetic-local-mode-test-key');assert.equal(c.provider,'deepseek');console.log('Synthetic connection decrypted after restart.');}).catch(()=>process.exit(1));"""
 result=subprocess.run(['node','-e',program],input=json.dumps({'cipher':ciphertext,'secret':pathlib.Path('.codequest-local/encryption-key').read_text().strip()}),text=True,capture_output=True)
 assert result.returncode==0,'Reused key could not decrypt synthetic connection'
 mutate({'action':'disconnect'}); assert not call()[2]['keyConnected']
 mutate({'action':'preferences','settings':{'dailyGoal':1,'aiEnabled':True}})
 print('Passed restart persistence of progress, completion, settings and encrypted connection; disabled tutor gate and key disconnect. No provider requests made.')
