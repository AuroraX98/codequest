# Twelve additional authored projects

Added October 14, 2026. CodeQuest now has 115 authored lessons and projects. All 103 earlier catalog units and 102 earlier lesson objects were preserved exactly when compared as parsed JSON against the starting Git revision. The existing python-16 lesson received the focused timing reliability repair described below. The additions are appended, so existing IDs and saved progress still identify the same lessons. Language and level filters place the additions in their matching course sections.

Each addition contains seven focused theory pages, two worked examples, a vocabulary explanation beside its use, an analogy with its limit, a quiz with explanatory feedback, a project brief, steps, three hints, starter code, a runnable solution and behavior checks. These are built-in course projects and require no AI generation. The checks provide scoped feedback, not proof of mastery or protection against deliberate hard-coded answers.

| ID | Level | Project | New practice |
| --- | --- | --- | --- |
| javascript-20 | Beginner | A tidy name badge | Trim outside whitespace, preserve names and provide an empty-input fallback. |
| javascript-21 | Intermediate | A shared supply list | Group quantities with Map, preserve first-seen order and handle unusual keys. |
| javascript-22 | Intermediate | A task board that keeps its old copy | Copy changed state while preserving original arrays and unchanged objects. |
| javascript-23 | Advanced | A note editor with reversible history | Manage undo/redo boundaries, independent histories and edits after undo. |
| python-22 | Beginner | A shelf label maker | Format values with f-strings and choose singular/plural units. |
| python-23 | Intermediate | An inventory import report | Parse quoted CSV, reject bad records and group valid stock quantities. |
| python-24 | Intermediate | A reading log summary | Parse JSON and distinguish reading sessions from distinct book totals. |
| python-25 | Advanced | A workshop preparation planner | Order dependencies, detect cycles/missing tasks and avoid changing input. |
| sql-10 | Beginner | A supply category directory | Use DISTINCT, filters and explicit sorting in a reusable view. |
| sql-11 | Intermediate | A reachable contact list | Combine TRIM, NULLIF and COALESCE for clear contact fallbacks. |
| sql-12 | Intermediate | An order status dashboard | Use left joins and conditional aggregates without losing zero-order customers. |
| sql-13 | Advanced | A folder path explorer | Build variable-depth paths using a recursive CTE and multiple roots. |

## Input contracts and limits

The briefs state which inputs each function accepts. JavaScript name cleanup accepts strings, supply quantities are nonnegative integers, task IDs are unique strings, and history stores strings. Python shelf counts are nonnegative integers; the CSV importer expects valid CSV quoting and the named headers while rejecting malformed individual field values. The JSON summary expects valid JSON records with stated types. The dependency planner returns None for missing prerequisites or cycles; its recursive implementation is intended for these small teaching graphs, not arbitrarily deep production graphs.

SQL exercises use the bundled SQLite runner and supplied setup.sql fixtures. Their views derive results from their source tables. Contact selection is display formatting, not validation that a contact works. Order summaries use integer cents. Folder data is an acyclic forest with existing parents and names without slashes; arbitrary cyclic input would need additional protection. The added lessons deliberately introduce no new runtime or network requirement.

## Verification

- `tests/lesson-solutions.mjs`: **115 catalog records; 61 JavaScript-family solutions passed; no failures.** The existing three CSS cases (css-04, css-06, css-07) still require browser layout/transform/motion checks. This suite also checks ID uniqueness, catalog alignment, required lesson structure and quiz bounds. Its expected count was updated to 115; uniqueness is checked against catalog length.
- `tests/theory-examples.py`: **115 lessons, 818 theory pages and 249 worked examples; no failures.** It checked 53 Python snippets, 71 JavaScript snippets and two JSON snippets for syntax. This verifies formatting and syntax, not every explanation's learning effect.
- `tests/data-solutions.py`: **39 Python/SQL solutions passed; no failures** after repairing the earlier python-16 timing fixture. All eight new Python/SQL lessons passed; an isolated run also confirmed all **25** checks across those eight additions.
- Every one of the 12 new starters fails at least two meaningful project checks. The four JavaScript solutions also passed all 12 checks in the full solution suite. Starters that correctly handle an empty case still fail their unfinished core task.
- Additional SQLite mutation probes added a category, a contact, a paid order and a deeper folder after creating the respective solution views. All four views returned the expected updated results. These probes test the authored solutions' data dependence; they are separate from the learner-facing fixed-fixture checks.
- A parsed comparison against the starting Git revision confirmed that **102 original lesson records and all 103 catalog units are unchanged**. Only python-16 received the focused reliability repair below.

The existing python-16 timing failure was reproduced and repaired. Its original 20 ms timeout could wrongly reject a simulated 1 ms successful response on this Windows runtime, whose monotonic clock reports a 15.625 ms resolution. The lesson now allows **200 ms** per attempt and uses **600 ms** for a deliberate timeout, while keeping the successful response at **1 ms**. The starter, solution, both timing theory examples and quiz use the same revised budget. The quiz also accurately describes cancellation rather than promising an exact wall-clock stop. Bounded retries, explicit failure handling, concurrent results and cancellation assertions are unchanged; no check was removed or weakened. The full Python/SQL solution and theory suites both pass after the repair. Extremely delayed scheduling can still affect any wall-clock demonstration, as the lesson explains.

The additions' code and content were checked locally. Opening and completing all 12 in the published browser, running them on physical phones, and observing real learners remain separate verification work. No claim of measured learning improvement is made.
