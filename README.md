# CodeQuest

A coding-learning app with 103 original topic projects across HTML, CSS, JavaScript, Python, SQL, Swift, TypeScript, React, backend development, and developer tools. Each track has beginner, intermediate, and advanced work, with math where it helps the project.

The purple and lavender interface includes in-depth theory in small steps, familiar analogies, practice questions, a real code editor, project checks, a portfolio, XP, streaks, goals, and calm mode. Signed-in work and preferences save in D1. Device drafts belong to the current account; saved history keeps the previous 30 versions per topic. Backups export learning records and restore project files; completion records remain tied to checked lessons.

## Lesson explanations

All 103 lessons have 7–9 focused theory pages, with 225 worked code examples. Each introduces required vocabulary and symbols, explains how the code works, gives expected results and changed-input cases, and covers the quiz/project requirements before practice. Relevant math stays with the lessons that use it. Examples use explicit language fences, exact whitespace and indentation, syntax colors for supported editor languages, horizontal scrolling, and raw-code copying. HTML examples render as text. Inline code terms are visually distinct. Back/Next focuses the start of the new theory page. Swift and terminal snippets preserve their source as plain monospace code.

The SQL subquery project correlates each score with its own subject and includes a discriminating fixture. Python streaming work processes a one-shot input once and performs shallow-size comparison in a separate helper. CSS positioning checks use actual geometry and numeric transform/pivot values, including border-box layout. Real browser verification passed the intended CSS layout and rejected the wrong rotation.

Validation: `node tests/lesson-display.mjs` checks exact source/indentation, syntax spans, inline terms, and escaped HTML; `python3 tests/theory-examples.py` checks all theory fences and Python/JavaScript/JSON syntax. Additional TypeScript/JSX and Swift syntax checks passed; all 20 SQL example blocks executed in their lesson setups. Selected Python and JavaScript worked outputs were executed and matched the text. Syntax checks are not universal runtime verification. Existing lesson solutions, offline behavior and provider routing checks passed; CSS layout/motion requires a browser, and SwiftUI/local-server/deployment work retains its stated manual steps.

## Tutor

Need to remove a saved key? See [API key storage and removal](docs/api-key-removal.md) for the steps in CodeQuest, how to revoke a key through your AI provider, and what to do if a key was accidentally uploaded to GitHub.

In Settings, choose DeepSeek, OpenAI (ChatGPT), or Claude (Anthropic) and save a key from that provider’s developer account. Only the connected assistant is then visible; **Change provider** opens the choices again, and Cancel keeps the existing connection. A successful switch replaces provider and credential atomically. Each account must connect its own key; there is no shared server-key fallback. Keys are saved on the server, encrypted using `AI_KEY_ENCRYPTION_KEY`, with account/provider-bound authenticated encryption, and excluded from offline storage and backups. Existing bare encrypted DeepSeek keys remain compatible. The server routes from saved metadata to fixed official endpoints and never falls back to a different provider. The adapters use `deepseek-flash`, OpenAI Responses with `gpt-6.1-sol`, and Anthropic Messages with `claude-sonnet-4-6`, including the lesson, level, code, and recent conversation. It supports plain explanations, hints, small steps, and code review. Tutor requests are unlimited in CodeQuest for new and existing accounts. Legacy saved caps are ignored; the atomic daily counter records usage only. External provider limits and API billing still apply. Highlight lesson prose or a static code example to open a quoted-passage popup. Explain this sends that exact passage to the connected provider with lesson context; selection alone sends nothing. The popup explains unavailable AI/offline states and excludes editable project fields. Alt + Enter focuses its action, and Escape dismisses it. No live provider answer is verified until a valid key is used.

## Running projects

JavaScript, HTML, CSS, React, TypeScript, Python, and SQL run in isolated browser previews. TypeScript uses its real compiler; Python uses Pyodide; SQL uses SQLite through sql.js. Open Settings online and choose **Download offline pack** once on each device. The verified static pack is about 31.8 MB and contains the full app, all 103 lessons, and pinned Python, SQLite, TypeScript, and React runtimes. JavaScript, HTML, CSS, Python, SQL, TypeScript, and React browser projects then run offline. Swift still uses the Mac companion, and external packages, live websites, or deployment steps may need a connection. The preview cannot access the signed-in app's storage or APIs. JavaScript, Python, TypeScript and SQL computations run in workers, with a stop action and time limits. DOM/React previews use a separate opaque-origin frame.

Swift uses the downloadable macOS companion in Settings. It runs actual Swift compilation and checked programs in Apple's sandbox. SwiftUI interaction requires Xcode and manual confirmation. See the companion README for supported toolchains, browser local-network restrictions, and current Foundation compile limitations.

Backend and development-tool projects include additional editable files, downloads, and concrete instructions for local servers, Git, package managers, testing, and deployment. Local or Xcode steps have a separate explicit confirmation; browser checks alone do not certify those steps.

## Development

This public repository is a clean source snapshot. It contains no API keys, user database, or private deployment history. The existing hosted app keeps its own access settings. To publish your own copy with Sites, register it as a new project; the included `.openai/hosting.json` contains generic database bindings and no live project ID. API key storage requires your deployment's own `AI_KEY_ENCRYPTION_KEY` server secret. Never commit that secret or a user's key.

Use Node 22.13 or newer and `npm install`, then `npm run dev`. The first dev/build run downloads the pinned third-party runtimes listed in `public/vendor/manifest.json` and verifies their sizes and SHA-256 checksums. Later runs reuse verified local copies. These generated copies are excluded from Git. Preserve the Sites Worker setup and `.openai/hosting.json`. Database migrations are in `drizzle/`; runtime tables are not created by requests. `.dev.vars`, local runtime state, credentials, and test databases are excluded from source publication.

Validation scripts in `tests/` check original lesson solutions, real Python/SQL fixtures, local backend servers, account checks, history, usage/key setup, and completion conflicts. Browser fixtures are disposable local data and are never published to production D1.

## Offline learning and settings

AI is enabled by default and can be disabled in Settings. The server rejects tutor requests while it is disabled, before reading the key, counting requests, or contacting any AI provider. Live AI requires internet and a user-provided key; written hints and simpler lesson explanations work offline.

Settings also control lesson hints, familiar examples, matching math practice, XP/streak/badge visibility, larger reading text, calm mode, light/dark appearance, daily goals and automatic sync. Disabling math removes that completion requirement for suitable lessons; hiding rewards keeps earned progress.

IndexedDB keeps account-scoped learning state, an immutable pending-write queue, and code history. Offline answers, code, preferences, and completions survive reload. Replay verifies account identity and sends a scope guard checked on every server mutation. Saves compare their original code with the current account copy; conflicts preserve both versions, including newer local edits, for a deliberate choice. Replays never duplicate completion XP. Completion dates retain the offline learning date in UTC. Automatic sync runs while the app is open; Sync now is available when automatic sync is off.

The service worker caches only an approved static shell and verified public runtime assets. It excludes API routes, authentication responses, private account HTML, and secrets. The signed-in account is checked online; offline access uses the account last saved on this browser. Downloaded work is available to anyone using the same browser profile, so use a personal device. Removing downloads leaves local work intact. Browsers may evict cached files; Settings verifies that all pack files remain present. Back up work using Download backup.

The offline runner loads trusted public runtime bytes in the parent and passes them into the opaque sandbox. User code cannot access app cookies, storage, or APIs; workers run without external network fetches. Python supports the bundled standard library, not every third-party package.

Validation: `node tests/offline-client.mjs`, `node tests/offline-cache.mjs`, and authenticated local `python3 tests/offline-server.py`; real browser verification additionally disconnects the local app server, reloads from the downloaded shell, executes supported runtimes, and checks reconnect synchronization.


Provider validation: `node tests/ai-providers.mjs` covers provider/account-bound encryption, legacy key compatibility, fixed routing, two-turn history, response parsing, truncation, and sanitized errors without fallback. `python3 tests/ai-providers-server.py` uses disposable local credentials to verify atomic saves, reloads, invalid replacement preservation, identity guards, AI-off/provider-change gates before usage counting, and disconnect. Provider HTTP responses are mocked; a live response requires a valid user key. ChatGPT and Claude subscriptions do not include API billing.

Official API references: [OpenAI Responses/text](https://developers.openai.com/api/docs/guides/text), [OpenAI conversation state](https://developers.openai.com/api/docs/guides/conversation-state), [Anthropic Messages](https://platform.claude.com/docs/en/api/messages/create), [Claude stop reasons](https://platform.claude.com/docs/en/build-with-claude/handling-stop-reasons), and [DeepSeek quick start](https://api-docs.deepseek.com/quick_start/).

Tutor and key validation: `node tests/unlimited-tutor.mjs` checks retired-cap boundaries across all providers, concurrent counts, availability guards and external rate-limit propagation. `node tests/selection-clarifier.mjs` checks exact quote snapshots, keyboard use, unavailable states, excluded selections and dismissal. `node tests/account-keys.mjs` checks each account uses its own encrypted key, rejects decryption with another account and ignores a shared environment key. These use synthetic credentials and mocked provider responses.
