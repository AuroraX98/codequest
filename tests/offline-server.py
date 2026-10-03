import json,urllib.request,urllib.error,http.cookiejar
base='http://127.0.0.1:5173'; c=urllib.request.build_opener(urllib.request.HTTPCookieProcessor(http.cookiejar.CookieJar()))
c.open(base+'/signin-with-chatgpt?return_to=/').read()
def call(path='/api/quest',body=None):
 try:
  r=c.open(urllib.request.Request(base+path,data=None if body is None else json.dumps(body).encode(),headers={'Content-Type':'application/json'}));return r.status,json.loads(r.read())
 except urllib.error.HTTPError as e:return e.code,json.loads(e.read())
_,s=call();scope=s['draftScope'];unit='javascript-02';lessons=json.load(open('content/lessons.json'));l=next(l for l in lessons if l['id']==unit)
old=next(p['code'] for p in s['progress'] if p['unitId']==unit)
assert call(body={'action':'save','unitId':unit,'code':'scope violation','deviceScope':'b'*64})[0]==403
assert call(body={'action':'save','unitId':unit,'code':'overwrite','expectedCode':'stale code','deviceScope':scope})[0]==409
assert next(p['code'] for p in call()[1]['progress'] if p['unitId']==unit)==old
assert call('/api/quest?unit='+unit)[1]['draftScope']==scope
call(body={'action':'preferences','settings':{'aiEnabled':False,'mathEnabled':False,'hintsEnabled':False,'analogiesEnabled':False,'rewardsEnabled':False,'largeText':True,'autoSync':False}})
_,off=call();assert not off['profile']['aiEnabled'] and off['profile']['largeText']
assert call('/api/tutor',{'unitId':unit,'question':'Explain','code':'','mode':'explain','deviceScope':scope})[0]==403
assert call()[1]['tutorUsed']==off['tutorUsed']
assert call('/api/tutor',{'unitId':unit,'question':'Explain','code':'','mode':'explain','deviceScope':'b'*64})[0]==403
# Match the save base, then verify optional math and the offline completion date.
call(body={'action':'save','unitId':unit,'code':l['solution'],'expectedCode':old,'deviceScope':scope})
call(body={'action':'quiz','unitId':unit,'answer':l['quiz']['answer'],'deviceScope':scope})
receipt={'action':'complete','unitId':unit,'code':l['solution'],'checks':[{'label':x['label'],'passed':True} for x in l['checks']],'deviceScope':scope,'completedAt':'2026-10-02T18:00:00.000Z'}
status,done=call(body=receipt);assert status==200,(status,done)
p=next(p for p in done['progress'] if p['unitId']==unit);assert p['completedAt']==receipt['completedAt']
again=call(body=receipt)[1];assert again['xp']==done['xp']
call(body={'action':'preferences','settings':{'aiEnabled':True,'mathEnabled':True,'hintsEnabled':True,'analogiesEnabled':True,'rewardsEnabled':True,'largeText':False,'autoSync':True}})
print('Passed 9 server checks: scope mutation, compare-and-swap, code preservation, scoped detail, settings, disabled AI/no quota, tutor scope, optional math/offline date, replay XP.')
