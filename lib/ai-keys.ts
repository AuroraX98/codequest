import { isProvider, type AIProvider } from "./ai-providers";
const bytes = (value: string) =>
  Uint8Array.from(atob(value), (c) => c.charCodeAt(0));
const base64 = (value: Uint8Array) => btoa(String.fromCharCode(...value));
export function storedConnection(value: string) {
  if (!value.startsWith("{")) {
    if (!/^[A-Za-z0-9+/=]+\.[A-Za-z0-9+/=]+$/.test(value))
      throw new Error("Reconnect your AI assistant in Settings.");
    return { provider: "deepseek" as AIProvider, cipher: value, bound: false };
  }
  const data = JSON.parse(value);
  if (
    data.version !== 1 ||
    !isProvider(data.provider) ||
    typeof data.cipher !== "string"
  )
    throw new Error("Reconnect your AI assistant in Settings.");
  return {
    provider: data.provider as AIProvider,
    cipher: data.cipher,
    bound: true,
  };
}
const context = (user: string, provider: AIProvider) =>
  new TextEncoder().encode(JSON.stringify(["codequest-ai-v1", user, provider]));
export async function sealConnection(
  provider: AIProvider,
  value: string,
  user: string,
  secret: Uint8Array,
) {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await crypto.subtle.importKey(
    "raw",
    secret as BufferSource,
    "AES-GCM",
    false,
    ["encrypt"],
  );
  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv, additionalData: context(user, provider) },
    key,
    new TextEncoder().encode(value),
  );
  return JSON.stringify({
    version: 1,
    provider,
    cipher: base64(iv) + "." + base64(new Uint8Array(encrypted)),
  });
}
export async function openConnection(
  value: string,
  user: string,
  secret: Uint8Array,
) {
  try {
    const saved = storedConnection(value);
    const [a, b] = saved.cipher.split(".");
    const key = await crypto.subtle.importKey(
      "raw",
      secret as BufferSource,
      "AES-GCM",
      false,
      ["decrypt"],
    );
    const decrypted = await crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv: bytes(a),
        ...(saved.bound
          ? { additionalData: context(user, saved.provider) }
          : {}),
      },
      key,
      bytes(b),
    );
    return {
      provider: saved.provider,
      key: new TextDecoder().decode(decrypted),
    };
  } catch {
    throw new Error("Reconnect your AI assistant in Settings.");
  }
}
