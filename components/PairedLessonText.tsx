"use client";

import { shortLessonThoughts } from "../lib/lesson-step-flow";
import { plainLessonExplanation } from "../lib/plain-language";
import { InlineCode } from "./LessonContent";
import { GlossaryScope } from "./LessonGlossary";
import styles from "./LessonStepFlow.module.css";

/** Optional reference prose uses the same reviewed, exact-source pairs as the reader. */
export default function PairedLessonText({ text, runtime = "python" }: { text: string; runtime?: string }) {
  const thoughts = shortLessonThoughts(text);
  const pairs = thoughts.map(source => ({ source, simple: plainLessonExplanation(source, runtime) }));
  return <div className={styles.pairedReference}>
    <GlossaryScope text={pairs.map(pair => pair.source + " " + (pair.simple ?? "")).join(" ")} runtime={runtime} wordsLabel="Words in this explanation">
      {pairs.map((pair, index) => <div className={styles.referencePair} key={index} data-paired-reference>
        <p data-technical-reading><InlineCode text={pair.source} /></p>
        {pair.simple && <p className={styles.plain} data-simple-reading><InlineCode text={pair.simple} /></p>}
      </div>)}
    </GlossaryScope>
  </div>;
}
