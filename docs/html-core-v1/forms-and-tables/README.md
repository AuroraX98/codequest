# HTML 27–36 — forms and tables

Staged only: ten independently authored lessons, twenty worked/changed markup fixtures, twenty-two markup-contract records. Existing sixteen lessons are untouched.

Every lesson has visible purpose/attribute-value/behavior teaching and markup. Check expressions are supplied test infrastructure, not learner-authored JavaScript. HTML elements are not labeled functions. Numeric conversion is explicitly deferred rather than taught without a visible script.

Runtime owner: curriculum lead, production HTML frame under Node/JSDOM. These tests establish only supported DOM/local form-data behavior. They do not certify native focus navigation, file picker interaction, user typing validation, screen-reader output, actual submission, or layout. There are no real uploads, personal files, server endpoints or external assets.

Source alignment and construction records: `source-alignment.json`, `provenance.json`. Regenerate with `python author.py` using the current shared helper; do not alter canonical app content.

Final verification: lead runtime receipt `../runtime-evidence/forms-current-results.json` contains 30/30 passing solution/worked/changed jobs, with current lesson snapshot exact-matched. Runtime is Node24/JSDOM production HTML frame, not a real browser. Explorer independent semantic review PASS is recorded in `independent-semantic-review.json`.
