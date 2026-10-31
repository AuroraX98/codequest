# New reconstruction — Python / JavaScript / TypeScript / React

Baseline: confirmed GitHub `517bef2f973bf6f32a62c87b0638112bb69197bf`.
This is a **new reconstruction from retained edits**, not recovery of the lost commit or original artifact bytes.

## Changes
- Proposed `react-09` paragraph6: concrete Event/dispatch example with argument, synchronous listener effect, cancellation Boolean, and listener cleanup. In `python-js-deltas.json`; canonical lessons not edited by this child.
- Edited only `lib/python-concepts.ts`, `lib/plain-beginner-python.ts`, `tests/python-tools.mjs`.
- Two existing string concept cards retain their original sentences/order and gain replace/split/join breakdowns and precise output comments. Five new exact-source simple pairs.
- Test expectation corrected from historical75 to current161 authored Tools entries. PRINT search correctly includes the main-guard lesson whose hint mentions print; exact expected titles retained, no route assertion weakened.

## Scope and evidence
Compact `python-js-inventory.json` contains all247 lesson IDs (Python92, JavaScript69, TypeScript49, React37), current-baseline explanation hashes, example paragraph indexes, and425 historical mapped targets. Every populated mapped literal call anchor was freshly checked against the confirmed baseline. The original review's semantic judgments remain historical: this reconstruction does not pretend that all unchanged247lessons were freshly rereviewed or executed. Candidate counts and metadata alone do not establish semantic completeness.

All6 Python concepts/19 explore cards were covered in the prior supplemental review; current source preserves them except the two specified improvements. `python-js-checks.json` records fresh checks and changed-file SHA256 values.

## Fresh checks
- Exact added event snippet executed twice in isolated jsdom: expected output, post-cleanup dispatch, and repeat execution passed.
- Actual lesson-step builder:12steps, zero generated practice quizzes; explanations appear as ordinary steps before the worked example.
- CPython outputs for strip/upper/replace/split/join matched the comments.
- All concept-explore source sentences resolve to exact simple counterparts.
- Independent TypeScript AST count:161 authored Tools entries.
- `tests/python-tools.mjs`: passed all161 current routes, uniqueness, search, rendered cards, direct print target and course return.
- `git diff --check`: passed.

The first concept-lab attempt passed9630 native/model cases then stopped at a missing cached Pyodide loader. Root subsequently restored and hash-verified pinned runtime assets; a fresh complete rerun is recorded separately. This initial failure must not be presented as a full pass.

No publication, Git push, site deployment, license change or learner-data action occurred.

Complete rerun: **PASS** 9630 generated/native model cases,90 actual bundled Pyodide cases, and the six-room UI/cancellation/copy/retention/isolation suite.
