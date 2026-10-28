import type { LessonPractice } from "./lesson-step-flow";

/** Reviewed, bounded teaching cases—not an evaluator. Never infer a program's
 * result from one token or execute arbitrary curriculum code in the browser. */
export function understandingPractice(source: string, language: string): LessonPractice | null {
  const code = source.trim();
  const lang = language.toLowerCase();
  const python = lang === "python" || lang === "py";
  const javascript = ["javascript", "js", "typescript", "ts"].includes(lang);
  const make = (question: string, answer: string, distractors: string[], explanation: string, plainExplanation: string, preparation: string[] = []): LessonPractice => {
    const options = [...new Set(distractors.filter(item => item !== answer))].slice(0, 3);
    options.splice(code.length % (options.length + 1), 0, answer);
    return { kind: "practice", code, language, role: "Understanding", question, answer, options, explanation, plainExplanation, preparation };
  };
  // Values: a changed representation, not selecting a token already labeled Number.
  const numberAssignment = code.match(/^(?:(?:const|let)\s+)?([A-Za-z_]\w*)\s*=\s*(-?\d+(?:\.\d+)?);?$/);
  if ((python || javascript) && numberAssignment) {
    const [, name, value] = numberAssignment;
    return make(`If ${value} is replaced with "${value}" here, what changes?`,
      "The value becomes text instead of a number.",
      ["The value stays a number because the digits are unchanged.", "The name on the left changes.", "The quotation marks have no effect."],
      `Quotation marks make "${value}" a text value, even though its characters are digits. Without quotes, ${value} is a number.`,
      `${name} keeps the same name. What changes is the kind of information assigned to it.`,
      ["Quotation marks make a value text, even when its characters are digits."]);
  }
  // A two-line, closed example can be reasoned about without unseen state.
  const rebind = code.match(/^([A-Za-z_]\w*)\s*=\s*(-?\d+)\s*\n\1\s*=\s*\1\s*\+\s*(\d+)$/);
  if (python && rebind) {
    const [, name, first, increment] = rebind;
    const result = Number(first) + Number(increment);
    if (![Number(first), Number(increment), result].every(Number.isSafeInteger)) return null;
    return make(`After both lines, which value does ${name} refer to?`, String(result),
      [first, increment, `"${first} + ${increment}"`, "It keeps both numbers separately.", "No value is assigned."],
      `The second line reads the old value ${first}, adds ${increment}, then assigns ${result} to ${name}.`,
      "Assignment uses the right-hand result; it does not keep both values under the same name.",
      ["With numbers, + adds the two values.", "Each line runs in order. A later assignment replaces the value the name refers to."]);
  }
  const namedOutput = code.match(/^([A-Za-z_]\w*)\s*=\s*(["'])([^"'\\\n]*)\2\s*\nprint\(\1\)$/);
  if (python && namedOutput) {
    const [, name, , value] = namedOutput;
    return make(`If the last line becomes print("${name}"), what will it display?`, name,
      [value, `"${name}" (including quotation marks)`, "Nothing is displayed."],
      `With quotes, "${name}" is literal text. Without quotes, Python looks up ${name} and finds ${JSON.stringify(value)}.`,
      "Quoting a name changes it from a lookup into text to display.",
      ["Without quotes, print reads the value a name refers to.", "With quotes, print displays those characters as text instead of looking up a name."]);
  }
  const printLiteral = code.match(python ? /^print\((["'])([^"'\\\n]*)\1\)$/ : /^console\.log\((["'])([^"'\\\n]*)\1\);?$/);
  if ((python || javascript) && printLiteral) {
    const value = printLiteral[2];
    return make("What output will a person see when this instruction runs?", value || "An empty line.",
      [JSON.stringify(value) + " (including quotation marks)", code, "Nothing: text cannot be displayed."],
      `The call displays the text inside the quotation marks${value ? `: ${value}` : " as an empty line"}. The marks delimit text in source code; they are not part of this value.`,
      "The code is the instruction. The displayed text is its result.",
      ["Output is the text or result a program displays.", `${python ? "print" : "console.log"} displays the text inside the quotation marks, without showing the marks themselves.`]);
  }
  const printPair = code.match(/^print\((["'])([^"'\\\n]+)\1,\s*(-?\d+)\)$/);
  if (python && printPair) {
    const [, , text, number] = printPair;
    return make("What output will this one print instruction display?", `${text} ${number}`,
      [`${text}${number}`, `${number} ${text}`, `"${text}", ${number}`],
      `print displays the two values in order, separated by a space by default. The comma separates inputs in code; it is not printed.`,
      "Quotation marks are not displayed around the text.",
      ["print can display several values in order.", "A comma separates the values in the code; print puts a space between them in its output."]);
  }
  const textAssignment = code.match(/^(?:(?:const|let)\s+)?([A-Za-z_]\w*)\s*=\s*(["'])([^"'\\\n]+)\2;?$/);
  if ((python || javascript) && textAssignment) {
    const [, name, , value] = textAssignment;
    const replacement = value === "Clover" ? "Pepper" : "Clover";
    return make(`Replace ${JSON.stringify(value)} with ${JSON.stringify(replacement)} here. What does ${name} refer to afterward?`, JSON.stringify(replacement),
      [JSON.stringify(value), JSON.stringify(name), "Both text values at once."],
      `The right side supplies the assigned value, so ${name} refers to ${JSON.stringify(replacement)}.`,
      "Editing the value does not rename the variable or combine the old and new text.",
      ["The name is on the left of =; its assigned value comes from the right.", "Changing only the value on the right leaves the name unchanged."]);
  }
  if (lang === "html") {
    const link = code.match(/^<a\s+href=(["'])([^"']+)\1\s*>([^<>]+)<\/a>$/);
    if (link) return make("If only the words between the tags change, what happens to the link?", "Its visible words change; its destination stays the same.",
      ["Its destination changes to match the new words.", "It creates a new page automatically.", "Its visible words stay the same."],
      "The content between the a tags is the visible label. The href attribute separately supplies the destination.",
      "To change where the link goes, edit href—not just its label.",
      ["A link has visible words and a separate destination.", "The words between the a tags are its visible label; href gives its destination."]);
  }
  if (lang === "css") {
    const rule = code.match(/^([.#][\w-]+)\s*\{\s*color:\s*([\w#]+);?\s*\}$/);
    if (rule) return make(`If the color value changes but ${rule[1]} stays the same, what changes?`, "The same matched elements get a different text color.",
      ["Different elements are selected.", "The text content is replaced.", "The elements are removed from the page."],
      "The selector determines which elements match. The color declaration changes their text color, not their content or identity.",
      "Changing a setting's value does not change which elements the selector selects.",
      ["A CSS selector chooses the elements a rule applies to.", "The color setting changes the text color of those elements, not their words."]);
  }
  // Unknown, partial, stateful and advanced snippets remain examples. Their
  // authored lesson checks cover meaning; a fabricated token quiz would not.
  return null;
}
