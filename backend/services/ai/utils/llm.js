import { ChatOpenRouter } from "@langchain/openrouter" // Fixed package import casing

const primaryModel = process.env.OPENROUTER_MODEL || "deepseek/deepseek-chat"
const fallbackModels = (process.env.OPENROUTER_FALLBACK_MODELS || "openai/gpt-4o-mini")
  .split(",")
  .map((model) => model.trim())
  .filter((model) => model && model !== primaryModel)

const llm = new ChatOpenRouter({
  model: primaryModel,
  models: [primaryModel, ...fallbackModels],
  temperature: 0,
  maxTokens: 1024,
})

export default llm