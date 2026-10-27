# Single-idea learning

CodeQuest uses a centered, reading-first window inspired by the user's reference diagram and the simplicity of short coding lessons. The dark navy/purple palette is original CodeQuest styling, not a copy of another product.

## Presentation

- Explanations are divided into short, source-preserving thoughts rather than one scrolling lesson.
- Next moves through explanation, code anatomy and a small code-part practice check. Back returns to the previous screen.
- Anatomy uses a light rounded code bar, distinct syntax colors, connecting stems and plain labels. A line selector and small ordered groups keep long examples manageable.
- The full authored section remains available under Tell me more. Extra conceptual illustrations and experiments remain available, but are no longer opened by default.
- Lessons, projects, progress, notes, Markdown export and help remain available. The coding buddy starts hidden unless a learner already explicitly saved a visible-pane preference.

## Data safety

No lesson IDs, curriculum JSON, database schema, canonical reading keys, progress logic, account boundaries, note storage or export formats changed. All 115 lessons across 10 tracks, including 25 Python lessons, remain. Python Basics still uses its six canonical concept reading records; the supplementary written sections do not add duplicate completion points. Local practice checks do not award official progress or XP. Reading is still marked explicitly by the learner.

## Interpretation limits

The code diagrams explain syntax roles, not a complete runtime or type analysis. Function calls are distinguished from declarations and ordinary names using syntax context where available. Swift, shell and configuration examples use conservative language-specific lexical labels. Unknown source fragments are left as Code/Symbol rather than assigned an invented meaning. Original code is retained unchanged and can be copied from the full-source view. Long displayed fragments may be shortened in the diagram, with exact text still available.

## Verification

Automated checks cover source preservation, every authored lesson/section, code anatomy across the current corpus, navigation and repeated controls, explicit reading saves, account separation, notes and Markdown export, completion rules, and offline storage. TypeScript and the production/offline builds are run before publication.

This environment could not perform a live visual desktop/mobile preview: the cloud browser could not reach the isolated local preview, and the supported outside-sandbox launch failed before application execution. DOM interaction and authored responsive-CSS tests are not a substitute for measured browser layout. No browser-layout pass is claimed.

## Context words and paired explanations (v27)

- Curated, local glossary entries appear as dotted-underlined native buttons in lesson text, quizzes, hints, and project instructions. A single definition includes a simple meaning and example without navigating away. `Words in this step` stays closed until requested. Close, repeated activation, Escape, outside pointer, and step/lesson changes dismiss the explanation. There are no new APIs, runtime AI requests, storage writes, or progress events.
- The glossary has 124 curated entries. 120 match actual authored prose or instructions, spanning all 115 lessons and 785 of 818 written sections. This is a curated vocabulary helper, not a promise that every unfamiliar word is covered. Code and URL text are never rewritten or linked. Runtime-specific meanings distinguish an SQL index from a collection position and a CSS class from an object class.
- Technical anatomy wording is retained. A divider and reviewed plain counterpart appear directly below every currently labeled anatomy part. The reported `print("Hello")` case now explains what print shows, what its parentheses do, and why the outer quotes are not shown. Both layers are visible by default and can be collapsed together.
- The initial v27 release paired 48 written Python Basics thoughts and all six beginner concept microflows. The complete editorial follow-through is recorded below.
- Code-part exercise prompts use short one-action wording. The review also simplified 38 Python/SQL project instruction sets and 37 quiz questions. All IDs, full explanation/source code, solutions, quiz choices/answers, checks, catalog, progress modules and note formats are unchanged. Only the stated prompt/instruction wording changed in curriculum data.
- Verification adds glossary matching/context, open/close/repeated-use, Escape/focus/outside-pointer, navigation reset, exact source preservation, zero writes/network, technical/plain pairing, and whole-corpus coverage checks. Real browser keyboard activation, screen-reader output, and measured authenticated desktop/mobile layout remain unverified in this environment.

Editorial references used for terminology checks: [Python glossary](https://docs.python.org/3/glossary.html), [MDN glossary](https://developer.mozilla.org/en-US/docs/Glossary), and [Google machine-learning glossary](https://developers.google.com/machine-learning/glossary). Definitions and examples here are original short learning text, not copied entries.


## Full source-matched reading counterparts (v28)

- Every current main reading thought has an authored plain counterpart: 4,476 of 4,476 across all 115 lessons and 10 tracks, including all 25 Python lessons. No technical source sentence is replaced. Each one-idea screen shows its original sentence, a divider, and the corresponding simple explanation.
- Another 86 pairs cover the six Python concept rooms, including short explanations, reasons, analogies, analogy limits, and deeper-exploration prose. Optional concept reference sections now use the same paired presentation and contextual glossary. Extras remain disclosed, not forced into the primary microstep.
- The 4,562 entries are exact-source/runtime keyed. Missing future content stays unpaired rather than receiving generic or repeated filler. Automated coverage checks require every present source thought and concept paragraph to resolve, verify exact source membership, check key consistency, and verify technical/plain visibility. Independent semantic sampling reviewed tricky SQL NULL/joins, Python mutability/cancellation, Swift actor reentrancy, TypeScript runtime guards, React stale-result protection, and security/release/restore caveats; this is not a claim of exhaustive independent human review of every word.
- Existing syntax anatomy pairing, glossary, curriculum IDs, code examples, answer keys, progress, notes, Markdown export, and private access are retained. The complete source corpus remains unchanged from v27. No runtime AI or new API is involved.
- Authenticated desktop/mobile visual layout, screen-reader speech, and native-browser keyboard activation remain unverified for the environment reasons above. DOM interaction, source/curriculum invariants, responsive CSS checks, full type check, production/offline build, and relevant regressions are run before publication.


## Exercise wording follow-through (v29)

- The remaining 77 non-Python/SQL lessons were reviewed against their solutions, checks, and downloadable file names, complementing the v27 review of 38 Python/SQL lessons. This release improves 66 additional project instruction lists and six quiz questions across 68 lessons. Unchanged questions/instructions were also inspected. Dense requirements are split into concrete actions, with identifiers, expected values, limits, and safety/recovery cautions retained.
- The score-testing project now explicitly edits `score.mjs`, then runs `test.mjs`; negative integers remain valid inputs before clamping. The release-health project uses its actual `STORAGE_READY` environment setting. Boundary testing retains both included limits and just-outside values. All code, answers, solution files, checks, source explanations, and canonical progress/notes behavior remain unchanged.
- A glossary definition opened in optional reference material now closes the previous scope’s definition too, including click events produced without a pointer. The primary reader and optional references do not accumulate open vocabulary cards. Added DOM regression covers cross-scope replacement, repeat activation, and no side effects.
- A few plain counterparts and glossary definitions clarify finite numbers and integers without hiding technical terms. Exact-source coverage remains 4,476 main thoughts plus 86 Python concept thoughts. After the instruction rewrites, the same conservative glossary scan matches 119 of 124 curated entries in main reading prose and project steps; coverage remains all 115 lessons and 785 of 818 written sections. This count excludes matches in other surfaces such as quiz feedback.

## Understanding-check revision (2026-10-26)

The current reader no longer generates token-name recognition questions. See
[the whole-app assessment audit](understanding-check-audit.md) for current coverage,
what changed, and the intentional limit on automatically generated checks.
Earlier numbered sections above describe historical releases, not the current UI.
