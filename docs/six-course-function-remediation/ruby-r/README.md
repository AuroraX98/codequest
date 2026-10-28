# Ruby/R minimal callable-teaching remediation

Staged only; no live app, GitHub or user-data changes.

## Scope and preservation
- 50 approved lesson-target fixes across38 lessons (21 Ruby targets,29 R targets).
- 38 exact `explanation` field deltas; IDs, quizzes, all other lesson fields and every existing paragraph position preserved.
- 15 remaining records are explicitly reference-only comparisons, optional exploration or configuration use. Each includes its unchanged required quiz and why that quiz does not depend on a separately taught API contract. R24 numeric(0) was promoted from deferral because its required quiz uses it.
- 28 compact new code blocks close36 example gaps;14 input/result/effect clarifications reuse already visible worked calls. No API encyclopedia expansion.

## Verification
Actual Ruby4.0.9 and R4.5.0:28/28 new snippets plus13/13 contract probes PASS. Two visible examples intentionally fail: Ruby lambda missing argument and R forced promise evaluating stop. Their exact diagnostics and preceding output are checked. Final successful cases have no unexpected warnings.

Every new block exactly matches executed source. Numerical results use fixed inputs and deliberate formatting; no current-clock, random-value or timing guesses. The library(stats) fixture uses only the already installed package, with --default-packages=NULL to test the attachment in a clean default-package context. No installs or external network/services.

`verification-summary.json` is the final receipt with hashes. `field-deltas.json` is the integration input; verify each exact before field before replacing it. `updated-lessons.json` and `original-lessons.json` are review snapshots, not instructions to overwrite unrelated content. `before-after-evidence.json` contains50 proposed semantic closures for independent review. `reference-only-deferrals.json` records the15 non-obligations without claiming those APIs are fully taught.

## Corrections caught before publication
- All new R code now shows literal backslash-n escape notation rather than a line break inside quotes. R14/R16/R53 explanations were merged to remove repeated definitions.
- Ruby force_encoding initially warned about mutating a string literal under4.0.9 -w. The final example explicitly dupes the string first; initial warning evidence is retained.
- A pre-publication inference about is.numeric accepting complex values was wrong. Actual probe is TRUE for integer/double and FALSE for complex/factor. The corrected text also separates type recognition from finiteness/domain validation. Official base4.5.0 manual corroborates: https://www.stat.ethz.ch/R-manual/R-patched/library/base/html/numeric.html . See `numeric-contract-correction.json` and preserved failed expectation in `contract-runtime/initial-results-with-wrong-numeric-expectation.json`.

## Reproduce
Run `python3 author.py`, then `python3 run-cases.py`, `python3 make-probes.py`, `python3 run-cases.py contract-probes.json contract-runtime`, and `python3 finalize.py` from this directory. Author reads the live baseline but writes only this isolated staging folder; do not regenerate after independent review unless intentionally updating receipt hashes.
