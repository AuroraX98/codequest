# C# Core v1 — bounded beginner-through-advanced concepts

## Release artifact
`all-fifty-seven.json` adds **csharp-07 through csharp-63**. Preserve existing csharp-01..06 and all other existing lesson objects. Expected app count: **303 → 360**; C# count: **6 → 63**. Freeze hash is in `aggregate-validation.json`; regenerate only after any reviewed source correction.

This is a versioned core syllabus, not every C# feature or .NET API. The baseline is **C#14/.NET10**, verified in Microsoft's current stable release and support pages on 2026-10-27. No .NET11 preview dependence. Most foundational syntax is long-established; lesson60 explicitly teaches a C#14 field-backed property.

## Coverage
- 01–06 preserved introduction: output, variables, integer arithmetic, branches, while loops, local functions.
- 07–23: Boolean guards, numeric types/conversion, strings, missing values, validated input, switch/for, arrays/foreach/List/Dictionary/HashSet, argument options, overloads, recursion, value/reference behavior.
- 24–41: ref/out, tuples/enums, classes/constructors/properties/static state, inheritance/virtual/abstract/interfaces, records/structs/generics/constraints, nullable-reference analysis, patterns, exceptions, deterministic disposal.
- 42–63: files/JSON, delegates/lambdas/events/extensions, LINQ and deferred execution, iterators, asynchronous tasks/cancellation/shared-state protection, tests/debugging, project/package organization, modern properties, equality/hashing, Span, a bounded study-tracker integration exercise.

Explicit exclusions are in `coverage-plan.json`: every API/library, application frameworks (ASP.NET/MAUI/Unity), unsafe/native interop, compiler internals, and specialist metaprogramming/variance/custom-operator extensions. These are not silently represented as completed content.

## Teaching and UI contract
All new lessons are existing **concept mode**, not a new runtime. `runtime: javascript` is inert legacy schema only. Empty starter/solution/checks; never report a JavaScript run as C# execution. Visible teaching contains every assessed fact and full genuine C# examples. Changed-case questions assess consequences, not choosing a label. Optional local transfer challenges are ordinary visible paragraphs, not hidden project-only data. One optional .NET10 setup paragraph appears in07; do not repeat it across the course.

Completion means reading plus the authored understanding check, **not mastery or proof that optional code was run**. Local project tasks are optional. No unsupported C# browser execution claim is made.

## Navigation and terms
- `all-headings.json`: meaningful concept anchors for every lesson; generic example/setup/transfer/trace entries removed. The underlying paragraphs remain visible through Next and grouped under preceding concept. Convert `{title,index}` to app `{label,paragraphIndex}` if needed.
- `terminology-additions.json`: **52** additional definitions in independent topical categories, with `languages:["csharp"]`.
- `terminology-merge-suggestions.json`: **5** shared definitions (recursion, constructor, closure, iterator, await) receive precise new links; retain their existing meaning and global scope. Expected term count 212→264 if all52 added: integration baseline gained a separately authorized Console.WriteLine term after authoring. Shared merges add no duplicate definitions.
- Exact zero-based support and term links are collected in `all-support-maps.json`; no future placeholder links.

## Validation evidence and honesty
`aggregate-validation.json` checks IDs, prerequisite ordering/availability, concept shape, quiz indices, visible optional practice, headings and link bounds. Each new lesson depends on the preceding C# lesson, so prerequisite syntax is sequenced. All six old IDs remain unchanged.

Per-partition validation and independent semantic reports are in foundations/, types-design/, applications-advanced/. Some fixtures intentionally fail: types36/37 changed-case compilation, five negative type fixtures, original57 runtime index failure, changed56 failed assertion. Such expected errors are teaching evidence, not a failing correct solution.

**Compiler status must follow actual reports, not assumptions.** At authoring, no dotnet/csc/mcs was installed; examples were source-reviewed only. Root is handling any permitted SDK provisioning. Do not claim successful runtime validation unless actual results are later attached. Browser rendering, completion persistence, integration build, and deployment remain integrator-owned.

## Operational boundaries
No source author edited the active app. GitHub synchronization remains paused. C++ expansion must not start until this C# course is integrated and deployed, per the user's ordering request. After deployment, parent owns the next-course authorization/execution handoff.
