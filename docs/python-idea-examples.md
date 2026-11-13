# Python examples beside explanations

Each Python explanation step now keeps a reviewed example visible with its explanation. The example includes the definitions and values needed to understand that thought, a result when useful, and a short connecting note. It is immediately visible and can be copied without reopening an earlier step.

The authored curriculum coverage is 95 lessons, 596 reading sections, and 2,590 explanation steps, with 662 example entries. The separate six-concept first-lesson reader also keeps its existing complete examples and results beside every explanation. The input lesson receives the same section-specific examples. Narrow reading panels stack the explanation and example; wider panels can place them in columns.

The three `content/python-idea-examples-*.json` tables map explanation steps explicitly to reviewed examples. They do not infer a nearby code block. A section can use different examples for different thoughts, including supplied helper functions, changed values, error cases, and output explanations. Source hashes in `content/python-idea-example-sources.json` make the coverage check fail when an authored section changes and needs a new review.

The original lesson text, exercises, checks, completion actions, navigation sequence, and saved step format remain intact. Rendering these examples requires no network or AI call. Both hosted and offline builds include the tables.

The added example panels use compact 13-pixel code text and wrap long lines to fit. Visual wrapping preserves indentation and the original copied source, including when larger reading text is enabled.

## Validation

- `node tests/python-idea-examples.mjs`: coverage and valid mappings for every Python explanation, visible context, exact screenshot regression, changing examples, Back/Next, saved step restoration, first-lesson examples, input examples, escaped source, no network calls, and no automatic completion.
- Python 3.11+ `tests/python-idea-example-runtime.py`: 472 distinct executable cases passed, with 463 output comparisons. Five complete two-file examples are created and run in temporary folders. Interactive examples use their documented replies. Seventeen distinct setup/instruction examples are displayed as text and are not executed as shell commands. Some outputs intentionally depend on input, environment, or runtime measurements and are qualified by their notes.
- TypeScript compilation, `tests/lesson-display.mjs`, `tests/python-input.mjs`, and `tests/python-concept-lab.mjs` passed. The concept-lab checks also exercised its existing models with native Python and the bundled Pyodide runtime.
- Browser verification reproduced Python Types & Comparisons, idea 7, step 4. The original “This shows True False False” explanation appeared with the complete comparison code, matching output, and connecting note. Back/Next and reload retained the expected reading position. The Copy control reported success. Subsequent font and wrapping checks covered the screenshot example and the longest added example line (182 characters), including a 360-pixel viewport, with no horizontal code overflow.

The pre-existing full `tests/lesson-step-flow.mjs` suite stops on its Java lesson-count assertion (expects 72, current curriculum has 73). That unrelated historical assertion was left intact. The new targeted suite verifies the modified reader behavior and all Python mappings.
