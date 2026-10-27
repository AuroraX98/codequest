export default [
  {
    "source": "A module is a Python file whose code another file can import.",
    "simple": "A module is a Python file whose functions and other code can be used from another file.",
    "runtime": "python",
    "lesson": "python-13"
  },
  {
    "source": "A file called measurement_toolkit.py supplies the module name measurement_toolkit;",
    "simple": "If the file is measurement_toolkit.py, its module name is measurement_toolkit.",
    "runtime": "python",
    "lesson": "python-13"
  },
  {
    "source": "do not include .py in an import statement.",
    "simple": "Leave off .py when you write the module's name in an import.",
    "runtime": "python",
    "lesson": "python-13"
  },
  {
    "source": "Imports let one program reuse functions defined elsewhere.",
    "simple": "Importing lets your program use functions that were written in a different file.",
    "runtime": "python",
    "lesson": "python-13"
  },
  {
    "source": "Python must be able to find that module on its import path, the places it searches;",
    "simple": "Python looks in particular places for modules. Those places are called its import path, and your module must be somewhere it can find.",
    "runtime": "python",
    "lesson": "python-13"
  },
  {
    "source": "for this simple project, keep the supplied files together.",
    "simple": "For this exercise, put the supplied files in the same folder.",
    "runtime": "python",
    "lesson": "python-13"
  },
  {
    "source": "A conversion factor relates units.",
    "simple": "A conversion factor is a number used to change a measurement from one unit to another.",
    "runtime": "python",
    "lesson": "python-13"
  },
  {
    "source": "If one kilometer equals about 0.621371 miles, multiply kilometers by that factor to get miles.",
    "simple": "One kilometer is about 0.621371 miles. Multiply a distance in kilometers by 0.621371 to get miles.",
    "runtime": "python",
    "lesson": "python-13"
  },
  {
    "source": "To reverse it, divide miles by the same factor.",
    "simple": "To change miles back to kilometers, divide the distance by 0.621371.",
    "runtime": "python",
    "lesson": "python-13"
  },
  {
    "source": "The star `*` multiplies and the slash `/` divides.",
    "simple": "Use `*` to multiply and `/` to divide.",
    "runtime": "python",
    "lesson": "python-13"
  },
  {
    "source": "A constant is a value intended to stay unchanged;",
    "simple": "A constant is a value you plan to leave the same throughout the program.",
    "runtime": "python",
    "lesson": "python-13"
  },
  {
    "source": "uppercase names conventionally identify constants in Python, though Python does not enforce that convention.",
    "simple": "Python programmers usually give constants ALL_CAPITAL names. Python itself does not stop you changing them.",
    "runtime": "python",
    "lesson": "python-13"
  },
  {
    "source": "Save this complete example file as measurement_toolkit.py.",
    "simple": "Put this complete code in a file named measurement_toolkit.py.",
    "runtime": "python",
    "lesson": "python-13"
  },
  {
    "source": "Each function receives one numeric input and returns a converted number.",
    "simple": "Give either function one number, and it sends back that distance in the other unit.",
    "runtime": "python",
    "lesson": "python-13"
  },
  {
    "source": "The file defines reusable calculations and does not print by itself.",
    "simple": "This file makes the calculations available to other code. It does not print any answers on its own.",
    "runtime": "python",
    "lesson": "python-13"
  },
  {
    "source": "Return sends the number to calling code, which can decide how to display it.",
    "simple": "Return hands the number back to the code that called the function. That code can choose how to show it.",
    "runtime": "python",
    "lesson": "python-13"
  },
  {
    "source": "Save this as a separate main program beside that module and run the main program.",
    "simple": "Put the next code in a different file in the same folder, and run that main file.",
    "runtime": "python",
    "lesson": "python-13"
  },
  {
    "source": "The outputs are 4.97 and 3.22.",
    "simple": "The main program prints 4.97 first and 3.22 second.",
    "runtime": "python",
    "lesson": "python-13"
  },
  {
    "source": "From names the module;",
    "simple": "The name after from tells Python which module to use.",
    "runtime": "python",
    "lesson": "python-13"
  },
  {
    "source": "import names the two functions to use in this file.",
    "simple": "The names after import tell Python which two functions this file will use.",
    "runtime": "python",
    "lesson": "python-13"
  },
  {
    "source": "The comma separates the names.",
    "simple": "Put a comma between the two function names.",
    "runtime": "python",
    "lesson": "python-13"
  },
  {
    "source": "Nested calls run the conversion first, then round the result, then print it.",
    "simple": "Work from the innermost call outward: convert the distance, round that answer, then print it.",
    "runtime": "python",
    "lesson": "python-13"
  },
  {
    "source": "This code requires the previous module file;",
    "simple": "The main program depends on the module file shown just before it.",
    "runtime": "python",
    "lesson": "python-13"
  },
  {
    "source": "it is deliberately a two-file example.",
    "simple": "The example intentionally needs two separate files working together.",
    "runtime": "python",
    "lesson": "python-13"
  },
  {
    "source": "`round(number, 2)` rounds a numeric result to two decimal places.",
    "simple": "`round(number, 2)` rounds the number to two places after the decimal point.",
    "runtime": "python",
    "lesson": "python-13"
  },
  {
    "source": "It still returns a number, not a formatted string guaranteed to show two digits after the decimal.",
    "simple": "The result is still a number. It is not display text that promises to show exactly two digits after the decimal point.",
    "runtime": "python",
    "lesson": "python-13"
  },
  {
    "source": "Some decimal values cannot be represented exactly by binary floating-point numbers, so rounding is useful for the lesson's displayed approximations.",
    "simple": "Computers cannot store every decimal fraction exactly as a float. Rounding makes the approximate answers easier to read here.",
    "runtime": "python",
    "lesson": "python-13"
  },
  {
    "source": "It does not change the underlying conversion factor.",
    "simple": "Rounding the answer leaves the conversion factor itself unchanged.",
    "runtime": "python",
    "lesson": "python-13"
  },
  {
    "source": "Your supplied calls convert 5 kilometers and 3.1 miles.",
    "simple": "The exercise asks you to convert 5 kilometers to miles and 3.1 miles to kilometers.",
    "runtime": "python",
    "lesson": "python-13"
  },
  {
    "source": "Five times 0.621371 is 3.106855, which rounds to 3.11 miles.",
    "simple": "5 times 0.621371 gives 3.106855 miles. Rounded to two decimal places, that is 3.11 miles.",
    "runtime": "python",
    "lesson": "python-13"
  },
  {
    "source": "Dividing 3.1 by 0.621371 gives about 4.989 kilometers, which rounds to 4.99.",
    "simple": "3.1 divided by 0.621371 is about 4.989 kilometers. Rounded to two decimal places, that is 4.99 kilometers.",
    "runtime": "python",
    "lesson": "python-13"
  },
  {
    "source": "The units tell you which direction to calculate.",
    "simple": "Check the starting and ending units to decide whether to multiply or divide.",
    "runtime": "python",
    "lesson": "python-13"
  },
  {
    "source": "The matching math uses a different factor: 2.5 kilometers times 1000 meters per kilometer equals 2500 meters.",
    "simple": "The math question changes kilometers to meters instead: 2.5 times 1000 meters per kilometer gives 2500 meters.",
    "runtime": "python",
    "lesson": "python-13"
  },
  {
    "source": "You can also check the calculation in one standalone file before practising imports:",
    "simple": "Before trying imports, you can put everything in one file to check that the calculations work.",
    "runtime": "python",
    "lesson": "python-13"
  },
  {
    "source": "It prints 6.21 and 1.61.",
    "simple": "This one-file version prints 6.21, then 1.61.",
    "runtime": "python",
    "lesson": "python-13"
  },
  {
    "source": "These changed inputs use the same formulas as the two-file example.",
    "simple": "The input distances are different here, but the calculation rules are the same as before.",
    "runtime": "python",
    "lesson": "python-13"
  },
  {
    "source": "This one-file calculation does not demonstrate importing;",
    "simple": "This version checks the calculations only; it does not show how to import code.",
    "runtime": "python",
    "lesson": "python-13"
  },
  {
    "source": "that skill still requires the paired files shown earlier.",
    "simple": "To practise importing, use the two separate files from the earlier example.",
    "runtime": "python",
    "lesson": "python-13"
  },
  {
    "source": "Both approaches keep the unit direction explicit and round only the final returned number.",
    "simple": "In either version, be clear about which units you are converting. Round the final answer, not the factor or earlier steps.",
    "runtime": "python",
    "lesson": "python-13"
  },
  {
    "source": "Use the imported functions rather than duplicating the conversion logic in the main program.",
    "simple": "Call the imported functions instead of writing the same conversion steps again in the main file.",
    "runtime": "python",
    "lesson": "python-13"
  },
  {
    "source": "Keep both files available, spell their names exactly, and avoid giving another local file the same name as a module you need.",
    "simple": "Keep both files and spell their names exactly. Do not name another nearby file after a module your program needs, because that can cause confusion.",
    "runtime": "python",
    "lesson": "python-13"
  },
  {
    "source": "The checks call the functions and compare the two printed rounded results.",
    "simple": "The tests run your functions and check the two rounded numbers you print.",
    "runtime": "python",
    "lesson": "python-13"
  },
  {
    "source": "If an import fails, first ask whether the file exists where Python is looking;",
    "simple": "If importing fails, check first whether the module file is in a place Python searches.",
    "runtime": "python",
    "lesson": "python-13"
  },
  {
    "source": "the conversion formula alone cannot fix a missing module.",
    "simple": "Even a correct formula cannot help Python import a file that is missing.",
    "runtime": "python",
    "lesson": "python-13"
  },
  {
    "source": "Input can be missing, malformed, or a number outside the allowed range.",
    "simple": "An input might be absent, not written as a valid number, or a number outside the allowed limits.",
    "runtime": "python",
    "lesson": "python-14"
  },
  {
    "source": "Handle those cases separately so the message says what went wrong.",
    "simple": "Give each kind of problem its own check and message so the user knows what to fix.",
    "runtime": "python",
    "lesson": "python-14"
  },
  {
    "source": "An exception is Python's signal that an operation failed.",
    "simple": "An exception is how Python reports that it could not complete an instruction.",
    "runtime": "python",
    "lesson": "python-14"
  },
  {
    "source": "If code does not handle it, the program stops that operation with an error.",
    "simple": "Without code to handle that exception, the failed operation stops with an error.",
    "runtime": "python",
    "lesson": "python-14"
  },
  {
    "source": "A try/except block handles a particular expected exception while allowing other bugs to remain visible.",
    "simple": "Use try/except to handle errors you expect. Let unexpected errors remain visible so you can fix them.",
    "runtime": "python",
    "lesson": "python-14"
  },
  {
    "source": "Start by checking missing input.",
    "simple": "First ask whether any input was supplied.",
    "runtime": "python",
    "lesson": "python-14"
  },
  {
    "source": "None means no supplied value, and `\"\"` is an empty string.",
    "simple": "None is Python's marker for no value. `\"\"` is text containing no characters.",
    "runtime": "python",
    "lesson": "python-14"
  },
  {
    "source": "`raw is None` checks the special no-value marker;",
    "simple": "`raw is None` asks whether raw holds Python's special no-value marker.",
    "runtime": "python",
    "lesson": "python-14"
  },
  {
    "source": "`raw == \"\"` compares text.",
    "simple": "`raw == \"\"` asks whether raw equals empty text.",
    "runtime": "python",
    "lesson": "python-14"
  },
  {
    "source": "The word or means either condition is enough.",
    "simple": "With or, the combined check passes if either of the two checks passes.",
    "runtime": "python",
    "lesson": "python-14"
  },
  {
    "source": "Once input is present, `float(raw)` tries to convert it to a numeric float, which supports decimal values.",
    "simple": "If input exists, `float(raw)` tries to make it a number that can include a decimal part.",
    "runtime": "python",
    "lesson": "python-14"
  },
  {
    "source": "Text like \"many\" cannot be converted and raises ValueError.",
    "simple": "The word \"many\" is not written as a number, so trying to convert it causes a ValueError.",
    "runtime": "python",
    "lesson": "python-14"
  },
  {
    "source": "This complete example catches invalid numeric text.",
    "simple": "This full example handles text that cannot be read as a number.",
    "runtime": "python",
    "lesson": "python-14"
  },
  {
    "source": "It prints 42.5 and `Enter a number`.",
    "simple": "It prints the number 42.5, then the message `Enter a number`.",
    "runtime": "python",
    "lesson": "python-14"
  },
  {
    "source": "The parentheses in except group the two expected exception types.",
    "simple": "The parentheses after except put the two error types together so either one is handled there.",
    "runtime": "python",
    "lesson": "python-14"
  },
  {
    "source": "TypeError covers a value of an unsuitable kind;",
    "simple": "TypeError means the input is the wrong kind of value for this conversion.",
    "runtime": "python",
    "lesson": "python-14"
  },
  {
    "source": "ValueError covers a value that cannot be interpreted as the requested number.",
    "simple": "ValueError means the input cannot be understood as the number the conversion asks for.",
    "runtime": "python",
    "lesson": "python-14"
  },
  {
    "source": "After a successful conversion, execution continues after the except block.",
    "simple": "If conversion works, Python skips the except instructions and continues with the code after them.",
    "runtime": "python",
    "lesson": "python-14"
  },
  {
    "source": "A number can convert successfully yet still be out of range.",
    "simple": "Text can turn into a valid number even when that number is too low or too high for your rules.",
    "runtime": "python",
    "lesson": "python-14"
  },
  {
    "source": "`0 <= score <= 100` is a chained comparison requiring both lower and upper limits.",
    "simple": "`0 <= score <= 100` checks two things: score is at least 0 and at most 100.",
    "runtime": "python",
    "lesson": "python-14"
  },
  {
    "source": "Inclusive signs allow 0 and 100 themselves.",
    "simple": "Because the checks include equality, scores of exactly 0 and exactly 100 are allowed.",
    "runtime": "python",
    "lesson": "python-14"
  },
  {
    "source": "`not` reverses the Boolean answer.",
    "simple": "not changes a True answer to False, or a False answer to True.",
    "runtime": "python",
    "lesson": "python-14"
  },
  {
    "source": "Check the range after conversion, rather than confusing an out-of-range number with text that was never numeric.",
    "simple": "First turn the input into a number, then check its limits. A number outside the limits is a different problem from text that is not a number.",
    "runtime": "python",
    "lesson": "python-14"
  },
  {
    "source": "Here is an independently runnable full-range example with different bounds.",
    "simple": "This full example runs on its own and uses 0 through 50 instead of the exercise's limits.",
    "runtime": "python",
    "lesson": "python-14"
  },
  {
    "source": "The four outputs are `Please enter a value`, `Enter a number`, `Accepted: 50`, and `Value must be from 0 to 50`.",
    "simple": "The messages are `Please enter a value`, then `Enter a number`, then `Accepted: 50`, then `Value must be from 0 to 50`.",
    "runtime": "python",
    "lesson": "python-14"
  },
  {
    "source": "Every branch returns a useful result.",
    "simple": "Whichever path the function takes, it sends back an answer explaining the result.",
    "runtime": "python",
    "lesson": "python-14"
  },
  {
    "source": "The f-string's `{value:g}` inserts the number using general numeric formatting.",
    "simple": "Inside the f-string, `{value:g}` puts the number into the message using a general number-display style.",
    "runtime": "python",
    "lesson": "python-14"
  },
  {
    "source": "The colon introduces a format instruction, and g avoids an unnecessary .0 for whole values such as 50.",
    "simple": "The colon starts a display instruction. The g tells Python not to show an unnecessary .0 when displaying a whole value such as 50.",
    "runtime": "python",
    "lesson": "python-14"
  },
  {
    "source": "It is not a separate variable named g.",
    "simple": "Here, g is a formatting instruction, not the name of another stored value.",
    "runtime": "python",
    "lesson": "python-14"
  },
  {
    "source": "Catch only expected conversion exceptions;",
    "simple": "Handle just the error types you expect from converting the input.",
    "runtime": "python",
    "lesson": "python-14"
  },
  {
    "source": "catching every possible exception could hide a misspelled name or another programming mistake that should be fixed.",
    "simple": "Handling every error could hide a spelling mistake in a name or another bug that needs fixing.",
    "runtime": "python",
    "lesson": "python-14"
  },
  {
    "source": "Your score range is 0 through 100.",
    "simple": "In your score exercise, allowed values run from 0 to 100, including both limits.",
    "runtime": "python",
    "lesson": "python-14"
  },
  {
    "source": "Missing values return \"Please enter a score\";",
    "simple": "When the score is missing, send back \"Please enter a score\".",
    "runtime": "python",
    "lesson": "python-14"
  },
  {
    "source": "malformed input returns \"Enter a number\";",
    "simple": "When the supplied input cannot be read as a number, send back \"Enter a number\".",
    "runtime": "python",
    "lesson": "python-14"
  },
  {
    "source": "outside values return \"Score must be from 0 to 100\".",
    "simple": "When the number falls outside the limits, send back \"Score must be from 0 to 100\".",
    "runtime": "python",
    "lesson": "python-14"
  },
  {
    "source": "A valid 100 returns \"Accepted: 100\".",
    "simple": "The score 100 is allowed and gives the message \"Accepted: 100\".",
    "runtime": "python",
    "lesson": "python-14"
  },
  {
    "source": "The quiz's float(\"many\") raises ValueError.",
    "simple": "In the quiz, float(\"many\") causes ValueError because \"many\" cannot be read as a number.",
    "runtime": "python",
    "lesson": "python-14"
  },
  {
    "source": "For the math question, 75 is within the inclusive range while -1 and 101 are outside.",
    "simple": "75 passes the 0-through-100 check. -1 is too small, and 101 is too large.",
    "runtime": "python",
    "lesson": "python-14"
  },
  {
    "source": "The range check also rejects NaN and infinities, because they do not satisfy both bounded comparisons.",
    "simple": "NaN means “not a number.” Positive infinity is beyond every ordinary number; negative infinity is below them. These special float values fail the combined lower-and-upper-limit check too.",
    "runtime": "python",
    "lesson": "python-14"
  },
  {
    "source": "An algorithm is a sequence of steps for solving a problem.",
    "simple": "An algorithm is a clear set of steps for getting a job done.",
    "runtime": "python",
    "lesson": "python-15"
  },
  {
    "source": "This summary algorithm visits numbers, doubles each one, counts how many were processed, and adds a total.",
    "simple": "These steps go through the numbers, multiply each by 2, count the numbers used, and add their doubled values together.",
    "runtime": "python",
    "lesson": "python-15"
  },
  {
    "source": "It uses a single pass: each original number is read just once.",
    "simple": "The code goes through the original values only once. This is called a single pass.",
    "runtime": "python",
    "lesson": "python-15"
  },
  {
    "source": "A separate helper measures the shallow sizes of a transformed list and a generator.",
    "simple": "Another function compares the memory size of a doubled list with a generator. It measures only each object's own storage, not everything it refers to.",
    "runtime": "python",
    "lesson": "python-15"
  },
  {
    "source": "Keeping measurement separate lets the summary work even when its input cannot be read twice.",
    "simple": "Keeping that memory check separate means summarize can also handle input that can only be used once.",
    "runtime": "python",
    "lesson": "python-15"
  },
  {
    "source": "A generator produces values one at a time as they are requested.",
    "simple": "A generator makes the next value only when something asks for it.",
    "runtime": "python",
    "lesson": "python-15"
  },
  {
    "source": "A generator expression looks like a comprehension but uses parentheses: `(n * 2 for n in values)`.",
    "simple": "A generator expression uses round parentheses, as in `(n * 2 for n in values)`, rather than the square brackets of a list comprehension.",
    "runtime": "python",
    "lesson": "python-15"
  },
  {
    "source": "It describes the transformation without immediately building a full list.",
    "simple": "It says how to calculate the values without making and storing the whole answer list right away.",
    "runtime": "python",
    "lesson": "python-15"
  },
  {
    "source": "A loop requests successive values from it.",
    "simple": "The loop asks the generator for one value, then the next, and so on.",
    "runtime": "python",
    "lesson": "python-15"
  },
  {
    "source": "A list comprehension `[n * 2 for n in values]` instead creates all transformed entries up front.",
    "simple": "By contrast, `[n * 2 for n in values]` calculates and stores the whole doubled list immediately.",
    "runtime": "python",
    "lesson": "python-15"
  },
  {
    "source": "Here is a complete incremental summary.",
    "simple": "This full example builds up its count and total one value at a time.",
    "runtime": "python",
    "lesson": "python-15"
  },
  {
    "source": "It displays `(3, 22)` and `(0, 0)`.",
    "simple": "The first result is `(3, 22)`; the empty-input result is `(0, 0)`.",
    "runtime": "python",
    "lesson": "python-15"
  },
  {
    "source": "The yielded values are 2, 8, and 12.",
    "simple": "The generator gives the loop 2, then 8, then 12.",
    "runtime": "python",
    "lesson": "python-15"
  },
  {
    "source": "Each increments count by one and adds to total.",
    "simple": "For each of those values, count goes up by 1 and total goes up by that value.",
    "runtime": "python",
    "lesson": "python-15"
  },
  {
    "source": "The comma in return makes a tuple of count and total.",
    "simple": "The comma makes return send back a pair, called a tuple: count first, total second.",
    "runtime": "python",
    "lesson": "python-15"
  },
  {
    "source": "Empty input yields nothing, leaving both starting values at zero.",
    "simple": "With no input values, the loop has nothing to do. Count and total both stay at 0.",
    "runtime": "python",
    "lesson": "python-15"
  },
  {
    "source": "`count += 1` is short for count = count + 1, and total += value updates the running sum.",
    "simple": "`count += 1` means count = count + 1. Similarly, total += value adds this value to the total so far.",
    "runtime": "python",
    "lesson": "python-15"
  },
  {
    "source": "`count = total = 0` assigns zero to both names.",
    "simple": "`count = total = 0` starts both count and total at 0.",
    "runtime": "python",
    "lesson": "python-15"
  },
  {
    "source": "Keep the return after the loop so every input is processed before the answer is returned.",
    "simple": "Put return after the loop, not inside it, so every value contributes to the answer.",
    "runtime": "python",
    "lesson": "python-15"
  },
  {
    "source": "An iterator supplies the next value when asked.",
    "simple": "An iterator is something that can give you its next value when asked.",
    "runtime": "python",
    "lesson": "python-15"
  },
  {
    "source": "A one-shot iterator, unlike a reusable list, cannot automatically start again after its values are consumed.",
    "simple": "A one-shot iterator runs out once its values have been used. Unlike a list, it does not automatically let you start again at the beginning.",
    "runtime": "python",
    "lesson": "python-15"
  },
  {
    "source": "Here is a complete changed-input example showing why one pass matters.",
    "simple": "This full example uses different numbers to show why reading the input just once matters.",
    "runtime": "python",
    "lesson": "python-15"
  },
  {
    "source": "It prints `(2, 16)` and then `(0, 0)`.",
    "simple": "It prints `(2, 16)` on the first call and `(0, 0)` on the second.",
    "runtime": "python",
    "lesson": "python-15"
  },
  {
    "source": "The built-in iter function makes an iterator from the list.",
    "simple": "Python's ready-made iter function turns the list into an iterator you can ask for successive values.",
    "runtime": "python",
    "lesson": "python-15"
  },
  {
    "source": "The first call doubles 3 and 5 into 6 and 10, counts two values, and totals 16.",
    "simple": "On the first run, 3 becomes 6 and 5 becomes 10. That gives a count of 2 and a total of 16.",
    "runtime": "python",
    "lesson": "python-15"
  },
  {
    "source": "The second call sees the same already-exhausted iterator, so it receives no values.",
    "simple": "The second run uses that same iterator, but all its values were already used, so there are none left.",
    "runtime": "python",
    "lesson": "python-15"
  },
  {
    "source": "This is expected iterator behavior, not a reason to add a second reading pass inside summarize.",
    "simple": "That is normal for an iterator. Do not try to fix it by making summarize read the input twice.",
    "runtime": "python",
    "lesson": "python-15"
  },
  {
    "source": "Use a separate helper for the size comparison, and pass it a reusable sequence such as a list.",
    "simple": "Put the memory comparison in a different function and give it input you can read more than once, such as a list.",
    "runtime": "python",
    "lesson": "python-15"
  },
  {
    "source": "A sequence is an ordered collection;",
    "simple": "A sequence is a group of items with a defined order.",
    "runtime": "python",
    "lesson": "python-15"
  },
  {
    "source": "a reusable list can be read again from its beginning.",
    "simple": "A list lets you go back and read its items from the beginning again.",
    "runtime": "python",
    "lesson": "python-15"
  },
  {
    "source": "The helper deliberately builds a transformed list for comparison, while the summary function never needs that allocation.",
    "simple": "The measurement function intentionally creates a whole doubled list so it can measure it. The summary function does not need to use memory for that extra list.",
    "runtime": "python",
    "lesson": "python-15"
  },
  {
    "source": "On the usual Python implementation, all four lines print True.",
    "simple": "With the usual version of Python, each of the four print calls shows True.",
    "runtime": "python",
    "lesson": "python-15"
  },
  {
    "source": "The list expression `[1] * 1000` repeats the one-entry list's contents a thousand times.",
    "simple": "`[1] * 1000` creates a list containing the value 1 a thousand times.",
    "runtime": "python",
    "lesson": "python-15"
  },
  {
    "source": "Import loads the standard-library sys module.",
    "simple": "The import instruction makes Python's included sys module available to this file.",
    "runtime": "python",
    "lesson": "python-15"
  },
  {
    "source": "Getsizeof returns an object's shallow size in bytes.",
    "simple": "getsizeof reports the object's own memory size in bytes, without adding up everything it refers to. This is called its shallow size.",
    "runtime": "python",
    "lesson": "python-15"
  },
  {
    "source": "The comma in return creates a tuple, and the two names on the left unpack its list and generator measurements.",
    "simple": "Return sends the two sizes back as a pair. The two names on the left save the list size and generator size separately.",
    "runtime": "python",
    "lesson": "python-15"
  },
  {
    "source": "The helper returns both measurements so the caller can inspect them;",
    "simple": "The function gives both sizes back so the code that called it can check them.",
    "runtime": "python",
    "lesson": "python-15"
  },
  {
    "source": "they are not unused local values.",
    "simple": "The measurements are not just calculated and then left unused inside the function.",
    "runtime": "python",
    "lesson": "python-15"
  },
  {
    "source": "Big O notation describes how work grows with input size.",
    "simple": "Big O is a way to describe how the amount of work changes as you give the code more input.",
    "runtime": "python",
    "lesson": "python-15"
  },
  {
    "source": "Here n means the number of input entries, not a particular loop variable's value.",
    "simple": "In Big O, n is the number of input items. It is not the value currently stored in the loop's variable n.",
    "runtime": "python",
    "lesson": "python-15"
  },
  {
    "source": "O(n), called linear growth, means doubling the number of entries roughly doubles this per-entry work.",
    "simple": "O(n), or linear growth, means twice as many items cause roughly twice as much of this repeated work.",
    "runtime": "python",
    "lesson": "python-15"
  },
  {
    "source": "O(1) is constant work with respect to n;",
    "simple": "O(1) means the amount of work stays constant as the number of input items grows.",
    "runtime": "python",
    "lesson": "python-15"
  },
  {
    "source": "O(n squared) can roughly quadruple when n doubles.",
    "simple": "With O(n squared), doubling the item count can make the work roughly four times as large.",
    "runtime": "python",
    "lesson": "python-15"
  },
  {
    "source": "Timing one run does not prove a growth law because machine load and fixed overhead also affect time.",
    "simple": "One timing test cannot establish how work grows. Other activity on the computer and startup work also affect elapsed time.",
    "runtime": "python",
    "lesson": "python-15"
  },
  {
    "source": "With the quiz's size change from 10 to 20, doubled work fits O(n).",
    "simple": "In the quiz, the input grows from 10 items to 20. Work that doubles with it fits O(n).",
    "runtime": "python",
    "lesson": "python-15"
  },
  {
    "source": "If ten inputs required about ten repeated steps, twenty would require about twenty in the same simple model.",
    "simple": "In this simple model, 10 inputs take about 10 repeated steps, and 20 inputs take about 20.",
    "runtime": "python",
    "lesson": "python-15"
  },
  {
    "source": "The running count-and-total state remains a fixed number of variables, but a stored input list still occupies memory.",
    "simple": "The code always keeps just a count and a total, but any list holding the original input still takes up memory.",
    "runtime": "python",
    "lesson": "python-15"
  },
  {
    "source": "A generator does not make its source list disappear, and large integer totals can themselves grow in size.",
    "simple": "Using a generator does not delete its input list. Also, very large integer totals can need more memory as they grow.",
    "runtime": "python",
    "lesson": "python-15"
  },
  {
    "source": "In the measurement helper, getsizeof for the list includes its shallow storage but not a full count of all referenced objects.",
    "simple": "For the list, getsizeof counts its own storage, not all the memory used by the objects its items point to.",
    "runtime": "python",
    "lesson": "python-15"
  },
  {
    "source": "The generator measurement likewise excludes the full source data and everything its future processing may use.",
    "simple": "For the generator, the measurement also leaves out the full source data and memory its later work might need.",
    "runtime": "python",
    "lesson": "python-15"
  },
  {
    "source": "Exact byte counts depend on the interpreter, so the exercise compares size growth rather than requiring one exact number.",
    "simple": "Different Python implementations can report different byte counts. Compare how the sizes grow instead of expecting one exact size.",
    "runtime": "python",
    "lesson": "python-15"
  },
  {
    "source": "The required summary for [2, 3, 5] is count 3 and doubled total 20;",
    "simple": "For [2, 3, 5], there are 3 numbers, and their doubled values add to 20.",
    "runtime": "python",
    "lesson": "python-15"
  },
  {
    "source": "empty input is (0, 0).",
    "simple": "For an empty input, send back `(0, 0)`.",
    "runtime": "python",
    "lesson": "python-15"
  },
  {
    "source": "Write summarize as the one-pass generator loop, and check it with both a list and a one-shot iterator.",
    "simple": "Make summarize use one loop over a generator. Try it with a list and with an iterator that can only be used once.",
    "runtime": "python",
    "lesson": "python-15"
  },
  {
    "source": "Write measure_sizes separately: build the transformed list, create the generator expression, and return the pair of shallow sizes.",
    "simple": "In the separate measure_sizes function, make the doubled list and the generator, measure each one's shallow size, and return both numbers.",
    "runtime": "python",
    "lesson": "python-15"
  },
  {
    "source": "Supply that helper with a reusable list rather than an iterator already consumed by summarize.",
    "simple": "Give measure_sizes a reusable list, not an iterator that summarize has already emptied.",
    "runtime": "python",
    "lesson": "python-15"
  },
  {
    "source": "Check that a much longer transformed list has a larger shallow size without guessing an exact byte count.",
    "simple": "Check that a much longer doubled list needs more of its own storage. Do not assume a particular number of bytes.",
    "runtime": "python",
    "lesson": "python-15"
  },
  {
    "source": "For a real large-file experiment, read lazily, compare identical data, record the interpreter and measurement method, and measure the relevant memory over the whole operation.",
    "simple": "For a real large-file test, read pieces only when needed and compare the same data. Record which Python and measuring method you use, and measure memory across the whole job.",
    "runtime": "python",
    "lesson": "python-15"
  },
  {
    "source": "This local exercise does not read a large file, and shallow object sizes are not a complete memory benchmark.",
    "simple": "This exercise does not open a large file. Measuring individual objects' shallow sizes does not tell you the program's complete memory use.",
    "runtime": "python",
    "lesson": "python-15"
  },
  {
    "source": "Asynchronous work can wait without preventing other asynchronous tasks from making progress.",
    "simple": "Asynchronous code lets one task wait while other asynchronous tasks continue working.",
    "runtime": "python",
    "lesson": "python-16"
  },
  {
    "source": "Python's asyncio module coordinates this.",
    "simple": "Python's asyncio module manages tasks that work this way.",
    "runtime": "python",
    "lesson": "python-16"
  },
  {
    "source": "Define an asynchronous function with async def.",
    "simple": "Start an asynchronous function with async def instead of just def.",
    "runtime": "python",
    "lesson": "python-16"
  },
  {
    "source": "Calling it creates a coroutine object, an operation that still needs to be awaited or scheduled to run.",
    "simple": "Calling it creates a coroutine, a piece of asynchronous work. You still need to await it or schedule it before it runs.",
    "runtime": "python",
    "lesson": "python-16"
  },
  {
    "source": "Await pauses that coroutine while its awaited operation finishes, letting the event loop coordinate other work.",
    "simple": "await pauses this coroutine until the operation it is waiting for finishes. Meanwhile, the event loop can arrange for other work to run.",
    "runtime": "python",
    "lesson": "python-16"
  },
  {
    "source": "This is concurrency, not a promise that CPU-heavy Python code runs on several processors.",
    "simple": "This is concurrency: tasks can make progress during each other's waits. It does not promise that demanding calculations run across several processors.",
    "runtime": "python",
    "lesson": "python-16"
  },
  {
    "source": "A coroutine normally runs inside an event loop.",
    "simple": "An event loop normally manages when a coroutine runs and waits.",
    "runtime": "python",
    "lesson": "python-16"
  },
  {
    "source": "`asyncio.run(main())` starts a loop, runs the main coroutine, and finishes the local program's asynchronous work.",
    "simple": "`asyncio.run(main())` starts that loop, runs main, and handles finishing the script's asynchronous work.",
    "runtime": "python",
    "lesson": "python-16"
  },
  {
    "source": "Inside an async function, `await asyncio.sleep(seconds)` creates a nonblocking practice wait.",
    "simple": "Inside an async function, `await asyncio.sleep(seconds)` waits for practice without preventing other asynchronous tasks from running.",
    "runtime": "python",
    "lesson": "python-16"
  },
  {
    "source": "These examples are standalone scripts, so run them in a setting where no event loop is already running.",
    "simple": "Run these examples as their own scripts, in a place where an event loop is not already running.",
    "runtime": "python",
    "lesson": "python-16"
  },
  {
    "source": "They simulate delays locally rather than opening sockets or contacting a service.",
    "simple": "The waits happen on the local computer. They do not open network connections or contact an outside service.",
    "runtime": "python",
    "lesson": "python-16"
  },
  {
    "source": "This complete example shows a timeout.",
    "simple": "This full example stops waiting when an operation takes too long.",
    "runtime": "python",
    "lesson": "python-16"
  },
  {
    "source": "Under ordinary scheduling it prints finished, then timed out.",
    "simple": "With normal scheduling, it prints finished for the short wait and timed out for the long one.",
    "runtime": "python",
    "lesson": "python-16"
  },
  {
    "source": "Wait_for limits the intended wait and raises TimeoutError if the awaited operation is too slow.",
    "simple": "wait_for sets a waiting limit. If the operation takes too long, it raises TimeoutError.",
    "runtime": "python",
    "lesson": "python-16"
  },
  {
    "source": "It requests cancellation of the awaited work;",
    "simple": "When the limit is reached, wait_for asks the operation it was waiting for to stop.",
    "runtime": "python",
    "lesson": "python-16"
  },
  {
    "source": "completing cancellation can make the total wall-clock wait exceed the stated timeout.",
    "simple": "Stopping that work can take extra time, so the actual time on the clock can be longer than the stated limit.",
    "runtime": "python",
    "lesson": "python-16"
  },
  {
    "source": "Bounded retries put a limit on how many attempts are allowed.",
    "simple": "Bounded retries means you allow only a set number of attempts, not endless tries.",
    "runtime": "python",
    "lesson": "python-16"
  },
  {
    "source": "`outcomes[:attempts]` slices from the beginning and excludes entries past that limit.",
    "simple": "`outcomes[:attempts]` takes only the outcomes from the start up to the allowed attempt count.",
    "runtime": "python",
    "lesson": "python-16"
  },
  {
    "source": "A default parameter such as attempts=2 supplies a value when the caller omits that argument.",
    "simple": "With attempts=2, the function uses 2 attempts unless the caller supplies a different number.",
    "runtime": "python",
    "lesson": "python-16"
  },
  {
    "source": "Inside a loop, continue skips to the next attempt.",
    "simple": "continue skips the rest of this repeat and moves to the next attempt.",
    "runtime": "python",
    "lesson": "python-16"
  },
  {
    "source": "Return exits the entire coroutine call, so it can immediately report an ordinary success or a non-timeout failure.",
    "simple": "return stops this whole coroutine call. It can send back a successful answer or an error answer immediately, without trying again.",
    "runtime": "python",
    "lesson": "python-16"
  },
  {
    "source": "Here is a complete retrying fixture with concurrent collection.",
    "simple": "This full practice example retries slow work and collects two operations while they run concurrently.",
    "runtime": "python",
    "lesson": "python-16"
  },
  {
    "source": "Under ordinary scheduling it prints `['complete', 'failed']`.",
    "simple": "With normal scheduling, the result is `['complete', 'failed']`.",
    "runtime": "python",
    "lesson": "python-16"
  },
  {
    "source": "Gather runs the awaitable operations concurrently and returns results in input order.",
    "simple": "gather lets the operations make progress together. It gives back their answers in the order they were supplied, not the order they finished.",
    "runtime": "python",
    "lesson": "python-16"
  },
  {
    "source": "The first collector retries after its first timeout;",
    "simple": "The first collect call tries again after its first attempt times out.",
    "runtime": "python",
    "lesson": "python-16"
  },
  {
    "source": "the second reports the supplied error without retrying forever.",
    "simple": "The second collect call reports the supplied error instead of retrying without end.",
    "runtime": "python",
    "lesson": "python-16"
  },
  {
    "source": "The fixture leaves a wide timing gap: ordinary responses wait 0.001 seconds, each attempt allows 0.2 seconds, and a deliberately slow response waits 0.6 seconds.",
    "simple": "Normal responses wait 0.001 seconds, while each attempt is allowed 0.2 seconds. The intentionally slow response waits 0.6 seconds, clearly beyond that limit.",
    "runtime": "python",
    "lesson": "python-16"
  },
  {
    "source": "Operating-system timers are not exact, so this gap keeps a normal response well away from the timeout boundary.",
    "simple": "Computer timers are not perfectly exact. Keeping the normal wait much shorter than the limit makes the example less likely to time out unexpectedly.",
    "runtime": "python",
    "lesson": "python-16"
  },
  {
    "source": "Cancellation asks scheduled work to stop.",
    "simple": "Cancellation is a request for scheduled work to stop.",
    "runtime": "python",
    "lesson": "python-16"
  },
  {
    "source": "Create_task schedules a coroutine and returns a task object.",
    "simple": "create_task schedules a coroutine to run and gives you a task object for keeping track of it.",
    "runtime": "python",
    "lesson": "python-16"
  },
  {
    "source": "Cancel requests cancellation;",
    "simple": "Calling cancel asks the task to stop; it is a request, not proof that it has already stopped.",
    "runtime": "python",
    "lesson": "python-16"
  },
  {
    "source": "awaiting the task lets you observe that outcome.",
    "simple": "Await the task afterward to see what happened to that cancellation request.",
    "runtime": "python",
    "lesson": "python-16"
  },
  {
    "source": "Here is a complete cancellation example.",
    "simple": "This complete example requests cancellation and then checks the outcome.",
    "runtime": "python",
    "lesson": "python-16"
  },
  {
    "source": "It prints Cancellation observed.",
    "simple": "The message shown is Cancellation observed.",
    "runtime": "python",
    "lesson": "python-16"
  },
  {
    "source": "The example catches cancellation to demonstrate observation.",
    "simple": "The example handles the cancellation error so you can see that cancellation happened.",
    "runtime": "python",
    "lesson": "python-16"
  },
  {
    "source": "In ordinary application code, cleanup often uses finally and cancellation is usually allowed to propagate after cleanup instead of being mistaken for a successful result.",
    "simple": "In real programs, finally often handles cleanup. After cleaning up, code usually lets cancellation pass back to its caller rather than reporting normal success.",
    "runtime": "python",
    "lesson": "python-16"
  },
  {
    "source": "The matching probability assumes independent tries: one outcome does not change the next try's chance.",
    "simple": "The probability example assumes each try is independent: a previous success or failure does not change the next try's chances.",
    "runtime": "python",
    "lesson": "python-16"
  },
  {
    "source": "If each try succeeds with chance 0.5, each fails with chance 0.5.",
    "simple": "If success has a 0.5 chance on each try, failure also has a 0.5 chance on each try.",
    "runtime": "python",
    "lesson": "python-16"
  },
  {
    "source": "Two failures together have chance 0.5 times 0.5, or 0.25.",
    "simple": "The chance of two failures is 0.5 times 0.5, which equals 0.25.",
    "runtime": "python",
    "lesson": "python-16"
  },
  {
    "source": "At least one success is the complement: 1 minus 0.25 equals 0.75.",
    "simple": "“At least one success” is everything except two failures. Its chance is 1 minus 0.25, or 0.75.",
    "runtime": "python",
    "lesson": "python-16"
  },
  {
    "source": "This calculation is valid only under the stated independence and fixed-probability assumptions;",
    "simple": "That calculation only works if the tries are independent and each keeps the same stated success chance.",
    "runtime": "python",
    "lesson": "python-16"
  },
  {
    "source": "it is not a guarantee for any particular run.",
    "simple": "A probability describes chances; it does not promise what will happen on one run.",
    "runtime": "python",
    "lesson": "python-16"
  },
  {
    "source": "Your checks require ready after timeout then ready, failed after error, and timed out when two allowed attempts both time out even if a third outcome exists.",
    "simple": "The tests expect ready after timeout then ready, and failed after error. If both of the two allowed attempts time out, return timed out even if a third outcome is available.",
    "runtime": "python",
    "lesson": "python-16"
  },
  {
    "source": "Collect_pair must await gather and return [\"ready\", \"timed out\"].",
    "simple": "collect_pair must await gather and send back [\"ready\", \"timed out\"].",
    "runtime": "python",
    "lesson": "python-16"
  },
  {
    "source": "Cancellation_observed must cancel and await a task, catch CancelledError, and return True.",
    "simple": "cancellation_observed must cancel a task, await it, handle CancelledError, and send back True.",
    "runtime": "python",
    "lesson": "python-16"
  },
  {
    "source": "A timeout ends waiting according to the async mechanism;",
    "simple": "A timeout controls when this asynchronous code stops waiting for an answer.",
    "runtime": "python",
    "lesson": "python-16"
  },
  {
    "source": "it does not prove a remote server did no work.",
    "simple": "It does not establish that a remote server never started or finished the requested work.",
    "runtime": "python",
    "lesson": "python-16"
  },
  {
    "source": "These delays remain local fixtures, and unusually delayed scheduling can affect timing demonstrations.",
    "simple": "These are local practice delays only. If the computer schedules work unusually late, the timing examples can behave differently.",
    "runtime": "python",
    "lesson": "python-16"
  },
  {
    "source": "A reusable library is code that other programs can import and call.",
    "simple": "A library is reusable code that another program can import and run.",
    "runtime": "python",
    "lesson": "python-17"
  },
  {
    "source": "Tests document examples of how it should behave.",
    "simple": "Tests record sample inputs and the answers the code is supposed to produce.",
    "runtime": "python",
    "lesson": "python-17"
  },
  {
    "source": "A unit test checks a small part, such as one function, using known inputs and expected outcomes.",
    "simple": "A unit test checks one small piece, such as a function, by comparing a known input's result with the expected answer.",
    "runtime": "python",
    "lesson": "python-17"
  },
  {
    "source": "This project's clamp function keeps a value within inclusive bounds: below the lower bound becomes the lower bound, inside stays unchanged, and above the upper bound becomes the upper bound.",
    "simple": "clamp keeps a number within two limits, including the limits themselves. Too small becomes the lower limit, too large becomes the upper limit, and anything already inside stays as it is.",
    "runtime": "python",
    "lesson": "python-17"
  },
  {
    "source": "Max chooses the larger value and min chooses the smaller.",
    "simple": "max picks the bigger number, while min picks the smaller number.",
    "runtime": "python",
    "lesson": "python-17"
  },
  {
    "source": "`min(value, high)` caps the upper limit.",
    "simple": "`min(value, high)` keeps value if it is low enough, or uses high if value is too large.",
    "runtime": "python",
    "lesson": "python-17"
  },
  {
    "source": "Taking `max(low, ...)` afterward enforces the lower limit too.",
    "simple": "Then `max(low, ...)` keeps that answer unless it is too small, in which case it uses low.",
    "runtime": "python",
    "lesson": "python-17"
  },
  {
    "source": "If low exceeds high, there is no sensible ordered interval, so raise ValueError with a useful message.",
    "simple": "If low is larger than high, the limits are backward. Report this using ValueError and a message explaining the problem.",
    "runtime": "python",
    "lesson": "python-17"
  },
  {
    "source": "Raise reports an exception rather than silently choosing an invalid result.",
    "simple": "raise reports an error explicitly rather than quietly sending back a wrong answer.",
    "runtime": "python",
    "lesson": "python-17"
  },
  {
    "source": "Here is a complete clamp implementation with worked calls.",
    "simple": "This full clamp function is followed by calls showing how it handles different inputs.",
    "runtime": "python",
    "lesson": "python-17"
  },
  {
    "source": "It prints 2, 5, and 8.",
    "simple": "The three printed answers are 2, then 5, then 8.",
    "runtime": "python",
    "lesson": "python-17"
  },
  {
    "source": "For 12, min chooses 8, then max compares 2 and 8 and keeps 8.",
    "simple": "For input 12, min picks 8. Then max compares 2 with 8 and picks 8.",
    "runtime": "python",
    "lesson": "python-17"
  },
  {
    "source": "For -4, min keeps -4, then max raises it to 2.",
    "simple": "For input -4, min first keeps -4. Then max compares it with 2 and picks 2.",
    "runtime": "python",
    "lesson": "python-17"
  },
  {
    "source": "Inclusive means both 2 and 8 are allowed without changing them.",
    "simple": "Both boundary values, 2 and 8, are allowed and stay unchanged. That is what inclusive means here.",
    "runtime": "python",
    "lesson": "python-17"
  },
  {
    "source": "Tests should check behavior, including the boundaries themselves.",
    "simple": "Test what the function does at the exact limits as well as below, inside, and above them.",
    "runtime": "python",
    "lesson": "python-17"
  },
  {
    "source": "It prints the rejection message and Behavior checks passed.",
    "simple": "It prints Invalid bounds rejected, then Behavior checks passed.",
    "runtime": "python",
    "lesson": "python-17"
  },
  {
    "source": "Assert raises an AssertionError when its comparison is false.",
    "simple": "If an assert check gives False, Python reports AssertionError to show that a test failed.",
    "runtime": "python",
    "lesson": "python-17"
  },
  {
    "source": "The try/except/else ensures invalid bounds actually raise the intended error.",
    "simple": "The try/except/else checks that backward limits really cause ValueError. If no error happens, the test reports failure.",
    "runtime": "python",
    "lesson": "python-17"
  },
  {
    "source": "The exercise's range is 0 through 10.",
    "simple": "Your exercise uses a lower limit of 0 and an upper limit of 10.",
    "runtime": "python",
    "lesson": "python-17"
  },
  {
    "source": "An input of -1 becomes 0, 5 stays 5, and 12 becomes 10.",
    "simple": "With those limits, -1 becomes 0, 5 remains 5, and 12 becomes 10.",
    "runtime": "python",
    "lesson": "python-17"
  },
  {
    "source": "The quiz asks for the last case.",
    "simple": "The quiz asks what happens to 12: it becomes 10.",
    "runtime": "python",
    "lesson": "python-17"
  },
  {
    "source": "A useful README describes the allowed numeric inputs, the inclusive bounds, the invalid-bound exception, and a worked call.",
    "simple": "In the README, explain the allowed numbers, that both limits count, and the error for backward limits. Include a complete sample call.",
    "runtime": "python",
    "lesson": "python-17"
  },
  {
    "source": "These examples assume comparable ordinary numbers;",
    "simple": "The examples use ordinary numbers that Python can compare with each other.",
    "runtime": "python",
    "lesson": "python-17"
  },
  {
    "source": "a real library should decide separately how to treat unusual values such as NaN or strings rather than silently claiming they satisfy the contract.",
    "simple": "A real library must separately decide what to do with text or NaN, a special “not a number” value. Do not assume these unusual inputs follow the same rules.",
    "runtime": "python",
    "lesson": "python-17"
  },
  {
    "source": "Packaging makes a library available for installation.",
    "simple": "Packaging prepares your library so other people can install it.",
    "runtime": "python",
    "lesson": "python-17"
  },
  {
    "source": "The supplied pyproject.toml records its name, version, required Python, and dependencies=[] because this function needs no third-party runtime package.",
    "simple": "pyproject.toml describes the name, version, and required Python. Its dependencies=[] says this function needs no extra third-party package to run.",
    "runtime": "python",
    "lesson": "python-17"
  },
  {
    "source": "A complete single-file packaging example can also specify a build backend, the tool that creates the installable package.",
    "simple": "For a complete package made from one Python file, you can also name a build backend: the tool that prepares the installable package.",
    "runtime": "python",
    "lesson": "python-17"
  },
  {
    "source": "This configuration assumes the implementation is saved in clamp.py beside it:",
    "simple": "This setup expects the function's code in clamp.py, in the same folder as the configuration file.",
    "runtime": "python",
    "lesson": "python-17"
  },
  {
    "source": "The build requirement is used to build the package;",
    "simple": "The build requirement is a tool needed while making the package.",
    "runtime": "python",
    "lesson": "python-17"
  },
  {
    "source": "the runtime dependencies list describes what users need when running it.",
    "simple": "Runtime dependencies are packages people need when they run the installed code.",
    "runtime": "python",
    "lesson": "python-17"
  },
  {
    "source": "They serve different stages.",
    "simple": "Building the package and running it are different stages with different requirements.",
    "runtime": "python",
    "lesson": "python-17"
  },
  {
    "source": "A wheel is an installable Python package archive.",
    "simple": "A wheel is a packaged Python file archive ready to install.",
    "runtime": "python",
    "lesson": "python-17"
  },
  {
    "source": "A virtual environment provides a separate place to install and try it.",
    "simple": "A virtual environment is a separate place to install and test packages without mixing them with another project's packages.",
    "runtime": "python",
    "lesson": "python-17"
  },
  {
    "source": "A local packaging workflow uses a Python environment, installs the build tool, runs that tool in the project folder to create the wheel, then installs that wheel into a fresh environment.",
    "simple": "Locally, install the build tool in a Python environment, then run it in the project folder to make a wheel. Install that wheel into a new, clean environment.",
    "runtime": "python",
    "lesson": "python-17"
  },
  {
    "source": "Afterward, import clamp from the installed module and run the documented examples and tests there.",
    "simple": "In that clean environment, import clamp from the installed package and run its documented examples and tests.",
    "runtime": "python",
    "lesson": "python-17"
  },
  {
    "source": "Keep the function file, metadata, and README together during the build.",
    "simple": "Keep the code file, project information, and README together while creating the package.",
    "runtime": "python",
    "lesson": "python-17"
  },
  {
    "source": "The browser checks only clamp's returned behavior.",
    "simple": "The browser tests check only the answers returned by clamp.",
    "runtime": "python",
    "lesson": "python-17"
  },
  {
    "source": "They do not build a wheel, install a package, or prove a clean environment works.",
    "simple": "They do not create a wheel or install anything, and they do not show that a clean installation works.",
    "runtime": "python",
    "lesson": "python-17"
  },
  {
    "source": "The supplied metadata may need additional build configuration and source-layout details for that wider goal.",
    "simple": "To make an installable package, you may also need build settings and information about where the source files are located.",
    "runtime": "python",
    "lesson": "python-17"
  },
  {
    "source": "An actual package check must use the local files and confirm importing from the installed package rather than accidentally importing the source folder.",
    "simple": "For a real installation test, build from the local files and check that Python imports the installed package. Make sure it is not just finding the original source folder.",
    "runtime": "python",
    "lesson": "python-17"
  },
  {
    "source": "Treat a passing function test and a passing installation test as separate evidence.",
    "simple": "A correct function and a working installation are two different things. Test each one separately.",
    "runtime": "python",
    "lesson": "python-17"
  },
  {
    "source": "Statistics summarizes observed data.",
    "simple": "Statistics helps you describe a collection of measurements or observations.",
    "runtime": "python",
    "lesson": "python-18"
  },
  {
    "source": "A sample is the values you actually observed, which may represent only part of a larger population.",
    "simple": "A sample is the data you actually collected. It may cover only some of the people or things in the larger group you care about.",
    "runtime": "python",
    "lesson": "python-18"
  },
  {
    "source": "Count says how many values are present.",
    "simple": "The count is how many observations you have.",
    "runtime": "python",
    "lesson": "python-18"
  },
  {
    "source": "Mean is the sum divided by count.",
    "simple": "To find the mean, add the values and divide by how many there are.",
    "runtime": "python",
    "lesson": "python-18"
  },
  {
    "source": "Median is the middle of the sorted values.",
    "simple": "The median is the middle value after putting the observations in order, or the average of the middle pair when there are two.",
    "runtime": "python",
    "lesson": "python-18"
  },
  {
    "source": "These summaries describe the sample;",
    "simple": "These results describe the observations in your sample.",
    "runtime": "python",
    "lesson": "python-18"
  },
  {
    "source": "by themselves they do not prove what all future observations will look like.",
    "simple": "They do not, by themselves, prove what every future observation will be.",
    "runtime": "python",
    "lesson": "python-18"
  },
  {
    "source": "Calculate the mean of [3, 5, 10] by adding 3 + 5 + 10 = 18, then dividing by the count 3 to get 6.",
    "simple": "For [3, 5, 10], add 3 + 5 + 10 to get 18. Divide 18 by the 3 values to get a mean of 6.",
    "runtime": "python",
    "lesson": "python-18"
  },
  {
    "source": "Sum and len are Python's built-in functions for the total and count.",
    "simple": "Python's sum function adds the values, and len counts how many there are.",
    "runtime": "python",
    "lesson": "python-18"
  },
  {
    "source": "An empty sample has count zero and no mean;",
    "simple": "With no observations, the count is 0 and there is no mean to calculate.",
    "runtime": "python",
    "lesson": "python-18"
  },
  {
    "source": "division by zero is an error.",
    "simple": "Trying to divide by 0 causes an error.",
    "runtime": "python",
    "lesson": "python-18"
  },
  {
    "source": "Return None for the unavailable mean and median rather than inventing zero-valued summaries.",
    "simple": "For empty data, use None for the mean and median. Do not pretend their answers are the number 0.",
    "runtime": "python",
    "lesson": "python-18"
  },
  {
    "source": "This complete first example shows mean and a safe empty case.",
    "simple": "This complete example calculates a mean and also handles an empty list safely.",
    "runtime": "python",
    "lesson": "python-18"
  },
  {
    "source": "It prints 6.0 and None.",
    "simple": "The results shown are 6.0 for the data and None for the empty list.",
    "runtime": "python",
    "lesson": "python-18"
  },
  {
    "source": "The slash performs division and returns a float.",
    "simple": "The `/` sign divides the numbers, giving a float, a number that can have a decimal part.",
    "runtime": "python",
    "lesson": "python-18"
  },
  {
    "source": "The initial if checks the empty list before any division happens.",
    "simple": "The first if catches an empty list before the code tries to divide.",
    "runtime": "python",
    "lesson": "python-18"
  },
  {
    "source": "A numeric zero mean would be a real result, while None means there were no observations to summarize.",
    "simple": "A mean of 0 would be a real calculated answer. None means no data was available to calculate an answer.",
    "runtime": "python",
    "lesson": "python-18"
  },
  {
    "source": "To find a median, sort a copy using sorted so the input order survives.",
    "simple": "Use sorted to make a new ordered list for finding the median. That leaves the input list in its original order.",
    "runtime": "python",
    "lesson": "python-18"
  },
  {
    "source": "For an odd count, the middle entry is the median.",
    "simple": "If there is an odd number of values, take the single value in the middle.",
    "runtime": "python",
    "lesson": "python-18"
  },
  {
    "source": "For [3, 5, 10], the middle value is 5, at index 1.",
    "simple": "In [3, 5, 10], the middle value is 5. Its position number is 1.",
    "runtime": "python",
    "lesson": "python-18"
  },
  {
    "source": "`count // 2` uses whole-number floor division to calculate the middle index.",
    "simple": "`count // 2` divides the count by 2 and rounds down to a whole number. That gives the middle position number.",
    "runtime": "python",
    "lesson": "python-18"
  },
  {
    "source": "For a positive count 3, it gives 1.",
    "simple": "For count 3, 3 // 2 gives 1.",
    "runtime": "python",
    "lesson": "python-18"
  },
  {
    "source": "Indexes begin at zero, so the second entry has index 1.",
    "simple": "Position numbers start at 0, so position 1 is the second item.",
    "runtime": "python",
    "lesson": "python-18"
  },
  {
    "source": "For an even count there are two middle entries.",
    "simple": "If there is an even number of values, two values share the middle.",
    "runtime": "python",
    "lesson": "python-18"
  },
  {
    "source": "With [2, 6, 8, 12], count is 4 and mid is 2.",
    "simple": "For [2, 6, 8, 12], there are 4 items, so count is 4 and mid is 2.",
    "runtime": "python",
    "lesson": "python-18"
  },
  {
    "source": "The two entries are at indexes mid - 1 and mid: 6 and 8.",
    "simple": "The middle values are 6 at mid - 1 and 8 at mid, which are positions 1 and 2.",
    "runtime": "python",
    "lesson": "python-18"
  },
  {
    "source": "Their average, (6 + 8) divided by 2, is 7.",
    "simple": "Add those middle values, 6 + 8, then divide by 2. The median is 7.",
    "runtime": "python",
    "lesson": "python-18"
  },
  {
    "source": "`count % 2` gives the remainder after dividing by two: 1 for odd counts and 0 for even counts.",
    "simple": "`count % 2` finds what is left after division by 2. Odd counts leave 1; even counts leave 0.",
    "runtime": "python",
    "lesson": "python-18"
  },
  {
    "source": "Parentheses make the addition happen before division.",
    "simple": "Put the addition in parentheses so Python adds the middle numbers before dividing by 2.",
    "runtime": "python",
    "lesson": "python-18"
  },
  {
    "source": "Here is a complete summary covering both median cases.",
    "simple": "This full function handles both a single middle value and a middle pair.",
    "runtime": "python",
    "lesson": "python-18"
  },
  {
    "source": "It prints count 3, mean 6.0, median 5;",
    "simple": "For the first sample, the result has count 3, mean 6.0, and median 5.",
    "runtime": "python",
    "lesson": "python-18"
  },
  {
    "source": "then count 4, mean 7.0, median 7.0;",
    "simple": "For the second sample, the result has count 4, mean 7.0, and median 7.0.",
    "runtime": "python",
    "lesson": "python-18"
  },
  {
    "source": "then count 0 with both summaries None.",
    "simple": "For the empty sample, count is 0 and both mean and median are None.",
    "runtime": "python",
    "lesson": "python-18"
  },
  {
    "source": "The actual displayed results are dictionaries with those named fields.",
    "simple": "Python displays each result as a dictionary with keys named count, mean, and median.",
    "runtime": "python",
    "lesson": "python-18"
  },
  {
    "source": "The supplied solution's compact conditional expression chooses `ordered[mid]` when count's remainder is nonzero;",
    "simple": "In the supplied one-line choice, a nonzero remainder means an odd count, so it takes `ordered[mid]`.",
    "runtime": "python",
    "lesson": "python-18"
  },
  {
    "source": "otherwise it averages the middle pair.",
    "simple": "If the remainder is zero, the count is even, so it takes the average of the two middle values.",
    "runtime": "python",
    "lesson": "python-18"
  },
  {
    "source": "Nonzero numbers count as true in a condition and zero counts as false.",
    "simple": "In an if-style check, any nonzero number counts as True, while 0 counts as False.",
    "runtime": "python",
    "lesson": "python-18"
  },
  {
    "source": "This is equivalent to the explicit if/else example above.",
    "simple": "This short choice does the same job as the longer if/else version above.",
    "runtime": "python",
    "lesson": "python-18"
  },
  {
    "source": "Mean and median need not be equal: the [3, 5, 10] example has mean 6 but median 5 because the larger value affects the mean's total.",
    "simple": "Mean and median can differ. For [3, 5, 10], the large 10 helps pull the mean up to 6, while the middle value stays 5.",
    "runtime": "python",
    "lesson": "python-18"
  },
  {
    "source": "For the quiz [1, 3, 7, 9], the total is 20 and the count is 4, so the mean is 5.",
    "simple": "For the quiz's [1, 3, 7, 9], the values add to 20. Dividing by 4 gives a mean of 5.",
    "runtime": "python",
    "lesson": "python-18"
  },
  {
    "source": "The middle pair 3 and 7 also averages to 5, giving the same median in this particular sample.",
    "simple": "The middle pair is 3 and 7, whose average is also 5. In this sample, mean and median happen to match.",
    "runtime": "python",
    "lesson": "python-18"
  },
  {
    "source": "The checks' [2, 4, 6] has mean 4.0 and median 4.",
    "simple": "For the test data [2, 4, 6], the mean is 4.0 and the median is 4.",
    "runtime": "python",
    "lesson": "python-18"
  },
  {
    "source": "When comparing a sample with a reference distribution, describe agreements and differences rather than claiming proof;",
    "simple": "When comparing your observations with an expected pattern, explain where they match and differ. A match is not proof that the whole population follows that pattern.",
    "runtime": "python",
    "lesson": "python-18"
  },
  {
    "source": "sample size, selection, and variation affect what conclusions are reasonable.",
    "simple": "Your conclusions depend on how much data you have, how you chose it, and how much the values vary.",
    "runtime": "python",
    "lesson": "python-18"
  },
  {
    "source": "The fixture checks calculations and empty data, not a full uncertainty study.",
    "simple": "These practice tests check the arithmetic and empty-list handling. They do not measure all the uncertainty in real data.",
    "runtime": "python",
    "lesson": "python-18"
  },
  {
    "source": "A reproducible environment lets someone run the same tool with the needed interpreter and packages.",
    "simple": "A reproducible setup lets someone else run the tool with the right Python version and the packages it needs.",
    "runtime": "python",
    "lesson": "python-19"
  },
  {
    "source": "The interpreter is the program that reads and runs Python code.",
    "simple": "The interpreter is the program that follows and runs your Python instructions.",
    "runtime": "python",
    "lesson": "python-19"
  },
  {
    "source": "A dependency is another package your code needs.",
    "simple": "A dependency is another software package your program needs in order to work.",
    "runtime": "python",
    "lesson": "python-19"
  },
  {
    "source": "Python's built-in functions and standard library come with Python;",
    "simple": "Python already includes its built-in functions and its standard library of modules.",
    "runtime": "python",
    "lesson": "python-19"
  },
  {
    "source": "third-party packages are installed separately.",
    "simple": "Packages made outside that included library must be installed separately.",
    "runtime": "python",
    "lesson": "python-19"
  },
  {
    "source": "Project metadata is information describing the project, its version, Python requirements, and dependencies.",
    "simple": "Project metadata means facts about the project, such as its name, version, needed Python version, and extra packages.",
    "runtime": "python",
    "lesson": "python-19"
  },
  {
    "source": "First understand the small tool's actual behavior.",
    "simple": "Start by understanding exactly what this small program does before thinking about installing it.",
    "runtime": "python",
    "lesson": "python-19"
  },
  {
    "source": "Max is a built-in function that finds the largest input value.",
    "simple": "Python's ready-made max function chooses the largest of the values you give it.",
    "runtime": "python",
    "lesson": "python-19"
  },
  {
    "source": "It needs at least one value, so define what the tool returns for an empty list before calling max.",
    "simple": "For this use of max, the list must contain a value. Decide what your function should return for an empty list before you call max.",
    "runtime": "python",
    "lesson": "python-19"
  },
  {
    "source": "None is an explicit no-result marker, rather than a guessed number such as zero.",
    "simple": "None clearly means “there is no answer.” It is better than guessing that the answer should be 0.",
    "runtime": "python",
    "lesson": "python-19"
  },
  {
    "source": "Zero could be lower than or higher than a legitimate largest reading.",
    "simple": "The real largest reading could be below 0 or above 0, so 0 is not a safe replacement for missing data.",
    "runtime": "python",
    "lesson": "python-19"
  },
  {
    "source": "Here is a complete nonempty and empty example.",
    "simple": "This complete example tries both a list with values and an empty list.",
    "runtime": "python",
    "lesson": "python-19"
  },
  {
    "source": "It prints 21 and None.",
    "simple": "It shows 21 for the largest reading and None for the empty list.",
    "runtime": "python",
    "lesson": "python-19"
  },
  {
    "source": "An empty list counts as false in a condition;",
    "simple": "When used in a condition, an empty list counts as False.",
    "runtime": "python",
    "lesson": "python-19"
  },
  {
    "source": "not reverses it, making the first branch true.",
    "simple": "not turns that False into True, so the first if block runs for an empty list.",
    "runtime": "python",
    "lesson": "python-19"
  },
  {
    "source": "Return exits the function before max receives the empty list.",
    "simple": "Return ends the function at that point, so max is never given the empty list.",
    "runtime": "python",
    "lesson": "python-19"
  },
  {
    "source": "This code uses only Python's built-in capabilities, so no third-party dependency is needed.",
    "simple": "Everything this function needs is already part of Python. No extra third-party package is required.",
    "runtime": "python",
    "lesson": "python-19"
  },
  {
    "source": "The same behavior can be written as a conditional expression.",
    "simple": "You can write the same choice in a shorter, one-line form.",
    "runtime": "python",
    "lesson": "python-19"
  },
  {
    "source": "It prints -3, 0, and True.",
    "simple": "The three printed answers are -3, then 0, then True.",
    "runtime": "python",
    "lesson": "python-19"
  },
  {
    "source": "Read the return as: use max(values) if the list is nonempty, otherwise use None.",
    "simple": "The return line says: if values has items, use max(values); if it is empty, use None.",
    "runtime": "python",
    "lesson": "python-19"
  },
  {
    "source": "Negative readings are not replaced with a guessed zero.",
    "simple": "If all readings are negative, the function still returns the largest negative reading. It does not replace it with 0.",
    "runtime": "python",
    "lesson": "python-19"
  },
  {
    "source": "The final is None checks the exact no-result marker rather than a string saying \"None\".",
    "simple": "The final is None checks for Python's actual no-result marker, not the text \"None\".",
    "runtime": "python",
    "lesson": "python-19"
  },
  {
    "source": "The supplied metadata file is pyproject.toml.",
    "simple": "The project information is stored in the provided file named pyproject.toml.",
    "runtime": "python",
    "lesson": "python-19"
  },
  {
    "source": "TOML is a configuration format, not Python code.",
    "simple": "TOML is a way to write settings and project information. It is not code for Python to run.",
    "runtime": "python",
    "lesson": "python-19"
  },
  {
    "source": "This example describes the tool:",
    "simple": "The following settings describe this particular tool.",
    "runtime": "python",
    "lesson": "python-19"
  },
  {
    "source": "The project table groups metadata.",
    "simple": "The [project] section keeps the project's descriptive information together.",
    "runtime": "python",
    "lesson": "python-19"
  },
  {
    "source": "The name identifies the package, version identifies its release, and requires-python says the interpreter must be at least version 3.10.",
    "simple": "name gives the package's name, and version labels this release. requires-python says to use Python 3.10 or newer.",
    "runtime": "python",
    "lesson": "python-19"
  },
  {
    "source": "An empty dependencies list declares no third-party runtime packages.",
    "simple": "An empty dependencies list says there are no additional third-party packages needed to run the tool.",
    "runtime": "python",
    "lesson": "python-19"
  },
  {
    "source": "It does not say that Python itself is unnecessary, and it does not install anything.",
    "simple": "You still need Python. This settings file does not install Python or any packages by itself.",
    "runtime": "python",
    "lesson": "python-19"
  },
  {
    "source": "A virtual environment is a separate local place for a project's installed packages.",
    "simple": "A virtual environment keeps one project's installed packages in a separate local place.",
    "runtime": "python",
    "lesson": "python-19"
  },
  {
    "source": "The venv module creates one;",
    "simple": "Python's venv module can create that separate environment.",
    "runtime": "python",
    "lesson": "python-19"
  },
  {
    "source": "pip installs packages into the Python environment it is run with.",
    "simple": "pip installs packages for the particular Python environment you use to run it.",
    "runtime": "python",
    "lesson": "python-19"
  },
  {
    "source": "For a third-party tool, record its actual dependency names and compatible versions, then install those declared requirements in the environment.",
    "simple": "If your tool needs other packages, record their real names and compatible versions. Then install those listed requirements in the project's environment.",
    "runtime": "python",
    "lesson": "python-19"
  },
  {
    "source": "Keep a README with the entry point and example inputs.",
    "simple": "Write a README explaining where to start the program and showing sample inputs.",
    "runtime": "python",
    "lesson": "python-19"
  },
  {
    "source": "This lesson's function needs no extra package and can run from its saved Python file with a compatible interpreter.",
    "simple": "This lesson's function needs no extra packages. Save it as a Python file and run it with a supported Python version.",
    "runtime": "python",
    "lesson": "python-19"
  },
  {
    "source": "Metadata alone does not prove installation works.",
    "simple": "Writing down requirements does not prove the program can actually be installed.",
    "runtime": "python",
    "lesson": "python-19"
  },
  {
    "source": "To verify reproducibility locally, create a fresh environment with the required Python, install the packaged project and its declared requirements, and run the documented examples there.",
    "simple": "To check, make a clean environment with the required Python, install the packaged project and its listed requirements, and try the documented examples there.",
    "runtime": "python",
    "lesson": "python-19"
  },
  {
    "source": "A complete installable package also needs an appropriate build configuration and source layout.",
    "simple": "An installable package also needs suitable build settings and source files arranged where the build tool expects them.",
    "runtime": "python",
    "lesson": "python-19"
  },
  {
    "source": "The browser exercise neither creates a virtual environment nor invokes pip.",
    "simple": "The browser exercise does not make a virtual environment or run pip.",
    "runtime": "python",
    "lesson": "python-19"
  },
  {
    "source": "Its supplied metadata documents requirements;",
    "simple": "The provided project information tells you what the tool requires.",
    "runtime": "python",
    "lesson": "python-19"
  },
  {
    "source": "its checks demonstrate the highest-reading function only.",
    "simple": "The browser tests only check that the highest-reading function works as expected.",
    "runtime": "python",
    "lesson": "python-19"
  },
  {
    "source": "For the required fixture, [18, 23, 19] should return 23 and an empty list should return None.",
    "simple": "For the supplied test, [18, 23, 19] must give 23. An empty list must give None.",
    "runtime": "python",
    "lesson": "python-19"
  },
  {
    "source": "The quiz asks what dependencies=[] declares: no third-party runtime dependencies.",
    "simple": "In the quiz, dependencies=[] means “no extra third-party packages are needed to run this project.”",
    "runtime": "python",
    "lesson": "python-19"
  },
  {
    "source": "Explain that result precisely rather than claiming a local install happened.",
    "simple": "Say only what the settings and tests establish. Do not say that you installed the tool locally when you did not.",
    "runtime": "python",
    "lesson": "python-19"
  },
  {
    "source": "A successful local reproduction would require the same example to work in a clean environment;",
    "simple": "To show that someone can reproduce the result locally, the example must also work in a fresh environment.",
    "runtime": "python",
    "lesson": "python-19"
  },
  {
    "source": "that remains a separate practical activity beyond these in-browser checks.",
    "simple": "That installation check is a separate hands-on step, not something these browser tests have done.",
    "runtime": "python",
    "lesson": "python-19"
  },
  {
    "source": "An application programming interface, or API, is a defined way for one program to ask another service for data or an action.",
    "simple": "An API is an agreed way for one program to request information or an action from another service. Its full name is application programming interface.",
    "runtime": "python",
    "lesson": "python-20"
  },
  {
    "source": "A reply often has a status code and a payload, the data body.",
    "simple": "A reply often includes a numbered result code and the returned data. That data part is called the payload.",
    "runtime": "python",
    "lesson": "python-20"
  },
  {
    "source": "Status 200 means an ordinary successful reply in this practice contract.",
    "simple": "For this practice example, status 200 means the service reports a normal successful reply.",
    "runtime": "python",
    "lesson": "python-20"
  },
  {
    "source": "Status 503 indicates the service cannot complete the request.",
    "simple": "Status 503 says the service cannot carry out the request.",
    "runtime": "python",
    "lesson": "python-20"
  },
  {
    "source": "A success status alone does not prove that the body contains the expected fields.",
    "simple": "Even when the status says success, you must check that the returned data has the fields you need.",
    "runtime": "python",
    "lesson": "python-20"
  },
  {
    "source": "Your function receives status and payload as supplied values, so it can practise validation without a network connection.",
    "simple": "Your function is given status and payload directly. It can practise checking them without contacting a network service.",
    "runtime": "python",
    "lesson": "python-20"
  },
  {
    "source": "A fixture is prepared sample data used for a predictable scenario.",
    "simple": "A fixture is sample data prepared in advance so you can test a known situation.",
    "runtime": "python",
    "lesson": "python-20"
  },
  {
    "source": "First reject a status different from 200 using `!=`, which means not equal.",
    "simple": "First use `!=` to check whether status is not equal to 200. Reject replies that fail this status check.",
    "runtime": "python",
    "lesson": "python-20"
  },
  {
    "source": "Return a dictionary containing an error message when validation fails.",
    "simple": "If the data fails a check, send back a dictionary holding an error message.",
    "runtime": "python",
    "lesson": "python-20"
  },
  {
    "source": "That keeps expected failures clear and avoids blindly reading bad data.",
    "simple": "This tells the caller what failed and stops the code from trusting unsuitable data.",
    "runtime": "python",
    "lesson": "python-20"
  },
  {
    "source": "Here is a complete safe title reader for a small example.",
    "simple": "This full example checks a small reply before reading its book titles.",
    "runtime": "python",
    "lesson": "python-20"
  },
  {
    "source": "The outputs are `['Forest Notes']`, `{'error': 'Missing results'}`, and `{'error': 'Service unavailable'}`.",
    "simple": "It prints `['Forest Notes']`, then `{'error': 'Missing results'}`, then `{'error': 'Service unavailable'}`.",
    "runtime": "python",
    "lesson": "python-20"
  },
  {
    "source": "Each early return prevents later code from using data that failed a required rule.",
    "simple": "Each early return stops the function before later instructions can use data that has already failed a check.",
    "runtime": "python",
    "lesson": "python-20"
  },
  {
    "source": "`isinstance(value, type)` asks whether a value belongs to the expected kind.",
    "simple": "`isinstance(value, type)` checks whether value is the kind of thing you expect, such as a dictionary or text.",
    "runtime": "python",
    "lesson": "python-20"
  },
  {
    "source": "Dict means dictionary, list means list, and str means string.",
    "simple": "In code, dict means a dictionary, list means a list, and str means text.",
    "runtime": "python",
    "lesson": "python-20"
  },
  {
    "source": "`.get(\"results\")` reads a dictionary field or returns None if it is absent.",
    "simple": "`.get(\"results\")` looks for the dictionary entry named results. If it is missing, this call gives back None.",
    "runtime": "python",
    "lesson": "python-20"
  },
  {
    "source": "That is safer for validation than brackets, which raise KeyError for a missing key.",
    "simple": "Using square brackets for a missing key causes KeyError. Using get lets your validation code notice the missing value and choose its own message.",
    "runtime": "python",
    "lesson": "python-20"
  },
  {
    "source": "Check that payload is a dictionary before using its get method, and check each item before reading its title.",
    "simple": "First make sure payload is a dictionary before calling get on it. Also check each result item before trying to read its title.",
    "runtime": "python",
    "lesson": "python-20"
  },
  {
    "source": "The supplied solution uses all and a generator expression to validate every entry.",
    "simple": "The supplied answer uses all with a generator expression, which checks entries one at a time, to make sure every entry is valid.",
    "runtime": "python",
    "lesson": "python-20"
  },
  {
    "source": "`all(test for x in results)` is true only when every test is true.",
    "simple": "`all(test for x in results)` gives True only if the check passes for every entry.",
    "runtime": "python",
    "lesson": "python-20"
  },
  {
    "source": "An empty list passes that rule because it contains no invalid entries.",
    "simple": "An empty list also passes all, because there is no entry that fails the test.",
    "runtime": "python",
    "lesson": "python-20"
  },
  {
    "source": "`and` checks the first condition before the next;",
    "simple": "and tests the first part first. It only needs to continue when that first part passes.",
    "runtime": "python",
    "lesson": "python-20"
  },
  {
    "source": "if x is not a dictionary, the title get is skipped.",
    "simple": "If x is not a dictionary, Python does not try to use get to read its title.",
    "runtime": "python",
    "lesson": "python-20"
  },
  {
    "source": "This prevents calling a dictionary method on an unsuitable object.",
    "simple": "This avoids trying to use a dictionary's function on something that is not a dictionary.",
    "runtime": "python",
    "lesson": "python-20"
  },
  {
    "source": "This complete example isolates the all check and the title comprehension.",
    "simple": "This complete example focuses just on checking every entry and then building the title list.",
    "runtime": "python",
    "lesson": "python-20"
  },
  {
    "source": "It prints `['Garden Log', 'Sky Notes']`, then the invalid-result dictionary, then `[]`.",
    "simple": "It prints `['Garden Log', 'Sky Notes']`, then `{'error': 'Invalid result'}`, then `[]`.",
    "runtime": "python",
    "lesson": "python-20"
  },
  {
    "source": "The comprehension makes a new list of already-validated title strings.",
    "simple": "The list comprehension gathers the title strings into a new list after they have passed the checks.",
    "runtime": "python",
    "lesson": "python-20"
  },
  {
    "source": "This helper assumes its input is a list;",
    "simple": "This smaller helper expects to be given a list; it does not check that part itself.",
    "runtime": "python",
    "lesson": "python-20"
  },
  {
    "source": "the outer reader performs that check first.",
    "simple": "The main reader must check that the input is a list before passing it to this helper.",
    "runtime": "python",
    "lesson": "python-20"
  },
  {
    "source": "The matching math asks for an average: add 4 and 8 to get total 12, then divide by their count 2 to get 6.",
    "simple": "For the average, add 4 and 8 to get 12. There are 2 values, so divide 12 by 2 to get 6.",
    "runtime": "python",
    "lesson": "python-20"
  },
  {
    "source": "For a grouped dataset, calculate a total and count within each named group, then divide that group's total by its count.",
    "simple": "When values are grouped by name, find each group's own sum and count. Divide that group's sum by its count to get its average.",
    "runtime": "python",
    "lesson": "python-20"
  },
  {
    "source": "An empty group has no average;",
    "simple": "A group with no values has no average to calculate.",
    "runtime": "python",
    "lesson": "python-20"
  },
  {
    "source": "represent that explicitly as None rather than dividing by zero.",
    "simple": "Use None to show that no average exists. Do not try to divide by 0.",
    "runtime": "python",
    "lesson": "python-20"
  },
  {
    "source": "These calculations only make sense after validating that the fields contain usable numeric values.",
    "simple": "Before doing this arithmetic, check that the data fields really contain numbers you can use.",
    "runtime": "python",
    "lesson": "python-20"
  },
  {
    "source": "Your exercise must distinguish server failure, missing results, invalid entries, and a valid title list.",
    "simple": "Your function needs different outcomes for a failed service, missing results, bad result entries, and a valid list of titles.",
    "runtime": "python",
    "lesson": "python-20"
  },
  {
    "source": "Ocean Notes returns as a one-item list;",
    "simple": "For the valid Ocean Notes entry, return a list containing just \"Ocean Notes\".",
    "runtime": "python",
    "lesson": "python-20"
  },
  {
    "source": "missing results returns \"Missing results\";",
    "simple": "If results are missing, the returned error message is \"Missing results\".",
    "runtime": "python",
    "lesson": "python-20"
  },
  {
    "source": "status 503 returns \"Service unavailable\".",
    "simple": "If status is 503, the returned error message is \"Service unavailable\".",
    "runtime": "python",
    "lesson": "python-20"
  },
  {
    "source": "Real requests also need a network client, timeout handling, and an approved service integration.",
    "simple": "A real request also needs code to contact the service, handle waiting too long, and use an approved connection to that service.",
    "runtime": "python",
    "lesson": "python-20"
  },
  {
    "source": "The runnable fixture makes no actual API request and cannot verify a remote service.",
    "simple": "This practice code does not send an API request, so it cannot show whether a real remote service is working.",
    "runtime": "python",
    "lesson": "python-20"
  },
  {
    "source": "Keep private credentials on a server rather than embedding them in browser-delivered Python.",
    "simple": "Keep private access secrets on a server. Do not put them in Python code sent to a user's browser.",
    "runtime": "python",
    "lesson": "python-20"
  },
  {
    "source": "A private API requires proof that a caller is allowed to use protected data or actions.",
    "simple": "A private API checks that the requester has permission before allowing access to protected information or actions.",
    "runtime": "python",
    "lesson": "python-21"
  },
  {
    "source": "A credential is information used for that proof, such as a private key or access token.",
    "simple": "A credential is proof used for access, such as a secret key or an access token.",
    "runtime": "python",
    "lesson": "python-21"
  },
  {
    "source": "Authentication establishes who a caller is;",
    "simple": "Authentication checks who is making the request.",
    "runtime": "python",
    "lesson": "python-21"
  },
  {
    "source": "authorization decides what the caller may access.",
    "simple": "Authorization checks which information or actions that requester is allowed to use.",
    "runtime": "python",
    "lesson": "python-21"
  },
  {
    "source": "Keep private credentials in a server-managed secret store and let the server perform the protected request.",
    "simple": "Store private access secrets in a protected store managed by your server. Have that server make the protected request.",
    "runtime": "python",
    "lesson": "python-21"
  },
  {
    "source": "Browser-delivered code can be inspected and copied by users.",
    "simple": "People can inspect and copy code that is sent to their browser.",
    "runtime": "python",
    "lesson": "python-21"
  },
  {
    "source": "This applies to JavaScript, Python run in a browser, and files downloaded with the page.",
    "simple": "That includes JavaScript, Python running in the browser, and files the page downloads.",
    "runtime": "python",
    "lesson": "python-21"
  },
  {
    "source": "Hiding a credential in a variable, a comment, or a bundled file does not keep it private.",
    "simple": "A secret is still exposed if it is hidden in a variable, a comment, or a file sent with the page.",
    "runtime": "python",
    "lesson": "python-21"
  },
  {
    "source": "A secret store is controlled server storage designed for sensitive configuration.",
    "simple": "A secret store is a controlled place on a server for keeping sensitive settings and access details.",
    "runtime": "python",
    "lesson": "python-21"
  },
  {
    "source": "Safe user-facing responses should not include keys, tokens, or raw service replies that may expose sensitive details.",
    "simple": "Messages sent to users should not contain secret keys, access tokens, or unfiltered service replies that might reveal private information.",
    "runtime": "python",
    "lesson": "python-21"
  },
  {
    "source": "The fixture needs only a status-to-message function.",
    "simple": "The practice task only needs a function that picks a message from a supplied status code.",
    "runtime": "python",
    "lesson": "python-21"
  },
  {
    "source": "It prints Data loaded, Please sign in again, and Service could not complete request.",
    "simple": "The messages are Data loaded, then Please sign in again, then Service could not complete request.",
    "runtime": "python",
    "lesson": "python-21"
  },
  {
    "source": "Each return exits the function, so a matched status does not continue to the fallback.",
    "simple": "As soon as a matching status reaches return, the function stops. It does not also run the general failure return.",
    "runtime": "python",
    "lesson": "python-21"
  },
  {
    "source": "The final return covers statuses that matched neither earlier comparison.",
    "simple": "The last return handles any status that did not match either earlier check.",
    "runtime": "python",
    "lesson": "python-21"
  },
  {
    "source": "In this contract, 200 reports ordinary success and 401 means credentials are missing, invalid, or expired, so the caller needs to sign in again.",
    "simple": "In this example, 200 reports success. A 401 means access details are absent, invalid, or expired, so the message asks the user to sign in again.",
    "runtime": "python",
    "lesson": "python-21"
  },
  {
    "source": "A real API may use 403 for a caller who is known but lacks permission.",
    "simple": "A real service may use 403 when it knows who the caller is but that caller is not allowed to do the requested action.",
    "runtime": "python",
    "lesson": "python-21"
  },
  {
    "source": "The supplied function uses its general failure message for that and other unmatched statuses.",
    "simple": "This practice function gives the general failure message for 403 and any other status that is neither 200 nor 401.",
    "runtime": "python",
    "lesson": "python-21"
  },
  {
    "source": "Follow the documented service contract rather than assuming every authorization problem has the same code or that every 200 reply contains usable data.",
    "simple": "Read the service's own rules. Different access problems can use different codes, and a 200 status does not guarantee the returned data is usable.",
    "runtime": "python",
    "lesson": "python-21"
  },
  {
    "source": "This second complete example exercises several replies without holding any credential.",
    "simple": "This second full example tries several status codes without using or storing any secret access details.",
    "runtime": "python",
    "lesson": "python-21"
  },
  {
    "source": "It displays a general service message for 503, a loaded message for 200, and a sign-in message for 401.",
    "simple": "For 503 it shows the general failure message, for 200 it shows Data loaded, and for 401 it shows Please sign in again.",
    "runtime": "python",
    "lesson": "python-21"
  },
  {
    "source": "The loop visits each supplied code.",
    "simple": "The loop handles the supplied status codes one at a time.",
    "runtime": "python",
    "lesson": "python-21"
  },
  {
    "source": "The f-string inserts the number and returned message into readable text;",
    "simple": "The f-string puts the status number and its selected message together in one readable line.",
    "runtime": "python",
    "lesson": "python-21"
  },
  {
    "source": "it is a text-building expression, not a function.",
    "simple": "An f-string is a way to build text, not a function you call.",
    "runtime": "python",
    "lesson": "python-21"
  },
  {
    "source": "For a real private client, the browser sends its ordinary user request to the application's approved server integration.",
    "simple": "In a real app, the browser sends its normal user request to the app's approved server connection.",
    "runtime": "python",
    "lesson": "python-21"
  },
  {
    "source": "The server retrieves its private credential securely, performs the protected operation, validates the reply, and returns only appropriate data or a safe status.",
    "simple": "The server securely gets its credential, makes the protected request, and checks the reply. It then sends back only suitable data or a safe status message.",
    "runtime": "python",
    "lesson": "python-21"
  },
  {
    "source": "Keep secrets out of source files, browser payloads, and logs.",
    "simple": "Do not put access secrets in source code, data sent to browsers, or saved diagnostic logs.",
    "runtime": "python",
    "lesson": "python-21"
  },
  {
    "source": "Logging a useful status code does not require logging the credential or the entire raw response.",
    "simple": "You can record a status code to help with debugging without recording a secret or the full service reply.",
    "runtime": "python",
    "lesson": "python-21"
  },
  {
    "source": "Your project checks messages for 200, 401, and 503.",
    "simple": "The exercise checks which messages your function chooses for 200, 401, and 503.",
    "runtime": "python",
    "lesson": "python-21"
  },
  {
    "source": "It contains no private credential and makes no private network request;",
    "simple": "There is no private key or token in this exercise, and it does not contact a private service.",
    "runtime": "python",
    "lesson": "python-21"
  },
  {
    "source": "status values are local practice inputs.",
    "simple": "The status numbers are just sample values supplied to local code.",
    "runtime": "python",
    "lesson": "python-21"
  },
  {
    "source": "The quiz asks why the private key stays on the server: browser code is visible to users.",
    "simple": "The quiz's reason for keeping the key on the server is that users can see code sent to their browser.",
    "runtime": "python",
    "lesson": "python-21"
  },
  {
    "source": "These checks confirm safe message selection, while real missing/expired credentials and server secret storage need the separate approved service integration.",
    "simple": "These tests check message choices only. Handling real missing or expired credentials and storing secrets must be checked through the separate approved service connection.",
    "runtime": "python",
    "lesson": "python-21"
  },
  {
    "source": "Do not describe a passing fixture as proof that protected access has been configured.",
    "simple": "Passing these sample tests does not prove that access to a protected service has been set up.",
    "runtime": "python",
    "lesson": "python-21"
  },
  {
    "source": "A shelf label combines a name, a number and a unit.",
    "simple": "The label puts together an item's name, how many there are, and what unit you are counting.",
    "runtime": "python",
    "lesson": "python-22"
  },
  {
    "source": "A string is text, while an integer is a whole number.",
    "simple": "Text is called a string. A number with no fractional part, such as -2, 0, or 5, is called an integer.",
    "runtime": "python",
    "lesson": "python-22"
  },
  {
    "source": "Your function will format these values into one string.",
    "simple": "The function will combine those pieces into one piece of text.",
    "runtime": "python",
    "lesson": "python-22"
  },
  {
    "source": "Formatting means choosing how values appear as text;",
    "simple": "Formatting decides how the name and number are shown in the finished text.",
    "runtime": "python",
    "lesson": "python-22"
  },
  {
    "source": "it does not change the values stored in the input variables.",
    "simple": "Building the label does not change the original values given to the function.",
    "runtime": "python",
    "lesson": "python-22"
  },
  {
    "source": "An f-string starts with f immediately before its opening quote.",
    "simple": "To write an f-string, put f directly before the first quote.",
    "runtime": "python",
    "lesson": "python-22"
  },
  {
    "source": "Braces { } mark expressions Python should evaluate and insert.",
    "simple": "Inside { }, write the value or calculation Python should work out and put into the text.",
    "runtime": "python",
    "lesson": "python-22"
  },
  {
    "source": "A plain quoted string leaves braces as ordinary characters.",
    "simple": "Without the f, braces inside quoted text stay as written rather than inserting values.",
    "runtime": "python",
    "lesson": "python-22"
  },
  {
    "source": "Use a parameter name inside braces to make the result follow the input on every call.",
    "simple": "Put an input name inside the braces so each call uses the actual input it receives.",
    "runtime": "python",
    "lesson": "python-22"
  },
  {
    "source": "This complete example inserts two values.",
    "simple": "This full example puts a name and a number into the label.",
    "runtime": "python",
    "lesson": "python-22"
  },
  {
    "source": "It prints Tape: 4 rolls.",
    "simple": "The displayed label is Tape: 4 rolls.",
    "runtime": "python",
    "lesson": "python-22"
  },
  {
    "source": "Python converts the number to text within the f-string.",
    "simple": "While building the f-string, Python turns the number into text for the label.",
    "runtime": "python",
    "lesson": "python-22"
  },
  {
    "source": "The colon and spaces are literal characters that you chose for the label.",
    "simple": "The colon and spaces appear exactly where you wrote them in the label text.",
    "runtime": "python",
    "lesson": "python-22"
  },
  {
    "source": "Choose the singular word when count == 1.",
    "simple": "When count == 1, use the word for a single item rather than the plural word.",
    "runtime": "python",
    "lesson": "python-22"
  },
  {
    "source": "The double equals sign compares values;",
    "simple": "Use == to ask whether the count equals 1.",
    "runtime": "python",
    "lesson": "python-22"
  },
  {
    "source": "a single equals sign assigns a value.",
    "simple": "Use = when saving a value under a name, not when asking whether values match.",
    "runtime": "python",
    "lesson": "python-22"
  },
  {
    "source": "Zero uses the plural form in this English label.",
    "simple": "For this English label, 0 takes the plural word, just like counts greater than 1.",
    "runtime": "python",
    "lesson": "python-22"
  },
  {
    "source": "The requirement accepts only nonnegative integer counts, so this exercise does not need to handle negative stock or fractions.",
    "simple": "The exercise only allows whole-number counts of 0 or more. You do not need rules for negative amounts or fractions here.",
    "runtime": "python",
    "lesson": "python-22"
  },
  {
    "source": "You can choose a word before formatting the final text.",
    "simple": "First pick the correct word, then insert it into the final label.",
    "runtime": "python",
    "lesson": "python-22"
  },
  {
    "source": "The output is 1 ticket and 0 tickets.",
    "simple": "It prints 1 ticket for the first call and 0 tickets for the second.",
    "runtime": "python",
    "lesson": "python-22"
  },
  {
    "source": "The conditional expression chooses one value.",
    "simple": "The short if/else expression selects either \"ticket\" or \"tickets\".",
    "runtime": "python",
    "lesson": "python-22"
  },
  {
    "source": "An ordinary if/else block would also work.",
    "simple": "You can make that same choice with if and else on separate lines.",
    "runtime": "python",
    "lesson": "python-22"
  },
  {
    "source": "return gives the completed label to the caller. print displays something and returns None.",
    "simple": "return sends the finished text back to the code that called the function. print only displays it and gives back None.",
    "runtime": "python",
    "lesson": "python-22"
  },
  {
    "source": "Keep shelf_label useful for both screen display and later storage by returning the string.",
    "simple": "Have shelf_label return its text so other code can either show it now or save it for later.",
    "runtime": "python",
    "lesson": "python-22"
  },
  {
    "source": "The caller can then decide whether to print it.",
    "simple": "The code using shelf_label can choose whether to display the returned text with print.",
    "runtime": "python",
    "lesson": "python-22"
  },
  {
    "source": "Preserve punctuation and spaces as stated so labels have a consistent shape.",
    "simple": "Keep the required punctuation and spacing exactly right so every label follows the same pattern.",
    "runtime": "python",
    "lesson": "python-22"
  },
  {
    "source": "Test a count of zero, one and several items.",
    "simple": "Try 0, 1, and a larger count to check both singular and plural wording.",
    "runtime": "python",
    "lesson": "python-22"
  },
  {
    "source": "Try a two-word name and a name with a non-English letter: the function should carry the name through unchanged.",
    "simple": "Also try a name with two words and a name containing a non-English letter. Both names should appear exactly as supplied.",
    "runtime": "python",
    "lesson": "python-22"
  },
  {
    "source": "These examples check the boundary where the wording changes.",
    "simple": "These tests check the change in wording: singular for 1 item, and plural for 0 or a larger count.",
    "runtime": "python",
    "lesson": "python-22"
  },
  {
    "source": "A single sample with three items would not reveal a mistaken singular rule.",
    "simple": "Testing only a count of 3 would not tell you whether the count of 1 gets the correct singular word.",
    "runtime": "python",
    "lesson": "python-22"
  },
  {
    "source": "CSV means comma-separated values.",
    "simple": "CSV is short for comma-separated values: a text format that separates fields with commas.",
    "runtime": "python",
    "lesson": "python-23"
  },
  {
    "source": "It stores rows as text, often from a spreadsheet.",
    "simple": "CSV keeps data in rows of text and is often used to move spreadsheet data between programs.",
    "runtime": "python",
    "lesson": "python-23"
  },
  {
    "source": "A comma can also be part of a field, such as \"Pens, blue\", so splitting every line at every comma is unsafe.",
    "simple": "A field can contain its own comma, as in \"Pens, blue\". Cutting the text at every comma would incorrectly split that single name into two fields.",
    "runtime": "python",
    "lesson": "python-23"
  },
  {
    "source": "Python's standard csv module handles quoted fields and escaped quote characters for you.",
    "simple": "Python includes a csv module that understands quotes around fields and how quote marks inside a field are written.",
    "runtime": "python",
    "lesson": "python-23"
  },
  {
    "source": "csv.DictReader reads the first row as column names and returns dictionaries for following rows. io.StringIO lets a string behave like a text file, so the reader can process supplied text without writing a file.",
    "simple": "csv.DictReader uses the first row as field names and makes a dictionary for each later row. io.StringIO lets it read a string as if it were a text file, without saving a file first.",
    "runtime": "python",
    "lesson": "python-23"
  },
  {
    "source": "Import both csv and io.",
    "simple": "Make both modules available with import csv and import io.",
    "runtime": "python",
    "lesson": "python-23"
  },
  {
    "source": "The input contract supplies the item and quantity headers and well-formed CSV quoting.",
    "simple": "You may assume the input has item and quantity column names and correctly written CSV quotes.",
    "runtime": "python",
    "lesson": "python-23"
  },
  {
    "source": "Here is a complete example with a comma inside a quoted name.",
    "simple": "This full example shows a quoted item name that contains a comma.",
    "runtime": "python",
    "lesson": "python-23"
  },
  {
    "source": "The first item is the single string Pens, blue.",
    "simple": "The first item's whole name is Pens, blue, including the comma.",
    "runtime": "python",
    "lesson": "python-23"
  },
  {
    "source": "Quantities are still strings at this stage;",
    "simple": "After reading the CSV, quantities are still text values, not numbers.",
    "runtime": "python",
    "lesson": "python-23"
  },
  {
    "source": "the CSV reader does not choose numeric types for you.",
    "simple": "The CSV reader does not automatically decide which fields should become numbers.",
    "runtime": "python",
    "lesson": "python-23"
  },
  {
    "source": "Validation decides whether a row meets the project's requirements before you use it.",
    "simple": "Validation means checking that a row follows your project's rules before using its data.",
    "runtime": "python",
    "lesson": "python-23"
  },
  {
    "source": "Trim the item and quantity fields.",
    "simple": "Remove outside whitespace from both the item name and the quantity text.",
    "runtime": "python",
    "lesson": "python-23"
  },
  {
    "source": "A quantity must be nonempty and contain only characters from \"0123456789\".",
    "simple": "A valid quantity must contain at least one character, and every character must be one of \"0123456789\".",
    "runtime": "python",
    "lesson": "python-23"
  },
  {
    "source": "Reject -2, 2.5 and two.",
    "simple": "Do not accept -2, 2.5, or two as quantities.",
    "runtime": "python",
    "lesson": "python-23"
  },
  {
    "source": "Leading zeroes such as 003 are accepted and represent 3.",
    "simple": "003 is allowed. Its starting zeroes do not change its numeric value of 3.",
    "runtime": "python",
    "lesson": "python-23"
  },
  {
    "source": "Missing fields can be None, so replace None with an empty string before trimming.",
    "simple": "A field that is missing can be None rather than text. Turn None into empty text before trying to strip its outside whitespace.",
    "runtime": "python",
    "lesson": "python-23"
  },
  {
    "source": "Validate first, then convert to an integer.",
    "simple": "Check that the text meets the rules before turning it into a whole number with int.",
    "runtime": "python",
    "lesson": "python-23"
  },
  {
    "source": "It prints 3.",
    "simple": "The example turns 003 into the number 3 and prints that number.",
    "runtime": "python",
    "lesson": "python-23"
  },
  {
    "source": "The explicit character set matches this project's ASCII-digit contract;",
    "simple": "Checking exactly \"0123456789\" follows this exercise's rule to accept only those ordinary ASCII digits.",
    "runtime": "python",
    "lesson": "python-23"
  },
  {
    "source": "some broader Unicode digit tests accept characters that int cannot convert.",
    "simple": "Other digit checks may also accept Unicode digit characters that int cannot turn into a number.",
    "runtime": "python",
    "lesson": "python-23"
  },
  {
    "source": "Keep totals in a dictionary. totals.get(item, 0) reads the existing amount or starts at zero.",
    "simple": "Use a dictionary to keep each item's total. totals.get(item, 0) gives the total already saved for that item, or 0 if it is new.",
    "runtime": "python",
    "lesson": "python-23"
  },
  {
    "source": "Increase rejected for each invalid record and continue to the next record. csv.DictReader ignores completely blank lines;",
    "simple": "For each bad row, add 1 to rejected and use continue to skip to the next row. csv.DictReader skips lines that are completely empty.",
    "runtime": "python",
    "lesson": "python-23"
  },
  {
    "source": "a row such as comma plus a quantity is a real record with a blank name and must be rejected.",
    "simple": "A line containing a comma and a quantity is not empty. It has a missing item name, so reject that record.",
    "runtime": "python",
    "lesson": "python-23"
  },
  {
    "source": "Return both the totals and the rejection count so the caller can see what happened.",
    "simple": "Send back both the item totals and the number of rejected rows so the caller can see the results and the problems.",
    "runtime": "python",
    "lesson": "python-23"
  },
  {
    "source": "This exercise rejects individual bad records;",
    "simple": "The exercise expects you to skip and count individual records that fail its rules.",
    "runtime": "python",
    "lesson": "python-23"
  },
  {
    "source": "malformed CSV syntax and missing headers are outside its stated input contract.",
    "simple": "You do not have to handle broken CSV quote syntax or missing column headings; the exercise promises those parts are valid.",
    "runtime": "python",
    "lesson": "python-23"
  },
  {
    "source": "Test quoted commas, duplicate names, zero stock, a missing quantity and an empty file with only headers.",
    "simple": "Try names containing quoted commas, repeated names, quantity 0, a row without a quantity, and a file with headings but no data rows.",
    "runtime": "python",
    "lesson": "python-23"
  },
  {
    "source": "Do not count the header as a stock row.",
    "simple": "The first row names the columns. It is not an item to add to the stock totals.",
    "runtime": "python",
    "lesson": "python-23"
  },
  {
    "source": "JSON means JavaScript Object Notation, but many languages use it to exchange data.",
    "simple": "JSON stands for JavaScript Object Notation. Despite its name, programs in many languages use it to send and store data.",
    "runtime": "python",
    "lesson": "python-24"
  },
  {
    "source": "It stores strings, numbers, arrays, objects, true, false and null.",
    "simple": "JSON can contain text, numbers, lists called arrays, named fields called objects, and the special values true, false, and null.",
    "runtime": "python",
    "lesson": "python-24"
  },
  {
    "source": "Python's json module translates JSON text into Python values.",
    "simple": "Python's json module reads JSON text and turns it into values Python can use.",
    "runtime": "python",
    "lesson": "python-24"
  },
  {
    "source": "Here, a JSON array becomes a list and each JSON object becomes a dictionary.",
    "simple": "In this exercise, the outer JSON array turns into a Python list, and each object inside turns into a dictionary.",
    "runtime": "python",
    "lesson": "python-24"
  },
  {
    "source": "Use json.loads(text) to parse a string.",
    "simple": "Call json.loads(text) to read JSON from a text string and turn it into Python values.",
    "runtime": "python",
    "lesson": "python-24"
  },
  {
    "source": "The s in loads refers to a string;",
    "simple": "The s at the end of loads reminds you that its input is a string.",
    "runtime": "python",
    "lesson": "python-24"
  },
  {
    "source": "json.load instead reads from an open file.",
    "simple": "Use json.load without the s when reading JSON from a file that is already open.",
    "runtime": "python",
    "lesson": "python-24"
  },
  {
    "source": "Parsing checks JSON syntax, but it does not prove the result has your intended fields.",
    "simple": "Parsing checks whether the text is valid JSON. You still need other checks to know whether it contains the fields your program expects.",
    "runtime": "python",
    "lesson": "python-24"
  },
  {
    "source": "This exercise supplies valid records so you can focus on turning them into a useful summary.",
    "simple": "This exercise promises valid records, so you can concentrate on making the summary.",
    "runtime": "python",
    "lesson": "python-24"
  },
  {
    "source": "This complete example reads two entries.",
    "simple": "This complete example reads a list containing two reading records.",
    "runtime": "python",
    "lesson": "python-24"
  },
  {
    "source": "It prints River and 11.",
    "simple": "It shows River as the book name and 11 as the total pages.",
    "runtime": "python",
    "lesson": "python-24"
  },
  {
    "source": "Index 0 selects the first list entry;",
    "simple": "Position 0 gets the first record from the list.",
    "runtime": "python",
    "lesson": "python-24"
  },
  {
    "source": "the string key \"book\" selects a dictionary value.",
    "simple": "Then the key \"book\" gets that record's book-name value from its dictionary.",
    "runtime": "python",
    "lesson": "python-24"
  },
  {
    "source": "A session is one record;",
    "simple": "Each record describes one reading session.",
    "runtime": "python",
    "lesson": "python-24"
  },
  {
    "source": "a book may have several sessions.",
    "simple": "The same book can appear in more than one reading session.",
    "runtime": "python",
    "lesson": "python-24"
  },
  {
    "source": "Counting records would overstate the number of distinct books.",
    "simple": "Counting every session as a different book would count the same book more than once.",
    "runtime": "python",
    "lesson": "python-24"
  },
  {
    "source": "Group pages by the exact book name using a dictionary.",
    "simple": "Use the exact book name as a dictionary key, and add each session's pages to that book's total.",
    "runtime": "python",
    "lesson": "python-24"
  },
  {
    "source": "Each new name creates one key, and later sessions add to that key.",
    "simple": "When a name appears for the first time, create its key. When it appears again, add the new pages to the existing total.",
    "runtime": "python",
    "lesson": "python-24"
  },
  {
    "source": "Capitalization is significant under this project's contract.",
    "simple": "For this exercise, changing a capital letter changes the name being matched.",
    "runtime": "python",
    "lesson": "python-24"
  },
  {
    "source": "Here is a small grouped sum.",
    "simple": "This small example adds together sessions with the same book name.",
    "runtime": "python",
    "lesson": "python-24"
  },
  {
    "source": "It prints 1 and 10. len counts keys in the dictionary, while values() provides the grouped page totals.",
    "simple": "It prints 1 book and 10 pages. len counts the dictionary's keys, while values() gives the page totals saved under those keys.",
    "runtime": "python",
    "lesson": "python-24"
  },
  {
    "source": "A zero-page session still records a book name, so keep that name with a total of zero.",
    "simple": "A session with 0 pages still counts as a recorded book. Keep its name in the dictionary with a total of 0.",
    "runtime": "python",
    "lesson": "python-24"
  },
  {
    "source": "The empty array [] has no names or pages;",
    "simple": "An empty JSON array, [], contains no books and no page counts.",
    "runtime": "python",
    "lesson": "python-24"
  },
  {
    "source": "sum of an empty collection is zero.",
    "simple": "Adding up an empty collection with sum gives 0.",
    "runtime": "python",
    "lesson": "python-24"
  },
  {
    "source": "Return a dictionary with exactly the three requested result fields so callers can use it without reading printed text.",
    "simple": "Return a dictionary containing exactly the three result fields requested. Other code can then use the answers directly instead of trying to read printed messages.",
    "runtime": "python",
    "lesson": "python-24"
  },
  {
    "source": "You can use json.dumps to turn a Python result back into JSON text when exporting, but this function must return the Python dictionary itself.",
    "simple": "json.dumps can turn a Python result into JSON text for exporting. But this exercise's function must return the actual Python dictionary, not JSON text.",
    "runtime": "python",
    "lesson": "python-24"
  },
  {
    "source": "Never use eval to parse outside data: it executes Python expressions.",
    "simple": "Do not use eval for data from outside your code. It can run Python expressions instead of just reading data safely.",
    "runtime": "python",
    "lesson": "python-24"
  },
  {
    "source": "Test several sessions, several books and the empty list.",
    "simple": "Test multiple reading sessions, more than one book, and a list with no records.",
    "runtime": "python",
    "lesson": "python-24"
  },
  {
    "source": "Parsing malformed JSON or validating arbitrary field types is a separate extension.",
    "simple": "Handling broken JSON text or checking every possible wrong field type would be a separate addition to this exercise.",
    "runtime": "python",
    "lesson": "python-24"
  },
  {
    "source": "A workshop has tasks that depend on other tasks: paint requires sanding, and sanding requires cutting.",
    "simple": "Some workshop jobs must wait for others: you must cut before sanding, and sand before painting.",
    "runtime": "python",
    "lesson": "python-25"
  },
  {
    "source": "A dependency is a task that must happen first.",
    "simple": "A dependency is a job that another job needs you to finish first.",
    "runtime": "python",
    "lesson": "python-25"
  },
  {
    "source": "A graph describes these relationships using nodes for tasks and edges for dependencies.",
    "simple": "A graph represents tasks and their links. Each task is a node, and each dependency link is an edge.",
    "runtime": "python",
    "lesson": "python-25"
  },
  {
    "source": "A valid ordering puts every prerequisite before the task that needs it.",
    "simple": "A correct task list places each required earlier job before the job that depends on it.",
    "runtime": "python",
    "lesson": "python-25"
  },
  {
    "source": "A depth-first search follows prerequisites before finishing the current task.",
    "simple": "Depth-first search checks a task's prerequisites, and their prerequisites, before marking the original task done.",
    "runtime": "python",
    "lesson": "python-25"
  },
  {
    "source": "Recursion means a function calls itself on a smaller part of the problem.",
    "simple": "Recursion is when a function calls itself to deal with a smaller part of the same job.",
    "runtime": "python",
    "lesson": "python-25"
  },
  {
    "source": "Keep a result list, a set of finished tasks and a set of tasks currently being visited.",
    "simple": "Track three things: the final order, the tasks already finished, and the tasks you are still working through.",
    "runtime": "python",
    "lesson": "python-25"
  },
  {
    "source": "The visiting set describes the unfinished chain of calls, not every task you have ever seen.",
    "simple": "visiting holds only the current unfinished chain of work. It is not a history of every task you have encountered.",
    "runtime": "python",
    "lesson": "python-25"
  },
  {
    "source": "This small example explores dependencies before printing a task.",
    "simple": "This short example first explores the jobs a task needs, then prints the task itself.",
    "runtime": "python",
    "lesson": "python-25"
  },
  {
    "source": "It prints sand before paint.",
    "simple": "The output puts sand first and paint afterward.",
    "runtime": "python",
    "lesson": "python-25"
  },
  {
    "source": "This first example assumes no cycles;",
    "simple": "The short example assumes the dependency links never loop back in a circle.",
    "runtime": "python",
    "lesson": "python-25"
  },
  {
    "source": "your project must add cycle and missing-task handling.",
    "simple": "Your full project must also detect circular dependencies and references to missing tasks.",
    "runtime": "python",
    "lesson": "python-25"
  },
  {
    "source": "A cycle means a chain comes back to an unfinished task, such as A needing B while B needs A.",
    "simple": "A cycle is a dependency chain that leads back to an unfinished task. For example, A needs B first, but B also needs A first.",
    "runtime": "python",
    "lesson": "python-25"
  },
  {
    "source": "Neither can begin.",
    "simple": "In that situation, each task is waiting for the other, so neither one can start.",
    "runtime": "python",
    "lesson": "python-25"
  },
  {
    "source": "Detect it by checking whether a task is already in visiting when you enter it.",
    "simple": "When starting a visit, check whether the task is already in visiting. If it is, the current chain has looped back on itself.",
    "runtime": "python",
    "lesson": "python-25"
  },
  {
    "source": "A finished task is different: it is safe to reuse and should not be added to the result twice.",
    "simple": "A task in finished has already been handled successfully. Other tasks can depend on it, but it should appear only once in the final list.",
    "runtime": "python",
    "lesson": "python-25"
  },
  {
    "source": "The two sets have distinct jobs.",
    "simple": "visiting tracks work still in progress; finished tracks work already completed.",
    "runtime": "python",
    "lesson": "python-25"
  },
  {
    "source": "The two printed values are true.",
    "simple": "Both checks print True: build is in visiting, and collect is in finished.",
    "runtime": "python",
    "lesson": "python-25"
  },
  {
    "source": "Moving a name from visiting to finished represents completing that task after its dependencies have been handled.",
    "simple": "After handling all a task's prerequisites, remove its name from visiting and put it in finished to mark it done.",
    "runtime": "python",
    "lesson": "python-25"
  },
  {
    "source": "Before reading tasks[name], check that name exists.",
    "simple": "Make sure name is a key in tasks before trying to read tasks[name].",
    "runtime": "python",
    "lesson": "python-25"
  },
  {
    "source": "Return failure for missing prerequisites instead of inventing a task.",
    "simple": "If a required earlier task is missing, report failure. Do not silently make up a replacement task.",
    "runtime": "python",
    "lesson": "python-25"
  },
  {
    "source": "Sort keys and dependency lists before visiting them to make the result reproducible.",
    "simple": "Visit sorted task names and sorted dependency lists so repeated runs follow the same order.",
    "runtime": "python",
    "lesson": "python-25"
  },
  {
    "source": "Sorting produces new lists, so it need not change the input.",
    "simple": "Use sorting that makes new lists, so the original task data can stay unchanged.",
    "runtime": "python",
    "lesson": "python-25"
  },
  {
    "source": "Independent tasks can have many valid orders;",
    "simple": "Tasks that do not depend on each other can often be arranged in several correct orders.",
    "runtime": "python",
    "lesson": "python-25"
  },
  {
    "source": "this project chooses one traversal rule for predictable checks.",
    "simple": "This exercise chooses one rule for visiting them so the tests can expect a consistent answer.",
    "runtime": "python",
    "lesson": "python-25"
  },
  {
    "source": "Return None when any visit fails;",
    "simple": "If any task visit fails, send back None to show there is no successful plan.",
    "runtime": "python",
    "lesson": "python-25"
  },
  {
    "source": "otherwise return the accumulated list.",
    "simple": "If all visits succeed, send back the list of tasks collected in order.",
    "runtime": "python",
    "lesson": "python-25"
  },
  {
    "source": "The result is called a topological ordering.",
    "simple": "An order that puts every prerequisite before the job needing it is called a topological ordering.",
    "runtime": "python",
    "lesson": "python-25"
  },
  {
    "source": "Its dependency traversal visits nodes and edges once apart from sorting, but Python recursion has a depth limit, so very deep production graphs need an iterative version.",
    "simple": "Apart from sorting, the search visits each task and dependency link once. Python limits how deeply functions can call themselves, so very long dependency chains need a loop-based version for real use.",
    "runtime": "python",
    "lesson": "python-25"
  },
  {
    "source": "Test a chain, shared prerequisites, a missing name, a self-cycle and a longer cycle.",
    "simple": "Test a straight dependency chain, two tasks sharing a prerequisite, a missing task, a task depending on itself, and a longer circular chain.",
    "runtime": "python",
    "lesson": "python-25"
  }
];
