"use client";
import { useId } from "react";
import { X } from "lucide-react";

type Props = {
  open: boolean;
  title: string;
  courseName: string;
  lessons: { id: string; title: string }[];
  lessonId: string;
  items: { label: string; paragraphIndex: number }[];
  active: number;
  onClose: () => void;
  onLesson: (id: string) => void;
  onSelect: (index: number) => void;
};

export default function UnitTableOfContents({ open, title, courseName, lessons, lessonId, items, active, onClose, onLesson, onSelect }: Props) {
  const id = useId();
  if (!open) return null;
  const currentIndex = lessons.findIndex(lesson => lesson.id === lessonId);
  const nextLesson = currentIndex >= 0 ? lessons[currentIndex + 1] : undefined;
  return (
    <aside id="unit-table-of-contents" className="unit-toc-drawer" aria-labelledby={id} onKeyDown={event => {
      if (event.key === "Escape") { event.stopPropagation(); onClose(); }
    }}>
      <div className="unit-toc-inner">
        <div className="unit-toc-heading">
          <h2 id={id}>Table of Contents</h2>
          <button type="button" className="secondary" onClick={onClose} aria-label="Close Table of Contents"><X size={20} /></button>
        </div>
        <label className="unit-toc-course">
          Lessons in {courseName} ({lessons.length})
          <select value={lessonId} onChange={event => onLesson(event.target.value)}>
            {lessons.map((lesson, index) => <option key={lesson.id} value={lesson.id}>{index + 1}. {lesson.title}</option>)}
          </select>
        </label>
        {nextLesson && <button type="button" className="secondary unit-toc-next" onClick={() => onLesson(nextLesson.id)}>
          Next lesson · {nextLesson.title}
        </button>}
        <p>Ideas in this lesson</p>
        <nav aria-label={"Ideas in " + title}>
          {items.map((item, index) => (
            <button type="button" key={item.paragraphIndex} className="secondary"
              aria-current={active >= item.paragraphIndex && (index === items.length - 1 || active < items[index + 1].paragraphIndex) ? "step" : undefined}
              onClick={() => onSelect(item.paragraphIndex)}>
              <span>{index + 1}.</span><span>{item.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </aside>
  );
}
