# Staged C-family function examples

41 accepted gaps across 34 existing lessons, 36 paragraph replacements. All other lesson fields and paragraph counts are unchanged; no live source changes. Seven reference-only decisions are retained in the parent plan. One supporting optional.has_value operation is also explicitly defined and worked.

- `paragraph-deltas.json`: exact before/after changes for integration, guarded against stale content.
- `lessons-proposed.json`: changed lesson objects only; do not replace whole catalog.
- `function-evidence.json`: 42 target anchors, including the supporting presence check.
- `execution-cases.json`: 21 isolated complete fixture sources/expected output.
- `runtime-evidence/results.json`: all 21 actual builds/runs pass; individual raw commands/stdout/stderr retained.
- `source-notes.json`: primary-source verification notes.

.NET SDK10.0.403/net10.0; JDK25.0.5.0.2; GCC14.2 C17/C++23. Only line-ending/trailing-space output normalization. No source code changes needed after fixture execution. .NET initial cache/runtime read-only failures are preserved separately, then resolved using workspace-local CLI/runtime directories and cleared NuGet feeds. Both safe ASan/UBSan examples pass with leak detection disabled due this environment; no leak-check or general memory-safety proof.

Root independently inspected all 36 deltas. Requested ToUpperInvariant identity/culture precision is fixed in final source; fixture code unchanged. Parent owns final integration.
