// GeneralAgent用のコンテキスト拡張機能

export interface ManufacturingContext {
  blueprintInfo?: {
    id: string;
    name: string;
    material: string;
    customerName: string;
    productName: string;
  };
  previousQuestions?: string[];
  userPreferences?: {
    experienceLevel: 'beginner' | 'intermediate' | 'expert';
    preferredUnits: 'metric' | 'imperial';
    industryFocus: string[];
  };
}

export function enhanceGeneralPrompt(basePrompt: string, context: ManufacturingContext): string {
  let enhancedPrompt = basePrompt;

  // 図面情報がある場合のコンテキスト追加
  if (context.blueprintInfo) {
    enhancedPrompt += `\n\n## 現在の図面情報\n`;
    enhancedPrompt += `- 図面名: ${context.blueprintInfo.name}\n`;
    enhancedPrompt += `- 材質: ${context.blueprintInfo.material}\n`;
    enhancedPrompt += `- 顧客: ${context.blueprintInfo.customerName}\n`;
    enhancedPrompt += `- 製品: ${context.blueprintInfo.productName}\n`;
    enhancedPrompt += `この図面情報を考慮して、より具体的で実用的な回答を提供してください。\n`;
  }

  // 過去の質問履歴がある場合
  if (context.previousQuestions && context.previousQuestions.length > 0) {
    enhancedPrompt += `\n## 過去の質問履歴\n`;
    enhancedPrompt += `以下の質問履歴を参考に、一貫性のある回答を提供してください:\n`;
    context.previousQuestions.slice(-3).forEach((question, index) => {
      enhancedPrompt += `${index + 1}. ${question}\n`;
    });
  }

  // ユーザー設定がある場合
  if (context.userPreferences) {
    enhancedPrompt += `\n## ユーザー設定\n`;
    enhancedPrompt += `- 経験レベル: ${context.userPreferences.experienceLevel}\n`;
    enhancedPrompt += `- 単位系: ${context.userPreferences.preferredUnits}\n`;
    if (context.userPreferences.industryFocus.length > 0) {
      enhancedPrompt += `- 関心分野: ${context.userPreferences.industryFocus.join(', ')}\n`;
    }
    enhancedPrompt += `このユーザープロファイルに合わせて、適切な詳細レベルで回答してください。\n`;
  }

  return enhancedPrompt;
}

// よくある質問とその回答テンプレート
export const commonQuestions = {
  'design-basics': {
    question: '設計の基本を教えて',
    context: '機械設計の基本的な考え方、手順、注意点について説明してください。初心者にも分かりやすく、実践的な内容を含めてください。'
  },
  'material-selection': {
    question: '材料の選び方',
    context: '用途に応じた適切な材料の選定方法について説明してください。コスト、強度、加工性などの要素を含めて説明してください。'
  },
  'tolerance-guide': {
    question: '公差設定のガイド',
    context: '寸法公差と幾何公差の基本的な考え方と設定方法について説明してください。実際の図面作成に役立つ具体的な指針を含めてください。'
  },
  'processing-methods': {
    question: '加工方法について',
    context: '様々な加工方法（切削、板金、鋳造など）の特徴と適用場面について説明してください。コストと品質の観点も含めてください。'
  },
  'quality-control': {
    question: '品質管理のポイント',
    context: '製造品質を確保するための管理方法と検査手法について説明してください。予防保全の観点も含めてください。'
  },
  'safety-guidelines': {
    question: '安全ガイドライン',
    context: '製造現場での安全対策と設計時に考慮すべき安全要素について説明してください。法的要件も含めてください。'
  }
};

export function getQuestionContext(questionId: string): string {
  const question = commonQuestions[questionId as keyof typeof commonQuestions];
  return question ? question.context : '';
}