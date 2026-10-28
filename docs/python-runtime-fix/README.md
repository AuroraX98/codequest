# Staged Python async worker correction

## Cause and bounded change
Pyodide0.27.7 enables blocking asyncio.run/run_until_complete through JSPI stack switching by default. Synchronous runPython entrypoints prohibit that suspension. Python16's solution mostly defines functions: the failing operations are also in its check expressions, so changing student execution alone is insufficient.

The candidate awaits runPythonAsync for the student program and each check in order. It keeps source semantics, offline asset bridge, companion-file guard, fresh worker per run, and existing 60-second parent timeout/stop behavior. It releases owned output/result proxies and retains captured output when execution fails. Recognized unsupported stack-switch/JSPI errors yield actionable capability guidance; no successful check is fabricated and no asynchronous no-op compatibility option is enabled.

Input simulation components and teaching are unchanged. No browser prompt or network access is added.

## Evidence
- worker-contract.cjs: sequential async ordering, ordinary false/error checks, capability failures, cleanup, path guard, independent contexts. Mock interpreter contract only.
- runner-lifecycle.cjs: production runProject under a controlled clock; abort/stop, 60s timeout, stale-frame filtering and cleanup. Not browser geometry or real browser worker execution.
- Actual vendored-interpreter tests are owned by Tools and recorded in ../python-existing-audit/staged-worker-results.json. Terminal verification passed: all49 solutions/132 checks and48 supported worked sequences. Evidence is bundled beside this note.
- Node with JSPI proves interpreter compatibility in that host, not all browser support. Unsupported browsers must report the limitation.

## Primary documentation
https://pyodide.org/en/0.27.7/project/changelog.html
https://blog.pyodide.org/posts/jspi/

The version-specific changelog records the changed enableRunUntilComplete default. Pyodide's JSPI documentation explains that runPythonAsync enables stack switching whereas runPython does not, and that host JSPI support is required.

## Integration
Actual-runtime verification passed and fresh native source opening completed at349a829. Implemented only public/runner/frame.html plus portable regression tests and evidence. Parent coordinates eventual combined release. Preserve all curriculum, progress and controls. GitHub sync remains paused.

## Final integration checks
Portable worker and production-parent lifecycle tests pass. Input simulation test passes unchanged. Fixed only the concept-lab test fixture's missing transpiled understanding-practice dependency and its obsolete expectation of a removed duplicate optional panel. Replacement assertions require the same essential explanation and Hello example in visible sequential teaching. That suite now passes 9630 generated Python examples/intermediate states,90 actual bundled-Pyodide examples, cancellation/stale-response and progress-isolation checks. TypeScript check passes. Curriculum/content files are unchanged.
