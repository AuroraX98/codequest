# CSS wording review

Reviewed all 56 lessons in course order, one at a time, without delegated agents. The 298 section positions remain unchanged. Explanations, tasks, hints, quiz wording, and contents headings now use shorter sentences and define unfamiliar terms before using them.

The course has 70 authored code examples: 67 CSS examples and three short HTML setup examples. Each section has at most one example. The reader shows one thought or one example at a time, and the visual explains one selected code part at a time on narrow screens. Reviewed CSS bypasses automatic extra examples and questions. CSS code labels now explain actual properties, selectors, functions, conditions, lengths, and named values. Contents entries use the same reviewed headings as the lesson.

Preserved all lesson IDs, route order, section counts, quiz answer positions, starter and solution code, checks, and companion files. All 1,165 other lessons and their catalog units match the baseline. No learner data was removed.

Validation:

- `tests/css-wording-course.py`: 56 lessons, 298 sections, 70 examples, preservation checks pass.
- `tests/css-wording-navigation.mjs`: all reviewed headings and section targets pass.
- `tests/lesson-step-flow.mjs`: all 298 CSS sections use authored-only steps; shared navigation, resume, and source preservation pass.
- `tests/code-anatomy.mjs`: CSS meanings and exact source conservation pass, along with shared language and interaction checks.
- `tests/unit-toc.mjs` and TypeScript checking pass.
- The historical `unit-toc-data.mjs` hash gate rejects the intentionally rewritten lesson objects. Its old source hash is not updated; the current course preservation and navigation gates above cover this release. The older CSS expansion gate likewise describes its historical exact wording, not this review.
- Browser: 55 unchanged CSS solutions exercised at 390px, plus 15 responsive runs of toolbar, gallery, and mobile-first lessons at 360/599/600/601/1400px. Initial batch: 68/70 pass. The animation passes on the active-preview rerun. Programmatic focus does not activate `:focus-visible` in this browser test context; actual Tab then Shift+Tab shows the expected solid 3px navy outline. Keep that observation distinct from an automated focus-check pass.
- Reader: contents selection, matching heading, Next/Back, line selection, property selection, one active step, no All Ideas, no console errors, and no page-width overflow checked at 360x640 and 402x874. These are browser viewport checks, not physical-iPhone tests.
- Print Preview remains an optional local companion; no physical printing or cross-browser certification was performed.

The complete course is published together after review. No partial CSS course was published.
