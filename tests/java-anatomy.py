"""Generate exact-source Java labels with reviewed meanings and syntax roles.
Usage: python tests/java-anatomy.py PATH_TO_PYTHON_PARSERS
Authoring dependencies: tree-sitter 0.26.0, tree-sitter-java 0.23.5.
Native compilation is checked separately by java-native.py.
"""
import json,re,sys
from pathlib import Path
sys.path.insert(0,str(Path(sys.argv[1]).resolve()))
from tree_sitter import Language,Parser
import tree_sitter_java
root=Path(__file__).resolve().parents[1];parser=Parser(Language(tree_sitter_java.language()))
rows=json.loads((root/'docs/java-wording-v1/examples.json').read_text(encoding='utf8'))
meanings=[];meaning_ids={};annotated=[];unclassified=[]
def meaning(label,description,tone='purple'):return (label,description,tone)
keywords={
 'public':('Public access','Allow callers to use this declaration when its enclosing type and package access rules also allow it.'),
 'private':('Private access','Keep this member inside its declaring class and its enclosing nest of classes.'),
 'class':('Declare a class','Start a class that groups fields and methods for its objects.'),
 'interface':('Declare an interface','Describe behavior that implementing classes must provide.'),
 'record':('Declare a record','Group named data components and generate a constructor, reading methods, equality, hashing, and display text.'),
 'enum':('Declare named choices','Define a type with the named values listed in its body.'),
 'sealed':('Limit direct child types','Allow only the direct child types permitted by this declaration.'),
 'permits':('Allowed direct types','List the types allowed to directly extend or implement this sealed type.'),
 'implements':('Promise interface behavior','Declare the interfaces whose required methods this class provides.'),
 'if':('Check a condition','Run the following branch when its condition is true.'),
 'else':('Alternative branch','Run this branch when the matching if condition is false.'),
 'while':('Repeat while true','Test before each turn and stop when the condition is false.'),
 'for':('Repeat a body','Use the controls or items in parentheses to decide which turns to run.'),
 'continue':('Skip this turn','Skip the remaining loop body. This for loop still runs its update before testing again.'),
 'return':('Return to the caller','End this method call and give back the following value, if one is present.'),
 'switch':('Choose a result','Select the matching case to produce this switch expression\'s value.'),
 'case':('Match this value','Choose this rule when the switch input matches the following value.'),
 'default':('Handle unlisted values','Use this rule when none of the listed cases matches.'),
 'new':('Create an object','Create an object or array using the following type and inputs.'),
 'this':('This object','Refer to the current object whose instance code is running.'),
 'import':('Use a shorter type name','Make the named available type, or types in the named package, usable by short names. This downloads nothing.'),
 'package':('Declare the package','State the package that contains this file\'s types.'),
 'module':('Declare a named module','Give this module its name and describe its requirements or shared packages in the body.'),
 'throws':('Declare possible failure','List exception types that may leave this method for its caller to handle.'),
 'throw':('Signal a failure','Leave the normal path by sending the following exception or error toward a matching handler.'),
 'try':('Begin protected work','Run the block with its following exception handlers, or manage the resources declared in parentheses.'),
 'catch':('Handle a matching exception','Run this handler when the preceding try work throws an exception of the declared type.'),
 'instanceof':('Check and name the object type','Test whether this value is a non-null object of the stated type; a matching pattern can give it a local name.'),
 'synchronized':('Use this object\'s lock','Hold this instance\'s monitor lock for the whole method call, then release it when the call exits.'),
 '@interface':('Declare an annotation type','Define a kind of metadata that can be attached to code.'),
}
types={
 'String':'An object holding unchangeable text as UTF-16 units.',
 'Integer':'An object wrapper for an int; its reference can be null.',
 'Number':'The parent type of numeric wrapper types, with methods for reading numeric forms.',
 'Object':'The common parent type of Java classes.',
 'StringBuilder':'An object whose text can be built up and changed.',
 'Scanner':'A reader that can split input into tokens and read typed values.',
 'ArrayList':'An ordered, changeable list whose size can grow or shrink.',
 'List':'An ordered sequence interface. Whether edits are allowed depends on the actual list.',
 'HashMap':'A collection with one value per distinct key; listing order is not promised.',
 'HashSet':'A collection of distinct members; listing order is not promised.',
 'Optional':'An object holding either a present value or no value.',
 'AutoCloseable':'An interface for an object with a close operation managed by try-with-resources.',
 'IntUnaryOperator':'An interface for an operation taking one int and returning one int.',
 'ToIntFunction':'An interface for an operation taking the chosen input type and returning an int.',
 'Runnable':'An interface for a task with no inputs and no returned value.',
 'Thread':'A thread that can run a task independently of the calling thread.',
 'AtomicInteger':'An int holder with indivisible operations for use by multiple threads.',
 'CountDownLatch':'A counter-based gate: await waits for the count to reach zero.',
 'ExecutorService':'A service that accepts tasks and manages their execution and shutdown.',
 'Future':'A handle used to wait for a task and receive its result or failure.',
 'CompletableFuture':'A future whose completion can feed further stages of work.',
 'Comparator':'An ordering rule used to compare two values.',
 'Path':'A description of a file location; making a Path does not create a file.',
 'Properties':'A collection commonly used for text configuration keys and values.',
 'StringReader':'A reader whose input comes from a String rather than a file.',
 'Instant':'One moment on the timeline, independent of a display time zone.',
 'BigDecimal':'A decimal value whose arithmetic returns new values with explicit precision or rounding choices when needed.',
 'IOException':'A checked exception for an input or output failure.',
 'IllegalArgumentException':'An unchecked exception for an unsuitable input.',
 'IllegalStateException':'An unchecked exception for an operation attempted in an unsuitable state.',
 'NumberFormatException':'An unchecked exception when text cannot be parsed as the requested number.',
 'InterruptedException':'A checked exception used when an interruptible waiting operation is interrupted.',
 'ExecutionException':'A checked exception that reports a task failure when retrieving its Future result.',
 'AssertionError':'An error used here to report a failed explicit test check.',
 'System':'The class providing standard input, standard output, and other system facilities.',
 'Math':'The class providing numeric operations such as checked addition and minimum or maximum.',
 'Objects':'The class providing object helpers such as a required non-null check.',
 'Collectors':'The class providing rules for gathering stream results.',
 'Files':'The class providing filesystem reading and writing operations.',
 'StandardOpenOption':'The enum of file-opening choices, including appending.',
 'StandardCharsets':'The class containing named, standard text encodings.',
 'ZoneId':'A named set of rules used to show a moment as local time.',
 'RoundingMode':'The enum of available rounding rules.',
 'Executors':'The class providing factory methods for task executors.',
 'RetentionPolicy':'The enum of rules for how long annotation metadata is retained.',
 'ElementType':'The enum of code locations where an annotation may be allowed.',
}
operations={
 'println':('Print a line','Show the supplied value on standard output, followed by a line break.'),
 'hasNextInt':('Check the next token','Test whether the next input token fits in an int without consuming it. This may wait for input.'),
 'nextInt':('Read an integer token','Consume the next token as an int. The preceding check confirms it is suitable here.'),
 'addExact':('Add with an overflow check','Add these integers; throw ArithmeticException if the exact result does not fit.'),
 'length':('Count text units','Return this String\'s number of UTF-16 units, which need not equal the number of visible symbols.'),
 'codePointCount':('Count code points','Count Unicode code points from the starting UTF-16 index up to, but not including, the ending index.'),
 'toString':('Take a text snapshot','Return a String with this builder\'s current text. Later builder edits do not change that String.'),
 'append':('Append text','Add the supplied text at the end of this same StringBuilder.'),
 'remove':('Remove by index','Remove the list item at this int position and shift later items down. Positions count from zero.'),
 'size':('Count members','Return the number of items or entries currently in this collection.'),
 'put':('Store by key','Add this key-value entry, or replace the value if the key already exists.'),
 'getOrDefault':('Look up or use a fallback','Return the value for a present key, or the supplied fallback when the key is absent. Do not insert the missing key.'),
 'doubleValue':('Read as double','Return this Number\'s numeric value as a double.'),
 'valueOf':('Wrap an integer','Return an Integer representing the supplied int. This call does not parse text.'),
 'getMessage':('Read the failure message','Return the descriptive message stored in this exception.'),
 'ofNullable':('Make an optional result','Return a present Optional for a non-null input, or an empty Optional for null.'),
 'isPresent':('Check for a value','Return true if this Optional contains a value.'),
 'isEmpty':('Check for empty text','Return true exactly when this String has zero UTF-16 units.'),
 'requireNonNull':('Require an object','Return the supplied reference if present; otherwise throw NullPointerException.'),
 'applyAsInt':('Call the supplied operation','Pass this input to the stored functional-interface operation and return its int answer.'),
 'stream':('Start a stream','Create a sequential stream for processing this collection. Its processing waits for a terminal operation.'),
 'filter':('Keep matching values','Keep only values for which this true-or-false operation returns true.'),
 'map':('Transform each value','Describe how each incoming stream value becomes a result value.'),
 'toList':('Finish into a list','Perform the stream query and collect its results in an unmodifiable list. The stream is then used up.'),
 'collect':('Gather stream results','Finish the stream using the supplied collector and return its gathered result.'),
 'groupingBy':('Group by a key','Make a collector that groups items by the key computed for each item.'),
 'counting':('Count each group','Make a collector that counts its items and returns a long count.'),
 'readString':('Read file text','Read the file contents into a String using UTF-8 here. A failed read can throw IOException.'),
 'getBytes':('Encode as bytes','Convert this text into a byte array using the supplied encoding.'),
 'parseInt':('Parse integer text','Read decimal text as an int; throw NumberFormatException if it is not a valid in-range int.'),
 'getProperty':('Read a setting','Return the String value for this setting, or the supplied fallback if the key is absent.'),
 'parse':('Parse an instant','Read the supplied standard date-and-time text as one moment on the timeline.'),
 'atZone':('Show the instant in a zone','Apply this zone\'s rules without changing the underlying moment.'),
 'toLocalDate':('Keep just the date','Extract the local calendar date, leaving out time-of-day and zone information.'),
 'divide':('Divide with rounding','Divide by the supplied decimal, keeping the requested decimal places and applying the stated rounding rule.'),
 'comparingInt':('Order by an integer key','Create an ordering rule using the int produced for each item.'),
 'thenComparing':('Break ordering ties','Use this second ordering only when the earlier comparison treats the items as tied.'),
 'naturalOrder':('Use natural ordering','Create the normal ordering for these values. For the lowercase words here, ant comes before bee.'),
 'sort':('Reorder this list','Sort this changeable list in place using the supplied comparison rule.'),
 'copyOf':('Make a list snapshot','Return an unmodifiable snapshot of these list items. Later source additions do not appear; item objects are still shared.'),
 'getModule':('Read the class module','Return the module that contains this class.'),
 'getName':('Read the module name','Return the name of this named module.'),
 'isAnnotationPresent':('Check a runtime annotation','Return whether the given annotation is visible on this class while the program runs.'),
 'min':('Choose the smaller value','Return the smaller of the two supplied numbers.'),
 'max':('Choose the larger value','Return the larger of the two supplied numbers.'),
 'start':('Start the worker','Schedule this Thread\'s task to run on its own thread. Do not start the same Thread twice.'),
 'incrementAndGet':('Add one atomically','Add one as an indivisible update and return the new int value.'),
 'newFixedThreadPool':('Create a fixed worker pool','Create an executor with up to this many default platform worker threads.'),
 'submit':('Submit a result-producing task','Give this task to the executor and return a Future for its result or failure.'),
 'newVirtualThreadPerTaskExecutor':('Create one virtual thread per task','Create an executor that starts a new virtual thread for each submitted task.'),
 'currentThread':('Get the running thread','Return the Thread executing this particular call.'),
 'isVirtual':('Check the thread kind','Return true if this is a virtual thread, otherwise false.'),
 'completedFuture':('Start with a ready result','Create a CompletableFuture already completed successfully with the supplied value.'),
 'thenApply':('Transform a successful result','Produce a new future by applying this operation to the preceding successful result. A separate thread is not promised.'),
 'countDown':('Reduce the latch count','Reduce the count if it is above zero. Reaching zero releases waiting await calls.'),
 'await':('Wait for the latch','Wait for the count to reach zero, or throw InterruptedException if interrupted.'),
 'interrupt':('Request interruption','Set an interruption request or interrupt a supported waiting operation. This does not forcibly kill the thread.'),
 'topic':('Read the topic component','Return the topic stored in this Session record.'),
 'minutes':('Read the minutes component','Return the minutes stored in this Session record.'),
 'completed':('Read the completed component','Return the completed count stored in this Session record.'),
 'target':('Read the target component','Return the target count stored in this Session record.'),
}
constants={
 'out':('Standard output','The output stream used here to display program results.'),
 'in':('Standard input','The input stream that this Scanner reads.'),
 'length':('Array length','The fixed number of slots in this array. This is a field, not a method call.'),
 'APPEND':('Append option','Ask the file write to add at the end instead of replacing existing text.'),
 'UTF_8':('UTF-8 encoding','The explicit rule used here to turn text into bytes and bytes back into text.'),
 'HALF_UP':('Nearest, with ties away from zero','Round to the nearest allowed value; an exact halfway tie goes away from zero.'),
 'RUNTIME':('Keep runtime visibility','Make this annotation available to reflection while the program runs.'),
 'TYPE':('Allow type declarations','Allow this annotation on type declarations, such as a class.'),
}
for row in rows:
 source=row['code'];parts=[];chunks=[]
 markers=list(re.finditer(r'^// File: (.+)\n',source,re.M))
 def add(start,end,m):
  if m not in meaning_ids:meaning_ids[m]=len(meanings);meanings.append(m)
  parts.append([len(source[:start].encode('utf-16-le'))//2,len(source[:end].encode('utf-16-le'))//2,meaning_ids[m]])
 if markers:
  for i,m in enumerate(markers):
   add(m.start(),m.end()-1,meaning('File: '+m[1],'Save the following part in '+m[1]+'. It is a separate file within this one example.','gray'))
   chunks.append((m.end(),source[m.end():markers[i+1].start() if i+1<len(markers) else len(source)]))
 else:chunks=[(0,source)]
 for offset,chunk in chunks:
  raw=chunk.encode();tree=parser.parse(raw);assert not tree.root_node.has_error,(row['id'],str(tree.root_node))
  def txt(n):return raw[n.start_byte:n.end_byte].decode() if n else ''
  def classify(n):
   value=txt(n);p=n.parent;parent=p.type if p else '';chain=[];a=p
   while a:chain.append(a);a=a.parent
   kinds=[a.type for a in chain]
   if n.type=='string_literal':return meaning('Text value','A String written in quotes. Escapes inside represent text units; the outside quotes are not stored.','green')
   if n.type=='character_literal':return meaning('One char unit','A single UTF-16 unit written with single quotes.','green')
   if n.type in ['line_comment','block_comment']:return meaning('Comment','A note for readers that Java does not run.','gray')
   if n.type=='decimal_integer_literal':return meaning('Long number' if value.endswith(('L','l')) else 'Whole number','A whole-number literal of type long.' if value.endswith(('L','l')) else 'A whole-number literal of type int.','blue')
   if n.type=='null_literal':return meaning('No object','A reference value that points to no object.','gray')
   if value in ['true','false']:return meaning('Boolean value','The true-or-false answer '+value+'.','blue')
   if value in ['int','byte','double','boolean','void']:
    descriptions={'int':'A whole number from -2147483648 through 2147483647.','byte':'A small whole number from -128 through 127; used here for encoded data.','double':'A number that can have a fractional part; many fractions are approximate.','boolean':'One of two values: true or false.','void':'This method returns no value.'}
    return meaning(value+' type',descriptions[value],'blue')
   if value=='var' and parent=='local_variable_declaration':return meaning('Infer the fixed type','Let the compiler work out this local variable\'s type from its starting value.','blue')
   if value=='class' and parent=='class_literal':return meaning('Class metadata','Get the Class object that describes the named type; this does not create an instance.')
   if value=='static':return meaning('Static nested class' if 'class_declaration'==p.parent.type else 'Class member','This nested class needs no enclosing object.' if p.parent.type=='class_declaration' else 'Make this member belong to the class rather than to each individual object.')
   if value=='final':return meaning('No child classes','Prevent other classes from extending this class.') if p.parent.type=='class_declaration' else meaning('Assign only once','Allow this variable or field to be assigned only once. A referenced object may still be changeable.')
   if value=='abstract':return meaning('Abstract class','Prevent direct creation of this class; concrete child classes finish its required methods.') if p.parent.type=='class_declaration' else meaning('Method body required','Declare a method without a body for a concrete child class to provide.')
   if value=='extends':
    return meaning('Upper type bound','Require the chosen or unknown type to be this type or one of its child types.') if parent in ['type_bound','wildcard'] else meaning('Parent class','Build this class on the following parent class.')
   if value=='super' and parent=='wildcard':return meaning('Lower type bound','Allow an unknown type that is this type or one of its parent types.')
   if value in keywords:return meaning(*keywords[value])
   if n.type in ['identifier','type_identifier']:
    if any(k in kinds for k in ['import_declaration','package_declaration','module_declaration']) and not any(k in kinds for k in ['class_declaration','method_declaration']):return meaning('Qualified name part','Part of this package, imported type, or module name. Dots join its name parts.','blue')
    if parent in ['class_declaration','interface_declaration','record_declaration','enum_declaration','annotation_type_declaration'] and p.child_by_field_name('name')==n:return meaning('Name this type','Give this newly declared type the name '+value+'.','blue')
    if parent in ['constructor_declaration','compact_constructor_declaration'] and p.child_by_field_name('name')==n:return meaning('Constructor name','Define setup or checks that run when a '+value+' object is created.','blue')
    if parent=='method_declaration' and p.child_by_field_name('name')==n:
     return meaning('Program entry','Define the main method where this example starts running.','blue') if value=='main' else meaning('Declare method','Give this method the name '+value+'. Its body describes work to run when called.','blue')
    if parent in ['marker_annotation','annotation']:return meaning('Override check' if value=='Override' else 'Annotation name','Ask the compiler to check that this method overrides an inherited method.' if value=='Override' else 'Name the metadata annotation attached to this declaration.','blue')
    if parent=='type_parameter':return meaning('Type placeholder','Name a type that callers will choose, subject to any stated bound.','blue')
    if parent=='method_reference' and n==p.named_children[-1]:return meaning('Refer to a method','Supply '+value+' as an operation to call later. This reference does not call it now.','blue')
    if parent=='scoped_type_identifier' and value in ['java','util','io']:return meaning('Package name part','Part of the package name leading to the type used here.','blue')
    if n.type=='type_identifier' or (value in types and parent in ['field_access','method_invocation','method_reference']):return meaning('Type: '+value,types.get(value,'The declared '+value+' type used at this position.'),'blue')
    if parent=='method_invocation' and p.child_by_field_name('name')==n:
     if value=='get':
      specific={'java-19':('Read by index','Return the list item at this zero-based position.'),'java-28':('Read the level','Call Level.get to return its current stored value.'),'java-37':('Read the boxed value','Call Box.get to return its stored value with the chosen generic type.'),'java-43':('Read the optional value','Return the contained value. Throw if absent; the preceding check guards it here.'),'java-65':('Read under the lock','Call Counter.get using the same object lock to read its count.'),'java-66':('Read the atomic value','Atomically read the current int without changing it.'),'java-67':('Wait for the task result','Wait if needed and return the task result, or report interruption or task failure.'),'java-68':('Wait for the task result','Wait if needed and return the task result, or report interruption or task failure.')}
      assert row['id'] in specific;return meaning(*specific[row['id']])
     if value=='join':return meaning('Read the final future result','Wait if needed for the final value; report failed completion with an unchecked exception.') if row['id']=='java-69' else meaning('Wait for this thread','Wait for this worker to terminate. A successful return makes its completed work visible to following reads.')
     if value=='add':return meaning('Add a distinct member','Add this member if it is not already equal to one in the set; return whether it was new.') if row['id'] in ['java-21','java-36'] else meaning('Append a list item','Add this item to the end of the changeable list.')
     if value=='equals':return meaning('Compare record data','Compare Key ids rather than object identity.') if row['id']=='java-36' else meaning('Compare String text','Check whether the other value is a String with matching text. This receiver is non-null here.')
     if value=='of':
      receiver=txt(p.child_by_field_name('object'))
      specific={'List':('Create an unmodifiable list','Make a list from these items. Its items cannot be added, removed, or replaced.'),'Path':('Describe a file location','Make a Path from this text without creating a file.'),'ZoneId':('Choose zone rules','Find the named time zone rules for displaying a moment.')}
      assert receiver in specific,(row['id'],receiver);return meaning(*specific[receiver])
     if value=='load' and row['id']=='java-53':return meaning('Load settings text','Read properties from this reader into the configuration object.')
     if value=='writeString':return meaning('Append file text','Write this text at the end of the file because APPEND is supplied.') if 'APPEND' in txt(p) else meaning('Replace file text','Write this text using UTF-8. Create a missing file or replace all existing contents.')
     if value in operations:return meaning(*operations[value])
     return meaning('Call '+value,'Run the '+value+' method defined in this example with the inputs inside parentheses.','blue')
    if parent=='variable_declarator' and p.child_by_field_name('name')==n:
     if p.parent.type=='spread_parameter':return meaning('Gathered input name','Name the array of values gathered by this varargs parameter.','blue')
     return meaning('Declare a field' if p.parent.type=='field_declaration' else 'Declare a local name','Give this '+('field' if p.parent.type=='field_declaration' else 'local variable')+' the name '+value+'.','blue')
    if parent in ['formal_parameter','catch_formal_parameter','spread_parameter']:
     if 'record_declaration' in kinds and not any(k in kinds for k in ['method_declaration','constructor_declaration']):return meaning('Record component','Name a stored component and its matching constructor input and reading method.','blue')
     return meaning('Exception name','Give the caught exception this local name.','blue') if parent=='catch_formal_parameter' else meaning('Input name','Name the value this method or constructor receives.','blue')
    if parent=='enhanced_for_statement' and p.child_by_field_name('name')==n:return meaning('Loop item name','Give each visited item this local name for the current turn.','blue')
    if parent=='instanceof_expression' and p.child_by_field_name('name')==n:return meaning('Matched object name','Use this local name for the object after the type pattern succeeds.','blue')
    if parent=='lambda_expression' and p.child_by_field_name('parameters')==n:return meaning('Lambda input','Name the value received each time this lambda is called.','blue')
    if parent=='enum_constant' or parent=='switch_label':return meaning('Named enum choice','Use the enum choice '+value+'.','blue')
    if parent=='field_access' and p.child_by_field_name('field')==n:
     if value in ['READ','REST']:return meaning('Named enum choice','Use the '+value+' value of Mode.','blue')
     return meaning(*constants[value],'blue') if value in constants else meaning('Object or class field','Select the named data field '+value+' from the object or class on the left.','blue')
    if parent=='scoped_type_identifier':return meaning('Qualified type name part','Part of the full package-and-type name written here.','blue')
    return meaning('Named value','Use the value currently represented by '+value+'.','blue')
   if value in ['<','>'] and parent in ['type_arguments','type_parameters']:return meaning('Generic type brackets','Enclose chosen type arguments or declared type placeholders. Empty <> asks Java to infer the arguments.')
   if value=='?':return meaning('Unknown type','Represent an unknown type argument, limited by any following extends or super bound.')
   if value=='...':return meaning('Gather variable inputs','Gather the remaining supplied values into an array for this last parameter.')
   if value=='->':return meaning('Lambda body follows','Separate the lambda inputs from the expression or body that does its work.') if parent=='lambda_expression' else meaning('Case result follows','Supply this matching switch case\'s result without falling into the next case.')
   if value=='::':return meaning('Method reference','Refer to the method after this symbol as an operation to call later.')
   if value in ['==','!=']:
    if 'null' in txt(p):return meaning('Check for a missing reference','Compare this reference with null to check whether an object is present.')
    if row['id'] in ['java-11','java-36']:return meaning('Compare object identity','Check whether both references point to the same object, rather than comparing its contents.')
    return meaning('Compare values','Check whether these values are equal.' if value=='==' else 'Check whether these values differ.')
   if value in ['<','<=','>','>=']:return meaning('Compare values',{'<':'Check whether the left value is smaller than the right.','<=':'Check whether the left value is smaller than or equal to the right.','>':'Check whether the left value is greater than the right.','>=':'Check whether the left value is greater than or equal to the right.'}[value])
   if value=='+':return meaning('Join text','Join the left and right values as String text.') if '"' in txt(p) else meaning('Add numbers','Add the numeric value on the left to the one on the right.')
   if value=='*' and parent=='asterisk':return meaning('Import package types','Allow short names for available types directly in this package, not its subpackages.')
   if value=='-' and parent=='unary_expression':return meaning('Negative value','Negate the following numeric value.')
   if value=='.':return meaning('Qualified name separator','Join parts of this package or type name.') if parent in ['scoped_identifier','scoped_type_identifier','import_declaration'] else meaning('Select a member','Select a member, method, or class metadata from the value or type on the left.')
   operators={'=':('Assign a value','Use the right-hand result as the starting or replacement value of the target on the left.'),'++':('Increase by one','Add one to this variable\'s numeric value.'),'+=':('Add and store','Add the right value to the current left value and store the result back.'),'-':('Subtract','Subtract the right numeric value from the left.'),'*':('Multiply','Multiply the two numeric values.'),'/':('Integer division','Divide these int operands and drop any fractional part toward zero.'),'%':('Remainder','Return the remainder after integer division.'),'&&':('Both conditions','Check the right side only if the left is true; both must be true for the combined answer.'),'||':('Either condition','Check the right side only if the left is false; at least one true side makes the combined answer true.'),'!':('Reverse the answer','Turn true into false or false into true.'),'@':('Attach metadata','Attach this annotation to the following declaration.'),':':('Items come from','Separate the loop item declaration from the collection or array being visited.')}
   if value in operators:return meaning(*operators[value])
   if value in ['(',')']:
    groups={'formal_parameters':('Declared inputs','Enclose the input declarations for this method, constructor, record, or lambda.'),'argument_list':('Call inputs','Enclose the values passed to this method or constructor.'),'parenthesized_expression':('Grouped condition','Group the value or condition used to choose the next steps.'),'for_statement':('Loop controls','Enclose the starting value, condition, and update for this loop.'),'enhanced_for_statement':('Item and source','Enclose the loop item declaration and the source of items to visit.'),'catch_clause':('Caught exception','Enclose the exception type and its local name.'),'resource_specification':('Managed resource','Enclose a resource that will be closed when this try block exits.'),'annotation_argument_list':('Annotation setting','Enclose the value supplied to this annotation.')}
    assert parent in groups,(row['id'],value,parent);return meaning(*groups[parent])
   if value in ['[',']']:return meaning('Array type','Mark a type as an array whose items have the preceding type.') if parent=='dimensions' else meaning('Array position','Enclose the zero-based index of the array item being accessed.')
   if value in ['{','}']:
    descriptions={'class_body':'the fields, methods, and other declarations of this class or record','interface_body':'the declarations of this interface','block':'the instructions belonging to this block','constructor_body':'the setup performed by this constructor','array_initializer':'the starting array items','switch_block':'the switch cases that choose a result','enum_body':'the enum\'s named choices','module_body':'the module\'s declarations','annotation_type_body':'the annotation type\'s declarations'}
    assert parent in descriptions,(row['id'],value,parent);return meaning('Open block' if value=='{' else 'Close block',('Start ' if value=='{' else 'End ')+descriptions[parent]+'.')
   if value==',':return meaning('Separate items','Separate one input, declaration, type, or item from the next.')
   if value==';':return meaning('Loop separator','Separate the counted loop\'s setup, condition, and update.') if parent=='for_statement' or (parent=='local_variable_declaration' and p.parent.type=='for_statement') else meaning('End this statement','Finish this instruction or declaration.')
   unclassified.append({'lesson':row['id'],'text':value,'node':n.type,'parent':parent});return meaning('Code','Unclassified source fragment.','gray')
  def visit(n):
   if n.type in ['string_literal','character_literal','line_comment','block_comment'] or not n.children:
    if n.end_byte==n.start_byte:return
    a=offset+len(raw[:n.start_byte].decode());b=offset+len(raw[:n.end_byte].decode());add(a,b,classify(n))
   else:
    for child in n.children:visit(child)
  visit(tree.root_node)
 parts.sort(key=lambda p:p[0]);assert all(a[1]<=b[0] for a,b in zip(parts,parts[1:])),row['id']
 annotated.append({'id':row['id'],'source':source,'parts':parts})
(root/'docs/java-wording-v1/anatomy-unclassified.json').write_text(json.dumps(unclassified,indent=2)+'\n')
assert not unclassified,unclassified
output='// Generated by tests/java-anatomy.py from reviewed, exact lesson sources.\n'
output+='export type JavaPart = [number, number, number];\n'
output+='export const javaMeanings: [string, string, string][] = '+json.dumps(meanings,separators=(',',':'))+';\n'
output+='export const reviewedJavaAnatomy: {id:string;source:string;parts:JavaPart[]}[] = '+json.dumps(annotated,separators=(',',':'))+';\n'
(root/'lib/java-reviewed-anatomy.ts').write_text(output,encoding='utf8')
print(f'PASS: {len(annotated)} examples, {sum(len(x["parts"]) for x in annotated)} ranges, {len(meanings)} meanings, zero unclassified parts.')
