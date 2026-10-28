# Kotlin JVM Core v1 integration contract

Frozen: all58 new lessons independently source-reviewed and128/128 actual compiler cases across64 lessons passed.58 additive lessons Kotlin07–64 preserve all545 existing lesson/unit objects and reading IDs. Course64, app603. Concept mode has no Kotlin browser runner or fabricated execution checks.

## Artifacts
- all-fifty-eight.json, all-headings.json, all-support-maps.json
- terminology-additions.json:49 proposed distinct entries;9 append-only shared term link/scope extensions; expected477 terms.
- Meaningful TOC title/index maps become label/paragraphIndex. Worked snippets and optional transfers remain visible but grouped under concepts.
- All58 authored lessons independently reviewed for essential visible teaching and meaningful checks. Records per partition.

## Versions and runtime boundary
Official Kotlin2.4.21 stable compiler, JVM target21, approved JDK25 runtime. No experimental flags. Kotlin/JVM coverage only: no Android, Native, JS/Wasm or multiplatform execution promise.

Coroutine lessons explicitly depend on JetBrains kotlinx-coroutines-core-jvm1.8.0 bundled with the verified compiler distribution. This is separately versioned, not a language keyword or part of the Kotlin standard library, and is not claimed to be the newest release. Compile/run classpath commands are visible where introduced. The Kotlin runtime jar alone does not package this dependency.

Actual compiler fixtures and source matching recorded separately. Actual base128/128 PASS:116 new worked/transfer +12 original starter worked/transfer;122 successful executions,5 intended compiler rejections and1 runtime assertion failure. Diagnostics are explicitly verified, including narrowed37/38 negative needles. All64 worked examples match tested source. Three extra input boundary probes and a stale-jar sequence passed, separately recorded. No successful compiler warnings. Library author also verified80 repeated cancellation/mutex runs.

## Coverage and exclusions
Core types/conversions/text/input/nullability/smart casts/control/ranges; arrays/read-only vs mutable collections; functions/defaults/varargs/lambdas/capture/scope functions; classes/properties/inheritance/interfaces/data/sealed/enums/objects/extensions/generics/variance/reified/delegation/lazy; exceptions/use/Result; collection transformations/sequences/fold/sorting/destructuring; files/encoding/regex/time; packages/dependencies/testing/debugging; suspend vs thread semantics/structured scopes/async/cancellation/flows/mutexes/platform null boundaries; bounded study-session pipeline.

This is a bounded substantial core, not every API, Android/Compose, framework, DSL/compiler plugin, full Gradle ecosystem or proof of advanced mastery. Experimental coroutine APIs and low-level continuation internals are outside scope. Optional local transfer deepens practice; reading completion is not a local run.

File examples use disposable work directories. Concurrency tests use deterministic ordering/joins rather than timing guesses. Java helper source for platform-type lessons is visible and separately compiled. No GitHub synchronization.
