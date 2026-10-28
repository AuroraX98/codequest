# Rust27–46 types and design

20 staged micro-lessons,40 worked/changed fixtures. Standard library only, stable Rust1.99.1, edition2024. No live app or GitHub changes.

## Evidence
- `author.py` regenerates lessons, exact support paragraphs, navigation headings, terminology,40 companions and fixture metadata.
- `validate.py`:20/20 structural PASS, including ordered prerequisites, visible worked code, meaningful causal feedback, visible optional practice and essential term anchors.
- `compiler-verification.json`: all40 current source bundle hashes matched to actual Tools receipts,32 successful executions and8 intended compile rejections. The updated35 missing-trait-implementation case replaces its earlier weaker changed-string case; dedicated compiler receipt records E0277. Other39 sources unchanged.
- Intentional errors cover moved struct field, missing mutable binding, generic mismatch, missing trait implementation, dangling local reference, conflicting closure borrow, moved capture and private module visibility. No intentionally invalid executable or unsafe code is run.
- Lesson46 actually builds a supplied Cargo path dependency offline, with no registry or provider calls. Examples may produce retained teaching-scope warnings; no zero-warning claim.

## Semantic scope
Question-mark propagation is not panic. Struct fields retain ownership rules. Receiver borrow versus ownership is explicit. Derive cannot bypass field requirements. Generic bounds and trait objects both require implementations. Lifetime labels express relationships rather than extend owners. Iterator adapters are lazy and consumption advances state. Closure capture is separated from call count; move closures may still be repeatedly callable. Collecting Result items chooses a short-circuit policy. UTF-8 bytes, scalar values and graphemes are distinct. Hash collections have no asserted iteration order. Module imports do not download packages; Cargo edition is not compiler version.

## Primary references
Official Rust Book, standard library and Cargo Book linked per unit. Freshly checked lifetime chapter, closure chapter, Iterator API and Cargo dependency reference. Peer-required first-use bridges include use, static string literals, tuple/unit structs, inferred Result error type and Option copied/unwrap_or chain. All are visible before relevant checks.
