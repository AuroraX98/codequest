# C# wording and learning review

All 63 lessons were reviewed individually, in course order. The course now has 405 sections with plain explanations and one worked C# example per lesson. The code visuals explain the selected line and part. Lesson IDs, route, section counts, quiz answer positions, concept-only assessments, and companion files remain intact. The other 1,158 lessons and units are unchanged. Individual receipts preserve the earlier and revised wording.

## Improvements

- Define new words before using them and explain each step with the same worked example.
- Remove competing extra examples and repeated optional tasks from the reading flow.
- Separate copies from shared references, successful parsing from allowed input, and a delayed query from a saved result list.
- Replace generic C# code labels with compiler-derived labels for all 63 exact examples. Distinguish type brackets from comparisons, event subscriptions from addition, namespace imports from cleanup, and a property's stored value from its incoming value.
- Correct 12 glossary destinations after the wording changes.

## Verification

- Course preservation checks passed: 63 lessons, 405 sections, 63 examples.
- Native .NET SDK 10.0.403 / C# 14 on Windows: all 133 compiler/runtime cases passed. These cover all 63 current worked examples, changed inputs, seven expected compilation failures, and two expected runtime exceptions. Current examples match the recorded cases after trailing-whitespace normalization. See native-results.json and native-example-map.json.
- Roslyn parsed and resolved each current example before generating its code annotations. Exact source and UTF-16 token positions are preserved. Changed source does not inherit stale annotations.
- All 63 contents lists use their reviewed headings; corrected glossary targets passed.
- Shared code-anatomy checks passed, including source preservation and contextual C# labels. Shared step-flow checks passed, including exactly one authored example per C# lesson. TypeScript checking passed.
- Browser checks at 360x640 and 402x874 showed one reading step and one selected code part, with no horizontal page overflow. Contents selection reached the requested idea and closed the phone panel. Escape restored focus to the contents button. Desktop reading and contents panels did not overlap.
- Wrong-answer feedback allowed retry; the correct answer was accepted. Completion remained blocked until reading sections are marked. No console errors were observed.

## Scope and rerunning

This is a broad C# fundamentals-to-intermediate course with selected advanced topics, not every feature in the language or every .NET framework. The browser displays C# and checks understanding; it does not execute C#. Native execution was checked separately. Phone checks used browser viewports, not a physical iPhone or VoiceOver. The debugger lesson's failure and corrected loop were executed; an interactive debugger session was not tested.

With .NET SDK 10.0.403 available, run the Review project under tests/csharp-native with two arguments: the repository root and the dotnet executable path. Run the Anatomy project with the repository root to regenerate the source annotations. The tools use SDK-bundled Roslyn and require no additional NuGet packages. The expected failures are intentional checks, not unresolved course bugs.

Technical references checked: [C# 14](https://learn.microsoft.com/en-us/dotnet/csharp/whats-new/csharp-14), [property storage and validation](https://learn.microsoft.com/en-us/dotnet/csharp/programming-guide/classes-and-structs/properties), and [.NET package references](https://learn.microsoft.com/en-us/dotnet/core/tools/dotnet-add-package?tabs=netcore2x).
