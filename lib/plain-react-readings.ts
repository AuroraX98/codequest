// Reviewed React counterparts.
const readings = [
  {
    "source": "React builds interfaces from components.",
    "simple": "React makes screens from reusable pieces called components.",
    "runtime": "react",
    "lesson": "react-01"
  },
  {
    "source": "A component is a function that returns a description of what should appear.",
    "simple": "A component is a function that describes what should appear on the screen.",
    "runtime": "react",
    "lesson": "react-01"
  },
  {
    "source": "JSX is the HTML-like notation inside JavaScript, such as <h2>Hello</h2>.",
    "simple": "JSX lets you write page-like code such as `<h2>Hello</h2>` inside JavaScript.",
    "runtime": "react",
    "lesson": "react-01"
  },
  {
    "source": "A JSX-aware runner translates it before execution.",
    "simple": "A runner that understands JSX turns it into code that can run.",
    "runtime": "react",
    "lesson": "react-01"
  },
  {
    "source": "These examples use the lesson's available React object;",
    "simple": "These examples use the React object already supplied by the lesson.",
    "runtime": "react",
    "lesson": "react-01"
  },
  {
    "source": "they need React and JSX support, so they cannot be pasted unchanged into a plain JavaScript console.",
    "simple": "They need React and JSX support. They will not work unchanged in a plain JavaScript console.",
    "runtime": "react",
    "lesson": "react-01"
  },
  {
    "source": "This complete component example can be rendered by the React lesson runner:",
    "simple": "The lesson’s React runner can show this complete component example.",
    "runtime": "react",
    "lesson": "react-01"
  },
  {
    "source": "You see two profiles: Tara learning Art, and Luis learning Music.",
    "simple": "The screen shows Tara learning Art and Luis learning Music as two separate profiles.",
    "runtime": "react",
    "lesson": "react-01"
  },
  {
    "source": "Props are inputs passed from a parent component to a child.",
    "simple": "Props are values a parent component gives to a child component.",
    "runtime": "react",
    "lesson": "react-01"
  },
  {
    "source": "Profile reads those inputs;",
    "simple": "The Profile component uses those input values.",
    "runtime": "react",
    "lesson": "react-01"
  },
  {
    "source": "it should not edit them.",
    "simple": "Profile should not change the props it receives.",
    "runtime": "react",
    "lesson": "react-01"
  },
  {
    "source": "Capitalized <Profile ... /> asks React to use your component;",
    "simple": "An uppercase name like `<Profile ... />` tells React to use your component.",
    "runtime": "react",
    "lesson": "react-01"
  },
  {
    "source": "lowercase <section> describes a built-in HTML element. name=\"Tara\" passes text.",
    "simple": "A lowercase name like `<section>` means a normal HTML element. `name=\"Tara\"` gives the component text.",
    "runtime": "react",
    "lesson": "react-01"
  },
  {
    "source": "Curly braces inside JSX evaluate JavaScript: {props.name} inserts the actual name.",
    "simple": "Inside JSX, `{props.name}` reads the JavaScript value and puts that name into the page.",
    "runtime": "react",
    "lesson": "react-01"
  },
  {
    "source": "Text outside braces, such as Learning, appears literally.",
    "simple": "Words outside the braces, like Learning, stay exactly as written.",
    "runtime": "react",
    "lesson": "react-01"
  },
  {
    "source": "The closing /> means this component call has no enclosed children.",
    "simple": "The ending `/>` means no child content is written inside this use of the component.",
    "runtime": "react",
    "lesson": "react-01"
  },
  {
    "source": "A returned tree needs one surrounding element, here main.",
    "simple": "The returned page pieces need one surrounding wrapper. This example uses `main`.",
    "runtime": "react",
    "lesson": "react-01"
  },
  {
    "source": "Here is a separate complete interactive App.",
    "simple": "This next example is a separate complete app with a working interaction.",
    "runtime": "react",
    "lesson": "react-01"
  },
  {
    "source": "Replace the earlier App with this one to try it:",
    "simple": "Replace the earlier `App` with this version to try it.",
    "runtime": "react",
    "lesson": "react-01"
  },
  {
    "source": "Initially you see Taps: 0.",
    "simple": "The counter starts by showing `Taps: 0`.",
    "runtime": "react",
    "lesson": "react-01"
  },
  {
    "source": "One click shows 1, then another shows 2. useState returns two values: the current state and a setter.",
    "simple": "The first click changes it to 1 and the next to 2. `useState` gives you the current value and a function for updating it.",
    "runtime": "react",
    "lesson": "react-01"
  },
  {
    "source": "Square brackets unpack that pair into taps and setTaps.",
    "simple": "The square brackets give those two returned values the names `taps` and `setTaps`.",
    "runtime": "react",
    "lesson": "react-01"
  },
  {
    "source": "State is data React remembers between renders.",
    "simple": "State is information React keeps between times it works out the screen.",
    "runtime": "react",
    "lesson": "react-01"
  },
  {
    "source": "A render is React calling components to work out the current interface. setTaps asks React to render with the updated state;",
    "simple": "To render, React runs components to work out what should appear. `setTaps` asks React to do that again using the updated value.",
    "runtime": "react",
    "lesson": "react-01"
  },
  {
    "source": "it does not directly rewrite the button's HTML.",
    "simple": "`setTaps` does not directly edit the button’s HTML.",
    "runtime": "react",
    "lesson": "react-01"
  },
  {
    "source": "The arrow () => ... creates a function for a future click.",
    "simple": "The arrow code `() => ...` makes a function to run when a later click happens.",
    "runtime": "react",
    "lesson": "react-01"
  },
  {
    "source": "Passing that function matters: calling setTaps while building the screen would update during rendering instead of waiting for the user.",
    "simple": "Give the button that function instead of running `setTaps` immediately while the screen is being built.",
    "runtime": "react",
    "lesson": "react-01"
  },
  {
    "source": "current => current + 1 is a functional update: React supplies the latest queued count.",
    "simple": "In `current => current + 1`, React supplies the latest count waiting to be updated, then the function adds one.",
    "runtime": "react",
    "lesson": "react-01"
  },
  {
    "source": "Calling setCount(count + 1) also works for the exercise's separate clicks, but functional updates help when several increments are queued together.",
    "simple": "`setCount(count + 1)` works for the separate clicks here. The function version is safer when several additions are waiting together.",
    "runtime": "react",
    "lesson": "react-01"
  },
  {
    "source": "An ordinary local let variable would reset when the function runs again and would not itself tell React to render.",
    "simple": "A normal `let` inside the component would start over when the function runs again and would not itself request a screen update.",
    "runtime": "react",
    "lesson": "react-01"
  },
  {
    "source": "Call hooks such as useState at the top level of the component, not inside a condition.",
    "simple": "Put hooks such as `useState` at the component’s top level, not inside an `if` or another conditional path.",
    "runtime": "react",
    "lesson": "react-01"
  },
  {
    "source": "For the exercise, preserve Mina's Swift profile and the Practice button's label.",
    "simple": "Keep Mina’s Swift profile and the button label Practice in your exercise.",
    "runtime": "react",
    "lesson": "react-01"
  },
  {
    "source": "Each click increments only count.",
    "simple": "Each click should add one to `count` and change nothing else.",
    "runtime": "react",
    "lesson": "react-01"
  },
  {
    "source": "Starting from 0, three taps follow 0 → 1 → 2 → 3;",
    "simple": "Three clicks from 0 give the sequence 0, 1, 2, 3.",
    "runtime": "react",
    "lesson": "react-01"
  },
  {
    "source": "adding one each time is counting, not multiplication.",
    "simple": "This adds one each time; it does not multiply the count.",
    "runtime": "react",
    "lesson": "react-01"
  },
  {
    "source": "A changing counter should not change read-only profile props.",
    "simple": "Updating the counter should leave the read-only profile information alone.",
    "runtime": "react",
    "lesson": "react-01"
  },
  {
    "source": "In larger apps, define child components outside their parent to preserve stable component identity;",
    "simple": "In larger apps, define child components outside the parent function so React keeps recognizing them as the same component.",
    "runtime": "react",
    "lesson": "react-01"
  },
  {
    "source": "the starter's nested Profile is adequate for this simple stateless example.",
    "simple": "The nested Profile in this starter is enough for this small example because that profile has no state of its own.",
    "runtime": "react",
    "lesson": "react-01"
  },
  {
    "source": "React handles actions through event-handler functions.",
    "simple": "React uses functions to respond to actions such as typing or clicking.",
    "runtime": "react",
    "lesson": "react-02"
  },
  {
    "source": "A controlled input takes its displayed value from state and updates that state when someone types. value sets the displayed text;",
    "simple": "A controlled input shows the text stored in React state. Its `value` setting chooses the visible text.",
    "runtime": "react",
    "lesson": "react-02"
  },
  {
    "source": "onChange tells React how to respond to edits.",
    "simple": "`onChange` tells React how to update state when the user edits that text.",
    "runtime": "react",
    "lesson": "react-02"
  },
  {
    "source": "You need both.",
    "simple": "A controlled field needs both the displayed value and the edit handler.",
    "runtime": "react",
    "lesson": "react-02"
  },
  {
    "source": "A visible label tells people what the field is for, including people using assistive technology.",
    "simple": "A visible label tells everyone what a field asks for, including people using assistive tools.",
    "runtime": "react",
    "lesson": "react-02"
  },
  {
    "source": "Run this complete App in the React/JSX lesson runner:",
    "simple": "Run this complete App in the lesson’s React and JSX runner.",
    "runtime": "react",
    "lesson": "react-02"
  },
  {
    "source": "Typing hello updates both the field and paragraph. event is the change information;",
    "simple": "When you type hello, both the field and paragraph change. The `event` contains information about that edit.",
    "runtime": "react",
    "lesson": "react-02"
  },
  {
    "source": "event.target is the input involved;",
    "simple": "`event.target` is the input field that was edited.",
    "runtime": "react",
    "lesson": "react-02"
  },
  {
    "source": ".value is its current text.",
    "simple": "Its `.value` is the text currently in that field.",
    "runtime": "react",
    "lesson": "react-02"
  },
  {
    "source": "The arrow receives that event when editing happens.",
    "simple": "The arrow function receives the event when the edit happens.",
    "runtime": "react",
    "lesson": "react-02"
  },
  {
    "source": "Forms normally submit by navigating or reloading the page. event.preventDefault() prevents that default action so your React code can handle submission.",
    "simple": "A form usually submits by loading or navigating to a page. `event.preventDefault()` prevents that normal behavior so your React handler can manage it.",
    "runtime": "react",
    "lesson": "react-02"
  },
  {
    "source": "It does not stop typing. trim() removes whitespace from both ends of a string.",
    "simple": "It does not prevent typing. `trim()` removes spaces and other whitespace from the start and end of text.",
    "runtime": "react",
    "lesson": "react-02"
  },
  {
    "source": "Three spaces become empty text, whose length is 0.",
    "simple": "Trimming a string made of three spaces leaves no text, so its length is 0.",
    "runtime": "react",
    "lesson": "react-02"
  },
  {
    "source": "A valid submission here needs trimmed length greater than 0, so a blank draft must be rejected before anything is added.",
    "simple": "This form requires some text after trimming. Reject a blank draft before adding an item.",
    "runtime": "react",
    "lesson": "react-02"
  },
  {
    "source": "This is a separate complete App;",
    "simple": "The next example is another complete App, not extra code to put inside the first one.",
    "runtime": "react",
    "lesson": "react-02"
  },
  {
    "source": "replace the first App to try it:",
    "simple": "Replace the first App with this one to test it.",
    "runtime": "react",
    "lesson": "react-02"
  },
  {
    "source": "Submitting spaces shows Write a note first. and no item.",
    "simple": "If you submit only spaces, you see `Write a note first.` and no note is added.",
    "runtime": "react",
    "lesson": "react-02"
  },
  {
    "source": "Submitting '  Sketch  ' adds one Sketch item, clears the field, and shows Note added.",
    "simple": "Submitting `'  Sketch  '` adds one note named Sketch, empties the field, and shows `Note added.`",
    "runtime": "react",
    "lesson": "react-02"
  },
  {
    "source": "The early return stops the invalid path. [...current, cleaned] creates a new array by spreading the existing items, then appending the cleaned text.",
    "simple": "The early return stops invalid input from being added. `[...current, cleaned]` makes a new list with all earlier notes followed by the cleaned new note.",
    "runtime": "react",
    "lesson": "react-02"
  },
  {
    "source": "It preserves earlier notes and gives React a new value to render. map visits each note and returns one li element. key helps React track list children;",
    "simple": "The old notes remain, and React receives a new list to display. `map` makes one `li` for each note. A `key` helps React recognize each item.",
    "runtime": "react",
    "lesson": "react-02"
  },
  {
    "source": "an index key is acceptable for this simple append-only list, but stable unique ids are better for lists that reorder or remove items.",
    "simple": "An item’s position works as a key for this simple list that only adds at the end. Use stable unique IDs when items can move or be removed.",
    "runtime": "react",
    "lesson": "react-02"
  },
  {
    "source": "role=\"status\" exposes the message as status feedback for assistive technology. type=\"submit\" connects the button to the form's submit action, so pressing Enter in the field can also submit.",
    "simple": "`role=\"status\"` makes the feedback available to assistive tools. `type=\"submit\"` connects the button to form submission, which also lets Enter in the field submit.",
    "runtime": "react",
    "lesson": "react-02"
  },
  {
    "source": "Attach addition to the form handler once;",
    "simple": "Add the item in one place: the form’s submit handler.",
    "runtime": "react",
    "lesson": "react-02"
  },
  {
    "source": "adding in both an onClick and onSubmit can duplicate items.",
    "simple": "Adding it in both the button click and form submit handlers could create duplicates.",
    "runtime": "react",
    "lesson": "react-02"
  },
  {
    "source": "The handler receives a function reference submit, rather than submit(), which would run immediately.",
    "simple": "Give the handler `submit`, the function itself. `submit()` would run it immediately instead of waiting for submission.",
    "runtime": "react",
    "lesson": "react-02"
  },
  {
    "source": "For the exercise, the field label is Activity, the button is Add activity, and the required messages are Enter an activity first. and Activity added.",
    "simple": "In your project, use Activity for the label, Add activity for the button, and the exact messages `Enter an activity first.` and `Activity added.`",
    "runtime": "react",
    "lesson": "react-02"
  },
  {
    "source": "Keep those words because the checks inspect visible behavior.",
    "simple": "The tests read those visible words, so keep them as requested.",
    "runtime": "react",
    "lesson": "react-02"
  },
  {
    "source": "Reject a blank or whitespace-only draft, add a valid trimmed item exactly once, then clear draft.",
    "simple": "Reject empty or space-only input. Otherwise add the trimmed text once and clear the draft.",
    "runtime": "react",
    "lesson": "react-02"
  },
  {
    "source": "Clearing a message alone does not clear the input: the controlled field follows its own state.",
    "simple": "Clearing feedback text does not clear the input. The input follows its own draft state.",
    "runtime": "react",
    "lesson": "react-02"
  },
  {
    "source": "Keyboard access means someone can use a feature without a mouse.",
    "simple": "A keyboard-accessible feature can be used without a mouse.",
    "runtime": "react",
    "lesson": "react-04"
  },
  {
    "source": "Native buttons can receive focus with Tab and activate with Enter or Space.",
    "simple": "You can reach a normal button with Tab and activate it with Enter or Space.",
    "runtime": "react",
    "lesson": "react-04"
  },
  {
    "source": "Focus is the control that currently receives keyboard input.",
    "simple": "Focus marks the control that receives the next keyboard action.",
    "runtime": "react",
    "lesson": "react-04"
  },
  {
    "source": "Give buttons a visible name describing their action and keep focus visible.",
    "simple": "Give each button clear visible words and keep its focus marker easy to see.",
    "runtime": "react",
    "lesson": "react-04"
  },
  {
    "source": "A clickable div would need extra keyboard behavior that a button already provides.",
    "simple": "A clickable `div` would need extra keyboard code. A real button already has that basic behavior.",
    "runtime": "react",
    "lesson": "react-04"
  },
  {
    "source": "This complete React/JSX example exposes whether a panel is open:",
    "simple": "This complete example tells assistive tools whether a panel is open.",
    "runtime": "react",
    "lesson": "react-04"
  },
  {
    "source": "At first, Help is collapsed and no list appears.",
    "simple": "At the start, Help is closed and its list is not shown.",
    "runtime": "react",
    "lesson": "react-04"
  },
  {
    "source": "Activating it shows the list and changes aria-expanded to true. aria-controls names the id of the controlled element.",
    "simple": "Opening Help shows the list and sets `aria-expanded` to true. `aria-controls` gives the ID of the part the button controls.",
    "runtime": "react",
    "lesson": "react-04"
  },
  {
    "source": "This exposes information;",
    "simple": "Those attributes describe the relationship and open state to tools.",
    "runtime": "react",
    "lesson": "react-04"
  },
  {
    "source": "the attributes do not implement opening by themselves.",
    "simple": "They do not create the opening behavior by themselves.",
    "runtime": "react",
    "lesson": "react-04"
  },
  {
    "source": "In JSX, {open && ...} renders the element when open is true. !value flips a boolean: false becomes true.",
    "simple": "`{open && ...}` shows the content only when `open` is true. `!value` reverses true and false.",
    "runtime": "react",
    "lesson": "react-04"
  },
  {
    "source": "We also need a deliberate focus plan.",
    "simple": "Also decide where keyboard focus should go when the panel changes.",
    "runtime": "react",
    "lesson": "react-04"
  },
  {
    "source": "Opening should focus the first action after it exists;",
    "simple": "After the panel opens and its controls exist, move focus to its first action.",
    "runtime": "react",
    "lesson": "react-04"
  },
  {
    "source": "Escape should close and return focus to the trigger.",
    "simple": "When Escape closes it, move focus back to the button that opened it.",
    "runtime": "react",
    "lesson": "react-04"
  },
  {
    "source": "A ref stores a reference to an actual DOM element without needing a render every time it changes.",
    "simple": "A ref remembers a real page element without requesting a new screen update every time that reference changes.",
    "runtime": "react",
    "lesson": "react-04"
  },
  {
    "source": "Replace the first App with this complete version:",
    "simple": "Replace the earlier App with this complete version.",
    "runtime": "react",
    "lesson": "react-04"
  },
  {
    "source": "Opening focuses Read instructions.",
    "simple": "Opening the panel moves focus to Read instructions.",
    "runtime": "react",
    "lesson": "react-04"
  },
  {
    "source": "Pressing Escape while focus is inside the nav removes the list and focuses Help again.",
    "simple": "If focus is inside this navigation area, Escape removes the list and puts focus back on Help.",
    "runtime": "react",
    "lesson": "react-04"
  },
  {
    "source": "useRef(null) starts without an element;",
    "simple": "`useRef(null)` begins with no page element attached.",
    "runtime": "react",
    "lesson": "react-04"
  },
  {
    "source": "React fills .current when the ref's button is mounted. ?. means only call focus when the current value exists. useEffect runs its work after React has committed the screen update, so the first button is available. [open] is the dependency array: run this effect when open changes.",
    "simple": "React puts the mounted button in `.current`. `?.` calls focus only when that element exists. `useEffect` waits until the screen update has been applied, and `[open]` asks it to run when open changes.",
    "runtime": "react",
    "lesson": "react-04"
  },
  {
    "source": "Setting a ref does not itself update the visible screen.",
    "simple": "Changing a ref alone does not redraw the visible screen.",
    "runtime": "react",
    "lesson": "react-04"
  },
  {
    "source": "Key events bubble from a focused child to its ancestor, allowing nav's handler to see Escape from a list button.",
    "simple": "A key event from a focused button travels up through its containing elements. That lets the navigation handler notice Escape.",
    "runtime": "react",
    "lesson": "react-04"
  },
  {
    "source": "The close function hides the list and restores the trigger as the keyboard position.",
    "simple": "The close function hides the list and returns keyboard focus to its opening button.",
    "runtime": "react",
    "lesson": "react-04"
  },
  {
    "source": "Tab is still ordinary focus navigation.",
    "simple": "Tab still moves through controls in the usual way.",
    "runtime": "react",
    "lesson": "react-04"
  },
  {
    "source": "This is a simple disclosure containing native buttons, not a full ARIA menu widget;",
    "simple": "This example is a simple expandable group of ordinary buttons, not a complete ARIA menu.",
    "runtime": "react",
    "lesson": "react-04"
  },
  {
    "source": "adding role=\"menu\" would require additional expected keyboard behavior such as arrow-key navigation.",
    "simple": "Adding `role=\"menu\"` would also require menu behaviors such as moving with arrow keys.",
    "runtime": "react",
    "lesson": "react-04"
  },
  {
    "source": "For the exercise, the trigger's visible name must be Activities, aria-controls must point to activity-menu, and opening must focus Start practice.",
    "simple": "For your project, name the opening button Activities. Point `aria-controls` to `activity-menu`, and focus Start practice after opening.",
    "runtime": "react",
    "lesson": "react-04"
  },
  {
    "source": "Escape closes and returns focus to Activities.",
    "simple": "Escape should close the list and return focus to Activities.",
    "runtime": "react",
    "lesson": "react-04"
  },
  {
    "source": "Test it with Tab, Enter or Space, then Escape.",
    "simple": "Try opening it with Tab and Enter or Space, then closing it with Escape.",
    "runtime": "react",
    "lesson": "react-04"
  },
  {
    "source": "Confirm the expanded attribute changes with state and focus really moves.",
    "simple": "Check both that `aria-expanded` changes correctly and that keyboard focus actually moves.",
    "runtime": "react",
    "lesson": "react-04"
  },
  {
    "source": "This unit has no math question;",
    "simple": "This lesson does not have a separate math question.",
    "runtime": "react",
    "lesson": "react-04"
  },
  {
    "source": "the learning task is the interaction itself.",
    "simple": "The task to learn is how the interaction behaves.",
    "runtime": "react",
    "lesson": "react-04"
  },
  {
    "source": "A dashboard can show different views of one shared dataset.",
    "simple": "A dashboard can show the same data in more than one view.",
    "runtime": "react",
    "lesson": "react-03"
  },
  {
    "source": "Store the selected view and loaded records in the common parent component so switching views preserves them.",
    "simple": "Keep the selected view and loaded records in the parent shared by those views so switching does not lose them.",
    "runtime": "react",
    "lesson": "react-03"
  },
  {
    "source": "Home and Saved here are local screen choices;",
    "simple": "Home and Saved are choices within this app’s screen.",
    "runtime": "react",
    "lesson": "react-03"
  },
  {
    "source": "they do not change the browser URL or maintain separate saved records.",
    "simple": "They do not change the browser address or create separate saved copies of the data.",
    "runtime": "react",
    "lesson": "react-03"
  },
  {
    "source": "The loader is a simulation, so no server or secret is needed.",
    "simple": "The example only imitates loading data, so it needs no real server or secret key.",
    "runtime": "react",
    "lesson": "react-03"
  },
  {
    "source": "This complete React/JSX App demonstrates shared data and local navigation:",
    "simple": "This complete app shows how views can share data while you move between them.",
    "runtime": "react",
    "lesson": "react-03"
  },
  {
    "source": "Saved changes the heading while Forest Guide remains.",
    "simple": "Choosing Saved changes the heading, but Forest Guide stays in the data.",
    "runtime": "react",
    "lesson": "react-03"
  },
  {
    "source": "The expression condition ? first : second is a conditional choice, called a ternary.",
    "simple": "`condition ? first : second` chooses between two values. This short form is called a ternary.",
    "runtime": "react",
    "lesson": "react-03"
  },
  {
    "source": "It chooses which heading text to render.",
    "simple": "Here, that choice decides which heading to show.",
    "runtime": "react",
    "lesson": "react-03"
  },
  {
    "source": "Loading means waiting for a result.",
    "simple": "Loading means the app is still waiting for an answer.",
    "runtime": "react",
    "lesson": "react-03"
  },
  {
    "source": "Empty means a successful result with no records.",
    "simple": "Empty means loading worked, but there were no records.",
    "runtime": "react",
    "lesson": "react-03"
  },
  {
    "source": "Error means the attempt failed.",
    "simple": "Error means the loading attempt failed.",
    "runtime": "react",
    "lesson": "react-03"
  },
  {
    "source": "Success with records means the list is ready.",
    "simple": "Success with records means the returned list can be shown.",
    "runtime": "react",
    "lesson": "react-03"
  },
  {
    "source": "Idle means no attempt yet.",
    "simple": "Idle means no loading attempt has started.",
    "runtime": "react",
    "lesson": "react-03"
  },
  {
    "source": "Treating all these cases as one blank list hides useful information.",
    "simple": "Showing the same empty list for all those cases hides what actually happened.",
    "runtime": "react",
    "lesson": "react-03"
  },
  {
    "source": "A role=\"alert\" message can announce an error;",
    "simple": "A message with `role=\"alert\"` can announce that something failed.",
    "runtime": "react",
    "lesson": "react-03"
  },
  {
    "source": "a list of real results should appear only in the successful state.",
    "simple": "Show real result items only after a successful load.",
    "runtime": "react",
    "lesson": "react-03"
  },
  {
    "source": "This second App is a complete sample loader for the same runner:",
    "simple": "This second complete App adds a sample loader for the same runner.",
    "runtime": "react",
    "lesson": "react-03"
  },
  {
    "source": "Empty sample first shows loading, then No books.",
    "simple": "Empty sample first shows that it is loading, then says `No books.`",
    "runtime": "react",
    "lesson": "react-03"
  },
  {
    "source": "Error sample first shows loading, then the error message.",
    "simple": "Error sample first shows that it is loading, then shows the failure message.",
    "runtime": "react",
    "lesson": "react-03"
  },
  {
    "source": "++latest.current adds one and supplies that new number as this attempt's id.",
    "simple": "`++latest.current` increases the counter by one and uses the new number to identify this attempt.",
    "runtime": "react",
    "lesson": "react-03"
  },
  {
    "source": "A ref retains this counter across renders without causing an extra render. setTimeout schedules the callback after a delay in milliseconds;",
    "simple": "The ref remembers the counter between screen updates without triggering another update. `setTimeout` schedules a function to run after a delay measured in milliseconds.",
    "runtime": "react",
    "lesson": "react-03"
  },
  {
    "source": "1,000 milliseconds is one second.",
    "simple": "1,000 milliseconds is the same as one second.",
    "runtime": "react",
    "lesson": "react-03"
  },
  {
    "source": "Each callback keeps the id and mode from its own call.",
    "simple": "Each delayed function remembers the ID and mode from the attempt that created it.",
    "runtime": "react",
    "lesson": "react-03"
  },
  {
    "source": "Before changing either results or errors, compare that id with the newest one.",
    "simple": "Before changing results or an error, check that the function’s ID is still the latest one.",
    "runtime": "react",
    "lesson": "react-03"
  },
  {
    "source": "Click Slow sample and then Error sample before the slow result arrives.",
    "simple": "Try Slow sample, then Error sample before the slow attempt finishes.",
    "runtime": "react",
    "lesson": "react-03"
  },
  {
    "source": "The later error owns the current id, so its message remains;",
    "simple": "The newer error attempt has the current ID, so keep its error message.",
    "runtime": "react",
    "lesson": "react-03"
  },
  {
    "source": "the old success is ignored.",
    "simple": "Ignore the older success when it finally arrives.",
    "runtime": "react",
    "lesson": "react-03"
  },
  {
    "source": "Reverse the kinds of outcomes and the same rule should protect a later success from an old error.",
    "simple": "Also test the reverse: a new success must not be replaced by an old failure.",
    "runtime": "react",
    "lesson": "react-03"
  },
  {
    "source": "For example, request 2 succeeds and request 1 later fails: keep request 2's success.",
    "simple": "If request 2 succeeds before request 1 fails, keep the success from request 2.",
    "runtime": "react",
    "lesson": "react-03"
  },
  {
    "source": "Checking only successful responses would still let stale errors break the screen.",
    "simple": "Checking IDs only for successes is not enough. An old error could still wrongly change the screen.",
    "runtime": "react",
    "lesson": "react-03"
  },
  {
    "source": "For your exercise, combine shared navigation with the loader and preserve the supplied labels and messages.",
    "simple": "For the project, combine the shared views with loading while keeping the supplied labels and messages.",
    "runtime": "react",
    "lesson": "react-03"
  },
  {
    "source": "Include Load sample, Load empty, Load error, and Load older slow result.",
    "simple": "Add four controls: Load sample, Load empty, Load error, and Load older slow result.",
    "runtime": "react",
    "lesson": "react-03"
  },
  {
    "source": "Sample success shows A Field Guide;",
    "simple": "A successful sample should show `A Field Guide`.",
    "runtime": "react",
    "lesson": "react-03"
  },
  {
    "source": "empty success says No books yet.;",
    "simple": "A successful but empty load should say `No books yet.`",
    "runtime": "react",
    "lesson": "react-03"
  },
  {
    "source": "error says Books could not be loaded.",
    "simple": "A failed load should say `Books could not be loaded.`",
    "runtime": "react",
    "lesson": "react-03"
  },
  {
    "source": "Show Loading books… while waiting.",
    "simple": "While waiting, show `Loading books…`.",
    "runtime": "react",
    "lesson": "react-03"
  },
  {
    "source": "Keep view independent of load state so Home/Saved preserves the current dataset.",
    "simple": "Keep the Home/Saved choice separate from loading state so switching views keeps the current books.",
    "runtime": "react",
    "lesson": "react-03"
  },
  {
    "source": "A real fetch loader must also check response status and guard both success and failure against stale ids.",
    "simple": "With real `fetch`, check the response status too, and ignore outdated attempts in both success and failure paths.",
    "runtime": "react",
    "lesson": "react-03"
  },
  {
    "source": "Filtering a list examines each item to decide whether it matches.",
    "simple": "To filter a list, check each item and decide whether to keep it.",
    "runtime": "react",
    "lesson": "react-05"
  },
  {
    "source": "If there are n items and you inspect each once, that is linear work, written O(n).",
    "simple": "Checking each of n items once takes work that grows with n. This is called linear work, written `O(n)`.",
    "runtime": "react",
    "lesson": "react-05"
  },
  {
    "source": "The O notation describes how work grows, not an exact clock time.",
    "simple": "`O(n)` describes the pattern of growth, not an exact number of seconds.",
    "runtime": "react",
    "lesson": "react-05"
  },
  {
    "source": "Growing a list from 1,000 to 8,000 items means roughly eight times as many comparisons for the same full scan.",
    "simple": "Scanning 8,000 items instead of 1,000 means about eight times as many comparisons.",
    "runtime": "react",
    "lesson": "react-05"
  },
  {
    "source": "This standalone JavaScript example makes the work count visible:",
    "simple": "This separate JavaScript example counts the work so you can see it.",
    "runtime": "react",
    "lesson": "react-05"
  },
  {
    "source": "The result has matches ['Cedar', 'Cedar guide'] and examined 4. filter visits each item, retaining ones whose callback returns true. toLowerCase makes both texts lowercase for a case-insensitive comparison;",
    "simple": "The result keeps Cedar and Cedar guide after examining four items. `filter` keeps items whose checking function returns true. Converting both texts to lowercase makes capital letters irrelevant to the match.",
    "runtime": "react",
    "lesson": "react-05"
  },
  {
    "source": "includes checks for the query anywhere inside the item.",
    "simple": "`includes` checks whether the search text appears anywhere in an item.",
    "runtime": "react",
    "lesson": "react-05"
  },
  {
    "source": "React may render again for a state update that does not affect the query or list. useMemo remembers a calculated result while its dependency values remain the same.",
    "simple": "React can update the screen even when the list and query have not changed. `useMemo` can reuse the earlier calculation while its listed inputs stay the same.",
    "runtime": "react",
    "lesson": "react-05"
  },
  {
    "source": "A dependency is an input that can change the answer.",
    "simple": "A dependency is an input that could change the calculation’s answer.",
    "runtime": "react",
    "lesson": "react-05"
  },
  {
    "source": "It does not make a new query constant-time;",
    "simple": "This does not make a new search take a fixed tiny amount of work.",
    "runtime": "react",
    "lesson": "react-05"
  },
  {
    "source": "a changed query still needs a scan.",
    "simple": "If the query changes, the list still has to be checked again.",
    "runtime": "react",
    "lesson": "react-05"
  },
  {
    "source": "React compares each dependency with its previous value, so keeping the array itself stable matters too.",
    "simple": "React compares each dependency to its previous value. Recreating an equivalent array can still count as changing that dependency.",
    "runtime": "react",
    "lesson": "react-05"
  },
  {
    "source": "This complete App needs the React/JSX runner:",
    "simple": "Run this complete App with React and JSX support.",
    "runtime": "react",
    "lesson": "react-05"
  },
  {
    "source": "Initially there are two matches.",
    "simple": "The first search finds two matching items.",
    "runtime": "react",
    "lesson": "react-05"
  },
  {
    "source": "Repeat changes repeat, so the baseline recalculates while cached can reuse its result.",
    "simple": "Repeat changes an unrelated counter. The baseline runs its calculation again, but the cached version can reuse its answer.",
    "runtime": "react",
    "lesson": "react-05"
  },
  {
    "source": "Editing query recalculates both. [] gives the list creation no changing dependencies.",
    "simple": "Changing the query makes both recalculate. The empty `[]` means the list-creation calculation has no changing inputs.",
    "runtime": "react",
    "lesson": "react-05"
  },
  {
    "source": "To compare work across renders, the exercise records each newly committed calculation result.",
    "simple": "The exercise adds work counts when a newly calculated result has actually been applied to the screen.",
    "runtime": "react",
    "lesson": "react-05"
  },
  {
    "source": "A ref stores previous baseline and memoized object references and running counts.",
    "simple": "A ref remembers the earlier result objects and the running comparison totals.",
    "runtime": "react",
    "lesson": "react-05"
  },
  {
    "source": "Its effect depends on the two result objects.",
    "simple": "The effect watches the two calculation result objects.",
    "runtime": "react",
    "lesson": "react-05"
  },
  {
    "source": "If a result reference changed, add that result's examined count;",
    "simple": "When one result object is new, add the number of items that calculation examined.",
    "runtime": "react",
    "lesson": "react-05"
  },
  {
    "source": "then store the new references and put totals into state.",
    "simple": "Then remember those new objects and update the displayed totals.",
    "runtime": "react",
    "lesson": "react-05"
  },
  {
    "source": "The totals render does not change items, query, or repeat, so it does not create a measuring loop.",
    "simple": "Showing the totals does not change the list, query, or repeat counter, so this measurement does not keep triggering itself.",
    "runtime": "react",
    "lesson": "react-05"
  },
  {
    "source": "The exercise's list uses Array.from({length: 1000}, (_, i) => `Book ${i}`).",
    "simple": "The exercise uses `Array.from` to create 1,000 book names, starting with Book 0.",
    "runtime": "react",
    "lesson": "react-05"
  },
  {
    "source": "It creates indexes 0 through 999;",
    "simple": "The item positions run from 0 through 999.",
    "runtime": "react",
    "lesson": "react-05"
  },
  {
    "source": "_ is a parameter name for an unused value and i is the index.",
    "simple": "The `_` input is not used. `i` holds the current item’s position.",
    "runtime": "react",
    "lesson": "react-05"
  },
  {
    "source": "Book 99 matches Book 99 and Book 990 through Book 999: 11 matches. slice(0, 10) displays the first ten without changing the full match array.",
    "simple": "The text Book 99 matches Book 99 and Book 990 through Book 999, giving 11 items. `slice(0, 10)` shows only the first ten without changing the full results.",
    "runtime": "react",
    "lesson": "react-05"
  },
  {
    "source": "Check every matching value as well as equal lengths: equal counts alone can hide different results.",
    "simple": "Compare the actual matching items, not just how many there are. Two different result lists can have the same length.",
    "runtime": "react",
    "lesson": "react-05"
  },
  {
    "source": "Exclude repeat from the memoized dependencies but retain items and query.",
    "simple": "The memoized version depends on `items` and `query`, but not the unrelated `repeat` counter.",
    "runtime": "react",
    "lesson": "react-05"
  },
  {
    "source": "Initially each calculation represents 1,000 comparisons.",
    "simple": "At first, each version checks 1,000 items.",
    "runtime": "react",
    "lesson": "react-05"
  },
  {
    "source": "After repeating unchanged inputs once, the baseline total becomes 2,000 while the memoized total stays 1,000, with identical match arrays.",
    "simple": "After one repeat with the same search inputs, the baseline has checked 2,000 items in total while the memoized version stays at 1,000. Their results should still match.",
    "runtime": "react",
    "lesson": "react-05"
  },
  {
    "source": "The check's totals assume this supplied run without development StrictMode.",
    "simple": "Those expected totals use the supplied runner without development StrictMode.",
    "runtime": "react",
    "lesson": "react-05"
  },
  {
    "source": "Extra development or discarded renders can make raw execution counts different. useMemo is a performance aid whose cache React may discard;",
    "simple": "Development checks or discarded screen updates can change raw execution counts. React may also discard a `useMemo` cache.",
    "runtime": "react",
    "lesson": "react-05"
  },
  {
    "source": "correct results must not depend on retaining it.",
    "simple": "The app must still return correct results if it has to calculate again instead of using that cache.",
    "runtime": "react",
    "lesson": "react-05"
  },
  {
    "source": "Asynchronous search can finish in a different order from when searches started.",
    "simple": "Searches may finish in a different order from the order you started them.",
    "runtime": "react",
    "lesson": "react-06"
  },
  {
    "source": "If A starts first but B finishes first, B may be the result the person now wants.",
    "simple": "If A starts first and then B finishes first, B may be the search the user now cares about.",
    "runtime": "react",
    "lesson": "react-06"
  },
  {
    "source": "A late success or failure from A must not replace it.",
    "simple": "A late answer or error from A must not overwrite B.",
    "runtime": "react",
    "lesson": "react-06"
  },
  {
    "source": "Give each search a new id, store the latest id in a ref, and compare ids before applying either outcome.",
    "simple": "Give each search a new ID. Remember the latest ID in a ref and check it before showing either a result or an error.",
    "runtime": "react",
    "lesson": "react-06"
  },
  {
    "source": "This standalone JavaScript example demonstrates the order without React:",
    "simple": "This separate JavaScript example shows the ordering problem without React.",
    "runtime": "react",
    "lesson": "react-06"
  },
  {
    "source": "Only Found current prints.",
    "simple": "Only `Found current` is printed.",
    "runtime": "react",
    "lesson": "react-06"
  },
  {
    "source": "The earlier error callback runs later but is ignored. ++ adds one and uses the new value. delay is milliseconds;",
    "simple": "The older error runs later but is ignored. `++` adds one and uses that new value. The delay is measured in milliseconds.",
    "runtime": "react",
    "lesson": "react-06"
  },
  {
    "source": "setTimeout schedules work rather than pausing all JavaScript execution.",
    "simple": "`setTimeout` schedules work for later. It does not stop all JavaScript while it waits.",
    "runtime": "react",
    "lesson": "react-06"
  },
  {
    "source": "In React, a controlled input keeps query in state.",
    "simple": "In React, keep the search field’s current text in state.",
    "runtime": "react",
    "lesson": "react-06"
  },
  {
    "source": "Each search handler uses the query from the render that supplied that handler.",
    "simple": "A search handler uses the query from the screen update that created that handler.",
    "runtime": "react",
    "lesson": "react-06"
  },
  {
    "source": "A callback created inside the handler keeps that snapshot, even if the person types a different query later.",
    "simple": "Its delayed function keeps that query even if the user changes the field afterward.",
    "runtime": "react",
    "lesson": "react-06"
  },
  {
    "source": "A request id decides whether the snapshot is still current.",
    "simple": "The request ID tells you whether that remembered search is still the newest one.",
    "runtime": "react",
    "lesson": "react-06"
  },
  {
    "source": "Typing alone need not start a request;",
    "simple": "Editing the text does not have to start a search by itself.",
    "runtime": "react",
    "lesson": "react-06"
  },
  {
    "source": "pressing Search does in this exercise.",
    "simple": "In this exercise, the Search button starts the request.",
    "runtime": "react",
    "lesson": "react-06"
  },
  {
    "source": "Here is a complete React/JSX App for a separate search example:",
    "simple": "The next complete React example demonstrates a separate search app.",
    "runtime": "react",
    "lesson": "react-06"
  },
  {
    "source": "An empty search ends successfully with No results.",
    "simple": "An empty search succeeds with the message `No results.`",
    "runtime": "react",
    "lesson": "react-06"
  },
  {
    "source": "Searching cedar shows Found cedar.",
    "simple": "Searching for cedar shows `Found cedar`.",
    "runtime": "react",
    "lesson": "react-06"
  },
  {
    "source": "Fail shows the error and hides successful-result content.",
    "simple": "The Fail action shows an error and removes successful-result content.",
    "runtime": "react",
    "lesson": "react-06"
  },
  {
    "source": "Check both race orders.",
    "simple": "Test an old error arriving after new success, and an old success arriving after new error.",
    "runtime": "react",
    "lesson": "react-06"
  },
  {
    "source": "Start a slow error, then a quick success: keep the success after the old error arrives.",
    "simple": "Start a slow failure followed by a fast success. Keep the success when the older failure arrives.",
    "runtime": "react",
    "lesson": "react-06"
  },
  {
    "source": "Start a slow success, then a quick error: keep the error and show no old list after the success arrives.",
    "simple": "Start a slow success followed by a fast failure. Keep the error and do not show the older result list.",
    "runtime": "react",
    "lesson": "react-06"
  },
  {
    "source": "Using the id check at the beginning of the callback protects both.",
    "simple": "Checking the ID before doing anything in the callback protects both success and error updates.",
    "runtime": "react",
    "lesson": "react-06"
  },
  {
    "source": "Clearing error when a new search begins avoids displaying the old failure as though the new attempt already failed.",
    "simple": "Clear the old error when a new search starts so it does not look as though the new search has already failed.",
    "runtime": "react",
    "lesson": "react-06"
  },
  {
    "source": "A useful interface test types into the actual input and activates the actual buttons, then waits long enough for the sample timers and inspects the visible outcome.",
    "simple": "A useful test types into the real field, presses the real buttons, waits for the sample delays, and checks what the user can see.",
    "runtime": "react",
    "lesson": "react-06"
  },
  {
    "source": "It should cover loading, empty success, normal success, failure, and both stale-response orders.",
    "simple": "Test loading, no results, normal results, failure, and both kinds of late outdated reply.",
    "runtime": "react",
    "lesson": "react-06"
  },
  {
    "source": "Testing only the existence of a search function or a particular variable name would miss a broken visible flow.",
    "simple": "Only checking that a function or variable exists would miss mistakes in the screen’s actual behavior.",
    "runtime": "react",
    "lesson": "react-06"
  },
  {
    "source": "For the exercise, preserve Search books, Search, Fail search, Searching…, No results., and Search failed.",
    "simple": "Keep the exercise’s labels and messages: Search books, Search, Fail search, `Searching…`, `No results.`, and the error beginning `Search failed.`",
    "runtime": "react",
    "lesson": "react-06"
  },
  {
    "source": "Try again.",
    "simple": "The error message continues with `Try again.` Keep both sentences in the message.",
    "runtime": "react",
    "lesson": "react-06"
  },
  {
    "source": "Format successful rows as Result for followed by the captured query.",
    "simple": "For a successful result, show `Result for` followed by the query saved for that search.",
    "runtime": "react",
    "lesson": "react-06"
  },
  {
    "source": "A newer B success remains visible when older A fails;",
    "simple": "If B succeeds and older A later fails, keep B’s successful result visible.",
    "runtime": "react",
    "lesson": "react-06"
  },
  {
    "source": "the math question is reasoning about event order, not calculating delay totals.",
    "simple": "The math question asks which event should control the screen, not how to add the delays.",
    "runtime": "react",
    "lesson": "react-06"
  },
  {
    "source": "The supplied timers simulate requests;",
    "simple": "The timers only imitate real requests.",
    "runtime": "react",
    "lesson": "react-06"
  },
  {
    "source": "replacing them with fetch requires the same current-id protection in both success and catch/error paths.",
    "simple": "If you replace them with `fetch`, keep the same current-ID check for both successful answers and caught errors.",
    "runtime": "react",
    "lesson": "react-06"
  }
];

export default readings;
