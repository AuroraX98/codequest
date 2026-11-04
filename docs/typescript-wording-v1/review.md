# TypeScript wording and navigation review

All 49 lessons were reviewed by the host, one lesson at a time, in the existing course route. The completed course is published as one update. No Team Effort or subagents were used.

## Learning changes

- Rewrote explanations, quizzes, hints, and project instructions in shorter, concrete language.
- Kept 257 section positions and added matching reviewed contents headings.
- Kept one worked example per lesson, with connected files shown separately where a local workflow needs several files. There are 54 fenced blocks: 51 TypeScript, one JavaScript, and two JSON settings files.
- Enabled authored-only lesson rendering: code mentioned in prose does not become another generated example or exercise. Each reading step shows one thought or one code example.
- Corrected TypeScript code labels for type constraints, conditional types, mapped fields, type-only typeof, utility types, template literal types, as const, access rules, optional fields, and type markers. Labels preserve the source code.
- Kept the difference between type checking and real runtime checks explicit. Local module/configuration lessons remain optional local workflows, not falsely presented as runnable in the app's single-file editor.

The existing route covers basic values and objects, unions and narrowing, collections, generics, functions and classes, type guards, async values, mapped/conditional/utility types, modules, declarations, and compiler settings. This pass retained all existing topics and practice contracts; it did not add unrelated advanced topics to the beginner path.

## Verification

- `tests/typescript-wording-course.py`: 49 receipts in route order, 257 sections, 54 blocks. IDs, route, starter/solution code, checks, type assertions, variants, companion files, and quiz answer positions preserved. All 1,172 other lessons and units unchanged from this course's baseline.
- `tests/typescript-wording-navigation.mjs`: every contents entry matches the reviewed heading and the correct section index. Authored-only rendering enabled for all 49 lessons.
- `tests/typescript-wording-examples.mjs`: TypeScript 5.9.3; the exact production compiler-contract engine was verified against its source. All 47 single-file examples compiled and executed. The three local workflow lessons passed four compile/run cases. All 46 exercise solutions passed 132 type checks and 126 runtime checks. See `example-results.json` for actual outputs.
- Shared anatomy, reading-flow, and contents checks passed. Application type checking passed. The existing CSS headings check also passed.
- Browser checks at 360 by 640, 402 by 874, and 1400 by 900: no page-wide horizontal overflow; one active reading step and one selected-part explanation. Next/Back, contents navigation, line selection, and next/previous code-part controls worked. Beginner and advanced examples were inspected.
- The local editing server briefly logged an incomplete JSON read while a curriculum file was being saved. After editing finished, a fresh load displayed the completed lesson with no console errors. No production runner or storage changes were required.

## Evidence limits

The sizes above are browser simulations, not tests on a physical iPhone. Exercise compiler/runtime checks ran locally; this pass did not rerun all exercises in every browser or certify screen-reader behavior. The historical `typescript-core.mjs` and `unit-toc-data.mjs` fixtures describe older exact wording and are not current wording gates. This review uses its explicit baseline and current-course tests instead.

Technical cross-checks used the official TypeScript documentation: [types from types](https://www.typescriptlang.org/docs/handbook/2/types-from-types.html), [conditional types](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html), and [satisfies](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-9.html).
