# Blueprint Similar Page - 10秒キャッチアップ

## 概要
図面表示と類似図面ギャラリーの2パネル構成ページ。類似図面を検索して比較する機能を提供。
- 組み合わせているだけ

## ディレクトリ構成
```
page-components/blueprint/similar/
├── ui/
│   ├── BlueprintSimilarContainer.tsx         # メインコンテナ
│   └── BlueprintSimilarCompareModal.tsx     # 比較モーダル
└── lib/
    ├── blueprintSimilarResizableLayoutConfig.ts  # レイアウト設定
    ├── similarBlueprintGalleryConfig.tsx         # ギャラリー設定
    └── similarComparisonConfig.ts                # 比較設定
```

## 主要機能
- **左パネル**: 図面ビューア（BlueprintViewContainer）
- **右パネル**: 類似図面ギャラリー（SimilarBlueprintGallery）
- **リサイズ可能**: ドラッグでパネル幅調整
- **比較モーダル**: 差分検出と詳細比較

## 使用場所
ルート: `/blueprint/[id]/similar`
図面詳細ワークフローの類似図面検索ステップ

## 技術詳細
- **アーキテクチャ**: ウィジェット組み合わせによる構成
- **比較機能**: 見積情報と基本情報のタブ切り替え
- **レイアウト**: 70%-30%の初期配分、調整可能