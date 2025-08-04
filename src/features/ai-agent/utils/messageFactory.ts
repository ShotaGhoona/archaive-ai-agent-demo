import { Message } from "../types/types";

/**
 * ユーザーメッセージを作成
 */
export const createUserMessage = (content: string, hasImage: boolean = false): Message => {
  return {
    id: Date.now().toString(),
    content: hasImage ? `${content} [画像参照]` : content,
    sender: 'user',
    timestamp: new Date(),
  };
};

/**
 * タイピング中メッセージを作成
 */
export const createTypingMessage = (): Message => {
  return {
    id: 'typing',
    content: '',
    sender: 'ai',
    timestamp: new Date(),
    isTyping: true,
  };
};

/**
 * AI応答メッセージを作成
 */
export const createAIMessage = (content: string): Message => {
  return {
    id: (Date.now() + 1).toString(),
    content,
    sender: 'ai',
    timestamp: new Date(),
  };
};

/**
 * エラーメッセージを作成
 */
export const createErrorMessage = (error: unknown): Message => {
  const content = error instanceof Error 
    ? `申し訳ございません。エラーが発生しました: ${error.message}`
    : 'エラーが発生しました。しばらくしてからもう一度お試しください。';
  
  return {
    id: (Date.now() + 1).toString(),
    content,
    sender: 'ai',
    timestamp: new Date(),
    type: 'error'
  };
};

/**
 * ウェルカムメッセージを作成
 */
export const createWelcomeMessage = (content: string): Message => {
  return {
    id: 'welcome',
    content,
    sender: 'ai',
    timestamp: new Date(),
    type: 'welcome'
  };
};

/**
 * システムメッセージを作成
 */
export const createSystemMessage = (content: string): Message => {
  return {
    id: `system-${Date.now()}`,
    content,
    sender: 'ai',
    timestamp: new Date(),
    type: 'system'
  };
};