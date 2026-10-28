# Python 63–68: protocols and tools

Six runnable Python projects, not concept-only placeholders: generator resumption, iterator protocol, custom exceptions with explicit causes, text replacement/append, argparse and unittest execution/discovery.

Each lesson has visible prerequisites and purpose/input/result-or-effect descriptions, a complete worked call, a changed-case quiz with causal feedback, real starter/solution/check expressions, compact optional practice, headings, anchored terms and exact support. function-evidence.json records 30 callable targets plus one native discovery command, with precise paragraph and call anchors.

## Execution boundaries
Native target: Python 3.12.14. Browser target: Pyodide 0.27.7 / Python 3.12.7. Shared tools-worker evidence verifies both; this author does not claim duplicate execution.

- File writes affect disposable working files or the browser's isolated virtual filesystem, not arbitrary device files or persistent downloads.
- Browser argparse receives an explicit token list. Native supplements run a real script with argv.
- Browser unittest runs a fresh suite loaded from a supplied TestCase subclass. Native supplements separately discover trusted files, covering passing, failing and zero-test cases.
- Actual native no-tests discovery reports NO TESTS RAN and exit status 5. An empty in-memory suite can still have wasSuccessful() True. The lesson explicitly distinguishes command status from result-object semantics and always exposes the count.
- No external network, packages, credentials or host environment installation is implied.

Artifacts: lessons.json, support-map.json, headings.json, terminology.json, function-evidence.json, execution-cases.json (12), native-supplements.json (5), companions/, structure-validation.json and independent review/runtime receipts.
Regenerate with python author.py; run structural checks with python validate-structure.py. No existing Python object, live app or GitHub repository is edited.

Final verification: 6/6 structural and independent semantic reviews passed. Current sources reconcile with 41 actual runtime outcomes: six solutions and twelve ordinary fixtures in both runtimes, plus five native supplements. Function/tool evidence has 31 semantically reviewed mappings. Raw argparse diagnostics remain visible; the changed invalid-value fixture verifies diagnostic text plus the caught-exit output rather than hiding stderr.
