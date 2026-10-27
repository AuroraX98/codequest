export default [
  {
    "source": "A type tells Python what kind of value it has.",
    "simple": "A type is a label that says what sort of information a value is.",
    "runtime": "python",
    "lesson": "python-02"
  },
  {
    "source": "An integer, or int, is a whole number such as 15.",
    "simple": "An int is a number with no decimal part, like 15.",
    "runtime": "python",
    "lesson": "python-02"
  },
  {
    "source": "A float is a number that can have a decimal part, such as 15.5.",
    "simple": "A float lets you work with decimal numbers, like 15.5.",
    "runtime": "python",
    "lesson": "python-02"
  },
  {
    "source": "A string, or str, is text written with quotes, such as \"15\".",
    "simple": "A str is text. For example, \"15\" is text because it has quotes around it.",
    "runtime": "python",
    "lesson": "python-02"
  },
  {
    "source": "A Boolean, or bool, is a yes-or-no value: True or False.",
    "simple": "A bool stores one of two answers: True for yes, or False for no.",
    "runtime": "python",
    "lesson": "python-02"
  },
  {
    "source": "Python capitalizes these Boolean names, and they do not need quotes.",
    "simple": "Write True and False with capital first letters and no quotes.",
    "runtime": "python",
    "lesson": "python-02"
  },
  {
    "source": "A comparison asks how values relate.",
    "simple": "A comparison checks whether values are smaller, larger, or equal.",
    "runtime": "python",
    "lesson": "python-02"
  },
  {
    "source": "`<` means less than, `>` means greater than, and `==` means equal to.",
    "simple": "Use `<` to ask “is smaller?”, `>` to ask “is larger?”, and `==` to ask “is the same value?”",
    "runtime": "python",
    "lesson": "python-02"
  },
  {
    "source": "`<=` and `>=` include equality.",
    "simple": "`<=` means smaller or equal. `>=` means larger or equal.",
    "runtime": "python",
    "lesson": "python-02"
  },
  {
    "source": "A single `=` assigns a value to a variable;",
    "simple": "One `=` saves a value under a name, called a variable.",
    "runtime": "python",
    "lesson": "python-02"
  },
  {
    "source": "two equals signs compare values.",
    "simple": "Use `==` to ask whether two values match, not to save a value.",
    "runtime": "python",
    "lesson": "python-02"
  },
  {
    "source": "The comparison itself produces True or False.",
    "simple": "The answer to a comparison is either True or False.",
    "runtime": "python",
    "lesson": "python-02"
  },
  {
    "source": "You can store that result or pass it directly to print.",
    "simple": "You can save the answer under a name or give it straight to print to show it.",
    "runtime": "python",
    "lesson": "python-02"
  },
  {
    "source": "This example compares a measurement below its limit.",
    "simple": "Here, the measurement is 15 and the limit is 18, so the measurement is smaller.",
    "runtime": "python",
    "lesson": "python-02"
  },
  {
    "source": "The outputs are True, False, and False on separate lines.",
    "simple": "You see True on the first line, False on the second, and False on the third.",
    "runtime": "python",
    "lesson": "python-02"
  },
  {
    "source": "Python reads the numbers stored under the names before answering each comparison.",
    "simple": "Python uses the numbers that measurement and limit currently hold to answer each question.",
    "runtime": "python",
    "lesson": "python-02"
  },
  {
    "source": "None of these questions changes either number.",
    "simple": "Checking the numbers does not change them.",
    "runtime": "python",
    "lesson": "python-02"
  },
  {
    "source": "The first line assigns a value;",
    "simple": "The first line saves 15 under the name measurement.",
    "runtime": "python",
    "lesson": "python-02"
  },
  {
    "source": "the print calls display the results of later comparisons.",
    "simple": "The print instructions show the answers to the comparisons that come afterward.",
    "runtime": "python",
    "lesson": "python-02"
  },
  {
    "source": "At the exact boundary, equality differs from being above or below.",
    "simple": "When the measurement exactly matches the limit, it is equal, not smaller or larger.",
    "runtime": "python",
    "lesson": "python-02"
  },
  {
    "source": "The output lines are `False True False`, `True True`, and `False`.",
    "simple": "The first line shows `False True False`, the second shows `True True`, and the third shows `False`.",
    "runtime": "python",
    "lesson": "python-02"
  },
  {
    "source": "Commas separate arguments to print, which displays them with spaces between.",
    "simple": "Commas let you give print several values. It shows those values with spaces between them.",
    "runtime": "python",
    "lesson": "python-02"
  },
  {
    "source": "At the boundary, the inclusive signs both allow equality.",
    "simple": "When the two numbers match, both `<=` and `>=` answer True because they allow a match.",
    "runtime": "python",
    "lesson": "python-02"
  },
  {
    "source": "Numeric text and a number are different values.",
    "simple": "Digits inside quotes are text, not the same value as a number without quotes.",
    "runtime": "python",
    "lesson": "python-02"
  },
  {
    "source": "Be careful about types.",
    "simple": "Check whether your values are numbers or text before comparing them.",
    "runtime": "python",
    "lesson": "python-02"
  },
  {
    "source": "`\"18\" == 18` is false because text does not equal the number here.",
    "simple": "`\"18\" == 18` gives False: the left side is text and the right side is a number.",
    "runtime": "python",
    "lesson": "python-02"
  },
  {
    "source": "Comparing `\"18\" < 18` raises a TypeError rather than deciding which is smaller;",
    "simple": "`\"18\" < 18` causes a TypeError, an error about incompatible kinds of values, instead of giving a smaller-or-larger answer.",
    "runtime": "python",
    "lesson": "python-02"
  },
  {
    "source": "these types cannot be ordered together this way.",
    "simple": "Python cannot use `<` to put this text value and this number in order.",
    "runtime": "python",
    "lesson": "python-02"
  },
  {
    "source": "This is why the measurement and limit should both be numeric.",
    "simple": "Use numbers for both measurement and limit, rather than making either one text.",
    "runtime": "python",
    "lesson": "python-02"
  },
  {
    "source": "Python can compare numeric forms such as 18 and 18.0 as equal even though one is an integer and the other a float.",
    "simple": "Python treats 18 and 18.0 as equal numbers. This works even though 18 is an int and 18.0 is a float.",
    "runtime": "python",
    "lesson": "python-02"
  },
  {
    "source": "You can solve a comparison by placing the numbers on a number line.",
    "simple": "Imagine marking both numbers on a number line to see which is smaller or whether they match.",
    "runtime": "python",
    "lesson": "python-02"
  },
  {
    "source": "A smaller number lies to the left, an equal one stays at the boundary, and a larger one lies to the right.",
    "simple": "Smaller numbers go left of the limit, equal numbers sit on it, and larger numbers go right.",
    "runtime": "python",
    "lesson": "python-02"
  },
  {
    "source": "In the exercise, measurement and limit are both 12.",
    "simple": "For this exercise, both measurement and limit hold the number 12.",
    "runtime": "python",
    "lesson": "python-02"
  },
  {
    "source": "The below question is false, the equal question is true, and the above question is false.",
    "simple": "Since both numbers are 12, “below?” gives False, “equal?” gives True, and “above?” gives False.",
    "runtime": "python",
    "lesson": "python-02"
  },
  {
    "source": "The quiz asks `12 == 12`, whose answer is True.",
    "simple": "The quiz's `12 == 12` gives True because the numbers match.",
    "runtime": "python",
    "lesson": "python-02"
  },
  {
    "source": "Try a below, equal, and above value while keeping the limit fixed.",
    "simple": "Leave the limit alone and try three measurements: one smaller, one equal, and one larger.",
    "runtime": "python",
    "lesson": "python-02"
  },
  {
    "source": "Predict all three results before running.",
    "simple": "Before you run the code, work out the answers to “below?”, “equal?”, and “above?”.",
    "runtime": "python",
    "lesson": "python-02"
  },
  {
    "source": "Printing them together creates the expected ordered line, but the results remain Booleans, not strings.",
    "simple": "Printing the answers together shows them in the required order on one line. They are still True-or-False values, not text values.",
    "runtime": "python",
    "lesson": "python-02"
  },
  {
    "source": "A displayed True comes from a Boolean value;",
    "simple": "Here, print shows True because the answer is the Boolean value True.",
    "runtime": "python",
    "lesson": "python-02"
  },
  {
    "source": "quoted \"True\" would instead be text.",
    "simple": "Putting quotes around \"True\" makes it text instead of a Boolean answer.",
    "runtime": "python",
    "lesson": "python-02"
  },
  {
    "source": "The parcel checker models supplied numbers and does not measure a real object on its own.",
    "simple": "The parcel checker only uses numbers you give it. It cannot measure a real parcel by itself.",
    "runtime": "python",
    "lesson": "python-02"
  },
  {
    "source": "A condition is a question whose answer is True or False.",
    "simple": "A condition is a check that gives a True or False answer.",
    "runtime": "python",
    "lesson": "python-03"
  },
  {
    "source": "An if statement runs a block only when its condition is true.",
    "simple": "An if statement runs its group of instructions only when the check passes.",
    "runtime": "python",
    "lesson": "python-03"
  },
  {
    "source": "An else block handles the remaining case.",
    "simple": "The else instructions run when the if check does not pass.",
    "runtime": "python",
    "lesson": "python-03"
  },
  {
    "source": "Python ends the opening line with a colon `:` and uses indentation to show which instructions belong to each block.",
    "simple": "Put `:` at the end of the opening line. Spaces at the start of the following lines show which instructions are grouped together.",
    "runtime": "python",
    "lesson": "python-03"
  },
  {
    "source": "Keep the same number of spaces for statements in the same block;",
    "simple": "Use matching spaces at the start of lines that belong to the same group.",
    "runtime": "python",
    "lesson": "python-03"
  },
  {
    "source": "four spaces is the common choice.",
    "simple": "Usually, each new level of instructions starts four spaces farther to the right.",
    "runtime": "python",
    "lesson": "python-03"
  },
  {
    "source": "This project also needs a small function because checks ask for reminders for different readings.",
    "simple": "Use a small function, a named set of steps you can run again, because the tests try several readings.",
    "runtime": "python",
    "lesson": "python-03"
  },
  {
    "source": "`def` defines a function.",
    "simple": "Use `def` to start writing a function.",
    "runtime": "python",
    "lesson": "python-03"
  },
  {
    "source": "The name after def is its name, and the name inside parentheses is a parameter, which receives an input.",
    "simple": "The word after def names the function. A name inside the parentheses is a parameter: a name for a value given to the function.",
    "runtime": "python",
    "lesson": "python-03"
  },
  {
    "source": "`return` sends a result to the caller and ends that call.",
    "simple": "`return` gives the answer back to the code that ran the function, then stops that run.",
    "runtime": "python",
    "lesson": "python-03"
  },
  {
    "source": "Return belongs inside a function;",
    "simple": "Put return inside the function's instructions.",
    "runtime": "python",
    "lesson": "python-03"
  },
  {
    "source": "writing it at the top level is an error.",
    "simple": "Using return outside every function causes an error.",
    "runtime": "python",
    "lesson": "python-03"
  },
  {
    "source": "Here is a complete conditional function with a different threshold.",
    "simple": "This full example chooses a light reminder, using 40 as its cutoff instead of the exercise's moisture cutoff.",
    "runtime": "python",
    "lesson": "python-03"
  },
  {
    "source": "It prints `Turn on a lamp` and `Enough light`.",
    "simple": "The first printed message is `Turn on a lamp`; the second is `Enough light`.",
    "runtime": "python",
    "lesson": "python-03"
  },
  {
    "source": "The function body is indented once;",
    "simple": "Move the instructions inside the function one level to the right.",
    "runtime": "python",
    "lesson": "python-03"
  },
  {
    "source": "each branch body is indented again.",
    "simple": "Move the instructions inside each if or else part one more level to the right.",
    "runtime": "python",
    "lesson": "python-03"
  },
  {
    "source": "The bottom calls sit outside the function and run it with different arguments.",
    "simple": "The calls at the bottom are outside the function. They run it using different input values.",
    "runtime": "python",
    "lesson": "python-03"
  },
  {
    "source": "The boundary matters.",
    "simple": "Pay attention to what happens when the input exactly matches the cutoff.",
    "runtime": "python",
    "lesson": "python-03"
  },
  {
    "source": "A strict less-than comparison excludes equality.",
    "simple": "`<` means smaller only. Equal values do not pass this check.",
    "runtime": "python",
    "lesson": "python-03"
  },
  {
    "source": "At 40, `brightness < 40` is False, so the else result is returned.",
    "simple": "When brightness is 40, `brightness < 40` gives False, so the function sends back the else message.",
    "runtime": "python",
    "lesson": "python-03"
  },
  {
    "source": "At 39 it is True.",
    "simple": "When brightness is 39, `brightness < 40` gives True.",
    "runtime": "python",
    "lesson": "python-03"
  },
  {
    "source": "In your exercise, the moisture threshold is 30, so 30 belongs to the \"Moisture is OK\" case.",
    "simple": "Your moisture cutoff is 30. A reading of exactly 30 returns \"Moisture is OK\".",
    "runtime": "python",
    "lesson": "python-03"
  },
  {
    "source": "A low reading such as 20 belongs to \"Water the plant\".",
    "simple": "A smaller reading, such as 20, returns \"Water the plant\".",
    "runtime": "python",
    "lesson": "python-03"
  },
  {
    "source": "Only one branch supplies the result for a call.",
    "simple": "Each run returns the message from just one of the two choices.",
    "runtime": "python",
    "lesson": "python-03"
  },
  {
    "source": "Python also permits a conditional expression for choosing between two values.",
    "simple": "You can also write the choice between two values in one short expression.",
    "runtime": "python",
    "lesson": "python-03"
  },
  {
    "source": "It prints `Turn on a lamp` and `Enough light`.",
    "simple": "The first printed message is `Turn on a lamp`; the second is `Enough light`.",
    "runtime": "python",
    "lesson": "python-03"
  },
  {
    "source": "Read the return line as: choose the first string if the condition is true, otherwise choose the second.",
    "simple": "The return line says: use the first text if the check passes; otherwise, use the second text.",
    "runtime": "python",
    "lesson": "python-03"
  },
  {
    "source": "This is the compact form used by the supplied solution;",
    "simple": "The provided answer uses this shorter, one-line choice.",
    "runtime": "python",
    "lesson": "python-03"
  },
  {
    "source": "a multiline if/else function teaches the same choice.",
    "simple": "Writing if and else on separate lines makes the same choice.",
    "runtime": "python",
    "lesson": "python-03"
  },
  {
    "source": "Returning and printing are different.",
    "simple": "Returning gives an answer back to other code. Printing shows an answer on screen.",
    "runtime": "python",
    "lesson": "python-03"
  },
  {
    "source": "The function should return its message so tests and other code can use it.",
    "simple": "Return the message so the tests and other code can receive and use it.",
    "runtime": "python",
    "lesson": "python-03"
  },
  {
    "source": "A print call outside the function can display that returned string.",
    "simple": "After the function returns its text, a print instruction outside the function can show it.",
    "runtime": "python",
    "lesson": "python-03"
  },
  {
    "source": "In `print(reminder(20), reminder(30))`, the two inner calls return messages first;",
    "simple": "In `print(reminder(20), reminder(30))`, reminder(20) and reminder(30) each produce their message before print shows anything.",
    "runtime": "python",
    "lesson": "python-03"
  },
  {
    "source": "print then displays both with a space between them.",
    "simple": "Then print shows the two messages with one space between them.",
    "runtime": "python",
    "lesson": "python-03"
  },
  {
    "source": "Strings need quotes, but those quotes are not shown in the displayed message.",
    "simple": "Use quotes when writing text in the code. Print shows the text without those surrounding quotes.",
    "runtime": "python",
    "lesson": "python-03"
  },
  {
    "source": "Use the parameter moisture in your comparison rather than always returning one fixed message.",
    "simple": "Compare the input named moisture so the answer can change with the reading. Do not always send back the same message.",
    "runtime": "python",
    "lesson": "python-03"
  },
  {
    "source": "Check a value below 30, exactly 30, and above 30.",
    "simple": "Try three cases: a number smaller than 30, exactly 30, and a number larger than 30.",
    "runtime": "python",
    "lesson": "python-03"
  },
  {
    "source": "Substitute each number into the question to predict the branch.",
    "simple": "Put each test number into the comparison to work out which choice will run.",
    "runtime": "python",
    "lesson": "python-03"
  },
  {
    "source": "This practice function receives a supplied number;",
    "simple": "This example works with a number you give the function.",
    "runtime": "python",
    "lesson": "python-03"
  },
  {
    "source": "it does not read a real sensor or decide how every plant should be watered.",
    "simple": "It does not get readings from a real sensor or provide watering rules for every kind of plant.",
    "runtime": "python",
    "lesson": "python-03"
  },
  {
    "source": "The mathematical idea is an inequality: 20 < 30 is True, while 30 < 30 is False.",
    "simple": "This uses a smaller-than question, called an inequality. 20 < 30 gives True, but 30 < 30 gives False.",
    "runtime": "python",
    "lesson": "python-03"
  },
  {
    "source": "A loop repeats instructions.",
    "simple": "Use a loop when you want the same steps to happen again.",
    "runtime": "python",
    "lesson": "python-04"
  },
  {
    "source": "A Python for loop visits each value in a collection, one at a time.",
    "simple": "A for loop takes one value from a group, runs its steps, then moves to the next value.",
    "runtime": "python",
    "lesson": "python-04"
  },
  {
    "source": "A list is an ordered collection written inside square brackets `[]` with commas separating its entries.",
    "simple": "A list keeps items in a chosen order. Put them inside `[]` and separate them with commas.",
    "runtime": "python",
    "lesson": "python-04"
  },
  {
    "source": "A list of day names uses quoted strings.",
    "simple": "Write each day's name as text inside quotes.",
    "runtime": "python",
    "lesson": "python-04"
  },
  {
    "source": "The loop knows how many visits to make from the actual list;",
    "simple": "The loop repeats according to the day names actually in the list.",
    "runtime": "python",
    "lesson": "python-04"
  },
  {
    "source": "it does not assume that every schedule contains seven days.",
    "simple": "It does not automatically repeat seven times just because the list is a schedule.",
    "runtime": "python",
    "lesson": "python-04"
  },
  {
    "source": "Read `for day in days:` as: take each value from days in order, assign it to day for this visit, and run the indented body.",
    "simple": "`for day in days:` means: take the next item from days, call it day, and run the lines underneath that are moved to the right.",
    "runtime": "python",
    "lesson": "python-04"
  },
  {
    "source": "The name day is the loop variable.",
    "simple": "During each repeat, day is the name holding the item you are using now.",
    "runtime": "python",
    "lesson": "python-04"
  },
  {
    "source": "The keyword in introduces the collection being visited.",
    "simple": "The word in tells Python where to find the items for the loop.",
    "runtime": "python",
    "lesson": "python-04"
  },
  {
    "source": "A colon ends the loop header.",
    "simple": "Put `:` at the end of the line that starts the loop.",
    "runtime": "python",
    "lesson": "python-04"
  },
  {
    "source": "Indentation, usually four spaces, marks the body that repeats.",
    "simple": "Move the repeating instructions to the right, usually by four spaces, to show that they belong to the loop.",
    "runtime": "python",
    "lesson": "python-04"
  },
  {
    "source": "A line back at the original margin runs after the loop.",
    "simple": "A line moved back to the loop's starting position runs after the repeats finish.",
    "runtime": "python",
    "lesson": "python-04"
  },
  {
    "source": "This complete short schedule contains three days.",
    "simple": "This whole example uses a list with just three day names.",
    "runtime": "python",
    "lesson": "python-04"
  },
  {
    "source": "The first three lines of output are `Monday: drawing`, `Wednesday: drawing`, and `Friday: drawing`.",
    "simple": "It first prints `Monday: drawing`, then `Wednesday: drawing`, then `Friday: drawing`, each on its own line.",
    "runtime": "python",
    "lesson": "python-04"
  },
  {
    "source": "The final line is `Schedule finished`, printed once after the loop.",
    "simple": "After those three repeats, it prints `Schedule finished` once.",
    "runtime": "python",
    "lesson": "python-04"
  },
  {
    "source": "The repeated print is inside the body;",
    "simple": "The print instruction moved to the right is the one that repeats.",
    "runtime": "python",
    "lesson": "python-04"
  },
  {
    "source": "the final print is outside it.",
    "simple": "The last print instruction is not part of the loop, so it does not repeat.",
    "runtime": "python",
    "lesson": "python-04"
  },
  {
    "source": "Inside the body, the f prefix turns the string into an f-string.",
    "simple": "The f before the opening quote lets this text include values inside braces. This kind of text is called an f-string.",
    "runtime": "python",
    "lesson": "python-04"
  },
  {
    "source": "`{day}` inserts the current loop value into the text.",
    "simple": "`{day}` is replaced with the day name being used on that repeat.",
    "runtime": "python",
    "lesson": "python-04"
  },
  {
    "source": "On the first visit it is Monday, then Wednesday, then Friday.",
    "simple": "The day name is Monday on the first repeat, Wednesday on the second, and Friday on the third.",
    "runtime": "python",
    "lesson": "python-04"
  },
  {
    "source": "The colon inside the quoted sentence is just punctuation in the output;",
    "simple": "The colon inside the quotes appears as an ordinary colon in the printed text.",
    "runtime": "python",
    "lesson": "python-04"
  },
  {
    "source": "the colon at the end of the for header starts the block.",
    "simple": "The colon after the for line tells Python that the loop's instructions follow.",
    "runtime": "python",
    "lesson": "python-04"
  },
  {
    "source": "Identical symbols can have different jobs depending on whether they appear inside text or in code.",
    "simple": "A symbol inside quotes can be ordinary text, while the same symbol outside quotes can give Python an instruction.",
    "runtime": "python",
    "lesson": "python-04"
  },
  {
    "source": "Changing the list changes the repetition count.",
    "simple": "A longer or shorter day list makes the loop repeat more or fewer times.",
    "runtime": "python",
    "lesson": "python-04"
  },
  {
    "source": "It displays `Saturday: reading`, `Sunday: reading`, and `2`.",
    "simple": "This example prints `Saturday: reading`, then `Sunday: reading`, then `2`.",
    "runtime": "python",
    "lesson": "python-04"
  },
  {
    "source": "The counter begins at zero.",
    "simple": "The name count starts with the value 0.",
    "runtime": "python",
    "lesson": "python-04"
  },
  {
    "source": "Each visit adds one and assigns the updated value back.",
    "simple": "After each day, the code adds 1 to count and saves that new total as count.",
    "runtime": "python",
    "lesson": "python-04"
  },
  {
    "source": "Both indented lines run once per day, but there are only two day entries to visit.",
    "simple": "For each day, both indented instructions run. There are two days, so each instruction runs twice.",
    "runtime": "python",
    "lesson": "python-04"
  },
  {
    "source": "With an empty list, the loop body runs zero times.",
    "simple": "If the list has no items, none of the loop's instructions run.",
    "runtime": "python",
    "lesson": "python-04"
  },
  {
    "source": "With seven entries and one task printed per entry, it runs seven times and prints seven tasks.",
    "simple": "Seven list items mean seven repeats. Printing one task on each repeat gives seven tasks.",
    "runtime": "python",
    "lesson": "python-04"
  },
  {
    "source": "The arithmetic is count times tasks per visit: 7 times 1 equals 7.",
    "simple": "Multiply the number of repeats by tasks per repeat: 7 times 1 gives 7.",
    "runtime": "python",
    "lesson": "python-04"
  },
  {
    "source": "No manual counter is needed just to visit each item.",
    "simple": "A for loop can go through all the items without you keeping a separate count.",
    "runtime": "python",
    "lesson": "python-04"
  },
  {
    "source": "This ordinary for loop stops once every item in the unchanged list has been visited.",
    "simple": "As long as this list is not changed during the loop, the loop finishes after using every item.",
    "runtime": "python",
    "lesson": "python-04"
  },
  {
    "source": "Your schedule contains Mon through Sun.",
    "simple": "The exercise's list has the seven names from Mon to Sun.",
    "runtime": "python",
    "lesson": "python-04"
  },
  {
    "source": "Keep the required print in the indented loop body so each day receives its own line.",
    "simple": "Keep print moved to the right underneath for so it prints a separate line for every day.",
    "runtime": "python",
    "lesson": "python-04"
  },
  {
    "source": "If the print is accidentally outside the loop, it would run only once after the loop.",
    "simple": "If print lines up with for instead, it runs once, after all the repeats.",
    "runtime": "python",
    "lesson": "python-04"
  },
  {
    "source": "Count the output lines and compare them with the seven list entries.",
    "simple": "Check that the number of printed lines matches the seven days in the list.",
    "runtime": "python",
    "lesson": "python-04"
  },
  {
    "source": "Try a shorter list afterward to confirm the behavior follows the list rather than a fixed number in the code.",
    "simple": "Then try fewer days. Check that the number of repeats follows the list's size, not an assumed fixed number.",
    "runtime": "python",
    "lesson": "python-04"
  },
  {
    "source": "A list stores values in an order and lets you change its contents.",
    "simple": "A list keeps items in order, and you can add, remove, or replace items later.",
    "runtime": "python",
    "lesson": "python-05"
  },
  {
    "source": "Write square brackets around the values and commas between them.",
    "simple": "Put the items between square brackets, with a comma between each pair of items.",
    "runtime": "python",
    "lesson": "python-05"
  },
  {
    "source": "Strings need quotes, so `[\"leaf\", \"stone\"]` is a list containing two strings.",
    "simple": "Text needs quotes: `[\"leaf\", \"stone\"]` holds the two text values \"leaf\" and \"stone\".",
    "runtime": "python",
    "lesson": "python-05"
  },
  {
    "source": "A name assigned to the list lets later instructions use that same collection.",
    "simple": "Give the list a name so later lines of code can find and use it.",
    "runtime": "python",
    "lesson": "python-05"
  },
  {
    "source": "The word mutable means changeable;",
    "simple": "Mutable is a technical word for something you can change.",
    "runtime": "python",
    "lesson": "python-05"
  },
  {
    "source": "Python lists are mutable.",
    "simple": "You can change a Python list's contents after creating it.",
    "runtime": "python",
    "lesson": "python-05"
  },
  {
    "source": "An index is a position in the list.",
    "simple": "An index is the number used to find an item's place in a list.",
    "runtime": "python",
    "lesson": "python-05"
  },
  {
    "source": "Python starts with index 0 for the first entry, then 1 for the second and 2 for the third.",
    "simple": "The first item's position number is 0, the second is 1, and the third is 2.",
    "runtime": "python",
    "lesson": "python-05"
  },
  {
    "source": "`items[0]` reads the first entry.",
    "simple": "`items[0]` gets the item at position 0, which is the first item.",
    "runtime": "python",
    "lesson": "python-05"
  },
  {
    "source": "`len(items)` is a built-in function that returns the number of entries.",
    "simple": "`len(items)` asks Python's ready-made len function how many items this list holds.",
    "runtime": "python",
    "lesson": "python-05"
  },
  {
    "source": "Length is a count, so a three-item list has length 3 even though its last index is 2.",
    "simple": "A list with three items has length 3. Its positions are numbered 0, 1, and 2, so its last index is 2.",
    "runtime": "python",
    "lesson": "python-05"
  },
  {
    "source": "Here is a complete list before adding anything.",
    "simple": "This first example shows the list as it is, before any item is added.",
    "runtime": "python",
    "lesson": "python-05"
  },
  {
    "source": "The outputs are `['leaf', 'stone', 'feather']`, then 3, then leaf.",
    "simple": "The first printed line is `['leaf', 'stone', 'feather']`, the second is 3, and the third is leaf.",
    "runtime": "python",
    "lesson": "python-05"
  },
  {
    "source": "Python's display of the list includes brackets and quotes to show its structure.",
    "simple": "When Python shows the whole list, brackets mark the list and quotes mark its text items.",
    "runtime": "python",
    "lesson": "python-05"
  },
  {
    "source": "Printing one string by itself displays the text without surrounding quotes.",
    "simple": "When you print just one text item, its surrounding quotes do not appear.",
    "runtime": "python",
    "lesson": "python-05"
  },
  {
    "source": "The displayed list may use single quotes even when the source used double quotes.",
    "simple": "Python can show text items with single quotes even if you wrote them with double quotes. The text is still the same.",
    "runtime": "python",
    "lesson": "python-05"
  },
  {
    "source": "`.append(value)` is a list method, a function belonging to that list.",
    "simple": "`.append(value)` uses append, a function attached to the list, to add an item. A function attached this way is called a method.",
    "runtime": "python",
    "lesson": "python-05"
  },
  {
    "source": "The dot selects append;",
    "simple": "The dot tells Python to use the list's append method.",
    "runtime": "python",
    "lesson": "python-05"
  },
  {
    "source": "parentheses hold the value to add.",
    "simple": "Put the item you want to add inside append's parentheses.",
    "runtime": "python",
    "lesson": "python-05"
  },
  {
    "source": "Append changes the existing list by adding one entry at the end.",
    "simple": "Append puts one new item after the last item in the same list.",
    "runtime": "python",
    "lesson": "python-05"
  },
  {
    "source": "It does not replace the list or remove the earlier entries.",
    "simple": "The list is still the same list, and all its previous items are still there.",
    "runtime": "python",
    "lesson": "python-05"
  },
  {
    "source": "Append returns None, so call it as a separate instruction rather than assigning its return to your list name.",
    "simple": "Append changes the list but gives back None, meaning no result value to use here. Run it on its own line; do not save that None over the list's name.",
    "runtime": "python",
    "lesson": "python-05"
  },
  {
    "source": "This second example adds one collectible.",
    "simple": "In the next example, button is added to the collection.",
    "runtime": "python",
    "lesson": "python-05"
  },
  {
    "source": "It displays `['leaf', 'stone', 'feather', 'button']`, then 4, then button.",
    "simple": "The printed lines are `['leaf', 'stone', 'feather', 'button']`, then 4, then button.",
    "runtime": "python",
    "lesson": "python-05"
  },
  {
    "source": "The last read calculates length 4 minus 1 and accesses index 3.",
    "simple": "The final line works out 4 minus 1, giving index 3, and reads the item there.",
    "runtime": "python",
    "lesson": "python-05"
  },
  {
    "source": "You can also read the final item with `items[-1]`;",
    "simple": "`items[-1]` is another way to get the last item.",
    "runtime": "python",
    "lesson": "python-05"
  },
  {
    "source": "a negative index counts from the end.",
    "simple": "A minus sign on an index means count backward from the end of the list.",
    "runtime": "python",
    "lesson": "python-05"
  },
  {
    "source": "An empty list has length zero.",
    "simple": "A list with no items has a length of 0.",
    "runtime": "python",
    "lesson": "python-05"
  },
  {
    "source": "Reading an index that does not exist raises an IndexError, so do not assume it has a final entry.",
    "simple": "Trying to read a position that is not there causes an IndexError. An empty list has no last item to read.",
    "runtime": "python",
    "lesson": "python-05"
  },
  {
    "source": "This exercise starts with three entries, making a fourth after append.",
    "simple": "There are three items to begin with. Appending one gives four items.",
    "runtime": "python",
    "lesson": "python-05"
  },
  {
    "source": "Count and index answer different questions: how many entries exist, and where a particular entry sits.",
    "simple": "Length tells you how many items there are. An index tells you which position to read.",
    "runtime": "python",
    "lesson": "python-05"
  },
  {
    "source": "The same counting idea says seven days with one task per day produces seven tasks: 7 times 1 equals 7.",
    "simple": "Counting one task for each of seven days gives seven tasks: 7 times 1 equals 7.",
    "runtime": "python",
    "lesson": "python-05"
  },
  {
    "source": "Your original collectibles are shell, badge, and coin.",
    "simple": "Start with shell first, badge second, and coin third.",
    "runtime": "python",
    "lesson": "python-05"
  },
  {
    "source": "Append the exact string stamp, then print the full list and its new length.",
    "simple": "Add the text \"stamp\" exactly as written. Then show the whole list and how many items it now holds.",
    "runtime": "python",
    "lesson": "python-05"
  },
  {
    "source": "The count should be the last output line and equal 4.",
    "simple": "The final printed line must show the number 4.",
    "runtime": "python",
    "lesson": "python-05"
  },
  {
    "source": "All four values should remain in order.",
    "simple": "Keep shell, badge, coin, and stamp in that order.",
    "runtime": "python",
    "lesson": "python-05"
  },
  {
    "source": "Try appending a different item in a separate practice run and predict both the full list and length before running.",
    "simple": "For extra practice, start a separate run and add another item instead. Guess the whole list and its length before you run it.",
    "runtime": "python",
    "lesson": "python-05"
  },
  {
    "source": "Adding one item always increases this list's length by one.",
    "simple": "Each time you add one item to this list, its item count goes up by 1.",
    "runtime": "python",
    "lesson": "python-05"
  },
  {
    "source": "Organizing a list can mean sorting it, choosing a portion, and replacing one entry.",
    "simple": "You can organize a list by putting it in order, taking part of it, or changing one item.",
    "runtime": "python",
    "lesson": "python-06"
  },
  {
    "source": "A list is ordered and mutable, so position matters when making changes.",
    "simple": "Lists keep items in order and let you change them. Check which position you are changing.",
    "runtime": "python",
    "lesson": "python-06"
  },
  {
    "source": "Sorting text arranges it according to Python's ordering of characters;",
    "simple": "Python sorts text using its rules for the order of characters, rather than a person's dictionary rules.",
    "runtime": "python",
    "lesson": "python-06"
  },
  {
    "source": "with the simple consistently capitalized titles here, this looks alphabetical.",
    "simple": "For these simple titles, capital letters are used consistently, so the result looks like alphabetical order.",
    "runtime": "python",
    "lesson": "python-06"
  },
  {
    "source": "A position is called an index, and indexes start at zero.",
    "simple": "Each position has a number called an index. The first position is 0.",
    "runtime": "python",
    "lesson": "python-06"
  },
  {
    "source": "`sorted(reading)` returns a new sorted list, leaving reading unchanged.",
    "simple": "`sorted(reading)` makes a separate list in sorted order. The reading list keeps its old order.",
    "runtime": "python",
    "lesson": "python-06"
  },
  {
    "source": "In contrast, `reading.sort()` rearranges that existing list and returns None.",
    "simple": "`reading.sort()` changes the order inside reading itself. It gives back None rather than a new list.",
    "runtime": "python",
    "lesson": "python-06"
  },
  {
    "source": "Choose sorted when you need to keep the original order.",
    "simple": "Use sorted if you want to keep the old list in its original order.",
    "runtime": "python",
    "lesson": "python-06"
  },
  {
    "source": "Assign the returned list to a different name.",
    "simple": "Save the new list under a name different from the original list's name.",
    "runtime": "python",
    "lesson": "python-06"
  },
  {
    "source": "For the strings in this exercise, that new outer list can be changed without changing the original list's entries.",
    "simple": "Here the items are text, so replacing an item in the new list does not replace an item in the original list.",
    "runtime": "python",
    "lesson": "python-06"
  },
  {
    "source": "Here is a complete sort-and-update example.",
    "simple": "This full example makes a sorted list and then changes one of its titles.",
    "runtime": "python",
    "lesson": "python-06"
  },
  {
    "source": "It prints `['Bridge', 'Forest', 'River']`, then `['A Garden', 'Forest', 'River']`, then `['Forest', 'Bridge', 'River']`.",
    "simple": "It shows `['Bridge', 'Forest', 'River']` first, `['A Garden', 'Forest', 'River']` second, and `['Forest', 'Bridge', 'River']` last.",
    "runtime": "python",
    "lesson": "python-06"
  },
  {
    "source": "Assignment to organized[0] replaces only its first entry.",
    "simple": "Setting organized[0] to a value changes the first item in organized and no other item.",
    "runtime": "python",
    "lesson": "python-06"
  },
  {
    "source": "It does not insert a new entry or change the list's length.",
    "simple": "Replacing an item keeps the number of items the same; it does not add an extra one.",
    "runtime": "python",
    "lesson": "python-06"
  },
  {
    "source": "A slice chooses a range of positions.",
    "simple": "A slice takes a section of a list using position numbers.",
    "runtime": "python",
    "lesson": "python-06"
  },
  {
    "source": "`values[start:stop]` includes the start index and stops before the stop index.",
    "simple": "`values[start:stop]` starts at the position start and takes items up to, but not including, position stop.",
    "runtime": "python",
    "lesson": "python-06"
  },
  {
    "source": "The colon separates the two boundaries.",
    "simple": "The `:` goes between the starting position and the stopping position.",
    "runtime": "python",
    "lesson": "python-06"
  },
  {
    "source": "For indexes 1 through just before 3, select indexes 1 and 2.",
    "simple": "Starting at index 1 and stopping before index 3 takes just indexes 1 and 2.",
    "runtime": "python",
    "lesson": "python-06"
  },
  {
    "source": "A slice returns a new list.",
    "simple": "The selected items are put in a separate list.",
    "runtime": "python",
    "lesson": "python-06"
  },
  {
    "source": "The stop's exclusion helps adjacent slices meet without repeating an entry.",
    "simple": "Because the stopping position is left out, the next slice can start there without taking the same item twice.",
    "runtime": "python",
    "lesson": "python-06"
  },
  {
    "source": "Trace this complete numeric slice example.",
    "simple": "Follow this full number example to see exactly which items each slice takes.",
    "runtime": "python",
    "lesson": "python-06"
  },
  {
    "source": "The outputs are `[6, 9]`, `[3, 6]`, and `[9, 12]`.",
    "simple": "The three printed lists are `[6, 9]`, then `[3, 6]`, then `[9, 12]`.",
    "runtime": "python",
    "lesson": "python-06"
  },
  {
    "source": "Index 0 holds 3;",
    "simple": "The first item, at position 0, is 3.",
    "runtime": "python",
    "lesson": "python-06"
  },
  {
    "source": "index 1 holds 6;",
    "simple": "The second item, at position 1, is 6.",
    "runtime": "python",
    "lesson": "python-06"
  },
  {
    "source": "index 2 holds 9;",
    "simple": "The third item, at position 2, is 9.",
    "runtime": "python",
    "lesson": "python-06"
  },
  {
    "source": "index 3 holds 12.",
    "simple": "The fourth item, at position 3, is 12.",
    "runtime": "python",
    "lesson": "python-06"
  },
  {
    "source": "The first slice leaves out index 3.",
    "simple": "The first slice stops before position 3, so it does not take 12.",
    "runtime": "python",
    "lesson": "python-06"
  },
  {
    "source": "Its length is stop minus start here: 3 minus 1 equals two entries.",
    "simple": "For this slice, subtract start from stop to count the items: 3 minus 1 gives 2.",
    "runtime": "python",
    "lesson": "python-06"
  },
  {
    "source": "A slice made before a later replacement keeps its selected values;",
    "simple": "If you make a slice and then replace an item in the original list, the slice keeps the values it already took.",
    "runtime": "python",
    "lesson": "python-06"
  },
  {
    "source": "it is not a live window into the outer list.",
    "simple": "The slice is a separate list, not a view that changes whenever the original list changes.",
    "runtime": "python",
    "lesson": "python-06"
  },
  {
    "source": "These are shallow copies, meaning nested mutable objects would still be shared, but this lesson uses plain strings and numbers.",
    "simple": "These copies have separate lists on the outside, but an item that is itself a changeable object would still be shared. That is called a shallow copy; this lesson only uses text and numbers as items.",
    "runtime": "python",
    "lesson": "python-06"
  },
  {
    "source": "Reading one missing index raises an error;",
    "simple": "Asking for one position that is not in the list causes an error.",
    "runtime": "python",
    "lesson": "python-06"
  },
  {
    "source": "slices instead safely stop at the list's end.",
    "simple": "A slice can ask to stop past the last item; it simply takes what is available up to the end.",
    "runtime": "python",
    "lesson": "python-06"
  },
  {
    "source": "Keep source preservation, selection boundaries, and updates as separate decisions.",
    "simple": "Decide separately whether to keep the original, which positions to take, and which item to replace.",
    "runtime": "python",
    "lesson": "python-06"
  },
  {
    "source": "Your supplied titles sort into Atlas, Moon, Willow.",
    "simple": "Sorting the supplied titles puts them in this order: Atlas, Moon, Willow.",
    "runtime": "python",
    "lesson": "python-06"
  },
  {
    "source": "Select indexes 1 and 2 to get Moon and Willow, then replace the first organized title with A New Beginning.",
    "simple": "Take indexes 1 and 2, which hold Moon and Willow. After that, change organized's first title to \"A New Beginning\".",
    "runtime": "python",
    "lesson": "python-06"
  },
  {
    "source": "The source reading list must still have its original order.",
    "simple": "Do not change the order of the original list named reading.",
    "runtime": "python",
    "lesson": "python-06"
  },
  {
    "source": "For the quiz, [4, 8, 12, 16][1:3] selects [8, 12], not index 3's 16.",
    "simple": "In `[4, 8, 12, 16][1:3]`, indexes 1 and 2 hold 8 and 12, giving `[8, 12]`. Index 3 holds 16 and is left out.",
    "runtime": "python",
    "lesson": "python-06"
  },
  {
    "source": "Predict the list after each line so you can catch an incorrect sort, slice, or replacement independently.",
    "simple": "Work out the list after each instruction. This helps you see whether a mistake came from sorting, choosing a slice, or replacing an item.",
    "runtime": "python",
    "lesson": "python-06"
  },
  {
    "source": "A string is text written in quotes.",
    "simple": "Text surrounded by quotes is called a string.",
    "runtime": "python",
    "lesson": "python-07"
  },
  {
    "source": "Strings are immutable, meaning you cannot change their existing characters in place.",
    "simple": "You cannot edit the characters inside an existing string. This is what immutable means.",
    "runtime": "python",
    "lesson": "python-07"
  },
  {
    "source": "Cleanup methods return new strings instead.",
    "simple": "Text-cleaning methods give you another string instead of editing the old one.",
    "runtime": "python",
    "lesson": "python-07"
  },
  {
    "source": "A method is a function accessed with a dot after a value, such as text.strip().",
    "simple": "A method is a function you use through a value, with a dot between them. In text.strip(), strip is the method used on text.",
    "runtime": "python",
    "lesson": "python-07"
  },
  {
    "source": "Store the result if later code needs the cleaned version.",
    "simple": "Save the cleaned text under a name if you will need it again.",
    "runtime": "python",
    "lesson": "python-07"
  },
  {
    "source": "The original string stays available under its earlier name.",
    "simple": "In this example, the earlier name still lets you read the unchanged original text.",
    "runtime": "python",
    "lesson": "python-07"
  },
  {
    "source": "`.strip()` removes whitespace from the beginning and end.",
    "simple": "`.strip()` cuts off blank spacing before the first character and after the last character.",
    "runtime": "python",
    "lesson": "python-07"
  },
  {
    "source": "Whitespace includes spaces, tabs, and line breaks.",
    "simple": "Whitespace is blank spacing, including spaces, tabs, and new lines.",
    "runtime": "python",
    "lesson": "python-07"
  },
  {
    "source": "It does not remove spaces between words.",
    "simple": "Strip leaves the spaces between words alone.",
    "runtime": "python",
    "lesson": "python-07"
  },
  {
    "source": "`.lower()` returns a lowercase version.",
    "simple": "`.lower()` gives back new text with letters changed to lowercase.",
    "runtime": "python",
    "lesson": "python-07"
  },
  {
    "source": "Chaining `text.strip().lower()` first trims the outside, then lowercases that result.",
    "simple": "`text.strip().lower()` does two jobs in order: remove outside spacing, then make that result lowercase.",
    "runtime": "python",
    "lesson": "python-07"
  },
  {
    "source": "Empty parentheses mean these methods need no extra input for their ordinary behavior.",
    "simple": "For these usual cleanup jobs, leave the parentheses empty because no extra value is needed.",
    "runtime": "python",
    "lesson": "python-07"
  },
  {
    "source": "This complete example shows each cleanup step.",
    "simple": "This full example lets you see the result of each cleanup step.",
    "runtime": "python",
    "lesson": "python-07"
  },
  {
    "source": "It displays `Make   Art`, `make   art`, and True.",
    "simple": "It prints `Make   Art` first, `make   art` second, and True last.",
    "runtime": "python",
    "lesson": "python-07"
  },
  {
    "source": "The three spaces between the words are preserved.",
    "simple": "There are still three spaces between the two words after cleaning.",
    "runtime": "python",
    "lesson": "python-07"
  },
  {
    "source": "The equality check confirms the original still contains its initial spaces and capitalization.",
    "simple": "The True answer shows that the original text still has the same spaces and capital letters it started with.",
    "runtime": "python",
    "lesson": "python-07"
  },
  {
    "source": "Assignment stores returned strings rather than altering text in place.",
    "simple": "The names trimmed and cleaned save the new strings. They do not edit the string held by text.",
    "runtime": "python",
    "lesson": "python-07"
  },
  {
    "source": "`.split()` with no argument separates a string into words using whitespace.",
    "simple": "Calling `.split()` with nothing in the parentheses breaks text into pieces wherever there is whitespace.",
    "runtime": "python",
    "lesson": "python-07"
  },
  {
    "source": "Repeated spaces act as one separation, and surrounding whitespace does not create empty words.",
    "simple": "Several spaces together separate words just once. Blank spacing before or after the text does not add empty pieces.",
    "runtime": "python",
    "lesson": "python-07"
  },
  {
    "source": "The result is a list of strings.",
    "simple": "You get a list whose items are the separate pieces of text.",
    "runtime": "python",
    "lesson": "python-07"
  },
  {
    "source": "`len(...)` counts its entries.",
    "simple": "`len(...)` tells you how many pieces are in that list.",
    "runtime": "python",
    "lesson": "python-07"
  },
  {
    "source": "`.split(\" \")` has a different meaning: split at each literal space, which can produce empty strings between repeated spaces.",
    "simple": "`.split(\" \")` is different: it cuts at every individual space. Several spaces in a row can therefore leave empty pieces between them.",
    "runtime": "python",
    "lesson": "python-07"
  },
  {
    "source": "Use the no-argument form for this word count.",
    "simple": "For counting words here, use `.split()` with nothing inside its parentheses.",
    "runtime": "python",
    "lesson": "python-07"
  },
  {
    "source": "Here is a complete reusable cleaner and counter.",
    "simple": "This full function can clean and count words in different inputs, not just one example.",
    "runtime": "python",
    "lesson": "python-07"
  },
  {
    "source": "The outputs are `('make   art', 2)`, `('', 0)`, and `['sun', 'moon']`.",
    "simple": "The printed results are `('make   art', 2)`, then `('', 0)`, then `['sun', 'moon']`.",
    "runtime": "python",
    "lesson": "python-07"
  },
  {
    "source": "A comma in the return produces a tuple, an ordered pair here: cleaned text first and count second.",
    "simple": "The comma lets return send back a pair of values called a tuple. In this pair, the cleaned text comes first and the word count comes second.",
    "runtime": "python",
    "lesson": "python-07"
  },
  {
    "source": "The empty cleaned string has an empty words list, so its count is zero.",
    "simple": "When the cleaned text is empty, split finds no words, so the list is empty and its count is 0.",
    "runtime": "python",
    "lesson": "python-07"
  },
  {
    "source": "Word counting in this exercise is based on whitespace, not a full language dictionary.",
    "simple": "Here, a “word” means a piece separated by whitespace. The code does not check a dictionary to recognize real words.",
    "runtime": "python",
    "lesson": "python-07"
  },
  {
    "source": "Punctuation attached to a word stays in that word.",
    "simple": "A punctuation mark next to a word stays attached to that piece of text.",
    "runtime": "python",
    "lesson": "python-07"
  },
  {
    "source": "The quiz text red followed by several spaces then blue contains two words, not extra words for the extra spaces.",
    "simple": "In the quiz, red and blue are the two words. The extra spaces between them do not count as words.",
    "runtime": "python",
    "lesson": "python-07"
  },
  {
    "source": "Count the nonempty pieces produced by split: one for red and one for blue.",
    "simple": "Split gives two nonempty pieces: red is one and blue is the other.",
    "runtime": "python",
    "lesson": "python-07"
  },
  {
    "source": "Your required input Read every day, with extra outside and inside spaces, becomes lowercase text while keeping its internal spacing.",
    "simple": "For the exercise's \"Read every day\" input, remove extra outside spaces and make the letters lowercase. Keep the extra spaces between the words.",
    "runtime": "python",
    "lesson": "python-07"
  },
  {
    "source": "The word count is 3.",
    "simple": "There are three word pieces, so the answer is 3.",
    "runtime": "python",
    "lesson": "python-07"
  },
  {
    "source": "All-space input becomes an empty string with count 0.",
    "simple": "If the input is only spaces, the cleaned text is empty and the word count is 0.",
    "runtime": "python",
    "lesson": "python-07"
  },
  {
    "source": "Return both values so tests can inspect them.",
    "simple": "Send back both the cleaned text and the count so the checks can look at each answer.",
    "runtime": "python",
    "lesson": "python-07"
  },
  {
    "source": "Do not join the split words back together unless the task asks you to normalize internal spacing;",
    "simple": "Do not put the split words back together unless you have been asked to make the spacing between words consistent.",
    "runtime": "python",
    "lesson": "python-07"
  },
  {
    "source": "the exercise expects the cleaned string to preserve those internal spaces.",
    "simple": "This exercise wants the spacing between words to stay exactly as it was.",
    "runtime": "python",
    "lesson": "python-07"
  },
  {
    "source": "A function packages reusable steps.",
    "simple": "A function gives a group of steps a name so you can use those steps again.",
    "runtime": "python",
    "lesson": "python-08"
  },
  {
    "source": "Define one with def, a name, input names in parentheses, and a colon.",
    "simple": "To write a function, use def, then its name, then its input names inside parentheses, then a colon.",
    "runtime": "python",
    "lesson": "python-08"
  },
  {
    "source": "Its indented body runs when the function is called.",
    "simple": "The lines moved to the right under def run when you ask the function to run.",
    "runtime": "python",
    "lesson": "python-08"
  },
  {
    "source": "A parameter is an input's name inside the function;",
    "simple": "Inside the function, a parameter is the name used for an input value.",
    "runtime": "python",
    "lesson": "python-08"
  },
  {
    "source": "an argument is the actual value supplied in a call.",
    "simple": "When you run the function, the value you give that input is called an argument.",
    "runtime": "python",
    "lesson": "python-08"
  },
  {
    "source": "Commas separate inputs.",
    "simple": "Put a comma between the function's inputs.",
    "runtime": "python",
    "lesson": "python-08"
  },
  {
    "source": "This project supplies a list of amounts and a scale factor, the number by which every amount should be multiplied.",
    "simple": "You are given a list of ingredient amounts and one number called a scale factor. Multiply every amount by that number.",
    "runtime": "python",
    "lesson": "python-08"
  },
  {
    "source": "Return sends a result back to the calling code and ends that call.",
    "simple": "Return hands the answer back to the code that ran the function and stops that run.",
    "runtime": "python",
    "lesson": "python-08"
  },
  {
    "source": "Print only displays a value.",
    "simple": "Print shows a value on screen rather than handing it back as the function's answer.",
    "runtime": "python",
    "lesson": "python-08"
  },
  {
    "source": "A reusable recipe scaler needs to return a new list so checks and other code can use it.",
    "simple": "The recipe function must give back a new list so the tests and other code can work with the new amounts.",
    "runtime": "python",
    "lesson": "python-08"
  },
  {
    "source": "The multiplication sign is `*`, so 4 * 3 means four multiplied by three.",
    "simple": "Use `*` for multiplication: 4 * 3 means 4 multiplied by 3.",
    "runtime": "python",
    "lesson": "python-08"
  },
  {
    "source": "Decimal amounts such as 0.5 are floats and can be multiplied too.",
    "simple": "Python can also multiply decimal numbers, such as 0.5. These numbers are called floats.",
    "runtime": "python",
    "lesson": "python-08"
  },
  {
    "source": "Start with a full loop version to see every step.",
    "simple": "First look at the longer version, where you can follow each repeated step.",
    "runtime": "python",
    "lesson": "python-08"
  },
  {
    "source": "It displays `[3, 1.5, 12]` and `[1, 0.5, 4]`.",
    "simple": "The new list prints as `[3, 1.5, 12]`; the original still prints as `[1, 0.5, 4]`.",
    "runtime": "python",
    "lesson": "python-08"
  },
  {
    "source": "Each input amount contributes a multiplied value to a new list.",
    "simple": "For each original amount, the code multiplies it and adds that answer to a separate list.",
    "runtime": "python",
    "lesson": "python-08"
  },
  {
    "source": "Return sits after the loop, so all amounts are processed before the result is sent back.",
    "simple": "Return runs only after the loop finishes. That gives every amount a turn before the new list is sent back.",
    "runtime": "python",
    "lesson": "python-08"
  },
  {
    "source": "A list comprehension is a compact way to build that new list.",
    "simple": "A list comprehension writes this list-building loop in a shorter form.",
    "runtime": "python",
    "lesson": "python-08"
  },
  {
    "source": "Read `[amount * factor for amount in amounts]` as: for each amount in amounts, calculate amount times factor and place that result in the new list.",
    "simple": "`[amount * factor for amount in amounts]` takes each amount from amounts, multiplies it by factor, and puts the answer in a new list.",
    "runtime": "python",
    "lesson": "python-08"
  },
  {
    "source": "The expression comes first, followed by the for/in clause.",
    "simple": "Write the calculation first. Then the for/in part says which items to use for that calculation.",
    "runtime": "python",
    "lesson": "python-08"
  },
  {
    "source": "Square brackets tell Python to collect the results as a list.",
    "simple": "The surrounding square brackets mean the answers should be gathered into a list.",
    "runtime": "python",
    "lesson": "python-08"
  },
  {
    "source": "It is still a loop, even when written on one line.",
    "simple": "Even on one line, this code still repeats a step for each amount.",
    "runtime": "python",
    "lesson": "python-08"
  },
  {
    "source": "Here is the equivalent complete comprehension example.",
    "simple": "This full shorter example does the same work using a list comprehension.",
    "runtime": "python",
    "lesson": "python-08"
  },
  {
    "source": "It prints `[3, 1.5, 12]`, `[0, 0.0, 0]`, `[]`, and the unchanged original list.",
    "simple": "The printed results are `[3, 1.5, 12]`, then `[0, 0.0, 0]`, then `[]`, then the original `[1, 0.5, 4]`.",
    "runtime": "python",
    "lesson": "python-08"
  },
  {
    "source": "Zero scales every amount to zero;",
    "simple": "Using 0 as the factor multiplies each amount by 0, making every answer zero.",
    "runtime": "python",
    "lesson": "python-08"
  },
  {
    "source": "an empty list has no values to transform.",
    "simple": "If the input list is empty, there are no amounts to multiply, so the result is empty too.",
    "runtime": "python",
    "lesson": "python-08"
  },
  {
    "source": "No append or assignment targets the original list, so it stays unchanged.",
    "simple": "The code never appends to or replaces items in the original list. That is why the original stays the same.",
    "runtime": "python",
    "lesson": "python-08"
  },
  {
    "source": "The function receives arguments in order: first the amount list, then the factor.",
    "simple": "Give the function the list of amounts first and the multiplying factor second.",
    "runtime": "python",
    "lesson": "python-08"
  },
  {
    "source": "In scale_recipe([2, 3], 2), the two multiplications are 2 times 2 and 3 times 2, producing [4, 6].",
    "simple": "In scale_recipe([2, 3], 2), multiply 2 by 2 and 3 by 2. The new list is [4, 6].",
    "runtime": "python",
    "lesson": "python-08"
  },
  {
    "source": "Doubling means factor 2, halving means factor 0.5.",
    "simple": "To make twice as much, use factor 2. To make half as much, use factor 0.5.",
    "runtime": "python",
    "lesson": "python-08"
  },
  {
    "source": "The project inputs [2, 1.5, 3] doubled give [4, 3.0, 6].",
    "simple": "Multiplying every amount in [2, 1.5, 3] by 2 gives [4, 3.0, 6].",
    "runtime": "python",
    "lesson": "python-08"
  },
  {
    "source": "The 3.0 reflects multiplying a float, 1.5, by two.",
    "simple": "The result for 1.5 times 2 is written 3.0 because 1.5 is a decimal number, called a float.",
    "runtime": "python",
    "lesson": "python-08"
  },
  {
    "source": "Write the required function using its parameters so changed inputs work too.",
    "simple": "Use the input names inside the function so it can work when you give it different amounts or a different factor.",
    "runtime": "python",
    "lesson": "python-08"
  },
  {
    "source": "Keep the original amounts intact and return the newly calculated list.",
    "simple": "Leave the input list as it was, and send back a separate list of the answers you calculated.",
    "runtime": "python",
    "lesson": "python-08"
  },
  {
    "source": "This matters when the original recipe is still needed after you make a scaled version.",
    "simple": "You may need the original recipe later, even after making a larger or smaller version.",
    "runtime": "python",
    "lesson": "python-08"
  },
  {
    "source": "Check a normal call and print the original afterward.",
    "simple": "Try an ordinary input, then print the original list to check that it has not changed.",
    "runtime": "python",
    "lesson": "python-08"
  },
  {
    "source": "Returning one fixed list or changing original entries in place would miss the reusable behavior this exercise asks for.",
    "simple": "Always returning the same list would ignore new inputs. Changing items in the original would lose the old recipe; neither meets this exercise's goal.",
    "runtime": "python",
    "lesson": "python-08"
  },
  {
    "source": "Different collections fit different jobs.",
    "simple": "Choose how to group your values based on what you need to do with them.",
    "runtime": "python",
    "lesson": "python-09"
  },
  {
    "source": "A tuple holds ordered values that cannot be replaced through tuple indexes.",
    "simple": "A tuple keeps items in order, but you cannot replace an item by assigning to one of its positions.",
    "runtime": "python",
    "lesson": "python-09"
  },
  {
    "source": "A dictionary connects keys to values so you can look up details by name.",
    "simple": "A dictionary stores pairs of labels and values. The labels are called keys, and each key lets you find its value.",
    "runtime": "python",
    "lesson": "python-09"
  },
  {
    "source": "A set keeps unique members without a meaningful position order.",
    "simple": "A set keeps one of each different item. Its items do not have meaningful first, second, or third positions.",
    "runtime": "python",
    "lesson": "python-09"
  },
  {
    "source": "The right choice depends on whether you need a fixed sequence, named fields, or uniqueness.",
    "simple": "Use the kind that fits your job: fixed positions, named details, or no repeated items.",
    "runtime": "python",
    "lesson": "python-09"
  },
  {
    "source": "A tuple often uses parentheses, such as `(7, 2)`, with commas between values.",
    "simple": "You often write a tuple with parentheses and commas, like `(7, 2)`.",
    "runtime": "python",
    "lesson": "python-09"
  },
  {
    "source": "Its first position is index 0.",
    "simple": "The first item in a tuple is at position 0.",
    "runtime": "python",
    "lesson": "python-09"
  },
  {
    "source": "A one-item tuple needs a trailing comma, `(7,)`;",
    "simple": "For a tuple with just one item, keep a comma after it: `(7,)`.",
    "runtime": "python",
    "lesson": "python-09"
  },
  {
    "source": "parentheses alone around 7 do not make a tuple.",
    "simple": "Writing `(7)` only puts parentheses around the number; it does not create a tuple.",
    "runtime": "python",
    "lesson": "python-09"
  },
  {
    "source": "You cannot assign a new value to point[0].",
    "simple": "Because point is a tuple here, you cannot replace its first item by assigning to point[0].",
    "runtime": "python",
    "lesson": "python-09"
  },
  {
    "source": "A tuple name can still be reassigned to a different tuple, and a nested mutable value can still change;",
    "simple": "You can make the name refer to a different tuple. Also, if a tuple contains something changeable, like a list, that inner thing can still change.",
    "runtime": "python",
    "lesson": "python-09"
  },
  {
    "source": "the coordinate tuple here contains only numbers.",
    "simple": "This coordinate pair contains only numbers, not an inner list or another changeable object.",
    "runtime": "python",
    "lesson": "python-09"
  },
  {
    "source": "A dictionary uses braces with a colon between each key and value.",
    "simple": "Write a dictionary inside braces. Put a colon between each key, or label, and its value.",
    "runtime": "python",
    "lesson": "python-09"
  },
  {
    "source": "This prints 7, Garden Log, and 2019.",
    "simple": "The example shows 7 on one line, Garden Log on the next, and 2019 on the last.",
    "runtime": "python",
    "lesson": "python-09"
  },
  {
    "source": "Brackets with a number read a tuple position.",
    "simple": "For a tuple, a number inside square brackets chooses an item's position.",
    "runtime": "python",
    "lesson": "python-09"
  },
  {
    "source": "Brackets with a string key read a dictionary field.",
    "simple": "For this dictionary, text inside square brackets chooses the value stored under that key.",
    "runtime": "python",
    "lesson": "python-09"
  },
  {
    "source": "Dictionary entries can be updated;",
    "simple": "You can replace a value stored under a dictionary key.",
    "runtime": "python",
    "lesson": "python-09"
  },
  {
    "source": "changing the year does not replace the title.",
    "simple": "Updating the year entry leaves the title entry alone.",
    "runtime": "python",
    "lesson": "python-09"
  },
  {
    "source": "A set also uses braces, but its entries do not have key/value colons.",
    "simple": "A set uses braces too, but its items are written on their own, without key-and-value pairs separated by colons.",
    "runtime": "python",
    "lesson": "python-09"
  },
  {
    "source": "`{\"nature\", \"art\", \"nature\"}` keeps only one nature entry.",
    "simple": "In `{\"nature\", \"art\", \"nature\"}`, nature appears twice in the code but is kept only once in the set.",
    "runtime": "python",
    "lesson": "python-09"
  },
  {
    "source": "`len(tags)` counts distinct members.",
    "simple": "`len(tags)` tells you how many different tags there are, counting each tag once.",
    "runtime": "python",
    "lesson": "python-09"
  },
  {
    "source": "Sets do not supply ordered indexes, so do not use tags[0].",
    "simple": "A set has no numbered first item to read. Using tags[0] does not work.",
    "runtime": "python",
    "lesson": "python-09"
  },
  {
    "source": "An empty set is `set()` because empty braces `{}` create a dictionary.",
    "simple": "Write `set()` to make an empty set. Writing `{}` makes an empty dictionary instead.",
    "runtime": "python",
    "lesson": "python-09"
  },
  {
    "source": "Choose a list when order and duplicates matter.",
    "simple": "Use a list if you need to keep a specific order and keep repeated items.",
    "runtime": "python",
    "lesson": "python-09"
  },
  {
    "source": "This complete example demonstrates uniqueness and shared members.",
    "simple": "This full example shows both how sets remove repeats and how to find items two sets share.",
    "runtime": "python",
    "lesson": "python-09"
  },
  {
    "source": "It prints 2, True, 1, and True.",
    "simple": "The four printed answers are 2, True, 1, and True, in that order.",
    "runtime": "python",
    "lesson": "python-09"
  },
  {
    "source": "The in comparison asks whether a member belongs to a collection.",
    "simple": "Use in to ask whether a particular item is in the group.",
    "runtime": "python",
    "lesson": "python-09"
  },
  {
    "source": "The ampersand `&` finds the intersection: members present in both sets.",
    "simple": "`&` makes a set of the items found in both sets. That shared part is called the intersection.",
    "runtime": "python",
    "lesson": "python-09"
  },
  {
    "source": "No output relies on which order a set happens to display.",
    "simple": "These checks work no matter what order Python happens to show the set's items in.",
    "runtime": "python",
    "lesson": "python-09"
  },
  {
    "source": "The math question gives red and blue in one set and blue and green in the other.",
    "simple": "The math example has red and blue in the first set, and blue and green in the second.",
    "runtime": "python",
    "lesson": "python-09"
  },
  {
    "source": "Blue is the only shared member, so the intersection size is 1.",
    "simple": "Only blue is in both groups, so the shared set has one item.",
    "runtime": "python",
    "lesson": "python-09"
  },
  {
    "source": "The same uniqueness idea removes a duplicate tag in your project.",
    "simple": "Your project uses a set for the same reason: a repeated tag should only appear once.",
    "runtime": "python",
    "lesson": "python-09"
  },
  {
    "source": "A tuple's ordered pair is useful for coordinates;",
    "simple": "Coordinates work well as a tuple because the two numbers need a fixed order.",
    "runtime": "python",
    "lesson": "python-09"
  },
  {
    "source": "a dictionary's keys are useful for title and year;",
    "simple": "A dictionary works well for details you want to find by name, like title and year.",
    "runtime": "python",
    "lesson": "python-09"
  },
  {
    "source": "a set's distinct membership is useful for tags.",
    "simple": "A set works well for tags because it keeps just one of each tag.",
    "runtime": "python",
    "lesson": "python-09"
  },
  {
    "source": "Your supplied coordinates are (4, 9), the dictionary's title is Cloud Atlas, and repeated mystery tags should count once alongside travel.",
    "simple": "Use (4, 9) for the coordinates and \"Cloud Atlas\" for the dictionary's title. The tags mystery and travel are different; repeated mystery tags count just once.",
    "runtime": "python",
    "lesson": "python-09"
  },
  {
    "source": "That gives two distinct tags.",
    "simple": "That leaves two different tags: mystery and travel.",
    "runtime": "python",
    "lesson": "python-09"
  },
  {
    "source": "Read the title using its key and use len to check the set's size.",
    "simple": "Look up the title by its key. Use len to count the tags in the set.",
    "runtime": "python",
    "lesson": "python-09"
  },
  {
    "source": "The quiz asks which structure removes duplicate tags: the set.",
    "simple": "For the quiz, choose a set: it keeps only one copy of a repeated tag.",
    "runtime": "python",
    "lesson": "python-09"
  },
  {
    "source": "Do not turn it into a list just to depend on a displayed order;",
    "simple": "Do not convert the set to a list just to rely on whatever order appeared on screen.",
    "runtime": "python",
    "lesson": "python-09"
  },
  {
    "source": "uniqueness, not ordering, is the behavior this project needs.",
    "simple": "This project needs repeated tags removed. It does not need the tags put in a particular order.",
    "runtime": "python",
    "lesson": "python-09"
  },
  {
    "source": "A list comprehension builds a new list by visiting input values and calculating selected results.",
    "simple": "A list comprehension goes through input items and builds a new list from the results you choose.",
    "runtime": "python",
    "lesson": "python-10"
  },
  {
    "source": "Its general shape is `[expression for item in collection if condition]`.",
    "simple": "The pattern is `[expression for item in collection if condition]`: what to put in the new list, where items come from, and which ones pass a check.",
    "runtime": "python",
    "lesson": "python-10"
  },
  {
    "source": "Read the for/in part first to identify the input values, the optional if part to decide which values to keep, and the expression to decide what goes into the new list.",
    "simple": "Read for/in to find the input items. If there is an if part, it says which items pass; the expression says what to put in the answer list.",
    "runtime": "python",
    "lesson": "python-10"
  },
  {
    "source": "The original list is not changed by simply reading its values.",
    "simple": "Looking at the original list's items does not by itself change that list.",
    "runtime": "python",
    "lesson": "python-10"
  },
  {
    "source": "The remainder sign `%` helps check evenness.",
    "simple": "The `%` symbol finds a division remainder, which lets you check whether a number is even.",
    "runtime": "python",
    "lesson": "python-10"
  },
  {
    "source": "`n % 2` gives the remainder after dividing n by 2.",
    "simple": "`n % 2` tells you what is left over when n is divided by 2.",
    "runtime": "python",
    "lesson": "python-10"
  },
  {
    "source": "An even whole number has remainder zero, so `n % 2 == 0` asks whether n is even.",
    "simple": "An even integer, such as -4, 0, or 6, divides by 2 with nothing left over. So `n % 2 == 0` checks whether n is even.",
    "runtime": "python",
    "lesson": "python-10"
  },
  {
    "source": "`==` compares;",
    "simple": "Use `==` to check whether two values are equal.",
    "runtime": "python",
    "lesson": "python-10"
  },
  {
    "source": "`=` assigns.",
    "simple": "Use `=` to save a value under a name.",
    "runtime": "python",
    "lesson": "python-10"
  },
  {
    "source": "A second condition `n > 5` asks whether it is greater than the boundary.",
    "simple": "`n > 5` checks whether the number is larger than 5.",
    "runtime": "python",
    "lesson": "python-10"
  },
  {
    "source": "`and` requires both conditions to be true.",
    "simple": "With and, both checks must pass for the whole check to give True.",
    "runtime": "python",
    "lesson": "python-10"
  },
  {
    "source": "This complete example filters without changing the values it keeps.",
    "simple": "This complete example chooses numbers but leaves each chosen number's value as it was.",
    "runtime": "python",
    "lesson": "python-10"
  },
  {
    "source": "It prints `[10, 12]` and `[1, 4, 7, 10, 12]`.",
    "simple": "The new list prints as `[10, 12]`, and the unchanged original prints as `[1, 4, 7, 10, 12]`.",
    "runtime": "python",
    "lesson": "python-10"
  },
  {
    "source": "Four is even but fails the greater-than test;",
    "simple": "4 divides evenly by 2, but it is not greater than 5, so it is rejected.",
    "runtime": "python",
    "lesson": "python-10"
  },
  {
    "source": "seven passes the boundary but fails evenness.",
    "simple": "7 is greater than 5, but it is odd, so it is rejected too.",
    "runtime": "python",
    "lesson": "python-10"
  },
  {
    "source": "Ten and twelve pass both.",
    "simple": "10 and 12 are both even and greater than 5, so they are kept.",
    "runtime": "python",
    "lesson": "python-10"
  },
  {
    "source": "The initial n in the comprehension puts the kept number itself into the result.",
    "simple": "The n at the start means “put this number itself into the new list.”",
    "runtime": "python",
    "lesson": "python-10"
  },
  {
    "source": "The equivalent longer loop makes the selection steps visible.",
    "simple": "The longer loop below does the same job, but puts the choosing steps on separate lines.",
    "runtime": "python",
    "lesson": "python-10"
  },
  {
    "source": "This also prints `[10, 12]`.",
    "simple": "The longer version produces the same list: `[10, 12]`.",
    "runtime": "python",
    "lesson": "python-10"
  },
  {
    "source": "The if block is indented inside the loop, and append is indented inside the condition.",
    "simple": "Move if to the right under for. Move append one more level to the right under if, so it only adds numbers that pass.",
    "runtime": "python",
    "lesson": "python-10"
  },
  {
    "source": "A comprehension is still a loop;",
    "simple": "A list comprehension still goes through items one at a time, like a loop.",
    "runtime": "python",
    "lesson": "python-10"
  },
  {
    "source": "it merely expresses these particular steps compactly.",
    "simple": "It just writes this particular list-building job using fewer lines.",
    "runtime": "python",
    "lesson": "python-10"
  },
  {
    "source": "Prefer a longer loop when several actions or conditions become hard to read together.",
    "simple": "Use a longer loop if putting many checks or actions together makes the short version difficult to understand.",
    "runtime": "python",
    "lesson": "python-10"
  },
  {
    "source": "The expression can transform a selected number.",
    "simple": "The calculation at the start can change the numbers that go into the answer list.",
    "runtime": "python",
    "lesson": "python-10"
  },
  {
    "source": "`[n * 3 for n in numbers if n > 5]` would multiply each qualifying number by three instead of keeping n itself.",
    "simple": "`[n * 3 for n in numbers if n > 5]` keeps numbers larger than 5 but puts three times each number in the new list, rather than the original number.",
    "runtime": "python",
    "lesson": "python-10"
  },
  {
    "source": "The filter checks the original n before deciding to include the expression's result.",
    "simple": "The if check uses the original number n. Only if it passes does its calculated result get included.",
    "runtime": "python",
    "lesson": "python-10"
  },
  {
    "source": "In your exercise, you need the original qualifying numbers, so the first expression should just be n.",
    "simple": "This exercise wants the numbers themselves, unchanged. Put just n at the start of the comprehension.",
    "runtime": "python",
    "lesson": "python-10"
  },
  {
    "source": "Check both conditions independently before joining them.",
    "simple": "Work out the answer to each check on its own before combining them with and.",
    "runtime": "python",
    "lesson": "python-10"
  },
  {
    "source": "For 4, the even question is True and the greater-than-5 question is False, so and is False.",
    "simple": "For 4, “even?” gives True and “greater than 5?” gives False. Since both must pass, the combined answer is False.",
    "runtime": "python",
    "lesson": "python-10"
  },
  {
    "source": "For 6, both are True.",
    "simple": "For 6, “even?” and “greater than 5?” both give True.",
    "runtime": "python",
    "lesson": "python-10"
  },
  {
    "source": "For 7, evenness is False.",
    "simple": "For 7, the “even?” check gives False.",
    "runtime": "python",
    "lesson": "python-10"
  },
  {
    "source": "The strict boundary excludes 5 itself.",
    "simple": "A number must be greater than 5, so 5 itself is not allowed.",
    "runtime": "python",
    "lesson": "python-10"
  },
  {
    "source": "This is the math skill the quiz tests: an entry must satisfy every stated condition, not just one of them.",
    "simple": "The quiz checks whether you can test all the requirements. Passing just one of them is not enough.",
    "runtime": "python",
    "lesson": "python-10"
  },
  {
    "source": "The supplied list is [2, 4, 5, 6, 8, 9].",
    "simple": "Start with these input numbers: [2, 4, 5, 6, 8, 9].",
    "runtime": "python",
    "lesson": "python-10"
  },
  {
    "source": "Its qualifying entries are 6 and 8, producing [6, 8] in their original order.",
    "simple": "Only 6 and 8 pass both checks. The result is [6, 8], keeping their original order.",
    "runtime": "python",
    "lesson": "python-10"
  },
  {
    "source": "The input list should remain unchanged.",
    "simple": "Do not alter the numbers or their order in the input list.",
    "runtime": "python",
    "lesson": "python-10"
  },
  {
    "source": "Try explaining why each rejected value fails: two and four are too small, five is odd and at the boundary, and nine is odd.",
    "simple": "Explain each rejected number: 2 and 4 are below the limit, 5 is odd and exactly at the excluded limit, and 9 is odd.",
    "runtime": "python",
    "lesson": "python-10"
  },
  {
    "source": "A new filtered list has its own outer structure, so the source remains available for other uses.",
    "simple": "The answer list is a separate list, so you can still use the unchanged original list for another job.",
    "runtime": "python",
    "lesson": "python-10"
  },
  {
    "source": "A class describes objects that share the same kinds of data and actions.",
    "simple": "A class is a plan for making objects with the same kinds of stored information and available actions.",
    "runtime": "python",
    "lesson": "python-11"
  },
  {
    "source": "An object created from the class is an instance.",
    "simple": "Each object made from that plan is called an instance of the class.",
    "runtime": "python",
    "lesson": "python-11"
  },
  {
    "source": "A reading-session instance should hold its own title and minutes.",
    "simple": "Each reading session needs its own saved title and number of minutes.",
    "runtime": "python",
    "lesson": "python-11"
  },
  {
    "source": "A method is a function defined inside a class that works with an instance.",
    "simple": "A method is a function written inside a class. It can use or change one of the objects made from that class.",
    "runtime": "python",
    "lesson": "python-11"
  },
  {
    "source": "Creating two sessions should create two independent sets of these values.",
    "simple": "If you make two reading sessions, each should keep its own title and minutes separately.",
    "runtime": "python",
    "lesson": "python-11"
  },
  {
    "source": "`class ReadingSession:` starts the class block.",
    "simple": "Write `class ReadingSession:` to begin defining the ReadingSession class.",
    "runtime": "python",
    "lesson": "python-11"
  },
  {
    "source": "The method `__init__` runs when an instance is created, letting you initialize its fields.",
    "simple": "When you make an object, `__init__` sets up its starting information, such as its title and minutes.",
    "runtime": "python",
    "lesson": "python-11"
  },
  {
    "source": "The double underscores are part of this special method's exact name.",
    "simple": "Keep both underscores before and after init. They are required parts of the name `__init__`.",
    "runtime": "python",
    "lesson": "python-11"
  },
  {
    "source": "Its first parameter, conventionally called self, receives the instance.",
    "simple": "The first input name is usually self. Python uses it to give the method the particular object it is working on.",
    "runtime": "python",
    "lesson": "python-11"
  },
  {
    "source": "`self.minutes = minutes` assigns the supplied minutes to that instance's field.",
    "simple": "`self.minutes = minutes` saves the incoming minutes value on this particular reading-session object.",
    "runtime": "python",
    "lesson": "python-11"
  },
  {
    "source": "The parameter minutes and the field self.minutes are related but different names.",
    "simple": "minutes names the value coming into the function. self.minutes names the value saved on the object.",
    "runtime": "python",
    "lesson": "python-11"
  },
  {
    "source": "Here is a complete class with independent instances.",
    "simple": "This full example makes two session objects that each keep their own information.",
    "runtime": "python",
    "lesson": "python-11"
  },
  {
    "source": "It prints 23 and 25.",
    "simple": "The first session prints 23 minutes, and the second prints 25.",
    "runtime": "python",
    "lesson": "python-11"
  },
  {
    "source": "Session(...) creates an instance and runs its initializer.",
    "simple": "Using Session(...) makes a new session object and runs its setup method.",
    "runtime": "python",
    "lesson": "python-11"
  },
  {
    "source": "Calling first.add_minutes(8) supplies first as self automatically and 8 as amount.",
    "simple": "In first.add_minutes(8), Python automatically uses first for self. The value 8 becomes amount.",
    "runtime": "python",
    "lesson": "python-11"
  },
  {
    "source": "The expression `self.minutes += amount` means read the current minutes, add amount, and assign the result back.",
    "simple": "`self.minutes += amount` takes this session's saved minutes, adds amount, and saves the new total in the same place.",
    "runtime": "python",
    "lesson": "python-11"
  },
  {
    "source": "It is a short form of `self.minutes = self.minutes + amount`.",
    "simple": "For these numbers, `self.minutes += amount` does the same job as `self.minutes = self.minutes + amount`.",
    "runtime": "python",
    "lesson": "python-11"
  },
  {
    "source": "The dot selects an instance field or method.",
    "simple": "The dot lets you choose information or an action belonging to that object.",
    "runtime": "python",
    "lesson": "python-11"
  },
  {
    "source": "The method changes state;",
    "simple": "This method updates the object's saved information, called its state.",
    "runtime": "python",
    "lesson": "python-11"
  },
  {
    "source": "it need not return a number.",
    "simple": "It does not have to send back a number because the new total is already saved on the object.",
    "runtime": "python",
    "lesson": "python-11"
  },
  {
    "source": "To inspect the saved duration, read first.minutes after the call.",
    "simple": "After running the method, read first.minutes to see the first session's saved total.",
    "runtime": "python",
    "lesson": "python-11"
  },
  {
    "source": "A second independently runnable example changes both sessions.",
    "simple": "You can run this next complete example on its own. It adds time to each of the two sessions.",
    "runtime": "python",
    "lesson": "python-11"
  },
  {
    "source": "The lines are `Nature 23` and `Art 29`.",
    "simple": "It prints `Nature 23` first and `Art 29` second.",
    "runtime": "python",
    "lesson": "python-11"
  },
  {
    "source": "Each method call reads and updates only the instance receiving that call.",
    "simple": "A call on first changes first's minutes; a call on second changes second's minutes. Each call uses only its own session.",
    "runtime": "python",
    "lesson": "python-11"
  },
  {
    "source": "Put per-session changing data on self.",
    "simple": "Save values that belong to each session using self, so each object can keep its own version.",
    "runtime": "python",
    "lesson": "python-11"
  },
  {
    "source": "A value assigned directly in the class body is a class attribute and is shared through the class;",
    "simple": "A value written directly inside the class, outside its methods, belongs to the class itself. Objects can share that class-level value.",
    "runtime": "python",
    "lesson": "python-11"
  },
  {
    "source": "using a shared mutable list for session data can make sessions interfere.",
    "simple": "If sessions use the same changeable list from the class, changing it for one session can affect the others.",
    "runtime": "python",
    "lesson": "python-11"
  },
  {
    "source": "The initializer fields here hold the specific instance's title and minutes.",
    "simple": "Here, __init__ saves title and minutes on each individual session object.",
    "runtime": "python",
    "lesson": "python-11"
  },
  {
    "source": "Python uses indentation to separate class, method, and method-body levels, so preserve every level when typing or copying.",
    "simple": "Keep the spaces at the start of every line. Python uses them to tell the class, its methods, and the instructions inside each method apart.",
    "runtime": "python",
    "lesson": "python-11"
  },
  {
    "source": "Your required class is ReadingSession.",
    "simple": "Name the class ReadingSession exactly as required.",
    "runtime": "python",
    "lesson": "python-11"
  },
  {
    "source": "Poetry starts at 20 and receives 10 more minutes, reaching 30;",
    "simple": "The Poetry session begins with 20 minutes. Adding 10 makes its total 30.",
    "runtime": "python",
    "lesson": "python-11"
  },
  {
    "source": "History stays at 35.",
    "simple": "The History session is not changed, so it keeps its 35 minutes.",
    "runtime": "python",
    "lesson": "python-11"
  },
  {
    "source": "In first.add_minutes(10), self.minutes means the first instance's minutes.",
    "simple": "When you call first.add_minutes(10), self.minutes is the number of minutes saved on first, not on another session.",
    "runtime": "python",
    "lesson": "python-11"
  },
  {
    "source": "The matching math asks for the amount added between 25 and 40: subtract 25 from 40 to get 15.",
    "simple": "To find how much was added from 25 minutes to 40 minutes, calculate 40 minus 25. The answer is 15 minutes.",
    "runtime": "python",
    "lesson": "python-11"
  },
  {
    "source": "Use addition to update duration and subtraction to find a change between two known totals.",
    "simple": "Add when updating the saved minutes. Subtract the old total from the new one when finding how much the total changed.",
    "runtime": "python",
    "lesson": "python-11"
  },
  {
    "source": "Objects can offer the same action while performing it differently.",
    "simple": "Different objects can respond to the same request in different ways.",
    "runtime": "python",
    "lesson": "python-12"
  },
  {
    "source": "An interface is the set of actions a caller expects an object to support.",
    "simple": "An interface is a list of actions that code expects an object to be able to do.",
    "runtime": "python",
    "lesson": "python-12"
  },
  {
    "source": "If two delivery objects both have a process method, a single function can call that method without needing to know which kind of delivery it received.",
    "simple": "If both delivery objects offer process, one function can ask either one to process its parcel. The function does not need to check which kind of delivery it has.",
    "runtime": "python",
    "lesson": "python-12"
  },
  {
    "source": "The object's own method supplies its specific behavior.",
    "simple": "Each object's own process method decides what happens for that kind of delivery.",
    "runtime": "python",
    "lesson": "python-12"
  },
  {
    "source": "This style is often called duck typing: code cares whether the needed method exists, rather than requiring one particular class name or parent class.",
    "simple": "Duck typing means checking what an object can do, not insisting it comes from one specific class or shares a parent class with another object.",
    "runtime": "python",
    "lesson": "python-12"
  },
  {
    "source": "A class defines methods;",
    "simple": "A class contains the definitions of its actions, called methods.",
    "runtime": "python",
    "lesson": "python-12"
  },
  {
    "source": "an instance is an object created by calling the class.",
    "simple": "Calling a class makes an object, also called an instance of that class.",
    "runtime": "python",
    "lesson": "python-12"
  },
  {
    "source": "A method's first parameter self receives that instance automatically.",
    "simple": "When you call an object's method, Python automatically gives that object to the first parameter, self.",
    "runtime": "python",
    "lesson": "python-12"
  },
  {
    "source": "A shared name does not mean the methods must return the same message.",
    "simple": "Two methods can have the same name but send back different messages.",
    "runtime": "python",
    "lesson": "python-12"
  },
  {
    "source": "Here is a complete example using two message senders.",
    "simple": "This full example has two objects that send different notices.",
    "runtime": "python",
    "lesson": "python-12"
  },
  {
    "source": "It prints `Ring a bell` and `Flash a light`.",
    "simple": "The printed messages are `Ring a bell`, then `Flash a light`.",
    "runtime": "python",
    "lesson": "python-12"
  },
  {
    "source": "Send_notice calls the same method name for either instance.",
    "simple": "The function send_notice calls announce for either object it receives.",
    "runtime": "python",
    "lesson": "python-12"
  },
  {
    "source": "The object determines which definition runs.",
    "simple": "A BellNotice object uses its version of announce; a LightNotice object uses its own version.",
    "runtime": "python",
    "lesson": "python-12"
  },
  {
    "source": "Follow the returned value through the call.",
    "simple": "Track how the answer moves back from the method to the function and then to print.",
    "runtime": "python",
    "lesson": "python-12"
  },
  {
    "source": "The outer function receives an object in its parameter.",
    "simple": "The send_notice function gets an object through its input name, notice.",
    "runtime": "python",
    "lesson": "python-12"
  },
  {
    "source": "A dot selects its method, and the empty parentheses call that method.",
    "simple": "In notice.announce(), the dot finds announce on that object, and () runs it.",
    "runtime": "python",
    "lesson": "python-12"
  },
  {
    "source": "The method returns a string.",
    "simple": "The announce method sends back a piece of text.",
    "runtime": "python",
    "lesson": "python-12"
  },
  {
    "source": "The outer function returns that string to its own caller.",
    "simple": "Then send_notice passes that same text back to the code that called it.",
    "runtime": "python",
    "lesson": "python-12"
  },
  {
    "source": "Finally print displays it.",
    "simple": "At the end, print shows the text on screen.",
    "runtime": "python",
    "lesson": "python-12"
  },
  {
    "source": "Merely calling announce without returning its result from send_notice would make send_notice return None instead.",
    "simple": "If send_notice only ran announce but did not return its answer, send_notice would give back None, not the message.",
    "runtime": "python",
    "lesson": "python-12"
  },
  {
    "source": "A missing method fails the interface requirement.",
    "simple": "An object without the required method cannot carry out the expected request.",
    "runtime": "python",
    "lesson": "python-12"
  },
  {
    "source": "The outputs are `Ring a bell` and the missing-method message.",
    "simple": "This example prints `Ring a bell`, then `This object has no announce method`.",
    "runtime": "python",
    "lesson": "python-12"
  },
  {
    "source": "Pass is a placeholder statement for an otherwise empty class body.",
    "simple": "Use pass to leave a class body empty for now while still giving Python a valid instruction.",
    "runtime": "python",
    "lesson": "python-12"
  },
  {
    "source": "The try/except catches this specific expected AttributeError so this demonstration can finish.",
    "simple": "The try/except handles the expected AttributeError, which happens because announce is missing. That lets the demonstration finish instead of stopping at that error.",
    "runtime": "python",
    "lesson": "python-12"
  },
  {
    "source": "The exercise's BikeDelivery and LockerDelivery each provide process(self).",
    "simple": "Both BikeDelivery and LockerDelivery must define a method written as process(self).",
    "runtime": "python",
    "lesson": "python-12"
  },
  {
    "source": "BikeDelivery returns \"Rider takes parcel\";",
    "simple": "The BikeDelivery version sends back \"Rider takes parcel\".",
    "runtime": "python",
    "lesson": "python-12"
  },
  {
    "source": "LockerDelivery returns \"Parcel goes to locker\".",
    "simple": "The LockerDelivery version sends back \"Parcel goes to locker\".",
    "runtime": "python",
    "lesson": "python-12"
  },
  {
    "source": "Process_delivery(item) should call and return item.process().",
    "simple": "In process_delivery(item), run item.process() and return the answer it gives you.",
    "runtime": "python",
    "lesson": "python-12"
  },
  {
    "source": "No common parent class is needed for that interface.",
    "simple": "These classes do not need to inherit from the same parent class. They just need to offer the required method.",
    "runtime": "python",
    "lesson": "python-12"
  },
  {
    "source": "This is one form of polymorphism: one calling operation can produce different appropriate behavior depending on the object.",
    "simple": "This is called polymorphism: the same request can do the right thing in different ways depending on which object receives it.",
    "runtime": "python",
    "lesson": "python-12"
  },
  {
    "source": "Keep each class's details inside its own method and let the shared function use the interface.",
    "simple": "Put each delivery type's own instructions in its method. Let the shared function simply call the method it expects.",
    "runtime": "python",
    "lesson": "python-12"
  },
  {
    "source": "Test both instances to verify their distinct returned messages.",
    "simple": "Try one object of each type and check that each returns its own correct message.",
    "runtime": "python",
    "lesson": "python-12"
  },
  {
    "source": "The matching math question is separate: an inclusive range from 0 through 10 includes both endpoints, so 10 is valid.",
    "simple": "The separate math question allows every value from 0 through 10, including 0 and 10. So 10 is allowed.",
    "runtime": "python",
    "lesson": "python-12"
  },
  {
    "source": "Inclusive means boundary values count;",
    "simple": "Inclusive means the values exactly at the limits are allowed too.",
    "runtime": "python",
    "lesson": "python-12"
  },
  {
    "source": "this is a useful word whenever an object's behavior later depends on allowed numeric limits.",
    "simple": "Remember this word when you later write objects that check whether numbers fall within allowed limits.",
    "runtime": "python",
    "lesson": "python-12"
  }
];
