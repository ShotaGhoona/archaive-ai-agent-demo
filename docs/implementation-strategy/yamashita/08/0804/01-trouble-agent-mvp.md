# TroubleAgent MVP 実装戦略書

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

## 2. 新ディレクトリ構造

```
src/features/ai-agent/agents/TroubleAgent/
├── index.tsx                    # エントリーポイント
├── components/
│   ├── ChatInterface.tsx        # メインチャットUI
│   ├── MessageList.tsx          # メッセージリスト表示
│   ├── MessageItem.tsx          # 個別メッセージ
│   ├── InputArea.tsx            # 入力エリア
│   └── SearchResults.tsx        # 検索結果コンポーネント
├── hooks/
│   ├── useMessageHandler.ts     # メッセージ処理ロジック
│   ├── useKeywordSearch.ts      # キーワード検索ロジック
│   └── useScrollBehavior.ts     # スクロール制御
├── services/
│   ├── searchService.ts         # 検索処理サービス
│   └── messageService.ts        # メッセージ生成サービス
├── utils/
│   ├── keywordMatcher.ts        # キーワードマッチング
│   ├── dataParser.ts            # データパース処理
│   └── formatters.ts            # フォーマット関数群
├── data/
│   └── mockDatabase.json        # モックデータ
├── types/
│   └── index.ts                 # 型定義
└── constants/
    └── messages.ts              # 定数メッセージ
```

## 3. 実装計画

### Phase 1: 基盤構築（30分）

1. ディレクトリ構造の作成
2. 型定義の整備
3. 定数ファイルの作成
4. モックデータの最適化

### Phase 2: サービス層実装（45分）

1. キーワードマッチングロジック
2. 検索サービスの実装
3. メッセージ生成サービス
4. データパース処理

### Phase 3: カスタムフック実装（30分）

1. useMessageHandler - メッセージ処理
2. useKeywordSearch - 検索ロジック
3. useScrollBehavior - UX改善

### Phase 4: UIコンポーネント実装（45分）

1. ChatInterface - メインコンテナ
2. MessageList/MessageItem - メッセージ表示
3. InputArea - 入力UI
4. SearchResults - 結果表示

### Phase 5: 統合とテスト（30分）

1. コンポーネント統合
2. 動作確認
3. UX調整

## 4. 技術仕様

### キーワード検索アルゴリズム

```typescript
interface SearchQuery {
  hasトラブル: boolean;
  has見積もり: boolean;
  has仕様書: boolean;
}

function analyzeKeywords(input: string): SearchQuery {
  const normalized = input.toLowerCase();
  return {
    hasトラブル: /トラブル|trouble|問題|不具合/.test(normalized),
    has見積もり: /見積|estimate|コスト|費用/.test(normalized),
    has仕様書: /仕様|spec|スペック|specification/.test(normalized),
  };
}
```

### メッセージフロー

```
1. ユーザー入力
2. キーワード解析
3. 該当データ検索
4. 結果フォーマット
5. メッセージとして表示
```

### レスポンス遅延シミュレーション

- 検索処理に500-1000msの遅延を追加
- タイピングインジケーター表示
- よりリアルなAI体験を演出

## 5. UI/UX設計

### ウェルカムメッセージ

```
「過去のトラブル事例、見積もり、仕様書を図面から検索できます。」
```

### 検索結果表示フォーマット

```
📋 [カテゴリ] 検索結果: N件

1. 文書名: XXX
   顧客: YYY社
   日付: YYYY/MM/DD
   [詳細を見る]

2. ...
```

### エラーハンドリング

- キーワード未検出時：「検索キーワードを含めてください（例：トラブル、見積もり、仕様書）」
- 検索結果0件：「該当する情報が見つかりませんでした」

## 6. データ構造

### Message型

```typescript
interface Message {
  id: string;
  type: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  metadata?: {
    searchResults?: SearchResult[];
    isTyping?: boolean;
  };
}
```

### SearchResult型

```typescript
interface SearchResult {
  id: string;
  category: 'trouble' | 'estimate' | 'specification';
  documentName: string;
  customer: string;
  date: string;
  summary: string;
  link?: string;
}
```

## 7. パフォーマンス最適化

- React.memoによるコンポーネント最適化
- useMemoでの検索結果キャッシュ
- 仮想スクロールは不要（デモのため）
- デバウンス処理は不要（送信ボタン式）

## 8. デモシナリオ

### シナリオ1: トラブル検索

```
User: "過去のトラブル事例を教えてください"
AI: [トラブル一覧を表示]
```

### シナリオ2: 複合検索

```
User: "トラブルと見積もりの情報を確認したい"
AI: [トラブル一覧と見積もり一覧を表示]
```

### シナリオ3: 具体的な質問

```
User: "A社の仕様書はありますか？"
AI: [仕様書一覧を表示]（実際のフィルタリングは行わない）
```

## 9. 実装優先順位

1. **必須機能**
   - キーワード検索
   - 結果表示
   - 基本的なチャットUI

2. **推奨機能**
   - タイピングインジケーター
   - スムーズなスクロール
   - レスポンス遅延

3. **オプション機能**
   - アニメーション
   - 結果のハイライト
   - コピー機能

## 10. 成功基準

- [ ] キーワードで正しく検索できる
- [ ] 結果が見やすく表示される
- [ ] レスポンスが自然に感じられる
- [ ] デモ動画で説得力がある
- [ ] コードが整理されている

## 11. 実装開始

この戦略に基づいて、以下の順序で実装を進めます：

1. 既存コードのバックアップ
2. 新ディレクトリ構造の作成
3. 基盤となる型定義とユーティリティ
4. サービス層の実装
5. UIコンポーネントの実装
6. 統合とテスト

---

作成日: 2024-08-04
作成者: Claude
バージョン: 1.0.0
