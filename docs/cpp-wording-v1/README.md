# C++ wording and learning review

All 69 lessons were reviewed in course order by the host, one lesson at a time, without Team Effort or delegated agents. The course retains its 426 section positions and has one worked example per lesson. Short reading steps show one idea at a time. Existing lesson IDs, quiz answer positions, starter/solution code, assessment checks, and companion files remain intact. The other 1,152 lessons and units are unchanged against the baseline captured before this course.

The review defines unfamiliar words before building on them, separates values from their types, and explains ownership, lifetime, errors, and concurrency without promising results that C++ does not guarantee. Extra worked snippets were removed. The header and linking examples remain one example each, with explicitly labeled file parts; their individual file sources match the native compiler cases.

59 C++ glossary meanings now use plain language. Eleven glossary links were moved to the sections that explain their terms. The translation-unit entry points back to its definition in lesson 59.

## Code visuals

All 69 exact worked sources have 4,484 labeled syntax ranges. The authoring tool uses Tree-sitter's C++ syntax tree and reviewed explanations, including explicit handling of ambiguous constructor syntax that the syntax-only parser cannot resolve. These labels are not a general C++ type checker. They only apply when the displayed source matches the reviewed example, allowing trailing whitespace. Edited source falls back to the existing conservative labeling.

Labels distinguish pointers, dereferencing, multiplication, references, addresses, lambda captures, template brackets, comparisons, input/output streams, view composition, and function definitions/calls. File markers identify where each part of the multi-file examples belongs. No reviewed C++ part uses the generic Code or Symbol fallback.

Reproduce labels with `python tests/cpp-anatomy.py PATH_TO_PARSER_PACKAGES`, using tree-sitter 0.26.0 and tree-sitter-cpp 0.23.4. These packages are authoring dependencies only; the website does not load them. Primary parser references: [Python bindings](https://tree-sitter.github.io/py-tree-sitter/), [C++ grammar](https://github.com/tree-sitter/tree-sitter-cpp).

## Validation

- Fresh Windows execution: all 146 native cases passed using official Zig 0.17.1's bundled Clang/libc++, C++23, and `-Wall -Wextra -Wpedantic -Werror`. This includes all 69 displayed examples, expected compile/link rejections, input/error cases, real disposable-file I/O, thread/atomic cases, and the intentional assertion failure.
- `native-example-map.json` matches each displayed file to its executed case after trailing-whitespace normalization. `native-results.json` records commands, outputs, and diagnostics. Reproduce with `python tests/cpp-native.py PATH_TO_ZIG`.
- The full course-preservation gate, all course heading targets, 33 shared anatomy checks, 21 shared reading-flow checks, and TypeScript checking passed before browser review.
- Browser review covered 360×640 (9:16), 402×874, and 1440×900. Phone views showed one reading step and one active code part, without page-wide horizontal overflow. Desktop contents and reading areas did not overlap. Contents selection closed the phone panel and opened the requested idea. Wrong-answer retry and correct-answer feedback worked; completion stayed disabled until sections were marked read. Both file labels were verified in the code visual. No browser console errors were recorded.
- A discovered navigation bug was fixed: Escape now dismisses an open Table of Contents while its opening button has focus, as well as from inside the panel. Focus remains on or returns to that button. The fix is shared across courses.

The browser teaches and checks understanding; it does not execute C++. Fresh native results use Clang/libc++, not the historical GCC 14.2 evidence. No new sanitizer or interactive debugger claim is made. Phone dimensions were browser checks, not tests on a physical iPhone or VoiceOver. Existing advanced-topic exclusions in `docs/cpp-core-v1/coverage-plan.json` remain explicit; this is a core course, not every C++ API or specialist topic.
