# ConfigBased → TableView リファクタリング修正箇所

## 対象ファイル

### 1. コアファイル
```
src/shared/view/table-view/
├── ui/ConfigBasedTableView.tsx           # → TableView.tsx
├── ui/index.ts                          # export修正
├── model/types.ts                       # 型名修正
└── README.md                            # ドキュメント修正
```

### 2. 呼び出し箇所 (21ファイル)

#### Document関連 (6ファイル)
```
src/page-components/document/home/
├── specification/ui/DocumentHomeSpecificationTableView.tsx
├── quotation/ui/DocumentHomeQuotationTableView.tsx  
├── order/ui/DocumentHomeOrderTableView.tsx
├── invoice/ui/DocumentHomeInvoiceTableView.tsx
├── inspection/ui/DocumentHomeInspectionTableView.tsx
└── delivery/ui/DocumentHomeDeliveryTableView.tsx
```

#### マスタ設定関連 (3ファイル)
```
src/page-components/setting/master/
├── process-master/ui/ProcessMasterTableView.tsx
├── material-master/ui/MaterialMasterTableView.tsx
└── equipment-master/ui/EquipmentMasterContainer.tsx
```

#### 顧客関連 (2ファイル)
```
src/page-components/customer/
├── home/ui/CustomerTableView.tsx
└── contact/ui/CustomerContactTableView.tsx
```

#### プロジェクト関連 (2ファイル)
```
src/page-components/project/basic-information/ui/BlueprintTable.tsx
src/widgets/project/project-data-view/ui/ProjectTableView.tsx
```

#### その他 (3ファイル)
```
src/page-components/blueprint/home/ui/BlueprintTableView.tsx
src/widgets/setting/database-column-setting/ui/PreviewTable.tsx
src/shared/view/gallery-view/05-pagination-implementation-analysis.md
```

### 3. 既存ドキュメント
```
docs/implementation-strategy/0825/04-legacy-tableview-cleanup.md
```

## 修正内容
- ファイル名: `ConfigBasedTableView.tsx` → `TableView.tsx`
- 関数名: `ConfigBasedTableView` → `TableView`  
- 型名: `ConfigBasedTableViewProps` → `TableViewProps`
- import/export文の更新