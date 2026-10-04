import assert from "node:assert/strict";
import { mkdtemp, readFile, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { Miniflare } from "miniflare";
import ts from "typescript";

// Exercise the default transport inside workerd, rather than replacing fetch.
// Every outbound request is intercepted locally; no provider is contacted.
const temp = await mkdtemp(path.join(tmpdir(), "codequest-provider-worker-"));
const syntheticKey = "worker-fixture-not-a-real-api-key";
const endpoints = {
  deepseek: "https://api.deepseek.com/chat/completions",
  openai: "https://api.openai.com/v1/responses",
  anthropic: "https://api.anthropic.com/v1/messages",
};
const payloads = {
  deepseek: {
    choices: [{ finish_reason: "stop", message: { content: "Worker reply" } }],
  },
  openai: {
    status: "completed",
    output: [
      {
        type: "message",
        content: [{ type: "output_text", text: "Worker reply" }],
      },
    ],
  },
  anthropic: {
    stop_reason: "end_turn",
    content: [{ type: "text", text: "Worker reply" }],
  },
};
let worker;
let scenario = "answer";
const outbound = [];
try {
  for (const name of ["ai-providers", "ai-transport"]) {
    const source = await readFile(
      new URL(`../lib/${name}.ts`, import.meta.url),
      "utf8",
    );
    const compiled = ts
      .transpileModule(source, {
        compilerOptions: {
          target: ts.ScriptTarget.ES2022,
          module: ts.ModuleKind.ESNext,
        },
      })
      .outputText.replace(/from "\.\/([^\"]+)"/g, 'from "./$1.mjs"');
    await writeFile(path.join(temp, `${name}.mjs`), compiled);
  }
  const entry = path.join(temp, "worker.mjs");
  await writeFile(
    entry,
    `
import { askProvider } from './ai-transport.mjs';
export default {
  async fetch(request) {
    const { provider, key } = await request.json();
    try {
      const answer = await askProvider(provider, key, 'Fixture instructions',
        [{ role: 'user', content: 'Explain a variable.' }]);
      return Response.json({ answer });
    } catch (error) {
      return Response.json({ error: error.message }, { status: error.status ?? 500 });
    }
  }
};
`,
  );
  worker = new Miniflare({
    modules: true,
    modulesRoot: temp,
    scriptPath: entry,
    compatibilityDate: "2026-05-15",
    compatibilityFlags: ["nodejs_compat"],
    outboundService: async (request) => {
      // This callback intercepts all destinations, including any attempted
      // redirect follow. Store only URL and synthetic-header checks.
      outbound.push({
        url: request.url,
        hasSyntheticKey:
          request.headers.get("authorization") === `Bearer ${syntheticKey}` ||
          request.headers.get("x-api-key") === syntheticKey,
      });
      const provider = Object.keys(endpoints).find(
        (name) => endpoints[name] === request.url,
      );
      if (!provider)
        return new Response("Unexpected redirect destination", { status: 500 });
      if (scenario === "redirect") {
        return new Response(`Private upstream text ${syntheticKey}`, {
          status: 302,
          headers: {
            Location: "https://redirect-fixture.invalid/credential-target",
          },
        });
      }
      if (scenario === "rejected") {
        return new Response(`Private upstream text ${syntheticKey}`, {
          status: 401,
        });
      }
      return Response.json(payloads[provider]);
    },
  });
  for (const provider of Object.keys(endpoints)) {
    for (scenario of ["answer", "redirect", "rejected"]) {
      outbound.length = 0;
      const response = await worker.dispatchFetch(
        "http://fixture.local/tutor",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ provider, key: syntheticKey }),
        },
      );
      const result = await response.json();
      assert.equal(
        outbound.length,
        1,
        `${provider}/${scenario}: one outbound request`,
      );
      assert.equal(outbound[0].url, endpoints[provider]);
      assert.equal(outbound[0].hasSyntheticKey, true);
      assert.ok(
        !JSON.stringify(result).includes(syntheticKey),
        "No credential in response",
      );
      if (scenario === "answer") {
        assert.equal(
          response.status,
          200,
          `${provider}: workerd transport must reach fixture`,
        );
        assert.equal(result.answer, "Worker reply");
      } else {
        assert.equal(
          response.status,
          502,
          `${provider}/${scenario}: reject upstream response`,
        );
        assert.ok(result.error);
        assert.ok(!result.error.includes("Private upstream text"));
      }
    }
  }
  console.log(
    "Passed actual workerd provider requests, redirect rejection without following or credential forwarding, and sanitized errors for all providers. All outbound responses were local fixtures.",
  );
} finally {
  try {
    await worker?.dispose();
  } finally {
    await rm(temp, { recursive: true, force: true });
  }
}
