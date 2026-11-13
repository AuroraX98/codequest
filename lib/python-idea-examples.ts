import foundations from "../content/python-idea-examples-foundations.json";
import language from "../content/python-idea-examples-language.json";
import advanced from "../content/python-idea-examples-advanced.json";
import type { IdeaExamples } from "./idea-example";

const examples: Record<string, IdeaExamples[]> = { ...foundations, ...language, ...advanced };

export function pythonIdeaExamples(lessonId: string, section: number): IdeaExamples | undefined {
  return examples[lessonId]?.[section];
}
