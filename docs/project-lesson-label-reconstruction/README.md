# Projects selected-lesson audit — reconstructed 2026-10-28

This is a **new replacement change**, not recovery of lost unpublished commit `e648f4c016b4001d9c33649c357a1b9c89d98acd`. Its test was reconstructed from retained source and rerun on the freshly reconstructed first audit, `6cdc04e0cfa641723bb46fa5c6211c78ef484615`. Original commit identity and lost log hashes are not claimed.

## Result

No application defect found; no application/content changes in this second patch. Projects already shows **Current lesson · course · level**, the active lesson title as its main heading, and an explanation that changing lessons changes projects. The shared heading precedes ordinary runnable projects, guided Python projects, local-code projects, and exploration projects without an editor. AI practice is a separate workspace and does not display this course-project heading.

Selecting a course is not merely changing a filter: production `changeCourse` selects its first beginner lesson in teaching order. Selecting a lesson updates active lesson and course/level preferences together. The heading uses the active lesson, not a project title or stale course filter.

## Fresh verification

`node tests/project-lesson-context-rendered.mjs` renders actual production heading JSX and selection handlers against the complete catalog in React/JSDOM:

- All 21 course switches select their first lesson and render the correct course, level, and title.
- All 1,221 lesson switches render their corresponding heading after opening Projects.
- All 1,221 Projects route round-trips retain lesson and build view.
- 21 AI-practice/course toggles exclude and restore course-project context.
- Coverage: 504 ordinary projects, 1 guided-project lesson, 683 local-code lessons, 33 no-editor exploration lessons.

Existing `project-lesson-context`, `course-switch`, `navigation`, `all-course-projects`, `project-editor-access`, `course-chooser`, and `unit-toc` tests also passed afresh. Related tests cover rapid selections/delayed saves, restoration, scoped local drafts, editor access, no-editor guidance, chooser behavior, and lesson navigation. See `tests.log`.

The old source-only heading test's end boundary was stale (`&& [` instead of `&& ([`), so it silently inspected nearly the entire remaining component. This patch corrects that boundary and requires both boundaries to exist. The new rendered test provides behavior coverage beyond literal-string assertions.

`npx tsc --noEmit`, changed-test ESLint, and `git diff --check` passed. Production build is not rerun for this second tests/docs-only patch; the first replacement's fresh build receipt is separate.

## Limits

This is a focused production-code React/DOM harness, not live authenticated browser testing, full editor/runner execution, or phone/visual geometry acceptance. Network/storage/editor integrations are stubbed or excluded. Its course-workspace visibility guard is modeled; the existing source test checks production placement/conditions. Branch classification verifies all branches have coverage, not full rendering of every project component.

No GitHub push or deployment is performed by creating this replacement. No license, access, curriculum, or learner-data changes are included here. The parent receives new identities and review evidence before publication is considered.

Aggregate `npm run lint` still fails with 49 errors / 55 warnings, all in unchanged files; changed tests have no diagnostics. Paths were checked against the diff. Existing React-ref and test/CommonJS rules are outside this scoped verification. See `lint.log`; no aggregate lint success is claimed.
