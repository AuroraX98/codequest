# Kotlin/JVM Core v1: library and coroutines (45–64)

20 original concept micro-lessons with worked and changed cases. The app reads the content; it does not execute Kotlin. No live app, user progress or GitHub files are changed by this staging folder.

## Artifacts
- `author.py` regenerates `lessons.json`, exact `support-map.json`, concept `headings.json`, anchored `terminology.json`, `execution-cases.json` and full `companions/`.
- `sources.json` contains primary Kotlin/JetBrains and Oracle JVM references. Current documentation may display newer coroutine releases; the actual tested dependency is deliberately **kotlinx-coroutines-core-jvm 1.8.0**, not a claim that it is latest.
- `structure-validation.json`:20/20 checks for prerequisites, visible support, heading/term indexes, optional transfer practice and fixture agreement.
- `compiler-validation/` and `compiler-run.log`: **40/40 actual compiler/run cases pass**; terminal summary.json records Kotlin2.4.21 on JDK25. Three expected compiler rejections and one explicit check failure verify the intended diagnostics.

- `repeat-validation.json`: **4/4 groups,80 repeated JVM runs pass** for cancellation/cleanup ordering and mutex-protected counters. Repeated schedules are not an exhaustive concurrency proof.

## Runtime boundary
Compiler Kotlin2.4.21; JVM bytecode target21; actual execution on JDK25. Kotlin stdlib and the separately versioned coroutine library are distinct. Lesson57 shows explicit compile/runtime classpaths; `-include-runtime` does not package arbitrary dependencies. File examples replace only disposable relative fixture paths. Java property examples run in isolated short-lived JVMs. No Android/Native/JS portability, network execution, experimental API or benchmark claim is made.

## Safety and checks
40 fixtures include expected visibility/missing-source/suspend-context compiler failures and one deliberately incorrect explicit test check with an expected exception. Coroutine examples use owned scopes, awaited results, a cancellation handshake and a shared mutex; no sleep-based assertion, unprotected parallel counter or detached global coroutine is used. Compiler execution and repeat-run evidence are separate from learner reading/quiz completion.
