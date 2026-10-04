# CodeQuest navigation review and fixes

Reviewed October 3, 2026 (local date). Audience: a beginning learner using the existing personal CodeQuest app. Scope: all 100 checklist IDs, main sections, Python course theory/build, Skill path filtering, settings, saved practice controls, keyboard navigation, desktop and simulated phone layouts. This is a practical navigation review, not a usability score or accessibility certification.

## Outcome

The inspected routes are easier to find and return to after the fixes. Section changes and course theory pages now have validated links, browser Back/Forward works inside the app, and reopening retains the section, course, lesson page and studio choice on this browser. The existing colors and layout were preserved.

## Highest-priority findings, now addressed

| Priority | IDs | Location and evidence before fix | Effect and applied fix |
| --- | --- | --- | --- |
| P1 | NAV-004, NAV-056, NAV-063 | Main sections all stayed at `/`; view/page state lived only in memory (source and original live walkthrough). | Back could leave the app and refresh lost the lesson page. Added validated fragments, history handlers, account-scoped local resume, safe unknown-link handling, and draft flush before cross-lesson history. |
| P2 | NAV-026, NAV-027, NAV-075, NAV-076 | Tab title remained generic; selected menu/steps had only visual CSS; section changes left focus on old controls. | Learners had weaker location cues. Added section/lesson titles, current/pressed states, and controlled destination focus. |
| P2 | NAV-037, NAV-038, NAV-040, NAV-043, NAV-045 | `repeat` found nothing; Search topics did not explain current language/level; no count or explicit ordering. | A beginner could think a topic was absent. Added useful synonyms, scope/count/order text, Clear search and an empty-results recovery action. |
| P2 | NAV-071, NAV-073, NAV-074, NAV-090 | No skip link; editor focus outline removed; Escape then Tab already existed in CodeMirror but was unexplained. | Keyboard learners had to traverse the menu and could miss how to leave the editor. Added skip navigation, editor focus outline and visible keyboard help. This was not a confirmed keyboard trap. |
| P2 | NAV-033, NAV-055, NAV-075, NAV-094 | Practice topic select was 103 flat choices; explanation paging had no focused region; history/solution disclosures lacked states; run success lacked a short live status. | Harder scanning and weaker change feedback. Grouped topics by language, focused practice explanation pages, exposed disclosure state, and added concise run/copy completion feedback. |

## Evidence key and limits

- **B1:** Direct original/live and local browser inspection of main routes, location labels, search, filters and empty results. On the local updated build, `repeat` found Python Loops and Clear search restored six beginner topics.
- **B2:** Direct updated local browser history/deep-link/resume checks. Python idea 4 opened by link, Next moved to idea 5, Back restored idea 4, refresh retained idea 4. Reopening the root URL restored Skill path; Settings Back and reload retained AI practice mode.
- **B3:** Direct updated local keyboard/studio checks. Enter activated Skill path and focus moved to main; skip link moved to main; Escape then Tab reached Run project without changing code. Python run returned 1/1 checks passed. History exposed its expanded state and saved versions. Topic select had ten language groups. Saved work was not replaced.
- **B4:** Direct updated 390 px viewport check: main routes usable, search retained on return, no sampled control outside the viewport. A 320 px dark/larger-text lesson had no horizontal overflow. These are desktop emulations, not physical phone tests.
- **B5:** Updated production saved-practice explanation/disclosure recheck is recorded in the final verification section below.
- **V1/V2:** Original browser screenshots `outputs/navigation-fixed.jpg` and `outputs/navigation-mobile.jpg`, supplemented by final production proof. Screenshots support appearance only.
- **S1:** Static source evidence in `components/CodeQuest.tsx` (route/resume 345–562, skip/main navigation about 973–1090, search summary about 2098) and `lib/navigation.ts`. Source does not establish runtime behavior by itself.
- **S2:** Static source evidence in `components/CodeEditor.tsx`, `components/PracticeStudio.tsx`, `components/LessonContent.tsx`, and `app/globals.css`; new keyboard/help/disclosure/region semantics plus retained save/runner mechanisms.
- **T1:** Meaningful route parser round-trip/malformed-input checks in `tests/navigation.mjs`; source-preservation/formatting regression checks in `tests/lesson-display.mjs`; TypeScript check. Lint for edited shared helpers/editor/content passed. Root/practice component lint still contains pre-existing hook-rule errors, with no new routing errors identified.
- **Earlier QA:** `docs/browser-test-report.md` records previous actual provider, backup, history, cancellation and offline exercises. It supplies clearly labeled historical context, not proof that every state was retested on this version.

No saved provider key was read or copied. No new live AI request was required. Production learning completion/XP was not altered for these checks. Settings were tested on a separate local preview account, then restored. Physical phone keyboards, assistive technology, measured contrast, full browser zoom, network failures on this revision and representative learner research remain unverified.

## Coverage

100 of 100 IDs evaluated. Pass: **85**, Needs work: **0**, Not applicable: **5**, Not verified: **10**. Total: **100**. Counts describe evidence coverage, not a quality score.

| ID | Status | Evidence/scope | Fix or verification needed |
| --- | --- | --- | --- |
| NAV-001 | Pass | B1: Main navigation exposes Your quest, Build studio, Skill path, and Your progress; Settings is in the top bar. | Rechecked desktop and 390 px layouts. |
| NAV-002 | Pass | B1/B3: Lesson steps and course/practice studio choice stay next to their content. | Sampled Python and studio views. |
| NAV-003 | Pass | B1: Course discovery, editing, progress, and settings are reachable through named controls. | Sampled common destinations, not every task. |
| NAV-004 | Pass | B2: A Python lesson link opened theory idea 4; section/step links now have validated fragments. | Fixed. Private practice project IDs are not included in shared links. |
| NAV-005 | Pass | B1: Your quest presents a current course and the Learn/Try it/Build progression. | Existing starting-page copy retained. |
| NAV-006 | Pass | S1/B1: Sections group learning, building, discovery, progress, and preferences. | Organization inspection; user research remains NAV-098. |
| NAV-007 | Pass | B1: Destination labels and the studio mode labels distinguish the inspected sections. | Includes Course project and AI practice. |
| NAV-008 | Pass | B1: A visible section menu plus local step controls avoids hidden nested navigation. | No fixed click or menu-item limit applied. |
| NAV-009 | Pass | B1/S1: Change course opens Skill path; unavailable AI offers settings; completion offers the next lesson/path. | Runtime sampled Change course/settings; completion route inspected in source. |
| NAV-010 | Pass | B1/S1: Inspected navigation destinations map to rendered sections; all catalog IDs have lessons. | Catalog/source inspection; no obsolete nav destination found. |
| NAV-011 | Pass | B1: Familiar labels include Search topics, Run project, Back, and Clear search. | Audience is a beginning learner. |
| NAV-012 | Pass | B1: Skill path, Your progress, and Settings describe their destinations; studio modes have explicit names. | Sampled labels. |
| NAV-013 | Pass | B3/S2: Downloads, restore, run, generate, and history controls name the action. | Copy success name now matches visible Copied. |
| NAV-014 | Pass | B3: Topic options now group by friendly language name; difficulty and topic words remain visible. | Fixed the previously flat 103-item topic menu. |
| NAV-015 | Pass | S1: Progress now expands XP as Experience points (XP) earned; theory explains coding terms. | Fixed XP label. Full terminology review of all 103 lessons is outside this navigation pass. |
| NAV-016 | Pass | B1/V1: Primary lesson/run/generate choices have visible emphasis. | Visual sample only. |
| NAV-017 | Pass | B1/V1: Filters, editor actions, generator fields, and backup controls form separate groups. | Existing spacing fixes preserved. |
| NAV-018 | Pass | V1/V2: Visible gaps separate labels, fields, paragraphs, cards, and actions. | Desktop and small-screen samples; prior spacing report provides broader view coverage. |
| NAV-019 | Pass | V1/V2: Titles, topic names, body text, and metadata have a readable hierarchy. | Visual inspection; contrast is NAV-078. |
| NAV-020 | Pass | B3/S2: Hints, history, analogies, and example solutions use disclosures. | Essential lesson and run controls remain visible. |
| NAV-021 | Pass | B1/B4: Repeated navigation stays in a consistent location in each responsive layout. | Desktop sidebar becomes a visible mobile group. |
| NAV-022 | Pass | B1/S1: Main destinations keep their order across the inspected sections. | No menu reordering during navigation. |
| NAV-023 | Pass | B1/S1: Destination and action names are reused consistently in the inspected flow. | Friendly language names also used for practice optgroups. |
| NAV-024 | Pass | V1/B3: Primary/secondary/icon controls have consistent appearances. | Original colors retained. |
| NAV-025 | Pass | B2/B3: Section and lesson navigation uses the same history behavior; disclosures expose state. | Fixed semantics; native file dialogs were not retested. |
| NAV-026 | Pass | B2: Browser tab title changes to the section and, for course views, the lesson title. | Fixed the previously generic title. |
| NAV-027 | Pass | B1/S1: Main navigation uses aria-current; steps, tracks, and levels expose selected states. | Fixed. Visual active indicators also remain. |
| NAV-028 | Not applicable | The app has a flat main menu with language/level filters and a lesson process, rather than a nested document hierarchy. | Step indicators serve the lesson process; breadcrumbs are unnecessary here. |
| NAV-029 | Pass | B1/B3: CodeQuest branding and current course/project titles identify the learning workspace. | Authenticated identity display and account switching were not tested. |
| NAV-030 | Pass | B2/B5: Course theory says 4 of 7; practice explanation has a page count and named region. | Theory positions retained in course links. |
| NAV-031 | Pass | B1/B4: Visible sidebar/mobile section controls, local step buttons, and native selectors suit the inspected structure. | No hidden mobile menu required. |
| NAV-032 | Not applicable | The main navigation remains expanded on desktop and phone layouts. | No collapsed main-menu opener to evaluate. |
| NAV-033 | Pass | B3/B5/S2: History and example-solution disclosures now expose aria-expanded and aria-controls. | Fixed both course and practice controls; analogies use native details. |
| NAV-034 | Not applicable | There are no custom pointer-traversed hover submenus in the inspected interface. | Native selects and details do not require submenu pointer travel. |
| NAV-035 | Not applicable | No destination doubles as an expandable navigation parent. | Section buttons, local steps, and disclosures have distinct functions. |
| NAV-036 | Pass | B1/V1: Search topics is next to the course-level filters. | Observed in Skill path. |
| NAV-037 | Pass | B1: Search summary now names the current language and level. | Fixed previously ambiguous search scope. |
| NAV-038 | Pass | B1/T1: repeat finds Python Loops; variables maps to Basics; spacing/case are normalized. | Fixed ordinary wording. General typo correction is not implemented or claimed. |
| NAV-039 | Pass | B1/V1: Results include language, level, topic, project name, estimated time, and math presence. | Inspected result cards. |
| NAV-040 | Pass | B1: Empty search explains its course scope and offers Show topics in this course. | Fixed empty recovery, with Clear search also available. |
| NAV-041 | Pass | B1: Language and beginner/intermediate/advanced filters match course choices. | Native profile preference behavior preserved. |
| NAV-042 | Pass | B1/S1: Selected track/level remain visually distinct and programmatically selected. | Fixed missing pressed state. |
| NAV-043 | Pass | B1: Summary says 6 topics found or 1 topic found as search changes. | Added live result count. |
| NAV-044 | Pass | B1: Clear search restores all six Python beginner topics; course/level choices remain visible. | Fixed. Filters are required language/level choices, so no meaningless all-level reset was added. |
| NAV-045 | Pass | B1: Summary explicitly says in learning order. | Fixed previously unstated ordering; no arbitrary sort menu needed. |
| NAV-046 | Pass | B1/V1: Buttons and links have familiar shapes, borders, text, and focus styling. | Inspected controls. |
| NAV-047 | Pass | S1/S2: Settings, dismiss error, saved history, code downloads, editor, and file selectors have names. | Shared copy button now exposes Copied state in its label. |
| NAV-048 | Pass | V1/V2/B4: Sampled buttons/selects have usable visible hit areas without overlap. | No numeric target-size standard or physical accuracy claim applied. |
| NAV-049 | Pass | B3/S2: Empty local AI practice explains that a provider connection is required and offers settings; completion requires checks. | Sampled connection prerequisite; other disabled conditions inspected in source. |
| NAV-050 | Pass | B3/S1: Download/restore labels explain file outcomes; reset warns that prior work is saved. | File-picker operation and native reset cancellation were not repeated. |
| NAV-051 | Pass | B1/B3: View changes, search counts, selected modes, and run status acknowledge actions. | Added accurate copy completion semantics. |
| NAV-052 | Pass | B1/S1: Initial load shows Getting your quest ready; run and generation show busy labels. | Initial load/run observed; live generation was tested in earlier QA, not repeated here. |
| NAV-053 | Pass | B3: Local Python run reported 1 of 1 checks passed; save indicator states Your work is saved. | Course run now also has a short status announcement. |
| NAV-054 | Not verified | Source has alert messages with recovery guidance; no new failed-network/API operation was forced in this review. | Verify recovery on this version with controlled failures; earlier QA has invalid-backup coverage. |
| NAV-055 | Pass | B3/S1/S2: Search/run/copy/save have status regions; errors have alerts; chats use polite updates. | Static semantics and DOM status observed. Real assistive-technology announcements remain untested. |
| NAV-056 | Pass | B2/B3: Back and Forward restore sections and theory positions; Settings Back restores AI practice. | Fixed. Cross-lesson history also flushes a draft before changing course. |
| NAV-057 | Pass | B1/B4: Returning from Your progress keeps repeat search, language, and level; per-view scroll is retained. | Source implements scroll map; the screenshots show list-return position. Browser-wide scroll behavior beyond these samples is untested. |
| NAV-058 | Pass | B3/S1: Leaving the editor with Escape/Tab kept code unchanged; saved draft loading/history remain intact. | Earlier QA verifies autosave/reload; this change stores navigation separately from code. |
| NAV-059 | Pass | S2/B3: CodeMirror undo keymap retained and explained; earlier code saves provide restore points. | Native undo not invoked against the user's draft; reset restoration tested in earlier disposable QA. |
| NAV-060 | Pass | B3/S2: AI setup can be left via normal navigation; Stop controls remain available for runs/generation. | Actual long-running cancellation was covered in earlier QA; not rerun for this navigation change. |
| NAV-061 | Pass | B1/B3: Navigation/search/copy did not introduce confirmation popups; generation stays user-triggered. | Inspected flow only. |
| NAV-062 | Pass | B2/B3: Theory, task instructions, editor and checks remain available in the lesson/project flow. | No theory-to-exercise content expansion performed in this review. |
| NAV-063 | Pass | B2: Refresh keeps theory idea 4; root reopening restores Skill path and studio choice from account-scoped storage. | Fixed lost location. This position is local to this browser. |
| NAV-064 | Pass | B1/B3: Lesson pages, plain instructions, hints and editor help explain the next relevant action. | Guidance is available again when revisiting the section. |
| NAV-065 | Pass | V1/S1/S2: Headings, short paragraphs, labeled controls and grouped tasks support scanning. | Sampled navigation copy; no claim that all generated AI prose is flawless. |
| NAV-066 | Pass | B4/V2: Main routes and catalog remain usable at 390 px; 320 px dark/larger-text lesson had no horizontal overflow. | Desktop browser viewport simulation, not a physical device test. |
| NAV-067 | Pass | V2/B4: Adjacent nav/filter/action controls are separated; no sampled overlap. | Phone tap accuracy not measured; no numeric conformance claim. |
| NAV-068 | Not verified | Desktop viewport emulation cannot establish thumb reach or how a person holds a phone. | Test on real phones in ordinary grip positions. |
| NAV-069 | Pass | B1/B4: Section, lesson, run, help and copy actions have visible controls. | Text-selection clarification is optional; essential navigation does not rely on swipes or hover. |
| NAV-070 | Not verified | No physical phone software keyboard was available during the walkthrough. | Check field visibility and nearby actions on iOS and Android with the keyboard open. |
| NAV-071 | Pass | B3: Enter opens Skill path; skip link moves to main; Escape then Tab leaves editor at Run project without modifying code. | Sampled keyboard path. A complete screen-reader/keyboard certification is not claimed. |
| NAV-072 | Pass | B3/S1: Keyboard order follows visible header/nav/main controls; editor exit reaches Run project. | Focused sampled flow; every settings control not tabbed through this turn. |
| NAV-073 | Pass | B3/S2: Buttons/links have visible focus styles; editor now has an inset purple outline. | Fixed hidden editor ring. Overlay-related focus obstruction beyond sampled states is unverified. |
| NAV-074 | Pass | B3: Skip to learning content is the first link and moves focus to main-content. | Added and tested. |
| NAV-075 | Pass | B2/B3/B5: Section changes focus the learning workspace; course and practice Next/Back focus their explanation regions. | Fixed. Native dialog focus was not tested in this turn. |
| NAV-076 | Pass | B1/B3/S1/S2: Named landmarks, labeled fields, current page, selected controls and disclosure states are exposed. | Fixed missing states. Real assistive technology operation remains untested. |
| NAV-077 | Pass | S1/S2/B1: Main navigation/main landmarks and section/course/project headings structure the view. | Practice explanation is now a labeled region. |
| NAV-078 | Not verified | Palette visually appears legible; a measured contrast audit was not performed. | Measure text and meaningful indicators in both themes and relevant states. |
| NAV-079 | Pass | B3/S1: Active navigation has a dot and programmatic current state; pass/fail uses icons plus text, not only color. | No color-only navigation state found in inspected flows. |
| NAV-080 | Not verified | 320 px larger-reading text remained within the viewport; actual browser zoom was not tested. | Check browser zoom and default font enlargement; this report does not claim 200 percent conformance. |
| NAV-081 | Pass | B2/S1: Learn precedes Try it and Build; math appears when relevant; practice theory precedes its task. | Sequence inspected. Curriculum alignment was handled in earlier content QA. |
| NAV-082 | Pass | B2/B5: Theory page counts and lesson step selections identify current progress. | Completion icons remain paired with step labels. |
| NAV-083 | Pass | B3/S2: AI connection/online requirements and React/TypeScript prerequisites have explanations and routes. | Swift runner instructions inspected; no Mac companion installed/tested. |
| NAV-084 | Pass | B2/B3: Back pages and step controls let learners revisit theory, exercise, build and settings. | Saved versions offer separate correction routes. |
| NAV-085 | Pass | S1: Completed lesson shows next-quest/path actions; generated practice marks completion separately from XP. | Static completion routes plus earlier disposable completion QA; not repeated on the user's account. |
| NAV-086 | Pass | B3/S1/S2: Course tutor, selection clarification, practice hints, and editor keyboard help are near their learning context. | Live provider response not needed for this navigation pass. |
| NAV-087 | Pass | B1/B3: Empty topic search has clear recovery; empty practice/shelf/history copy explains how to begin. | Search and local practice states observed; project shelf/history text inspected. |
| NAV-088 | Pass | B1/S1/S2: Learning views consistently offer contextual help, and AI setup is available from Settings. | No separate global support service exists or is required for this personal learning app. |
| NAV-089 | Pass | B3/B5: Saved practice picker and saved code history provide routes back to recent work. | No favorites feature added; no need established by this review. |
| NAV-090 | Pass | B3/S2: Shared editor now explains Tab, Escape then Tab, and Ctrl/Command+Z. | Added discoverable shortcuts appropriate to a coding editor. |
| NAV-091 | Pass | B1/B2: Loaded section switches showed immediate destination changes during the walkthrough. | Observed warm navigation only; cold-load performance was not benchmarked. |
| NAV-092 | Not verified | No layout issue noticed in the sampled views, but cold/late-loading shifts were not measured. | Check asynchronously loading lessons/fonts/assets under slower connections. |
| NAV-093 | Not verified | Typing/search worked while idle; this turn did not repeat interaction during active AI generation or long code runs. | Test background-work responsiveness with controlled long operations; earlier Stop checks do not establish all performance. |
| NAV-094 | Pass | B1/B3: Catalog filters reduce results; the 103 practice topics are now grouped by language; saved practice has a picker and theory has pages. | Fixed flat practice-topic presentation. Native-select behavior on physical mobile remains untested. |
| NAV-095 | Not verified | Earlier QA verified offline caching/reload and local Python/JavaScript/HTML/CSS; this navigation version was not disconnected live. | Download the new pack and verify route/resume/retry offline. Source preserves existing offline mechanisms. |
| NAV-096 | Not applicable | This personal app currently provides an English interface and has no translated UI locale. | Long English labels and mobile wrapping inspected; future localization requires its own checks. |
| NAV-097 | Pass | S1/B3: Familiar English labels and browser-local date formatting are used in history. | No other locale or reading direction is supported or evaluated here. |
| NAV-098 | Not verified | No representative beginners performed a category-finding study in this turn. | Run a small tree/card test with intended learners; source organization alone is not evidence. |
| NAV-099 | Not verified | This was an agent walkthrough, not observed representative-user testing. | Watch beginners find a lesson, ask for help, run a project and return without hints. |
| NAV-100 | Pass | B1/B2/B3: Wrong search scope, absent repeat results, generic titles, missing states and lost history were observed/grounded before fixes. | Changes prioritized from concrete failures and the user's prior spacing feedback. |

## Final verification

The updated site published successfully: source `13c37d2e032380c9b47c27eabdd195fb6bd1c7ac`, saved version 15, deployment `appgdep_6ac1e375b3bc81918828aef4baa7810c`.

B5: The production saved Pet Introduction remained selected with its untouched starter. Next explanation moved focus to Practice explanation 2 of 8; Back restored 1 of 8. History exposed expanded/collapsed states and its empty-version guidance. Show/Hide example solution exposed expanded/collapsed states and the example content. CodeQuest still showed 0 XP and the existing DeepSeek connection. No AI request was sent. Browser Back returned from Settings to AI practice with Pet Introduction retained. Production search for repeat found Python Loops. The updated offline pack finished with Ready. You can use this device offline. The original tab was returned to AI practice, theory page 1, with History and the solution closed. Viewport overrides were reset. The source remained clean after publishing. The final visual proof is outputs/navigation-search.jpg (local browser preview of the same published source); the hidden production browser panel could not provide a screenshot, so no production screenshot is claimed.
