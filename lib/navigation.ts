import type { Lesson, Unit } from "./types";
export type QuestRoute = {
  view: string;
  studioMode: "course" | "practice";
  phase: string;
  activeId: string;
  paragraph: number;
};
const views = new Set(["quest", "studio", "path", "progress", "settings"]);
const steps = new Set(["learn", "practice", "build", "math", "done"]);
export function normalizeRoute(
  input: Partial<QuestRoute>,
  fallbackId: string,
  units: Unit[],
  lessons: Lesson[],
): QuestRoute {
  input = input && typeof input === "object" ? input : {};
  const activeId = units.some((u) => u.id === input.activeId)
    ? input.activeId!
    : fallbackId;
  const lesson = lessons.find((l) => l.id === activeId);
  return {
    view: views.has(input.view ?? "") ? input.view! : "quest",
    studioMode: input.studioMode === "practice" ? "practice" : "course",
    phase: steps.has(input.phase ?? "") ? input.phase! : "learn",
    activeId,
    paragraph: Math.max(
      0,
      Math.min(
        Number.isSafeInteger(input.paragraph) ? input.paragraph! : 0,
        Math.max(0, (lesson?.explanation.length ?? 1) - 1),
      ),
    ),
  };
}
export function routeHash(route: QuestRoute) {
  const params = new URLSearchParams({
    lesson: route.activeId,
    step: route.phase,
  });
  if (route.studioMode === "practice") params.set("mode", "practice");
  params.set("idea", String(route.paragraph + 1));
  return "#" + route.view + "?" + params;
}
export function parseRoute(
  hash: string,
  fallbackId: string,
  units: Unit[],
  lessons: Lesson[],
): QuestRoute | null {
  const [view, query] = hash.replace(/^#/, "").split("?");
  if (!views.has(view)) return null;
  const params = new URLSearchParams(query);
  return normalizeRoute(
    {
      view,
      activeId: params.get("lesson") ?? fallbackId,
      phase: params.get("step") ?? (view === "studio" ? "build" : "learn"),
      studioMode: params.get("mode") === "practice" ? "practice" : "course",
      paragraph: Number(params.get("idea") ?? 1) - 1,
    },
    fallbackId,
    units,
    lessons,
  );
}
export function topicMatches(topic: string, project: string, query: string) {
  const synonyms: Record<string, string> = {
    repeat: "loop",
    repetition: "loop",
    decision: "conditional",
    decisions: "conditional",
    dictionary: "dictionaries",
    variable: "basics",
    variables: "basics",
    terminal: "terminal",
    error: "error",
    debugging: "debugging",
    loop: "loop",
    loops: "loop",
    function: "function",
    functions: "function",
  };
  const words = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  const text = (topic + " " + project).toLowerCase();
  return words.every(
    (word) =>
      text.includes(word) || (synonyms[word] && text.includes(synonyms[word])),
  );
}
