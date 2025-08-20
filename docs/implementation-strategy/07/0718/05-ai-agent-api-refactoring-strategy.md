# AI Agent API リファクタリング戦略書

## 概要

現在の単一APIエンドポイント（`/api/chat`）から、エージェント別の独立したAPIエンドポイントへのリファクタリング戦略。Vision API対応と今後の拡張性を重視した設計。

## 現状分析

### 既存構造の問題点

1. **単一エンドポイントの制約**
   - `/api/chat` で全エージェントを処理
   - JSON固定で Vision API（FormData）に対応困難
   - エージェント別の特殊処理が複雑化

2. **拡張性の課題**
   - 新しいエージェント追加時のルーティング複雑化
   - 入力形式の違いへの対応困難
   - コードの可読性・保守性の低下

3. **型安全性の不足**
   - エージェント別の型定義が混在
   - 入力・出力の型チェックが不十分

## 新しいアーキテクチャ設計

### 1. エージェント別エンドポイント分離

```
src/app/api/ai-agents/
├── shared/                    # 共通ロジック
│   ├── types.ts              # 統一型定義
│   ├── base-agent.ts         # ベースエージェントクラス
│   ├── middleware.ts         # 共通ミドルウェア
│   ├── validation.ts         # バリデーション関数
│   ├── errors.ts             # エラーハンドリング
│   ├── openai-client.ts      # OpenAI API クライアント
│   └── utils.ts              # 共通ユーティリティ
├── general/
│   └── route.ts              # 一般エージェント (JSON API)
├── estimate/
│   └── route.ts              # 見積もりエージェント (FormData + Vision API)
├── inquiry/                  # 今後実装予定
│   └── route.ts              # 問い合わせエージェント
└── process/                  # 今後実装予定
    └── route.ts              # 工程生成エージェント
```

### 2. 統一されたエージェントインターフェース

```typescript
// shared/types.ts
export interface AgentConfig {
  id: string;
  name: string;
  version: string;
  inputType: 'json' | 'formdata' | 'multipart';
  capabilities: AgentCapability[];
}

export interface AgentCapability {
  type: 'text' | 'vision' | 'audio' | 'file';
  formats?: string[];
  maxSize?: number;
}

export interface AgentRequest<T = any> {
  message: string;
  metadata?: T;
  context?: ConversationContext;
}

export interface AgentResponse {
  response: string;
  agentId: string;
  timestamp: string;
  usage?: UsageStats;
  attachments?: ResponseAttachment[];
}

// shared/base-agent.ts
export abstract class BaseAgent {
  abstract config: AgentConfig;
  abstract process(request: AgentRequest): Promise<AgentResponse>;
  
  protected validateRequest(request: AgentRequest): void {
    // 共通バリデーション
  }
  
  protected handleError(error: Error): never {
    // 共通エラーハンドリング
  }
}
```

### 3. エージェント別実装方針

#### General Agent (テキストのみ)
```typescript
// api/ai-agents/general/route.ts
export async function POST(request: NextRequest) {
  const agent = new GeneralAgent();
  
  try {
    const body = await request.json();
    const agentRequest: AgentRequest = validateGeneralRequest(body);
    const response = await agent.process(agentRequest);
    
    return NextResponse.json(response);
  } catch (error) {
    return handleAgentError(error);
  }
}

class GeneralAgent extends BaseAgent {
  config: AgentConfig = {
    id: 'general',
    name: '一般エージェント',
    version: '1.0.0',
    inputType: 'json',
    capabilities: [{ type: 'text' }]
  };

  async process(request: AgentRequest): Promise<AgentResponse> {
    // OpenAI Chat Completions API (テキストのみ)
  }
}
```

#### Estimate Agent (Vision対応)
```typescript
// api/ai-agents/estimate/route.ts
export async function POST(request: NextRequest) {
  const agent = new EstimateAgent();
  
  try {
    const formData = await request.formData();
    const agentRequest: AgentRequest = validateEstimateRequest(formData);
    const response = await agent.process(agentRequest);
    
    return NextResponse.json(response);
  } catch (error) {
    return handleAgentError(error);
  }
}

class EstimateAgent extends BaseAgent {
  config: AgentConfig = {
    id: 'estimate',
    name: '見積もりエージェント',
    version: '1.0.0',
    inputType: 'formdata',
    capabilities: [
      { type: 'text' },
      { 
        type: 'vision', 
        formats: ['image/jpeg', 'image/png', 'image/webp'],
        maxSize: 20 * 1024 * 1024 
      }
    ]
  };

  async process(request: AgentRequest<EstimateMetadata>): Promise<AgentResponse> {
    // OpenAI Vision API + 図面解析ロジック
  }
}
```

### 4. 共通ミドルウェアシステム

```typescript
// shared/middleware.ts
export async function withAuth(handler: AgentHandler): Promise<AgentHandler> {
  return async (request) => {
    // 認証チェック
    const isAuthenticated = await validateApiKey(request);
    if (!isAuthenticated) {
      throw new UnauthorizedError();
    }
    return handler(request);
  };
}

export async function withRateLimit(handler: AgentHandler): Promise<AgentHandler> {
  return async (request) => {
    // レート制限チェック
    const canProceed = await checkRateLimit(request);
    if (!canProceed) {
      throw new RateLimitError();
    }
    return handler(request);
  };
}

export async function withLogging(handler: AgentHandler): Promise<AgentHandler> {
  return async (request) => {
    // リクエスト・レスポンスログ
    const startTime = Date.now();
    try {
      const response = await handler(request);
      logSuccess(request, response, Date.now() - startTime);
      return response;
    } catch (error) {
      logError(request, error, Date.now() - startTime);
      throw error;
    }
  };
}
```

### 5. 型安全なバリデーション

```typescript
// shared/validation.ts
import { z } from 'zod';

export const GeneralRequestSchema = z.object({
  message: z.string().min(1).max(2000),
  conversationHistory: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string()
  })).optional(),
  metadata: z.object({
    sessionId: z.string().optional(),
    userId: z.string().optional()
  }).optional()
});

export const EstimateRequestSchema = z.object({
  message: z.string().min(1).max(2000),
  image: z.instanceof(File).optional(),
  metadata: z.object({
    blueprintInfo: z.object({
      id: z.string(),
      name: z.string(),
      material: z.string()
    }).optional(),
    estimateType: z.enum(['quick', 'detailed', 'final']).optional()
  }).optional()
});

export function validateGeneralRequest(body: unknown): AgentRequest {
  const result = GeneralRequestSchema.parse(body);
  return {
    message: result.message,
    metadata: result.metadata,
    context: {
      history: result.conversationHistory || []
    }
  };
}
```

## 実装フェーズ

### Phase 1: 共通インフラストラクチャ
1. **shared** ディレクトリの作成
2. 共通型定義の実装
3. ベースエージェントクラスの実装
4. ミドルウェア・バリデーション機能の実装

### Phase 2: General Agent 移行
1. `/api/ai-agents/general/route.ts` の実装
2. 既存 `/api/chat` からのロジック移行
3. テストとバグ修正

### Phase 3: Estimate Agent Vision対応
1. `/api/ai-agents/estimate/route.ts` の実装
2. Vision API 統合
3. 図面解析専用プロンプトの実装
4. FormData 対応の実装

### Phase 4: レガシーAPI統合
1. 既存 `/api/chat` エンドポイントの Proxy 実装
2. フロントエンドの段階的移行
3. 後方互換性の確保

### Phase 5: 新エージェント準備
1. `inquiry` エージェントの骨組み実装
2. `process` エージェントの骨組み実装
3. 拡張性テストとドキュメント整備

## メリット

### 1. 拡張性
- 新しいエージェントが独立して追加可能
- エージェント固有の処理ロジックが分離
- 異なる入力形式への柔軟な対応

### 2. 保守性
- エージェント別のコードが明確に分離
- 共通ロジックの重複排除
- 型安全性による品質向上

### 3. パフォーマンス
- エージェント別の最適化が可能
- 不要な処理の排除
- 並列処理の実装が容易

### 4. セキュリティ
- エージェント別の認証・認可設定
- 入力バリデーションの強化
- ログ・監査機能の統一

## 今後の展望

### 新エージェント追加パターン
1. 新しいディレクトリ作成（例: `/api/ai-agents/document/`）
2. エージェントクラスの実装（BaseAgent を継承）
3. 型定義とバリデーションの追加
4. テストケースの作成

### 高度な機能対応
- **ストリーミング対応**: リアルタイム応答
- **バッチ処理**: 大量データの一括処理
- **ファイル処理**: PDF、CAD、動画等の対応
- **マルチモーダル**: 音声、動画、3D データの統合

### 運用面の改善
- **監視・メトリクス**: エージェント別の利用統計
- **A/Bテスト**: エージェント性能の比較検証
- **コスト管理**: API使用量の最適化

この戦略により、現在の要件を満たしながら、将来的な機能拡張に対応できる堅牢で拡張性の高いAPIアーキテクチャが実現されます。