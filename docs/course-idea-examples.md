# Examples beside explanations in every course

Each explanation step keeps a concrete example visible in the reading panel. The example includes the values, definitions, and, where needed, companion files being discussed. Interactive examples can also show clearly labelled sample input and output. The example changes when the explanation needs a different value, syntax, or scenario.

The curriculum has 21 courses, 1,231 lessons, 7,112 reading sections, and 19,177 authored explanation steps. The existing Python examples are retained, including its separate first-lesson concept reader and input lesson. The other 20 courses add coverage for 1,136 lessons, 6,516 sections, and 16,587 explanation steps.

The additional courses use 2,448 complete examples and 361 supporting files. Related explanations share an example where the same code supplies the needed context.

| Course | Lessons | Explained steps |
| --- | ---: | ---: |
| Python | 95 | 2,590 |
| JavaScript | 69 | 1,556 |
| HTML | 46 | 994 |
| CSS | 56 | 901 |
| TypeScript | 49 | 772 |
| React | 37 | 635 |
| SQL | 52 | 934 |
| Swift | 58 | 1,132 |
| Backend | 43 | 823 |
| Developer Toolkit | 30 | 492 |
| AI | 32 | 447 |
| C | 62 | 943 |
| C++ | 69 | 1,077 |
| C# | 63 | 954 |
| Java | 73 | 1,065 |
| Kotlin | 64 | 876 |
| Rust | 68 | 604 |
| Go | 65 | 886 |
| PHP | 68 | 493 |
| Ruby | 64 | 476 |
| R | 68 | 527 |

The three `content/course-idea-examples-*.json` tables share complete examples within a lesson and explicitly map each section's explanation steps to them. They draw from the authored worked examples and add focused examples for missing syntax, changed inputs, project structure, and conceptual cases. Companion files stay visible with the example. The matching `course-idea-sources-*.json` hashes flag any lesson edits that require revisiting the mappings.

Code text is 13 pixels in the reading panels. Long lines wrap, including long strings and file paths. Wrapped lines preserve the original source for copying. The code-part diagram also fits its container, and its mobile source line wraps. Larger prose settings do not enlarge these code panels beyond the available space.

Viewing an example does not run code, contact an AI provider, submit a project, or mark reading complete. Existing navigation, saved reading positions, exercises, and quiz answers keep their behavior. The bundled tables are available to the offline reader.

## Verification

`node tests/course-idea-examples.mjs` checks every lesson and authored explanation mapping, source hashes, visible first-step context, companion files, Back/Next, saved positions, exact copying, escaped markup, offline rendering, and manual completion. Python's existing coverage checks remain separate.

The full mapping test passed for all 19,177 explained steps, plus 80 reader journeys. Python coverage, code-anatomy checks, and TypeScript checking passed. Browser checks cover examples from each of the 20 additional courses at a 360-pixel viewport. Long HTML and companion-file lines fit at 360, 768, and 1,280 pixels without horizontal code overflow. Larger reading text also preserves wrapping and the 13-pixel code size. These checks exercise the shared layout; they do not individually render every possible step at every screen size.

The production build passed. All 57 offline artifacts passed their size, content-hash, transport, and dependency checks. The generated offline pack is approximately 41 MB. The build retains a large-bundle warning because the app includes its curriculum and browser runtimes.

Content review used each authored explanation and worked example, then checked missing references, changed values, alternate outcomes, empty inputs, errors, and project setup. Additional peer review covered selected lessons and the shared reader. This is not a claim of an independent manual reread of every unflagged sentence.

Runtime checks passed for 303 web JavaScript/TypeScript examples, 69 rendered React examples, 111 SQL examples using the bundled engine, 227 C/C++ examples, 139 standalone Swift examples, 172 applied-course JavaScript examples, 117 Ruby examples, and seven further SQLite examples. Separate module, package, build, and test examples also passed; deliberate failing examples produced their expected errors. HTML/CSS structure and TypeScript diagnostics were checked separately.

Java, Kotlin, C#, Rust, Go, PHP, and R additions were reviewed against their source but not executed because those toolchains were unavailable. Six C thread examples require an unavailable `threads.h`; newer Ruby examples require a newer interpreter; SwiftUI requires a suitable Xcode app. Shell, deployment, mail, external-service, media, and network walkthroughs were not executed. All AI examples identify their supplied data as illustrative and do not run an AI model. Displayed code is teaching context; viewing it does not execute it.
