# Third-party software notices

CodeQuest includes third-party software. The authors of that software retain their respective rights. These notices do not assign a license to CodeQuest’s independently authored lessons or original application code. Existing notices inside vendor files remain applicable.

## Learning sandbox runtimes

- Pyodide0.27.7 and CPython3.12.7: MPL/PSF and component notices below. Corresponding Pyodide source and build/patch instructions: https://github.com/pyodide/pyodide/tree/0.27.7 ; CPython source: https://github.com/python/cpython/tree/v3.12.7 .
- SQL.js1.13.0: MIT wrapper; embedded SQLite3.49.1 is separately public-domain software.
- TypeScript5.9.3: Apache2.0 and included third-party notices.
- Babel standalone7.26.9: MIT and bundled notices retained in its artifact.
- React/ReactDOM18.3.1: MIT; learning sandbox versions differ from application React19.2.6.

## Retained license and component-notice texts

- [babel-standalone-7.26.9-LICENSE.txt](licenses/babel-standalone-7.26.9-LICENSE.txt)
- [bzip2-1.0.6-LICENSE.txt](licenses/bzip2-1.0.6-LICENSE.txt)
- [cpython-3.12.7-LICENSE.txt](licenses/cpython-3.12.7-LICENSE.txt)
- [cpython-3.12.7-license.rst](licenses/cpython-3.12.7-license.rst)
- [cpython-expat-COPYING.txt](licenses/cpython-expat-COPYING.txt)
- [cpython-hacl-README.md](licenses/cpython-hacl-README.md)
- [cpython-hacl-source-header.c](licenses/cpython-hacl-source-header.c)
- [cpython-libmpdec-source-header.c](licenses/cpython-libmpdec-source-header.c)
- [emscripten-3.1.58-LICENSE.txt](licenses/emscripten-3.1.58-LICENSE.txt)
- [emscripten-compiler-rt-LICENSE.txt](licenses/emscripten-compiler-rt-LICENSE.txt)
- [emscripten-musl-COPYRIGHT.txt](licenses/emscripten-musl-COPYRIGHT.txt)
- [hiwire-LICENSE.txt](licenses/hiwire-LICENSE.txt)
- [libffi-LICENSE.txt](licenses/libffi-LICENSE.txt)
- [pyodide-0.27.7-LICENSE.txt](licenses/pyodide-0.27.7-LICENSE.txt)
- [react-18.3.1-LICENSE.txt](licenses/react-18.3.1-LICENSE.txt)
- [reactdom-18.3.1-LICENSE.txt](licenses/reactdom-18.3.1-LICENSE.txt)
- [sqljs-1.13.0-LICENSE.txt](licenses/sqljs-1.13.0-LICENSE.txt)
- [stackframe-LICENSE.txt](licenses/stackframe-LICENSE.txt)
- [typescript-5.9.3-LICENSE.txt](licenses/typescript-5.9.3-LICENSE.txt)
- [typescript-5.9.3-ThirdPartyNoticeText.txt](licenses/typescript-5.9.3-ThirdPartyNoticeText.txt)
- [zlib-1.2.13-README.txt](licenses/zlib-1.2.13-README.txt)

## Important scope limits

This document is an attribution aid, not a claim that every embedded object has been audited. Complete Pyodide WASM linkage, Babel bundled-dependency attribution and actual application dependency reachability remain under review. Package-lock entries and installed optional packages alone do not prove distribution. Full package-contained notices are retained in the accompanying evidence archive; do not publish that archive as if every listed package ships.

No license or source-availability obligation is waived by this document. Upstream tags/commits and downloaded hashes are recorded in sources.json. Unresolved scope remains explicit; this document does not establish complete linkage or legal clearance.
