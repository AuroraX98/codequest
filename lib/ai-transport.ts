import { providers, type AIProvider } from "./ai-providers";
type Message = { role: "user" | "assistant"; content: string };
export class AssistantError extends Error {
  constructor(
    message: string,
    public status = 502,
  ) {
    super(message);
  }
}
export function providerRequest(
  provider: AIProvider,
  key: string,
  system: string,
  messages: Message[],
): {
  url: string;
  headers: Record<string, string>;
  body: Record<string, unknown>;
} {
  const common = { model: providers[provider].model, stream: false };
  if (provider === "openai")
    return {
      url: "https://api.openai.com/v1/responses",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: {
        ...common,
        instructions: system,
        input: messages,
        store: false,
        reasoning: { effort: "low" },
        max_output_tokens: 6000,
      },
    };
  if (provider === "anthropic")
    return {
      url: "https://api.anthropic.com/v1/messages",
      headers: {
        "x-api-key": key,
        "anthropic-version": "2023-06-01",
        "Content-Type": "application/json",
      },
      body: { ...common, system, messages, max_tokens: 1600 },
    };
  return {
    url: "https://api.deepseek.com/chat/completions",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: {
      ...common,
      messages: [{ role: "system", content: system }, ...messages],
      max_tokens: 1600,
      thinking: { type: "disabled" },
    },
  };
}
const object = (value: unknown): Record<string, unknown> =>
  value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
const array = (value: unknown): unknown[] =>
  Array.isArray(value) ? value : [];
export function providerAnswer(provider: AIProvider, data: unknown) {
  const name = providers[provider].name,
    d = object(data);
  const first = object(array(d.choices)[0]);
  const failed =
    (provider === "openai" &&
      (d.status !== "completed" || d.error || d.incomplete_details)) ||
    (provider === "anthropic" && d.stop_reason !== "end_turn") ||
    (provider === "deepseek" && first.finish_reason !== "stop");
  if (failed)
    throw new AssistantError(
      `${name} could not finish its reply. Try a shorter question.`,
    );
  let text: string;
  if (provider === "openai")
    text = array(d.output)
      .map(object)
      .filter((item) => item.type === "message")
      .flatMap((item) => array(item.content))
      .map(object)
      .filter(
        (block) =>
          block.type === "output_text" && typeof block.text === "string",
      )
      .map((block) => block.text)
      .join("\n");
  else if (provider === "anthropic")
    text = array(d.content)
      .map(object)
      .filter(
        (block) => block.type === "text" && typeof block.text === "string",
      )
      .map((block) => block.text)
      .join("\n");
  else {
    const message = object(first.message);
    text = typeof message.content === "string" ? message.content : "";
  }
  if (!text.trim())
    throw new AssistantError(
      `${name} returned an empty reply. Please try again.`,
    );
  return text;
}
export async function askProvider(
  provider: AIProvider,
  key: string,
  system: string,
  messages: Message[],
  send: typeof fetch = fetch,
) {
  const request = providerRequest(provider, key, system, messages),
    name = providers[provider].name;
  let response: Response;
  try {
    response = await send(request.url, {
      method: "POST",
      headers: request.headers,
      body: JSON.stringify(request.body),
      redirect: "error",
      cache: "no-store",
      signal: AbortSignal.timeout(45000),
    });
  } catch {
    throw new AssistantError(
      `${name} did not respond. Your work is saved; try again shortly.`,
      504,
    );
  }
  if (!response.ok) {
    throw new AssistantError(
      response.status === 401 || response.status === 403
        ? `${name} rejected the key or access. Check it in Settings.`
        : response.status === 402
          ? `Your ${name} account needs API credit.`
          : response.status === 429
            ? `${name} is busy or your account reached its usage limit. Check your API account or try again shortly.`
            : `${name} could not answer this time. Check your API account or try again shortly.`,
    );
  }
  let data: unknown;
  try {
    data = await response.json();
  } catch {
    throw new AssistantError(
      `${name} returned an unreadable reply. Please try again.`,
    );
  }
  return providerAnswer(provider, data);
}
