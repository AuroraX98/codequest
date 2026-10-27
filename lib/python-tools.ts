import type { Lesson, Unit } from "./types";
import type { ConceptId } from "./python-concepts";
export type PythonTool = {
  id: string;
  title: string;
  kind: "Concept" | "Function" | "Method" | "Module tool";
  lessonId: string;
  paragraph: number;
  concept?: ConceptId;
  hint: string;
  level: string;
};
// Curated entry points into existing authored lessons, not generated lesson copies.
const entries: [
  string,
  PythonTool["kind"],
  string,
  number,
  string,
  ConceptId?,
][] = [
  [
    "Programs",
    "Concept",
    "python-01",
    0,
    "Instructions and the order they run in.",
    "program",
  ],
  ["Values", "Concept", "python-01", 0, "Information and its kind.", "values"],
  [
    "Strings & numbers",
    "Concept",
    "python-01",
    0,
    "Text versus quantities.",
    "strings",
  ],
  [
    "Variables & names",
    "Concept",
    "python-01",
    0,
    "Refer to a value by name.",
    "names",
  ],
  [
    "Assignment (=)",
    "Concept",
    "python-01",
    0,
    "Bind a name to a result.",
    "assignment",
  ],
  ["print()", "Function", "python-01", 0, "Display a value.", "output"],
  [
    "input()",
    "Function",
    "python-input",
    0,
    "Ask for typed text; the returned answer is a string.",
  ],
  [
    "Types & comparisons",
    "Concept",
    "python-02",
    0,
    "Numbers, text, Booleans, and comparisons.",
  ],
  [
    "if / else",
    "Concept",
    "python-03",
    0,
    "Choose a branch using a condition.",
  ],
  [
    "def & parameters",
    "Concept",
    "python-08",
    0,
    "Create a reusable function.",
  ],
  ["return", "Concept", "python-08", 1, "Send a result back to the caller."],
  ["for loops", "Concept", "python-04", 0, "Visit each item in a collection."],
  ["Lists", "Concept", "python-05", 0, "Keep values in an ordered collection."],
  ["Indexing", "Concept", "python-05", 1, "Read an item by position."],
  ["len()", "Function", "python-05", 1, "Count items in a collection."],
  [
    "list.append()",
    "Method",
    "python-05",
    3,
    "Add an item to an existing list.",
  ],
  ["f-strings", "Concept", "python-22", 1, "Insert values into readable text."],
  ["sorted()", "Function", "python-06", 1, "Create a sorted copy."],
  [
    "list.sort()",
    "Method",
    "python-06",
    1,
    "Sort a list in place; compare with sorted().",
  ],
  ["Slicing", "Concept", "python-06", 3, "Choose a range of positions."],
  ["str.strip()", "Method", "python-07", 1, "Remove surrounding whitespace."],
  ["str.lower()", "Method", "python-07", 1, "Return lowercase text."],
  ["str.split()", "Method", "python-07", 3, "Separate text into pieces."],
  ["Tuples", "Concept", "python-09", 1, "Keep an ordered fixed collection."],
  ["Dictionaries", "Concept", "python-09", 2, "Look up values by key."],
  ["Sets", "Concept", "python-09", 3, "Keep unique members."],
  [
    "List comprehensions",
    "Concept",
    "python-10",
    0,
    "Build a list from an expression.",
  ],
  [
    "Classes & __init__",
    "Concept",
    "python-11",
    1,
    "Initialize instances with their own data.",
  ],
  [
    "Duck typing",
    "Concept",
    "python-12",
    1,
    "Use an object through its supported methods.",
  ],
  [
    "import & modules",
    "Concept",
    "python-13",
    0,
    "Reuse code from another module.",
  ],
  ["max()", "Function", "python-19", 1, "Find the largest value."],
  ["isinstance()", "Function", "python-20", 3, "Check the kind of a value."],
  ["all()", "Function", "python-20", 4, "Check whether every test is true."],
  [
    "csv.DictReader()",
    "Module tool",
    "python-23",
    1,
    "Read named columns from CSV text.",
  ],
  [
    "io.StringIO()",
    "Module tool",
    "python-23",
    1,
    "Use a string as a text stream.",
  ],
  ["dict.get()", "Method", "python-23", 5, "Read a key with a default value."],
  ["json.loads()", "Module tool", "python-24", 1, "Parse JSON text."],
  [
    "Generators",
    "Concept",
    "python-15",
    1,
    "Produce values as they are requested.",
  ],
  ["async / await", "Concept", "python-16", 0, "Coordinate asynchronous work."],
  [
    "asyncio.run()",
    "Module tool",
    "python-16",
    1,
    "Run the main coroutine in an event loop.",
  ],
  [
    "min()",
    "Function",
    "python-17",
    1,
    "Choose the smaller value, alongside max().",
  ],
  ["sum()", "Function", "python-18", 1, "Add values in a collection."],
  [
    "Recursion",
    "Concept",
    "python-25",
    1,
    "Follow a problem through smaller calls.",
  ],
];
export function pythonTools(units: Unit[], lessons: Lesson[]): PythonTool[] {
  return entries
    .flatMap(([title, kind, lessonId, paragraph, hint, concept], index) => {
      const unit = units.find((u) => u.id === lessonId && u.track === "python");
      const lesson = lessons.find((l) => l.id === lessonId);
      return unit && lesson && paragraph < lesson.explanation.length
        ? [
            {
              id: `python-tool-${index}`,
              title,
              kind,
              lessonId,
              paragraph,
              hint,
              level: unit.level,
              ...(concept ? { concept } : {}),
            },
          ]
        : [];
    })
    .sort(
      (a, b) =>
        ["beginner", "intermediate", "advanced"].indexOf(a.level) -
        ["beginner", "intermediate", "advanced"].indexOf(b.level),
    );
}
export function matchPythonTool(tool: PythonTool, query: string) {
  const text = `${tool.title} ${tool.kind} ${tool.hint}`.toLowerCase();
  return query
    .trim()
    .toLowerCase()
    .replace(/[()]/g, "")
    .split(/\s+/)
    .filter(Boolean)
    .every((word) => text.includes(word));
}
