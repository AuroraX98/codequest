# Go Core v1 integration

Frozen: all59 new lessons independently source-reviewed;130/130 authored actual Go1.27.3 cases passed.59 additive lessons Go07–65 preserve all603 existing lesson/unit objects and reading IDs. Course65, app662. Concept mode remains reading plus authored understanding checks, not a Go browser executor.

## Artifact contract
all-fifty-nine.json, all-headings.json, all-support-maps.json;53 new terminology entries and6 append-only shared-link/scope additions, expected530 terms. Go embedding is distinct from AI embedding; Go type parameter and Go switch case preserve language-context distinctions from existing definitions. No generic duplicate setup/example Tools cards.

## Runtime
Official workspace-local Go1.27.3, never /usr/bin/go (unrelated game). Fixtures use GOTOOLCHAIN=local,GOPROXY=off,GOSUMDB=off and supported buildvcs=false for isolated nonrepository examples. Standard-library-only and explicitly local module dependencies; no hidden package/toolchain downloads.

HTTP examples use recorder/direct handler invocation and custom in-memory RoundTripper. No DNS, socket/listener, TLS, remote service or deployment behavior is claimed. Race-detector checks, when recorded, cover actual exercised synchronized paths, not every possible schedule.

Actual baseline130/130 PASS:118 new worked/changed plus12 original starter cases.121 successful program/test cases,4 intended compiler rejections,1 intended vet rejection,4 intended test failures. Diagnostics and named-test markers independently verified. All65 worked sources match current fixtures, including rerun HTTP405 Allow header. Three extra boundary probes,6 actual race-detector runs and stale executable probe passed separately. Fuzz checks exercise seeds/invariants, not a long fuzz campaign; benchmark checks establish mechanism, not portable performance superiority.

## Scope
Types/constants/conversions/zero values/strings/runes/formatting/flow; arrays/slices/capacity/copy/maps/range; functions/multiple returns/variadics/closures; structs/receivers/embedding/interfaces/nil/type assertions/errors/wrapping/defer/recover/generics/type sets/comparable; packages/modules/gofmt/vet/testing/table tests/fuzz seeds/measurement; Reader/Writer/files/scanning/JSON/time; context/goroutines/channels/select/WaitGroup/mutexes/atomics/owned cancellation; handlers/recorders/client boundaries and bounded study pipeline.

Not every API, third-party framework, distributed/cloud/database deployment, unsafe/cgo/assembly internals, lock-free specialization, production security certification or proof of advanced mastery. All local transfer tasks remain visible; completion is not a learner-run certificate. GitHub synchronization stays paused.

## Token anatomy
Go single-quoted literals are rune constants (default type rune, alias int32), not Strings and not necessarily one UTF-8 byte. Double-quoted Strings hold bytes; indexing versus rune decoding differs. Preserve C/C++/Java/Kotlin distinctions.
