# CodeQuest

**[Open the app online](https://codequest.aurorax.chatgpt.site/)**

**ChatGPT sign-in is needed for the hosted app, but not for running this source locally.** There are two different ways to use CodeQuest offline:

- **Hosted app + offline pack:** sign in online once, download the pack in Settings, then use the downloaded lessons in that same browser while disconnected.
- **Local source on your computer:** install and start this repository with Node.js. No ChatGPT account or sign-in is required. Initial setup needs internet; see [Run the source locally without ChatGPT](#run-the-source-locally-without-chatgpt) for the setup and current Windows limitation.

CodeQuest is a coding-learning app for people who want small, explained steps, worked examples and understanding checks. The current release contains **1,221 lessons across 21 courses** and **1,029 terminology entries** on a variety of coding courses: AI, Back-End Development, C, C#, C++, CSS, Developer Toolkit, Go, HTML, JAVA, JavaScript, Kotlin, PHP, Python, R, React, Ruby, Rust, SQL, Swift, TypeScript. This is a bounded curriculum, not a claim to cover every API or certify mastery. Courses have been created with ChatGPT and may contain errors. Some gaps in terms of topics have been filled in according to free MIT teachings available online. 

## Online through ChatGPT / Sites

Open https://codequest.aurorax.chatgpt.site/ and sign in with ChatGPT when prompted. Public Site access permits visitors; individual learning records still belong to the signed-in account. A ChatGPT subscription does not supply third-party API credits.

Lessons, code examples and projects are built into the app. Coding Buddy is optional and needs internet plus your own supported provider API key; provider charges may apply. Keep keys out of this repository. See [API key removal](docs/api-key-removal.md).

## Hosted app offline pack: sign in and download first

This is the Settings download in the hosted app. You do not install the GitHub source for this option.

1. Open the hosted app online in a personal browser profile, sign in with ChatGPT when prompted, and let your account load.
2. In Settings, download the offline learning pack and wait for verification to finish.
3. Reopen CodeQuest in that same browser while disconnected. Cached lessons and supported browser code runtimes are available; local drafts and supported queued changes remain on that device.
4. Reconnect and check synchronization. Export backups before clearing browser data.

The pack is approximately 39 MB in this release. It is a browser download, **not a standalone HTML file or a fresh offline account installer**. The offline shell requires an account snapshot previously saved in the same browser. Browsers can evict caches. Anyone using that browser profile may access downloaded work.

Internet remains necessary for initial sign-in/download, account sync, Coding Buddy, API-key changes and external links. Concept-lesson completion and reading confirmations require the online account service; offline support is not identical to every online feature. Swift/native frameworks and real server/deployment exercises require their stated external tools. Python includes the bundled standard library, not arbitrary packages.

## Run the source locally without ChatGPT

This is a separate local installation, not the hosted app's Settings download. Your computer runs CodeQuest, and you use it through a browser at a local address. It does not require ChatGPT sign-in or import your hosted account data.

1. Download and extract this repository, or clone it with Git.
2. Install Node.js 22.13 or newer.
3. While connected to the internet, open a terminal in the project folder and run:

```sh
npm ci
npm run local
```

4. Open the printed local address (normally http://127.0.0.1:5173) in your browser. Keep the terminal running while using the app.
5. Before disconnecting, use Settings in this local app to download and verify its offline pack as a precaution for the browser code runners. Downloads made on the hosted website belong to that website's browser storage, not this local address.
6. For later sessions, run `npm run local` from the same project folder and open the printed address again.

The first setup downloads app dependencies and verified browser runtimes. Later starts reuse those files if they are intact. Local mode stores its own database and generated encryption key in `.codequest-local`; keep that folder private and backed up. This is not a single HTML file that you can double-click to run.

Coding Buddy still needs internet and your own supported provider API key, even in local mode. External links, additional packages, and exercises requiring external tools or services retain their own requirements. Downloaded lessons and supported browser runtimes do not need ChatGPT to run.

**Windows limitation:** the current Windows test machine could not start the Workers runtime (native access violation), so this release does not claim a verified standalone Windows installation. The hosted app's offline pack is a separate option; these instructions do not claim a fresh disconnected-device test.

For a separate hosted deployment, register a new Sites project and set its returned project ID. The public source manifest deliberately omits the existing Site identity. Configure your own AI_KEY_ENCRYPTION_KEY server secret if enabling encrypted provider-key storage. Never commit secrets or learner databases.

## Verification and provenance

Source is synchronized from hosted version 75 (commit 108f73fc5b297017deb3aeec73ab7d6f49db407d), with public documentation and deployment-identity sanitization. Authenticated live samples verified headings, navigation and server recovery. Phone checks are partial; not every layout or interaction has been tested.

The offline artifact test verifies all 57 file hashes, HTML transports and dependencies. Cache tests cover verified download, failed-update preservation, API/auth exclusion and offline navigation. These checks do not substitute for a fresh disconnected-device browser acceptance test. Historical tests referring to private Sites commit hashes need that original history and cannot run unchanged from this source snapshot.

## Licensing

CodeQuest's original application code is licensed under the [MIT License](LICENSE), copyright 2026 AuroraX98. Authored lessons, curriculum prose, explanations, exercises and other teaching content are excluded from this grant, including teaching content embedded in source files. Third-party code, data and assets retain their own licenses; existing file-specific licenses remain in force.

Preserve [third-party notices](public/third-party/README.txt), vendor license files and source links when using covered components. [Notice scope](docs/third-party-notice-scope.md) records remaining attribution questions; this release does not assert legal clearance or complete dependency-license closure.
