export const providerIds = ["deepseek", "openai", "anthropic"] as const;
export type AIProvider = (typeof providerIds)[number];
export const providers = {
  deepseek: {
    name: "DeepSeek",
    choice: "DeepSeek",
    model: "deepseek-flash",
    modelName: "V4.1 Flash",
    keyUrl: "https://platform.deepseek.com/api_keys",
  },
  openai: {
    name: "OpenAI",
    choice: "OpenAI (ChatGPT)",
    model: "gpt-6.1-sol",
    modelName: "GPT-6.1 Sol",
    keyUrl: "https://platform.openai.com/api-keys",
  },
  anthropic: {
    name: "Claude",
    choice: "Claude (Anthropic)",
    model: "claude-sonnet-4-6",
    modelName: "Sonnet 4.6",
    keyUrl: "https://platform.claude.com/settings/keys",
  },
} as const;
export function isProvider(value: unknown): value is AIProvider {
  return providerIds.some((id) => id === value);
}
