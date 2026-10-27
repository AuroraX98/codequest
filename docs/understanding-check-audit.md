# Understanding checks — 2026-10-26

## Scope and coverage

- Reviewed all **116 authored lesson quizzes** across ten tracks. Rewrote or strengthened 66; retained 50 sound application checks.
- Reviewed all **84 optional math checks**. Changed 23 questions to transferred scenarios/inputs, corrected one Infinity/range-check explanation, and retained 60 sound checks.
- The 19 lesson explanations that explicitly discuss the quiz answer now lead to questions with different inputs or scenarios. Teaching text is preserved.
- Removed the generic token-role quiz generator. In the 822 authored written sections, it previously produced 338 recognition checks; it now produces six bounded consequence checks. The six separate Python Basics concept microflows each also retain a reviewed application check.
- Unknown/partial/stateful snippets remain complete examples, not invented quizzes. Their lesson still has its authored quiz and project practice. There is **not** a question after every microstep.
- Retained the six visual what-if simulation families: branch boundaries, loop visits, collections, recipe scaling, generators, and CSV boundaries. They test consequences and explain them. The input() demonstration is labeled as a simulation, not real Python execution.
- Generated extra Practice Studio projects already request distinct examples and runtime checks. Arbitrary future AI-generated exercises cannot be guaranteed pedagogically sound by this audit.

## Example

Values previously asked “Choose the number.” It now asks what changes if `5` becomes `"5"`. Choices distinguish text, unchanged numeric value, renamed variable, and no effect. Feedback explains why digit characters inside quotes are text while the variable name stays unchanged.

Other revisions ask about a link whose visible label changes, an element created but not attached, an assigned property leaving another alone, a set receiving a duplicate, and staged Git changes without a commit. Each has one question, plausible misconceptions, one correct key and explanatory feedback.

## Preserved

All lesson IDs, project code, solutions, reference explanations, 550 project steps, runtime checks, canonical reading keys, notes and official progress remain unchanged. All 116 lessons, 822 written sections and 351 derived code examples remain. The site audience is not changed by this work.

Device-local microstep checkpoints are versioned: old token-question positions/answers are discarded once, rather than incorrectly restoring an old answer into a revised exercise. Official completion is unaffected. New checkpoints continue to resume normally.

## Verification

- `node tests/audit-authored-understanding.mjs`: whole-corpus inventory, unique answers/choices, feedback and exact non-assessment content invariant; representative calculations.
- `node tests/exercise-wording.mjs`: all non-assessment curriculum fields and project safety instructions preserved.
- `node tests/understanding-practice.mjs`: 11 reviewed pattern cases, five safe omissions, unique choices and four native CPython checks.
- `node tests/lesson-step-flow.mjs`: all 822 sections, source preservation, wrong/right feedback, navigation, completion gating and device-local resume.
- `node tests/simple-reading.mjs`: lesson availability, six Python concept microflows, reference rendering, stable progress keys, no unsolicited writes.
- Five simulation/input suites: native Python model comparisons plus DOM checks; 762 branch cases, 72 loop cases, 14 collection scenarios/32 states, three generator modes/31 states and eight CSV cases.
- Representative Python and SQLite assessment answers executed independently.

Independent browser QA verified Values wrong/right feedback and refresh resume at step 4/4, Back reset, Continue to Strings & numbers, unchanged manual reading state, and no horizontal overflow at 455px, 500px and 1180px viewport widths.

These tests do not prove learner outcomes, every future generated assessment, or full assistive-technology behavior. See the release handoff for production build and browser verification results.
