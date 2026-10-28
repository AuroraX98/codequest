# Remaining bounded curriculum

Recovered on 2026-10-28 from the supported Sites repository at
f5a50db30320f259215266af76cf4e318509dc2a. Sites version 72 has a successful
deployment receipt for this exact commit. The older 201-lesson audit is historical.

Current source: 1,175 lessons; 1,029 terminology entries. Backend 14,
Developer Toolkit 15, AI 24. The previously reported Backend 43 staging directory
is absent from this checkout and was not transferred from an older cloud snapshot.

## Finite authoring targets

- Backend: 43 total (29 additions). Request method/path, path extraction, query
  multiplicity, JSON parsing, object validation, text normalization, integer
  validation, field allowlists, response projection, status/body separation,
  deterministic ordering; identity lookup, immutable addition/update/deletion,
  uniqueness, optimistic versions, bound SQL values; authentication versus
  authorization, record ownership, session expiry, origin policy versus access,
  log redaction; retry eligibility, retry budgets, timeout evidence, readiness,
  queue acknowledgement, graceful shutdown.
- Developer Toolkit: 24 total (9 additions). Working/staged diff, ignored versus
  tracked files, conflict resolution, reverting shared history, minimal
  reproduction, test doubles, dependency updates, license inventory, release
  provenance.
- AI: 32 total (8 additions). Confusion matrix, precision, recall, decision
  threshold, leakage through preprocessing, distribution shift, retrieval
  relevance, evaluation regression sets.
- Result if all targets pass: 1,221 lessons. This is a count of authored objectives,
  not a completeness percentage or exhaustive coverage of these fields.

## Quality and release gates

1. Strengthen exact-addition, mutable-input, and SQL view checks first.
2. Author each new objective with its own explanation, worked example, visible
   breakdown, changed-case understanding question, and explicit runtime limit.
3. Check existing-object preservation against the recovered Git commit, allowing
   only recorded check changes; validate every prerequisite and terminology link.
4. Execute reference solutions and counterexamples; check ordinary mutable
   before/after snapshots whenever immutability is required.
5. Run applicable functional suites, typecheck, build, and available browser QA.
6. Inspect license/provenance notices; preserve notices and avoid legal-clearance
   claims. Verify exact saved source and published version via Sites.

Learner storage, settings, sharing and GitHub sync remain outside these edits.
No database migration is needed for adding static lesson objects.

## Status

- Source recovery and exact live-version reconciliation: complete.
- Check fixes and all 46 bounded additions: authored and validated.
- Final typecheck, production build, applicable functional checks and 74 browser
  runner cases: pass. See release-verification.md for evidence and limits.
- Full local-app browser QA: blocked by Windows Workers runtime access violation;
  isolated lesson-component QA passed. Authenticated production UI is unverified.
- Supported private publication: blocked by automatic approval review before the
  source-sync/package process started. See publication-blocker.md. No new live release.
