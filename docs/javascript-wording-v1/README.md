# JavaScript course wording review

All 69 lessons were reviewed by the host, one at a time in the recommended route, after the completed Python release (version 79). No Team Effort or delegated agents were used. Each lesson has an individual before/after receipt and reviewed navigation headings.

The primary reading uses concise, plain wording, one short thought at a time, an authored example, and a code visual with one selected part explained. Inline mentions no longer create extra automatic examples in JavaScript lessons. Output captions stay with their result. Necessary terms are explained in context and through the existing optional glossary.

## Corrections

- Replaced vague practice directions with concrete actions, exact expected results, and clear completion criteria.
- Made the prototype and private-field examples independent of previous screens; combined the JSON guard definition and its calls.
- Corrected the regular-expression boundary explanation: JavaScript `$` does not accept a final newline without the multiline flag. Verified with native Node and [MDN's input-boundary reference](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Regular_expressions/Input_boundary_assertion).
- Repaired the loading-card checks to require actual loading, success, failure, and recovery behavior.
- Repaired the BFS visit-count checks so invented or missing counts cannot pass.
- Repaired the delegated-click check so an exception from a non-button click cannot count as success. The incomplete starter fails and the corrected solution passes in the actual browser runner.
- Reviewed 39 project notices and removed 37 false local-project completion requirements. Actual local module instructions remain. Technical evidence is kept here instead of appearing as learner instructions.
- Added concrete JavaScript code labels for control flow, classes, error handling, async work, imports, and comparisons. Property explanations now allow for getters.

## Verification

- `python tests/javascript-wording-course.py`: all 69 receipts, headings, route positions and protected fields verified. All 1,152 other lesson records and units unchanged. Three explicitly documented exercise-check repairs; starter and solution code preserved.
- `node tests/javascript-wording-runtime.mjs`: 115 displayed JavaScript blocks executed, 68 solutions passed all 227 checks, and incomplete starters did not pass every check. Known incorrect loader/BFS implementations were rejected. Actual downloaded CommonJS files, live ESM bindings and forbidden importer assignment, plus Node test pass/fail cases were executed separately.
- Native test setup: install the supplied Lodash range in `.codequest-local/js-wording-native` with `npm install --prefix .codequest-local/js-wording-native lodash@^4.17.21 --ignore-scripts --no-audit --no-fund` before the runtime test. This isolated dependency is not part of the app.
- TypeScript check passed. Code anatomy (23 checks), reading flow (11), glossary (10), course switching, table of contents, and the complete Python wording gate passed.
- Real in-app browser review at 360×640 (9:16) and 402×874: no document-level horizontal overflow in the sampled lesson views; TOC selection, Next/Back, line/part selection, quiz feedback and project runner checked. Exactly one code-part explanation was displayed. Physical iPhone hardware was not tested.

The general runtime harness uses Node plus JSDOM for DOM examples, not a real-browser execution claim for every lesson. Network examples use local data; no external service or cross-device persistence was tested. Existing historical frozen expansion gates remain unchanged and are not used as wording-release gates.
