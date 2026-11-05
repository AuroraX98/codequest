"""Check current course coverage, preserving a distinction between sections and lessons."""
import json,re
from pathlib import Path
r=Path(__file__).resolve().parents[1]
def read(p):return json.loads((r/p).read_text(encoding='utf8'))
ls={l['id']:l for l in read('content/lessons.json')};units=read('content/catalog.json')['units']
tracks={}
for u in units:tracks.setdefault(u['track'],[]).append(u['id'])
assert len(tracks)==21 and len(ls)==len(units)==1231 and set(ls)=={u['id'] for u in units}
report={}
for course,route in tracks.items():
 heads=read(f'content/{course}-reviewed-headings.json');assert set(route)==set(heads),course
 sections=0
 for id in route:
  l=ls[id];assert len(l['explanation'])==len(heads[id]) and all(h.strip() for h in heads[id]),id
  sections+=len(heads[id])
 report[course]={'lessons':len(route),'sections':sections}
 if course not in ('rust','php','ruby','r'):continue
 examples=read(f'docs/{course}-wording-v1/examples.json');focus=read(f'docs/{course}-wording-v1/focus.json')
 assert set(focus)==set(route) and {e['id'] for e in examples}==set(route)
 for ex in examples:
  id=ex['id'];l=ls[id]
  blocks=re.findall(r'```'+course+r'\n([\s\S]*?)\n```','\n'.join(l['explanation']))
  assert blocks==[ex['code']] and focus[id][0] in ex['code'] and all(focus[id]),id
  receipt=read(f'docs/{course}-wording-v1/{id}-review.json');assert receipt['position']==route.index(id)+1
  for ch in receipt['changes']:assert ch['after']==l[ch['field']],(id,ch['field'])
 native=read(f'docs/{course}-wording-v1/native-results.json');assert len(native)==2*len(route) and all(f['pass'] for f in native)
 report[course].update(workedExamples=len(examples),nativeChecks=len(native))
assert sum(t['sections'] for t in report.values())==7112
terms=read('content/terminology.json')
for c in ('rust','php','ruby','r'):
 changes=read(f'docs/{c}-wording-v1/terminology-wording.json')
 for change in changes:
  entry=next(x for x in terms if x['id']==change['term'])
  assert entry['meaning']==change['after'] and entry['example']
  for link in entry['links']:
   assert link['lessonId'] in ls and 0<=link['paragraph']<len(ls[link['lessonId']]['explanation'])
 report[c]['simplifiedDefinitions']=len(changes)
print('PASS:',len(report),'courses,',len(ls),'lessons, 7112 section headings; 268 final-course examples, 536 native checks.')
