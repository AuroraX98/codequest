CodeQuest Swift companion (personal macOS use)

1. Save codequest-swift-runner.py to your Mac.
2. In Terminal run: python3 /path/to/codequest-swift-runner.py
3. Keep that Terminal open. Copy the new session token into CodeQuest's
   Swift companion token field. The app sends it only to 127.0.0.1:4319.
4. Open https://codequest-personal-learning.aurorax.chatgpt.site and run a
   Swift lesson. If your browser asks to allow local-network access, allow
   it for this site. Some browsers or managed devices may block a secure
   website from calling an HTTP loopback service; use a supported browser
   or the local development site when that restriction applies.
5. Press Control-C in Terminal when you are done. The token expires when
   the process stops. Restarting generates a different token.

Requirements: macOS, Python 3, Apple's sandbox-exec, and a Swift compiler
with a matching macOS SDK (Xcode or Command Line Tools). No Python packages
or external accounts are needed. If compilation reports an SDK/compiler
version mismatch, select a matching installed Apple toolchain; the runner
does not download or change your toolchain. Real arithmetic code compiled
and ran under the sandbox on the development Mac. A cold Foundation-based
compile reached the 30-second limit, so Foundation/iOS lessons remain
unverified on that toolchain. A failed compilation never passes checks.

SwiftUI lessons use compiler type checking only. The companion cannot run
an iOS Simulator or inspect a rendered SwiftUI screen. Follow the lesson's
Xcode steps and manual interaction rubric, then explicitly record your
manual review in CodeQuest. Compiler type checking alone does not establish
that the interface behaves correctly.

The service binds only to 127.0.0.1:4319 and accepts POST /run from exactly:
  https://codequest-personal-learning.aurorax.chatgpt.site
  http://127.0.0.1:5173
  http://localhost:5173
Browser preflight responses use the same exact origin list, including
private-network preflight support. Every run also needs the current Bearer
token. Keep the token private and use your own code and trusted lessons.
The service never logs learner code or authorization headers.

Requests must use application/json and a Content-Length <= 100,000 bytes:
  {"code":"print(2 + 3)","checks":[{"label":"Example","expression":"2 + 3 == 5"}],"typecheck":false}
At most 30 checks are allowed. Type-check-only requests must use checks: [].
Responses contain output, checks, and an error or manual flag when relevant.
Errors are also reported as non-passing checks; no substitute execution is
performed. CORS/token/request errors use an appropriate HTTP error status.

Compilation and execution use a fresh temporary directory. The sandbox
denies access by default: it permits system libraries, installed compiler
files when compiling, and this request's temporary directory. It permits
no network access or home-directory files. Compilation may launch only
toolchain executables; the lesson process cannot fork subprocesses. It can
read and write its own temporary files. Cleanup removes them after the run.
There is no unrestricted fallback if sandbox-exec is missing or fails.
Compilation has a 30-second wall limit and 25-second CPU limit. Execution
has a 3-second wall limit and 2-second CPU limit. Output files are capped
at 64 KiB each; the response shows at most 500 learner-output lines.
Compiler object/module files have a separate 128 MiB per-file resource cap.
A compiler cache lasts for one companion session and is deleted at stop.
The compiler can reuse it; running learner programs cannot read or write it.
Process groups are killed on completion/timeout so children cannot survive.
Lesson checks are learning feedback, not a secure examination mechanism.
