export interface ChatRequest {
  message: string;
  agentId: string;
  conversationHistory?: Array<{
    role: 'user' | 'assistant';
    content: string;
  }>;
  blueprintInfo?: {
    id: string;
    name: string;
    material: string;
    customerName: string;
    productName: string;
  };
}

export interface ChatResponse {
  response: string;
  agentId: string;
  timestamp: string;
}

export function validateChatRequest(body: any): ChatRequest {
  if (!body.message || typeof body.message !== 'string') {
    throw new Error('Message is required and must be a string');
  }

  if (!body.agentId || typeof body.agentId !== 'string') {
    throw new Error('AgentId is required and must be a string');
  }

  // メッセージの長さ制限
  if (body.message.length > 2000) {
    throw new Error('Message is too long (max 2000 characters)');
  }

  // 対応エージェントの確認
  const validAgents = ['general', 'estimate'];
  if (!validAgents.includes(body.agentId)) {
    throw new Error(`Invalid agentId. Must be one of: ${validAgents.join(', ')}`);
  }

  return {
    message: body.message,
    agentId: body.agentId,
    conversationHistory: body.conversationHistory || [],
    blueprintInfo: body.blueprintInfo,
  };
}