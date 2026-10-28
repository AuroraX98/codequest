# Rust68 compiler verification

Actual rustc1.99.1 (58cf8f9c3) and Cargo1.99.1, stable edition2024, workspace-only. All136 authored worked/changed cases passed:121 successful cases,14 intended compiler failures with the correct semantic diagnostic, and one intended unit-test assertion failure. All68 visible worked snippets exactly match executed source after only line-ending/trailing-whitespace normalization.

Consolidated receipts: summary.json,results.json,case-manifest.json,source-match.json,diagnostic-review.json. Individual original/foundations/types/library receipts are retained. case35-updated replaces the initial weaker transfer with the actual missing-trait-implementation rejection. The narrowed rust64 expected async-context diagnostic was revalidated against identical source and saved compiler output. test-marker-revalidation.json proves the actual named Cargo unit and integration tests ran.

Supplemental results, separate from the136 count: six safe parsing/boundary cases;120 successful joined concurrency repetitions (six worked/changed variants from54,55,57,20runs each); actual source-edit/old-executable/rebuild demonstration. These repeats are bounded observations, not a general race-freedom proof.

Cargo ran offline with only standard-library and authored local-path dependencies. No network packages, unstable flags or undefined behavior were executed. Lesson67 uses safe slice.get rather than executing an invalid unsafe operation. Lesson65 performs a single poll of a known ready future with a no-op waker; it is not a general async executor. Lesson64 deliberately drops its unpolled future and separately verifies await rejection in ordinary main.

Seven case outputs contain expected pedagogical warnings (unused overwritten values, unused binding after an intended rejection, unnecessary mut after removing mutation, and unconstructed enum alternatives). Full output is in warnings.json; this is not a warning-free claim. Warnings were not globally suppressed or converted into unrelated rejection tests.

The app remains a concept course, not a browser Rust runtime. Compiler evidence does not certify learner mastery. No live application files were edited by this verification task.
