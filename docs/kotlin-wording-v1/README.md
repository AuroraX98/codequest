# Kotlin wording and learning review

All 64 lessons were reviewed in order, one lesson at a time, without Team Effort or delegated agents. The course keeps its 366 section positions and has one worked example per lesson. Short reading steps show one idea at a time. Lesson IDs, quiz answer positions, starter and solution code, checks, and companion files remain intact. The other 1,157 lessons and units are unchanged against the course baseline.

The review explains unfamiliar words before building on them, shortens summaries and questions, and keeps example output with its explanation. Lessons 53 and 54 show their two files together as one labeled example. All 59 Kotlin glossary definitions were simplified and 26 links were corrected. The existing core coverage plan remains the boundary; this is not a claim to cover every Kotlin API or platform.

## Code visuals

All 64 exact examples have 2,619 labeled syntax ranges with 426 reviewed meanings. Labels distinguish spreading an array from multiplication, function arrows from branches, type brackets from comparisons, and numeric conversion from reading a number in text. File markers identify separate files within one example. None of these examples uses the generic Code or Symbol label.

The authoring tool uses tree-sitter 0.26.0 and tree-sitter-kotlin 1.1.0 with reviewed context rules. These are authoring dependencies only. The parser misreads some valid same-line closing braces, so its parsing view replaces the preceding space with a newline of the same byte length. It also misreads two generic calls as comparisons; reviewed exact-source rules label those spans. Original code is unchanged and separately checked by the Kotlin compiler. Semicolon labels are added explicitly. Generated labels match exact reviewed examples, allowing trailing whitespace. Edited code falls back to conservative labels. This is not a general Kotlin type checker. Reproduce with `python tests/kotlin-anatomy.py PATH_TO_PARSER_PACKAGES`.

## Validation

- All 128 native cases passed with official Kotlin 2.4.21, Temurin Java 25.0.5+8, language version 2.4, and JVM target 21. These include 122 expected executions, five expected compile failures, and one expected runtime failure. All 64 displayed examples were compiled and run, including separate files. Successful builds use `-Werror` and produced no warnings.
- Coroutine examples use the compiler distribution's kotlinx-coroutines 1.8.0 JAR, checked by SHA-256. The UTF-8 file example's saved bytes were checked as `41c3a9` for `Aé`. See `native-results.json` and `native-example-map.json`. Reproduce with `python tests/kotlin-native.py PATH_TO_KOTLINC_DIRECTORY PATH_TO_JDK`.
- The preservation check, all 64 contents targets, 36 shared anatomy checks, 24 reading-flow checks, and TypeScript checking passed.
- Browser checks covered 360×640 (9:16), 402×874, and 1440×900. The phone layouts had no page-wide horizontal overflow. The spread symbol showed its reviewed label. Contents selection closed the phone panel; Escape closed it both from the opening button and inside the panel. Wrong answers allowed a retry. A correct answer kept completion disabled while teaching sections remained unread. Separate-file visuals correctly identified Labels.kt and Main.kt. On desktop, the contents panel ended at x=256 and the main area began at x=268. No console errors were recorded. See `browser-navigation.json`.

The browser teaches Kotlin but does not run it. Native checks ran separately. Phone sizes were browser checks, not physical iPhone or VoiceOver tests. No fresh debugger, stale-JAR behavior probe, or repeated coroutine stress test is claimed. Local QA changed temporary reading and answer state; no lesson was marked complete.

Primary references: [Kotlin 2.4.21](https://github.com/JetBrains/kotlin/releases/tag/v2.4.21), [sealed classes](https://kotlinlang.org/docs/sealed-classes.html), [generics](https://kotlinlang.org/docs/generics.html), [extensions](https://kotlinlang.org/docs/extensions.html), [coroutines](https://kotlinlang.org/docs/coroutines-basics.html), [shared state](https://kotlinlang.org/docs/shared-mutable-state-and-concurrency.html), and [Kotlin syntax parser](https://pypi.org/project/tree-sitter-kotlin/).
