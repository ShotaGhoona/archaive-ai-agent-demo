# csv-export

データ一覧のCSVエクスポート機能を提供するユーティリティ

- データ流し込むとこだけ繋ぎ込みの対象
- エクスポートはできてるはず

## ディレクトリ構成

```
csv-export/
├── lib/
│   └── useCsvExport.ts                        # CSVエクスポート操作フック
├── model/
│   └── types.ts                               # CsvColumnConfig、CsvExportConfig等の型定義
└── ui/
    └── CsvExportDialog.tsx                    # CSVエクスポートダイアログ

呼び出し側の例 (src/page-components/blueprint/home):
├── lib/blueprintCsvConfig.ts         # CsvColumnConfig設定
└── ui/BlueprintPageHeader.tsx        # CsvExportDialog使用
```

## 概要

**高機能なCSVエクスポートダイアログコンポーネント:**

- **カラム選択**: 出力するカラムの選択・並び替え（ドラッグ&ドロップ対応）
- **エンコーディング選択**: UTF-8 / Shift_JIS の選択可能
- **プレビュー機能**: エクスポート前のデータ確認
- **ヘッダー制御**: ヘッダー行の有無を選択
- **型安全性**: TypeScriptによる完全な型サポート

`CsvExportDialog`コンポーネントと`useCsvExport`フックを組み合わせて、
データ一覧画面から直感的なCSVエクスポート機能を実現。
図面管理、顧客管理、案件管理等の各種データ出力に対応。
EOF < /dev/null
