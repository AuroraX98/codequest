/** Hand-written learning help. No network, model calls, or changes to lesson source. */
export type GlossaryTerm = { id: string; name: string; aliases: string[]; meaning: string; example: string; runtimes?: string[] };
const term = (id: string, name: string, aliases: string[], meaning: string, example: string, runtimes?: string[]): GlossaryTerm => ({ id, name, aliases: [name, ...aliases], meaning, example, runtimes });
export const lessonGlossary: GlossaryTerm[] = [
  term('program', 'program', ['programs'], 'A set of instructions for a computer to follow.', 'A program can add two prices and show the total.'),
  term('code', 'code', ['source code'], 'Instructions written in a programming language.', 'print("Hello") is one line of Python code.'),
  term('value', 'value', ['values'], 'One piece of information that code can use.', '5 is a number value. "Hello" is a text value.'),
  term('variable', 'variable', ['variables'], 'A name that lets your code use a value.', 'After score = 5, the name score refers to 5.'),
  term('string', 'string', ['strings'], 'Text stored as a value. Quotes mark where the text starts and ends.', '"Hello" is a string. 5 is a number, but "5" is text.'),
  term('integer', 'integer', ['integers', 'Int'], 'A number with no fractional part. It can be negative, zero, or positive.', '3, 0, and -2 are integers. 3.5 is not.'),
  term('float', 'floating-point number', ['floating-point numbers', 'float', 'floats', 'Double'], 'A number type that can hold a fractional part. Some values are only approximate.', 'A price like 2.5 can be stored as a floating-point number.'),
  term('boolean', 'Boolean', ['Booleans', 'Boolean values', 'bool'], 'A value with just two choices: true or false.', 'In Python, 5 > 3 gives True.'),
  term('function', 'function', ['functions'], 'Reusable instructions that do a task. You can give them values to use and get a result back. A function can have a name.', 'print("Hello") uses the print function to show Hello.'),
  term('call', 'function call', ['function calls', 'calling a function'], 'An instruction that asks a function to run.', 'In print("Hello"), the parentheses make this a call.'),
  term('parameter', 'parameter', ['parameters'], 'A name in a function definition that stands for an input.', 'In def greet(name):, name is a parameter.'),
  term('argument', 'argument', ['arguments'], 'A value you give a function when you call it.', 'In greet("Mina"), "Mina" is the argument.'),
  term('return-value', 'return value', ['returned value', 'returned values'], 'The result a function gives back to the code that called it.', 'A function that adds 2 and 3 can return 5. Returning is not the same as printing.'),
  term('method', 'method', ['methods'], 'A function that belongs to an object or type.', 'In name.upper(), upper is a method that makes uppercase text.'),
  term('expression', 'expression', ['expressions'], 'Code that produces a value.', '2 + 3 is an expression. Its value is 5.'),
  term('statement', 'statement', ['statements'], 'An instruction that tells the program to do something.', 'In Python, score = 5 is an assignment statement.'),
  term('assignment', 'assignment', ['assigns', 'assigning', 'reassignment', 'reassign'], 'Giving a value to a name or another place that stores it.', 'score = 5 assigns 5 to score. It does not ask if they are equal.'),
  term('operator', 'operator', ['operators'], 'A symbol or word that performs an action on values.', '+ adds numbers. > compares them.'),
  term('comparison', 'comparison', ['comparisons', 'compares'], 'A check of how values relate, such as whether they are equal.', '5 > 3 compares two numbers and gives true.'),
  term('condition', 'condition', ['conditions', 'conditional'], 'A check used to decide what happens next.', 'if score > 10 runs its code only when the score is above 10.'),
  term('branch', 'branch', ['branches', 'branching'], 'One path a program can take after a decision.', 'An if branch handles a true condition. An else branch handles the other case.'),
  term('loop', 'loop', ['loops', 'for-loop', 'while-loop'], 'Code that repeats instructions.', 'A loop can print each name in a list.'),
  term('iteration', 'iteration', ['iterations', 'iterate', 'iterating'], 'One pass through a loop, or the act of going through items.', 'Printing three list items takes three loop iterations.'),
  term('list', 'list', ['lists'], 'An ordered collection of items.', '["book", "pen"] is a Python list with two items.'),
  term('array', 'array', ['arrays'], 'An ordered collection whose items can be reached by position.', '[10, 20, 30] is a JavaScript array. Position 0 holds 10.'),
  term('index', 'index', ['indexes', 'indices'], 'A position used to find an item in an ordered collection. Many languages start at 0.', 'In ["red", "blue"], index 0 selects "red".', ['python', 'javascript', 'typescript', 'react', 'swift']),
  term('sql-index', 'index', ['indexes', 'indices'], 'An extra database structure that can help find rows faster. It takes space and must be updated when data changes.', 'An index on genre can speed up a search for books in one genre.', ['sql']),
  term('dictionary', 'dictionary', ['dictionaries'], 'A collection that connects keys to values.', 'In {"name": "Mina"}, the key "name" leads to the value "Mina".'),
  term('key', 'key', ['keys'], 'A label used to find a value in a collection.', 'In {"score": 5}, "score" is the key and 5 is its value.'),
  term('tuple', 'tuple', ['tuples'], 'An ordered group of values. In Python, its items cannot be replaced after it is made.', '(3, 4) is a Python tuple that could store a point.'),
  term('python-set', 'set', ['sets'], 'A Python collection with no duplicate items. It does not provide numbered positions.', '{1, 1, 2} creates a set containing 1 and 2.', ['python']),
  term('object', 'object', ['objects'], 'A value that can have its own data and actions.', 'A player object might have a name, a score, and a method to add points.'),
  term('property', 'property', ['properties', 'fields', 'field'], 'A named piece of data or a setting that belongs to something.', 'In player.score, score is a property of player. In CSS, color is a style property.'),
  term('class', 'class', ['classes'], 'A definition used to create objects with shared kinds of data and behavior.', 'A Player class can create separate players, each with a score.', ['python', 'javascript', 'typescript', 'swift']),
  term('instance', 'instance', ['instances'], 'One object created from a class or type.', 'Two Player objects are two separate instances of Player.'),
  term('mutable', 'mutable', ['mutation', 'mutate', 'mutating'], 'Able to be changed after it is made.', 'A Python list is mutable: you can add another item to it.'),
  term('immutable', 'immutable', ['immutability'], 'Not changeable after it is made. You can make a new value instead.', 'Python strings are immutable. Changing text creates a new string.'),
  term('scope', 'scope', ['scopes'], 'The part of a program where a name can be used.', 'A local name made inside a function is normally used inside that function.'),
  term('closure', 'closure', ['closures'], 'A function that keeps access to names from the place where it was created.', 'A counter function can remember its count between calls.'),
  term('recursion', 'recursion', ['recursive'], 'Solving a task by having a function call itself on smaller parts.', 'A folder search can search each folder inside the current folder.'),
  term('base-case', 'base case', ['base cases'], 'The stopping case in a recursive function.', 'A countdown can stop calling itself when the number reaches 0.'),
  term('iterator', 'iterator', ['iterators'], 'Something that gives you items one at a time and remembers its place.', 'Calling next() on a Python iterator asks for its next item.'),
  term('iterable', 'iterable', ['iterables'], 'Something you can go through item by item.', 'A Python list is iterable, so a for loop can visit its items.'),
  term('generator', 'generator', ['generators'], 'Code that produces items one at a time instead of preparing them all at once.', 'A Python function with yield can produce the next number when asked.'),
  term('syntax', 'syntax', ['syntax error'], 'The writing rules of a programming language.', 'Python needs a colon after an if condition. Leaving it out can cause a syntax error.'),
  term('indentation', 'indentation', ['indenting', 'indented', 'indent'], 'Spaces at the start of a line. In Python, they show which lines belong together.', 'The indented lines after if run as part of that if block.'),
  term('parentheses', 'parentheses', ['parenthesis'], 'The curved marks ( and ). They group things or surround function inputs.', 'In print("Hello"), the text goes inside the parentheses.'),
  term('comment', 'comment', ['comments'], 'A note in code for people to read. The program does not run it as an instruction.', '# Remember the total is a Python comment.'),
  term('output', 'output', ['outputs'], 'Information a program produces or shows.', 'print("Hello") produces the output Hello.'),
  term('input', 'input', ['inputs'], 'Information given to a program or function.', 'The numbers 2 and 3 are inputs to a function that adds them.'),
  term('bug', 'bug', ['bugs', 'debugging', 'debug'], 'A mistake that makes a program behave differently from what you intended.', 'Using subtraction when you meant addition is a bug.'),
  term('exception', 'exception', ['exceptions'], 'A signal that something went wrong while code was running. Code may be able to handle it.', 'Trying to open a missing file can raise an exception.'),
  term('validation', 'validation', ['validate', 'validating'], 'Checking that input follows the rules your program needs.', 'Before saving a score, check that it is a whole number from 0 to 100.'),
  term('algorithm', 'algorithm', ['algorithms'], 'A clear set of steps for solving a problem.', 'To find the largest number, compare each number with the largest seen so far.'),
  term('callback', 'callback', ['callbacks'], 'A function passed to other code so that code can call it when needed.', 'A button can call your callback when someone clicks it.'),
  term('async', 'asynchronous', ['async'], 'Work that can finish later, letting other work happen while you wait.', 'Loading a web page can happen while the app still responds to clicks.'),
  term('await', 'await', [], 'Wait for an asynchronous result inside the current async function.', 'data = await fetchData() waits here for the data. It does not freeze all other work.'),
  term('promise', 'Promise', ['promises'], 'A JavaScript object for a result that may arrive later or fail.', 'A request for data can return a Promise before the data arrives.'),
  term('state', 'state', [], 'The information an app currently remembers.', 'A counter that shows 3 has a current count state of 3.'),
  term('event', 'event', ['events'], 'Something that happens, such as a click, that code can respond to.', 'An input event tells your app that a field changed.'),
  term('handler', 'handler', ['handlers', 'event handler'], 'A function that responds to an event or request.', 'A click handler can add one to a counter.'),
  term('type', 'type', ['types', 'data type'], 'A category of value that tells code what operations make sense.', 'A number can be added. A string is text.'),
  term('go-interface', 'interface', ['interfaces'], 'A list of methods a Go value must provide to fit this interface.', 'A Reader can require a Read method. A type with that method fits automatically.', ['go']),
  term('interface', 'interface', ['interfaces'], 'In TypeScript, a description of the properties an object should have.', 'A Player interface can require a text name and a numeric score.', ['typescript', 'javascript', 'react']),
  term('union', 'union type', ['union', 'unions'], 'A type that allows more than one choice.', 'string | number allows either text or a number.', ['typescript', 'react']),
  term('type-guard', 'type guard', ['type guards'], 'A check that helps TypeScript narrow down what type a value has.', 'typeof value === "string" checks whether value is text.', ['typescript', 'react']),
  term('generic', 'generic', ['generics'], 'Code with a placeholder for a type so it can work with different types safely.', 'Collection<T> can become Collection<number> or Collection<string>.'),
  term('destructure', 'destructure', ['destructuring'], 'Take named parts out of an object or array into separate names.', 'const { score } = player reads player.score into the name score.'),
  term('template-literal', 'template literal', ['template literals', 'f-string', 'f-strings', 'text template'], 'Text with spaces for values that code fills in.', 'In Python, f"Hi {name}" puts the value of name into the message.'),
  term('protocol', 'protocol', ['protocols'], 'In Swift, a list of requirements a type promises to provide.', 'A Transport protocol might require a description property.', ['swift']),
  term('actor', 'actor', ['actors'], 'In Swift, a type that helps protect its changing data when several tasks use it.', 'A store actor can keep two tasks from changing its data at the same time.', ['swift']),
  term('optional', 'optional', ['optionals'], 'A Swift value that may contain a value or may contain nothing, written nil.', 'String? can hold "Hello" or nil.', ['swift']),
  term('component', 'component', ['components'], 'A reusable piece of a user interface.', 'A Profile component can show a name and picture.'),
  term('prop', 'prop', ['props'], 'An input passed to a React component.', 'In <Profile name="Mina" />, name is a prop.'),
  term('render', 'render', ['renders', 'rendering'], 'Create the description or display of what the user should see.', 'A React component renders a heading from the current name.'),
  term('html-element', 'element', ['elements', 'HTML element'], 'A piece of a web page, often written with a start tag, content, and an end tag.', '<p>Hello</p> is a paragraph element.', ['html', 'css', 'react']),
  term('attribute', 'attribute', ['attributes'], 'A named setting on an HTML element, or a named member of an object in languages such as Python.', 'In <img src="photo.jpg">, src is an HTML attribute.'),
  term('selector', 'selector', ['selectors'], 'A CSS pattern that chooses which elements to style.', '.card chooses elements with the class card.'),
  term('css-class', 'class', ['classes'], 'An HTML label used to group elements, often so CSS can style them.', 'class="card" lets the CSS selector .card choose that element.', ['html', 'css', 'react']),
  term('accessibility', 'accessibility', ['accessible'], 'Making an app usable by people with different needs and ways of using a computer.', 'A button should work with a keyboard as well as a mouse.'),
  term('api', 'API', ['APIs'], 'An agreed way for one piece of software to ask another for data or actions.', 'A weather app can ask a weather API for a forecast.'),
  term('api-key', 'API key', ['API keys'], 'A secret value that identifies or authorizes an app when it uses a service.', 'Keep an API key out of shared source code and public web pages.'),
  term('json', 'JSON', [], 'A text format for storing or sending structured data.', '{"name":"Mina","score":5} is JSON.'),
  term('csv', 'CSV', [], 'A text format for rows of data, often with commas between fields.', 'name,score is a header row. A later row might be Mina,5.'),
  term('parse', 'parse', ['parsing', 'parsed'], 'Read text using rules so code can work with its structure.', 'json.loads turns JSON text into Python values.'),
  term('database', 'database', ['databases'], 'An organized place for storing and finding data.', 'A book database can store a title and author for each book.'),
  term('sql', 'SQL', [], 'A language used to work with data in relational databases.', 'SELECT title FROM books asks for book titles.'),
  term('query', 'query', ['queries'], 'A request to find or work with data.', 'A query can ask for all books by one author.'),
  term('row', 'row', ['rows'], 'One record in a table.', 'One row in a books table can describe one book.'),
  term('column', 'column', ['columns'], 'One named kind of information in a table.', 'A title column holds the title for each book.'),
  term('join', 'join', ['joins', 'left join'], 'A database operation that combines matching information from tables.', 'Join orders to customers to show who placed each order.', ['sql']),
  term('null', 'NULL', [], 'A marker for a missing or unknown database value.', 'NULL minutes means the minutes are unknown, not zero.', ['sql']),
  term('transaction', 'transaction', ['transactions'], 'A group of database changes handled as one unit: all succeed, or they can be undone together.', 'Moving 3 items between two counts should update both counts or neither.'),
  term('cte', 'CTE', ['CTEs', 'common table expression'], 'A named query result used inside one larger SQL statement.', 'WITH totals AS (...) lets the following query use totals.'),
  term('middleware', 'middleware', [], 'Code that runs as a request passes through a server, before it reaches its final handler.', 'Sign-in middleware can check who is making a request.'),
  term('request', 'request', ['requests'], 'A message asking another program or server to do something.', 'GET /entries asks a server for saved entries.'),
  term('response', 'response', ['responses'], 'The reply to a request.', 'A server response can contain data and a status such as 200.'),
  term('authentication', 'authentication', ['authenticate'], 'Checking who someone is.', 'Signing in helps an app check your identity.'),
  term('authorization', 'authorization', ['authorize', 'permission check'], 'Checking what someone is allowed to do.', 'Being signed in does not mean you may edit another person’s notes.'),
  term('terminal', 'terminal', ['terminals', 'command line'], 'A place to type commands for your computer.', 'Type node main.js in a terminal to run a JavaScript file with Node.js.'),
  term('dependency', 'dependency', ['dependencies'], 'Other code a project needs to work.', 'A project can depend on a library for reading CSV files.'),
  term('git', 'Git', [], 'A tool that records versions of your files so you can review and recover changes.', 'A Git commit records a saved checkpoint of changes.'),
  term('commit', 'commit', ['commits'], 'In Git, a recorded checkpoint of changes with a message explaining them.', 'A commit named "Fix total" can record the corrected calculation.'),
  term('constructor', 'constructor', ['constructors'], 'Code that prepares a new object when it is created.', 'In Python, __init__ sets up an object’s starting data.'),
  term('comprehension', 'list comprehension', ['comprehension', 'comprehensions'], 'A short way to build a new Python list by going through other items.', '[n * 2 for n in [1, 2]] makes [2, 4].', ['python']),
  term('modulo', 'modulo', ['remainder'], 'The amount left after whole-number division.', '7 % 3 gives 1 because 7 is two groups of 3 with 1 left.'),
  term('module', 'module', ['modules'], 'A file or unit of code that can share its functions and values with other code.', 'A Python file named helpers.py is a module you can import.'),
  term('import', 'import', ['imports', 'imported'], 'Make code from another module available here.', 'from math import sqrt lets Python use the sqrt function.'),
  term('finite', 'finite', ['non-finite'], 'A finite number is not positive or negative infinity, or NaN (not a number). Those special values are called non-finite.', '12 is finite. Infinity and NaN are not.'),
  term('boundary', 'boundary', ['boundaries', 'bounds'], 'A limit, often the smallest or largest allowed value.', 'For scores from 0 to 100, test 0 and 100 as well as numbers outside those limits.'),
  term('timeout', 'timeout', ['timeouts'], 'A limit on how long code will wait for something.', 'A two-second timeout stops waiting if a request takes longer than two seconds.'),
  term('retry', 'retry', ['retries'], 'Try an operation again after it fails.', 'Allowing two attempts means one first try and at most one retry.'),
  term('prerequisite', 'prerequisite', ['prerequisites'], 'Something that must happen before another task can start.', 'Reading a file is a prerequisite for counting the words inside it.'),
  term('cycle', 'cycle', ['cycles'], 'A chain that leads back to something already in the chain.', 'If A needs B first and B needs A first, neither task can begin.'),
  term('normalize', 'normalize', ['normalized'], 'Put data into a consistent form before using it.', 'Removing extra edge spaces makes "  Read  " become "Read".'),
  term('schema', 'schema', ['schemas'], 'A description of how data is organized and what kinds of values are allowed.', 'A table schema can require a name column and a numeric score column.'),
  term('aggregate', 'aggregate', ['aggregation', 'aggregates'], 'Combine several values into one summary.', 'SUM adds a group of numbers to give one total.'),
  term('reducer', 'reducer', ['reducers'], 'A function that uses the current state and an action to decide the next state.', 'A counter reducer can turn count 3 and an add action into count 4.'),
  term('memoized', 'memoized', ['memoization'], 'Keeping a calculation’s previous result so it can be reused when its inputs have not changed.', 'A saved search result can be reused when the list and search text stay the same.'),
  term('payload', 'payload', ['payloads'], 'The useful data carried by a message or event.', 'An event named progress might carry the payload {percent: 50}.'),
  term('keyword', 'keyword', ['keywords'], 'A word with a special meaning in a programming language.', 'Python uses if for a decision and return to give back a result.'),
  term('token', 'token', ['tokens'], 'A small unit with meaning. In code it might be a name or symbol; in AI text it may be a word or part of one. An access token is different: it is a secret used for access.', 'In code, the name print is one token. Do not share an access token.'),
  term('ai', 'AI', ['artificial intelligence'], 'Computer systems that perform tasks such as recognizing patterns or generating text. Their answers can be wrong.', 'An AI helper may suggest code. Run and check the code before trusting it.'),
  term('ai-model', 'AI model', ['language model', 'large language model', 'LLM'], 'A system trained on examples to produce predictions or responses.', 'A language model can suggest an explanation, but it may invent details.'),
  term('prompt', 'prompt', ['prompts'], 'An instruction or question given to an AI tool. A program can also use a prompt to ask a person for input.', 'An AI prompt could be: Explain this function in two short sentences.'),
];

export type GlossaryMatch = { from: number; to: number; text: string; term: GlossaryTerm };
const escaped = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const matchers = new Map<string, { expression: RegExp; terms: Map<string, GlossaryTerm> }>();
function matcher(runtime: string) {
  let value = matchers.get(runtime);
  if (!value) {
    const terms = new Map<string, GlossaryTerm>();
    for (const entry of lessonGlossary) if (!entry.runtimes || entry.runtimes.includes(runtime)) {
      for (const alias of entry.aliases) {
        // Neither Rust nor Go has a built-in Double type. Functions may use that name.
        if ((runtime === "go" || runtime === "rust") && entry.id === "float" && alias === "Double") continue;
        terms.set(alias.toLowerCase(), entry);
      }
    }
    const aliases = [...terms.keys()].sort((a, b) => b.length - a.length).map(escaped);
    value = { expression: new RegExp(`(?<![\\p{L}\\p{N}_])(?:${aliases.join('|')})(?![\\p{L}\\p{N}_])`, 'giu'), terms };
    matchers.set(runtime, value);
  }
  return value;
}
/** Does not link inside code, URLs, identifiers, or partial words. Longest phrases win. */
export function glossaryMatches(text: string, runtime = ''): GlossaryMatch[] {
  const { expression, terms } = matcher(runtime);
  const protectedRanges = [...text.matchAll(/```[\s\S]*?```|`[^`\n]*`|https?:\/\/\S+/g)].map(match => [match.index, match.index + match[0].length]);
  const used = new Set<string>();
  return [...text.matchAll(expression)].flatMap(match => {
    const entry = terms.get(match[0].toLowerCase())!;
    if (protectedRanges.some(([from, to]) => match.index >= from && match.index < to) || used.has(entry.id)) return [];
    // Avoid ordinary imperatives such as “Set the value”. The Python type remains in Words help when used as a noun.
    if (entry.id === 'python-set' && /^(?:set|sets)$/i.test(match[0]) && /^(?:the|a|an|it|this|that|each|both|up)\b/i.test(text.slice(match.index + match[0].length).trim())) return [];
    // A set/list of instructions describes ordinary steps, not a Python collection type.
    if (['python-set','list'].includes(entry.id) && /^of\s+(?:instructions|steps|rules|commands)\b/i.test(text.slice(match.index + match[0].length).trim())) return [];
    used.add(entry.id);
    return [{ from: match.index, to: match.index + match[0].length, text: match[0], term: entry }];
  });
}
export const glossaryTermsIn = (text: string, runtime = '') => glossaryMatches(text, runtime).map(match => match.term);
