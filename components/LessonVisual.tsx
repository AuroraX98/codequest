"use client";
import { getLessonVisual } from "../lib/lesson-visuals";
import LessonDiagram from "./LessonDiagram";
import PythonLessonScene, { getPythonLessonScene } from "./PythonLessonScene";
export default function LessonVisual({
  unitId,
  paragraph,
}: {
  unitId: string;
  paragraph: number;
}) {
  const visual = getLessonVisual(unitId, paragraph);
  const scene = getPythonLessonScene(unitId, paragraph);
  if (!visual && !scene) return null;
  return (
    <details
      className={"lesson-visual visual-" + (visual?.kind ?? "concept")}
    >
      <summary>
        <span className="lab-eyebrow">SEE THE IDEA</span>
        <strong>{scene?.title ?? visual?.title}</strong>
        <span className="lab-summary-note">
          {scene
            ? "Picture it, then ask what if · show or hide"
            : "Drawn example · show or hide"}
        </span>
      </summary>
      <div className="lesson-visual-content">
        {scene ? (
          <>
            <PythonLessonScene unitId={unitId} />
            {visual && (
              <details className="technical-picture">
                <summary>Compare with the technical diagram</summary>
                <LessonDiagram visual={visual} />
              </details>
            )}
          </>
        ) : (
          visual && <LessonDiagram visual={visual} />
        )}
        {visual && (
          <details className="visual-written-guide">
            <summary>Read the worked explanation</summary>
            <p>{visual.intro}</p>
            <div className="visual-items" role="list">
              {visual.items.map((item, i) => (
                <div className="visual-item" role="listitem" key={i}>
                  <span className="visual-position">
                    {visual.kind === "sequence"
                      ? `Step ${i + 1}`
                      : visual.kind === "layers"
                        ? `Layer ${i + 1}`
                        : item.label}
                  </span>
                  {(visual.kind === "sequence" || visual.kind === "layers") && (
                    <b>{item.label}</b>
                  )}
                  <pre>{item.value}</pre>
                  {item.detail && <p>{item.detail}</p>}
                </div>
              ))}
            </div>
            <p className="visual-takeaway">
              <b>Notice:</b> {visual.takeaway}
            </p>
            {visual.limit && (
              <small className="scene-limit">{visual.limit}</small>
            )}
          </details>
        )}
      </div>
    </details>
  );
}
