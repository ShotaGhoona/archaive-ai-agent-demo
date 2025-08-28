# project-data-view

案件データの表示・管理を行うウィジェット

## ディレクトリ構成

```
project-data-view/
├── data/
│   └── project.json                       # サンプル案件データ
├── lib/
│   ├── projectCsvConfig.ts                # CSV出力設定
│   ├── projectFilterConfig.ts             # フィルター設定
│   ├── projectSearchbarConfig.ts          # 検索バー設定
│   └── projectTableConfig.tsx             # テーブル表示設定
└── ui/
    ├── CreateProjectDialog.tsx            # 新規案件作成ダイアログ
    ├── ProjectBlueprintUploadDialog.tsx   # 図面アップロードダイアログ
    ├── ProjectDataViewContainer.tsx       # メインコンテナ
    ├── ProjectDataViewPageHeader.tsx      # ページヘッダー
    ├── ProjectKanbanView.tsx              # かんばんビュー
    └── ProjectTableView.tsx               # テーブルビュー
```

## 概要

**複数画面で再利用される案件データ管理ウィジェット:**
- **2つの表示モード**: テーブル・かんばんビューの切り替え
- **高度なフィルタリング**: 案件ID、顧客名、進捗状況等の条件設定
- **新規作成機能**: ダイアログによる案件作成・図面アップロード
- **CSV出力**: フィルターされたデータの出力機能
EOF < /dev/null