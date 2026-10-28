# Python benchmark depth: 78–84

Seven new runnable lessons; staging only. Existing 71 lessons are not edited.

- 78: mutable value equality stays unhashable; immutable string-tuple snapshots have consistent hashes.
- 79: first-match search returns an explicitly defined equality-test count.
- 80: constant/linear/quadratic/halving count models distinguish exact counts from asymptotic bounds.
- 81: inclusive-index binary search on sorted integer lists, any duplicate match permitted.
- 82: stable insertion sorting of `(priority, label)` records, counting rightward shifts and preserving the original.
- 83: merge two sorted integer lists, preserving all duplicates and both sources.
- 84: counted recursive merge sort with copied base cases and summed comparison counts.

## Evidence

`lessons.json` contains exactly seven new units and seven lessons in the existing runnable schema. `support-map.json`, `headings.json`, and `terminology.json` retain exact paragraph anchors. `function-evidence.json` contains 25 visible purpose/input/result/syntax/call records. Routine print calls are established scaffolding, not new function targets.

`execution-cases.json` contains 20 complete worked, changed-case and preservation/boundary fixtures. Four project-level supplied helpers additionally test snapshot/source/copy contracts and are explicitly described as test infrastructure. Every solution and expression is AST-parsed in `validate.py`; this is not a runtime-success claim. Tools separately owns native and actual browser-Pyodide execution.

`source-alignment.json` distinguishes published MIT topic alignment from our original exercises. Insertion sort is a supplemental choice, not misattributed as an algorithm listed in MIT6.100L lecture24. There is no claim of exhaustive Python, university equivalence, timing superiority, or arbitrary-object comparison behavior.

Independent semantic review is coordinated with the curriculum lead. No canonical source, private user data or deployment was modified.
