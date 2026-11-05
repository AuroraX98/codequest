import { readDevice, writeDevice } from "./device-db";
import type { CourseProject } from "./course-projects";
export type CourseProjectDraft = { code: string; step: number; completedSource?: string; updatedAt: string };
const key = (scope: string, project: CourseProject) => `course-project:${scope}:${project.id}:v${project.version}`;
export async function readSavedCourseProject(scope: string, project: CourseProject): Promise<CourseProjectDraft | undefined> {
  const value = await readDevice<CourseProjectDraft>("meta", key(scope, project));
  return value && typeof value.code === "string" && value.code.length <= 60000 && Number.isInteger(value.step) && value.step >= 0 && value.step < project.steps.length
    ? value : undefined;
}
export async function loadCourseProject(scope: string, project: CourseProject, initialCode?: string): Promise<CourseProjectDraft> {
  return await readSavedCourseProject(scope, project) ?? {code: initialCode ?? project.starter, step: 0, updatedAt: new Date().toISOString()};
}
export function saveCourseProject(scope: string, project: CourseProject, draft: CourseProjectDraft) {
  return writeDevice("meta", key(scope, project), draft);
}
