# ChatMessage.tsx 活用ガイド

## 既存コンポーネントの活用戦略

### 1. ChatMessage.tsx の活用ポイント

#### 利用可能な機能

- ✅ Markdown レンダリング（ReactMarkdown + remarkGfm）
- ✅ タイピングインジケーター
- ✅ ウェルカムメッセージ専用スタイル
- ✅ タイムスタンプ表示
- ✅ エージェントアイコン/カラー対応

#### TroubleAgent での使用例

```typescript
// components/ChatInterface.tsx
import ChatMessage from '@/features/ai-agent/shared/components/ChatMessage';

const messages: Message[] = [
  // ウェルカムメッセージ
  {
    id: 'welcome',
    content: '過去のトラブル事例、見積もり、仕様書を図面から検索できます。',
    sender: 'ai',
    type: 'welcome',
    timestamp: new Date(),
  },
  // 検索結果（Markdown形式）
  {
    id: '2',
    content: `## 🔧 トラブル検索結果

以下の3件が見つかりました：

### 1. 加工精度不良
- **顧客**: A社
- **日付**: 2024/01/15
- **詳細**: 寸法公差を超える加工不良が発生
- [図面を確認](/blueprint/DOC-001)

---

### 2. 材料選定ミス
- **顧客**: B社
- **日付**: 2024/02/20
- **詳細**: 指定材料と異なる材料で製造`,
    sender: 'ai',
    timestamp: new Date(),
  },
];
```

### 2. 修正が必要な箇所

現在のChatMessage.tsxは完全に使用可能ですが、以下の微調整で更に良くなります：

#### オプション: リンクのクリック処理

```typescript
// ChatMessage.tsx の a タグコンポーネントを調整
a: ({href, children}) => {
  // 内部リンクの場合は Next.js の Link を使用
  if (href?.startsWith('/')) {
    return <Link href={href} className="text-primary underline hover:no-underline">{children}</Link>
  }
  // 外部リンクはそのまま
  return <a href={href} className="text-primary underline hover:no-underline" target="_blank" rel="noopener noreferrer">{children}</a>
}
```

### 3. TroubleAgent の実装構造（簡略版）

既存コンポーネントを活用した新構造：

```
TroubleAgent/
├── ChatContent.tsx        # メインコンテナ
├── ChatInput.tsx          # 既存を流用
├── hooks/
│   └── useKeywordSearch.ts   # 検索ロジックのみ新規
├── services/
│   └── searchService.ts      # 検索処理
└── utils/
    └── messageFormatter.ts    # Message型への変換
```

### 4. 実装例

```typescript
// TroubleAgent/ChatContent.tsx
import ChatMessage from '@/features/ai-agent/shared/components/ChatMessage';
import { useKeywordSearch } from './hooks/useKeywordSearch';

export default function ChatContent({ agentConfig, onSendMessage }) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      content: '過去のトラブル事例、見積もり、仕様書を図面から検索できます。',
      sender: 'ai',
      type: 'welcome',
      timestamp: new Date()
    }
  ]);

  const handleUserMessage = async (content: string) => {
    // ユーザーメッセージ追加
    const userMsg: Message = {
      id: Date.now().toString(),
      content,
      sender: 'user',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMsg]);

    // タイピング表示
    const typingMsg: Message = {
      id: 'typing',
      content: '',
      sender: 'ai',
      isTyping: true,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, typingMsg]);

    // 検索実行
    const searchResults = await searchByKeywords(content);

    // 結果をMarkdown形式でフォーマット
    const resultMsg: Message = {
      id: (Date.now() + 1).toString(),
      content: formatSearchResults(searchResults),
      sender: 'ai',
      timestamp: new Date()
    };

    // タイピング削除して結果追加
    setMessages(prev => prev.filter(m => m.id !== 'typing').concat(resultMsg));
  };

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
      <ChatInput onSendMessage={handleUserMessage} agentConfig={agentConfig} />
    </div>
  );
}
```

### 5. メリット

1. **開発時間の短縮**
   - 既存コンポーネントの再利用
   - Markdown レンダリング実装済み
   - スタイリング完了済み

2. **統一性の維持**
   - 他のエージェントと同じ見た目
   - 共通のUXパターン

3. **保守性の向上**
   - 共通コンポーネントの一元管理
   - バグ修正が全エージェントに反映

### 6. 結論

ChatMessage.tsx は**完全に活用可能**であり、むしろ使わない理由がありません。
TroubleAgent 固有のロジックは以下に集中すれば良い：

1. キーワード検索ロジック（useKeywordSearch）
2. 検索サービス（searchService）
3. 結果のMarkdownフォーマット（messageFormatter）

UIコンポーネントは既存のものを最大限活用することで、開発効率と品質を両立できます。
