interface ChatApiRequest {
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

interface ChatApiResponse {
  response: string;
  agentId: string;
  timestamp: string;
}

// Vision対応の見積もりエージェント用API
interface EstimateApiRequest {
  message: string;
  image?: File;
}

interface EstimateApiResponse {
  response: string;
  timestamp: string;
  hasImage: boolean;
}

// ✅ 削除済み: 旧API関数群（sendUnifiedMessageに統一）
// - sendChatMessage (50行)
// - sendEstimateMessage (30行) 
// - getAgentEndpoint (10行)
// - sendAgentMessage (25行)
// 
// 🎯 統一API（sendUnifiedMessage）のみ使用

// 🎯 全エージェント統一のAPI呼び出し（新版）
export async function sendUnifiedMessage(
  agentId: string,
  message: string,
  options: {
    image?: File;
    conversationHistory?: Array<{ role: 'user' | 'assistant'; content: string }>;
    metadata?: any;
  } = {}
): Promise<ChatApiResponse> {
  const formData = new FormData();
  formData.append('message', message);
  
  if (options.image) {
    formData.append('image', options.image);
  }
  
  if (options.conversationHistory) {
    formData.append('context', JSON.stringify({
      history: options.conversationHistory
    }));
  }
  
  if (options.metadata) {
    formData.append('metadata', JSON.stringify(options.metadata));
  }

  const response = await fetch(`/api/ai-agents/${agentId}`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || errorData.error || `HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  
  // 新APIレスポンス形式を旧形式に変換
  return {
    response: data.response,
    agentId: data.agentId,
    timestamp: data.timestamp
  };
}

export function convertMessagesToHistory(messages: Array<{ content: string; sender: 'user' | 'ai' }>): Array<{ role: 'user' | 'assistant'; content: string }> {
  return messages
    .filter(msg => msg.sender !== 'ai' || !msg.content.includes('typing'))
    .map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'assistant',
      content: msg.content
    }));
}