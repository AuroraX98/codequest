# C Core v1 integration

56 additive lessons C07–62 preserve all489 existing lesson/unit objects and reading IDs. Course62, app545. Concept mode remains honest: no C browser runner or fake executable completion.

## Artifacts
- all-fifty-six.json, all-headings.json, all-support-maps.json
- terminology-additions.json:49 distinct entries; terminology-merge-suggestions.json:7 append-only shared-link/scope extensions. Expected428 terms. C pass-by-value and C enum stay distinct from language-specific Java/C# wording.
- Curated TOC title/index maps convert to label/paragraphIndex. Optional local transfer remains visible, grouped under meaningful concepts rather than generic Tools cards.
- navigation-terminology-review.json records exact visible link semantics.
- Compiler evidence results/summary/source-match/diagnostic-review and stale-build-probe.json.

## Tested baseline and honest limits
C23 is a newer published standard. This version deliberately uses portable C17: installed GCC14.2 documents experimental/incomplete C23 support, and the actual C23 mode reports202000. Primary WG14N1570 documents unchanged core clauses; GCC describes C17 as defect corrections. Do not call this complete C23 coverage.

Actual GCC14.2 -std=c17 -Wall -Wextra -Wpedantic -Werror:129/129 cases across62 lessons (124 successful runs,5 intended compile/link rejections). This includes124 authored worked/transfer cases and5 justified input boundaries. All62 worked examples match tested sources. Separate stale executable probe passed compile/edit/run-old/rebuild/run-new.

C20 deliberately teaches safe snprintf truncation. Its one worked fixture narrowly demotes -Wformat-truncation from error, asserts the actual diagnostic, and verifies output. No blanket warning suppression or claim of zero warnings. No intentionally undefined-behavior program was executed. Sanitizers, when separately tested, are bounded evidence rather than proof or leak-check claims.

Optional C11 threads/atomics work in this verified host; code guards unsupported implementations. File fixtures use isolated disposable directories. No credentials, remote API packages, system configuration or GitHub changes.

## Anatomy
In C, an ordinary single-quoted character constant has type int. This differs from C++ char and Java UTF-16 char. A double-quoted C literal is a char array including a terminator. Preserve those language distinctions in token explanations.

## Bounded scope
Core numeric/flow/arrays/text/parsing/functions; pointers/bounds/lifetimes/const; structures/enums/tagged unions; allocation/reallocation/ownership/size overflow; dynamic arrays/linked nodes/callbacks/sorting; headers/linkage/macros/generic selection; files/encoding/errors/cleanup; tests/warnings/builds/CLI; threads/mutexes/atomics/volatile; bounded in-memory store capstone.

Not every library API, C23-only feature, operating-system/POSIX specialization, graphics/engine, custom allocator, lock-free algorithm, signal/ABI/FFI specialization or production security certification. Optional projects deepen practice; a quiz is not proof of advanced mastery.
