# Swift wording review

Reviewed all 58 lessons in the saved course order, one at a time. Each receipt records the before and after text and the reviewed headings. The 343 existing reading sections and their positions are preserved, as are lesson IDs, quiz answer positions, starter and solution code, checks, and companion files.

Each lesson has one worked example. The three local module/package lessons (55–57) use one complete project each, split into its required files and commands. Each file has its own reading step and labeled visual. No reading section contains multiple code blocks. The other 55 lessons have one code block each. Extra variant examples and intentionally broken programs were replaced with short explanations of their limits.

All 58 contents lists use the reviewed headings. Reviewed rendering shows only the authored examples. Swift labels now explain common words by their jobs, distinguish half-open ranges and quoted names, and break #expect into real code parts instead of swallowing its whole line.

## Verification

- `python tests/swift-wording-course.py`: passed; 58 lessons, 343 sections, 66 file/code/command blocks. The other 1,163 lessons and units are unchanged.
- `node tests/swift-wording-navigation.mjs`: all 58 lesson targets match their headings.
- `node tests/code-anatomy.mjs`: passed 29 checks, including source preservation across 1,707 authored fences and Swift role regressions.
- `node tests/lesson-step-flow.mjs`: passed 16 checks across 7,102 sections, including one visible reading step and separate file steps.
- SQL navigation regression, table-of-contents behavior, TypeScript checking, and production build passed.
- Browser: 360×640 and 402×874 layouts had no horizontal page overflow and showed one reading step and one selected code part. Mobile contents selection closed the panel. Escape from inside the contents panel closed it and returned focus to its button. The named-test example exposed #expect as “Check a result.” At desktop width, the contents and reading area did not overlap. No console errors were observed.

## Execution limits

This Windows checkout has no Swift compiler or installed WSL, so this review does not claim a fresh native Swift run. `source-evidence.json` matches 50 retained example blocks by source hash to passing historical Swift 6.4.1/Linux results. The combined examples in lessons 20 and 21 match the earlier combined programs except for a blank line; those earlier programs printed Released and Ready. Lessons 15 and 16 contain newly composed examples reviewed against their existing definitions and exercises, without a fresh compiler run. Local project files in 55–57 remain the previously validated files. SwiftUI 09 still requires an Apple simulator or device; it was not executed here. Browser sizing checks are not physical iPhone or screen-reader checks.

Technical wording was checked against the official Swift book's [opaque types](https://github.com/swiftlang/swift-book/blob/main/TSPL.docc/LanguageGuide/OpaqueTypes.md), [reference counting](https://github.com/swiftlang/swift-book/blob/main/TSPL.docc/LanguageGuide/AutomaticReferenceCounting.md), and [concurrency](https://github.com/swiftlang/swift-book/blob/main/TSPL.docc/LanguageGuide/Concurrency.md) chapters, and Apple's [State](https://developer.apple.com/documentation/swiftui/state) and [ForEach](https://developer.apple.com/documentation/swiftui/foreach) documentation.
