# Go Core v1: library, concurrency and testing (45–65)

21 original micro-lessons with42 worked/changed fixtures. Staged concept content only: no live app, GitHub or user-progress changes. The app displays the examples and understanding checks; it does not execute Go in the browser.

## Artifacts
`author.py` generates `lessons.json`, exact `support-map.json`, concept `headings.json`, targeted `terminology.json`, `execution-cases.json`, complete `companions/` and primary-reference `sources.json`. Lessons45/46/47/63 are real `_test.go` fixtures, not programs pretending to be tests. Named output checks ensure a successful empty test selection cannot falsely count as the intended test running.

`structure-validation.json`:21/21 structural checks pass, including prerequisites, visible support, optional practice, heading/term indexes and companion agreement.

## Actual execution
The tools worker owns the shared runner and terminal receipts in `../compiler-evidence/library/`. Its42/42 Go1.27.3 fixtures passed, including four expected failing tests with specific diagnostics. These are intentional test failures, not unsafe concurrency demonstrations. `execution-reconciliation.json` matches all42 current source hashes against actual receipts and revalidates the strengthened named-test/seed/benchmark output markers.

Standard library only; isolated local modules; `GOTOOLCHAIN=local`, `GOPROXY=off`, `GOSUMDB=off`, `GOWORK=off`, `GOENV=off` prevent hidden module/toolchain retrieval or ambient workspaces. File creation uses only disposable fixture-relative paths. HTTP behavior is exercised exclusively through ResponseRecorder or a custom in-memory RoundTripper; no listener, default transport, DNS or socket is invoked.

## Honest limits
Fuzz verification executes seeded inputs only, not an active discovery campaign. Benchmark smoke verification uses one iteration and accepts variable timing output; it establishes no speed claim. Concurrent examples wait through channels/WaitGroup and protect shared updates using a mutex or typed atomic. Actual race-detector verification passed6/6 worked/changed fixtures for mutex, atomic and cancellation-lifetime lessons59–61 in `../compiler-evidence/race/`. This cannot prove that unexecuted paths are race-free. There are no sleep-based correctness assertions or deliberately racy runs.
