# Lesson visual quality audit, October 21, 2026

## Finite closure criterion

Each of the 115 lessons has at least one actual authored visual explaining a useful relationship: position, identity, order, transformation, containment, state, time, quantitative comparison, or a decision boundary. A comparison matrix qualifies when its layout reveals an independent failure or coverage distinction. A code listing, decorative metaphor, or prose card alone does not qualify. Do not rewrite a useful technical diagram solely to increase the metaphor count.

The final pass compared the remaining 90 lessons with their selected explanation paragraph and actual SVG raster output. The 25 Python lessons had a separate concept-depth pass, recorded in `python-visual-audit.md`. The final patch corrects three supported defects, not 90 missing visuals:

- SQL 04: group connections now end at the centers of their actual aggregate result rows.
- Swift 03: case labels occupy separate branch boundaries, clear of the fan-out paths.
- SQL 11: the accessible description now preserves the internal space in `555 0100`, matching both the source and drawing.

## Exact delivered coverage

- 115 topic-specific technical SVGs, one per lesson, across 10 tracks.
- Visuals on 116 of the 818 original explanation pages, including the additional Python 23 quoted-CSV page. This is not a claim that all explanation pages have pictures.
- Six conceptual Python Basics rooms plus six additional worked-example scenes. Deep interactive conceptual coverage is seven of the 25 Python lessons, not every lesson.
- Original explanation prose, lesson routes, stored progress, notes, exercises, and provider configuration are unchanged by this patch.
- The 702 other explanation pages remain selective expansion opportunities, not an automatically generated illustration backlog. No new metaphor is needed merely because a paragraph lacks one.

## Per-lesson disposition

“Retain” means the existing picture meets the criterion above. “Corrected” identifies this patch. Existing conceptual scenes remain primary with useful technical comparisons optional.

| Lesson | Disposition | What the visual makes visible |
| --- | --- | --- |
| html-01 | Retain | Head/title maps to the browser tab; body maps to the viewport. |
| html-02 | Retain | Folder position and path arrows explain relative lookup. |
| html-03 | Retain | Hierarchical connections distinguish heading structure from font size. |
| html-04 | Retain | Controls and focus distinguish navigation from activation. |
| html-05 | Retain | Label/control relationship continues to a submitted key/value pair. |
| html-06 | Retain | Constraint matrix distinguishes missing input from insufficient length. |
| html-07 | Retain | Actual table geometry teaches caption/header/row associations. |
| html-08 | Retain | Article boundaries keep each product's attributes together. |
| css-01 | Retain | Selector links show many-to-many matching and shared classes. |
| css-02 | Retain | Equal-scale widths compare content-box and border-box. |
| css-03 | Retain | Container widths demonstrate wrapping and gaps. |
| css-04 | Retain | Track geometry subtracts gap space before allocating fractions. |
| css-05 | Retain | Wrapper size changes layout; column ratios remain explicit. |
| css-06 | Retain | Reduced motion reaches the same informative final state immediately. |
| css-07 | Retain | Crosshairs distinguish positioning an edge from centering an element. |
| javascript-01 | Retain | Number-line subtraction makes direction and distance visible. |
| javascript-02 | Retain | Spatial order shows comparison against a boundary. |
| javascript-03 | Retain | Selected branch distinguishes alternative outcomes. |
| javascript-04 | Retain | Test/decrement cycle reaches a zero exit. |
| javascript-05 | Retain | Indexed append distinguishes length from the last index. |
| javascript-06 | Retain | Arguments enter parameters; the result crosses the return boundary. |
| javascript-07 | Retain | Nested object access reaches an indexed array item. |
| javascript-08 | Retain | Reference and invocation distinguish a function value from a call. |
| javascript-09 | Retain | Typed values feed a template without changing the original score. |
| javascript-10 | Retain | Filter, map, and reduce have distinct collection effects. |
| javascript-11 | Retain | Input event changes the related preview. |
| javascript-12 | Retain | Scoped DOM removal leaves unrelated subtrees intact. |
| javascript-13 | Retain | Timeline separates elapsed duration from absolute time. |
| javascript-14 | Retain | Promise paths show mutually alternative outcomes. |
| javascript-15 | Retain | Receiver-specific update leaves an independent instance unchanged. |
| javascript-16 | Retain | Module/caller boundaries carry arguments and a returned result. |
| javascript-17 | Retain | Graph, queue, and visited set distinguish first-path search behavior. |
| javascript-18 | Retain | Two request lanes show why a late response is ignored. |
| javascript-19 | Retain | Ordered gates reject wrong type, non-finite, and negative values. |
| javascript-20 | Retain | Edge trimming preserves internal spaces. |
| javascript-21 | Retain | New-key versus update paths preserve first-seen map order. |
| javascript-22 | Retain | A new collection can share an unchanged nested object. |
| javascript-23 | Retain | Editing after undo removes the abandoned redo future. |
| python-01 | Retain deep scenes | Six conceptual rooms share accurate names, values, assignment, and output experiments. |
| python-02 | Retain | Number-line comparisons distinguish order, equality, and types. |
| python-03 | Retain deep scene | Daylight changes a reminder branch at the strict threshold. |
| python-04 | Retain deep scene | Calendar visits separate repeated work from one outside-loop finish. |
| python-05 | Retain deep scene | A collector tray shows append, object continuity, count, and index. |
| python-06 | Retain | Half-open slicing selects positions into a separate result. |
| python-07 | Retain | Strip/lower/split distinguish text transformations from a word list. |
| python-08 | Retain deep scene | Recipe workbench creates a fresh batch before returning it. |
| python-09 | Retain | Venn geometry shows shared membership without positional order. |
| python-10 | Retain | Predicate matrix requires both conditions in the same row. |
| python-11 | Retain | Two instances distinguish receiver-specific mutation. |
| python-12 | Retain | Dispatch connects different objects to their own methods. |
| python-13 | Retain | Module/caller boundaries explain import and value transfer. |
| python-14 | Retain | Validation gates separate missing, conversion, and range failures. |
| python-15 | Retain deep scene | Demand/bookmark station separates request, yield, tally, exhaustion, and return. |
| python-16 | Retain | Time overlap distinguishes completion order from gathered result order. |
| python-17 | Retain | Bounded number line shows clamp behavior and reversed-bound rejection. |
| python-18 | Retain | Middle indexed positions select the two values for an even median. |
| python-19 | Retain compact reference | Separate metadata and computation boundaries prevent treating configuration as installation or execution. |
| python-20 | Retain | Status and payload gates show real early exits. |
| python-21 | Retain | Credential-free status routing separates response outcomes. |
| python-22 | Retain | Singular/plural paths make the naming decision explicit. |
| python-23 | Retain deep scene | Quoted parcels preserve CSV field boundaries; a separate validation diagram remains. |
| python-24 | Retain | Two sessions converge on one exact key; key count differs from summed pages. |
| python-25 | Retain | Dependency graph explains prerequisites and depth-first return order. |
| sql-01 | Retain | Filtering, projected columns, and sorting transform source rows. |
| sql-02 | Retain | Aligned IDs distinguish field mutation from deletion and insertion. |
| sql-03 | Retain | Predicate matrix explains same-row AND. |
| sql-04 | Corrected | Group arrows now reach the actual aggregate rows; NULL changes the known-value denominator. |
| sql-05 | Retain | One-to-many links and a NULL result show LEFT JOIN preservation. |
| sql-06 | Retain | Subject boundaries keep comparisons within the appropriate group. |
| sql-07 | Retain | Aligned rows contrast running totals, tied ranks, and partition restart. |
| sql-08 | Retain | Hierarchical keys show filtering followed by ordered index selection. |
| sql-09 | Retain | Transaction enclosure and return path undo both writes together. |
| sql-10 | Retain | Three states distinguish filtering missing values from deduplication. |
| sql-11 | Corrected description | Trimming, NULL conversion, and fallback retain the internal phone space. |
| sql-12 | Retain | Contribution columns separate order count from paid revenue. |
| sql-13 | Retain | Parent-ID connection carries path and depth into the child. |
| swift-01 | Retain | Separate steps distinguish type conversion from distance-unit conversion. |
| swift-02 | Retain | Number-line positions explain above/equal/below. |
| swift-03 | Corrected | Separate case boundaries keep all branch labels clear of their paths. |
| swift-04 | Retain | Included and excluded endpoints explain range iteration counts. |
| swift-05 | Retain | Removed matches and routed survivors preserve remaining order. |
| swift-06 | Retain | A returned calculation reaches the caller and supports later work. |
| swift-07 | Retain | Two references converge on one mutable instance, unlike an independent instance. |
| swift-08 | Retain | Empty versus occupied slots determine fallback use. |
| swift-09 | Retain | State changes produce a cleared input and one new list row. |
| swift-10 | Retain | Screen/store boundaries independently reject stale results. |
| swift-11 | Retain | Memory/file/memory boundaries distinguish encoding from persistence. |
| swift-12 | Retain | Proportional bars compare work counts, not elapsed time. |
| typescript-01 | Retain | Contract/value matching exposes a mismatched field type. |
| typescript-02 | Retain | Discriminant branching determines available fields and results. |
| typescript-03 | Retain | Per-call return differs from accumulated stored totals. |
| typescript-04 | Retain | Typed collection boundaries preserve output relationships and absence. |
| typescript-05 | Retain | Diagonal validity matrix makes correlated event/payload pairs visible. |
| typescript-06 | Retain | Predicate matrix distinguishes numeric text, negative, and non-finite rejection. |
| typescript-07 | Retain | State transitions and a stale-result self-loop distinguish unchanged state. |
| react-01 | Retain | Click, state, rerender, and next screen show state-driven output. |
| react-02 | Retain | Rejection and before/after views show validation, append, and clearing. |
| react-03 | Retain | Actual screen states distinguish loading, empty success, data, and failure. |
| react-04 | Retain | Focus outlines and return path explain disclosure interaction. |
| react-05 | Retain | Highlighted matches and cache paths explain dependency-based recomputation. |
| react-06 | Retain | Two time lanes block an older failure from replacing newer results. |
| backend-01 | Retain | Request/response lanes distinguish creation, retrieval, object, and list. |
| backend-02 | Retain | A surviving disk file separates writer and later reader lifetimes. |
| backend-03 | Retain | Known rows feeding an aggregate distinguish row count from known-value count. |
| backend-04 | Retain | Ordered guards establish the write boundary and preserve values on rejection. |
| backend-05 | Retain | Decisions distinguish failed save from failed reload after a successful save. |
| developer-toolkit-01 | Retain | Folder containment separates instructions, saved source, and execution result. |
| developer-toolkit-02 | Retain | Broken/fixed/expected comparison across inputs tests a general rule. |
| developer-toolkit-03 | Retain | Command/script/file paths explain launch resolution. |
| developer-toolkit-04 | Retain | Working tree, staging, and linked commits distinguish save from history. |
| developer-toolkit-05 | Retain | Manifest/lockfile reconstruction explains reproducible installation. |
| developer-toolkit-06 | Retain | Comparable cases expose strict Boolean behavior and invalid-price rejection. |
| developer-toolkit-07 | Retain | Number-line arrows explain clamping and inclusive boundaries. |
| developer-toolkit-08 | Retain | Converging dependencies show why unavailable storage prevents readiness. |
| developer-toolkit-09 | Retain | Review matrix exposes all-required logic, strict true, and missing evidence. |

## Verification and limits

The SVG/description regression covers all 115 IDs, bounded geometry, actual SVG rendering, accessible labels, and arrow references. The patch adds exact endpoint, branch-label, and internal-space assertions. Affected scenes are rasterized and inspected, not accepted solely from render-string checks. Lesson content/contents and layout regressions preserve 818 original sections, 116 visual placements, and the narrower reading layout.

SVG raster inspection is not native browser or assistive-technology testing. The isolated cloud preview remains inaccessible to the available browser. Existing technical diagrams intentionally remain 760px wide in a keyboard-focusable horizontal scroll region instead of compressing their text below readable size on phones. Native phone scrolling and keyboard operation are not newly claimed as verified.

Optional polish, not open closure requirements: parent containment in HTML 01, explicit mount/effect/focus labels in React 04, a Node runtime intermediary in toolkit 01, array brackets in Swift 11, and additional interactive variants in advanced Python. None warrants a broad rewrite of the current useful visuals.

## Exploration-control cleanup, October 21, 2026

A later user correction removes interactions that merely substitute a label or number. This overrides the earlier request for broad what-if controls; it does not remove useful drawings or the coding editor.

Removed across their shared render locations:

- Python Basics: editable pet name and age fields, the “Change Pepper’s details” action, and the generic “change one thing” introduction. The shared example is fixed at Pepper, age 5. Matching name/age-swap and new-profile practice prompts were removed from PyCharm guidance/download comments, not replaced with new exercises.
- Python 05: the button/shell/stamp chooser. The worked append uses a fixed button, so the control no longer invites meaningless relabeling.
- Python 08: the numeric factor dial. The existing ×3 example remains, with no replacement slider or new task.

Retained for specific conceptual discoveries:

- Existing explained-example navigation: assignment versus output, two names referring to one object before rebinding, and digit text concatenation versus arithmetic. These are fixed worked examples, not editable personal-detail substitutions.
- Lists/functions: empty input, count versus index, mutation versus a new collection, and distinct append/return/print phases.
- Conditionals: brightness crossing a boundary and the strict/inclusive comparison at equality. The brightness controls change branch behavior, not only printed numbers.
- Loops: changing iteration count and empty input separates repeated body work from the single outside-loop finish.
- Generators: reusable collection versus a one-shot iterator, repeated exhaustion, and empty input.
- CSV: quoted delimiters, escaped quotes, header-only input, and CSV-aware versus naive splitting.

The other 108 lessons have display-only lesson diagrams rather than these interactive scene controls. Static diagrams, original prose, optional explanation branches, section/annotation anchors, notes, progress denominators, and the actual project editor are unchanged. No new exercises were introduced. The shared Basics implementation is tested in all six concept rooms so the removed fields cannot reappear on another room.
