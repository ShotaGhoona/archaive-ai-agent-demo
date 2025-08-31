# TroubleAgent MVP 実装戦略書（改訂版）

## 1. 目的と要件

### 目的

- デモ動画用のMVPを作成
- 先方に完成物のイメージを掴んでもらう
- 実際のAI機能は含まない（キーワードマッチングのみ）

### 機能要件

1. シンプルなウェルカムメッセージ表示
2. キーワードベースの検索処理
3. 検索結果のリスト表示
4. スムーズなUI/UX体験

### キーワード処理ロジック

- 「トラブル」→ トラブル情報のみ表示
- 「見積」「見積もり」「見積り」→ 見積もり情報のみ表示
- 「仕様」「仕様書」→ 仕様書情報のみ表示
- 複数キーワード含む → 該当する全カテゴリ表示
- キーワードなし → ヘルプメッセージ表示

### 年代フィルター処理ロジック

- 4桁の数字が1つ → その年以降のデータを表示（startDate）
- 4桁の数字が2つ → 期間内のデータを表示（startDate〜endDate）
- 例：「1995-2001年代の間のトラブル」→ 1995年〜2001年のトラブルのみ

## 2. 新ディレクトリ構造（既存コンポーネント活用版）

```
src/features/ai-agent/agents/TroubleAgent/
├── ChatContent.tsx              # メインコンテナ（簡略化）
├── ChatInput.tsx                # 既存を流用
├── hooks/
│   ├── useMessageHandler.ts     # メッセージ処理ロジック
│   └── useKeywordSearch.ts      # キーワード検索ロジック
├── services/
│   └── searchService.ts         # 検索処理サービス
├── utils/
│   ├── keywordMatcher.ts        # キーワードマッチング
│   └── messageFormatter.ts      # Markdown形式への変換
├── data/
│   └── mockDatabase.json        # 既存のtrouble-database.jsonを流用
├── types/
│   └── index.ts                 # 追加の型定義（既存Message型を拡張）
└── constants/
    └── messages.ts              # 定数メッセージ
```

### 既存コンポーネントの活用

- `ChatMessage.tsx` - メッセージ表示（shared/components）
- `ChatInput.tsx` - 入力UI（現在のTroubleAgent版を使用）
- `Message型` - 既存の型定義を使用
- `trouble-database.json` - 既存データを流用

## 3. 実装計画（修正版）

### Phase 1: 基盤構築（20分）

1. 不要なファイルの削除/バックアップ
2. 新規ディレクトリ作成
3. 定数ファイルの作成
4. 既存データの確認

### Phase 2: サービス層実装（30分）

1. キーワードマッチングロジック
2. 検索サービスの実装
3. Markdownフォーマッター作成

### Phase 3: カスタムフック実装（20分）

1. useMessageHandler - メッセージ管理
2. useKeywordSearch - 検索ロジック

### Phase 4: UIコンポーネント実装（30分）

1. ChatContent.tsx - 既存ChatMessageを使用
2. 既存ChatInput.tsxの調整
3. 統合テスト

### Phase 5: 動作確認と調整（20分）

1. デモシナリオの実行
2. UX調整
3. バグ修正

## 4. 技術仕様（既存コンポーネント対応版）

### メッセージ生成パターン

```typescript
// 既存のMessage型を使用
import { Message } from '@/features/ai-agent/types/types';

// ウェルカムメッセージ
const welcomeMessage: Message = {
  id: 'welcome',
  content: '過去のトラブル事例、見積もり、仕様書を図面から検索できます。',
  sender: 'ai',
  type: 'welcome', // 特別なスタイル適用
  timestamp: new Date(),
};

// タイピング中
const typingMessage: Message = {
  id: 'typing',
  content: '',
  sender: 'ai',
  isTyping: true,
  timestamp: new Date(),
};

// 検索結果（Markdown形式）
const resultMessage: Message = {
  id: Date.now().toString(),
  content: formatAsMarkdown(searchResults), // Markdown文字列
  sender: 'ai',
  timestamp: new Date(),
};
```

### キーワード検索アルゴリズム

```typescript
interface SearchQuery {
  hasトラブル: boolean;
  has見積もり: boolean;
  has仕様書: boolean;
  startDate?: number;
  endDate?: number;
}

function analyzeKeywords(input: string): SearchQuery {
  const normalized = input.toLowerCase();

  // 年代抽出（4桁の数字）
  const yearMatches = input.match(/\b(19\d{2}|20\d{2})\b/g);
  let startDate: number | undefined;
  let endDate: number | undefined;

  if (yearMatches) {
    const years = yearMatches.map((y) => parseInt(y)).sort((a, b) => a - b);
    if (years.length === 1) {
      startDate = years[0];
    } else if (years.length >= 2) {
      startDate = years[0];
      endDate = years[years.length - 1];
    }
  }

  return {
    hasトラブル: /トラブル|trouble|問題|不具合/.test(normalized),
    has見積もり: /見積|estimate|コスト|費用/.test(normalized),
    has仕様書: /仕様|spec|スペック|specification/.test(normalized),
    startDate,
    endDate,
  };
}

// フィルター処理
function filterByDateRange(items: any[], startDate?: number, endDate?: number) {
  if (!startDate) return items;

  return items.filter((item) => {
    const itemYear = parseInt(item.date.substring(0, 4));
    if (endDate) {
      return itemYear >= startDate && itemYear <= endDate;
    } else {
      return itemYear >= startDate;
    }
  });
}
```

### Markdownフォーマッター

```typescript
function formatAsMarkdown(results: SearchResults, query: SearchQuery): string {
  let markdown = '';

  // 期間表示
  if (query.startDate) {
    if (query.endDate) {
      markdown += `📅 **検索期間**: ${query.startDate}年 〜 ${query.endDate}年\n\n`;
    } else {
      markdown += `📅 **検索期間**: ${query.startDate}年以降\n\n`;
    }
  }

  if (results.troubles.length > 0) {
    markdown += `## 🔧 トラブル検索結果: ${results.troubles.length}件\n\n`;
    results.troubles.forEach((item, index) => {
      markdown += `### ${index + 1}. ${item.document_name}\n`;
      markdown += `- **顧客**: ${item.customer}\n`;
      markdown += `- **日付**: ${item.date}\n`;
      markdown += `- **内容**: ${item.text}\n`;
      markdown += `- [図面を確認](#)\n\n`;
    });
  } else if (query.hasトラブル) {
    markdown += `## 🔧 トラブル検索結果\n\n`;
    markdown += `指定された期間にトラブル情報は見つかりませんでした。\n\n`;
  }

  // 同様に見積もり、仕様書も処理

  return markdown;
}
```

## 5. 実装詳細

### ChatContent.tsx の実装

```typescript
import { useState, useEffect, useRef } from 'react';
import ChatMessage from '@/features/ai-agent/shared/components/ChatMessage';
import ChatInput from './ChatInput';
import { Message } from '@/features/ai-agent/types/types';
import { useKeywordSearch } from './hooks/useKeywordSearch';
import { useMessageHandler } from './hooks/useMessageHandler';

export default function ChatContent({ agentConfig }) {
  const { messages, addMessage, addTypingMessage, removeTypingMessage } = useMessageHandler();
  const { searchByKeywords } = useKeywordSearch();
  const scrollRef = useRef<HTMLDivElement>(null);

  // 初期ウェルカムメッセージ
  useEffect(() => {
    addMessage({
      id: 'welcome',
      content: '過去のトラブル事例、見積もり、仕様書を図面から検索できます。',
      sender: 'ai',
      type: 'welcome',
      timestamp: new Date()
    });
  }, []);

  const handleSendMessage = async (content: string) => {
    // ユーザーメッセージ追加
    addMessage({
      id: Date.now().toString(),
      content,
      sender: 'user',
      timestamp: new Date()
    });

    // タイピング表示
    addTypingMessage();

    // 遅延シミュレーション
    await new Promise(resolve => setTimeout(resolve, 800));

    // 検索実行
    const results = await searchByKeywords(content);

    // タイピング削除
    removeTypingMessage();

    // 結果表示
    addMessage({
      id: (Date.now() + 1).toString(),
      content: results,
      sender: 'ai',
      timestamp: new Date()
    });
  };

  // 自動スクロール
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(message => (
          <ChatMessage
            key={message.id}
            message={message}
            agentConfig={agentConfig}
          />
        ))}
        <div ref={scrollRef} />
      </div>
      <ChatInput
        onSendMessage={handleSendMessage}
        agentConfig={agentConfig}
      />
    </div>
  );
}
```

## 6. 削除対象ファイル

以下のファイルは新実装で不要となるため削除：

- `TroubleAgent/components/SearchResultMessage.tsx`
- `TroubleAgent/utils/formatUtils.ts` (messageFormatter.tsに置き換え)
- `TroubleAgent/utils/searchUtils.ts` (searchService.tsに置き換え)
- `TroubleAgent/TroublePopover.tsx` (今回は使用しない)

## 7. デモシナリオ

### シナリオ1: トラブル検索

```
User: "過去のトラブル事例を教えてください"
AI: [Markdownフォーマットでトラブル一覧を表示]
```

### シナリオ2: 年代指定検索

```
User: "1995-2001年代の間のトラブルを調べてください"
AI: 📅 検索期間: 1995年 〜 2001年
    [該当期間のトラブルのみ表示]
```

### シナリオ3: 単一年代指定

```
User: "2020年以降の見積もりを見たい"
AI: 📅 検索期間: 2020年以降
    [2020年以降の見積もりを表示]
```

### シナリオ4: 複合検索

```
User: "1998年から2003年のトラブルと見積もりの情報"
AI: 📅 検索期間: 1998年 〜 2003年
    [両方のカテゴリを期間フィルター付きで表示]
```

### シナリオ5: キーワードなし

```
User: "こんにちは"
AI: "検索したい情報の種類をお伝えください（例：トラブル、見積もり、仕様書）"
```

## 8. 成功基準

- [x] 既存のChatMessage.tsxを活用
- [ ] Markdown形式で見やすい検索結果
- [ ] 自然な遅延とタイピング表示
- [ ] キーワード検索が正確に動作
- [ ] コードの簡潔性と保守性

## 9. 実装手順

1. **既存ファイルのバックアップ**

   ```bash
   cp -r TroubleAgent TroubleAgent_backup
   ```

2. **不要ファイルの削除**

3. **新規ファイルの作成**
   - hooks/useMessageHandler.ts
   - hooks/useKeywordSearch.ts
   - services/searchService.ts
   - utils/messageFormatter.ts
   - constants/messages.ts

4. **ChatContent.tsxの書き換え**

5. **動作確認**

---

作成日: 2024-08-04
作成者: Claude
バージョン: 2.0.0（既存コンポーネント活用版）
