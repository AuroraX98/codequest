import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { prepareLocalRuntime } from "./local-runtime.mjs";

const root = fileURLToPath(new URL("../", import.meta.url));
process.chdir(root);
if (process.argv.length > 2)
  throw new Error(
    "Start local mode with npm run local; use http://127.0.0.1:5173.",
  );
process.env.CODEQUEST_LOCAL_MODE = "1";
process.env.CLOUDFLARE_CF_FETCH_ENABLED = "false";
process.env.WRANGLER_SEND_METRICS = "false";
process.env.WRANGLER_WRITE_LOGS = "false";
process.env.WRANGLER_LOG_PATH = ".codequest-local/logs";
process.env.WRANGLER_REGISTRY_PATH = ".codequest-local/registry";
process.env.MINIFLARE_REGISTRY_PATH = ".codequest-local/registry";
// Local mode uses only its generated private secret, never hosted env files.
process.env.CLOUDFLARE_LOAD_DEV_VARS_FROM_DOT_ENV = "false";
process.env.CLOUDFLARE_INCLUDE_PROCESS_ENV = "false";
const runtime = await prepareLocalRuntime(root);
const migration = spawnSync(
  process.execPath,
  [
    fileURLToPath(
      new URL("../node_modules/wrangler/bin/wrangler.js", import.meta.url),
    ),
    "d1",
    "migrations",
    "apply",
    "DB",
    "--local",
    "--config",
    runtime.configPath,
    "--persist-to",
    runtime.statePath,
  ],
  { stdio: ["ignore", "inherit", "inherit"] },
);
if (migration.error) throw migration.error;
if (migration.status !== 0) process.exit(migration.status ?? 1);
console.log(
  "Local mode: no ChatGPT sign-in. Progress and encrypted keys stay on this computer.",
);
process.argv = [
  process.execPath,
  fileURLToPath(new URL("./run-framework.mjs", import.meta.url)),
  "dev",
  "--host",
  "127.0.0.1",
];
await import("./run-framework.mjs");
