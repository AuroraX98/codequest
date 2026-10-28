import fs from 'node:fs';
const path='content/lessons.json';
const lessons=JSON.parse(fs.readFileSync(path,'utf8'));
const deltas=[];
function replace(id,index,after){const l=lessons.find(x=>x.id===id);deltas.push({id,field:`checks.${index}`,before:l.checks[index],after});l.checks[index]=after;}
replace('backend-02',1,{label:'Adding the exact new record preserves every earlier record',expression:"(()=>{const before=loadEntries();const snapshot=JSON.stringify(before);saveEntry({id:'c',minutes:5});const after=loadEntries();return JSON.stringify(before)===snapshot&&JSON.stringify(after)===JSON.stringify([...before,{id:'c',minutes:5}]);})()"});
replace('backend-12',3,{label:'Mutable old state stays unchanged in both window branches',expression:"[10,1000].every(now=>{const state={windowStart:0,count:1};const before=JSON.stringify(state);const result=takeRequest(state,now);return JSON.stringify(state)===before&&result.state!==state&&result.state.count===(now===1000?1:2)&&result.state.windowStart===(now===1000?1000:0);})"});
for(const [id,name] of [['backend-03','report'],['sql-12','customer_orders']]){const l=lessons.find(x=>x.id===id);const after={label:'The named report is a view, not a replacement table',expression:`SELECT COUNT(*)=1 FROM sqlite_master WHERE type='view' AND name='${name}'`};deltas.push({id,field:'checks',before:structuredClone(l.checks),after:[...l.checks,after]});l.checks.push(after);}
const l=lessons.find(x=>x.id==='backend-05');
const after={label:'Successful and failed calls preserve ordinary mutable input',expression:"[false,true].every(fail=>{const state={available:20,saved:0};const before=JSON.stringify(state);transfer(state,7,fail);return JSON.stringify(state)===before;})"};
deltas.push({id:l.id,field:'checks',before:structuredClone(l.checks),after:[...l.checks,after]});l.checks.push(after);
fs.mkdirSync('docs/remaining-core-v1',{recursive:true});
fs.writeFileSync('docs/remaining-core-v1/existing-check-deltas.json',JSON.stringify(deltas,null,2)+'\n');
fs.writeFileSync(path,JSON.stringify(lessons,null,2)+'\n');
console.log('Strengthened five existing lessons; authored text and IDs preserved.');
