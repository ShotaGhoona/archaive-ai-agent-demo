# ChatGPT統合実装戦略

## 概要
現在のAIエージェントシステムを実際のChatGPT APIと連携し、各エージェントが独自の役割と指示を持った対話を実現する実装戦略を検討します。

## 現在の状況分析

### 既存のエージェント構成
```typescript
// 実装対象エージェント
- general: なんでもAI (一般的な相談・質問)
- estimate: 見積もりAI (図面から見積もり自動生成)

// スコープ外
- process: 工程生成AI (製造工程の最適化提案) ※今回は実装しない
- inquiry: 問い合わせAI (よくある質問への迅速回答) ※今回は実装しない
```

### 現在の制約
- ダミーレスポンスでのみ動作
- エージェント別の専門性が未実装
- 実際のAI応答なし

## 実装戦略提案

### 1. アーキテクチャ設計

#### 1.1 API Route Structure
```
src/app/api/chat/
├── route.ts              # メインAPI endpoint
├── agents/
│   ├── general.ts        # 一般エージェント用プロンプト
│   └── estimate.ts       # 見積もりエージェント用プロンプト
└── utils/
    ├── openai.ts         # OpenAI API設定
    ├── prompts.ts        # プロンプト管理
    └── validation.ts     # リクエスト検証
```

#### 1.2 エージェント別システムプロンプト設計

```typescript
// agents/general.ts
export const generalAgentPrompt = `
あなたは製造業・図面作成の専門アシスタントです。
以下のような質問に対して、専門的で実用的な回答を提供してください：

専門分野：
- 機械設計・製図の基本知識
- 材料の特性と選定
- 加工方法の提案
- 品質管理の基本

回答スタイル：
- 具体的で実用的なアドバイス
- 必要に応じて関連する専門エージェントを提案
- 技術的内容を分かりやすく説明
`;

// agents/estimate.ts
export const estimateAgentPrompt = `
あなたは製造業の見積もり専門エージェントです。
図面情報や仕様から正確な見積もりを作成します。

専門分野：
- 材料費の算出
- 加工費の見積もり
- 工数計算
- 納期の見積もり

見積もり項目：
1. 材料費（材質、寸法、数量）
2. 加工費（切削、溶接、仕上げ）
3. 労務費（設計、検査、組立）
4. 諸経費（運搬、管理費）

回答形式：
- 表形式での詳細見積もり
- 各項目の根拠説明
- 代替案の提案
`;

// ※ process.ts と inquiry.ts は今回のスコープ外
```

### 2. API実装設計

#### 2.1 メインAPI Route
```typescript
// src/app/api/chat/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { OpenAI } from 'openai';

interface ChatRequest {
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
    // 図面関連情報
  };
}

export async function POST(request: NextRequest) {
  try {
    const { message, agentId, conversationHistory, blueprintInfo }: ChatRequest = await request.json();
    
    // エージェント別プロンプト取得
    const systemPrompt = getAgentPrompt(agentId);
    
    // OpenAI API呼び出し
    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        { role: 'system', content: systemPrompt },
        ...(conversationHistory || []),
        { role: 'user', content: message }
      ],
      temperature: 0.7,
    });
    
    return NextResponse.json({
      response: response.choices[0].message.content,
      agentId,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

#### 2.2 フロントエンド連携

```typescript
// utils/chatAPI.ts
export interface ChatResponse {
  response: string;
  agentId: string;
  timestamp: string;
}

export async function sendChatMessage(
  message: string,
  agentId: string,
  conversationHistory?: Message[],
  blueprintInfo?: BlueprintInfo
): Promise<ChatResponse> {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message,
      agentId,
      conversationHistory: conversationHistory?.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.content
      })),
      blueprintInfo
    }),
  });
  
  if (!response.ok) {
    throw new Error('Chat API request failed');
  }
  
  return response.json();
}
```

### 3. 既存コードの修正点

#### 3.1 handleSendMessage の更新
```typescript
// index.tsx の handleSendMessage を実際のAPI呼び出しに変更
const handleSendMessage = useCallback(async (content: string) => {
  if (!state.agentConfig) return;

  const userMessage: Message = {
    id: Date.now().toString(),
    content,
    sender: 'user',
    timestamp: new Date(),
  };

  actions.addMessage(userMessage);
  actions.setLoading(true);

  try {
    const response = await sendChatMessage(
      content,
      state.selectedAgent || 'general',
      state.messages,
      blueprintInfo
    );

    const aiResponse: Message = {
      id: (Date.now() + 1).toString(),
      content: response.response,
      sender: 'ai',
      timestamp: new Date(response.timestamp),
    };

    actions.addMessage(aiResponse);
  } catch (error) {
    console.error('Chat error:', error);
    const errorMessage: Message = {
      id: (Date.now() + 1).toString(),
      content: 'エラーが発生しました。しばらく待ってから再度お試しください。',
      sender: 'ai',
      timestamp: new Date(),
      type: 'error'
    };
    actions.addMessage(errorMessage);
  } finally {
    actions.setLoading(false);
  }
}, [actions, state.agentConfig, state.selectedAgent, state.messages, blueprintInfo]);
```

### 4. 環境変数設定

```bash
# .env.local
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-4-turbo-preview
OPENAI_TEMPERATURE=0.7
```

### 5. エラーハンドリング戦略

#### 5.1 API レベル
- レート制限対応
- OpenAI API エラーハンドリング
- タイムアウト処理
- リトライ機構

#### 5.2 フロントエンド レベル
- ネットワークエラー表示
- ローディング状態管理
- エラーメッセージの表示
- 再送信機能

### 6. 今後の拡張可能性

#### 6.1 ファイルアップロード連携
```typescript
// EstimateAgent での図面ファイル解析
export async function analyzeBlueprint(file: File): Promise<BlueprintAnalysis> {
  // GPT-4 Vision API を使用した図面解析
  // 寸法、材質、加工方法の自動抽出
}
```


#### 6.2 コンテキスト共有
```typescript
// エージェント間でのコンテキスト共有（General ↔ Estimate）
interface SharedContext {
  blueprintInfo: BlueprintInfo;
  estimateData?: EstimateData;
  generalInsights?: string[];
}
```

## 実装優先度

### Phase 1: 基本API連携 (1週間)
1. OpenAI API 設定
2. メインAPI Route 実装
3. 基本的なフロントエンド連携
4. エラーハンドリング実装

### Phase 2: GeneralAgent実装 (1週間)
1. GeneralAgent専用プロンプト設計
2. GeneralAgent動作確認
3. UI/UX調整
4. 基本的な図面情報連携

### Phase 3: EstimateAgent実装 (1-2週間)
1. EstimateAgent専用プロンプト設計
2. ファイルアップロード機能
3. 図面解析連携 (GPT-4 Vision)
4. 見積もり表示UI強化

### Phase 4: その他拡張機能 (1週間)
1. パフォーマンス最適化
2. エージェント間コンテキスト共有
3. UI/UX最終調整
4. 本番環境対応

## 技術的課題と解決策

### 課題1: API コスト管理
- **解決策**: キャッシュ機能、使用量監視

### 課題2: レスポンス時間
- **解決策**: ストリーミング対応、プリロード、CDN活用

### 課題3: エージェント間の一貫性
- **解決策**: 共通コンテキスト、情報継承システム

### 課題4: セキュリティ
- **解決策**: API キー管理、入力検証、レート制限

## 質問・検討事項

1. **OpenAI API の料金体系**: 使用量監視をどう実装するか？
2. **エージェント間の情報共有**: General ↔ Estimate の情報をどう引き継ぐか？
3. **図面解析の精度**: GPT-4 Vision API で図面からどこまで情報抽出できるか？
4. **リアルタイム更新**: Server-Sent Events や WebSocket の必要性は？

## 実装推奨順序

### 🎯 Phase 1から始める理由
- API基盤を構築し、OpenAI連携の基本動作を確認
- エラーハンドリングの仕組みを整える

### 🎯 Phase 2: GeneralAgentを選ぶ理由
- シンプルな対話形式で動作確認しやすい
- 複雑な機能（ファイルアップロード等）が不要
- 他エージェントの基盤として活用できる

### 🎯 Phase 3: EstimateAgentの挑戦
- ファイルアップロード機能の実装
- GPT-4 Vision APIでの図面解析
- より高度なUI/UX実装

この戦略について、どの部分を優先的に実装したいか、または追加で検討すべき点があれば教えてください。