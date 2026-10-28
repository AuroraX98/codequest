# Ruby Core v1 — frozen integration handoff

Preserve all 786 existing lesson/unit objects, including Ruby 01–06. Append 58 new units/lessons from `all-fifty-eight.json`, taking Ruby to 64 and the app to 844. Append 55 new terms and three compatible shared-term scope/link extensions, taking terms to 698. Preserve all existing IDs, progress, term meanings and links.

`all-headings.json` supplies meaningful concept anchors at unchanged paragraph indices. `all-support-maps.json` maps every new check to visible instruction. New lessons use concept mode: full local source and optional transfer tasks are visible, but legacy runner fields stay empty. No Ruby browser execution or learner mastery is inferred from reading or one check.

Ruby-specific integer division, string interpolation and loop-control terms remain distinct from existing definitions that prescribe other languages’ rounding, syntax or continue keyword. Thread join, cooperative suspension and bounded validation pipeline have compatible shared meanings; only append their links/languages without narrowing prior scopes.

## Actual verification

Official workspace Ruby 4.0.9 at `/workspace/shared/tooling/ruby/bin/ruby`, including available core/default/bundled libraries and Minitest 6.0.0. All 128 authored syntax/runtime cases passed across 64 lessons: 114 successes and 14 intended runtime failures. Every worked snippet matches tested source exactly. Eight additional boundary cases, saved-source edit/rerun and 120 current joined-concurrency executions passed their expected outcomes. Three pedagogical unused-local warnings are preserved; this is not a warning-free claim.

Minitest checks require actual named test/assertion markers, not merely a process launch. Timings and random seeds are not asserted. Deliberate failures include genuine contract violations, a Minitest assertion and joined worker failure. Repeated finite concurrency tests are evidence for these fixtures, not proof of universal race freedom or performance.

## Boundaries

This is a bounded language/core-library course, not all Ruby APIs or Rails. No network service, downloaded gem, YAML/Psych, Fiddle/FFI or native-extension execution is claimed. Advanced Ractor isolation, event-loop/scheduler implementation and production deployment are excluded. Fibers demonstrate cooperative suspension, not parallel scheduling. Paths and parsing are not presented as authorization or complete production security. Both single- and double-quoted literals used here are strings.

All three partitions have independent terminal semantic reviews, plus the shared interpreter receipts under `compiler-evidence`. The freeze manifest hashes authoritative artifacts. Only the main integrator writes app source and performs native publication. GitHub synchronization remains paused.
