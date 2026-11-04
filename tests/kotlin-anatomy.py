"""Generate exact-source labels using tree-sitter 0.26.0 / tree-sitter-kotlin 1.1.0.
Usage: python tests/kotlin-anatomy.py PATH_TO_PARSER_PACKAGES
The parser is an authoring dependency only. Known parser ambiguities are reviewed below.
"""
import json,re,sys
from pathlib import Path
sys.path.insert(0,str(Path(sys.argv[1]).resolve()))
from tree_sitter import Language,Parser
import tree_sitter_kotlin
root=Path(__file__).resolve().parents[1];parser=Parser(Language(tree_sitter_kotlin.language()))
rows=json.loads((root/'docs/kotlin-wording-v1/examples.json').read_text(encoding='utf8'))
meanings=[];meaning_ids={};annotated=[];unclassified=[]
def meaning(label,description,tone='purple'):return label,description,tone
keywords={
 'fun':('Define a function','Declare a named group of instructions that can receive inputs and return a result.'),
 'val':('Keep the assigned value','Declare a name that cannot be assigned a different value later. Referenced contents may still change.'),
 'var':('Allow a new value','Declare a variable or property that can receive a replacement value.'),
 'if':('Check a condition','Choose this path when the condition is true.'),
 'else':('Use the other path','Choose this path when the earlier condition or cases do not match.'),
 'for':('Visit each value','Run the body once for each value supplied by the range.'),
 'continue':('Skip this pass','Skip the rest of the current loop pass and move to the next value.'),
 'return':('Send the answer back','End this function call and send the following value back to its caller.'),
 'when':('Choose one result','Use the first matching branch and take its result.'),
 'is':('Check the actual type','Ask whether this value has the following type; this does not convert it.'),
 'class':('Define an object type','Describe the properties and functions for objects of this class.'),
 'interface':('Define shared actions','Describe actions that implementing classes must support.'),
 'open':('Allow an override or child','Allow a child class, or allow a child to replace this member function.'),
 'override':('Provide this action','Supply this class\'s version of an inherited or required action.'),
 'init':('Run during setup','Run this block while creating the object, in order with other property setup.'),
 'get':('Read through a getter','Run this function when the property is read.'),
 'set':('Write through a setter','Run this function when a new value is assigned to the property.'),
 'data':('Generate data operations','Generate useful comparisons and display operations; data classes also get copy and numbered components from constructor properties.'),
 'sealed':('Control the direct cases','Keep direct implementations in the same package and module so the compiler can check case coverage.'),
 'enum':('Declare named choices','Define a fixed set of named instances of this type.'),
 'companion':('Attach a shared object','Make this object\'s members reachable through the containing class name.'),
 'object':('Declare one named instance','Create a singleton object, with one instance reached through its name.'),
 'out':('Allow output use','Permit values to be read as this type while restricting ordinary inputs that could violate a more specific type.'),
 'inline':('Place code at the call','Allow the compiler to place this function\'s body at its call site.'),
 'reified':('Keep the supplied type for checks','Make this inline function\'s type argument available for supported type operations at the call site.'),
 'vararg':('Collect several arguments','Accept zero or more Int inputs and expose them inside the function as an IntArray.'),
 'try':('Start protected work','Run this block; a matching catch can handle an error thrown from it.'),
 'catch':('Handle a matching error','Run this block when an error of the named type reaches it.'),
 'finally':('Run exit cleanup','Run this cleanup as the try block exits, including during cancellation.'),
 'import':('Use a shorter code name','Make an existing name available here without its full package path. This does not download code.'),
 'package':('Name this code group','Set the package name for declarations in this source file.'),
 'suspend':('Allow suspension','Declare a function that can call suspending operations. It does not start a thread by itself.'),
 'null':('No value present','Represent the absence of a value in a nullable type.'),
}
types={
 'Int':'Whole numbers in the Int range, with no fractional part.',
 'String':'Text stored as a value. Its contents cannot be changed in place.',
 'Boolean':'A value that is either true or false.',
 'Any':'The common parent type for non-null Kotlin values.',
 'Number':'The shared parent type for numeric values such as Int and Double.',
 'List':'A read-only list interface. Another reference can still change an underlying mutable list.',
 'MutableList':'A list interface that allows adding, removing, and replacing items.',
 'Result':'A value containing a successful answer or a failure.',
 'Unit':'The type with one value, used when no useful result data is needed.',
 'T':'The type placeholder supplied when this generic declaration is used.',
 'Closeable':'A JVM resource interface requiring a close function.',
 'IllegalArgumentException':'An error indicating an input argument broke a required rule.',
 'NumberFormatException':'An error indicating text could not be read as the requested number.',
}
operations={
 'println':('Show a line','Display this value and then begin a new output line.'),
 'toInt':('Convert to Int','Convert this value to Int.'),
 'readlnOrNull':('Read an optional line','Read one input line as text, or return null when input has ended.'),
 'toIntOrNull':('Read integer text safely','Return an Int for valid in-range integer text, otherwise return null.'),
 'intArrayOf':('Create an Int array','Create a fixed-size array containing these Int values.'),
 'listOf':('Create a list','Create a list with these items in order, exposed through a read-only List type.'),
 'mutableListOf':('Create a changeable list','Create a list whose items can be added, removed, or replaced.'),
 'mapOf':('Create a map','Create a map from the supplied key-value pairs.'),
 'getOrDefault':('Look up with a fallback','Return the stored value for this key, or the supplied fallback when the key is absent. Do not add an entry.'),
 'mutableSetOf':('Create a changeable set','Create a set that keeps distinct values and allows membership changes.'),
 'sum':('Add all the numbers','Add the numeric items. An empty integer collection has sum zero.'),
 'let':('Return the block\'s answer','Pass this receiver as it and return the lambda\'s result.'),
 'copy':('Copy the outer data object','Make another instance using these property values. Referenced inner objects remain shared unless replaced.'),
 'lazy':('Wait for the first read','Run this initializer on first access, then keep a successful result for later reads.'),
 'require':('Require a valid input','Continue only if this condition is true; otherwise throw IllegalArgumentException.'),
 'use':('Close after this block','Run the block with this resource, then close it even if the block throws.'),
 'runCatching':('Store success or failure','Run the block and return its answer in Result, or capture a thrown Throwable as failure.'),
 'getOrElse':('Return an answer or fallback','Keep a successful Result value, or run this lambda for a failure fallback.'),
 'filter':('Keep matching items','Keep only items for which this lambda returns true.'),
 'map':('Transform each item','Use the lambda\'s answer as the result for each item.'),
 'asSequence':('Delay item processing','Create a sequence view whose processing runs as values are requested.'),
 'toList':('Collect into a list','Read the supplied values into a list, starting deferred processing when needed.'),
 'fold':('Build one running answer','Start with the supplied accumulator and update it once for each item.'),
 'compareBy':('Create the first sort rule','Compare the values selected by this lambda; here, shorter text comes first.'),
 'thenBy':('Add a tie-break rule','Use this comparison only when the earlier sorting rule gives a tie.'),
 'sortedWith':('Sort using this rule','Return a sorted list without changing the original list.'),
 'writeText':('Replace the file text','Create or replace this file\'s contents using the supplied text encoding.'),
 'appendText':('Add text at the end','Append this text using the supplied encoding, preserving existing file contents.'),
 'readText':('Read the file text','Read the whole file using the supplied encoding. File errors can throw.'),
 'matches':('Match the whole input','Return true only when this pattern matches the entire input.'),
 'containsMatchIn':('Find any matching part','Return true when a matching substring exists anywhere in the input.'),
 'parse':('Read an instant from text','Read this fixed ISO instant text; Z means UTC.'),
 'of':('Find time-zone rules','Find the time-zone rules named by this String.'),
 'atZone':('Show the moment in a zone','Use this zone\'s calendar and clock rules without changing the instant.'),
 'toLocalDate':('Take the local date','Extract the calendar date from this zoned date and time.'),
 'coerceIn':('Keep within the limits','Return the nearest boundary when outside this inclusive range, otherwise keep the original value.'),
 'check':('Check an expected result','Throw IllegalStateException if the condition is false, using the supplied failure message.'),
 'toString':('Create text for a value','Return this value\'s text representation.'),
 'runBlocking':('Bridge by blocking this thread','Run a coroutine and block the calling thread until its work finishes.'),
 'coroutineScope':('Wait for owned children','Run this suspending scope and wait for its children before returning normally.'),
 'launch':('Start a child task','Start a child coroutine and return a Job used to track or control it.'),
 'async':('Start work with an answer','Start a child coroutine and return a Deferred for its eventual result.'),
 'await':('Wait for the result','Get the result when ready, suspending if needed; a failed result can throw.'),
 'complete':('Complete the signal','Complete this one-shot signal with Unit so waiting code can continue.'),
 'awaitCancellation':('Wait until cancelled','Suspend until cancellation; exit by throwing the cancellation signal, not by returning normally.'),
 'cancelAndJoin':('Cancel and wait for cleanup','Request cancellation, then wait for this job to finish, including its cleanup.'),
 'flow':('Declare a cold flow','Create a flow whose block starts anew each time it is collected.'),
 'emit':('Send a flow value','Send this value to the current collector, suspending when needed.'),
 'collect':('Run and receive the flow','Start collecting this flow and run the lambda for each received value.'),
 'repeat':('Repeat a fixed count','Run this lambda the supplied number of times.'),
 'withLock':('Protect one task at a time','Hold this mutex while the block runs and release it on exit.'),
 'clearProperty':('Remove the process setting','Remove this named system property from the current JVM process.'),
 'getProperty':('Read the process setting','Get this JVM property\'s text, or null if it is missing.'),
 'flowOf':('Supply these flow values','Emit these fixed values in order when the flow is collected.'),
 'mapNotNull':('Convert and skip missing results','Apply the lambda and omit items whose converted result is null.'),
 'take':('Limit accepted values','Allow at most this many values through; fewer may be available.'),
}
custom={
 'nextCount':'Add one to the supplied number and return the answer.',
 'total':'Run this example\'s total function with the supplied inputs.',
 'applyTo':'Call the supplied operation with the supplied number and return its answer.',
 'transform':'Run the function stored under this name with the supplied input.',
 'text':'Call this object\'s greeting function and return its text.',
 'format':'Use the formatter object\'s version to turn input text into output text.',
 'show':'Use the supplied Formatter to format C and display it.',
 'create':'Make a Ticket with the current counter, then increase the shared counter.',
 'label':'Call the label function selected by this code.',
 'asInt':'Return this Box value converted to Int.',
 'first':'Read item zero from the supplied list as Number.',
 'isA':'Check the input against the supplied reified type.',
 'read':'Call this Reader action, forwarded to the delegate in this example.',
 'minutes':'Require a positive input, then return it.',
 'doubleIt':'Multiply the supplied Int by two and return the answer.',
 'clamp':'Keep the input within the inclusive range from zero to ten.',
 'answer':'Return 7 from this suspending function; this body does not actually pause.',
}
for row in rows:
 source=row['code'];parts=[]
 def add(a,b,m):
  if a==b:return
  if m not in meaning_ids:meaning_ids[m]=len(meanings);meanings.append(m)
  parts.append([len(source[:a].encode('utf-16-le'))//2,len(source[:b].encode('utf-16-le'))//2,meaning_ids[m]])
 markers=list(re.finditer(r'^// File: (.+)\n',source,re.M));segments=[]
 if markers:
  for i,m in enumerate(markers):
   add(m.start(),m.end()-1,meaning('File: '+m[1],'Save the following part in '+m[1]+'. It is a separate file within this one example.','gray'))
   end=markers[i+1].start() if i+1<len(markers) else len(source);segments.append((m.end(),source[m.end():end]))
 else:segments=[(0,source)]
 for offset,code in segments:
  raw=code.encode()
  # This parser version mishandles same-line closing braces after interface members.
  # Replace only whitespace in the parsing view of lessons 31, 35, and 40; displayed code stays exact.
  parse_code=code.replace(' }','\n}') if row['id'] in ['kotlin-31','kotlin-35','kotlin-40'] else code
  assert len(parse_code.encode())==len(raw)
  tree=parser.parse(parse_code.encode()+b'\n');assert not tree.root_node.has_error,row['id']
  generic_spans=[(m.start(),m.end(),m.group()) for m in re.finditer(r'\b[A-Za-z_]\w*<[^<>\n]+>',code)]
  def txt(n):return raw[n.start_byte:n.end_byte].decode()
  def charpos(n):return len(raw[:n.start_byte].decode())
  def classify(n):
   value=txt(n);parent=n.parent.type if n.parent else '';pos=charpos(n)
   if n.type=='string_literal':
    names=re.findall(r'\$([A-Za-z_]\w*)',value)
    if names:return meaning('Text with inserted values','Build this text using the current value'+('s' if len(names)>1 else '')+' of '+', '.join(names)+'. The surrounding quotes are not displayed.','green')
    return meaning('Text value','Use the text inside these quotes. The quotes mark the text and are not part of its displayed value.','green')
   if n.type in ['number_literal','float_literal']:return meaning('Decimal number' if n.type=='float_literal' else 'Whole number','A numeric value written directly in the code.','orange')
   if value in keywords:return meaning(*keywords[value])
   if value=='by':return meaning('Delegate property setup','Let lazy manage this property\'s first value and later reads.') if parent=='property_delegate' else meaning('Forward interface actions','Use this following object to carry out the interface\'s actions.')
   generic=next((g for g in generic_spans if g[0]<=pos<g[1]),None)
   if n.type=='identifier':
    if parent=='qualified_identifier':return meaning('Imported name' if n.parent.parent.type=='import' else 'Package name','Part of this dotted code name. It identifies where a declaration belongs or which declaration to import.','blue')
    if parent in ['class_declaration','object_declaration']:return meaning('Define: '+value,'Declare the '+('object' if parent=='object_declaration' else 'class or interface')+' named '+value+'.','blue')
    if parent=='enum_entry':return meaning('Named choice: '+value,'Declare this enum entry with its supplied code.','blue')
    if parent=='function_declaration':return meaning('Define: '+value,'Name this function '+value+'. '+('Program execution starts here.' if value=='main' else 'Its body supplies the work when it is called.'),'blue')
    if parent in ['parameter','class_parameter','setter']:return meaning('Input: '+value,'Name this input '+value+'. '+('The val in this constructor also makes it a property.' if parent=='class_parameter' and 'val' in txt(n.parent) else 'It receives the value supplied for this parameter.'),'blue')
    if parent=='type_parameter':return meaning('Type placeholder: '+value,'Name a type parameter supplied when this generic declaration is used.','blue')
    if parent=='variable_declaration':return meaning('Name: '+value,'Declare this variable, property, loop value, or lambda input as '+value+'.','blue')
    if parent=='catch_block':return meaning('Caught error: '+value,'Give the matching caught error this local name.','blue')
    if value=='to' and parent=='infix_expression':return meaning('Create a key-value pair','Pair the key on the left with the value on the right.')
    if parent=='user_type' or (generic and pos>generic[0]+generic[2].index('<')):
     return meaning('Type: '+value,types.get(value,'The type named '+value+' declared or imported for this example.'),'blue')
    if value=='field':return meaning('Stored property value','Access the property\'s backing storage directly, without calling its setter again.','blue')
    if value=='Unit':return meaning('No useful result data','The single Unit value completes the signal without carrying additional information.','blue')
    if value=='it':return meaning('Current lambda input','Read the single implicit input supplied to this lambda.','blue')
    if value=='length':return meaning('Text length','Read this String\'s length in UTF-16 code units. The plain letters here each count as one.','blue')
    if value=='size':return meaning('Item count','Read the number of items currently in this collection.','blue')
    if value=='UTF_8':return meaning('UTF-8 encoding','Use the UTF-8 rule to turn text into bytes or read it back.','blue')
    if value=='Default' and row['id']=='kotlin-62':return meaning('Shared worker threads','Use the default coroutine dispatcher\'s shared worker-thread pool.','blue')
    if value in ['Charsets','Dispatchers','Instant','ZoneId','System']:return meaning('Library type or object: '+value,'Reach the named library operations or constants through '+value+'.','blue')
    if value=='add':return meaning('Add a distinct set value','Return true when a new member is added, or false for a value already present.') if row['id']=='kotlin-21' else meaning('Append a list item','Add this value at the end of the mutable list.')
    is_call=parent=='call_expression' or bool(generic and pos==generic[0]) or (parent=='navigation_expression' and n==n.parent.children[-1] and n.parent.parent and n.parent.parent.type=='call_expression')
    if value in operations and is_call:
     if value=='toInt':return meaning('Read text as Int','Read valid in-range integer text as Int; invalid input throws NumberFormatException.') if row['id'] in ['kotlin-44','kotlin-56'] else meaning('Convert a number to Int','Produce an Int. For an in-range fractional Double, discard its fraction toward zero.')
     return meaning(*operations[value])
    if value in custom and is_call:
     description=custom[value]
     if value=='label' and row['id']=='kotlin-36':description='Use the Base extension because item is known as Base at this call site.'
     return meaning('Call: '+value,description,'blue')
    if is_call and value[0].isupper():return meaning('Create: '+value,{'File':'Create a File object representing this path; this call alone does not write the file.','Regex':'Create a text pattern for later matching.','Mutex':'Create one shared coroutine lock for the protected updates.','CompletableDeferred':'Create a one-shot completion signal that can be completed and awaited.'}.get(value,'Create a new '+value+' instance with the supplied constructor inputs.'),'blue')
    if parent=='assignment' or (parent=='navigation_expression' and n==n.parent.children[-1] and n.parent.parent and n.parent.parent.type=='assignment' and n.parent==n.parent.parent.children[0]):return meaning('Update: '+value,'Use '+value+' as the target that receives the assigned value.','blue')
    return meaning('Read: '+value,'Read the value reached by the name '+value+'.','blue')
   if value in ['<','>'] and (parent in ['type_arguments','type_parameters'] or generic):return meaning('Type brackets','Enclose type arguments, type placeholders, or their bounds.')
   if value=='?':return meaning('Allow null','Permit null as well as the preceding type.')
   if value=='?.':return meaning('Access only when present','Use the member on the right only when the receiver is not null; otherwise give null.')
   if value=='?:':return meaning('Fallback for null','Keep the left value if present; otherwise evaluate and use the right side.')
   if value=='..':return meaning('Include both range ends','Include each integer from the left end through the right end.')
   if value=='in':return meaning('Take each loop value','Take the next value from this range for one loop pass.') if parent=='for_statement' else meaning('Check range membership','Ask whether this value is inside the following inclusive range.')
   if value=='->':return meaning(*{'function_type':('Function result type','Separate input types on the left from the result type on the right.'),'lambda_literal':('Lambda body follows','Separate the input names from the lambda\'s calculation or instructions.'),'when_entry':('Case result follows','Use this result when the branch on the left matches.')}[parent])
   if value==':':return meaning('Parent type or interface','Declare the parent class or interface supported by this type.') if parent in ['class_declaration','object_declaration'] else meaning('Type bound','Require this type parameter to meet the following parent-type limit.') if parent=='type_parameter' else meaning('Type follows','State the type of this input, property, caught error, or function result.')
   if value=='.':return meaning('Extension receiver separator','Put this extension on the receiver type written before the dot.') if parent=='function_declaration' else meaning('Qualified name separator','Separate parts of an imported or package name.') if parent=='qualified_identifier' else meaning('Select a member','Use the property or function named on the right through the value or type on the left.')
   if value=='=':
    label,description={'function_body':('Function result','Return the result of the expression that follows.'),'function_value_parameters':('Default input','Use this value if the call omits this argument.'),'value_argument':('Named argument','Supply this value to the parameter named on the left.'),'property_declaration':('Starting value','Give this declaration the result on the right.')}.get(parent,('Replace the value','Store the right-hand result in the target on the left.'))
    return meaning(label,description)
   if value=='*' and parent=='spread_expression':return meaning('Spread array inputs','Supply this array\'s items as separate vararg inputs; this is not multiplication.')
   operators={'+':('Add','Add the two numeric values.'),'*':('Multiply','Multiply the two numeric values.'),'/':('Integer division','Divide these Int values and drop the fractional part toward zero.'),'%':('Remainder','Get the remainder after integer division.'),'==':('Compare values','Return true when the values are equal; these String comparisons compare text contents.'),'<':('Less than','Check whether the left number is smaller than the right.'),'>':('Greater than','Check whether the left number is greater than the right.'),'>=':('At least','Check whether the left number is greater than or equal to the right.'),'++':('Increase by one','Read the current value, add one, and store it back. This is not automatically a protected shared update.'),'+=':('Add and store','Add the right value to the current target and store the result.'),'-':('Negative value','Use the negative of the following number.')}
   if value in operators:return meaning(*operators[value])
   if value in ['(',')']:
    groups={'function_value_parameters':('Function inputs','Enclose the input declarations for this function.'),'value_arguments':('Call inputs','Enclose the values supplied to this call.'),'function_type_parameters':('Function input types','Enclose the types accepted by this function value.'),'class_parameters':('Constructor inputs','Enclose the inputs used to create this object.'),'multi_variable_declaration':('Destructured names','Enclose names receiving numbered components in order.'),'if_expression':('Condition','Enclose the true-or-false check.'),'when_subject':('Value to match','Enclose the value checked by the when branches.'),'for_statement':('Loop source','Enclose the current-value name and the range to visit.'),'catch_block':('Error name and type','Enclose the caught error\'s name and matching type.'),'setter':('Proposed property value','Enclose the name for the new value supplied to the setter.'),'getter':('No getter inputs','This getter takes no explicit input arguments.')}
    # The parser treats generic call arguments as a grouped expression in two reviewed examples.
    if parent=='parenthesized_expression' and row['id'] in ['kotlin-39','kotlin-60']:return meaning('Call inputs','Enclose the values supplied to this generic call.')
    return meaning(*groups.get(parent,('Group an expression','Keep this expression together before using its result.')))
   if value in ['[',']']:return meaning('Item index','Select an item by its position, counting from zero.')
   if value in ['{','}']:
    kind={'block':'instructions in this block','lambda_literal':'the lambda\'s inputs and work','class_body':'this type\'s members','enum_class_body':'the enum\'s named choices','when_expression':'the possible matching branches'}.get(parent)
    assert kind,(row['id'],parent,value)
    return meaning('Open block' if value=='{' else 'Close block',('Begin ' if value=='{' else 'End ')+kind+'.')
   if value==',':return meaning('Separate items','Separate this input, type, item, or declaration from the next one.')
   if value==';':return meaning('Separate instructions','End one instruction before the next instruction on this line.')
   unclassified.append({'lesson':row['id'],'text':value,'kind':n.type,'parent':parent});return meaning('Unclassified',value)
  def visit(n):
   if n.type=='string_literal' or not n.children:
    if n.end_byte==n.start_byte or not txt(n).strip():return
    a=offset+len(raw[:n.start_byte].decode());b=offset+len(raw[:n.end_byte].decode());add(a,b,classify(n))
   else:
    for child in n.children:visit(child)
  visit(tree.root_node)
 # Kotlin's grammar treats semicolon separators as extras; label them explicitly.
 covered=set()
 for a,b,_ in parts:covered.update(range(a,b))
 for i,ch in enumerate(source):
  a=len(source[:i].encode('utf-16-le'))//2
  if not ch.isspace() and a not in covered:
   if ch==';':add(i,i+1,meaning('Separate instructions','End one instruction before the next instruction on this line.'))
   else:unclassified.append({'lesson':row['id'],'text':ch,'offset':i,'kind':'parser gap'})
 parts.sort(key=lambda p:p[0]);assert all(a[1]<=b[0] for a,b in zip(parts,parts[1:])),row['id']
 annotated.append({'id':row['id'],'source':source,'parts':parts})
(root/'docs/kotlin-wording-v1/anatomy-unclassified.json').write_text(json.dumps(unclassified,indent=2)+'\n')
assert not unclassified,unclassified
output='// Generated by tests/kotlin-anatomy.py from reviewed exact lesson sources.\nexport type KotlinPart = [number, number, number];\n'
output+='export const kotlinMeanings: [string, string, string][] = '+json.dumps(meanings,separators=(',',':'))+';\n'
output+='export const reviewedKotlinAnatomy: {id:string;source:string;parts:KotlinPart[]}[] = '+json.dumps(annotated,separators=(',',':'))+';\n'
(root/'lib/kotlin-reviewed-anatomy.ts').write_text(output,encoding='utf8')
print(f'PASS: {len(annotated)} examples, {sum(len(x["parts"]) for x in annotated)} ranges, {len(meanings)} meanings; zero unclassified parts.')
