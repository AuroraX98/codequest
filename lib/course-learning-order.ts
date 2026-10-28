import route from "../content/python-route-plan.json";
import javascriptRoute from "../content/javascript-route-plan.json";
import htmlRoute from "../content/html-route-plan.json";
import cssRoute from "../content/css-route-plan.json";
import typescriptRoute from "../content/typescript-route-plan.json";
import reactRoute from "../content/react-route-plan.json";
import sqlRoute from "../content/sql-route-plan.json";
import swiftRoute from "../content/swift-route-plan.json";
import backendRoute from "../content/backend-route-plan.json";
import type { Unit } from "./types";

/** Reorder only the reviewed track's slots; IDs and other track positions stay intact. */
function orderTrack(units: Unit[], track: string, seed: string[]): Unit[] {
  const selected = units.filter(unit => unit.track === track);
  const byId = new Map(selected.map(unit => [unit.id, unit]));
  const priority = new Map(seed.map((id, index) => [id, index]));
  const seeds = [...selected].sort((a,b) => (priority.get(a.id) ?? Infinity) - (priority.get(b.id) ?? Infinity));
  const result: Unit[] = [], seen = new Set<string>(), visiting = new Set<string>();
  const visit = (unit: Unit) => {
    if (seen.has(unit.id)) return;
    if (visiting.has(unit.id)) throw new Error(track + " prerequisite cycle: " + unit.id);
    visiting.add(unit.id);
    for (const id of unit.prerequisite_ids ?? []) { const prior = byId.get(id); if (prior) visit(prior); }
    visiting.delete(unit.id); seen.add(unit.id); result.push(unit);
  };
  seeds.forEach(visit);
  let index = 0;
  return units.map(unit => unit.track === track ? result[index++] : unit);
}
export function courseLearningOrder(units: Unit[]): Unit[] {
  const ordered = orderTrack(orderTrack(orderTrack(orderTrack(orderTrack(orderTrack(orderTrack(orderTrack(units, "python", route.recommendedSeedOrder), "javascript", javascriptRoute.recommendedSeedOrder), "html", htmlRoute.recommendedSeedOrder), "css", cssRoute.recommendedSeedOrder), "typescript", typescriptRoute.recommendedSeedOrder), "react", reactRoute.recommendedSeedOrder), "sql", sqlRoute.recommendedSeedOrder), "swift", swiftRoute.recommendedSeedOrder);
  return orderTrack(ordered, "backend", backendRoute.recommendedSeedOrder);
}
