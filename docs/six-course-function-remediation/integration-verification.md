# Six-course function explanation remediation

Applied after private source e5c06390831abd42ddc66fe9cca303a8a1688e7c.

- Ruby/R: 38 exact explanation-field replacements, affecting 40 paragraphs across38 lessons;50 taught-target repairs.28 new executable snippets and13 contract probes passed in the approved runtime evidence. The R `is.numeric` contract excludes complex values and factors.
- Kotlin/Go/Rust/PHP:65 exact paragraph replacements across53 lessons;67 repairs plus15 explicitly deferred references.25 new snippets and106 affected original cases passed, with source hashes reconciled and no unexpected successful stderr.
- Combined:105 changed paragraphs across91 disjoint lessons.928 lessons,782 terminology records and all catalog units remain unchanged in count. All non-explanation fields, IDs, quiz/check objects, paragraph counts/positions and stored-progress identifiers are exactly preserved.
- Exact proposed lesson equality and292 visible support excerpts checked. Existing TOC paragraph anchors remain valid; all code-fence anatomy and all-course Projects derived examples checked. Projects now exposes757 actual authored local examples; additional snippets retain conservative fragment/run-locally guidance and never imply browser execution.
- Historical preservation tests reconstruct only the exact approved before values; a separate current-content test asserts every approved after value and all untouched fields.
- App tests cover routing, scoped drafts, copy/download, course switching, reading/quiz/completion authorization and runtime guards. Runtime receipts are actual compiler/interpreter executions, not browser UI verification. No new browser geometry verification is claimed.

No GitHub synchronization. No new courses, lessons, completion credit, or runtime capability was added.

## Shared exercise code layout correction
The only unfenced multiline authored quiz was Python Basics. An exact legacy-prompt adapter in `lessonBlocks` now returns its untouched source as a code block and its question as prose. No quiz content, answer, statement or indentation was changed. Existing fenced snippets and generated `LessonStepFlow` practice code remain preformatted. Shared code blocks use1.7 line-height and horizontal scrolling within the available width. The new exercise-layout test audits all928 authored questions, verifies exact DOM newlines/indentation/tabs and long-line preservation across14 languages, and guards the CSS overflow contract. Browser geometry remains unverified.

### Authoring contract for all current and future courses
Use explicit fenced code blocks with the real language in quiz/question text. Keep indentation and actual line breaks in source, not semicolon substitutes or blank-line padding. Generated exercises must supply code separately (as `step.code`) and render it in `pre > code`; prose remains separate. Both existing exercise renderer paths use1.7 line-height. New ambiguous unfenced multiline quiz text must fail the corpus guard and be explicitly structured rather than guessed from syntax. Run `tests/exercise-code-layout.mjs` after authoring or renderer changes.
