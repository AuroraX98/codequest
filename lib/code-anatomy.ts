import type { SyntaxNode } from "@lezer/common";
import { codeLanguage } from "./code-language";
import { swiftCodeWord } from "./swift-code-words";
import { reviewedCSharpAnatomy, csharpMeanings } from "./csharp-reviewed-anatomy";
import { reviewedCppAnatomy, cppMeanings } from "./cpp-reviewed-anatomy";
import { reviewedJavaAnatomy, javaMeanings } from "./java-reviewed-anatomy";
import { reviewedCAnatomy, cMeanings } from "./c-reviewed-anatomy";
import { reviewedKotlinAnatomy, kotlinMeanings } from "./kotlin-reviewed-anatomy";
import { reviewedRustAnatomy, rustMeanings } from "./rust-reviewed-anatomy";
import { reviewedPHPAnatomy, phpMeanings } from "./php-reviewed-anatomy";
import { reviewedRubyAnatomy, rubyMeanings } from "./ruby-reviewed-anatomy";
import { reviewedRAnatomy, rMeanings } from "./r-reviewed-anatomy";
import { reviewedGoAnatomy, goMeanings } from "./go-reviewed-anatomy";

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
  "Names a member or property. Reading a property is not itself a function call.": "Reads a named property. If it has a getter, that getter runs to supply the value.",
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


/** HTML labels describe the actual tag or setting, without changing the source. */
function htmlPartMeaning(node: SyntaxNode, source: string): Meaning | null {
  if (!["TagName", "AttributeName", "AttributeValue", "EntityReference"].includes(node.name)) return null;
  const text = source.slice(node.from, node.to);
  let tag: SyntaxNode | null = node;
  while (tag && !["OpenTag", "CloseTag", "SelfClosingTag"].includes(tag.name)) tag = tag.parent;
  const tagNode = tag?.getChild("TagName");
  const element = tagNode ? source.slice(tagNode.from, tagNode.to).toLowerCase() : "";
  const elements: Record<string, [string, string]> = {
    html: ["Whole page", "Wraps the HTML document."],
    head: ["Page details", "Holds the page title and other details about the document."],
    body: ["Page content", "Holds the page content people read and use."],
    title: ["Page title", "Names the page, often in the browser tab. It is not the visible main heading."],
    meta: ["Page information", "Supplies information about the document, such as its text encoding or description."],
    link: ["Related resource", "Connects the document to a related file, such as a stylesheet or icon."],
    p: ["Paragraph", "Groups one paragraph of text."],
    a: ["Link", "With href, gives readers a link to another place."],
    img: ["Image", "Adds an image. Its src gives the file and alt supplies a text replacement."],
    h1: ["Main heading", "Marks a level-one heading, used here for the page's main subject."],
    h2: ["Section heading", "Marks a level-two heading for a topic beneath the main heading."],
    h3: ["Subheading", "Marks a level-three heading for a smaller topic inside a level-two section."],
    header: ["Introduction", "Groups introductory content for a page or section."],
    footer: ["Closing details", "Groups closing or supporting information for a page or section."],
    nav: ["Navigation", "Groups navigation links."],
    main: ["Main content", "Marks the page's main content area."],
    section: ["Topic section", "Groups related content, usually with its own heading."],
    article: ["Complete item", "Groups an item that can make sense on its own."],
    div: ["Block group", "Groups content without adding a more specific meaning."],
    span: ["Inline group", "Groups a small piece of text without adding a more specific meaning."],
    ul: ["Unordered list", "Groups list items whose order is not the main meaning."],
    ol: ["Ordered list", "Groups list items in a meaningful sequence."],
    li: ["List item", "Marks one item in a list."],
    dl: ["Description list", "Groups terms or names with their descriptions."],
    dt: ["Term", "Names a term or item in a description list."],
    dd: ["Description", "Gives the description for a term or item in the list."],
    strong: ["Importance", "Marks text as important."],
    em: ["Emphasis", "Marks words to stress when reading the sentence."],
    code: ["Code sample", "Marks text as computer code. It does not run that code."],
    pre: ["Keep spacing", "Preserves spaces and line breaks in the text."],
    blockquote: ["Block quote", "Marks a quotation that stands apart from the surrounding text."],
    q: ["Short quote", "Marks a quotation within surrounding text."],
    cite: ["Work title", "Marks the title of a work, such as a book or article."],
    time: ["Date or time", "Marks a date, time or duration."],
    abbr: ["Abbreviation", "Marks a short form of a name or phrase."],
    address: ["Contact details", "Marks contact information for this page or its nearest article."],
    figure: ["Figure group", "Groups content, such as an image, as one unit."],
    figcaption: ["Figure caption", "Gives the figure its visible caption."],
    bdi: ["Separate direction", "Keeps this text's direction separate from the surrounding text."],
    form: ["Form", "Groups controls for collecting and submitting information."],
    label: ["Field label", "Names a form control so people know what it asks for."],
    input: ["Input field", "Adds a form control. Its type chooses the kind of control."],
    select: ["Choice list", "Offers options to choose from."],
    option: ["Choice", "Defines one option inside a choice list."],
    optgroup: ["Choice group", "Groups related options under a label."],
    textarea: ["Multiline field", "Provides a field for several lines of text."],
    button: ["Button", "Adds a button. Its type controls whether it submits a form or has another action."],
    fieldset: ["Field group", "Groups related form controls."],
    legend: ["Group name", "Names the surrounding fieldset."],
    small: ["Side note", "Marks a small side comment or other supporting note."],
    table: ["Table", "Groups related information in rows and columns."],
    caption: ["Table title", "Names the whole table."],
    thead: ["Header rows", "Groups the table's header rows."],
    tbody: ["Data rows", "Groups the table's body rows."],
    tfoot: ["Footer rows", "Groups the table's footer rows. It does not calculate totals."],
    tr: ["Table row", "Groups the cells in one row."],
    th: ["Header cell", "Labels a row, column or group of table cells."],
    td: ["Data cell", "Holds an ordinary table value."],
    audio: ["Audio player", "Embeds an audio recording."],
    video: ["Video player", "Embeds a video recording."],
    source: ["Source choice", "Offers a media source for the surrounding picture, audio or video."],
    track: ["Timed text", "Connects timed text, such as captions, to media."],
    picture: ["Image choices", "Groups possible sources with the image that uses them."],
    details: ["Reveal section", "Groups content the reader can open and close."],
    summary: ["Reveal toggle", "Provides the visible toggle for its details section."],
    dialog: ["Dialog", "Holds a focused message or task. showModal() opens it modally."],
    iframe: ["Embedded page", "Shows a separate document inside this page."],
    script: ["Script", "Contains or points to code for the browser to run."],
    template: ["Stored HTML", "Stores HTML for later use instead of displaying it now."],
    progress: ["Task progress", "Shows how much of a task is complete, or that the amount is unknown."],
    meter: ["Measurement", "Shows a measurement within a known range."],
    br: ["Line break", "Starts a new line in the text."],
  };
  if (node.name === "TagName" && elements[element]) {
    const [label, detail] = elements[element];
    const closing = tag?.name === "CloseTag";
    const explanation = closing ? "Ends this " + element + " element. " + detail : detail;
    return meaning(closing ? "End " + label.toLowerCase() : label, explanation, "green", explanation);
  }
  let attribute: SyntaxNode | null = node;
  while (attribute && attribute.name !== "Attribute") attribute = attribute.parent;
  const attributeNode = attribute?.getChild("AttributeName");
  const key = attributeNode ? source.slice(attributeNode.from, attributeNode.to).toLowerCase() : "";
  const attributes: Record<string, [string, string]> = {
    id: ["Unique id", "Gives this element an id. Use it only once on the page so references find the right element."],
    class: ["Shared class", "Gives the element one or more class names that other elements can share."],
    href: ["Link target", "Gives the destination of this link or the location of its related file."],
    src: ["Source file", "Gives the location of the file to load."],
    alt: ["Image description", "Supplies text for someone who cannot see the image. Empty text is appropriate for a purely decorative image."],
    lang: ["Language", "Identifies the language of this element's text and its contents, unless overridden inside."],
    charset: ["Text encoding", "Tells the browser how the document's text is encoded."],
    content: ["Stored detail", "Supplies the value of this piece of page information."],
    rel: ["Link relationship", "States the relationship or rules for this link."],
    title: ["Extra description", "Gives extra descriptive text. A hover popup is not a reliable replacement for visible instructions."],
    for: ["Label target", "Matches the id of the form control this label names."],
    name: ["Data name", "Supplies the name used for this field's submitted value."],
    type: ["Control kind", "Chooses the kind of form control or button."],
    required: ["Answer required", "Requires an answer during ordinary form validation. Remove this attribute to turn it off; writing false does not turn it off."],
    value: ["Value", "Supplies a value for this element; its job depends on the element."],
    method: ["Submit method", "Chooses how this form submits. The dialog method instead closes a containing dialog."],
    action: ["Submit address", "Gives the address that receives this form's data."],
    enctype: ["Data packaging", "Chooses how to package the submitted values. multipart/form-data supports files."],
    minlength: ["Minimum length", "Sets the minimum allowed length of a typed text entry. Use required too if it must not be empty."],
    maxlength: ["Maximum length", "Limits a typed text entry in UTF-16 text units. Some visible symbols use more than one unit."],
    rows: ["Visible rows", "Requests the field's height in text lines. It does not limit the number of answer lines."],
    min: ["Minimum", "Sets the lower end of the allowed range."],
    max: ["Maximum", "Sets the upper end of the allowed range, or the total work for progress."],
    step: ["Number steps", "Sets the gap between allowed values. With a minimum, that minimum is the step's starting point."],
    checked: ["Starts checked", "Sets a checkbox or radio button's starting checked state."],
    selected: ["Starts selected", "Makes this option selected at the start."],
    multiple: ["Several choices", "Allows more than one selection for this select or file input."],
    size: ["Visible size", "Requests the control's visible size. On select, it is the number of visible rows."],
    readonly: ["Read only", "Stops normal editing of a supported text field while keeping its named value available for submission."],
    disabled: ["Disabled", "Turns off ordinary interaction with this control and excludes it from form submission."],
    accept: ["File type hint", "Suggests file types in a file chooser. It does not prove the received file is valid."],
    form: ["Linked form", "Names the id of the form this control belongs to."],
    formaction: ["Button destination", "Overrides the form's submission address when this submit button is used."],
    formmethod: ["Button method", "Overrides the form's submission method when this submit button is used."],
    autocomplete: ["Autofill purpose", "Tells the browser what kind of information belongs here, so it may offer a saved value."],
    inputmode: ["Keyboard hint", "Suggests a useful on-screen keyboard. It does not validate the answer."],
    pattern: ["Text rule", "Sets a pattern that the entire nonempty value must match. required separately rejects an empty value."],
    "aria-label": ["Accessible name", "Gives this element a name for assistive tools without adding visible text."],
    "aria-labelledby": ["Name from text", "Lists ids of elements whose text names this element for assistive tools."],
    "aria-describedby": ["Connected help", "Lists ids of text that gives extra help about this element."],
    "aria-invalid": ["Error state", "Tells assistive tools whether an error is known. It does not validate or repair the value."],
    tabindex: ["Keyboard focus", "Controls focus eligibility. Minus one permits focus without adding a normal Tab stop."],
    scope: ["Header direction", "States which row, column or group this table header labels."],
    headers: ["Header ids", "Lists the ids of header cells that describe this data cell."],
    colspan: ["Across columns", "Sets how many table columns this cell spans."],
    rowspan: ["Across rows", "Sets how many table rows this cell spans."],
    controls: ["Player controls", "Asks the browser to show media playback controls."],
    kind: ["Track purpose", "Identifies the timed text's purpose, such as captions or subtitles."],
    srclang: ["Track language", "Identifies the language of this text track."],
    label: ["Choice label", "Supplies the visible name for this option group or track."],
    default: ["Default track", "Requests this track as the default choice, subject to user preferences."],
    media: ["View condition", "Sets a condition, such as a viewing width, for choosing this source or resource."],
    srcset: ["Image choices", "Lists image candidates and, when given, their widths or pixel-density labels."],
    sizes: ["Display width hint", "Describes the expected image display width to help choose a file. It does not set the actual layout width."],
    width: ["Width", "Supplies this element's width. Together with height on an image, it helps reserve its shape."],
    height: ["Height", "Supplies this element's height. Together with width on an image, it helps reserve its shape."],
    loading: ["Loading choice", "Requests normal eager loading or deferred lazy loading when appropriate."],
    open: ["Starts open", "Makes this details section or dialog visible initially. On a dialog, it does not create modal behavior."],
    autofocus: ["Starting focus", "Requests focus here when the relevant page or dialog opens."],
    onclick: ["Click action", "Contains JavaScript to run when this element is activated by a click action."],
    popovertarget: ["Popover target", "Names the id of the popover this button controls."],
    popover: ["Popover behavior", "Makes this content a popover. Auto permits light dismissal; manual does not."],
    sandbox: ["Frame limits", "Restricts an embedded document. An empty value adds no extra permissions."],
    srcdoc: ["Embedded HTML", "Supplies the HTML of an embedded document directly."],
    defer: ["Run after parsing", "Makes an external ordinary script wait until the HTML has been read, preserving deferred script order."],
    async: ["Run when ready", "Lets this script run when ready, without promising that later HTML is available."],
    datetime: ["Stored date", "Supplies a date, time or duration in a form software can read."],
    cite: ["Source address", "Stores a quotation's source address. It does not display an attribution line."],
    target: ["Where to open", "Chooses where the link opens. _blank requests a new tab or window."],
    download: ["Download request", "Requests a download and can suggest its saved filename. Browser rules still apply."],
    dir: ["Text direction", "Sets left-to-right, right-to-left or automatic text direction."],
    low: ["Low boundary", "Marks the boundary of the meter's lower region."],
    high: ["High boundary", "Marks the boundary of the meter's upper region."],
    optimum: ["Preferred value", "Identifies a preferred value within the meter's range."],
  };
  if (key === "name" && element === "meta") attributes.name = ["Detail kind", "Identifies the kind of page information, such as description or viewport."];
  if (key === "type" && ["source", "link"].includes(element)) attributes.type = ["File format", "States the file's media type, such as image/svg+xml or audio/ogg."];
  if (key === "type" && element === "script") attributes.type = ["Script kind", "Selects how to interpret the script, such as JavaScript module behavior for module."];
  if (key === "title" && element === "iframe") attributes.title = ["Frame name", "Names this embedded document for assistive tools."];
  if (key === "for" && element === "output") attributes.for = ["Related controls", "Lists ids of the controls involved in this output."];
  if (key === "value" && element === "progress") attributes.value = ["Work completed", "States how much work is done, out of max."];
  if (key === "value" && element === "meter") attributes.value = ["Measured value", "States the current measurement within the meter's range."];
  if (key === "value" && element === "option") attributes.value = ["Sent choice", "Gives the value sent when this option is selected."];
  if (key === "value" && element === "input") attributes.value = ["Field value", "Gives a starting field value, or the value sent by a checked checkbox or radio."];
  if (["AttributeName", "AttributeValue"].includes(node.name) && attributes[key]) {
    const [label, explanation] = attributes[key];
    return meaning(label, explanation, node.name === "AttributeValue" ? "blue" : "purple", explanation);
  }
  if (node.name === "EntityReference") {
    const decoded: Record<string, string> = { "&lt;": "<", "&gt;": ">", "&amp;": "&", "&quot;": '"', "&apos;": "'" };
    const explanation = decoded[text] ? "Writes " + decoded[text] + " as text instead of treating it as HTML markup." : "Writes a character using an HTML character reference.";
    return meaning("Text character", explanation, "blue", explanation);
  }
  return null;
}

function captionTokens(source: string): AnatomyToken[] {
  const tokens: AnatomyToken[] = [];
  let offset = 0;
  const add = (text: string, from: number, label: string, detail: string) =>
    tokens.push({text, from, to: from + text.length, ...meaning(label, detail, label ? "blue" : "gray", detail)});
  for (const raw of source.split(/(?<=\n)/)) {
    const line = raw.replace(/\r?\n$/, "");
    const timing = /^(\s*)((?:\d{2,}:)?\d{2}:\d{2}\.\d{3})(\s+)(-->)(\s+)((?:\d{2,}:)?\d{2}:\d{2}\.\d{3})(.*)$/.exec(line);
    if (timing) {
      const labels = ["", "Start time", "", "Until", "", "End time", "Cue settings"];
      const details = ["Spaces separate parts.", "When this caption starts: hours if present, then minutes, seconds and thousandths of a second.", "Spaces separate parts.", "Separates the caption's start and end times.", "Spaces separate parts.", "When this caption ends.", "Optional settings for where and how this cue appears."];
      let at = offset;
      for (let i = 1; i < timing.length; i++) { if (timing[i]) add(timing[i], at, labels[i-1], details[i-1]); at += timing[i].length; }
    } else if (/^WEBVTT(?:\s|$)/.test(line)) add(line, offset, "Caption file", "Identifies this as a WebVTT caption file.");
    else if (line) add(line, offset, "Caption text", "Words or sound descriptions for the caption. Other WebVTT blocks can also contain cue labels or styling.");
    if (raw.length > line.length) add(raw.slice(line.length), offset + line.length, "", "Starts a new line.");
    offset += raw.length;
  }
  return tokens;
}

/** Explain CSS in its own context before general programming-language labels. */
function cssPartMeaning(node: SyntaxNode, source: string): Meaning | null {
  const text = source.slice(node.from, node.to), name = node.name;
  const part = (label: string, detail: string, tone: AnatomyTone = "green") => meaning(label, detail, tone, detail);
  if (/Selector$/.test(name)) {
    if (/^\.[\w-]+$/.test(text)) return part("Class selector", `Chooses elements with the class ${text.slice(1)}. The dot means class.`);
    if (/^#[\w-]+$/.test(text)) return part("ID selector", `Chooses the element with the ID ${text.slice(1)}. The # means ID.`);
    if (/^[a-z][\w-]*$/i.test(text)) return part("Element selector", `Chooses ${text} elements on the page.`);
    if (text === ":root") return part("Root selector", "Chooses the page's root element. Shared custom properties are often defined here.");
    if (text.startsWith(":where(")) return part("Easy-to-override selector", "Matches the selectors inside the parentheses without adding selector strength.");
    if (text.startsWith(":is(")) return part("Match any listed selector", "Matches any selector inside. Its strength comes from the strongest selector in the list.");
    if (text === "*") return part("Any element", "Chooses any element.");
    return part("Selector", "Chooses which page elements or parts get these styles.");
  }
  const settings: Record<string, string> = {
    color: "Chooses the text color.", background: "Sets the background behind the content.", "background-color": "Chooses the background color.",
    padding: "Sets space inside the border.", margin: "Sets space outside the border.", gap: "Sets space between rows and columns in this layout.",
    border: "Sets the border's width, style, and color.", "border-radius": "Rounds the box's corners.",
    width: "Sets the box's width. Box-sizing decides which parts that width includes.", height: "Sets the box's height. Box-sizing decides which parts that height includes.",
    "min-width": "Sets the smallest allowed width.", "max-width": "Sets the largest allowed width.", "min-height": "Sets the smallest allowed height.", "max-height": "Sets the largest allowed height.",
    "box-sizing": "Chooses whether a set size includes padding and borders.", "aspect-ratio": "Sets a preferred width-to-height shape when sizing the box.",
    display: "Chooses how the element takes part in layout, such as block, flex, or grid.",
    position: "Chooses how the box is positioned.", top: "Sets the distance or shift from the top, based on the positioning mode.", left: "Sets the distance or shift from the left, based on the positioning mode.",
    inset: "Sets the top, right, bottom, and left positioning distances together.", "z-index": "Sets the layer level inside the relevant stacking group.",
    overflow: "Chooses what happens to content that extends beyond the box.", "overflow-wrap": "Chooses whether a long word may break to fit.", "white-space": "Chooses how spaces and line breaks are handled.",
    "font-family": "Lists the chosen font and its backups, in order.", "font-size": "Sets how large the text is.", "font-weight": "Chooses the weight of the letters, such as normal or bold.", "font-style": "Chooses a letter style, such as normal or italic.",
    "line-height": "Sets the height of each line of text.", "text-align": "Aligns text inside its line space.", "text-decoration": "Adds or removes a text decoration, such as an underline.",
    "font-display": "Chooses how text appears while a web font loads.", src: "Gives the location of the font file in this font-face rule.",
    "flex-direction": "Chooses the main direction for flex items.", "flex-wrap": "Chooses whether flex items may move onto another line.",
    flex: "Sets growth, shrinking, and starting size, in that order.", "flex-basis": "Sets the item's starting size along the flex row or column.", "flex-grow": "Sets how the item shares extra space.", "flex-shrink": "Sets how the item can shrink when space is short.",
    "justify-content": "Places or shares extra space along the main flex direction, or between grid columns.", "align-items": "Aligns flex items across the main direction, or grid items within their areas.", "justify-items": "Aligns grid items inside their areas along the text direction.", "align-content": "Places or shares extra space between flex lines or grid rows.",
    "grid-template-columns": "Defines the grid's columns.", "grid-template-rows": "Defines the grid's rows.", "grid-auto-rows": "Sets the size of extra rows the grid creates.", "grid-template-areas": "Names the spaces in a grid, with one quoted line for each row.",
    "grid-area": "Places an item in a named grid area, or sets its grid edges.", "grid-row": "Sets the rows or row edges an item covers.", "grid-column": "Sets the columns or column edges an item covers.",
    "container-type": "Makes this element a container whose size can be checked by a query.",
    opacity: "Sets how see-through the whole element is: 0 is transparent and 1 is fully opaque.", visibility: "Chooses whether the box is visible while keeping its layout space.",
    transition: "Chooses the setting to animate, its duration, and how its speed changes.", "transition-duration": "Sets how long a transition takes.",
    animation: "Applies a named keyframe animation and sets how it runs.", transform: "Moves, turns, or scales how the element is drawn.", "transform-origin": "Chooses the point around which the element turns or scales.",
    "color-scheme": "Tells the browser which light or dark appearance this element supports.", "object-fit": "Chooses how an image fits inside its box.", "object-position": "Places the image within its box.",
    "outline": "Draws a line around the element without taking layout space.", "outline-offset": "Sets the space between the outline and the element's edge.",
  };
  if (name === "PropertyName") {
    const detail = settings[text] ?? (/^padding-/.test(text) ? "Sets inner space at the named edge or edges." : /^margin-/.test(text) ? "Sets outer space at the named edge or edges." : `Names the CSS setting ${text}. Its value follows the colon.`);
    return part("Property", detail);
  }
  if (name === "VariableName") return part(node.parent?.name === "Declaration" ? "Name a shared value" : "Read a shared value", node.parent?.name === "Declaration" ? `Defines the custom property ${text}. Its value comes after the colon.` : `Reads the custom property ${text}. In var(), a value after a comma is a backup.`);
  const functions: Record<string, string> = {
    var: "Reads a named CSS value. A value after the comma can act as a backup.", clamp: "Uses a preferred size while keeping it between the minimum and maximum.",
    minmax: "Gives a grid track a minimum and a maximum size.", repeat: "Repeats the grid sizes inside the parentheses.", calc: "Works out a CSS value using a calculation.",
    min: "Chooses the smallest of the supplied values.", max: "Chooses the largest of the supplied values.",
    rotate: "Turns the element by the angle inside the parentheses.", translateX: "Shifts the element along its x direction.", translateY: "Shifts the element along its y direction.", translate: "Shifts the element using the supplied distances.",
    url: "Points to a resource, such as an image or font file.", format: "Gives a hint about the font file's format.",
    rgb: "Builds a color from red, green, and blue amounts.", rgba: "Builds a color with an amount of transparency.", "linear-gradient": "Makes a background that blends colors along a straight line.",
  };
  if (name === "Callee") return part("CSS function", functions[text] ?? `Uses ${text} with the values inside its parentheses.`);
  const rules: Record<string, [string, string]> = {
    "@media": ["Media rule", "Applies the enclosed styles when the media condition matches."],
    "@container": ["Container rule", "Applies styles to descendants when a qualifying container matches the condition."],
    "@supports": ["Feature check", "Applies the enclosed styles when the browser supports the stated CSS feature."],
    "@layer": ["Cascade layer", "Names, orders, or adds rules to a group of styles."],
    "@keyframes": ["Animation steps", "Defines the named start, end, or middle steps of an animation."],
    "@font-face": ["Load a font", "Names a font and describes the file the browser can load."],
  };
  if (rules[text]) return part(...rules[text], "purple");
  if (name === "Important") return part("Important flag", "Gives this setting important priority. Important rules reverse the normal layer order.", "purple");
  if (name === "FeatureName") return part("Condition", `Checks ${text} to decide whether the enclosed styles apply.`, "purple");
  if (text === "{" || text === "}") return part(text === "{" ? "Open rules" : "Close rules", text === "{" ? "Starts the styles or settings that belong to this rule." : "Ends the styles or settings in this rule.", "orange");
  if (text === ":") return part("Value next", "The setting or condition is before this colon. Its value comes after it.", "orange");
  if (text === ";") return part("End setting", "Ends this CSS setting or order statement.", "orange");
  if (text === "(" || text === ")") return part(text === "(" ? "Open group" : "Close group", text === "(" ? "Starts the values or condition for this CSS expression." : "Ends this group of CSS values or this condition.", "orange");
  if (text === ",") return part("Separate", "Separates items, such as selectors, function inputs, or layer names.", "orange");
  if (text === "/") return part("Separate parts", "Separates parts of this CSS value. In a grid position, it separates the start and end.", "orange");
  if (name === "NumberLiteral") {
    const unit = /[a-z%]+$/i.exec(text)?.[0];
    const units: Record<string, string> = { px: "CSS pixels", rem: "times the root font size", em: "times the relevant font size", vw: "percent of the viewport width", vh: "percent of the viewport height", fr: "shares of available grid space", deg: "degrees of a turn", s: "seconds", ms: "milliseconds" };
    return part("Value", unit === "%" ? `${text} is a percentage. The setting decides which size it is measured against.` : unit && units[unit] ? `${parseFloat(text)} ${units[unit]}.` : `Uses the number ${text} for this CSS setting.`, "blue");
  }
  if (name === "ValueName" || name === "ColorLiteral" || name === "StringLiteral") return part("Value", name === "StringLiteral" ? "A quoted CSS value, such as a font name or a row of grid-area names." : `Uses ${text} as part of this setting's value.`, "blue");
  return null;
}

/** Explain known React syntax without guessing the behavior of custom props or methods. */
function reactPartMeaning(node: SyntaxNode, source: string): Meaning | null {
  const text=source.slice(node.from,node.to), parent=node.parent;
  const part=(label:string, detail:string)=>meaning(label,detail,"green",detail);
  if (node.name === "JSXIdentifier" && parent?.name === "JSXBuiltin") return part("Element", "Names a built-in page element, such as a heading, paragraph, or button.");
  if (node.name === "JSXIdentifier" && parent?.name === "JSXMemberExpression" && source.slice(parent.from,node.from).trim() === "React.") {
    if (text === "Suspense") return part("Waiting boundary", "Shows its fallback while a supported child, such as a lazy component, is waiting. Ordinary fetch calls in effects do not trigger it by themselves.");
    if (text === "StrictMode") return part("Extra development checks", "Adds development checks, including an extra setup and cleanup cycle for effects. These checks help find missing cleanup.");
  }
  if (node.name === "PropertyName" && parent?.name === "MemberExpression" && parent.parent?.name === "CallExpression" && parent.parent.firstChild?.from === parent.from && /^React\s*\./.test(source.slice(parent.from,node.from))) {
    const tools:Record<string,[string,string]>={
      useState:["Remember state","Keeps a value between screen updates. Gives back the current value and a function that asks React to update it."],
      useReducer:["Update with a rule","Keeps state and uses a reducer function to choose the next state from an action."],
      useRef:["Keep a reference","Keeps an object with a current field between renders. Changing current does not ask React to redraw the screen."],
      useEffect:["Connect after rendering","Runs setup after React updates the screen. A returned cleanup function undoes that setup before a rerun or removal."],
      useContext:["Read shared context","Reads the nearest matching provider's value above this component. Without one, it reads the context's default value."],
      createContext:["Create shared context","Creates a way for a parent to supply a value to components below it. The input is the fallback when no provider is above them."],
      useMemo:["Reuse a calculation","Can reuse a calculated result while its listed inputs stay the same. The calculation must be safe to run again."],
      useCallback:["Reuse a function","Can keep the same function between renders while its listed inputs stay the same. This does not call the function."],
      useId:["Make a unique ID","Gives this component a stable ID for connections such as a label and its field. Do not use it for list keys."],
      useTransition:["Allow an update to wait","Provides a pending flag and a function that marks some state updates as less urgent, so urgent work can go first."],
      memo:["Reuse a component result","Creates a component that can skip a parent-caused render when its props have not changed. Its own state or context can still update it."],
      lazy:["Load a component later","Defines a component whose loader runs when React first tries to show it. The loader returns a Promise with the component in default."]
    };
    const found=tools[text];if(found)return part(...found);
  }
  if (node.name === "JSXIdentifier" && parent?.name === "JSXAttribute") {
    if (text === "key") return part("Keep item identity","Helps React match this item with the same item in the next render. Use a stable key unique among its siblings; key is not passed as a normal prop.");
    const tag=parent.parent?.getChild("JSXBuiltin");
    const tagName=tag ? source.slice(tag.from,tag.to) : "";
    if (/^[a-z]/.test(tagName)) {
      const props:Record<string,[string,string]>={
        onClick:["When clicked","Gives React the function to run when this element is clicked."],
        onChange:["When edited","Gives React the function that responds to a change in this field."],
        onSubmit:["When submitted","Gives React the function to run when this form receives a submit event."],
        ref:["Keep the element","Lets React put this page element in a ref's current field, or pass it to a ref function."],
        value:["Current field value","Sets the field's current value. For an editable controlled field, update this value when the user edits it."],
        defaultValue:["Starting field value","Sets the field's starting value. After that, the field can keep its own edits."],
        htmlFor:["Label this field","Connects this label to the field with the matching id."],
        className:["CSS class names","Gives this element class names that CSS can use to choose it."],
        "aria-expanded":["Open or closed","Tells assistive tools whether the part controlled by this element is open."],
        "aria-controls":["Controlled element ID","Names the id of the page part this control affects."],
        "aria-describedby":["Extra description ID","Names the id or ids of text that explains this element."],
        "aria-label":["Accessible name","Gives this element a name that tools such as screen readers can announce."]
      };
      const found=props[text];if(found)return part(...found);
    }
  }
  return null;
}

/** Type syntax describes allowed values; it does not run as JavaScript. */
function typescriptPartMeaning(node: SyntaxNode, source: string): Meaning | null {
  const text=source.slice(node.from,node.to), name=node.name, parent=node.parent?.name ?? "";
  const part=(label:string, detail:string)=>meaning(label,detail,"purple",detail);
  if (name === "TypeDefinition") return part(parent === "TypeParamList" ? "Type placeholder" : "Name a type", parent === "TypeParamList" ? "Names a type that will be chosen when this generic is used." : "Gives this type description a name to use elsewhere.");
  if (text === ":" && parent === "TypeAnnotation") return part("Type marker", "The type after this colon says which kind of value is allowed here.");
  if (text === "const" && parent === "BinaryExpression" && node.prevSibling?.name === "as") return part("Keep exact values", "Keeps this literal's exact values in its type and marks literal object fields and array items as readonly. It does not freeze the real value.");
  if (name === "TemplateType") return part("Text pattern type", "Describes allowed text values. The parts inside ${...} supply types for the pattern; this does not build text while the program runs.");
  if (name === "TypeName") {
    const types:Record<string,string>={string:"Text values, such as a name.",number:"A number value, such as 6.",boolean:"Either true or false.",unknown:"Any value may arrive. Check it before using its properties or methods.",any:"Turns off most type checking for this value. It does not make the value safe.",never:"No value fits this type. It can mark a case that should be impossible.",undefined:"The undefined value, often used when something is missing.",Partial:"Makes the named type's fields optional. It does not change an object.",Pick:"Keeps only the chosen field names in a type.",Omit:"Leaves the chosen field names out of a type. It does not remove real object fields.",Record:"Describes fields with the chosen names and a shared value type.",ReturnType:"Gets the result type of a function type without calling it.",ReadonlyArray:"An array type that blocks changes through this typed reference. It does not freeze the real array.",Promise:"Describes a result that may arrive later, with its value type inside the angle brackets."};
    return part("Type",types[text] ?? "Names the kind of value allowed here. This description helps TypeScript check the code.");
  }
  if (text === "type" && name === "type") return part(parent === "ImportDeclaration" ? "Import a type" : "Define a type", parent === "ImportDeclaration" ? "Imports a type description without importing a running value." : "Gives a name to a description of allowed values.");
  if (text === "interface" && name === "interface") return part("Describe a shape", "Lists the fields or methods an object must provide.");
  if (text === "extends" && parent !== "ClassDeclaration") return part(parent === "ConditionalType" ? "Type fits?" : parent === "InterfaceDeclaration" ? "Build on a shape" : "Type requirement", parent === "ConditionalType" ? "Checks whether the left type fits the right type, then chooses one of the two result types." : parent === "InterfaceDeclaration" ? "Keeps the earlier interface's fields while adding this interface's fields." : "Limits the chosen type to values that meet the rule after extends.");
  if (text === "typeof" && parent === "TypeofType") return part("Type of a value", "Reuses this value's type. In this position it does not produce text or call the value.");
  if (text === "keyof" && name === "keyof") return part("Allowed field names", "Makes a type from the field names of the type that follows.");
  if (text === "infer" && name === "infer") return part("Name an inferred type", "Gives a name to a type found inside this pattern, so the matching result can use it.");
  if (text === "in" && parent === "IndexSignature") return part("For each field name", "Builds one field for each name in the type after in. This is a type rule, not a running loop.");
  if (text === "is" && parent === "TypePredicate") return part("Promise after a check", "Tells TypeScript which type this value has when the function returns true. The function must check that claim correctly.");
  if (text === "satisfies" && name === "satisfies") return part("Check the shape", "Checks that this value fits the type while keeping useful detail about its own type. It does not check outside data while the program runs.");
  if (text === "as" && name === "as" && parent === "BinaryExpression") return part("Tell the type checker", "Asks TypeScript to use the type after as. It does not check or convert the real value. With as const, it keeps exact values and marks literal fields as readonly.");
  if (text === "readonly" && name === "readonly") return part("Read without changing", "Blocks changes through this typed view. It does not freeze the actual value.");
  if (text === "implements" && name === "implements") return part("Check the class shape", "Checks that the class provides the required parts. It does not create missing methods.");
  if (text === "declare" && name === "declare") return part("Describe existing code", "Describes a name and its type without creating the running code.");
  if (name === "Privacy") return part(text === "protected" ? "Class family access" : text === "private" ? "Inside this class" : "Public access", text === "protected" ? "Allows checked use inside this class and its subclasses. This is not runtime secrecy." : text === "private" ? "Limits ordinary checked access to inside this class. TypeScript private does not create JavaScript # private storage." : "Allows code outside the class to use this member.");
  if (name === "Optional") return part("May be missing", "Marks a parameter or field that may be left out.");
  if (parent === "VoidType") return part("No result to use", "Describes a function result that the caller should not use as a value.");
  if (text === "|" && parent === "UnionType") return part("One of these types", "Allows a value that fits either listed type.");
  if (text === "&" && parent === "IntersectionType") return part("Both type rules", "Requires a value to meet both type descriptions.");
  if (text === "=" && parent === "TypeAliasDeclaration") return part("Type means", "Connects the type name to its description. It does not store a running value.");
  if (text === ";" && /TypeAliasDeclaration|PropertyType|MethodType|AmbientFunctionDeclaration/.test(parent)) return part("End declaration", "Ends this type description or declaration.");
  if (text === "?" && parent === "ConditionalType") return part("Matching result type", "The type after this question mark is chosen when the type check fits.");
  if (text === ":" && parent === "ConditionalType") return part("Other result type", "The type after this colon is chosen when the type check does not fit.");
  if ((text === "<" || text === ">") && /Type(?:Arg|Param)List/.test(parent)) return part(text === "<" ? "Open type list" : "Close type list", text === "<" ? "Starts the list of chosen types or type placeholders." : "Ends the list of chosen types or type placeholders.");
  return null;
}

function parserMeaning(node: SyntaxNode, source: string, originalLanguage: string): Meaning {
  const text = source.slice(node.from, node.to), name = node.name, parent = node.parent?.name ?? "", family = ancestors(node);
  const language = contextLanguage(node, originalLanguage);
  if (language === "python" && name === "At" && parent === "Decorator")
    return meaning("Apply a decorator", "Use the decorator on the definition below it.", "purple");
  if (language === "typescript" && name === "Label" && parent === "TupleType")
    return meaning("Name this position", "Give this tuple position a readable name. The name does not change its position.", "green");
  if (language === "javascript" && name === "debugger" && parent === "DebuggerStatement")
    return meaning("Pause for debugging", "Ask an attached debugger to pause here so you can inspect the program.", "purple");
  if (language === "html" && name === "TextareaText")
    return meaning("Starting text", "The text initially shown in this text box before anyone edits it.", "blue");
  if (language === "sql" && text.toUpperCase() === "EXPLAIN" && /^\s*QUERY\s+PLAN\b/i.test(source.slice(node.to)))
    return meaning("Show the query plan", "Ask SQLite how it plans to find the rows for this query.", "purple");
  if (language === "css" && name === "KeywordQuery") {
    if (parent === "AtRule" && /^@layer\b/i.test(source.slice(node.parent!.from, node.from)))
      return meaning("Layer name", "Name a group of CSS rules. The layer order helps decide which rules win.", "green");
    if (parent === "MediaStatement" && text === "print")
      return meaning("Print layout", "Use these styles when the page is printed or shown in print preview.", "purple");
  }
  if (language === "html") { const html = htmlPartMeaning(node, source); if (html) return html; }
  if (language === "css") { const css = cssPartMeaning(node, source); if (css) return css; }
  if (language === "typescript") { const typescript = typescriptPartMeaning(node, source); if (typescript) return typescript; }
  if (language === "react" || language === "tsx") { const react = reactPartMeaning(node, source); if (react) return react; }
  let call: SyntaxNode | null = node;
  while (call && call.name !== "CallExpression") call = call.parent;
  const callName = call?.firstChild ? source.slice(call.firstChild.from, call.firstChild.to) : "";
  const isPrint = language === "python" && callName === "print";
  const directPrintText = isPrint && call ? /^print\(\s*(['"])([^'"\\\n]*)\1\s*\)$/.exec(source.slice(call.from, call.to))?.[2] : undefined;
  if (language === "python" && /String/.test(name) && /^(?:b|br|rb)["']/i.test(text)) return meaning("Bytes", "A Python bytes literal. Its elements are integers from 0 through 255; it is not a str value.", "blue", "The b before the quotes makes bytes, rather than ordinary text. Bytes store small numbers from 0 to 255.");
  if (isPrint && text === "print" && parent === "CallExpression") return meaning("Function", "The callable being invoked. The following arguments are passed into it.", "green", directPrintText !== undefined ? `print shows something in the output. Here, we give it the text “${directPrintText}” to show.` : "print shows something in the output. The values inside its parentheses tell it what to show.");
  if (isPrint && parent === "ArgList" && text === "(") return meaning("Open", "Begins the argument list: values passed into this call.", "orange", "Starts the part where you tell print what to show.");
  if (isPrint && parent === "ArgList" && text === ")") return meaning("Close", "Ends the argument list: values passed into this call.", "orange", "Closes this use of print.");
  if (isPrint && name === "String" && parent === "ArgList") return meaning("Text", "A string: text enclosed in quotation marks. Punctuation inside belongs to the text.", "blue", "The text to show. Quotes mark where the text starts and ends; the outside quotes are not shown.");

  if (/Comment/.test(name)) return meaning("Comment", "A note for the reader, not an instruction to run.");
  if (name === "Text" && /^\s+$/.test(text)) return meaning("", "Spaces help separate or align the HTML source.");
  if (name === "⚠") return meaning("Code", "This fragment could not be classified confidently. Check the exact source and its surrounding lines.");
  if (/FormatString|TemplateString/.test(name)) return meaning("Text template", "Text with embedded expressions. Those expressions are evaluated and inserted into the resulting string.", "blue");
  if (/RegExp/.test(name)) return meaning("Pattern", "A regular-expression pattern used to match text.", "blue");
  if (/String|AttributeValue/.test(name)) return meaning(name === "AttributeValue" ? "Value" : "Text", name === "AttributeValue" ? "The value supplied for this HTML attribute." : "A string: text enclosed in quotation marks. Punctuation inside belongs to the text.", "blue");
  if (name === "Text" || name === "JSXText") return meaning("Text", "Text content rendered inside the surrounding element.", "blue");
  if (/Number/.test(name) && ["javascript", "typescript", "react"].includes(language) && /^(?:0[xX][0-9a-fA-F_]+|0[bB][01_]+|0[oO][0-7_]+|[0-9][0-9_]*)n$/.test(text)) return meaning("BigInt", "An integer literal of type bigint, distinct from the Number type. The n suffix marks BigInt; ordinary arithmetic cannot mix it directly with Number values.", "blue");
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
    const windowWord = ["PARTITION", "RANGE", "ROWS", "UNBOUNDED", "PRECEDING", "FOLLOWING", "CURRENT", "ROW"].includes(upper);
    let inWindow = false;
    for (let parent = node.parent; parent; parent = parent.parent) {
      if (parent.name === "Parens" && parent.prevSibling && source.slice(parent.prevSibling.from, parent.prevSibling.to).toUpperCase() === "OVER") { inWindow = true; break; }
    }
    if ((windowWord && !inWindow) || (upper === "OVER" && node.prevSibling?.name !== "Parens") || (upper === "FILTER" && !nextIsParen)) return meaning("SQL name", "Names a table, column, alias, or other SQL object in this position.", "green");
    if (/^(?:Keyword|Identifier|QuotedIdentifier)$/.test(name) && ["FROM", "JOIN", "UPDATE", "INTO"].includes(previousWord)) return meaning("Table or query", "Names the table or named query whose rows this part uses.", "green", "Names the table or named query whose rows this part uses.");
    if (/^(?:Identifier|QuotedIdentifier)$/.test(name) && ["SELECT", "DISTINCT"].includes(previousWord) && !nextIsParen) return meaning("Column", "Reads the value in this named column for the selected row.", "green", "Reads the value in this named column for the selected row.");
    if ((/^(?:Keyword|Identifier|QuotedIdentifier)$/.test(name) && namePosition) || cteName || (sqlFunctions.has(upper) && !nextIsParen)) return meaning("SQL name", "Names a table, column, alias, or other SQL object in this position.", "green");
    const functions: Record<string, [string, string]> = {
      COUNT: ["Count", "Counts rows with COUNT(*), or known values with COUNT(column). NULL column values are skipped."],
      SUM: ["Add values", "Adds the known values. With no known values to add, the result is NULL."],
      AVG: ["Find the average", "Adds the known numeric values and divides by how many there are. NULL values are skipped."],
      COALESCE: ["First known value", "Returns the first value that is not NULL. If all are NULL, the result is NULL."],
      NULLIF: ["Missing if equal", "Returns NULL when the two inputs are equal. Otherwise, returns the first input."],
      TRIM: ["Trim the edges", "Removes characters from the ends of text. With no second input, it removes ordinary spaces."],
      LENGTH: ["Measure length", "Counts characters in text, or bytes in binary data. For text, it stops at an embedded zero character."],
      SUBSTR: ["Take part of text", "Reads part of the text. A positive starting position counts from 1."],
      CAST: ["Convert a value", "Converts this value to the type after AS. Conversion rules depend on the requested type."],
      ROW_NUMBER: ["Number each row", "Gives each row a different number, starting at 1, in the window's order."],
      RANK: ["Rank with gaps", "Gives tied rows the same rank. Later ranks leave a gap for the tied rows."],
      DENSE_RANK: ["Rank without gaps", "Gives tied rows the same rank. The next different value gets the next rank."],
      LAG: ["Look back", "Reads a value from an earlier row in this window's order. The offset counts rows, not time."],
      CHANGES: ["Count last write", "Reports how many rows the most recently completed direct INSERT, UPDATE, or DELETE changed."],
      DATE: ["Work with a date", "Returns a date as year-month-day text after applying any listed changes."],
    };
    if (sqlFunctions.has(upper) && nextIsParen) {
      const info = functions[upper];
      return info ? meaning(info[0], info[1], "green", info[1]) : meaning("Function", "Calls this SQL function with the parenthesized arguments.", "green");
    }
    if (name === "Keyword") {
      const words: Record<string, [string, string]> = {
        EXPLAIN: ["Inspect the plan", "With QUERY PLAN, reports how SQLite plans to find the answer instead of returning that answer."],
        QUERY: ["Query plan", "With EXPLAIN and PLAN, asks for the query's planned strategy."],
        PLAN: ["Planned strategy", "Completes EXPLAIN QUERY PLAN. Its report is not a speed measurement."],
        PRAGMA: ["Database setting", "Reads or changes a SQLite setting, such as foreign-key enforcement."],
        COLUMN: ["Table column", "Names the column being added or renamed."],
        STRICT: ["Require allowed types", "Makes this SQLite table reject values that cannot be stored in its declared types without loss."],
        KEY: ["Key values", "Completes PRIMARY KEY or FOREIGN KEY, which identifies rows or links to another table."],
        FOREIGN: ["Link to a parent", "Starts FOREIGN KEY, a rule that connects these values to a key in another table."],
        TO: ["Target name", "Names the rollback point or new name chosen by the preceding instruction."],
        TEMP: ["For this connection", "Makes this table or view temporary, lasting only for this database connection."],
        SELECT: ["Choose values", "Chooses the columns or calculated values to return."],
        FROM: ["Read from", "Names the table or query that supplies these rows."],
        WHERE: ["Keep matching rows", "Keeps rows only when the following condition is true. False and unknown do not pass."],
        AS: ["Give a name", "Gives this result a name, or introduces the query that defines a named result."],
        DISTINCT: ["Remove repeats", "Keeps one copy of each complete selected row."],
        ORDER: ["Set the order", "Starts ORDER BY, which chooses how rows are ordered here."],
        BY: ["Use these values", "Names the values used by the preceding ORDER, GROUP, or PARTITION instruction."],
        ASC: ["Smallest first", "Orders these values from low to high."],
        DESC: ["Largest first", "Orders these values from high to low."],
        LIMIT: ["Limit the rows", "Sets a maximum number of result rows to return."],
        OFFSET: ["Skip first rows", "Skips this many rows before returning the next part."],
        GROUP: ["Make groups", "Starts GROUP BY, which puts equal grouping values together for calculations."],
        HAVING: ["Keep matching groups", "Keeps groups whose following condition is true."],
        AND: ["Both conditions", "The combined test is true only when both tests are true."],
        OR: ["Either condition", "The combined test is true when at least one test is true."],
        NOT: ["Negate the test", "Reverses true and false. An unknown result stays unknown. It also forms rules such as NOT NULL."],
        NULL: ["Missing value", "Marks a value that is not known. Use IS NULL to test for it."],
        IS: ["Test including NULL", "Compares values using a test that can handle NULL. IS NULL checks for a missing value."],
        IN: ["In this collection", "Tests whether a value matches a value in the following list or query. NULL can make the answer unknown."],
        BETWEEN: ["Inside both limits", "Tests a range that includes both endpoints."],
        LIKE: ["Match text", "Compares text with a pattern. Percent matches any length; underscore matches one character."],
        ESCAPE: ["Choose an escape", "Names the character that makes the next pattern character literal."],
        CASE: ["Choose a value", "Starts a choice that returns one value."],
        WHEN: ["Check this case", "Gives the condition for this case or trigger."],
        THEN: ["Use this value", "Gives the value to return when this case matches."],
        ELSE: ["Otherwise", "Gives the fallback when no earlier case matches."],
        END: ["Finish this part", "Closes this CASE choice or trigger body."],
        JOIN: ["Connect rows", "Combines rows from two sources using the join's matching rule."],
        LEFT: ["Keep the left rows", "In LEFT JOIN, keeps every left row, even if the right side has no match."],
        ON: ["Join or object rule", "In a join, gives the matching rule. In a definition, links an index or trigger to its table or action."],
        EXISTS: ["Any matching row?", "Is true when the following query finds at least one row."],
        WITH: ["Name a query", "Starts a named query that the following main query can use."],
        RECURSIVE: ["Allow repeated steps", "Lets a named query use its earlier results to find more rows."],
        UNION: ["Combine results", "Combines rows from the two queries. Without ALL, repeated whole rows appear once."],
        ALL: ["Keep repeats", "With UNION ALL, keeps repeated rows when combining results."],
        INTERSECT: ["In both results", "Keeps distinct rows found in both queries."],
        EXCEPT: ["Only in the first", "Keeps distinct rows from the first query that are absent from the second."],
        OVER: ["Choose the window", "Sets the rows and order used by this window calculation, while keeping individual result rows."],
        PARTITION: ["Separate lists", "Starts PARTITION BY, which gives each group its own window calculation."],
        ROWS: ["Count row positions", "Defines a window frame by row positions."],
        RANGE: ["Use ordered values", "Defines a window frame by ordered values. CURRENT ROW includes tied values."],
        UNBOUNDED: ["No distance limit", "With PRECEDING, starts at the beginning. With FOLLOWING, reaches the end."],
        PRECEDING: ["Earlier rows", "Points toward rows before the current row in the window's order."],
        CURRENT: ["This row", "With ROW, marks the current row or its tied group, depending on the frame."],
        ROW: ["Row boundary", "Completes a frame boundary such as CURRENT ROW."],
        FILTER: ["Filter one calculation", "Sends only matching rows into the aggregate immediately before it."],
        CREATE: ["Create an object", "Starts the definition of a table, view, index, or trigger."],
        TABLE: ["Stored rows", "Names a table: stored rows organized into columns."],
        VIEW: ["Saved query", "Names a view: a saved query that reads its sources when used."],
        INDEX: ["Help find rows", "Names an index that can help a database find rows."],
        INSERT: ["Add rows", "Adds new rows to a table."],
        INTO: ["Put rows here", "Names the table receiving the new rows."],
        VALUES: ["Supply values", "Lists values for the new rows."],
        UPDATE: ["Change rows", "Starts a change to existing rows."],
        SET: ["Set column values", "Names the columns to change and their new values."],
        DELETE: ["Remove rows", "Removes rows selected by this statement's conditions."],
        DEFAULT: ["Value when omitted", "Supplies this value when an insert leaves the column out."],
        CHECK: ["Check a row rule", "Rejects a row when this rule is false. NULL passes, so use NOT NULL too if a known value is required."],
        UNIQUE: ["Prevent repeats", "Requires different known keys. SQLite can allow more than one NULL in a UNIQUE key."],
        PRIMARY: ["Identify each row", "Starts PRIMARY KEY, the key chosen to identify each row."],
        REFERENCES: ["Point to a parent", "Names the parent table and key for a foreign-key link."],
        CASCADE: ["Follow the parent change", "Applies the parent action to linked child rows, such as deleting them after their parent is deleted."],
        BEGIN: ["Start a group", "Starts a transaction, or the body of a trigger when used in its definition."],
        COMMIT: ["Save the transaction", "Finishes the transaction and keeps its changes."],
        ROLLBACK: ["Undo changes", "Undoes an open transaction, or returns to the named savepoint after TO."],
        SAVEPOINT: ["Mark a return point", "Creates a named point that part of a transaction can roll back to."],
        RELEASE: ["Remove the savepoint", "Removes the named savepoint. An inner release does not commit an outer transaction."],
        ALTER: ["Change the table shape", "Starts a supported change to an existing table's columns or name."],
        RENAME: ["Change a name", "Changes the name without replacing the stored values."],
        ADD: ["Add a column", "In ALTER TABLE, adds a new column."],
        RETURNING: ["Return changed values", "Sends values from the directly changed rows back as output. It does not commit an open transaction."],
        TRIGGER: ["Automatic work", "Defines work that runs when the chosen database event happens."],
        AFTER: ["After the row change", "Runs this trigger's work after the chosen row event."],
        CONFLICT: ["Handle a repeated key", "In ON CONFLICT, chooses what to do when a uniqueness rule would be broken."],
      };
      const info = words[upper];
      return info ? meaning(info[0], info[1], "purple", info[1]) : meaning("SQL keyword", "A SQL instruction or structural word in this statement.", "purple");
    }
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
  if (language === "python" && name === "VariableName") {
    if (parent === "CapturePattern") return text === "_"
      ? meaning("Any value", "A wildcard pattern that does not bind a name.", "green", "Accepts any value here without giving it a new name.")
      : meaning("Name matched value", "Captures the matched value under this name.", "green", "Gives the matched value this name. It does not compare against an older value with the same name.");
    if (parent === "AssignStatement" || parent === "UpdateStatement") {
      let lastAssignment: SyntaxNode | null = null;
      for (let part = node.parent?.firstChild; part; part = part.nextSibling) if (part.name === "AssignOp" || part.name === "UpdateOp") lastAssignment = part;
      if (lastAssignment && node.to <= lastAssignment.from) return meaning("Name", "Names the target receiving the assignment result.", "green", parent === "UpdateStatement" ? "Python reads this name's current value, then stores the updated value under the same name." : "Receives the value worked out on the right of the equals sign.");
    }
    if (parent === "ForStatement" || /Comprehension/.test(parent)) {
      let afterFor = false;
      for (let part = node.prevSibling; part; part = part.prevSibling) {
        if (part.name === "in") break;
        if (part.name === "for") { afterFor = true; break; }
      }
      if (afterFor) return meaning("Item name", "Receives an item or unpacked part for this loop iteration.", "green", "Receives the current item, or its part when the loop uses several names.");
    }
  }
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
  if (["javascript", "typescript", "react"].includes(language)) {
    if (parent === "BinaryExpression") {
      const operations: Record<string, [string, string]> = {
        "*": ["Multiply", "Multiplies the numeric values on either side."],
        "**": ["Power", "Raises the value on the left to the power on the right."],
        "/": ["Divide", "Divides the value on the left by the value on the right."],
        "-": ["Subtract", "Subtracts the value on the right from the value on the left."],
        "+": ["Add or join", "Adds numeric values, or joins text when either converted value is text."],
        "%": ["Remainder", "Finds the remainder after dividing the value on the left by the value on the right."],
      };
      const operation = operations[text];
      if (operation) return meaning(operation[0], operation[1], "purple", operation[1]);
    }
    if (name === "Star") {
      if (parent === "ExportDeclaration" && node.nextSibling?.name === "as") return meaning("Export namespace", "Exports one namespace object containing the other module's exports, including its default export when present.", "purple", "Exports one namespace object containing the other module's exports, including its default export when present.");
      const uses: Record<string, [string, string]> = {
        FunctionDeclaration: ["Generator", "Makes this function a generator that can pause at yield to provide values."],
        FunctionExpression: ["Generator", "Makes this function a generator that can pause at yield to provide values."],
        YieldExpression: ["Yield from", "Passes on the values produced by the iterable after yield*."],
        ImportDeclaration: ["Module namespace", "With as, imports the module's exports through one named namespace object."],
        ExportDeclaration: ["Re-export names", "Re-exports named exports from another module. Its default export is not included unless explicitly named."],
      };
      const use = uses[parent];
      if (use) return meaning(use[0], use[1], "purple", use[1]);
    }
    const words: Record<string, [string, string]> = {
      function: ["Define function", "Starts a function: a reusable set of instructions. Its body runs when the function is called."],
      const: ["Set once", "Creates a name for this value. This name cannot be assigned a different value later."],
      let: ["Changeable name", "Creates a name that can be assigned a new value within this group of code."],
      return: ["Give back", "Ends this function call and gives a result to its caller. With no value after return, the result is undefined."],
      if: ["Check", "Runs the following part when this condition counts as true."],
      else: ["Otherwise", "Runs this part when the earlier condition was false."],
      for: ["Repeat", "Starts a loop. Its header says which values to visit or when to keep repeating."],
      of: ["Items from", "Chooses the iterable whose values this for loop visits."],
      in: ["Property in", "In a for loop, visits enumerable text property names, including inherited ones. As an operator, checks whether an own or inherited property exists."],
      while: ["Repeat if", "Checks the condition before each repeat. The loop continues while it counts as true."],
      break: ["Leave this part", "Leaves the nearest loop or switch. A label can choose a specific enclosing statement."],
      continue: ["Next repeat", "Skips the rest of this loop pass and continues with the next update or check."],
      switch: ["Choose a case", "Compares one value with the case values to choose where to start running."],
      case: ["Matching case", "Marks a value to compare in this switch. Execution can continue into the next case unless it leaves the switch."],
      default: ["Default", "In a switch, marks the fallback when no case matches. In an export, marks the module's default export."],
      try: ["Try", "Starts work whose errors the following catch can handle."],
      catch: ["Handle error", "Runs when the try part throws an error. The name in parentheses receives that error."],
      finally: ["Finish up", "Runs when leaving the try statement, on success or failure. A return or throw here can replace the earlier outcome."],
      throw: ["Signal an error", "Stops the normal steps and sends this value as an error to a matching catch, if there is one."],
      class: ["Define class", "Starts a class that describes a kind of object you can create."],
      new: ["Create instance", "Calls a constructor to create an instance."],
      this: ["This receiver", "Uses the receiver for this call. In an ordinary object method call, it is the object before the dot. An arrow function keeps the surrounding this."],
      extends: ["Build on class", "Chooses the parent class whose behavior this class can inherit."],
      super: ["Use parent", "In a child constructor, super(...) calls the parent constructor. In a method, super.name selects a parent property or method on the same receiver."],
      static: ["On the class", "Puts this member on the class itself, rather than on each instance."],
      get: ["Read through getter", "Defines code that runs when this property is read."],
      set: ["Write through setter", "Defines code that receives a value when this property is assigned."],
      async: ["Async function", "Marks a function that returns a Promise, or a generator that supplies values asynchronously."],
      await: ["Wait for result", "Waits here for a result. The rest of the application can keep working while this function waits."],
      yield: ["Give next item", "Provides a value and pauses this generator until another value is requested."],
      import: ["Import", "Makes exports from another module available in this file."],
      export: ["Share from module", "Makes this value or declaration available for other modules to import."],
      from: ["From module", "Names the module that provides these imports or re-exports."],
      typeof: ["Kind of value", "Gives a text label for the value's kind. Arrays and null both report object, so they need extra checks."],
      instanceof: ["Instance check", "Checks the constructor's instance rule, normally by looking for its prototype in the object's prototype chain."],
      delete: ["Remove property", "Tries to remove an object property. It does not directly destroy the object."],
    };
    const detail = words[text];
    if (detail) return meaning(detail[0], detail[1], "purple", detail[1]);
    if (text === "++" || text === "--") return meaning(text === "++" ? "Add one" : "Subtract one", text === "++" ? "Increases this numeric value by one. After a name, it produces the old value; before a name, the updated value." : "Decreases this numeric value by one. After a name, it produces the old value; before a name, the updated value.", "orange");
    if (text === "===" || text === "!==") return meaning(text === "===" ? "Strictly equal?" : "Strictly different?", text === "===" ? "Checks equality without converting types. Objects must be the same object, and NaN is not equal to itself." : "Checks inequality without converting types. Different objects and different types are unequal; NaN is also unequal to itself.", "orange");
  }
  const symbol = punctuation(text, language, parent, family);
  if (symbol) return symbol;
  if (language === "python") {
    // The same word can have a different job in a loop, a choice, or error handling.
    if (text === "import") return meaning("Import", "Loads a module or imports selected names into this scope.", "purple", "Makes another module, or selected names from it, available to use here.");
    if (text === "from" && parent === "ImportStatement") return meaning("From module", "Names the module that supplies the requested imports.", "purple", "Says which module the imported names come from.");
    if (text === "as" && parent === "ImportStatement") return meaning("Use this name", "Chooses a local alias for the imported module or name.", "purple", "Gives the imported module or value a name to use in this file.");
    if (text === "as" && parent === "WithStatement") return meaning("Name the result", "Binds the context manager's enter result to the following target.", "purple", "Gives the setup result the name written after as. For an opened file, this lets you use that file inside the block.");
    if (text === "as" && parent === "TryStatement") return meaning("Name the error", "Binds the handled exception to this name for the except block.", "purple", "Gives the handled error a name so this except part can use its details.");
    if (text === "from" && parent === "YieldStatement") return meaning("Items from", "Delegates iteration to another iterable.", "purple", "Passes on items from the collection or generator after from.");
    if (text === "from" && parent === "RaiseStatement") return meaning("Caused by", "Sets the explicit cause of the raised exception.", "purple", "Connects this error to the error that caused it. With from None, Python hides the earlier error in the displayed message.");
    if (text === "else") {
      if (parent === "ForStatement" || parent === "WhileStatement") return meaning("No break", "Runs after the loop completes normally, without break.", "purple", "Runs when this loop finishes without break. Leaving the loop with return or an error also skips this part.");
      if (parent === "TryStatement") return meaning("No error", "Runs when the try block completes normally without an exception.", "purple", "Runs when the try part finishes normally without an error. A return, break, or continue also skips this part.");
      return meaning("Otherwise", "Introduces an alternative branch.", "purple", parent === "ConditionalExpression" ? "Chooses the value after else when the condition is false." : "Runs this part when all earlier checks in this choice were false.");
    }
    if (text === "in") return meaning(/ForStatement|Comprehension/.test(parent) ? "From" : "Contains?", "Selects an iterable for a loop, or tests membership in a collection.", "purple", /ForStatement|Comprehension/.test(parent) ? "Names the collection whose items this loop visits." : "Checks whether the value on the left is in the collection on the right. For a dictionary, it checks the keys.");
    const words: Record<string, [string, string]> = {
      def: ["Define", "Starts a function definition. Its indented instructions run when the function is called."],
      return: ["Give back", "Ends this function call and gives its result back. Without a value after return, the result is None."],
      if: ["Check", "Checks a condition to choose which instructions or value to use."],
      elif: ["Next check", "Checks this condition only if the earlier conditions in this choice were false."],
      for: ["Each item", "Visits items one at a time, using each item in the repeated instructions."],
      while: ["Repeat if", "Checks the condition before each repeat. The loop stops when it is false, or when the code leaves the loop."],
      break: ["Stop loop", "Leaves the nearest loop now. Its else part, if present, is skipped."],
      continue: ["Next repeat", "Skips the rest of this repeat and moves to the next loop check or item."],
      pass: ["Do nothing", "Does nothing. It fills a place where Python requires an instruction."],
      lambda: ["Small function", "Creates a function from one expression. The value of that expression is its result."],
      and: ["And", "Uses the left value if it counts as false. Otherwise, it reads and uses the right value."],
      or: ["Or", "Uses the left value if it counts as true. Otherwise, it reads and uses the right value."],
      not: ["Reverse check", "Reverses a true-or-false check. In not in or is not, it reverses that comparison."],
      is: ["Same object?", "Checks whether the two values are the very same object, rather than just equal values."],
      try: ["Try", "Starts instructions whose errors the following except parts may handle."],
      except: ["Handle error", "Runs this part when a matching error comes from the try part."],
      finally: ["Finish up", "Runs when leaving the try statement, whether it finished normally, returned, or raised an error."],
      yield: ["Give an item", "Pauses this generator to provide items to the code reading it. With yield from, those items come from another iterable."],
      class: ["Define class", "Starts a class. A class describes a kind of object you can make."],
      with: ["Manage cleanup", "Lets a manager set up and clean up after this block. For an opened file, it closes the file when leaving the block."],
      raise: ["Signal an error", "Raises an error. Normal steps stop here unless the program handles that error."],
      assert: ["Check an assumption", "Raises AssertionError if this check is false. Python can skip asserts when run with optimization, so use ordinary checks for required input rules."],
      del: ["Remove", "Removes the selected name, item, or attribute. Removing a name does not always remove the object it referred to."],
      async: ["Async", "Marks asynchronous code. It can work with operations that pause while waiting."],
      await: ["Wait for a result", "Waits for an async result. While it needs to wait, other ready async tasks can run."],
      match: ["Match shape", "Looks for the first case whose pattern and extra checks fit this value."],
      case: ["Try pattern", "Checks this pattern against the value after match. A matching pattern can also give names to parts of that value."],
      global: ["Module name", "Makes assignments to this name use the module's name, rather than a new local name."],
      nonlocal: ["Outer name", "Makes this function use an existing name from a surrounding function when assigning a value."],
    };
    const detail = words[text];
    if (detail) return meaning(detail[0], detail[1], "purple", detail[1]);
  }
  if (keywords.has(text) || name === "Keyword" || name === "keyword") {
    const descriptions: Record<string, string> = { def: "Begins a Python function definition.", function: "Begins a JavaScript function definition.", return: "Sends a value back from the current function.", const: "Declares a binding that cannot be reassigned.", let: "Declares a block-scoped variable.", if: "Starts a condition that controls which code runs.", else: "Introduces an alternative branch.", for: "Starts a loop.", while: "Repeats code while a condition holds.", import: "Brings names or modules into this file.", await: "Waits for the result of an asynchronous operation.", async: "Marks an asynchronous function or operation." };
    return meaning("Keyword", descriptions[text] ?? "A reserved word that gives this code its structure or behavior.", "purple");
  }
  if (/Op|Operator|Logic/.test(name)) return meaning("Operator", "Operates on or compares the surrounding values.", "purple");
  if (/^\s+$/.test(text)) return blank;
  return meaning("Code", "A source fragment. Its precise role depends on the surrounding expression.");
}

// Only explain known Git actions directly after the command. The same word
// elsewhere may be a filename or a value, so it keeps its ordinary label.
const gitActionMeanings: Record<string, [string, string]> = {
  init: ["Start history", "Creates a Git repository in this folder."],
  config: ["Git setting", "Reads or changes a Git setting, such as the commit author name."],
  status: ["Show file state", "Shows staged, unstaged, and untracked file changes."],
  add: ["Stage changes", "Copies the selected changes into the next commit's staged version."],
  commit: ["Save a version", "Records the staged changes as a new commit."],
  diff: ["Compare versions", "Shows differences between the versions selected by this command."],
  log: ["Show history", "Shows saved commits from the selected history."],
  restore: ["Restore a version", "Replaces selected file contents from the requested saved or staged version."],
  switch: ["Choose a branch", "Changes the current branch; options can also create a branch."],
  merge: ["Combine histories", "Brings the selected branch's changes into the current branch."],
  stash: ["Set edits aside", "Works with locally saved unfinished changes."],
  show: ["Inspect a saved object", "Shows the selected saved object, such as a commit and its changes."],
  revert: ["Record an undo", "Reverses a commit's changes and normally records a new correcting commit."],
  "ls-files": ["List known files", "Lists files known to Git's index; options can select other file groups."],
  "rev-parse": ["Read a revision ID", "Resolves a revision name such as HEAD to its identifier."],
};
const gitStashMeanings: Record<string, [string, string]> = {
  push: ["Save unfinished edits", "Saves tracked unfinished changes in a stash; options can include more files."],
  list: ["List saved stashes", "Shows the stash entries that are still saved."],
  show: ["Inspect saved edits", "Shows the changes recorded in the selected stash."],
  apply: ["Restore and keep", "Applies saved stash changes while keeping the stash entry."],
  pop: ["Restore then remove", "Applies the stash and removes its entry if the apply succeeds."],
};

/** Fallback lexing never runs code. Unknown words remain names, not guessed functions. */
function fallbackTokens(source: string, language: string, base = 0): AnatomyToken[] {
  const result: AnatomyToken[] = [];
  const shell = language === "bash";
  const pattern = shell
    ? /\s+|#[^\r\n]*|\$\([^)]*\)|"(?:\\[\s\S]|[^"\\])*"|'[^']*'|\$\{[^}]*\}|\$[A-Za-z_][\w]*|&&|\|\||>>|<<|[|;<>]|[^\s|;<>"']+/g
    : language === "swift"
    ? /\s+|\/\/[^\r\n]*|\/\*[\s\S]*?\*\/|"""[\s\S]*?"""|"(?:\\[\s\S]|[^"\\])*"|`[^`]*`|#[A-Za-z_][\w]*|(?:\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)|[A-Za-z_$][\w$]*|===|!==|==|!=|<=|>=|->|\?\?|\?\.|\+=|-=|\*=|\/=|&&|\|\||\.\.<|\.\.\.|[^\s]/g
    : language === "rust"
    ? /\s+|\/\/[^\r\n]*|\/\*[\s\S]*?\*\/|#[^\r\n]*|"(?:\\[\s\S]|[^"\\])*"|'(?:\\(?:u\{[0-9a-fA-F]+\}|x[0-9a-fA-F]{2}|[^\r\n])|[^'\\\r\n])'|'[A-Za-z_][A-Za-z0-9_]*|(?:\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)|[A-Za-z_$][\w$]*|===|!==|==|!=|<=|>=|=>|->|\?\?|\?\.|\+\+|--|\+=|-=|\*\*|&&|\|\||\.\.\.|[^\s]/gu
    : /\s+|\/\/[^\r\n]*|\/\*[\s\S]*?\*\/|#[^\r\n]*|"""[\s\S]*?"""|"(?:\\[\s\S]|[^"\\])*"|'(?:\\[\s\S]|[^'\\])*'|`(?:\\[\s\S]|[^`\\])*`|(?:\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)|[A-Za-z_$][\w$]*|===|!==|==|!=|<=|>=|=>|->|\?\?|\?\.|\+\+|--|\+=|-=|\*\*|&&|\|\||\.\.\.|[^\s]/g;
  let commandNext = true;
  for (const match of source.matchAll(pattern)) {
    const text = match[0], from = match.index!, after = source.slice(from + text.length);
    let detail: Meaning;
    const previous = result.filter(t => t.label).at(-1)?.text ?? "";
    if (/^\s+$/.test(text)) { detail = blank; if (shell && /\n/.test(text)) commandNext = true; }
    else if ((language === "swift" && /^(?:\/\/|\/\*)/.test(text)) || ((shell || language === "toml" || language === "r") && text.startsWith("#"))) detail = meaning("Comment", "A note for the reader, not an instruction to run.");
    else if (shell) {
      if (["|", "&&", "||", ";"].includes(text)) { detail = meaning(text === "|" ? "Pipe" : "Control", text === "|" ? "Sends the first command's output into the next command." : "Controls when the next command runs.", "purple"); commandNext = true; }
      else if (/^[<>]/.test(text)) detail = meaning("Redirect", "Redirects command input or output to the following target.", "purple");
      else if (text.startsWith("$(")) { detail = meaning("Command result", "Uses the output of the command inside the parentheses.", "blue"); commandNext = false; }
      else if (/^[A-Za-z_]\w*=/.test(text) && commandNext) detail = meaning("Environment", "Sets a variable for the following command, or in the shell if no command follows.", "green");
      else if (commandNext) { detail = meaning("Command", "The program or shell command to run. This is not a function call with parentheses.", "green"); commandNext = false; }
      else if (source.slice(source.lastIndexOf("\n", from - 1) + 1, from).trim() === "git" && gitActionMeanings[text]) {
        const [label, explanation] = gitActionMeanings[text];
        detail = meaning(label, explanation, "purple", explanation);
      }
      else if (/^git\s+stash$/.test(source.slice(source.lastIndexOf("\n", from - 1) + 1, from).trim()) && gitStashMeanings[text]) {
        const [label, explanation] = gitStashMeanings[text];
        detail = meaning(label, explanation, "purple", explanation);
      }
      else if (text === "--" && /^git\s+(?:diff|restore|add|ls-files)\b/.test(source.slice(source.lastIndexOf("\n", from - 1) + 1, from))) detail = meaning("File paths next", "Ends the command options. The following words name files or paths.", "orange");
      else if (/^\$/.test(text)) detail = meaning("Variable", "Expands a shell variable into its value.", "green");
      else if (/^['"]/.test(text)) detail = meaning("Text", text.startsWith('"') ? "A quoted shell argument. Dollar-sign expressions may still expand inside double quotes." : "A quoted literal shell argument; single quotes keep its characters literal.", "blue");
      else detail = meaning(text.startsWith("-") ? "Option" : "Argument", text.startsWith("-") ? "An option that changes how the command runs." : "An argument passed to the command, such as a subcommand, filename, or value.", "blue");
    } else if (language === "r" && text.startsWith("`")) {
      detail = meaning("Name", "Backticks quote an R name, such as a column name containing spaces. They do not create a character string.", "green");
    } else if (language === "r" && /^['"]/.test(text)) {
      detail = meaning("Text", "An R character string: both single and double quotation marks delimit text. Dollar signs and #{...} do not interpolate values here.", "blue");
    } else if (language === "ruby" && text.startsWith('"') && /(?:^|[^\\])(?:\\\\)*#\{/.test(text)) {
      detail = meaning("Text template", "A Ruby double-quoted string with interpolation: expressions inside #{...} supply values within the text.", "blue");
    } else if (language === "rust" && text.startsWith("'")) {
      detail = text.endsWith("'") && text.length > 2
        ? meaning("Character", "A Rust char literal: one Unicode scalar value, not a String or a UTF-16 code unit.", "blue")
        : meaning("Lifetime / label", "Rust apostrophe notation names a lifetime, such as 'a or 'static. In loop-label syntax it names a loop; it is not a quoted character or string.", "purple");
    } else if (language === "go" && text.startsWith("'")) {
      detail = meaning("Rune", "A Go rune constant: a Unicode code point, with default type rune (an alias for int32). It is not a string or necessarily one UTF-8 byte.", "blue");
    } else if (language === "kotlin" && text.startsWith("'")) {
      detail = meaning("Character", "A Kotlin Char literal: one UTF-16 code unit, not a String. Some Unicode characters need two code units.", "blue");
    } else if (language === "java" && text.startsWith("'")) {
      detail = meaning("Character", "A Java char literal: one UTF-16 code unit, not a String. Some Unicode characters need two code units.", "blue");
    } else if (language === "c" && text.startsWith("'")) {
      detail = meaning("Character", "An ordinary C character constant, such as 'A' or an escaped newline. Its type is int, not char; it is not a string.", "blue");
    } else if (language === "cpp" && text.startsWith("'")) {
      detail = meaning("Character", "An ordinary single-character C++ literal, such as 'A' or an escaped newline, has type char; it is not a string.", "blue");
    } else if (language === "swift" && text.startsWith("`")) {
      detail = meaning("Name", "Backticks let a reserved Swift word be used as a name. This is not text in a string.", "green");
    } else if (/^['"`]/.test(text)) {
      const isKey = language === "json" && /^\s*:/.test(after);
      detail = meaning(isKey ? "Key" : /\\\(|\$\{/.test(text) ? "Text template" : "Text", isKey ? "Names a property in this JSON object." : /\\\(|\$\{/.test(text) ? "Quoted text containing expressions whose values are inserted into the text." : "A string: quoted text. Punctuation inside is part of that text.", isKey ? "green" : "blue");
    } else if (/^\d/.test(text)) detail = meaning("Number", "A numeric value, not quoted text.", "blue");
    else if (["true", "false", "null", "nil"].includes(text)) detail = meaning(text === "true" || text === "false" ? "Boolean" : "Empty value", text === "true" || text === "false" ? "A true-or-false value." : "Represents an absent or empty value.", "blue");
    else if (language === "swift" && text === "@") detail = meaning("Attribute", "Introduces a Swift attribute or property wrapper, such as @State.", "purple");
    else if (language === "swift" && text === "\\" && after.startsWith(".")) detail = meaning("Key path", "Begins a Swift key-path expression that refers to a property.", "purple");
    else if (language === "swift" && text === "?") detail = meaning("Optional / choice", "Marks an optional type or optional chaining, or separates the condition from a choice in a ternary expression.", "purple");
    else if (language === "swift" && text === "#expect") detail = meaning("Check a result", "Records a test failure if the condition inside the parentheses is false.", "purple");
    else if (language === "swift" && ["...", "..<"].includes(text)) detail = meaning("Range", text === "..<" ? "Includes the start and stops before the end value." : "Includes both ends of a range; in a parameter type it can also allow several inputs.", "purple");
    else if (language === "swift" && swiftCodeWord(text, previous, after)) {
      const [label, explanation] = swiftCodeWord(text, previous, after)!;
      detail = meaning(label, explanation, "purple", explanation);
    }
    else if (language === "swift" && keywords.has(text) && previous !== ".") detail = meaning("Keyword", "A word Swift uses for a special instruction.", "purple");
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

const csharpReviewedSources = new Map(reviewedCSharpAnatomy.map(row => [row.source.trimEnd(), row.parts]));
function reviewedCSharpTokens(source: string): AnatomyToken[] | null {
  // Only trailing whitespace may differ. All other edits need new compiler-derived ranges.
  const parts = csharpReviewedSources.get(source.trimEnd());
  if (!parts) return null;
  const result: AnatomyToken[] = [];
  let cursor = 0;
  for (const [from, to, meaningIndex] of parts) {
    const [label, explanation, tone] = csharpMeanings[meaningIndex];
    if (from < cursor || to > source.length) return null;
    if (from > cursor) result.push(...fallbackTokens(source.slice(cursor, from), "unknown", cursor));
    result.push({text: source.slice(from, to), from, to, label, explanation, plainExplanation: explanation, tone: tone as AnatomyTone});
    cursor = to;
  }
  if (cursor < source.length) result.push(...fallbackTokens(source.slice(cursor), "unknown", cursor));
  return result;
}
const cppReviewedSources = new Map(reviewedCppAnatomy.map(row => [row.source.trimEnd(), row.parts]));
function reviewedCppTokens(source: string): AnatomyToken[] | null {
  // Only trailing whitespace may differ. All other edits need new reviewed syntax ranges.
  const parts = cppReviewedSources.get(source.trimEnd());
  if (!parts) return null;
  const result: AnatomyToken[] = [];
  let cursor = 0;
  for (const [from, to, meaningIndex] of parts) {
    const [label, explanation, tone] = cppMeanings[meaningIndex];
    if (from < cursor || to > source.length) return null;
    if (from > cursor) result.push(...fallbackTokens(source.slice(cursor, from), "unknown", cursor));
    result.push({text: source.slice(from, to), from, to, label, explanation, plainExplanation: explanation, tone: tone as AnatomyTone});
    cursor = to;
  }
  if (cursor < source.length) result.push(...fallbackTokens(source.slice(cursor), "unknown", cursor));
  return result;
}
const javaReviewedSources = new Map(reviewedJavaAnatomy.map(row => [row.source.trimEnd(), row.parts]));
function reviewedJavaTokens(source: string): AnatomyToken[] | null {
  // Only trailing whitespace may differ. All other edits need new reviewed syntax ranges.
  const parts = javaReviewedSources.get(source.trimEnd());
  if (!parts) return null;
  const result: AnatomyToken[] = [];
  let cursor = 0;
  for (const [from, to, meaningIndex] of parts) {
    const [label, explanation, tone] = javaMeanings[meaningIndex];
    if (from < cursor || to > source.length) return null;
    if (from > cursor) result.push(...fallbackTokens(source.slice(cursor, from), "unknown", cursor));
    result.push({text: source.slice(from, to), from, to, label, explanation, plainExplanation: explanation, tone: tone as AnatomyTone});
    cursor = to;
  }
  if (cursor < source.length) result.push(...fallbackTokens(source.slice(cursor), "unknown", cursor));
  return result;
}
const cReviewedSources = new Map(reviewedCAnatomy.map(row => [row.source.trimEnd(), row.parts]));
function reviewedCTokens(source: string): AnatomyToken[] | null {
  // Only trailing whitespace may differ. All other edits need new reviewed syntax ranges.
  const parts = cReviewedSources.get(source.trimEnd());
  if (!parts) return null;
  const result: AnatomyToken[] = [];
  let cursor = 0;
  for (const [from, to, meaningIndex] of parts) {
    const [label, explanation, tone] = cMeanings[meaningIndex];
    if (from < cursor || to > source.length) return null;
    if (from > cursor) result.push(...fallbackTokens(source.slice(cursor, from), "unknown", cursor));
    result.push({text: source.slice(from, to), from, to, label, explanation, plainExplanation: explanation, tone: tone as AnatomyTone});
    cursor = to;
  }
  if (cursor < source.length) result.push(...fallbackTokens(source.slice(cursor), "unknown", cursor));
  return result;
}
const kotlinReviewedSources = new Map(reviewedKotlinAnatomy.map(row => [row.source.trimEnd(), row.parts]));
function reviewedKotlinTokens(source: string): AnatomyToken[] | null {
  // Only trailing whitespace may differ. All other edits need new reviewed syntax ranges.
  const parts = kotlinReviewedSources.get(source.trimEnd());
  if (!parts) return null;
  const result: AnatomyToken[] = [];
  let cursor = 0;
  for (const [from, to, meaningIndex] of parts) {
    const [label, explanation, tone] = kotlinMeanings[meaningIndex];
    if (from < cursor || to > source.length) return null;
    if (from > cursor) result.push(...fallbackTokens(source.slice(cursor, from), "unknown", cursor));
    result.push({text: source.slice(from, to), from, to, label, explanation, plainExplanation: explanation, tone: tone as AnatomyTone});
    cursor = to;
  }
  if (cursor < source.length) result.push(...fallbackTokens(source.slice(cursor), "unknown", cursor));
  return result;
}
const goReviewedSources = new Map(reviewedGoAnatomy.map(row => [row.source.trimEnd(), row.parts]));
function reviewedGoTokens(source: string): AnatomyToken[] | null {
  // Only trailing whitespace may differ. All other edits need new reviewed syntax ranges.
  const parts = goReviewedSources.get(source.trimEnd());
  if (!parts) return null;
  const result: AnatomyToken[] = [];
  let cursor = 0;
  for (const [from, to, meaningIndex] of parts) {
    const [label, explanation, tone] = goMeanings[meaningIndex];
    if (from < cursor || to > source.length) return null;
    if (from > cursor) result.push(...fallbackTokens(source.slice(cursor, from), "unknown", cursor));
    result.push({text: source.slice(from, to), from, to, label, explanation, plainExplanation: explanation, tone: tone as AnatomyTone});
    cursor = to;
  }
  if (cursor < source.length) result.push(...fallbackTokens(source.slice(cursor), "unknown", cursor));
  return result;
}
const rustReviewedSources = new Map(reviewedRustAnatomy.map(row => [row.source.trimEnd(), row.parts]));
function reviewedRustTokens(source: string): AnatomyToken[] | null {
  // Only trailing whitespace may differ. All other edits need new reviewed syntax ranges.
  const parts = rustReviewedSources.get(source.trimEnd());
  if (!parts) return null;
  const result: AnatomyToken[] = [];
  let cursor = 0;
  for (const [from, to, meaningIndex] of parts) {
    const [label, explanation, tone] = rustMeanings[meaningIndex];
    if (from < cursor || to > source.length) return null;
    if (from > cursor) result.push(...fallbackTokens(source.slice(cursor, from), "unknown", cursor));
    result.push({text: source.slice(from, to), from, to, label, explanation, plainExplanation: explanation, tone: tone as AnatomyTone});
    cursor = to;
  }
  if (cursor < source.length) result.push(...fallbackTokens(source.slice(cursor), "unknown", cursor));
  return result;
}
const phpReviewedSources = new Map(reviewedPHPAnatomy.map(row => [row.source.trimEnd(), row.parts]));
function reviewedPHPTokens(source: string): AnatomyToken[] | null {
  // Only trailing whitespace may differ. All other edits need new reviewed syntax ranges.
  const parts = phpReviewedSources.get(source.trimEnd());
  if (!parts) return null;
  const result: AnatomyToken[] = [];
  let cursor = 0;
  for (const [from, to, meaningIndex] of parts) {
    const [label, explanation, tone] = phpMeanings[meaningIndex];
    if (from < cursor || to > source.length) return null;
    if (from > cursor) result.push(...fallbackTokens(source.slice(cursor, from), "unknown", cursor));
    result.push({text: source.slice(from, to), from, to, label, explanation, plainExplanation: explanation, tone: tone as AnatomyTone});
    cursor = to;
  }
  if (cursor < source.length) result.push(...fallbackTokens(source.slice(cursor), "unknown", cursor));
  return result;
}
const rubyReviewedSources = new Map(reviewedRubyAnatomy.map(row => [row.source.trimEnd(), row.parts]));
function reviewedRubyTokens(source: string): AnatomyToken[] | null {
  // Only trailing whitespace may differ. All other edits need new reviewed syntax ranges.
  const parts = rubyReviewedSources.get(source.trimEnd());
  if (!parts) return null;
  const result: AnatomyToken[] = [];
  let cursor = 0;
  for (const [from, to, meaningIndex] of parts) {
    const [label, explanation, tone] = rubyMeanings[meaningIndex];
    if (from < cursor || to > source.length) return null;
    if (from > cursor) result.push(...fallbackTokens(source.slice(cursor, from), "unknown", cursor));
    result.push({text: source.slice(from, to), from, to, label, explanation, plainExplanation: explanation, tone: tone as AnatomyTone});
    cursor = to;
  }
  if (cursor < source.length) result.push(...fallbackTokens(source.slice(cursor), "unknown", cursor));
  return result;
}
const rReviewedSources = new Map(reviewedRAnatomy.map(row => [row.source.trimEnd(), row.parts]));
function reviewedRTokens(source: string): AnatomyToken[] | null {
  // Only trailing whitespace may differ. All other edits need new reviewed syntax ranges.
  const parts = rReviewedSources.get(source.trimEnd());
  if (!parts) return null;
  const result: AnatomyToken[] = [];
  let cursor = 0;
  for (const [from, to, meaningIndex] of parts) {
    const [label, explanation, tone] = rMeanings[meaningIndex];
    if (from < cursor || to > source.length) return null;
    if (from > cursor) result.push(...fallbackTokens(source.slice(cursor, from), "unknown", cursor));
    result.push({text: source.slice(from, to), from, to, label, explanation, plainExplanation: explanation, tone: tone as AnatomyTone});
    cursor = to;
  }
  if (cursor < source.length) result.push(...fallbackTokens(source.slice(cursor), "unknown", cursor));
  return result;
}
function parsedTokens(source: string, language: string): AnatomyToken[] {
  if (language === "rust") {
    const reviewed = reviewedRustTokens(source);
    if (reviewed) return reviewed;
  }
  if (language === "php") {
    const reviewed = reviewedPHPTokens(source);
    if (reviewed) return reviewed;
  }
  if (language === "ruby") {
    const reviewed = reviewedRubyTokens(source);
    if (reviewed) return reviewed;
  }
  if (language === "r") {
    const reviewed = reviewedRTokens(source);
    if (reviewed) return reviewed;
  }
  if (language === "go") {
    const reviewed = reviewedGoTokens(source);
    if (reviewed) return reviewed;
  }
  if (language === "kotlin") {
    const reviewed = reviewedKotlinTokens(source);
    if (reviewed) return reviewed;
  }
  if (language === "c") {
    const reviewed = reviewedCTokens(source);
    if (reviewed) return reviewed;
  }
  if (language === "java") {
    const reviewed = reviewedJavaTokens(source);
    if (reviewed) return reviewed;
  }
  if (language === "cpp") {
    const reviewed = reviewedCppTokens(source);
    if (reviewed) return reviewed;
  }
  if (language === "csharp") {
    const reviewed = reviewedCSharpTokens(source);
    if (reviewed) return reviewed;
  }
  if (language === "vtt" || language === "webvtt") return captionTokens(source);
  const parser = codeLanguage(language)?.language.parser;
  if (!parser) return fallbackTokens(source, language);
  const result: AnatomyToken[] = [];
  const visit = (node: SyntaxNode) => {
    // Strings and comments are meaningful whole expressions: never tokenize their punctuation as code.
    const atomic = /^(?:String|FormatString|TemplateString|TemplateType|RegExp|NumberLiteral|AttributeValue|Text|JSXText|DoctypeDecl|ColorLiteral)$/.test(node.name) || /Comment/.test(node.name) || (contextLanguage(node, language) === "css" && /Selector$/.test(node.name));
    if (atomic || !node.firstChild) {
      if (node.to > node.from) result.push({ text: source.slice(node.from, node.to), from: node.from, to: node.to, ...parserMeaning(node, source, language) });
      return;
    }
    for (let child: SyntaxNode | null = node.firstChild; child; child = child.nextSibling) visit(child);
  };
  const tree = parser.parse(source);
  visit(tree.topNode);
  const complete: AnatomyToken[] = [];
  let cursor = 0;
  for (const token of result) {
    if (token.from < cursor) continue;
    if (token.from > cursor) {
      const gap = fallbackTokens(source.slice(cursor, token.from), "unknown", cursor);
      // Lezer leaves these two Python markers in gaps between its named nodes.
      if (language === "python") for (const part of gap) {
        if (part.text === "/" && /^\s*[,)]/.test(source.slice(part.to)) && /,\s*$/.test(source.slice(0, part.from))
            && ancestors(tree.resolveInner(part.from)).includes("FunctionDefinition"))
          Object.assign(part, meaning("Positional inputs", "Inputs before this slash must be given by position, not by name.", "purple"));
        if (part.text === "->" && /\)\s*$/.test(source.slice(0, part.from)))
          Object.assign(part, meaning("Return type", "The type after the arrow describes the answer this function is expected to return.", "purple"));
      }
      complete.push(...gap);
    }
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
