# Course descriptions

Reviewed 2026-10-27. Every current course has one short explanation of what it is and common uses. These are original summaries, not source quotations. Examples describe possible uses, not promises that frameworks, platform SDKs or compilers are bundled here. Existing lesson scope/runtime disclosures still apply.

Canonical text: `content/course-descriptions.json`; reusable display: `components/CourseDescription.tsx`. Render once on each Courses card, without a duplicate adjacent overview. Future courses must add a description keyed by their stable course ID; the coverage test fails for missing or stale IDs. Use1–3plain sentences: correct kind, practical use, optional small example. Keep language, library, markup, styling, query language and topic-track distinctions accurate.

Primary reference receipts checked with web tools:
- Python: https://www.python.org/about/
- JavaScript: https://developer.mozilla.org/en-US/docs/Web/JavaScript
- TypeScript: https://www.typescriptlang.org/
- HTML: https://developer.mozilla.org/en-US/docs/Web/HTML
- CSS: https://developer.mozilla.org/en-US/docs/Web/CSS
- SQL: https://www.postgresql.org/docs/current/tutorial-sql.html
- React: https://react.dev/learn/describing-the-ui
- Swift: https://www.swift.org/
- Back-end development: https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Server-side/First_steps/Introduction
- Developer toolkit: https://git-scm.com/book/en/v2 (toolkit composition also matches the app’s actual authored topics)
- AI: https://developers.google.com/machine-learning/intro-to-ml and https://ai.google.dev/gemma/docs/core (learning/prediction versus generation examples; no model-version claims)
- C#: https://learn.microsoft.com/en-us/dotnet/csharp/tour-of-csharp/ and https://dotnet.microsoft.com/en-us/learn/dotnet/what-is-dotnet
- C++: https://learn.microsoft.com/en-us/cpp/windows/overview-of-windows-programming-in-cpp and https://developer.microsoft.com/en-us/cpp
- Java: https://dev.java/learn/
- C: https://www.gnu.org/software/c-intro-and-ref/manual/c-intro-and-ref.html
- Kotlin: https://kotlinlang.org/
- Go: https://go.dev/
- Rust: https://rust-lang.org/
- PHP: https://www.php.net/manual/en/introduction.php
- Ruby: https://www.ruby-lang.org/en/about/ and https://www.ruby-lang.org/en/documentation/faq/1/
- R: https://www.r-project.org/about.html

The initial isocpp.org/about request was403, and the GNU html_node landing page timed out; alternate primary documentation above was used. The first PHP intro-whatis URL returned404; the current Introduction landing page succeeded. This is a type/use overview, not a survey of every platform feature.
