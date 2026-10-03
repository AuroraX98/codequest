import urllib.request,http.cookiejar,json,sys
base='http://127.0.0.1:5173';client=urllib.request.build_opener(urllib.request.HTTPCookieProcessor(http.cookiejar.CookieJar()))
client.open(base+'/signin-with-chatgpt?return_to=/').read()
lessons=json.load(open('content/lessons.json'));catalog=json.load(open('content/catalog.json'))['units'];id=sys.argv[1];l=next(x for x in lessons if x['id']==id);u=next(x for x in catalog if x['id']==id)
for b in [{'action':'save','unitId':id,'code':l['solution']},{'action':'preferences','settings':{'activeUnit':id,'track':u['track'],'level':u['level']}}]:
 r=client.open(urllib.request.Request(base+'/api/quest',data=json.dumps(b).encode(),headers={'Content-Type':'application/json'}));assert r.status==200
print('Prepared local browser project:',id)
