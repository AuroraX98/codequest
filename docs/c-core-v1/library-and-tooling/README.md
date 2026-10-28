# C Core v1: library and tooling (43–62)

20 authored micro-lessons on a C17 baseline; C23 is not claimed completely implemented by GCC14.2. This folder stages source only, not live app content or user progress. The app reads these examples and quizzes; it does not run C in the browser.

## Source artifacts
`author.py` regenerates `lessons.json`, exact `support-map.json`, concept `headings.json`, anchored `terminology.json`, `execution-cases.json`, full `companions/` and primary-reference `sources.json`. References are WG14 N1570 for the core clauses retained in C17 and GCC14.2 manuals for tooling. Every example is original, with optional local transfer practice and causal changed-case feedback.

## Actual verification
- `compiler-validation/summary.json` and `results.json`: **40/40** GCC14.2 strict C17 cases pass (`-Wall -Wextra -Wpedantic -Werror`). Four intentional compile/link rejections check expected diagnostics. Three controlled validation/open-failure cases check expected exit status1 and exact output; these are not crashes or UB demonstrations.
- `structure-validation.json`: **20/20** prerequisite, concept support, heading/term-index and companion agreement checks.
- `extra-validation.json`: **11/11 groups**, **125 runs**: five safe address/undefined sanitizer checks and six thread/atomic variants repeated20 times each. Leak detection explicitly disabled because this environment previously reported LeakSanitizer unavailable under ptrace; **no leak-check claim**. Repetition does not prove all schedules.
- `separate-build-validation.json`: **4/4** actual object compilation, linking, execution and omitted-definition diagnostic checks, matching lesson56’s two-stage commands.

## Safety and limits
File-writing cases replace relative fixture names only in disposable directories. C threads and atomics are optional facilities guarded by feature macros; actual tests use `-pthread` on the available platform. Thread, mutex, lifetime and status paths are explicit. No deliberately undefined execution, racy volatile variant, network request or third-party library installation is used. Portable binary decoding explicitly requires eight-bit bytes rather than assuming every C byte has that width. A clean compiler/sanitizer run is not a security or mastery certificate.
