# Go27–44 types, design and tooling

18 staged micro-lessons and 36 worked/changed fixtures. No live app or GitHub edits.

## Evidence
- `python author.py` generates exact-support lessons, headings, terminology, companions and fixture definitions.
- `python validate.py`:18/18 structural PASS (IDs/prerequisites, exact paragraph support, worked code visible, causal feedback, optional practice, meaningful term/headings anchors).
- `compiler-verification.json`: independently matched all current source bundle hashes to Tools' actual official Go1.27.3 results. All36 outcomes pass:31 successful builds/runs,4 intended compiler rejections (pointer receiver interface, numeric constraint, slice comparable constraint, unexported package symbol),1 actual vet rejection without running malformed formatting. Lesson44 additionally runs actual passing/failing Go tests for the original/regressed implementation.
- Case40 changed was improved during review from a trivial string comparison to a meaningful noncomparable slice rejection. The dedicated updated40 receipt replaces only that old result; other35 compiled source bundles remain identical.
- Tool execution is offline, standard-library-only, GOTOOLCHAIN=local/GOPROXY=off. Lessons41/42 use supplied local files and local module replacement, not external provider calls.

## Primary sources
Official Go specification https://go.dev/ref/spec, errors package https://pkg.go.dev/errors, module file reference https://go.dev/doc/modules/gomod-ref, vet https://pkg.go.dev/cmd/vet and testing https://pkg.go.dev/testing. Specification/module/vet/testing sources freshly opened during authoring.

## Safety and teaching boundaries
Value receivers and pointer method sets are distinct. Embedded structs are composition, not class inheritance. Typed nil interface is compared without dereferencing. Failed assertions use comma-ok. Error wrapping preserves identity only with %w. Defer arguments are captured immediately and calls execute LIFO. Recovery is directly deferred in the same goroutine, not a recommended routine validation strategy. Generic slice access is length guarded. Type constraints are not checked arithmetic. Interface-containing comparable values can still conceal dynamic noncomparable values. Vet is not proof of correctness; go test verifies behavior, not function labels or reading completion.

Required peer changes included recover's nonpanic nil result, explicit if-initializer gloss, fenced local module/helper files, and the stronger comparable changed-case. All are included. The suspected43 double-escaped newline was disproved by direct source-byte inspection and actual execution; no unnecessary source change was made.
