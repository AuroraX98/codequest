# Bounded remediation plan: Kotlin / Go / Rust / PHP

Status: awaiting acceptance; no content authored or source edits.
82 partial records: 67 minimal fixes; 15 explicit reference deferrals.

All existing quiz/check/project fields and paragraph positions stay unchanged. A new short worked companion is appended inside an existing paragraph only when the contract lacks an actual invocation. Existing worked code is retained. No new lessons.

## kotlin: 8 fixes / 7 deferrals
- kotlin-09 p0 **Number.toLong** — defer-reference, unassessed-reference: Narrow the opening conversion description to the demonstrated Double.toInt; explicitly label other numeric conversions as further API references, not a prerequisite. Quiz and practice only change the sign of the toInt input.
- kotlin-09 p0 **Number.toDouble** — defer-reference, unassessed-reference: Narrow the opening conversion description to the demonstrated Double.toInt; explicitly label other numeric conversions as further API references, not a prerequisite. Quiz and practice only change the sign of the toInt input.
- kotlin-10 p2 **String.uppercase** — defer-reference, unassessed-reference: Keep String immutability statement but remove the unexplained named uppercase example or explicitly label it a later API reference. Quiz/task concern interpolation and content equality only.
- kotlin-16 p2 **IntProgression.step** — defer-reference, unassessed-reference: Keep the bounded integer progression scope; mark stride/descending API variants as optional reference only. Neither closed-versus-half-open quiz nor task requires calling them.
- kotlin-16 p2 **Int.downTo** — defer-reference, unassessed-reference: Keep the bounded integer progression scope; mark stride/descending API variants as optional reference only. Neither closed-versus-half-open quiz nor task requires calling them.
- kotlin-26 p2 **also** — fix, quiz-required-contrast: Append a tiny standalone also call on a different short String; identify receiver, it, ignored lambda result and returned original String. Keep original let example and quiz unchanged.
- kotlin-32 p0 **List.toMutableList** — fix, quiz-required-contrast: Append a visible call copying a small list, mutate only the copy, and display independent outer sizes; state elements are still shared references.
- kotlin-36 p1 **Detail.label extension** — fix, quiz-required-dispatch: Append a small complete two-receiver example calling both Base-typed and Detail-typed extensions, with declared type and result explained.
- kotlin-42 p0 **check** — defer-reference, unassessed-reference: Keep argument-versus-state distinction as an explicitly deferred comparison; point to the later concrete check use (lesson55) rather than require unseen invocation here. Quiz/task only invoke require.
- kotlin-43 p1 **IllegalArgumentException constructor** — fix, quiz-required-exception-path: Append the failing resource-block variant as a complete small worked example with body, close, caught output and message-constructor role.
- kotlin-48 p1 **Comparator.reversed** — fix, quiz-required-contrast: Append an explicit order.reversed() call with bounded setup and resulting full reverse order; explain comparator receiver/result.
- kotlin-50 p0 **java.io.File constructor** — fix, required-worked-contract: Add one contract sentence: File(path) creates a path-representing object; writeText creates/replaces the file contents, not construction alone.
- kotlin-52 p0 **Instant.parse** — fix, required-worked-contract: Explain ISO instant text input and Instant result using the existing exact call.
- kotlin-52 p0 **ZoneId.of** — fix, required-worked-contract: Explain zone-ID string input and ZoneId rules-object result using existing calls.
- kotlin-60 p0 **ensureActive** — defer-reference, unassessed-reference: Retain requirement that CPU-bound work cooperate with cancellation; label ensureActive as an advanced CPU-loop reference outside this suspending handshake example. Quiz/task require cancelAndJoin/finally only.

## go: 11 fixes / 2 deferrals
- go-07 p1 **go run** — defer-reference, unassessed-reference: Retain builds-before-running contrast, explicitly scope hands-on instruction to supplied go build command; cross-reference later concrete go run module lesson41. Quiz/task only rebuild a prior executable.
- go-18 p2 **len(slice)** — fix, explicit-taught-contract: Append a short initialized-slice fragment with fmt.Println(len(view)) and result2, explicitly tying length to the half-open view rather than owner length.
- go-34 p0 **error.Error** — fix, quiz-required-error-reporting: State Error returns diagnostic text and append a concrete errors.New(...).Error() invocation/result using known imported packages.
- go-35 p1 **errors.As** — defer-reference, unassessed-reference: Label typed error extraction as a later/reference-only API and keep errors.Is sentinel-chain coverage complete. Quiz/task only contrast %w and %v; no typed-target exercise remains.
- go-47 p1 **testing.B.Fatalf** — fix, quiz-required-failure-path: Explain B receiver, format/arguments, failed-benchmark effect and stopping current benchmark; link to earlier T.Fatalf analogy without treating receiver types as identical.
- go-48 p0 **io.Reader.Read** — fix, explicit-protocol-contract: Add a tiny explicit Read into a fixed byte buffer; explain buffer input, n bytes, error and processing returned bytes. Keep io.Copy example unchanged.
- go-48 p0 **io.Writer.Write** — fix, explicit-protocol-contract: Use the same tiny companion to call bytes.Buffer.Write on the returned byte slice; identify count/error and resulting buffer.
- go-49 p1 **os.File.WriteString** — fix, required-worked-contract: Explain string bytes input and (byte count,error) results, including why the current underscore discards count while handling error.
- go-60 p1 **atomic.Int64.Store** — fix, optional-task-needed-api: Append safe single-thread Store(value)/Load example showing replacement; keep concurrent Add example and warn separate Load/Store is not one update.
- go-62 p0 **ResponseWriter.Header** — fix, required-worked-contract: Explain Header returns the pending mutable header map and Set writes that map before commitment.
- go-63 p1 **http.NotFound** — fix, quiz-and-optional-test-required: Explain writer/request inputs,404 status and standard body side effect; add a small recorder companion calling NotFound and observing status/body.
- go-64 p1 **io.ReadAll** — fix, required-worked-contract: Explain reader input, remaining bytes result and error; retain known bounded fake body and explicit Close policy.
- go-64 p0 **Request.Context** — fix, required-worked-contract: Explain no-argument request method returns its attached context, then Err observes cancellation/deadline in the fake transaction.

## rust: 20 fixes / 3 deferrals
- rust-12 p2 **str.chars** — fix, required-worked-contract: Explain chars returns a scalar-value iterator and count consumes it; retain the concrete existing chain.
- rust-14 p1 **array.len** — fix, explicit-taught-contract: Append initialized-array len call and count3; distinguish count from last index.
- rust-14 p3 **slice.get** — defer-reference, unassessed-reference: Keep invalid-index warning and explicitly defer the safe Option-returning get demonstration to lesson67; current quiz/task use only valid direct indices.
- rust-24 p1 **slice.len** — fix, required-worked-contract: Explain view.len returns element count of the borrowed range, not owner length, using existing concrete receiver.
- rust-43 p0 **HashMap.new** — fix, required-worked-contract: Explain new constructs an empty map with key/value types inferred or annotated before the existing entry calls.
- rust-43 p0 **HashMap.insert** — defer-reference, unassessed-reference: Describe owned keys using the actually demonstrated entry(key) insertion path; mark direct insert as an optional API reference, since quiz/task require entry/or_insert and counts only.
- rust-43 p4 **HashMap.len** — fix, optional-task-needed-api: Add a compact worked len observation for a small map (including repeated key) inside the existing optional-practice paragraph; explain distinct entry count.
- rust-44 p0 **HashSet.new** — fix, required-worked-contract: Explain new returns an empty HashSet whose element type is inferred from subsequent inserts.
- rust-48 p0 **Display.fmt** — fix, quiz-required-error-path: Append a complete bounded error-formatting companion using the existing custom error, visibly invoking Display and write!; name borrowed formatter/message and Result effect.
- rust-48 p0 **write!** — fix, quiz-required-error-path: Append a complete bounded error-formatting companion using the existing custom error, visibly invoking Display and write!; name borrowed formatter/message and Result effect.
- rust-51 p0 **RefCell.new** — fix, required-worked-contract: Explain new wraps supplied initial value in a RefCell without borrowing it yet.
- rust-51 p0 **Result.is_err** — fix, required-worked-contract: Explain is_err takes the returned Result and reports whether it is Err without extracting payload.
- rust-52 p0 **Arc.clone** — fix, required-worked-contract: Explain Arc::clone(&value) adds a strong owner of the same allocation instead of cloning the inner integer.
- rust-52 p1 **Option.is_some** — fix, required-worked-contract: Explain is_some reports the optional-reference variant as Boolean without extracting it.
- rust-53 p0 **Mutex.new** — fix, required-worked-contract: Explain Mutex::new(initial) returns a new unlocked mutex containing the initial value.
- rust-57 p0 **AtomicUsize.new** — fix, required-worked-contract: Explain initial integer argument and newly constructed atomic counter.
- rust-57 p1 **AtomicUsize.load** — fix, required-worked-contract: Explain load ordering input and returned current value after both joins.
- rust-57 p4 **AtomicUsize.store** — fix, optional-task-needed-api: Add a safe sequential store/load companion to support the optional comparison; state separate load/store is not an atomic increment.
- rust-57 p0 **Vec.new** — fix, required-worked-contract: Explain Vec::new returns an empty vector; later push supplies JoinHandles and inference fixes its element type.
- rust-59 p0 **str.as_bytes** — fix, required-worked-contract: Explain as_bytes borrows UTF-8 bytes of input without allocation or mutation, supplying Cursor input.
- rust-59 p1 **io.Error.new** — fix, required-worked-contract: Explain error-kind and message inputs create io::Error returned by invalid; retain current invalid-line fixture.
- rust-61 p1 **Vec.as_slice** — fix, required-worked-contract: Explain as_slice borrows all argument vector elements without consuming/copying Strings, enabling exact-one pattern.
- rust-61 p0 **env.args_os** — defer-reference, unassessed-reference: Keep non-Unicode boundary warning and explicitly defer OsString-based argv handling; worked invocation/quiz/task use Unicode strings only.

## php: 28 fixes / 3 deferrals
- php-17 p2 **isset** — fix, explicit-taught-contrast: Append a tiny initialized-null-entry comparison showing isset false and array_key_exists true, then zero is present; explain input/effect without changing coalescing quiz.
- php-17 p2 **array_key_exists** — fix, explicit-taught-contrast: Append a tiny initialized-null-entry comparison showing isset false and array_key_exists true, then zero is present; explain input/effect without changing coalescing quiz.
- php-36 p1 **BackedEnum.from** — fix, optional-task-needed-api: Append backed-enum from call for a valid value and caught ValueError for unknown text; contrast tryFrom null.
- php-39 p1 **require** — fix, quiz-required-contrast: Append a concrete repeated require companion using the already visible trusted helper.php, and its two loaded lines.
- php-39 p0 **include** — defer-reference, unassessed-reference: Retain unavailable-file warning distinction as reference only; hands-on and quiz remain require/require_once with trusted paths.
- php-41 p4 **__clone** — fix, optional-task-needed-api: Append complete small nested-object clone hook variant; explain implicit invocation on clone, receiver and replacing copied nested reference.
- php-44 p1 **plusOne callable** — fix, quiz-required-contrast: Append explicit plusOne(...), apply callback invocation and result using complete small setup.
- php-45 p1 **ReflectionClass.getAttributes** — fix, required-worked-contract: Explain Label::class input filters descriptors by the known attribute class.
- php-46 p4 **ReflectionMethod.getNumberOfParameters** — fix, optional-task-needed-api: Append small known-method inspection with one parameter, call/result and no invocation of inspected method.
- php-48 p0 **sort** — fix, quiz-required-contrast: Append a tiny explicit sort(array,SORT_NUMERIC) call showing mutation and integer reindexing.
- php-48 p4 **ksort** — fix, optional-task-needed-api: Append a bounded associative-array ksort call and resulting key order; explain in-place key ordering.
- php-49 p1 **extension_loaded** — fix, required-worked-contract: Explain extension-name input and Boolean availability result in the mbstring guard; reference fuller later environment lesson without skipping current contract.
- php-52 p0 **DateTimeImmutable constructor** — fix, required-worked-contract: Name timestamp string and DateTimeZone inputs, returned immutable date-time object and explicit-zone interpretation.
- php-55 p0 **exit** — fix, required-worked-contract: Explain exit(0) terminates CLI process with status0; append a bounded missing-argument execution observation, not a browser claim.
- php-56 p1 **ErrorException constructor** — fix, required-worked-contract: Name message, code0, severity, source file and line arguments and resulting throwable, linked to existing callback.
- php-57 p1 **max** — fix, required-worked-contract: Explain max selects the greatest supplied number; trace outer lower-bound selection in existing nested clamp.
- php-57 p1 **min** — fix, required-worked-contract: Explain min selects the least supplied number; trace inner upper-bound selection in existing nested clamp.
- php-60 p1 **urlencode** — fix, quiz-required-contrast: Append explicit form-style encoding call on a small component and literal result contrasted with rawurlencode.
- php-60 p4 **http_build_query** — fix, optional-task-needed-api: Add tiny query-map call with explicit PHP_QUERY_RFC3986, separator and returned query string; no URL/network execution.
- php-61 p1 **password_needs_rehash** — defer-reference, unassessed-reference: Retain evolving-hash policy warning but explicitly defer rehash workflow/API to production authentication design; quiz/task only verify candidates and salted-hash nondeterminism.
- php-64 p1 **is_dir** — fix, required-worked-contract: Explain path input and Boolean existing-directory test; no sandbox guarantee.
- php-64 p1 **mkdir** — fix, required-worked-contract: Explain directory path,0700 permissions and Boolean success; note process umask/platform effects without new system changes.
- php-64 p1 **ini_set** — fix, required-worked-contract: Explain directive/value string inputs, current-process setting effect and old-value-or-false result; current fixture sets only session configuration.
- php-64 p1 **session_save_path** — fix, required-worked-contract: Explain directory setter before session_start and previous-path result; no file created by setter alone.
- php-64 p1 **session_id** — fix, required-worked-contract: Explain no-argument getter versus identifier setter before reopening; no secure client identifier assumption.
- php-64 p1 **session_destroy** — fix, required-worked-contract: Explain destroying stored state for active session, without automatically clearing in-memory $_SESSION or browser cookie.
- php-64 p0 **unset** — fix, quiz-required-removal: Append a minimal initialized $_SESSION array key removal and fallback observation; actual persistence variant remains tested.
- php-64 p1 **session_set_cookie_params** — defer-reference, unassessed-reference: Keep Secure/HttpOnly/SameSite and fixation policy requirements; explicitly defer this web integration API until real cookie-enabled server/browser setup. CLI disables cookies, and no quiz/task requires making this call; task only identifies integration checks.
- php-65 p1 **PDO.getAvailableDrivers** — fix, required-worked-contract: Explain static no-argument method returns currently available PDO driver-name array used by strict membership guard.
- php-65 p1 **SQL COUNT(*)** — fix, required-worked-contract: Explain embedded SQL aggregate counts selected rows and fetchColumn reads its single scalar column; retain in-memory SQLite-only scope.
- php-68 p1 **array_sum** — fix, required-worked-contract: Explain input array and returned numeric total, using existing bounded accepted-integer list.

## Gates
- Parent accepts exact bounded plan before source-delta authoring.
- Stage proposed replacements and executable fixtures only; do not mutate canonical content.
- Actual installed toolchain tests for all new snippets and affected original/changed cases, with isolated disposable files and no external services.
- Independent semantic review of contracts, quiz prerequisites and each deferral.
- Integrator verifies stable fields, paragraph positions and exact source hashes before any publication.
