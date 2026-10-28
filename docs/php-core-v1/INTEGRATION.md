# PHP Core v1 — integration handoff

Preserve all 724 existing lesson and unit objects, including PHP 01–06. Append the 62 new lessons in `all-sixty-two.json`, taking PHP to 68 and the app to 786. This is a bounded language/CLI and common-library core, not every PHP API, framework or deployment specialty.

Merge `all-headings.json` as meaningful concept anchors without changing paragraph indices. Terms use independent topical categories and PHP language scope. Apply `terminology-additions.json` and append only the links/languages in `terminology-merge-suggestions.json`; never overwrite or narrow existing definitions. Language-specific reference aliases, variadic parameters, null coalescing and explicit test checks deliberately retain distinct PHP names where prior definitions describe other languages.

All new lessons remain concept mode with empty legacy browser-runner fields. Full local PHP examples, causal changed-case checks and compact optional transfer tasks are visible. Reading/quiz completion is neither a browser PHP run nor proof of learner mastery. PHP single-quoted and double-quoted literals are strings, not the character-literal categories used by C/C++/Java/Rust.

## Runtime boundaries

Use the authorized official PHP 8.5.12 expanded CLI at `/workspace/shared/tooling/php-core/bin/php`. The original minimal binary remains intact. The expanded inventory includes the tested session/filter/ctype/tokenizer/mbstring/PDO SQLite/sqlite3 capabilities. Actual complete receipts in `compiler-evidence` determine which examples ran; extension availability alone is not a passing test.

PDO examples use an isolated in-memory SQLite database, not an external service. Session examples use isolated local file-backed storage with cookie emission disabled; they do not verify browser cookies, HTTP header delivery, TLS deployment or production session security. Response-contract examples inspect returned data without running a web server. No curl integrations, external databases, Composer registry downloads or network listeners are exercised. Security lessons isolate specific rules and do not certify a production application.

## Deliberate scope limits

No exhaustive API/library coverage, full framework course, production authentication/session deployment, external SQL dialect/transaction expertise, advanced property-hook/pipe-operator specialization or scheduler/event-loop implementation. Fibers demonstrate explicit cooperative suspension, not parallelism or a fabricated asynchronous runtime. Native PHP unserialize is not presented as safe for untrusted input. HTML escaping is context-specific, not universal sanitization. No claims beyond the actual CLI test evidence.

## Release gate

Freeze only after all three independent semantic reviews and the complete interpreter/lint fixture receipt are terminal. Include the final fixture manifest, source-match report and intended-error diagnostics, not just expected outputs. Parent/integrator owns native deployment and preservation checks; GitHub sync remains paused.
