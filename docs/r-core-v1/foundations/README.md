# R foundations 07–26

Twenty visible micro-lessons preserve the six starters. Each contains exact supporting concepts, a meaningful changed-case check with causal feedback, full local R source and a compact optional transfer. No optional CRAN package is needed.

`author.py` generates forty paired fixtures and the course artifacts. Structure checks are separate from actual runtime checks in `../compiler-evidence`. Actual baseline is R 4.5.0, not the latest release. Official online manuals/function references can describe newer/development versions; installed 4.5.0 help and executed fixtures constrain the taught behavior.

Independent review corrections: explicit escaped newline and no accidental trailing space in07; scalar numeric conditions may coerce rather than requiring a strict logical storage type in11; both logical masks are evaluated elementwise in14, with FALSE & NA yielding FALSE; function/method wording corrected25. The mixed positive/negative subscript transfer13 intentionally fails with its specific diagnostic.

No browser R runner, statistical mastery or complete environment reproducibility claim follows from reading completion. --vanilla controls startup behavior; it does not install dependencies or make every external condition identical.
