# Python visual audit, October 21, 2026

Disposition is about teaching value, not forcing a metaphor into every topic. Existing technical diagrams stay available. Conceptual scenes never imply actual external devices, storage addresses, or execution unless that is really performed.

| Unit | Existing diagram | Decision |
|---|---|---|
| 01 Basics | f-string substitution; six v20 conceptual rooms | Keep six interactive metaphors and optional technical views. |
| 02 Types & Comparisons | number line, comparison truth values, string/int distinction | Keep: spatial ordering and equality already explain the mechanism. A parcel illustration alone would add decoration. |
| 03 Conditionals | strict threshold with two outcomes | Add lamp/recommendation scene and boundary what-if; retain precise number line optionally. Function returns a reminder, not a real device action. |
| 04 Loops | source indentation and repeated output | Replace primary with calendar/workstation visits and outside-loop completion flag. Keep code diagram optionally. |
| 05 Lists | indexed row after append | Add actual collectible tray and explicit append, empty/list count predictions. Retain index diagram optionally; tray denotes list object, not a Python name container. |
| 06 List Operations | half-open slice selecting indexed cells | Keep: included/excluded boundaries and separate result are genuinely visual. No forced story needed. |
| 07 String Operations | strip/lower/split transformation | Keep for now: preserves internal spaces and distinguishes text from word list. Later bead/ribbon transformation could add interaction. |
| 08 Functions | per-element mapping to fresh result list | Add recipe workbench with factor, processing and distinct return-to-caller step; original unchanged. Keep mapping diagram optionally. |
| 09 Tuple/Dictionary/Set | set intersection Venn diagram | Keep: geometry directly conveys shared membership and no positional ordering. |
| 10 Comprehensions | AND-filter truth matrix | Keep for now: clearly explains both conditions. A future two-gate scene should earn its place through interaction. |
| 11 Classes | two distinct instances and receiver-only update | Keep as technical explanation; later object interaction can illuminate self without pretending all instances mutate. |
| 12 OOP | method dispatch across different objects | Keep technical view. Bell/light objects are a promising later scene, but must not imply inheritance is required. |
| 13 Modules | module/caller file boundary and value transfer | Retain optionally; code transcription is redundant but an unrelated conversion metaphor would not teach imports better. |
| 14 Exceptions | missing/conversion/range validation gates | Keep: branching geometry conveys distinct failure points and the inclusive 50 boundary. |
| 15 Algorithms and generators | simultaneous yield values and running totals | Added demand-driven station/bookmark with separate request, yield, tally, exhaustion and return; same-iterator second pass. Existing trace remains optional. |
| 16 Concurrency | overlapping attempts and ordered gather result | Keep: time overlap, retry, completion order and result order are spatial mechanisms. |
| 17 Testing/packaging | clamp projection on bounded number line | Keep: explains function behavior and reversed-bound rejection, not proof of packaging. |
| 18 Statistics | middle positions and even median | Keep after final review: middle-position geometry already explains even median. Mean/balance tokens are optional, not a missing-coverage requirement. |
| 19 Dependencies | metadata file and independent max calculation | Most redundant advanced panel. Retain compact requirements reference; do not depict an installation that never occurs. |
| 20 APIs | status, payload, entry validation gates | Keep: real early-exit mechanism. Empty-result variation could extend it without metaphor. |
| 21 Private APIs | status routing | Keep credential-free fixture; later show server/browser secrecy boundary separately without implying real authentication is exercised. |
| 22 Label maker | singular/plural branch | Keep compactly. A printer scene would mostly repeat existing Basics output lessons. |
| 23 CSV inventory | digit validation | Added protected-field parcel scene on section 3, including quoted commas, escaped quotes and header-only input. Existing digit-validation illustration stays on section 5. |
| 24 Reading log | two sessions merge under one exact book key | Keep after final review: row convergence on one exact key and separate key-count/value-sum branches already reveal aggregation. A book-compartment metaphor is optional. |
| 25 Workshop planner | dependency graph and depth-first result | Keep: prerequisites and return order are already meaningful visual relationships. Later cycle interaction can add value. |

## Four-scene release

Added primary conceptual what-if scenes on the existing worked-example pages for Python 03 (page 3), 04 (page 3), 05 (page 5), and 08 (page 3). Preserve every current technical SVG behind an optional comparison. These four scenes are locally authored simulations with matching downloadable Python, not automatic course completion or a claim that every explanation has been transformed.

A subsequent bounded release adds Python 15 demand/exhaustion and Python 23 quoted CSV fields. The final audit retains Python 18 and 24: their current median-position and exact-key convergence diagrams are genuinely explanatory, so no further scene is required for lesson-level closure. Existing accurate technical diagrams remain valid learning visuals; metaphor count is not the objective.

## Guardrails

Keep analogy limits visible beside conceptual drawings. Verify exact causal outcomes, unchanged inputs, boundary cases and prediction/reset behavior, not only SVG shape counts. Account reading marks remain explicit and separate. Source examples, projects, old progress and credentials are unchanged.

## Final closure

The full 115-lesson disposition is recorded in `visual-quality-audit.md`. All 25 Python lessons retain at least one useful actual visual. Seven lessons have deeper interactive conceptual scenes. This is selective lesson-level coverage, not pictures on all 181 Python explanation pages or every possible sub-concept. Optional future variants are not outstanding delivery blockers.
