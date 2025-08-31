# エージェント統合実装計画

## 概要

4つのエージェント固有ファイルを削除し、共有コンポーネントに統合する詳細計画。約300行のコード重複削除と保守性向上を目指す。

## 前提条件

- ✅ inquiry/process関連をコメントアウト済み
- ✅ general/estimate 2つのエージェントに集中
- ✅ 既存機能の完全保持

## 実装フェーズ

### Phase 1: agentConfigの拡張 (リスク: 低)

#### 1.1 quickActionsの詳細定義

```typescript
// agentConfigs.ts更新
general: {
  quickActions: [
    { id: 'design-basics', label: '設計の基本を教えて', icon: BookOpen, action: '設計の基本を教えて' },
    { id: 'material-selection', label: '材料の選び方', icon: Settings, action: '材料の選び方' },
    { id: 'tolerance-guide', label: '公差設定のガイド', icon: Calculator, action: '公差設定のガイド' },
    { id: 'processing-methods', label: '加工方法について', icon: FileText, action: '加工方法について' },
    { id: 'quality-control', label: '品質管理のポイント', icon: Search, action: '品質管理のポイント' },
    { id: 'safety-guidelines', label: '安全ガイドライン', icon: HelpCircle, action: '安全ガイドライン' }
  ]
},
estimate: {
  quickActions: [
    { id: 'quick-estimate', label: '概算見積もり', icon: Calculator, action: '概算見積もり' },
    { id: 'detailed-estimate', label: '詳細見積もり', icon: FileText, action: '詳細見積もり' },
    { id: 'material-cost', label: '材料費分析', icon: Package, action: '材料費分析' },
    { id: 'processing-cost', label: '加工費算出', icon: DollarSign, action: '加工費算出' },
    { id: 'delivery-time', label: '納期見積もり', icon: Clock, action: '納期見積もり' },
    { id: 'cost-optimization', label: 'コスト最適化', icon: TrendingUp, action: 'コスト最適化' }
  ]
}
```

#### 1.2 必要なアイコンimport追加

```typescript
import {
  MessageCircle,
  Calculator,
  GitBranch,
  HelpCircle,
  BookOpen,
  Settings,
  FileText,
  Search,
  Package,
  DollarSign,
  Clock,
  TrendingUp,
} from 'lucide-react';
```

### Phase 2: ChatMessage.tsx の拡張 (リスク: 中)

#### 2.1 プロパティ追加

```typescript
interface ChatMessageProps {
  message: Message;
  agentConfig: AIAgentConfig; // 新規追加
}

const ChatMessage = forwardRef<HTMLDivElement, ChatMessageProps>(
  ({ message, agentConfig }, ref) => {
```

#### 2.2 動的アイコン表示

```typescript
// AIアバターでagentConfig.iconを使用
const AgentIcon = agentConfig.icon;

{isAI && (
  <div
    className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1"
    style={{ backgroundColor: agentConfig.color }}
  >
    <AgentIcon className="w-4 h-4 text-white" />
  </div>
)}
```

#### 2.3 welcome特別スタイリング

```typescript
const isWelcome = message.type === 'welcome';

<div className={cn(
  "max-w-[80%] rounded-lg px-4 py-2",
  isAI ? "bg-muted text-foreground" : "bg-primary text-primary-foreground",
  isWelcome && "bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800"
)}>
```

### Phase 3: ChatInput.tsx の拡張 (リスク: 中)

#### 3.1 プロパティ追加

```typescript
interface ChatInputProps {
  onSendMessage: (message: string) => void;
  onQuickAction?: (action: string) => void;
  disabled?: boolean;
  agentConfig: AIAgentConfig; // 新規追加
}
```

#### 3.2 動的初期値設定

```typescript
const [inputValue, setInputValue] = useState(agentConfig.defaultInput || '');
```

#### 3.3 動的quickActions

```typescript
// ハードコードされたquickActionsを削除
const quickActions = agentConfig.quickActions || [];

// レイアウトをgridに変更（6個対応）
<div className="grid grid-cols-2 gap-1">
  {quickActions.map((action) => {
    const Icon = action.icon;
    return (
      <Button
        key={action.id}
        variant="ghost"
        size="sm"
        onClick={() => handleQuickAction(action.action)}
        className="justify-start gap-2 h-auto py-2"
      >
        <Icon className="h-4 w-4" />
        <span className="text-sm text-left">{action.label}</span>
      </Button>
    );
  })}
</div>
```

#### 3.4 エージェント色対応送信ボタン

```typescript
<Button
  type="submit"
  size="icon"
  disabled={!inputValue.trim() || disabled}
  style={{ backgroundColor: agentConfig.color }}
  className="hover:opacity-90 text-white"
>
```

### Phase 4: コンポーネント使用箇所の更新 (リスク: 高)

#### 4.1 ChatContent系更新

```typescript
// GeneralChatContent.tsx
{messages.map((message, index) => (
  <ChatMessage // 共有コンポーネント使用
    key={message.id}
    message={message}
    agentConfig={agentConfig}
    ref={index === messages.length - 1 ? lastMessageRef : undefined}
  />
))}

// EstimateChatContent.tsx
// 同様の更新
```

#### 4.2 レイアウトでの使用更新

```typescript
// FloatingLayout.tsx, SidebarLayout.tsx等
<ChatInput
  onSendMessage={onSendMessage}
  onQuickAction={onQuickAction}
  disabled={isLoading}
  agentConfig={agentConfig} // 追加
/>
```

### Phase 5: ファイル削除 (リスク: 高)

#### 5.1 削除対象

1. `src/components/feature/ai-agent/agents/GeneralAgent/GeneralChatInput.tsx`
2. `src/components/feature/ai-agent/agents/EstimateAgent/EstimateChatInput.tsx`
3. `src/components/feature/ai-agent/agents/GeneralAgent/GeneralMessage.tsx`
4. `src/components/feature/ai-agent/agents/EstimateAgent/EstimateMessage.tsx`

#### 5.2 import文更新

```typescript
// index.tsx
// 削除
import GeneralChatInput from './agents/GeneralAgent/GeneralChatInput';
import EstimateChatInput from './agents/EstimateAgent/EstimateChatInput';
import GeneralMessage from './agents/GeneralAgent/GeneralMessage';
import EstimateMessage from './agents/EstimateAgent/EstimateMessage';

// 追加
import ChatInput from './shared/components/ChatInput';
import ChatMessage from './shared/components/ChatMessage';
```

## リスク管理

### 高リスク要素

1. **レイアウト崩れ**: quickActionsのグリッドレイアウト変更
2. **型エラー**: agentConfig必須化による既存コード影響
3. **スタイル不整合**: welcome特別スタイリングの移行

### 軽減策

1. **段階的実装**: 1つずつ確認しながら進める
2. **バックアップ**: 削除前にコメントアウトで保持
3. **テスト**: 各段階でUI動作確認

## テスト計画

### Phase毎のテスト項目

#### Phase 1-2 (メッセージ表示)

- [ ] Generalエージェントのメッセージ表示
- [ ] Estimateエージェントのメッセージ表示
- [ ] アイコンが正しく表示される
- [ ] Welcome特別スタイリングが適用される
- [ ] 自動スクロールが動作する

#### Phase 3 (入力部)

- [ ] GeneralのquickActionsが6個グリッド表示
- [ ] EstimateのquickActionsが6個グリッド表示
- [ ] Estimateのデフォルト入力値が設定される
- [ ] 送信ボタンがエージェント色になる
- [ ] quickAction選択で正しいメッセージ送信

#### Phase 4-5 (統合)

- [ ] GeneralエージェントのフルE2Eテスト
- [ ] EstimateエージェントのフルE2Eテスト
- [ ] エージェント切り替えが正常動作
- [ ] 既存機能の完全保持確認

## 実装順序

1. **Phase 1**: agentConfigs.ts更新 (10分)
2. **Phase 2**: ChatMessage.tsx拡張 (20分)
3. **Phase 3**: ChatInput.tsx拡張 (30分)
4. **Phase 4**: 使用箇所更新 (30分)
5. **Phase 5**: ファイル削除とクリーンアップ (15分)

**総実装時間**: 約105分

## ロールバック手順

1. **コメントアウト復活**: process/inquiryのコメント解除
2. **ファイル復活**: Git historyから削除ファイル復元
3. **import復活**: 元のimport文に戻す
4. **agentConfig復元**: 元の設定に戻す

## 成功指標

- [ ] 4ファイルの完全削除
- [ ] 既存機能の100%保持
- [ ] UI/UXの一貫性維持
- [ ] TypeScriptエラー0件
- [ ] 実行時エラー0件
- [ ] 約300行のコード削減達成
