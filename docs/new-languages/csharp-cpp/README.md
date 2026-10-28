# C# and C++ foundations — isolated staging

Twelve concept-mode lessons: output → variables → integer arithmetic → conditions → while loops → functions and a tiny console game-state model. IDs `csharp-01..06` and `cpp-01..06`. No prior language prerequisite; both chains begin independently.

- `lessons.json`: `units` and `lessons`, matching existing concept schema. `runtime: javascript` is an inert schema placeholder, not an execution claim. Empty code/check fields; full real-language examples are in normal visible reading paragraphs.
- `support-map.json`: zero-based visible teaching references and prerequisite chain.
- `sources.json`: primary Microsoft C#/C++ documentation, opened during authoring; C# local-functions URL redirects to its current fundamentals page.
- `terminology.json`: three shared, language-scoped additions. `terminology-existing-links.json`: append links/scopes to existing generic terms, do not replace their definitions or duplicate entries. Merge language scopes only where the existing entry has a restrictive scope; an unscoped generic entry should remain unscoped.
- `companions/`: complete sample and changed-quiz-case files; optional local exercises, not fake in-app builds.
- `validation.json`: GCC14.2 C++17 compile with warnings-as-errors and execution passed for six samples and six changed cases. C# compilers dotnet/csc/mcs were absent: six samples and six changed cases are source-reviewed only, explicitly unverified at runtime.
- `author.py`, `validate.py`: reproducible staging and validation. No app source edited.

Integration: register C# / C++ tracks and readable code-fence labels; do not send their examples through a JavaScript runner. Use existing concept reading + authored-quiz completion. The game is a deterministic score/turn simulation, not an engine, graphical game, or interactive input loop.
