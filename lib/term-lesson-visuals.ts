import type { AnatomyToken } from "./code-anatomy";

type Part = [text: string, label: string, explanation: string];
type Visual = { language: string; lines: Part[][] };

const visuals: Visual[] = [
  // developer-toolkit-25
  { language: "javascript", lines: [
    [
      ["const coins = 5;", "Starting coins", "You start the game with five coins."],
    ],
    [
      ["console.log(", "Show the result", "Show the number calculated inside the parentheses."],
      ["coins", "Starting amount", "Use the five coins from the first line."],
      [" - 2", "Take two away", "This subtracts two, even though the player won two coins."],
      [");", "End the instruction", "Finish showing the result."],
    ],
  ] },
  // developer-toolkit-26
  { language: "diff", lines: [
    [
      ["-", "Old line", "This line is being replaced."],
      ["const fee = 2 * 3;", "Original total", "Multiply two dollars by three tickets."],
    ],
    [
      ["+", "New line", "This line is being added."],
      ["const pricePerTicket = 2;", "Name the price", "The name tells you what the two dollars are for."],
    ],
    [
      ["+", "New line", "This line is being added."],
      ["const fee = pricePerTicket * 3;", "Same total", "Three tickets still cost six dollars."],
    ],
  ] },
  // developer-toolkit-27
  { language: "javascript", lines: [
    [
      ["const smallOrderFee = ", "Small order fee", "This name stores the fee for a small order."],
      ["3;", "First copy", "The fee here is three dollars."],
    ],
    [
      ["const largeOrderFee = ", "Large order fee", "This name stores the fee for a large order."],
      ["3;", "Second copy", "The same three-dollar fee is written here too."],
    ],
  ] },
  // developer-toolkit-28
  { language: "diff", lines: [
    [
      ["-", "Remove the old line", "This check caused the problem."],
      ["const canSave = ", "Allow saving?", "The result of the check controls the Save button."],
      ["note.length === 0;", "Empty note", "This is true only when the note has zero characters."],
    ],
    [
      ["+", "Add the fixed line", "This is the urgent repair."],
      ["const canSave = ", "Allow saving?", "The Save button still depends on this check."],
      ["note.length > 0;", "Note has text", "This is true when the note has at least one character."],
    ],
  ] },
  // developer-toolkit-29
  { language: "diff", lines: [
    [
      ["-", "Old line", "The minus sign marks the line the teammate wants to replace."],
      ["console.log(\"Helo\");", "Old greeting", "The shared code currently shows Helo with one l."],
    ],
    [
      ["+", "Proposed line", "The plus sign marks the proposed replacement."],
      ["console.log(\"Hello\");", "Corrected greeting", "The teammate wants the program to show Hello with two l’s."],
    ],
  ] },
  // developer-toolkit-30
  { language: "bash", lines: [
    [
      ["gh pr review", "Review on GitHub", "Start a review of a pull request."],
      [" 12", "Request number", "Choose pull request number 12."],
      [" --comment", "Leave a comment", "Send a message on the review."],
      [" --body \"LGTM\"", "Review message", "These are the words the reviewer would send."],
    ],
  ] },
  // java-73
  { language: "java", lines: [
    [
      ["public class Hello {", "Program frame", "Start a class named Hello. The opening brace marks where its contents begin."],
    ],
    [
      ["    public static void main", "Starting point", "In this program, Java starts by running the method named main."],
      ["(String[] args) {", "Inputs and opening brace", "args can hold words passed in at startup. The brace opens the instructions."],
    ],
    [
      ["        System.out.println(\"Hi\");", "Greeting", "This line prints Hi. To change the message, edit the quoted word."],
    ],
    [
      ["    }", "End of main", "This brace ends the instructions inside main."],
    ],
    [
      ["}", "End of the class", "This brace closes the Hello class."],
    ],
  ] },
  // python-93
  { language: "python", lines: [
    [
      ["#", "Start a comment", "Python treats the rest of this line as a note."],
      [" Show a greeting", "Note for the reader", "These words explain what the next line will do."],
    ],
    [
      ["print(\"Hello\")", "Show the greeting", "This instruction displays Hello."],
    ],
  ] },
  // python-94
  { language: "python", lines: [
    [
      ["if", "Keyword", "This word tells Python to check a condition."],
      [" True", "The condition", "True makes the check pass."],
      [":", "Start the block", "The next indented line belongs to this check."],
    ],
    [
      ["    ", "Indent", "These spaces put the next instruction inside the check."],
      ["print(\"Ready\")", "Show Ready", "This line runs because the check passed."],
    ],
  ] },
  // python-95
  { language: "python", lines: [
    [
      ["import os", "Get the settings tool", "Python's os module can read settings from the computer."],
    ],
    [
      ["api_key = ", "Store the result", "This name holds the value that Python reads."],
      ["os.getenv", "Read a setting", "Ask the computer for the named setting."],
      ["(\"STUDY_API_KEY\")", "Setting name", "This is the name to look up. The secret itself stays out of the example."],
    ],
  ] },
];

const bySource = new Map(visuals.map(visual => {
  const code = visual.lines.map(line => line.map(part => part[0]).join("")).join("\n");
  return [visual.language + "\n" + code, visual.lines] as const;
}));

export function termLessonTokens(source: string, language: string): AnatomyToken[] | undefined {
  const lines = bySource.get(language + "\n" + source.replace(/\r\n/g, "\n").replace(/\n$/, ""));
  if (!lines) return undefined;
  const tokens: AnatomyToken[] = [];
  let offset = 0;
  for (const line of lines) {
    for (const [text, label, explanation] of line) {
      const from = offset;
      offset += text.length;
      tokens.push({ text, from, to: offset, label, explanation, plainExplanation: explanation, tone: "blue" });
    }
    offset += source[offset] === "\r" ? 2 : 1;
  }
  return tokens;
}
