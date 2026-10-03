import type { Lesson } from "./types";
const marker = "/* CodeQuest saved project v1 */\n";
export function readProject(saved: string | undefined, lesson: Lesson) {
  const files = Object.fromEntries(
    (lesson.extraFiles ?? []).map((f) => [f.name, f.code]),
  );
  if (saved?.startsWith(marker)) {
    try {
      const value = JSON.parse(saved.slice(marker.length));
      if (typeof value.code === "string") {
        for (const name of Object.keys(files))
          if (typeof value.files?.[name] === "string")
            files[name] = value.files[name];
        return { code: value.code, files };
      }
    } catch {}
  }
  return { code: saved ?? lesson.starter, files };
}
export function writeProject(code: string, files: Record<string, string>) {
  return Object.keys(files).length
    ? marker + JSON.stringify({ code, files })
    : code;
}
