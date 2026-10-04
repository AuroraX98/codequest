import { mkdir, readFile, writeFile } from "node:fs/promises";
import { randomBytes } from "node:crypto";
import path from "node:path";

export async function prepareLocalRuntime(root) {
  const directory = path.join(root, ".codequest-local");
  await mkdir(directory, { recursive: true, mode: 0o700 });
  const secretPath = path.join(directory, "encryption-key");
  try {
    await writeFile(secretPath, randomBytes(32).toString("base64"), {
      flag: "wx",
      mode: 0o600,
    });
  } catch (error) {
    if (error.code !== "EEXIST") throw error;
  }
  const secret = (await readFile(secretPath, "utf8")).trim();
  if (
    !/^[A-Za-z0-9+/]{43}=$/.test(secret) ||
    Buffer.from(secret, "base64").length !== 32
  )
    throw new Error(
      "The local encryption key is damaged. Restore your .codequest-local folder from a private backup.",
    );
  const configPath = path.join(directory, "wrangler.json");
  await writeFile(
    configPath,
    JSON.stringify(
      {
        name: "codequest-local",
        main: path.join(root, "build/sites-worker.ts"),
        compatibility_date: "2026-05-15",
        compatibility_flags: ["nodejs_compat"],
        d1_databases: [
          {
            binding: "DB",
            database_name: "codequest-local",
            database_id: "00000000-0000-4000-8000-000000000000",
            migrations_dir: path.join(root, "drizzle"),
          },
        ],
      },
      null,
      2,
    ),
  );
  return { secret, configPath, statePath: path.join(directory, "state") };
}
