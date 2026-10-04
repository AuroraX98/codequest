# Browser verification report

Verified on October 3, 2026 using the app in a real browser. Account-changing checks used disposable local data. One connected DeepSeek account was used for a live tutor response; its saved key was preserved. This report contains no credentials or private account details.

The checked navigation, lesson, editor, preference, backup, and selected offline flows worked. This is not a claim that every runtime, permission dialog, provider, or failure state has been exercised in a real browser. The remaining gaps appear below.

## Confirmed browser results

| Area | What was observed |
|---|---|
| Catalog and navigation | All 103 topic links opened the matching lesson title. All 10 tracks, 3 levels, and 4 career buttons were exercised. A search with no matches showed the empty state; clearing restored the results. |
| Theory | All 7 Python Basics theory pages opened through Back/Next. Native analogy expand/collapse actions worked. Copying a worked example preserved exact source, including its final newline. |
| Practice and math | Incorrect and correct math answers displayed their respective feedback. Quiz choice buttons were exercised, but their resulting feedback was not firmly observed in this browser batch. A Python project ran successfully, passed its checks, and **Finish this quest** showed the completion screen. |
| Editor and history | Online and offline edits saved. History opened and a previous version restored. Downloaded `python_basics.py` matched the current code. A deliberately endless JavaScript program stopped through **Stop** and showed “Run stopped.” |
| Multiple files | The CSS file selector switched between `styles.css` and `index.html` without losing edits. An auxiliary-file download was received and its contents checked. |
| Preferences | All 8 checkbox settings were exercised. Dark/Light appearance and daily goal 2/1 persisted after refresh. AI, hints, math, analogies, and rewards followed the corresponding visibility settings. Manual **Sync now** was exercised. |
| Backups | A learning backup downloaded without API key data. A valid backup restored project files; invalid JSON was rejected. |
| Provider connection interface | Synthetic keys exercised all 3 provider choices, connected-card visibility, **Change provider**, **Cancel**, and disconnect. Cancel preserved the existing connection. These interface checks made no live OpenAI or Claude request. |
| Live DeepSeek | A real tutor request returned an answer through the saved DeepSeek connection. The connection remained intact after verification. |
| Key-file interface | The published key-file setting was off by default, and the existing connected assistant remained DeepSeek. In the disposable local profile, opt-in toggled on/off, and the blank template downloaded as valid JSON with provider `deepseek` and an empty `apiKey`. File permission and writing branches have additional automated coverage described below. |
| Bold formatting | An actual tutor response rendered a Markdown bold word as a `<strong>` element with font weight 650. Literal Markdown markers no longer appeared around that word. |
| Selected-text clarification | Selecting a lesson word opened the popup. **Explain this** started one live request, and the browser displayed a complete DeepSeek reply explaining the selected word in context. |
| Offline pack and reload | **Download offline pack** on the hosted app completed and showed **Ready** for approximately 31.9 MB and 33 files after the HTML carrier fix. A permitted fixed-static-file service check confirmed the hosted manifest matched the build and both HTML carriers passed their encoded and decoded size/hash checks. In the earlier local browser pass, stopping the local server and reloading served the downloaded shell. Offline editor changes queued for sync; history restoration remained available. **Remove downloads** later showed its success message, kept saved work and 300 XP, and restored the **Download offline pack** control. |
| Project execution | Python, JavaScript, HTML, and CSS projects actually ran offline and displayed passing checks. React, TypeScript, and SQL also ran successfully in the connected local browser with passing checks. |

## Automated checks that support the browser results

Automated checks exercise additional branches with synthetic credentials, mocked transport, and disposable records. They supplement browser observations; they do not replace a live provider response or a browser permission test.

- Practice validation checks passed 54 focused parser cases, including safely handling JSON formatting, structured teaching examples, rejecting malformed content and hidden full answers, and keeping raw model values out of errors. Practice UI/storage checks passed account isolation, histories, completion guards and backup handling.
- Static-response and carrier checks passed the two exact logical HTML-to-text transport mappings, same-origin restrictions, unrelated redirect rejection, encoded and decoded size/hash validation, fallback preservation, vendor hash validation and synthesized HTML cache response normalization. Offline cache checks covered carrier downloads and failures alongside the existing five flows. The build-artifact suite verified all 33 files, both base64 transports, exact decoded source, manifest version and download size, and shell dependency coverage.
- Account-action scope checks passed 14 key/disconnect cases, including delayed identity reads, scope mismatch, account changes during requests, and ordinary same-account success.
- Key-file helper and UI suites passed parsing, opt-in and automatic-read gates, permission handling, empty-key disconnect, file clearing and failures, Safari blank replacement, stale-operation guards, and browser metadata that excludes plaintext credentials.
- Provider Worker checks passed 9 synthetic transport cases. Existing provider tests cover fixed routing, account/provider-bound encryption, response handling, and sanitized errors without changing providers on failure.
- Offline client checks passed 10 flows, including queued edits, reload, account switches, conflict recovery, reset history preservation, acknowledgement loss, completion replay, and credential exclusion.
- Original solution checks passed all 57 JavaScript-family projects and 31 Python/SQL projects using their corresponding native checks.
- Display checks passed source and indentation preservation across 8 runtimes, bold and inline-code combinations, literal Python exponent/output text, unmatched markers, and escaped HTML. Theory formatting checks covered 103 lessons, 734 pages, and 225 worked examples without reported failures.
- Practice server checks passed 43 generation, availability, and stale-result cases, plus strict JSON, dependency, filename, manual SwiftUI, and truncation checks. Eight concurrent usage updates were accurate. The fixtures reject course XP/progress writes, confirming practice does not award official XP. All 8 runtime prompt contracts were checked. Documented output comparisons were also executed in native Python and JavaScript, verifying list/array types and rejecting wrong output; this does not certify generated runtime code. Synthetic transport checks verified all 3 provider generation budgets without making live calls.

## Not yet confirmed in this browser pass

The TypeScript, React, and SQL runs now have observed passing browser results. Offline execution for those three runtimes was not repeated in this pass.

The two conflict-resolution buttons were not exercised live in this pass. Automated offline checks cover conflict recovery and retained history. The browser handled a reset confirmation automatically, so explicit **Cancel** behavior was not confirmed through that dialog; reset/history preservation has automated coverage.

Swift's Mac companion and SwiftUI/Xcode were unavailable for this pass. A browser check cannot certify those local steps. Live OpenAI and Claude credentials were not supplied, so those adapters were checked with synthetic responses only. Native file-picker interaction could not be completed through the permitted browser tooling; it was canceled without bypassing permissions. File permission prompts, supported-browser writes, and Safari's manual replacement remain unverified end to end.

A live DeepSeek Python Basics beginner project was generated and adopted after its example solution passed the isolated runner and its starter failed a check. All 10 teaching pages opened, including four formatted worked examples and a plain explanation of f-strings. All three difficulty choices were selected in the browser. Hint and explicit example reveal/hide controls worked. The reference code entered in the practice editor printed the expected sentence, passed four checks, and **Mark practice complete** saved the checked version. **History** displayed a saved version, and the separate practice backup control was exercised. A second, focused beginner project was generated and passed reference/starter validation; all eight teaching pages opened, including three worked examples. AI explanations and checks can still contain mistakes and need learner review. Other provider, difficulty and runtime combinations remain covered by structural and synthetic checks rather than live generation.

## User guides

See [API key storage and removal](api-key-removal.md), [Connect an API key from a file](api-key-file.md), and [AI practice projects](ai-practice-projects.md) for the corresponding workflows and their limits.

## App spacing review

On October 3, 2026, a focused spacing review covered AI practice creation, saved practice, lesson theory, quizzes, course projects, math, the tutor, Skill path, progress, Settings, and the optional key-file panel. The idea field now stacks below its label, descriptions and action rows have deliberate gaps, lesson paragraphs and instructions have room between them, and practice history/results have padding.

Observed desktop (1440 px), phone (390 px), and narrow phone (320 px) layouts kept the main navigation views and visible controls within the screen, without horizontal page overflow. All four course phases opened at 320 px. Topic/difficulty settings stack on small screens, editor actions wrap, and checkbox rows stay inline. Dark mode and 18 px larger lesson text were checked at 320 px without page overflow; the prior user preferences were restored. Build and source checks passed. These were visual and DOM layout checks; no tests that merely repeat CSS declarations were added. The rare sync-conflict notice received a stacked layout through source review and retains its existing behavior; a live conflict was not created for this visual pass.
