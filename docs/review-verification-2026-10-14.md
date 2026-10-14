# CodeQuest review and release verification

Reviewed October 14, 2026. Audience: an individual beginning/intermediate coding learner. Purpose: understand one idea, practice it, build something that runs, and return to saved work. Reviewed all 100 navigation criteria and all core app-quality categories; separate reports retain criterion-level evidence and unknowns.

## Assessment and changes

The app has a useful foundation: a connected learn/quiz/build loop, runnable code, hints, recoverable drafts, account-scoped work and optional AI. This review found specific friction rather than a need for more menus. Charcoal surfaces and consistent purple accents now cover the app, popups, native fields, messages and editor. Syntax, cursor, selection and field boundaries remain visible. The legacy light/dark preference values map to Charcoal/Deep charcoal, preserving stored profiles.

Fixed stable topic positions while searching, empty practice guidance, accessible practice run updates, and warnings before capacity replacement removes older practice. Twelve authored projects add text cleanup, grouped supplies, immutable state, undo/redo, labels, CSV, JSON, dependency planning, category directories, contact fallbacks, order reporting and recursive paths. The course now has 115 projects, 818 explanation pages and 249 worked examples. These course additions require no AI key. One existing Python concurrency lesson received a wider timeout margin after its original timing failed on Windows; expected failure/cancellation assertions were kept.

Usefulness and visual polish are supported by implementation and sampled agent walkthroughs. Actual learning benefit, satisfaction and demand remain unmeasured. Proposed learner studies and outcome definitions are in the quality report.

## Current browser inspection

Used the actual built offline React/CSS application and actual isolated JavaScript/Pyodide/SQLite runners in the Codex in-app browser. The local HTTP fixture supplies a disposable learning account and synthetic persistence responses; it does not validate hosted authentication or D1. Production sign-in reached an authentication check, so no authenticated production walkthrough is claimed.

- Desktop: inspected lesson, course discovery, build studio, AI practice and settings with charcoal styling.
- Learn/return: Next moved idea 1 to 2 with focused theory region; browser Back returned to idea 1. Section changes focused main content. Reload retained studio and edited code in the fixture/device storage.
- Search: filtering for loops kept topic number 4; unmatched text displayed recovery guidance; Clear search restored topics.
- Code feedback: original JavaScript starter failed 0/2; corrected code passed 2/2. New javascript-20, python-22 and sql-10 each passed 3/3 in actual browser runners with their authored solutions.
- Keyboard: Escape then Tab left CodeMirror and focused Run project without changing the code.
- 320 CSS px: sampled studio and settings had no horizontal page overflow and no visible button/input/select outside the viewport. Deep charcoal and larger-reading preference remained usable. This is an emulated viewport, not a physical phone or mobile-keyboard test.
- AI practice: empty-state text explained generation, restore and the no-key course alternative; disabled generation explained that AI was off.

## Automated and build evidence

Production Worker/client and offline builds pass. Offline pack includes 33 verified files at about 32 MB; this is package evidence, not a new full browser download/offline trip. TypeScript no-emit passes. The source reports cover passing navigation, local-mode boundaries, offline-client/cache, account/key isolation, practice storage/capacity, selection clarification and static transport checks. Content validation covers 61 JavaScript-family solutions, 39 Python/SQL solutions, all 115 lessons' theory syntax and starter discrimination for all twelve additions. Three existing CSS layout/motion lessons need real-browser geometry and were not rerun in this sample. Existing Swift/manual external projects retain their stated limitations.

Windows test harness imports were repaired to use file URLs and directory junctions; assertions were retained. Four preexisting PracticeStudio hook-lint findings remain documented. The Windows Worker development runtime fails at startup with an access violation; the production build itself succeeds. No paid provider request or production learning completion was performed.

## Scope and next useful validation

This is not full accessibility certification, all-browser coverage, a security audit or evidence that every authored explanation teaches effectively. Actual screen-reader speech, physical phone keyboards, live provider responses, authenticated production save/restore and real learner outcomes remain unverified in this review. The practice retention warning reduces accidental eviction; simultaneous-tab approval/insertion remains a documented race limit.

Next useful validation: observe a new learner complete one project without hints about where to click, ask them to explain its central idea, then give a changed-input version. Record task correctness and confusion alongside completion time; do not equate time spent or XP with learning.
