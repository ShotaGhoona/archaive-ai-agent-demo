# DocumentDetailView

汎用的な文書詳細ビューコンポーネント。3カラムレイアウト（左リスト + 中央プレビュー + 右情報パネル）で統一された文書管理UIを提供します。

## 機能

- ✅ **3カラム固定レイアウト**: 左サイドバー(w-60) + ResizableLayout(中央プレビュー + 右情報パネル)
- ✅ **Config-based設計**: 設定オブジェクトによる宣言的な管理
- ✅ **文書作成ダイアログ**: ファイルアップロード + 作成機能の統一UI
- ✅ **プレビューアクション**: 削除・ダウンロード・印刷ボタン + カスタムボタン対応
- ✅ **フォーム自動生成**: TableViewと同じカラム設定でフォーム項目を自動生成
- ✅ **TypeScript対応**: 完全な型安全性
- ✅ **統一デザイン**: Card+サムネイル付きリスト、PicturePreviewContainer使用

## 基本的な使い方

### 1. データ型の定義

```typescript
// データの型を定義（DocumentDataを継承）
export interface OrderData {
  order_id: string;
  order_number: string;
  project_id: string;
  image_url: string;
  created_date: string;
  modified_date: string;
  // その他のプロパティ...
}
```

### 2. Config設定ファイルの作成

```typescript
// src/page-components/project/order/lib/orderDetailConfig.tsx
import React from 'react';
import { DocumentDetailViewConfig } from '@/shared/view/document-detail-view';
import { OrderData } from '../model';

export const createOrderDetailConfig = (): DocumentDetailViewConfig<OrderData> => ({
  documentType: "受注書",

  // データアクセス設定（3カラムレイアウト用）
  dataConfig: {
    getItemId: (item) => item.order_id,
    getItemTitle: (item) => item.order_number,      // リストのメインタイトル
    getItemSubtitle: (item) => item.project_id,     // リストのサブタイトル
    getImageUrl: (item) => item.image_url,          // プレビュー画像
  },

  // プレビューアクションボタン設定
  previewActionButtonsConfig: {
    showDeleteButton: true,
    showDownloadButton: true,
    showPrintButton: true,
    customButtonsRender: (item, onUpdate) => (
      <>
        {/* カスタムボタンがあればここに追加 */}
      </>
    ),
  },

  createConfig: {
    enabled: false,  // 作成機能の有効/無効（ダイアログの右側制御）
  },

  // 右側情報パネルのフィールド設定（TableViewのカラム設定と同様）
  panelColumnConfig: [
    {
      key: 'order_id',
      label: '受注書ID',
      inputType: 'text',
      editable: false,
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
      key: 'remarks',
      label: '備考',
      inputType: 'text',
      editable: true,
      required: false,
      placeholder: '備考を入力してください',
    },
    // ... 他のフィールド
  ],
});
```

### 3. コンポーネントでの使用

```typescript
// src/page-components/project/order/ui/OrderContainer.tsx
import { useState } from "react";
import { DocumentDetailViewContainer } from "@/shared/view/document-detail-view";
import { OrderData } from "../model";
import { orderData } from "../data";
import { createOrderDetailConfig } from "../lib/orderDetailConfig";

export function OrderContainer() {
  const [orders] = useState<OrderData[]>(orderData);
  const config = createOrderDetailConfig();

  return (
    <DocumentDetailViewContainer
      data={orders}
      config={config}
    />
  );
}
```

## Config設定の詳細

### documentType (オプション)

文書種別名。ダイアログや表示で使用される文字列。

### dataConfig (必須)

3カラムレイアウトの表示に必要なデータアクセス関数群。

| プロパティ        | 用途                     | 例                  |
| ----------------- | ------------------------ | ------------------- |
| `getItemId`       | 選択状態管理用の一意キー | `item.order_id`     |
| `getItemTitle`    | 左リストのメインタイトル | `item.order_number` |
| `getItemSubtitle` | 左リストのサブタイトル   | `item.project_id`   |
| `getImageUrl`     | 中央プレビューの画像URL  | `item.image_url`    |

### previewActionButtonsConfig (必須)

中央プレビューエリア上部のアクションボタン設定。

| プロパティ            | 型         | 説明                             |
| --------------------- | ---------- | -------------------------------- |
| `showDeleteButton`    | `boolean`  | 削除ボタンの表示/非表示          |
| `showDownloadButton`  | `boolean`  | ダウンロードボタンの表示/非表示  |
| `showPrintButton`     | `boolean`  | 印刷ボタンの表示/非表示          |
| `customButtonsRender` | `Function` | カスタムボタンのレンダリング関数 |

### createConfig (必須)

文書作成機能の設定。

| プロパティ           | 型         | 説明                                        |
| -------------------- | ---------- | ------------------------------------------- |
| `enabled`            | `boolean`  | 作成機能の有効/無効（ダイアログ右側の制御） |
| `createButtonRender` | `Function` | カスタム作成ボタン（オプション）            |

### panelColumnConfig (必須)

右側情報パネルのフィールド設定。TableViewのカラム設定と同様。

## フィールドタイプ（inputType）

TableViewと統一された6つのタイプをサポート：

| タイプ    | 説明         | 用途例               |
| --------- | ------------ | -------------------- |
| `text`    | テキスト入力 | ID、番号、備考など   |
| `number`  | 数値入力     | 金額、個数など       |
| `date`    | 日付入力     | 受注日、納期など     |
| `select`  | 選択肢       | ステータス、種別など |
| `user`    | 従業員選択   | 担当者など           |
| `boolean` | ON/OFF       | フラグなど           |

### フィールド設定例

```typescript
{
  key: 'status',
  label: 'ステータス',
  inputType: 'select',
  editable: true,
  required: true,
  selectOptions: [
    { label: '進行中', value: 'in_progress' },
    { label: '完了', value: 'completed' },
  ],
},
{
  key: 'is_urgent',
  label: '緊急案件',
  inputType: 'boolean',
  editable: true,
  required: false,
}
```

## カスタムボタンの実装例

### QuotationView用の編集ボタン

```typescript
previewActionButtonsConfig: {
  showDeleteButton: true,
  showDownloadButton: true,
  showPrintButton: true,
  customButtonsRender: (item, onUpdate) => (
    <Button
      variant="outline"
      size="lg"
      onClick={() => console.log("編集モード")}
    >
      <Edit className="h-4 w-4" />
      編集
    </Button>
  ),
},
```

## 固定仕様

以下はすべての文書タイプで統一されており、カスタマイズできません：

- **レイアウト**: 左w-60固定 + ResizableLayout
- **ソート**: modified_date降順で固定
- **ローディング**: "帳票を読み込み中..."
- **空状態**: "帳票がありません"
- **削除確認**: AlertDialogでの統一UI
- **作成ダイアログ**: 2カラム（アップロード + 作成）の統一UI

## プロジェクト内の実装例

### 現在の実装済み文書タイプ

1. **Order（受注書）**
   - ファイル: `src/page-components/project/order/`
   - 特徴: 基本ボタンのみ、作成機能無効

2. **Delivery（納品書）**
   - ファイル: `src/page-components/project/delivery/`
   - 特徴: 基本ボタンのみ、作成機能無効

### 今後の移行予定

3. **Quotation（見積書）**
   - 特徴: 編集ボタン追加、作成機能有効
   - カスタムボタンの実装例として参照予定

## 設計思想

- **統一性**: 全文書タイプで一貫したUX
- **カスタマイズ性**: Config-basedな柔軟な設定
- **再利用性**: TableViewとの設計統一
- **保守性**: 共通ロジックの一元化
- **型安全性**: TypeScriptによる完全な型チェック
- **段階移行**: 既存コンポーネントからの無理のない移行

## ディレクトリ構造

```
src/shared/view/document-detail-view/
├── ui/
│   ├── DocumentDetailViewContainer.tsx      # メインコンテナ
│   ├── DocumentList.tsx                     # 左リスト（Card+サムネイル）
│   ├── DocumentPreview.tsx                  # 中央プレビュー（PicturePreviewContainer）
│   ├── DocumentInfoPanel.tsx                # 右情報パネル（フォーム自動生成）
│   ├── DocumentRegistrationDialog.tsx       # 作成ダイアログ（汎用）
│   ├── panel-field-components/              # フィールドコンポーネント（table-viewベース）
│   │   ├── TextFieldComponent.tsx
│   │   ├── NumberFieldComponent.tsx
│   │   ├── DateFieldComponent.tsx
│   │   ├── SelectFieldComponent.tsx
│   │   ├── BooleanFieldComponent.tsx
│   │   ├── UserFieldComponent.tsx
│   │   └── index.ts
│   └── index.ts
├── lib/
│   ├── documentDetailResizableConfig.ts     # ResizableLayout設定
│   └── index.ts
├── model/
│   ├── types.ts                            # 型定義
│   └── index.ts
├── index.ts                                # エクスポート
└── README.md                               # このファイル
```

## TableView/GalleryViewとの比較

| 機能         | TableView    | GalleryView       | DocumentDetailView      |
| ------------ | ------------ | ----------------- | ----------------------- |
| 用途         | 一覧表示     | ギャラリー表示    | 詳細表示・編集          |
| レイアウト   | テーブル     | グリッド          | 3カラム固定             |
| 設定方式     | Config-based | Config-based      | Config-based            |
| カラム設定   | columns配列  | なし              | panelColumnConfig配列   |
| カスタマイズ | render関数   | contentRender関数 | customButtonsRender関数 |
