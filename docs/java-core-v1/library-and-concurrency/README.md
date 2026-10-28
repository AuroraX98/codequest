# Java Core v1: library and concurrency (46–72)

27 staged concept micro-lessons, conventional `public static void main(String[] args)` entry points, stable Java 25 APIs only. The app reads these examples; it does not execute Java. No user progress or existing app content was changed here.

## Artifacts
- `author.py`: reproducible authoring using the shared Batch helper.
- `lessons.json`, `support-map.json`, `headings.json`, `terminology.json`: exact visible paragraphs, concept headings, prerequisite IDs, varied quiz answers and targeted glossary anchors.
- `execution-cases.json`, `companions/`: 55 complete fixtures, including three expected compile failures and two expected runtime failures. Package/module cases include all extra source files and launch metadata. File-writing cases use relative names and must run in an isolated disposable directory.
- `sources.json`: primary Oracle Java 25 API/JLS/javac documentation used for the original examples and teaching.
- `validate-structure.py`, `structure-validation.json`: 27/27 structure checks; not compiler evidence.

## Compiler status
Pending the authorized Java 25 toolchain and shared runner. No execution claim is made by this README. The tools worker owns JDK acquisition and aggregate compiler receipts. Use `../compiler-evidence/run-all.py` with its explicit `--jdk`, `--cases`, and `--output` arguments once approved/available. No preview options are used.

Concurrency fixtures coordinate through joins, futures or latches rather than sleeps or timing expectations. No unsafe races, forced thread termination, networking, third-party dependency downloads or performance claims are included. Virtual-thread examples check thread identity, not throughput. The final model is a bounded in-memory transition exercise, not a production persistence system.
