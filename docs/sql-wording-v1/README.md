# SQL wording review

All 52 SQL lessons were reviewed by the host in recommended order, one at a time. No Team Effort tools or delegated agents were used. The completed course is published as one release.

## Changes

- Reviewed 318 sections, summaries, steps, hints, quizzes, project instructions, and contents labels.
- Each lesson has one worked example. Reading steps show one short idea at a time; inline code mentions no longer generate extra examples.
- Explain terms before using them: table, constraint, foreign key, aggregate, transaction, window, frame, recursive query, and binding.
- Preserve important limits: missing values, integer division, type conversion, tied rows, update guards, rollback, and query-plan evidence.
- Explain each SQL code part by its job. Added labels such as Choose values, Keep matching rows, Look back, Rank without gaps, and Save the transaction.
- Use the SQLite parser with its missing window and RETURNING keywords included. Names and quoted identifiers stay distinct from instructions.
- The two local JavaScript companions now match the single displayed example. Their setup notes clearly distinguish them from the SQL editor.

## Coverage

The course covers tables and queries; selecting, filtering, ordering, paging and distinct values; NULL; ranges and membership; patterns; CASE; text and date operations; types, casts and STRICT tables; defaults and constraints; grouping, aggregates and FILTER; joins, relationships and normalization; subqueries, EXISTS and NOT IN; set operations; CTEs and recursion; windows, ranks and frames; inserts, updates, deletes and upserts; indexes and plans; transactions and savepoints; schema changes; cascade rules; RETURNING; triggers; bound host input; and isolated database export/reopen. No additional foundational topic was needed in this SQLite course. Server administration and multi-user backup are outside its local runner.

## Validation

- 52 ordered review receipts; all IDs, routes, section counts, quiz answer positions, starters, solutions, and assessment checks preserved.
- All 1,169 other lessons and units unchanged. Shared catalog metadata unchanged.
- 50 exercise solutions and all 52 examples run with pinned SQL.js 1.13.0, including both Node.js companions.
- Exact expected example values checked. Seven deliberate invalid writes rejected. Saving over the existing example snapshot rejected.
- Actual sandbox browser runner: 100/100 runs pass, with 167 exercise checks. All SQL example output matches the independently run pinned engine.
- Shared code-anatomy checks preserve source across 1,860 fenced blocks; SQL semantic labels, quoted identifiers, assignment/comparison, windows, and names covered.
- Contents mapping passes for every SQL lesson.
- Phone layouts observed at 360 x 640 and 402 x 874 CSS pixels: one visible reading step and one selected part, no horizontal page overflow. Contents selection closes on phone, code-line selection and part selection work.
- Desktop observed at 1,400 x 900: contents occupies x=16..256; reading begins at x=415.5; the optional assistant sits below the reading area. Contents stays open during a section jump. Escape inside contents closes it and restores toggle focus.

## Limits

Phone checks simulate viewport sizes; no physical iPhone or screen reader was used. Local examples use SQLite 3.49.1 through SQL.js 1.13.0; they do not prove behavior in a remote database. Index plans are inspected, not claimed as measured speed gains. Temporary browser test pages are removed before packaging.

Technical references checked: https://sqlite.org/lang_select.html, https://sqlite.org/lang_expr.html, https://sqlite.org/datatype3.html, https://sqlite.org/stricttables.html, https://sqlite.org/windowfunctions.html, https://sqlite.org/lang_returning.html.

