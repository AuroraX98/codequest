import { supportsCodeAnatomy } from "./code-anatomy";
import { understandingPractice } from "./understanding-practice";
import { lessonIdeas } from "./lesson-ideas";
import { lessonBlocks } from "./lesson-markup";

export type LessonPractice = {
  kind: "practice";
  preparation?: string[];
  code: string;
  language: string;
  question: string;
  role: string;
  answer: string;
  options: string[];
  explanation: string;
  plainExplanation: string;
};
export type LessonStep =
  | { kind: "explain"; text: string; purpose?: "exercise-preparation" }
  | { kind: "example"; code: string; language: string }
  | { kind: "output"; code: string; language: string }
  | LessonPractice;

/** Use real sentence or semicolon boundaries; never turn a long idea into fragments. */
export function shortLessonThoughts(text: string): string[] {
  return lessonIdeas(text).flatMap((idea) => {
    const thoughts: string[] = [];
    let start = 0, inCode = false, inBold = false;
    for (let i = 0; i < idea.length; i++) {
      if (idea[i] === "`") { inCode = !inCode; continue; }
      if (inCode) continue;
      if (idea.slice(i, i + 2) === "**") { inBold = !inBold; i++; continue; }
      if (!/[.!?;]/.test(idea[i])) continue;
      // A sentence may end just inside a closing bold marker. Keep that marker.
      const closesBold = inBold && idea.slice(i + 1, i + 3) === "**";
      if (inBold && !closesBold) continue;
      const end = i + (closesBold ? 3 : 1);
      const tail = idea.slice(end);
      const boundary = idea[i] === ";" ? /^\s+\S/ : /^\s+(?=(?:\*\*)?[A-Z0-9`"“])/;
      if (!boundary.test(tail)) continue;
      const thought = idea.slice(start, end).trim();
      if (/\b(?:e\.g|i\.e|Mr|Mrs|Dr|vs)\.(?:\*\*)?$/i.test(thought)) continue;
      thoughts.push(thought);
      start = end;
    }
    if (idea.slice(start).trim()) thoughts.push(idea.slice(start).trim());
    return thoughts;
  });
}

/** Only reviewed consequence checks are generated. Unknown code stays an example;
 * its authored lesson exercise supplies the understanding check instead. */
export function codePartPractice(code: string, language: string): LessonPractice | null {
  return understandingPractice(code, language);
}

/** A read-only view of the curriculum. The original text is the reference source. */
export function buildLessonSteps(text: string, runtime: string): LessonStep[] {
  const steps: LessonStep[] = [];
  const examples = new Set<string>();
  const addExample = (code: string, language: string) => {
    if (!supportsCodeAnatomy(language)) {
      steps.push({ kind: "output", code, language });
      return;
    }
    const key = language.toLowerCase() + "\0" + code.trim();
    if (examples.has(key)) return;
    examples.add(key);
    const practice = codePartPractice(code, language);
    // Essential rules appear as ordinary short steps before the example and
    // question. They must never require opening the anatomy disclosure.
    for (const preparation of practice?.preparation ?? []) {
      for (const thought of shortLessonThoughts(preparation)) {
        const normalize = (value: string) => value.replace(/\s+/g, " ").trim();
        if (!steps.some(step => step.kind === "explain" && normalize(step.text).includes(normalize(thought))))
          steps.push({ kind: "explain", text: thought, purpose: "exercise-preparation" });
      }
    }
    steps.push({ kind: "example", code, language });
    if (practice) steps.push(practice);
  };
  for (const block of lessonBlocks(text, runtime)) {
    if (block.kind === "code") {
      addExample(block.code, block.language);
      continue;
    }
    for (const paragraph of block.text.trim().split(/\n\s*\n/)) {
      for (const thought of shortLessonThoughts(paragraph)) {
        steps.push({ kind: "explain", text: thought });
        for (const match of thought.matchAll(/`([^`\n]+)`/g)) {
          const code = match[1];
          if (/\w\s*\(|[A-Za-z_]\w*\s*=(?!=)|^["']/.test(code)) addExample(code, runtime);
        }
      }
    }
  }
  return steps.length ? steps : [{ kind: "explain", text: "There is no reading in this section. Continue when you are ready." }];
}

/** Optional detail must add information, not preview or repeat canonical steps. */
export function distinctLessonReference(text: string, reference: string, runtime: string): string {
  const normalized = (value: string) => value.replace(/\s+/g, " ").trim();
  if (!reference.trim() || normalized(text).includes(normalized(reference))) return "";
  const original = lessonBlocks(text, runtime);
  const thoughts = new Set(original.filter(b => b.kind === "prose").flatMap(b => shortLessonThoughts(b.text)).map(normalized));
  const code = new Set(original.filter(b => b.kind === "code").map(b => b.language + "\0" + b.code.trim()));
  return lessonBlocks(reference, runtime).flatMap(block => {
    if (block.kind === "code") return !block.code.trim() || code.has(block.language + "\0" + block.code.trim()) ? [] : [`\`\`\`${block.language}\n${block.code.trimEnd()}\n\`\`\``];
    return shortLessonThoughts(block.text).filter(thought => !thoughts.has(normalized(thought)));
  }).join("\n\n");
}
