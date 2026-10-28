# Ruby64 syntax and runtime verification

Actual approved workspace Ruby4.0.9 +PRISM, with existing Minitest6.0.0. All128 authored worked/changed cases pass:114 successful executions and14 expected runtime failures with the correct semantic cause. All64 visible worked snippets exactly match executed source after only line-ending/trailing-whitespace normalization. Every main/extra Ruby source file was syntax-checked with ruby -w -c before execution.

Current consolidated receipts: summary.json,results.json,case-manifest.json,source-match.json,diagnostic-review.json,warnings.json. Earlier per-partition receipts remain intact. case43-updated verifies ordinary def does not capture the enclosing local; case55-updated corrects originally invalid CSV-string quote escaping; case60-updated tests worker exception propagation at join despite disabling duplicate background exception reporting. Aggregation checks current source hashes against these exact updated receipts.

Minitest58 actually executes ClampTest#test_upper with one assertion. Its changed case reports expected11/actual10 and one failure. Variable seed/timing text is not asserted. No generic success marker substitutes for a named-test execution.

Supplemental, not included in128:8 bounded parser/CLI/JSON cases; saved-source edit and rerun demonstration;120 repeated current concurrency executions across six variants (100 successful executions and20 expected join-propagated worker failures). Threads terminate/join; mutex protects the shared counter; capacity-one queue is drained before producer join. These bounded repeats are not a proof of general race freedom or performance.

Three current cases have pedagogical unused-local warnings under -w:11transfer leaves name unused after replacing interpolation with literal text;30worked creates the other instance to contrast singleton methods;43changed leaves outer factor unused by ordinary def before the intended NameError. Warnings are retained, not suppressed. No warning-free claim.

Only installed core/default/bundled libraries were used. No Rails, external network, YAML/FFI, new gems, servers or user-computer/system changes. Ruby execution evidence is development-workspace evidence, not an in-browser Ruby runtime or learner-mastery certification.
