# C17 actual compiler verification

129/129 fixtures passed on existing GCC (Debian14.2.0-19)14.2.0:112 new authored worked/changed cases,12 original worked/changed cases,5 additional EOF/strtol boundary cases. These cover all62 worked lesson examples; exact normalized source matches are recorded in source-match.json. Current112 staged fixture objects match the executed manifest.

124 expected executions and5 intended compile/link failures. Diagnostics independently inspected: const write rejection27; missing implementation43; internal-linkage helper44; unused-variable warning promoted to error55; omitted implementation56. Expected controlled nonzero process exits are checked explicitly, not misreported as crashes.

Baseline: gcc -std=c17 -Wall -Wextra -Wpedantic -Werror. One explicit narrow exception:20worked intentionally demonstrates safe snprintf truncation, so -Wno-error=format-truncation leaves its warning visible; the runner asserts the exact warning category. No global warning suppression. No intentionally undefined-behavior execution. Thread examples join before accessing results, guard shared counters by mutex or atomics, and fail closed on failed synchronization. Portable C17 coverage does not claim every optional thread/atomic implementation supports these examples.

Additional actual stale-build probe: compile Ready, edit source Changed, old executable still Ready, rebuild prints Changed. Receipt stale-build-probe.json.

Compiler logs are results.json; complete code and expected outcomes are case-manifest.json; intended diagnostics/warning receipt diagnostic-review.json; terminal counts summary.json. run-all.py is reusable with --cases and optional --output. No system/tool installation and no live app edits performed.

Optional sanitizer evidence, if included by the author, is separate library-and-tooling evidence; this aggregate baseline makes no sanitizer or leak-clean claim. LeakSanitizer has known ptrace limitations in this environment. Baseline passing is not proof of absence of all undefined behavior or production safety.
