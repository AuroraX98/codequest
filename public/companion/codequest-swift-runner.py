#!/usr/bin/env python3
"""CodeQuest's local, sandboxed Swift companion. Python 3 standard library only."""
import hmac
import json
import os
from pathlib import Path
import re
import resource
import selectors
import secrets
import shutil
import signal
import subprocess
import tempfile
import time
from http.server import BaseHTTPRequestHandler, HTTPServer

HOST, PORT = "127.0.0.1", 4319
ORIGINS = frozenset({
    "https://codequest-personal-learning.aurorax.chatgpt.site",
    "http://127.0.0.1:5173", "http://localhost:5173",
})
MAX_BODY, MAX_OUTPUT, MAX_CHECKS = 100_000, 65_536, 30
TOKEN = secrets.token_urlsafe(32)
SANDBOX = shutil.which("sandbox-exec")
SESSION_CACHE = None  # Compiler-only; never permitted by the runtime sandbox.
MANUAL = ("Open an iOS App project in Xcode using SwiftUI. Paste this lesson's "
          "view into ContentView.swift, keep the generated app entry point, then "
          "run in an iOS Simulator and follow the lesson's manual interaction rubric.")


def trusted_path(*args):
    """Discover installed Apple tools without any learner-controlled arguments."""
    try:
        found = subprocess.run(["/usr/bin/xcrun", *args], capture_output=True,
                               timeout=5, check=True, text=True).stdout.strip()
        # Keep the swiftc symlink name: the Swift driver chooses its mode from it.
        return str(Path(found).absolute()) if found else None
    except (OSError, subprocess.SubprocessError):
        return None


COMPILER = trusted_path("--find", "swiftc")
SDK = trusted_path("--show-sdk-path")
DRIVER = str(Path(COMPILER).parent / "swift-driver") if COMPILER else None
if DRIVER and not Path(DRIVER).is_file():
    DRIVER = None


def quote(value):
    # Seatbelt strings use the same escaping needed by these JSON strings.
    return json.dumps(str(value))


def sandbox_profile(folder, executable=None, compiler=False, cache=None):
    reads = {"/usr/lib", "/System/Library", "/private/var/db/dyld", str(folder)}
    if compiler:
        # swiftc's driver may invoke swift-frontend, clang, ld, and toolchain helpers.
        toolchain = str(Path(COMPILER).parent.parent.parent)
        reads.update({toolchain, SDK, str(Path(SDK).resolve()), "/usr/include", "/Library/Apple/System/Library"})
        if cache:
            reads.add(str(cache))
        executions = f"(subpath {quote(str(Path(COMPILER).parent))})"
    else:
        executions = f"(literal {quote(executable)})"
    ancestors = set(Path(folder).parents)
    if compiler:
        ancestors.update(Path(COMPILER).parents)
        ancestors.update(Path(SDK).resolve().parents)
        if cache:
            ancestors.update(Path(cache).parents)
    writes = {str(folder)}
    if compiler and cache:
        writes.add(str(cache))
    lines = ["(version 1)", "(deny default)", "(allow process-info* sysctl-read)",
             "(allow signal (target self))",
             '(allow file-read* (literal "/"))',
             "(allow file-read-metadata " + " ".join(f"(literal {quote(p)})" for p in sorted(ancestors)) + ")",
             "(allow file-read* " + " ".join(f"(subpath {quote(p)})" for p in sorted(reads)) + ")",
             '(allow file-read* (literal "/dev/null") (literal "/dev/urandom") (literal "/dev/random"))',
             "(allow file-write* " + " ".join(f"(subpath {quote(p)})" for p in sorted(writes)) + ")",
             '(allow file-write-data (literal "/dev/null"))',
             f"(allow process-exec {executions})"]
    if compiler:
        lines.append("(allow process-fork)")
    # No network, home files, other writable paths, Mach services, or runtime fork.
    return "\n".join(lines)


def run_limited(command, folder, seconds, compile_phase=False, cache=None):
    """Bound CPU, output files, descriptors, wall time, and the entire process group."""
    stdout = folder / ("compile.out" if compile_phase else "run.out")
    stderr = folder / ("compile.err" if compile_phase else "run.err")

    def limits():
        resource.setrlimit(resource.RLIMIT_CPU, (25, 26) if compile_phase else (2, 3))
        # Compiler object/module files need more space than console output.
        file_limit = 128 * 1024 * 1024 if compile_phase else MAX_OUTPUT
        resource.setrlimit(resource.RLIMIT_FSIZE, (file_limit, file_limit))
        resource.setrlimit(resource.RLIMIT_NOFILE, (256, 256))
        resource.setrlimit(resource.RLIMIT_CORE, (0, 0))

    environment = {"PATH": "/usr/bin:/bin", "HOME": str(folder), "TMPDIR": str(folder),
                   "LANG": "en_US.UTF-8", "LC_ALL": "en_US.UTF-8",
                   "CLANG_MODULE_CACHE_PATH": str(cache or folder / "cache"),
                   "SWIFT_MODULE_CACHE_PATH": str(cache or folder / "cache")}
    timed_out = False
    with stdout.open("wb") as out, stderr.open("wb") as err:
        proc = subprocess.Popen(command, cwd=folder, env=environment, stdin=subprocess.DEVNULL,
                                stdout=subprocess.PIPE, stderr=subprocess.PIPE,
                                start_new_session=True, preexec_fn=limits)
        streams = selectors.DefaultSelector()
        for pipe, target in ((proc.stdout, out), (proc.stderr, err)):
            os.set_blocking(pipe.fileno(), False)
            streams.register(pipe, selectors.EVENT_READ, {"target": target, "count": 0})
        deadline = time.monotonic() + seconds
        try:
            while streams.get_map():
                remaining = deadline - time.monotonic()
                if remaining <= 0:
                    timed_out = True
                    break
                exceeded = False
                for key, _ in streams.select(min(remaining, 0.1)):
                    chunk = os.read(key.fileobj.fileno(), 8192)
                    if not chunk:
                        streams.unregister(key.fileobj)
                        continue
                    record = key.data
                    available = MAX_OUTPUT - record["count"]
                    record["target"].write(chunk[:available])
                    record["count"] += min(len(chunk), available)
                    if len(chunk) > available:
                        exceeded = True
                if exceeded:
                    break
            if proc.poll() is None and not timed_out and not exceeded:
                try:
                    proc.wait(timeout=max(0.001, deadline - time.monotonic()))
                except subprocess.TimeoutExpired:
                    timed_out = True
        finally:
            # Kill leftover compiler children too, even if the driver exited first.
            try:
                os.killpg(proc.pid, signal.SIGKILL)
            except ProcessLookupError:
                pass
            proc.wait()
            streams.close()
            proc.stdout.close()
            proc.stderr.close()
    return (proc.returncode, stdout.read_bytes()[:MAX_OUTPUT].decode("utf-8", "replace"),
            stderr.read_bytes()[:MAX_OUTPUT].decode("utf-8", "replace"), timed_out)


def result_error(message, checks=(), manual=False, output=()):
    result = {"output": list(output), "checks": [{"label": c["label"], "passed": False} for c in checks],
              "error": message}
    if manual:
        result["manual"] = True
    return result


def run_swift(payload):
    code, checks, typecheck = payload["code"], payload["checks"], payload["typecheck"]
    if not SANDBOX:
        return result_error("sandbox-exec is unavailable. Code execution is disabled.", checks, typecheck)
    if not COMPILER or not SDK:
        return result_error("Apple's Swift compiler or SDK is unavailable. Install a matching Xcode or Command Line Tools release.", checks, typecheck)
    marker = "__CODEQUEST_" + secrets.token_hex(16) + "__"
    with tempfile.TemporaryDirectory(prefix="codequest-swift-") as temporary:
        folder = Path(temporary).resolve()
        source, binary = folder / "main.swift", folder / "lesson"
        cache = SESSION_CACHE or folder / "cache"
        appended = "\n".join(f'print("{marker}{i}:" + String(({c["expression"]})))'
                             for i, c in enumerate(checks)) if not typecheck else ""
        source.write_text(code + "\n" + appended + "\n", encoding="utf-8")
        profile = folder / "compile.sb"
        profile.write_text(sandbox_profile(folder, compiler=True, cache=cache), encoding="utf-8")
        compiler_command = [DRIVER, "--driver-mode=swiftc"] if DRIVER else [COMPILER]
        command = [SANDBOX, "-f", str(profile), *compiler_command, "-sdk", SDK,
                   "-module-cache-path", str(cache)]
        command += ["-typecheck", str(source)] if typecheck else [str(source), "-o", str(binary)]
        status, out, err, expired = run_limited(command, folder, 30, compile_phase=True, cache=cache)
        if expired:
            return result_error("Compilation exceeded 30 seconds.", checks, typecheck)
        if status != 0:
            diagnostic = (err or out or f"Compiler exited with status {status}.")
            return result_error("Swift compilation failed. Use a matching Apple SDK/compiler if the diagnostics mention an SDK mismatch.\n" + diagnostic[:12_000], checks, typecheck)
        if typecheck:
            return {"output": ["Swift source passed compiler type checking.", MANUAL], "checks": [], "manual": True}
        profile = folder / "runtime.sb"
        profile.write_text(sandbox_profile(folder, executable=binary), encoding="utf-8")
        status, out, err, expired = run_limited([SANDBOX, "-f", str(profile), str(binary)], folder, 3)
        passed, lines = {}, []
        for line in out.splitlines():
            match = re.fullmatch(re.escape(marker) + r"(\d+):(true|false)", line)
            if match:
                passed[int(match[1])] = match[2] == "true"
            elif len(lines) < 500:
                lines.append(line)
        results = [{"label": c["label"], "passed": passed.get(i, False)} for i, c in enumerate(checks)]
        answer = {"output": lines, "checks": results}
        if expired or status != 0 or len(passed) != len(checks):
            answer["checks"] = [{"label": c["label"], "passed": False} for c in checks]
            answer["error"] = ("Execution exceeded 3 seconds." if expired else
                               f"Swift execution stopped before successful completion (status {status}).")
            if err:
                answer["error"] += "\n" + err[:12_000]
        return answer


def unique_object(pairs):
    result = {}
    for key, value in pairs:
        if key in result:
            raise ValueError("Duplicate JSON keys are not allowed.")
        result[key] = value
    return result


def validate_payload(raw):
    payload = json.loads(raw.decode("utf-8"), object_pairs_hook=unique_object)
    if not isinstance(payload, dict) or set(payload) - {"code", "checks", "typecheck"}:
        raise ValueError("Expected code, checks, and optional typecheck fields.")
    code, checks, typecheck = payload.get("code"), payload.get("checks", []), payload.get("typecheck", False)
    if not isinstance(code, str) or not code.strip():
        raise ValueError("code must be a non-empty string.")
    code.encode("utf-8")
    if not isinstance(typecheck, bool):
        raise ValueError("typecheck must be a Boolean.")
    if not isinstance(checks, list) or len(checks) > MAX_CHECKS:
        raise ValueError("checks must contain at most 30 entries.")
    for check in checks:
        if not isinstance(check, dict) or set(check) != {"label", "expression"}:
            raise ValueError("Each check needs label and expression strings.")
        if not isinstance(check["label"], str) or not 0 < len(check["label"]) <= 200:
            raise ValueError("Check labels must be 1 to 200 characters.")
        if not isinstance(check["expression"], str) or not 0 < len(check["expression"]) <= 5000:
            raise ValueError("Check expressions must be 1 to 5000 characters.")
        check["label"].encode("utf-8")
        check["expression"].encode("utf-8")
    if typecheck and checks:
        raise ValueError("Type-check-only lessons use a manual rubric and an empty checks array.")
    return {"code": code, "checks": checks, "typecheck": typecheck}


class Handler(BaseHTTPRequestHandler):
    server_version = "CodeQuestSwift/1"
    sys_version = ""

    def setup(self):
        super().setup()
        self.connection.settimeout(5)

    def log_message(self, *_args):
        pass  # Never log code, authorization headers, or request bodies.

    def send_json(self, status, value):
        body = json.dumps(value, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        origin = self.headers.get("Origin")
        if origin in ORIGINS:
            self.send_header("Access-Control-Allow-Origin", origin)
        self.send_header("Vary", "Origin")
        self.send_header("Cache-Control", "no-store")
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Connection", "close")
        self.end_headers()
        self.close_connection = True
        self.wfile.write(body)

    def allowed_request(self):
        if self.path != "/run":
            self.send_json(404, result_error("Only /run is available.")); return False
        if len(self.headers.get_all("Host", [])) != 1 or self.headers.get("Host") not in {f"127.0.0.1:{PORT}", f"localhost:{PORT}"}:
            self.send_json(403, result_error("Host is not allowed.")); return False
        if len(self.headers.get_all("Origin", [])) != 1 or self.headers.get("Origin") not in ORIGINS:
            self.send_json(403, result_error("Origin is not allowed.")); return False
        return True

    def do_OPTIONS(self):
        if not self.allowed_request():
            return
        requested = {h.strip().lower() for h in self.headers.get("Access-Control-Request-Headers", "").split(",") if h.strip()}
        if self.headers.get("Access-Control-Request-Method") != "POST" or requested - {"authorization", "content-type"}:
            self.send_json(403, result_error("Preflight method or headers are not allowed.")); return
        self.send_response(204)
        self.send_header("Access-Control-Allow-Origin", self.headers["Origin"])
        self.send_header("Access-Control-Allow-Methods", "POST")
        self.send_header("Access-Control-Allow-Headers", "Authorization, Content-Type")
        if self.headers.get("Access-Control-Request-Private-Network") == "true":
            self.send_header("Access-Control-Allow-Private-Network", "true")
        self.send_header("Vary", "Origin, Access-Control-Request-Headers, Access-Control-Request-Private-Network")
        self.send_header("Cache-Control", "no-store")
        self.send_header("Connection", "close")
        self.end_headers()
        self.close_connection = True

    def do_POST(self):
        if not self.allowed_request():
            return
        authorization = self.headers.get("Authorization", "")
        if len(self.headers.get_all("Authorization", [])) != 1 or not hmac.compare_digest(authorization.encode("utf-8"), ("Bearer " + TOKEN).encode("utf-8")):
            self.send_json(401, result_error("A valid session Bearer token is required.")); return
        lengths = self.headers.get_all("Content-Length", [])
        if self.headers.get("Transfer-Encoding") or len(lengths) != 1 or not re.fullmatch(r"[0-9]{1,7}", lengths[0]):
            self.send_json(400, result_error("A single Content-Length is required; chunked bodies are unsupported.")); return
        length = int(lengths[0])
        if length > MAX_BODY:
            self.send_json(413, result_error("Request body exceeds 100 KB.")); return
        if self.headers.get("Content-Type", "").split(";", 1)[0].strip().lower() != "application/json":
            self.send_json(415, result_error("Use Content-Type: application/json.")); return
        try:
            raw = self.rfile.read(length)
            if len(raw) != length:
                raise ValueError("Incomplete request body.")
            payload = validate_payload(raw)
        except (ValueError, UnicodeError, TimeoutError, RecursionError):
            self.send_json(400, result_error("Invalid JSON body or lesson request.")); return
        try:
            self.send_json(200, run_swift(payload))
        except (OSError, subprocess.SubprocessError):
            self.send_json(500, result_error("The local compiler or sandbox could not start. No checks passed.", payload["checks"], payload["typecheck"]))


def main():
    global SESSION_CACHE
    if os.name != "posix" or not Path("/System/Library").exists():
        raise SystemExit("This companion supports macOS only.")
    server = HTTPServer((HOST, PORT), Handler)  # Serial handling keeps preexec limits safe.
    print(f"CodeQuest Swift companion listening at http://{HOST}:{PORT}/run", flush=True)
    print(f"Session token: {TOKEN}", flush=True)
    print("Paste this token into CodeQuest. It changes at every start; keep this terminal open.", flush=True)
    if not SANDBOX:
        print("sandbox-exec is unavailable. Swift execution is disabled.", flush=True)
    with tempfile.TemporaryDirectory(prefix="codequest-compiler-cache-") as cache:
        SESSION_CACHE = Path(cache).resolve()
        try:
            server.serve_forever()
        except KeyboardInterrupt:
            print("Companion stopped.", flush=True)
        finally:
            server.server_close()
            SESSION_CACHE = None


if __name__ == "__main__":
    main()
