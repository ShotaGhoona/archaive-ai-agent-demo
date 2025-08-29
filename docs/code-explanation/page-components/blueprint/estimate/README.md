# Blueprint Estimate Page - 10秒キャッチアップ

## 概要
図面表示と見積計算の2パネル構成ページ。図面を確認しながら材料費・加工費を計算・管理する。
- 組み合わせているだけ

## ディレクトリ構成
```
page-components/blueprint/estimate/
├── ui/
│   └── BlueprintEstimateContainer.tsx  # メインコンテナ
└── lib/
    └── blueprintEstimateResizableLayoutConfig.ts  # レイアウト設定
```

## 主要機能
- **左パネル**: 図面ビューア（BlueprintViewContainer）
- **右パネル**: 見積計算フォーム（EstimateCalculation）
- **リサイズ可能**: ドラッグでパネル幅調整
- **保存機能**: onSaveコールバックで見積データ保存

## 使用場所
ルート: `/blueprint/[id]/estimate`
図面詳細ワークフローの見積計算ステップ

## 技術詳細
- **アーキテクチャ**: ウィジェット組み合わせによる構成
- **データ型**: EstimateInformation型で見積データ管理
- **レイアウト**: 70%-30%の初期配分、調整可能