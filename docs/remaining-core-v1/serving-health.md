# Serving-health correction after version 74

Authenticated GET / requests repeatedly returned 500. Production logs identify Worker exceeded CPU time limit (32,000 ms), including request b02f43abbd6561f56dea663a5b5ef340 at 2026-10-28 02:14:19 UTC. No lesson-heading exception was logged.

The server page passed all curriculum records into a client boundary, generating a 5,006,461-byte React Flight payload on every request. A client wrapper now imports the same static curriculum, leaving only localMode at the boundary. Authentication remains in the server page. The measured Flight payload is 347 bytes. Local serialization measured 121 ms before and 1 ms after; these timings do not establish production CPU cost or prove recovery.

Validation: tests/page-flight.mjs uses React's real server serializer with the actual page source and an authenticated test fixture; it verifies the authentication call, retained localMode and bounded serialized payload. TypeScript and the supported build pass. Lesson content, headings, account storage, API handlers, access policy and GitHub settings are unchanged. Production browser and runtime logs remain the recovery acceptance check.
