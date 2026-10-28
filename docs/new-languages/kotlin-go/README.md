# Kotlin and Go beginner starter tracks

Twelve staged concept lessons: six Kotlin and six Go. They introduce output, named values, numeric addition, conditional branches, loops, and returning a function result. Each lesson displays prerequisites, teaches its symbols before checking understanding, and includes a complete source example with **reasoned expected output**. The first lesson assumes no coding knowledge. This is an introduction, not an advanced or exhaustive curriculum.

## Integration contract

- `all-twelve.json`: AI24-style `units` and `lessons`; stable `kotlin-01..06` and `go-01..06` IDs.
- `learningMode: concept`; `runtime: javascript` is the existing **inert compatibility field**, not the language of the example. Keep Run/Build absent. Starter, solution, filename, and code checks are empty.
- `support-map.json`: exact zero-based primary explanation indices and text supporting each quiz.
- `terminology-additions.json`: language-specific additions plus non-destructive merge suggestions for existing shared terms. Keep category and language filters separate. Do not replace the existing glossary. Type inference and return have language-specific entries because no shared entry matched; the lead may consolidate them without losing language links.
- `runtime-sources.json`: official source links, scope and compiler limitations.
- `validate.py`: structural and content-link integrity checks, **not** a compiler test.

No genuine Go or Kotlin compiler was found during scoped checks. `/usr/bin/go` rejected `version` and was not identified as a Go toolchain. No runtime execution is claimed. No compiler was installed and no live CodeQuest files were edited. The primary sources were consulted on 2026-10-27; lessons deliberately avoid current-version-specific features or claims about the newest releases. App rendering, deployment and browser QA remain the integrating lead's work.
