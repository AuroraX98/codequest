// Reviewed sentence-for-sentence counterparts. Keep source text exact.
const readings = [
  {
    "source": "A program is a list of instructions the computer follows.",
    "simple": "A program tells the computer what to do, step by step.",
    "runtime": "python",
    "lesson": "python-01"
  },
  {
    "source": "A value is a piece of information, such as a name or an age.",
    "simple": "A value is one piece of information your code can use, like a name or a number.",
    "runtime": "python",
    "lesson": "python-01"
  },
  {
    "source": "Text is called a string in Python.",
    "simple": "In Python, “string” means text.",
    "runtime": "python",
    "lesson": "python-01"
  },
  {
    "source": "Write quotes around text: `\"Pepper\"` is a string.",
    "simple": "Put quotes around Pepper so Python knows it is text: `\"Pepper\"`.",
    "runtime": "python",
    "lesson": "python-01"
  },
  {
    "source": "You can also use matching single quotes.",
    "simple": "You may write `'Pepper'` instead. Use the same kind of quote at both ends.",
    "runtime": "python",
    "lesson": "python-01"
  },
  {
    "source": "The quotes mark where the text begins and ends;",
    "simple": "Quotes show Python where the text starts and stops.",
    "runtime": "python",
    "lesson": "python-01"
  },
  {
    "source": "they are not part of the displayed name.",
    "simple": "When Python shows the name, it leaves out the outside quotes.",
    "runtime": "python",
    "lesson": "python-01"
  },
  {
    "source": "Write an ordinary number such as `5` without quotes so it can be used in arithmetic.",
    "simple": "Write `5`, not `\"5\"`, when you want a number to calculate with.",
    "runtime": "python",
    "lesson": "python-01"
  },
  {
    "source": "A variable is a name that refers to a value.",
    "simple": "A variable is a name your code can use to find a value.",
    "runtime": "python",
    "lesson": "python-01"
  },
  {
    "source": "`pet_name = \"Pepper\"` assigns the string Pepper to the name pet_name.",
    "simple": "After this line, `pet_name` is the name you use to get the text Pepper.",
    "runtime": "python",
    "lesson": "python-01"
  },
  {
    "source": "The single equals sign `=` means assign the value on the right to the name on the left;",
    "simple": "With `=`, work out the right side first. Store that value under the name on the left.",
    "runtime": "python",
    "lesson": "python-01"
  },
  {
    "source": "it does not ask an equality question.",
    "simple": "One `=` stores a value. It does not check whether two things are equal.",
    "runtime": "python",
    "lesson": "python-01"
  },
  {
    "source": "Variable names cannot contain spaces or begin with a digit.",
    "simple": "Choose a name with no spaces. Its first character cannot be a number.",
    "runtime": "python",
    "lesson": "python-01"
  },
  {
    "source": "An underscore `_` can connect words.",
    "simple": "Use `_` instead of a space, as in `pet_name`.",
    "runtime": "python",
    "lesson": "python-01"
  },
  {
    "source": "Python distinguishes capital and small letters, so pet_name and Pet_name are different names.",
    "simple": "Capital letters matter: `pet_name` and `Pet_name` are two different names.",
    "runtime": "python",
    "lesson": "python-01"
  },
  {
    "source": "For the next examples, assume you have assigned `pet_age = 5`.",
    "simple": "For these examples, `pet_age` holds the number 5.",
    "runtime": "python",
    "lesson": "python-01"
  },
  {
    "source": "`print()` is a built-in function: a ready-made instruction Python provides for you to reuse.",
    "simple": "`print` is a tool Python already includes. Use it to show something in the output.",
    "runtime": "python",
    "lesson": "python-01"
  },
  {
    "source": "Calling a function asks it to run.",
    "simple": "To call a function means to ask that named tool to do its task.",
    "runtime": "python",
    "lesson": "python-01"
  },
  {
    "source": "Parentheses `()` contain what you pass to the function.",
    "simple": "Put the value you give the function between `(` and `)`.",
    "runtime": "python",
    "lesson": "python-01"
  },
  {
    "source": "In `print(pet_age)`, the argument is the value named pet_age, so it displays 5.",
    "simple": "`print(pet_age)` looks up the value of `pet_age`, which is 5, and shows 5.",
    "runtime": "python",
    "lesson": "python-01"
  },
  {
    "source": "In `print(\"pet_age\")`, the quotes make the argument literal text, so it displays pet_age.",
    "simple": "`print(\"pet_age\")` shows the words pet_age. The quotes tell Python not to look up the name.",
    "runtime": "python",
    "lesson": "python-01"
  },
  {
    "source": "A function's name without a call does not perform its action.",
    "simple": "Writing `print` alone does not show anything. Use parentheses to ask it to run.",
    "runtime": "python",
    "lesson": "python-01"
  },
  {
    "source": "The prefix `f` immediately before the quoted text makes an f-string, a formatted string.",
    "simple": "Put `f` just before the opening quote when you want to add values into your text.",
    "runtime": "python",
    "lesson": "python-01"
  },
  {
    "source": "The braces `{}` mark places where Python evaluates an expression and inserts its value.",
    "simple": "Inside an f-string, `{}` marks a place to put a value or a calculation’s result.",
    "runtime": "python",
    "lesson": "python-01"
  },
  {
    "source": "In `{pet_name}`, Python reads Pepper.",
    "simple": "Here, `{pet_name}` puts Pepper into the sentence.",
    "runtime": "python",
    "lesson": "python-01"
  },
  {
    "source": "In `{pet_age}`, it reads 5 and represents that number as text in the sentence.",
    "simple": "Here, `{pet_age}` puts the number 5 into the sentence as text.",
    "runtime": "python",
    "lesson": "python-01"
  },
  {
    "source": "Text outside the braces, including spaces and the period, stays exactly as written.",
    "simple": "Anything outside `{}` stays the way you typed it, including spaces and punctuation.",
    "runtime": "python",
    "lesson": "python-01"
  },
  {
    "source": "The original pet_age variable is still a number afterward.",
    "simple": "Putting `pet_age` into a sentence does not change its stored number.",
    "runtime": "python",
    "lesson": "python-01"
  },
  {
    "source": "An f-string is a way to build text, not a function.",
    "simple": "An f-string makes a piece of text. It is not a tool you call with parentheses.",
    "runtime": "python",
    "lesson": "python-01"
  },
  {
    "source": "Python first evaluates this text-building expression, then passes the completed string to the print function.",
    "simple": "Python builds the complete sentence first. Then `print` shows that sentence.",
    "runtime": "python",
    "lesson": "python-01"
  },
  {
    "source": "Here is a complete first introduction.",
    "simple": "The next example puts all the pieces together into a short introduction.",
    "runtime": "python",
    "lesson": "python-01"
  },
  {
    "source": "Read the lines in order.",
    "simple": "Start with the top line, then read the next line below it.",
    "runtime": "python",
    "lesson": "python-01"
  },
  {
    "source": "The first assigns a string;",
    "simple": "The first line gives `pet_name` the text Pepper.",
    "runtime": "python",
    "lesson": "python-01"
  },
  {
    "source": "the second assigns a number.",
    "simple": "The second line gives `pet_age` the number 5.",
    "runtime": "python",
    "lesson": "python-01"
  },
  {
    "source": "The third builds a sentence from both values and displays it.",
    "simple": "The third line puts the name and age into a sentence, then shows it.",
    "runtime": "python",
    "lesson": "python-01"
  },
  {
    "source": "The expected output is `Pepper is 5 years old.`.",
    "simple": "You should see: `Pepper is 5 years old.`",
    "runtime": "python",
    "lesson": "python-01"
  },
  {
    "source": "Python normally puts a new line after each print call.",
    "simple": "By default, the next `print` starts its output on a new line.",
    "runtime": "python",
    "lesson": "python-01"
  },
  {
    "source": "Change both inputs in a second runnable example and compare a string without the f prefix.",
    "simple": "Try this version with Clover and age 2. Compare the text made with `f` and without `f`.",
    "runtime": "python",
    "lesson": "python-01"
  },
  {
    "source": "The outputs are `Clover is 2 years old.`, then literally `{pet_name} is {pet_age} years old.`, then `Next year: 3`.",
    "simple": "The first line shows Clover’s name and age. Without `f`, the second shows the braces and names as typed. The last shows `Next year: 3`.",
    "runtime": "python",
    "lesson": "python-01"
  },
  {
    "source": "Without f, the braces are ordinary characters.",
    "simple": "Without `f`, Python leaves `{}` in the text instead of filling in values.",
    "runtime": "python",
    "lesson": "python-01"
  },
  {
    "source": "The plus sign inside the last braces adds one before its result becomes text.",
    "simple": "In `{pet_age + 1}`, Python adds 1 first, then puts the result into the text.",
    "runtime": "python",
    "lesson": "python-01"
  },
  {
    "source": "A variable can be assigned a new value later, and a later f-string uses that current value.",
    "simple": "You can give a name a new value. The next f-string uses that new value.",
    "runtime": "python",
    "lesson": "python-01"
  },
  {
    "source": "An already printed sentence does not rewrite itself when the name changes;",
    "simple": "Changing a value does not change a sentence that was already shown.",
    "runtime": "python",
    "lesson": "python-01"
  },
  {
    "source": "run a new print call.",
    "simple": "Use `print` again to show a new sentence.",
    "runtime": "python",
    "lesson": "python-01"
  },
  {
    "source": "Your exercise uses Milo and age 3, so the sentence should be `Milo is 3 years old.`.",
    "simple": "In your exercise, use Milo and 3. Show `Milo is 3 years old.`",
    "runtime": "python",
    "lesson": "python-01"
  },
  {
    "source": "The quiz's f-string `f\"Age: {pet_age}\"` produces `Age: 3`.",
    "simple": "With `pet_age` set to 3, `f\"Age: {pet_age}\"` becomes `Age: 3`.",
    "runtime": "python",
    "lesson": "python-01"
  },
  {
    "source": "For the small math question, seven days with one task each means 7 times 1, or seven tasks;",
    "simple": "One task on each of seven days gives seven tasks altogether.",
    "runtime": "python",
    "lesson": "python-01"
  },
  {
    "source": "the star `*` performs multiplication in Python.",
    "simple": "Use `*` to multiply in Python. For example, `7 * 1` gives 7.",
    "runtime": "python",
    "lesson": "python-01"
  },
  {
    "source": "Instructions that Python follows.",
    "simple": "Python follows the steps you write for it.",
    "runtime": "python",
    "lesson": "python-concepts"
  },
  {
    "source": "A program turns a task you can describe into precise steps the computer can repeat.",
    "simple": "A program breaks a task into clear steps the computer can do again.",
    "runtime": "python",
    "lesson": "python-concepts"
  },
  {
    "source": "Picture a recipe with a moving bookmark.",
    "simple": "Imagine following a recipe and moving a bookmark to the next step.",
    "runtime": "python",
    "lesson": "python-concepts"
  },
  {
    "source": "Python follows these statements in order;",
    "simple": "In this example, Python does one instruction, then the next.",
    "runtime": "python",
    "lesson": "python-concepts"
  },
  {
    "source": "each one has a particular job.",
    "simple": "Each instruction does one part of the work.",
    "runtime": "python",
    "lesson": "python-concepts"
  },
  {
    "source": "This straight-line example runs top to bottom.",
    "simple": "This example runs the first line, then each line below it.",
    "runtime": "python",
    "lesson": "python-concepts"
  },
  {
    "source": "Later, decisions, loops and function calls will change the route.",
    "simple": "Later, code can choose a different path, repeat steps, or use a function.",
    "runtime": "python",
    "lesson": "python-concepts"
  },
  {
    "source": "One statement can calculate, bind a name, call an action, or make a decision.",
    "simple": "One instruction might calculate a number, give a value a name, run a tool, or make a choice.",
    "runtime": "python",
    "lesson": "python-concepts"
  },
  {
    "source": "A comment is for the human reader.",
    "simple": "A comment is a note for you. Python does not run it.",
    "runtime": "python",
    "lesson": "python-concepts"
  },
  {
    "source": "A name must be bound before this program tries to read it.",
    "simple": "Give a name a value before you ask Python to use that name.",
    "runtime": "python",
    "lesson": "python-concepts"
  },
  {
    "source": "Printing an unknown name raises NameError.",
    "simple": "If Python does not know a name, trying to print it gives a `NameError` message.",
    "runtime": "python",
    "lesson": "python-concepts"
  },
  {
    "source": "Small programs can format labels, clean text, calculate costs and organize information.",
    "simple": "A small program can make labels, tidy text, add prices, or sort information.",
    "runtime": "python",
    "lesson": "python-concepts"
  },
  {
    "source": "Combine small understood steps.",
    "simple": "Build a bigger task from small steps you understand.",
    "runtime": "python",
    "lesson": "python-concepts"
  },
  {
    "source": "The information your program works with.",
    "simple": "These are the pieces of information your code uses.",
    "runtime": "python",
    "lesson": "python-concepts"
  },
  {
    "source": "Choosing the right kind of value determines which operations make sense.",
    "simple": "A number and a piece of text support different tasks. Choose the kind you need.",
    "runtime": "python",
    "lesson": "python-concepts"
  },
  {
    "source": "Picture an information card with two parts: its value and its type.",
    "simple": "Imagine a card that shows both the information and what kind it is.",
    "runtime": "python",
    "lesson": "python-concepts"
  },
  {
    "source": "The text \"5\" and the number 5 can look similar but behave differently.",
    "simple": "`\"5\"` is text, while `5` is a number. They look alike but are used differently.",
    "runtime": "python",
    "lesson": "python-concepts"
  },
  {
    "source": "The cards here are a teaching view, not a drawing of exact memory addresses or sizes.",
    "simple": "These cards help explain the idea. They do not show exactly where data sits in the computer.",
    "runtime": "python",
    "lesson": "python-concepts"
  },
  {
    "source": "An int is a whole number.",
    "simple": "`int` stores a number with no decimal part, like 5 or -2.",
    "runtime": "python",
    "lesson": "python-concepts"
  },
  {
    "source": "A str is text.",
    "simple": "`str` means text, like `\"Hello\"`.",
    "runtime": "python",
    "lesson": "python-concepts"
  },
  {
    "source": "Addition sums two ints but joins two strings.",
    "simple": "With numbers, `5 + 1` gives 6. With text, `\"5\" + \"1\"` gives `\"51\"`.",
    "runtime": "python",
    "lesson": "python-concepts"
  },
  {
    "source": "A float represents a floating-point number.",
    "simple": "A `float` is a number type that can include a fraction, like 21.5. Some values are only approximate.",
    "runtime": "python",
    "lesson": "python-concepts"
  },
  {
    "source": "A bool answers yes or no.",
    "simple": "A `bool` is either `True` or `False`.",
    "runtime": "python",
    "lesson": "python-concepts"
  },
  {
    "source": "Collections group values;",
    "simple": "A collection holds several values together.",
    "runtime": "python",
    "lesson": "python-concepts"
  },
  {
    "source": "meet those later.",
    "simple": "You will learn about groups of values in later lessons.",
    "runtime": "python",
    "lesson": "python-concepts"
  },
  {
    "source": "type shows a value’s type. int can convert suitable digit text;",
    "simple": "Use `type` to check what kind of value you have. Use `int(\"5\")` to turn the text `\"5\"` into the number 5.",
    "runtime": "python",
    "lesson": "python-concepts"
  },
  {
    "source": "unsuitable text raises ValueError.",
    "simple": "If the text cannot become the number you asked for, Python reports `ValueError`.",
    "runtime": "python",
    "lesson": "python-concepts"
  },
  {
    "source": "Text is a sequence of characters;",
    "simple": "Text is made from characters, such as letters, spaces, and punctuation.",
    "runtime": "python",
    "lesson": "python-concepts"
  },
  {
    "source": "a number can be calculated with.",
    "simple": "Use a number when you want to do a calculation.",
    "runtime": "python",
    "lesson": "python-concepts"
  },
  {
    "source": "Use a string for names, messages and codes, even when some characters are digits.",
    "simple": "Use text for a name, message, or code. A code like `\"007\"` is still text.",
    "runtime": "python",
    "lesson": "python-concepts"
  },
  {
    "source": "Use numbers when you mean a quantity.",
    "simple": "Use a number to say how much or how many.",
    "runtime": "python",
    "lesson": "python-concepts"
  },
  {
    "source": "Picture Pepper written on a strip of paper.",
    "simple": "Imagine the word Pepper written across a strip of paper.",
    "runtime": "python",
    "lesson": "python-concepts"
  },
  {
    "source": "Quotes mark the edges in your source code.",
    "simple": "In your code, quotes show where the text starts and stops.",
    "runtime": "python",
    "lesson": "python-concepts"
  },
  {
    "source": "They are not printed as part of Pepper.",
    "simple": "Printing `\"Pepper\"` shows Pepper without the outside quotes.",
    "runtime": "python",
    "lesson": "python-concepts"
  },
  {
    "source": "Python strings are immutable: methods do not edit the original text in place.",
    "simple": "Python does not change the characters of an existing string. A text-changing method gives you new text instead.",
    "runtime": "python",
    "lesson": "python-concepts"
  },
  {
    "source": "The visual strip is not a literal memory layout.",
    "simple": "The paper strip is a picture to help you learn, not a picture of computer memory.",
    "runtime": "python",
    "lesson": "python-concepts"
  },
  {
    "source": "Positions start at zero.",
    "simple": "The first character is at position 0, not position 1.",
    "runtime": "python",
    "lesson": "python-concepts"
  },
  {
    "source": "A slice takes a range up to, but not including, its end.",
    "simple": "A slice chooses several items. Its ending position is not included.",
    "runtime": "python",
    "lesson": "python-concepts"
  },
  {
    "source": "Empty strings have length zero.",
    "simple": "An empty string has no characters, so its length is 0.",
    "runtime": "python",
    "lesson": "python-concepts"
  },
  {
    "source": "Methods return text for you to use.",
    "simple": "These text tools give back a result you can use.",
    "runtime": "python",
    "lesson": "python-concepts"
  },
  {
    "source": "A dot selects a method;",
    "simple": "The dot chooses a tool that belongs to this text, such as `upper`.",
    "runtime": "python",
    "lesson": "python-concepts"
  },
  {
    "source": "parentheses call it.",
    "simple": "Add `()` to run that tool.",
    "runtime": "python",
    "lesson": "python-concepts"
  },
  {
    "source": "Keep the result if you need it again.",
    "simple": "Save the new text under a name if you want to use it later.",
    "runtime": "python",
    "lesson": "python-concepts"
  },
  {
    "source": "Use in to test membership, + to join strings, and split/join to move between text and a list of pieces.",
    "simple": "Use `in` to check whether text contains something. Use `+` to join text. Use `split` to make pieces and `join` to put pieces together.",
    "runtime": "python",
    "lesson": "python-concepts"
  },
  {
    "source": "An f-string evaluates expressions in braces.",
    "simple": "An f-string works out what is inside `{}` and puts the result into the text.",
    "runtime": "python",
    "lesson": "python-concepts"
  },
  {
    "source": "A backslash can introduce an escape such as a newline.",
    "simple": "A backslash can write a special character. For example, `\\n` starts a new line.",
    "runtime": "python",
    "lesson": "python-concepts"
  },
  {
    "source": "More formatting and Unicode can wait until needed.",
    "simple": "You can learn more ways of writing text when you need them.",
    "runtime": "python",
    "lesson": "python-concepts"
  },
  {
    "source": "A name lets you refer to a value again.",
    "simple": "Give a value a name so you can use it again later.",
    "runtime": "python",
    "lesson": "python-concepts"
  },
  {
    "source": "Names make a program readable and let later steps reuse the current value without repeating it.",
    "simple": "A useful name makes the code easier to read and saves you from typing the value again.",
    "runtime": "python",
    "lesson": "python-concepts"
  },
  {
    "source": "Picture a name tag with a pointer to an object. pet_name points to the string \"Pepper\".",
    "simple": "Imagine `pet_name` as a name tag pointing to the text Pepper.",
    "runtime": "python",
    "lesson": "python-concepts"
  },
  {
    "source": "The tag is not the text itself.",
    "simple": "The name tag points to the text. It is not the text itself.",
    "runtime": "python",
    "lesson": "python-concepts"
  },
  {
    "source": "Two names can refer to the same object.",
    "simple": "Two different names can point to the very same value.",
    "runtime": "python",
    "lesson": "python-concepts"
  },
  {
    "source": "Rebinding one name does not automatically rebind another, and strings themselves do not mutate.",
    "simple": "If you give one name a new value, the other name still points to the old one. The old text stays unchanged.",
    "runtime": "python",
    "lesson": "python-concepts"
  },
  {
    "source": "Without quotes, Python looks up the name.",
    "simple": "Without quotes, Python searches for the value stored under that name.",
    "runtime": "python",
    "lesson": "python-concepts"
  },
  {
    "source": "With quotes, those characters are the text value.",
    "simple": "With quotes, Python uses the letters as text instead of looking up a name.",
    "runtime": "python",
    "lesson": "python-concepts"
  },
  {
    "source": "The second assignment binds another name to the same string.",
    "simple": "The second line gives the same text a second name.",
    "runtime": "python",
    "lesson": "python-concepts"
  },
  {
    "source": "Rebinding pet_name later leaves original_name referring to Pepper.",
    "simple": "Changing `pet_name` later does not change `original_name`: it still gives you Pepper.",
    "runtime": "python",
    "lesson": "python-concepts"
  },
  {
    "source": "Use descriptive names.",
    "simple": "Pick a name that explains what the value is for.",
    "runtime": "python",
    "lesson": "python-concepts"
  },
  {
    "source": "Underscores can join words;",
    "simple": "Use `_` to connect words in a name, like `pet_age`.",
    "runtime": "python",
    "lesson": "python-concepts"
  },
  {
    "source": "names are case-sensitive and cannot start with a digit.",
    "simple": "Capital letters matter, and a name must not begin with a number.",
    "runtime": "python",
    "lesson": "python-concepts"
  },
  {
    "source": "Evaluate the right-hand side, then bind the name on the left.",
    "simple": "Work out the value on the right of `=` first. Then give that value the name on the left.",
    "runtime": "python",
    "lesson": "python-concepts"
  },
  {
    "source": "Assignment gives later instructions a way to find the result of this instruction.",
    "simple": "Storing a result under a name lets later code find it.",
    "runtime": "python",
    "lesson": "python-concepts"
  },
  {
    "source": "Picture a two-part action: work out the value first, then connect the name tag to it.",
    "simple": "First find the value. Then attach the name tag to that value.",
    "runtime": "python",
    "lesson": "python-concepts"
  },
  {
    "source": "The single = is not an equality question.",
    "simple": "One `=` stores a value. It does not ask if two values are equal.",
    "runtime": "python",
    "lesson": "python-concepts"
  },
  {
    "source": "This picture explains simple name assignment.",
    "simple": "This picture shows how to give a value a name.",
    "runtime": "python",
    "lesson": "python-concepts"
  },
  {
    "source": "Attributes, collections and unpacking have additional rules you can learn later.",
    "simple": "Naming parts of objects or working with groups of values needs more rules. Those come later.",
    "runtime": "python",
    "lesson": "python-concepts"
  },
  {
    "source": "Python reads the right side using the current binding before the left side changes.",
    "simple": "Python uses the old value to work out the right side before giving the left-hand name its new value.",
    "runtime": "python",
    "lesson": "python-concepts"
  },
  {
    "source": "One equals sign assigns.",
    "simple": "Use `=` to give a name a value.",
    "runtime": "python",
    "lesson": "python-concepts"
  },
  {
    "source": "Two equals signs compare values and produce True or False.",
    "simple": "Use `==` to ask if two values are equal. The answer is `True` or `False`.",
    "runtime": "python",
    "lesson": "python-concepts"
  },
  {
    "source": "upper returns uppercase text.",
    "simple": "`upper()` gives you text written in capital letters.",
    "runtime": "python",
    "lesson": "python-concepts"
  },
  {
    "source": "Binding pet_name to the result does not modify the original string.",
    "simple": "Giving the new text to `pet_name` leaves the old text unchanged.",
    "runtime": "python",
    "lesson": "python-concepts"
  },
  {
    "source": "Display a result so a person can read it.",
    "simple": "Show a result on the screen so someone can read it.",
    "runtime": "python",
    "lesson": "python-concepts"
  },
  {
    "source": "A value can exist without appearing on screen. print asks Python to display the value you pass to it.",
    "simple": "A value can be saved without being shown. Use `print(...)` when you want to show it.",
    "runtime": "python",
    "lesson": "python-concepts"
  },
  {
    "source": "Picture a message appearing on a separate display.",
    "simple": "Imagine a message appearing in a separate output window.",
    "runtime": "python",
    "lesson": "python-concepts"
  },
  {
    "source": "The names and values remain in your program;",
    "simple": "The program still keeps its names and values after showing them.",
    "runtime": "python",
    "lesson": "python-concepts"
  },
  {
    "source": "the display is not where they are stored.",
    "simple": "The output is a display, not the place the program keeps those values.",
    "runtime": "python",
    "lesson": "python-concepts"
  },
  {
    "source": "print normally ends with a newline and returns None.",
    "simple": "Usually, `print` ends the displayed text with a new line. Its result given back to the code is `None`.",
    "runtime": "python",
    "lesson": "python-concepts"
  },
  {
    "source": "Displaying a value is different from returning it from your own function.",
    "simple": "Printing shows something to a person. Returning gives a result back to the code that used your function.",
    "runtime": "python",
    "lesson": "python-concepts"
  },
  {
    "source": "print is a built-in function.",
    "simple": "`print` is a ready-made Python tool for showing information.",
    "runtime": "python",
    "lesson": "python-concepts"
  },
  {
    "source": "Parentheses call it;",
    "simple": "Use the parentheses `()` to ask `print` to run.",
    "runtime": "python",
    "lesson": "python-concepts"
  },
  {
    "source": "what you put inside supplies arguments.",
    "simple": "The values inside `()` tell `print` what to show. These inputs are called arguments.",
    "runtime": "python",
    "lesson": "python-concepts"
  },
  {
    "source": "The f prefix makes a formatted string.",
    "simple": "Put `f` before a quoted string to let it include values from your code.",
    "runtime": "python",
    "lesson": "python-concepts"
  },
  {
    "source": "Braces hold expressions to evaluate.",
    "simple": "Inside `{}`, write a name or calculation whose value you want to add.",
    "runtime": "python",
    "lesson": "python-concepts"
  },
  {
    "source": "Without f, those braces are ordinary text.",
    "simple": "Without `f`, the braces are shown as typed instead of being filled in.",
    "runtime": "python",
    "lesson": "python-concepts"
  },
  {
    "source": "Changing a name does not rewrite output already displayed.",
    "simple": "Changing a saved value does not edit output you already showed.",
    "runtime": "python",
    "lesson": "python-concepts"
  },
  {
    "source": "Call print again to show the new value.",
    "simple": "Use `print` one more time to show the updated value.",
    "runtime": "python",
    "lesson": "python-concepts"
  }
];

export default readings;
