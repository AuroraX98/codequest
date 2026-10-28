# Ruby core: library and concurrency (45–64)

20 complete micro-lessons with visible prerequisite bridges, worked local Ruby examples, meaningful changed-case checks and causal feedback, concise optional practice, exact topic headings, anchored terminology and support mappings. Browser reading is concept-only; it does not execute Ruby.

## Local verification
The tools worker owns actual Ruby 4.0.9 syntax and execution evidence. The 40 cases run separately in disposable working directories with installed libraries only. Minitest 6 is a separately versioned dependency: its verbose named test and assertion markers are checked rather than unstable timing/seed text. Intended failures test an incorrect assertion and a worker exception re-raised at join.

The resource examples close block-owned files and remove temporary files. JSON checks syntax separately from container/type/domain validation; CSV preserves a quoted comma. Time examples use fixed instants and explicit offsets, not the live clock or a promise of regional time-zone rules. Gem version checks install nothing.

Concurrency examples join all started workers, protect shared increments with one mutex, and drain a bounded queue before joining its producer. The queue sends integers only; false and nil are not data under its chosen termination protocol. Fibers use exactly two resumes and explicitly defer scheduler, Ractor and native-extension specialization. No sleep-based timing assertions, real network, Rails, YAML/Psych or Fiddle execution.

## Artifacts
- lessons.json, support-map.json, headings.json, terminology.json
- execution-cases.json and companions/: complete worked and changed sources
- structure-validation.json: exact local-code/support checks
- independent-semantic-review.json: terminal independent semantic PASS for all 20 lessons and 40 fixtures
- execution-reconciliation.json: 40/40 current fixture hashes and expectations reconciled to actual shared runner receipts; no successful-case stderr in this partition
- ../compiler-evidence/: actual runtime logs owned by the tools worker

Regenerate with python author.py and check with python validate-structure.py. No live application or GitHub changes are made by this partition.
