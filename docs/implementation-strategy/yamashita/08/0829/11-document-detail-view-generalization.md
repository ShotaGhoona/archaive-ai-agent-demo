# Document Detail View Generalization Strategy

## 調査結果: 汎用化の可能性

### 現状分析

quotation、order、delivery の3つのコンポーネントを調査した結果、**高い共通性**が確認でき、汎用化は**十分実現可能**です。

#### 共通パターン

1. **3カラムレイアウト**: 左サイドバー(リスト) + 中央(プレビュー) + 右(情報パネル)
2. **ResizableLayout**: 中央と右側の可変幅レイアウト
3. **状態管理**: selectedItem、handleSelect、handleUpdate の統一パターン
4. **データ構造**: 全て image_url、システム共通フィールド（created_date、modified_date等）を持つ
5. **コンポーネント構成**: Container → List + Preview + InfoPanel の統一構造

## 提案: DocumentDetailView の設計

### シンプルな Config-based アプローチ

既存の TableView/GalleryView の成功パターンに従い、オーバーエンジニアリングを避けたシンプルな設計とします。

## CommonDocumentDetailConfig.tsx 構造案

```typescript
// page-components/project/[document-type]/lib/[documentType]DetailConfig.tsx

import React from 'react';
import { DocumentDetailViewConfig, DocumentPanelColumn } from '@/shared/view/document-detail-view';

export const createOrderDetailConfig = (): DocumentDetailViewConfig<OrderData> => ({
  // データアクセス設定
  dataConfig: {
    getItemId: (item) => item.order_id,
    getItemTitle: (item) => item.order_number,
    getItemSubtitle: (item) => item.project_id,
    getImageUrl: (item) => item.image_url,
  },

  // プレビューアクションボタン設定
  previewActionButtonsConfig: {
    showDeleteButton: true,
    showDownloadButton: true,
    showPrintButton: true,
    customButtonsRender: (item, onUpdate) => (
      <>
        {/* Order用は基本ボタン + カスタムボタンなし */}
      </>
    ),
  },

  createConfig: {
    enabled: false,  // Order作成機能は未実装のため無効
  },

  // パネルカラム設定（TableViewのカラム設定と同様）
  panelColumnConfig: [
    {
      key: 'order_id',
      label: '受注書ID',
      inputType: 'text',
      editable: false,
      required: true,
    },
    {
      key: 'project_id',
      label: '案件ID',
      inputType: 'text',
      editable: true,
      required: true,
    },
    {
      key: 'order_number',
      label: '受注番号',
      inputType: 'text',
      editable: true,
      required: true,
    },
    {
      key: 'order_date',
      label: '受注日',
      inputType: 'date',
      editable: true,
      required: true,
    },
    {
      key: 'customer_id',
      label: '顧客ID',
      inputType: 'text',
      editable: true,
      required: true,
    },
    {
      key: 'created_date',
      label: '作成日時',
      inputType: 'text',
      editable: false,
      required: false,
    },
    {
      key: 'created_user_id',
      label: '作成者',
      inputType: 'text',
      editable: false,
      required: false,
    },
    {
      key: 'modified_date',
      label: '更新日時',
      inputType: 'text',
      editable: false,
      required: false,
    },
    {
      key: 'modified_user_id',
      label: '更新者',
      inputType: 'text',
      editable: false,
      required: false,
    },
    {
      key: 'remarks',
      label: '備考',
      inputType: 'text',
      editable: true,
      required: false,
    },
  ],
});

export const createDeliveryDetailConfig = (): DocumentDetailViewConfig<DeliveryData> => ({
  dataConfig: {
    getItemId: (item) => item.delivery_id,
    getItemTitle: (item) => item.delivery_number,
    getItemSubtitle: (item) => item.project_id,
    getImageUrl: (item) => item.image_url,
  },

  previewActionButtonsConfig: {
    showDeleteButton: true,
    showDownloadButton: true,
    showPrintButton: true,
    customButtonsRender: (item, onUpdate) => (
      <>
        {/* Delivery用は基本ボタン + カスタムボタンなし */}
      </>
    ),
  },

  createConfig: {
    enabled: false,  // Delivery作成機能は未実装のため無効
  },

  panelColumnConfig: [
    {
      key: 'delivery_id',
      label: '納品書ID',
      inputType: 'text',
      editable: false,
      required: true,
    },
    {
      key: 'project_id',
      label: '案件ID',
      inputType: 'text',
      editable: true,
      required: true,
    },
    {
      key: 'delivery_number',
      label: '納品書番号',
      inputType: 'text',
      editable: true,
      required: true,
    },
    {
      key: 'delivery_date',
      label: '納品日',
      inputType: 'date',
      editable: true,
      required: true,
    },
    {
      key: 'delivery_address',
      label: '納品先',
      inputType: 'text',
      editable: true,
      required: true,
    },
    {
      key: 'delivery_details',
      label: '品目・数量',
      inputType: 'text',
      editable: true,
      required: false,
      placeholder: '納品内容の詳細を入力',
    },
    // ... システム共通フィールド（created_date等）も同様に定義
  ],
});
```

## Shared層の実装

### DocumentDetailView型定義

```typescript
// src/shared/view/document-detail-view/model/types.ts

export interface DocumentData {
  [key: string]: any;
  image_url: string;
  project_id: string;
  modified_date: string;
}

// TableViewのDataTableColumnと同様の設計
export interface DocumentPanelColumn<T = unknown> {
  key: keyof T | string;
  label: string;
  inputType: 'text' | 'number' | 'date' | 'select' | 'user' | 'boolean'; // table-viewと統一
  editable: boolean;
  required: boolean;
  placeholder?: string; // 入力フィールド用
  selectOptions?: { label: string; value: string }[]; // select用
}

export interface DocumentDetailViewConfig<T extends DocumentData> {
  dataConfig: {
    getItemId: (item: T) => string;
    getItemTitle: (item: T) => string;
    getItemSubtitle: (item: T) => string;
    getImageUrl: (item: T) => string;
  };

  previewActionButtonsConfig: {
    showDeleteButton: boolean;
    showDownloadButton: boolean;
    showPrintButton: boolean;
    customButtonsRender: (
      item: T,
      onUpdate: (data: Partial<T>) => void,
    ) => React.ReactNode;
  };

  createConfig: {
    enabled: boolean;
    createButtonRender?: (onCreateClick: () => void) => React.ReactNode;
  };

  // TableViewのcolumns設定と同様のパターン
  panelColumnConfig: DocumentPanelColumn<T>[];
}

export interface DocumentDetailViewProps<T extends DocumentData> {
  data: T[];
  config: DocumentDetailViewConfig<T>;
}
```

### 使用例

```typescript
// page-components/project/order/ui/OrderContainer.tsx
import { DocumentDetailView } from '@/shared/view/document-detail-view';
import { createOrderDetailConfig } from '../lib/orderDetailConfig';

export function OrderContainer() {
  const config = createOrderDetailConfig();

  return (
    <DocumentDetailView
      data={orders}
      config={config}
    />
  );
}
```

## メリット

1. **保守性向上**: 共通ロジックの一元化
2. **一貫性確保**: 統一されたUXパターン
3. **開発効率**: 新しい文書タイプの高速実装
4. **型安全性**: 設定レベルでの型チェック
5. **段階移行**: 既存コードを段階的に置き換え可能

## リスク評価

- **リスク**: 低 - 既存の成功パターン（TableView/GalleryView）の踏襲
- **複雑度**: 中 - 3カラムレイアウトという明確な構造
- **移行コスト**: 低 - 設定ファイルベースの段階的移行

## 結論

**汎用化を推奨します**。既存の shared view パターンと高い親和性があり、オーバーエンジニアリングのリスクは低く、大きなメリットが期待できます。
