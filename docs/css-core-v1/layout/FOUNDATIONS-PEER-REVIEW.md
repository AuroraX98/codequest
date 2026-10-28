# Independent read-only foundations15 review

Reviewer: CSS layout author. Source review only, not an actual-browser verdict.

Reviewed files and SHA256:
- foundations/lessons.json: 758ef18150d22c8cfc232076409be3b73905862cfc74c81a5e618584d4bdc3b1
- foundations/execution-cases.json: feb4d1533a10c09eaee534f0517ca7bfec78dafbb2248388ed168dc15216bffe
- foundations/css-contract-evidence.json: 075ff8addf01574c47b64b580daf4a7a50cc78e986afe6ae80cd7e587e766848

## Findings
Core CSS semantics are sound; small original examples, application prompts, prerequisite context, and distinct transfer fixtures are present. nth-child/nth-of-type, where/is and calc/min/max have visible examples and distinguish CSS syntax from JavaScript. External stylesheet loading is honestly labeled local companion rather than demonstrated in this editor. Visited-state privacy is respected.

Required before claiming task coverage:
1. CSS20: requested 8px marker can pass at arbitrary dimensions; require width/height and inline-block on the pseudo-element.
2. CSS26: removing the 150px width or making a very wide box can pass current checks without wrapping. Require width and increased line height/actual multi-line geometry, with visible overflow rather than clipping.
3. CSS27: requested start alignment is not checked.
4. CSS28: requested outside markers are checked in worked fixture but not learner checks.
5. CSS21: omitting the low-specificity default entirely passes current checks. If that declaration is required, verify its fallback effect with the overriding rule removed or inspect the relevant parsed CSS rule.
6. CSS56: a.focus() establishes programmatic focus, not actual keyboard navigation. Actual Tab interaction must verify focus-visible before calling this keyboard tested.

Reliability/polish:
- CSS24 and25 checks mutate inline styles without restoring; wrap in try/finally so reruns and later assertions are isolated.
- CSS19 quiz has 'h 3' rather than h3; CSS53 has 'to12px'; CSS23 check labels lack spaces.

No files in the reviewed partition were edited. Findings delivered to author/plan lead for revision and real-browser verification. Review remains conditional on the listed coverage fixes, not a blanket pass.

## Revision re-review
Re-read revised foundations/lessons.json SHA256 cdcfb54cf6e07c26a86184d8b9a639ce9e7d66e46a6e38d1651d27407a700a77 (cases and evidence hashes unchanged). Findings1–5 are addressed by focused assertions;24/25 restore their mutation; typography polish addressed. CSS21 additionally fixes real production-frame stylesheet order by appending the probe after the authored style. Source/contract review: PASS for these revisions, pending lead’s real-browser rerun. CSS56 remains explicitly unverified for actual keyboard navigation until the lead performs a Tab-based check; programmatic focus alone is not certified as keyboard evidence.
