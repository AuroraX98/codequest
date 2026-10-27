import type { Lesson } from "./types";
import { additionalBasicsProjects } from "./project-catalog";
import { getReadingSectionKeys, type LessonReadingRecord } from "./lesson-completion";
export type CourseProjectStep = { id: string; instruction: string; checks: Lesson["checks"] };
export type CourseProject = { id: string; version: number; lessonId: string; title: string; quantitative: boolean; core: boolean; filename: string; starter: string; steps: CourseProjectStep[]; description?: string; outcome?: string; skills?: string[]; requiredReading?: {lessonId: string; sectionKey: string}[] };
const check = (label: string, expression: string) => ({ label, expression });
export const courseProjects: CourseProject[] = [
  { id: "python-01-pet-card", version: 1, lessonId: "python-01", title: "A pet introduction", quantitative: false, core: true, filename: "pet_card.py", starter: "", steps: [
    { id: "name", instruction: 'Give the name pet_name the text value "Milo".', checks: [check("Pet name is Milo", 'pet_name == "Milo"')] },
    { id: "age", instruction: "Keep your first line. Give pet_age the number 3, not text.", checks: [check("Pet name is Milo", 'pet_name == "Milo"'), check("Age is a number", 'type(pet_age) is int and pet_age == 3')] },
    { id: "message", instruction: 'Use print with the two names and text between them to display: Milo is 3 years old. You can pass several values to print, separated by commas.', checks: [check("Message uses both values", '__output == ["Milo is 3 years old."] and pet_name == "Milo" and type(pet_age) is int and pet_age == 3')] },
  ] },
  { id: "python-01-next-age", version: 1, lessonId: "python-01", title: "An age-next-year calculator", quantitative: true, core: false, filename: "next_age.py", starter: "", steps: [
    { id: "age", instruction: "Give pet_age the number 5. Keep it numeric so Python can calculate with it.", checks: [check("Starting age is numeric", 'type(pet_age) is int and pet_age == 5')] },
    { id: "calculate", instruction: "Keep your first line. Give next_age the result of adding 1 to pet_age.", checks: [check("Next age is calculated", 'pet_age == 5 and next_age == pet_age + 1')] },
    { id: "display", instruction: "Print next_age. Run it to see the result of your calculation.", checks: [check("Calculated age is displayed", 'pet_age == 5 and next_age == pet_age + 1 and __output == ["6"]')] },
    { id: "transfer", instruction: "Now change only the starting age to 8. Your calculation should still work without changing the other lines. Run it to check.", checks: [check("Works with a different starting value", 'pet_age == 8 and next_age == pet_age + 1 and __output == ["9"]')] },
  ] },
  ...additionalBasicsProjects,
];
export const projectsForLesson = (id: string) => courseProjects.filter(p => p.lessonId === id);
export function missingProjectReading(lesson: Lesson, records: readonly LessonReadingRecord[]) {
  return getReadingSectionKeys(lesson).filter(key => {
    const record = records.filter(r => r.lessonId === lesson.id && r.sectionKey === key).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))[0];
    return !record?.checked || !record.markedAt;
  });
}
