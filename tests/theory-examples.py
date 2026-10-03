"""Validate authored theory, without executing arbitrary snippets or their network calls."""
import ast,json,re,subprocess,tempfile,pathlib
lessons=json.load(open('content/lessons.json'));failures=[];counts={'lessons':0,'pages':0,'examples':0,'python_syntax':0,'javascript_syntax':0,'json_syntax':0}
pattern=re.compile(r'^```([a-zA-Z0-9_-]*)[^\S\r\n]*\r?\n([\s\S]*?)^```[^\S\r\n]*(?:\r?\n|$)',re.M)
for l in lessons:
 counts['lessons']+=1;counts['pages']+=len(l['explanation']);examples=[]
 for page,t in enumerate(l['explanation']):
  matches=list(pattern.finditer(t));examples.extend(matches)
  if t.count('```')!=len(matches)*2:failures.append({'id':l['id'],'page':page+1,'error':'Unbalanced or unrecognized code fence'})
  for m in matches:
   lang,code=m.groups()
   try:
    if lang=='python':compile(code,'<theory example>','exec');counts['python_syntax']+=1
    elif lang in ('javascript','js'):
     with tempfile.TemporaryDirectory() as d:
      p=pathlib.Path(d,'example.mjs');p.write_text(code);r=subprocess.run(['node','--check',str(p)],capture_output=True,text=True)
     if r.returncode:raise ValueError(r.stderr[:700])
     counts['javascript_syntax']+=1
    elif lang=='json':json.loads(code);counts['json_syntax']+=1
   except Exception as e:failures.append({'id':l['id'],'page':page+1,'language':lang,'error':str(e)})
 code_examples=[m for m in examples if m[1] not in ('text','output')]
 counts['examples']+=len(code_examples)
 if len(l['explanation'])<6:failures.append({'id':l['id'],'error':'Theory not yet expanded'})
 if len(code_examples)<2:failures.append({'id':l['id'],'error':'Fewer than two worked examples'})
print(json.dumps({'counts':counts,'failures':failures},indent=2));raise SystemExit(bool(failures))
