import type { SyntaxNode } from "@lezer/common";
import { codeLanguage } from "./code-language";

/** A source-preserving explanation, not a code evaluator or a type checker. */
export type AnatomyTone = "green" | "orange" | "blue" | "purple" | "gray";
export type AnatomyToken = {
  text: string;
  from: number;
  to: number;
  label: string;
  explanation: string;
  plainExplanation: string;
  tone: AnatomyTone;
};
export type AnatomyLine = { number: number; text: string; from: number; tokens: AnatomyToken[] };
export type CodeAnatomyModel = { source: string; language: string; lines: AnatomyLine[] };
type Meaning = Pick<AnatomyToken, "label" | "explanation" | "plainExplanation" | "tone">;
// Keep the technical teaching text. Pair it with reviewed, concrete wording.
const plainAnatomyPhrases: Record<string, string> = {
  "Spacing separates or aligns the source code.": "Spaces help separate the parts of the code.",
  "Ends the tag's markup.": "Ends this tag.",
  "a parenthesized SQL expression, row, or list": "a group of SQL values or instructions",
  "a parenthesized group": "a group of values or calculations",
  "an index or slice used to access an item": "the position or range used to choose items",
  "a list of names unpacked from a value": "the names that will receive items from a collection",
  "a list or bracketed expression": "a list or a group inside square brackets",
  "a JSON array": "a JSON list",
  "an array, type, or bracketed expression": "a group inside square brackets",
  "a JavaScript expression inside JSX": "JavaScript code inside the page content",
  "an object or key–value collection": "a collection of names and their values",
  "a block of code or declarations": "a group of instructions or settings",
  "a dictionary or set": "a dictionary of named values, or a set of unique items",
  "a set": "a collection of unique items",
  "a brace-delimited group": "a group inside curly braces",
  "Introduces a pseudo-class or pseudo-element selector.": "Starts a special CSS choice, such as :hover for an item under the pointer.",
  "Separates the CSS property from its value.": "The setting name is before this colon. Its value comes after it.",
  "Introduces a type annotation.": "The kind of value comes after this colon.",
  "Starts a Python block; the following indented lines belong to it.": "The indented lines that follow belong to this instruction.",
  "Separates the start, stop, or step of a slice.": "Separates the starting position, stopping position, or step size when choosing items.",
  "Separates the true result from the alternative result.": "The result before this colon is used when the check is true. The result after it is used otherwise.",
  "Separates a key or property name from its value.": "Connects the name on the left to its value on the right.",
  "Separates parts of this declaration or expression; its role depends on the surrounding syntax.": "Separates two parts of this code. Read the nearby lines to see what each part supplies.",
  "Tests whether the two SQL values are equal; this is not a variable assignment.": "Checks whether the two SQL values are equal. It does not store a new value here.",
  "Connects an attribute or prop name to its value.": "Gives the setting on the left the value on the right.",
  "Passes the value on the right under the argument name on the left.": "Gives this function a value, using the input name on the left.",
  "Gives this parameter a default value.": "The function uses this starting value if you do not give it another one.",
  "Assigns the value on the right to the name or target on the left.": "Stores the value on the right under the name or place on the left.",
  "Separates items in this list or expression.": "Separates one item or input from the next.",
  "Ends this CSS declaration, such as color: blue;.": "Ends this CSS setting, such as color: blue;.",
  "Ends a statement or separates sections of a loop header.": "Ends an instruction, or separates the setup, check, and update of a for loop.",
  "Accesses a member only when the optional value before it is not nil.": "Reads the part after the dot only if the value before it is not nil.",
  "Accesses a member only when the value before it is not null or undefined.": "Reads the part after the dot only if the value before it is not null or undefined.",
  "Accesses a member, property, or qualified name.": "Chooses a named part of the thing before the dot.",
  "Separates an arrow function's parameters from its result or body.": "The function inputs come before this arrow. The work or result comes after it.",
  "Introduces the function's return type.": "The kind of result the function gives back comes after this arrow.",
  "Compares the values on either side.": "Checks how the values on the two sides compare.",
  "Adds values or joins compatible sequences, depending on the language and values.": "Adds numbers. For text or lists in some languages, it joins the two parts.",
  "Subtracts a value, or marks a negative value.": "Subtracts a number, or marks a number as negative.",
  "Multiplies values; in some contexts it also unpacks items or selects all columns.": "Usually multiplies numbers. In other uses, it can expand a collection or choose all SQL columns.",
  "Performs floor division in Python.": "Divides and rounds down to a whole number in Python. For example, 7 // 2 is 3.",
  "Finds the remainder, or has a language-specific formatting role.": "Usually finds what is left after division: 7 % 3 is 1. Python can also use it to fill values into text.",
  "Raises a number to a power, or unpacks named values in Python.": "Usually calculates a power: 2 ** 3 is 8. Python also uses ** to expand a dictionary into named inputs.",
  "Combines conditions with logical AND.": "Requires both checks to be true when used with true-or-false values.",
  "Joins SQL text values.": "Joins two pieces of SQL text.",
  "Combines Boolean conditions with logical OR.": "Checks whether at least one of the two checks is true.",
  "Combines conditions with logical OR, or chooses a fallback.": "Uses the left value if it counts as true; otherwise uses the right value.",
  "Negates a Boolean, or force-unwraps an optional when written after a value.": "Before a true-or-false value, it reverses the answer. After a Swift optional, it requires a value to be present or the program fails.",
  "Negates a truth value.": "Reverses a true-or-false answer: true becomes false, and false becomes true.",
  "Chooses the right-hand fallback when the optional value on the left is nil.": "Uses the value on the right if the value on the left is nil.",
  "Chooses the right-hand fallback when the left value is null or undefined.": "Uses the value on the right if the value on the left is null or undefined.",
  "Spreads, gathers, or denotes a range, depending on this language and context.": "Can expand items, gather inputs, or mark a range. Its job depends on the language and nearby code.",
  "Combines, changes, or operates on the surrounding values.": "Uses or changes the values beside this symbol.",
  "This fragment could not be classified confidently. Check the exact source and its surrounding lines.": "This piece needs the nearby code to explain it safely. Read the full example.",
  "Text with embedded expressions. Those expressions are evaluated and inserted into the resulting string.": "Text with spaces for values. The program works out those values and puts them into the text.",
  "A regular-expression pattern used to match text.": "A pattern for finding text, such as digits or certain words.",
  "The value supplied for this HTML attribute.": "The value for this setting on the HTML element.",
  "A string: text enclosed in quotation marks. Punctuation inside belongs to the text.": "This is text. Quotes mark where it starts and ends. The outside quotes are not part of the stored text.",
  "Text content rendered inside the surrounding element.": "The words shown inside this page element.",
  "A numeric CSS value, including its unit when present.": "A number for this CSS setting. A unit such as px says how to measure it.",
  "A numeric value, not quoted text.": "A number you can calculate with, not text inside quotes.",
  "Represents an absent or empty value.": "Means there is no value here.",
  "Declares the HTML document type so the browser uses standards mode.": "Tells the browser to read this as modern HTML.",
  "Chooses which elements this CSS rule will style.": "Chooses which parts of the page get these styles.",
  "Names the CSS setting whose value follows the colon.": "Names the setting to change, such as color or width.",
  "The CSS value assigned to this property.": "The value to use for this style setting.",
  "A CSS function that computes or supplies a value.": "Works out a value for a CSS setting.",
  "Introduces a CSS at-rule, such as a media query.": "Starts a special CSS rule, such as @media for different screen sizes.",
  "Names a React component to render; this is JSX markup, not a function call written with parentheses.": "Chooses the reusable piece of the page to show here. This is page markup, not a call with parentheses.",
  "Names the HTML element being opened or closed.": "Says what kind of page content this is, such as a paragraph or button.",
  "Names a setting or input on this element or component.": "Names a setting or input for this part of the page.",
  "Names a table, column, alias, or other SQL object in this position.": "Names a table, column, or another named part of this SQL query.",
  "Calls this SQL function with the parenthesized arguments.": "Runs this SQL tool using the values inside the parentheses.",
  "A SQL instruction or structural word in this statement.": "Tells SQL what to do with the data.",
  "Names a table, column, alias, or other SQL object. The surrounding clause determines which.": "Names a table, column, or another part of the query. Read the nearby words to see which.",
  "Sets this column to the value on the right in the SQL update.": "Changes this column to the value on the right.",
  "COUNT(*) counts rows, including rows that contain NULL values.": "Counts every row, even when some values are missing.",
  "Selects all columns in this scope.": "Chooses all the columns available here.",
  "Names or describes the kind of value expected here.": "Says what kind of value is expected here, such as text or a number.",
  "Names the function being defined here; this line defines it rather than calling it.": "Gives the new function its name. This creates the tool; it does not run it yet.",
  "The callable being invoked. The following arguments are passed into it.": "Runs this named tool using the values inside the parentheses.",
  "The callable member being invoked on the value before the dot.": "Runs an action that belongs to the value before the dot.",
  "Names the class, interface, or enum being defined.": "Gives this new kind of value its name.",
  "A local input name used when defining this function.": "A name for an input this function will receive.",
  "Names the keyword argument being passed to this call.": "Names the input you are giving this function.",
  "Names a member or property. Reading a property is not itself a function call.": "Chooses a named piece of data. Reading it does not run a function by itself.",
  "Introduces a variable or binding name.": "Creates a name you can use to read this value later.",
  "Refers to a named value. It is not labeled as a function unless the syntax calls it.": "Uses the value stored under this name.",
  "Begins a Python function definition.": "Starts making a new Python function: a named tool that does a task.",
  "Begins a JavaScript function definition.": "Starts making a new JavaScript function: a named tool that does a task.",
  "Sends a value back from the current function.": "Gives a result back to the code that used this function.",
  "Declares a binding that cannot be reassigned.": "Creates a name that cannot later be given a different value.",
  "Declares a block-scoped variable.": "Creates a name for a value. The name is used inside this surrounding group of code.",
  "Starts a condition that controls which code runs.": "Starts a check. The following code runs only when that check is true.",
  "Introduces an alternative branch.": "Gives the code to run when the earlier check was false.",
  "Starts a loop.": "Starts code that repeats.",
  "Repeats code while a condition holds.": "Repeats this code while the check stays true.",
  "Brings names or modules into this file.": "Makes tools from another file or library available here.",
  "Waits for the result of an asynchronous operation.": "Waits here for a result that may arrive later. Other work can continue.",
  "Marks an asynchronous function or operation.": "Makes a function that can wait for results while other work continues.",
  "A reserved word that gives this code its structure or behavior.": "A word this language uses for a special instruction.",
  "Operates on or compares the surrounding values.": "Calculates with or compares the values beside it.",
  "A source fragment. Its precise role depends on the surrounding expression.": "A piece of code whose job depends on the nearby code.",
  "Redirects command input or output to the following target.": "Changes where a command reads from or where it sends its result.",
  "Sets a variable for the following command, or in the shell if no command follows.": "Sets a named value for the next command, or for this terminal if no command follows.",
  "The program or shell command to run. This is not a function call with parentheses.": "Names the program or command to run in the terminal.",
  "Expands a shell variable into its value.": "Uses the value stored under this terminal variable’s name.",
  "A quoted shell argument. Dollar-sign expressions may still expand inside double quotes.": "Text given to the command. Inside double quotes, a $ name can still be replaced by its value.",
  "A quoted literal shell argument; single quotes keep its characters literal.": "Text given to the command. Single quotes keep the characters inside unchanged.",
  "An argument passed to the command, such as a subcommand, filename, or value.": "An input for this command, such as a file name or another command choice.",
  "Names a property in this JSON object.": "Names a piece of data in this JSON object.",
  "Quoted text containing expressions whose values are inserted into the text.": "Text with spaces where calculated values will be put.",
  "A string: quoted text. Punctuation inside is part of that text.": "Text inside quotes. The outside quotes mark its start and end; they are not part of the text.",
  "Introduces a Swift attribute or property wrapper, such as @State.": "Starts a special Swift label, such as @State for a value the screen remembers.",
  "Begins a Swift key-path expression that refers to a property.": "Starts a path to a named piece of data in Swift.",
  "Marks an optional type or optional chaining, or separates the condition from a choice in a ternary expression.": "In Swift, this can mean a value might be missing. In a choice written with ? and :, it separates the check from the first result.",
  "Begins a Swift function definition.": "Starts making a new Swift function: a named tool that does a task.",
  "A Swift reserved word that structures the declaration or expression.": "A word Swift uses for a special instruction.",
  "Names the Swift function being defined; this is not a call.": "Gives this new Swift function its name. It does not run the function yet.",
  "Names the Swift type being defined.": "Gives this new kind of Swift value its name.",
  "Calls a member on the value before the dot.": "Runs an action that belongs to the value before the dot.",
  "Calls this type or named callable to create or obtain a value.": "Uses this named tool or type to get a value.",
  "Calls this named callable with the following inputs.": "Runs this named tool with the inputs that follow.",
  "A parameter, argument label, or declared name; the surrounding declaration or call determines its role.": "A name for an input or value. The nearby code shows whether it is being created or used.",
  "Names the expected Swift value type.": "Says what kind of Swift value is expected here.",
  "Names a TOML configuration setting.": "Names a setting in this TOML file.",
  "A named value or identifier; it is not necessarily a function.": "Uses a name for a value or another part of the code.",
  "A symbol whose precise role depends on the surrounding syntax.": "A symbol whose job depends on the nearby code.",
  "Source text in a language without a dedicated syntax explanation here.": "This language does not yet have a detailed explanation for this piece.",
  "Unclassified source text.": "This piece needs the nearby code to explain it safely.",
  "Leading whitespace shows which Python block this line belongs to. Keep it when copying.": "Spaces at the start show which instruction this Python line belongs to. Keep them when copying.",
  "Leading whitespace makes nesting easier to read. The exact indentation is preserved in the original code.": "Spaces at the start make the groups of code easier to see. The original code keeps these spaces.",
  "Starts an opening tag.": "The element name comes next, such as p for a paragraph.",
  "Starts a closing tag.": "This begins the end tag for a page element.",
  "Ends this self-closing tag.": "This finishes the element without a separate closing tag.",
  "A note for the reader, not an instruction to run.": "A reminder for you. The computer does not run the words in this note.",
  "A true-or-false value.": "One of two answers: true or false.",
  "Divides one value by another.": "Divides the number on the left by the number on the right.",
  "Sends the first command's output into the next command.": "Uses the first command’s result as information for the next command.",
  "Controls when the next command runs.": "Decides whether or when the next command starts.",
  "Uses the output of the command inside the parentheses.": "Runs the command inside and uses the result it produces.",
  "An option that changes how the command runs.": "A setting for this command, such as which files to show.",
  "the parameter list: inputs the function receives": "the names for the inputs this function receives",
  "the argument list: values passed into this call": "the values you give this function"
};
export function simpleAnatomyExplanation(technical: string) {
  if (plainAnatomyPhrases[technical]) return plainAnatomyPhrases[technical];
  let plain = technical;
  for (const [from, to] of Object.entries(plainAnatomyPhrases)) plain = plain.replace(from, to);
  return plain.replace(/^Begins /, "Starts ").replace(/^Ends /, "Closes ");
}
const meaning = (label: string, explanation: string, tone: AnatomyTone = "gray", plainExplanation = simpleAnatomyExplanation(explanation)): Meaning => ({ label, explanation, plainExplanation, tone });
const blank = meaning("", "Spacing separates or aligns the source code.");
const keywords = new Set("if else elif for while in not and or is return yield await async try except finally raise with as import from pass break continue def class lambda global nonlocal del assert const let var function new this super throw catch switch case default do of export extends implements interface type enum public private protected static readonly typeof instanceof void delete get set true false null undefined None True False func struct protocol actor guard defer repeat where throws rethrows some any final override mutating inout nil self init associatedtype extension weak unowned lazy required convenience fileprivate internal open operator infix prefix postfix await keyof".split(" "));
const sqlFunctions = new Set("COUNT SUM AVG MIN MAX COALESCE NULLIF TRIM LTRIM RTRIM LOWER UPPER LENGTH ABS ROUND CAST SUBSTR SUBSTRING REPLACE GROUP_CONCAT ROW_NUMBER RANK DENSE_RANK LAG LEAD FIRST_VALUE LAST_VALUE TOTAL IFNULL IIF DATE TIME DATETIME STRFTIME JSON_EXTRACT CHANGES".split(" "));
const aliases: Record<string, string> = { py: "python", js: "javascript", ts: "typescript", jsx: "react", sh: "bash", shell: "bash" };
export function anatomyLanguage(language: string) { const lower = language.trim().toLowerCase(); return aliases[lower] ?? lower; }
export function supportsCodeAnatomy(language: string) { return !["text", "output", "plaintext", "plain"].includes(anatomyLanguage(language)); }
const ancestors = (node: SyntaxNode) => { const result: string[] = []; for (let p = node.parent; p; p = p.parent) result.push(p.name); return result; };
const isFirst = (node: SyntaxNode) => node.parent?.firstChild?.from === node.from && node.parent.firstChild.to === node.to;
function contextLanguage(node: SyntaxNode, language: string) {
  for (let p: SyntaxNode | null = node; p; p = p.parent) {
    if (p.name === "StyleSheet") return "css";
    if (p.name === "Script") return language === "html" ? "javascript" : language;
  }
  return language;
}

function punctuation(text: string, language: string, parent = "", family: string[] = []): Meaning | null {
  const inTag = /Tag|Attribute/.test(parent);
  if (["<", "</", ">", "/>"].includes(text) && inTag) return meaning(text === "<" ? "Open tag" : text === "</" ? "Close tag" : text === "/>" ? "Self-close" : "Tag end", text === "<" ? "Starts an opening tag." : text === "</" ? "Starts a closing tag." : text === "/>" ? "Ends this self-closing tag." : "Ends the tag's markup.", "orange");
  if (text === "(" || text === ")") {
    const open = text === "(";
    const thing = parent === "ParamList" ? "the parameter list: inputs the function receives" : parent === "ArgList" ? "the argument list: values passed into this call" : language === "sql" ? "a parenthesized SQL expression, row, or list" : "a parenthesized group";
    return meaning(open ? "Open" : "Close", `${open ? "Begins" : "Ends"} ${thing}.`, "orange");
  }
  if (text === "[" || text === "]") {
    const open = text === "[";
    const thing = /Member|Subscript/.test(parent) ? "an index or slice used to access an item" : /Pattern/.test(parent) ? "a list of names unpacked from a value" : language === "python" ? "a list or bracketed expression" : language === "json" ? "a JSON array" : "an array, type, or bracketed expression";
    return meaning(open ? "Open [" : "Close ]", `${open ? "Begins" : "Ends"} ${thing}.`, "orange");
  }
  if (text === "{" || text === "}") {
    const open = text === "{";
    const thing = parent === "JSXEscape" ? "a JavaScript expression inside JSX" : /Object|Dictionary|Dict/.test(parent) || language === "json" ? "an object or key–value collection" : /Set/.test(parent) ? "a set" : /Block|Body/.test(parent) || language === "css" ? "a block of code or declarations" : language === "python" ? "a dictionary or set" : "a brace-delimited group";
    return meaning(open ? "Open {" : "Close }", `${open ? "Begins" : "Ends"} ${thing}.`, "orange");
  }
  if (text === ":") {
    if (language === "css") return meaning(/Pseudo/.test(parent) ? "State" : "Value next", /Pseudo/.test(parent) ? "Introduces a pseudo-class or pseudo-element selector." : "Separates the CSS property from its value.", "orange");
    if (/Type/.test(parent)) return meaning("Type", "Introduces a type annotation.", "orange");
    if (parent === "Body") return meaning("Block next", "Starts a Python block; the following indented lines belong to it.", "orange");
    if (/Slice|Member/.test(parent)) return meaning("Slice", "Separates the start, stop, or step of a slice.", "orange");
    if (/Conditional/.test(parent)) return meaning("Otherwise", "Separates the true result from the alternative result.", "purple");
    if (/Object|Property|Dict/.test(parent) || language === "json") return meaning("Value next", "Separates a key or property name from its value.", "orange");
    return meaning("Colon", "Separates parts of this declaration or expression; its role depends on the surrounding syntax.", "orange");
  }
  if (text === "=") {
    if (language === "sql") return meaning("Compare", "Tests whether the two SQL values are equal; this is not a variable assignment.", "purple");
    if (/Attribute/.test(parent) || family.includes("JSXAttribute")) return meaning("Set attribute", "Connects an attribute or prop name to its value.", "orange");
    if (parent === "ArgList") return meaning("Named input", "Passes the value on the right under the argument name on the left.", "purple");
    if (parent === "ParamList") return meaning("Default", "Gives this parameter a default value.", "purple");
    return meaning("Assign", "Assigns the value on the right to the name or target on the left.", "purple");
  }
  if (text === ",") return meaning("Separate", "Separates items in this list or expression.", "orange");
  if (text === ";") return meaning(language === "css" ? "End setting" : "End", language === "css" ? "Ends this CSS declaration, such as color: blue;." : "Ends a statement or separates sections of a loop header.", "orange");
  if (text === "." || text === "?.") return meaning(text === "?." ? "Safe access" : "Access", text === "?." ? language === "swift" ? "Accesses a member only when the optional value before it is not nil." : "Accesses a member only when the value before it is not null or undefined." : "Accesses a member, property, or qualified name.", "orange");
  if (text === "=>") return meaning("Arrow", "Separates an arrow function's parameters from its result or body.", "purple");
  if (text === "->") return meaning("Returns", "Introduces the function's return type.", "purple");
  if (["==", "===", "!=", "!==", "<", ">", "<=", ">=", "<>"].includes(text)) return meaning("Compare", "Compares the values on either side.", "purple");
  if (["+", "-", "*", "/", "//", "%", "**", "||", "&&", "!", "&", "|", "^", "~", "??", "+=", "-=", "*=", "/=", "++", "--", "..."].includes(text)) {
    const descriptions: Record<string, string> = { "+": "Adds values or joins compatible sequences, depending on the language and values.", "-": "Subtracts a value, or marks a negative value.", "*": "Multiplies values; in some contexts it also unpacks items or selects all columns.", "/": "Divides one value by another.", "//": "Performs floor division in Python.", "%": "Finds the remainder, or has a language-specific formatting role.", "**": "Raises a number to a power, or unpacks named values in Python.", "&&": "Combines conditions with logical AND.", "||": language === "sql" ? "Joins SQL text values." : language === "swift" ? "Combines Boolean conditions with logical OR." : "Combines conditions with logical OR, or chooses a fallback.", "!": language === "swift" ? "Negates a Boolean, or force-unwraps an optional when written after a value." : "Negates a truth value.", "??": language === "swift" ? "Chooses the right-hand fallback when the optional value on the left is nil." : "Chooses the right-hand fallback when the left value is null or undefined.", "...": "Spreads, gathers, or denotes a range, depending on this language and context." };
    return meaning(/=$/.test(text) ? "Update" : text === "..." ? "Spread / range" : "Operator", descriptions[text] ?? "Combines, changes, or operates on the surrounding values.", "purple");
  }
  return null;
}

function parserMeaning(node: SyntaxNode, source: string, originalLanguage: string): Meaning {
  const text = source.slice(node.from, node.to), name = node.name, parent = node.parent?.name ?? "", family = ancestors(node);
  const language = contextLanguage(node, originalLanguage);
  let call: SyntaxNode | null = node;
  while (call && call.name !== "CallExpression") call = call.parent;
  const callName = call?.firstChild ? source.slice(call.firstChild.from, call.firstChild.to) : "";
  const isPrint = language === "python" && callName === "print";
  const directPrintText = isPrint && call ? /^print\(\s*(['"])([^'"\\\n]*)\1\s*\)$/.exec(source.slice(call.from, call.to))?.[2] : undefined;
  if (isPrint && text === "print" && parent === "CallExpression") return meaning("Function", "The callable being invoked. The following arguments are passed into it.", "green", directPrintText !== undefined ? `print shows something in the output. Here, we give it the text “${directPrintText}” to show.` : "print shows something in the output. The values inside its parentheses tell it what to show.");
  if (isPrint && parent === "ArgList" && text === "(") return meaning("Open", "Begins the argument list: values passed into this call.", "orange", "Starts the part where you tell print what to show.");
  if (isPrint && parent === "ArgList" && text === ")") return meaning("Close", "Ends the argument list: values passed into this call.", "orange", "Closes this use of print.");
  if (isPrint && name === "String" && parent === "ArgList") return meaning("Text", "A string: text enclosed in quotation marks. Punctuation inside belongs to the text.", "blue", "The text to show. Quotes mark where the text starts and ends; the outside quotes are not shown.");

  if (/Comment/.test(name)) return meaning("Comment", "A note for the reader, not an instruction to run.");
  if (name === "⚠") return meaning("Code", "This fragment could not be classified confidently. Check the exact source and its surrounding lines.");
  if (/FormatString|TemplateString/.test(name)) return meaning("Text template", "Text with embedded expressions. Those expressions are evaluated and inserted into the resulting string.", "blue");
  if (/RegExp/.test(name)) return meaning("Pattern", "A regular-expression pattern used to match text.", "blue");
  if (/String|AttributeValue/.test(name)) return meaning(name === "AttributeValue" ? "Value" : "Text", name === "AttributeValue" ? "The value supplied for this HTML attribute." : "A string: text enclosed in quotation marks. Punctuation inside belongs to the text.", "blue");
  if (name === "Text" || name === "JSXText") return meaning("Text", "Text content rendered inside the surrounding element.", "blue");
  if (/Number/.test(name)) return meaning(language === "css" ? "Value" : "Number", language === "css" ? "A numeric CSS value, including its unit when present." : "A numeric value, not quoted text.", "blue");
  if (/Boolean|Null/.test(name) || ["true", "false", "True", "False", "null", "None"].includes(text)) return meaning(/true|false/i.test(text) ? "Boolean" : "Empty value", /true|false/i.test(text) ? "A true-or-false value." : "Represents an absent or empty value.", "blue");
  if (name === "DoctypeDecl") return meaning("Document type", "Declares the HTML document type so the browser uses standards mode.", "purple");
  if (language === "css") {
    if (/Selector$/.test(name)) return meaning("Selector", "Chooses which elements this CSS rule will style.", "green");
    if (name === "PropertyName" || name === "VariableName") return meaning(name === "VariableName" ? "Custom property" : "Property", "Names the CSS setting whose value follows the colon.", "green");
    if (name === "ValueName" || name === "ColorLiteral") return meaning("Value", "The CSS value assigned to this property.", "blue");
    if (name === "Callee") return meaning("Function", "A CSS function that computes or supplies a value.", "green");
    if (/AtKeyword/.test(name) || text.startsWith("@")) return meaning("At-rule", "Introduces a CSS at-rule, such as a media query.", "purple");
  }
  if (name === "TagName" || (name === "JSXIdentifier" && /Tag/.test(parent))) return meaning(language === "react" || language === "tsx" ? /^[A-Z]/.test(text) ? "Component" : "Element" : "Element", /^[A-Z]/.test(text) && name === "JSXIdentifier" ? "Names a React component to render; this is JSX markup, not a function call written with parentheses." : "Names the HTML element being opened or closed.", "green");
  if (name === "AttributeName" || (name === "JSXIdentifier" && parent === "JSXAttribute")) return meaning(name === "JSXIdentifier" ? "Prop" : "Attribute", "Names a setting or input on this element or component.", "purple");
  if (language === "sql") {
    const upper = text.toUpperCase();
    const previousWord = node.prevSibling ? source.slice(node.prevSibling.from, node.prevSibling.to).toUpperCase() : "";
    const nextIsParen = /^\s*\(/.test(source.slice(node.to));
    const cteName = node.nextSibling?.name === "Parens" && node.nextSibling.nextSibling && source.slice(node.nextSibling.nextSibling.from, node.nextSibling.nextSibling.to).toUpperCase() === "AS";
    const namePosition = ["FROM", "JOIN", "UPDATE", "INTO", "TABLE", "VIEW", "AS", "RECURSIVE"].includes(previousWord) || (previousWord === "WITH" && upper !== "RECURSIVE");
    if ((/^(?:Keyword|Identifier|QuotedIdentifier)$/.test(name) && namePosition) || cteName || (sqlFunctions.has(upper) && !nextIsParen)) return meaning("SQL name", "Names a table, column, alias, or other SQL object in this position.", "green");
    if (sqlFunctions.has(upper) && /^\s*\(/.test(source.slice(node.to))) return meaning("Function", "Calls this SQL function with the parenthesized arguments.", "green");
    if (name === "Keyword") return meaning("SQL keyword", "A SQL instruction or structural word in this statement.", "purple");
    if (/Identifier/.test(name)) return meaning("SQL name", "Names a table, column, alias, or other SQL object. The surrounding clause determines which.", "green");
    if (text === "=") {
      for (let sibling = node.prevSibling; sibling; sibling = sibling.prevSibling) {
        const word = source.slice(sibling.from, sibling.to).toUpperCase();
        if (["SET", "WHERE", "HAVING", "ON", "SELECT", "RETURNING", "WHEN"].includes(word)) {
          if (word === "SET") return meaning("Assign", "Sets this column to the value on the right in the SQL update.", "purple");
          break;
        }
      }
    }
    if (text === "*") {
      const before = source.slice(Math.max(0, node.from - 30), node.from);
      if (/(?:\bSELECT\s*|\bCOUNT\s*\(\s*|\.)$/i.test(before)) return meaning("All / rows", /COUNT\s*\(\s*$/i.test(before) ? "COUNT(*) counts rows, including rows that contain NULL values." : "Selects all columns in this scope.", "purple");
    }
  }
  if (name === "Type" || /TypeName|TypeDefinition/.test(name) || parent === "TypeDef") return meaning("Type", "Names or describes the kind of value expected here.", "purple");
  if (/VariableName|VariableDefinition|PropertyName|PropertyDefinition|Identifier|Name$/.test(name)) {
    if (["FunctionDefinition", "FunctionDeclaration", "FunctionExpression"].includes(parent) || ((parent === "MethodDeclaration" || (parent === "Property" && node.nextSibling?.name === "ParamList")) && name === "PropertyDefinition")) return meaning("Function name", "Names the function being defined here; this line defines it rather than calling it.", "green");
    if (parent === "CallExpression" && isFirst(node)) return meaning("Function", "The callable being invoked. The following arguments are passed into it.", "green");
    if (name === "PropertyName" && parent === "MemberExpression" && node.parent?.parent?.name === "CallExpression" && isFirst(node.parent)) return meaning("Method", "The callable member being invoked on the value before the dot.", "green");
    if (/ClassDeclaration|ClassDefinition|InterfaceDeclaration|EnumDeclaration/.test(parent)) return meaning("Type name", "Names the class, interface, or enum being defined.", "green");
    if (parent === "ParamList") return meaning("Parameter", "A local input name used when defining this function.", "green");
    if (parent === "ArgList" && node.nextSibling?.name === "AssignOp") return meaning("Input name", "Names the keyword argument being passed to this call.", "green");
    if (/Property/.test(name)) return meaning("Property", "Names a member or property. Reading a property is not itself a function call.", "green");
    return meaning(name === "VariableDefinition" ? "New name" : "Name", name === "VariableDefinition" ? "Introduces a variable or binding name." : "Refers to a named value. It is not labeled as a function unless the syntax calls it.", "green");
  }
  const symbol = punctuation(text, language, parent, family);
  if (symbol) return symbol;
  if (keywords.has(text) || name === "Keyword" || name === "keyword") {
    const descriptions: Record<string, string> = { def: "Begins a Python function definition.", function: "Begins a JavaScript function definition.", return: "Sends a value back from the current function.", const: "Declares a binding that cannot be reassigned.", let: "Declares a block-scoped variable.", if: "Starts a condition that controls which code runs.", else: "Introduces an alternative branch.", for: "Starts a loop.", while: "Repeats code while a condition holds.", import: "Brings names or modules into this file.", await: "Waits for the result of an asynchronous operation.", async: "Marks an asynchronous function or operation." };
    return meaning("Keyword", descriptions[text] ?? "A reserved word that gives this code its structure or behavior.", "purple");
  }
  if (/Op|Operator|Logic/.test(name)) return meaning("Operator", "Operates on or compares the surrounding values.", "purple");
  if (/^\s+$/.test(text)) return blank;
  return meaning("Code", "A source fragment. Its precise role depends on the surrounding expression.");
}

/** Fallback lexing never runs code. Unknown words remain names, not guessed functions. */
function fallbackTokens(source: string, language: string, base = 0): AnatomyToken[] {
  const result: AnatomyToken[] = [];
  const shell = language === "bash";
  const pattern = shell
    ? /\s+|#[^\r\n]*|\$\([^)]*\)|"(?:\\[\s\S]|[^"\\])*"|'[^']*'|\$\{[^}]*\}|\$[A-Za-z_][\w]*|&&|\|\||>>|<<|[|;<>]|[^\s|;<>"']+/g
    : /\s+|\/\/[^\r\n]*|\/\*[\s\S]*?\*\/|#[^\r\n]*|"""[\s\S]*?"""|"(?:\\[\s\S]|[^"\\])*"|'(?:\\[\s\S]|[^'\\])*'|`(?:\\[\s\S]|[^`\\])*`|(?:\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)|[A-Za-z_$][\w$]*|===|!==|==|!=|<=|>=|=>|->|\?\?|\?\.|\+\+|--|\+=|-=|\*\*|&&|\|\||\.\.\.|[^\s]/g;
  let commandNext = true;
  for (const match of source.matchAll(pattern)) {
    const text = match[0], from = match.index!, after = source.slice(from + text.length);
    let detail: Meaning;
    const previous = result.filter(t => t.label).at(-1)?.text ?? "";
    if (/^\s+$/.test(text)) { detail = blank; if (shell && /\n/.test(text)) commandNext = true; }
    else if ((language === "swift" && /^(?:\/\/|\/\*)/.test(text)) || ((shell || language === "toml") && text.startsWith("#"))) detail = meaning("Comment", "A note for the reader, not an instruction to run.");
    else if (shell) {
      if (["|", "&&", "||", ";"].includes(text)) { detail = meaning(text === "|" ? "Pipe" : "Control", text === "|" ? "Sends the first command's output into the next command." : "Controls when the next command runs.", "purple"); commandNext = true; }
      else if (/^[<>]/.test(text)) detail = meaning("Redirect", "Redirects command input or output to the following target.", "purple");
      else if (text.startsWith("$(")) { detail = meaning("Command result", "Uses the output of the command inside the parentheses.", "blue"); commandNext = false; }
      else if (/^[A-Za-z_]\w*=/.test(text) && commandNext) detail = meaning("Environment", "Sets a variable for the following command, or in the shell if no command follows.", "green");
      else if (commandNext) { detail = meaning("Command", "The program or shell command to run. This is not a function call with parentheses.", "green"); commandNext = false; }
      else if (/^\$/.test(text)) detail = meaning("Variable", "Expands a shell variable into its value.", "green");
      else if (/^['"]/.test(text)) detail = meaning("Text", text.startsWith('"') ? "A quoted shell argument. Dollar-sign expressions may still expand inside double quotes." : "A quoted literal shell argument; single quotes keep its characters literal.", "blue");
      else detail = meaning(text.startsWith("-") ? "Option" : "Argument", text.startsWith("-") ? "An option that changes how the command runs." : "An argument passed to the command, such as a subcommand, filename, or value.", "blue");
    } else if (/^['"`]/.test(text)) {
      const isKey = language === "json" && /^\s*:/.test(after);
      detail = meaning(isKey ? "Key" : /\\\(|\$\{/.test(text) ? "Text template" : "Text", isKey ? "Names a property in this JSON object." : /\\\(|\$\{/.test(text) ? "Quoted text containing expressions whose values are inserted into the text." : "A string: quoted text. Punctuation inside is part of that text.", isKey ? "green" : "blue");
    } else if (/^\d/.test(text)) detail = meaning("Number", "A numeric value, not quoted text.", "blue");
    else if (["true", "false", "null", "nil"].includes(text)) detail = meaning(text === "true" || text === "false" ? "Boolean" : "Empty value", text === "true" || text === "false" ? "A true-or-false value." : "Represents an absent or empty value.", "blue");
    else if (language === "swift" && text === "@") detail = meaning("Attribute", "Introduces a Swift attribute or property wrapper, such as @State.", "purple");
    else if (language === "swift" && text === "\\" && after.startsWith(".")) detail = meaning("Key path", "Begins a Swift key-path expression that refers to a property.", "purple");
    else if (language === "swift" && text === "?") detail = meaning("Optional / choice", "Marks an optional type or optional chaining, or separates the condition from a choice in a ternary expression.", "purple");
    else if (language === "swift" && text === "func") detail = meaning("Define", "Begins a Swift function definition.", "purple");
    else if (language === "swift" && keywords.has(text)) detail = meaning("Keyword", "A Swift reserved word that structures the declaration or expression.", "purple");
    else if (language === "swift" && previous === "func") detail = meaning("Function name", "Names the Swift function being defined; this is not a call.", "green");
    else if (language === "swift" && ["struct", "class", "enum", "protocol", "actor"].includes(previous)) detail = meaning("Type name", "Names the Swift type being defined.", "green");
    else if (language === "swift" && /^[A-Za-z_$]/.test(text) && /^\s*\(/.test(after)) detail = meaning(previous === "." ? "Method" : /^[A-Z]/.test(text) ? "Call" : "Function", previous === "." ? "Calls a member on the value before the dot." : /^[A-Z]/.test(text) ? "Calls this type or named callable to create or obtain a value." : "Calls this named callable with the following inputs.", "green");
    else if (language === "swift" && /^[A-Za-z_$]/.test(text) && /^\s*:/.test(after)) detail = meaning("Input / name", "A parameter, argument label, or declared name; the surrounding declaration or call determines its role.", "green");
    else if (language === "swift" && (previous === "->" || (previous === ":" && /^[A-Z]/.test(text)))) detail = meaning("Type", "Names the expected Swift value type.", "purple");
    else if (language === "toml" && /^[A-Za-z_$]/.test(text) && /^\s*=/.test(after)) detail = meaning("Key", "Names a TOML configuration setting.", "green");
    else if (language === "swift" || language === "json" || language === "toml") detail = punctuation(text, language) ?? (/^[A-Za-z_$]/.test(text) ? meaning("Name", "A named value or identifier; it is not necessarily a function.", "green") : meaning("Symbol", "A symbol whose precise role depends on the surrounding syntax.", "orange"));
    else detail = meaning("Code", "Source text in a language without a dedicated syntax explanation here.");
    // Always preserve even gaps that an incomplete quote or unusual character left behind.
    const end = result.length ? result[result.length - 1].to - base : 0;
    if (from > end) result.push({ text: source.slice(end, from), from: base + end, to: base + from, ...meaning("Code", "Unclassified source text.") });
    result.push({ text, from: base + from, to: base + from + text.length, ...detail });
  }
  const end = result.length ? result[result.length - 1].to - base : 0;
  if (end < source.length) result.push({ text: source.slice(end), from: base + end, to: base + source.length, ...meaning("Code", "Unclassified source text.") });
  return result;
}

function parsedTokens(source: string, language: string): AnatomyToken[] {
  const parser = codeLanguage(language)?.language.parser;
  if (!parser) return fallbackTokens(source, language);
  const result: AnatomyToken[] = [];
  const visit = (node: SyntaxNode) => {
    // Strings and comments are meaningful whole expressions: never tokenize their punctuation as code.
    const atomic = /^(?:String|FormatString|TemplateString|RegExp|NumberLiteral|AttributeValue|Text|JSXText|DoctypeDecl|ColorLiteral)$/.test(node.name) || /Comment/.test(node.name) || (contextLanguage(node, language) === "css" && /Selector$/.test(node.name));
    if (atomic || !node.firstChild) {
      if (node.to > node.from) result.push({ text: source.slice(node.from, node.to), from: node.from, to: node.to, ...parserMeaning(node, source, language) });
      return;
    }
    for (let child: SyntaxNode | null = node.firstChild; child; child = child.nextSibling) visit(child);
  };
  visit(parser.parse(source).topNode);
  const complete: AnatomyToken[] = [];
  let cursor = 0;
  for (const token of result) {
    if (token.from < cursor) continue;
    if (token.from > cursor) complete.push(...fallbackTokens(source.slice(cursor, token.from), "unknown", cursor));
    complete.push(token); cursor = token.to;
  }
  if (cursor < source.length) complete.push(...fallbackTokens(source.slice(cursor), "unknown", cursor));
  return complete;
}

export function codeAnatomy(source: string, requestedLanguage: string): CodeAnatomyModel {
  const language = anatomyLanguage(requestedLanguage);
  if (!supportsCodeAnatomy(language)) return { source, language, lines: [] };
  const tokens = parsedTokens(source, language);
  const lines: AnatomyLine[] = [];
  let from = 0;
  for (const [index, raw] of source.split("\n").entries()) {
    const text = raw.endsWith("\r") ? raw.slice(0, -1) : raw;
    const end = from + text.length;
    const lineTokens = tokens.filter(t => end > from && t.from < end && t.to > from).map(token => {
      const start = Math.max(from, token.from), to = Math.min(end, token.to);
      return { ...token, text: source.slice(start, to), from: start, to };
    });
    const leading = lineTokens[0];
    if (leading && !leading.label && /^\s+$/.test(leading.text) && text.trim()) {
      lineTokens[0] = { ...leading, ...meaning("Indent", language === "python" ? "Leading whitespace shows which Python block this line belongs to. Keep it when copying." : "Leading whitespace makes nesting easier to read. The exact indentation is preserved in the original code.") };
    }
    lines.push({ number: index + 1, text, from, tokens: lineTokens });
    from += raw.length + 1;
  }
  // The final newline belongs to the exact source, not an extra empty line to inspect.
  if (lines.length > 1 && lines.at(-1)?.text === "") lines.pop();
  return { source, language, lines };
}

export function anatomyTokenDisplay(token: AnatomyToken) {
  if (token.label === "Indent") return "↳";
  const text = token.text.replace(/\t/g, "    ");
  return text.length > 30 ? text.slice(0, 27) + "…" : text;
}
export function anatomyTokenWidth(token: AnatomyToken) {
  return Math.max(56, anatomyTokenDisplay(token).length * 18 + 22, token.label.length * 8 + 18);
}
/** Keep each diagram small; longer lines are inspected in adjacent, ordered pieces. */
export function anatomyPages(line: AnatomyLine): AnatomyToken[][] {
  const pages: AnatomyToken[][] = [];
  let current: AnatomyToken[] = [], width = 36;
  for (const token of line.tokens.filter(t => t.label)) {
    const next = anatomyTokenWidth(token);
    if (current.length && (width + next > 740 || current.length >= 7)) { pages.push(current); current = []; width = 36; }
    current.push(token); width += next;
  }
  if (current.length) pages.push(current);
  return pages;
}
