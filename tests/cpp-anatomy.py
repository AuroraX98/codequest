"""Generate reviewed, exact-source C++ labels. Parser packages are authoring tools only.
Usage: python tests/cpp-anatomy.py PATH_TO_PYTHON_PARSERS
Requires tree-sitter 0.26.0 and tree-sitter-cpp 0.23.4.
"""
import json,re,sys
from pathlib import Path
sys.path.insert(0,str(Path(sys.argv[1]).resolve()))
from tree_sitter import Language,Parser
import tree_sitter_cpp
root=Path(__file__).resolve().parents[1]
parser=Parser(Language(tree_sitter_cpp.language()))
rows=json.loads((root/'docs/cpp-wording-v1/examples.json').read_text())
meanings=[];meaning_ids={};annotated=[];unclassified=[]
def meaning(label,description,tone='purple'):return (label,description,tone)
keywords={
 'if':('Choose a branch','Run the following branch when its condition is true.'),
 'else':('Alternative branch','Run this branch when the matching if condition is false.'),
 'for':('Loop','Repeat the body using the items or controls inside the parentheses.'),
 'while':('Repeat while true','Check the condition before each turn; stop when it is false.'),
 'return':('Return to the caller','End this function call and supply the following value, if one is present.'),
 'break':('Leave this loop or switch','Stop the nearest enclosing loop or switch and continue after it.'),
 'continue':('Skip this turn','Skip the remaining loop body. A for loop still performs its update before the next test.'),
 'switch':('Select by value','Start at the case matching the value, or at default if no case matches.'),
 'case':('Matching case','Mark the starting point for the following matching value.'),
 'try':('Work covered by a handler','Run this block with the following exception handlers available.'),
 'catch':('Handle an exception','Handle an exception that matches the declared type.'),
 'throw':('Signal a failure','Interrupt the normal path and send this exception toward a matching handler.'),
 'struct':('Define a struct','Define a type that groups members. Its members are public unless access is changed.'),
 'enum':('Name a set of choices','Define a type with named values.'),
 'public':('Public members','Allow code outside the class to access the members declared after this label.'),
 'explicit':('Require deliberate conversion','Prevent this constructor from being used for an implicit conversion.'),
 'virtual':('Use the actual object type','Allow a derived type to supply behavior selected through a base pointer or reference.'),
 'override':('Check the override','Ask the compiler to verify that this function replaces a virtual base function.'),
 'template':('Define a type pattern','Introduce parameters used to create typed versions of this declaration.'),
 'typename':('Type placeholder','Introduce a name that stands for a type in this template.'),
 'auto':('Work out the type','Ask the compiler to work out the type from the starting value or item.'),
 'constexpr':('Allow a constant calculation','For this function, allow constant evaluation; for this variable, require a constant starting value.'),
 'static_assert':('Check before running','Require a constant condition to be true or reject the program during compilation.'),
 '#include':('Include a header','Bring the named header into this source before compilation.'),
 '#ifndef':('Check an include guard','Include the guarded text only if this macro name has not been defined.'),
 '#define':('Define the guard name','Mark this macro name as defined so a later guard can detect it.'),
 '#endif':('End the guarded region','Finish the matching preprocessor condition.'),
}
types={
 'int':'Whole numbers within the type\'s allowed range.', 'double':'Numbers that can have fractional parts; many fractions are approximate.',
 'bool':'A true-or-false value.', 'char':'One small unit of character data.', 'void':'No returned value from this function.',
 'string':'An owning sequence of character units.', 'string_view':'A borrowed starting position and length for text; it does not own the characters.',
 'vector':'An owning sequence whose number of items can change.', 'array':'An owning sequence with a size fixed in its type.',
 'map':'One value per distinct key, with keys visited in comparison order.', 'unordered_map':'Key-value pairs found using a hash and equality; visit order is not promised.',
 'set':'Distinct keys visited in comparison order.', 'optional':'Either a contained value or no value.',
 'variant':'One active alternative from the listed types, except for a possible exceptional valueless state.',
 'expected':'Either a successful value or an error value, with the caller checking which is present.',
 'span':'A borrowed view of consecutive items and their count; it does not own their storage.',
 'unique_ptr':'One owning pointer that destroys its object when ownership ends.', 'shared_ptr':'A pointer that shares ownership and keeps the object alive while an owner remains.',
 'weak_ptr':'A non-owning observer that can try to obtain a temporary shared owner.',
 'function':'A wrapper for a copyable callable with the stated input and result types.',
 'mutex':'A shared lock that one thread can hold at a time.', 'lock_guard':'A scoped owner of a mutex lock; destruction unlocks it.',
 'jthread':'A thread owner that requests stop and joins its worker when destroyed while joinable.',
 'atomic':'A value with supported indivisible operations for competing threads.',
 'ifstream':'A file input stream.', 'ofstream':'A file output stream.', 'path':'A filesystem location description; creating it does not create a file.',
 'milliseconds':'A duration counted in thousandths of a second.', 'seconds':'A duration counted in seconds.',
 'mt19937':'A pseudorandom engine with a repeatable sequence for a chosen starting state.',
 'uniform_int_distribution':'A distribution over all integers between two included endpoints.',
 'invalid_argument':'An exception type used to report an unsuitable function input.',
 'runtime_error':'An exception type used to report a failure encountered while running.',
 'integral':'A concept that requires an integer type rather than a floating-point type.',
}
operations={
 'size':('Read size','Return the number of stored items or character units without adding one.'),
 'at':('Checked item access','Access the item at this zero-based position; throw if the position is outside the allowed range.'),
 'push_back':('Append an item','Add the supplied item at the end of this sequence.'),
 'clear':('Remove all items','Remove the stored items while keeping the container object usable.'),
 'begin':('Beginning position','Return an iterator to the first item, or end() when the sequence is empty.'),
 'end':('Past-the-end position','Return the stopping position after the last item. Do not dereference it.'),
 'back':('Last item','Access the final item; the sequence must be nonempty.'),
 'empty':('Check for no items','Return true when the sequence contains no items.'),
 'contains':('Check for a key','Report whether the key exists without inserting it.'),
 'find':('Find a match','Return the matching item\'s position, or the end position when there is no match.'),
 'insert':('Try to insert','Try to add this key. For this set, the returned pair reports its position and whether it was newly added.'),
 'erase':('Erase and return a position','Remove this vector item and return a fresh iterator to the next item, or the new end.'),
 'swap':('Exchange contents','Exchange this vector\'s contents with the other vector. These default-allocator vectors can swap without throwing.'),
 'reset':('Release this owner','Give up this pointer\'s ownership and leave it empty. Other shared owners, if any, still keep their object alive.'),
 'lock':('Try to obtain an owner','Return a shared owner if the observed object is alive, or an empty pointer if it has expired.'),
 'expired':('Check whether ownership ended','Return true when no shared owner of the observed object remains.'),
 'error':('Read the error','Access the error alternative after checking that the expected result represents failure.'),
 'what':('Read the error message','Return descriptive text about this exception.'),
 'lexically_normal':('Simplify path spelling','Simplify dot and dot-dot components without consulting the filesystem.'),
 'generic_string':('Path as display text','Return the path\'s spelling as text using generic forward-slash separators.'),
 'extension':('Read the extension','Return the extension of the final filename.'),
 'close':('Close the file stream','Close the associated file. Check the stream afterward for a failed final write.'),
 'remove_prefix':('Shorten the view at the start','Hide this many leading character units from the view without erasing the owner\'s text.'),
 'count':('Read the duration count','Return the stored number in this duration\'s own time unit.'),
 'fetch_add':('Add atomically; return old value','Add the amount as one atomic update and return the value from before the update.'),
 'load':('Read atomically','Read the atomic value without changing it.'),
 'move':('Allow a move','Mark this value so the receiving operation may move from it. This call alone transfers nothing.'),
 'make_unique':('Create one owner','Create the requested object and return its unique_ptr owner.'),
 'make_shared':('Create shared ownership','Create the requested object and return its first shared_ptr owner.'),
 'get_if':('Check an alternative','Return a pointer to the requested active variant alternative, or nullptr when it is not active.'),
 'unexpected':('Return an error alternative','Wrap this value as the error alternative of an expected result.'),
 'sort':('Sort the range','Reorder the items using the comparator to decide which value should come first.'),
 'accumulate':('Combine into one total','Add the range\'s values to the supplied starting total.'),
 'getline':('Read a line','Read into the supplied string up to a newline or end-of-file. Check the returned stream before using the text.'),
 'duration_cast':('Convert the time unit','Convert this duration to the requested type. This whole-second conversion drops the fractional part toward zero.'),
 'assert':('Check an expectation','With assertions enabled, abort if the condition is false. NDEBUG disables evaluation of this check.'),
}
for row in rows:
 source=row['code'];raw=source.encode();tree=parser.parse(raw);assert not tree.root_node.has_error,row['id']
 def txt(n):return raw[n.start_byte:n.end_byte].decode()
 def ancestors(n):
  nodes=[]
  while n.parent:n=n.parent;nodes.append(n)
  return nodes
 def constructor_ambiguity(n):
  # The syntax grammar treats these declarations as function prototypes because
  # it does not resolve names. Native compilation confirms mutex/work are values.
  return row['id'] in ['cpp-66','cpp-67'] and any(a.type=='function_declarator' and txt(a).split('(')[0] in ['lock','finalLock','first','second'] for a in [n,*ancestors(n)])
 def classify(n):
  value=txt(n);parent=n.parent.type if n.parent else '';chain=ancestors(n);kinds=[a.type for a in chain]
  if n.type=='comment':return meaning('File label','Save the following part in '+value.removeprefix('// File: ')+'. This label is a comment, not an instruction.','gray')
  if n.type=='system_lib_string':return meaning('Library header','Make the standard-library declarations in '+value+' available to this source.','green')
  if n.type=='string_literal':
   if parent=='preproc_include':return meaning('Local header','Include this named project header, found beside the source or on an include search path.','green')
   return meaning('Text','A string literal. Quotes mark the text; \\n inside it represents a newline.','green')
  if n.type=='char_literal':return meaning('Character','A char literal. Single quotes mark it; \\n represents a newline character.','green')
  if n.type=='number_literal':
   if parent=='field_declaration' and any(c.type=='function_declarator' for c in n.parent.children):return meaning('Pure virtual marker','The zero after = makes this virtual function pure virtual, so a usable derived type must provide its implementation.')
   return meaning('Number','A numeric value written directly in the code. A decimal point makes these examples floating-point values.','orange')
  if value in ['true','false']:return meaning('Boolean value',value+' is a true-or-false value.','orange')
  if value=='nullptr':return meaning('No pointer target','A null pointer value. It does not refer to an object that can be dereferenced.','orange')
  if value=='const':
   if n.parent.parent and n.parent.parent.type=='function_declarator':return meaning('Read-only member function','Restrict changes to ordinary members through the current object in this function.')
   return meaning('Read-only access','Prevent changes through this declaration. The position of const determines what is read-only.')
  if value=='class':return meaning('Scoped enum' if parent=='enum_specifier' else 'Define a class','Keep these named enum choices under their enum type.' if parent=='enum_specifier' else 'Define a type with data and operations. Members start private until access is changed.')
  if value=='default':return meaning('Defaulted function' if parent=='default_method_clause' else 'Unmatched case','Use the compiler-provided implementation of this special function.' if parent=='default_method_clause' else 'Start here when no case label matches the switch value.')
  if value in keywords:return meaning(*keywords[value])
  if constructor_ambiguity(n) and n.type in ['identifier','type_identifier']:
   if parent=='function_declarator':return meaning('Name an object','Declare this local object and initialize it with the following input.','blue')
   return meaning('Constructor input','Use this existing value to initialize the new object.','blue')
  if value in types and (n.type in ['primitive_type','type_identifier'] or (n.type=='identifier' and parent=='qualified_identifier')):return meaning('Type requirement' if value=='integral' else 'Value type',types[value],'blue')
  if n.type in ['identifier','field_identifier','type_identifier','namespace_identifier']:
   if parent in ['preproc_def','preproc_ifdef']:return meaning('Guard name','A preprocessor name that records whether this header has already been included.','blue')
   if n.type=='namespace_identifier':return meaning('Name scope','Choose names from '+value+'. std is the standard-library namespace; nested scopes group related names.','blue')
   if constructor_ambiguity(n):
    if parent=='function_declarator':return meaning('Name an object','Declare this local object and initialize it with the following input.','blue')
    return meaning('Constructor input','Use this existing value to initialize the new object.','blue')
   if parent in ['struct_specifier','class_specifier','enum_specifier']:return meaning('Define a type','Give this user-defined type its name.','blue')
   if parent=='type_parameter_declaration' or (value=='T' and parent=='parameter_declaration'):return meaning('Type placeholder','Name the type chosen for a version of this template.','blue')
   if n.type=='type_identifier':return meaning('Named type','Use the declared type named '+value+'.','blue')
   if parent=='destructor_name':return meaning('Destructor name','Name the type whose destruction runs this cleanup.','blue')
   if parent=='enumerator' or value in ['Ready','Done']:return meaning('Named state','A named value belonging to State, not a text string.','orange')
   if value=='cout':return meaning('Standard output','The standard output stream used to display these values.','blue')
   if value=='cin':return meaning('Standard input','The standard input stream used to read from the terminal.','blue')
   if value=='boolalpha':return meaning('Boolean words','Set this stream to display Boolean values as true and false.','blue')
   if value=='nullopt':return meaning('No optional value','Create the empty state of an optional; this is different from containing zero.','orange')
   if value=='async' and row['id']=='cpp-68':
    if 'launch::' in txt(n.parent):return meaning('Async launch policy','Request asynchronous execution instead of leaving a deferred choice to the implementation.')
    return meaning('Start asynchronous work','Run the function using the chosen policy and return a future for its result.')
   if value in ['filter','transform']:
    if row['id']=='cpp-44':return meaning('Filter view' if value=='filter' else 'Transform view','Keep source values that pass this test during traversal.' if value=='filter' else 'Compute each kept value as the view is traversed.')
    return meaning('Transform items','Apply this function to each input and write one result into each existing output position.')
   if value=='get':
    if row['id']=='cpp-68':return meaning('Receive the future result','Wait as needed, consume the result, and rethrow any exception stored by the worker.')
    if row['id']=='cpp-50':return meaning('Read the active alternative','Read the requested variant alternative; throw if a different alternative is active.')
   # A declaration must be labeled before a known operation name is considered.
   if parent=='function_declarator':
    if value=='main':return meaning('Program entry','Define the main function where execution of this hosted C++ program starts.','blue')
    if value in ['Box','Session','Trace']:return meaning('Constructor name','Define the setup that runs when an object of this class is created.','blue')
    return meaning('Define or declare function','Give this function its name and input list. A body provides its work; a semicolon-only declaration announces it.','blue')
   if value in operations and (parent in ['qualified_identifier','template_function','call_expression','field_expression']):return meaning(*operations[value])
   if parent=='field_expression':
    if n.type=='field_identifier':
     if value=='second' and row['id']=='cpp-48':return meaning('Insertion result','The second part of this pair is true only when insert added a new set item.','blue')
     if any(a.type=='call_expression' and a.child_by_field_name('function')==n.parent for a in chain):return meaning('Call member function','Run this object\'s named operation using the following inputs.','blue')
     return meaning('Object member','Access this named piece of data stored in the object.','blue')
    return meaning('Object being used','Use this object before selecting its named member.','blue')
   if parent=='field_declaration':return meaning('Declare a member','Give this piece of data a name inside the class or struct.','blue')
   if parent=='field_initializer':return meaning('Initialize a member','Give this member its starting value before the constructor body runs.','blue')
   if parent=='call_expression':return meaning('Call a function','Run the callable named '+value+' with the inputs in parentheses.','blue')
   if parent in ['parameter_declaration','optional_parameter_declaration'] or 'parameter_declaration' in kinds:return meaning('Parameter name','Name the input this function receives when it is called.','blue')
   if parent=='lambda_capture_specifier':return meaning('Capture a nearby value','Make this surrounding local value available inside the lambda; & selects a reference capture.','blue')
   if parent=='structured_binding_declarator':return meaning('Name a pair part','Give one part of the existing pair a local name.','blue')
   if parent in ['init_declarator','declaration','pointer_declarator','reference_declarator','for_range_loop']:
    if parent not in ['init_declarator','for_range_loop'] or n.parent.child_by_field_name('declarator')==n:return meaning('Local name','Declare or bind this local name to the stated value or item.','blue')
   return meaning('Named value','Use the value represented by this declared name.','blue')
  if value in ['<','>'] and parent in ['template_argument_list','template_parameter_list']:return meaning('Template bracket','Enclose the types, values, or placeholders used by this template.')
  if value in ['<','<=','>','>=','==','!=']:return meaning('Compare values','Check the stated relationship and produce a true-or-false result.')
  if value=='<<':return meaning('Send to output','Send the right-hand value to the output stream on the left.')
  if value=='>>':return meaning('Read from input','Try to read a value from the input stream into the variable on the right.')
  if value=='&':
   if parent=='pointer_expression':return meaning('Get an address','Get a pointer to the following live object.')
   if parent.startswith('lambda'):return meaning('Capture by reference','Borrow the original local value instead of copying it into the lambda.')
   return meaning('Reference type','Declare another way to access an existing object rather than an independent copy.')
  if value=='*':
   if parent=='pointer_declarator':return meaning('Pointer type','Declare a pointer to the stated type.')
   if parent=='pointer_expression':return meaning('Reach the contained value','Dereference this pointer-like value only after establishing that its target or contained value is valid.')
   return meaning('Multiply','Multiply the left value by the right value.')
  if value=='=':
   if parent=='default_method_clause':return meaning('Use default implementation','Request the compiler-provided implementation of this special function.')
   if parent=='optional_parameter_declaration':return meaning('Default input','Supply this input when the caller omits it.')
   if parent=='field_declaration' and any(c.type=='function_declarator' for c in n.parent.children):return meaning('Require an implementation','Together with zero, mark this virtual function as pure virtual.')
   return meaning('Set a value','Use the right-hand value to initialize or assign the target on the left.')
  if value=='++':
   if re.fullmatch(r'(?:\+\+it|it\+\+)',txt(n.parent)):return meaning('Next iterator position','Advance this iterator to the next position in the sequence.')
   return meaning('Add one','Increase this numeric value by one.')
  operators={'+':('Add','Add these numeric values.'),'-':('Subtract','Subtract the right number from the left number.'),'/':('Divide','Divide the left value by the right. Integer operands drop any fractional part.'),'%':('Remainder','Find the integer remainder after division.'),'++':('Advance by one','Increase this number by one, or advance this iterator to its next position.'),'--':('Decrease by one','Decrease this number by one.'),'+=':('Add and store','Add the right value to the target, then store the new result.'),'&&':('Both conditions','Check the left condition first; check the right only if the left is true.'),'||':('Either condition','Check the left condition first; check the right only if the left is false.'),'!':('Reverse the condition','Turn a true condition into false, or a false condition into true.'),'|':('Connect view steps','Pass the range through the next view operation.'),'.':('Choose a member','Select the named member of the object before the dot.'),'::':('Choose a scoped name','Select the name from the namespace, type, or other scope on the left.'),'~':('Destructor mark','Mark this function as cleanup for the named type.')}
  if value in operators:return meaning(*operators[value])
  if value in ['(',')']:
   if constructor_ambiguity(n):return meaning('Constructor inputs','Enclose the values used to initialize this object.')
   groups={'parameter_list':('Function inputs','Enclose the function\'s parameter declarations.'),'argument_list':('Call inputs','Enclose values supplied to this function call or object construction.'),'condition_clause':('Condition','Enclose the value or test used to choose the next path.'),'for_statement':('Loop controls','Enclose setup, test, and update for this counted loop.'),'for_range_loop':('Loop item and range','Enclose the item declaration and the sequence to visit.'),'static_assert_declaration':('Compile-time check inputs','Enclose the required constant condition and its optional error message.')}
   return meaning(*groups.get(parent,('Group a calculation','Group the enclosed values or calculation together.')))
  if value in ['[',']']:
   groups={'lambda_capture_specifier':('Capture list','Enclose the nearby values the lambda captures.'),'structured_binding_declarator':('Names for parts','Enclose the local names given to parts of the existing value.'),'subscript_argument_list':('Item position','Enclose the zero-based position used to access an item.')}
   assert parent in groups,(row['id'],value,parent)
   return meaning(*groups[parent])
  if value in ['{','}']:
   groups={'initializer_list':('Starting values','Enclose the starting values for this object or its items.'),'compound_statement':('Code block','Enclose the instructions belonging to this scope.'),'field_declaration_list':('Type members','Enclose the data and functions declared in this type.'),'enumerator_list':('Named choices','Enclose the named values of this enum.')}
   assert parent in groups,(row['id'],value,parent)
   return meaning(*groups[parent])
  if value==':':
   groups={'base_class_clause':('Base type','Introduce the type this new type derives from.'),'case_statement':('Case starts here','Start the instructions for this case or default label.'),'field_declaration_list':('Access label ends','Finish the access label that applies to the following members.'),'field_initializer_list':('Member setup','Start the constructor\'s member initializer list.'),'for_range_loop':('Items come from','Separate the loop item declaration from the sequence being visited.')}
   assert parent in groups,(row['id'],value,parent)
   return meaning(*groups[parent])
  if value==',':return meaning('Separate items','Separate one item, type, name, or input from the next.')
  if value==';':return meaning('Loop separator' if parent=='for_statement' else 'End this statement','Separate the loop\'s setup, test, and update.' if parent=='for_statement' else 'Finish this statement or declaration.')
  unclassified.append({'lesson':row['id'],'text':value,'node':n.type,'parent':parent});return meaning('Code','Unclassified code fragment.','gray')
 parts=[]
 def visit(n):
  if n.type in ['string_literal','char_literal','system_lib_string','comment'] or not n.children:
   if n.end_byte==n.start_byte:return
   m=classify(n)
   if m not in meaning_ids:meaning_ids[m]=len(meanings);meanings.append(m)
   start=len(raw[:n.start_byte].decode().encode('utf-16-le'))//2;end=len(raw[:n.end_byte].decode().encode('utf-16-le'))//2
   parts.append([start,end,meaning_ids[m]])
  else:
   for c in n.children:visit(c)
 visit(tree.root_node)
 annotated.append({'id':row['id'],'source':source,'parts':parts})
(root/'docs/cpp-wording-v1/anatomy-unclassified.json').write_text(json.dumps(unclassified,indent=2)+'\n')
assert not unclassified,unclassified
output='// Generated by tests/cpp-anatomy.py from reviewed, exact lesson sources.\n'
output+='export type CppPart = [number, number, number];\n'
output+='export const cppMeanings: [string, string, string][] = '+json.dumps(meanings,separators=(',',':'))+';\n'
output+='export const reviewedCppAnatomy: {id:string;source:string;parts:CppPart[]}[] = '+json.dumps(annotated,separators=(',',':'))+';\n'
(root/'lib/cpp-reviewed-anatomy.ts').write_text(output,encoding='utf8')
print(f'PASS: {len(annotated)} examples, {sum(len(x["parts"]) for x in annotated)} source ranges, {len(meanings)} meanings, zero unclassified parts.')
