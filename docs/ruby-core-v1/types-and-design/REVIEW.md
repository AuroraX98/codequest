# Ruby27–44 types and design

18 staged micro-lessons; 36 exact executable fixtures. No live app changes.

Ruby4.0.9 official language/reference documentation is linked per unit. Core class/module, refinement, pattern-matching, assignment, Data, Object and Module documentation were checked during authoring. No Rails, external gems, network requests, YAML or FFI assumptions.

Every lesson has visible essential teaching, a complete local example, one changed-case check with causal feedback, optional local practice, exact support paragraphs, topic headings and definition-linked terminology. `python validate.py` checks structural correspondence, not semantic mastery.

Runtime execution is owned by the tools worker; see compiler-evidence/types and final compiler verification rather than treating reading completion as execution. Eleven changed examples intentionally fail at runtime to demonstrate missing writers, private/singleton/mixin receiver boundaries, argument forwarding, lexical constants, duck typing, frozen mutation, public dispatch and ordinary-method versus captured-block scope. All failures must pass syntax validation before the intended runtime diagnosis.

Fixture41 uses a fixed trusted helper.rb beside main.rb. No production/user data is read or written. Other fixtures have no external file dependency.
