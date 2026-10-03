import json,io,contextlib,sqlite3,tempfile,pathlib,sys
lessons=json.load(open('content/lessons.json'));failures=[];passed=0
for l in lessons:
 if l['runtime'] not in ('python','sql'):continue
 try:
  if l['runtime']=='python':
   scope={};output=io.StringIO();temp=tempfile.TemporaryDirectory();sys.path.insert(0,temp.name)
   for f in l.get('extraFiles',[]):
    if f['name'].endswith('.py'):pathlib.Path(temp.name,f['name']).write_text(f['code'])
   with contextlib.redirect_stdout(output):exec(l['solution'],scope)
   scope['__output']=output.getvalue().splitlines()
   for c in l['checks']:assert eval(c['expression'],scope),c['label']
  else:
   db=sqlite3.connect(':memory:')
   for f in l.get('extraFiles',[]):
    if f['name']=='setup.sql':db.executescript(f['code'])
   db.executescript(l['solution'])
   for c in l['checks']:assert db.execute(c['expression']).fetchone()[0]==1,c['label']
   db.close()
  passed+=1
 except Exception as e:failures.append({'id':l['id'],'error':str(e)})
print(json.dumps({'passed':passed,'failures':failures},indent=2));raise SystemExit(bool(failures))
