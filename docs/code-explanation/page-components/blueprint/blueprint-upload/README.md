# Blueprint Upload Page - 1分キャッチアップ

## 概要

CADファイル・技術図面の高度なアップロード・管理システム。ファイルの整理、プロジェクト割り当て、スタック機能を提供。

## ディレクトリ構成

```
page-components/blueprint/blueprint-upload/
├── ui/
│   ├── BlueprintUploadContainer.tsx    # メインコンテナ
│   └── component/
│       ├── UploadPageHeader.tsx        # ページヘッダー
│       ├── UploadGalleryView.tsx       # ファイルギャラリー
│       ├── ProjectBoxList.tsx          # プロジェクト割り当て領域
│       ├── AddFileCard.tsx             # ファイルアップロード
│       └── StackedCard.tsx             # スタックファイル表示
├── lib/
│   ├── useBlueprintSorting.ts          # プロジェクト割り当てフック
│   ├── useDragAndDrop.ts               # ドラッグ&ドロップフック
│   ├── FileOperations.ts              # ファイル操作ビジネスロジック
│   └── StackOperations.ts             # スタック操作ビジネスロジック
└── model/type.ts                       # 型定義
```

## 主要機能

### ファイル管理

- 対応形式: CAD(.dwg, .step, .igs)、画像(.png, .jpg)、PDF
- ドラッグ&ドロップ: 直感的なファイルアップロード
- ファイルプレビュー: ズーム機能付きモーダル表示
- ゴミ箱機能: 削除・復元管理

### ファイル整理

- スタック機能: 関連図面をグループ化して視覚的に整理
- プロジェクト割り当て: ドラッグ&ドロップでプロジェクトに割り当て
- 新規プロジェクト作成: ドロップ時にリアルタイムでプロジェクト生成

### 表示・操作

- デュアルビューモード: "uploaded"(アップロード済み) / "trash"(ゴミ箱)
- バッチ操作: 全選択・一括削除・一括復元
- レスポンシブグリッド: 画面サイズに応じて1-4カラム表示

## 使用場所

ルート: `/blueprint/upload`
図面管理ワークフローの初期段階(ファイル登録・整理)

## 技術詳細

- アーキテクチャ: 分離された関心事、カスタムフック
- 状態管理: useBlueprintSorting、useDragAndDrop
- パフォーマンス: URL.createObjectURL、レスポンシブ表示最適化
- 統合: widgets層・shared層との連携
