"use client";
import { studyLabel } from "../lib/study-label";
import { useMemo, useState } from "react";
import { ArrowRight } from "lucide-react";
import {
  pythonTools,
  matchPythonTool,
  type PythonTool,
} from "../lib/python-tools";
import type { Lesson, Unit } from "../lib/types";
export default function PythonTools({
  units,
  lessons,
  onOpen,
  onCourse,
}: {
  units: Unit[];
  lessons: Lesson[];
  onOpen: (item: PythonTool) => void;
  onCourse: () => void;
}) {
  const [query, setQuery] = useState("");
  const [level, setLevel] = useState("all");
  const items = useMemo(() => pythonTools(units, lessons), [units, lessons]);
  const visible = items.filter(
    (item) =>
      (level === "all" || item.level === level) && matchPythonTool(item, query),
  );
  return (
    <section aria-labelledby="python-tools-title">
      <div className="page-title">
        <p className="eyebrow">PYTHON · CHOOSE YOUR PATH</p>
        <h1 id="python-tools-title">Tools and concepts</h1>
        <p>
          Jump to one thing you want to understand. These are shortcuts into
          your course, with the same tiny steps and saved progress.
        </p>
      </div>
      <div className="segmented" role="group" aria-label="Python learning path">
        <button onClick={onCourse}>Guided course</button>
        <button className="selected" aria-pressed="true">
          Tools and concepts
        </button>
      </div>
      <div className="path-toolbar">
        <label className="python-tool-search">
          Find a tool or concept
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Try print, variables, strings…"
          />
        </label>
        <label>
          Level
          <select value={level} onChange={(e) => setLevel(e.target.value)}>
            <option value="all">All levels</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </label>
      </div>
      <p className="muted" role="status">
        {visible.length} of {items.length} course-covered entries. This is not a
        complete Python or library reference.
      </p>
      {["beginner", "intermediate", "advanced"].map((group) => {
        const rows = visible.filter((x) => x.level === group);
        return (
          rows.length > 0 && (
            <section
              key={group}
              className="python-tool-group"
              aria-label={`${group} Python tools`}
            >
              <h2>{group[0].toUpperCase() + group.slice(1)}</h2>
              <div className="python-tool-grid">
                {rows.map((item) => (
                  <button
                    key={item.id}
                    className="panel python-tool-card"
                    onClick={() => onOpen(item)}
                  >
                    <span className="small-tag">{item.kind}</span>
                    <h3>{item.title}</h3>
                    <p>{item.hint}</p>
                    <span className="python-tool-link">
                      {studyLabel(item.title)} <ArrowRight size={16} />
                    </span>
                  </button>
                ))}
              </div>
            </section>
          )
        );
      })}
      {!visible.length && (
        <div className="panel">
          <p>No taught entry matches. Try a shorter name or another level.</p>
          <button
            className="secondary"
            onClick={() => {
              setQuery("");
              setLevel("all");
            }}
          >
            Show all entries
          </button>
        </div>
      )}
    </section>
  );
}
