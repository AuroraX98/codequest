import fs from 'node:fs';
// Original authored practice models. Each tuple defines one observable contract.
const rows = [
['Match both method and path','routeName(method, path)','return method === "GET" && path === "/notes" ? "list" : "missing";',[
['GET','/notes','list'],['POST','/notes','missing'],['GET','/notes/1','missing']],
'A route selects a handler using both the requested action and the resource path. Two requests can share a path while asking for different actions.',
'The && operator requires both comparisons to be true. The conditional expression chooses one result; it does not start a server.',
'POST /notes reaches this GET-only route. Which result follows?',['missing','list','A note is automatically created'],0,
'Both method and path must match; a matching path alone is insufficient.'],
['Separate a path from its query','requestPath(target)','return new URL(target, "https://example.test").pathname;',[
['/notes?limit=2','/notes'],['/notes/7?draft=true','/notes/7'],['/','/']],
'A request target may contain a path followed by query settings. Route selection should not accidentally treat the query as part of the path.',
'new URL(target, base) parses the relative target using a fixed origin. .pathname reads only the path; it does not make a network request.',
'What path comes from /notes?limit=5?',['/notes?limit=5','/notes','limit=5'],1,
'The question mark begins the query. The pathname remains /notes.'],
['Reject repeated single-value queries','readLimit(target)','const values = new URL(target, "https://example.test").searchParams.getAll("limit");\n  return values.length === 1 ? values[0] : null;',[
['/notes?limit=2','2'],['/notes?limit=2&limit=8',null],['/notes',null]],
'Some query settings should occur once. Silently choosing the first or last repeated value can make two layers interpret a request differently.',
'searchParams.getAll("limit") returns every occurrence as an array. length checks how many were supplied. This step checks multiplicity, not whether the text is a valid number.',
'A request contains limit=2&limit=8. What does this contract return?',['8','2','null'],2,
'Two values violate the exactly-one rule. Number validation is a separate step.'],
['Handle malformed JSON text','parseBody(text)','try { return {ok:true,value:JSON.parse(text)}; }\n  catch { return {ok:false}; }',[
['{"minutes":5}',{ok:true,value:{minutes:5}}],['{"minutes":',{ok:false}],['null',{ok:true,value:null}]],
'JSON parsing turns text into a JavaScript value. Invalid syntax causes JSON.parse to throw. A request handler needs an explicit failure path.',
'try contains the operation that can fail. catch handles a parsing failure. Successful parsing can still produce null, a number, or an array; it does not prove a valid request shape.',
'The text null parses successfully. Does that prove it is a valid note object?',['Yes, every JSON value is an object','No, shape validation is still needed','No, JSON cannot contain null'],1,
'Parsing verifies syntax. A later validator must check the value required by the application.'],
['Require a record-shaped body','isRecord(value)','return value !== null && typeof value === "object" && !Array.isArray(value);',[
[{title:'Moon'},true],[null,false],[[],false],['Moon',false]],
'After JSON parsing, require an object before reading named fields. Arrays and null need explicit rejection for this record-shaped request contract.',
'typeof null is "object", so the first comparison matters. Array.isArray detects arrays. The ! operator reverses its answer. This model accepts ordinary values produced by JSON.parse, not arbitrary class instances.',
'Why is typeof value === "object" insufficient by itself?',['It also accepts null and arrays','It rejects every JSON object','It proves the title is valid'],0,
'Null and arrays satisfy that typeof comparison. Named-field requirements come after this guard.'],
['Normalize only surrounding whitespace','cleanTitle(title)','return typeof title === "string" && title.trim().length > 0 ? title.trim() : null;',[
['  Moon notes  ','Moon notes'],[' A  B ','A  B'],['   ',null],[8,null]],
'A title may have accidental spaces at its edges. Normalization should follow a stated rule instead of silently rewriting meaningful internal spacing.',
'trim() returns a new string with surrounding whitespace removed. It does not change the original string. The type guard prevents calling a string method on a number.',
'What happens to the two spaces inside " A  B "?',['They are both removed','They remain','The title is rejected'],1,
'Only surrounding whitespace is removed by this rule. The internal text stays unchanged.'],
['Validate a whole-number range','validMinutes(value)','return Number.isInteger(value) && value >= 1 && value <= 180;',[
[1,true],[180,true],[0,false],[181,false],[1.5,false],['25',false]],
'A numeric field needs both a type rule and an allowed range. This contract accepts whole numbers from 1 through 180, including both endpoints.',
'Number.isInteger does not coerce text into a number. >= and <= include the endpoint values. && means all three conditions must pass.',
'Does the string "25" satisfy this numeric JSON-field contract?',['Yes, because it looks numeric','No, because strings are not numbers','Only if it is below 180'],1,
'The contract accepts a number. A query-text parser would use a different, explicit conversion step.'],
['Allow only intended write fields','titlePatch(body)','return {title:body.title};',[
[{title:'Moon',ownerId:'attacker'},{title:'Moon'}],[{title:'Sea',admin:true},{title:'Sea'}]],
'A validated request can still contain fields the caller must not control. Build the write object from an explicit list of permitted fields.',
'The object literal creates a new object with only title. Spreading the entire body would also copy ownerId or admin. This step assumes title was already validated.',
'Why not use {...body} for this update?',['It always deletes title','It may copy fields the caller must not control','It validates ownership automatically'],1,
'An allowlist determines writable fields. Ownership must come from a trusted session and stored record.'],
['Project a public response','publicNote(note)','return {id:note.id,title:note.title};',[
[{id:1,title:'Moon',ownerEmail:'private@example.test'},{id:1,title:'Moon'}],[{id:2,title:'Sea',token:'secret'},{id:2,title:'Sea'}]],
'The stored object may contain information a response should not reveal. Construct an explicit response rather than returning the whole stored row.',
'Reading note.id and note.title selects those values. The returned object has no ownerEmail or token field. Projection is separate from deciding who may read the note.',
'A new private field is added to the stored row. What happens with this explicit projection?',['It is automatically returned','The response stops working','It remains excluded'],2,
'Only the named response fields are copied, so an unrelated stored field stays out.'],
['Represent an empty successful response','deleteReply(removed)','return removed ? {status:204,body:null} : {status:404,body:{error:"Not found"}};',[
[true,{status:204,body:null}],[false,{status:404,body:{error:'Not found'}}]],
'A successful deletion may use status 204, which has no response body. A missing record can use a different status under the chosen API contract.',
'The conditional expression selects the status and body together. null here models the absence of a body; a real adapter must not serialize the word null into a 204 response.',
'Should the real HTTP adapter send the JSON text null for the 204 branch?',['No, it should send no body','Yes, every response needs JSON','Only if the note was private'],0,
'The helper uses null as a model marker. HTTP 204 means there is no response content.'],
['Use a deterministic tie-breaker','orderedNotes(notes)','return [...notes].sort((a,b)=>a.created-b.created || a.id-b.id);',[
[[{id:2,created:10},{id:1,created:10}],[{id:1,created:10},{id:2,created:10}]],[[{id:3,created:1},{id:1,created:2}],[{id:3,created:1},{id:1,created:2}]]],
'Pagination needs predictable ordering. When two records share a creation value, an identity tie-breaker gives them a defined order.',
'[...notes] copies the array before sort changes it. The first subtraction orders by created. A zero result makes || choose the identity comparison. Records are assumed to have distinct integer IDs.',
'Two notes have the same created value. Which field decides their order?',['Their original array position','Their title length','Their id'],2,
'The second comparison orders tied records by ID. This avoids relying on input arrival order.'],
['Find a record by identity','findNote(notes,id)','return notes.find(note=>note.id === id) ?? null;',[
[[{id:4,title:'Moon'},{id:9,title:'Sea'}],9,{id:9,title:'Sea'}],[[{id:4,title:'Moon'}],2,null]],
'An identity is not an array position. Deletions and reordering can make the second array element have an ID other than two.',
'find calls its predicate on records until one matches. === compares the stored ID with the requested ID. ?? converts the missing result, undefined, into this API’s null marker.',
'A note has ID 9 but is the first item. Which lookup is correct?',['notes[9]','Find the item whose id is 9','Always read notes[0]'],1,
'Identity lookup searches the ID field. Its current position is incidental.'],
['Append without losing existing records','appendNote(notes,note)','return [...notes,{...note}];',[
[[{id:1,title:'Moon'}],{id:2,title:'Sea'},[{id:1,title:'Moon'},{id:2,title:'Sea'}]],[[],{id:7,title:'Sky'},[{id:7,title:'Sky'}]]],
'Adding one record must preserve every earlier record and append the requested content. Checking only the new length could miss overwritten or incorrect records.',
'The array spread copies existing entries into a new array. The object spread copies the new record’s top-level fields. This is a shallow copy; nested objects would still need their own ownership policy.',
'A result has the right length but replaces the old title. Has it met the append contract?',['Yes, length is enough','No, old record content must survive','Yes, if the new record is correct'],1,
'The contract includes exact old content and the exact added item. Counts alone cannot establish either.'],
['Replace one record without changing the input','renameNote(notes,id,title)','return notes.map(note=>note.id === id ? {...note,title} : note);',[
[[{id:1,title:'Moon'},{id:2,title:'Sea'}],2,'Ocean',[{id:1,title:'Moon'},{id:2,title:'Ocean'}]],[[{id:1,title:'Moon'}],9,'Sky',[{id:1,title:'Moon'}]]],
'An immutable update returns a new collection while leaving the caller’s existing collection unchanged. Only the matching record receives the new title.',
'map creates a new array. For the matching ID, {...note,title} copies the record and replaces its title. Unmatched records are reused because this function does not mutate them.',
'Why test with ordinary mutable input as well as frozen input?',['Frozen input proves every side effect','Mutable input lets the test observe accidental writes directly','Mutable input disables assertions'],1,
'An accidental write can fail silently on frozen objects. Comparing mutable input before and after catches a real change.'],
['Remove only the selected identity','removeNote(notes,id)','return notes.filter(note=>note.id !== id);',[
[[{id:1},{id:2},{id:3}],2,[{id:1},{id:3}]],[[{id:1}],8,[{id:1}]],[[],1,[]]],
'Deletion should specify what disappears and what survives. Removing an unknown ID leaves the contents unchanged under this contract.',
'filter keeps records whose predicate is true. !== keeps every ID except the selected one. filter returns a new array without changing the input array.',
'The requested ID is absent. What should this helper return?',['An empty array','The same records in a new array','The first record removed'],1,
'Every existing record passes the not-equal predicate, so all survive.'],
['Detect duplicate identities','hasDuplicateIds(notes)','const ids=notes.map(note=>note.id);\n  return new Set(ids).size !== ids.length;',[
[[{id:1},{id:2}],false],[[{id:1},{id:1}],true],[[],false]],
'Unique identities make record lookup unambiguous. A repeated ID is a data problem even if the titles differ.',
'map extracts IDs. Set stores each distinct value once. If its size is smaller than the original list, at least one identity occurred more than once. IDs here are integers.',
'Two records have ID 3 and different titles. Are their IDs unique?',['Yes, because the titles differ','No, the identity repeats','Only if they are adjacent'],1,
'Uniqueness concerns the ID field, independent of title or position.'],
['Reject a stale version update','updateVersion(record,expected,title)','if(record.version !== expected) return {status:409};\n  return {status:200,record:{...record,title,version:record.version+1}};',[
[{id:1,title:'Moon',version:3},3,'Sea',{status:200,record:{id:1,title:'Sea',version:4}}],[{id:1,title:'Moon',version:3},2,'Sea',{status:409}]],
'Two clients may edit the same record. A version comparison can reject a request based on an older version instead of silently replacing a newer change.',
'The early return rejects a mismatch. The success branch copies the record and increments its version. In a real database, comparison and update must be one atomic operation; this pure helper does not solve concurrency.',
'A client expects version 2, but storage has version 3. What follows?',['Overwrite version 3','Return a conflict','Pretend version 2 still exists'],1,
'The client’s starting version is stale. The application must reconcile before retrying an update.'],
['Keep SQL text separate from values','lookupQuery(id)','return {sql:"SELECT id, title FROM notes WHERE id = ?",params:[id]};',[
['7',{sql:'SELECT id, title FROM notes WHERE id = ?',params:['7']}],["7 OR 1=1",{sql:'SELECT id, title FROM notes WHERE id = ?',params:['7 OR 1=1']}]],
'A bound query keeps the SQL structure fixed while supplying values separately. User text must not become part of the SQL program.',
'The question mark is a value placeholder. params holds the value to bind through a database API. Returning this object does not execute SQL; the adapter must actually use parameter binding.',
'What happens to the text "7 OR 1=1" in this query model?',['It becomes extra SQL instructions','It stays one parameter value','It changes the SELECT columns'],1,
'The SQL text stays fixed. A correctly binding database adapter treats the parameter as data.'],
['Separate identity from permission','accessDecision(session,allowed)','if(!session) return "sign-in";\n  return allowed ? "allow" : "forbid";',[
[null,true,'sign-in'],[{userId:'a'},false,'forbid'],[{userId:'a'},true,'allow']],
'Authentication establishes who is making a request. Authorization decides whether that identity may perform the requested action.',
'The first branch handles a missing trusted session. Only after an identity exists does the allowed decision matter. This helper does not create or validate session tokens.',
'A signed-in user lacks permission. Which result fits?',['allow','sign-in','forbid'],2,
'Being signed in does not grant every permission. The identity is known, but this action is forbidden.'],
['Check ownership against stored data','ownsNote(session,note)','return Boolean(session && session.userId === note.ownerId);',[
[{userId:'a'},{ownerId:'a'},true],[{userId:'b'},{ownerId:'a'},false],[null,{ownerId:'a'},false]],
'A private record belongs to an owner stored by the application. Compare that owner with a trusted session, rather than accepting an owner claim from the request body.',
'&& stops when the session is absent. === compares the trusted session ID with the stored owner ID. Boolean converts the result to exactly true or false.',
'A caller changes body.ownerId to match themselves. Should that grant access to someone else’s stored note?',['Yes, the body is authoritative','No, compare against the stored owner','Only for updates'],1,
'The request body is caller-controlled. It cannot redefine ownership for the permission check.'],
['Make the session-expiry boundary explicit','sessionActive(session,now)','return Boolean(session && now < session.expiresAt);',[
[{expiresAt:100},99,true],[{expiresAt:100},100,false],[{expiresAt:100},101,false],[null,0,false]],
'An expiry time defines when a session stops being valid. This contract treats the exact expiry instant as expired.',
'now and expiresAt use the same supplied time unit. The strict less-than comparison excludes equality. A real service needs a trusted clock and validated session data; browser-provided time is not an authority.',
'now equals expiresAt. Is the session active?',['Yes, equality extends it','No, the strict comparison fails','Only if the user reloads'],1,
'The accepted interval ends before expiresAt. Equality is outside it.'],
['Distinguish origin policy from permission','allowedOrigin(origin)','return ["https://notes.example.test"].includes(origin);',[
['https://notes.example.test',true],['https://notes.example.test.evil.test',false],['http://notes.example.test',false],[null,false]],
'An origin combines scheme, host, and port. A browser cross-origin policy may allow selected origins to read a response, but it is not a substitute for authentication or authorization.',
'includes performs exact membership comparison in this small allowlist. A substring check could accept a lookalike host. This exercise returns a policy decision; it does not configure CORS response headers.',
'An origin is allowed. Does that prove its user owns a private record?',['Yes, origins identify record owners','No, ownership still needs its own check','Yes, if HTTPS is used'],1,
'Origin policy governs browser access. It does not identify a particular user or grant record ownership.'],
['Log only diagnostic fields','logSummary(event)','return {requestId:event.requestId,status:event.status};',[
[{requestId:'r1',status:500,token:'secret',body:'private'},{requestId:'r1',status:500}],[{requestId:'r2',status:200,password:'secret'},{requestId:'r2',status:200}]],
'A diagnostic log can help connect a failed request with a status without copying the whole request. Explicitly select the fields needed for that investigation.',
'The object literal copies only requestId and status. This example assumes requestId is an application-generated safe identifier. It is not a universal sanitizer for arbitrary nested event objects.',
'The incoming event gains a password field. What will this summary contain?',['The password too','Only requestId and status','No fields at all'],1,
'The explicit projection excludes additional fields. Real logging also needs appropriate access and retention policies.'],
['Retry only an eligible operation','canRetry(method,status)','return method === "GET" && [502,503,504].includes(status);',[
['GET',503,true],['POST',503,false],['GET',400,false],['GET',200,false]],
'A retry repeats an operation after a failure. Repeating an operation that creates a new record may duplicate work, so the retry policy must consider the operation as well as the failure.',
'This deliberately narrow policy allows only GET with three selected transient gateway/service statuses. It is an application policy, not a list of all retriable HTTP situations.',
'A POST creation receives 503. Does this narrow policy automatically retry it?',['Yes, any 503 is safe','No, POST is outside the allowed policy','Yes, because status codes prevent duplicates'],1,
'This policy permits GET only. Retrying a write requires a deliberate idempotency design.'],
['Put a bound on retry attempts','retryDelay(attempt)','return Number.isInteger(attempt) && attempt >= 0 && attempt < 3 ? 100 * 2 ** attempt : null;',[
[0,100],[1,200],[2,400],[3,null],[-1,null],[1.5,null]],
'A retry loop needs a stopping condition. This model allows attempts numbered 0, 1, and 2, then returns null to mean stop.',
'** raises two to a power. Multiplying by 100 yields increasing delays in milliseconds. Returning a number does not wait; a caller must schedule it and respect cancellation and server guidance.',
'What does attempt 3 return under this zero-based budget?',['800','0','null'],2,
'There are three permitted attempts: 0, 1, and 2. The next one is outside the budget.'],
['Do not infer failure from a client timeout','timeoutOutcome(clientTimedOut,receipt)','if(receipt) return "confirmed";\n  return clientTimedOut ? "unknown" : "waiting";',[
[true,null,'unknown'],[true,{id:7},'confirmed'],[false,null,'waiting']],
'A client timeout means the client stopped waiting. It does not prove whether a remote write completed before or after that point.',
'The first branch accepts an actual successful operation receipt in this model. Without one, a timeout gives an unknown outcome. Reconcile that outcome before repeating a non-idempotent action.',
'The client times out after sending a creation request. Is it safe to claim nothing was created?',['Yes, timeout rolls back every server','No, the outcome may be unknown','Yes, if there is no response body'],1,
'The server may have completed the write while the response was lost or delayed.'],
['Separate readiness from process existence','ready(state)','return state.databaseConnected && !state.draining;',[
[{databaseConnected:true,draining:false},true],[{databaseConnected:false,draining:false},false],[{databaseConnected:true,draining:true},false]],
'A running process is not necessarily ready to accept work. Readiness reflects the dependencies and lifecycle conditions required by the application.',
'The && requires both an available database and no draining state. ! reverses draining. This model assumes boolean inputs supplied by actual probes; it does not probe a database itself.',
'The process runs but its required database is disconnected. Is it ready by this contract?',['Yes, a running process is always ready','No, a required dependency is unavailable','Only if the homepage is cached'],1,
'This application’s readiness requires the database connection, not merely a live process.'],
['Acknowledge after durable work','shouldAcknowledge(job)','return job.saved === true;',[
[{saved:false},false],[{saved:true},true],[{},false]],
'A queue acknowledgement tells the queue the consumer is finished. Acknowledging before the required durable result exists can lose work if the consumer crashes.',
'The strict comparison accepts only a confirmed saved flag in this model. It does not perform persistence. Real consumers also need to tolerate repeated delivery when a save succeeds but acknowledgement is lost.',
'The result was saved, but acknowledgement was lost. What must a robust consumer expect?',['The queue can never redeliver','The same job may arrive again','The saved result is automatically erased'],1,
'Delivery and persistence are separate events. Idempotent processing handles a repeated job safely.'],
['Drain active work before stopping','shutdownState(active,elapsed,deadline)','if(active === 0) return "stop";\n  return elapsed >= deadline ? "deadline" : "drain";',[
[0,0,100,'stop'],[2,99,100,'drain'],[2,100,100,'deadline']],
'Graceful shutdown stops accepting new work and gives active work a bounded chance to finish. An unbounded wait can leave a process stuck forever.',
'The first branch stops when no active work remains. Otherwise the deadline comparison distinguishes waiting from timeout. A deadline result does not prove unfinished work succeeded; the surrounding service must define cancellation and recovery.',
'The deadline arrives while two jobs remain active. What can this helper honestly report?',['Every job succeeded','The deadline was reached','There was no active work'],1,
'The deadline bounds waiting. It provides no success receipt for unfinished work.']
];

const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const lessons=read('content/lessons.json'),catalog=read('content/catalog.json');
if(lessons.some(l=>l.id==='backend-15'))throw Error('Already authored; inspect before rerunning.');
const additions=[];
for(let i=0;i<rows.length;i++){
 const [title,signature,body,cases,intro,breakdown,question,choices,answer,feedback]=rows[i];
 const id=`backend-${i+15}`,name=signature.split('(')[0];
 const solution=`function ${signature} {\n  ${body}\n}`;
 const args=cases[0].slice(0,-1),expected=cases[0].at(-1);
 const call=`${name}(${args.map(x=>JSON.stringify(x)).join(', ')})`;
 const checks=cases.map((c,n)=>({label:`Case ${n+1}: ${JSON.stringify(c.slice(0,-1))} gives ${JSON.stringify(c.at(-1))}`,expression:`JSON.stringify(${name}(${c.slice(0,-1).map(x=>JSON.stringify(x)).join(',')}))===${JSON.stringify(JSON.stringify(c.at(-1)))}`}));
 // Snapshot ordinary mutable inputs; frozen objects alone cannot demonstrate this contract.
 checks.push({label:'The function preserves the supplied input values',expression:`(()=>{const args=${JSON.stringify(args)};const before=JSON.stringify(args);${name}(...args);return JSON.stringify(args)===before;})()`});
 const summary=`Implement ${signature}. Match the worked contract and the changed-input checks without modifying the supplied input values.`;
 const lesson={id,title,summary,explanation:[intro,`This exercise is a small pure JavaScript model. Its inputs are supplied directly; it does not receive live HTTP requests, operate a database, or deploy a service.`, `Worked example:\n\n\x60\x60\x60javascript\n${solution}\nconsole.log(${call});\n\x60\x60\x60\nThe returned value is ${JSON.stringify(expected)}.`,breakdown,`Read the function call ${call} from the inside out: the arguments supply the inputs, ${name} runs the body once, and return sends its result back to the caller. console.log displays that result; it does not change it.`,`${question} ${feedback}`],analogy:{familiar:'',connection:'',limit:'The practice is a bounded policy or data transformation, not a running backend.'},steps:['Read the contract and trace the worked example.','Replace the unfinished return in the starter.','Run the changed-input checks.','Explain the boundary in the understanding question.'],starter:`function ${signature} {\n  // TODO: implement the stated contract.\n  return null;\n}`,solution,runtime:'javascript',checks,quiz:{question,choices,answer,explanation:feedback},hints:[breakdown],math:null,filename:'main.js',estimatedMinutes:8,externalNotes:'Runs as a pure JavaScript function in the browser. Passing checks does not establish live HTTP behavior, database durability, concurrency safety, authentication security, queue delivery guarantees, or production readiness.'};
 const unit={id,track:'backend',level:i<11?'beginner':i<18?'intermediate':'advanced',topic:title,origin:'original bounded backend continuation',source:{url:'https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Overview'},project:{title,task:summary,done_when:'Pass the changed-input checks and explain the understanding question. Live-service behavior is outside this model.'},math:{level:null,topic:null,task:null},prerequisite_ids:[i===0?'javascript-06':`backend-${i+14}`],interaction_pattern:['one idea','worked example','code breakdown','changed input','understanding check']};
 lessons.push(lesson);catalog.units.push(unit);additions.push({lesson,unit});
}
if(rows.length!==29)throw Error('Backend target mismatch');
for(const [p,v]of [['content/lessons.json',lessons],['content/catalog.json',catalog],['docs/remaining-core-v1/backend-additions.json',additions]])fs.writeFileSync(p,JSON.stringify(v,null,2)+'\n');
console.log(`Authored ${rows.length} Backend lessons; total ${lessons.length}.`);
