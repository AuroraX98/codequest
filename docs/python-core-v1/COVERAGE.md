# Python core audit and bounded completion plan

Baseline: Python 3.12, executed natively as 3.12.14 and in the actual app's Pyodide 0.27.7 / Python 3.12.7. Official version-pinned documentation currently renders the maintained 3.12.16 documentation; this does not change our tested runtime version.

This plan was completed before authoring. The 49 actual existing lessons were read in full by two partition reviewers and independently challenged across all 49. Exact paragraph evidence, hashes, checks and projects are in `../python-core-audit/{early,later}.json`. The independent challenge report records overlap, weaknesses and ordering concerns. Neither a title inventory nor passing code alone establishes teaching coverage.

| Core domain | Existing evidence | Genuine remaining scope |
|---|---|---|
| Values, names, text and numeric expressions | 01–02,07,08,14,22; input has its own lesson | 49 elif;50 operand-returning truth logic;51 identity;57 UTF-8 bytes;58 tolerance comparison |
| Branches, iteration and collections | 03–06,09–10,26–28,31–34 | 52 dictionary/set comprehensions;54 loop-else;56 structural matching |
| Function signatures and higher-order behavior | 08,29,36–38,47–48 | 53 lambda callbacks;55 positional-only signatures. Do not duplicate mutable-default warning, closure or decorator overview. |
| Objects and protocols | 11–12,33,35; duck typing and dataclass already substantive | 60 inheritance/super;61 properties;62 class/static method API-design enrichment;64 custom iterable |
| Lazy execution and asynchronous work | 15 generator expressions;16 actual async;38 contextmanager;46 iter/next/islice | 63 ordinary resumable generator function; existing16 browser execution defect fixed separately, not a new lesson |
| Errors and cleanup | 14 validation;17 expected exceptions;30 with;38 finally cleanup | 65 custom exception inheritance and chaining |
| Modules, environments and tests | 13 paired files;17 assertions/packaging narrative;19 dependency scope | 59 main guard/import side effects;68 real unittest discovery/failure. Correct project metadata rather than claiming existing fixtures install packages. |
| Files and practical standard library | 23 CSV;24 serialization;30 UTF-8 reading;39 pathlib;40 dates;41–46 bounded stdlib | 66 text write/append;67 argparse explicit supplied-list browser practice plus real native CLI verification |
| Applied examples and limitations | 18 statistics;20–21 local API fixtures;25 DFS | Preserve these applications, narrowly correct metadata that overstates actual evidence. No new network/credential feature implied. |

The 22 additions have explicit prerequisite IDs and version-pinned primary sources in coverage-plan.json. The final course would contain 71 lessons, because the original49 include python-input in addition to numbered01–48. Twenty-two is the number of identified gaps selected for this bounded scope, not a target every track must meet.

## Explicit limits
No claim of every Python feature, standard-library API, third-party framework, advanced static-type checker, operating-system integration, production service or performance mastery. Lower-priority class/static methods, loop-else and positional-only forms are included as scoped language/API-design topics, not prerequisites for writing any useful program. The independent challenge also identified numeric operators/grouping and stepped range/slicing as genuine foundational gaps. Root authorized two additional small units69–70 after the initial20 plan; no further speculative additions are included. These retain beginner/intermediate levels and explicit prerequisites rather than being mislabeled advanced because their IDs are higher.

## Corrections separate from additions
- The synchronous browser async blocker in16 was actually reproduced and fixed by the integrator; runtime-only deployment4aa63693 leaves curriculum unchanged.
- Project metadata17–21 must agree with actual browser checks (no installation, remote request, credential use, or inferential-statistics verification claims).
- Existing06 gains a concrete list.sort comparison;37 gains a real functools.wraps call/example and clear inputs/effects.
- Existing23 needs operand-returning or explained before its solution uses that rule.
- Eight legacy quizzes get changed-case or evidence-boundary checks instead of repeated worked answers; no projects or completion IDs changed.
- Route ordering is not automatically prerequisite-aware. Beginner39/41 have intermediate prerequisites. Any level adjustment or prerequisite-navigation change must be separately explicit; new prerequisite metadata is not proof the UI enforces a guided order.

## Release gate
All new units stay runnable Python, not inert concept mode. Every taught callable has a visible worked example and plain purpose/input/return-or-effect breakdown, with evidence indices; generic syntax highlighting is not evidence. Native and exact production Pyodide checks must pass. CLI arguments and unittest discovery also require actual native process/discovery evidence, separately from browser list/suite tests. File writing uses isolated temporary/virtual files with exact text/bytes and cleanup. Prior49 solution/check regressions remain mandatory. Source semantics, fixture execution, UI integration, and learner mastery are distinct claims.
