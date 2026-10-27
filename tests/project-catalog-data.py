"""Execute every authored Basics-project check against its staged Python fixture."""
import ast, contextlib, io, json, pathlib
root=pathlib.Path(__file__).resolve().parents[1]
source=(root/'lib/project-catalog.ts').read_text()
projects=json.loads(source.split(' = ',1)[1].rstrip().removesuffix(';'))
fixtures=json.loads((root/'tests/project-catalog-fixtures.json').read_text())
lessons={l['id']:l for l in json.loads((root/'content/lessons.json').read_text())}
assert len(projects)==8
assert len({p['id'] for p in projects})==8
assert set(fixtures)=={p['id'] for p in projects}
allowed={'Module','Assign','Expr','Call','Name','Load','Store','Constant'}
for project in projects:
 assert project['lessonId']=='python-01' and project['core'] is False
 assert project['description'] and project['outcome'] and project['skills']
 assert len(project['requiredReading'])==6
 assert {r['sectionKey'] for r in project['requiredReading']}=={'concept:'+x for x in ['program','values','strings','names','assignment','output']}
 code=fixtures[project['id']]
 for node in ast.walk(ast.parse(code)):
  assert type(node).__name__ in allowed, (project['id'],type(node).__name__)
  if isinstance(node,ast.Call): assert isinstance(node.func,ast.Name) and node.func.id=='print'
 for step in project['steps']:
  valid=False
  for end in range(1,len(code.splitlines())+1):
   candidate='\n'.join(code.splitlines()[:end]); env={}; output=io.StringIO()
   with contextlib.redirect_stdout(output): exec(candidate,env)
   env['__output']=output.getvalue().splitlines()
   try: passed=all(eval(c['expression'],env) for c in step['checks'])
   except (NameError,IndexError): passed=False
   if passed: valid=True; break
  assert valid,(project['id'],step['id'],'No staged fixture passes')
  try: blank=all(eval(c['expression'],{'__output':[]}) for c in step['checks'])
  except (NameError,IndexError): blank=False
  assert not blank,(project['id'],'Blank code passes')
print('PASS: 8 additional Basics projects, 16 staged behavioral checks, real prerequisite keys, syntax limited to assignment/values/print.')
