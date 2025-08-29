# basic-information-form

図面の基本情報を編集するフォームウィジェット
- ２箇所で使うのでwidgetに移動
- 図面を入れたらOCRで処理されるデータが入るイメージ
- 2箇所とは
    - 図面詳細ページでbasic-information
    - 見積もりの際も図面の他にこの情報が見えた方がいいのでそこでも呼び出してる
- 詳しくは写真みて
- fetchする処理が必要
- 修正して保存するのでPOSTの処理も必要


## ディレクトリ構成

```
basic-information-form/
├── lib/
│   ├── basicInformationFields.ts      # フォームフィールド定義
│   └── useBasicInformationForm.ts     # フォーム状態管理フック
├── model/
│   └── types.ts                       # BasicInformationFormProps等の型定義
└── ui/
    └── BasicInformationForm.tsx       # メインフォームコンポーネント
```

## 概要

**図面詳細画面で使用する基本情報編集フォーム:**
- **15個のフィールド**: ファイル名、顧客名、製品名、社内製番、受注情報等
- **自動保存検知**: フォーム変更状態の自動追跡
- **読み取り専用制御**: ファイル名等の編集不可フィールド設定
- **バリデーション**: 入力値の検証とエラー表示

設定ファイルでフィールド定義を管理し、図面メタデータの統一的な編集機能を提供。
EOF < /dev/null