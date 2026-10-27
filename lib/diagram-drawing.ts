/** Authored SVG primitives. Coordinates describe the concept, not a screenshot. */
export type Tone = "ink" | "blue" | "green" | "orange" | "red" | "muted" | "purple";
export type Mark =
  | { kind: "rect"; x: number; y: number; w: number; h: number; tone: Tone; dashed?: boolean; radius?: number }
  | { kind: "text"; x: number; y: number; text: string; size: number; tone: Tone; anchor: "start" | "middle" | "end"; weight?: number }
  | { kind: "line"; x: number; y: number; x2: number; y2: number; tone: Tone; arrow?: boolean; dashed?: boolean }
  | { kind: "circle"; x: number; y: number; r: number; tone: Tone; dashed?: boolean }
  | { kind: "path"; d: string; tone: Tone; arrow?: boolean; dashed?: boolean; fill?: boolean };
export type LessonDiagramData = { id: string; family: string; description: string; width: number; height: number; marks: Mark[] };
export const text = (x: number, y: number, value: string, size = 16, tone: Tone = "ink", anchor: "start" | "middle" | "end" = "start"): Mark => ({ kind: "text", x, y, text: value, size, tone, anchor });
export const rect = (x: number, y: number, w: number, h: number, tone: Tone = "blue", dashed = false): Mark => ({ kind: "rect", x, y, w, h, tone, dashed });
export const line = (x: number, y: number, x2: number, y2: number, tone: Tone = "blue", arrow = true, dashed = false): Mark => ({ kind: "line", x, y, x2, y2, tone, arrow, dashed });
export const circle = (x: number, y: number, r: number, tone: Tone = "blue"): Mark => ({ kind: "circle", x, y, r, tone });
export const path = (d: string, tone: Tone = "blue", arrow = true, dashed = false, fill = false): Mark => ({ kind: "path", d, tone, arrow, dashed, fill });
export const scene = (id: string, family: string, description: string, marks: Mark[], height = 300): LessonDiagramData => ({ id, family, description, marks, width: 760, height });
/** Labels use explicit newlines. Keep lines short enough for their drawn boundary. */
export function box(x: number, y: number, w: number, h: number, label: string, tone: Tone = "blue"): Mark[] {
  const lines = label.split("\n");
  return [rect(x, y, w, h, tone), ...lines.map((s, i) => text(x + w / 2, y + h / 2 + (i - (lines.length - 1) / 2) * 22 + 5, s, 16, tone === "muted" ? "muted" : "ink", "middle"))];
}
export function array(x: number, y: number, values: string[], label: string, selected: number[] = [], cellWidth = 105): Mark[] {
  return [text(x, y - 18, label), ...values.flatMap((v, i) => [...box(x + i * cellWidth, y, cellWidth - 4, 48, v, selected.includes(i) ? "green" : "blue"), text(x + i * cellWidth + (cellWidth - 4) / 2, y + 70, String(i), 15, "muted", "middle")])];
}
export function table(x: number, y: number, headers: string[], rows: string[][], widths: number[], highlights: number[] = []): Mark[] {
  const result: Mark[] = [];
  [headers, ...rows].forEach((row, r) => {
    let left = x;
    row.forEach((value, c) => {
      result.push(rect(left, y + r * 36, widths[c], 36, r === 0 ? "purple" : highlights.includes(r - 1) ? "green" : "muted"), text(left + 9, y + r * 36 + 23, value, 15));
      left += widths[c];
    });
  });
  return result;
}
export function object(x: number, y: number, title: string, fields: string[], tone: Tone = "blue", width = 240): Mark[] {
  return [rect(x, y, width, 42 + fields.length * 30, tone), text(x + 14, y + 27, title, 17, tone), line(x, y + 39, x + width, y + 39, tone, false), ...fields.map((f, i) => text(x + 14, y + 64 + i * 30, f, 15))];
}
export function decision(x: number, y: number, label: string, tone: Tone = "purple"): Mark[] {
  return [path(`M ${x} ${y - 42} L ${x + 100} ${y} L ${x} ${y + 42} L ${x - 100} ${y} Z`, tone, false, false, true), text(x, y + 5, label, 15, "ink", "middle")];
}
export function caption(value: string, y = 280): Mark { return text(380, y, value, 15, "muted", "middle"); }
