# Rust Core v1 integration

Frozen: all62 new lessons independently source-reviewed and all136 authored compiler cases passed.62 additive lessons Rust07–68 preserve all662 existing lesson/unit objects and reading IDs. Course68, app724. Concept mode supplies main visible teaching and understanding checks, not a browser Rust executor.

## Artifacts
all-sixty-two.json, all-headings.json, all-support-maps.json;56 terminology additions plus6 append-only shared term scope/link extensions, expected586 terms. Rust ownership is distinct from the existing manually-maintained C responsibility wording; Rust vector is distinct from the C++ library definition. Existing general definitions remain general, not narrowed.

## Verified runtime
Stable Rust1.99.1, edition2024; approved workspace-local toolchain. Standard library and explicitly supplied local Cargo dependency only; Cargo offline, no nightly or hidden crate downloads. Actual136/136 authored cases across68 lessons:121 successful runs,14 intended compiler rejections,1 intended unit-test failure. All68 worked examples exactly match tested code. Updated trait35 negative and awaited-outside-async64 diagnostic reasons explicitly verified.

Six extra parsing/boundary cases,120 joined concurrency runs and a stale executable/rebuild probe passed separately. Recorded warnings remain visible (such as deliberate unused-mut after a transfer change); no warning-free claim. Borrow/lifetime/type failures are compile-only, not undefined-behavior experiments.

Async64 creates then drops an unpolled future; no implicit execution is claimed.65 performs one poll of a guaranteed-ready future with a no-op waker. This is explicitly NOT a general executor, timer, waking mechanism, busy loop, or Tokio integration. No completed future is polled again.

## Coverage
Foundations/types/checked math/Unicode/arrays/functions; ownership/moves/Copy/clone/shared and mutable borrows/lifetimes/vector/slice/Option/Result/?; structs/methods/enums/patterns/traits/derive/generics/bounds/dynamic dispatch/lifetime annotations/iterators/closures/collect/UTF8/maps/sets; modules/Cargo/testing/custom errors; Box/Rc/RefCell/Arc/Mutex/threads/channels/Send/Sync/atomics; file/buffer/path/CLI/validation/Display; future/pin/poll boundaries/macros/unsafe contracts; bounded study pipeline.

Not every API, ecosystem crate/framework, serde specialization, async executor/network deployment, unsafe implementation/FFI, nightly, custom allocator or proof of advanced mastery. Optional local transfers remain visible; quiz completion is not a learner-run certificate. No GitHub synchronization.

## Token anatomy
Rust 'x' is a char Unicode scalar literal, not a String or UTF16 code unit. 'a and 'static are lifetime notation, not quoted literals. Distinguish these from Go rune constants and C/C++/Java/Kotlin character rules.
