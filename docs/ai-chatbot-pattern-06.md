# AIチャットボット実装戦略 - パターン06（AI専門エージェント選択式マルチステートチャット）

## プロジェクト概要

パターン06は、パターン05のマルチステートチャットシステムを基盤に、**専門AI エージェント選択機能**を追加した次世代チャットシステムです。ユーザーは用途に応じて最適なAIエージェントを選択でき、各エージェントは独自のUI・機能・応答パターンを持ちます。

## 革新的コンセプト

### 1. コンセプト定義
- **AI エージェント選択**: 用途特化型AIの選択式起動
- **円形UI**: 右下チャットボタンからの直感的な選択体験
- **専門性**: 各AIエージェントの独自機能・UI最適化
- **拡張性**: ページごとの選択肢カスタマイズ対応

### 2. 基本要件

#### 2.1 AI エージェント選択システム
- **起動方法**: chatButtonクリックで円形選択UI表示
- **選択肢配置**: 右下起点の1/4円（扇形）レイアウト
- **アニメーション**: 選択肢の展開・収束アニメーション
- **選択後**: 対応するチャットシステムの起動

#### 2.2 AI エージェント種類
```typescript
interface AIAgentType {
  id: string;
  name: string;
  icon: React.ComponentType;
  description: string;
  color: string;
  category: 'general' | 'estimate' | 'process' | 'inquiry' | 'custom';
}

const defaultAgents: AIAgentType[] = [
  {
    id: 'general',
    name: 'なんでもAI',
    icon: MessageCircle,
    description: '一般的な相談・質問に対応',
    color: '#3b82f6',
    category: 'general'
  },
  {
    id: 'estimate',
    name: '見積もりAI',
    icon: Calculator,
    description: '図面から見積もりを自動生成',
    color: '#10b981',
    category: 'estimate'
  },
  {
    id: 'process',
    name: '工程生成AI',
    icon: GitBranch,
    description: '製造工程の最適化提案',
    color: '#f59e0b',
    category: 'process'
  },
  {
    id: 'inquiry',
    name: '問い合わせAI',
    icon: HelpCircle,
    description: 'よくある質問への迅速回答',
    color: '#ef4444',
    category: 'inquiry'
  }
];
```

## 技術的実装戦略

### 1. アーキテクチャ設計

#### 1.1 コンポーネント構成
```
src/components/feature/blueprint-detail/06/
├── core/
│   ├── ChatUIManager.tsx              # 中央制御（05ベース）
│   ├── AIAgentSelector.tsx            # 新規：AI選択UI
│   └── AgentChatController.tsx        # 新規：エージェント別制御
├── agents/
│   ├── GeneralAgent/                  # なんでもAI
│   │   ├── GeneralChatContent.tsx
│   │   ├── GeneralChatInput.tsx
│   │   └── GeneralMessage.tsx
│   ├── EstimateAgent/                 # 見積もりAI
│   │   ├── EstimateChatContent.tsx
│   │   ├── EstimateChatInput.tsx
│   │   ├── EstimateMessage.tsx
│   │   └── FileUploadArea.tsx
│   ├── ProcessAgent/                  # 工程生成AI
│   │   ├── ProcessChatContent.tsx
│   │   ├── ProcessChatInput.tsx
│   │   └── ProcessMessage.tsx
│   └── InquiryAgent/                  # 問い合わせAI
│       ├── InquiryChatContent.tsx
│       ├── InquiryChatInput.tsx
│       ├── InquiryMessage.tsx
│       └── FAQButtons.tsx
├── layouts/                           # 05から継承
│   ├── FloatingLayout.tsx
│   ├── SidebarLayout.tsx
│   └── FullpageLayout.tsx             # 更新：ChatGPTライクUI
├── shared/
│   ├── ChatButton.tsx                 # 更新：選択肢設定対応
│   ├── ChatHeader.tsx                 # 更新：エージェント表示
│   ├── AgentSelector.tsx              # 新規：円形選択UI
│   └── BaseMessage.tsx                # 新規：共通メッセージ基底
├── hooks/
│   ├── useChatUIState.ts              # 05から継承
│   ├── useLayoutTransition.ts         # 05から継承
│   ├── useAIAgentSelector.ts          # 新規：選択UI制御
│   └── useAgentSpecificState.ts       # 新規：エージェント別状態
├── utils/
│   ├── storageUtils.ts                # 05から継承
│   ├── agentRegistry.ts               # 新規：エージェント登録
│   └── pageConfigUtils.ts             # 新規：ページ別設定
├── types.ts                           # 更新：エージェント型追加
└── index.tsx                          # 更新：メインコントローラー
```

#### 1.2 新規型定義
```typescript
// 05の型定義に追加
export interface AIAgentConfig {
  id: string;
  name: string;
  icon: React.ComponentType;
  description: string;
  color: string;
  category: AgentCategory;
  component: {
    content: React.ComponentType<AgentContentProps>;
    input: React.ComponentType<AgentInputProps>;
    message: React.ComponentType<AgentMessageProps>;
  };
}

export interface AgentSelectorConfig {
  availableAgents: string[];
  defaultAgent?: string;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  animation?: 'fade' | 'scale' | 'slide';
}

export interface PageAgentConfig {
  [pagePath: string]: AgentSelectorConfig;
}

export interface ChatUIState extends ChatUIStateBase {
  selectedAgent: string | null;
  agentConfig: AIAgentConfig | null;
  selectorOpen: boolean;
}
```

### 2. AI エージェント選択UI設計

#### 2.1 円形選択UI (AgentSelector.tsx)
```typescript
interface AgentSelectorProps {
  isOpen: boolean;
  agents: AIAgentConfig[];
  onSelect: (agentId: string) => void;
  onClose: () => void;
  position: { x: number; y: number };
}

const AgentSelector: React.FC<AgentSelectorProps> = ({
  isOpen,
  agents,
  onSelect,
  onClose,
  position
}) => {
  const radius = 120;
  const angleStep = (Math.PI / 2) / Math.max(agents.length - 1, 1);
  
  return (
    <div className="fixed inset-0 z-50" style={{ pointerEvents: isOpen ? 'auto' : 'none' }}>
      {/* 背景オーバーレイ */}
      <div 
        className={`absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
      />
      
      {/* 選択肢 */}
      <div className="absolute" style={{ left: position.x, top: position.y }}>
        {agents.map((agent, index) => {
          const angle = angleStep * index;
          const x = -Math.cos(angle) * radius;
          const y = -Math.sin(angle) * radius;
          
          return (
            <AgentSelectorItem
              key={agent.id}
              agent={agent}
              position={{ x, y }}
              index={index}
              isOpen={isOpen}
              onSelect={onSelect}
            />
          );
        })}
      </div>
    </div>
  );
};
```

#### 2.2 選択肢アニメーション
```css
.agent-selector-item {
  transform: translate(var(--x), var(--y)) scale(0);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transition-delay: calc(var(--index) * 0.05s);
}

.agent-selector-item.open {
  transform: translate(var(--x), var(--y)) scale(1);
}

.agent-selector-item:hover {
  transform: translate(var(--x), var(--y)) scale(1.1);
}
```

### 3. エージェント別UI実装

#### 3.1 なんでもAI (GeneralAgent)
```typescript
const GeneralChatContent: React.FC<AgentContentProps> = ({ messages, isLoading }) => {
  const welcomeMessage = {
    id: 'welcome',
    content: 'ARCHAIVE AIエージェントへようこそ。なんでもお聞きください。',
    sender: 'ai' as const,
    timestamp: new Date(),
    type: 'welcome'
  };

  const displayMessages = messages.length === 0 ? [welcomeMessage] : messages;

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {displayMessages.map((message) => (
        <GeneralMessage key={message.id} message={message} />
      ))}
      {isLoading && <TypingIndicator />}
    </div>
  );
};
```

#### 3.2 見積もりAI (EstimateAgent)
```typescript
const EstimateChatContent: React.FC<AgentContentProps> = ({ messages, isLoading }) => {
  const [hasUploadedFile, setHasUploadedFile] = useState(false);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {/* ファイルアップロード領域 */}
      {!hasUploadedFile && (
        <FileUploadArea
          onFileUpload={(file) => {
            setHasUploadedFile(true);
            // ファイル処理ロジック
          }}
          acceptedTypes={['.pdf', '.dwg', '.dxf', '.jpg', '.png']}
          maxSize={10 * 1024 * 1024} // 10MB
        />
      )}
      
      {/* メッセージ表示 */}
      {messages.map((message) => (
        <EstimateMessage key={message.id} message={message} />
      ))}
      {isLoading && <TypingIndicator />}
    </div>
  );
};

const EstimateChatInput: React.FC<AgentInputProps> = ({ onSendMessage, disabled }) => {
  const [message, setMessage] = useState('この図面の見積もりを開始してください');

  return (
    <div className="p-4 border-t">
      <div className="flex gap-2">
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="見積もりに関する質問を入力..."
          disabled={disabled}
        />
        <Button
          onClick={() => {
            onSendMessage(message);
            setMessage('');
          }}
          disabled={disabled || !message.trim()}
        >
          送信
        </Button>
      </div>
    </div>
  );
};
```

#### 3.3 問い合わせAI (InquiryAgent)
```typescript
const InquiryChatContent: React.FC<AgentContentProps> = ({ messages, isLoading, onQuickMessage }) => {
  const frequentQuestions = [
    {
      id: 'delivery',
      question: '納期について教えてください',
      icon: Clock,
      color: 'bg-blue-500'
    },
    {
      id: 'pricing',
      question: '価格体系について知りたいです',
      icon: DollarSign,
      color: 'bg-green-500'
    },
    {
      id: 'materials',
      question: '対応可能な材料について',
      icon: Package,
      color: 'bg-yellow-500'
    },
    {
      id: 'quality',
      question: '品質管理について',
      icon: Shield,
      color: 'bg-purple-500'
    }
  ];

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.length === 0 && (
        <div className="space-y-4">
          <div className="text-center text-muted-foreground">
            <HelpCircle className="w-8 h-8 mx-auto mb-2" />
            <p>よくある質問からお選びください</p>
          </div>
          
          <div className="grid grid-cols-1 gap-3">
            {frequentQuestions.map((faq) => (
              <FAQButton
                key={faq.id}
                question={faq.question}
                icon={faq.icon}
                color={faq.color}
                onClick={() => onQuickMessage(faq.question)}
              />
            ))}
          </div>
        </div>
      )}
      
      {messages.map((message) => (
        <InquiryMessage key={message.id} message={message} />
      ))}
      {isLoading && <TypingIndicator />}
    </div>
  );
};
```

### 4. ページ別設定システム

#### 4.1 設定管理 (pageConfigUtils.ts)
```typescript
export const pageConfigs: PageAgentConfig = {
  '/blueprints': {
    availableAgents: ['general', 'estimate'],
    defaultAgent: 'general',
    position: 'bottom-right'
  },
  '/projects': {
    availableAgents: ['general', 'process', 'inquiry'],
    defaultAgent: 'process',
    position: 'bottom-right'
  },
  '/admin': {
    availableAgents: ['general', 'inquiry'],
    defaultAgent: 'general',
    position: 'bottom-left'
  }
};

export const getPageConfig = (pathname: string): AgentSelectorConfig => {
  // 完全一致を優先
  if (pageConfigs[pathname]) {
    return pageConfigs[pathname];
  }
  
  // パターンマッチング
  for (const [pattern, config] of Object.entries(pageConfigs)) {
    if (pathname.startsWith(pattern)) {
      return config;
    }
  }
  
  // デフォルト設定
  return {
    availableAgents: ['general', 'estimate', 'process', 'inquiry'],
    defaultAgent: 'general',
    position: 'bottom-right'
  };
};
```

#### 4.2 ChatButton更新
```typescript
interface ChatButtonProps {
  onClick: () => void;
  isOpen: boolean;
  agentConfig?: AgentSelectorConfig;
  className?: string;
}

const ChatButton: React.FC<ChatButtonProps> = ({ 
  onClick, 
  isOpen, 
  agentConfig,
  className 
}) => {
  const { pathname } = useRouter();
  const config = agentConfig || getPageConfig(pathname);
  
  return (
    <Button
      onClick={onClick}
      className={cn(
        "fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg z-30",
        "bg-primary hover:bg-primary/90 text-primary-foreground",
        "transition-all duration-300",
        isOpen && "scale-110",
        className
      )}
    >
      <MessageCircle className="w-6 h-6" />
    </Button>
  );
};
```

### 5. FullpageLayout更新（ChatGPTライクUI）

#### 5.1 新しいFullpageLayout設計
```typescript
const FullpageLayout: React.FC<FullpageLayoutProps> = ({
  messages,
  isLoading,
  selectedAgent,
  onLayoutChange,
  onClose,
  onSendMessage,
  onQuickAction
}) => {
  return (
    <div className="fixed inset-0 z-40 bg-background">
      <div className="flex h-full">
        {/* 左サイドバー - チャット履歴 */}
        <div className="w-80 border-r border-border bg-muted/30">
          <div className="p-4 border-b border-border">
            <h2 className="font-semibold text-lg">チャット履歴</h2>
          </div>
          
          <div className="overflow-y-auto h-full p-4">
            <ChatHistory agentType={selectedAgent} />
          </div>
        </div>
        
        {/* メインチャット領域 */}
        <div className="flex-1 flex flex-col">
          {/* ヘッダー */}
          <ChatHeader
            currentLayout={ChatLayoutState.FULLPAGE}
            onLayoutChange={onLayoutChange}
            onClose={onClose}
            title={`${selectedAgent?.name || 'AI'} Assistant`}
            selectedAgent={selectedAgent}
          />
          
          {/* チャット内容 */}
          <div className="flex-1 overflow-hidden">
            <AgentChatRenderer
              agentType={selectedAgent}
              messages={messages}
              isLoading={isLoading}
              onSendMessage={onSendMessage}
              onQuickAction={onQuickAction}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
```

#### 5.2 チャット履歴コンポーネント
```typescript
const ChatHistory: React.FC<{ agentType: string }> = ({ agentType }) => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  
  return (
    <div className="space-y-2">
      {sessions.map((session) => (
        <div
          key={session.id}
          className="p-3 rounded-lg hover:bg-muted cursor-pointer transition-colors"
        >
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full bg-primary"></div>
            <span className="font-medium text-sm">{session.title}</span>
          </div>
          <div className="text-xs text-muted-foreground">
            {session.lastMessage}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            {formatRelativeTime(session.timestamp)}
          </div>
        </div>
      ))}
    </div>
  );
};
```

### 6. 拡張性・保守性の設計

#### 6.1 エージェント登録システム
```typescript
// agentRegistry.ts
class AgentRegistry {
  private agents: Map<string, AIAgentConfig> = new Map();

  register(agent: AIAgentConfig): void {
    this.agents.set(agent.id, agent);
  }

  get(id: string): AIAgentConfig | undefined {
    return this.agents.get(id);
  }

  getAll(): AIAgentConfig[] {
    return Array.from(this.agents.values());
  }

  getByCategory(category: AgentCategory): AIAgentConfig[] {
    return this.getAll().filter(agent => agent.category === category);
  }
}

export const agentRegistry = new AgentRegistry();

// 標準エージェントの登録
agentRegistry.register(generalAgent);
agentRegistry.register(estimateAgent);
agentRegistry.register(processAgent);
agentRegistry.register(inquiryAgent);
```

#### 6.2 プラグインシステム
```typescript
// 新しいエージェントの追加例
const customAgent: AIAgentConfig = {
  id: 'custom-analyzer',
  name: '解析AI',
  icon: TrendingUp,
  description: '図面解析・最適化提案',
  color: '#8b5cf6',
  category: 'custom',
  component: {
    content: AnalyzerChatContent,
    input: AnalyzerChatInput,
    message: AnalyzerMessage
  }
};

// 動的登録
agentRegistry.register(customAgent);
```

### 7. 実装優先度・フェーズ

#### Phase 1: 基盤構築（2週間）
1. ✅ エージェント選択UI実装
2. ✅ 基本的なエージェント切り替え機能
3. ✅ なんでもAI・見積もりAI実装
4. ✅ ページ別設定システム

#### Phase 2: 機能拡張（2週間）
1. ✅ 工程生成AI・問い合わせAI実装
2. ✅ FullpageLayout更新（ChatGPTライク）
3. ✅ チャット履歴機能
4. ✅ エージェント登録システム

#### Phase 3: 最適化・体験向上（1週間）
1. ✅ アニメーション最適化
2. ✅ レスポンシブ対応
3. ✅ パフォーマンス最適化
4. ✅ 包括的テスト

### 8. 技術的課題と解決策

#### 8.1 主要課題
1. **エージェント間の状態管理**
   - 解決: 独立したエージェント状態管理システム
2. **UI切り替えの複雑性**
   - 解決: コンポーネントファクトリパターン
3. **パフォーマンス**
   - 解決: エージェント遅延ロード、メモ化
4. **拡張性**
   - 解決: プラグインシステム、レジストリパターン

#### 8.2 互換性確保
- 05の既存機能を完全継承
- 段階的移行による破壊的変更回避
- 後方互換性API提供

### 9. 成功指標

#### 9.1 技術指標
- **エージェント選択時間**: 平均2秒以下
- **UI切り替え時間**: 平均500ms以下
- **メモリ使用量**: 75MB以下
- **初期ロード時間**: 3秒以下

#### 9.2 UX指標
- **エージェント選択成功率**: 99.5%以上
- **ユーザー満足度**: 4.7/5以上
- **作業効率向上**: 30%以上
- **エラー発生率**: 0.05%以下

### 10. 将来展望

#### 10.1 Phase 4機能（計画）
- **音声対応**: 音声でのエージェント選択・操作
- **AI学習**: 使用パターンに基づく推奨エージェント
- **コラボレーション**: 複数エージェントの協調作業
- **外部API連携**: 専門システムとの統合

#### 10.2 Phase 5機能（研究）
- **マルチモーダル**: 音声・画像・テキスト統合
- **リアルタイム協調**: リアルタイムマルチユーザー対応
- **AR/VR対応**: 空間コンピューティング統合
- **自動化**: ワークフロー自動化エージェント

この包括的戦略により、パターン06は単なる機能追加を超え、AI エージェントエコシステムの基盤となる革新的なシステムを実現します。各専門分野に特化したAIが協調して働く、次世代のヒューマン・AI インタラクションを提供します。