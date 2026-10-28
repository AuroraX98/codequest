# PHP core: library and boundaries (47–68)

22 authored micro-lessons, each with visible prerequisite teaching, a complete worked PHP example, a changed-case understanding check with causal feedback, concise optional local practice, a primary PHP manual reference, and exact topic/term/support mappings. The browser lesson is concept-only: it does not pretend to execute PHP.

## Evidence
- structure-validation.json: 22/22 lessons and 44 companion fixtures pass structural and exact visible-code checks.
- execution-reconciliation.json: all 44 current fixture sources match actual aggregate CLI execution receipts, with expected output/diagnostic checks revalidated. This is read-only receipt reconciliation, not duplicate execution.
- ../compiler-evidence/results.json: actual PHP 8.5.12 expanded CLI execution, including corrected session fixtures.
- independent-semantic-review.json: separate reviewer assessment of explanations, checks, boundaries and mappings.

The approved workspace-only PHP build supplies mbstring, filter, session, PDO and pdo_sqlite. SQLite examples use a real in-memory database; they neither fake results nor connect to an external service. No application or GitHub publication is performed from this partition.

## Explicit limits
HTTP examples construct response data in CLI; no server headers, browser cookies or browser security deployment were verified. The session example verifies disposable local file persistence with cookies disabled. Cookie configuration is separate visible web-integration guidance, not executed in that CLI fixture. Production HTTPS, session rotation, CSRF, authorization and database-driver integration need their own tests.

Password/random examples verify properties without publishing generated credentials or relying on random output. Fibers demonstrate cooperative suspension only, not an event loop or automatic nonblocking I/O. Untrusted unserialize is not executed. The one intended failing fixture is a specific explicit test assertion, not a successful application run.

Regenerate with python author.py; check structure with python validate-structure.py. Runtime ownership remains with the shared tools worker; the exact runner and environment are recorded in aggregate evidence.
