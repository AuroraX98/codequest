# C# core lessons 42–63 — staged authoring handoff

## Scope and status

- 22 new lessons, IDs `csharp-42` through `csharp-63`; no existing IDs changed.
- Staging only: no live CodeQuest edits, deployment, or GitHub publication.
- Baseline: C# 14 / .NET 10, explicitly pinned in companion project files. No preview features.
- Microsoft primary documentation was opened and reviewed on 2026-10-27. Each unit and support-map entry carries its topic-specific official URL.
- Compiler execution has **not** been performed by this author: `dotnet` was absent from PATH and the checked common locations. Expected output is authored reasoning, not an execution receipt.

## Files

- `lessons.json`: units and concept-mode lesson objects (empty in-app starter/solution/checks).
- `support-map.json`: quiz prerequisites, visible supporting paragraphs, reasoning, source and optional practice.
- `headings.json`: section titles with exact paragraph indexes, including visible local transfer tasks.
- `terminology.json`: 22 lesson-linked terms with paragraph anchors.
- `companions.json`, `companions/<id>/Program.cs`, `Example.csproj`: complete original examples.
- `changed-cases/<id>/`: 20 separately runnable changed-case examples.
- `execution-cases.json`: 42 authored expectations for eventual compiler/runtime testing.
- `author.py`: reproducible content generator using the shared schema helper.
- `validate.py`: JSON, IDs, prerequisites, quiz shape, visible support, term targets and companion consistency checks.
- `make_test_cases.py`: regenerates the changed-case companions and expectations.

## Checks performed

`python validate.py` passes for all 22 lessons. All quizzes ask about a changed input, code change, or dependency decision; none is a terminology-label recognition check. Essential teaching is in the visible explanation array. Local transfer work is also visible, explicitly optional, and does not certify coding mastery.

Manually reviewed complete examples and changed cases against their stated behavior. Corrected JSON literal escaping before this handoff. Stable APIs used for delegates, LINQ, async, cancellation, synchronization, serialization and spans; the sole specifically new syntax taught is C# 14 `field` in lesson 60.

## Execution cautions

- Lesson 42 creates and deletes a new temporary file. Do not change its path to a real document. Normal output assumes file access succeeds; environmental I/O and cleanup failures are possible.
- Original lesson 57 intentionally throws `IndexOutOfRangeException`; this is the debugging exercise. Its changed case repairs the loop.
- Changed lesson 56 intentionally throws an assertion exception for the negative-discount bug.
- Lesson 55's quiz removes shared mutual exclusion. It explains a lost guarantee, not an assertion that a race manifests on every run; no deterministic race-output case is supplied.
- Lesson 59 does not install any package. Its CLI command contains explicit placeholders and is explained, not an executable required step. The companion uses built-in System.Text.Json.
- Async examples make no exact timing promises. WhenAll output is checked by argument order, not scheduling order.

## Boundaries

The capstone is a small validated in-memory/JSON tracker seed, not a completed resilient application. File-backed persistence and richer tests are local transfer tasks. No UI framework, web deployment, distributed storage, security certification, or claim of full-library coverage is implied.

## Independent content review amendments

A second author reviewed all 22 original examples and 20 changed examples. The initial source-only review found no clear semantic answer-key error, but identified prerequisite scaffolding gaps. Those were repaired: expression-bodied methods, Action and zero-argument lambdas, predicate and collection-expression syntax, IEnumerable/enumeration, Task.Run/Range/materialization, and explicit Main entry point. The field-backed-property example now uses an ordinary if/throw setter to avoid unnecessary new conditional-expression syntax. Math.Max, Trim, temporary-file failure boundaries, and the repaired debugging comment are clarified. A visible optional local-transfer paragraph and navigation heading are present in every lesson.

After regeneration, partition validation passes and the aggregate lesson objects were checked equal to the current partition snapshot. Independent final reread passed with no remaining findings. Receipt: `../types-design/review-applications-independent.json` (22 worked examples and 20 changed variants, source review only). This is not a compiler execution claim.
