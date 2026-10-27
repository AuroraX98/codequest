"use client";
import PythonControlScenes from "./PythonControlScenes";
import PythonCollectionScenes from "./PythonCollectionScenes";
import PythonGeneratorScene from "./PythonGeneratorScene";
import PythonCsvScene from "./PythonCsvScene";
const scenes = [
  {
    id: "python-03",
    paragraph: 2,
    title: "The exact boundary chooses a reminder",
  },
  { id: "python-04", paragraph: 2, title: "Each day visits the same station" },
  {
    id: "python-05",
    paragraph: 4,
    title: "The same collection gains a new entry",
  },
  {
    id: "python-08",
    paragraph: 2,
    title: "Keep the recipe; return a new batch",
  },
  {
    id: "python-15",
    paragraph: 2,
    title: "Ask for one value; keep your place",
  },
  {
    id: "python-23",
    paragraph: 2,
    title: "Quotation boundaries keep one item together",
  },
] as const;
export const pythonSceneLessons = scenes.map((scene) => scene.id);
export function getPythonLessonScene(id: string, paragraph: number) {
  return scenes.find(
    (scene) => scene.id === id && scene.paragraph === paragraph,
  );
}
/** Authored local what-if scenes; reading and project completion are untouched. */
export default function PythonLessonScene({ unitId }: { unitId: string }) {
  if (unitId === "python-03" || unitId === "python-04")
    return <PythonControlScenes unitId={unitId} />;
  if (unitId === "python-05" || unitId === "python-08")
    return <PythonCollectionScenes unitId={unitId} />;
  if (unitId === "python-15") return <PythonGeneratorScene />;
  if (unitId === "python-23") return <PythonCsvScene />;
  return null;
}
