# Comparison Modal Feature

比較モーダル機能は、2つのアイテム（図面、製品など）を並列表示して詳細比較を行うための再利用可能なfeatureです。

## 🎯 概要

- **柔軟なデータ構造対応**: JSONの様々な形式に対応
- **設定ベースの動作**: 設定ファイルで動作をカスタマイズ
- **タブ構造**: 複数の情報カテゴリを整理して表示
- **差分ハイライト**: 異なる値を視覚的に識別
- **編集・保存機能**: 左側のアイテムは編集可能

## 📁 ファイル構成

```
src/features/comparison-modal/
├── index.ts                    # パブリックAPI
├── README.md                   # このファイル
├── model/
│   ├── types.ts               # 型定義
│   └── useComparisonModal.ts  # ビジネスロジックフック
├── ui/
│   └── ComparisonModal.tsx    # メインモーダル
└── lib/
    ├── field-components.tsx   # フィールドコンポーネント
    ├── text-diff-highlighter.tsx # 差分ハイライト
    └── data-extractors.ts     # データ抽出ユーティリティ
```

## 🚀 基本的な使用方法

### 1. 設定ファイルの作成

```typescript
// myComparisonConfig.ts
import { ComparisonConfig, CommonExtractors } from '@/features/comparison-modal';

export const MY_COMPARISON_CONFIG: ComparisonConfig = {
  tabs: [
    {
      key: 'basic',
      label: '基本情報',
      fields: [
        { key: 'name', label: '名前' },
        { key: 'description', label: '説明', readOnly: true },
        { 
          key: 'price', 
          label: '価格',
          formatter: (value) => `¥${Number(value).toLocaleString()}`
        },
      ],
    },
  ],
  saveHandlers: {
    basic: (data) => {
      console.log('基本情報を保存:', data);
      // API呼び出しなど
    },
  },
  dataExtractors: {
    basic: (item) => item.basicInfo || item, // カスタム抽出ロジック
  },
};
```

### 2. コンポーネントでの使用

```tsx
// MyCompareModal.tsx
import React from "react";
import { ComparisonModal } from "@/features/comparison-modal";
import { MY_COMPARISON_CONFIG } from "./myComparisonConfig";

interface MyCompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentItem: any;
  compareItem: any;
}

export function MyCompareModal({
  isOpen,
  onClose,
  currentItem,
  compareItem
}: MyCompareModalProps) {
  return (
    <ComparisonModal
      isOpen={isOpen}
      onClose={onClose}
      currentItem={currentItem}
      comparisonItem={compareItem}
      config={MY_COMPARISON_CONFIG}
      currentItemTitle="現在のアイテム"
      comparisonItemTitle="比較対象"
      defaultTab="basic"
    />
  );
}
```

## 📋 設定リファレンス

### ComparisonConfig

| プロパティ | 型 | 説明 |
|-----------|---|-----|
| `tabs` | `ComparisonTabConfig[]` | タブの設定配列 |
| `saveHandlers?` | `Record<string, Function>` | 各タブの保存ハンドラー |
| `dataExtractors?` | `Record<string, Function>` | データ抽出関数 |

### ComparisonTabConfig

| プロパティ | 型 | 説明 |
|-----------|---|-----|
| `key` | `string` | タブの識別子 |
| `label` | `string` | タブの表示名 |
| `fields` | `ComparisonFieldConfig[]` | フィールド設定配列 |

### ComparisonFieldConfig

| プロパティ | 型 | 説明 |
|-----------|---|-----|
| `key` | `string` | フィールドのキー |
| `label` | `string` | フィールドのラベル |
| `readOnly?` | `boolean` | 読み取り専用フィールドか |
| `formatter?` | `(value) => string` | 値の表示フォーマット関数 |

## 🔧 データ抽出パターン

### 1. CommonExtractors（よく使われるパターン）

```typescript
import { CommonExtractors } from '@/features/comparison-modal';

const config = {
  dataExtractors: {
    basic: CommonExtractors.basicInformation,      // item.basicInformation
    estimate: CommonExtractors.estimateInformation, // item.estimateInformation
    meta: CommonExtractors.blueprintMeta,          // フラットなメタ情報
  }
};
```

### 2. カスタム抽出関数

```typescript
import { DataExtractors } from '@/features/comparison-modal';

const config = {
  dataExtractors: {
    // ネストしたデータ抽出
    details: (item) => DataExtractors.extractNestedData(item, 'details'),
    
    // 複数の情報をマージ
    merged: (item) => DataExtractors.extractMergedData(item, ['info1', 'info2']),
    
    // 完全カスタム
    custom: (item) => ({
      displayName: item.name || item.title,
      formattedDate: new Date(item.createdAt).toLocaleDateString(),
    }),
  }
};
```

## 💡 使用例

### 図面比較の例

```typescript
// blueprintComparisonConfig.ts
export const BLUEPRINT_COMPARISON_CONFIG: ComparisonConfig = {
  tabs: [
    {
      key: 'estimate',
      label: '見積もり情報',
      fields: [
        { key: 'materialCost', label: '材料費' },
        { key: 'processingCost', label: '加工費' },
        { 
          key: 'totalCost', 
          label: '総コスト',
          formatter: (value) => `¥${Number(value).toLocaleString()}`
        },
      ],
    },
    {
      key: 'basic',
      label: '基本情報',
      fields: [
        { key: 'fileName', label: 'ファイル名', readOnly: true },
        { key: 'customerName', label: '顧客名' },
        { key: 'deliveryDate', label: '納品日' },
      ],
    },
  ],
  saveHandlers: {
    estimate: (data) => saveEstimateInfo(data),
    basic: (data) => saveBasicInfo(data),
  },
  dataExtractors: {
    estimate: CommonExtractors.estimateInformation,
    basic: CommonExtractors.basicInformation,
  },
};
```

## 🎨 カスタマイズポイント

### 1. フィールドフォーマッター

```typescript
{
  key: 'price',
  label: '価格',
  formatter: (value) => {
    const num = Number(value);
    return isNaN(num) ? '-' : `¥${num.toLocaleString()}`;
  }
}
```

### 2. 条件付き読み取り専用

```typescript
{
  key: 'status',
  label: 'ステータス',
  readOnly: true, // 常に読み取り専用
}
```

### 3. カスタム保存処理

```typescript
saveHandlers: {
  myTab: async (data) => {
    try {
      await api.update(data);
      showSuccessMessage('保存しました');
    } catch (error) {
      showErrorMessage('保存に失敗しました');
    }
  },
}
```

## 🚨 注意事項

1. **型安全性**: `ComparisonData`は`Record<string, unknown>`型のため、実行時のデータ型チェックが重要
2. **パフォーマンス**: 大量のフィールドがある場合は、適切なタブ分割を推奨
3. **データ形式**: 多様なJSON形式に対応していますが、設定ファイルでの適切なマッピングが必要

## 🔗 関連ファイル

- [使用例: RevisionBlueprintCompareModal](../../widgets/blueprint-detail-layout/ui/RevisionBlueprintCompareModal.tsx)
- [設定例: revisionComparisonConfig.ts](../../widgets/blueprint-detail-layout/lib/revisionComparisonConfig.ts)
- [使用例: SimilarBlueprintCompareModal](../../page-components/blueprint/similar/ui/SimilarBlueprintCompareModal.tsx)
- [設定例: similarComparisonConfig.ts](../../page-components/blueprint/similar/lib/similarComparisonConfig.ts)