"use client";

import CodeQuest from "./CodeQuest";
import catalog from "../content/catalog.json";
import lessons from "../content/lessons.json";
import type { Unit, Lesson } from "../lib/types";

/** Keep static curriculum out of the per-request React Flight payload. */
export default function CodeQuestApp({ localMode = false }: { localMode?: boolean }) {
  return <CodeQuest units={catalog.units as Unit[]} lessons={lessons as Lesson[]} localMode={localMode} />;
}
