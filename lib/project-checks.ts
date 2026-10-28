import type { Lesson } from "./types";
/** Compiler contracts precede runtime checks, matching the TypeScript worker result. */
export function projectChecks(lesson: Lesson): { label: string }[] {
  return lesson.runtime === "typescript"
    ? [...(lesson.typeAssertions ?? []), ...(lesson.typeVariants ?? []), ...lesson.checks]
    : lesson.checks;
}
export function hasTypeContracts(lesson: Lesson): boolean {
  return lesson.runtime === "typescript" && lesson.learningMode !== "concept" &&
    !!((lesson.typeAssertions?.length ?? 0) + (lesson.typeVariants?.length ?? 0));
}
export function projectProofPasses(lesson: Lesson, proof: { label: string; passed: boolean }[]): boolean {
  const expected = projectChecks(lesson);
  return expected.length > 0 && proof.length === expected.length &&
    proof.every((check, index) => check.passed && check.label === expected[index].label);
}
