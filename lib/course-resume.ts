import type { QuestRoute } from "./navigation";
import { normalizeRoute } from "./navigation";
import type { Unit, Lesson } from "./types";
export type CourseBookmark = QuestRoute & { savedAt: string };
export type CourseBookmarks = Record<string, CourseBookmark>;
/** Ignore damaged/obsolete bookmarks without changing completed learning records. */
export function validBookmarks(value: unknown, units: Unit[], lessons: Lesson[]): CourseBookmarks {
  const result: CourseBookmarks = {};
  if (!value || typeof value !== "object" || Array.isArray(value)) return result;
  for (const [track, raw] of Object.entries(value)) {
    if (!raw || typeof raw !== "object") continue;
    const b = raw as CourseBookmark;
    const unit = units.find(u => u.id === b.activeId && u.track === track);
    if (!unit || typeof b.savedAt !== "string" || !Number.isFinite(Date.parse(b.savedAt))) continue;
    if (b.view !== "quest" && !(b.view === "studio" && b.studioMode === "course")) continue;
    result[track] = { ...normalizeRoute(b, unit.id, units, lessons), savedAt: b.savedAt };
  }
  return result;
}
export function mergeBookmarks(...sources: CourseBookmarks[]): CourseBookmarks {
  const result: CourseBookmarks = {};
  for (const source of sources) for (const [track, bookmark] of Object.entries(source)) {
    if (!result[track] || Date.parse(bookmark.savedAt) > Date.parse(result[track].savedAt)) result[track] = bookmark;
  }
  return result;
}
export function latestBookmark(bookmarks: CourseBookmarks): CourseBookmark | undefined {
  return Object.values(bookmarks).sort((a,b) => Date.parse(b.savedAt) - Date.parse(a.savedAt))[0];
}
export function isExplicitLessonLink(hash: string): boolean {
  const query = hash.split("?")[1];
  return !!query && new URLSearchParams(query).has("lesson");
}
