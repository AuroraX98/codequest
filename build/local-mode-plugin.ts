import type { IncomingMessage, ServerResponse } from "node:http";
import type { Plugin } from "vite";

const hosts = new Set(["localhost", "127.0.0.1", "::1"]);
const peers = new Set(["127.0.0.1", "::1", "::ffff:127.0.0.1"]);

// This middleware exists only in the explicitly selected local dev server.
// Check the socket as well as Host to prevent remote identity injection.
export function localRequestAllowed(request: IncomingMessage): boolean {
  try {
    const base = new URL(`http://${request.headers.host}`);
    const url = new URL(request.url ?? "/", base);
    return (
      peers.has(request.socket.remoteAddress ?? "") &&
      hosts.has(base.hostname.replace(/^\[|\]$/g, "").toLowerCase()) &&
      url.origin === base.origin &&
      (!request.headers.origin || request.headers.origin === base.origin) &&
      request.headers["sec-fetch-site"] !== "cross-site"
    );
  } catch {
    return false;
  }
}

export function localModeMiddleware(
  request: IncomingMessage,
  response: ServerResponse,
  next: () => void,
) {
  for (const name of Object.keys(request.headers)) {
    if (name.startsWith("oai-authenticated-user-"))
      delete request.headers[name];
  }
  for (let i = request.rawHeaders.length - 2; i >= 0; i -= 2) {
    if (
      request.rawHeaders[i].toLowerCase().startsWith("oai-authenticated-user-")
    )
      request.rawHeaders.splice(i, 2);
  }
  if (!localRequestAllowed(request)) {
    response.statusCode = 403;
    response.setHeader("Cache-Control", "no-store");
    response.end(
      "Local mode accepts requests only from this computer and this app.",
    );
    return;
  }
  const identity = {
    "oai-authenticated-user-id": "codequest-local",
    "oai-authenticated-user-email": "local@codequest.invalid",
    "oai-authenticated-user-full-name": "Local learner",
    "oai-authenticated-user-full-name-encoding": "percent-encoded-utf-8",
  };
  for (const [name, value] of Object.entries(identity)) {
    request.headers[name] = value;
    request.rawHeaders.push(name, value);
  }
  next();
}

export function localMode(): Plugin {
  return {
    name: "codequest-local-mode",
    apply: "serve",
    enforce: "pre",
    configureServer(server) {
      // Refuse CLI/config overrides which would expose local data to a LAN.
      if (server.config.server.host !== "127.0.0.1")
        throw new Error("Local mode must listen on 127.0.0.1.");
      server.middlewares.use(localModeMiddleware);
    },
  };
}
