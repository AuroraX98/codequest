# Python71 dual-runtime verification

## Terminal result
**364/364 case/runtime validations PASS**:185 native cases and179 actual Pyodide cases. All71 project solutions and223 official behavioral assertions pass in each runtime. All120 fenced visible Python blocks have exact source anchors in executed code or supplied companion files. Existing49 corrected lessons plus22 additions; stable IDs preserved. Input's worked prompt sequence is native-only and explicitly simulated in app, not falsely presented as browser stdin.

Native Python3.12.14; actual vendored Pyodide0.27.7/Python3.12.7; Node24.22.1 executing exact extracted production Python worker after async fix4aa63693. Browser-worker loading adapted only to identical local vendor bytes; network fetch disabled. This is actual WASM/worker execution, not a full browser UI test or all-browser certification.

## Meaningful cases
- All71 official project check sets, including positional-only rejection, preservation/new objects, identity, properties, guarded import, subclass factory, encoding, tolerances, iterators, exception causes, file truncation/append, argparse, and unittest suites.
- Existing49 worked sequences preserve intentional paragraph dependencies. New explicit worked/changed cases cover each actual visible block, with module companions separated rather than blindly flattening file boundaries.
- Intended failures include wrong positional-only call, recursive overriding method, negative property construction, renamed missing module, zero division/range step, invalid native CLI value, failed native discovered test and zero discovered tests.
- Native CLI valid argv and rejected value run in actual subprocesses. Unittest discover imports only authored isolated fixtures:passing1, failing1, zero tests. No user files, network, package installation, or external environment claim.
- Browser unittest uses an actual supplied class and fresh suite; passing/failing/empty/two/repeated suites verified. Empty TestResult.wasSuccessful() isTrue, but actual native CLI discovery exits5 with NO TESTS RAN. These are distinct contracts and now explicit in teaching.
- Argparse diagnostics vary slightly across bundled patch versions (quoted invalid value native vs unquoted WASM). Browser production combines stderr/stdout; the intentionally caught invalid61 case validates its diagnostic plus exact final2/10 output suffix. Native validates exact stdout plus separate stderr. Raw outputs retained, not hidden.

## Source and runtime evidence
`all-jobs.json`:final185 authored/project/boundary jobs.
`all-native.json`, `all-wasm.json`, `all-validation.json`:final raw results and364 explicit assertions.
`execution-manifest.json`:per-case code/execution identity SHA256 and exact original receipt; final cases selected only when executable code, checks, files, argv and native-only state match.
`visible-source-match.json`:120/120 visible Python blocks exactly matched, including companions.
`final71-lessons.json` and `summary.json`:source snapshot/counts/runtime versions/hash.
`aggregate.py`, `run-native.py`, `native-worker.py`, `run-worker.cjs`, `validate-results.py`:reproducible harness.

Initial execution expectations that were corrected remain in separate original logs: native argparse quote needle; native empty-discovery exit5; browser stderr/output merge. Final validation checks corrected expectations without pretending earlier expectations passed.

## Lifecycle and limits
`lifecycle-test.log`:actual runProject under controlled clock verifies60s timeout, abort/stop, stale-frame rejection and cleanup. Worker-contract mock tests separately verify sequential async checks, errors/capability guidance, companion basename guard and cleanup.
`termination-result.json`:actual WASM worker running unbounded Python terminated by parent after4s, no result message; Node worker_threads evidence, not browser UI evidence. Fresh workers for each WASMcase prevent state/import/file leakage.
Existing input React/JSDOM test passed in prior exact unchanged component audit. Full native/browser runtime parity does not certify native installation, host file persistence, shell safety, external APIs, or every JSPI-incapable browser. Async unsupported-capability guidance was verified separately by deliberately removing JSPI APIs in isolated harness.

No live app edits by this reviewer. Main integrator owns release. Foundations49–55/69–70 semantic review PASS after preservation/rejection checks, concrete exponentiation call and list-specific shallow-copy precision.

Final refresh includes all six approved added local-call examples (dict.get, range, field factory, contextmanager, list.sort, wraps) and all four changed full worked sequences. These passed in both runtimes; final source snapshot is authoritative.
