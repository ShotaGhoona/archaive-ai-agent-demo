# メッセージ永続化リファクタリング実装計画

## 1. 問題の詳細分析

### 現在の問題
レイアウト変更時（Floating ⇔ Sidebar ⇔ Fullpage）にチャット履歴が消える

### 根本原因
```
TroubleAgent: ローカル状態管理（useMessageHandler）→ レイアウト変更で消失 ❌
他のAgent: 共有状態管理（useChatUIState）→ レイアウト変更でも保持 ✅
```

### アーキテクチャの不整合
```typescript
// 現在の二重管理構造
1. 共有状態システム（index.tsx → useChatUIState）
   └── EstimateAgent, GeneralAgent が使用
   
2. ローカル状態システム（TroubleAgent/hooks/useMessageHandler）
   └── TroubleAgent のみが使用（独立して動作）
```

## 2. 解決方針

### 基本方針
**「すべてのエージェントで共有状態を使用する」**

- メッセージ管理を完全に上位（index.tsx）に統一
- エージェント固有コンポーネントは表示と検索ロジックのみ担当
- レイアウト変更時もメッセージを保持

## 3. 実装計画

### Phase A: 状態管理の統一（優先度：高）

#### Step A-1: useChatUIState の拡張
```typescript
// src/features/ai-agent/shared/hooks/useChatUIState.ts

interface ChatUIState {
  // 既存
  messages: Message[];
  
  // 追加：エージェント別メッセージ管理
  agentMessages: Record<string, Message[]>;  // NEW
  currentAgentId: string | null;             // NEW
}

// エージェント切り替え時の処理を改善
const selectAgent = useCallback((agentId: string, agentConfig: AIAgentConfig) => {
  setState(prev => ({
    ...prev,
    selectedAgent: agentId,
    agentConfig,
    currentAgentId: agentId,
    // エージェント固有のメッセージを復元（初回はウェルカムメッセージ）
    messages: prev.agentMessages[agentId] || [createAgentWelcomeMessage(agentConfig)]
  }));
}, []);
```

#### Step A-2: TroubleAgent の共有状態対応
```typescript
// src/features/ai-agent/agents/TroubleAgent/ChatContent.tsx

interface ChatContentProps {
  messages: Message[];           // 共有状態から受け取る
  onSendMessage: (msg: string) => void;  // 共有ハンドラーを使用
  agentConfig: AIAgentConfig;
  isLoading?: boolean;
}

export default function ChatContent({ 
  messages,        // propsから受け取る（ローカル状態は使わない）
  onSendMessage,   // 親から受け取ったハンドラーを使用
  agentConfig,
  isLoading 
}: ChatContentProps) {
  // useMessageHandler() を削除
  // 表示ロジックのみに専念
  
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map(message => (
          <ChatMessage
            key={message.id}
            message={message}
            agentConfig={agentConfig}
          />
        ))}
      </div>
      <ChatInput 
        onSendMessage={onSendMessage}
        agentConfig={agentConfig}
        disabled={isLoading}
      />
    </div>
  );
}
```

### Phase B: 検索ロジックの分離（優先度：中）

#### Step B-1: エージェント別ハンドラーの作成
```typescript
// src/features/ai-agent/agents/TroubleAgent/messageHandler.ts

export async function handleTroubleMessage(
  content: string,
  addMessage: (msg: Message) => void,
  setLoading: (loading: boolean) => void
) {
  // ユーザーメッセージ追加
  addMessage(createUserMessage(content));
  
  // タイピング表示
  setLoading(true);
  addMessage(createTypingMessage());
  
  try {
    // 検索実行
    const query = analyzeKeywords(content);
    const results = await searchByQuery(query);
    const resultContent = formatSearchResults(results);
    
    // 結果表示
    removeMessage('typing');
    addMessage(createAIMessage(resultContent));
  } finally {
    setLoading(false);
  }
}
```

#### Step B-2: useChatManager の統合
```typescript
// src/features/ai-agent/hooks/useChatManager.ts

const handleSendMessage = useCallback(async (content: string) => {
  if (!state.agentConfig || !state.selectedAgent) return;
  
  // エージェント別の処理を統一的に扱う
  switch (state.selectedAgent) {
    case 'trouble':
      await handleTroubleMessage(content, actions.addMessage, actions.setLoading);
      break;
    case 'estimate':
      await handleEstimateMessage(content, actions.addMessage, actions.setLoading);
      break;
    default:
      await handleGeneralMessage(content, actions.addMessage, actions.setLoading);
  }
  
  // メッセージをエージェント別に保存
  actions.saveAgentMessages(state.selectedAgent, state.messages);
}, [state, actions]);
```

### Phase C: レイアウトコンポーネントの簡略化（優先度：低）

#### Step C-1: 動的インポートの統一
```typescript
// src/features/ai-agent/shared/layouts/FloatingLayout.tsx

// エージェント別コンポーネントの取得を簡略化
const getAgentComponents = (agentId: string) => {
  // すべてのエージェントで同じインターフェースを使用
  return {
    ChatContent: lazy(() => import(`../../agents/${getAgentFolder(agentId)}/ChatContent`)),
    ChatInput: lazy(() => import(`../../agents/${getAgentFolder(agentId)}/ChatInput`))
  };
};

// レイアウトは純粋なコンテナとして機能
<ChatContent
  messages={messages}           // 共有状態から
  onSendMessage={onSendMessage} // 共有ハンドラー
  agentConfig={agentConfig}
  isLoading={isLoading}
/>
```

## 4. 実装順序と時間見積もり

### 実装フロー
```
1. useChatUIState 拡張（30分）
   └── エージェント別メッセージ保存機能追加
   
2. TroubleAgent 修正（45分）
   └── ローカル状態を削除、props使用に変更
   
3. メッセージハンドラー統合（30分）
   └── useChatManager で全エージェント統一処理
   
4. 動作確認・デバッグ（30分）
   └── レイアウト変更時のメッセージ保持確認
   
合計：約2時間15分
```

## 5. 期待される効果

### 直接的効果
- ✅ レイアウト変更時のメッセージ保持
- ✅ エージェント切り替え後も履歴を復元可能
- ✅ コードの一貫性向上

### 副次的効果
- 将来的なlocalStorage永続化が容易
- テストが書きやすくなる
- エージェント追加時の実装が統一的

## 6. 実装チェックリスト

- [ ] Phase A: 状態管理の統一
  - [ ] useChatUIState にエージェント別メッセージ管理追加
  - [ ] TroubleAgent をprops使用に変更
  - [ ] useMessageHandler の削除または改修
  
- [ ] Phase B: 検索ロジックの分離
  - [ ] エージェント別メッセージハンドラー作成
  - [ ] useChatManager での統合処理
  
- [ ] Phase C: レイアウトの簡略化
  - [ ] 動的インポートの統一
  - [ ] 不要な条件分岐の削除

- [ ] テスト
  - [ ] レイアウト変更時のメッセージ保持
  - [ ] エージェント切り替え時の履歴復元
  - [ ] 検索機能の動作確認

## 7. リスクと対策

### リスク1: 既存機能への影響
**対策**: エージェントごとに段階的に移行。TroubleAgentから開始。

### リスク2: パフォーマンス低下
**対策**: React.memoとuseMemoで最適化。大量メッセージ時は仮想スクロール検討。

### リスク3: 状態の肥大化
**対策**: メッセージ数に上限設定（例：エージェントごと100件まで）。

## 8. 将来の拡張性

### 次のステップとして検討
1. **永続化層の追加**
   - localStorage/sessionStorageでのメッセージ保存
   - ページリロード後の復元

2. **メッセージの圧縮**
   - 古いメッセージのアーカイブ化
   - 要約機能の実装

3. **エクスポート機能**
   - チャット履歴のダウンロード
   - 共有リンクの生成

---

作成日: 2024-08-04
作成者: Claude
バージョン: 1.0.0
状態: 実装前レビュー待ち