# Kotlin/JVM actual compiler verification

128/128 authored fixtures passed across64 lessons:122 successful executions,5 intended compilation failures,1 intended runtime assertion failure. All64 worked lesson snippets match the executed fixture sources. Actual Kotlin2.4.21, JVM bytecode target21, Microsoft JDK25.0.5.0.2 runtime; separate bundled kotlinx-coroutines-core-jvm1.8.0 explicitly placed on compile/runtime classpaths. No preview flags or browser Kotlin execution claimed.

Actual receipts assembled from original12, foundations40, types36, and library40. Library40 reused the author's already complete run using the same shared runner; a duplicate partial library run was interrupted and is NOT used as evidence. Aggregate entries retain their original receipt paths. Do not count partial runs twice.

Type37 initially expected diagnostic substring `bound`, but compiler correctly reports String where Number expected. Type38 initially used generic `type`. Authors narrowed both metadata needles to actual intended semantic messages; unchanged tested sources and saved actual compiler errors were revalidated, preserving original receipts. diagnostic-revalidation.json records exact before/after metadata and pass transitions; no result fabricated by changing source or silently ignoring an error.

All six negative diagnostics independently inspected: Number bound37, projected mutable-list insertion38, private cross-file function53, omitted dependency54, upper-bound check failure55, suspend call outside coroutine57. No successful compilation warnings.

Additional actual checks: input EOF,zero,out-of-range3PASS and stale jar runs oldmessage after source edit then newmessage after rebuildPASS. Author separately reports80 repeated cancellation/mutex runs, with receipts under library-and-coroutines; not included in128 baseline count.

run-all.py supports isolated cases, explicit sources/extra files, coroutine flag, intended diagnostics, timeouts. aggregate.py verifies exact source+metadata provenance and produces summary.json/results.json/case-manifest.json/source-match.json. No live application edits or further installation done by this verification task. Compiler passing does not certify learner mastery or production correctness.
