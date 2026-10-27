/** Use the authored canonical title: never title-case code names such as print(). */
export function studyLabel(canonicalTitle: string): string {
  return `Study “${canonicalTitle.trim()}”`;
}
