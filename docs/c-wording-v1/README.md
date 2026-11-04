# C wording and learning review

All 62 lessons were reviewed in order, one lesson at a time, without Team Effort or delegated agents. The course keeps its 350 section positions and has one worked example per lesson. Short reading steps show one idea at a time. Lesson IDs, quiz answer positions, starter and solution code, checks, and companion files remain intact. The other 1,159 lessons and units are unchanged against the course baseline.

The review defines unfamiliar words before using them and separates values, addresses, types, storage, errors, and concurrency. The header and source lessons combine the same files into one clearly labeled example. All 55 C glossary definitions were simplified, seven links were corrected, and six foundation labels now name the C17 core. The existing coverage plan remains the boundary; this is not a claim to cover every C API or C23 feature.

## Code visuals

All 62 exact examples have 3,925 labeled syntax ranges with 374 reviewed meanings. Labels distinguish pointer types, following a pointer, multiplication, getting an address, bit operations, pointer arithmetic, local and file-level static storage, and unevaluated sizeof operands. File markers identify separate files within one example. No part in these examples uses the generic Code or Symbol label.

The authoring tool uses tree-sitter 0.26.0 and tree-sitter-c 0.24.1 with reviewed context rules. These are authoring dependencies only. Generated labels match exact reviewed examples, allowing trailing whitespace. Edited code falls back to conservative labels. This is not a general C type checker. Reproduce with `python tests/c-anatomy.py PATH_TO_PARSER_PACKAGES`.

## Validation

- All 129 native cases passed using official w64devkit 2.11.0, GCC 16.2.0, and C17. These include 124 expected executions and five expected compile or link failures. All 62 displayed examples were compiled and run, including their separate files. The file-writing example's saved content was checked. Thread, mutex, and atomic examples ran successfully.
- Successful builds use `-Wall -Wextra -Wpedantic -Werror`. The intentionally truncated snprintf example alone allows its expected format-truncation warning, which the runner checks explicitly. Other successful compilations are warning-free. Intentionally undefined behavior was not run. See `native-results.json` and `native-example-map.json`. Reproduce with `python tests/c-native.py PATH_TO_GCC`.
- The preservation check, all 62 contents targets, 35 shared anatomy checks, 23 reading-flow checks, and TypeScript checking passed. All example sections now include a short introduction so the contents list keeps their direct navigation targets.
- Browser checks covered 360×640 (9:16), 402×874, and 1440×900. The phone layouts had no page-wide horizontal overflow, one reading window, and one active code part. Contents selection closed the phone panel, and Escape closed it from its opening button. Wrong answers allowed another try. A correct answer kept completion disabled while teaching sections remained unread. A separate-file visual correctly labeled score.h. Desktop contents opened beside the reading area. No console errors were recorded. See `browser-navigation.json`.

The browser teaches C but does not run it. Native checks ran separately. Phone sizes were browser checks, not physical iPhone or VoiceOver tests. No fresh debugger, sanitizer, or stale-build test is claimed. Local QA changed only temporary reading and answer state; no lesson was marked complete.

Primary references: [GCC language options](https://gcc.gnu.org/onlinedocs/gcc/C-Dialect-Options.html), [GCC instrumentation options](https://gcc.gnu.org/onlinedocs/gcc/Instrumentation-Options.html), [C syntax grammar](https://github.com/tree-sitter/tree-sitter-c), and [official w64devkit](https://github.com/skeeto/w64devkit).
