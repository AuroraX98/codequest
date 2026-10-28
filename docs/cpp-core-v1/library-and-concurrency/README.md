# C++ Core v1: lessons 46–69

Staged only; no live app, Mint Goals source, or GitHub publication was modified.

## Integration artifacts

- `lessons.json`: 24 units + 24 concept-mode lessons, IDs cpp-46 through cpp-69.
- `support-map.json`: visible prerequisite and quiz-support evidence for each lesson.
- `headings.json`: real concept headings pointing to explanation paragraphs.
- `terminology.json`: 24 term definitions with specific lesson paragraph targets.
- `execution-cases.json` and `companions/`: all complete local fixtures, including separate headers/source files where needed.
- `sources.json`: primary reference links checked 2026-10-27. Standards proposals cover expected and jthread; vendor documentation is used only for standard-portable concepts.

The coverage is containers, optional/variant/expected, exception boundaries and guarantees, filesystem/streams, non-owning views, constants, translation units/linking, diagnostics/assertions, time/randomness, joined concurrency, and a bounded command-to-game-state model. It is a finite core sequence, not all standard-library APIs or a graphics/game-engine course.

Each lesson has visible essential teaching, a complete example, an application/changed-case check, and optional compact local transfer practice. Optional practice does not gate reading completion or certify a learner run. The app does not execute C++.

## Verification

```sh
python3 author.py
python3 validate-structure.py
python3 ../validate_cases.py .
python3 validate-extra.py
```

Compiler: `g++ (Debian 14.2.0-19) 14.2.0`.

Baseline flags: `-std=c++23 -Wall -Wextra -Wpedantic -Werror -pthread`.

`compiler-validation.json` / `compiler-run.log` record 51 cases: 44 successful runs, six expected compiler/linker rejections, and one deliberate assertion abort. No undefined-behavior example is intentionally executed. Filesystem cases run only in disposable temporary working directories. Headers and linking cases physically supply their extra files.

`extra-validation.json` / `extra-run.log` record four safe fixtures with AddressSanitizer and UndefinedBehaviorSanitizer and eight joined-concurrency fixtures repeated 20 times each. The initial sanitizer attempt failed because LeakSanitizer cannot run under this environment's ptrace mechanism; its exact diagnostic is preserved in `extra-validation-initial-lsan-blocked.json`. The successful address/undefined rerun explicitly uses `ASAN_OPTIONS=detect_leaks=0`. **Leak checking is not verified.** Sanitizers and repeated scheduling runs are not correctness proofs or exhaustive interleaving tests.

`structure-validation.json` verifies all 24 schema/prerequisite/TOC/term-anchor/visible-practice mappings and stores fixture hashes. Quiz answer positions vary (8 first, 7 second, 9 third), with choices and answer indices shuffled together reproducibly.

Independent semantic review requested four small teaching improvements: define translation unit before its first use, explain the zero-argument lambda spelling, explain default reference capture and its lifetime, and avoid an all-first-option answer key. All four are incorporated. No visual app/browser review is claimed for these staging artifacts.
