# AI Agent Feature

ARCHAIVE Demo アプリケーションの AI エージェント機能です。複数の専門AIエージェントと柔軟なチャットUIレイアウトを提供します。

## 概要

このfeatureは、以下の主要機能を提供します：

- **マルチエージェントシステム**: 用途別に特化した複数のAIエージェント
- **アダプティブUIレイアウト**: フローティング、サイドバー、フルページの3つのレイアウト
- **共有コンポーネントアーキテクチャ**: コードの重複を最小化した効率的な設計
- **マークダウンレンダリング**: AIの回答をリッチなマークダウンで表示
- **リアルタイムチャット**: OpenAI API統合によるストリーミング対応

## アーキテクチャ

### 設定駆動アーキテクチャ

エージェント固有のコンポーネントを最小化し、`agentConfigs.ts` での設定により動作を制御：

```typescript
// エージェント設定例
general: {
  id: 'general',
  name: 'なんでもAI',
  icon: MessageCircle,
  description: '一般的な相談・質問に対応',
  color: '#3b82f6',
  category: AgentCategory.GENERAL,
  welcomeMessage: 'ARCHAIVE AIエージェントへようこそ。',
  quickActions: [
    { id: 'design-basics', label: '設計の基本を教えて', icon: BookOpen, action: '設計の基本を教えて' }
    // ...
  ]
}
```

### 共有コンポーネント

#### Core Components
- **ChatMessage.tsx**: マークダウンレンダリング対応のメッセージ表示
- **ChatInput.tsx**: 動的クイックアクション付き入力フィールド
- **ChatContent.tsx**: 基本的なチャット表示（多くのエージェントで共用可能）

#### Layout Components
- **FloatingLayout.tsx**: ドラッグ可能なフローティングウィンドウ
- **SidebarLayout.tsx**: サイドバー形式の固定レイアウト
- **FullpageLayout.tsx**: フルスクリーンモーダル形式

## ディレクトリ構造

```
ai-agent/
├── agents/                    # エージェント固有コンポーネント
│   ├── EstimateAgent/        # 見積もりAI
│   ├── GeneralAgent/         # なんでもAI
│   ├── InquiryAgent/         # 問い合わせAI（未使用）
│   ├── ProcessAgent/         # 工程生成AI（未使用）
│   └── README.md             # エージェント追加手順書
├── index.tsx                 # メインエントリーポイント
├── shared/                   # 共有コンポーネント・ロジック
│   ├── components/           # 再利用可能なUIコンポーネント
│   ├── hooks/               # カスタムReactフック
│   ├── layouts/             # レイアウトコンポーネント
├── types/                   # TypeScript型定義
├── utils/                   # ユーティリティ関数
│   ├── agentConfigs.ts      # エージェント設定（重要）
│   ├── chatApi.ts           # API通信
│   └── storageUtils.ts      # ローカルストレージ
└── README.md               # このファイル
```

## 主な機能

### 1. マルチエージェントシステム

現在実装されているエージェント：

#### なんでもAI (general)
- 一般的な設計・製造相談
- 6つのクイックアクション（設計基本、材料選択、公差設定など）
- ブルーアイコン (#3b82f6)

#### 見積もりAI (estimate)
- 図面からの見積もり生成
- ファイルアップロード機能
- 6つのクイックアクション（概算見積もり、詳細見積もりなど）
- グリーンアイコン (#10b981)

### 2. レイアウトシステム

#### フローティングレイアウト
- ドラッグ&ドロップによる移動
- リサイズ可能
- 位置・サイズの永続化

#### サイドバーレイアウト
- 固定サイドバー表示
- レスポンシブ対応
- コンパクトな表示

#### フルページレイアウト
- モーダル形式
- チャット履歴サイドバー
- 大画面での利用に最適

### 3. マークダウンレンダリング

AIの回答は自動的にマークダウンとしてレンダリング：

- ヘッダー（`###`）
- 太字（`**text**`）
- イタリック（`*text*`）
- リスト（箇条書き・番号付き）
- コードブロック
- インラインコード
- 引用文
- リンク

### 4. 状態管理

#### useChatUIState
- チャット状態の一元管理
- レイアウト遷移の制御
- ローカルストレージとの同期

#### useLayoutTransition
- スムーズなレイアウト遷移
- アニメーション制御
- エラーハンドリング

## API 統合

### OpenAI API
- `src/app/api/ai-agents/[agentId]/route.ts`
- エージェント別の専用プロンプト
- gpt-4o-mini モデル使用
- ストリーミング対応（将来拡張）

### エンドポイント
```
POST /api/ai-agents/general
POST /api/ai-agents/estimate
```

## パフォーマンス最適化

### コード分割
- エージェント別の動的インポート
- レイアウト別の遅延読み込み

### メモリ管理
- 不要なメッセージ履歴のクリーンアップ
- 画像・ファイルの適切な管理

### レンダリング最適化
- React.memo による不要な再描画防止
- useCallback/useMemo の適切な使用

## 使用技術

### フロントエンド
- **React 19**: コンポーネントフレームワーク
- **TypeScript**: 型安全性
- **Tailwind CSS**: スタイリング
- **Lucide React**: アイコン
- **react-markdown**: マークダウンレンダリング
- **remark-gfm**: GitHub Flavored Markdown

### バックエンド
- **Next.js API Routes**: API エンドポイント
- **OpenAI API**: AI エージェント機能

## 開発者向け情報

### 新しいエージェントの追加
`agents/README.md` を参照してください。

### カスタマイズポイント

#### エージェント設定
- `utils/agentConfigs.ts` でエージェントの動作を制御
- アイコン、色、クイックアクションを自由にカスタマイズ

#### UI コンポーネント
- `shared/components/` で共有コンポーネントを拡張
- Tailwind CSS でスタイルをカスタマイズ

#### レイアウト
- `shared/layouts/` で新しいレイアウトを追加
- レスポンシブデザインを考慮

### テスト
- 各エージェントの動作確認
- レイアウト遷移のテスト
- API 連携のテスト

## トラブルシューティング

### よくある問題

1. **エージェントが表示されない**
   - `agentConfigs.ts` の設定を確認
   - import 文の確認

2. **レイアウトが正しく表示されない**
   - CSS の競合を確認
   - レスポンシブブレークポイントを確認

3. **API 通信エラー**
   - OpenAI API キーの設定を確認
   - ネットワーク接続を確認

### デバッグ
- React DevTools でコンポーネント状態を確認
- ブラウザの開発者ツールでネットワーク通信を確認
- コンソールログでエラーメッセージを確認

## ライセンス

ARCHAIVE Demo プロジェクトのライセンスに従います。

## 貢献

新しいエージェントの追加や機能改善は `agents/README.md` の手順に従って実装してください。