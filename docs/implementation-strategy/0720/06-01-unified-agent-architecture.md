# 06-01-統一エージェントアーキテクチャ設計

## 現在の問題点分析

### 🔍 既存コードの問題点

#### 1. **エージェント別処理の複雑な分岐**
```typescript
// chatApi.ts - 複雑な分岐ロジック
if (agentId === 'estimate') {
  return await sendEstimateMessage({ message, image });  // FormData
} else {
  return await sendChatMessage({ message, agentId });    // JSON
}
```

#### 2. **バックエンドの重複実装**
- **GeneralAgent**: JSON入力、テキストのみ、`validateGeneralRequest`
- **EstimateAgent**: FormData入力、画像対応、`validateEstimateRequest`
- 画像処理ロジックがEstimateAgentにのみ存在

#### 3. **設定の複雑性**
```typescript
// 現在：エージェント別設定
general: { inputType: 'json', capabilities: [{ type: 'text' }] }
estimate: { inputType: 'formdata', capabilities: [{ type: 'vision' }] }
```

#### 4. **フロントエンドの分岐地獄**
- エージェント別にAPI呼び出し方法が異なる
- `+ボタン`の動作もエージェント固有

## 🎯 統一アーキテクチャ設計

### コアコンセプト：**「コンテンツ駆動型自動処理」**

```
画像が含まれている → 自動的にVision API使用
テキストのみ       → 自動的にChat API使用
```

### 🏗️ 新しいアーキテクチャ

#### 1. **統一BaseAgent（自動判定機能付き）**
```typescript
export abstract class BaseAgent {
  abstract config: AgentConfig;
  abstract buildSystemPrompt(): string;

  // 🎯 統一処理エントリーポイント
  async process(request: UnifiedAgentRequest): Promise<AgentResponse> {
    const startTime = Date.now();
    
    try {
      this.validateRequest(request);
      const systemPrompt = this.buildSystemPrompt();
      
      // 🔥 自動判定：画像があればVision API、なければChat API
      const completion = await this.processWithAutoDetection(systemPrompt, request);
      
      const content = completion.choices[0]?.message?.content;
      if (!content) throw new Error('No response content from OpenAI API');
      
      const response = this.createResponse(content, completion);
      this.recordMetrics(request, response, Date.now() - startTime);
      
      return response;
    } catch (error) {
      this.handleError(error as Error);
    }
  }

  // 🎯 自動判定処理
  private async processWithAutoDetection(
    systemPrompt: string, 
    request: UnifiedAgentRequest
  ) {
    const hasImage = request.attachments?.find(att => att.type === 'image');
    
    if (hasImage) {
      // 自動的にVision API使用
      return await this.processWithVision(systemPrompt, request, hasImage);
    } else {
      // 通常のChat API使用
      return await this.processWithText(systemPrompt, request);
    }
  }

  private async processWithVision(systemPrompt: string, request: UnifiedAgentRequest, imageAttachment: ImageAttachment) {
    const bytes = await imageAttachment.data.arrayBuffer();
    const base64Image = Buffer.from(bytes).toString('base64');
    
    return await createVisionCompletion(
      systemPrompt,
      request.message,
      base64Image,
      imageAttachment.mimeType || 'image/jpeg',
      this.getCompletionOptions()
    );
  }

  private async processWithText(systemPrompt: string, request: UnifiedAgentRequest) {
    const messages = this.buildMessages(systemPrompt, request);
    return await createChatCompletion(messages, this.getCompletionOptions());
  }

  // 🎯 エージェント固有設定（サブクラスでオーバーライド可能）
  protected getCompletionOptions() {
    return { temperature: 0.7, maxTokens: 2000 };
  }
}
```

#### 2. **統一リクエスト形式**
```typescript
// 🎯 全エージェント共通のリクエスト形式
interface UnifiedAgentRequest {
  message: string;
  attachments?: Array<{
    type: 'image' | 'file' | 'audio';
    data: File;
    mimeType: string;
    filename: string;
  }>;
  context?: {
    history?: Array<{ role: 'user' | 'assistant'; content: string }>;
    sessionId?: string;
    userId?: string;
  };
  metadata?: Record<string, any>; // エージェント固有メタデータ
}
```

#### 3. **簡素化されたエージェント実装**
```typescript
// GeneralAgent.ts - 劇的にシンプル化
class GeneralAgent extends BaseAgent {
  config: AgentConfig = {
    id: 'general',
    name: '一般エージェント',
    version: '1.0.0'
    // ✅ inputType, capabilities 等の設定不要
  };

  buildSystemPrompt(): string {
    return `
あなたは製造業の専門AIアシスタントです。
画像が提供された場合は画像を分析し、テキストのみの場合は一般的な質問に回答してください。
必ず日本語で回答してください。
`;
  }
  
  // ✅ process()メソッドは継承で自動取得
  // ✅ 画像処理ロジックは継承で自動取得
}

// EstimateAgent.ts - 見積もり特化プロンプトのみ
class EstimateAgent extends BaseAgent {
  config: AgentConfig = {
    id: 'estimate',
    name: '見積もりエージェント',
    version: '1.0.0'
  };

  buildSystemPrompt(): string {
    return `
あなたは製造業の見積もり専門AIです。
画像が提供された場合は図面として分析し、見積もりを作成してください。
// ... 見積もり特化プロンプト
`;
  }

  // ✅ 見積もり特化の設定
  protected getCompletionOptions() {
    return { temperature: 0.3, maxTokens: 3000 };
  }
}
```

#### 4. **統一バリデーション**
```typescript
// 🎯 単一のバリデーション関数
export function validateUnifiedRequest(formData: FormData): UnifiedAgentRequest {
  const message = formData.get('message') as string;
  if (!message) throw new ValidationError('Message is required');
  
  const attachments: Array<RequestAttachment> = [];
  const imageFile = formData.get('image') as File | null;
  
  if (imageFile && imageFile.size > 0) {
    validateImageFile(imageFile); // 共通バリデーション
    attachments.push({
      type: 'image',
      data: imageFile,
      mimeType: imageFile.type,
      filename: imageFile.name
    });
  }

  return { message, attachments, /* context, metadata */ };
}

// 🎯 全エージェントで使用
export async function POST(request: NextRequest) {
  const agent = new GeneralAgent(); // or EstimateAgent
  
  try {
    const formData = await request.formData();
    const agentRequest = validateUnifiedRequest(formData); // ✅ 統一
    const response = await agent.process(agentRequest);
    
    return NextResponse.json(response);
  } catch (error) {
    return handleAgentError(error);
  }
}
```

#### 5. **フロントエンド統一API**
```typescript
// 🎯 全エージェント統一のAPI呼び出し
export async function sendUnifiedMessage(
  agentId: string,
  message: string,
  options: {
    image?: File;
    conversationHistory?: Array<{ role: 'user' | 'assistant'; content: string }>;
    metadata?: any;
  } = {}
): Promise<AgentResponse> {
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

  return await response.json();
}

// ✅ 使用例：全エージェントで同じ呼び出し方
await sendUnifiedMessage('general', 'これは何ですか？', { image: uploadedFile });
await sendUnifiedMessage('estimate', '見積もりお願いします', { image: blueprintFile });
```

#### 6. **統一+ボタン設計**
```typescript
// ChatInput.tsx - エージェント固有ポップオーバー
const renderPopoverContent = (agentId: string) => {
  switch (agentId) {
    case 'estimate':
      return <EstimatePopover onFileUpload={handleFileUpload} />;
    case 'general':
      return <GeneralPopover onImageUpload={handleImageUpload} />;
    default:
      return <DefaultUploadPopover onFileUpload={handleFileUpload} />;
  }
};

// ✅ 全エージェントで統一された画像送信処理
const handleFileUpload = (file: File, message: string) => {
  // どのエージェントでも同じAPI呼び出し
  sendUnifiedMessage(currentAgent, message, { image: file });
};
```

## 🎁 統一による恩恵

### 🛠️ **開発効率の大幅向上**
- **コード削減**: 各エージェント100行 → 20行
- **新エージェント追加**: `buildSystemPrompt()`のみ実装
- **バグ修正**: BaseAgentを修正すれば全エージェントに反映

### 🎯 **UX統一**
- **操作一貫性**: 全エージェントで同じ+ボタン、同じアップロード
- **学習コストゼロ**: エージェント間の操作差なし
- **ChatGPTライク**: 業界標準のUX

### 🚀 **拡張性の飛躍**
- **音声対応**: `type: 'audio'`を追加するだけで全エージェント対応
- **PDF対応**: `type: 'document'`で文書分析機能追加
- **マルチモーダル**: 画像+音声の同時処理も容易

### 🧪 **テスト・保守性**
- **単一責任**: BaseAgentのテストで全エージェントをカバー
- **型安全**: TypeScriptの恩恵を最大活用
- **エラー一元化**: 統一されたエラーハンドリング

## 📋 移行ロードマップ

### Phase 1: BaseAgent統一化
1. `UnifiedAgentRequest`型定義
2. `BaseAgent`に自動判定機能実装
3. `validateUnifiedRequest`統一バリデーション

### Phase 2: エージェント移行
1. `GeneralAgent`をBaseAgent継承に変更
2. `EstimateAgent`をBaseAgent継承に変更
3. 既存機能の動作確認

### Phase 3: フロントエンド統一
1. `sendUnifiedMessage`実装
2. 全エージェントで統一API使用
3. 旧API関数削除

### Phase 4: UI統合
1. 統一`ChatContent.tsx`実装
2. エージェント固有`PopoverContent`実装
3. エージェント固有`ChatContent`削除

## 🎯 期待される成果

この統一アーキテクチャにより：

- **開発速度**: 新エージェント追加が10倍高速化
- **保守性**: バグ修正・機能追加が全エージェントに自動反映
- **ユーザー体験**: ChatGPT並みの直感的操作
- **拡張性**: 新しいモダリティ（音声、動画等）への対応が容易

**技術的負債を解消しながら、製品価値を向上させる理想的な設計**です。