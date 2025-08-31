# advanced-filter

データ一覧画面向けの高機能フィルタリングシステム

- FilterControlsでdateとかselectとかtypeに応じたuiを決めてる
- SimpleFilterContentにはフロントでフィルターかかる処理があるけど繋ぎ込みの際はいらんくなると思う（useAdvancedFilterがいらんくなる感じかな）
- AdvancedFilterContentは見た目だけやから繋ぎ込むときにフィルターの処理を書く
- featureでこいつを呼び出してentityのエンドポイントと合わせてwidgetやpage-componentsに繋ぎたい

## ディレクトリ構成

```
advanced-filter/
├── lib/
│   ├── filterUtils.ts               # フィルタリング処理ユーティリティ
│   └── useAdvancedFilter.ts         # メインフック（状態管理・データフィルタリング）
├── model/
│   └── types.ts                     # FilterConfig、FilterState等の型定義
└── ui/
    ├── AdvancedFilterSidebar.tsx    # メインフィルターサイドバー
    ├── AdvancedFilterContent.tsx    # 高度フィルター内容
    ├── SimpleFilterContent.tsx     # シンプルフィルター内容
    └── componetns/
        ├── FilterCard.tsx          # 個別フィルターカード
        ├── FilterControls.tsx      # フィルター操作コントロール
        ├── FilterToggleButton.tsx  # フィルター切り替えボタン
        └── LogicSwitch.tsx         # AND/OR論理切り替えスイッチ

呼び出し側の例 (src/page-components/blueprint/home):
├── lib/blueprintFilterConfig.ts      # FilterConfig設定
└── ui/BlueprintHomeContainer.tsx     # AdvancedFilterSidebar使用
```

## 概要

**2つのフィルタリングモードを提供する包括的なフィルターシステム:**

### シンプルフィルター

- **基本的なフィルタリング**: テキスト検索、選択肢、日付等の単純な条件
- **直感的なUI**: ユーザーフレンドリーなシンプルなインターフェース
- **クイックフィルター**: 一般的な検索条件への高速アクセス

### 高度フィルター

- **複数条件の組み合わせ**: AND/OR論理演算子による複雑な条件設定
- **多様な条件タイプ**: text, select, date, dateRange, number, datetime-local
- **動的フィルター追加**: 実行時でのフィルター条件の追加・削除
- **プリセット機能**: よく使用する条件セットの保存・呼び出し

### 主要機能

- **リアルタイムフィルタリング**: 条件変更時の即座な結果反映
- **状態管理**: `useAdvancedFilter`フックによる統合状態管理
- **型安全性**: TypeScriptによる完全な型サポート
- **カスタマイズ可能**: FilterConfigによる柔軟な設定
- **データバインディング**: 任意のデータ構造に対応

## 使用場面

- **図面管理**: 案件、ステータス、日付範囲等による複合検索
- **顧客管理**: 地域、業種、取引状況等の多角的フィルタリング
- **案件管理**: 進捗、担当者、期間等による詳細な絞り込み
- **帳票管理**: 種類、作成日、承認状況等の条件指定

## 技術特徴

- **パフォーマンス最適化**: useMemo/useCallbackによる不要な再計算防止
- **メモリ効率**: 大量データに対する効率的なフィルタリング処理
- **UI/UXの統一**: 全画面で一貫したフィルター体験
- **アクセシビリティ**: キーボードナビゲーション対応
  EOF < /dev/null
