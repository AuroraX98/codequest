# PHP27–46 types and design

20 staged micro-lessons and40 worked/changed fixtures. PHP8.5.12 CLI; no live app/GitHub edits.

## Evidence
`author.py` generates full PHP snippets, exact-support paragraphs, essential headings, meaningful terminology links and companions. `validate.py` reports20/20 structural PASS. `compiler-verification.json` independently matches all current source bundle hashes to Tools' actual40/40 lint/runtime results:34 successful runs and6 intended errors (private access, uninitialized property, readonly reassignment, missing explicit interface contract, abstract instantiation and unresolved autoload class).

SPL/Reflection were verified available. Local include/autoload examples use supplied trusted files only. No web server, request lifecycle, database or network behavior is claimed tested.

## Teaching scope
Object identifier assignment differs from explicit variable references. Promoted property initialization and typed-uninitialized state are separate. Readonly is shallow for object-valued properties. Interface satisfaction is explicit, not structural duck typing. Traits are implementation reuse, not standalone types. Backed enum parsing handles unknown values deliberately. Static state is class-level, and postincrement semantics are visible. Namespace aliases do not load dependencies. require/require_once execute code from controlled paths. Cloning is shallow unless customized; == property comparison uses loose equality while === checks identity. IteratorAggregate and Generator have different consumption/reuse contracts. First-class callable creation does not invoke it. Attribute construction through reflection can execute code and is not automatic behavior or authorization.

## Primary sources
Official PHP manual pages linked per lesson. Properties, traits, attributes and cloning references were freshly opened. Peer-required clarifications include conditional expression syntax, postincrement before the check, exact fenced helper file, loose object-property equality, and a general interface-contract explanation instead of directly giving away its changed-case answer. All are applied without fixture source changes.
