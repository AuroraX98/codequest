"""Generate selectable labels for the exact source. Parser packages are authoring tools only."""
import json,re,sys,importlib
from pathlib import Path
r=Path(__file__).resolve().parents[1];c=sys.argv[1];sys.path.insert(0,str(Path(sys.argv[2]).resolve()))
from tree_sitter import Language,Parser
if c=='r' and len(sys.argv)>3:
 import ctypes
 dll=ctypes.CDLL(str(Path(sys.argv[3]).resolve()));dll.tree_sitter_r.restype=ctypes.c_void_p
 cap=ctypes.pythonapi.PyCapsule_New;cap.argtypes=[ctypes.c_void_p,ctypes.c_char_p,ctypes.c_void_p];cap.restype=ctypes.py_object
 grammar=cap(dll.tree_sitter_r(),b'tree_sitter.Language',None)
else:
 mod=importlib.import_module('tree_sitter_'+c);grammar=(mod.language_php if c=='php' else mod.language)()
parser=Parser(Language(grammar));docs=r/f'docs/{c}-wording-v1'
examples=json.loads((docs/'examples.json').read_text(encoding='utf8'))
focus=json.loads((docs/'focus.json').read_text(encoding='utf8'))
table={};rows=[];meanings=[]
def add(l,e,t='purple'):
 key=(l,e,t)
 if key not in table:table[key]=len(meanings);meanings.append(key)
 return table[key]
keywords=dict(fn='Define a function.',def_='Define a method.',function='Define a function.',let='Give a value a name.',mut='Allow this value to change.',pub='Make this item visible outside its module.',impl='Define behavior for a type.',struct='Define a type with fields.',enum='Define a type with named cases.',mod='Declare a module.',use='Bring a name into scope.',trait='Describe behavior a type can provide.',match='Choose the first case that matches.',loop='Repeat this block.',break_='Leave the loop.',return_='Give an answer back to the caller.',if_='Check a condition.',else_='Use this path when the earlier test fails.',while_='Repeat while the test is true.',for_='Repeat for each item.',in_='Choose the collection of items.',move='Take captured values into the closure.',async_='Describe work that can be run later.',true='The yes value.',false='The no value.',self='The current object or value.')
keywords.update({k.rstrip('_'):v for k,v in list(keywords.items()) if k.endswith('_')})
def detail(t,typ,parent,field):
 if t.startswith(('// File: ','# File: ')):
  n=t.split(': ',1)[1];return add('File: '+n,'Read the following lines as part of '+n+'.','blue')
 if 'comment' in typ:return add('Note','A note for the reader. It does not run.','gray')
 if 'string' in typ or typ in ('heredoc','nowdoc'):return add('Text' if '#{' not in t else 'Text with a value','Read the characters inside the quotes.' if '#{' not in t else 'Insert the value inside the braces into the text.','blue')
 if 'char_literal' in typ:return add('Character','One character value between single quotes.','blue')
 if 'lifetime' in typ:return add('Lifetime: '+t,'Name how long a borrow may be used.')
 if 'integer' in typ or 'float_literal' in typ or re.match(r'^\d',t):return add('Number: '+t,'Use this written number.','orange')
 if typ in ('attribute_item','inner_attribute_item'):return add('Rust attribute','Give Rust an instruction about the following item.')
 if t=='main' and c=='rust':return add('Start here','Rust starts this program by calling main.','green')
 if t=='println' and c=='rust':return add('Print a line','Show the formatted text, then move to a new line.','green')
 if t=='!' and ('macro' in parent or parent=='token_tree'):return add('Call a macro','Use the named macro with the following input.')
 if t in keywords and typ not in ('string','string_content','identifier','name'):return add(t,keywords[t])
 if t in ('(',')','[',']','{','}'):
  region={'(':'parentheses',')':'parentheses','[':'brackets',']':'brackets','{':'braces','}':'braces'}[t];begin=t in '([{'
  return add(('Open ' if begin else 'Close ')+region,('Start' if begin else 'End')+' the '+region+' around this part.','orange')
 ops={'::':'Follow a path to a name.', '=>':'Lead from a case or key to its value.', '->':'Point to the result type.' if c=='rust' else 'Reach a member of this object.', '<-':'Store the value on the right under the name on the left.', '=':'Connect the name or setting on the left to the value on the right.', '+=':'Add to the current value.', '==':'Check whether the two values are equal.', '===':'Compare the value and type.', '!=':'Check whether the values differ.', '&&':'Continue only if the left test is true.', '||':'Join alternatives or mark an empty closure input; read the surrounding expression.', '..':'Start a range that stops before its end.' if c=='rust' else 'Mark the range between these values.', '..=':'Build a range that includes the last value.', ',':'Separate neighboring items.', ';':'Separate or end this instruction.', '.':'Reach the next part of this value.' if c!='php' else 'Join pieces of text.', '?':'Return the error early if this Result failed.' if c=='rust' else 'Mark a choice or an optional value in this expression.', ':':'Separate the name or pattern from the type or value that follows.', '#':'Start an annotation.', '+':'Add or combine the values.', '%':'Take the remainder.', '/':'Divide the left value by the right.', '>=':'Check for greater than or equal.', '<=':'Check for less than or equal.', '!':'Reverse a true or false value.', '_':'Match or ignore a value without naming it.'}
 if c=='rust' and t in ('<','>') and any(v in parent for v in ('type','argument','generic','parameter')):return add('Type bracket','Mark the types used in this declaration or call.','orange')
 if c=='ruby' and t=='<' and parent=='superclass':return add('Inherit from a class','Use the class on the right as the parent of this class.')
 if t in ('<','>') and parent!='token_tree':return add('Less than' if t=='<' else 'Greater than','Compare the two values.')
 if t=='-':return add('Negative value' if 'unary' in parent or parent=='token_tree' else 'Subtract','Use the negative of the next number.' if 'unary' in parent or parent=='token_tree' else 'Subtract the right value from the left.')
 if c=='r':
  rparts={'*':('Multiply','Multiply the corresponding numeric values.'),'&':('Pairwise AND','Check both conditions together at each position.'),'&&':('Check two conditions','Check the right condition only if the left is true.'),'|>':('Pass to the next call','Pass the result on the left into the function on the right.'),'@':('Read a slot','Extract the named slot from this S4 object.'),'$':('Select a named part','Reach this named part of the object.'),':':('Make a sequence','Make a sequence between the two endpoints.'),'...':('Extra inputs','Collect or forward the extra arguments.'),'~':('Model formula','Describe what the model predicts and what it uses to predict it.'),'[[':('Extract one item','Take the selected item itself, rather than a smaller collection.'),']]':('End extraction','Finish choosing the single item to take.'),'NA':('Missing value','One value at this position is unknown.'),'NULL':('No value','Represent the absence of an object value here.'),'TRUE':('True','The yes answer.'),'FALSE':('False','The no answer.')}
  if t in rparts:return add(*rparts[t])
  if t=='=':return add('Name an input','Supply the value on the right for the named input on the left.')
 if c=='php':
  roles={'<?php':('Start PHP','Read the following instructions as PHP.'),'$':('Variable sign','The following name identifies a variable.'),'??':('Use a fallback','Keep the value on the left unless it is missing or null.'),'!==':('Not strictly equal','Check whether either the value or the type differs.'),'++':('Increase by one','Add one to this counter.'),'*':('Multiply','Multiply the two numbers.'),'\\':('Namespace separator','Follow the named group to the next name.'),'#[':('Start an attribute','Attach information to the declaration that follows.'),'|':('Combine flags','Turn on the options represented by each flag.'),'&':('Reference','Share access to the same variable.'),'->':('Object member','Reach the named property or method on this object.')}
  if t in roles:return add(*roles[t])
  if t=='...':return add(*{'variadic_parameter':('Collect inputs','Gather extra inputs into one array.'),'variadic_unpacking':('Spread inputs','Supply array entries as separate inputs.'),'variadic_placeholder':('Take a callable','Get this function as a value without calling it now.')}.get(parent,('Multiple inputs','Read the surrounding call to see which inputs are supplied.')))
 if c=='ruby':
  roles={'<<':('Append an item','Add the value on the right to the end of this array.'),'&.':('Call if present','Skip this method call if its receiver is nil.'),'|':('Block input boundary','Mark the names supplied to this block.'),'||':('Use an alternative','Keep the left value unless it is false or nil.'),'end':('End this block','Finish this method, class, or control block.'),'nil':('No value','Represent the absence of a value.'),'yield':('Run the block','Give the input to the block supplied by the caller.')}
  if t in roles:return add(*roles[t])
  if t in ('*','**'):
   if 'parameter' in parent:return add('Gather inputs','Collect extra named inputs in a hash.' if t=='**' else 'Collect extra positional inputs in an array.')
   if 'argument' in parent:return add('Spread inputs','Supply hash entries as named inputs.' if t=='**' else 'Supply array entries as individual inputs.')
   if parent=='rest_assignment':return add('Gather the middle','Collect the remaining items into an array.')
   return add('Multiply' if t=='*' else 'Raise to a power','Multiply the two values.' if t=='*' else 'Use the right value as the exponent.')
 if t=='&' and c=='rust':return add('Reference','Refer to a value without taking ownership.')
 if t=='*' and c=='rust':return add('Reach borrowed value' if parent=='unary_expression' else 'Multiply','Read or update the value behind the reference.' if parent=='unary_expression' else 'Multiply the numbers.')
 if t=='|' and c=='rust' and 'closure' in parent:return add('Closure input','Mark the input names for this closure.')
 if t in ops:return add(t,ops[t],'orange')
 if t.startswith(('//','# ')):return add('Note','A note in the source.','gray')
 if typ in ('primitive_type','type_identifier','type_name','predefined_type'):return add('Type: '+t,'Name the kind of value used here.','blue')
 if field=='function' or field=='method' or parent in ('function_call_expression','method_call_expression') and field=='name':return add('Call '+t,'Use this named function or method here.','green')
 if field=='name' and ('function' in parent or parent=='method'):return add('Define '+t,'Give this function or method its name.','green')
 if re.search(r'[\w$]',t):return add(t,('Use the name '+t+' here.') if re.match(r'^[\w$:@]+$',t) else 'Read this part of the expression.','green')
 return add('Mark: '+t,'This mark belongs to the '+parent.replace('_',' ')+'.','orange')
for ex in examples:
 src=ex['code'];raw=src.encode();selected=[];spans=[]
 def span(a,b,idx):spans.append((a,b,idx))
 def walk(n,off=0):
  a=n.start_byte+off;b=n.end_byte+off;t=raw[a:b].decode();typ=n.type;parent=n.parent.type if n.parent else ''
  if n.is_missing or a==b:return
  if n.child_count and typ not in ('string','string_literal','char_literal','attribute_item','inner_attribute_item','lifetime','interpreted_string_literal','comment','line_comment','block_comment','encapsed_string','string_value','heredoc','nowdoc'):
   for ch in n.children:walk(ch,off)
  else:
   fld=None
   if n.parent:
    for i,ch in enumerate(n.parent.children):
     if ch.id==n.id:fld=n.parent.field_name_for_child(i);break
   span(a,b,detail(t,typ,parent,fld))
 def parseblock(a,b,n):
  section=raw[a:b]
  if n.endswith('.toml') or n.endswith('.json'):
   for m in re.finditer(rb'[^\r\n]+',section):
    v=m[0].decode().strip()
    if v:span(a+m.start(),a+m.end(),add('Project setting',f'Read this setting from {n}.','blue'))
  else:walk(parser.parse(section).root_node,a)
 marks=list(re.finditer(rb'^(?://|#) File: ([^\n]+)\n',raw,re.M))
 if marks:
  for i,m in enumerate(marks):
   n=m[1].decode();span(m.start(),m.end()-1,detail(m[0].decode().strip(),'file','',''));parseblock(m.end(),marks[i+1].start() if i+1<len(marks) else len(raw),n)
 else:parseblock(0,len(raw),'')
 # Keep the main teaching phrase together even when it contains several tokens.
 needle,label,meaning=focus[ex['id']];q=needle.encode();start=raw.find(q);assert start>=0,(ex['id'],needle);end=start+len(q)
 spans2=[]
 for a,b,idx in sorted(spans):
  if a<start:spans2.append((a,min(start,b),idx))
  if b>end:spans2.append((max(a,end),b,idx))
 spans2.append((start,end,add(label,meaning,'purple')))
 def utf16(b):return len(raw[:b].decode().encode('utf-16-le'))//2
 cursor=0
 for a,b,idx in sorted(spans2):
  assert a>=cursor and not raw[cursor:a].strip(),(ex['id'],raw[cursor:a],a,b)
  if raw[a:b].strip():selected.append([utf16(a),utf16(b),idx])
  cursor=b
 assert not raw[cursor:].strip(),ex['id']
 rows.append({'source':src,'parts':selected})
name={'rust':'Rust','php':'PHP','ruby':'Ruby','r':'R'}[c]
out='// Exact reviewed code only. Generated by tests/reviewed-parts.py.\n'
out+=f'export const {c}Meanings: [string,string,string][] = '+json.dumps(meanings,ensure_ascii=False)+';\n'
out+=f'export const reviewed{name}Anatomy: {{source:string;parts:[number,number,number][]}}[] = '+json.dumps(rows,ensure_ascii=False)+';\n'
(r/f'lib/{c}-reviewed-anatomy.ts').write_text(out,encoding='utf8')
print(len(rows),'examples;',sum(len(x['parts']) for x in rows),'labeled parts')
