# Terminology: finite 150-entry reference

## FINAL consumer schema (use this file)
`terminology.json` is the final array ready to copy to `content/terminology.json`: `{id,name,aliases,category,kind: term|acronym|slang,meaning,example,context?,links:[{lessonId,paragraph}],languages?:string[]}`. It contains the same 150 entries as the original label/definition audit form below. This adapter was added to match the renderer already started. Optional languages use existing track IDs only; absent means not specifically scoped, not missing data. A study link to a language does not imply the concept exists only in that language. NULL is a value marker, not an acronym.

## Authored inventory and provenance
- `terminology150.json`: original audit/provenance array (not the renderer input), **150 entries**, all 124 baseline IDs retained and 26 added.
- Original audit schema only: `{id, label, category, aliases: string[], definition, example, register: 'standard'|'informal', context?: string, courseLinks: {lessonId, paragraphIndex}[]}`. This is the label/definition schema, not name/meaning. No concept-target links were needed.
- `baseline124.json`: untouched extracted baseline for provenance, not a second UI dataset.
- `baseline-corrections.json`: reference-only baseline wording/alias/label changes; do not modify the removed inline vocabulary panels.
- `verified-link-evidence.json`: 71 inspected destinations with actual lesson titles and source paragraphs. Other entries intentionally have empty links rather than invented targets.
- `validate.py`: checks IDs, required fields, actual link targets, category inventory, baseline preservation and representative search queries.

26 additions = 14 AI concepts + HTML/CSS language names + 10 software/workplace terms. Categories: basics35, collections21, data10, flow16, software18, language-tools11, web18, security3, AI18. This is a useful starter reference, **not every term in software or AI**.

## UI and route integration
1. Put the global **Terminology** tab between Courses and Progress. Do not attach it to the currently selected course.
2. Read the final `terminology.json` array. Search name, aliases, meaning and context case-insensitively; preserve multiple matches when one word has different meanings. Do not deduplicate entries by alias.
3. List and Tile views share the same query/category state and result set. Changing the view must not reset search or selection. Use a labeled view control with pressed/selected state; keyboard and touch both work.
4. Suggested display category names: Basics; Collections & Objects; Data & Databases; Program Flow; Software & Teamwork; Language Features; Web & Interfaces; Security & Access; AI & Machine Learning.
5. Show the term, concise meaning and example in the normal content path, or behind an explicit accessible expand button; never only on hover. Show the context note when present. Mark informal developer expressions as such rather than implying a universal technical definition.
6. Put optional Study links after the explanation. Use the actual current lesson title via its ID, and navigate to its exact `links[].paragraph`. Preserve selected terminology term/query/view when returning. No links here target python-01, avoiding the special concept-room routing mismatch.
7. Zero matches: explain there are no matches in this finite collection and offer Clear search/All categories. Do not imply the requested term does not exist.
8. Do not change lesson completions, reading marks, editor drafts, or course gates for a reference lookup. Keep links read-only navigation, not automatic completion.

## Important baseline refinements
- A function need not have a name; global definition now covers unnamed functions.
- Preserve index vs database index, class vs HTML/CSS class, and Swift protocol/optional vs other senses using explicit labels/context.
- Text interpolation covers Python f-strings and JavaScript template literals, but explicitly says their syntax is different.
- __init__ initializes an instance; it is not Python's object-allocation method.
- Debugging has its own process entry; remove debug/debugging aliases from the bug entry in this reference only.
- Expand API/JSON/CSV/SQL acronyms for search. AI model remains broader than language model/LLM.
- Access-token context reminds readers not to share credentials. AI entries describe computation, not consciousness; retrieval and tool requests do not prove truth or successful action.

## Verification scope and stopping condition
The dataset was authored and semantically reviewed against the existing 233-lesson source; 71 links carry actual source evidence. Validation is source/data validation only, not browser UI verification. Next renderer release should test both views with long terms, search aliases (PR/LLM/SQL), ambiguous class/index, empty results, category resets, keyboard navigation, mobile layout, and Study/back return. Stop after the finite inventory and these UI checks; no automatic endless expansion or fabricated links.
