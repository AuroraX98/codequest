# Actual C# compiler verification

SDK installed solely in `/workspace/shared/tooling/dotnet10` using Microsoft's official `https://dot.net/v1/dotnet-install.sh`, which downloaded `https://builds.dotnet.microsoft.com/dotnet/Sdk/10.0.403/dotnet-sdk-10.0.403-linux-x64.tar.gz`. Installer recorded matching remote/download sizes (240199984 bytes). No system package, account, payment, browser runtime or user-computer change.

- `install.log`: vendor installer result.
- `dotnet-info.txt`: executable-reported SDK/runtime details.
- `run-all.py`: reproducible compiler/runtime harness.
- `case-manifest.json`: all 133 exact source snapshots, expected results and SHA-256 source hashes, covering 63 lesson IDs.
- `results.json`: incremental per-case build and runtime logs. `complete` must be true before treating this as a full receipt.
- `summary.json`: terminal counts, generated only when all cases finish.
- `run.log`: execution progress.
- `restore.log`: offline-package-source restore.

Uses C#14 / net10.0, nullable and implicit usings enabled. Package sources are cleared; no external package required. Invariant globalization ensures reproducible numeric output. Process-local CLI home and XDG runtime directories are under this evidence folder (the environment's default runtime directory was read-only). Expected compile failures are checked for C# diagnostics; expected runtime exceptions are checked separately from successful examples. Text comparison normalizes CRLF and trailing newline only, preserving leading blank lines.

`DOTNET_ROOT=/workspace/shared/tooling/dotnet10 python run-all.py` from any directory reproduces the run. This executes provided local snippets, including one temporary-file creation/deletion example; it never reads live learner data. Do not infer full-course mastery or exhaustive edge-case coverage from fixture success. The lesson55 race variant is intentionally not asserted nondeterministically, and lesson59 package-management quiz is conceptual rather than a package installation.
