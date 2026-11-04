import json,hashlib,re
from pathlib import Path
root=Path(__file__).resolve().parents[1]
def read(p):return json.loads((root/p).read_text(encoding="utf-8"))
def digest(v):return hashlib.sha256(json.dumps(v,sort_keys=True,separators=(",",":"),ensure_ascii=False).encode()).hexdigest()
lessons=read("content/lessons.json");catalog=read("content/catalog.json");base=read("docs/ruby-wording-v1/baseline.json")
route=[u['id'] for u in catalog['units'] if u['track']=='ruby'];heads=read("content/ruby-reviewed-headings.json")
assert len(lessons)==1221 and len(catalog["units"])==1221
assert route==base["route"] and set(heads)==set(route) and len(route)==64
assert len(list((root/"docs/ruby-wording-v1").glob("ruby-*-review.json")))==64
assert digest([x for x in lessons if x["id"] not in route])==base["otherLessons"]
assert digest([x for x in catalog["units"] if x["id"] not in route])==base["otherUnits"]
assert digest({k:v for k,v in catalog.items() if k!="units"})==base["catalogMetadata"]
sections=examples=0
for i,id in enumerate(route):
 old=next(x for x in base["lessons"] if x["id"]==id);new=next(x for x in lessons if x["id"]==id)
 receipt=read(f"docs/ruby-wording-v1/{id}-review.json")
 assert receipt["position"]==i+1 and receipt["reviewer"]=="host"
 allowed={"summary","explanation","steps","hints","quiz","externalNotes"}
 for k in old:
  if k not in allowed:assert new[k]==old[k],(id,k)
 assert len(new["explanation"])==len(old["explanation"])==len(heads[id])
 assert new["quiz"]["answer"]==old["quiz"]["answer"] and len(new["quiz"]["choices"])==len(old["quiz"]["choices"])
 assert len(set(heads[id]))==len(heads[id]) and heads[id]==receipt["headings"]
 for change in receipt["changes"]:
  assert change["field"] in allowed
  assert change["before"]==old.get(change["field"]) and change["after"]==new[change["field"]],(id,change["field"])
 unit=next(x for x in catalog["units"] if x["id"]==id);prior=next(x for x in base["units"] if x["id"]==id)
 assert unit["project"]==receipt["project"]
 clone=json.loads(json.dumps(unit))
 for field in ["task","done_when"]:clone["project"][field]=prior["project"][field]
 assert clone==prior
 for s in new["explanation"]:
  sections+=1
  assert len(re.findall(r"^```",s,re.M))%2==0
  assert len(re.findall(r"^```\w+",s,re.M))<=1,(id,"one code example per section")
  examples+=len(re.findall(r"^```\w+",s,re.M))
 assert sum(len(re.findall(r"^```\w+\n", s, re.M)) for s in new["explanation"]) == 1, (id, "one worked example, split by required files only")
 assert not any(phrase in " ".join(new["explanation"]+new["steps"]+new["hints"]) for phrase in ["changed-case result","fixture-specific","certify a screen-reader"])
report={"status":"PASS","lessons":64,"sections":sections,"fencedExamples":examples,"unchangedOtherLessons":1157,"unchangedOtherUnits":1157,"preserved":["lesson IDs and route","section counts","quiz answer positions","starter and solution code","assessment checks","companion files","other courses and catalog metadata"],"reviewer":"host","order":"one lesson at a time"}
(root/"docs/ruby-wording-v1/course-results.json").write_text(json.dumps(report,indent=2)+"\n",encoding="utf-8")
print(json.dumps(report,indent=2))

