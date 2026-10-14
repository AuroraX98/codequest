# CodeQuest navigation audit

Reviewed October 14, 2026. The filename retains the original task date. This review applies the complete app-navigation-check skill to the current repository source. Audience: a beginner learning programming through lessons and small projects. Journeys: start/resume a lesson, find a topic, read and answer, edit/run a project, return through history, create/reopen AI practice, and find learning/storage settings.

The app already has useful navigation foundations: named main sections, bounded lesson links, local resume, search scope, a skip link, editor keyboard guidance, and recovery controls. Two small source findings were repaired: filtered lesson numbers now keep their course position, and an empty saved-practice section explains how to begin. Visual polish, actual focus behavior, mobile operation and successful learning cannot be certified from source.

## Evidence and limits

- **CQ:** `components/CodeQuest.tsx`: main navigation, route effects, course steps, catalog, help, progress and settings.
- **NAV:** `lib/navigation.ts`: allowed routes, bounded theory positions and beginner search synonyms. `tests/navigation.mjs` contains relevant regression cases; this audit did not execute them.
- **PS:** `components/PracticeStudio.tsx`: generation, saved projects, explanation paging, run/history/help and backup controls.
- **ED:** `components/CodeEditor.tsx`: native editor keyboard bindings, name, described keyboard help and focus styling.
- **SET:** `components/LearningSettings.tsx`, `components/AIConnectionSettings.tsx`, `components/APIKeyFileSettings.tsx`: labeled settings, offline guidance, provider setup and backup/key-file outcomes.
- **CSS:** `app/globals.css`: grouped layouts, typography, responsive styles and focus rules. Presence of CSS is not proof of actual size, contrast or layout behavior.
- **B1:** Parent reviewer current disposable browser fixture: filtering to Loops preserves topic 4; empty practice guidance appears; browser Back changes theory idea 2 to 1; reload retains a studio edit and the studio location; Escape then Tab leaves the editor at Run; 320 px studio/settings and deeper-charcoal larger-text views have no observed horizontal overflow. These are agent checks on a local browser, not physical-phone or representative-learner research.
- **HIST:** `docs/navigation-review.md` and `docs/browser-test-report.md` record earlier October 3 browser checks. They are historical context only and do not earn runtime Pass statuses on this revision.

Pass means the stated static property is supported within this source scope. Not verified means current runtime observation, measurement or representative-user evidence is still required. The parent reviewer supplied the narrowly scoped current browser results labeled B1 below; other runtime claims remain unverified. Counts describe coverage, not a usability score or accessibility certification.

## Priority findings

| Priority | IDs | Location/evidence | Effect | Concrete fix |
| --- | --- | --- | --- | --- |
| P2 | NAV-030 | CQ Skill path initially used the filtered result index `i + 1`. | Searching for a later lesson relabeled it as topic 1, losing its place in the course. | Derive its number from the current course and level before applying search. |
| P2 | NAV-087 | PS Your saved practice initially showed retention copy and disabled download when the collection was empty. | A new learner had no explicit explanation of the empty section or its next action. | Say there are no saved projects and direct the learner to generate above or restore a backup. |
| P2 verification | NAV-066, NAV-071, NAV-075, NAV-078, NAV-080 | Charcoal styling and code changes require fresh browser checks. | Source alone cannot show whether learners can read and operate the result. | Inspect desktop/narrow layouts, keyboard/focus, zoom and contrast after edits. |

## Complete coverage record

All 100 IDs evaluated: **68 Pass, 0 Needs work, 4 Not applicable, 28 Not verified** (total 100). The issue table preserves baseline findings; resolved table rows include the current repair evidence.

| ID | Status | Evidence/scope | Fix or verification needed |
| --- | --- | --- | --- |
| NAV-001 | Pass | CQ renders Your quest, Build studio, Skill path, Your progress and named Settings. | Static destination availability only. |
| NAV-002 | Pass | CQ lesson steps and studio mode controls; PS local explanation/file controls. | Observe actual movement in browser. |
| NAV-003 | Pass | CQ starting view links to course, study steps and Change course. | Verify first-use task completion. |
| NAV-004 | Pass | NAV encodes section, lesson, step and theory position in a fragment. | Current deep-link execution remains unverified. |
| NAV-005 | Pass | CQ hero and lesson flow identify current learning and next action. | Assess beginner understanding in user research. |
| NAV-006 | Pass | CQ separates learning, building, discovery, progress and settings by purpose. | Organization is plausible; see NAV-098. |
| NAV-007 | Pass | CQ names course project and AI practice separately. | Confirm learners understand these labels. |
| NAV-008 | Pass | CQ has flat main navigation and local step controls. | No fixed click-count rule applied. |
| NAV-009 | Pass | CQ links course selection, help settings and next lesson; PS links AI setup. | Execute cross-section return routes. |
| NAV-010 | Not verified | NAV limits recognized routes; historical report says catalog links worked. | Recheck current catalog destinations and route outcomes. |
| NAV-011 | Pass | CQ/PS use Run project, Back, Clear search, Download backup. | Sampled interface vocabulary only. |
| NAV-012 | Pass | CQ destination labels describe learning, building, topics and progress. | No current learner comprehension study. |
| NAV-013 | Pass | CQ/PS specify run, restore, download, generate and clear actions. | Inspect transient busy/success labels. |
| NAV-014 | Pass | PS groups practice topics under friendly language names. | Check native select scanning in browser. |
| NAV-015 | Pass | CQ expands Experience points (XP) in progress; ED explains Tab indentation. | Full lesson terminology is outside this navigation audit. |
| NAV-016 | Not verified | CSS/CQ mark primary versus secondary actions. | Inspect visual priority in changed palette. |
| NAV-017 | Pass | CQ/PS/SET group filters, editor controls, generator fields and backup actions. | Static grouping only. |
| NAV-018 | Not verified | CSS defines grid gaps and panel spacing. | Inspect rendered spacing and wrapping. |
| NAV-019 | Not verified | CSS defines distinct heading and body styles. | Check real readability at normal and enlarged sizes. |
| NAV-020 | Pass | CQ/PS use disclosures for history, hints and examples. | Essential action controls remain explicit in source. |
| NAV-021 | Not verified | CQ uses one persistent main-nav component; CSS has mobile rearrangement. | Inspect placement across views and widths. |
| NAV-022 | Pass | CQ maps one fixed main-navigation array. | Static repeated order verified. |
| NAV-023 | Pass | CQ repeats destination names in nav and browser-title labels. | Sampled terminology only. |
| NAV-024 | Not verified | Shared primary/secondary/icon classes exist in CSS. | Visually compare changed controls. |
| NAV-025 | Not verified | CQ has shared route effects; PS has separate local project behavior. | Execute repeated interactions and return paths. |
| NAV-026 | Pass | CQ assigns document.title from section, mode and lesson; views have titles. | Current browser title updates remain unverified. |
| NAV-027 | Pass | CQ exposes aria-current and pressed states on active destination/filter/step. | Verify visible active state after styling changes. |
| NAV-028 | Not applicable | Flat main destinations and lesson process do not need hierarchical breadcrumbs. | Existing step controls suit the structure. |
| NAV-029 | Pass | CQ branding/course titles and PS project titles identify the workspace content. | Account switching and identity display not verified. |
| NAV-030 | Pass | CQ now derives topic ordinal from the unfiltered course/level collection; B1 confirms filtered Loops remains topic 4. | Fixed and rechecked in the sampled browser flow. |
| NAV-031 | Pass | CQ uses a visible section nav, local button groups and native selectors. | Suitability is source inspection; rendered operability remains open. |
| NAV-032 | Not applicable | CQ main navigation is not collapsed behind a menu opener. | No hidden main-menu control to assess. |
| NAV-033 | Pass | CQ/PS history and solution controls use aria-expanded/controls; analogies use details. | Actual expanded-state updates need browser confirmation. |
| NAV-034 | Not applicable | Inspected main navigation has no custom pointer-traversed hover submenu. | Native selects do not create this requirement. |
| NAV-035 | Not applicable | Main destination buttons do not also expand nested navigation. | Local disclosure controls have separate functions. |
| NAV-036 | Pass | CQ places Search topics next to level filters. | Verify discoverability visually. |
| NAV-037 | Pass | CQ summary names the searched language and level. | Static scope text verified. |
| NAV-038 | Pass | NAV maps repeat to loop and variables to basics, normalizes case/spacing. | Limited synonyms; no general typo-correction claim. |
| NAV-039 | Pass | CQ topic cards contain track, level, topic, project and time. | Current visual scanning remains unverified. |
| NAV-040 | Pass | CQ empty search names scope and offers another word/course or clear action. | Exercise empty-results recovery. |
| NAV-041 | Pass | CQ language and difficulty refinements match the course catalog. | No demand for unnecessary extra filters. |
| NAV-042 | Pass | CQ uses selected/chosen classes and aria-pressed for filters. | Check visual states after palette edit. |
| NAV-043 | Pass | CQ renders a dynamic singular/plural result count. | Runtime count updates remain unverified. |
| NAV-044 | Pass | CQ Clear search empties the query; language/level remain available. | Exercise return from no results. |
| NAV-045 | Pass | CQ states results are in learning order. | Stable ordinal fix is NAV-030. |
| NAV-046 | Not verified | CSS includes pointer cursor and button styles. | Check that charcoal controls remain visibly interactive. |
| NAV-047 | Pass | CQ names Settings, Dismiss error, Saved code history and Download code. | Sampled icon controls only. |
| NAV-048 | Not verified | CSS supplies padding and responsive layout. | Measure rendered selection areas and test overlap. |
| NAV-049 | Pass | PS explains unavailable generation due to offline, AI disabled or missing connection. | Static generation prerequisites only; check other disabled states during walkthrough. |
| NAV-050 | Pass | CQ/PS backup/download labels describe output; SET explains offline and provider requirements. | Verify file operations and notices in browser. |
| NAV-051 | Not verified | CQ/PS have status and busy-state updates. | Observe acknowledgment during actual clicks/runs. |
| NAV-052 | Pass | CQ initial loading, PS generation and SET download render busy messages. | Static feedback exists; timing and completeness unverified. |
| NAV-053 | Pass | CQ/PS provide completion/run/save status text. | Actual save/run/completion success unverified here. |
| NAV-054 | Not verified | CQ/PS/SET include error alerts and some recovery instructions. | Force controlled failures to assess actionable recovery. |
| NAV-055 | Pass | CQ/PS/SET use role=status/alert and polite updates for meaningful changes. | Screen-reader announcements not verified. |
| NAV-056 | Pass | B1: browser Back returns theory idea 2 to 1. CQ handles popstate/hashchange with guarded draft saves. | Sampled Back verified; cross-lesson and repeated Forward paths still need wider checking. |
| NAV-057 | Not verified | CQ keeps search in state and uses a per-view scroll map. | Observe list return with query and scroll retained. |
| NAV-058 | Pass | B1: an editor change survives reload in the studio. | Sampled draft preservation only; all restore/conflict branches are not covered. |
| NAV-059 | Pass | ED configures undo history; CQ/PS expose saved versions and restore actions. | Runtime undo/restore and data integrity remain unverified. |
| NAV-060 | Pass | PS provides Stop for generation; SET provider setup provides Cancel. | Actual abort and safe cancellation require walkthrough. |
| NAV-061 | Pass | CQ/PS source keeps AI requests user-triggered and avoids automatic modal onboarding. | Inspected primary views only. |
| NAV-062 | Pass | CQ lesson/task panels and PS project instructions remain available beside work flow. | Check small-screen visibility and scrolling. |
| NAV-063 | Pass | B1: reload retains the studio location and editor change. | Sampled resume only; account switching and stale routes not rechecked here. |
| NAV-064 | Pass | CQ exposes lesson explanation/hints; ED explains editor keys; SET explains features. | These remain available on revisit in source. |
| NAV-065 | Pass | CQ/PS/SET use headings, short explanations and named controls. | Generated prose and every lesson not reviewed. |
| NAV-066 | Pass | B1: 320 px studio/settings and deeper-charcoal larger-text views show no observed horizontal overflow. | Sampled simulated widths only; physical devices remain unverified. |
| NAV-067 | Not verified | CSS defines control gaps and padding. | Inspect actual target spacing on narrow layouts. |
| NAV-068 | Not verified | No physical phone use observed. | Test frequent controls while holding a real phone. |
| NAV-069 | Pass | CQ/PS expose essential actions as controls rather than hidden gestures. | Text-selection clarification is optional assistance. |
| NAV-070 | Not verified | No physical mobile keyboard observation. | Test fields and nearby actions with iOS/Android keyboards open. |
| NAV-071 | Pass | B1: Escape then Tab exits the editor and reaches Run. Native navigation buttons and skip link remain in source. | Sampled editor keyboard exit; every control and screen reader not covered. |
| NAV-072 | Not verified | CQ DOM order roughly follows header/nav/main. | Verify actual focus sequence including hidden and disabled controls. |
| NAV-073 | Not verified | CSS/ED define focus outlines. | Check visibility and obstruction against charcoal surfaces. |
| NAV-074 | Pass | CQ has Skip to learning content targeting focusable main-content. | Actual focus transfer needs browser check. |
| NAV-075 | Not verified | CQ/PS explicitly focus main or explanation region after relevant changes. | Observe focus on section, lesson, page and disclosure transitions. |
| NAV-076 | Pass | CQ/PS/SET include named fields/groups, current/pressed and expanded semantics. | Sampled static controls only; assistive technology behavior unverified. |
| NAV-077 | Pass | CQ has named nav/main; PS explanation region and headings organize content. | Heading order/readout should be sampled with assistive technology. |
| NAV-078 | Not verified | Palette is being changed; historical report did not measure contrast. | Measure text/control/focus states against final surfaces. |
| NAV-079 | Pass | CQ pairs active nav with a dot/state; run results use icons and text. | Sampled static states only. |
| NAV-080 | Not verified | Responsive CSS does not establish browser zoom/text-resize usability. | Test enlarged text and browser zoom on final build. |
| NAV-081 | Pass | CQ orders Learn, Try it, Build and optional Math before completion. | Confirm learner comprehension with real tasks. |
| NAV-082 | Pass | CQ theory and PS explanation expose current page and total count. | Current rendering and announcements unverified. |
| NAV-083 | Pass | CQ React/TypeScript show prerequisites; SET/PS explain external runner/AI requirements. | Sampled prerequisites only. |
| NAV-084 | Pass | CQ lets learners revisit steps; PS explanation has Back and saved projects. | Work preservation during revisit requires execution. |
| NAV-085 | Pass | CQ completion offers next lesson and course route. | Execute a disposable complete-to-next journey. |
| NAV-086 | Pass | CQ has lesson help/hints; ED keyboard guide; SET nearby setting descriptions. | Validate usefulness with beginning learners. |
| NAV-087 | Pass | PS now explains that no practice is saved and points to generation or backup restore; B1 confirms the empty message appears. | Fixed and rechecked for an empty collection. |
| NAV-088 | Pass | CQ retains a lesson-help panel with guidance and AI settings route. | In-app help scope only; no claim of external support. |
| NAV-089 | Pass | CQ project shelf and PS saved-project selector support returning to work. | Resume/history behavior remains unverified. |
| NAV-090 | Pass | ED visibly documents Tab, Escape then Tab and Undo shortcuts. | No unnecessary command palette requested. |
| NAV-091 | Not verified | Source cannot measure destination loading. | Observe and measure representative navigation waits. |
| NAV-092 | Not verified | CSS/layout source cannot establish runtime layout stability. | Watch startup, lesson loading and editor attachment for shifts. |
| NAV-093 | Not verified | Runners/generation are asynchronous in source. | Exercise typing/scrolling while work is pending. |
| NAV-094 | Pass | CQ filters topics by course/level; PS groups topics and caps saved projects at 20. | Inspect native select usability and preserved position. |
| NAV-095 | Not verified | SET describes offline pack, retry/sync and conflicts; historic offline runs exist. | Force offline/reconnect on current revision with disposable data. |
| NAV-096 | Not verified | No translated-label or pseudo-localization run observed. | Test expanded labels without clipping. |
| NAV-097 | Pass | English labels fit the app scope; dates use locale formatting; settings explicitly explain UTC streak days. | Other locales and reading directions are not supported claims. |
| NAV-098 | Not verified | No representative-user category-finding research supplied. | Observe learners locating topics without hints. |
| NAV-099 | Not verified | Historical agent/browser checks are not representative learner research. | Observe actual beginning learners doing core tasks. |
| NAV-100 | Not verified | Current priorities use source findings and historical checks. | Collect failed-task, confusion and learner-feedback evidence. |

The table contains exactly 100 rows. No overall quality score is inferred.
