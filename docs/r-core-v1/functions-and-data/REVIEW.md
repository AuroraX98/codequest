# R27–46: functions and data

20 staged lessons and 40 worked/changed fixtures. Runtime baseline is the actually installed R4.5.0, not a claim to the latest R release. Base plus standard methods/stats packages only. No package installation, network, production data or live-app changes.

Each lesson has visible essential teaching, a complete local example, a causal changed-case check, an optional compact transfer task, exact paragraph support, curated topic headings and a definition-linked term. Structural validation is `python validate.py`; it is not proof of learner mastery.

Important R boundaries: lazy promises and forced closure arguments; exact names after ...; environments versus list copy-on-modify; informal S3 tags versus S4 slots; exiting versus calling handlers; on.exit restoration; vapply result shape; matrix margin/coercion; grouped missingness; stable row permutations and join multiplicity; reshape occasion labels; native pipe argument placement; literal versus regex matching; Date days versus POSIXct seconds; namespace masking.

All fixture code is standard-library-only, with no file writes or external service. Three intended runtime failures exercise forcing an error expression, an invalid S4 slot and an invalid vapply result length. The tools worker owns actual R execution and diagnostic receipts; final source-hash verification will reference those results. Independent review is separate from runtime evidence.

Official R-patched manual pages linked per lesson were checked for version-compatible semantics; several served pages explicitly identify base4.5.0. Local Rscript reports4.5.0. No untested new-version features are asserted.

Final: 20/20 structure and independent review PASS. All40 current source bundles match actual Tools R4.5.0 receipts:37 successful executions and3 intended runtime errors. Parser succeeds for all40. See compiler-verification.json and ../compiler-evidence/middle/results.json; raw trailing whitespace remains in execution logs.
