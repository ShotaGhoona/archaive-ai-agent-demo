# Blueprint Home Page - 30秒キャッチアップ

## 概要
図面管理ダッシュボード。製造会社の工学図面を管理・閲覧するメインインターフェース。

## ディレクトリ構成
```
page-components/blueprint/home/
├── ui/
│   ├── BlueprintHomeContainer.tsx           # メインコンテナ
│   ├── BlueprintPageHeader.tsx              # ページヘッダー
│   ├── BlueprintTableView.tsx               # テーブル表示
│   ├── BlueprintGalleryView.tsx             # ギャラリー表示
│   └── SimilarBlueprintSearchDialog.tsx     # 類似検索ダイアログ
├── lib/
│   ├── blueprintTableConfig.tsx             # テーブル設定
│   ├── blueprintGalleryConfig.tsx           # ギャラリー設定
│   ├── blueprintFilterConfig.ts             # フィルター設定
│   ├── blueprintSearchbarConfig.ts          # 検索バー設定
│   └── blueprintCsvConfig.ts                # CSV出力設定
└── data/
    └── blueprint.json                       # モックデータ（50件）
```

## 主要機能

### 表示モード
- **テーブルビュー**: 詳細データの表形式表示、ソート・編集可能
- **ギャラリービュー**: サムネイル画像のグリッドレイアウト

### 検索・フィルタリング  
- **検索バー**: ファイル名、発注元、製品名、社内番号、顧客番号の横断検索
- **高度なフィルター**: 
  - CADソフト（AutoCAD、SolidWorks、Inventor、CATIA V5）
  - CAMソフト（Mastercam、CAMWorks、PowerMill等）
  - 業界分野（自動車、産業機械等）
  - 日付範囲（受注日、納期）
  - 寸法・数量

### データ管理
- **インライン編集**: テーブルビューでの直接データ編集
- **CSV出力**: カスタマイズ可能な列選択による出力
- **ページネーション**: 10/20/50/100件表示切り替え

### 統合機能
- **類似図面検索**: AI活用のファイルアップロード検索（.dwg、.step、.igs、画像、PDF対応）
- **図面詳細リンク**: `/blueprint/{internalNumber}/basic-information`へ遷移

## 使用場所
ルート: `/blueprint`
製造会社の図面管理システムのメインページ

## 技術詳細
- **アーキテクチャ**: Container/Presentationalパターン
- **設定駆動**: テーブル・ギャラリー表示は設定ファイルで制御
- **状態管理**: React hooks、カスタムフック（useSearchbar、useAdvancedFilter）
- **データフロー**: 生データ → 検索フィルター → 高度フィルター → 表示
- **パフォーマンス**: スティッキーカラム、レスポンシブグリッド、効率的フィルタリング