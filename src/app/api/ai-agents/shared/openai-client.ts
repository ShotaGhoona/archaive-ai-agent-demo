import OpenAI from 'openai';

if (!process.env.OPENAI_API_KEY) {
  throw new Error('OPENAI_API_KEY is not defined in environment variables');
}

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// モデル設定
export const MODELS = {
  TEXT: process.env.OPENAI_MODEL || 'o1-preview',
  VISION: process.env.OPENAI_VISION_MODEL || 'gpt-4o', // o1はVision未対応のためgpt-4o継続
} as const;

export const DEFAULT_TEMPERATURE = parseFloat(process.env.OPENAI_TEMPERATURE || '0.7');
export const DEFAULT_MAX_TOKENS = parseInt(process.env.OPENAI_MAX_TOKENS || '2000');

// Vision API 用のヘルパー関数
export function createVisionMessage(text: string, imageBase64: string, mimeType: string) {
  return {
    role: 'user' as const,
    content: [
      {
        type: 'text' as const,
        text: text
      },
      {
        type: 'image_url' as const,
        image_url: {
          url: `data:${mimeType};base64,${imageBase64}`,
          detail: 'high' as const
        }
      }
    ]
  };
}

// チャット完了API呼び出し（テキストのみ）
export async function createChatCompletion(
  messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>,
  options: {
    model?: string;
    temperature?: number;
    maxTokens?: number;
  } = {}
) {
  const {
    model = MODELS.TEXT,
    temperature = DEFAULT_TEMPERATURE,
    maxTokens = DEFAULT_MAX_TOKENS
  } = options;

  return await openai.chat.completions.create({
    model,
    messages,
    temperature,
    max_tokens: maxTokens,
  });
}

// Vision API 呼び出し（画像+テキスト）
export async function createVisionCompletion(
  systemPrompt: string,
  userMessage: string,
  imageBase64: string,
  mimeType: string,
  options: {
    model?: string;
    temperature?: number;
    maxTokens?: number;
  } = {}
) {
  const {
    model = MODELS.VISION,
    temperature = DEFAULT_TEMPERATURE,
    maxTokens = DEFAULT_MAX_TOKENS
  } = options;

  const messages = [
    { role: 'system' as const, content: systemPrompt },
    createVisionMessage(userMessage, imageBase64, mimeType)
  ];

  return await openai.chat.completions.create({
    model,
    messages,
    temperature,
    max_tokens: maxTokens,
  });
}

// 使用量計算
export function calculateUsage(response: OpenAI.Chat.Completions.ChatCompletion, model?: string): {
  tokensUsed: number;
  cost: number;
} {
  const usage = response.usage;
  if (!usage) {
    return { tokensUsed: 0, cost: 0 };
  }

  // モデル別料金設定（2025年7月時点の料金）
  let INPUT_COST_PER_1K = 0.005; // デフォルト: GPT-4o
  let OUTPUT_COST_PER_1K = 0.015;

  if (model === 'o1-preview') {
    INPUT_COST_PER_1K = 0.015; // $0.015 per 1K input tokens
    OUTPUT_COST_PER_1K = 0.060; // $0.060 per 1K output tokens
  }
  
  const inputCost = (usage.prompt_tokens / 1000) * INPUT_COST_PER_1K;
  const outputCost = (usage.completion_tokens / 1000) * OUTPUT_COST_PER_1K;
  const totalCost = inputCost + outputCost;

  return {
    tokensUsed: usage.total_tokens,
    cost: totalCost
  };
}