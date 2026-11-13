import web from "../content/course-idea-examples-web.json";
import systems from "../content/course-idea-examples-systems.json";
import applied from "../content/course-idea-examples-applied.json";
import { pythonIdeaExamples } from "./python-idea-examples";
import type { CourseLessonExamples, IdeaExamples } from "./idea-example";

const courses: Record<string, CourseLessonExamples> = { ...web, ...systems, ...applied };

/** Explicit authored-step mappings keep code context visible after paging. */
export function courseIdeaExamples(lessonId: string, section: number): IdeaExamples | undefined {
  if (lessonId.startsWith("python-")) return pythonIdeaExamples(lessonId, section);
  const lesson = courses[lessonId];
  const thoughtExamples = lesson?.sections[section];
  return thoughtExamples ? { examples: lesson.examples, thoughtExamples } : undefined;
}
