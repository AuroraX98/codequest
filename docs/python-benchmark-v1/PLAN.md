# Python benchmark depth extension

21 genuine language/computational problem-solving depth additions; not university equivalence or exhaustive Python.

- **python-71 — Bounded exhaustive search** (beginner): Enumerate a finite candidate space, test a predicate and report bounded failure honestly.
- **python-72 — Bisection and a shrinking bracket** (intermediate): Maintain a root bracket and stop by bracket width or a finite iteration limit.
- **python-73 — Choosing tests from a specification** (intermediate): Select valid, boundary and invalid input partitions rather than repeat one happy case.
- **python-74 — Localizing a defect** (intermediate): Follow observed state and the first wrong assumption using a minimal failing example.
- **python-75 — Recursive calls and returning results** (intermediate): Separate base case, progress and each call frame; trace values returning in reverse order.
- **python-76 — Readable object representations** (advanced): Define __str__ and __repr__ for different display purposes; both return strings.
- **python-77 — Value equality and unsupported comparisons** (advanced): Implement __eq__ for meaningful fields and return NotImplemented for unsupported types.
- **python-78 — Equality and hash consistency** (advanced): Equal hashable values need equal hashes; mutable value-equality objects should not offer unstable hashes.
- **python-79 — Counting work instead of guessing speed** (intermediate): Define input size and an operation being counted, separating count from elapsed time.
- **python-80 — Growth rates and logarithmic halving** (intermediate): Compare constant, linear, nested quadratic and halving work; distinguish upper bound from exact count.
- **python-81 — Binary search in a sorted sequence** (intermediate): Maintain a sorted search interval and document which matching position is acceptable.
- **python-82 — Insertion sort and a sorted prefix** (intermediate): Build a sorted prefix, move larger items and preserve equal-item order.
- **python-83 — Merging two sorted sequences** (intermediate): Choose the smaller next item, preserve duplicates and append the unconsumed tail.
- **python-84 — Merge sort and divide-and-conquer** (advanced): Split until a base case, recursively sort and merge; relate levels to linear work per level.
- **python-85 — Handling grouped failures** (advanced): ExceptionGroup contains multiple failures; except* selects matching subgroups without hiding the rest.
- **python-86 — TaskGroup failure and cleanup** (advanced): Structured task lifetime awaits children and cancels siblings on failure while cleanup runs.
- **python-87 — Replacing a dependency in a test** (advanced): Supply a controlled callable, assert returned behavior and verify calls; explain patch lookup location when demonstrated.
- **python-88 — Useful logs without leaking data** (advanced): Configure a local logger/handler and levels, preserving useful context without secrets.
- **python-89 — Function and collection type contracts** (advanced): Read parameter/return and nested collection annotations while distinguishing static checking from runtime validation.
- **python-90 — Measuring a small operation with timeit** (advanced): Repeat a callable with setup excluded appropriately and interpret noisy elapsed measurements.
- **python-91 — Finding work with a profiler** (advanced): Use cProfile to locate call counts and accumulated time, not prove asymptotic complexity.

Native environment work extends existing lessons 17/19, not browser installation claims. All new callable teaching must pass the visible example/breakdown gate. Source matrix and exact prerequisites are in coverage-plan.json. Numerical/modeling specializations remain optional.
