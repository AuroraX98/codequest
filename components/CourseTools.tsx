"use client";
import { studyLabel } from "../lib/study-label";
import { useMemo, useState } from "react";
import { ArrowRight } from "lucide-react";
import {
  courseTools,
  matchCourseTool,
  availableToolCourses,
  type CourseTool,
} from "../lib/course-tools";
import type { Lesson, Unit } from "../lib/types";
export default function CourseTools({
  units,
  lessons,
  onOpen,
  onCourse,
  initialTrack = "python",
}: {
  units: Unit[];
  lessons: Lesson[];
  onOpen: (item: CourseTool) => void;
  onCourse: (track: string) => void;
  initialTrack?: string;
}) {
  const courses = useMemo(() => availableToolCourses(units, lessons), [units, lessons]);
  const [selectedTrack, setSelectedTrack] = useState(initialTrack);
  const track = courses.some(c => c.id === selectedTrack) ? selectedTrack : (courses[0]?.id ?? "");
  const courseName = courses.find(c => c.id === track)?.label ?? "Course";
  const [query, setQuery] = useState("");
  const [level, setLevel] = useState("all");
  const items = useMemo(() => courseTools(units, lessons, track), [units, lessons, track]);
  const visible = items.filter(
    (item) =>
      (level === "all" || item.level === level) && matchCourseTool(item, query),
  );
  return (
    <section aria-labelledby="course-tools-title">
      <div className="page-title">
        <p className="eyebrow">{courseName} · CHOOSE YOUR PATH</p>
        <h1 id="course-tools-title">Tools and concepts</h1>
        <p>
          Jump to one thing you want to understand. These are shortcuts into
          your course, with the same tiny steps and saved progress.
        </p>
      </div>
      <div className="segmented" role="group" aria-label="Learning path">
        <button onClick={() => onCourse(track)}>Guided course</button>
        <button className="selected" aria-pressed="true">
          Tools and concepts
        </button>
      </div>
      <div className="path-toolbar">
        <label>
          Language or course
          <select aria-label="Language or course" value={track} onChange={e => {
            setSelectedTrack(e.target.value); setQuery(""); setLevel("all");
          }}>
            {courses.map(course => <option key={course.id} value={course.id}>{course.label}</option>)}
          </select>
        </label>
        <label className="python-tool-search">
          Find a tool or concept
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={track === "python" ? "Try print, variables, strings…" : "Search this course’s ideas or code…"}
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
        complete language, library or subject reference.
      </p>
      {["beginner", "intermediate", "advanced"].map((group) => {
        const rows = visible.filter((x) => x.level === group);
        return (
          rows.length > 0 && (
            <section
              key={group}
              className="python-tool-group"
              aria-label={`${group} ${courseName} tools and concepts`}
            >
              <h2>{group[0].toUpperCase() + group.slice(1)}</h2>
              <div className="python-tool-grid">
                {rows.map((item) => (
                  <article key={item.id} className="panel python-tool-card">
                    <span className="small-tag">{item.kind}</span>
                    <h3>{item.title}</h3>
                    <p>{item.hint}</p>
                    <button type="button" className="secondary python-tool-link project-study-button" onClick={() => onOpen(item)}>
                      {studyLabel(item.title)} <ArrowRight size={16} />
                    </button>
                  </article>
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
