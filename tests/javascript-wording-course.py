import json,hashlib,re
from pathlib import Path
root=Path(__file__).resolve().parents[1]
def read(p):return json.loads((root/p).read_text(encoding="utf-8"))
def hash(v):return hashlib.sha256(json.dumps(v,sort_keys=True,separators=(",",":"),ensure_ascii=False).encode()).hexdigest()
ls=read("content/lessons.json");cat=read("content/catalog.json");base=read("docs/javascript-wording-v1/baseline.json");keep=read("docs/javascript-wording-v1/preservation.json")
route=read("content/javascript-route-plan.json")["recommendedSeedOrder"];heads=read("content/javascript-reviewed-headings.json")
assert len(ls)==1221 and len(cat["units"])==1221
assert route==base["route"] and set(heads)==set(route) and len(route)==69
assert len(list((root/"docs/javascript-wording-v1").glob("javascript-*-review.json")))==69
assert hash([x for x in ls if not x["id"].startswith("javascript-")])==keep["otherLessons"]
assert hash([x for x in cat["units"] if not x["id"].startswith("javascript-")])==keep["otherUnits"]
assert hash({k:v for k,v in cat.items() if k!="units"})==keep["catalogMetadata"]
for i,id in enumerate(route):
 old=next(x for x in base["lessons"] if x["id"]==id);new=next(x for x in ls if x["id"]==id)
 record=read(f"docs/javascript-wording-v1/{id}-review.json")
 assert record["position"]==i+1 and record["reviewer"]=="host"
 allowed={"summary","explanation","steps","hints","quiz","externalNotes"}|({"checks"} if id in keep["checkFixes"] else set())
 for k in old:
  if k not in allowed:assert new[k]==old[k],(id,k)
 assert len(new["explanation"])==len(old["explanation"])==len(heads[id])
 assert new["quiz"]["answer"]==old["quiz"]["answer"] and len(new["quiz"]["choices"])==len(old["quiz"]["choices"])
 assert len(set(heads[id]))==len(heads[id])
 assert record["headings"]==heads[id]
 for c in record["changes"]:
  assert c["field"] in allowed and c["before"]==old[c["field"]] and c["after"]==new[c["field"]],(id,c["field"])
 u=next(x for x in cat["units"] if x["id"]==id);v=next(x for x in base["units"] if x["id"]==id)
 assert u["project"]==record["project"]
 clone=json.loads(json.dumps(u))
 for field in ["task","done_when"]:clone["project"][field]=v["project"][field]
 assert clone==v
 for s in new["explanation"]:
  assert len(re.findall(r"^\x60\x60\x60",s,re.M))%2==0
  assert len(re.findall(r"^\x60\x60\x60javascript",s,re.M))<=1,(id,"one JavaScript example per section")
 assert any("\x60\x60\x60javascript" in s for s in new["explanation"])
 assert bool(new.get("externalNotes"))==(id in {"javascript-16","javascript-46"}), (id,"only actual local module tasks require an external run")
print("PASS: all 69 lessons reviewed in route order; 1,152 other lessons and units unchanged; IDs, section counts, quiz answers, project code preserved; three documented check repairs.")

