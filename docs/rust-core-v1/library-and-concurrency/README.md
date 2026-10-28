# Rust Core v1: library and concurrency (47–68)

22 original micro-lessons;44 complete worked/changed fixtures. Staged concept content only, not live app or GitHub changes. The app displays examples and understanding checks; it does not execute Rust in a browser.

## Artifacts
`author.py` regenerates `lessons.json`, exact `support-map.json`, concept `headings.json`, anchored `terminology.json`, `execution-cases.json`, complete `companions/` and primary-reference `sources.json`.

- `structure-validation.json`:22/22 checks pass for IDs/prerequisites, exact visible support, heading/term indexes, optional practice and companion agreement.
- `independent-semantic-review.json`: independent22-lesson/44-fixture review passed after first-use gloss improvements.
- `execution-reconciliation.json`:44/44 current source hashes match actual tools-worker receipts, named Cargo unit/integration markers are present, and the async-context negative diagnostic matches the narrowed intended error.

## Actual execution evidence
The tools worker owns `../compiler-evidence/library/results.json`: **44/44 pass** with stable Rust1.99.1, edition2024, standard library only. Cargo tests run offline. Two intentional compiler rejections verify non-Send Rc transfer and await outside an async context; one deliberately wrong unit-test assertion verifies a real failure, not an empty test selection.

`../compiler-evidence/concurrency-repeats.json` records **120/120 repeated runs** across six worked/changed thread, channel and atomic variants. Repetition does not prove every possible schedule, and no race-detector, sanitizer, Miri or formal-verification claim is made.

## Limits and safety
Lesson64 creates and drops an unpolled future. Lesson65 polls only `std::future::ready` once using Box::pin and a no-op waker. This is explicitly **not a general executor**, does not support timers or asynchronous I/O, and uses no Tokio, dependency download, unsafe pinning or busy-poll loop. Lesson67 demonstrates safe slice access while explaining unsafe contracts; it executes no unsafe/undefined-behavior example.

Workers own their captured values and are joined; channel sender lifetime is explicit. File writes use disposable relative fixture names. Bounded parsing checks its complete fixed input size before line allocation, then checks count and value ranges. No network operations occur. Test evidence is separate from learner reading or quiz completion.
