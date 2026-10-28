# Java25 compiler verification

Official Microsoft Build of OpenJDK25.0.5.0.2 installed in `/workspace/shared/tooling/jdk25` after explicit user permission. Download linked from https://learn.microsoft.com/en-us/java/openjdk/download: https://aka.ms/download-jdk/microsoft-jdk-25.0.5.0.2-linux-x64.tar.gz . Vendor SHA256 file downloaded from same URL plus `.sha256sum.txt`; `sha256sum -c` passed. No sudo, system Java/default changes, accounts, or user-computer changes. Existing .NET tooling retained.

145/145 actual fixtures passed, covering all72 worked examples and changed/negative cases:131 successful executions,11 intended compilation failures and3 intended runtime failures. Every negative diagnostic was inspected for the intended reason; successful compilations emit no warnings under `-Xlint:all`. Separate actual stale-class probe passed compile3/edit7/run3/recompile/run7. No preview features enabled; `javac --release 25 -encoding UTF-8`.

Original6 worked fixtures taken from new-languages/java-c; six changed fixtures independently match current quizzes. New133 from all-execution-cases.json. Tested manifests snapshot exact code/expectations; source-match.json verifies all72 worked lesson snippets match. Case runtime timeouts bounded. No deployed lesson edits or browser-runtime claims.

`results.json` contains compiler and run outputs; `diagnostic-review.json` documents expected failures; `run-all.py` is reproducible using --jdk, --cases and optional --output. `case-manifest.json` contains full fixtures; `summary.json` is terminal receipt.
