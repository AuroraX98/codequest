import { webPlatformDiagrams } from "./diagram-web-platform";
import { javascriptPythonDiagrams } from "./diagram-javascript-python";
import { sqlSwiftTypescriptDiagrams } from "./diagram-sql-swift-typescript";
import type { LessonDiagramData } from "./diagram-drawing";

/** Explicit illustrations, each checked against its lesson's authored example. */
export const authoredLessonDiagrams = [...webPlatformDiagrams, ...javascriptPythonDiagrams, ...sqlSwiftTypescriptDiagrams];
export const lessonDiagrams: Readonly<Record<string, LessonDiagramData>> = Object.fromEntries(authoredLessonDiagrams.map(diagram => [diagram.id, diagram]));
export function getLessonDiagram(id: string): LessonDiagramData | undefined {
  return Object.prototype.hasOwnProperty.call(lessonDiagrams, id) ? lessonDiagrams[id] : undefined;
}
