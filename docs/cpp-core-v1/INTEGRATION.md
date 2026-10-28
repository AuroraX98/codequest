# C++ Core v1 — frozen bounded course expansion

Add `all-sixty-three.json`: **cpp-07..69**, preserving cpp-01..06 and all **360** current lessons. Expected total **423 lessons**, **69 C++ lessons**. No C# or unrelated lesson rewrites. C# deployed before C++ authoring, as requested.

## Version and scope
C++23 is the selected stable baseline, tested with installed **GCC14.2.0** and its library, not an assertion that this compiler implements every C++23 feature. No C++26 preview features or Microsoft-specific extensions. Primary sources: C++ working draft n4950, GCC implementation documentation, Microsoft C++/standard-library references, C++ Core Guidelines. Per-partition sources and support maps record the actual consulted pages.

The finite syllabus covers foundations, explicit value/reference/pointer lifetime distinctions, class invariants and constructors, RAII/copy/move/rule-of-zero ownership, smart pointers, virtual behavior/destruction, templates/concepts/callables, containers/iterators/algorithms/ranges, optional/variant/expected/errors, files/views, compile-time reasoning, translation units/linking, diagnostics/tests/time/randomness, safely joined concurrency, and a bounded console game-state model.

It is not every library API or advanced specialization: modules/coroutine architecture, custom allocators, advanced metaprogramming, lock-free memory-order design, graphics/Unreal, native integration, and third-party frameworks remain outside this core edition. No raw owning new/delete or deliberately executed undefined behavior is recommended.

## UI contract
Existing concept mode only. Inert `runtime: javascript` is a legacy schema value; empty editor code/checks and no simulated C++ run. The complete examples are real C++ in visible reading. Local compiler checks below do not certify a learner's own execution or mastery. Every new lesson has an explicit changed-case understanding check and a compact optional local transfer task.

`all-headings.json` uses meaningful concept titles and exact zero-based indices; no generic setup/example/transfer cards. Convert title/index to app label/paragraphIndex. **C/C++ single-quoted literals are character literals**, not Python-style strings: integrator must apply the already identified language-aware anatomy fallback correction. Essential authored explanations remain authoritative.

## Terminology
`terminology-additions.json`: **59** new entries with independent topical categories, `languages:["cpp"]`, exact teaching anchors. RAII is marked acronym. `terminology-merge-suggestions.json`: four existing generic definitions reused (short-circuit evaluation, recursion, accumulator, mutual exclusion). Expand an existing restricted language scope to include cpp while preserving prior languages; leave unrestricted/global definitions global. Preserve existing definitions/links. Expected terms **264→323**.

All63 term targets were read semantically, not merely bounds-checked. Pointer ownership points to paragraph3; strict ordering and mutex protection point to paragraph1. Complete support maps and prerequisite graph are bundled. The linear sequence introduces each preceding lesson before the next; compiler/source reviewers checked boundaries06→07,24→25,45→46.

## Actual validation
- Original six:12/12 worked/changed fixtures pass under C++23.
- Foundations18:41/41 pass, including five intended compilation rejections and input-edge cases.
- Ownership/generic21:42/42 pass, including four intended compilation rejections.
- Library/concurrency24:51/51 pass, including six intended compile/link rejections and one defined assertion abort.
- **Total base fixtures146/146:130 successful runs,15 intended compile rejections,1 intended runtime assertion failure.** All69 worked samples match source.
- Independent review of all63 new lessons passed; library reviewer independently reran51 cases.
- Extra library evidence: four safe ASan+UBSan cases passed with `detect_leaks=0`; eight joined-concurrency variants ran20 repetitions each. Initial LeakSanitizer attempt failed under ptrace; the failure log is retained. **No leak-check success claimed**, no UB test executed.

Flags: `-std=c++23 -Wall -Wextra -Wpedantic -Werror -pthread`. Each base fixture builds/runs in an isolated temporary directory; file examples cannot overwrite app data. Records are local compiler evidence, not browser visual QA. Native app build, completion persistence, course filters, content preservation, and deployment remain integrator-owned.

## Evidence paths
- `aggregate-validation.json`, `freeze-manifest.json`, `compiler-summary.json`, `cross-partition-review.json`
- Per-partition `compiler-validation.json`, `independent-review.json`, sources/support files
- `original-six/compiler-validation.json`
- `library-and-concurrency/README.md` and extra validation reports for sanitizer/concurrency details

GitHub synchronization remains paused. After this course is successfully deployed, parent owns the next-course ordering handoff; do not preemptively expand other courses.
