# Python standard library: eight real lessons

Authoritative `all-eight.json`: python39–46 (8 additive units/lessons). No existing lessons rewritten. Do not regenerate from stale copies; current author.py includes escaped newline and dotfile teaching corrections.

## Topics and scope
39 pathlib.Path: pure path descriptions, name/stem/suffix/with_suffix; never touches disk.
40 datetime.date/timedelta: deterministic date arithmetic; valid ISO dates, integer offsets; explicitly not timezone instants.
41 collections.Counter: exact string counts, missing count0 before ordinary dict conversion.
42 collections.defaultdict: independent per-key lists, grouping order/duplicates, factory vs instance.
43 json.dumps: JSON string direction, Unicode, sorted keys, escaping, nonmutation; not duplicate json.loads lesson.
44 random.Random/choice: caller-supplied generator, seed state, empty guard, repetitions allowed, no security use.
45 re.fullmatch: ASCII classes/counts/whole-string Boolean, no unnoticed trimming or partial matches.
46 itertools.islice: bounded stream consumption, iterator position, empty/short/zero/endless inputs.

## Evidence
- validate.py → validation-results.json: **8 lessons/39 behavior checks pass in CPython**; starter syntax compiles; reference solution passes changed cases; unique IDs and prerequisites resolve against201.
- All lesson tests use disposable/local data. No network or real user file access. pytest/external packages unnecessary.
- Source docs consulted2026-10-27: Python official standard-library pages linked on each unit. These long-established APIs were actually checked on installed CPython; do not infer the runtime is the latest docs version.
- support-map.json includes zero-based main instruction quiz supports and prerequisites. Manual review checked all exercised contract facts: compound suffix/dotfile, leap/negative/zero date, case counts, grouped duplicate order, JSON escaping/return type, injected random source, ASCII/newline rejection, iterator consumption.
- Browser Pyodide run, correct Tools entry navigation, route and build tests remain integrator-owned. Do not call CPython evidence browser evidence.

## Index entries
`tools-entries.json` contains8 entry tuples compatible with lib/python-tools.ts entries. All point to actual added lesson paragraphs. No placeholders or future lessons. Optional additional entries for date.fromisoformat/Path.with_suffix are not counted as extra authored lessons.

## Safety/teaching notes
No Math tab. Main explanations contain the essential facts; More/info not required. Harness expressions may use helper syntax not taught here, but learners author only the described function, not the harness. Original201 progress IDs preserved.
These eight are the explicitly authorized finite stdlib batch. Broader remaining-course expansion remains separate; no exhaustive Python API claim.
