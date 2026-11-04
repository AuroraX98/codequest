# Java wording and learning review

All 72 lessons were reviewed in order, one lesson at a time, without Team Effort or delegated agents. The course retains its 419 section positions and now has one worked example per lesson. Short reading steps show one idea at a time. Existing lesson IDs, quiz answer positions, starter and solution code, assessment checks, and companion files remain intact. The other 1,149 lessons and units are unchanged against the baseline captured before this course.

The review defines unfamiliar words, keeps explanations short, and separates objects, values, types, ownership, errors, and concurrency. The package, module, and classpath examples use one worked example with clearly named file parts. Each file is also recorded separately for compilation. All 61 Java glossary definitions were simplified, five links were corrected, and five old foundation labels now name Java 25.

## Code visuals

All 72 exact worked examples have 5,298 labeled syntax ranges with 528 reviewed meanings. The labels distinguish declarations and calls, numeric addition and joined text, generic bounds and comparisons, arrays, switch and lambda arrows, object identity, file names, packages, and modules. No part in these exact examples uses the generic Code or Symbol label.

The authoring tool uses tree-sitter 0.26.0 and tree-sitter-java 0.23.5, with reviewed context rules. These are authoring dependencies only. The website uses the generated labels only for matching examples, allowing trailing whitespace. Changed code falls back to the existing conservative labels. This is not a general Java type checker. Reproduce with `python tests/java-anatomy.py PATH_TO_PARSER_PACKAGES`.

## Validation

- All 145 native cases passed on Windows with official Temurin javac 25.0.5, `--release 25`, and `-Xlint:all`. They include 131 successful cases, 11 expected compilation failures, and three expected runtime failures. Successful compilations produced no warnings.
- All 72 displayed examples were compiled and run, including their separate file parts. `native-example-map.json` records the exact mapping. Historical compressed helpers in lessons 58 and 60 were checked for token equivalence, then the displayed file versions were compiled. `native-results.json` records commands, outputs, and diagnostics. Reproduce with `python tests/java-native.py PATH_TO_JDK`.
- The course-preservation check, all 72 navigation targets, 34 shared anatomy checks, 22 reading-flow checks, 15 contents checks, and TypeScript checking passed.
- Browser checks covered 360×640 (9:16), 402×874, and 1440×900. Narrow layouts had one visible reading step and one active code part, without page-wide horizontal overflow. Desktop contents and reading areas did not overlap. Choosing an idea closed the phone contents panel. Escape worked from the opening button and inside the panel. Wrong answers allowed another try; a correct answer did not mark unread sections as complete. Both separate-file labels were checked. No browser console errors were recorded.
- Browser review found that punctuation inside unmarked Java notation could split a sentence in the middle of a type. Inline code formatting now protects the affected wildcard, varargs, and negation notation. A regression check preserves both complete wildcard type names. The contents-test harness also now loads the heading module's JSON imports correctly.

The browser teaches Java but does not run it. Native checks ran separately. Phone sizes were browser checks, not tests on a physical iPhone or with VoiceOver. The existing core coverage plan remains the course boundary; it does not promise every Java API or specialist topic. No fresh interactive debugger or stale-class probe is claimed.

Primary references used during the review: [Java 25 Stream API](https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/stream/Stream.html), [Java 25 Thread API](https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/lang/Thread.html), and [Java syntax grammar](https://github.com/tree-sitter/tree-sitter-java).
