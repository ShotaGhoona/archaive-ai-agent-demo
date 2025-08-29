# table-view

Config-based設計による高機能データテーブルコンポーネント
- これ繋ぎ込み大変やと思う
-  useCellEdit.ts とかはセルで編集できるようにするからエンドポイント回さなあかん（POST）
- 表示させるのにもfetchがいる
- フィルターかけた時にも必要やね
- configで色々いじれるけど

## ディレクトリ構成

```
table-view/
├── README.md                        # 詳細なドキュメント
├── lib/
│   ├── useCellEdit.ts              # インライン編集機能
│   ├── useColumnResize.ts          # 列幅リサイズ機能
│   ├── usePaginatedTable.ts        # ページネーション管理
│   ├── useStickyColumns.ts         # 固定列機能
│   └── useTableSort.ts             # ソート機能
├── model/
│   └── types.ts                    # TableConfig、ColumnConfig等の型定義
└── ui/
    ├── TableView.tsx               # メインテーブルコンポーネント
    ├── TableHeaderCell.tsx         # ヘッダーセルコンポーネント
    ├── TableDataCell.tsx           # データセルコンポーネント
    ├── TablePagination.tsx         # ページネーションコンポーネント
    └── table-cell-components/      # セル種別コンポーネント
        ├── BooleanTypeCell.tsx    # Boolean型セル
        ├── DateTypeCell.tsx       # 日付型セル
        ├── NumberTypeCell.tsx     # 数値型セル
        ├── SelectTypeCell.tsx     # 選択型セル
        ├── TextTypeCell.tsx       # テキスト型セル
        └── UserTypeCell.tsx       # ユーザー型セル

呼び出し側の例 (src/page-components/blueprint/home):
├── lib/blueprintTableConfig.tsx      # TableViewConfig設定
└── ui/BlueprintTableView.tsx         # TableView使用
```

## 概要

**設定オブジェクトによる統一的なテーブル管理システム:**

### 主要機能
- **Config-based設計**: TableConfigによる一元的な設定管理
- **ソート機能**: 文字列・数値・日付の自動ソート
- **インライン編集**: セル単位での直接編集（6種類のセルタイプ対応）
- **固定列機能**: 左右の列を固定表示（スティッキーカラム）
- **列幅リサイズ**: マウスドラッグによる動的リサイズ
- **自動ページネーション**: 設定による自動ページ管理

### セルタイプ
- **TextTypeCell**: 基本テキスト表示・編集
- **NumberTypeCell**: 数値入力・バリデーション
- **DateTypeCell**: 日付ピッカー対応
- **SelectTypeCell**: ドロップダウン選択
- **BooleanTypeCell**: チェックボックス
- **UserTypeCell**: ユーザー情報表示

### 技術特徴
- **TypeScript完全対応**: 型安全な設定とデータ処理
- **フック分離設計**: 機能別カスタムフックによる再利用性
- **パフォーマンス最適化**: 仮想化・メモ化による大量データ対応
- **カスタマイズ性**: セルレンダラーの自由な拡張
- **アクセシビリティ**: キーボードナビゲーション対応

## 使用場面

- **図面管理**: ファイル一覧・メタデータ表示
- **顧客管理**: 企業情報・担当者データ
- **案件管理**: プロジェクト進捗・ステータス管理
- **帳票管理**: ドキュメント一覧・承認フロー
- **設定画面**: システム設定・ユーザー管理

TableConfigの設定により、様々なデータ構造に柔軟に対応可能。
EOF < /dev/null