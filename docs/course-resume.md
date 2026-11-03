# Course resume

Each course keeps its latest lesson, idea, learning phase, and Python concept. Bookmarks save immediately in account-scoped browser storage and queue through the existing account-sync client. The profile settings record stores bookmarks; no schema migration or progress reset is needed. Code drafts and completion marks are unchanged.

Opening the clean Site URL resumes the latest study bookmark. Course selection retains that course’s bookmark and shows **Resume course**. An explicit lesson URL still opens the requested lesson, with a **Resume where I left off** alternative when it differs from the saved place; the old bookmark is protected until the user resumes or chooses to stay. A bare `#quest` uses the saved idea rather than restarting.

Newer timestamps win when merging browser/account bookmarks. Atomic server updates reject delayed older bookmark writes and replace the selected course’s bookmark without removing other courses. Existing single-browser navigation state is migrated when the course has no bookmark.

Within-idea microsteps and practice-answer selections retain their existing browser-local persistence; those granular interactions are not synced across devices. Account sign-in and sync must succeed for cross-device lesson/idea resume. No attempt is made to reconstruct a position already lost before this update.
