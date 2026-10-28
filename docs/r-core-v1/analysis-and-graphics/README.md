# R core: analysis and graphics (47–68)

22 complete micro-lessons with visible prerequisite bridges, worked local R examples, changed-case understanding checks and causal feedback, concise optional practice, exact headings, term anchors and support mappings. All datasets are tiny synthetic examples, not private data.

## Runtime and artifact boundary
Actual verification is owned by the shared tools worker using approved R 4.5.0 and Rscript --vanilla, with installed base packages only. No CRAN installation, recommended-package dependency, external service or GUI is required. The 44 fixtures use stable output formatting, tolerance checks or named expected diagnostics instead of brittle exact floating-point values or timing promises.

Lessons 63 and 64 produce headless PDF artifacts. Their fixture metadata requires a valid file; the shared evidence additionally checks and renders the plots. A plot file is not a browser runner, and a printed success flag is not by itself visual verification. Lesson 63's changed case deliberately changes a units label without converting numbers to demonstrate a misleading label; it is not an endorsed conversion. Lesson 64 checks changed bin counts and explains unequal-bin density displays.

## Scientific interpretation limits
- Association alone does not establish causation.
- Mean confidence intervals differ from individual prediction intervals.
- Confidence coverage is a repeated-sampling property under assumptions, not a probability assigned to the fixed parameter after observing an interval.
- A p-value is not the probability the null is true, a measure of practical importance or a causal conclusion.
- Successful fitting, a zero residual sum and tiny synthetic examples do not establish real-world model validity.
- Fixed-offset dates, seeded sampling, profiling measurements and session metadata each have explicit limits.
- RDS input is trusted; language evaluation is not a sandbox for untrusted code.

## Artifacts
lessons.json, support-map.json, headings.json, terminology.json and sources.json provide the teaching and mappings. execution-cases.json and companions/ provide all worked and changed source fixtures. structure-validation.json records 22/22 exact structural checks. Independent semantic and current-source runtime reconciliation receipts are separate from those structural checks. Shared actual interpreter and plot logs live in ../compiler-evidence/.

Regenerate with python author.py; check with python validate-structure.py. Source is staged only: no live app or GitHub changes.

## Final verification
- Structural checks: 22/22 passed.
- Independent semantic review: all 22 lessons and 44 fixtures passed, including uncertainty wording and first-use notation.
- Current-source runtime reconciliation: 44/44 matched actual analysis-final receipts; successful fixtures had empty stderr.
- Shared plot-review/visual-review.json: all four generated PDFs passed rendering and visual inspection (one page each), with legible axes and correct synthetic points/bin counts. The intentional units-label changed case is explicitly documented.
