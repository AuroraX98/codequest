# Empty optional-reference correction

Source baseline:7d92923014bab6ab6d643263f795e6d2b0ab931d.

The app passed a React element for every section's optional visual. React elements are truthy even when their component returns null. On AI01 the reference-text deduplicator correctly removed repeated canonical text, but that truthy empty visual still created Tell me more.

The shared flow now accepts a lesson/paragraph descriptor and checks the same authored visual/scene registries before rendering the expander. Missing current or future visuals cannot produce a blank optional panel. Empty fenced code is also excluded from optional reference text. No filler or duplicated subsequent step was added; essential text remains in visible sequential core steps.

All928 lessons/5671 authored explanation entries were audited against the shared eligibility and deduplication rules;116 have a real optional visual target. (Canonical completion has5670 keys because the first Python lesson uses its existing six-room structure.) Actual React component tests cover AI01, whitespace, empty fences, duplicates, unavailable future targets, meaningful distinct text and real visuals. Completion, account-scoped projects, course switching, multiline code layout, TypeScript and build remain checked. No browser-geometry claim.

Future authors should supply structured optional visual targets, not arbitrary truthy component wrappers. Optional prose must add information absent from the visible sequence; empty or repeated material stays hidden. Reading/progress identifiers, quizzes, data and navigation are unchanged.
