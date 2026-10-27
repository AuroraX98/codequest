/** Optional worked examples. Page numbers are zero-based explanation indexes.
 * These are display-only strings, never HTML or executable lesson code.
 * One guide per lesson does not claim that every concept/page is visualized.
 */
export type LessonVisual = {
  id: string;
  kind: "sequence" | "compare" | "collection" | "branch" | "layers";
  title: string;
  intro: string;
  items: { label: string; value: string; detail?: string }[];
  takeaway: string;
  limit?: string;
  paragraph?: number;
};

type VisualItem = [label: string, value: string, detail?: string];
function visual(
  id: string,
  kind: LessonVisual["kind"],
  paragraph: number,
  title: string,
  intro: string,
  items: VisualItem[],
  takeaway: string,
  limit?: string,
): LessonVisual {
  return { id, kind, paragraph, title, intro,
    items: items.map(([label, value, detail]) => ({ label, value, ...(detail ? { detail } : {}) })),
    takeaway, ...(limit ? { limit } : {}) };
}

const guides: LessonVisual[] = [
  visual("html-01", "layers", 1, "What goes in the tab, what goes on the page", "The Mountain lookout document has two different places for information.", [
    ["Document", 'html lang="en"', "The document's language is English."],
    ["Inside head", "title: Mountain lookout", "Names the browser tab, not a visible page heading."],
    ["Inside body", "h1: Mountain lookout", "The main heading readers see on the page."],
    ["Also inside body", "p: I like watching the clouds drift past.", "A separate paragraph below the heading."],
  ], "The title and h1 can have the same words while doing different jobs.", "This is a structure map, not a promise about fonts or spacing."),
  visual("html-02", "sequence", 2, "Follow a path from the current file", "Imagine index.html and materials.html beside an images folder.", [
    ["Start", "index.html", "The browser is showing the home page."],
    ["Same folder", 'href="materials.html"', "Open the neighboring materials page."],
    ["Inside a folder", 'src="images/fold.jpg"', "From index.html, enter images and find fold.jpg."],
    ["One folder up", 'href="../index.html"', "From a page inside images, go up to the home page."],
  ], "A relative path is interpreted from the current document's location.", "These examples assume the ordinary document URL and no custom base URL."),
  visual("html-03", "layers", 3, "An event outline has levels", "The Science afternoon page contains a tickets section with a smaller topic inside it.", [
    ["Whole page: h1", "Science afternoon", "One main subject."],
    ["Section: h2", "Tickets", "A topic within this event."],
    ["Subsection: h3", "Group visits", "A detail within Tickets, not a second event."],
  ], "Choose heading levels for the relationship between topics, not for the size of the letters."),
  visual("html-04", "sequence", 5, "Move focus without a mouse", "Use the example link followed by its native checklist button.", [
    ["Press Tab", "Read directions to the workshop", "Focus reaches the link; Enter follows its destination."],
    ["Press Tab again", "Show workshop checklist", "Focus reaches the button; Enter or Space activates it."],
    ["Press Shift+Tab", "Read directions to the workshop", "Focus moves back to the link."],
  ], "The focused control needs a visible focus indicator and a useful name.", "HTML makes the button operable; showing a checklist still needs behavior to be implemented."),
  visual("html-05", "layers", 2, "One email field, three separate connections", "Follow the contact field from its visible label to the submitted value.", [
    ["What the person reads", 'label for="contact": Contact email', "The label points to an element ID."],
    ["Which field gets that label", 'input id="contact"', "The matching ID joins the label and control."],
    ["What the form sends", "contact=learner@example.org", 'name="contact" supplies the key; the typed text supplies the value.'],
  ], "for matches id; name controls the submitted key. Those are different jobs.", "This diagram explains field wiring, not an actual submitted registration."),
  visual("html-06", "branch", 5, "A required passphrase has two hurdles", "For the workshop field, combine required with minlength=" + '"8"' + ".", [
    ["Empty input", '"" → missing', "required blocks ordinary form submission."],
    ["User types seven characters", '"abcdefg" → too short', "The field is present, but the length rule fails."],
    ["User types eight characters", '"abcdefgh" → passes these rules', "Both required and minimum length are satisfied."],
  ], "Presence and length are independent checks; a helpful note states the length before an error.", "These are dummy examples, not recommended passwords. Native validation is not server-side validation."),
  visual("html-07", "collection", 4, "Read a value with its column heading", "The bird table's caption names the whole set; column headings explain individual cells.", [
    ["Caption", "Bird wingspans", "Names this table, not an individual column."],
    ["Column 1", 'th scope="col": Bird', "The Mallard data cell belongs under this heading."],
    ["Column 2", 'th scope="col": Wingspan', "85 cm belongs to Mallard; 180 cm belongs to Great blue heron."],
    ["One row", "Mallard | 85 cm", "A second row pairs Great blue heron with 180 cm, not with Mallard."],
  ], "A table is a relationship between rows and columns, not merely text aligned with spaces."),
  visual("html-08", "layers", 4, "Keep each product's pieces together", "Two product articles use the same roles even when their titles have different lengths.", [
    ["Brush article: h2", "Brush", "This card's name."],
    ["Brush article: detail and price", 'A small brush for watercolor. | class="price": $4', "Both paragraphs stay inside the Brush article."],
    ["Sketchbook article: h2", "Large mixed-media sketchbook", "A longer name still fills the same heading role."],
    ["Sketchbook article: detail and price", 'Thick pages for pencil, ink, and light paint washes. | class="price": $18', "Do not leave its price outside its closing article tag."],
  ], "Repeat the structure, change the content, and keep each card's details inside its own boundary."),
  visual("css-01", "collection", 2, "Which elements does each selector choose?", "Imagine a button with id start and class action, plus a link with class action.", [
    ["button", "The button only", "It selects an element type, not a class name."],
    [".action", "The button and the link", 'Both have class="action".'],
    ["#start", "The button with id start", 'It selects id="start", which should be unique.'],
  ], "The dot and hash belong in CSS selectors, not inside the class or id attribute values."),
  visual("css-02", "compare", 2, "Where does a 300px width stop?", "Both cards declare width 300px, padding 12px on each side, and a 2px border on each side.", [
    ["content-box: content", "300px", "The declared width measures only this inner area."],
    ["content-box: total", "300 + 24 + 4 = 328px", "Padding and border add to the declared width."],
    ["border-box: total", "300px", "The declared width already includes padding and border."],
    ["border-box: content", "300 − 24 − 4 = 272px", "The content gets the remaining inner width."],
  ], "border-box keeps this padded card's outer width at 300px.", "Margins remain outside either measurement. Long unbroken content may still overflow."),
  visual("css-03", "compare", 2, "The same toolbar on two rows", "Consider three 100px items and a 12px gap, with flex-shrink: 0 for this illustration.", [
    ["Enough room: 324px", "[100px] 12 [100px] 12 [100px]", "All three items fit on one row."],
    ["Narrower: 212px with wrap", "Row 1: [100px] 12 [100px]", "Two items exactly fit."],
    ["The wrapped row", "Row 2: [100px]", "The third item moves down; gap also separates rows."],
  ], "flex-wrap permits another row; justify-content changes alignment, not whether wrapping is allowed.", "Actual item widths can shrink or grow under other flex settings."),
  visual("css-04", "collection", 2, "Subtract the gaps before sharing the space", "The explanation's grid is 636px wide with four equal columns and 12px gaps.", [
    ["Whole container", "636px", "Includes columns and the spaces between them."],
    ["Three gaps", "12 + 12 + 12 = 36px", "Four columns need three internal gaps."],
    ["Space for columns", "636 − 36 = 600px", "This is what the equal shares divide."],
    ["Each 1fr column", "600 ÷ 4 = 150px", "150 | 12 | 150 | 12 | 150 | 12 | 150"],
  ], "1fr is a share of available track space, not a fixed pixel width."),
  visual("css-05", "compare", 4, "One panel reacts to its own wrapper", "The explanation changes .panel to a 1fr 2fr grid when its container reaches 540px.", [
    ["Wrapper narrower than 540px", "Heading, then description", "The container rule does not match yet."],
    ["Wrapper at least 540px", "Heading: 1 share | description: 2 shares", "The container rule changes the panel layout."],
    ["Example: 450px of track space", "150px | 300px", "After padding and gaps, divide the remaining track space into three shares."],
  ], "The component responds to its container, which may be narrower than the browser window.", "The project uses a different threshold, 500px. This guide follows the explanation's 540px example."),
  visual("css-06", "compare", 4, "The same completed result, with or without motion", "The bar illustrates a completed download, not a measurement of a live transfer.", [
    ["Motion allowed: start", "width: 0", "The width animation begins at its first keyframe."],
    ["Motion allowed: end", "width: 100%", "The bar stays full after the run."],
    ["Reduced motion", "animation: none; width: 100%", "Show the final state immediately."],
    ["Visible text in both cases", "Download complete: 100%", "Understanding the result does not depend on seeing movement."],
  ], "Removing motion should not remove the information it was meant to communicate."),
  visual("css-07", "layers", 2, "Halfway positions an edge, not the center", "The standalone diagram has a 320px by 180px inner reference area.", [
    ["Reference area", "320px wide × 180px tall", "Measure from its top-left corner."],
    ["left: 50%", "160px from the left", "Positions the marker's left edge."],
    ["top: 50%", "90px from the top", "Positions the marker's top edge."],
    ["Optional centering", "translate(-50%, -50%)", "Would move the marker by half of its own width and height."],
  ], "Without that translation, the marker begins at the midpoint rather than being centered on it.", "The exercise does not add the centering transform; do not silently assume it does."),
  visual("javascript-01", "sequence", 2, "Trace the coin calculation once", "Read the explanation's four lines in order.", [
    ["Name the inputs", "savedCoins = 30; paidCoins = 8", "The names refer to two numbers."],
    ["Calculate", "30 − 8 = 22", "Reading the inputs does not change either one."],
    ["Name the result", "coinsLeft = 22", "The declaration stores the result under this name."],
    ["Display", "console.log(coinsLeft) → 22", "Printing reads the result; it does not subtract again."],
  ], "After the print, savedCoins is still 30 and paidCoins is still 8.", "const prevents reassigning a name; it does not make every object immutable."),
  visual("javascript-02", "compare", 2, "Three questions about 17 and 19", "Keep temperature at 17 and limit at 19 while comparing them.", [
    ["Below?", "17 < 19 → true", "17 lies below the limit."],
    ["Exactly at?", "17 === 19 → false", "The values do not match."],
    ["Above?", "17 > 19 → false", "17 does not lie above the limit."],
    ["At the boundary instead", "19 < 19: false; 19 === 19: true", "Equality belongs to its own case."],
  ], "Comparisons produce Boolean answers without changing the original numbers."),
  visual("javascript-03", "branch", 2, "Follow only the matching pet branch", 'The input is pet = "cat". Check conditions from top to bottom.', [
    ["First test", 'pet === "dog" → false', "Skip the walk message."],
    ["Next test", 'pet === "cat" → true', 'Choose "Time for a game".'],
    ["Fallback", '"Ask what this pet needs" → skipped', "An earlier branch already matched."],
    ["Result", "Time for a game", "Only the chosen branch supplies the message."],
  ], "An if/else-if chain takes the first matching branch, not all the branches."),
  visual("javascript-04", "sequence", 2, "Watch the countdown array grow", "Start with numbers = [] and repeat while n >= 1.", [
    ["n = 4", "[4]", "The first push adds 4."],
    ["n = 3", "[4, 3]", "n-- has reduced the counter by one."],
    ["n = 2, then 1", "[4, 3, 2, 1]", "Both values still pass the condition."],
    ["n = 0", "0 >= 1 → false", "Stop before pushing zero; join prints 4,3,2,1."],
  ], "The test runs before the body each time, including the final failed test."),
  visual("javascript-05", "collection", 4, "An array's positions are not its count", "After tools.push(" + '"glue"' + "), the original three tools remain in order.", [
    ["Index 0", '"pencil"', "First entry."],
    ["Index 1", '"ruler"', "Second entry."],
    ["Index 2", '"eraser"', "Third entry."],
    ["Index 3", '"glue"', "New last entry; tools.length is now 4."],
  ], "Four entries occupy indexes 0 through 3, so the final index is length − 1.", "const keeps tools bound to this array; push is still allowed to change its contents."),
  visual("javascript-06", "sequence", 2, "Follow a function call in and back out", "The caller asks scale(4, 3) to calculate a new value.", [
    ["Call inputs", "4, 3", "Arguments supply the actual numbers."],
    ["Inside this call", "value = 4; factor = 3", "The parameter names refer to those inputs."],
    ["Return", "4 × 3 = 12", "return sends the number back and ends this call."],
    ["Back at the caller", "result = 12; output: 12", "The caller stores the return, then prints it."],
  ], "Defining scale describes the action; calling scale(4, 3) performs it."),
  visual("javascript-07", "layers", 2, "Follow a property into a nested list", "The character object holds a name, health, and an equipment array.", [
    ["character.name", '"Rowan"', "One text field."],
    ["character.health", "12", "One numeric field."],
    ["character.equipment", '["compass", "rope"]', "This field holds an array, not one piece of text."],
    ["character.equipment[0]", '"compass"', "First choose the equipment property, then position 0."],
  ], "A dot chooses a named property; the array index chooses an entry inside that property."),
  visual("javascript-08", "sequence", 2, "Pass the action now, call it inside", 'welcome(wave, "Noor") receives a function as its first input.', [
    ["Passed into welcome", 'makeMessage = wave; name = "Noor"', "wave is a function value, not a greeting yet."],
    ["Inside welcome", 'makeMessage(name) → wave("Noor")', "Parentheses call the supplied function."],
    ["wave returns", '"Hi, Noor!"', "The function builds the text."],
    ["welcome returns it too", 'greeting = "Hi, Noor!"', "The same string travels back to the original caller."],
  ], "Changing the callback changes the greeting while welcome can stay the same."),
  visual("javascript-09", "sequence", 2, "Read fields, then build a sentence", "player begins as { name: " + '"Zoe", score: 27' + " }.", [
    ["Read the object", 'name = "Zoe"; score = 27', "Destructuring reads the two properties."],
    ["Insert into text", '"Zoe earned 27 stars."', "The template produces a new string."],
    ["Use score as a number", "score + 3 → 30", "Putting 27 in a sentence did not turn score into text."],
  ], "Formatting creates a string while the original score remains the number 27."),
  visual("javascript-10", "sequence", 4, "Each stage changes the shape of the answer", "Use the explanation's input minutes [10, 30, 40].", [
    ["filter: keep at least 30", "[30, 40]", "10 fails the condition."],
    ["map: multiply each by 60", "[1800, 2400] seconds", "The two kept entries become new values."],
    ["reduce: add from 0", "0 + 1800 + 2400 = 4200", "Many numbers become one total."],
    ["Average", "4200 ÷ 2 = 2100 seconds", "Divide by the kept count, not the original count."],
  ], "The source [10, 30, 40] stays unchanged; an empty result uses average: null."),
  visual("javascript-11", "sequence", 4, "From a keystroke to the preview", "Suppose the name input changes from Noor to Mina while color stays purple.", [
    ["The field changes", 'name input value: "Mina"', "The browser emits an input event."],
    ["The listener runs", "updatePreview()", "It reads the current name and color fields."],
    ["The paragraph changes", 'textContent: "Mina"; style.color: "purple"', "The preview now uses the newest values."],
  ], "Register updatePreview without calling it; the browser calls it when the event happens.", "The separate initial updatePreview() call fills the preview before any editing."),
  visual("javascript-12", "compare", 4, "A scoped search leaves the other list alone", 'The page has #books with "River Tales" and #other with "Leave this here".', [
    ["Search scope", '"#books li"', "Only list items inside #books are candidates."],
    ["Match found", 'title === "River Tales"', "Remove that one matching node from #books."],
    ["Other list afterward", '"Leave this here"', "It was never inside the search scope."],
    ["No matching title", "find returns undefined", "The if guard avoids trying to remove a missing node."],
  ], "Choose the container before choosing the matching item; a page-wide li search is a different operation."),
  visual("javascript-13", "sequence", 2, "Measure the gap between two timestamps", "Both timestamps are supplied in the same time units.", [
    ["Before the signal", "startedAt = null; elapsed = null", "No round has begun."],
    ["signal(2000)", "startedAt = 2000", "Remember the start rather than counting loop iterations."],
    ["clickAt(2180)", "2180 − 2000 = 180", "The result is the difference, not the second timestamp."],
    ["Stored result", "elapsed = 180", "If the inputs are milliseconds, this is 180ms."],
  ], "A click before any signal must leave elapsed unset; reset returns both values to null."),
  visual("javascript-14", "branch", 4, "Loading has two honest outcomes", "The card starts idle and calls its supplied data loader.", [
    ["Start a load", 'status: "loading"', "The answer is not available yet."],
    ["Promise fulfills", 'status: "success", title: "Moon Notes"', "Keep the returned data."],
    ["Promise rejects instead", 'status: "error", message: "Try again later"', "await throws into catch; the success assignment is skipped."],
  ], "A rejected promise is an error state, not a successful empty card.", "This fixture demonstrates outcomes without making a network request."),
  visual("javascript-15", "compare", 2, "Two characters, one targeted change", "new Character creates Fern with 14 health and Ash with 11.", [
    ["Fern before", "health: 14", "fern refers to the first instance."],
    ["Call fern.takeDamage(4)", "14 − 4 = 10", "this refers to Fern during this method call."],
    ["Fern after", "health: 10", "Only this instance's field changes."],
    ["Ash afterward", "health: 11", "The separate instance receives no damage."],
  ], "Separate constructor calls create separate characters; assigning a second name to Fern would not."),
  visual("javascript-16", "layers", 2, "Split the calculation from its display", "The local CommonJS example puts reusable code in totals.js.", [
    ["totals.js", "sumDurations(values)", "Defines the calculation and exports the function; no report is printed here."],
    ["Caller file", 'require("./totals.js")', "Loads the neighboring module's exported function."],
    ["A worked call", "sumDurations([20, 30, 10]) → 60", "The function returns a number."],
    ["Report text", '"Total minutes: 60"', "The caller chooses how to display the returned total."],
  ], "A reusable module can calculate without deciding when or where to print.", "This file split uses CommonJS in Node, not a browser script or an ES-module-only project."),
  visual("javascript-17", "sequence", 2, "Watch the search queue, not just the final path", "P connects to Q and R. Both Q and R connect to S.", [
    ["Visit P", "Queue becomes [Q, R]", "Mark Q and R seen when adding them."],
    ["Visit Q", "Queue becomes [R, S]", "Save S's first path: P → Q → S."],
    ["Visit R", "Queue stays [S]", "S is already seen, so do not add it again."],
    ["Visit S", "Path: P → Q → S; visited: 4", "Stop when the target is taken from the queue."],
  ], "The returned path has three nodes even though the search visited four.", "Fewest-edge paths are shortest only when every edge has equal weight."),
  visual("javascript-18", "sequence", 2, "Newest request wins even if it finishes first", "Start search 1, then search 2 before either response arrives.", [
    ["Search 1 starts", "latestId = 1", "Its result may update the screen for now."],
    ["Search 2 starts", "latestId = 2; cancelledIds includes 1", "Search 1 is now outdated."],
    ["Response 2 arrives", 'visibleResult = "mountain answer"', "2 matches the current request ID."],
    ["Response 1 arrives late", '"river answer" is ignored', "The visible result remains mountain answer."],
  ], "Arrival order is not the authority; the current request ID is.", "Marking an ID cancelled in a set does not itself stop a real network request."),
  visual("javascript-19", "branch", 4, "Reject unsuitable values before adding", "The total function accepts arrays of finite, nonnegative numbers.", [
    ["Valid numbers", "[4, 6, 0] → 10", "Zero is a valid number in this contract."],
    ["Empty array", "[] → 0", "The reducer begins at zero."],
    ["Numeric-looking text", '["4"] → TypeError', 'A string does not satisfy typeof v === "number".'],
    ["Other invalid values", "[-1], [NaN], [Infinity] → TypeError", "Bad data must not become a plausible-looking total."],
  ], "Validation decides whether calculation is allowed; it is not automatic conversion."),
  visual("javascript-20", "compare", 2, "Trim the edges, preserve the name", "Compare the typed string with the new string returned by trim().", [
    ["Before", '"  River Park  "', "Two spaces at each edge; one between the words."],
    ["After trim()", '"River Park"', "The internal space remains."],
    ["Original afterward", '"  River Park  "', "Strings are not changed in place by trim()."],
    ["Spaces-only input", '"   ".trim() → ""', "The badge function uses guest for this empty result."],
  ], "Decide whether a name is missing after trimming, not before."),
  visual("javascript-21", "sequence", 4, "Group repeats under the same key", 'Process names ["pen", "tape", "pen"] in order.', [
    ["First pen", 'Map: pen → 1', "No earlier count, so start at zero and add one."],
    ["Then tape", 'Map: pen → 1; tape → 1', "A new key is added after pen."],
    ["Pen again", 'Map: pen → 2; tape → 1', "Update the existing key without moving its position."],
  ], "Repeated names update one entry; first-seen order remains.", "This example counts occurrences. The supply project adds each row's quantity instead."),
  visual("javascript-22", "compare", 4, "Copy the changed task, share the untouched one", 'Start with a: done false and b: done true. Toggle id "b".', [
    ["Original array", "a: false | b: true", "Must remain unchanged."],
    ["New array", "a: false | b: false", "map returns a new array."],
    ["Task a identity", "changed[0] === tasks[0] → true", "Both arrays point to the same unchanged task."],
    ["Task b identity", "changed[1] === tasks[1] → false", "Spread created a separate object for the changed task."],
  ], "A new array alone does not copy its objects; copy the object whose field you change.", "Object spread is shallow. Nested objects would still be shared unless copied separately."),
  visual("javascript-23", "sequence", 4, "An edit after undo creates a different future", 'The saved versions begin ["A", "B", "C"], with B current.', [
    ["After undo", "A | [B] | C", "Cursor 1 points at B; C is available for redo."],
    ["Keep through the cursor", "A | [B]", "slice(0, cursor + 1) removes the old future C."],
    ["Edit to D", "A | B | [D]", "Append the new text and move the cursor."],
    ["Try redo", "A | B | [D]", "No later version exists; C is no longer on this branch."],
  ], "Undo moves the cursor; a new edit after undo replaces the redo branch."),
  visual("python-01", "sequence", 4, "Build Pepper's introduction from two values", "Follow the complete example without changing its pet or age.", [
    ["Assign the name", 'pet_name = "Pepper"', "pet_name refers to a string, a text value."],
    ["Assign the age", "pet_age = 5", "pet_age refers to an integer, a whole number."],
    ["Build the f-string", 'f"{pet_name} is {pet_age} years old."', "Python evaluates the expressions inside braces and inserts their values."],
    ["print displays", "Pepper is 5 years old.", "The displayed sentence has no surrounding quotation marks."],
  ], "Names refer to values; the f-string creates text from them; print displays that text.", "This is an execution trace, not a literal memory-box diagram. Printing does not change either assigned value."),
  visual("python-02", "compare", 2, "Ask three separate comparison questions", "measurement is 15 and limit is 18 throughout the example.", [
    ["Below the limit", "15 < 18 → True", "The smaller number passes this test."],
    ["Exactly at the limit", "15 == 18 → False", "Double equals compares values."],
    ["Above the limit", "15 > 18 → False", "The first number is not greater."],
    ["A different type", '"18" == 18 → False', "Text and a number are different here."],
  ], "Comparing does not reassign either name.", 'Ordering "18" < 18 raises TypeError; it does not return False.'),
  visual("python-03", "branch", 2, "The exact boundary chooses a branch", "light_reminder asks whether brightness is less than 40.", [
    ["Input 25", '25 < 40 → True → "Turn on a lamp"', "Take the if branch."],
    ["Input 39", '39 < 40 → True → "Turn on a lamp"', "Still below the boundary."],
    ["Input 40", '40 < 40 → False → "Enough light"', "Equality goes to else."],
    ["Input 41", '41 < 40 → False → "Enough light"', "Above the boundary also goes to else."],
  ], "Less than excludes the boundary itself; changing < to <= would change the answer at 40."),
  visual("python-04", "sequence", 2, "The indented line repeats; the final line does not", 'days is ["Monday", "Wednesday", "Friday"].', [
    ["First visit", "Monday: drawing", "day refers to Monday for this iteration."],
    ["Second visit", "Wednesday: drawing", "The same print runs with a new day value."],
    ["Third visit", "Friday: drawing", "This is the final item in the list."],
    ["After the loop", "Schedule finished", "The unindented print runs once."],
  ], "The list determines the number of visits; indentation determines which instructions repeat."),
  visual("python-05", "collection", 4, "Append adds the next position", 'Start with ["leaf", "stone", "feather"], then append "button".', [
    ["Index 0", '"leaf"', "First item, unchanged."],
    ["Index 1", '"stone"', "Second item, unchanged."],
    ["Index 2", '"feather"', "Third item, unchanged."],
    ["Index 3, also index −1", '"button"', "The new last item; len(items) is 4."],
  ], "The count is 4, but the last nonnegative index is 3. append changes the existing list."),
  visual("python-06", "collection", 4, "A slice includes its start and stops before its end", "values is [3, 6, 9, 12]. Read values[1:3].", [
    ["Index 0: outside", "3", "Before the starting index."],
    ["Index 1: included", "6", "The start is included."],
    ["Index 2: included", "9", "Still before the stop index."],
    ["Index 3: excluded", "12", "The stop is not included."],
  ], "values[1:3] returns the new list [6, 9], not [6, 9, 12].", "A list slice is shallow; this numeric example does not demonstrate nested-object copying."),
  visual("python-07", "sequence", 4, "Text cleanup and word splitting do different jobs", 'The original text is "  Make   Art  ".', [
    ["strip()", '"Make   Art"', "Remove outside spaces; retain the three inside."],
    ["lower()", '"make   art"', "Change letter case in a new string."],
    ["split()", '["make", "art"]', "Whitespace splitting forms a separate list of two words."],
    ["Return the pair", "('make   art', 2)", "The cleaned text retains its internal spaces; the word count is 2."],
  ], "Splitting for a count does not join the cleaned string back together or change it in place."),
  visual("python-08", "collection", 2, "One input amount becomes one scaled amount", "scale([1, 0.5, 4], 3) builds a fresh result list.", [
    ["First amount", "1 × 3 → 3", "Append 3 to scaled."],
    ["Second amount", "0.5 × 3 → 1.5", "Append 1.5 after 3."],
    ["Third amount", "4 × 3 → 12", "Append 12 last."],
    ["Return after the loop", "[3, 1.5, 12]", "The original stays [1, 0.5, 4]."],
  ], "Returning after the loop processes every amount; returning inside it would end the first call too early."),
  visual("python-09", "collection", 4, "Sets keep unique members, not repeated positions", "Compare the two sets of metal names in the explanation.", [
    ["First set", '{"gold", "silver"}', "Two distinct members."],
    ["Second set", '{"silver", "copper"}', "Two distinct members."],
    ["In both: first & second", '{"silver"}', "One shared member, so len(shared) is 1."],
    ["Repeated input", '{"nature", "art", "nature"} → 2 members', "Repeating nature does not add a third unique member."],
  ], "Set membership and intersection do not depend on display order.", "A set has no index 0; use a list or tuple when positional order matters."),
  visual("python-10", "collection", 2, "Both tests must pass before a number is kept", "Keep even numbers greater than 5 from [1, 4, 7, 10, 12].", [
    ["1", "Odd; not above 5 → leave out", "Fails both requirements."],
    ["4", "Even; not above 5 → leave out", "Passing one test is not enough."],
    ["7", "Odd; above 5 → leave out", "The other test still fails."],
    ["10 and 12", "Even AND above 5 → keep both", "The new list is [10, 12]."],
  ], "The comprehension keeps the original qualifying values and leaves the input list unchanged."),
  visual("python-11", "compare", 2, "self identifies which session changes", 'first is Session("Nature", 15); second is Session("Art", 25).', [
    ["Before", "first.minutes: 15 | second.minutes: 25", "Two separate initializer calls created two objects."],
    ["first.add_minutes(8)", "self is first; amount is 8", "The method reads and updates first.minutes."],
    ["After", "first.minutes: 23 | second.minutes: 25", "The Art session has not changed."],
  ], "A method call acts on its receiving instance, not on every instance of the class.", "If two names refer to the same instance, they see the same changed object."),
  visual("python-12", "branch", 2, "The same request can use different implementations", "send_notice asks the supplied object to announce().", [
    ["Supply BellNotice()", 'announce() → "Ring a bell"', "The bell object's method runs."],
    ["Supply LightNotice()", 'announce() → "Flash a light"', "The light object's method runs."],
    ["Supply an object without announce", "AttributeError", "Sharing a method name is a real requirement, not a wish."],
  ], "send_notice can stay unchanged because the supplied object provides the matching behavior.", "These classes share an interface by behavior; the example does not require inheritance."),
  visual("python-13", "layers", 2, "Import the reusable calculation, then choose a display", "measurement_toolkit.py defines the conversion; another file calls it.", [
    ["Inside the module", "MILES_PER_KILOMETER = 0.621371", "Both conversion functions use this shared factor."],
    ["A caller's input", "km_to_miles(10)", "Supply 10 kilometers to the imported function."],
    ["Returned calculation", "10 × 0.621371 = 6.21371", "The module returns a number rather than printing a report."],
    ["Caller chooses rounding", "round(6.21371, 2) → 6.21", "Display can be decided separately from conversion."],
  ], "A module organizes reusable definitions; importing it is not the same thing as calling every function.", "Floating-point conversions are approximate. round returns a number, not guaranteed fixed-width text."),
  visual("python-14", "branch", 4, "Fail at the right check, with the right message", "parse_percent accepts numbers from 0 through 50 in this explanation.", [
    ["None or empty text", "Please enter a value", "Return before trying numeric conversion."],
    ["'many'", "Enter a number", "float cannot parse it; catch the expected exception."],
    ["'50'", "Accepted: 50", "Conversion succeeds and the upper boundary is included."],
    ["'51'", "Value must be from 0 to 50", "Valid numeric text can still fail the allowed range."],
  ], "Missing input, conversion errors, and out-of-range values are different problems."),
  visual("python-15", "sequence", 2, "Update two totals as values arrive", "The generator doubles [1, 4, 6] one value at a time.", [
    ["Before iteration", "count = 0; total = 0", "No values have been consumed."],
    ["Yield 2", "count = 1; total = 2", "The first input 1 was doubled."],
    ["Yield 8", "count = 2; total = 10", "Add the doubled 4 to the running total."],
    ["Yield 12", "count = 3; total = 22", "Return (3, 22); no transformed list was required."],
  ], "The summary consumes each yielded value once and keeps only a count and total.", "The source collection still exists; sys.getsizeof measures shallow size, not total program memory."),
  visual("python-16", "sequence", 4, "Concurrent work can finish in a different order", 'gather starts collect(["timeout", "complete"]) and collect(["error"]).', [
    ["Both begin", "Collector A: slow attempt | Collector B: quick error", "Their waits can overlap."],
    ["B finishes first", 'B returns "failed"', "It does not retry the explicit error forever."],
    ["A times out and retries", 'A eventually returns "complete"', "A uses no more than its two allowed attempts."],
    ["gather returns", '["complete", "failed"]', "Results remain in input order, not finishing order."],
  ], "Concurrency changes when work progresses; gather's result order still follows its arguments.", "Timeout requests cancellation; finishing cancellation can exceed the nominal timeout. Timing is not exact."),
  visual("python-17", "compare", 2, "Clamp keeps values inside inclusive bounds", "Use the explanation's low = 2 and high = 8.", [
    ["Below: −4", "clamp(-4, 2, 8) → 2", "Raise a too-small value to the lower bound."],
    ["Inside: 5", "clamp(5, 2, 8) → 5", "Keep an already allowed value."],
    ["Above: 12", "clamp(12, 2, 8) → 8", "Lower a too-large value to the upper bound."],
    ["Invalid bounds", "clamp(5, 8, 2) → ValueError", "Reject low > high instead of pretending the interval exists."],
  ], "Tests need the inside, both outside directions, both boundaries, and the invalid-bound case."),
  visual("python-18", "collection", 4, "An even-sized sample has two middle positions", "The sorted values are [2, 6, 8, 12], with count 4 and mid 2.", [
    ["Index 0", "2", "Outside the central pair."],
    ["Index 1: mid − 1", "6", "First middle value."],
    ["Index 2: mid", "8", "Second middle value."],
    ["Index 3", "12", "Outside the central pair."],
  ], "Median = (6 + 8) ÷ 2 = 7. It need not be one of the observed values.", "This describes the supplied sample, not a claim about a population or cause."),
  visual("python-19", "layers", 4, "A package description is not an installation", "Read the supplied pyproject.toml as configuration, not Python instructions.", [
    ["Package identity", 'name = "practice-tool"; version = "0.1.0"', "Names this project and release."],
    ["Required interpreter", 'requires-python = ">=3.10"', "The tool still needs a compatible Python installation."],
    ["Third-party runtime packages", "dependencies = []", "No external runtime package is declared for this example."],
    ["Actual calculation", "highest_reading([14, 21, 16]) → 21", "max is built in, so this operation needs no third-party package."],
  ], "Metadata records requirements; writing it does not itself install a runtime or a dependency."),
  visual("python-20", "branch", 2, "Check the reply before reading its titles", "The practice reader receives a status and a payload, not automatically trustworthy data.", [
    ["Status 503", '{"error": "Service unavailable"}', "Stop at the status check."],
    ["Status 200, payload {}", '{"error": "Missing results"}', "Success status alone does not supply the required list."],
    ["Status 200, title is 7", '{"error": "Invalid result"}', "Each result needs a string title."],
    ["Status 200, title is Forest Notes", '["Forest Notes"]', "Only validated entries reach the title list."],
  ], "A successful HTTP status and a correctly shaped body are separate requirements.", "These supplied fixtures do not make a live API request."),
  visual("python-21", "branch", 4, "Translate private-API statuses into safe messages", "The fixture handles statuses without displaying or holding a credential.", [
    ["503", "Service could not complete request", "A general service failure does not mean signed out."],
    ["200", "Data loaded", "The status function chooses the successful message."],
    ["401", "Please sign in again", "Authentication needs attention."],
  ], "Show useful status information without copying credentials into messages or logs.", "A status-to-message fixture is not a complete authentication implementation."),
  visual("python-22", "branch", 4, "Choose the word before building the label", "ticket_label chooses singular only when count == 1.", [
    ["count = 0", 'word: "tickets" → "0 tickets"', "Zero uses the plural for this English label."],
    ["count = 1", 'word: "ticket" → "1 ticket"', "Only this count uses the singular."],
    ["count = 3", 'word: "tickets" → "3 tickets"', "Several uses the plural."],
  ], "Your shelf label follows the same branch: Pencil: 1 item, but Pencil: 3 items.", "This rule belongs to the exercise's English text, not every language's plural system."),
  visual("python-23", "sequence", 4, "Validate numeric text before converting it", 'The quantity field contains " 003 ".', [
    ["Trim the field", '" 003 " → "003"', "Remove only outside whitespace."],
    ["Check nonempty ASCII digits", '"0", "0", "3" all belong to "0123456789"', "This string satisfies the project's exact contract."],
    ["Convert after validation", 'int("003") → 3', "The parsed quantity is now an integer."],
    ["Rejected alternative", '"2.5" → reject row', "A decimal point is not an accepted digit; do not convert it as a count."],
  ], "CSV fields begin as strings. Quoted commas need a CSV parser, and quantities still need validation."),
  visual("python-24", "sequence", 4, "Two reading sessions can describe one book", 'The two Python records are {"book": "Hill", "pages": 4} and {"book": "Hill", "pages": 6}.', [
    ["Before", "by_book = {}", "No book names have been seen."],
    ["First Hill session", '{"Hill": 4}', "Start the name at zero, then add 4."],
    ["Second Hill session", '{"Hill": 10}', "Add 6 to the same key, not a second book."],
    ["Summary", "books: 1; pages: 10", "Count dictionary keys for books, sum its values for pages."],
  ], "Session count and distinct-book count are different; repeated exact names share one total."),
  visual("python-25", "sequence", 2, "Finish the prerequisite before its dependent task", 'tasks = {"paint": ["sand"], "sand": []}; start by visiting paint.', [
    ["Enter paint", "paint waits for sand", "Do not add paint to the result yet."],
    ["Enter sand", "sand has no prerequisites", "It can be completed immediately."],
    ["Finish sand", '["sand"]', "Mark it finished and append it once."],
    ["Return to paint", '["sand", "paint"]', "Now every prerequisite of paint is finished."],
  ], "Following dependencies goes inward first; adding completed tasks happens while returning.", "This small trace assumes no cycle. The project must reject missing tasks and detect revisiting an unfinished task."),
  visual("sql-01", "sequence", 3, "Filter rows before showing the sorted answer", "demo_books contains Ocean Map/unread, Apple Tree/read, and Cloud Diary/unread.", [
    ["Keep status = 'unread'", "Ocean Map | Cloud Diary", "Apple Tree is removed by the filter."],
    ["Select only title", "Ocean Map | Cloud Diary", "The status column is not in the returned answer."],
    ["ORDER BY title ASC", "Cloud Diary | Ocean Map", "Alphabetical output order is requested explicitly."],
  ], "Apple Tree does not reappear just because its title would sort first.", "This is a logical result trace, not a claim about the database engine's physical execution plan."),
  visual("sql-02", "compare", 3, "See exactly which table rows change", "Apply the explanation's INSERT, two UPDATEs, and DELETE to demo_collection.", [
    ["id 1", "Stones: 6 → Stones: 7", "Increment the count; keep its name."],
    ["id 2", "Tickets: 2 → Train tickets: 2", "Rename the row; keep its count."],
    ["id 3", "Ribbons: 4 → removed", "DELETE targets this row only."],
    ["id 4", "No row → Pins: 3", "INSERT creates a new row."],
  ], "WHERE selects the affected rows; SET selects the fields to change."),
  visual("sql-03", "collection", 3, "AND keeps only the row that passes both tests", "The query requires difficulty = 'easy' AND minutes <= 8.", [
    ["Draw a leaf", "easy: yes | 8 minutes: yes → keep", "Both conditions are true."],
    ["Build a bridge", "hard: no | 8 minutes: yes → reject", "The time alone is not enough."],
    ["Read a chapter", "easy: yes | 18 minutes: no → reject", "The difficulty alone is not enough."],
  ], "The answer contains only Draw a leaf; OR would keep all three of these rows."),
  visual("sql-04", "collection", 3, "Unknown minutes do not become zero minutes", "Group the example's four session rows by subject.", [
    ["Art input", "12, 24", "Two known durations."],
    ["Art summary", "COUNT(minutes): 2 | SUM: 36 | AVG: 18", "36 divided by two known values."],
    ["Music input", "18, NULL", "Two rows, but only one known duration."],
    ["Music summary", "COUNT(minutes): 1 | SUM: 18 | AVG: 18", "The missing duration is excluded from the denominator."],
  ], "COUNT(*) counts rows; COUNT(minutes) counts known durations. Those counts need not match."),
  visual("sql-05", "collection", 3, "A left join preserves the bookless author", "Start from authors, then match books by author ID.", [
    ["Nora, first matching book", "Garden Gate", "One author can produce multiple result rows."],
    ["Nora, second matching book", "Sea Path", "Nora's name repeats because another book matches."],
    ["Luis", "Sky Notes", "One matching book gives one joined row."],
    ["Imani", "NULL", "No book matches, but the left-side author is retained."],
  ], "LEFT JOIN preserves Imani without inventing a stored book row.", "A later WHERE on the right-side title can remove this unmatched result again."),
  visual("sql-06", "compare", 3, "Compare each score with its own subject", "Art has 50, 70, 60; Music has 100, 80.", [
    ["Art reference", "(50 + 70 + 60) ÷ 3 = 60", "Use this average for every Art row."],
    ["Art result", "Leo: 70 > 60 → keep", "Nia's 50 and Uma's exact-average 60 do not pass."],
    ["Music reference", "(100 + 80) ÷ 2 = 90", "Use this different average for Music."],
    ["Music result", "Nia: 100 > 90 → keep", "Leo's 80 is not above his Music group average."],
  ], "The correlated subject condition ties the inner average to the current outer row's subject."),
  visual("sql-07", "collection", 3, "Tied ranks are not a running total", "Use the three Art rows in chronological display order: 10, 25, 25 minutes.", [
    ["Art, first day", "10 minutes | running total 10 | rank 3", "Two longer rows take the first two ranking positions."],
    ["Art, second day", "25 minutes | running total 35 | rank 1", "One of the tied largest durations."],
    ["Art, third day", "25 minutes | running total 60 | rank 1", "The tie keeps rank 1; the next rank has a gap."],
    ["Music, its first day", "8 minutes | running total 8 | rank 1", "A separate partition restarts the calculations."],
  ], "Each window chooses its own order; the final ORDER BY chooses how rows appear on the screen."),
  visual("sql-08", "layers", 3, "An index organizes keys to match this question", "The query asks for the first two history titles in alphabetical order.", [
    ["First index key: genre", "fiction | history", "The filter can narrow to the history group."],
    ["Inside the history group", "Ancient Roads | Stone Cities | Trade Routes", "The second key, title, is already ordered within the genre."],
    ["LIMIT 2 result", "Ancient Roads | Stone Cities", "The requested answer stays the same with or without the index."],
    ["What to inspect", "EXPLAIN QUERY PLAN", "Check whether SQLite actually selects the index."],
  ], "A matching index can reduce search or sorting work without changing the query's meaning.", "An index costs space and write work; it does not guarantee a particular elapsed time or plan."),
  visual("sql-09", "sequence", 3, "Rollback restores both sides of a transfer", "After the first committed transfer, X has 8 and Y has 9.", [
    ["BEGIN", "X: 8 | Y: 9 | total: 17", "Start another transaction."],
    ["Subtract 2 from X", "X: 6 | Y: 9", "This is an intermediate state inside the transaction."],
    ["Add 2 to Y", "X: 6 | Y: 11 | total: 17", "Both edits have run, but are not committed."],
    ["ROLLBACK", "X: 8 | Y: 9 | total: 17", "Both edits are cancelled together."],
  ], "A transaction gives a boundary for committing or reversing the related writes.", "A SQL error does not always roll back the entire transaction automatically; real code must handle failure."),
  visual("sql-10", "sequence", 4, "Remove missing entries, then remove duplicates", "The input labels are 'A', NULL, '', 'A', and 'B'.", [
    ["Original rows", "A | NULL | empty string | A | B", "Missing, empty, and repeated values are distinct issues."],
    ["WHERE filters", "A | A | B", "IS NOT NULL and <> '' remove the unwanted rows."],
    ["DISTINCT", "A | B", "Repeated selected values collapse to one result each."],
    ["ORDER BY name", "A, then B", "Request the result order explicitly."],
  ], "The view saves this query, not an independent copy of today's result rows."),
  visual("sql-11", "sequence", 4, "Clean empty text before choosing a fallback", "Email is three spaces; phone is ' 555 0100 '.", [
    ["Trim the email", "'   ' → ''", "No non-space content remains."],
    ["NULLIF email with ''", "'' → NULL", "Now COALESCE can recognize it as missing."],
    ["Clean the phone", "' 555 0100 ' → '555 0100'", "Keep the internal space."],
    ["COALESCE chooses", "555 0100", "Email is missing, so use the phone before the written fallback."],
  ], "COALESCE skips NULL, not plain empty strings; cleaning establishes the missing-value rule.", "Choosing a contact value does not prove it is valid or reachable."),
  visual("sql-12", "collection", 2, "Each order contributes differently to each summary", "The rows are paid 300 cents, pending 500 cents, and paid 200 cents.", [
    ["paid, 300 cents", "Order count +1 | paid count +1 | paid cents +300", "This row contributes to all three measures."],
    ["pending, 500 cents", "Order count +1 | paid count +0 | paid cents +0", "It remains an order without becoming paid revenue."],
    ["paid, 200 cents", "Order count +1 | paid count +1 | paid cents +200", "Add only its paid amount."],
    ["Totals", "3 orders | 2 paid | 500 paid cents", "CASE chooses each contribution before SUM combines them."],
  ], "Filtering unpaid rows out with WHERE would lose them from the total-order count."),
  visual("sql-13", "layers", 4, "Build a child's path from its parent", "The example starts with parent ID 1, path Home, depth 0.", [
    ["Root", "id 1: Home | depth 0", "The root begins with its own name."],
    ["Child row", "id 2: Notes | parent_id 1", "The ID connects Notes to the correct parent."],
    ["Expanded path", "Home + '/' + Notes → Home/Notes", "SQLite's || joins those text parts."],
    ["Expanded depth", "0 + 1 → 1", "The child is one level below its parent."],
  ], "The recursive query repeats this parent-to-child expansion for each level and each root.", "The task supplies an acyclic forest; arbitrary cycles require additional safeguards."),
  visual("swift-01", "sequence", 3, "Convert the number type, then the distance", "The explanation supplies 7 miles and a practice factor of 1.6 kilometers per mile.", [
    ["Whole-number input", "miles: Int = 7", "The original constant remains an Int."],
    ["Numeric conversion", "Double(miles) → 7.0", "Create a decimal-capable value for this calculation."],
    ["Distance conversion", "7.0 × 1.6 = 11.2 kilometers", "Multiply by the stated kilometers-per-mile factor."],
    ["Another call's arithmetic", "5.0 × 1.6 = 8.0 kilometers", "The same rule works with a different distance."],
  ], "Converting Int to Double changes the numeric representation; multiplying changes the unit quantity.", "1.6 is the supplied practice factor; binary floating-point results can be approximate."),
  visual("swift-02", "compare", 4, "Assignment stores an answer; comparison asks a question", "boundary is 10 and candidate is 13.", [
    ["candidate > boundary", "13 > 10 → true", "Store this Bool as isAbove."],
    ["candidate == boundary", "13 == 10 → false", "Store this Bool as isEqual."],
    ["candidate < boundary", "13 < 10 → false", "Store this Bool as isBelow."],
  ], "The comparisons do not change candidate or boundary; = in the declarations stores their results."),
  visual("swift-03", "branch", 1, "A switch chooses one craft's supplies", "supplies(for:) compares the input String with each supported case.", [
    ['"drawing"', "Bring pencils and paper.", "Matches the drawing case."],
    ['"knitting"', "Bring yarn and needles.", "Matches the knitting case."],
    ['"origami"', "Bring square paper.", "Matches the origami case."],
    ['"unknown"', "Choose a craft for a supply suggestion.", "Matches no case, so default answers."],
  ], "A matching Swift case does not automatically fall through into the next case.", 'String matching is exact here: "Drawing" is not "drawing".'),
  visual("swift-04", "compare", 4, "One punctuation change includes another value", "Both loops begin at 4, but only one includes its upper endpoint 6.", [
    ["Closed: 4...6", "[4, 5, 6]", "Includes 4 and 6: three visits."],
    ["Half-open: 4..<6", "[4, 5]", "Includes 4 but stops before 6: two visits."],
    ["Project countdown", "(1...3).reversed() → 3, 2, 1", "Reverse the closed range; print Done! after the loop."],
  ], "A range's upper-bound rule affects both the visited values and the iteration count."),
  visual("swift-05", "sequence", 4, "removeAll removes every match", 'Start tokens as ["blue", "red", "blue"].', [
    ["Before", '["blue", "red", "blue"]', "Two positions contain the same text."],
    ['append("green")', '["blue", "red", "blue", "green"]', "The new value goes at the end."],
    ['removeAll where value == "blue"', '["red", "green"]', "Both blue entries are removed."],
    ["Read count", "2", "The remaining entries keep their relative order."],
  ], "removeAll with an equality condition is not a remove-first operation."),
  visual("swift-06", "sequence", 4, "A returned value can feed the next calculation", "cupsNeeded(4, cupsPerBatch: 3) receives two Double inputs.", [
    ["Inputs", "batches = 4; cupsPerBatch = 3", "The argument label explains the factor's meaning."],
    ["Function result", "4 × 3 → 12 cups", "The single expression is returned."],
    ["Caller stores it", "cups = 12", "The result is available for reuse."],
    ["Add one spare cup", "extraCups = 12 + 1 → 13", "This calculation happens after the function returns."],
  ], "Returning a number lets the caller calculate with it; printing alone would not provide that return value.", "Double does not track physical units for you; names and consistent factors give the numbers meaning."),
  visual("swift-07", "layers", 4, "Two names can point to one class instance", "original = Counter(), sameObject = original, and separate = Counter().", [
    ["Shared instance", "original and sameObject → Counter A", "Assignment copies the reference, not the object."],
    ["Independent instance", "separate → Counter B", "A new initializer call creates a different object."],
    ["sameObject.increase()", "Counter A total: 0 → 1", "Reading original.total now also gives 1."],
    ["Untouched object", "Counter B total: 0", "separate.total stays zero."],
  ], "Reference sharing and separate construction produce different change behavior.", "let prevents replacing a class reference, not changing the instance's var properties."),
  visual("swift-08", "branch", 1, "An optional note can be present or absent", "The ?? operator supplies text only when the optional has no value.", [
    ["Astoria visit", "note: nil", "No note was supplied."],
    ["Astoria display", 'nil ?? "No extra note" → "No extra note"', "Use the fallback."],
    ["Bend visit", 'note: "Bring a jacket"', "A note is present."],
    ["Bend display", '"Bring a jacket"', "Keep the supplied note rather than the fallback."],
  ], "nil is absence, not the empty string. ?? avoids force-unwrapping a missing note."),
  visual("swift-09", "sequence", 4, "A button action changes the data behind the screen", 'Suppose draft is "  Notice a cloud  " and observations is [].', [
    ["Read the bound text", 'draft: "  Notice a cloud  "', "The TextField's binding keeps draft current."],
    ["Clean and check", 'cleaned: "Notice a cloud"', "The nonempty value passes the guard."],
    ["Update local state", 'observations: ["Notice a cloud"]; draft: ""', "Append once and clear the input."],
    ["SwiftUI updates the view", "One list row; an empty text field", "The screen reflects the new state."],
  ], "The action changes state, and SwiftUI derives the displayed list from that state.", "This local @State list is not durable storage across app launches."),
  visual("swift-10", "sequence", 4, "Protect both the current screen and stored data", "Request 1 starts, then request 2 becomes current before request 1 finishes.", [
    ["Start request 2", "current requestID = 2", "Ask the earlier task to cancel."],
    ["Request 2 completes", "2 == current → accept", "Store request 2's entries and display them."],
    ["Late request 1 tries to finish", "1 != current → ignore", "The loader's equality guard prevents a stale screen update."],
    ["Actor's extra guard", "stored requestID 2; incoming 1 → reject", "The store also refuses an older replacement."],
  ], "Cancellation reduces unnecessary work; request IDs decide which results may still change state.", "Cancellation is cooperative. Actors isolate access but do not, by themselves, make stale replies current."),
  visual("swift-11", "sequence", 4, "Trace a saved entry out to disk and back", "The example saves Geography with 25 minutes using ReadingEntry.", [
    ["In-memory model", 'ReadingEntry(title: "Geography", minutes: 25)', "A typed Swift value."],
    ["Encode", '[{"title":"Geography","minutes":25}] as JSON bytes', "JSON key order can vary without changing the data."],
    ["Write, then read the file", "reading-example.json → Data", "The bytes survive this process ending if the file remains."],
    ["Decode the expected type", "[ReadingEntry] equal to the original array", "A wrong shape or corrupt file can throw instead."],
  ], "Encoding is not saving by itself; writing the bytes creates the persistent file.", "The example uses a temporary directory, not a guarantee of permanent user storage."),
  visual("swift-12", "compare", 4, "Compare equal search positions, not just list sizes", "The measured algorithm scans from the first element and counts every comparison.", [
    ["First item in 6 values", "search 0 → index 0; comparisons 1", "It can stop immediately."],
    ["Last item in 6 values", "search 5 → index 5; comparisons 6", "Every value is examined."],
    ["Last item in 12 values", "search 11 → index 11; comparisons 12", "Twice the input causes twice the worst-case work."],
    ["Absent from 6 values", "search −1 → nil; comparisons 6", "Failure still needs to inspect all entries."],
  ], "Compare last-item with last-item to measure growth fairly; first-item with last-item changes two things.", "Comparison counts describe work, not a guaranteed elapsed time."),
  visual("typescript-01", "layers", 1, "The type describes the shape; the object carries values", "Runner requires a text name and numeric laps.", [
    ["Type requirement", "Runner: name is string; laps is number", "The interface does not itself create a runner."],
    ["Actual object", '{ name: "Ivy", laps: 4 }', "Both fields match the requirements."],
    ["Function return", '"Ivy completed 4 laps."', "describeRunner reads this object's values."],
    ["Wrong-type alternative", '{ name: "Ivy", laps: "4" }', "The compiler rejects text where a number is required."],
  ], "Types help check your code before running; values are what the running function uses.", "A TypeScript annotation is not runtime validation of an unknown API response."),
  visual("typescript-02", "branch", 3, "The kind field unlocks the matching detail", "A Session is either Drawing or Singing, each with title and minutes.", [
    ["kind: 'draw'", "Birds | pictures: 3", "The branch can read session.pictures."],
    ["Drawing result", '"Birds: 3 pictures."', "The early return finishes this branch."],
    ["kind: 'sing'", "Warmup | songs: 2", "The remaining branch can read session.songs."],
    ["Singing result", '"Warmup: 2 songs."', "Do not try to read pictures on this shape."],
  ], "The check narrows the whole object shape, not just the text value of kind.", "The & type operator combines field requirements; it does not merge objects at runtime."),
  visual("typescript-03", "sequence", 3, "Session rewards and accumulated points are different", "A new Student begins with points 0. Each complete ten-minute chunk earns one point.", [
    ["First award: 37 minutes", "floor(37 ÷ 10) = 3 earned", "points increases from 0 to 3; the method returns 3."],
    ["Next award: 9 minutes", "floor(9 ÷ 10) = 0 earned", "points stays 3; the method returns 0."],
    ["Read the stored total", "student.points → 3", "This is accumulated points, not just the last reward."],
  ], "award returns the current session's reward while this.points keeps the running total.", "The enum identifies a category; this lesson's rule gives both categories the same multiplier."),
  visual("typescript-04", "collection", 3, "One collection design preserves different item types", "Shelf<T> substitutes its chosen item type consistently in add and first.", [
    ["Shelf<number>", "add(11); add(22); first() → 11", "Return type is number | undefined."],
    ["Shelf<string>", 'add("amber"); first() → "amber"', "Return type is string | undefined."],
    ["Empty Shelf<number>", "first() → undefined", "Absence is possible even though every present item is a number."],
    ["A present zero", "0 !== undefined → true", "Check absence explicitly so zero is not mistaken for missing."],
  ], "The generic connects input and output types; using any would discard that connection.", "TypeScript private is an access check for code, not a security boundary for secrets."),
  visual("typescript-05", "collection", 4, "Keep each event name paired with its own payload", "The mapped type builds one valid whole-object shape per Details key.", [
    ["selected variant", '{ type: "selected", payload: { label: "Cedar" } }', 'The handler returns "Selected Cedar".'],
    ["counted variant", '{ type: "counted", payload: { count: 6 } }', 'The handler returns "Count 6".'],
    ["Mismatched pair", '{ type: "selected", payload: { count: 6 } }', "Rejected: the selected event needs label, not count."],
  ], "The union preserves the relationship between name and payload instead of allowing every combination.", "Mapped and conditional types build compile-time types, not runtime loops or validation."),
  visual("typescript-06", "branch", 3, "unknown becomes usable only after real checks", "The guard checks that a Reading has a text label and finite nonnegative amount.", [
    ["Milk with amount 3", "Accepted → amount + 2 is 5", "Both the shape and numeric rules pass."],
    ["Milk with amount '3'", "Rejected: numeric text", "The guard does not silently convert it."],
    ["Milk with amount −2", "Rejected: below zero", "The number type alone is not enough."],
    ["Milk with NaN or Infinity", "Rejected: not finite", "typeof can report number even for these unsuitable values."],
  ], "A type predicate must earn its promise with checks; an annotation alone cannot make external data safe."),
  visual("typescript-07", "sequence", 4, "A reducer ignores results for an old attempt", "Begin idle, then start request 7 and request 8.", [
    ["start 7", '{ kind: "loading", requestId: 7 }', "The new attempt becomes current."],
    ["start 8", '{ kind: "loading", requestId: 8 }', "A start action can replace the current phase."],
    ["resolve 7", "Still loading request 8", "The action ID does not match, so return the unchanged state."],
    ["resolve 8", '{ kind: "success", requestId: 8, data: ["book"] }', "Only the matching current attempt can complete."],
  ], "For non-start actions, check both loading phase and request identity before changing state.", "A cancelled state does not itself abort network work; it models the workflow's response to cancellation."),
  visual("react-01", "sequence", 3, "A click asks React for another render", "The standalone counter starts with taps = 0.", [
    ["Initial render", "Screen: Taps: 0", "The component reads its current state."],
    ["Click Tap once", "setTaps(current => current + 1)", "The handler requests an update instead of editing HTML directly."],
    ["Next render", "Screen: Taps: 1", "React calls the component with updated state."],
    ["Another click and render", "Screen: Taps: 2", "The same handler rule works again."],
  ], "Pass an event handler to run later; do not call the setter while constructing the screen."),
  visual("react-02", "branch", 4, "One submission either stops or adds one item", 'Suppose the current items are ["Draw"]. The handler prevents default form navigation.', [
    ["Blank draft", '"   ".trim() → ""', "Show an error and return; items stays [Draw]."],
    ["Valid draft", '"  Read  ".trim() → "Read"', "Continue to the state update."],
    ["New array", '["Draw", "Read"]', "Spread preserves earlier items, then appends the cleaned entry."],
    ["After a valid submit", 'draft: ""; message: "Activity added."', "The input clears and the new row is visible."],
  ], "Validate before adding, and update from the current array rather than replacing earlier entries."),
  visual("react-03", "branch", 2, "An empty success is not an error or a wait", "The same reading dashboard needs different views for different outcomes.", [
    ["Request pending", 'status: "loading" → Loading books…', "The answer is not known yet."],
    ["Successful empty answer", 'status: "success", books: [] → No books yet.', "The request worked and returned zero records."],
    ["Successful records", 'books: ["A Field Guide"] → one row', "Show actual returned content."],
    ["Failed attempt", 'status: "error" → Books could not be loaded.', "An error message explains why no result is shown."],
  ], "A blank array alone cannot tell you whether work is pending, empty, or failed."),
  visual("react-04", "sequence", 4, "Focus moves after the control exists", "In the project, start with the Activities trigger focused and its disclosure closed.", [
    ["Activate Activities", "open: false → true", "React renders the list's action buttons."],
    ["After the screen update", "Focus: Start practice", "The effect uses the first button ref after it is mounted."],
    ["Press Escape", "open: true → false", "The list closes."],
    ["Return focus", "Focus: Activities", "Keyboard use continues from the trigger instead of losing its place."],
  ], "State decides what exists; refs let the effect focus a specific mounted control.", "This is a disclosure with native buttons, not a complete ARIA menu-widget keyboard implementation."),
  visual("react-05", "compare", 3, "A remembered result avoids repeating the same scan", "The three-item list is Cedar, Maple, Cedar guide. Query begins as cedar.", [
    ["Initial calculation", "Baseline: 3 examined | cached: 3 examined", "Both find two matching names."],
    ["Press Repeat, query unchanged", "Baseline: 3 new examinations | cached: reuse", "Only baseline depends on repeat."],
    ["Change query to maple", "Baseline: 3 examined | cached: 3 examined", "The changed query invalidates both calculations."],
  ], "Memoization can reuse an unchanged answer; a new query still scans the list.", "These are calculation-level counts in this fixture, not guaranteed render counts. React may discard caches or run development checks."),
  visual("react-06", "sequence", 4, "A late error must not replace a newer success", "Start slow error request 1, then quick successful request 2.", [
    ["Request 1 starts", "latest.current = 1", "Its callback keeps its own request ID."],
    ["Request 2 starts", "latest.current = 2; status: loading", "Clear the previous error while waiting."],
    ["Request 2 succeeds", "status: success; current results shown", "Its ID matches the latest request."],
    ["Request 1 fails later", "Ignore the stale error", "The same ID guard protects errors as well as successful results."],
  ], "Test both race directions: old error/new success and old success/new error."),
  visual("backend-01", "sequence", 1, "A write response differs from a read response", "The /visits fixture begins with an empty in-memory array.", [
    ["POST /visits", '{ minutes: 45 }', "Validate the whole-minute range before changing the array."],
    ["Write response", '201 with { id: 1, minutes: 45 }', "One record was created."],
    ["GET /visits", "No new record is added", "Read the current saved array."],
    ["Read response", '200 with [{ id: 1, minutes: 45 }]', "Return a list, even though it contains only one record."],
  ], "The method and path together choose the action; POST creates while GET reads.", "This fixture models a route without a network and stores data only in memory."),
  visual("backend-02", "layers", 4, "Prove storage outlives the first process", "The first script inserts x/35 and y/12 into demo-practice.sqlite.", [
    ["Writer process", "INSERT x: 35; INSERT y: 12", "Prepared statements bind values to fixed SQL."],
    ["File on disk", "demo-practice.sqlite", "The rows are stored outside the writer's memory."],
    ["Writer exits", "Its in-memory objects are gone", "The database file can remain."],
    ["Separate reader process", "SELECT → x: 35, y: 12", "Opening the same file demonstrates persistence."],
  ], "A successful read after the writer exits is stronger evidence of durability than rereading a JavaScript array.", "Use the same file path. Rerunning the original inserts with the same primary keys causes duplicate-key errors."),
  visual("backend-03", "collection", 2, "Report how many durations are actually known", "One user's durations are 12, 24, and NULL.", [
    ["Row count", "COUNT(*) → 3", "All three session rows exist."],
    ["Known count", "COUNT(minutes) → 2", "The NULL row has no measured duration."],
    ["Known total", "12 + 24 = 36", "Do not treat the unknown value as a measured zero."],
    ["Average", "36 ÷ 2 = 18", "The denominator counts known durations, not every row."],
  ], "Show the known count beside the average so the reader can see how much data supports it.", "An all-NULL group has no known average; use NULL, not an invented zero."),
  visual("backend-04", "branch", 3, "Every failed guard stops before the write", "The baseline entry belongs to nora and has 40 minutes. Each case starts from that baseline.", [
    ["No verified session", "401; minutes stays 40", "Authentication fails first."],
    ["Verified luis requests a change", "403; minutes stays 40", "Signed in is not the same as owning this record."],
    ["Verified nora sends 0 minutes", "400; minutes stays 40", "Ownership passes, but input validation fails."],
    ["Verified nora sends 50 minutes", "200; minutes becomes 50", "Only a fully allowed request reaches assignment."],
  ], "Verify identity, check ownership, validate input, and only then mutate the record.", "A userId supplied in an arbitrary body is not a verified session."),
  visual("backend-05", "branch", 2, "A save and a reload are two separate outcomes", "The browser posts minutes, then reads saved entries only if the write succeeds.", [
    ["POST fails", "Save failed; keep the last confirmed state", "Do not claim the new entry was saved."],
    ["POST succeeds, GET fails", "Saved, but reload failed. Try loading again.", "The write succeeded even though refreshing the display did not."],
    ["POST succeeds, GET succeeds", "Display the returned saved entries", "The new screen is based on a confirmed server read."],
  ], "Report the exact failed step instead of collapsing every problem into Saved or Save failed.", "Network promise rejections also need catch handling. This fragment is not the complete private tracker."),
  visual("developer-toolkit-01", "layers", 4, "The instructions point to a saved entry file", "The greeting project keeps its launch instructions beside its JavaScript.", [
    ["README.md", "Run from this folder: node main.js", "A person reads these directions; Node does not execute the README."],
    ["main.js", 'console.log("Let us build something!");', "The runtime reads the saved program file."],
    ["Terminal output", "Let us build something!", "This is the program's result, not another source file."],
  ], "Keep the entry point, launch command, runtime requirement, and expected output together.", "An unsaved editor change is not necessarily the version the runtime reads."),
  visual("developer-toolkit-02", "compare", 3, "Change the rule, not just the example answer", "combine is meant to add its two inputs.", [
    ["Broken rule", "8 − 3 → 5", "The program runs, but expected 11 is not met."],
    ["Corrected rule", "8 + 3 → 11", "Replace subtraction with addition."],
    ["Check zero too", "0 + 3 → 3", "A new case still follows the same rule."],
    ["Check a negative input", "−4 + 9 → 5", "The fix works beyond the original sample."],
  ], "Returning 11 unconditionally would fit one sample but fail the behavior the function is supposed to provide."),
  visual("developer-toolkit-03", "sequence", 2, "A launch command follows the script mapping", "In the real terminal, begin outside the launch-demo project folder.", [
    ["Choose the folder", "cd launch-demo", "Change where relative files and commands are resolved."],
    ["Ask npm for the script", "npm start", "npm reads this project's package.json."],
    ["Read the mapping", '"start": "node main.js"', "The script name maps to the actual command."],
    ["Run the entry file", "node main.js", "Node executes the saved JavaScript file."],
  ], "The project folder and its script mapping connect npm start to the intended entry point.", "The browser exercise only prints command strings; it does not launch a terminal or change folders."),
  visual("developer-toolkit-04", "sequence", 2, "A change passes through three different places", "Edit and save main.js so its greeting becomes Hello, reader.", [
    ["Working file", "main.js contains Hello, reader", "git diff shows the unstaged change."],
    ["Staging area", "git add main.js", "Select that saved change for the next commit."],
    ["New history entry", 'git commit -m "Improve greeting"', "Record a snapshot with a meaningful message."],
    ["Inspect history", "git log --oneline -2", "The newer commit appears alongside the earlier one."],
  ], "Saving, staging, and committing are different steps; staging does not erase old commits.", "To reverse a committed mistake while preserving history, inspect it and use a new revert commit."),
  visual("developer-toolkit-05", "sequence", 2, "Carry the recipe as well as the source", "Use a disposable repro-demo copy with the documented Node requirement.", [
    ["Declare intent", "package.json", "Record the scripts, runtime range, and direct dependencies."],
    ["Resolve initial installation", "npm install → package-lock.json", "Keep the generated lockfile with the project."],
    ["Install a clean copy", "npm ci", "Use a matching manifest and lockfile to install recorded versions."],
    ["Verify behavior", "npm start → Clean start works", "The clean setup should reproduce the documented output."],
  ], "Source files alone do not explain how to recreate dependencies and launch the project.", "npm ci replaces node_modules; use a clean practice copy for the exercise."),
  visual("developer-toolkit-06", "branch", 4, "Review the discount against concrete cases", "The project gives ten percent off only when isMember is the Boolean true.", [
    ["Price 80, member true", "80 × 0.9 → 72", "Ten percent is 8; subtract it once."],
    ["Price 80, member false", "80", "No discount."],
    ["Price 80, member 'false'", "80", "Nonempty text is truthy, but it is not === true."],
    ["Negative or non-finite price", "null", "Validation rejects the input before any discount arithmetic."],
  ], "Review an AI proposal against the exact rule, including types and invalid inputs, rather than trusting plausible code."),
  visual("developer-toolkit-07", "collection", 2, "Build a test matrix around the actual boundaries", "The explanation's clampLevel accepts integers and clamps to 0 through 10.", [
    ["Ordinary value", "6 → 6", "An inside value is unchanged."],
    ["Exact boundaries", "0 → 0; 10 → 10", "Both endpoints belong to the range."],
    ["Just outside", "−3 → 0; 12 → 10", "Each outside direction clamps to its nearest bound."],
    ["Invalid inputs", "undefined, NaN, Infinity, 2.5 → null", "Missing, non-finite, and fractional inputs fail the integer contract."],
  ], "Useful cases come from the requirements, not from choosing a few arbitrary happy-path inputs.", "This pure calculation has no shared mutable state, so a concurrency test is not useful here."),
  visual("developer-toolkit-08", "branch", 2, "An app process can be alive without being ready", "The local /health example reports the release and both readiness requirements.", [
    ["App ready, storage ready", "200 with version demo-4", "Both required parts are available."],
    ["App ready, storage unavailable", "503 with version demo-4", "A running server still cannot serve the full workload."],
    ["Different path", "404 Not found", "This small server defines only the health route."],
    ["Useful failure evidence", "requestId + releaseId + storage-unavailable", "Connect an observed failure to a version and event without logging secrets."],
  ], "Check readiness and the deployed version, not just whether the process answers something.", "The lesson uses a storage-ready flag; production readiness needs real checks appropriate to the service."),
  visual("developer-toolkit-09", "collection", 4, "Every required review must be an actual true", "ready(review) checks permissions, secrets, and keyboard with === true.", [
    ["All checks confirmed", "true | true | true → release allowed", "Every required comparison passes."],
    ["Secret check fails", "true | false | true → not ready", "Passing two checks cannot compensate for the third."],
    ["Permission check is text", "'true' | true | true → not ready", "A truthy string is not the Boolean true."],
    ["Checks are missing", "true | undefined | undefined → not ready", "Missing evidence does not count as a passed review."],
  ], "The release decision is all-or-nothing across required checks, not a majority vote.", "These booleans summarize review outcomes; returning true does not perform a security or accessibility audit."),
];

export const lessonVisuals: Record<string, LessonVisual> = Object.fromEntries(
  guides.map((guide) => [guide.id, guide]),
);

/** Return a guide only on its authored explanation page, never on every page. */
export function getLessonVisual(unitId: string, paragraph: number): LessonVisual | undefined {
  const guide = Object.prototype.hasOwnProperty.call(lessonVisuals, unitId) ? lessonVisuals[unitId] : undefined;
  return guide && guide.paragraph === paragraph ? guide : undefined;
}
