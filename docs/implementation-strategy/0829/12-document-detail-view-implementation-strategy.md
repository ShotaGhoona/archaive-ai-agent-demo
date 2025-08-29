# DocumentDetailView Implementation Strategy

## 実装概要

`src/shared/view/document-detail-view`を新規作成し、quotation/order/delivery の3カラムレイアウトを汎用化します。

## ディレクトリ構造

```
src/shared/view/document-detail-view/
├── ui/
│   ├── DocumentDetailView.tsx           # メインコンポーネント
│   ├── DocumentList.tsx                 # 左サイドバーリスト
│   ├── DocumentPreview.tsx              # 中央プレビュー
│   ├── DocumentInfoPanel.tsx            # 右側情報パネル
│   ├── panel-field-components/          # パネル内フィールドコンポーネント
│   │   ├── TextFieldComponent.tsx       # table-view/TextTypeCellベース
│   │   ├── NumberFieldComponent.tsx     # table-view/NumberTypeCellベース
│   │   ├── DateFieldComponent.tsx       # table-view/DateTypeCellベース
│   │   ├── SelectFieldComponent.tsx     # table-view/SelectTypeCellベース
│   │   ├── UserFieldComponent.tsx       # table-view/UserTypeCellベース
│   │   ├── BooleanFieldComponent.tsx    # table-view/BooleanTypeCellベース
│   │   └── index.ts
│   └── index.ts
├── lib/
│   ├── useDocumentDetailView.ts         # メイン状態管理フック
│   ├── usePanelFields.ts                # パネルフィールド管理
│   └── index.ts
├── model/
│   ├── types.ts                         # 型定義
│   └── index.ts
├── index.ts                             # エクスポート
└── README.md                            # 使用方法ドキュメント
```

## 実装戦略

### Phase 1: 基盤コンポーネント作成

1. **型定義の実装** (`model/types.ts`)
   - DocumentData interface
   - DocumentPanelColumn interface  
   - DocumentDetailViewConfig interface

2. **メインコンポーネント** (`ui/DocumentDetailView.tsx`)
   - 3カラムレイアウト（左w-60固定 + ResizableLayout）
   - ハードコーディングされたレイアウト
   - config-basedなデータバインディング

3. **サブコンポーネント**
   - DocumentList: 左サイドバー、修正日ソート内蔵
   - DocumentPreview: 中央プレビュー、アクションボタン統合
   - DocumentInfoPanel: 右側パネル、panelColumnConfigベース

### Phase 2: フィールドコンポーネント

table-view/ui/table-cell-components/ の6つのコンポーネントをベースに、パネル用にシンプル化:

```typescript
// panel-field-components/TextFieldComponent.tsx
export function TextFieldComponent({ 
  value, 
  onChange, 
  editable, 
  placeholder,
  label 
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Input
        value={value}
        onChange={onChange}
        disabled={!editable}
        placeholder={placeholder}
        className={!editable ? "bg-gray-50" : ""}
      />
    </div>
  );
}
```

### Phase 3: 段階的移行

1. **Order** → DocumentDetailView（最もシンプル）
2. **Delivery** → DocumentDetailView
3. **Quotation** → DocumentDetailView（カスタムボタンあり）

## 実装の詳細

### 固定要素（ハードコーディング）

- レイアウト: `w-60` + ResizableLayout (defaultSizes: [60, 40])
- ローディングメッセージ: "帳票を読み込み中..."
- 空状態メッセージ: "帳票がありません"
- ソート: modified_dateの降順で固定

### カスタマイズ可能要素

1. **データアクセス** (dataConfig)
   - ID/タイトル/サブタイトル/画像URL の取得関数

2. **アクションボタン** (previewActionButtonsConfig)
   - 基本ボタン: 削除・ダウンロード・印刷のon/off
   - カスタムボタン: TSXで自由定義

3. **作成機能** (createConfig)
   - 作成機能の有効/無効
   - カスタム作成ボタン（オプション）

4. **情報パネル** (panelColumnConfig)
   - TableViewと同じカラム定義方式
   - 6つのinputType対応

## 使用例

```typescript
// page-components/project/order/ui/OrderContainer.tsx
import { DocumentDetailView } from '@/shared/view/document-detail-view';
import { createOrderDetailConfig } from '../lib/orderDetailConfig';

export function OrderContainer() {
  const [orders] = useState<OrderData[]>(orderData);
  const config = createOrderDetailConfig();
  
  return (
    <DocumentDetailView
      data={orders}
      config={config}
    />
  );
}
```

## 移行によるメリット

1. **コード削減**: 3つのContainerから1つの共通実装へ
2. **保守性**: レイアウトロジックの一元化
3. **一貫性**: 統一されたUX
4. **開発効率**: 新文書タイプの高速実装
5. **型安全性**: config-basedな型チェック

## リスク管理

- **段階的移行**: 既存機能を壊さず1つずつ移行
- **後方互換**: 既存コンポーネントは移行完了まで維持
- **テスト**: 各段階でUI/UXの確認
- **シンプル設計**: オーバーエンジニアリング回避