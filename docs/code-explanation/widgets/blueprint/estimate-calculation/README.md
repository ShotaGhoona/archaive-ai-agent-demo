# estimate-calculation

図面から見積もり計算を行うウィジェット
- これ要件ややこいよー
- 前提見積書作成のためには各図面を見積る必要がある
- 2箇所で利用
    - 見積「書」作成の時に図面を一気に見積もりたいからhttp://localhost:3001/project/undefined/quotation-createでもみれるようにしてる
    - 図面詳細ページでもみれるようにする
- 新規作成の場合はPOSTが必要やとおもう
- もうすでに作ってる場合はfetch

## ディレクトリ構成

```
estimate-calculation/
├── lib/
│   ├── estimateCalculationLogic.ts    # 見積もり計算ビジネスロジック
│   └── useEstimateCalculation.ts      # 見積もり状態管理フック
├── model/
│   └── types.ts                       # EstimateState、EstimateCosts等の型定義
└── ui/
    └── EstimateCalculation.tsx        # メイン見積もり計算コンポーネント
```

## 概要

**図面寸法から見積もりを計算する高機能ウィジェット:**
- **4つのコストカテゴリ**: 材料費、工程費、段取り工程費、その他費用
- **動的アイテム管理**: 各カテゴリでアイテムの追加・削除・編集
- **自動単価計算**: 時間×チャージレート等による自動コスト算出
- **個数設定**: カテゴリ別の数量設定とトータル計算
- **リアルタイム更新**: 入力変更時の即座な見積もり再計算

図面の寸法情報を受け取り、詳細な見積もり計算機能を提供する専用ウィジェット。
EOF < /dev/null