import json,urllib.request,urllib.error,http.cookiejar,concurrent.futures
base='http://127.0.0.1:5173';jar=http.cookiejar.CookieJar();client=urllib.request.build_opener(urllib.request.HTTPCookieProcessor(jar))
def call(path='/api/quest',body=None,headers=None,anonymous=False):
 req=urllib.request.Request(base+path,data=None if body is None else json.dumps(body).encode(),headers={'Content-Type':'application/json',**(headers or {})})
 try:
  response=(urllib.request.urlopen(req) if anonymous else client.open(req));return response.status,json.loads(response.read())
 except urllib.error.HTTPError as e:
  raw=e.read()
  try: payload=json.loads(raw)
  except ValueError: payload={'message':raw.decode(errors='replace')}
  return e.code,payload
checks=[]
def check(name,ok):
 assert ok,name;checks.append(name)
check('anonymous read rejected',call(anonymous=True)[0]==401)
check('spoofed account headers rejected',call(headers={'oai-authenticated-user-id':'other','oai-authenticated-user-email':'other@example.com'},anonymous=True)[0]==401)
client.open(base+'/signin-with-chatgpt?return_to=/').read()
status,state=call();check('signed-in state loads',status==200 and 'progress' in state)
check('cross-origin mutation rejected',call(body={'action':'preferences','settings':{'theme':'dark'}},headers={'Origin':'https://wrong.example'})[0]==403)
check('unknown lesson rejected',call(body={'action':'save','unitId':'missing','code':'x'})[0]==404)
check('oversized project rejected',call(body={'action':'save','unitId':'javascript-02','code':'x'*60001})[0]==400)
check('missing key rejected',call(body={'action':'key'})[0]==400)
check('tutor needs a key',call('/api/tutor',{'unitId':'javascript-01','question':'Explain a variable','code':'const x=1','mode':'explain'})[0]==409)
check('invalid tutor question rejected',call('/api/tutor',{'unitId':'javascript-01','question':'','code':'','mode':'explain'})[0]==400)
unit='javascript-02';old=next((p['code'] for p in state['progress'] if p['unitId']==unit),None)
for code in ['const temperature = 12;','const temperature = 18;']:
 status,_=call(body={'action':'save','unitId':unit,'code':code});check('project save '+code,status==200)
status,detail=call('/api/quest?unit='+unit);check('version history includes previous code',any(h['code']=='const temperature = 12;' for h in detail['history']))
status,after=call();check('saved code round-trips',next(p for p in after['progress'] if p['unitId']==unit)['code']=='const temperature = 18;')
# Completion and math must be earned, and replays must not duplicate progress.
new='javascript-03';check('completion before practice rejected',call(body={'action':'complete','unitId':new,'code':'','checks':[]})[0]==400)
lesson=next(l for l in json.load(open('content/lessons.json')) if l['id']=='javascript-01')
for kind in ['quiz','math']:
 status,answer=call(body={'action':kind,'unitId':lesson['id'],'answer':lesson[kind]['answer']});check(kind+' answer saved',status==200 and answer['correct'])
call(body={'action':'save','unitId':lesson['id'],'code':lesson['solution']})
receipt={'action':'complete','unitId':lesson['id'],'code':lesson['solution'],'checks':[{'label':c['label'],'passed':True} for c in lesson['checks']]}
status,once=call(body=receipt);status,twice=call(body=receipt)
check('completion replay awards XP once',once['xp']==twice['xp'] and once['todayCompleted']==twice['todayCompleted'])
# Stale completions cannot overwrite a newer saved project.
call(body={'action':'save','unitId':lesson['id'],'code':'const savedNewest = 42;'})
check('stale completion rejected',call(body=receipt)[0]==409)
status,fresh=call();check('stale completion keeps newer code',next(p for p in fresh['progress'] if p['unitId']==lesson['id'])['code']=='const savedNewest = 42;')
call(body={'action':'save','unitId':lesson['id'],'code':lesson['solution']})
check('draft namespace is an opaque account scope',len(fresh['draftScope'])==64 and fresh['draftScope'].isalnum())
# Saving a dummy key tests encryption transport without calling the provider.
status,stored=call(body={'action':'key','key':'test-only-never-a-real-provider-key'});check('key can be stored securely',status==200 and stored['keyConnected'])
check('state never returns a key', 'test-only-never-a-real-provider-key' not in json.dumps(stored) and not any('encrypted' in k.lower() for k in stored))
call(body={'action':'disconnect'});status,disconnected=call();check('key disconnect persists',not disconnected['keyConnected'])
# Atomic preference patches preserve both independently changed values.
def update(field,value):return call(body={'action':'preferences','settings':{field:value}})
with concurrent.futures.ThreadPoolExecutor(max_workers=2) as pool:list(pool.map(lambda pair:update(*pair), [('calm',True),('theme','dark')]))
status,settings=call();check('concurrent preference patches both persist',settings['profile']['calm'] and settings['profile']['theme']=='dark')
call(body={'action':'preferences','settings':{'calm':False,'theme':'light','track':'javascript','level':'beginner','activeUnit':'javascript-01'}})
print(json.dumps({'passed':len(checks),'checks':checks},indent=2))
