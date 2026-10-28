# C++ Core v1 — lessons 25–45

21 staged lessons on classes, lifetimes, ownership, templates, callables, iterators, algorithms and views. No live app edits or publication. Existing lessons untouched.

## Evidence

- `compiler-validation.json` / `compiler-run.log`: actual GCC 14.2.0, `-std=c++23 -Wall -Wextra -Wpedantic -Werror -pthread`, isolated temporary working directories. **42/42 cases passed**: 21 worked examples, 17 successful changed examples, four expected compile failures.
- Negative diagnostics reviewed for the intended reasons: 31 deleted unique_ptr copy; 35 conflicting template type deduction; 36 narrowing double-to-int list initialization; 37 unsatisfied integral constraint. No failed-compilation binary executed.
- `validate.py`: checks 21 IDs and prerequisite chain, concept-only schemas, choices/answer range, exact visible supporting paragraphs, terminology anchors, headings and visible optional transfer tasks. Checks companion equality and negative diagnostic causes.
- `source-hashes.json`: exact fixture-code SHA-256s. `authored-records.json` preserves small authoring records; `author.py` generates delivery files with the shared helper.

## Pedagogical boundaries

Each quiz tests a changed program or call, rather than matching a definition label. Essential information is visible before the check. Local transfer tasks are optional and visibly separate. The app is a conceptual reader, not an in-browser C++ runner; successful reading is not proof of coding mastery.

We do not execute stale iterators, nonvirtual-base deletion, invalid sort comparators, dangling captures/views, or signed overflow. Those are explained as prohibited cases; changed fixtures stay defined or intentionally fail compilation. RAII uses a lifecycle trace, explicitly not a fabricated real resource. Moved-from vector values are not assumed empty; the source is reset before reading. Smart-pointer ownership guarantees are stated separately.

## Source verification

Read official Microsoft documentation for constructors, smart pointers, virtual dispatch, templates, lambdas, function wrappers, iterator ranges, algorithms, numeric accumulation, vector erasure and range views. Core Guidelines reviewed for invariants, RAII, rule of zero, copy/move design and virtual destruction. C++23 n4950 draft `source/concepts.tex` verified for integral constraints. A nonexistent guessed Microsoft concepts URL was removed before handoff and replaced by that verified draft URL.

Every unit/support entry carries a primary source link. Current GCC support pages are context only: actual local GCC 14.2 fixture results, not current mainline support tables, establish implementation evidence. No preview features or claim that GCC implements every C++23 facility.

## Independent review

Independent review passed with all findings closed; `independent-review.json` records the final lesson hash. Corrections distinguish abstract-base construction from concrete slicing, allow implicit move on parameter return, and teach += explicitly. Additional visible scaffolding explains if-declared smart pointers and empty lambda capture. The reviewer independently compiled a move-only template probe and inspected the complete 42-case compiler receipt. No browser/UI geometry claim from this author.
