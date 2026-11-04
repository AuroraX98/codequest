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
export const providerModels = {
  deepseek: [{ id: "deepseek-flash", name: "V4.1 Flash" }],
  openai: [
    { id: "gpt-6.1-sol", name: "GPT-6.1 Sol" },
    { id: "gpt-6-astra", name: "GPT-6 Astra" },
  ],
  anthropic: [
    { id: "claude-sonnet-4-6", name: "Sonnet 4.6" },
    { id: "claude-sonnet-5-5", name: "Sonnet 5.5" },
    { id: "claude-opus-5-5", name: "Opus 5.5" },
    { id: "claude-fable-5-1", name: "Fable 5.1" },
  ],
} as const;
export function isProviderModel(provider: AIProvider, value: unknown): value is string {
  return providerModels[provider].some(model => model.id === value);
}
export function selectedModel(provider: AIProvider, value?: unknown) {
  return providerModels[provider].find(model => model.id === value)
    ?? providerModels[provider].find(model => model.id === providers[provider].model)!;
}
export function isProvider(value: unknown): value is AIProvider {
  return providerIds.some((id) => id === value);
}
