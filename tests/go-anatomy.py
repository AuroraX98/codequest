"""Turn Go parser/scanner ranges into plain labels for the exact reviewed examples.
First run: go run tests/go-syntax.go docs/go-wording-v1/examples.json TOKEN_FILE
Then run: python tests/go-anatomy.py TOKEN_FILE
"""
import json,re,sys
from pathlib import Path
r=Path(__file__).resolve().parents[1];docs=r/'docs/go-wording-v1'
examples={x['id']:x['code'] for x in json.loads((docs/'examples.json').read_text(encoding='utf8'))}
rows=json.loads(Path(sys.argv[1]).read_text(encoding='utf8'));meanings=[];ids={};out=[]
def m(label,ex,tone='purple'):return (label,ex,tone)
def table(s):
 return {line.split('|',1)[0]:tuple(line.split('|')[1:]) for line in s.strip().splitlines()}
calls=table("""
fmt.Println|Show a line|Show the values, with spaces between them, then start a new line.
fmt.Printf|Show formatted text|Use the format string to decide how the following values look.
fmt.Print|Show text|Display the supplied value without adding a newline.
fmt.Fprint|Write to the response|Write the text to this response writer and report the byte count and any error.
fmt.Errorf|Build an error|Build an error with the supplied format; %w keeps a link to the original error.
errors.New|Create an error|Create a new error value with this message.
errors.Is|Check the cause|Check whether this error matches the target, including through a wrap.
int|Convert to an integer|Convert this in-range numeric value to int, dropping its fractional part.
string|Convert bytes to text|Make a string from these bytes.
Count|Convert to Count|Make this integer a value of the defined type Count.
len|Count the items|Return the number of items; for a string, count its bytes.
make|Create storage|Create the slice, map, or channel described by the supplied type and sizes.
append|Add items|Add items and return the updated slice. Its storage can change when more room is needed.
copy|Copy items|Copy into existing destination slots, up to the shorter slice's length.
close|Close the channel|Signal that no more values will be sent. Queued values stay available.
panic|Start a panic|Stop normal work on this path and run deferred calls as functions unwind.
recover|Recover a panic|When called directly in this deferred function, stop the active panic and return its value.
nextCount|Get the next count|Add one to the input and return the result.
divide|Divide if allowed|Return the quotient and a success flag, or zero and false for a zero divisor.
total|Add the inputs|Sum all supplied integers and return the total.
transform|Use the saved function|Run the function using its input and the current outer factor.
c.Next|Call the value method|Add one to a receiver copy and return its changed field.
c.Add|Change the original counter|Use the pointer receiver to add one to the original field.
show|Use a Reader|Call Read through the supplied Reader and display the result.
r.Read|Read through the interface|Run the Read method supplied by the value held in this Reader.
minutes|Check the minutes|Return the allowed count, or an error if the input is negative.
guarded|Run the guarded work|Run the function with its deferred recovery step.
First|Get the first item|Return the first item and true, or the type's zero value and false.
Add|Add two allowed values|Add values whose type fits the Integer constraint.
Same|Compare equal values|Use equality on two values of the allowed comparable type.
helper.Label|Call the package helper|Read the text returned by the exported Label function in helper.
math.Double|Call the local module|Pass the number to Double in the supplied local math package.
Twice|Double the number|Return the input multiplied by two.
clamp|Limit the number|Keep the answer between zero and ten, including both ends.
t.Fatalf|Fail this test|Report the formatted failure and stop this test or subtest.
t.Run|Run a named subtest|Use the case name and run the supplied test function for that row.
f.Add|Add a fuzz seed|Register an input to try in this fuzz test.
f.Fuzz|Register the fuzz check|Give the test tool the function to run with each input.
strings.Join|Join text pieces|Put the separator between neighboring strings and return the joined text.
b.Fatalf|Fail the benchmark|Report a wrong result and stop this benchmark.
io.Copy|Copy the bytes|Read from the source and write to the destination until input ends or an error occurs.
strings.NewReader|Read from text|Make a reader that supplies the bytes of this string.
dst.String|Get the collected text|Read the buffer's current contents as a string.
os.Create|Create or empty a file|Create the named file or empty an existing file with that name; check the error.
file.WriteString|Write text to the file|Write the string's bytes and return their count and any error.
file.Close|Close the file|Finish using this file and report any close error.
save|Save the text|Create the file, write ready, close it, and return any error.
bufio.NewScanner|Make a scanner|Create a scanner that reads the supplied input one token at a time.
scanner.Buffer|Set the scan limit|Choose the starting buffer and maximum token size before scanning.
scanner.Scan|Read the next token|Return true when another token is ready, or false on end or failure.
scanner.Err|Check why scanning stopped|Read the scanning error, if there was one.
json.Unmarshal|Read JSON into a value|Decode the JSON bytes into the supplied destination and report any error.
time.ParseDuration|Read a duration|Read a number and time units from text, returning a duration or an error.
duration.Seconds|Get seconds|Return the duration as a number of seconds, including fractions.
context.Background|Start a root context|Get a starting context without a deadline or cancellation signal of its own.
context.WithCancel|Create a stop signal|Return a child context and its function for requesting cancellation.
context.WithTimeout|Set a time limit|Return a child context with this time limit and a function to release it.
cancel|Request cancellation|Signal that work using this context should stop. Calling again is safe.
ctx.Done|Get the stop channel|Get the channel that closes when cancellation takes effect.
ctx.Err|Read the stop reason|Return the reason for cancellation, or nil if the context is still active.
wg.Add|Register tasks|Add this many tasks to the unfinished count before starting them.
wg.Done|Finish one task|Subtract one registered task from the unfinished count.
wg.Wait|Wait for all tasks|Wait until the registered unfinished count reaches zero.
mu.Lock|Take the lock|Wait until this worker can enter the protected part.
mu.Unlock|Release the lock|Let another worker take this same lock.
count.Add|Add atomically|Add to this shared integer as one step and return its new value.
count.Load|Read atomically|Read the atomic counter's current value.
w.Header|Get response headers|Get the reply's header map before committing the status or body.
w.Header().Set|Set a response header|Set this named header to the supplied value before writing the reply.
http.Error|Write an error reply|Send the chosen HTTP error status and message to the response writer.
w.WriteHeader|Send the status|Commit the response status and the headers set so far.
httptest.NewRequest|Make a test request|Build an incoming request in memory without opening a network connection.
httptest.NewRecorder|Record a test reply|Make an in-memory writer that records a handler's status and body.
handler|Handle the request|Call this handler with its response writer and request.
recorder.Body.String|Read the recorded body|Get the text written into the recorder's response body.
http.NotFound|Send a missing-page reply|Write status 404 and the standard missing-page message.
request.Context|Get the request context|Read the context attached to this request.
request.Context().Err|Check the request's stop reason|Read whether the request's context was canceled or reached its deadline.
io.NopCloser|Add a no-work close|Wrap this reader with a Close method that has nothing to release.
http.NewRequestWithContext|Make a request with a context|Create an outgoing request carrying the supplied context.
client.Do|Perform the request|Use this client's transport and return the response or an error.
io.ReadAll|Read the remaining bytes|Collect this known small body's bytes and report any read error.
response.Body.Close|Close the response body|Finish using the response body and check the close error.
produce|Send accepted minutes|Send only minute counts in range, then close the output and completion channels.
""")
kw=table("""
package|Name the package|Declare which group of Go code this file belongs to.
import|Bring in a package|Make the named package available to this file.
var|Declare a variable|Create a variable with a chosen type or starting value.
if|Check a condition|Run this path when the condition is true.
else|Use the other path|Run this path when the matching if condition is false.
for|Start a loop|Repeat the body according to this loop's check or range.
range|Visit each item|Visit the values supplied by this slice or channel in turn.
continue|Skip this turn|Skip the rest of this loop turn and move toward the next one.
return|Send back an answer|End this function call and return the listed results, if any.
switch|Choose a matching case|Use the case that matches the checked value.
select|Choose a ready action|Choose a channel action that can proceed, or default if none is ready.
case|Name a choice|Introduce a possible matching value or channel action.
default|Use the fallback|Run this branch if no listed case matches or no listed channel action is ready.
type|Define a type|Give a type its name and definition.
struct|Group named fields|Define the fields held together in a struct value.
interface|List required behavior|Describe the methods required by this interface.
map|Match keys to values|Describe a map that uses keys to find stored values.
defer|Schedule a later call|Evaluate this call's inputs now and run the call when the surrounding function exits.
go|Start a goroutine|Start this function call on another path of work.
chan|Describe a channel|Name the kind of values that can pass through this channel.
""")
op=table("""
+|Add|Add the two numbers and use the sum.
++|Increase by one|Add one and store the new value in this variable or field.
+=|Add and store|Add the right value to the current left value and store the result back.
/|Divide|Divide the left number by the right number.
<|Less than|Ask whether the left value is smaller than the right value.
>|Greater than|Ask whether the left value is larger than the right value.
<=|At most|Ask whether the left value is less than or equal to the right value.
>=|At least|Ask whether the left value is greater than or equal to the right value.
==|Equal to|Ask whether the two values are equal.
!=|Not equal to|Ask whether the two values differ.
&&|Both must be true|Check the right side only if the left side is true.
~|Include underlying types|Allow the named type and types whose underlying type is the one that follows.
""")
types={'int':'A whole-number type whose size depends on the platform.','int64':'A signed whole-number type with exactly 64 bits.','string':'A sequence of bytes used here for text.','bool':'A true-or-false value.','byte':'Another name for uint8: an unsigned eight-bit value.','rune':'Another name for int32, used here for a Unicode code point.','any':'An interface that can hold a value of any type.','error':'The interface for an error value with an Error method that returns text.','comparable':'Allow types that support equality between two values of their type.'}
packages={'fmt':'formatting and showing values','errors':'creating and inspecting errors','testing':'running tests, fuzz checks, and benchmarks','strings':'working with text','io':'reading and writing data','bytes':'storing and reading bytes','os':'working with operating-system resources such as files','bufio':'reading input through a buffer','json':'reading and writing JSON data','time':'working with time and durations','context':'passing cancellation and deadlines to work','sync':'coordinating running tasks','atomic':'updating individual values atomically','http':'working with HTTP requests and replies','httptest':'testing HTTP code in memory','math':'the supplied local math module','helper':'the local helper package'}
seltypes={'T':'testing.T, the helper for a test or subtest','F':'testing.F, the helper for a fuzz test','B':'testing.B, the helper for a benchmark','Buffer':'a buffer for bytes','WaitGroup':'a count of unfinished tasks','Mutex':'a lock shared by workers','Int64':'an integer with atomic operations','ResponseWriter':'the interface that writes an HTTP reply','Request':'an HTTP request','Response':'an HTTP reply','Header':'an HTTP header map','Client':'an HTTP client that uses its transport'}
consts={'MethodGet':'the GET request method','StatusOK':'HTTP status 200, a successful reply','StatusMethodNotAllowed':'HTTP status 405, meaning the method is not allowed','Hour':'a duration of one hour','Canceled':'the error meaning a context was canceled','DeadlineExceeded':'the error meaning a context passed its deadline'}
def label(t,id,source):
 v=t['Text'];k=t['Kind'];path=t['Path'];last=path.split('/')[-1];call=t['Call']
 if k=='FILE':name=v.removeprefix('// File: ');return m('File: '+name,'Save the following part as '+name+' within this one example.','gray')
 if k=='MODULE':
  if v=='module':return m('Name the module','Give this module its import path.')
  if v=='go':return m('Go version','Set the required Go version for this module.')
  if v=='require':return m('Require a module','Name the module and version this program depends on.')
  if v=='replace':return m('Use a local replacement','Choose a different source for the required module.')
  if v=='=>':return m('Redirect to folder','Use the folder on the right for the module on the left.')
  if v.startswith('./'):return m('Local module folder','Find this dependency in the named folder beside the main go.mod file.','blue')
  if v.startswith('v') or re.fullmatch(r'\d[\d.]*',v):return m('Required version','Name the dependency version.' if path=='require' else 'Require this Go language and toolchain version.','orange')
  return m('Module path','Name this module.' if path=='module' else 'Identify the required module by its path.','blue')
 if k=='IDENT':
  if path.endswith('File.Name/Ident'):return m('Package: '+v,'Place this file in package '+v+'.'+(' A runnable Go command uses package main.' if v=='main' else ''),'blue')
  if path.endswith('FuncDecl.Name/Ident'):return m('Define: '+v,'Name this function or method '+v+'.'+(' The program starts here.' if v=='main' else ''),'blue')
  if path.endswith('TypeSpec.Name/Ident'):return m('Define type: '+v,'Name the new Go type '+v+'.','blue')
  iscall=path.endswith('CallExpr.Fun/Ident') or path.endswith('CallExpr.Fun/SelectorExpr.Sel/Ident')
  if iscall:
   if call not in calls:raise ValueError((id,'unreviewed call',v,call,path))
   return m(*calls[call],'green')
  if v=='_':return m('Discard this value','Leave this result unnamed because this code does not use it.','gray')
  if v in ('true','false'):return m('Boolean: '+v,'Use the '+v+' truth value.','orange')
  if v=='nil':return m('Nil value','Use the empty value for this type, such as no error or no pointer target.','orange')
  if v in types:return m('Type: '+v,types[v],'blue')
  if path.endswith('KeyValueExpr.Key/Ident'):return m('Field to set: '+v,'Set the named '+v+' field in this new struct value.','blue')
  if path.endswith('SelectorExpr.Sel/Ident'):
   if v in consts:return m('Named value: '+v,'Use '+consts[v]+'.','blue')
   if v in seltypes and not ('AssignStmt.Lhs/' in path or v=='Header' and 'KeyValueExpr.Key/' in path):return m('Type: '+v,'Use '+seltypes[v]+'.','blue')
   setting='/AssignStmt.Lhs/' in path or '/IncDecStmt.X/' in path
   return m(('Update field: ' if setting else 'Read field: ')+v,('Change ' if setting else 'Read ')+v+' on the selected value.','blue')
  if v in packages and path.endswith('SelectorExpr.X/Ident'):return m('Package: '+v,'Use the package for '+packages[v]+'.','blue')
  if 'FuncType.TypeParams/' in path and path.endswith('Field.Names/Ident'):return m('Type parameter: '+v,'Give the chosen type the temporary name '+v+'.','blue')
  if path.endswith('Field.Names/Ident'):
   if '/StructType.Fields/' in path:return m('Field: '+v,'Name the '+v+' field in this struct.','blue')
   if '/InterfaceType.Methods/' in path:return m('Require method: '+v,'Require a method named '+v+' with this signature.','blue')
   if 'FuncDecl.Recv/' in path:return m('Receiver: '+v,'Use '+v+' as the name of the value this method works on.','blue')
   return m('Input: '+v,'Give this function input the name '+v+'.','blue')
  if t['Obj']=='type' or path.endswith('CompositeLit.Type/Ident') or path.endswith('TypeSpec.Type/Ident'):return m('Type: '+v,'Use the type named '+v+'.','blue')
  if t['Decl'] or path.endswith('ValueSpec.Names/Ident'):return m('Define: '+v,'Introduce the variable named '+v+' here.','blue')
  if path.endswith('AssignStmt.Lhs/Ident') or path.endswith('IncDecStmt.X/Ident'):return m('Update: '+v,'Store the new value in '+v+'.','blue')
  return m('Read: '+v,'Use the current value named '+v+'.','blue')
 if k=='STRING':
  if 'ImportSpec.Path/' in path:return m('Import path','Find the package at this path and make it available in this file.','green')
  if 'Field.Tag/' in path:return m('JSON field tag','Use minutes as the JSON key for this struct field.','green')
  if v.startswith(chr(96)):return m('Raw JSON text','Use this text as written, including its quotation marks, for JSON decoding.','green')
  if '%' in v and call in ['fmt.Printf','fmt.Errorf','t.Fatalf','b.Fatalf']:
   return m('Format string','Choose how to display or wrap the supplied values. '+('Here %w keeps the original error as a cause.' if '%w' in v else 'Each percent instruction selects a format.'),'green')
  return m('Text value','Use the text inside the quotation marks.'+(' The backslash-n escape starts a new line.' if r'\n' in v else ''),'green')
 if k in ('INT','FLOAT'):
  if 'IndexExpr.Index/' in path:return m('Item position','Select item '+v+', counting from zero.','orange')
  if 'ArrayType.Len/' in path:return m('Array length','Fix the number of items in this array at '+v+'.','orange')
  return m('Decimal number' if k=='FLOAT' else 'Whole number','Use the number '+v+' here.','orange')
 if v=='func':
  if '/FuncLit.Type/' in path:return m('Unnamed function','Create a function here without giving it a declaration name.')
  return m('Define a function','Start the definition of a function or method.')
 if v=='interface' and id=='go-39':return m('Define a constraint','Describe the set of types allowed for the type parameter.')
 if v in kw:return m(*kw[v])
 if v in op:return m(*op[v],'orange')
 if v=='||':return m('Either can be true','Skip the right check if the left check is already true.','orange')
 if v=='|':return m('Allow either type group','Include the allowed types on both sides in the constraint.','orange')
 if v=='-':return m('Negative sign','Use the negative of the number that follows.','orange')
 if v=='*':return m('Pointer type','Describe a pointer to the type that follows.','blue') if last=='StarExpr' else m('Multiply','Multiply the two numbers.','orange')
 if v=='&':return m('Take the address','Make a pointer to the value that follows.','blue')
 if v=='<-':
  if last=='ChanType':return m('Send-only channel','Allow this parameter to send on the channel, but not receive from it.')
  if last=='SendStmt':return m('Send to a channel','Pass the right-hand value to the channel on the left.')
  return m('Receive from a channel','Wait for a value or a channel-close signal.')
 if v=='...':return m('Pass slice items','Pass the items in this slice as the variadic inputs.') if last=='CallExpr' else m('Collect inputs','Accept zero or more inputs of this type.')
 if v==':=':return m('Declare and set','Declare at least one new local name and give the listed names their values.')
 if v=='=':return m('Set the starting value','Give the declared variable its initial value.') if last=='ValueSpec' else m('Assign a value','Replace the value at the target on the left.')
 if v=='.':return m('Check the held type','Introduce a type assertion on this interface value.') if last=='TypeAssertExpr' else m('Select a name','Choose the named field, method, or package member on the right.')
 if v==',':return m('Separate items','Move to the next item in this list.')
 if v==':':
  return m(*{'SliceExpr':('Slice boundary','Start at the left index and stop before the right index.'),'KeyValueExpr':('Set the named entry','Use the value on the right for the field or key on the left.'),'CaseClause':('Start the case','Begin the instructions for this matching case.'),'CommClause':('Start the channel case','Begin this selected channel action or fallback branch.')}[last])
 if v==';':
  return m('Separate loop parts','Separate the start, check, and update parts of the loop.') if last=='ForStmt' else m('Separate check from setup','End the setup before this if condition.') if last=='IfStmt' else m('Separate declarations','Separate the fields or imports written on this line.') if last in ('GenDecl','FieldList') else m('Separate instructions','End one instruction before the next one on this line.')
 if v in '()':
  if last=='CallExpr':return m('Call inputs','Enclose the inputs supplied to this call.')
  if last=='TypeAssertExpr':return m('Type to check','Enclose the type requested from the interface.')
  if last=='GenDecl':return m('Import group','Enclose the package paths imported together.')
  if 'FuncDecl.Recv/' in path:return m('Method receiver','Enclose the value this method acts on.')
  if 'FuncType.Results/' in path:return m('Return types','Enclose the types of the returned values.')
  return m('Function inputs','Enclose the inputs declared for this function or method.')
 if v in '[]':
  if last=='FieldList':return m('Type parameters','Enclose the type names and their constraints.')
  if last=='MapType':return m('Map key type','Enclose the type of keys used by this map.')
  if last=='IndexExpr':return m('Item lookup','Enclose the position or key that selects an item.')
  if last=='SliceExpr':return m('Slice range','Enclose the boundaries of the new slice view.')
  if last=='ArrayType':
   at=t['A'];raw=source.encode();start=at if v=='[' else raw.rfind(b'[',0,at);end=raw.find(b']',start)
   return m('Slice type','Empty brackets describe a slice of the following item type.') if not raw[start+1:end].strip() else m('Array size','Enclose the fixed number of items in this array.')
 if v in '{}':
  group={'CompositeLit':'the items or fields in this value','BlockStmt':'the instructions in this block','FieldList':'the fields, methods, or type rules in this definition'}[last]
  return m('Open group' if v=='{' else 'Close group',('Begin ' if v=='{' else 'End ')+group+'.')
 raise ValueError((id,'unreviewed token',v,k,path))
for row in rows:
 id=row['ID'];source=examples[id];raw=source.encode();parts=[];pos=0
 for t in row['Parts']:
  a,b=t['A'],t['B'];assert pos<=a and not raw[pos:a].strip() and raw[a:b].decode()==t['Text'],(id,t);pos=b
  meaning=label(t,id,source)
  if meaning not in ids:ids[meaning]=len(meanings);meanings.append(meaning)
  parts.append([len(raw[:a].decode().encode('utf-16-le'))//2,len(raw[:b].decode().encode('utf-16-le'))//2,ids[meaning]])
 assert not raw[pos:].strip() and parts,id
 out.append({'id':id,'source':source,'parts':parts})
assert len(out)==len(examples)==65
ts='// Generated by tests/go-syntax.go and tests/go-anatomy.py for exact reviewed sources.\nexport type GoPart = [number, number, number];\n'
ts+='export const goMeanings: [string,string,string][] = '+json.dumps(meanings,separators=(',',':'))+';\n'
ts+='export const reviewedGoAnatomy: {id:string;source:string;parts:GoPart[]}[] = '+json.dumps(out,separators=(',',':'))+';\n'
(r/'lib/go-reviewed-anatomy.ts').write_text(ts,encoding='utf8')
print('PASS:',len(out),'examples,',sum(len(row['parts']) for row in out),'ranges,',len(meanings),'meanings. Every non-space character covered.')

