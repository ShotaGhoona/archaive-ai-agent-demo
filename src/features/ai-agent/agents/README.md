# AI Agent 追加手順書

新しいAIエージェントを追加するための手順書です。

## 概要

このシステムでは、共有コンポーネント（`ChatMessage.tsx`、`ChatInput.tsx`）を使用して、設定駆動でエージェントを作成します。エージェント固有のファイルは最小限に抑え、主に `agentConfigs.ts` での設定とカスタムコンテンツコンポーネントのみで実装します。

## 手順

### 1. エージェント設定の追加

`src/components/feature/ai-agent/utils/agentConfigs.ts` にエージェント設定を追加します。

```typescript
// 必要なアイコンをインポート
import { NewIcon } from 'lucide-react';

// availableAgents オブジェクトに新しいエージェントを追加
newAgent: {
  id: 'newAgent',
  name: '新しいAI',
  icon: NewIcon,
  description: 'エージェントの説明',
  color: '#色コード',
  category: AgentCategory.GENERAL, // または適切なカテゴリ
  welcomeMessage: 'ようこそメッセージ',
  defaultInput: 'デフォルト入力値（オプション）',
  quickActions: [
    { 
      id: 'action1', 
      label: 'アクション1', 
      icon: ActionIcon, 
      action: 'アクション1のテキスト' 
    },
    // ... 他のクイックアクション
  ]
}
```

### 2. カスタムコンテンツコンポーネントの作成（必要に応じて）

多くの場合、共有の `ChatContent.tsx` で十分ですが、ファイルアップロードなど特殊な機能が必要な場合は専用コンポーネントを作成します。

```bash
mkdir src/components/feature/ai-agent/agents/NewAgent
```

```typescript
// src/components/feature/ai-agent/agents/NewAgent/NewChatContent.tsx
"use client";

import React, { useEffect, useRef } from 'react';
import { AgentContentProps } from '../../types/types';
import ChatMessage from '../../shared/components/ChatMessage';

const NewChatContent: React.FC<AgentContentProps> = ({ 
  messages, 
  isLoading, 
  agentConfig 
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const lastMessageRef = useRef<HTMLDivElement>(null);

  // 新しいメッセージが追加されたら自動スクロール
  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'end' 
      });
    }
  }, [messages, isLoading]);

  return (
    <div 
      ref={scrollContainerRef}
      className="flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-4 scroll-smooth"
      style={{ 
        maxHeight: '100%',
        scrollBehavior: 'smooth'
      }}
    >
      {/* カスタム機能をここに追加 */}
      
      {/* メッセージ表示 */}
      {messages.map((message, index) => (
        <ChatMessage 
          key={message.id} 
          message={message} 
          agentConfig={agentConfig}
          ref={index === messages.length - 1 ? lastMessageRef : undefined}
        />
      ))}
    </div>
  );
};

export default NewChatContent;
```

### 3. API エンドポイントの作成

`src/app/api/ai-agents/[agentId]/route.ts` で新しいエージェントのAPIロジックを追加します。

```typescript
// route.ts の handleAgentRequest 関数内に新しいケースを追加
case 'newAgent':
  return await handleNewAgentRequest(message, userId);
```

```typescript
// 新しいエージェント用のハンドラー関数を作成
async function handleNewAgentRequest(message: string, userId: string) {
  const systemPrompt = `
    あなたは新しいAIエージェントです。
    以下の役割を持っています：
    - 役割1
    - 役割2
    
    必ず日本語で回答してください。
  `;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: message }
    ],
    temperature: 0.7,
    max_tokens: 2000
  });

  return completion.choices[0]?.message?.content || "申し訳ございません。回答を生成できませんでした。";
}
```

### 4. エージェント使用箇所での設定

既存のコンポーネント（例：`index.tsx`）で新しいエージェントを使用できるようにします。

```typescript
// AgentContentRenderer でカスタムコンテンツを使用する場合
import NewChatContent from './agents/NewAgent/NewChatContent';

const AgentContentRenderer = ({ agentId, messages, isLoading, agentConfig }: any) => {
  switch (agentId) {
    case 'newAgent':
      return (
        <NewChatContent
          messages={messages}
          isLoading={isLoading}
          agentConfig={agentConfig}
        />
      );
    default:
      return (
        <ChatContent
          messages={messages}
          isLoading={isLoading}
          agentConfig={agentConfig}
        />
      );
  }
};
```

## 注意事項

### 共有コンポーネントの活用

- **ChatMessage.tsx**: マークダウンレンダリング対応済み。AIメッセージは自動的にマークダウンとして表示されます
- **ChatInput.tsx**: クイックアクション、エージェント固有の色、デフォルト入力値に対応
- **ChatContent.tsx**: 基本的なチャット表示機能。多くの場合これで十分です

### ファイル命名規則

- コンポーネント: `PascalCase` （例: `NewChatContent.tsx`）
- ディレクトリ: `PascalCase` （例: `NewAgent/`）
- 設定ID: `camelCase` （例: `newAgent`）

### TypeScript 型定義

新しいカテゴリが必要な場合は、`types/types.ts` の `AgentCategory` enum に追加してください。

```typescript
export enum AgentCategory {
  GENERAL = 'general',
  ESTIMATE = 'estimate',
  PROCESS = 'process',
  INQUIRY = 'inquiry',
  NEW_CATEGORY = 'new_category', // 新しいカテゴリ
}
```

## 例：シンプルなエージェント

設定のみで完結するシンプルなエージェントの例：

```typescript
simpleAgent: {
  id: 'simpleAgent',
  name: 'シンプルAI',
  icon: MessageCircle,
  description: 'シンプルな対話エージェント',
  color: '#6366f1',
  category: AgentCategory.GENERAL,
  welcomeMessage: 'こんにちは！何かお手伝いできることはありますか？',
  quickActions: [
    { id: 'help', label: 'ヘルプ', icon: HelpCircle, action: 'ヘルプを表示してください' },
    { id: 'about', label: 'このAIについて', icon: Info, action: 'このAIについて教えてください' }
  ]
}
```

この場合、カスタムコンポーネントは不要で、共有の `ChatContent` と `ChatInput` がそのまま使用されます。

## まとめ

1. `agentConfigs.ts` で設定を追加
2. 必要に応じてカスタムコンテンツコンポーネントを作成
3. API エンドポイントにロジックを追加
4. 使用箇所でエージェントを有効化

この手順により、コードの重複を避けながら新しいエージェントを効率的に追加できます。