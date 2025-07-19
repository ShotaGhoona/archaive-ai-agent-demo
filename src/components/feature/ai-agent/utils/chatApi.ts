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

export async function sendChatMessage(request: ChatApiRequest): Promise<ChatApiResponse> {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const data: ChatApiResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Chat API error:', error);
    throw error;
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