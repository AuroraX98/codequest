"use client";
import { useId } from "react";
import type { LessonVisual } from "../lib/lesson-visuals";
import { getLessonDiagram } from "../lib/lesson-diagrams";
import type { Mark, Tone } from "../lib/diagram-drawing";

const colors: Record<Tone, { stroke: string; fill: string }> = {
  ink: { stroke: "#243047", fill: "#f1f5f9" },
  blue: { stroke: "#2056a6", fill: "#eaf2ff" },
  green: { stroke: "#176344", fill: "#e3f5eb" },
  orange: { stroke: "#95501a", fill: "#fff1de" },
  red: { stroke: "#a32639", fill: "#ffedf0" },
  muted: { stroke: "#586479", fill: "#f3f5f8" },
  purple: { stroke: "#6945a0", fill: "#f0eaff" },
};
function DrawingMark({ mark, prefix }: { mark: Mark; prefix: string }) {
  const color = colors[mark.tone];
  if (mark.kind === "text") {
    return <text x={mark.x} y={mark.y} fontSize={mark.size} fill={color.stroke} textAnchor={mark.anchor} fontWeight={mark.weight ?? 550}>{mark.text}</text>;
  }
  const common = { stroke: color.stroke, strokeWidth: 2, strokeDasharray: mark.dashed ? "6 5" : undefined };
  if (mark.kind === "rect") return <rect x={mark.x} y={mark.y} width={mark.w} height={mark.h} rx={mark.radius ?? 7} fill={color.fill} {...common} />;
  if (mark.kind === "circle") return <circle cx={mark.x} cy={mark.y} r={mark.r} fill={color.fill} {...common} />;
  const end = mark.arrow ? `url(#${prefix}-${mark.tone})` : undefined;
  if (mark.kind === "line") return <line x1={mark.x} y1={mark.y} x2={mark.x2} y2={mark.y2} markerEnd={end} {...common} />;
  return <path d={mark.d} fill={mark.fill ? color.fill : "none"} markerEnd={end} {...common} />;
}

/** Display an authored, accessible diagram, never an automatically restyled item list. */
export default function LessonDiagram({ visual }: { visual: LessonVisual }) {
  const instance = useId().replace(/:/g, "");
  const diagram = getLessonDiagram(visual.id);
  if (!diagram) return null;
  const prefix = `diagram-${instance}`;
  return (
    <figure className="lesson-diagram" data-diagram-family={diagram.family} style={{ margin: "0 0 18px" }}>
      <div className="lesson-diagram-scroll" tabIndex={0} role="region" aria-label={`${visual.title} diagram. Scroll horizontally on a narrow screen.`} style={{ overflowX: "auto", border: "1px solid #cbd5e1", borderRadius: 12, background: "#fff", color: "#243047" }}>
        <svg role="img" aria-labelledby={`${prefix}-title ${prefix}-desc`} viewBox={`0 0 ${diagram.width} ${diagram.height}`} width="100%" style={{ display: "block", minWidth: 760, height: "auto", fontFamily: "ui-sans-serif, system-ui, sans-serif" }}>
          <title id={`${prefix}-title`}>{visual.title}</title>
          <desc id={`${prefix}-desc`}>{diagram.description}</desc>
          <defs>
            {(Object.entries(colors) as [Tone, { stroke: string; fill: string }][]).map(([tone, color]) => <marker key={tone} id={`${prefix}-${tone}`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill={color.stroke} /></marker>)}
          </defs>
          {diagram.marks.map((mark, index) => <DrawingMark key={index} mark={mark} prefix={prefix} />)}
        </svg>
      </div>
      <figcaption style={{ marginTop: 8, fontSize: ".82rem", opacity: .8 }}>Diagram of this example. On a small screen, swipe sideways to see the whole picture.</figcaption>
    </figure>
  );
}
