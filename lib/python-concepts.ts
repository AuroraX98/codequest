/** Small, explicit teaching models. These are not a general Python interpreter. */
export type ConceptId = 'program' | 'values' | 'strings' | 'names' | 'assignment' | 'output';

// Reviewed in lesson order. Each idea has one example; labels describe this exact code.
type FirstLessonPart = [text: string, label: string, meaning: string];
function firstLessonExample(lines: FirstLessonPart[][]) {
  let code = '';
  const parts: {from: number; text: string; label: string; meaning: string}[] = [];
  lines.forEach((line, index) => {
    if (index) code += '\n';
    for (const [text, label, meaning] of line) {
      if (label) parts.push({from: code.length, text, label, meaning});
      code += text;
    }
  });
  return {code, language: 'python', parts};
}
const showPart: FirstLessonPart = ['print', 'Show', 'print is a ready-made Python instruction that shows a value on the screen.'];
const openPart: FirstLessonPart = ['(', 'Start', 'The value to show goes after this opening round bracket.'];
const closePart: FirstLessonPart = [')', 'End', 'This closing round bracket ends the print instruction.'];
const gap: FirstLessonPart = [' ', '', ''];
const ageName: FirstLessonPart = ['pet_age', 'Name', 'This name will refer to the value on the right of =.'];
const assignPart: FirstLessonPart = ['=', 'Give a value', 'Work out the value on the right, then give the name on the left that value.'];
const fivePart: FirstLessonPart = ['5', 'Number', '5 is a whole number. There are no quotes around it.'];
export const reviewedPythonFirstLesson: Record<ConceptId, {title: string; text: string; result: string; example: ReturnType<typeof firstLessonExample>}> = {
  program: {
    title: 'A program',
    text: 'A program is a list of instructions the computer follows. This one uses `print` to show the word Hello on the screen.',
    result: 'Hello',
    example: firstLessonExample([[showPart, openPart, ['"Hello"', 'Text', 'Hello is the text to show. The quotes mark its edges; they will not appear on the screen.'], closePart]]),
  },
  values: {
    title: 'A value',
    text: 'A value is one piece of information your program uses. Here, the value is the number `5`.',
    result: '5',
    example: firstLessonExample([[showPart, openPart, fivePart, closePart]]),
  },
  strings: {
    title: 'Text is a string',
    text: 'Python calls text a string. Put matching quotes around the text so Python knows where it starts and ends.',
    result: 'Pepper',
    example: firstLessonExample([[showPart, openPart, ['"Pepper"', 'Text', 'Pepper is a string: a text value. The outside quotes are part of the code, not part of the displayed name.'], closePart]]),
  },
  names: {
    title: 'Give a value a name',
    text: 'A variable is a name that refers to a value. Here, `pet_name` refers to the text Pepper. Later, `print(pet_name)` uses that name to find the text.',
    result: 'Pepper',
    example: firstLessonExample([
      [['pet_name', 'Name', 'pet_name is the name we give this text value. The underscore joins the two words.'], gap, assignPart, gap, ['"Pepper"', 'Text', 'This is the text value that pet_name will refer to.']],
      [showPart, openPart, ['pet_name', 'Read the name', 'Python looks up pet_name and finds Pepper. No quotes are used because we want its value.'], closePart],
    ]),
  },
  assignment: {
    title: 'Change a named value',
    text: 'Assignment means giving a name a value. A later assignment can give the same name a new value. Here, Python adds `1` to the old age, then makes `pet_age` refer to `6`.',
    result: '6',
    example: firstLessonExample([
      [ageName, gap, assignPart, gap, fivePart],
      [ageName, gap, assignPart, gap, ['pet_age', 'Old age', 'This reads the current age, 5, before the assignment changes it.'], gap, ['+', 'Add', 'Add the number on the right to the old age.'], gap, ['1', 'One more', 'Add 1 to 5. The new value is 6.']],
      [showPart, openPart, ['pet_age', 'New age', 'The second line gave this name the value 6. That is the number print will show.'], closePart],
    ]),
  },
  output: {
    title: 'Show two values',
    text: 'Output is what a program shows you. `print` can show more than one value. Separate the values with a comma; Python puts a space between them on the screen.',
    result: 'Pepper 5',
    example: firstLessonExample([[showPart, openPart, ['"Pepper"', 'First value', 'Show the text Pepper first. Leave out the outside quotes.'], [',', 'Next value', 'The comma separates the two values in the code. It is not printed.'], gap, ['5', 'Second value', 'Show 5 after Pepper, with a space between them.'], closePart]]),
  },
};
export const pythonConcepts: {id: ConceptId; title: string; short: string; why: string; imagine: string; limit: string; explore: {title: string; text: string; example: string}[]}[] = [
  {id:'program',title:'A program',short:'Instructions that Python follows.',why:'A program turns a task you can describe into precise steps the computer can repeat.',imagine:'Picture a recipe with a moving bookmark. Python follows these statements in order; each one has a particular job.',limit:'This straight-line example runs top to bottom. Later, decisions, loops and function calls will change the route.',explore:[{title:'What counts as a step?',text:'One statement can calculate, bind a name, call an action, or make a decision. A comment is for the human reader.',example:'# A note for you\npet_age = 5'},{title:'What if the order changes?',text:'A name must be bound before this program tries to read it. Printing an unknown name raises NameError.',example:'print(pet_name)  # no earlier assignment: NameError'},{title:'Build something useful',text:'Small programs can format labels, clean text, calculate costs and organize information. Combine small understood steps.',example:'pet_age = 5\nprint(pet_age + 1)'}]},
  {id:'values',title:'Values',short:'The information your program works with.',why:'Choosing the right kind of value determines which operations make sense.',imagine:'Picture an information card with two parts: its value and its type. The text "5" and the number 5 can look similar but behave differently.',limit:'The cards here are a teaching view, not a drawing of exact memory addresses or sizes.',explore:[{title:'Text versus numbers',text:'An int is a whole number. A str is text. Addition sums two ints but joins two strings.',example:'5 + 1       # 6\n"5" + "1"   # "51"'},{title:'Other kinds of information',text:'A float represents a floating-point number. A bool answers yes or no. Collections group values; meet those later.',example:'temperature = 21.5\nis_ready = True'},{title:'Inspect or convert',text:'type shows a value’s type. int can convert suitable digit text; unsuitable text raises ValueError.',example:'print(type("5"))  # <class \'str\'>\nprint(int("5") + 1)  # 6'}]},
  {id:'strings',title:'Strings & numbers',short:'Text is a sequence of characters; a number can be calculated with.',why:'Use a string for names, messages and codes, even when some characters are digits. Use numbers when you mean a quantity.',imagine:'Picture Pepper written on a strip of paper. Quotes mark the edges in your source code. They are not printed as part of Pepper.',limit:'Python strings are immutable: methods do not edit the original text in place. The visual strip is not a literal memory layout.',explore:[{title:'Find a piece',text:'Positions start at zero. A slice takes a range up to, but not including, its end. Empty strings have length zero.',example:'"Pepper"[0]   # "P"\n"Pepper"[1:4] # "epp"\nlen("")       # 0'},{title:'Clean and reshape',text:'Methods return text for you to use. A dot selects a method; parentheses call it. Keep the result if you need it again.',example:'" Pepper ".strip()  # "Pepper"\n"Pepper".upper()    # "PEPPER"\n"Pepper".replace("P", "p")'},{title:'Search, combine and split',text:'Use in to test membership, + to join strings, and split/join to move between text and a list of pieces.',example:'"ep" in "Pepper"  # True\n"Hi, " + "Pepper"\n"red blue".split()\n" ".join(["red", "blue"])'},{title:'Format and escape',text:'An f-string evaluates expressions in braces. A backslash can introduce an escape such as a newline. More formatting and Unicode can wait until needed.',example:'f"Age next year: {5 + 1}"\n"first line\\nsecond line"'}]},
  {id:'names',title:'Names',short:'A name lets you refer to a value again.',why:'Names make a program readable and let later steps reuse the current value without repeating it.',imagine:'Picture a name tag with a pointer to an object. pet_name points to the string "Pepper". The tag is not the text itself.',limit:'Two names can refer to the same object. Rebinding one name does not automatically rebind another, and strings themselves do not mutate.',explore:[{title:'Name or literal?',text:'Without quotes, Python looks up the name. With quotes, those characters are the text value.',example:'pet_name = "Pepper"\nprint(pet_name)    # Pepper\nprint("pet_name") # pet_name'},{title:'Two names, one object',text:'The second assignment binds another name to the same string. Rebinding pet_name later leaves original_name referring to Pepper.',example:'pet_name = "Pepper"\noriginal_name = pet_name\npet_name = "Clover"\nprint(original_name)  # Pepper'},{title:'Choose a readable name',text:'Use descriptive names. Underscores can join words; names are case-sensitive and cannot start with a digit.',example:'pet_age = 5\n# pet_age and Pet_age are different names'}]},
  {id:'assignment',title:'Assignment',short:'Evaluate the right-hand side, then bind the name on the left.',why:'Assignment gives later instructions a way to find the result of this instruction.',imagine:'Picture a two-part action: work out the value first, then connect the name tag to it. The single = is not an equality question.',limit:'This picture explains simple name assignment. Attributes, collections and unpacking have additional rules you can learn later.',explore:[{title:'Use the old value to get a new one',text:'Python reads the right side using the current binding before the left side changes.',example:'pet_age = 5\npet_age = pet_age + 1  # now 6'},{title:'Assign versus compare',text:'One equals sign assigns. Two equals signs compare values and produce True or False.',example:'pet_age = 5\nprint(pet_age == 5)  # True'},{title:'New string, not edited string',text:'upper returns uppercase text. Binding pet_name to the result does not modify the original string.',example:'pet_name = "Pepper"\noriginal_name = pet_name\npet_name = pet_name.upper()\nprint(original_name)  # Pepper'}]},
  {id:'output',title:'Output',short:'Display a result so a person can read it.',why:'A value can exist without appearing on screen. print asks Python to display the value you pass to it. print is the function name; parentheses call it and the comma separates its inputs. print("Pepper", 5) displays Pepper 5 with a space and then a new line. The call returns None, not the displayed text.',imagine:'Picture a message appearing on a separate display. The names and values remain in your program; the display is not where they are stored.',limit:'print normally ends with a newline and returns None. Displaying a value is different from returning it from your own function.',explore:[{title:'What do the parentheses do?',text:'print is a built-in function. Parentheses call it; what you put inside supplies arguments.',example:'print("Pepper", 5)  # Pepper 5'},{title:'What does the f do?',text:'The f prefix makes a formatted string. Braces hold expressions to evaluate. Without f, those braces are ordinary text.',example:'pet_age = 5\nprint(f"Age: {pet_age}") # Age: 5\nprint("Age: {pet_age}") # Age: {pet_age}'},{title:'Output is not a live view',text:'Changing a name does not rewrite output already displayed. Call print again to show the new value.',example:'pet_age = 5\nprint(pet_age)\npet_age = 6\nprint(pet_age)  # a new output line'}]},
];
export type ExperimentId = 'greeting' | 'rebind' | 'types';
export type CodePiece = {text:string;concept?:ConceptId;label?:string;meaning?:string};
export type ObjectCard = {id:string;type:'str'|'int';value:string};
export type TraceStep = {note:string;bindings:{name:string;object:string}[];objects:ObjectCard[];output:string[]};
export type PythonExperiment = {code:string;lines:CodePiece[][];steps:TraceStep[];expected:string[];prediction:string;options:string[];answer:number;explanation:string};
const p=(text:string,concept?:ConceptId,meaning?:string):CodePiece=>({text,concept,meaning});
const name=(n:string)=>p(n,'names',`${n} is a name. Here Python ${n==='original_name'?'keeps a second reference to the original string.':'binds it on the left of =, or reads its value when it appears in an expression.'}`);
const eq=()=>p(' = ','assignment','Evaluate the expression on the right, then bind the name on the left to that result.');
const literal=(text:string)=>[p('"','strings','This quote starts the string literal; it is not part of the resulting text.'),p(JSON.stringify(text).slice(1,-1),'strings','These characters form the text value. Backslash escapes, if present, represent characters in the value.'),p('"','strings','This matching quote ends the string literal.')];
const print=(pieces:CodePiece[])=>[p('print','output','A built-in function that writes a readable representation of its arguments to output.'),p('(','output','Open the function call. The expression inside supplies an argument.'),...pieces,p(')','output','Close the function call.')];
export function makePythonExperiment(id:ExperimentId, inputName:string, inputAge:number):PythonExperiment {
 // Keep complete Unicode characters and replace malformed surrogate input so the
 // downloaded Python file is printable UTF-8, even at the length boundary. NUL
 // also becomes visible replacement text because Pyodide's output drops it.
 const pet=Array.from(inputName).slice(0,40).map(character=>/^[\u0000\uD800-\uDFFF]$/.test(character)?'\uFFFD':character).join(''), age=Math.min(99,Math.max(0,Math.trunc(Number.isFinite(inputAge)?inputAge:5)));
 const objects:ObjectCard[]=[{id:'text1',type:'str',value:pet},{id:'age1',type:'int',value:String(age)}];
 const steps:TraceStep[]=[{note:'Ready. No line has run yet. Nothing is bound and nothing has been printed.',bindings:[],objects:[],output:[]}];
 let lines:CodePiece[][]=[],expected:string[]=[],prediction='',options:string[]=[],answer=0,explanation='';
 if(id==='types'){
  lines=[[name('pet_age'),eq(),...literal(String(age))],print([name('pet_age'),p(' + ','strings','With two strings, + joins their text rather than doing arithmetic.'),...literal('1')])];
  expected=[String(age)+'1'];prediction='The age is in quotes. What will the second line print?';options=[String(age+1),expected[0],'A type error'];answer=1;explanation='Both operands are strings, so + joins their characters. Remove both pairs of quotes to add two numbers instead.';
  steps.push({note:'The quotes make this a string, even though its characters are digits.',bindings:[{name:'pet_age',object:'text1'}],objects:[{id:'text1',type:'str',value:String(age)}],output:[]});
  steps.push({...steps[1],note:'Joining two strings produces new text, which print displays. The name still refers to the original digit text.',output:expected});
 }else if(id==='rebind'){
  lines=[[name('pet_name'),eq(),...literal(pet)],[name('original_name'),eq(),name('pet_name')],[name('pet_name'),eq(),name('pet_name'),p('.','strings','The dot looks up an attribute, here the upper method, on the string.'),p('upper','strings','This method returns an uppercase string; it does not change the original string.'),p('()','strings','Call upper with no extra arguments.')],print([name('original_name')]),print([name('pet_name')])];
  expected=[pet,pet.toUpperCase()];prediction='After pet_name is rebound, what does original_name print?';options=[`The text ${JSON.stringify(pet)}`,pet===pet.toUpperCase()?`The text ${JSON.stringify(pet+'!')}`:`The text ${JSON.stringify(pet.toUpperCase())}`, 'A NameError: the name disappears'];answer=0;explanation='original_name keeps its reference to the original string. Rebinding pet_name does not change that other name or mutate the original text.';
  const old={id:'text1',type:'str' as const,value:pet},neo={id:'text2',type:'str' as const,value:pet.toUpperCase()};
  steps.push({note:'pet_name now refers to the original string.',bindings:[{name:'pet_name',object:'text1'}],objects:[old],output:[]});
  steps.push({note:'A second name refers to the same string. No text was copied by this assignment.',bindings:[{name:'pet_name',object:'text1'},{name:'original_name',object:'text1'}],objects:[old],output:[]});
  steps.push({note:'upper returns uppercase text. pet_name is rebound to that result; original_name still refers to the old text. These cards distinguish roles, not actual memory addresses.',bindings:[{name:'pet_name',object:'text2'},{name:'original_name',object:'text1'}],objects:[old,neo],output:[]});
  steps.push({...steps[3],note:'print reads original_name and displays its unchanged text.',output:[pet]});steps.push({...steps[3],note:'print reads pet_name and displays the uppercase result on a new line.',output:expected});
 }else{
  lines=[[name('pet_name'),eq(),...literal(pet)],[name('pet_age'),eq(),p(String(age),'values','An unquoted whole-number literal creates an int value.')],print([p('f','output','The f prefix makes a formatted string. Expressions inside braces supply values.'),p('"','strings','The start of the formatted string.'),p('{','output','Start an expression to evaluate and insert into the text.'),name('pet_name'),p('}','output','End this inserted expression.'),p(' is ','strings','Literal text, including its spaces, stays as written.'),p('{','output','Start another expression to insert.'),name('pet_age'),p('}','output','End this inserted expression.'),p(' years old.','strings','The rest of the literal sentence, including punctuation.'),p('"','strings','The end of the formatted string.')])];
  expected=[`${pet} is ${age} years old.`];prediction='After the first two assignments, what has appeared in output?';options=['Nothing yet.',`The number ${age}`,`The text ${JSON.stringify(pet)}`];answer=0;explanation='Assignment binds names but does not print. The third line builds a string and passes it to print.';
  steps.push({note:'Bind pet_name to the string. Quotes are source-code boundaries, not displayed characters.',bindings:[{name:'pet_name',object:'text1'}],objects:[objects[0]],output:[]});
  steps.push({note:'Bind pet_age to an integer. The earlier name still refers to the string.',bindings:[{name:'pet_name',object:'text1'},{name:'pet_age',object:'age1'}],objects,output:[]});
  steps.push({...steps[2],note:'Build the f-string from current values, then call print. pet_age remains an integer; formatting did not convert its stored value.',output:expected});
 }
 // The Python runner reports one entry per output line, including blank lines.
 // A literal newline in an input value must have the same shape in this model.
 expected=expected.flatMap(text=>text.split('\n'));
 return {code:lines.map(l=>l.map(t=>t.text).join('')).join('\n')+'\n',lines,steps:steps.map(state=>({...state,output:state.output.flatMap(text=>text.split('\n'))})),expected,prediction,options,answer,explanation};
}
