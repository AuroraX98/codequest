# React wording review

All 37 lessons were reviewed by the host, in the course's recommended order, one lesson at a time. No Team Effort tools or delegated agents were used. The whole course is released together.

## Learning changes

- Reviewed 210 sections, summaries, hints, quiz wording, project instructions, and contents headings.
- Each lesson now has exactly one complete worked example. Repeated alternative examples and standalone fragments were removed from the teaching text.
- Short reading steps introduce one idea at a time. Reviewed lessons do not generate extra examples from inline code mentions.
- Defined unfamiliar terms before using them where needed, including render, snapshot, props, state, and cleanup.
- Kept explanations precise about ordinary variables, queued state updates, copies, stable keys, effects, stale responses, and local preview limits.
- Added plain labels for React tools and built-in element props. Examples include Remember state, Read shared context, When clicked, Label this field, Waiting boundary, and Starting field value.
- Contents links use the newly reviewed headings and retain their original section targets.
- Fixed the contents layout between 1,100 and 1,439 pixels: it now sits beside the lesson instead of leaving a large blank area above it. The optional coding buddy sits below the lesson at these widths so the reading area stays usable.

## Coverage

The existing route covers JSX, components, props, children, handlers, state, snapshots, queued updates, conditions, lists and keys, fields and forms, immutable updates, derived values, render purity, shared state, reducers, context, custom hooks, refs, effects and cleanup, identity resets, Strict Mode, accessible IDs, async results and races, memoization, error boundaries, transitions, and lazy components with Suspense. No additional lesson was needed for this React fundamentals review. Framework routing, server rendering, real network backends, and React 19-only APIs are outside this browser course's React 18 runner scope.

## Validation

- 37 lesson receipts preserve the review sequence and before/after content.
- Baseline comparison preserves all lesson IDs, route order, section counts, quiz answer positions, starter code, solution code, assessment checks, and companion files.
- All 1,184 other lessons and their catalog units remain unchanged, as does shared catalog metadata.
- The production sandbox runner passed all 37 exercise solutions and all 37 rewritten examples: 74 browser runs and 106 checks. Example checks include changed values, repeated clicks, empty inputs, identity through reorder, title cleanup, effect cleanup, stale successes and failures, and lazy resolution.
- All 37 contents mappings pass. CSS and TypeScript contents regression checks also pass.
- The shared reading-flow suite passes 14 checks across 7,102 sections, including exactly one authored example in every React lesson.
- The code-anatomy suite passes 29 checks, including source preservation across all 1,916 current fenced blocks and specific React label checks.
- TypeScript compilation passes. Changed-file lint has no errors; one pre-existing unused GlossaryText import warning remains.
- Phone layouts checked at 360 by 640 (9:16) and 402 by 874 CSS pixels: no horizontal page overflow; one visible reading step; contents selection, close/Escape, backward section entry, code-line selection, and code-part paging work.
- A native keyboard check of the rewritten disclosure example verifies Enter opens it, focus moves to Read instructions, Tab reaches Contact details, and Escape closes it and restores focus to Help.
- Desktop layout verified at 1,400 pixels, with boundary checks at 1,100 and 1,099 pixels and a phone regression at 360 pixels, including the coding buddy. No horizontal document overflow or overlapping contents and lesson regions was observed.

## Boundaries

The browser exercises use pinned React 18.3.1 and Babel 7.26.9 in the current production frame. Native form submission is blocked by the preview sandbox; lessons 02 and 27 explicitly explain the synthetic checks and the need to test normal browser submission separately. The error-boundary example deliberately throws a demo error. Timing examples make no scheduling-speed promise. The lazy example resolves a local Promise, not a real network module download. No physical iPhone, VoiceOver, server rendering, or live network behavior is claimed.

Technical references: [State as a snapshot](https://react.dev/learn/state-as-a-snapshot), [Synchronizing with effects](https://react.dev/learn/synchronizing-with-effects), and [lazy](https://react.dev/reference/react/lazy).

Temporary browser harness pages are removed before packaging. Browser result receipts remain in this folder.
