// ダミーレスポンス用のAPI
// 実際のAPIは使用せず、フロントエンドでダミーデータを返す

interface ChatApiResponse {
  response: string;
  agentId: string;
  timestamp: string;
}

// ダミーレスポンスのテンプレート
const dummyResponses: Record<string, string[]> = {
  general: [
    "ご質問ありがとうございます。製造プロセスについて詳しく説明いたします。",
    "その材料は高強度と軽量性を兼ね備えており、多くの産業で使用されています。",
    "コスト削減のためには、生産効率の向上と材料の最適化が重要です。",
    "品質管理システムを導入することで、不良率を大幅に削減できます。"
  ],
  estimate: [
    "図面を確認しました。この部品の製造には約3週間かかります。",
    "材料費と加工費を含めて、概算で50万円程度になります。",
    "精密加工が必要なため、通常より工期が長くなる可能性があります。",
    "大量生産により単価を下げることが可能です。詳細をご相談ください。"
  ]
};

// ダミーのAPI呼び出し関数（実際にはAPIを呼ばない）
export async function sendUnifiedMessage(
  agentId: string,
  message: string,
  options: {
    image?: File;
    conversationHistory?: Array<{ role: 'user' | 'assistant'; content: string }>;
    metadata?: Record<string, unknown>;
  } = {}
): Promise<ChatApiResponse> {
  // 1秒の遅延をシミュレート
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // エージェントIDに基づいてダミーレスポンスを選択
  const responses = dummyResponses[agentId] || dummyResponses.general;
  const randomResponse = responses[Math.floor(Math.random() * responses.length)];
  
  // 画像がある場合は特別なレスポンス
  if (options.image) {
    return {
      response: `画像を確認しました。${randomResponse}`,
      agentId,
      timestamp: new Date().toISOString()
    };
  }
  
  return {
    response: randomResponse,
    agentId,
    timestamp: new Date().toISOString()
  };
}

// メッセージ履歴の変換ヘルパー
export function convertMessagesToHistory(messages: Array<{ content: string; sender: 'user' | 'ai' }>): Array<{ role: 'user' | 'assistant'; content: string }> {
  return messages
    .filter(msg => msg.sender !== 'ai' || !msg.content.includes('typing'))
    .map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'assistant',
      content: msg.content
    }));
}