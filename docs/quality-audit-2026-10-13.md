# CodeQuest quality and usefulness review

Review requested October 13, 2026; source inspected October 14. Base commit: `13c37d2e032380c9b47c27eabdd195fb6bd1c7ac`. This document is a source review of the working checkout, including concurrent navigation improvements where noted. It is not a fresh browser, user-research, security, or accessibility-conformance report. The parent review's runtime evidence should be read separately.

CodeQuest has a useful, understandable purpose: help a beginner understand a coding idea, practise it, make a small working project, and keep that work. Its strongest design choice is the connected lesson → question → project → checked result flow. The app already has substantial safeguards for saved work, offline use, and AI-provider credentials. The practical gap is evidence of learning: finishing checks and earning XP does not demonstrate that someone can solve a new problem independently.

Polish needs targeted improvements rather than more features. The requested charcoal surfaces and retained purple accents should be checked across lessons, settings, the editor, and popovers. Two further findings are accessible announcements for AI-practice run results and advance notice before the 20-project practice limit removes an older draft. Neither should be hidden by a single overall quality score.

## Scope and evidence

Audience assumption: English-reading beginners and returning learners using a private browser app, with optional AI assistance. It also offers intermediate/advanced lessons. No interviews or representative learner observations were supplied. Accounts, course progress, code, offline copies, optional paid AI-provider calls, and a Mac-only Swift companion create different requirements; these are explained in the app and documentation.

Evaluated journeys: (1) open a lesson and learn its first idea; (2) answer a question, edit/run a project, and complete it; (3) find another topic and resume saved work; (4) recover code through history or backups and use offline saves; (5) connect optional AI, generate practice, run it, and retain it.

Evidence keys:

- **C:** `components/CodeQuest.tsx`: course navigation, theory, editor, progress, history, settings, save and completion guards.
- **P:** `components/PracticeStudio.tsx` and `lib/practice-storage.ts`: practice generation, validation, local drafts, history, backups and retention.
- **E:** `components/CodeEditor.tsx`, `components/LessonContent.tsx`, `components/SelectionClarifier.tsx`: editor and lesson presentation.
- **D:** `lib/learning-client.ts`, `lib/device-db.ts`, `components/LearningSettings.tsx`: account-scoped device state, pending queue and offline controls.
- **T:** `app/chatgpt-auth.ts`, API routes, `lib/server.ts`, `lib/ai-transport.ts`, `lib/ai-keys.ts`: source-level authentication and provider boundaries.
- **V:** `app/globals.css`, `lib/profile.ts`: shared visual variables, responsive styles, reduced motion and appearance defaults.
- **H:** `docs/browser-test-report.md`: an October 3 report of earlier browser work. This is historical reported evidence, not tests rerun in this review.
- **L:** `content/catalog.json`, `content/lessons.json`, README: lesson structure and documented scope. Counts and old test statements were not independently recomputed in this review.

For every row below applicability is Yes unless marked Not applicable. The criterion states the acceptance condition; the evidence column states the method/evidence and next verification. **Required** means an explicit user requirement or essential protection proposed for this app's work and account data. **Recommended** means useful practice, not a legal requirement. Pass is restricted to a directly inspected source property; whole-journey behavior remains unverified until exercised. Partial means identified source support with remaining stated gaps.

## Complete core criteria table

| ID | Criterion / acceptance condition | Required/recommended/opportunity | Result | Evidence or next check |
|---|---|---|---|---|
| VAL-1 | Audience, situation and desired outcome supported by user evidence | Recommended | Unverified | L supplies a clear hypothesis; observe intended learners using a first lesson. |
| VAL-2 | Better effort or learning outcome than the learner's current method | Recommended | Unverified | Integrated examples/editor may reduce switching; compare a realistic task with their usual method. |
| VAL-3 | Entry explains the central purpose | Recommended | Partial | C names learning and building, language, level and estimated time; learner comprehension untested. |
| VAL-4 | Main useful capability is easy to discover | Recommended | Partial | C presents Learn/Practice/Build and course navigation; actual discovery needs first-use observation. |
| VAL-5 | User benefit and sustainable operation have defined evidence | Recommended | Unverified | XP is implemented; learning transfer and support/cost outcomes need evidence. |
| START-1 | First useful action is understandable | Recommended | Partial | C opens a lesson with one theory idea at a time; observe first-run confusion. |
| START-2 | Information and permissions requested when justified | Required | Partial | T requires account for private state; AI key and offline downloads are optional. Live permission/refusal flow not checked here. |
| START-3 | Useful defaults and optional examples | Recommended | Pass | `lib/profile.ts` defaults to beginner JavaScript; C offers optional familiar examples and hints. Source property only. |
| START-4 | Returning user can resume appropriate saved work | Required | Partial | C restores route/drafts and D keeps scoped state; H reports reload checks. Fresh interrupted-session check required. |
| START-5 | First useful outcome and abandonment are understood | Recommended | Unverified | No representative first-use outcome study supplied. |
| NAV-1 | Labels and organization match learner tasks | Recommended | Partial | C uses learning paths, lessons, build studio, progress/settings; comprehension untested. |
| NAV-2 | Location, next action and exit are clear | Recommended | Partial | C current/pressed states and lesson step controls exist; keyboard/visual verification belongs in navigation report. |
| NAV-3 | Consistent destinations, history and deep links | Recommended | Partial | `lib/navigation.ts` and C normalize/hash routes; run back/forward/reload on nested states. |
| NAV-4 | Common actions have discoverable controls | Recommended | Partial | C exposes run, history, downloads and settings; E supplies editor keyboard help in current working source. |
| NAV-5 | Search, filters and no-result recovery work for catalog | Recommended | Partial | C uses topic/project search, course/level context, clear search and empty copy; H reports previous checks. |
| NAV-6 | Moving views protects meaningful drafts | Required | Partial | C awaits saves, keeps draft refs and guards stale switches; exercise failed-save navigation. |
| TASK-1 | Key journey produces correct recognized outcome | Required | Unverified | Completion is tied to matching checked source in C; representative new end-to-end run not performed by this reviewer. |
| TASK-2 | Repeat work avoids unnecessary re-entry | Recommended | Partial | C autosaves and restores; E keeps editor instance/undo across ordinary edits. Actual task effort unmeasured. |
| TASK-3 | Pending, success and failure are truthful | Required | Partial | C has save/sync and runner states; P result changes need accessible announcements. |
| TASK-4 | Forms have labels and recoverable validation | Recommended | Partial | C/P/settings use labels and bounds; inspect keyboard/error association at runtime. |
| TASK-5 | Consequential replacement offers recovery | Required | Partial | C/P reset confirms and saves history. P trims older drafts at cap without action-specific advance warning. |
| TASK-6 | Leaving/canceling and save states are predictable | Required | Partial | C warns on dirty unload; P offers Stop and scope/abort guards. Confirm cancellation under slow responses. |
| VIS-1 | Main content and action have clear hierarchy | Recommended | Partial | C has lesson heading, step strip and run action; screenshot inspection still needed. |
| VIS-2 | Reading/code text remains comfortable and legible | Recommended | Partial | V has reading line heights and optional larger text; E preserves code and scroll. Test zoom and syntax contrast. |
| VIS-3 | Spacing and grouping remain deliberate | Recommended | Unverified | V provides consistent panels/grids; rendered geometry not assessed here. |
| VIS-4 | Charcoal replaces white surfaces; purple accents remain | Required | Fail at baseline | Base V uses white panels and pale page background. Parent owns authorized theme changes and visual verification. |
| VIS-5 | Focus, selected, disabled and errors are distinguishable | Recommended | Partial | V and C define states; verify contrast and focus after theme changes. |
| VIS-6 | Motion respects preferences and does not block work | Recommended | Pass | V includes `prefers-reduced-motion` and calm-mode suppression. Source property only. |
| VIS-7 | Layout survives narrow/large/empty/error content | Recommended | Unverified | Responsive rules exist; test real content, long filenames and generated text at narrow widths. |
| ACC-1 | Accessibility target and evaluation scope are explicit | Recommended | Partial | Recommend WCAG 2.2 AA as a target; this is screening, not a conformance claim. |
| ACC-2 | Main tasks work by keyboard and assistive technology | Required | Partial | C has named controls/current states; E includes escape-then-Tab editor instructions in working source. Fresh manual check needed. |
| ACC-3 | Text/UI contrast and non-color meaning are adequate | Required | Unverified | Check labels include text alongside icons; final charcoal and syntax palette need measured contrast. |
| ACC-4 | Zoom and reflow preserve content and operation | Required | Unverified | Test text enlargement, browser zoom, narrow width and code-region scroll. |
| ACC-5 | Targets are usable and do not cause adjacent activation | Recommended | Unverified | Measure actual rendered controls and exercise touch/keyboard. |
| ACC-6 | Errors, status changes and relevant media are accessible | Required | Partial | C course runner has status and alerts. P baseline results lack equivalent announcement. No lesson video/audio found requiring captions. |
| PERF-1 | Response/completion budgets reflect learner devices | Recommended | Unverified | No agreed budget or representative field data supplied. |
| PERF-2 | Entry, typing, scrolling and runs remain responsive | Required | Unverified | Worker isolation/time limits documented; actual slower-device responsiveness needs measurement. |
| PERF-3 | Long operations show progress, stop and recovery | Recommended | Partial | P shows generation/checking and Stop; settings show pack progress. Slow/failure paths require runtime checks. |
| PERF-4 | Storage/network/processing are appropriately bounded | Recommended | Partial | P caps drafts/history; T bounds AI response and times out provider requests. Offline pack/device impact needs measurement. |
| PERF-5 | Web performance is assessed by appropriate metrics | Recommended | Unverified | No current Core Web Vitals field data supplied; lab results cannot replace it. |
| REL-1 | Important checks/results are correct at boundaries | Required | Partial | C rejects stale code results and checks manual steps; existing test suites/H supply historical evidence. Re-run relevant checks. |
| REL-2 | Errors/retries preserve work and avoid duplicate outcomes | Required | Partial | D implements immutable queue/conflict handling; C/P retain errors/work. Re-run regression flows. |
| REL-3 | Reload/interruption restores correct state | Required | Partial | D/LocalStorage implement persistence and H reports previous offline reload success. Current regression needed. |
| REL-4 | Account ownership, pending and conflict states are clear | Required | Partial | D scopes work; settings explain waiting/sync and both copies. Cross-account runtime evidence not collected here. |
| REL-5 | Updates/backups preserve useful work | Required | Partial | C/P expose backup and history; import validates fields. Cap eviction is a remaining recovery concern. |
| TRUST-1 | Costs, consequences and choices are understandable | Required | Partial | P/settings disclose provider charges, internet needs and practice XP distinction; cap action needs stronger notice. |
| TRUST-2 | Data purpose, location and access are explained | Required | Partial | Settings disclose browser-profile offline access and key exclusion; complete retention/deletion understanding needs review. |
| TRUST-3 | Architecture-specific security verification is adequate | Required | Unverified | T supports fixed endpoints and encrypted account-bound keys; no fresh penetration/dependency audit conducted. |
| TRUST-4 | Access is enforced for every relevant account/object | Required | Partial | Auth/API and scope guards exist; exercise cross-account attempts using disposable accounts. |
| TRUST-5 | Errors and account-exit flows protect sensitive data | Required | Partial | T sanitizes provider errors and supports key disconnect; full exit/deletion/log review not conducted. |
| CONTENT-1 | Instructions use consistent learner vocabulary | Recommended | Partial | Small theory pages and concrete tasks in L/C; no novice comprehension sample performed. |
| CONTENT-2 | Empty/loading/error states offer useful action | Recommended | Partial | C loading retry and search recovery; P generation failure preserves saved work; test all visible failure states. |
| CONTENT-3 | Contextual help is available without losing work | Recommended | Partial | Hints, familiar examples, quoted selection and AI help in C/E; manual usefulness check required. |
| CONTENT-4 | External notifications are useful and controllable | Recommended | Not applicable | No notification delivery capability found in reviewed learning flows. |
| CONTENT-5 | Supported locale displays dates/text correctly | Recommended | Partial | English content, localized date display and UTC learning dates documented; midnight/timezone cases need review. |
| OPS-1 | Supported platform/input/network matrix is defined/tested | Required | Partial | README explains browser runtimes/Mac Swift/file-picker limits; no fresh complete compatibility matrix. |
| OPS-2 | Failures and critical dependencies have monitoring/owner | Recommended | Unverified | No operating monitoring evidence supplied to this reviewer. |
| OPS-3 | Release, rollback and data recovery suit the risks | Required | Unverified | Migrations and build scripts exist; deployment/rollback must be verified separately. |
| OPS-4 | Capacity, provider costs and support demand are manageable | Recommended | Unverified | User-owned keys and local limits bound some exposure; no production load/cost evidence. |
| OPS-5 | Defect/content/accessibility/support ownership is clear | Recommended | Unverified | Private owner implied, but operating responsibilities not documented in examined evidence. |
| MEASURE-1 | Metrics define goal, population, denominator/window | Recommended | Unverified | Proposed learner outcome measures below; no measured baseline. |
| MEASURE-2 | Benefit is checked alongside task completion | Recommended | Unverified | Course checks do not demonstrate later independent understanding. |
| MEASURE-3 | Relevant satisfaction/return/support/cost evidence exists | Opportunity | Unverified | Collect only measures useful to this private learning tool. |
| MEASURE-4 | Outcomes expose groups/journeys with poorer access | Recommended | Unverified | No learner/device/access-needs sample supplied. |
| MEASURE-5 | Faster/easier outcomes preserve correctness and control | Recommended | Unverified | Use independent task accuracy and recoverability as guardrails. |

## Conditional modules

| Module | Applicability / acceptance condition | Result | Evidence / next check |
|---|---|---|---|
| Accounts and teams | Accounts apply; private account isolation and safe session change required. Teams not present. | Partial | T/D implement scoped identity; use two disposable accounts and expired session. |
| Payments/subscriptions | No app checkout or subscription in reviewed scope. External provider charges disclosed. | Not applicable | P/connection settings disclose external cost; do not imply free AI calls. |
| Search/substantial data | Catalog lookup, export/import and bounded histories apply. | Partial | C/P implement them; test typo/no-result searches and backup round trip. |
| Offline/sync | Download, queued changes, conflicts and reconnect apply. | Partial | D/settings/H support implementation; current disconnected and conflict checks still needed. |
| Collaboration | No simultaneous multiuser editing/sharing feature found. | Not applicable | Do not add collaboration to satisfy checklist. |
| AI features | Accuracy, provider privacy, costs and learner control apply. | Partial | P validates structure/reference runs and warns of incomplete checks. Evaluate generated teaching accuracy separately. |
| Social/user content | Private learner code/AI text apply as input; no public social publishing. | Partial | Runner isolation and validation are relevant; public moderation module otherwise not applicable. |
| Notifications/background | No push notifications; open-tab sync and downloads apply. | Partial | D/settings expose status/manual sync; test interrupted download/reconnect. |
| Sensitive/regulated | No medical, financial, or regulated decision feature identified. | Not applicable | Credentials still require ordinary security protections covered above. |
| Games/creative tools | Gamified learning and coding creation apply. | Partial | Optional rewards/calm mode and editable projects support control; observe learning/enjoyment, not XP alone. |

## Findings and improvement sequence

| Priority | Journey/state | User impact | Proposed correction | How to verify |
|---|---|---|---|---|
| Major | Generate/import at 20 saved practices | Older personally edited practice can be removed by retention without an action-specific warning. Generic latest-20 copy is easy to miss. | Warn before the capacity-changing action and offer the existing backup; keep cancellation free of changes. | Seed 20 disposable practices, attempt 21st generation/import, cancel, verify all originals; proceed after backup and verify documented retention. |
| Major | AI practice run finishes/fails | Screen-reader users can miss result updates while focus remains on Run. | Add concise live result summary and alert errors, matching course behavior. | Keyboard-run passing/failing/stopped practice and inspect announcement without moving focus. |
| Minor / explicit request | Light appearance surfaces | Baseline white/pale surfaces do not match requested charcoal palette. | Change white surfaces to charcoal and retain purple emphasis with readable text/editor colors. | Inspect all principal screens/popovers and final contrast; run narrow and wide layouts. |
| Opportunity | Learner completes a lesson | Passing familiar checks may overstate ability to solve a new problem. | Try a small follow-up task with changed inputs, then ask the learner to explain one line. No extra feature required initially. | Observe a few relevant learners and document errors/help needed; do not infer population success rates. |

Work order: protect retained work and accessible results, complete charcoal styling, then run the existing regression suites and focused browser checks. Avoid creating more learning modes before the current lesson loop is shown to help a real learner.

## Useful outcome measures

These are proposed study measures, not measured improvements or agreed numeric targets.

1. **Independent transfer:** learners correctly completing one changed-input task without copying the example, divided by learners attempting that follow-up in a selected lesson session. Record help used and actual output; XP does not count as transfer.
2. **First useful result:** new learners reaching and explaining their first working project, divided by first-lesson attempts in the pilot; record elapsed time and abandonment reasons. Faster is useful only if understanding survives.
3. **Work recovery:** successful restorations of the intended code after interrupted save, reset or conflict, divided by the tested recovery attempts for the release. Verify file contents, not just a success message.
4. **Task friction:** wrong turns, failed actions and help requests during find → learn → run, segmented by keyboard/touch and supported window sizes. Compare the same kind of task before/after changes.
5. **AI usefulness/cost:** practice/tutor replies that the learner can use to make a correct next change, with cost per such outcome over a defined pilot window. Track incorrect explanations and overreliance alongside satisfaction.

## Readiness boundary

**Readiness not established by this source review alone.** No demonstrated essential course failure was found in the inspected source. Accessible practice feedback and retention warnings should be fixed and exercised. Final release evidence must cover the changed appearance and affected workflows, deployment success, and critical persistence checks. Existing October 3 reports are useful context but do not certify this changed release. Formal WCAG conformance, live provider coverage, Swift/Xcode behavior and improved learning outcomes remain separate claims requiring their own evidence.

## Implemented follow-up in this review

`components/PracticeStudio.tsx` now includes a concise live summary for running and completed practice checks, alert markup for runner errors, and a stopped message when a canceled run exits. The empty saved-practice state explains generation, backup restore and the course-project alternative. At capacity, a visible message points to Download practice backup. Generation asks before starting a provider request that could replace the oldest draft; restore calculates the number of older drafts that its incoming projects would displace and asks first. Generation rereads storage before adding its result and asks again when capacity/oldest project changed while it was running.

`node tests/practice-studio.mjs` passed on October 14, 2026 with synthetic provider/runner responses and fake IndexedDB. In addition to its existing generation, completion, reset and stale-response coverage, it checked a real 20-draft fixture through these branches: cancel generation (no new provider request, unchanged stored record); cancel backup import (unchanged stored record); accept generation (20 records retained, new project present, expected oldest absent); and an accessible successful-run status. This verifies DOM and state behavior under that harness, not an actual screen reader or paid provider. Windows test setup now uses a directory junction and file URLs for imports.

The practice retention warning and result-announcement findings are **implemented with focused harness verification**. Actual screen-reader speech and browser-native confirmation interaction remain for manual verification. Storage transaction behavior was not changed: the UI reread reduces a changed-capacity surprise, but this review has not established atomic approval against a simultaneous write from another tab between confirmation and insertion. The full criteria table above records the baseline/source assessment and is not retroactively a blanket pass.

## Current nonbrowser regression checks

The following suites passed on October 14, 2026 in this checkout, using Node 24.19.0 on Windows. These checks exercise real application functions with synthetic accounts, fixture responses and fake browser storage where indicated; none sends real provider requests.

| Suite | Confirmed scope |
|---|---|
| `tests/navigation.mjs` | Route round trips, all sections/studio choices, bounded malformed links/positions, beginner search terms. |
| `tests/local-mode.mjs` | 19 request boundaries, trusted local identity replacement, loopback-only listener configuration, stable private encryption-key setup and damaged-key preservation. This is middleware/runtime-helper verification, not a running Worker. |
| `tests/offline-client.mjs` | 10 flows including in-flight edits, delayed cross-tab acknowledgment, offline reload, account switch, conflict recovery, history-preserving reset, lost acknowledgment, completion replay and credential exclusion. |
| `tests/offline-cache.mjs` | Verified pack download, failed-update preservation, API/auth/cross-origin bypass, offline navigation and static-only entries. |
| `tests/account-action-scope.mjs` | 14 synthetic key/disconnect cases covering delayed identity/sync/response reads, mismatched scope and ordinary same-account success. |
| `tests/account-keys.mjs` | Account-only encrypted keys for three providers, public-state exclusion, cross-account decryption rejection, disconnect and absence of shared-key fallback. |
| `tests/practice-storage.mjs` | Atomic account-isolated saves, concurrent history preservation, 20-project/version limits, completion source hashes and portable backups without trusted completion claims. |
| `tests/selection-clarifier.mjs` | Exact quote snapshots, keyboard focus/Escape, excluded editable controls, unavailable/oversize gates, no automatic send and dismissal. |
| `tests/static-responses.mjs` | HTML transport integrity, Unicode/MIME preservation, malformed metadata rejection, offline fallback and private/API bypass, using fixture responses. |
| `tests/practice-studio.mjs` | Reported in the implemented follow-up above; passed again after stopped-status handling. |

Windows-only harness repairs changed imports of temporary absolute filesystem paths into file URLs in offline-client, account-action-scope and practice-storage. Practice-storage uses a Windows junction rather than a privileged directory symlink. These changes preserve test assertions and application behavior.

Server integration is **blocked in this Windows environment**: the parent run reports the Worker executable fails at startup with an access violation. These source/harness passes do not establish local-server or hosted-server integration success. The parent owns browser fixture checks and publication verification. Content/curriculum validation is handled separately; it was not duplicated by this reviewer.

## Independent charcoal/editor inspection

The current palette gives calculated sRGB contrast ratios of 13.13:1 for main text on the panel, 7.67:1 for muted text on the panel, 5.78:1 for purple text on the panel, and 5.62:1 for white text on the filled purple primary button. The inspected syntax palette also contrasts clearly against the editor and active-line backgrounds. CodeMirror explicitly uses dark styling, a bright cursor and a purple selection background while retaining the stable editor/undo lifecycle. These are source/color calculations; rendered clipping and actual focus behavior require the parent's browser inspection.

One further concern was sent to the parent: the initial charcoal control border (`#45434e`) is only 1.56:1 against the matching panel/input background (`#25262b`), making unfocused form-field boundaries difficult to see. A brighter border specifically for controls avoids brightening every decorative divider. Track the parent's final CSS/visual verification for the resolution.

Targeted ESLint completed with four errors in existing PracticeStudio patterns: render-time writes to `latest.current` and `contextRef.current`, and synchronous `setBusy` / `setCompletedCurrent` inside effects. All four flagged patterns are present in HEAD before these practice changes. CodeEditor produced no lint errors. They were reported rather than changing the existing account/stale-response lifecycle during this scoped test pass; TypeScript and the focused behavior suites pass. This report does not claim a clean lint run.
