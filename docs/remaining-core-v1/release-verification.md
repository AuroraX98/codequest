# Bounded continuation verification — 2026-10-28

## Authoritative starting point

The supported Sites source helper retrieved commit
`f5a50db30320f259215266af76cf4e318509dc2a`. Sites version 72 and deployment
`appgdep_6ae0af3a6f54819199f25ee695700f97` were independently confirmed successful
for that commit. No older cloud checkout was copied over it.

Baseline: 1,175 lessons, 1,029 terms; Backend 14, Developer Toolkit 15, AI 24.
The previously reported Backend43 staging artifact was unavailable in this
checkout. The 29 Backend additions here were newly authored against the recovered
baseline, not claimed to be a recovered copy of that artifact.

## Finite result

| Course | Before | Added | Now |
|---|---:|---:|---:|
| Backend | 14 | 29 | 43 |
| Developer Toolkit | 15 | 9 | 24 |
| AI | 24 | 8 | 32 |
| Entire catalog | 1,175 | 46 | 1,221 |

All 1,029 terminology entries remain unchanged. No further curriculum additions
are planned for this bounded continuation. This does not claim exhaustive topic,
framework, API, or professional-readiness coverage.

## Evidence

- `tests/remaining-core.mjs`: exact Git-baseline preservation of all 1,175 existing
  lesson objects except the five recorded check improvements; all original units
  and terms unchanged; matching IDs; resolved, acyclic prerequisites; Backend
  foundation-first order; current addition artifacts match current source.
- 43 Backend reference solutions pass in Node/SQLite. All 29 unfinished new
  starters fail. Six counterexamples fail: incorrect added content, input mutation,
  two tables substituted for required views, an incorrect new append helper, and
  a mutating new update helper.
- Actual sandboxed browser runner: 74/74 cases pass (43 reference solutions,
  29 starter rejections, two wrong-table rejections), using the app's unchanged
  runner and pinned SQL.js assets. Full results are in
  `browser-runner-results.json`.
- Concept completion server/client checks include the 17 new concept lessons:
  canonical reading/quiz gates, account isolation, idempotence, no fabricated code
  execution, and rejection of incomplete proof all pass.
- Reading API: 7,101 canonical sections across 1,221 lessons; 42 invalid/stale/
  unauthorized cases rejected; prior progress/profile data preserved in fixtures.
- Practice storage and API suites pass, including account isolation, atomic saves,
  concurrent usage updates, bounded project/version counts, and zero official XP
  writes from generated practice. Provider responses are fixtures, not live calls.
- Navigation, terminology (1,029 terms and 1,071 links), and step-flow suites pass.
  Step flow preserves 7,102 authored sections, 21,480 short thoughts and 1,877
  examples. The distinct canonical-reading and rendering-section counts are
  produced by their respective existing algorithms, not substituted for each other.
- Historical SQL52 and Swift58 release-integrity suites pass after explicitly
  reversing the declared later check deltas in their historical view. Historical
  native Swift receipts were verified as records; Swift was not recompiled here.
- TypeScript typecheck and final supported production build pass. Build reports
  large bundle warnings; no performance improvement is claimed.
- Isolated real-browser lesson component: Backend27 Next/Continue and code-part
  navigation work; visible function/parameter breakdown appears; AI26 and Toolkit16
  render one idea at a time. At a 320px viewport the constrained harness has no
  page-wide overflow; code anatomy retains its deliberate internal horizontal
  scroll. This is component evidence, not a complete app navigation audit.

## Runtime verification limit

The supported `node scripts/start-local.mjs` fails while applying local D1
migrations because Windows Workers runtime exits with structured exception
`0xc0000005` (access violation), followed by “The Workers runtime failed to start.”
No live database was targeted. Full local-app and authenticated-production UI
verification remain unverified. No authentication/security setting was weakened.
The isolated browser runner, component tests, API fixtures, build, and source
checks are the available evidence; they do not replace that missing end-to-end run.

## Provenance and notices

The new teaching, examples and exercises were authored for this continuation.
Reference URLs identify supporting APIs/concepts; they do not imply copied source
or confer a license on original content. No new app dependency was added.
All original license files and dependency inputs are preserved. The notice suite
passes for 21 notice texts and 24 notice artifacts in the offline manifest.
Existing unresolved attribution/reachability questions in
`docs/third-party-notice-scope.md` remain unresolved; no legal clearance or complete
dependency-license closure is asserted. GitHub sync and private sharing are unchanged.

## Publication

Prepared for supported Sites publication after the checks above. The owning task
must record the actual saved version, commit and terminal deployment result;
this prepublication source document does not itself certify a new live release.

## Final publication and authenticated browser receipt — 2026-10-28

This receipt supersedes the earlier authenticated-production verification gap above; the local Windows runtime limitation remains.

Version 75 is live at https://codequest-personal-learning.aurorax.chatgpt.site, source commit `108f73fc5b297017deb3aeec73ab7d6f49db407d`. Sites confirmed deployment `appgdep_6ae15b78c3cc81918c509b9a7bd98ad6` succeeded at 2026-10-28T02:18:52.468627+00:00. The release contains 1,221 lessons, including Backend 43, Developer Toolkit 24 and AI 32; terminology remains 1,029 terms. Private access and paused GitHub synchronization are unchanged.

Version 74 supplied the missing reader headings for all 46 additions, verified with 552 real reader/checkbox component renders over 276 sections. Its authenticated page subsequently exceeded the Worker CPU limit. Version 75 moved static curriculum imports inside the client boundary, reducing the measured React Flight payload from 5,006,461 bytes to 347 bytes while retaining server authentication. The serializer regression, TypeScript and production build passed. The payload reduction is measured; it does not alone establish the sole cause of the earlier CPU exhaustion.

The parent cloud task reported final authenticated version 75 browser QA:

- Serving health recovered; backend-15, developer-toolkit-16 and ai-25 each show the correct heading, “Idea 1 of 6” and a correctly named, unchecked reading checkbox.
- Backend worked-example anatomy paging from parts 1–5 to 6–8 and the line selector worked.
- Desktop layout was readable at 1165 × 747.
- No completion, exercise, settings or tutor actions were performed. Only incidental course/reading-position navigation occurred.
- Narrow layout remains untested because the supported cloud browser API has no resize capability.

This is bounded sample coverage, not a claim that every live interaction or viewport was tested. The parent informed the user that the planned curriculum expansion is complete with this qualification. Receipt appended locally only; no additional code change or publication was requested.
