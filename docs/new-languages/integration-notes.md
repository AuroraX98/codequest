# Ten beginner language paths — finite 60-lesson addition

Authoritative artifact: `all-sixty.json`; hash and counts in `validation-summary.json`.

- Stable tracks: csharp (C#), cpp (C++), java, c (C), kotlin, go, rust, php, ruby, r (R).
- Exactly six beginner lessons each. These are foundations, not full beginner-to-advanced courses or every possible topic. Further arrays/collections, error handling, modules, language-specific advanced topics and frameworks remain unbuilt.
- Every lesson uses existing `learningMode: "concept"`. The `runtime: "javascript"` field is an inert legacy schema requirement, NOT a claim that these languages run as JavaScript. Empty starter/solution/checks; do not show Build or record code execution.
- Add track identities/display names/filters to app types and navigation without adding browser runtimes. Preserve all prior 243 lesson objects, progress and reading IDs.
- Authored understanding practice is changed-case prediction/explanation after visible instruction. Source support maps cover all 60, including exact zero-based paragraphs. No lesson depends on an expansion-only fact.
- C/C++ local examples were actually compiled and run with GCC14.2; C++ changed quiz cases also ran. Eight other toolchains were not available, so examples have source/semantic review only. Do not claim all examples executed. Each group includes its own sources and limits.
- `terminology-additions.json` has 61 language-scoped additions across all ten tracks; exact links resolve to staged teaching. Review overlapping generic concepts before merging. `terminology-merge-suggestions.json` appends existing shared definition links without narrowing globally available terms. Never overwrite original terminology or interpret category as language.
- This is staged content only. App type/UI integration, browser QA, persistence/completion checks and deployment are owned by the integrator and not claimed by this artifact.

## Per-group evidence
- `csharp-cpp`: 12 lessons, GCC C++ example/quiz tests, C# source review, official Microsoft and C++ reference sources, shared terminology links.
- `java-c`: 12 lessons, GCC C11 examples and bounded input cases, Java source review, exact support maps.
- `kotlin-go`: 12 lessons, structured schema/prerequisite/link validation, source review; no runtime execution.
- `rust-php-ruby-r`: 24 lessons, visible teaching → complete example → changed-case quiz. Official Rust book, PHP manual, Ruby docs, R manual consulted. No compiler/interpreter available on PATH or standard /usr /opt scan. No installation attempted.

Stop scope: these 60 plus the separately delivered final-core10. No further topics or languages implicitly added.
