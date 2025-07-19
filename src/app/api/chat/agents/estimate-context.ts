// EstimateAgent用のコンテキスト拡張機能

export interface EstimateContext {
  blueprintInfo?: {
    id: string;
    name: string;
    material: string;
    customerName: string;
    productName: string;
  };
  estimateType?: 'quick' | 'detailed' | 'final';
  quantity?: number;
  deliveryRequirement?: {
    deadline: Date;
    priority: 'normal' | 'urgent' | 'flexible';
  };
  qualityRequirements?: {
    tolerance: string;
    surfaceFinish: string;
    inspection: string[];
  };
  previousEstimates?: Array<{
    date: Date;
    amount: number;
    items: string[];
  }>;
}

export function enhanceEstimatePrompt(basePrompt: string, context: EstimateContext): string {
  let enhancedPrompt = basePrompt;

  // 図面情報がある場合のコンテキスト追加
  if (context.blueprintInfo) {
    enhancedPrompt += `\n\n## 対象図面情報\n`;
    enhancedPrompt += `- 図面ID: ${context.blueprintInfo.id}\n`;
    enhancedPrompt += `- 図面名: ${context.blueprintInfo.name}\n`;
    enhancedPrompt += `- 指定材質: ${context.blueprintInfo.material}\n`;
    enhancedPrompt += `- 顧客名: ${context.blueprintInfo.customerName}\n`;
    enhancedPrompt += `- 製品名: ${context.blueprintInfo.productName}\n`;
    enhancedPrompt += `この図面情報を基に、具体的で実現可能な見積もりを作成してください。\n`;
  }

  // 見積もりタイプの設定
  if (context.estimateType) {
    enhancedPrompt += `\n## 見積もりタイプ\n`;
    switch (context.estimateType) {
      case 'quick':
        enhancedPrompt += `概算見積もり: 迅速な価格提示を優先し、類似案件との比較を含めてください。\n`;
        break;
      case 'detailed':
        enhancedPrompt += `詳細見積もり: 全工程の積算を行い、材料費・加工費・諸経費を詳細に算出してください。\n`;
        break;
      case 'final':
        enhancedPrompt += `最終見積もり: 交渉余地・支払条件・納期条件を含む契約レベルの見積もりを作成してください。\n`;
        break;
    }
  }

  // 数量情報
  if (context.quantity) {
    enhancedPrompt += `\n## 製造数量\n`;
    enhancedPrompt += `予定数量: ${context.quantity}個\n`;
    enhancedPrompt += `数量スケールメリット、セットアップコスト配分、材料調達効率を考慮してください。\n`;
  }

  // 納期要件
  if (context.deliveryRequirement) {
    enhancedPrompt += `\n## 納期要件\n`;
    enhancedPrompt += `納期: ${context.deliveryRequirement.deadline.toLocaleDateString()}\n`;
    enhancedPrompt += `優先度: ${context.deliveryRequirement.priority}\n`;
    if (context.deliveryRequirement.priority === 'urgent') {
      enhancedPrompt += `急納対応のため、割増料金や代替工程の検討が必要です。\n`;
    }
  }

  // 品質要件
  if (context.qualityRequirements) {
    enhancedPrompt += `\n## 品質要件\n`;
    enhancedPrompt += `- 公差: ${context.qualityRequirements.tolerance}\n`;
    enhancedPrompt += `- 表面仕上げ: ${context.qualityRequirements.surfaceFinish}\n`;
    enhancedPrompt += `- 検査項目: ${context.qualityRequirements.inspection.join(', ')}\n`;
    enhancedPrompt += `これらの品質要件を満たすための追加工程と費用を考慮してください。\n`;
  }

  // 過去の見積もり履歴
  if (context.previousEstimates && context.previousEstimates.length > 0) {
    enhancedPrompt += `\n## 過去の見積もり実績\n`;
    context.previousEstimates.slice(-2).forEach((estimate, index) => {
      enhancedPrompt += `${index + 1}. ${estimate.date.toLocaleDateString()}: ¥${estimate.amount.toLocaleString()}\n`;
    });
    enhancedPrompt += `過去の実績を参考に、価格妥当性と改善提案を含めてください。\n`;
  }

  return enhancedPrompt;
}

// 見積もり関連のクイックアクション
export const estimateQuickActions = {
  'quick-estimate': {
    question: '概算見積もり',
    context: 'この図面の概算見積もりを作成してください。類似製品との比較も含めて、迅速な価格提示をお願いします。',
    estimateType: 'quick' as const
  },
  'detailed-estimate': {
    question: '詳細見積もり',
    context: 'この図面の詳細見積もりを作成してください。材料費、加工費、工数を詳細に算出し、根拠を明確にしてください。',
    estimateType: 'detailed' as const
  },
  'material-cost': {
    question: '材料費分析',
    context: 'この図面の材料費を詳細に分析してください。材料選定の代替案やコスト削減提案も含めてください。',
    estimateType: 'detailed' as const
  },
  'processing-cost': {
    question: '加工費算出',
    context: 'この図面の加工費を算出してください。各工程の時間と単価、効率的な加工方法の提案も含めてください。',
    estimateType: 'detailed' as const
  },
  'delivery-time': {
    question: '納期見積もり',
    context: 'この図面の製造納期を見積もってください。工程スケジュール、リードタイム、急納対応の可能性も含めてください。',
    estimateType: 'quick' as const
  },
  'cost-optimization': {
    question: 'コスト最適化',
    context: 'この図面のコスト最適化案を提案してください。品質を維持しながらコストを削減する方法を具体的に示してください。',
    estimateType: 'detailed' as const
  }
};

export function getEstimateQuestionContext(questionId: string): { context: string; estimateType: 'quick' | 'detailed' | 'final' } {
  const question = estimateQuickActions[questionId as keyof typeof estimateQuickActions];
  return question ? { context: question.context, estimateType: question.estimateType } : { context: '', estimateType: 'quick' };
}