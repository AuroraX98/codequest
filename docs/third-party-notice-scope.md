# CodeQuest third-party notice staging bundle

Audit snapshot: c5402d87c0dce871d105499d83d176687749083b, 2026-10-27.
This is a staged compliance/provenance aid, not a legal clearance or a new license for CodeQuest's original content. Nothing here changes the author's ownership, grants a blanket license, removes existing headers, or authorizes public GitHub publication.

## Exact shipped teaching runtimes

`vendor-integrity.json` records 24 files matching their existing source manifest hashes. This establishes no local changes relative to that manifest; it is not an independently signed vendor attestation.

| Runtime | Exact version | Notices / source availability |
|---|---|---|
| Pyodide | 0.27.7 | MPL-2.0; `licenses/pyodide-0.27.7-LICENSE.txt`; corresponding tagged source https://github.com/pyodide/pyodide/tree/0.27.7 and its build/patch scripts. |
| CPython embedded in Pyodide | 3.12.7 | PSF and historical licenses plus third-party acknowledgments in `cpython-3.12.7-LICENSE.txt` and `cpython-3.12.7-license.rst`; underlying source https://github.com/python/cpython/tree/v3.12.7 . Pyodide's patches are separately in its tagged source. |
| SQL.js | 1.13.0 | MIT and additional included Makefile notice in `sqljs-1.13.0-LICENSE.txt`; source https://github.com/sql-js/sql.js/tree/v1.13.0 . Actual embedded SQLite runtime reports 3.49.1; SQLite public-domain origin must not be confused with SQL.js MIT wrapper. |
| TypeScript | 5.9.3 | Apache-2.0 `LICENSE` plus exact package `ThirdPartyNoticeText`; source https://github.com/microsoft/TypeScript/tree/v5.9.3 . |
| Babel standalone | 7.26.9 | MIT package LICENSE; source https://github.com/babel/babel/tree/v7.26.9 . Further bundled-dependency attribution completeness remains under review. |
| React / ReactDOM sandbox | 18.3.1 | Both MIT files retained; source https://github.com/facebook/react/tree/v18.3.1 . Distinct from app React19.2.6. |

## Embedded Pyodide components

The exact tagged Pyodide `cpython/Makefile`, `Setup.local`, and Emscripten3.1.58 port recipes establish references to libffi commit f08493d249d2067c8b3207ba46693dd858f95db3, hiwire commit6a1e67280a15d929ebeceee54a6358c9c8d5f697, CPython-bundled libmpdec, Expat and HACL SHA2, zlib1.2.13 and bzip2 1.0.6. Notices are preserved here; source-header files are included whole where no standalone license exists. Emscripten's own license, musl COPYRIGHT and compiler-rt license are included as runtime-source candidates. This list is NOT a verified complete linker map/SBOM of every object in the distributed WASM. Do not claim complete embedded-license closure yet.

The shipped stdlib zip has no files named LICENSE/COPYING/NOTICE. The351 entries in pyodide-lock.json describe optional package availability; they do not establish that all optional packages are bundled or loaded. Dynamically fetched packages, if enabled later, need a separate inventory. This audit does not install or redistribute those optional packages.

## App dependencies and assets

`installed-notice-index.json` links unmodified, package-contained notices from883 installed package directories. This is a broad evidence archive, not a shipping manifest: dev dependencies, optional platform binaries and unused packages must not be represented as browser-delivered components. The app uses React19.2.6, CodeMirror, Lucide and other components distinct from its learning sandbox runtimes. Retain package notices for actual client/server bundles. Production reachability and LGPL libvips/sharp platform-package inclusion remain unresolved; package-lock presence alone is insufficient.

Existing `build/sites-vite-plugin.LICENSE` and `vendor/shadcn-tailwind-4.13.0.LICENSE.md` must remain untouched. System-font CSS was found, with no downloaded font files in public assets. The four SVGs are separately inventoried. Three unused starter SVGs (file/globe/window) match Next.js15.5.0 create-next-app app/js/public assets exactly apart from terminal whitespace; source hashes and URLs are in ../svg-exact-comparison.json. The custom code-bracket favicon origin remains separately unverified. Do not delete asset copyright notices or assign an invented original-content license.

## Proposed integration (after review)

1. Add a stable public third-party notices document and the relevant exact license files. Make the notice/source-availability location discoverable without disrupting lessons.
2. Retain all existing source/file headers. Do not prepend a blanket proprietary or open-source license to third-party files.
3. Preserve corresponding source URLs/tag/commit/build information for MPL-covered runtime files. Assess availability and any distribution obligations before claiming closure.
4. Complete reachable dependency/embedded attribution checks. Keep unresolved items explicit; this initial bundle is useful remediation but not exhaustive legal advice.
5. Keep author provenance receipts separate from licenses. A source link can mean factual/API verification, not permission to copy explanatory prose or exercises. Rephrasing a derivative does not automatically remove its license obligations.

`sources.json` records exact download URL, hash, size and failures. Failed guessed standalone paths are retained as audit history; successful source-header alternatives are listed separately. No live app or saved learning data was modified.


Integration: 21 exact sandbox/component notice files, source/version receipts and public README are included in the verified offline pack. The three unused Next starter SVG sources were removed. Existing project/vendor headers remain intact. Installed dependency archive is NOT published as a claimed shipped SBOM.
