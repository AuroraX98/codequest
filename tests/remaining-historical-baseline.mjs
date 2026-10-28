import fs from 'node:fs';
const deltas=JSON.parse(fs.readFileSync('docs/remaining-core-v1/existing-check-deltas.json','utf8'));
// Historical suites keep checking their exact release. The current release's
// independent preservation test verifies every declared delta against Git.
export function historicalRemainingBaseline(value){
 if(!Array.isArray(value))return value;
 const rows=structuredClone(value);
 for(const d of [...deltas].reverse()){
  const l=rows.find(l=>l.id===d.id&&Array.isArray(l.checks));if(!l)continue;
  let target=l;const parts=d.field.split('.');for(const k of parts.slice(0,-1))target=target[k];
  const k=parts.at(-1);if(JSON.stringify(target[k])===JSON.stringify(d.after))target[k]=structuredClone(d.before);
 }
 return rows;
}
