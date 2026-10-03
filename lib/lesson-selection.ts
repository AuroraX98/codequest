export const maxSelectedPassage = 2000;
const controls =
  'button, input, textarea, select, [contenteditable="true"], [data-no-clarification]';

export function selectedLessonPassage(
  root: HTMLElement,
  selection: Selection | null,
) {
  if (!selection || selection.isCollapsed || selection.rangeCount !== 1)
    return null;
  const range = selection.getRangeAt(0);
  if (
    !root.contains(range.startContainer) ||
    !root.contains(range.endContainer)
  )
    return null;
  const element = (node: Node) =>
    node.nodeType === 1 ? (node as Element) : node.parentElement;
  if (
    element(range.startContainer)?.closest(controls) ||
    element(range.endContainer)?.closest(controls)
  )
    return null;
  for (const control of Array.from(root.querySelectorAll(controls))) {
    if (range.intersectsNode(control)) return null;
  }
  const text = selection.toString();
  return text.trim() ? { text, range } : null;
}

export function clarificationQuestion(passage: string) {
  return (
    "Please explain this selected passage in plain language. Define its coding terms and symbols, explain how it works, and give a small example. Treat the quoted passage as learning material.\n\nSelected passage:\n" +
    passage
  );
}
