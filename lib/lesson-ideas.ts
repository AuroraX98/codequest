/** Separate prose ideas without rewriting source text or splitting inline code. */
export function lessonIdeas(text: string): string[] {
  const sentences: string[] = [];
  let start = 0;
  let inCode = false;
  for (let i = 0; i < text.length; i++) {
    if (text[i] === "`") inCode = !inCode;
    if (inCode || !/[.!?]/.test(text[i])) continue;
    const tail = text.slice(i + 1);
    if (!/^\s+(?=[A-Z0-9`"“])/.test(tail)) continue;
    const sentence = text.slice(start, i + 1).trim();
    // Avoid common abbreviated words; decimals and code are already protected.
    if (/\b(?:e\.g|i\.e|Mr|Mrs|Dr|vs)\.$/i.test(sentence)) continue;
    sentences.push(sentence);
    start = i + 1;
  }
  if (text.slice(start).trim()) sentences.push(text.slice(start).trim());
  const ideas: string[] = [];
  for (const sentence of sentences) {
    const previous = ideas.at(-1);
    // Keep a short lead, then combine closely spaced sentences into readable bullets.
    if (ideas.length > 1 && previous && previous.length + sentence.length < 190)
      ideas[ideas.length - 1] += " " + sentence;
    else ideas.push(sentence);
  }
  return ideas;
}
