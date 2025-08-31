# 01. カコトラAI (Past Trouble AI) Demo実装戦略

## 概要

図面の過去のトラブルをAIとのチャットベースで引き出すシステムのデモ版を構築する。

## 実装目標

### 1. カコトラAIエージェントの作成

- 既存のAIエージェントシステムを拡張して「カコトラAI」を追加
- 過去のトラブルデータをJSONファイルとして保存し、AIが参照できるようにする
- チャット形式でユーザーの質問に対して、関連する過去のトラブル事例と解決策を提示

### 2. データ構造

```
src/features/ai-agent/agents/Trouble/
└── data/
    └── trouble-database.json  # 過去のトラブルデータを格納
```

JSONデータ構造例：

```json
{
  "troubles": [
    {
      "id": "TR001",
      "date": "2024-01-15",
      "category": "加工精度",
      "title": "軸部品の寸法公差外れ",
      "description": "φ20h6の軸加工で、公差0/-0.013mmに対して実測値が-0.015mmとなった",
      "cause": "切削工具の摩耗による加工精度低下",
      "solution": "工具交換頻度を500個から300個に変更、インプロセス計測の導入",
      "preventive_measures": [
        "定期的な工具摩耗チェック",
        "加工100個ごとの抜き取り検査"
      ],
      "related_drawings": ["DWG-2024-001", "DWG-2024-002"],
      "cost_impact": "￥150,000",
      "severity": "中"
    }
  ]
}
```

### 3. 実装手順

#### Step 1: エージェント設定の追加

`src/features/ai-agent/utils/agentConfigs.ts` に以下を追加：

```typescript
trouble: {
  id: 'trouble',
  name: 'カコトラAI',
  icon: AlertTriangle, // または Bug
  description: '過去のトラブル事例から解決策を提案',
  color: '#ef4444', // 赤系の色
  category: AgentCategory.TROUBLE,
  welcomeMessage: '過去のトラブル事例から最適な解決策を見つけます。どのようなトラブルでお困りですか？',
  quickActions: [
    { id: 'search-similar', label: '類似事例を検索', icon: Search, action: '類似のトラブル事例を探してください' },
    { id: 'analyze-cause', label: '原因分析', icon: Target, action: '問題の原因を分析してください' },
    { id: 'suggest-solution', label: '解決策提案', icon: Lightbulb, action: '解決策を提案してください' },
    { id: 'preventive-measures', label: '予防策', icon: Shield, action: '再発防止策を教えてください' },
    { id: 'cost-analysis', label: 'コスト影響', icon: DollarSign, action: 'トラブルのコスト影響を分析してください' },
    { id: 'severity-assessment', label: '重要度評価', icon: AlertCircle, action: 'トラブルの重要度を評価してください' }
  ]
}
```

#### Step 2: APIエンドポイントの作成

`src/app/api/ai-agents/trouble/route.ts` を新規作成：

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { BaseAgent } from '../shared/base-agent';
import { AgentConfig } from '../shared/types';
import { validateUnifiedRequest } from '../shared/validation';
import { handleAgentError } from '../shared/errors';
import troubleDatabase from '@/features/ai-agent/agents/Trouble/data/trouble-database.json';

class TroubleAgent extends BaseAgent {
  config: AgentConfig = {
    id: 'trouble',
    name: '過去トラブル分析エージェント',
    version: '1.0.0',
  };

  buildSystemPrompt(): string {
    // JSONデータを文字列化してコンテキストに含める
    const troubleData = JSON.stringify(troubleDatabase, null, 2);

    return `
あなたは製造業の過去トラブル分析専門AIです。
以下の過去トラブルデータベースを参照して、ユーザーの質問に答えてください。

【過去トラブルデータベース】
${troubleData}

【回答の際の注意点】
1. ユーザーの質問に関連する過去の事例を検索し、具体的に参照する
2. 類似事例がある場合は、その事例番号（ID）を明示する
3. 原因分析は根本原因まで掘り下げて説明する
4. 解決策は実践的で具体的な内容とする
5. 予防策は実行可能で効果的なものを提案する
6. コスト影響や重要度も考慮に入れる
7. 必ず日本語で回答する

【回答フォーマット】
- 関連する過去事例：[事例ID] - [タイトル]
- 問題の詳細：[説明]
- 原因：[原因分析]
- 推奨される解決策：[具体的な対策]
- 予防措置：[再発防止策]
- 備考：[その他の重要情報]
`;
  }

  protected getCompletionOptions() {
    return {
      temperature: 0.2, // より一貫性のある分析のため低めに設定
      maxTokens: 3000, // 詳細な分析のため大きめに設定
    };
  }
}

export async function POST(request: NextRequest) {
  const agent = new TroubleAgent();

  try {
    const formData = await request.formData();
    const agentRequest = validateUnifiedRequest(formData);
    const response = await agent.process(agentRequest);

    return NextResponse.json(response);
  } catch (error) {
    return handleAgentError(error);
  }
}

export async function GET() {
  const agent = new TroubleAgent();
  return NextResponse.json({
    config: agent.config,
    status: 'active',
    version: agent.config.version,
  });
}
```

#### Step 3: サンプルデータの作成

`src/features/ai-agent/agents/Trouble/data/trouble-database.json` を作成し、デモ用の過去トラブルデータを格納する。

### 4. 技術的なポイント

1. **コンテキストウィンドウの活用**
   - JSONデータ全体をシステムプロンプトに含めることで、AIが全ての過去事例を参照可能にする
   - データ量が増えた場合は、ベクトル検索などの実装を検討

2. **既存システムの活用**
   - 既存のAIエージェント基盤を最大限活用し、カスタムコードを最小限に抑える
   - 共有コンポーネント（ChatContent、ChatInput等）をそのまま使用

3. **デモ用の割り切り**
   - 実運用では大規模データに対応するためのDB化やベクトル検索が必要
   - デモではJSONファイルで十分なデータ量に留める

### 5. 期待される動作

1. ユーザーが「軸の寸法精度が出ない」と質問
2. AIが過去の類似事例（TR001）を参照し、以下を回答：
   - 過去の同様の事例と原因
   - 実績のある解決策
   - 予防措置の提案

### 6. 今後の拡張可能性

- 図面画像のアップロード対応（既存のVision API統合を活用）
- トラブルデータの自動追加機能
- 統計分析ダッシュボード
- 機械学習による予測分析

### 7. デモシナリオ

1. 「加工精度が出ません」→ 過去の加工精度トラブル事例を提示
2. 「溶接部にクラックが発生」→ 溶接関連のトラブル事例と対策を提案
3. 「この図面で過去にトラブルはありましたか？」→ 図面番号から関連トラブルを検索
