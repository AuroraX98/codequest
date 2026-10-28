# CodeQuest

**[Open the app online](https://codequest-personal-learning.aurorax.chatgpt.site)**

Sign in with ChatGPT when prompted to access your own learning records.

CodeQuest is a coding-learning app for people who want small, explained steps, worked examples and understanding checks. The current release contains **1,221 lessons across 21 courses** and **1,029 terminology entries**. Backend has 43 lessons, Developer Toolkit 24 and AI 32. This is a bounded curriculum, not a claim to cover every API or certify mastery.

## Online through ChatGPT / Sites

Open https://codequest-personal-learning.aurorax.chatgpt.site and sign in with ChatGPT when prompted. Public Site access permits visitors; individual learning records still belong to the signed-in account. A ChatGPT subscription does not supply third-party API credits.

Lessons, code examples and projects are built into the app. Coding Buddy is optional and needs internet plus your own supported provider API key; provider charges may apply. Keep keys out of this repository. See [API key removal](docs/api-key-removal.md).

## Offline after an initial online setup

1. Open the hosted app online in a personal browser profile and let your account load.
2. In Settings, download the offline learning pack and wait for verification to finish.
3. Reopen CodeQuest in that same browser while disconnected. Cached lessons and supported browser code runtimes are available; local drafts and supported queued changes remain on that device.
4. Reconnect and check synchronization. Export backups before clearing browser data.

The pack is approximately 39 MB in this release. It is a browser download, **not a standalone HTML file or a fresh offline account installer**. The offline shell requires an account snapshot previously saved in the same browser. Browsers can evict caches. Anyone using that browser profile may access downloaded work.

Internet remains necessary for initial sign-in/download, account sync, Coding Buddy, API-key changes and external links. Concept-lesson completion and reading confirmations require the online account service; offline support is not identical to every online feature. Swift/native frameworks and real server/deployment exercises require their stated external tools. Python includes the bundled standard library, not arbitrary packages.

## Run the source locally

Use Node.js 22.13 or newer, then:

```sh
npm ci
npm run local
```

Open the printed loopback URL (normally http://127.0.0.1:5173). Local mode has its own database and generated encryption key, requires no ChatGPT sign-in, and does not import hosted account data. Keep .codequest-local private. Installation and the first runtime preparation require internet; later operation still depends on installed tooling and the feature limits above. The current Windows test machine could not start the Workers runtime (native access violation), so this release does not claim a verified standalone Windows installation.

For a separate hosted deployment, register a new Sites project and set its returned project ID. The public source manifest deliberately omits the existing Site identity. Configure your own AI_KEY_ENCRYPTION_KEY server secret if enabling encrypted provider-key storage. Never commit secrets or learner databases.

## Verification and provenance

Source is synchronized from hosted version 75 (commit 108f73fc5b297017deb3aeec73ab7d6f49db407d), with public documentation and deployment-identity sanitization. Authenticated live samples verified headings, navigation and server recovery. Phone checks are partial; not every layout or interaction has been tested.

The offline artifact test verifies all 57 file hashes, HTML transports and dependencies. Cache tests cover verified download, failed-update preservation, API/auth exclusion and offline navigation. These checks do not substitute for a fresh disconnected-device browser acceptance test. Historical tests referring to private Sites commit hashes need that original history and cannot run unchanged from this source snapshot.

## Licensing

No blanket open-source license has been granted for CodeQuest's original application code or authored curriculum in this repository. Public visibility is not an MIT license or permission to redistribute/relicense those works. No MusicQuest license applies here. Existing file-specific licenses remain in force.

Preserve [third-party notices](public/third-party/README.txt), vendor license files and source links when using covered components. [Notice scope](docs/third-party-notice-scope.md) records remaining attribution questions; this release does not assert legal clearance or complete dependency-license closure.
