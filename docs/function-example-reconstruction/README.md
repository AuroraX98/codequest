# Taught-function examples: reconstructed and revalidated

This is a **new replacement change**, not recovery of the lost local commit `3e8fd60f2c48f28fdab4dda721db4ec6c60a35b4`. That commit was never published. Its workspace-only tree and receipts disappeared after a workspace rollback. The teaching edits were reconstructed from retained exact proposal text against a freshly verified public baseline, `517bef2f973bf6f32a62c87b0638112bb69197bf`, then independently reviewed and tested again. No old log hashes, compiler receipts or commit identity are invented.

## Result

- **35 paragraphs in 34 lessons** clarify actual calls, inputs, results/effects and relevant limits.
- **Two Python string cards** gain `replace`, `split` and `join` breakdowns and expected results; five matching simple-language sentences accompany them.
- All **1,221 lessons / 21 courses** have inventory records. The six Python concepts / 19 explore cards and 161 Python Tools links are covered separately.
- Lesson IDs, all 7,102 section positions, exercises/starters/solutions/checks/quizzes, catalog, terminology, license, privacy and hosting identity/access are preserved. Learner records were not accessed.

Examples include `fgetc`, `steady_clock::now`, event dispatch, Swift string conversion/search, Node random bytes, empty R vectors and supporting library calls. Three existing policy/algorithm exercises gain small analogous worked helpers with different names/data. The already reference-only Java `thenCompose` mention is explicitly marked further reading rather than expanded into a new objective.

## Coverage and evidence

| Group | Lessons | Retained semantic evidence and fresh reconstruction work |
| --- | ---: | --- |
| Python / JavaScript / TypeScript / React | 247 | Prior contract/candidate review retained; 425 mapped historical anchors freshly reconciled; proposed additions freshly reviewed/tested. |
| C / C++ / C# / Go | 259 | Prior all-prose/compact-source review retained; baseline and anchors freshly checked; both changed complete programs freshly compiled/run. |
| HTML / CSS / SQL / Swift | 212 | Prior callable-bearing semantic review retained; 143 historical anchors freshly reconciled; two deltas and HTML DOM/syntax freshly checked. |
| Backend / AI / Developer Toolkit | 99 | Prior full explanation review retained; unchanged baseline verified; eight deltas independently reviewed, with controlled runtime checks where applicable. |
| Java / Kotlin / Rust / PHP / Ruby / R | 404 | Prior full instructional-prose review retained; 368 historical snapshots and 938 anchors freshly reconciled; all 22 additions freshly read and cross-reviewed. |

The adjacent inventories distinguish **historical semantic work**, **fresh source/anchor checks**, and **fresh runtime checks**. Counts and regex candidates are not semantic certificates. A warning-only or explicit further-reading API is not silently treated as a taught objective; syntax, operators and markup are not called functions. Previously taught output helpers need not be reintroduced in every later lesson.

`paragraph-deltas.json` records the exact guarded changes. `baseline.json` and `tests/function-example-reconstruction.mjs` reconstruct the complete pre-edit lesson array and hash it, proving that unrelated fields and section identities remain intact. Independent review receipts bind the proposed artifacts/source to their fresh hashes. Reconstruction artifact hashes are not represented as hashes of the lost commit.

## Checks

After installing dependencies, run `npm run build` once on a clean checkout to prepare the pinned browser runtimes. Relevant checks:

```sh
node tests/function-example-reconstruction.mjs
node tests/lesson-step-flow.mjs
node tests/code-anatomy.mjs
node tests/lesson-display.mjs
node tests/lesson-contents.mjs
node tests/python-tools.mjs
node tests/course-tools.mjs
node tests/understanding-practice.mjs
node tests/python-concept-lab.mjs
npx tsc --noEmit
npm run build
node tests/offline-build-artifacts.mjs
```

The focused regression reads final teaching source and checks ten output/cleanup scenarios. Fetch is controlled, not real HTTP; DOM event checks use jsdom. C/C++ examples were compiled with strict warnings and executed in isolated fixtures. The Python concept-lab suite includes actual bundled Pyodide cases. The stale Tools count/search assertions and missing heading-module test imports were repaired without changing production navigation or weakening route checks.

## Limits

- The new Swift example and two new R examples are source/official-reference reviewed, **not natively executed**; those toolchains are absent.
- Unchanged Express/native-dialog code was contract-reviewed, not tested as a live server or native modal lifecycle.
- Current regression/build evidence is not a fresh execution of every lesson program, an all-device visual test, or a universal API-completeness claim. Phone-layout work remains outside scope.
- Historical tests requiring unavailable private Sites history are not claimed to pass. See `validation.json` for the exact fresh checks.
- This source change does not itself deploy the hosted Site. GitHub publication, a durable source artifact and Site deployment are separate outcomes.
