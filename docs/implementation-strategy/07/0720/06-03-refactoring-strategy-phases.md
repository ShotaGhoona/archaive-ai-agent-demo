# 06-03-統一エージェントアーキテクチャ リファクタリング戦略

## 🎯 リファクタリング目標

### 主要目標
1. **統一BaseAgent**: 自動判定機能付きの統一ベースクラス実装
2. **+ボタン統一**: ChatGPT/Geminiライクなアップロード機能に統一
3. **API統一**: 全エージェントで同一のリクエスト・レスポンス形式
4. **UI統一**: 共通ChatContentと専用PopoverContentの組み合わせ

### 期待される成果
- **コード削減**: 300行以上の重複コード削除
- **開発効率**: 新エージェント追加時間を80%短縮  
- **UX統一**: 全エージェントでChatGPTライクな操作感
- **保守性向上**: バグ修正・機能追加の全エージェント自動反映

## 📋 詳細フェーズ別実装計画

### 🔧 Phase 1: バックエンド統一基盤構築

#### 1.1 型定義の統一
**対象ファイル**: `src/app/api/ai-agents/shared/types.ts`

**実装内容**:
```typescript
// 統一リクエスト型の追加
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
  metadata?: Record<string, any>;
}

// エージェント設定の簡素化
interface AgentConfig {
  id: string;
  name: string;
  version: string;
  // ✅ inputType, capabilities 削除
}
```

**工数**: 1時間

#### 1.2 統一バリデーション実装
**対象ファイル**: `src/app/api/ai-agents/shared/validation.ts`

**実装内容**:
```typescript
export function validateUnifiedRequest(formData: FormData): UnifiedAgentRequest {
  const message = formData.get('message') as string;
  if (!message) throw new ValidationError('Message is required');
  
  const attachments: Array<RequestAttachment> = [];
  const imageFile = formData.get('image') as File | null;
  
  if (imageFile && imageFile.size > 0) {
    validateImageFile(imageFile);
    attachments.push({
      type: 'image',
      data: imageFile,
      mimeType: imageFile.type,
      filename: imageFile.name
    });
  }
  
  // コンテキスト・メタデータの処理
  const contextData = formData.get('context') as string | null;
  const metadataData = formData.get('metadata') as string | null;
  
  return {
    message,
    attachments,
    context: contextData ? JSON.parse(contextData) : undefined,
    metadata: metadataData ? JSON.parse(metadataData) : undefined
  };
}
```

**工数**: 2時間

#### 1.3 BaseAgent自動判定機能実装
**対象ファイル**: `src/app/api/ai-agents/shared/base-agent.ts`

**実装内容**:
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

  // 自動判定処理
  private async processWithAutoDetection(
    systemPrompt: string, 
    request: UnifiedAgentRequest
  ) {
    const imageAttachment = request.attachments?.find(att => att.type === 'image');
    
    if (imageAttachment) {
      return await this.processWithVision(systemPrompt, request, imageAttachment);
    } else {
      return await this.processWithText(systemPrompt, request);
    }
  }

  private async processWithVision(
    systemPrompt: string, 
    request: UnifiedAgentRequest, 
    imageAttachment: ImageAttachment
  ) {
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

  protected buildMessages(systemPrompt: string, request: UnifiedAgentRequest) {
    const messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }> = [
      { role: 'system', content: systemPrompt }
    ];

    // 会話履歴の追加
    if (request.context?.history) {
      messages.push(...request.context.history);
    }

    // 現在のメッセージ追加
    messages.push({ role: 'user', content: request.message });

    return messages;
  }

  // エージェント固有設定（サブクラスでオーバーライド可能）
  protected getCompletionOptions() {
    return { temperature: 0.7, maxTokens: 2000 };
  }
}
```

**工数**: 4時間

### 🔄 Phase 2: エージェント実装の統一

#### 2.1 GeneralAgent統一実装
**対象ファイル**: `src/app/api/ai-agents/general/route.ts`

**リファクタリング内容**:
```typescript
class GeneralAgent extends BaseAgent {
  config: AgentConfig = {
    id: 'general',
    name: '一般エージェント',
    version: '1.0.0'
    // ✅ inputType, capabilities 削除
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

export async function POST(request: NextRequest) {
  const agent = new GeneralAgent();
  
  try {
    const formData = await request.formData();
    const agentRequest = validateUnifiedRequest(formData); // ✅ 統一バリデーション
    const response = await agent.process(agentRequest);
    
    return NextResponse.json(response);
  } catch (error) {
    return handleAgentError(error);
  }
}
```

**削除されるコード**:
- `validateGeneralRequest` (40行)
- 独自の`process`メソッド (50行)
- `buildMessages`メソッド (20行)

**工数**: 2時間

#### 2.2 EstimateAgent統一実装
**対象ファイル**: `src/app/api/ai-agents/estimate/route.ts`

**リファクタリング内容**:
```typescript
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

  // 見積もり特化の設定
  protected getCompletionOptions() {
    return { temperature: 0.3, maxTokens: 3000 };
  }
}

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
```

**削除されるコード**:
- `validateEstimateRequest` (60行)
- 独自の`process`メソッド (70行)
- 画像処理の分岐ロジック (30行)

**工数**: 2時間

### 🌐 Phase 3: フロントエンド API統一

#### 3.1 統一API関数実装
**対象ファイル**: `src/components/feature/ai-agent/utils/chatApi.ts`

**新規実装**:
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

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || errorData.error || `HTTP error! status: ${response.status}`);
  }

  return await response.json();
}
```

**削除される関数**:
- `sendChatMessage` (50行)
- `sendEstimateMessage` (30行)
- `sendAgentMessage` (25行)

**工数**: 3時間

#### 3.2 メインコンポーネント更新
**対象ファイル**: `src/components/feature/ai-agent/index.tsx`

**リファクタリング内容**:
```typescript
const handleSendMessage = async (message: string) => {
  if (!message.trim()) return;

  setIsLoading(true);
  const newUserMessage = createMessage(message, 'user');
  setMessages(prev => [...prev, newUserMessage]);

  try {
    // ✅ 統一API使用
    const result = await sendUnifiedMessage(currentAgent, message, {
      image: sessionImageRef.current || undefined,
      conversationHistory: convertMessagesToHistory(messages),
      metadata: blueprintInfo ? { blueprintInfo } : undefined
    });

    const aiMessage = createMessage(result.response, 'ai');
    setMessages(prev => [...prev, aiMessage]);
  } catch (error) {
    // エラーハンドリング
  } finally {
    setIsLoading(false);
  }
};
```

**工数**: 2時間

### 🎨 Phase 4: UI統一とPopover実装

#### 4.1 統一ChatContent作成
**対象ファイル**: `src/components/feature/ai-agent/shared/components/ChatContent.tsx`

**実装内容**:
```typescript
interface ChatContentProps {
  messages: Message[];
  isLoading: boolean;
  agentConfig: AgentConfig;
  sessionImage?: File | null;
}

const ChatContent: React.FC<ChatContentProps> = ({ 
  messages, 
  isLoading, 
  agentConfig,
  sessionImage
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const displayMessages = messages.filter(msg => 
    !msg.content.includes('typing') || msg.sender !== 'ai'
  );

  return (
    <div className="flex-1 flex flex-col h-full min-h-0">
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {displayMessages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <MessageSquare className="w-8 h-8 text-blue-600" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-900">
                {agentConfig.name}へようこそ
              </h3>
              <p className="text-gray-600 max-w-md">
                {getWelcomeMessage(agentConfig.id)}
              </p>
            </div>
          </div>
        )}

        {/* セッション画像プレビュー */}
        {sessionImage && (
          <SessionImagePreview image={sessionImage} />
        )}

        {displayMessages.map((message, index) => (
          <ChatMessage 
            key={message.id} 
            message={message} 
            agentConfig={agentConfig}
          />
        ))}

        {isLoading && <TypingIndicator />}
      </div>
    </div>
  );
};

function getWelcomeMessage(agentId: string): string {
  switch (agentId) {
    case 'estimate':
      return '図面をアップロードして見積もりを依頼できます。+ボタンから図面を添付してください。';
    case 'general':
      return '製造業に関するご質問にお答えします。画像の分析も可能です。';
    default:
      return 'どのようなことでお手伝いできますか？';
  }
}
```

**工数**: 4時間

#### 4.2 エージェント別Popover実装

**新規ファイル**: `src/components/feature/ai-agent/agents/EstimateAgent/EstimatePopover.tsx`

```typescript
interface EstimatePopoverProps {
  onFileUpload: (file: File, message: string) => void;
  onClose: () => void;
}

const EstimatePopover: React.FC<EstimatePopoverProps> = ({ 
  onFileUpload, 
  onClose 
}) => {
  return (
    <div className="space-y-4 w-96">
      <div className="flex items-center justify-between">
        <h4 className="font-medium text-gray-900">図面アップロード</h4>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <p className="text-sm text-gray-600">
        製造図面をアップロードして見積もりを依頼してください
      </p>
      
      <FileUploadArea
        onFileUpload={(file) => {
          onFileUpload(file, '添付した図面の見積もりをお願いします。');
          onClose();
        }}
        acceptedTypes={['.jpg', '.jpeg', '.png', '.webp']}
        maxSize={20 * 1024 * 1024}
        compact={true}
      />
    </div>
  );
};
```

**新規ファイル**: `src/components/feature/ai-agent/agents/GeneralAgent/GeneralPopover.tsx`

```typescript
interface GeneralPopoverProps {
  onImageUpload: (file: File, message: string) => void;
  onClose: () => void;
}

const GeneralPopover: React.FC<GeneralPopoverProps> = ({ 
  onImageUpload, 
  onClose 
}) => {
  const [message, setMessage] = useState('添付した画像について教えてください。');

  return (
    <div className="space-y-4 w-96">
      <div className="flex items-center justify-between">
        <h4 className="font-medium text-gray-900">画像添付</h4>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <p className="text-sm text-gray-600">
        図面や参考画像を添付して質問できます
      </p>
      
      <div className="space-y-3">
        <ImageUploadArea
          onImageUpload={(file) => {
            onImageUpload(file, message);
            onClose();
          }}
          acceptedTypes={['.jpg', '.jpeg', '.png', '.webp']}
          maxSize={10 * 1024 * 1024}
        />
        
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            質問内容
          </label>
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="画像について何を知りたいですか？"
            className="resize-none"
            rows={2}
          />
        </div>
      </div>
    </div>
  );
};
```

**工数**: 各2時間（計4時間）

#### 4.3 ChatInput統一実装
**対象ファイル**: `src/components/feature/ai-agent/shared/components/ChatInput.tsx`

**リファクタリング内容**:
```typescript
const renderPopoverContent = (agentId: string) => {
  switch (agentId) {
    case 'estimate':
      return (
        <EstimatePopover 
          onFileUpload={handleFileUpload} 
          onClose={() => setIsPopoverOpen(false)}
        />
      );
    case 'general':
      return (
        <GeneralPopover 
          onImageUpload={handleFileUpload} 
          onClose={() => setIsPopoverOpen(false)}
        />
      );
    default:
      return null;
  }
};

const handleFileUpload = (file: File, message: string) => {
  onSendMessage(message);
  // ファイルはsessionImageRefに自動保存される
};

return (
  <form onSubmit={handleSubmit} className="p-4 border-t bg-white">
    <div className="flex items-end space-x-2">
      <Popover 
        open={isPopoverOpen || (agentConfig.id === 'estimate' && isFirstVisit)}
        onOpenChange={setIsPopoverOpen}
      >
        <PopoverTrigger asChild>
          <Button variant="outline" size="icon" type="button">
            <Plus className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent side="top" className="p-0">
          {renderPopoverContent(agentConfig.id)}
        </PopoverContent>
      </Popover>
      
      {/* メッセージ入力・送信 */}
    </div>
  </form>
);
```

**工数**: 3時間

### 🗑️ Phase 5: 不要ファイル削除とクリーンアップ

#### 5.1 削除対象ファイル
- `src/components/feature/ai-agent/agents/EstimateAgent/EstimateChatContent.tsx` (120行)
- `src/components/feature/ai-agent/agents/GeneralAgent/GeneralChatContent.tsx` (80行)
- `src/app/api/ai-agents/shared/validation.ts` 内の `validateEstimateRequest`, `validateGeneralRequest` 関数

#### 5.2 更新が必要なインポート
- `src/components/feature/ai-agent/agents/EstimateAgent/index.tsx`
- `src/components/feature/ai-agent/agents/GeneralAgent/index.tsx`

**工数**: 2時間

## ⏱️ 工数見積もり

| フェーズ | 作業内容 | 見積工数 | 累計工数 |
|---------|----------|----------|----------|
| Phase 1 | バックエンド統一基盤構築 | 7時間 | 7時間 |
| Phase 2 | エージェント実装統一 | 4時間 | 11時間 |
| Phase 3 | フロントエンドAPI統一 | 5時間 | 16時間 |
| Phase 4 | UI統一とPopover実装 | 11時間 | 27時間 |
| Phase 5 | クリーンアップ | 2時間 | 29時間 |
| **合計** | | **29時間** | |

## 🧪 テスト戦略

### 各フェーズでのテスト
1. **Phase 1終了時**: BaseAgentの自動判定機能をユニットテスト
2. **Phase 2終了時**: 各エージェントのAPIエンドポイントテスト
3. **Phase 3終了時**: 統一APIの統合テスト
4. **Phase 4終了時**: UI操作の E2E テスト
5. **Phase 5終了時**: 全機能の回帰テスト

### 重点テスト項目
- 画像添付時の自動Vision API切り替え
- テキストのみの場合のChat API使用
- エージェント間の操作統一性
- セッション画像の永続化
- エラーハンドリングの統一性

## 🚀 リリース戦略

### ローリングデプロイ
1. **Phase 1-2**: バックエンドのみリリース（既存UIは動作継続）
2. **Phase 3**: 統一APIをオプション機能として追加
3. **Phase 4**: 新UIをフィーチャーフラグで段階的展開
4. **Phase 5**: 旧機能を完全削除

### ロールバック計画
- 各フェーズで旧コードをコメントアウト保持
- フィーチャーフラグによる即座な旧機能復帰
- データベース変更なしのため、ロールバックは安全

## 📈 期待される効果

### 定量的効果
- **コード行数**: 300行削減 (20%削減)
- **新エージェント追加時間**: 2日 → 4時間 (80%短縮)
- **バグ修正影響範囲**: 全エージェント自動反映
- **テストカバレッジ**: 単一BaseAgentテストで全エージェントカバー

### 定性的効果
- **開発者体験**: 一貫したアーキテクチャで開発効率向上
- **ユーザー体験**: ChatGPTライクな直感的操作
- **保守性**: 技術的負債の大幅削減
- **拡張性**: 新モダリティ（音声、動画）への対応容易

この戦略により、ARCHAIVEのAIエージェント機能は**技術的負債を解消しながら製品価値を向上**させる理想的なリファクタリングを実現します。