# Teaching before exercises — 201-lesson audit

## Scope and evidence
All 201 authored lessons were semantically read against their authored quiz and important Build requirements, not merely searched for matching words. The two evidence matrices cover disjoint original 116 and added 85 lesson IDs. They preserve reviewers' original excerpts, indexes and findings; they are **pre-fix evidence**, not a claim that those source snapshots equal the final app. Python Basics' six actual primary rooms were reviewed separately from its supplementary written lesson.

The shared generator is also tested over all 1,487 authored explanation sections. Its recognized understanding checks now insert their necessary short rules as ordinary visible explanation steps before the code/example and exercise. The six Basics room paths have separate generated evidence. Optional token details remain optional: essential rules do not depend on opening them. Existing server reading marks remain activity records, not proof of mastery. Device-local microstep resume version changes to 3 so an old index cannot skip newly inserted teaching.

## Changes
- Define output, quoted/unquoted text, assignment/reassignment, print ordering, links and CSS selector behavior before corresponding generated checks.
- Add short missing bridges for nested Python helpers and propagated failure; TypeScript map/Record; React array operations; backend returned-copy isolation and comparison; toolkit lookup, max selection and debugger commands.
- Make three SQL practice schemas visible and correct the LEFT JOIN instruction that incorrectly asked to keep only missing matches.
- Put local environment-variable setup before the backend local activity; label the previous lesson's real-session activity as a follow-on, not a prerequisite of its browser fixture.
- Define modal inertness and zero flex growth plainly. Move Git's required file creation before commands that use that file.
- Remove stale quiz-specific descriptions while retaining valid teaching/examples. Transfer variants change rehearsed inputs without hiding their prerequisite rules.
- Preserve explanation-array lengths and paragraph positions, lesson IDs, code solutions, checks, persisted completion and all prior projects. Exact reviewed field changes are recorded in `tests/learning-support-reviewed-changes.json`; the original invariant is checked after reversing only those reviewed changes.

## Verification and limits
`tests/learning-support.mjs` verifies exact 201-ID coverage, regression assertions and unchanged paragraph positions. `tests/lesson-step-flow.mjs` checks generated ordering and rendered React/JSDOM navigation, including visible output preparation, optional detail state and old-resume rejection. This is not a human browser walkthrough of 201 lessons or an assertion that every learner will find every sentence sufficient. Important Build skill support was reviewed; this is not a new execution of every external server, Swift compiler, browser layout or media/network project.

Fresh actual-browser visual verification of this patch is blocked by the managed preview's offline bootstrap and the separate authenticated production session. Study button/focus/wrap fixes have source and component-test evidence, not fresh browser evidence. Existing vendor license files are retained; optional inspiration/provenance references were removed from app/catalog at the user's request.

### Known legacy test mismatch
`tests/plain-language.mjs` still expects the older 4,476-sentence all-source paired-reading dictionary and fails on newly inserted preparation. The primary `LessonStepFlow` does not render that dictionary; it renders ordinary visible teaching directly. The paired component is used by unchanged supplemental Python concept panels. We have not rewritten thousands of unused dictionary entries or weakened the old test to claim full paired coverage. Current primary-flow, semantic-support and completion tests pass independently.

## Scoped notes-panel declutter
The shared My notes panel is no longer mounted in Learn, Try it or Build. Its component, notes API, storage/schema and Markdown export implementation remain intact. No saved notes are deleted or migrated. Lesson progress remains visible.
