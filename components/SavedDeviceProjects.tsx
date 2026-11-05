import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { courseProjects } from "../lib/course-projects";
import { readSavedCourseProject } from "../lib/course-project-storage";
import {
  localProjectExamples,
  localProjectStorageKey,
} from "../lib/local-course-project";
import type { Lesson, Unit } from "../lib/types";

export type DeviceProjectTarget = {
  lessonId: string;
  guidedId?: string;
  exampleId?: string;
};
type SavedProject = DeviceProjectTarget & {
  title: string;
  track: string;
  finished: boolean;
};

function savedExamples(
  scope: string,
  units: Unit[],
  lessons: Lesson[],
): SavedProject[] {
  const prefix = localProjectStorageKey(scope, "");
  const projects: SavedProject[] = [];
  for (let index = 0; index < localStorage.length; index++) {
    const key = localStorage.key(index);
    if (!key?.startsWith(prefix)) continue;
    const lessonId = key.slice(prefix.length);
    const lesson = lessons.find((l) => l.id === lessonId);
    const unit = units.find((u) => u.id === lessonId);
    if (!unit || !lesson) continue;
    let drafts: Record<string, unknown>;
    try {
      drafts = JSON.parse(localStorage.getItem(key) ?? "{}");
    } catch {
      continue;
    }
    if (!drafts || typeof drafts !== "object") continue;
    for (const example of localProjectExamples(unit, lesson)) {
      if (typeof drafts[example.id] === "string")
        projects.push({
          lessonId,
          exampleId: example.id,
          title: lesson.title + " · " + example.title,
          track: unit.track,
          finished: false,
        });
    }
  }
  return projects;
}

export default function SavedDeviceProjects({
  scope,
  units,
  lessons,
  names,
  onOpen,
}: {
  scope: string;
  units: Unit[];
  lessons: Lesson[];
  names: Record<string, string>;
  onOpen: (target: DeviceProjectTarget) => void;
}) {
  const [projects, setProjects] = useState<SavedProject[]>([]);
  const [error, setError] = useState(false);
  useEffect(() => {
    if (!scope) return;
    let active = true;
    async function load() {
      const found: SavedProject[] = [];
      let failed = false;
      try {
        found.push(...savedExamples(scope, units, lessons));
      } catch {
        failed = true;
      }
      const saved = await Promise.allSettled(
        courseProjects.map((project) => readSavedCourseProject(scope, project)),
      );
      saved.forEach((result, index) => {
        if (result.status !== "fulfilled") {
          failed = true;
          return;
        }
        const draft = result.value;
        const project = courseProjects[index];
        const unit = units.find((u) => u.id === project.lessonId);
        if (draft && unit)
          found.push({
            lessonId: project.lessonId,
            guidedId: project.id,
            title: project.title,
            track: unit.track,
            finished: draft.completedSource === draft.code,
          });
      });
      if (active) {
        setProjects(found.sort((a, b) => a.title.localeCompare(b.title)));
        setError(failed);
      }
    }
    void load();
    return () => {
      active = false;
    };
  }, [scope, units, lessons]);
  if (!projects.length && !error) return null;
  return (
    <section className="panel" aria-label="Projects saved on this device">
      <h3>Projects saved on this device</h3>
      {error && (
        <p role="status">
          Some device projects could not be loaded. Reopen Progress to try
          again.
        </p>
      )}
      {projects.map((project) => (
        <button
          type="button"
          className="portfolio-row"
          key={project.lessonId + ":" + (project.guidedId ?? project.exampleId)}
          onClick={() => onOpen(project)}
        >
          <span>
            <b>{project.title}</b>
            <small>
              {names[project.track]} ·{" "}
              {project.finished ? "Finished project" : "Saved draft"}
            </small>
          </span>
          <ArrowRight size={18} aria-hidden="true" />
        </button>
      ))}
    </section>
  );
}
