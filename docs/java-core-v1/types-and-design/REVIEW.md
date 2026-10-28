# Java Core v1 — types and design, lessons 26–45

20 staged concept lessons, classic `public static void main(String[] args)`, stable Java25 language/API baseline with no preview flag. Existing lesson IDs and live app untouched.

## Artifacts

`lessons.json`, `support-map.json`, `headings.json`, `terminology.json`, `execution-cases.json`, full `companions/<case>/Main.java`, reproducible `author.py`, and `validate.py`. Forty fixtures:20 worked,12 successful changed programs and8 intended compile failures. Each negative supplies an intended diagnostic substring.

## Teaching boundaries

Visible explanations establish instance/reference aliasing, constructors, encapsulation, final bindings versus mutable objects, inheritance/interfaces, records and sealed types, equality/hash contracts, generic bounds/wildcards, boxing/null, checked exceptions, resource closure, Optional, type patterns and composition. Quiz choices are deterministically permuted with answer indices updated. Optional transfer tasks are visible and not prerequisites for reading completion.

No browser Java runtime is claimed. Source fixtures demonstrate small rules, not mastery or production readiness. Resource closure uses a labelled lifecycle trace, not a fabricated file operation. Java42 uses conditional return inside a helper so its after statement stays compile-time reachable; the successful changed fixture takes the early-return path at runtime. Type-pattern prose says explicit cast, not the distinct generic term unchecked cast.

## Source checks

Official Oracle Java SE25 Language Specification chapters4,5,6,8,9,11,14,15 opened and reviewed, plus Object and Optional API documentation. Topic anchors carried by every unit/support entry. No preview syntax or JDK download performed by this author.

## Validation status

Structural validator passes20 IDs/prerequisite chain, concept-only fields, exact visible support and worked-code matches, terminology/heading indexes, full classic-Main companions, visible optional tasks and all8 negative diagnostic expectations.

Tools worker completed actual JDK25 execution: all40 exact fixtures passed (32 successful compile/run outputs,8 expected compile rejections with intended diagnostics). Author verified every executed source-bundle SHA against current fixture code and found no lint diagnostics on successful compiles. Evidence: ../compiler-evidence/results.json and compiler-verification.json. Independent peer review passed; independent-semantic-review.json records final lesson/case hashes. No browser or learner-run claim.
