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

export async function sendChatMessage(request: ChatApiRequest): Promise<ChatApiResponse> {
  try {
    // エージェント別にAPIエンドポイントを振り分け
    const endpoint = getAgentEndpoint(request.agentId);
    
    // エージェント別のリクエスト処理
    if (request.agentId === 'estimate') {
      // 見積もりエージェントの場合、専用API関数を使用
      console.warn('Use sendEstimateMessage for estimate agent');
      throw new Error('Use sendEstimateMessage for estimate agent with image support');
    }
    
    // 一般エージェント用のリクエスト形式
    const apiRequest = {
      message: request.message,
      context: {
        history: request.conversationHistory,
      },
      metadata: request.blueprintInfo ? {
        blueprintInfo: request.blueprintInfo
      } : undefined
    };

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(apiRequest),
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
  } catch (error) {
    console.error('Chat API error:', error);
    throw error;
  }
}

// 見積もりエージェント専用API（画像対応）
export async function sendEstimateMessage(request: EstimateApiRequest): Promise<EstimateApiResponse> {
  try {
    const formData = new FormData();
    formData.append('message', request.message);
    
    if (request.image) {
      formData.append('image', request.image);
    }

    const response = await fetch('/api/ai-agents/estimate', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const data: EstimateApiResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Estimate API error:', error);
    throw error;
  }
}

// エージェント別エンドポイント取得
function getAgentEndpoint(agentId: string): string {
  switch (agentId) {
    case 'general':
      return '/api/ai-agents/general';
    case 'estimate':
      return '/api/ai-agents/estimate';
    default:
      throw new Error(`Unknown agent ID: ${agentId}`);
  }
}

// 統合版 - エージェント別の自動切り替え
export async function sendAgentMessage(
  agentId: string,
  message: string,
  options: {
    image?: File;
    conversationHistory?: Array<{ role: 'user' | 'assistant'; content: string }>;
    metadata?: any;
  } = {}
): Promise<ChatApiResponse> {
  if (agentId === 'estimate') {
    // 見積もりエージェント用
    const estimateResponse = await sendEstimateMessage({
      message,
      image: options.image
    });
    
    // レスポンス形式を統一
    return {
      response: estimateResponse.response,
      agentId: 'estimate',
      timestamp: estimateResponse.timestamp
    };
  } else {
    // 一般エージェント用
    return await sendChatMessage({
      message,
      agentId,
      conversationHistory: options.conversationHistory,
      blueprintInfo: options.metadata?.blueprintInfo
    });
  }
}

export function convertMessagesToHistory(messages: Array<{ content: string; sender: 'user' | 'ai' }>): Array<{ role: 'user' | 'assistant'; content: string }> {
  return messages
    .filter(msg => msg.sender !== 'ai' || !msg.content.includes('typing'))
    .map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'assistant',
      content: msg.content
    }));
}