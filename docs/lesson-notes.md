# Private account lesson notes

`LessonNotes` provides a compact, keyboard-accessible notes panel for each lesson.
Users can write a reflection without selecting text, or highlight a passage and
choose **Add note**. Selecting text never saves a note or sends it to AI.

## Storage, privacy, and online behavior

- Notes are stored in the authenticated account through the same-origin
  `/api/notes` endpoint. The server derives the owner from authentication, checks
  the existing `state.draftScope`, and filters every query by that owner.
- The notes client sends no AI request and reads no API keys or credential store.
  It uses the app's existing session with `credentials: same-origin`.
- A note counts as saved only after a successful server response with the matching
  account scope, lesson, and exact note contents. A successful request without a
  matching acknowledgement does not clear the draft or show a saved status.
- Saved notes can be loaded on another device signed into the same account. The
  UI offers **Refresh saved notes**; it does not claim push updates or live sync.
- Internet is required to load and save. There is no IndexedDB/localStorage
  fallback or offline queue. Unsaved drafts remain only in the open page and are
  lost on reload, account/lesson change, or closing the page. Section changes
  within a lesson preserve the draft and its original source caption.
- Network errors, server validation failures, and conflicts keep drafts intact.
  While a refresh is incomplete, the last loaded list is explicitly marked as
  possibly out of date and mutations are disabled.

## Data contract and concurrency

A note includes a unique UUID, reflection, exact selected quote (optional), server
creation/update timestamps, and an immutable source anchor: lesson ID/title,
zero-based section index, stable section key/title, and SHA-256 source fingerprint.
The full section body is not stored. The fingerprint identifies the original
content; it does not automatically relocate a highlight after course edits.

Canonical anchors:

- Regular sections: `sectionKey = text:<index>`,
  `sectionText = lesson.explanation[index]`, `sectionTitle` from
  `getLessonHeadings(lesson.id)[index]`, and `lessonTitle = lesson.title`.
- Python concept rooms: `lessonId = python-01`,
  `sectionKey = concept:<pythonConcepts[index].id>`, section index/title from that
  concept, and source text equal to `[short, why, imagine, limit].join('\n\n')`.
  Concept keys cannot collide with prose-section keys.

Editing changes only the reflection. Original quote, source, and creation time
remain immutable. Each edit or deletion sends the exact version timestamp the
user originally opened. A stale version returns a conflict rather than replacing
newer work. After refresh, an edit conflict displays the latest saved reflection
and requires an explicit choice before using the newer version as the base.
If a note has been deleted elsewhere, its unsaved edit remains accessible for
copying instead of disappearing from the UI.

A new draft keeps the same UUID across failed/uncertain saves. An exact create
retry is idempotent on the server; a different payload or deleted identity cannot
silently overwrite/resurrect a note. The UI offers a separate-new-note choice
when refresh reveals a previously committed copy of the current draft.

Limits are 200 active notes per lesson, 12,000 characters each for quote and
reflection, and 250,000 source characters in the client fingerprint operation.
Oversize input is rejected without silent truncation or eviction.

## Integration

Props: `scope`, `lessonId`, `lessonTitle`, `sectionIndex`, `sectionKey`,
`sectionTitle`, `sectionText`, and optional
`selectedQuote: { text, requestId, source?: LessonNoteSource }`.

Increment `requestId` for every explicit Add note action, including repeated
selections of the same text. Pass the exact selection string, not a shortened
preview. Use `selectedQuote.source` to attach a highlight to its true source
without changing the default reflection section. Reset the parent's request when
account or lesson changes. The component remounts at those boundaries and ignores
late reads/mutations from the old context. A later selection cannot silently
replace an existing reflection or selected passage.

The `<details data-lesson-notes>` opens and focuses the reflection textarea on
Add note. Keep the notes panel outside the selectable lesson-body root, or exclude
`[data-lesson-notes]` from selection capture. Quote/reflection display classes
should use `white-space: pre-wrap` and `overflow-wrap: anywhere`.

Client methods:

- `loadLessonNotes(scope, lessonId)`
- `addLessonNote(scope, source, body, quote?, stableDraftId?)`
- `updateLessonNote(scope, lessonId, originalNote, body, expectedUpdatedAt)`
- `deleteLessonNote(scope, lessonId, id, expectedUpdatedAt)`

Each returns the verified current lesson list after acknowledgement. Responses
with a different account scope, unknown lesson anchors, duplicate identities, or
malformed data are rejected.

## Export and Obsidian

Export downloads the currently loaded saved notes for one lesson as a `.md` file.
Unsaved drafts are not included. The user may put that file in an Obsidian vault.
There is no vault discovery, permission request, upload, automatic import, or live
Obsidian sync. Headings escape Markdown. Exact quote/reflection content is enclosed
in fences longer than any contained backtick run, preventing accidental active
Markdown/HTML. Exports include source keys and fingerprints but no account scope,
credentials, or unrelated lessons. Note content belongs to the user.

## Verification

Run `node tests/lesson-notes.mjs` for the client and React UI tests. They use a
private-endpoint fixture and jsdom to verify scope/lesson boundaries, exact quotes,
immutable anchors, server-only acknowledgement, create retry identity, stale-edit
conflicts, failed-save draft preservation, explicit delete confirmation, async
account/lesson races, section-preserving drafts, selection focus, local Markdown
export, limits, and absence of AI/credential access. Backend authorization, D1
transaction behavior, and migration tests are maintained separately by the
server implementation.

Before publishing, verify the additive notes migration, authenticated creation and
reload, independent-session retrieval, conflict behavior, and account isolation.
Do not claim a deployed cross-device feature solely from passing client fixtures.
