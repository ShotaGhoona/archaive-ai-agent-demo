# 05-02-シンプル化された見積もりエージェント ユーザージャーニー

## コンセプト：ChatGPTライクなシンプルな図面見積もり体験

一般的なAIチャット（ChatGPT等）と同じような直感的な操作で、図面見積もりに特化した体験を提供します。

### 設計思想

- **クイックアクション不要** - 複雑な選択肢を排除
- **1クリック見積もり開始** - 図面アップロード→デフォルトメッセージ→送信の3ステップ
- **継続対話型** - 初回の図面を前提とした追加質問・修正指示が可能
- **ChatGPTライクUX** - 使い慣れたチャットインターフェース

## シンプル化されたユーザージャーニー

```mermaid
graph TD
    A[見積もりAI選択] --> B[見積もりチャット画面表示]

    %% 初期状態
    B --> C[大きなファイルアップロード領域表示]
    C --> C1[説明テキスト:<br/>図面ファイルをアップロードして<br/>見積もりを開始してください]

    %% ファイルアップロード
    C1 --> D[図面ファイル選択/D&D]
    D --> E{ファイル検証}
    E -->|エラー| F[エラー表示:<br/>JPG/PNG/WEBP, 20MB以下]
    E -->|成功| G[ファイルプレビュー表示]

    %% デフォルトメッセージ設定
    G --> H[入力欄に自動入力:<br/>この図面の見積もりを開始してください]
    H --> I[送信ボタン有効化]

    %% 初回送信
    I --> J[ユーザーが送信ボタンクリック]
    J --> K[図面+テキストがAPIに送信]
    K --> L[Vision API処理開始]
    L --> M[見積もり結果表示]

    %% 継続対話
    M --> N{ユーザーアクション}
    N -->|追加質問| O[テキスト入力]
    N -->|修正指示| O
    N -->|完了| P[セッション終了]

    O --> Q[前回の図面を前提とした<br/>追加処理]
    Q --> R[新しい回答表示]
    R --> N

    %% エラーハンドリング
    F --> D

    %% スタイリング
    classDef uploadBox fill:#e8f5e8
    classDef processBox fill:#fff3e0
    classDef chatBox fill:#e3f2fd
    classDef errorBox fill:#ffebee

    class C,C1,D,G,H uploadBox
    class K,L,M,Q,R processBox
    class O,N chatBox
    class F errorBox
```

## 詳細UXフロー

```mermaid
graph TD
    A[見積もりAI起動] --> B[チャット画面表示]

    %% 初期画面構成
    B --> B1[🎯 見積もりAI ヘッダー]
    B --> B2[📁 大きなファイルアップロード領域<br/>画面の60%を占める]
    B --> B3[💬 チャット入力欄（非活性）]
    B --> B4[📤 送信ボタン（非活性）]

    %% ファイルアップロード段階
    B2 --> C[ファイル選択/ドラッグ&ドロップ]
    C --> D[ファイル検証処理]
    D --> E[ファイルプレビュー表示]
    E --> F[アップロード領域が縮小<br/>画面上部20%に]

    %% メッセージ入力段階
    F --> G[チャット入力欄が活性化]
    G --> H[デフォルトメッセージ自動入力:<br/>この図面の見積もりを開始してください]
    H --> I[送信ボタン活性化]

    %% 送信・処理段階
    I --> J{ユーザー送信}
    J -->|送信| K[メッセージがチャット履歴に追加]
    K --> L[ローディング表示]
    L --> M[Vision API + 見積もりプロンプト処理]
    M --> N[詳細見積もり結果表示]

    %% 継続対話段階
    N --> O[通常のチャット入力欄に戻る]
    O --> P{追加入力}
    P -->|質問・指示入力| Q[前回図面を前提とした処理]
    P -->|新しい図面| R[新規セッション開始確認]
    P -->|終了| S[セッション完了]

    Q --> T[回答表示]
    T --> P

    R --> U{ユーザー確認}
    U -->|Yes| A
    U -->|No| P

    %% UI状態管理
    classDef initialState fill:#f0f9ff
    classDef uploadState fill:#f0fdf4
    classDef chatState fill:#fefce8
    classDef processState fill:#fdf2f8

    class B1,B2,B3,B4 initialState
    class C,D,E,F uploadState
    class G,H,I,O,P chatState
    class K,L,M,N,Q,T processState
```

## 技術実装の変更点

### 1. agentConfigs.ts の簡素化

```typescript
estimate: {
  id: 'estimate',
  name: '見積もりAI',
  icon: Calculator,
  description: '図面から見積もりを自動生成',
  color: '#10b981',
  category: AgentCategory.ESTIMATE,
  welcomeMessage: '図面ファイルをアップロードして見積もりを開始してください',
  defaultInput: 'この図面の見積もりを開始してください',
  quickActions: [] // クイックアクション削除
}
```

### 2. EstimateChatContent.tsx の UI変更

```typescript
// 初期状態：大きなファイルアップロード領域
const InitialUploadView = () => (
  <div className="flex-1 flex flex-col items-center justify-center p-8">
    <div className="w-full max-w-2xl">
      <h2 className="text-2xl font-bold text-center mb-2">見積もりAI</h2>
      <p className="text-center text-muted-foreground mb-8">
        図面ファイルをアップロードして見積もりを開始してください
      </p>
      <FileUploadArea
        onFileUpload={handleFileUpload}
        acceptedTypes={['.jpg', '.jpeg', '.png', '.webp']}
        maxSize={20 * 1024 * 1024}
        className="h-64" // 大きなアップロード領域
      />
    </div>
  </div>
);

// ファイルアップロード後：縮小されたプレビュー＋チャット
const ChatWithPreview = () => (
  <div className="flex-1 flex flex-col">
    {/* 縮小されたファイルプレビュー */}
    <div className="border-b p-4 bg-muted/30">
      <div className="flex items-center gap-3">
        <FileImage className="w-6 h-6" />
        <span className="text-sm font-medium">{uploadedFile.name}</span>
        <Button variant="ghost" size="sm" onClick={handleRemoveFile}>
          <X className="w-4 h-4" />
        </Button>
      </div>
    </div>

    {/* チャット履歴 */}
    <div className="flex-1 overflow-y-auto p-4">
      {messages.map((message) => (
        <ChatMessage key={message.id} message={message} />
      ))}
    </div>
  </div>
);
```

### 3. バックエンド処理の簡素化

```typescript
// estimateType の自動判定（ユーザーは選択不要）
private determineEstimateType(message: string): 'quick' | 'detailed' {
  // シンプルなキーワード判定
  const detailKeywords = ['詳細', '精密', '正確', '契約'];
  const hasDetailKeyword = detailKeywords.some(keyword =>
    message.includes(keyword)
  );

  return hasDetailKeyword ? 'detailed' : 'quick';
}

// システムプロンプトの簡素化
private buildSystemPrompt(): string {
  return `
あなたは製造業の見積もり専門AIです。
アップロードされた図面を分析し、製造見積もりを作成してください。

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
```

## ユーザーエクスペリエンス比較

### Before（複雑）

1. エージェント選択
2. 6つのクイックアクションから選択
3. ファイルアップロード
4. 見積もりタイプ選択
5. メタデータ入力
6. 送信

### After（シンプル）

1. 見積もりAI選択
2. 図面ファイルアップロード
3. 送信ボタンクリック
4. 結果確認
5. 必要に応じて追加質問

## 期待される効果

### UX改善

- **学習コストゼロ** - ChatGPTユーザーなら即座に理解
- **操作ステップ削減** - 6ステップ→3ステップ
- **判断疲れ解消** - 選択肢を最小限に

### 技術的メリット

- **コード簡素化** - クイックアクション関連のロジック削除
- **保守性向上** - UI状態管理の単純化
- **エラー要因削減** - 複雑な分岐処理の削除

### ビジネス価値

- **導入障壁低下** - 直感的な操作で利用開始
- **利用頻度向上** - 手軽さによる再利用促進
- **満足度向上** - ストレスフリーな操作体験

この簡素化により、見積もりAIの本質的価値である「図面から迅速な見積もり生成」に集中でき、ユーザーにとってより使いやすいツールになります。
