# Reader metadata correction

Version 73 omitted the separate heading registry for its 46 new lessons. The reader therefore displayed zero ideas, blank headings, and undefined reading-checkbox labels while paragraph bodies remained available.

Added six section labels for each new lesson (276 total), using the existing text:index annotation and reading-progress identities. Lesson JSON, IDs, paragraph order, existing headings, runtime code, database schema and account data are unchanged.

Validation: tests/remaining-reader.mjs renders the actual LessonContents and ReadingMark components in simple and full modes for every new section (552 renders). It checks heading IDs and accessible references, nonempty titles, section counts, checkbox labels and stable reading keys, and asserts lesson JSON is byte-identical to version 73. tests/remaining-core.mjs, TypeScript and the supported production build also passed.

Authenticated cloud browser verification should repeat backend-15, developer-toolkit-16 and ai-25 after publication. Narrow viewport verification remains limited by the cloud browser API. No local CUA used for this correction.
