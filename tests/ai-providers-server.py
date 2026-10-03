import json,urllib.request,urllib.error,http.cookiejar
base='http://127.0.0.1:5173';client=urllib.request.build_opener(urllib.request.HTTPCookieProcessor(http.cookiejar.CookieJar()))
client.open(base+'/signin-with-chatgpt?return_to=/').read()
def call(body=None,path='/api/quest'):
 req=urllib.request.Request(base+path,data=None if body is None else json.dumps(body).encode(),headers={'Content-Type':'application/json'})
 try:
  r=client.open(req);return r.status,json.loads(r.read()),r.headers
 except urllib.error.HTTPError as e:return e.code,json.loads(e.read()),e.headers
_,state,_=call();scope=state['draftScope'];used=state['tutorUsed'];original=state['profile']['aiEnabled'];marker='test-only-provider-storage-key'
try:
 for provider in ['deepseek','openai','anthropic']:
  code,s,headers=call({'action':'key','provider':provider,'key':marker,'deviceScope':scope})
  assert code==200 and s['aiProvider']==provider and s['keyConnected'],(code,s)
  assert headers.get('Cache-Control')=='no-store'
  assert marker not in json.dumps(s) and 'encrypted_key' not in json.dumps(s)
  assert call()[1]['aiProvider']==provider
  for invalid in ['unknown','',None]:
   assert call({'action':'key','provider':invalid,'key':marker})[0]==400
   assert call()[1]['aiProvider']==provider
  assert call({'action':'key','provider':'openai','key':marker,'deviceScope':'b'*64})[0]==403
  assert call()[1]['aiProvider']==provider
 call({'action':'preferences','settings':{'aiEnabled':False}})
 assert call({'unitId':'javascript-01','question':'Explain a variable','code':'','mode':'explain','deviceScope':scope},'/api/tutor')[0]==403
 assert call()[1]['tutorUsed']==used
 call({'action':'preferences','settings':{'aiEnabled':True,'aiProvider':'deepseek'}})
 assert call()[1]['aiProvider']=='anthropic'
 assert call({'unitId':'javascript-01','question':'Explain a variable','code':'','mode':'explain','deviceScope':scope,'expectedProvider':'openai'},'/api/tutor')[0]==409
 assert call()[1]['tutorUsed']==used
 assert call({'action':'key','provider':'openai','key':'invalid\nheader-key'})[0]==400
 assert call()[1]['aiProvider']=='anthropic'
 # Existing clients which omit provider retain DeepSeek semantics.
 assert call({'action':'key','key':marker})[1]['aiProvider']=='deepseek'
 s=call({'action':'disconnect'})[1];assert not s['keyConnected'] and s['aiProvider'] is None and 'aiDisconnected' not in s['profile']
 assert call({'unitId':'javascript-01','question':'Explain a variable','code':'','mode':'explain'},'/api/tutor')[0]==409
 assert call()[1]['tutorUsed']==used
 print('Passed server provider saves/reloads, secret exclusion/no-store, invalid replacement preservation, account scope, AI-off and provider-change quota gates, header validation, legacy selection, and disconnect.')
finally:
 call({'action':'disconnect'});call({'action':'preferences','settings':{'aiEnabled':original}})
