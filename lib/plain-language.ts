import beginnerPython from "./plain-beginner-python";

import htmlReadings from "./plain-html-readings";
import cssReadings from "./plain-css-readings";
import pythonFoundations from "./plain-python-foundations";

import pythonAdvanced from "./plain-python-advanced";
import typescriptReadings from "./plain-typescript-readings";
import reactReadings from "./plain-react-readings";
import backendReadings from "./plain-backend-readings";

import javascriptReadings from "./plain-javascript-readings";
import sqlReadings from "./plain-sql-readings";
import swiftReadings from "./plain-swift-readings";
import developerReadings from "./plain-developer-readings";

export type PlainLanguagePair = { source: string; simple: string; runtime: string; lesson: string };
/** Curated, source-matched counterparts only. Missing entries stay visibly unpaired. */
export const plainLanguagePairs: PlainLanguagePair[] = [...beginnerPython, ...htmlReadings, ...cssReadings, ...pythonFoundations, ...pythonAdvanced, ...typescriptReadings, ...reactReadings, ...backendReadings, ...javascriptReadings, ...sqlReadings, ...swiftReadings, ...developerReadings];
const normalize = (text: string) => text.replace(/\s+/g, " ").trim();
const bySource = new Map(plainLanguagePairs.map(pair => [pair.runtime + "\0" + normalize(pair.source), pair.simple]));
export function plainLessonExplanation(text: string, runtime: string): string | null {
  return bySource.get(runtime + "\0" + normalize(text)) ?? null;
}
