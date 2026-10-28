# Java Core v1 — integration contract

**Frozen for integration: all66 new lessons independently source-reviewed; all145 authored fixtures across72 lessons passed actual JDK25 compilation/execution or intended failure checks.**

- Preserve all 423 existing lesson/unit objects, especially Java01–06 and stable reading IDs.
- Add `all-sixty-six.json`: Java07–72, giving Java72 and app489.
- `all-headings.json`: curated concept anchors; convert title/index to app label/paragraphIndex. Worked code and optional local transfers remain visible but grouped, not generic Tools cards.
- `terminology-additions.json`: 56 proposed entries; `terminology-merge-suggestions.json`:10 existing shared terms. Preserve existing definitions/links/global scope; append Java only for restricted scopes. Java enum and Java switch expression deliberately stay distinct from language-specific C# definitions. Expected323+56=379 terms.
- `all-support-maps.json`: exact main-reading support for each understanding check.
- `all-execution-cases.json`:133 newly authored worked/changed fixtures; compiler owner adds original6 worked+6 transfers for145 expected cases. Actual terminal compiler receipts are available in compiler-evidence/summary.json and results.json; the separate stale-class probe also passed.
- Current units are concept mode. No Java browser runner and no fabricated checks. Local fixtures do not certify learner execution or mastery.
- Extend the language-aware single-quoted literal anatomy to Java: a Java char literal supplies one UTF-16 code unit, not a String. Do not reuse a C++ byte-size explanation.
- Module/package companion files are present in the visible lesson, not only hidden fixture files. No preview feature flags, remote packages, credentials or external services needed.

## Bounded coverage
Java25 LTS core: language/type/value foundations; Unicode/text; collections; methods and reference semantics; object design and contracts; generics; errors/resource lifetime; functional interfaces, streams, files/encoding/configuration/time/decimals; packages/modules/build dependencies; testing/diagnostics; threads/synchronization/atomics/executors/virtual threads/futures/cancellation; small resilient study-session capstone.

This is a substantial versioned core, **not every Java API** and not a guarantee of beginner-to-advanced mastery from one multiple-choice check. Optional transfers deepen practice.

Excluded: exhaustive libraries, Spring/Jakarta/Android/JavaFX, preview language/concurrency APIs, specialist scoped-value architectures, JNI/foreign-memory/VM internals, framework-specific distributed systems and tooling certifications. Further additions require actual learning gaps, not padding.

## Evidence
- Oracle Java25 API/JLS sources are recorded per unit and partition manifests.
- Independent source reviews: foundations/independent-semantic-review.json and independent-review.json; types-and-design/independent-semantic-review.json; library-and-concurrency/independent-semantic-review.json.
- Compiler evidence owner uses official user-approved local JDK25, isolated working directories, --release25, UTF8, bounded process timeouts and intended diagnostic checks. Final result145/145 PASS with Microsoft OpenJDK25.0.5.0.2.
- No browser visual QA implied by source or compiler checks. GitHub synchronization remains paused.
