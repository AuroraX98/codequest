# C core integration — 2026-10-27

C62;545 total lessons across21 courses;428 terminology entries. All489 prior lesson/unit objects are preserved exactly.49 terms added and7 existing shared entries gain exact C links/scopes without changing definitions or narrowing existing scope. Course descriptions, manual Show/Hide courses and all existing navigation/draft/progress behavior are retained.

Actual compiler evidence:129/129 fixtures across62 lessons passed GCC14.2 with C17 mode, including124 successful runs and5 intended compiler rejections. All62 worked examples match source. A narrowly expected snprintf warning is documented and asserted, not concealed; separate stale-build probe passed. No browser C runner or undefined-behavior experiment is implied.

Anatomy now distinguishes ordinary C character constants (type int) from ordinary single-character C++ literals (type char) and Java char literals (one UTF-16 code unit). Exact source and existing language behavior are regression tested.

Verification boundaries: authored fixtures do not prove learner execution or mastery. C17 is a bounded core, not every API or platform specialization. Source/compiler/React-JSDOM checks are not browser geometry. Earlier full-corpus simple-reading rendering was resource-limited, not reclassified as passing. GitHub synchronization remains paused.
