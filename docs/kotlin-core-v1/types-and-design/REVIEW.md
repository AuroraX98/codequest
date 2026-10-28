# Kotlin27–44 types and design

18 staged micro-lessons and 36 standalone worked/changed fixtures. Kotlin/JVM2.4.21, stable language2.4, JVM target21, JDK25 runtime; no Android, Native or JS execution claims. No coroutine dependency needed in this partition.

## Artifacts
`author.py` generates lessons, exact essential-support paragraphs, headings, terminology anchors, fixtures and Main.kt companions. Correct choices are permuted deterministically and each check has an individualized causal explanation. Optional local transfer remains visible.

`validate.py` contains structural checks and an optional local compiler runner. An initial partial own run was cancelled to avoid duplicating the designated Tools aggregate runner; `compiler-run.log` is partial evidence only, not a complete pass. Final compiler evidence is owned by the shared Tools runner. No successful execution claim should be inferred merely from the authored expected outputs.

## Review scope
- Separate object identity from val reference immutability.
- Constructor initialization order and backing-field setters are explicit.
- Overrides dispatch dynamically; extensions resolve statically.
- Data-class copy is shallow; container copy is not recursive element cloning.
- Sealed direct subtype restrictions, enum ordinal caveat, singleton vs instance state.
- Number bound and projected-list writes are intended compile failures, diagnostic checked by runner.
- Reification does not restore all nested generic arguments.
- Delegation does not redirect internal delegate calls to wrapper overrides.
- Lazy caches a successful result; result thread safety is a separate concern.
- require/check and typed catch are distinguished; use closes on thrown block failure.
- runCatching catches Throwable, with an explicit warning not to swallow coroutine cancellation.

## Primary sources
Each unit links the relevant official Kotlin language/API documentation. Classes, generics, delegation and runCatching references were freshly opened. Source semantics are reviewed separately from actual compiler execution.
