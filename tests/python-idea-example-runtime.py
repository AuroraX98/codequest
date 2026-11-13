"""Run complete reading examples independently; never run shell setup commands."""
import json
import os
from pathlib import Path
import re
import subprocess
import sys
import tempfile

if sys.version_info < (3, 11):
    raise SystemExit("Use Python 3.11 or newer for ExceptionGroup and TaskGroup examples.")

root = Path(__file__).resolve().parent.parent
cases = {}
for part in ("foundations", "language", "advanced"):
    data = json.loads((root / "content" / f"python-idea-examples-{part}.json").read_text())
    for lesson, sections in data.items():
        for section, context in enumerate(sections):
            for index, example in enumerate(context["examples"]):
                key = (example["language"], example["code"], example.get("output"), example.get("stdin"))
                cases.setdefault(key, {"example": example, "locations": []})["locations"].append(f"{lesson}:{section}:{index}")

failures = []
executed = 0
compared = 0
instructions = 0
for case in cases.values():
    example = case["example"]
    code = example["code"]
    with tempfile.TemporaryDirectory(prefix="codequest-example-") as folder:
        if example["language"] == "python":
            command = [sys.executable, "-I", "-c", code]
        elif example["language"] == "text" and code.startswith("FILE: "):
            files = re.findall(r"^FILE: ([\w.-]+)\n(.*?)(?=^FILE: |^RUN: |\Z)", code, re.M | re.S)
            run = re.search(r"^RUN: python ([\w.-]+)$", code, re.M)
            if not files or not run:
                failures.append({"locations": case["locations"], "error": "Incomplete file bundle"})
                continue
            for name, content in files:
                Path(folder, name).write_text(content.rstrip() + "\n")
            # Isolated mode removes the script directory; explicitly permit only this temporary fixture.
            command = [sys.executable, "-I", "-c", "import runpy,sys; sys.path.insert(0, '.'); runpy.run_path(" + repr(run[1]) + ", run_name='__main__')"]
        else:
            instructions += 1
            continue
        try:
            result = subprocess.run(command, cwd=folder, input=example.get("stdin", ""), text=True, capture_output=True, timeout=8,
                                    env={"PATH": os.environ.get("PATH", ""), "PYTHONHASHSEED": "0"})
            executed += 1
            if result.returncode:
                failures.append({"locations": case["locations"], "error": result.stderr[-1800:]})
            elif "output" in example:
                compared += 1
                if result.stdout.rstrip("\n") != example["output"].rstrip("\n"):
                    failures.append({"locations": case["locations"], "expected": example["output"], "actual": result.stdout})
        except subprocess.TimeoutExpired:
            failures.append({"locations": case["locations"], "error": "Example exceeded eight seconds"})

print(json.dumps({"executed": executed, "outputsCompared": compared, "instructionExamples": instructions, "failures": failures}, indent=2))
raise SystemExit(bool(failures))
