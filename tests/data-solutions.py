import json,io,contextlib,sqlite3,tempfile,pathlib,sys,os,re
lessons=json.load(open('content/lessons.json'));failures=[];passed=0
for l in lessons:
 if l['runtime'] not in ('python','sql'):continue
 try:
  if l['runtime']=='python':
   scope={};output=io.StringIO();previous=os.getcwd()
   with tempfile.TemporaryDirectory() as folder:
    sys.path.insert(0,folder)
    try:
     for f in l.get('extraFiles',[]):
      if not re.fullmatch(r'[A-Za-z0-9_.-]+',f['name']) or f['name'] in ('.','..'):raise ValueError('Unsafe fixture filename')
      pathlib.Path(folder,f['name']).write_text(f['code'])
     os.chdir(folder)
     with contextlib.redirect_stdout(output):exec(l['solution'],scope)
     scope['__output']=output.getvalue().splitlines()
     for c in l['checks']:assert eval(c['expression'],scope),c['label']
    finally:
     os.chdir(previous)
     sys.path.remove(folder)
  else:
   db=sqlite3.connect(':memory:')
   try:
    for f in l.get('extraFiles',[]):
     if f['name']=='setup.sql':db.executescript(f['code'])
    db.executescript(l['solution'])
    for c in l['checks']:assert db.execute(c['expression']).fetchone()[0]==1,c['label']
   finally:db.close()
  passed+=1
 except Exception as e:failures.append({'id':l['id'],'error':str(e)})
print(json.dumps({'passed':passed,'failures':failures},indent=2));raise SystemExit(bool(failures))
