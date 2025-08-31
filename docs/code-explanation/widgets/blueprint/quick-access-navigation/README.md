# Quick Access Navigation Widget - 20秒キャッチアップ

## 概要

図面閲覧時のコンテキストナビゲーション。関連図面への素早いアクセスと比較機能を提供。

- これが欲しいユースケースがあるので例外的に作成しているイメージでおって欲しい
- layout.tsxで呼び出してるのは変えなあかんと思う

## ディレクトリ構成

```
widgets/blueprint/quick-access-navigation/
├── ui/
│   ├── QuickAccessControls.tsx           # 切り替えボタン
│   ├── RevisionBlueprintBar.tsx          # リビジョン図面バー
│   ├── SameProjectBlueprintBar.tsx       # 同一案件図面バー
│   └── RevisionBlueprintCompareModal.tsx # 比較モーダル
├── model/types.ts                        # 型定義
├── lib/revisionComparisonConfig.ts       # 比較設定
└── data/                                 # サンプルデータ
```

## 主要機能

- **クイックアクセス**: 2つの切り替えボタン（同一案件/リビジョン図面）
- **リビジョンバー**: 履歴図面の一覧表示、類似度表示、詳細ツールチップ
- **同一案件バー**: プロジェクト内図面一覧、ステータス表示
- **詳細比較**: モーダルでリビジョン間の差分比較

## 使用場所

図面レイアウト（`app/blueprint/[id]/layout.tsx`）のヘッダー部分
BlueprintTabNavigationと併用してオーバーレイ表示

## 技術詳細

- **状態管理**: 排他的表示制御（どちらか一方のバーのみ表示）
- **データ**: JSONファイルからサンプルデータ読み込み
- **UI**: 水平スクロール、グラデーション背景、ツールチップ
- **比較機能**: ComparisonModal（features層）を活用
