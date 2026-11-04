/** Plain-language roles for Swift's reserved and contextual words. */
const words: Record<string, [string, string]> = {
  "let": [
    "Fixed name",
    "Gives a value a name. You cannot use = to make this name hold a different value later."
  ],
  "var": [
    "Changeable name",
    "Gives a value a name. You can assign a different value to this name later."
  ],
  "func": [
    "Define",
    "Starts a function definition."
  ],
  "return": [
    "Send back",
    "Ends this function call and sends its result back, if one is given."
  ],
  "if": [
    "Check a condition",
    "Runs the following branch when its condition is true."
  ],
  "else": [
    "Otherwise",
    "Runs the alternative branch when the earlier condition does not pass."
  ],
  "guard": [
    "Check before continuing",
    "Continues only when the conditions pass. The else branch must leave this scope."
  ],
  "for": [
    "Repeat for items",
    "Repeats the body for values from a sequence."
  ],
  "in": [
    "Body follows",
    "Separates loop inputs from their sequence, or a closure's inputs from its body."
  ],
  "while": [
    "Repeat while true",
    "Tests a condition to decide whether to continue a loop."
  ],
  "repeat": [
    "Run, then check",
    "Runs the loop body before checking its while condition."
  ],
  "break": [
    "Leave this block",
    "Exits the loop or switch it targets."
  ],
  "continue": [
    "Next turn",
    "Skips the rest of this loop turn and moves to the next one."
  ],
  "switch": [
    "Choose a case",
    "Chooses a branch by matching a value against case patterns."
  ],
  "case": [
    "Match a choice",
    "Declares an enum choice or matches a pattern in a switch or condition."
  ],
  "default": [
    "Other cases",
    "Handles switch values that did not match an earlier case."
  ],
  "struct": [
    "Value type",
    "Defines a type whose instances are copied as values."
  ],
  "class": [
    "Class",
    "Defines a reference type, or marks a type member in a class declaration."
  ],
  "enum": [
    "Named choices",
    "Defines a type with a fixed set of named cases."
  ],
  "protocol": [
    "Required abilities",
    "Lists features that a type promises to provide."
  ],
  "extension": [
    "Add features",
    "Adds features or protocol support to an existing type."
  ],
  "actor": [
    "Protected state",
    "Defines a type that protects its stored, changing data from unsafe concurrent access."
  ],
  "init": [
    "Set up a value",
    "Defines how a new instance is set up."
  ],
  "deinit": [
    "Before release",
    "Defines work to do just before a class instance is released."
  ],
  "self": [
    "This value",
    "Refers to the current instance; after a dot, it can also refer to a value or type itself."
  ],
  "super": [
    "Superclass",
    "Refers to the superclass version of an inherited feature."
  ],
  "mutating": [
    "Allow changes",
    "Allows a value-type method to change that instance."
  ],
  "inout": [
    "Change an input",
    "Allows a function to change the caller's supplied value through this parameter."
  ],
  "static": [
    "Belongs to the type",
    "Makes this feature belong to the type itself instead of an individual instance."
  ],
  "override": [
    "Replace inherited behavior",
    "Marks a replacement for an inherited class feature."
  ],
  "final": [
    "Prevent replacement",
    "Prevents subclassing this class or overriding this class feature."
  ],
  "private": [
    "Keep access close",
    "Limits access to the enclosing declaration and its same-file extensions."
  ],
  "fileprivate": [
    "This file only",
    "Limits access to this source file."
  ],
  "internal": [
    "This module",
    "Allows access within the current module."
  ],
  "public": [
    "Other modules",
    "Allows code in other modules to use this declaration."
  ],
  "open": [
    "Allow subclassing",
    "Also permits other modules to subclass this class or override this class member."
  ],
  "import": [
    "Use a module",
    "Makes another module's available code usable in this file."
  ],
  "throws": [
    "Can fail",
    "Marks a function that can throw an error."
  ],
  "throw": [
    "Report failure",
    "Stops normal work and sends an error to the caller or a matching catch."
  ],
  "try": [
    "Attempt a call",
    "Marks an expression that may throw an error."
  ],
  "do": [
    "Try this work",
    "Groups work in a block, often with catch branches to handle errors."
  ],
  "catch": [
    "Handle failure",
    "Handles an error thrown from the matching do block."
  ],
  "defer": [
    "Finish on exit",
    "Schedules work for when the current scope ends, once execution reaches this statement."
  ],
  "async": [
    "Work that can pause",
    "Marks work that can pause; async let starts a child task."
  ],
  "await": [
    "Possible pause",
    "Marks a place where this work may pause while waiting for a result or actor access."
  ],
  "weak": [
    "Do not keep alive",
    "Refers to a class object without keeping it alive; becomes nil when the object is released."
  ],
  "unowned": [
    "Non-owning reference",
    "Does not keep the object alive. A normal unowned reference must only be used while its object still exists."
  ],
  "associatedtype": [
    "Type placeholder",
    "Names a type that each type following this protocol must supply."
  ],
  "where": [
    "Extra requirement",
    "Adds a condition to a pattern or a requirement on generic types."
  ],
  "some": [
    "One hidden type",
    "In a result type, hides one fixed type that has the promised abilities."
  ],
  "any": [
    "Any matching type",
    "Allows a value of any type that meets this protocol's requirements."
  ],
  "is": [
    "Check the type",
    "Checks whether a value has the requested type."
  ],
  "as": [
    "Use another type",
    "Introduces a type conversion. as? can return nil when a cast fails."
  ],
  "didSet": [
    "After assignment",
    "Runs this property's observer after its value is assigned."
  ],
  "willSet": [
    "Before assignment",
    "Runs this property's observer before its new value is stored."
  ]
};

export function swiftCodeWord(text: string, previous: string, after: string): [string, string] | null {
  if (previous === "." && !["self", "init"].includes(text)) return null;
  if (text === "get" && /^\s*\{/.test(after)) return ["Read a property", "Runs when this computed property is read."];
  if (text === "set" && /^\s*(?:\{|\([^)]*\)\s*\{)/.test(after)) return ["Change a property", "Handles a new value assigned to this computed property."];
  if (text === "in") return ["Connect the parts", "In a for loop, introduces the sequence to visit. In a closure, starts its body after the input or capture list."];
  if (["some", "any", "async", "await"].includes(text) && /^\s*:/.test(after)) return null;
  return words[text] ?? null;
}

