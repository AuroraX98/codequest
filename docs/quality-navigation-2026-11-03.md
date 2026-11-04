# Quality and navigation review, 3 November 2026

Based on hosted version 77, source 0ccbfafbe136a39397afecfe88306054acf7d137. The 1,221 lessons across 21 courses and their identities are preserved.

## Changes

- Prefer reviewed plain wording in the reading flow and keep original wording in a disclosure. Preserve “A program is a list of instructions the computer follows.”
- Split complete sentences even when the next begins with a lowercase code name. Keep code, bold markup and common abbreviations intact.
- Show one selected code-part meaning. On phones, show the source line and the selected labeled token; keep the full example available.
- Compact phone course selection, close contents after phone selection, restore search focus, and correct Terminology title and canonical site URL.
- Preserve backward entry at the final reading step. The microstep storage format is version 4; an existing microstep may restart within its current idea, while lesson completion is retained.
- Stabilize account/project lifecycle, update latest callbacks after render, and fix cleanup of a key-file read that can settle before its promise is assigned.
- Repair Windows-specific test paths and module fixture bindings. Keep explicit, narrow lint exceptions for intentional external-state hydration.

## Evidence

Type checking and lint pass with no warnings. Current navigation, course-switch/resume, reading-step, code-anatomy, lesson-contents/completion, protected-note, account-scope, API-key-file, practice and static-response regression checks pass. All 21 project routes and 811 authored local examples pass their current suite; 146 Python/SQL reference solutions pass. Tests use isolated data and provider fixtures.

The structure scan covers 7,102 sections, 23,002 explanatory steps (including preparation), 4,176 reviewed plain substitutions and 1,877 code examples. No scanned explanatory step exceeds 55 words. This is a structural audit, not a semantic certification of all prose.

Browser walkthroughs cover course selection, empty-search recovery, terminology filtering, contents selection, larger text, project failure feedback and code-part selection. Sampled viewports: 360×640, 402×874, 402×430, 320×800 and 1440×900. No page-wide horizontal overflow observed in those sampled views. Search clearing returns keyboard focus to the field.

## Limits

Physical iPhone Safari, the software keyboard, VoiceOver, real account synchronization and native Swift/Xcode execution remain unverified. Some technical prose and conservative Code/Symbol labels need deeper editorial review with beginners. The unfiltered 1,029-term glossary is long.

Historical TypeScript/JavaScript/Python/HTML core gates use stale data-URL import fixtures; CSS uses an old source hash; React expects an old source pattern. They are not green and were not weakened. The current affected regression suites and SQL core check pass.

Earlier suggestions for files, scope, HTML disclosures, CSS cascade and pagination already exist in this current curriculum. No duplicate topics were added. The review does not claim exhaustive coverage of every programming topic.
