# R Core v1 — frozen integration handoff

Preserve all 844 current units/lessons and six R starters. Append 62 from `all-sixty-two.json`, taking R to 68 and the app to 906. Add 62 independently scoped R terms, taking the total to 760; there are no existing-term merges in this batch. Apply curated headings at unchanged paragraph indices and preserve existing progress.

Each lesson has visible essential teaching, a changed-case understanding check with causal explanation, complete local R source and a compact optional transfer. All remain concept mode with empty browser-runner fields. Reading or quiz completion does not certify execution or mastery. Both quote styles represent character strings here, not C character literals.

## Version and dependency honesty

Actual tested runtime is **R 4.5.0 (2025-04-11)** from the approved, verified Debian13 r-base-core4.5.0-3 package extracted to `/workspace/shared/tooling/r`. It is not described as the latest stable release. Current official release manuals describe 4.6.1; official function-reference mirrors may describe development versions. Installed4.5.0 help and actual fixtures constrain the behavior taught. Fourteen base packages are available; that count is not part of the runtime version.

Only installed base packages are used. No CRAN, tidyverse, ggplot2, testthat, recommended-package or package-install claim is made. The command is Rscript --vanilla with a command-local writable font cache for headless graphics. No GUI or browser R runner is involved.

## Verification

All136 authored parse/run cases across68 lessons passed:131 successes with clean stderr and5 intended runtime failures with specific diagnostics. Every worked source matches the tested source. Seven extra boundary cases include two explicitly asserted warning cases (recycling/coercion), not masked warnings. A saved-source edit/rerun passed. Four final PDFs were actually generated, inspected with pdfinfo, rendered and visually reviewed; review receipts distinguish deliberate changed-unit labels from correct units and verify density-bin labeling. These are local example artifacts, not an added in-app plot renderer.

All62 new lessons have independent terminal semantic reviews. `compiler-evidence` holds logs, manifests, source-match, diagnostic and plot-review evidence. Actual124 new fixture objects exactly match the executed manifest; the other12 cases cover six preserved starters and transfers.

## Statistical and scope limits

This is a bounded programming/base-analysis core, not every statistical method or R API. Confidence intervals, tests, predictions and model summaries are conditional on stated sampling/model assumptions. A p-value is not the probability that a null is true; a confidence interval is not an interval containing95% of future observations. Association does not identify causality. Residual checks cannot certify independence or eliminate confounding. Prediction outside a supported domain is not validated by a successful function call.

No clinical/financial decision advice, production statistical certification, distributed computing, external services, GUI workflows, native extensions or exhaustive metaprogramming is provided. No arbitrary text evaluation is presented as safe input parsing. Finishing this R course does not complete the earlier eleven tracks: their documented core-scope audits remain pending sequential work. GitHub synchronization stays paused.
