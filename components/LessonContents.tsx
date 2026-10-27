"use client";
import { useId, useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { getLessonHeadings } from "../lib/lesson-headings";
export default function LessonContents({
  lessonId,
  index,
  onSelect,
  children,
  simple = false,
}: {
  lessonId: string;
  index: number;
  onSelect: (index: number) => void;
  children: ReactNode;
  simple?: boolean;
}) {
  const id = useId();
  const [collapsed, setCollapsed] = useState<string | null>(null);
  const headings = getLessonHeadings(lessonId);
  const activeKey = lessonId + ":" + index;
  const [lastIndex, setLastIndex] = useState(activeKey);
  if (activeKey !== lastIndex) {
    setLastIndex(activeKey);
    setCollapsed(null);
  }
  if (simple)
    return (
      <section className="simple-reader" aria-label="Lesson reading window">
        <div className="reader-topline">
          <span className="lab-eyebrow">
            Idea {index + 1} of {headings.length}
          </span>
          <details className="reader-index" key={lessonId + ":" + index}>
            <summary>All ideas</summary>
            <nav aria-label="Choose a lesson idea">
              {headings.map((heading, i) => (
                <button
                  type="button"
                  key={i}
                  aria-current={index === i ? "step" : undefined}
                  onClick={() => onSelect(i)}
                >
                  {i + 1}. {heading}
                </button>
              ))}
            </nav>
          </details>
        </div>
        <h3 id={`${id}-current`}>{headings[index]}</h3>
        <div
          role="region"
          aria-labelledby={`${id}-current`}
          data-annotation-section={"text:" + index}
        >
          {children}
        </div>
      </section>
    );
  return (
    <section className="lesson-contents" aria-label="Lesson table of contents">
      <div className="contents-heading">
        <span className="lab-eyebrow">IN THIS LESSON</span>
        <p>Choose a section to open it. Go at your own pace.</p>
      </div>
      {headings.map((heading, i) => {
        const key = lessonId + ":" + i;
        const expanded = index === i && collapsed !== key;
        return (
          <div
            className={"contents-section " + (expanded ? "expanded" : "")}
            key={key}
          >
            <h4>
              <button
                type="button"
                id={`${id}-heading-${i}`}
                aria-expanded={expanded}
                aria-controls={`${id}-section-${i}`}
                onClick={() => {
                  if (index === i) {
                    setCollapsed(expanded ? key : null);
                    onSelect(i);
                  } else {
                    setCollapsed(null);
                    onSelect(i);
                  }
                }}
              >
                <span className="contents-number">{i + 1}</span>
                <span>{heading}</span>
                <ChevronDown size={16} />
              </button>
            </h4>
            <div
              id={`${id}-section-${i}`}
              role="region"
              aria-labelledby={`${id}-heading-${i}`}
              hidden={!expanded}
              className="contents-reading"
              data-annotation-section={"text:" + i}
            >
              {index === i ? children : null}
            </div>
          </div>
        );
      })}
    </section>
  );
}
