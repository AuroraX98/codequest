// Reviewed TypeScript counterparts.
export default [
  {
    "source": "TypeScript is JavaScript with extra descriptions of the kinds of values your code expects.",
    "simple": "TypeScript adds descriptions of expected values to JavaScript, such as “this should be a number.”",
    "runtime": "typescript",
    "lesson": "typescript-01"
  },
  {
    "source": "A compiler checks those descriptions before producing JavaScript to run. number describes numbers such as 14;",
    "simple": "The compiler checks those descriptions, then makes JavaScript to run. `number` means values like 14.",
    "runtime": "typescript",
    "lesson": "typescript-01"
  },
  {
    "source": "string describes text such as '14';",
    "simple": "`string` means text, such as `'14'`.",
    "runtime": "typescript",
    "lesson": "typescript-01"
  },
  {
    "source": "boolean describes true or false.",
    "simple": "`boolean` means one of two values: `true` or `false`.",
    "runtime": "typescript",
    "lesson": "typescript-01"
  },
  {
    "source": "Quoted '14' is text even though it looks like a number.",
    "simple": "Quotes make `'14'` text, not the number 14.",
    "runtime": "typescript",
    "lesson": "typescript-01"
  },
  {
    "source": "These differences help catch mistakes before you see a broken screen.",
    "simple": "These descriptions can catch a wrong kind of value before it causes a visible problem.",
    "runtime": "typescript",
    "lesson": "typescript-01"
  },
  {
    "source": "For example, a numeric score that gains 5 points and then 2 more becomes 5 + 2 = 7.",
    "simple": "A numeric score that gains 5 points and then 2 points becomes 7.",
    "runtime": "typescript",
    "lesson": "typescript-01"
  },
  {
    "source": "Subtracting 2 from 5 gives 3;",
    "simple": "For subtraction, 5 minus 2 is 3.",
    "runtime": "typescript",
    "lesson": "typescript-01"
  },
  {
    "source": "multiplying 5 by 2 gives 10.",
    "simple": "For multiplication, 5 times 2 is 10.",
    "runtime": "typescript",
    "lesson": "typescript-01"
  },
  {
    "source": "JavaScript uses +, -, and * for those numeric operations.",
    "simple": "Use `+` to add, `-` to subtract, and `*` to multiply numbers in JavaScript.",
    "runtime": "typescript",
    "lesson": "typescript-01"
  },
  {
    "source": "Choosing number makes that arithmetic intention clear.",
    "simple": "Choosing the `number` type tells readers and TypeScript that you intend to calculate with the value.",
    "runtime": "typescript",
    "lesson": "typescript-01"
  },
  {
    "source": "This complete TypeScript example needs a TypeScript compiler or this lesson's TypeScript runner;",
    "simple": "Run this example with a TypeScript compiler or the lesson’s TypeScript runner.",
    "runtime": "typescript",
    "lesson": "typescript-01"
  },
  {
    "source": "ordinary JavaScript cannot read interface declarations.",
    "simple": "Plain JavaScript cannot directly read the extra TypeScript `interface` description.",
    "runtime": "typescript",
    "lesson": "typescript-01"
  },
  {
    "source": "The result is Ivy completed 4 laps.",
    "simple": "This example shows `Ivy completed 4 laps.`",
    "runtime": "typescript",
    "lesson": "typescript-01"
  },
  {
    "source": "An interface describes an object's fields: name must be text and laps must be a number.",
    "simple": "The interface says the object must have a text `name` and a numeric `laps` value.",
    "runtime": "typescript",
    "lesson": "typescript-01"
  },
  {
    "source": "It does not create the object itself.",
    "simple": "An interface describes the required object; it does not make an object for you.",
    "runtime": "typescript",
    "lesson": "typescript-01"
  },
  {
    "source": "Read the punctuation as instructions.",
    "simple": "The punctuation tells you how the parts of the code fit together.",
    "runtime": "typescript",
    "lesson": "typescript-01"
  },
  {
    "source": "The colon after a field gives its type;",
    "simple": "After a field’s colon comes the kind of value it should hold.",
    "runtime": "typescript",
    "lesson": "typescript-01"
  },
  {
    "source": "runner: Runner gives the parameter's type;",
    "simple": "`runner: Runner` says the function’s `runner` input must match `Runner`.",
    "runtime": "typescript",
    "lesson": "typescript-01"
  },
  {
    "source": "): string says the function returns text.",
    "simple": "`): string` says the function gives text back as its result.",
    "runtime": "typescript",
    "lesson": "typescript-01"
  },
  {
    "source": "Parentheses hold a function's inputs. return sends a result back to its caller. runner.name uses a dot to read a field.",
    "simple": "The parentheses list the function’s inputs. `return` gives its result back. In `runner.name`, the dot chooses the `name` field from `runner`.",
    "runtime": "typescript",
    "lesson": "typescript-01"
  },
  {
    "source": "Backticks start a template string, and ${...} inserts the value of the expression inside.",
    "simple": "Backticks mark a text template. Inside it, `${...}` is a place to work out a value and put it into the text.",
    "runtime": "typescript",
    "lesson": "typescript-01"
  },
  {
    "source": "Curly braces describe an object or enclose the function body, depending on their location.",
    "simple": "Curly braces can surround an object’s fields or a function’s instructions. Their location tells you which.",
    "runtime": "typescript",
    "lesson": "typescript-01"
  },
  {
    "source": "Add this second example after the first block:",
    "simple": "Place this second example below the first example’s code.",
    "runtime": "typescript",
    "lesson": "typescript-01"
  },
  {
    "source": "The outputs are Sol completed 9 laps. and number.",
    "simple": "The next example shows `Sol completed 9 laps.` and then `number`.",
    "runtime": "typescript",
    "lesson": "typescript-01"
  },
  {
    "source": "TypeScript infers another's field types from their values: inference means it works out a type without an explicit annotation.",
    "simple": "TypeScript can work out the types of `another` from the values you give it. This is called inference; you did not need to write the type labels yourself.",
    "runtime": "typescript",
    "lesson": "typescript-01"
  },
  {
    "source": "The function uses the supplied object, so it works for different runners rather than hard-coding Ivy's name.",
    "simple": "The function reads whichever runner object you give it, rather than always using Ivy.",
    "runtime": "typescript",
    "lesson": "typescript-01"
  },
  {
    "source": "An object with laps: '9' does not meet Runner because that value is text.",
    "simple": "`laps: '9'` does not fit `Runner` because the quoted 9 is text, not a number.",
    "runtime": "typescript",
    "lesson": "typescript-01"
  },
  {
    "source": "To practice type errors, temporarily change a numeric laps value to quoted text and run the full compiler check.",
    "simple": "To try a type mistake, change a laps number to quoted text and run the complete compiler check.",
    "runtime": "typescript",
    "lesson": "typescript-01"
  },
  {
    "source": "Expect a reported error, then restore the number.",
    "simple": "You should see an error. After checking it, put the number back.",
    "runtime": "typescript",
    "lesson": "typescript-01"
  },
  {
    "source": "A runtime test that checks the sentence is useful but does not establish that the compiler rejects incorrect types.",
    "simple": "A test of the finished sentence cannot prove that the compiler rejects a wrong type. Test those things separately.",
    "runtime": "typescript",
    "lesson": "typescript-01"
  },
  {
    "source": "In the exercise, Player has name: string and score: number. scoreSummary accepts a Player and must return a sentence in the form name has score points.",
    "simple": "For this project, `Player` requires a text `name` and numeric `score`. `scoreSummary` takes a Player and returns text in the form `name has score points.`",
    "runtime": "typescript",
    "lesson": "typescript-01"
  },
  {
    "source": "Include the final period and spaces.",
    "simple": "Keep the required spaces and the final period.",
    "runtime": "typescript",
    "lesson": "typescript-01"
  },
  {
    "source": "The player, summary, and function names connect to the supplied checks.",
    "simple": "The tests look for the supplied names of the player, summary, and function, so keep them.",
    "runtime": "typescript",
    "lesson": "typescript-01"
  },
  {
    "source": "Reading player.score gives the actual score, while the text 'player.score' would literally print those characters.",
    "simple": "`player.score` reads the player’s score. `'player.score'` is just those letters written as text.",
    "runtime": "typescript",
    "lesson": "typescript-01"
  },
  {
    "source": "Types disappear from the JavaScript that runs.",
    "simple": "The extra type descriptions are removed from the JavaScript that actually runs.",
    "runtime": "typescript",
    "lesson": "typescript-01"
  },
  {
    "source": "An interface cannot clean or validate a network response.",
    "simple": "An interface cannot check or repair data arriving over a network.",
    "runtime": "typescript",
    "lesson": "typescript-01"
  },
  {
    "source": "If unchecked outside data says score is '12', the runtime still receives text unless you check it.",
    "simple": "If outside data gives `score` as `'12'`, it is still text when the program runs unless your code checks it.",
    "runtime": "typescript",
    "lesson": "typescript-01"
  },
  {
    "source": "Keep compile-time checking and runtime validation distinct.",
    "simple": "The compiler’s type checks and your running program’s data checks have different jobs.",
    "runtime": "typescript",
    "lesson": "typescript-01"
  },
  {
    "source": "For this fixture the values are already supplied correctly, so concentrate on the typed function and formatting.",
    "simple": "This exercise supplies correctly typed values. Focus on the function’s types and the exact sentence format.",
    "runtime": "typescript",
    "lesson": "typescript-01"
  },
  {
    "source": "A type alias gives a reusable name to a type: type Size = 'small' | 'large'.",
    "simple": "A type alias names a type so you can reuse it. `type Size = 'small' | 'large'` names those two allowed choices `Size`.",
    "runtime": "typescript",
    "lesson": "typescript-02"
  },
  {
    "source": "The | means either choice, called a union.",
    "simple": "`|` means either choice is allowed. A type made from these alternatives is called a union.",
    "runtime": "typescript",
    "lesson": "typescript-02"
  },
  {
    "source": "The quoted values are literal types: exactly those words, rather than any string.",
    "simple": "These types allow exactly the quoted words, not any other text.",
    "runtime": "typescript",
    "lesson": "typescript-02"
  },
  {
    "source": "An intersection uses & to require both sets of fields.",
    "simple": "`&` combines requirements: the object must have the fields required by both types.",
    "runtime": "typescript",
    "lesson": "typescript-02"
  },
  {
    "source": "An interface also describes an object shape.",
    "simple": "An interface is another way to describe the fields an object should have.",
    "runtime": "typescript",
    "lesson": "typescript-02"
  },
  {
    "source": "These tools let us describe related records without losing their differences.",
    "simple": "These descriptions let related records share some fields while still having their own differences.",
    "runtime": "typescript",
    "lesson": "typescript-02"
  },
  {
    "source": "Here is a complete TypeScript example for a TypeScript runner:",
    "simple": "The following is a whole example to run with TypeScript.",
    "runtime": "typescript",
    "lesson": "typescript-02"
  },
  {
    "source": "Each record needs Timed's title and minutes plus its own kind and detail. & combines requirements;",
    "simple": "Each record must have `Timed`’s title and minutes, plus its own kind and extra detail. `&` requires both sets of fields.",
    "runtime": "typescript",
    "lesson": "typescript-02"
  },
  {
    "source": "it does not merge two runtime objects. | says a Session is one of the two valid shapes.",
    "simple": "`&` does not join actual objects while the program runs. Here, `|` says a Session must fit either of the two allowed shapes.",
    "runtime": "typescript",
    "lesson": "typescript-02"
  },
  {
    "source": "The shared kind field tells us which shape we have.",
    "simple": "The shared `kind` field tells you which kind of session the record describes.",
    "runtime": "typescript",
    "lesson": "typescript-02"
  },
  {
    "source": "A discriminated union is a union whose members carry distinct identifying literal values.",
    "simple": "A discriminated union gives each choice a different identifying value, like a different word in `kind`.",
    "runtime": "typescript",
    "lesson": "typescript-02"
  },
  {
    "source": "Narrowing means a check gives TypeScript a more specific type for one part of the code.",
    "simple": "Narrowing means a check lets TypeScript know more precisely which kind of value you have in that part of the code.",
    "runtime": "typescript",
    "lesson": "typescript-02"
  },
  {
    "source": "Checking session.kind === 'draw' proves that this branch has pictures.",
    "simple": "When `session.kind === 'draw'` is true, this is the drawing shape, which has `pictures`.",
    "runtime": "typescript",
    "lesson": "typescript-02"
  },
  {
    "source": "In the other branch, the only remaining member is Singing, with songs.",
    "simple": "Otherwise, the remaining shape is `Singing`, which has `songs`.",
    "runtime": "typescript",
    "lesson": "typescript-02"
  },
  {
    "source": "Continue after the previous types and objects:",
    "simple": "Add the next code after the types and objects you just created.",
    "runtime": "typescript",
    "lesson": "typescript-02"
  },
  {
    "source": "The outputs are Birds: 3 pictures. and Warmup: 2 songs. === tests exact equality.",
    "simple": "It shows `Birds: 3 pictures.` and `Warmup: 2 songs.`. The `===` check asks whether values are exactly equal.",
    "runtime": "typescript",
    "lesson": "typescript-02"
  },
  {
    "source": "The if branch returns early, so the second return is reached only for the singing shape.",
    "simple": "The drawing branch returns its result immediately. Only the singing shape can reach the later return.",
    "runtime": "typescript",
    "lesson": "typescript-02"
  },
  {
    "source": "Trying to read songs in the drawing branch is a type error.",
    "simple": "The drawing shape has no `songs` field, so TypeScript rejects trying to read it there.",
    "runtime": "typescript",
    "lesson": "typescript-02"
  },
  {
    "source": "A separate alias containing more words does not automatically add more shapes to a union.",
    "simple": "Adding words to a separate type alias does not automatically add object shapes to another union.",
    "runtime": "typescript",
    "lesson": "typescript-02"
  },
  {
    "source": "In your starter, ActivityKind includes walk, read, and code, but Activity contains only WalkActivity | ReadActivity.",
    "simple": "Your `ActivityKind` allows walk, read, or code. But `Activity` currently allows only a walking object or a reading object.",
    "runtime": "typescript",
    "lesson": "typescript-02"
  },
  {
    "source": "There is no CodeActivity in that union yet.",
    "simple": "No `CodeActivity` has been added to the `Activity` union.",
    "runtime": "typescript",
    "lesson": "typescript-02"
  },
  {
    "source": "Follow the actual accepted parameter type when deciding which branches describe is responsible for.",
    "simple": "Look at the input type that `describe` actually accepts to decide which cases the function must handle.",
    "runtime": "typescript",
    "lesson": "typescript-02"
  },
  {
    "source": "For two sets of activity names, {walk, read} and {read, code}, the overlap is {read};",
    "simple": "The groups {walk, read} and {read, code} share just one item: read.",
    "runtime": "typescript",
    "lesson": "typescript-02"
  },
  {
    "source": "their union is {walk, read, code}.",
    "simple": "Putting all their different items together gives walk, read, and code.",
    "runtime": "typescript",
    "lesson": "typescript-02"
  },
  {
    "source": "This set vocabulary explains either/shared choices.",
    "simple": "These set words help describe shared items and alternative choices.",
    "runtime": "typescript",
    "lesson": "typescript-02"
  },
  {
    "source": "An object type intersection uses & to require all fields from both object types, so do not read it as keeping only the fields the objects share.",
    "simple": "For object types, `&` requires every field from both descriptions. It does not keep only fields they have in common.",
    "runtime": "typescript",
    "lesson": "typescript-02"
  },
  {
    "source": "For the exercise, both branches must include title and minutes.",
    "simple": "Both exercise branches must use the activity’s title and minutes.",
    "runtime": "typescript",
    "lesson": "typescript-02"
  },
  {
    "source": "The walk branch reads steps;",
    "simple": "For a walk activity, read the `steps` value.",
    "runtime": "typescript",
    "lesson": "typescript-02"
  },
  {
    "source": "the read branch reads pages.",
    "simple": "For a read activity, read the `pages` value.",
    "runtime": "typescript",
    "lesson": "typescript-02"
  },
  {
    "source": "Preserve the punctuation shown by the requested sentences.",
    "simple": "Match the punctuation in the requested sentences.",
    "runtime": "typescript",
    "lesson": "typescript-02"
  },
  {
    "source": "Checking kind before reading a branch-specific field teaches both the compiler and the reader why that field is available.",
    "simple": "Check `kind` first. Then both TypeScript and a human reader can see why that choice’s extra field exists.",
    "runtime": "typescript",
    "lesson": "typescript-02"
  },
  {
    "source": "Do not convert all fields to text as a substitute for describing the correct shape.",
    "simple": "Describe the right object shapes instead of turning all their values into text to avoid type mistakes.",
    "runtime": "typescript",
    "lesson": "typescript-02"
  },
  {
    "source": "After your valid version compiles, temporarily try a walk record with pages and no steps.",
    "simple": "After the correct version passes, try a walk object that has `pages` but is missing `steps`.",
    "runtime": "typescript",
    "lesson": "typescript-02"
  },
  {
    "source": "The compiler should reject it, because the discriminant and fields do not agree.",
    "simple": "The compiler should reject it: a walk label does not fit reading-only fields.",
    "runtime": "typescript",
    "lesson": "typescript-02"
  },
  {
    "source": "Remove the invalid example afterward.",
    "simple": "Delete that deliberately invalid example afterward.",
    "runtime": "typescript",
    "lesson": "typescript-02"
  },
  {
    "source": "These are development checks;",
    "simple": "These compiler tests help while you are building the program.",
    "runtime": "typescript",
    "lesson": "typescript-02"
  },
  {
    "source": "a forged network object can still lie at runtime, so outside data needs actual value checks before it becomes a trusted Activity.",
    "simple": "Outside data can still have a false label when the program runs. Check the actual values before trusting it as an Activity.",
    "runtime": "typescript",
    "lesson": "typescript-02"
  },
  {
    "source": "An enum gives names to a set of values.",
    "simple": "An enum gives names to a fixed set of values.",
    "runtime": "typescript",
    "lesson": "typescript-03"
  },
  {
    "source": "A function can use those named values as a typed input.",
    "simple": "A function can accept one of those named choices as an input.",
    "runtime": "typescript",
    "lesson": "typescript-03"
  },
  {
    "source": "A class describes objects that keep data and provide actions, called methods.",
    "simple": "A class describes objects with their own data and actions. Those actions are called methods.",
    "runtime": "typescript",
    "lesson": "typescript-03"
  },
  {
    "source": "Each learner object can keep its own points.",
    "simple": "Each learner object can store its own points total.",
    "runtime": "typescript",
    "lesson": "typescript-03"
  },
  {
    "source": "A method can call a reward function so the calculation stays in one place instead of being repeated in every update.",
    "simple": "A method can use one reward function so the points formula is written in one place.",
    "runtime": "typescript",
    "lesson": "typescript-03"
  },
  {
    "source": "Run this complete example in the TypeScript runner:",
    "simple": "Run the following complete example with the TypeScript runner.",
    "runtime": "typescript",
    "lesson": "typescript-03"
  },
  {
    "source": "The outputs are 3 and 0. / divides minutes by ten.",
    "simple": "The example shows 3 and 0. The `/` divides the minutes by ten.",
    "runtime": "typescript",
    "lesson": "typescript-03"
  },
  {
    "source": "Math.floor rounds the result down to the nearest integer: 3.7 becomes 3.",
    "simple": "`Math.floor` rounds down to an integer, a number with no decimal part. For example, 3.7 becomes 3, and 3 stays 3.",
    "runtime": "typescript",
    "lesson": "typescript-03"
  },
  {
    "source": "Only completed ten-minute chunks earn points in this rule.",
    "simple": "This rule gives points only for full blocks of ten minutes.",
    "runtime": "typescript",
    "lesson": "typescript-03"
  },
  {
    "source": "Practice.Drawing and Practice.Singing are named enum members.",
    "simple": "`Practice.Drawing` and `Practice.Singing` are the named choices in the enum.",
    "runtime": "typescript",
    "lesson": "typescript-03"
  },
  {
    "source": "A plain numeric enum assigns 0 to the first member and 1 to the next unless values are specified.",
    "simple": "Without custom numbers, a numeric enum starts its first choice at 0 and its next at 1.",
    "runtime": "typescript",
    "lesson": "typescript-03"
  },
  {
    "source": "Those values identify activity categories;",
    "simple": "Those enum numbers identify the kinds of activity.",
    "runtime": "typescript",
    "lesson": "typescript-03"
  },
  {
    "source": "they are not point multipliers.",
    "simple": "They do not multiply the points earned.",
    "runtime": "typescript",
    "lesson": "typescript-03"
  },
  {
    "source": "The current reward rule is the same for both categories, so kind is accepted but does not change the calculation.",
    "simple": "Both activity kinds use the same reward rule here. The function accepts `kind`, but it does not affect the calculation.",
    "runtime": "typescript",
    "lesson": "typescript-03"
  },
  {
    "source": "Do not invent a bonus that the task did not request.",
    "simple": "Do not add extra points that the task did not ask for.",
    "runtime": "typescript",
    "lesson": "typescript-03"
  },
  {
    "source": "Continue after that enum and function:",
    "simple": "Put this next example after the enum and reward function.",
    "runtime": "typescript",
    "lesson": "typescript-03"
  },
  {
    "source": "The outputs are 3, 0, and 3. new Student() creates an object;",
    "simple": "It shows 3, 0, then 3. `new Student()` makes a new student object.",
    "runtime": "typescript",
    "lesson": "typescript-03"
  },
  {
    "source": "this refers to that object inside its method. += adds earned to its previous points. return earned returns this session's reward, not the accumulated total.",
    "simple": "Inside the method, `this` means that student object. `+=` adds the new reward to its points. `return earned` gives back only this session’s reward, not the whole total.",
    "runtime": "typescript",
    "lesson": "typescript-03"
  },
  {
    "source": "TypeScript infers points as number from its initial 0.",
    "simple": "Because `points` starts at 0, TypeScript can tell it should be a number.",
    "runtime": "typescript",
    "lesson": "typescript-03"
  },
  {
    "source": "The typed method requires numeric minutes and an enum activity, then promises a number result.",
    "simple": "The method asks for numeric minutes and an activity from the enum. It says its result will be a number.",
    "runtime": "typescript",
    "lesson": "typescript-03"
  },
  {
    "source": "A different Student starts with its own 0;",
    "simple": "A second Student starts with a separate points total of 0.",
    "runtime": "typescript",
    "lesson": "typescript-03"
  },
  {
    "source": "two students do not share the points field.",
    "simple": "Changing one student’s points does not change the other student’s points field.",
    "runtime": "typescript",
    "lesson": "typescript-03"
  },
  {
    "source": "Store updates on this.points instead of a temporary local variable that disappears when the method returns.",
    "simple": "Update `this.points` so the object keeps the total. A temporary name inside the method will not keep that object’s points for later.",
    "runtime": "typescript",
    "lesson": "typescript-03"
  },
  {
    "source": "In the exercise, award the first session's reward and accumulate the second reward too.",
    "simple": "For the project, add the first reward to the learner’s total, then add the second reward too.",
    "runtime": "typescript",
    "lesson": "typescript-03"
  },
  {
    "source": "Twenty minutes earns 2;",
    "simple": "20 minutes contains two full ten-minute blocks, so it earns 2 points.",
    "runtime": "typescript",
    "lesson": "typescript-03"
  },
  {
    "source": "fifteen earns 1;",
    "simple": "15 minutes contains one full ten-minute block, so it earns 1 point.",
    "runtime": "typescript",
    "lesson": "typescript-03"
  },
  {
    "source": "learner.points should then be 3.",
    "simple": "After both sessions, `learner.points` should be 3.",
    "runtime": "typescript",
    "lesson": "typescript-03"
  },
  {
    "source": "Keep earned and secondEarned as the names used by the checks.",
    "simple": "Keep the result names `earned` and `secondEarned`, because the tests use them.",
    "runtime": "typescript",
    "lesson": "typescript-03"
  },
  {
    "source": "Returning the total from the second call would produce 3 rather than the requested session reward 1.",
    "simple": "The second call must return that session’s 1 point. Returning the total instead would incorrectly return 3.",
    "runtime": "typescript",
    "lesson": "typescript-03"
  },
  {
    "source": "Temporarily passing quoted minutes such as '20' should fail the full TypeScript check.",
    "simple": "Try giving the function text like `'20'` for minutes. The full TypeScript check should reject it.",
    "runtime": "typescript",
    "lesson": "typescript-03"
  },
  {
    "source": "Restore a number afterward.",
    "simple": "Put the numeric value back after testing that mistake.",
    "runtime": "typescript",
    "lesson": "typescript-03"
  },
  {
    "source": "Numeric typing alone does not ensure minutes is nonnegative or finite;",
    "simple": "The type `number` alone does not prove that minutes are nonnegative or exclude Infinity and NaN.",
    "runtime": "typescript",
    "lesson": "typescript-03"
  },
  {
    "source": "the supplied exercise assumes valid durations.",
    "simple": "This exercise assumes the supplied durations are valid.",
    "runtime": "typescript",
    "lesson": "typescript-03"
  },
  {
    "source": "For real outside input you would validate that range too.",
    "simple": "If minutes came from outside the program, check their allowed range as well.",
    "runtime": "typescript",
    "lesson": "typescript-03"
  },
  {
    "source": "Math.floor is rounding down, so negative values are another reason not to treat type checking as validation.",
    "simple": "`Math.floor` rounds downward, including for negatives. This is another reason a number type is not enough to check valid durations.",
    "runtime": "typescript",
    "lesson": "typescript-03"
  },
  {
    "source": "A generic lets one piece of code work with different types while remembering which type was chosen.",
    "simple": "A generic lets you reuse the same code for different types while remembering which type each use chose.",
    "runtime": "typescript",
    "lesson": "typescript-04"
  },
  {
    "source": "The type parameter T is a placeholder for a type, not a runtime value.",
    "simple": "`T` stands for a type you choose later. It is not a value the running program stores.",
    "runtime": "typescript",
    "lesson": "typescript-04"
  },
  {
    "source": "Collection<number> chooses number;",
    "simple": "`Collection<number>` chooses numbers as the items this collection holds.",
    "runtime": "typescript",
    "lesson": "typescript-04"
  },
  {
    "source": "Collection<string> chooses string.",
    "simple": "`Collection<string>` chooses text as the items this collection holds.",
    "runtime": "typescript",
    "lesson": "typescript-04"
  },
  {
    "source": "Both can use the same storage and methods, while TypeScript checks which values can go into each instance.",
    "simple": "Both use the same class code, but TypeScript checks the allowed item type separately for each collection.",
    "runtime": "typescript",
    "lesson": "typescript-04"
  },
  {
    "source": "Here is a complete example for a TypeScript runner:",
    "simple": "Run the following complete example in the TypeScript runner.",
    "runtime": "typescript",
    "lesson": "typescript-04"
  },
  {
    "source": "The output is 11.",
    "simple": "This example prints 11.",
    "runtime": "typescript",
    "lesson": "typescript-04"
  },
  {
    "source": "T[] means an array whose elements have type T. [] creates an empty array. push appends a value. [0] reads the first element because array positions begin at zero.",
    "simple": "`T[]` means an array of the chosen type. `[]` starts an empty array. `push` adds an item at the end. `[0]` reads the first item because positions start at 0.",
    "runtime": "typescript",
    "lesson": "typescript-04"
  },
  {
    "source": "private asks TypeScript to prevent outside code from directly using values;",
    "simple": "`private` tells TypeScript that outside code should not directly use the `values` field.",
    "runtime": "typescript",
    "lesson": "typescript-04"
  },
  {
    "source": "callers use the methods.",
    "simple": "Outside code uses the class’s methods instead.",
    "runtime": "typescript",
    "lesson": "typescript-04"
  },
  {
    "source": "This TypeScript private keyword is not a security boundary for secret data at runtime. void means add does not promise a useful returned value. first returns T | undefined because an empty array has no first item. undefined means absent, rather than the number zero or an empty string.",
    "simple": "This `private` keyword does not secure secrets in the running app. `void` means `add` promises no useful returned result. `first` may return an item or `undefined` if none exists; that absence is different from 0 or empty text.",
    "runtime": "typescript",
    "lesson": "typescript-04"
  },
  {
    "source": "Continue after the Shelf class:",
    "simple": "Add this next example after the `Shelf` class.",
    "runtime": "typescript",
    "lesson": "typescript-04"
  },
  {
    "source": "The outputs are amber and undefined;",
    "simple": "It prints `amber`, then `undefined` for the empty collection.",
    "runtime": "typescript",
    "lesson": "typescript-04"
  },
  {
    "source": "the guarded addition does not run. !== means not equal.",
    "simple": "The addition inside the check is skipped. `!==` means “is not equal to.”",
    "runtime": "typescript",
    "lesson": "typescript-04"
  },
  {
    "source": "The check narrows maybeCount to number inside the branch, making arithmetic safe.",
    "simple": "Inside the successful check, TypeScript knows `maybeCount` is a number, so it allows the calculation.",
    "runtime": "typescript",
    "lesson": "typescript-04"
  },
  {
    "source": "A present value of 0 would pass this check.",
    "simple": "If the stored number were 0, it would still pass this presence check.",
    "runtime": "typescript",
    "lesson": "typescript-04"
  },
  {
    "source": "The same methods keep their chosen return types: counts.first() is number | undefined, while colors.first() is string | undefined.",
    "simple": "The methods remember the chosen type. `counts.first()` gives a number or nothing, while `colors.first()` gives text or nothing.",
    "runtime": "typescript",
    "lesson": "typescript-04"
  },
  {
    "source": "Replacing T with any would lose that connection and hide wrong-type mistakes.",
    "simple": "Using `any` instead of `T` would lose the link between the stored type and returned type, hiding mistakes.",
    "runtime": "typescript",
    "lesson": "typescript-04"
  },
  {
    "source": "A bare new Collection() can still represent an empty collection, but an explicit type parameter is clearer when choosing the values you plan to store.",
    "simple": "You can make an empty `new Collection()`, but stating the intended type makes the allowed future items clearer.",
    "runtime": "typescript",
    "lesson": "typescript-04"
  },
  {
    "source": "For the exercise, add must push into this.values, and first must return this.values[0].",
    "simple": "In the project, `add` must append to `this.values`, and `first` must read `this.values[0]`.",
    "runtime": "typescript",
    "lesson": "typescript-04"
  },
  {
    "source": "Set firstNumber from numbers.first() and firstWord from words.first().",
    "simple": "Save `numbers.first()` as `firstNumber` and `words.first()` as `firstWord`.",
    "runtime": "typescript",
    "lesson": "typescript-04"
  },
  {
    "source": "With the supplied inputs those values are 7 and maple.",
    "simple": "With these exercise values, the results are 7 and `maple`.",
    "runtime": "typescript",
    "lesson": "typescript-04"
  },
  {
    "source": "Adding does not replace the earlier item, so the first value stays first after later additions.",
    "simple": "Adding another item puts it after earlier items. It does not replace the first one.",
    "runtime": "typescript",
    "lesson": "typescript-04"
  },
  {
    "source": "Do not invent a default when the collection is empty.",
    "simple": "If there is no first item, do not make up a replacement value.",
    "runtime": "typescript",
    "lesson": "typescript-04"
  },
  {
    "source": "After the valid solution compiles, temporarily try numbers.add('seven').",
    "simple": "After the correct version passes, try `numbers.add('seven')` as a deliberate type mistake.",
    "runtime": "typescript",
    "lesson": "typescript-04"
  },
  {
    "source": "Expect a compiler error, then remove that call.",
    "simple": "The compiler should report an error. Remove the wrong call afterward.",
    "runtime": "typescript",
    "lesson": "typescript-04"
  },
  {
    "source": "A generic class provides compile-time consistency;",
    "simple": "The generic class helps keep types consistent while the compiler checks the code.",
    "runtime": "typescript",
    "lesson": "typescript-04"
  },
  {
    "source": "it does not inspect unknown network values by itself.",
    "simple": "It does not automatically examine unknown values arriving from a network.",
    "runtime": "typescript",
    "lesson": "typescript-04"
  },
  {
    "source": "Check untrusted values before calling add.",
    "simple": "Check data you do not trust before giving it to `add`.",
    "runtime": "typescript",
    "lesson": "typescript-04"
  },
  {
    "source": "Distinguishing an empty collection from one containing 0 or empty text is part of preserving the actual stored value.",
    "simple": "Keep “no item” different from an item whose value is 0 or empty text. Those are real stored values.",
    "runtime": "typescript",
    "lesson": "typescript-04"
  },
  {
    "source": "An event is a value describing something that happened.",
    "simple": "An event describes something that happened.",
    "runtime": "typescript",
    "lesson": "typescript-05"
  },
  {
    "source": "Its type field names the event, and its payload holds that event's details.",
    "simple": "Its `type` says which event it is. Its `payload` contains the details for that event.",
    "runtime": "typescript",
    "lesson": "typescript-05"
  },
  {
    "source": "One event might carry a title;",
    "simple": "One kind of event may contain a title.",
    "runtime": "typescript",
    "lesson": "typescript-05"
  },
  {
    "source": "another might carry a percentage.",
    "simple": "Another kind may contain a percentage.",
    "runtime": "typescript",
    "lesson": "typescript-05"
  },
  {
    "source": "A useful type keeps the name paired with the correct details.",
    "simple": "The type description should keep each event name connected to the details it needs.",
    "runtime": "typescript",
    "lesson": "typescript-05"
  },
  {
    "source": "Merely allowing either name and either payload independently would allow incorrect combinations.",
    "simple": "If names and details are allowed independently, you could accidentally combine the wrong name with the wrong data.",
    "runtime": "typescript",
    "lesson": "typescript-05"
  },
  {
    "source": "Run this complete type setup in a TypeScript runner:",
    "simple": "Run this complete type setup using TypeScript.",
    "runtime": "typescript",
    "lesson": "typescript-05"
  },
  {
    "source": "It prints Cedar. keyof Details produces the union 'selected' | 'counted'.",
    "simple": "The example prints Cedar. `keyof Details` means the allowed names are `selected` or `counted`.",
    "runtime": "typescript",
    "lesson": "typescript-05"
  },
  {
    "source": "Details['selected'] is an indexed access type: it looks up the type of that property.",
    "simple": "`Details['selected']` asks for the type described under the `selected` name.",
    "runtime": "typescript",
    "lesson": "typescript-05"
  },
  {
    "source": "Those brackets operate on types here, not on a runtime Details object.",
    "simple": "Here the square brackets look up a type, not an item in an actual running object.",
    "runtime": "typescript",
    "lesson": "typescript-05"
  },
  {
    "source": "A type alias does not create such an object.",
    "simple": "A type alias only describes a type. It does not create an object named `Details`.",
    "runtime": "typescript",
    "lesson": "typescript-05"
  },
  {
    "source": "K extends keyof Details means K must be one of those allowed keys.",
    "simple": "`K extends keyof Details` limits `K` to one of the names allowed in `Details`.",
    "runtime": "typescript",
    "lesson": "typescript-05"
  },
  {
    "source": "A conditional type has the form condition ? typeIfTrue : typeIfFalse. never describes an impossible type with no valid values.",
    "simple": "A conditional type chooses a type using `condition ? typeIfTrue : typeIfFalse`. `never` means no value is allowed for that choice.",
    "runtime": "typescript",
    "lesson": "typescript-05"
  },
  {
    "source": "In PayloadFor<K>, the valid key selects Details[K].",
    "simple": "In `PayloadFor<K>`, a valid key picks the matching details type, `Details[K]`.",
    "runtime": "typescript",
    "lesson": "typescript-05"
  },
  {
    "source": "Because K is already constrained to keyof Details, the condition is always satisfied for allowed uses;",
    "simple": "`K` is already limited to valid keys, so every allowed use passes this condition.",
    "runtime": "typescript",
    "lesson": "typescript-05"
  },
  {
    "source": "it still shows the conditional-type syntax.",
    "simple": "The example still demonstrates how to write a conditional type.",
    "runtime": "typescript",
    "lesson": "typescript-05"
  },
  {
    "source": "Continue in the same TypeScript file:",
    "simple": "Continue adding code in the same TypeScript file.",
    "runtime": "typescript",
    "lesson": "typescript-05"
  },
  {
    "source": "The outputs are Selected Cedar and Count 6.",
    "simple": "It prints `Selected Cedar` and `Count 6`.",
    "runtime": "typescript",
    "lesson": "typescript-05"
  },
  {
    "source": "The type declaration does no runtime loop;",
    "simple": "The type description does not run a loop when the app runs.",
    "runtime": "typescript",
    "lesson": "typescript-05"
  },
  {
    "source": "the handler is ordinary running code.",
    "simple": "The handler function is the part that actually runs and handles the event.",
    "runtime": "typescript",
    "lesson": "typescript-05"
  },
  {
    "source": "Read the mapped type in stages. [K in keyof Details] visits each key while building a type.",
    "simple": "`[K in keyof Details]` considers each allowed key while building the type description.",
    "runtime": "typescript",
    "lesson": "typescript-05"
  },
  {
    "source": "At selected it builds {type: 'selected';",
    "simple": "For `selected`, it starts an object description whose `type` is exactly `'selected'`.",
    "runtime": "typescript",
    "lesson": "typescript-05"
  },
  {
    "source": "payload: {label: string}}.",
    "simple": "That selected object’s `payload` must contain a text `label`.",
    "runtime": "typescript",
    "lesson": "typescript-05"
  },
  {
    "source": "At counted it builds the matching count shape.",
    "simple": "For `counted`, it builds the corresponding object description for count data.",
    "runtime": "typescript",
    "lesson": "typescript-05"
  },
  {
    "source": "The final [keyof Details] takes the built property types and combines them into a union.",
    "simple": "The final `[keyof Details]` gathers those object descriptions into a set of allowed alternatives.",
    "runtime": "typescript",
    "lesson": "typescript-05"
  },
  {
    "source": "Each union member still contains its correctly paired name and payload.",
    "simple": "Each alternative still keeps its correct event name and matching data together.",
    "runtime": "typescript",
    "lesson": "typescript-05"
  },
  {
    "source": "Checking event.type === 'selected' narrows DemoEvent to its selected member, so event.payload.label is known to exist there.",
    "simple": "After checking `event.type === 'selected'`, TypeScript knows this is the selected event, so its payload has a `label`.",
    "runtime": "typescript",
    "lesson": "typescript-05"
  },
  {
    "source": "In the remaining branch, counted's count is available.",
    "simple": "In the other case, the event is counted and its payload has `count`.",
    "runtime": "typescript",
    "lesson": "typescript-05"
  },
  {
    "source": "Trying a selected event with only count fails the compiler.",
    "simple": "The compiler rejects an event labeled selected that has only count data.",
    "runtime": "typescript",
    "lesson": "typescript-05"
  },
  {
    "source": "You can understand or expand the mapped declaration into two explicit union members;",
    "simple": "You can write out the two allowed object shapes separately to understand the shorter mapped version.",
    "runtime": "typescript",
    "lesson": "typescript-05"
  },
  {
    "source": "the reusable form is useful when the key list grows.",
    "simple": "The mapped version saves repetition when more event names are added.",
    "runtime": "typescript",
    "lesson": "typescript-05"
  },
  {
    "source": "The exercise calls its map Payloads, with opened/title and progress/percent.",
    "simple": "In your exercise, `Payloads` connects opened with title data and progress with percent data.",
    "runtime": "typescript",
    "lesson": "typescript-05"
  },
  {
    "source": "Keep those names, build AppEvent from the mapped union, and format the opened and progress sentences exactly.",
    "simple": "Keep those names, build `AppEvent` from the mapped alternatives, and match the required opened and progress sentences exactly.",
    "runtime": "typescript",
    "lesson": "typescript-05"
  },
  {
    "source": "The % in a template string is ordinary displayed punctuation after the percentage;",
    "simple": "A `%` inside this text template is just the percent sign shown after the number.",
    "runtime": "typescript",
    "lesson": "typescript-05"
  },
  {
    "source": "it is not an arithmetic remainder operator there.",
    "simple": "In that text, `%` does not calculate a division remainder.",
    "runtime": "typescript",
    "lesson": "typescript-05"
  },
  {
    "source": "The mapping preserves relationships, not where an event came from at runtime.",
    "simple": "The type keeps names and data matched. It does not prove where a real event came from.",
    "runtime": "typescript",
    "lesson": "typescript-05"
  },
  {
    "source": "Temporarily pair opened with {percent: 50} and run the full TypeScript check to see a rejection, then remove the invalid call.",
    "simple": "Try pairing opened with `{percent: 50}`. The full TypeScript check should reject it. Then remove that invalid call.",
    "runtime": "typescript",
    "lesson": "typescript-05"
  },
  {
    "source": "Types are erased at runtime, so real incoming events still require validation.",
    "simple": "Type descriptions disappear before the app runs. Real incoming events still need data checks.",
    "runtime": "typescript",
    "lesson": "typescript-05"
  },
  {
    "source": "An event with a numeric percent also needs a separate range rule if you intend to require 0 through 100;",
    "simple": "If a percent must be from 0 to 100, add a separate check for that range.",
    "runtime": "typescript",
    "lesson": "typescript-05"
  },
  {
    "source": "the current type number alone does not impose that rule.",
    "simple": "The type `number` alone does not require a percentage to stay within 0 and 100.",
    "runtime": "typescript",
    "lesson": "typescript-05"
  },
  {
    "source": "Outside data can be wrong even when your program has good TypeScript types.",
    "simple": "Data from outside your app can be wrong even if your own TypeScript code has correct types.",
    "runtime": "typescript",
    "lesson": "typescript-06"
  },
  {
    "source": "Runtime means the time when JavaScript actually executes.",
    "simple": "Runtime means the time when the JavaScript program is actually running.",
    "runtime": "typescript",
    "lesson": "typescript-06"
  },
  {
    "source": "TypeScript's types are erased before then.",
    "simple": "The TypeScript-only type descriptions have already been removed by then.",
    "runtime": "typescript",
    "lesson": "typescript-06"
  },
  {
    "source": "Use unknown for an unchecked value: you must narrow it before reading fields or doing calculations. any instead disables many checks and can let a missing field go unnoticed.",
    "simple": "Use `unknown` until you check what an outside value really is. TypeScript then requires checks before you use its fields. `any` skips many of those protections.",
    "runtime": "typescript",
    "lesson": "typescript-06"
  },
  {
    "source": "This complete TypeScript example validates a simple response:",
    "simple": "This complete example checks whether some data has the required shape.",
    "runtime": "typescript",
    "lesson": "typescript-06"
  },
  {
    "source": "It prints true then false.",
    "simple": "The first example passes the check and shows `true`. The second fails and shows `false`.",
    "runtime": "typescript",
    "lesson": "typescript-06"
  },
  {
    "source": "The value is Reading return annotation is a type predicate: it tells TypeScript what a true result proves.",
    "simple": "`value is Reading` tells TypeScript: when this function returns true, the value has been checked as a Reading.",
    "runtime": "typescript",
    "lesson": "typescript-06"
  },
  {
    "source": "The function body must actually check that promise.",
    "simple": "The function’s actual instructions must really perform those checks; the type phrase does not do them for you.",
    "runtime": "typescript",
    "lesson": "typescript-06"
  },
  {
    "source": "typeof returns a value's basic runtime kind.",
    "simple": "`typeof` tells the running program a value’s basic kind.",
    "runtime": "typescript",
    "lesson": "typescript-06"
  },
  {
    "source": "JavaScript reports typeof null as 'object', so we explicitly reject null before using in.",
    "simple": "JavaScript calls `null` an `object` in this test, so reject null separately before checking its fields with `in`.",
    "runtime": "typescript",
    "lesson": "typescript-06"
  },
  {
    "source": "The in operator checks whether a named property exists. ! means not, || means either condition is enough, and && requires every condition.",
    "simple": "`in` checks for a named field. `!` means not. `||` means either check is enough; `&&` means both must pass.",
    "runtime": "typescript",
    "lesson": "typescript-06"
  },
  {
    "source": "Early return false stops before an unsafe field access.",
    "simple": "Returning false early stops the function before it tries to read an unsafe field.",
    "runtime": "typescript",
    "lesson": "typescript-06"
  },
  {
    "source": "This code requires known fields but permits extra fields;",
    "simple": "This checker requires certain fields but allows extra fields too.",
    "runtime": "typescript",
    "lesson": "typescript-06"
  },
  {
    "source": "it does not require a particular object prototype.",
    "simple": "It does not require the object to come from a particular prototype.",
    "runtime": "typescript",
    "lesson": "typescript-06"
  },
  {
    "source": "Continue after the interface and guard:",
    "simple": "Add the following code after the interface and checking function.",
    "runtime": "typescript",
    "lesson": "typescript-06"
  },
  {
    "source": "The first branch prints Milk and 5.",
    "simple": "The first successful branch prints Milk and 5.",
    "runtime": "typescript",
    "lesson": "typescript-06"
  },
  {
    "source": "The loop prints false three times.",
    "simple": "The loop prints `false` for each of its three invalid examples.",
    "runtime": "typescript",
    "lesson": "typescript-06"
  },
  {
    "source": "Inside the true branch TypeScript permits field access because the guard has narrowed incoming.",
    "simple": "Inside the true branch, TypeScript lets you use the fields because the checker has established the value’s type.",
    "runtime": "typescript",
    "lesson": "typescript-06"
  },
  {
    "source": "NaN means not-a-number, but typeof NaN is 'number'.",
    "simple": "`NaN` stands for not-a-number, but JavaScript’s `typeof` still labels it as `number`.",
    "runtime": "typescript",
    "lesson": "typescript-06"
  },
  {
    "source": "Infinity is also a number in JavaScript but is not a finite measurement.",
    "simple": "JavaScript gives Infinity the type number, but infinity is not a usable measurement here.",
    "runtime": "typescript",
    "lesson": "typescript-06"
  },
  {
    "source": "Number.isFinite rejects both, and does not convert numeric text into a number.",
    "simple": "`Number.isFinite` rejects NaN and Infinity. It does not turn text such as `'5'` into a number.",
    "runtime": "typescript",
    "lesson": "typescript-06"
  },
  {
    "source": "A >= 0 test excludes negatives and includes zero.",
    "simple": "`>= 0` accepts zero and positive values, but not negatives.",
    "runtime": "typescript",
    "lesson": "typescript-06"
  },
  {
    "source": "This guard permits nonnegative fractions because the task requires a number, not specifically an integer.",
    "simple": "This exercise allows a nonnegative number with a fraction. It does not require whole numbers only.",
    "runtime": "typescript",
    "lesson": "typescript-06"
  },
  {
    "source": "If a separate contract says durations must also be at most 600, add value.minutes <= 600 to the finite nonnegative check.",
    "simple": "If another task also limits minutes to 600, add `value.minutes <= 600` to the existing checks.",
    "runtime": "typescript",
    "lesson": "typescript-06"
  },
  {
    "source": "Then 0 and 45 pass that range, Infinity fails, and 601 fails the upper bound.",
    "simple": "With that extra limit, 0 and 45 pass. Infinity fails, and 601 is too large.",
    "runtime": "typescript",
    "lesson": "typescript-06"
  },
  {
    "source": "The exercise's current PracticeResponse contract requires finite nonnegative minutes without that extra upper bound;",
    "simple": "The exercise accepts minutes of zero or more, but not infinity or NaN. It does not set a 600-minute upper limit.",
    "runtime": "typescript",
    "lesson": "typescript-06"
  },
  {
    "source": "the matching math question describes the stricter hypothetical range.",
    "simple": "The separate math question uses that stricter example range.",
    "runtime": "typescript",
    "lesson": "typescript-06"
  },
  {
    "source": "For the exercise, validate PracticeResponse's title and minutes.",
    "simple": "For this project, check the `title` and `minutes` fields required by `PracticeResponse`.",
    "runtime": "typescript",
    "lesson": "typescript-06"
  },
  {
    "source": "Reject null, a missing title or minutes field, wrong field types, negative minutes, NaN, and Infinity.",
    "simple": "Reject null, missing fields, wrong field types, negative minutes, NaN, and Infinity.",
    "runtime": "typescript",
    "lesson": "typescript-06"
  },
  {
    "source": "Accept the supplied good object.",
    "simple": "The supplied correctly shaped object should pass.",
    "runtime": "typescript",
    "lesson": "typescript-06"
  },
  {
    "source": "A type assertion such as value as PracticeResponse would only tell the compiler to trust you;",
    "simple": "Writing `value as PracticeResponse` only asks the compiler to take your word for it.",
    "runtime": "typescript",
    "lesson": "typescript-06"
  },
  {
    "source": "it would perform none of these actual runtime checks.",
    "simple": "That statement does not run any of these data checks.",
    "runtime": "typescript",
    "lesson": "typescript-06"
  },
  {
    "source": "Temporarily read unvalidated.minutes from an unknown value without a guard, then run the full TypeScript check.",
    "simple": "Try reading `unvalidated.minutes` from an `unknown` value before checking it, then run the full TypeScript check.",
    "runtime": "typescript",
    "lesson": "typescript-06"
  },
  {
    "source": "It should fail.",
    "simple": "The compiler should reject that unchecked use.",
    "runtime": "typescript",
    "lesson": "typescript-06"
  },
  {
    "source": "Remove that practice line afterward. unknown does not itself validate anything;",
    "simple": "Remove the deliberately wrong line afterward. `unknown` does not check the data itself.",
    "runtime": "typescript",
    "lesson": "typescript-06"
  },
  {
    "source": "it makes unchecked use a compiler error.",
    "simple": "Instead, `unknown` makes the compiler reject using the value without a suitable check.",
    "runtime": "typescript",
    "lesson": "typescript-06"
  },
  {
    "source": "Your guard's runtime code is what determines whether the data really has a string title and a finite nonnegative duration.",
    "simple": "The checking function runs real checks: the title must be text, and the duration must be a number of zero or more, not infinity or NaN.",
    "runtime": "typescript",
    "lesson": "typescript-06"
  },
  {
    "source": "An asynchronous job can finish later, after other code has run.",
    "simple": "An asynchronous task can finish after other code has already run.",
    "runtime": "typescript",
    "lesson": "typescript-07"
  },
  {
    "source": "A workflow needs to describe what is happening now: idle, loading, success, error, or cancelled.",
    "simple": "Describe the job’s current state clearly: not started, loading, succeeded, failed, or cancelled.",
    "runtime": "typescript",
    "lesson": "typescript-07"
  },
  {
    "source": "A discriminated union lets each kind of state carry just the fields it needs.",
    "simple": "A union with an identifying label lets each state have only the information that belongs to it.",
    "runtime": "typescript",
    "lesson": "typescript-07"
  },
  {
    "source": "Success has data;",
    "simple": "A successful state includes the resulting data.",
    "runtime": "typescript",
    "lesson": "typescript-07"
  },
  {
    "source": "error has a message;",
    "simple": "An error state includes a message about the problem.",
    "runtime": "typescript",
    "lesson": "typescript-07"
  },
  {
    "source": "idle does not pretend to have either.",
    "simple": "An idle state has neither a result nor an error yet.",
    "runtime": "typescript",
    "lesson": "typescript-07"
  },
  {
    "source": "This complete TypeScript setup models a smaller delivery workflow:",
    "simple": "This complete example describes a small delivery task with several possible states.",
    "runtime": "typescript",
    "lesson": "typescript-07"
  },
  {
    "source": "It prints idle. string[] is an array of text.",
    "simple": "It prints idle. `string[]` means a list of text values.",
    "runtime": "typescript",
    "lesson": "typescript-07"
  },
  {
    "source": "The union bars mean one valid shape at a time;",
    "simple": "The `|` signs mean one of these allowed state shapes at a time.",
    "runtime": "typescript",
    "lesson": "typescript-07"
  },
  {
    "source": "the state is not simultaneously success and error.",
    "simple": "The state is not success and error at the same time.",
    "runtime": "typescript",
    "lesson": "typescript-07"
  },
  {
    "source": "A reducer is a function that receives the current state and an action, then returns the next state.",
    "simple": "A reducer takes the current state plus a description of what happened, then gives back the next state.",
    "runtime": "typescript",
    "lesson": "typescript-07"
  },
  {
    "source": "The action describes an event;",
    "simple": "The action describes the event that just happened.",
    "runtime": "typescript",
    "lesson": "typescript-07"
  },
  {
    "source": "it does not edit state by itself.",
    "simple": "The action does not change state on its own; the reducer decides the change.",
    "runtime": "typescript",
    "lesson": "typescript-07"
  },
  {
    "source": "A requestId identifies one attempt.",
    "simple": "A `requestId` is a number or name used to identify one particular attempt.",
    "runtime": "typescript",
    "lesson": "typescript-07"
  },
  {
    "source": "If request 8 starts after request 7, the reply from 7 should no longer control the screen, even when it arrives last.",
    "simple": "If request 8 starts after request 7, ignore request 7’s late reply. It must not replace the newer screen result.",
    "runtime": "typescript",
    "lesson": "typescript-07"
  },
  {
    "source": "Continue after the type declarations:",
    "simple": "Add this code below the state and action type descriptions.",
    "runtime": "typescript",
    "lesson": "typescript-07"
  },
  {
    "source": "It prints loading and true.",
    "simple": "The example prints loading and true.",
    "runtime": "typescript",
    "lesson": "typescript-07"
  },
  {
    "source": "The old response returns the identical state object rather than constructing a misleading new success.",
    "simple": "For an old reply, the reducer gives back the same state object. It does not create a false new success state.",
    "runtime": "typescript",
    "lesson": "typescript-07"
  },
  {
    "source": "The order of the branches matters. start may begin a new loading state from any state.",
    "simple": "Check the branches in the right order. A start action can begin loading from any current state.",
    "runtime": "typescript",
    "lesson": "typescript-07"
  },
  {
    "source": "Every other action needs a current loading state and matching requestId.",
    "simple": "Other actions need both a current loading state and the matching request ID.",
    "runtime": "typescript",
    "lesson": "typescript-07"
  },
  {
    "source": "The || means either a wrong state kind or wrong id is enough to ignore it.",
    "simple": "The `||` means either a wrong state or a wrong ID is enough to ignore the action.",
    "runtime": "typescript",
    "lesson": "typescript-07"
  },
  {
    "source": "Checking state.kind first also safely narrows state before reading its requestId. resolve produces success;",
    "simple": "Checking `state.kind` first makes it safe to read its request ID. A valid resolve action changes loading to success.",
    "runtime": "typescript",
    "lesson": "typescript-07"
  },
  {
    "source": "reject produces error;",
    "simple": "A valid reject action changes loading to error.",
    "runtime": "typescript",
    "lesson": "typescript-07"
  },
  {
    "source": "the remaining valid action is cancel.",
    "simple": "The other valid terminal action is cancel.",
    "runtime": "typescript",
    "lesson": "typescript-07"
  },
  {
    "source": "A third example in the same file shows cancellation:",
    "simple": "This third example demonstrates cancellation in the same file.",
    "runtime": "typescript",
    "lesson": "typescript-07"
  },
  {
    "source": "The outputs are cancelled, true, error.",
    "simple": "It prints cancelled, then true, then error.",
    "runtime": "typescript",
    "lesson": "typescript-07"
  },
  {
    "source": "Cancellation here prevents a late result changing the model;",
    "simple": "In this model, cancellation prevents a late reply from changing the state.",
    "runtime": "typescript",
    "lesson": "typescript-07"
  },
  {
    "source": "it does not actually stop a network request or timer.",
    "simple": "It does not actually stop a network request or timer that is still running.",
    "runtime": "typescript",
    "lesson": "typescript-07"
  },
  {
    "source": "Real cancellation can also stop work with an appropriate API.",
    "simple": "To stop the real work as well, use the cancellation support of the relevant API.",
    "runtime": "typescript",
    "lesson": "typescript-07"
  },
  {
    "source": "For the exercise, keep the supplied State and Action unions. reduce should return the exact same state on stale or invalid terminal actions, because the checks compare object identity with ===.",
    "simple": "Keep the supplied `State` and `Action` types. On an old or invalid ending action, `reduce` must return the very same state object, because the tests compare it with `===`.",
    "runtime": "typescript",
    "lesson": "typescript-07"
  },
  {
    "source": "Accept only the active request's result, rejection, or cancellation.",
    "simple": "Only the active request may finish, fail, or cancel the current loading state.",
    "runtime": "typescript",
    "lesson": "typescript-07"
  },
  {
    "source": "An idle state must ignore resolve.",
    "simple": "If nothing is loading, an idle state must ignore a resolve action.",
    "runtime": "typescript",
    "lesson": "typescript-07"
  },
  {
    "source": "Once cancelled, even the matching late resolve must be ignored because the state is no longer loading.",
    "simple": "After cancellation, ignore even a reply with the same ID because the state is no longer loading.",
    "runtime": "typescript",
    "lesson": "typescript-07"
  },
  {
    "source": "Trace the matching math case: loading request 8 first receives resolve for 7.",
    "simple": "In the math example, request 8 is loading when a success reply for request 7 arrives.",
    "runtime": "typescript",
    "lesson": "typescript-07"
  },
  {
    "source": "That id mismatch keeps loading 8 unchanged.",
    "simple": "The IDs do not match, so request 8 keeps loading unchanged.",
    "runtime": "typescript",
    "lesson": "typescript-07"
  },
  {
    "source": "Then reject for 8 matches, so the final state is error for 8.",
    "simple": "Then a failure for request 8 arrives. Its matching ID makes the final state an error for request 8.",
    "runtime": "typescript",
    "lesson": "typescript-07"
  },
  {
    "source": "The order of arrival alone does not choose the winner;",
    "simple": "A reply does not win just because it arrived last.",
    "runtime": "typescript",
    "lesson": "typescript-07"
  },
  {
    "source": "current identity does.",
    "simple": "What matters is whether it belongs to the currently active request.",
    "runtime": "typescript",
    "lesson": "typescript-07"
  },
  {
    "source": "The supplied first request uses id 2.",
    "simple": "The exercise’s first supplied request is numbered 2.",
    "runtime": "typescript",
    "lesson": "typescript-07"
  },
  {
    "source": "Its matching success carries ['book'];",
    "simple": "Its matching success result contains `['book']`.",
    "runtime": "typescript",
    "lesson": "typescript-07"
  },
  {
    "source": "id 1 is stale.",
    "simple": "Request 1 is older and must be ignored.",
    "runtime": "typescript",
    "lesson": "typescript-07"
  },
  {
    "source": "Add or retain the current and stale variables required by the checks.",
    "simple": "Keep the `current` and `stale` variables that the tests expect.",
    "runtime": "typescript",
    "lesson": "typescript-07"
  },
  {
    "source": "Temporarily construct success without data and run the full TypeScript check to see why success needs that field, then remove the invalid line.",
    "simple": "Try making a success state without data. The full TypeScript check should explain the missing field. Then delete that invalid line.",
    "runtime": "typescript",
    "lesson": "typescript-07"
  },
  {
    "source": "This reducer models transitions;",
    "simple": "This reducer describes how states change from one to another.",
    "runtime": "typescript",
    "lesson": "typescript-07"
  },
  {
    "source": "it does not itself fetch data or schedule requests.",
    "simple": "It does not start requests or get data by itself.",
    "runtime": "typescript",
    "lesson": "typescript-07"
  }
];
