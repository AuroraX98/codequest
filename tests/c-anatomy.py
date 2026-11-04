"""Generate exact-source C labels with tree-sitter 0.26.0 / tree-sitter-c 0.24.1.
Usage: python tests/c-anatomy.py PATH_TO_PARSER_PACKAGES
The parser is an authoring dependency, not part of the website.
"""
import json,re,sys
from pathlib import Path
sys.path.insert(0,str(Path(sys.argv[1]).resolve()))
from tree_sitter import Language,Parser
import tree_sitter_c
root=Path(__file__).resolve().parents[1];parser=Parser(Language(tree_sitter_c.language()))
rows=json.loads((root/'docs/c-wording-v1/examples.json').read_text())
meanings=[];meaning_ids={};annotated=[];unclassified=[]
def meaning(label,description,tone='purple'):return (label,description,tone)
keywords={
 'if':('Choose a path','Run this block if its condition is nonzero, meaning true.'),
 'else':('Alternative path','Run this path when the matching if condition is false.'),
 'while':('Repeat while true','Check the condition before each turn and repeat only while it is true.'),
 'for':('Counted loop','Run the setup once, check before each turn, and update after each completed turn.'),
 'return':('Return from this function','End this function call and send back the following value, if present.'),
 'break':('Leave the loop or switch','Leave the nearest enclosing loop or switch immediately.'),
 'continue':('Skip the rest of this turn','Skip the remaining loop body. This for loop still performs its update before the next test.'),
 'switch':('Select a case','Start at the matching integer case, or at default when no case matches.'),
 'case':('Matching value','Mark where this matching value starts in the switch.'),
 'default':('No matching case','Start here when the switch value matches none of its cases.'),
 'goto':('Jump to a label','Continue at the named label inside this same function.'),
 'struct':('Structure type','Name or define a type that groups separately stored members.'),
 'union':('Shared member storage','Group alternatives that share storage. This example reads the member last written.'),
 'enum':('Named integer choices','Name or define an enum with integer constants used as readable choices.'),
 'typedef':('Create a type alias','Give an existing type another name. This does not allocate an object.'),
 'sizeof':('Measure storage','Get the size in C bytes, as size_t. These fixed-type operands are not evaluated.'),
 'unsigned':('Unsigned number type','Use a nonnegative integer type. Arithmetic outside its range wraps according to that type.'),
 'long':('Long integer type','Use a whole-number type with at least the range required for long; its exact size can vary.'),
 'volatile':('Volatile access','Require accesses to follow the implementation\'s volatile rules. This is not a lock or an atomic update.'),
 '#include':('Include a header','Bring the named header into this source before compilation.'),
 '#ifndef':('Use only if not defined','Include the following region only if this macro has not been defined.'),
 '#define':('Define a macro','Give this preprocessing name its replacement text, or mark a guard as defined.'),
 '#if':('Choose before compilation','Include the following branch when its preprocessing condition is nonzero.'),
 '#else':('Alternative preprocessing branch','Select this text when the matching preprocessing condition is false.'),
 '#endif':('End the preprocessing choice','Close the matching conditional preprocessing region.'),
 '#error':('Report a build error','Reject this build with the following message when this branch is included.'),
 'defined':('Check a macro name','Give 1 if this macro exists, or 0 if it has not been defined.'),
}
types={
 'int':'Whole numbers in the implementation\'s int range.',
 'double':'Numbers that can have fractional parts. Many fractions are stored approximately.',
 'char':'One C byte. It is not necessarily one whole visible text symbol.',
 'size_t':'An unsigned type used for sizes and the result of sizeof.',
 'FILE':'The standard-library type used through a pointer to manage a stream.',
 'atomic_int':'An int accessed through atomic operations when shared between threads.',
 'mtx_t':'The type of a mutex used to let one thread at a time enter protected work.',
 'thrd_t':'A handle identifying a thread for operations such as joining it.',
}
operations={
 'puts':('Print a line','Write the supplied string to standard output, then add a newline.'),
 'printf':('Print formatted values','Display the format text with each matching value in its marked place.'),
 'fgets':('Read within a limit','Read at most capacity minus one character units, keeping a newline if it fits, then end with zero on success. Check the returned pointer.'),
 'strlen':('Count string bytes','Count the bytes before the first ending zero. The input must already be a valid terminated string.'),
 'snprintf':('Format within a limit','Write within the supplied capacity. A nonnegative result is the full needed text length, excluding the ending zero; a negative result is an error.'),
 'strtol':('Read a long from text','Read a number in the chosen base, store where reading stopped, and report a range problem through errno.'),
 'malloc':('Request storage','Request this many bytes. Check for NULL on failure and write values before reading the new storage.'),
 'calloc':('Request cleared storage','Request an array and set its storage bits to zero. For these int items, that gives the value zero. Check for NULL.'),
 'realloc':('Resize storage','For this positive size, return resized storage on success or NULL while preserving the old allocation on failure. Use the returned pointer after success.'),
 'free':('Release an allocation','Release this allocation once. Do not use its old contents afterward. Passing NULL does nothing.'),
 'qsort':('Sort using a comparison rule','Reorder the array using the item count, item size, and supplied comparator. Equal items need not keep their original order.'),
 'fopen':('Open a file','Try to open the path with the requested mode. Return a FILE pointer on success or NULL on failure.'),
 'fputs':('Write text to a stream','Write this string without adding a newline. EOF reports a failure; a nonnegative result reports success.'),
 'fclose':('Close the stream','Close the stream, returning zero on success. A final write can fail; do not reuse this stream pointer afterward.'),
 'getchar':('Read one input unit','Return the next input character unit as int, or EOF when no character is returned. Keep it in int for the check.'),
 'ferror':('Check the stream error','Return nonzero when this stream\'s error indicator is set.'),
 'assert':('Check an assumption','With assertions enabled, stop abnormally if this condition is false. NDEBUG disables this check and its expression.'),
 '_Static_assert':('Check during compilation','Require a constant condition to be true or reject this build with the supplied message.'),
 'abort':('Stop abnormally','Terminate the program abnormally rather than continuing after this unrecoverable failure.'),
 'thrd_create':('Start a thread','Try to start the worker function with the supplied pointer input. Check for thrd_success.'),
 'thrd_join':('Wait for the worker','Wait for this thread to finish and make its completed actions available before later reads. Optionally store its return status.'),
 'mtx_init':('Set up the mutex','Initialize the mutex before any thread uses it. Check for thrd_success.'),
 'mtx_lock':('Acquire the shared lock','Wait to own this mutex before touching the protected data. Check success before proceeding.'),
 'mtx_unlock':('Release the shared lock','Release this mutex after the protected work. The calling thread must own it; check success.'),
 'mtx_destroy':('Finish using the mutex','Destroy this initialized mutex after all threads have finished using it.'),
 'atomic_init':('Set the starting atomic value','Initialize the counter before concurrent access begins.'),
 'atomic_fetch_add':('Add as one atomic update','Read, add, and store as one indivisible update. Return the old value, ignored here. This form uses sequentially consistent ordering.'),
 'atomic_load':('Read the atomic value','Read the value without changing it. This form uses sequentially consistent ordering.'),
 'SQUARE':('Expand the square macro','Substitute this expression twice with parentheses around each use. Do not supply an expression that changes shared state such as i++.'),
 'KIND':('Select text by type','Use _Generic to choose text from this expression\'s type without running the controlling expression.'),
}
constants={
 'NULL':('No pointer target','A null pointer value. Do not follow it to read or write.'),
 'INT_MAX':('Largest int','The largest value this implementation can store in int.'),
 'SIZE_MAX':('Largest size_t','The largest size_t value. Use it to check that a byte count will fit.'),
 'CHAR_BIT':('Bits in one byte','The number of bits in one C byte on this implementation.'),
 'EOF':('No character or output failure','The library signal used here for no input character or a failed output operation. For reads, check the stream indicators to learn why.'),
 'ERANGE':('Number outside the range','The errno value indicating this numeric conversion exceeded its result type\'s range.'),
 'thrd_success':('Thread operation succeeded','The success status returned by these thread and mutex operations.'),
 'mtx_plain':('Ordinary mutex mode','Request a nonrecursive mutex; do not lock it again from the thread already holding it.'),
 'READY':('Ready state','The named State value meaning ready.'),'DONE':('Done state','The named State value meaning done.'),
 'WHOLE':('Whole-number tag','The Kind value saying the union holds its whole member.'),'FRACTION':('Fraction tag','The Kind value saying the union holds its fraction member.'),
 'CAPACITY':('Maximum item count','The named limit on how many items this store may hold.'),
}
format_meanings={'%d':'int as decimal','%u':'unsigned int as decimal','%ld':'long as decimal','%lu':'unsigned long as decimal','%zu':'size_t as decimal','%td':'ptrdiff_t as decimal','%c':'an int converted to a character','%s':'a valid string up to its ending zero','%.1f':'a double with one decimal place'}
for row in rows:
 source=row['code'];raw=source.encode();tree=parser.parse(raw);assert not tree.root_node.has_error,row['id']
 def txt(n):return raw[n.start_byte:n.end_byte].decode()
 def ancestors(n):
  nodes=[]
  while n.parent:n=n.parent;nodes.append(n)
  return nodes
 def classify(n):
  value=txt(n);parent=n.parent.type if n.parent else '';chain=ancestors(n);kinds=[a.type for a in chain]
  if n.type=='comment':
   if value.startswith('// File: '):
    name=value.removeprefix('// File: ');return meaning('File: '+name,'Save the following part in '+name+'. It is a separate file within this one example.','gray')
   return meaning('Comment','A note for the reader; it is not executed.','gray')
  if n.type=='system_lib_string':return meaning('Library header','Include '+value+' for its standard-library declarations and macros.','green')
  if n.type=='preproc_arg':
   if parent=='preproc_call':return meaning('Build error message','Display this explanation if the required optional facility is unavailable.','green')
   if row['id']=='c-45':return meaning('Macro replacement','Replace each x with the supplied expression. Parentheses keep each copy grouped before multiplying.','green')
   if row['id']=='c-47':return meaning('Type-based selection','Choose int, double, or other text from the controlling expression\'s type; do not evaluate the controlling expression.','green')
   return meaning('Replacement text','Substitute this text wherever this macro name is expanded later.','green')
  if n.type=='string_literal':
   if parent=='preproc_include':return meaning('Project header','Include this named project header from the source folder or configured include path.','green')
   call=next((a for a in chain if a.type=='call_expression'),None)
   function=txt(call.child_by_field_name('function')) if call else ''
   formats=re.findall(r'%(?:\.1f|zu|td|ld|lu|[ducs])',value)
   if function in ['printf','snprintf'] and formats:
    return meaning('Format string','Print '+', then '.join(format_meanings[f]+' ('+f+')' for f in formats)+'. Match each supplied value to its format. '+('The \\n ends the output line.' if '\\n' in value else 'No newline is added automatically.'),'green')
   if function=='fopen':
    if value=='"w"':return meaning('Write mode','Create this text file or replace its existing contents.','green')
    return meaning('File path','The filename to open, relative to the program\'s working folder here.','green')
   return meaning('Text string','Quoted character data with a final zero added by C. '+('The \\n inside it represents a newline.' if '\\n' in value else 'The ending zero marks where the text stops.'),'green')
  if n.type=='char_literal':return meaning('Ending zero character' if value=="'\\0'" else 'Character constant','The zero value that marks the end of a C string; it is not the digit 0.' if value=="'\\0'" else 'An ordinary single-quoted character constant with type int in C.','green')
  if n.type=='number_literal':return meaning('Number','A value written directly in the code. The u suffix, when present, makes it unsigned.','orange')
  if value=='static':
   local='compound_statement' in kinds
   return meaning('Persistent local storage' if local else 'File-local name','Keep this local object alive for the whole program and initialize it once.' if local else 'Keep this name local to the translation unit. A file-scope object also lasts for the whole program.')
  if value=='const':return meaning('Read-only access','For this declaration, prevent writing the pointed-to value through this pointer. Other allowed paths can still change a non-const target.')
  if value=='void':
   if 'pointer_declarator' in kinds or (n.parent and any(c.type=='pointer_declarator' for c in n.parent.children)):
    return meaning('General pointer target','With *, describe a general object pointer. Recover the correct object type before accessing its value.','blue')
   return meaning('No inputs' if parent=='parameter_declaration' else 'No returned value','State explicitly that this function takes no inputs.' if parent=='parameter_declaration' else 'This function does not return a value. In a cast, (void) deliberately discards a result.','blue')
  if value in keywords:return meaning(*keywords[value])
  if value in types and n.type in ['primitive_type','type_identifier']:return meaning('Type: '+value,types[value],'blue')
  if value in constants:return meaning(*constants[value],'orange')
  if value=='stdin':return meaning('Standard input','The standard input stream, often connected to the keyboard or piped text.','blue')
  if value=='errno':return meaning('Library error indicator','Clear before this conversion and inspect the documented error afterward. Zero by itself does not validate the entire input.','blue')
  if n.type=='statement_identifier':return meaning('Cleanup label','Name the cleanup position in this function for a goto or ordinary fallthrough.','blue')
  if n.type=='type_identifier':
   if parent=='type_definition':return meaning('Type alias name','Give this existing type the shorter name '+value+'.','blue')
   return meaning('Named type: '+value,'Use or define the user-declared type '+value+'.','blue')
  if n.type=='field_identifier':
   if 'field_designator' in kinds:return meaning('Member to initialize','Choose this named member to receive its starting value.','blue')
   if parent in ['field_declaration','pointer_declarator','array_declarator']:return meaning('Declare member: '+value,'Give this stored member its name inside the struct or union.','blue')
   return meaning('Member: '+value,'Access this named member of the selected struct or union.','blue')
  if n.type=='identifier':
   if parent in ['preproc_def','preproc_function_def','preproc_ifdef','preproc_defined','preproc_if'] or value.startswith('__STDC_'):
    return meaning('Macro name: '+value,'A preprocessing name used to supply text, choose a configuration, or test a reported feature.','blue')
   if parent=='preproc_params':return meaning('Macro input','Name the expression text substituted into this macro\'s replacement.','blue')
   if parent=='function_declarator':
    return meaning('Program entry' if value=='main' else 'Function name: '+value,'Name the main function where this hosted program starts.' if value=='main' else 'Declare or define this function. Its parameter list gives the input types, and its body supplies the work.','blue')
   if parent=='call_expression':
    if value in operations:return meaning(*operations[value])
    return meaning('Call: '+value,'Run '+value+' with the following inputs. '+('This name holds the callback selected by the caller.' if value=='operation' else 'Follow its definition to see the work and returned result.'),'blue')
   if 'parameter_declaration' in kinds or parent=='parameter_declaration':return meaning('Input name: '+value,'Name the argument value copied into this function call. A copied pointer may still reach the caller\'s object.','blue')
   if parent in ['pointer_declarator','array_declarator','declaration'] or (parent=='init_declarator' and n.parent.child_by_field_name('declarator')==n):
    return meaning('Declare: '+value,'Give this variable its name; the surrounding type and initializer describe its storage and starting value.','blue')
   return meaning('Value: '+value,'Use the value of '+value+' at this point in the program.','blue')
  if value=='&':return meaning('Get an address','Get a pointer to this live object.') if parent=='pointer_expression' else meaning('Select shared bits','Keep only the bit positions set in both integer values.')
  if value=='*':
   if parent=='pointer_declarator':return meaning('Pointer type','Declare a pointer to the type on the left. Each star adds one level of pointer.')
   if 'sizeof_expression' in kinds:return meaning('Pointed-to type for size','Select the pointed-to type for sizeof. This fixed-type expression is not evaluated and does not read the pointer target.')
   if parent=='pointer_expression':return meaning('Follow the pointer','Reach the object this pointer refers to. It must still be live and valid for this access.')
   return meaning('Multiply','Multiply the two numeric values, keeping within the result type\'s range.')
  if value=='+' and row['id']=='c-25':return meaning('Move by array items','Move this many items from the array\'s start, not this many bytes.')
  if value=='-' and row['id']=='c-25':return meaning('Distance in items','Subtract two positions in this same array to count the items between them, as ptrdiff_t.')
  operators={
   '+':('Add','Add the two values, keeping within the result type\'s range.'),'-':('Subtract','Subtract the right value from the left value.'),
   '/':('Divide','Divide the left value by the right. Integer division drops the fractional part toward zero.'),
   '<<':('Shift bits left','Move bits left by this many positions. Here the unsigned long input and count make the shift valid.'),
   '|':('Combine set bits','Keep each bit position that is set in either integer input.'),'|=':('Set bits and store','Combine the target\'s bits with the mask, then store the result back in the target.'),
   '&&':('Both conditions','Check the left side first. Check the right only if the left is true.'),'||':('Either condition','Check the left side first. Check the right only if the left is false.'),
   '!':('Reverse true and false','Give 1 for a zero input and 0 for a nonzero input.'),
   '->':('Follow pointer to a member','Reach the pointed-to struct or union, then select its named member.'),
   '.':('Select a member','Select this named member of a struct or union value.'),
  }
  if value in operators:return meaning(*operators[value])
  if value in ['==','!=','<','<=','>','>=']:return meaning('Compare values','Check this relationship. The result is int 1 for true or int 0 for false. These checks do not assign a value.')
  if value=='=':return meaning('Set a starting value' if parent in ['init_declarator','initializer_pair','enumerator'] else 'Assign a value','Store the right-hand value in the named target on the left.')
  if value=='++':return meaning('Increase by one','Add one to this value. '+('This postfix form supplies the old value before increasing it.' if not txt(n.parent).lstrip().startswith('++') else 'This prefix form supplies the updated value.'))
  if value in ['(',')']:
   groups={'parameter_list':('Function input declarations','Enclose the inputs this function accepts; void alone means no inputs.'),'argument_list':('Call inputs','Enclose values supplied to this call or check.'),'parenthesized_declarator':('Group the pointer declaration','Keep the star attached to the function-pointer name before its input types.'),'preproc_params':('Macro inputs','Enclose the placeholder names used by this macro.'),'preproc_defined':('Macro being checked','Enclose the macro name tested for a definition.'),'cast_expression':('Conversion type','Enclose the type to convert to; (void) discards a value.'),'compound_literal_expression':('Literal type','Name the struct type whose member values follow in braces.'),'sizeof_expression':('Type to measure','Enclose the type whose storage size is measured.'),'for_statement':('Loop controls','Enclose the loop\'s starting declaration, test, and update.')}
   return meaning(*groups.get(parent,('Group an expression','Keep this calculation or condition together.')))
  if value in ['[',']']:
   if 'sizeof_expression' in kinds:return meaning('Item type for size','Select one array item\'s type for this size calculation. The fixed-type expression is not evaluated.')
   return meaning('Array size','Enclose the number of array items, or leave empty to infer it from the starting items. In a parameter, array syntax is adjusted to a pointer.') if parent=='array_declarator' else meaning('Item position','Enclose a zero-based index. Read or write only a valid item inside the array.')
  if value in ['{','}']:
   groups={'compound_statement':('Code block','Enclose the instructions and local names in this block.'),'field_declaration_list':('Type members','Enclose the member declarations of this struct or union.'),'enumerator_list':('Named choices','Enclose the named integer constants of this enum.'),'initializer_list':('Starting values','Enclose the values used to initialize these members or items.')}
   assert parent in groups,(row['id'],value,parent);return meaning(*groups[parent])
  if value==':':return meaning('Case starts here','Begin the statements for this matching case or default.') if parent=='case_statement' else meaning('Label starts here','Mark this statement as a named place that goto can reach.')
  if value==';':return meaning('Separate loop controls','Finish this loop-control part before the next one.') if parent=='for_statement' else meaning('End this statement','Finish this statement or declaration. It does not print anything.')
  if value==',':return meaning('Separate items','Separate these inputs, declarations, or starting values.')
  unclassified.append({'lesson':row['id'],'kind':n.type,'parent':parent,'text':value});return meaning('Unclassified',value)
 parts=[]
 def visit(n):
  if n.type in ['string_literal','char_literal','system_lib_string','comment','preproc_arg'] or not n.children:
   if n.end_byte==n.start_byte or not txt(n).strip():return
   m=classify(n)
   if m not in meaning_ids:meaning_ids[m]=len(meanings);meanings.append(m)
   start=len(raw[:n.start_byte].decode().encode('utf-16-le'))//2;end=len(raw[:n.end_byte].decode().encode('utf-16-le'))//2
   parts.append([start,end,meaning_ids[m]])
  else:
   for child in n.children:visit(child)
 visit(tree.root_node);annotated.append({'id':row['id'],'source':source,'parts':parts})
(root/'docs/c-wording-v1/anatomy-unclassified.json').write_text(json.dumps(unclassified,indent=2)+'\n')
assert not unclassified,unclassified
output='// Generated by tests/c-anatomy.py from reviewed exact lesson sources.\nexport type CPart = [number, number, number];\n'
output+='export const cMeanings: [string, string, string][] = '+json.dumps(meanings,separators=(',',':'))+';\n'
output+='export const reviewedCAnatomy: {id:string;source:string;parts:CPart[]}[] = '+json.dumps(annotated,separators=(',',':'))+';\n'
(root/'lib/c-reviewed-anatomy.ts').write_text(output,encoding='utf8')
print(f'PASS: {len(annotated)} examples, {sum(len(x["parts"]) for x in annotated)} labeled source ranges, {len(meanings)} meanings; zero unclassified parts.')
