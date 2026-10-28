# Kotlin / Go / Rust / PHP: bounded callable remediation

Ready for integration review. Canonical content was not edited.

- Approved scope: **67 teaching repairs + 15 explicitly deferred references**, across 53 existing lessons.
- **65 paragraph replacements** preserve paragraph counts/order and every non-explanation field, including IDs, quizzes, checks, projects, runtime and prerequisites.
- **25 new standalone visible snippets**, appended within existing paragraphs; original worked code remains byte-for-byte present.
- **131/131 actual execution outcomes pass**: 25 new snippets and 106 affected original worked/changed cases. Current fixture-source hashes reconcile, including intentionally failing diagnostic cases. Successful runs have no unexpected stderr.
- Independent source-semantic review: **PASS**, all 65 deltas, 25 snippets, 15 deferrals and 82 evidence anchors read. No outstanding findings.

## Integration artifacts

- `paragraph-deltas.json`: exact before/after text, zero-based paragraph positions and hashes. Apply only if each before paragraph still matches.
- `staged-lessons.json`: 53 proposed lesson objects; use as review material, not a replacement for the full course.
- `target-evidence.json`: exact new bridge/deferral anchors. **Deferral is not full API coverage.**
- `plan.json`, `plan.md`: accepted target-by-target classification, unchanged quizzes/tasks and test plans.
- `structure-validation.json`: 53 lessons / 65 deltas pass; non-explanation fields and paragraph counts unchanged.
- `new-snippets.json`, `snippets/`: exact runnable companions.
- `original-affected-cases.json`: 106 original fixture definitions, preserving existing source and intended outcomes.
- `runtime-reconciliation.json`, `runtime/*/results.json`: actual execution logs and current-source reconciliation.
- `independent-semantic-review.json`: separate reviewer receipt and hashes.
- `provenance.json`: approval scope and primary-source provenance.

## Actual toolchains

| Track | New | Original | Actual toolchain |
|---|---:|---:|---|
| Kotlin | 5 | 24 | Kotlin 2.4.21, JDK 25, JVM target 21; existing coroutine fixtures use bundled library 1.8.0 |
| Go | 5 | 22 | Go 1.27.3, offline local modules |
| Rust | 4 | 24 | Rust 1.99.1, edition 2024, standard library |
| PHP | 11 | 36 | PHP 8.5.12 CLI, approved workspace extensions |

HTTP examples use in-memory recorders/fake transports, not sockets. PHP session fixtures use disposable local storage with cookies disabled; they do not verify browser cookie delivery. SQL remains local SQLite in memory. No new browser, external-service, race-detector or production security claim is made. Timing is not asserted.

Revalidation: `python validate.py` and `python reconcile-runtime.py`. Original course receipts were not overwritten; all new output lives under this folder. The original audit remains historical: it is not silently relabeled as a completed all-API inventory.
