# Ten language foundation paths — 303-lesson release

The app now contains 303 lessons in21 courses. The ten additions—C#, C++, Java, C, Kotlin, Go, Rust, PHP, Ruby and R—have six beginner lessons each. These are finite foundations, not complete beginner-to-advanced language courses. All60 use visible source examples plus authored understanding checks and saved reading marks. No browser compiler, simulated code success or new runtime was introduced. Course cards say concept lessons rather than falsely claiming runnable projects.

All243 previous lesson and unit objects are canonically unchanged. All150 existing terminology definitions/aliases/examples remain unchanged, with nondestructive real Study links appended where reviewed. General terms remain visible in every language filter. The61 new entries bring Terminology to211;184 Study links resolve to real teaching paragraphs. List and Tiles use the same data/search/language/category state and retain account-local lookup state. Every new language has actual scoped entries.

Current-unit Table of Contents now covers all303 lessons. The60 new maps contain174 semantic anchors with code/example paragraphs grouped under the preceding concept. Existing original116 maps and127 later maps are retained. No reading or completion is granted by navigation.

## Verification

- TypeScript typecheck and production build passed.
- Offline pack `880b5f1f8f65b77fdd4e`:33 artifacts plus transport hashes verified.
- New-language foundations suite: all60 lesson contracts, six lessons per track,21 actual tracks, no empty new course, prior243 object hashes,150 prior definitions, route roundtrip and legacy Build redirect, canonical reading completion, all60 code examples keep language labels rather than being treated as output, no generated JavaScript exercises.
- Concept-completion server suite: all60 lessons with actual canonical read keys, wrong quiz/missing reading rejected, successful completion idempotent, no fabricated code `last_run`; persisted preferences for all10 new tracks, unknown track rejected; account/origin/concurrency guards and offline client rules retained.
- Terminology React/JSDOM suite:211 unique entries/184 valid links, all10 language filters, List/Tile equivalence, account-isolated persistence and actual Study callbacks.
- Reading API:2,084 canonical sections across303 lessons,42 invalid/stale/unauthorized cases rejected, real SQLite migrations/account isolation/concurrent unmark handling.
- Pure lesson completion:303 lessons/2,084 primary sections; no attempt credit or fake reading marks.
- Microflow:2,085 authored sections,6,894 short thoughts,570 examples,6 reviewed generated understanding exercises; source preserved, no duplicate optional text, existing local resume/Back/escaping behavior.
- TOC data/component, AI/stdlib preservation, navigation, guided projects and storage, Buddy specificity,10 offline client flows and14 account-scope cases passed.
- Lesson contents:15 checks over2,085 sections and116 authored visual guides passed.

## Limits

C/C++ staging examples were compiled with GCC14.2; this is not proof of execution in a learner's browser or computer. The other eight new toolchains were unavailable and their examples have source/semantic review, not execution verification. See group evidence and external notes. No browser runners were added.

Fresh actual-browser geometry, native dialog focus and external compiler behavior remain unverified. React/JSDOM and source-cascade tests are not browser screenshots. The legacy full-corpus simple-reading test was previously heap-resource-limited and has not been rerun; the old supplemental plain-language dictionary mismatch remains documented. These are not relabeled as passes. Current replacement microflow/contents/TOC/reading tests pass.

Final shared-link semantic review found six precision corrections: Kotlin string, argument, assignment and iteration plus Go iteration now point at their actual explaining paragraphs; the weak Kotlin expression link was omitted. All sixty lesson objects exactly match final staged content. See merged303-link-audit.json.
