# resizable-layout

マウスドラッグで2つ以上のパネルをリサイズできるレイアウトコンポーネント
呼び出す先のConfigで色々設定する
いろんなとこで使う
繋ぎ込みと全く関係ない


## ディレクトリ構成

```
resizable-layout/
├── README.md                     # 詳細なドキュメント
├── lib/
│   └── useResizableContext.ts   # Context API とカスタムフック
├── model/
│   └── types.ts                 # ResizableLayoutConfig、PanelConfig等の型定義
└── ui/
    ├── ResizableHandle.tsx      # ドラッグハンドルコンポーネント
    ├── ResizableLayout.tsx      # メインレイアウトコンテナ
    └── ResizablePanel.tsx       # 個別パネルコンポーネント
```

## 概要

**3つのコンポーネントで構成される高機能リサイズレイアウト:**
- **ResizableLayout**: メインコンテナ（設定とContext提供）
- **ResizablePanel**: 個別パネル（index指定で識別）
- **ResizableHandle**: ドラッグハンドル（パネル間に配置）

**主要機能:**
- 水平・垂直両方向のリサイズ対応
- 2パネル〜任意の数のパネルをサポート
- 最小・最大サイズ制約の自動適用
- パーセンテージベースのレスポンシブ設計
- Context APIによる状態管理

## 使用手順

1. **設定ファイル作成**: `lib/*ResizableLayoutConfig.ts` に設定定義
2. **コンポーネント配置**: Layout → Panel → Handle → Panel の順で配置
3. **制約設定**: direction に応じて Width/Height のプロパティを設定

## 典型的な使用場面

- **エディタ＋プレビュー**: コード編集画面とプレビューの分割
- **サイドバー付きレイアウト**: ナビゲーション＋メインコンテンツ
- **詳細表示**: 一覧＋詳細パネルの組み合わせ
- **マルチパネル**: 3パネル以上の複雑なレイアウト
EOF < /dev/null