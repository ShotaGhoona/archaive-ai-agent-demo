# Blueprint Basic Information Page - 10秒キャッチアップ

## 概要
図面表示と基本情報編集の2パネル構成ページ。リサイズ可能なレイアウトで図面閲覧と情報管理を同時に行う。
- 二つを呼び出してるだけ

## ディレクトリ構成
```
page-components/blueprint/basic-information/
├── ui/
│   └── BlueprintBasicInformationContainer.tsx  # メインコンテナ
└── lib/
    └── blueprintBasicInformationResizableLayoutConfig.ts  # レイアウト設定
```

## 主要機能
- **左パネル**: 図面ビューア（BlueprintViewContainer）
- **右パネル**: 基本情報フォーム（BasicInformationForm）
- **リサイズ可能**: ドラッグでパネル幅調整
- **設定駆動**: 外部設定でレイアウト制御

## 使用場所
ルート: `/blueprint/[id]/basic-information`
図面詳細ワークフローの一部として使用

## 技術詳細
- **アーキテクチャ**: ウィジェット組み合わせによる構成
- **状態管理**: 各ウィジェットの個別状態管理
- **データフロー**: 図面データをウィジェットに配布