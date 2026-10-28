# Tools and concepts across all courses

Tools and concepts now has an alphabetized language/course selector covering all21 authored courses. Python retains its exact75 curated tools. Other courses point at existing curated concept anchors; they are honestly labeled Concept, not invented complete function references. Search covers the corresponding grouped teaching prose and code. Opening an entry uses the existing exact lesson/paragraph route and preserves normal saved progress and drafts. The picker is local while browsing; Study/Guided course navigation selects the corresponding course. A refresh initializes from the current saved course.

Displayed course names are alphabetized in Courses, Tools and concepts, Terminology and supported Practice course groups using one shared comparator (including C, C#, C++). Lesson order, prerequisites, IDs and the requested expansion sequence are unchanged. The generic Tools links are available from every course; Guided course no longer silently forces Python/beginner.

Practice generation is intentionally limited to coding lessons, not concept-only lessons with an inert legacy runtime. The client excludes concept-only entries and explains a safe stale-selection fallback without touching saved drafts. Existing unsupported saved drafts remain readable but cannot be run as fake JavaScript. The API rejects concept-only generation before any provider call or usage charge. Courses/Tools/Terminology still include those topics.

## Verification

- Typecheck and production build pass.
- All21 indexes are nonempty, have unique valid authored targets and exact route roundtrips; Python75 objects preserved.
- React/JSDOM verifies course picker, cross-course Study and Guided return, search, alphabetical ordering including a future course.
- Terminology212 entries/195 links: all21 filter/search/List-Tile tests and actual alphabetical display labels pass.
- Practice API rejects all86 concept lessons with no provider call/usage. Existing61 generation and54 focused validation cases pass using synthetic responses, with real SQLite accounting and actual Python/JavaScript prompt examples.
- Practice Studio test verifies sorted supported groups, explanatory concept fallback, unchanged saved drafts, reference/starter validation, history/reset and stale-generation handling. No live AI requests made.
- Navigation, nonmodal TOC, direct editor, AI/stdlib, new-language preservation and guided project storage regressions pass.
- New index geometry/mobile appearance is not freshly browser-verified. The managed preview had a documented bootstrap/offline-pack readiness blocker; no workaround bypassed it. Existing wrapping/grid/button styles are reused.

Offline pack `4165de95c40b0dd3885b`,33 artifacts and transports hash-verified.
