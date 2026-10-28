# Java and C initial foundations: twelve staged concept lessons

- `all-twelve.json`: units and lessons, Java 01–06 + C 01–06. Six-step chain per language: output, named values, conditions, guarded input, loops, reusable methods/functions.
- `terminology.json`: 11 entries in current TerminologyEntry shape (`name`, `meaning`, `kind`, `languages`, `links[].paragraph`); all links validated. Java method vs C function intentionally distinct.
- `support-map.json`: exact teaching/example/quiz paragraph indices, prerequisite IDs, official source URLs and named sections, version targets.
- `fixtures.json`: complete displayed examples for external validation only; not browser Build projects.
- `validate.py` / `validation-results.json`: 12 schema/quiz/prerequisite checks; all six C examples compile with GCC14.2 `-std=c11 -Wall -Wextra -Werror -pedantic` and produce expected output. C input additionally checked with too-long and empty input. Java reviewed manually, **not compiler tested**: javac unavailable.

## Integration contract

Both tracks must be concept-only: `learningMode: concept`, empty code checks/starter/solution/filename, no Build/compiler grading. `runtime: javascript` is the existing concept-schema inert placeholder, NOT a promise Java or C executes as JavaScript. Keep unsupported runtime visible; no fake passing checks. All content is staged only; no active app files changed.

Targets are deliberately Java 21 and portable C11 basics, not claims of newest releases or full advanced coverage. Source links: Oracle Java SE21 specification, Oracle Java21 Scanner API; WG14 N1570 C11 committee draft. Neither language has a browser compiler here. Native C test success does not imply in-app C execution. A future actual Java compiler check can strengthen example evidence without changing concept-only app claims.

C input deliberately uses bounded fgets rather than unchecked scanf integer conversion. The text teaches array capacity, terminator, sizeof, success/null check, retained newline and unread remainder before testing truncation. Java input uses hasNextInt before nextInt and explicitly describes token consumption/waiting. Both input lessons follow conditions, not vice versa.

Study text is original, short microsteps with one code example and a changed-case question. Conventional Java main scaffolding is introduced as provided structure, with method parameters/return unpacked in Java06; no claim all Java syntax is mastered in Java01. Advanced libraries, objects, memory allocation, files, error recovery, Unicode, concurrency and full toolchain setup are not covered by these initial six units.
