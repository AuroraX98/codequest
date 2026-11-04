# HTML wording review
All 46 lessons were reviewed sequentially by the host, in the existing recommended order. Publication follows completion of the entire course.

The review covers summaries, all 242 teaching sections, steps, hints, quizzes, section headings, and project instructions. Each section has at most one HTML example. The two JavaScript companion blocks explain the same HTML example in a separate step. The course has 70 fenced examples. The code viewer keeps one line and one selected part at a time.

The original lesson IDs, route, section counts, quiz answer positions, starter/solution code, checks, and companion files remain intact. The 1,175 other lessons and their units match the v80 baseline. Individual review receipts record before/after text.

HTML code visuals now explain tag and attribute roles in context. WebVTT timing has start/end labels rather than arithmetic labels. Whitespace-only HTML is no longer described as visible text.

A real-browser check found a pre-existing dialog close bug. The shared runner now permits native form behavior only for HTML lesson 15, and only when its trusted frame enforces form-action 'none'. Network submission remains blocked. The real preview passed all three dialog checks, with Close, Escape, autofocus and focus return checked manually.

Validation:
- html-wording-course.py: all 46 lessons, 242 sections, 70 examples; preservation checks pass.
- html-wording-runtime.mjs: 45 projects, 134 checks; incomplete/empty starters rejected. JSDOM covers 133 solution checks; the native modal check is completed by browser-results.json.
- Two JavaScript bridges execute against parsed DOM; one caption cue has increasing times. HTML parsing does not establish source conformance.
- code-anatomy.mjs: 25 behavior checks and source preservation over all 2,058 authored fences.
- lesson-step-flow.mjs: 11 checks across all 7,102 sections.
- unit-toc.mjs, lesson-glossary.mjs, TypeScript, dialog permission guard, static response integrity and offline artifact checks pass.
- 360 by 640 and 402 by 874 responsive browser checks. No physical iPhone or screen-reader test is claimed.
- Real popover activation and Escape dismissal pass.
- Tested drafts restored; no learner quest completed.

Existing historical course-expansion hash gates describe older releases and were not rewritten to approve this wording release. The new baseline preservation gate verifies the current scope directly.

Technical references used for the interaction review: [HTML popovers](https://html.spec.whatwg.org/multipage/popover.html) and [HTML dialog](https://html.spec.whatwg.org/multipage/interactive-elements.html#the-dialog-element).

