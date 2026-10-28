# JavaScript 52–63: async protocols and host contracts

Stage-only partition: 12 runnable lessons, 40 project checks, 27 worked/changed/supplemental fixtures, two native Node test-runner companions, and 59 explicit callable evidence records. Existing lesson IDs and the live application are untouched by this author.

## Authored scope

Promise chains and combinators; bounded timers; symbol keys; repeatable iterators and async-iterator cleanup; DOM delegation and cancelable form events; cooperative abort signals; URL query construction; actual test assertions/discovery; and local Response status/body contracts. Every unit contains visible prerequisites, examples, changed-case assessment, a small runnable application, and optional practice. Required teaching is not hidden behind practice.

## Evidence

- `structure-validation.json`: exact headings/support/call anchors, visible-code fixture matching, and syntax validation.
- `independent-semantic-review.json`: independent review of all 12 lessons, 59 callable anchors, and fixture/support alignment.
- `provenance.json`: source roles, independent construction statement, known internal scaffold reuse, and exact final hashes.
- Runtime evidence is owned by the integrator under `../runtime-evidence/`. `execution-reconciliation.json` confirms the exact current lesson snapshot and all 27 regular fixtures: 39 frame jobs, two native Node test-runner cases, and one additional native Response check pass (42 outcomes). All 40 project checks pass. Syntax validation alone is not an execution claim.

## Verification boundaries

The frame harness uses the production frame source with Node 24 host APIs. DOM fixtures use JSDOM and synthetic events, not real browser rendering, navigation, native form constraint validation, or user-input verification. A documented test-only Response error-realm adapter preserves native parsing and reconstructs rejected error categories inside the VM; this is not an application or CSP change. Response examples construct local responses and never fetch external resources. Timers assert ordering/cleanup, not exact elapsed times. Abort examples demonstrate cooperative rejection, not forcible cancellation. Native `node --test` companions execute separately and are not presented as browser test discovery.

The lesson-52 extra fixture checks that a fulfilled `finally` callback returning 99 preserves the earlier value 8. Lesson 55 intentionally distinguishes the visible property name `title` from its value `public`.
