import { NextRequest, NextResponse } from 'next/server';
import { BaseAgent } from '../shared/base-agent';
import { AgentConfig } from '../shared/types';
import { validateUnifiedRequest } from '../shared/validation';
import { handleAgentError } from '../shared/errors';

// Estimate Agent クラス
class EstimateAgent extends BaseAgent {
  config: AgentConfig = {
    id: 'estimate',
    name: '見積もりエージェント',
    version: '1.0.0'
    // ✅ inputType, capabilities 削除（自動判定にて統一）
  };

  // ✅ process()メソッドは継承で自動取得（自動判定機能付き）
  // ✅ 画像処理ロジックは継承で自動取得

  buildSystemPrompt(): string {
    return `
あなたは製造業の見積もり専門AIです。
画像が提供された場合は図面として分析し、見積もりを作成してください。
テキストのみの場合は見積もりに関する質問に回答してください。

## 出力形式
### 📋 図面分析
- 部品概要、主要寸法、推定材質

### 💰 見積もり
| 項目 | 単価 | 数量 | 金額 | 備考 |
|------|------|------|------|------|
| 材料費 | ¥X/kg | Xkg | ¥X | XX材、切りしろ含む |
| 加工費 | ¥X/時間 | X時間 | ¥X | XX加工、段取り含む |
| 合計 | - | - | ¥X | 税抜・1個あたり |

### 📅 納期
標準納期：X営業日

### 💡 最適化提案
- コスト削減案があれば提示

必ず日本語で、表形式を使って見やすく回答してください。
`;
  }

  // 🎯 見積もり特化の設定
  protected getCompletionOptions() {
    return { temperature: 0.3, maxTokens: 3000 };
  }
}

// 🎯 統一APIエンドポイント
export async function POST(request: NextRequest) {
  const agent = new EstimateAgent();
  
  try {
    const formData = await request.formData();
    const agentRequest = validateUnifiedRequest(formData); // ✅ 統一バリデーション
    const response = await agent.process(agentRequest);
    
    return NextResponse.json(response);
  } catch (error) {
    return handleAgentError(error);
  }
}

// エージェント設定情報の取得
export async function GET() {
  const agent = new EstimateAgent();
  return NextResponse.json({
    config: agent.config,
    status: 'active',
    version: agent.config.version
  });
}