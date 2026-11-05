# Terminology sources

A course appears on a term card when a specific lesson teaches that meaning. Each source records the lesson, the idea, and its exact wording. Opening **Study** goes to that idea. Python Basics also records its named learning step, such as **A program**.

The reviewed index contains 1,033 terms. Of these, 1,021 have at least one course source and 12 are general references. The 1,430 study links cover all 21 courses. Of the course-linked terms, 131 have verified sources in more than one course.

A matching word alone is insufficient. Python and R both teach positions, with different first positions. A database index, Git's staging index, model inference, and TypeScript type inference have their own entries. For words such as **token**, selecting a source changes the meaning, category, and study link together. General references such as **LGTM** stay available under **All languages and courses** and **General reference only**.

When editing a source, compare the term and its meaning with the actual teaching passage or worked example. Use the course and idea that teach it. Run `node tests/terminology.mjs` to check every source excerpt, example, title, and link against the lesson data, and `node tests/lesson-glossary.mjs` to check consistency with in-lesson word help. Text checks catch drift; deciding whether a passage teaches the same concept requires reading it.
