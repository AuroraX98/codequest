# Go 65-lesson compiler verification

Official workspace Go 1.27.3, linux/amd64. 130/130 authored worked/changed cases passed across all 65 lessons. Outcomes: 121 success, four intended compiler rejections, one intended go vet rejection, four intended test failures. Lesson44 additionally verifies a passing test and a deliberate failing test after its successful main program.

`summary.json`, `results.json`, `case-manifest.json`, and `source-match.json` are the consolidated current receipts. All 65 worked snippets match visible lesson code after only line-ending/trailing-whitespace normalization. `diagnostic-review.json` records actual intended rejection causes. `test-marker-revalidation.json` verifies named test, seed and benchmark markers against saved successful output; generic PASS alone is not relied upon.

The original per-run receipts remain intact. `type40-updated` replaces the old string-comparison transfer with actual slice/comparable rejection. `case62-updated` replaces both HTTP-handler fixtures after the Allow header was added. `aggregate.py` checks current partition fixture source hashes and revalidates current test markers before consolidation.

Supplemental evidence (not added to the 130 authored count): three safe boundary cases (zero numerator, empty scanner input, malformed JSON); six real race-detector executions of lessons59–61 worked and changed examples; and a stale-executable demonstration (edit source, old executable still prints Ready, rebuild prints Changed). Race runs emitted no race diagnostics. This bounded check is not proof that arbitrary future code has no races.

The runner uses GOPROXY=off, GOSUMDB=off, GOTOOLCHAIN=local, GOWORK=off, GOENV=off, isolated modules and workspace caches. GOFLAGS=-buildvcs=false avoids attempting to stamp the unrelated surrounding repository; the initial pre-fix failure receipt is retained under original/vcs-stamping-initial.json. No system defaults or Git configuration were changed.

HTTP examples use httptest recorders or a fake RoundTripper, never external networking. Fuzz examples execute their seed corpus, not an ongoing fuzz campaign. Benchmark timings are intentionally not asserted and establish no performance claim. This verifies development-workspace examples, not an in-browser Go runtime or learner mastery.
