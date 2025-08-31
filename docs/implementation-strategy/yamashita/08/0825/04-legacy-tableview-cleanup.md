# TableView 技術負債クリーンアップ戦略

**作成日**: 2025-08-25  
**目的**: 後方互換性エクスポートの削除とレガシーTableView使用箇所の完全移行

## 🎯 目標

1. **技術負債の完全削除**: `BLUEPRINT_COLUMNS`等の後方互換エクスポートを削除
2. **設計統一**: 全てのTableをConfig-based設計に統一
3. **コード品質向上**: レガシーパターンの完全排除

## 📊 現状調査結果

### 🔴 高優先度（修正必須）

#### 1. `src/page-components/project/basic-information/ui/BlueprintTable.tsx`

**問題**:

- 存在しない`blueprintColumnsConfig`ファイルからのインポート
- レガシー`TableView`使用
- 旧式のカラム作成パターン

```typescript
// 現在（エラー）
import { createBlueprintColumns } from '@/page-components/blueprint/home/lib/blueprintColumnsConfig';
import { TableView } from '@/shared';
const blueprintColumns = createBlueprintColumns();

// 修正後
import { ConfigBasedTableView } from '@/shared';
import {
  Blueprint,
  createBlueprintTableConfig,
} from '@/page-components/blueprint/home/lib/blueprintTableConfig';
const config = createBlueprintTableConfig();
```

#### 2. `src/page-components/setting/master/equipment-master/ui/EquipmentMasterContainer.tsx`

**問題**:

- レガシー`TableView`使用
- データファイルから直接カラム配列をインポート
- ページネーション設定なし

```typescript
// 現在
import { TableView } from "@/shared";
import { columns } from "../data";
<TableView data={filteredData} columns={columns} />

// 修正後
import { ConfigBasedTableView } from "@/shared";
import { createEquipmentMasterTableConfig } from "../lib/equipmentMasterTableConfig";
const config = createEquipmentMasterTableConfig();
<ConfigBasedTableView data={filteredData} config={config} />
```

#### 3. 不足ファイル: `equipment-master/lib/equipmentMasterTableConfig.tsx`

**作成が必要**: Equipment Master用のTableConfig実装

### 🟡 中優先度

#### 4. `src/widgets/database-column-setting/ui/PreviewTable.tsx`

**問題**:

- レガシー`TableView`使用（プレビュー機能）
- 手動カラム定義作成

#### 5. 後方互換性エクスポートの削除

**対象ファイル**:

```
src/page-components/blueprint/home/lib/blueprintTableConfig.tsx:195
src/page-components/project/home/lib/projectTableConfig.tsx:252
src/page-components/customer/home/lib/customerTableConfig.tsx:192
src/page-components/customer/contact/lib/contactTableConfig.tsx:210
src/page-components/setting/master/process-master/lib/processMasterTableConfig.tsx:144
src/page-components/setting/master/material-master/lib/materialMasterTableConfig.tsx:160
```

削除対象:

```typescript
// これらの後方互換エクスポートを削除
export const BLUEPRINT_COLUMNS = createBlueprintTableConfig().columns;
export const PROJECT_COLUMNS = createProjectTableConfig().columns;
export const CUSTOMER_COLUMNS = createCustomerTableConfig().columns;
// etc...
```

## 🛠 実装フェーズ

### Phase 1: 緊急修正（高優先度）

1. **BlueprintTable.tsx修正**
   - インポート修正
   - ConfigBasedTableViewへの移行
2. **EquipmentMasterContainer.tsx修正**
   - ConfigBasedTableViewへの移行
   - equipmentMasterTableConfig.tsx作成

3. **動作確認とテスト**

### Phase 2: プレビュー機能対応（中優先度）

4. **PreviewTable.tsx修正**
   - 動的なTableConfig生成への対応
   - ConfigBasedTableView対応

### Phase 3: クリーンアップ（技術負債削除）

5. **後方互換エクスポート削除**
   - 全TableConfigファイルから`XXXXX_COLUMNS`エクスポートを削除
   - 関連する型定義クリーンアップ

6. **最終動作確認**
   - 全機能のテスト
   - TypeScriptエラー確認

## 📝 各修正の詳細

### 1. BlueprintTable.tsx 修正

```typescript
// Before
"use client";
import { TableView } from "@/shared";
import { Blueprint } from "@/page-components";
import { createBlueprintColumnsConfig } from "@/page-components/blueprint/home/lib/blueprintColumnsConfig";

interface BlueprintTableProps {
  blueprints: Blueprint[];
}

export function BlueprintTable({ blueprints }: BlueprintTableProps) {
  const blueprintColumns = createBlueprintColumns();

  return (
    <div className="bg-white flex flex-col">
      <TableView
        data={blueprints}
        columns={blueprintColumns}
        getRowId={(blueprint) => blueprint.internalNumber}
      />
    </div>
  );
}

// After
"use client";
import { ConfigBasedTableView } from "@/shared";
import { Blueprint, createBlueprintTableConfig } from "@/page-components/blueprint/home/lib/blueprintTableConfig";

interface BlueprintTableProps {
  blueprints: Blueprint[];
}

export function BlueprintTable({ blueprints }: BlueprintTableProps) {
  const config = createBlueprintTableConfig();

  return (
    <div className="bg-white flex flex-col">
      <ConfigBasedTableView
        data={blueprints}
        config={config}
        getRowId={(blueprint) => blueprint.internalNumber}
      />
    </div>
  );
}
```

### 2. equipmentMasterTableConfig.tsx 作成

```typescript
import React from 'react';
import { DataTableColumn } from '@/shared';
import { TableViewConfig } from '@/shared/view/table-view';

export interface EquipmentMaster {
  id: string;
  equipmentName: string;
  equipmentType: string;
  model: string;
  manufacturer: string;
  serialNumber: string;
  purchaseDate: string;
  status: 'active' | 'inactive' | 'maintenance';
  location: string;
  remarks: string;
}

export const createEquipmentMasterTableConfig =
  (): TableViewConfig<EquipmentMaster> => ({
    columns: [
      {
        key: 'id',
        label: 'ID',
        width: 80,
        sortable: true,
        editable: false,
        locked: true,
        sortType: 'string',
      },
      {
        key: 'equipmentName',
        label: '設備名',
        width: 200,
        sortable: true,
        editable: true,
        locked: false,
        inputType: 'text',
        sortType: 'string',
      },
      // ... 他のカラム定義
    ],
    pagination: {
      enabled: true,
      defaultItemsPerPage: 20,
      allowedItemsPerPage: [10, 20, 50, 100],
      showItemsPerPageSelector: true,
      maxVisiblePages: 7,
    },
  });
```

### 3. EquipmentMasterContainer.tsx 修正

```typescript
// Before
import { TableView } from "@/shared";
import { columns } from "../data";

<TableView
  data={filteredData}
  columns={columns}
  onItemUpdate={handleItemUpdate}
  getRowId={(item) => item.id}
/>

// After
import { ConfigBasedTableView } from "@/shared";
import { createEquipmentMasterTableConfig } from "../lib/equipmentMasterTableConfig";

const config = createEquipmentMasterTableConfig();

<ConfigBasedTableView
  data={filteredData}
  config={config}
  onItemUpdate={handleItemUpdate}
  getRowId={(item) => item.id}
/>
```

## ✅ 成功指標

1. **コンパイルエラー0件**: TypeScriptエラーが存在しない
2. **レガシーパターン0件**: `TableView`の直接使用が存在しない
3. **技術負債0件**: 後方互換エクスポートが存在しない
4. **機能動作**: 全テーブル機能が正常動作
5. **設計統一**: 全TableがConfig-based設計に統一

## 🎯 期待される効果

1. **保守性向上**: 一貫したConfig-based設計
2. **開発効率向上**: 迷いのない実装パターン
3. **将来拡張性**: 新機能追加時の制約排除
4. **コード品質**: 技術負債の完全排除

## ⚠ 注意事項

1. **段階的実行**: Phase順での実装で影響を最小化
2. **テスト重要**: 各Phase後の動作確認必須
3. **破壊的変更**: 後方互換性を完全に断つ変更のため注意深く実行
4. **依存関係**: 他のコンポーネントへの影響確認

---

**実装担当**: Claude Code  
**レビュー**: 開発チーム  
**完了予定**: Phase 1-3 順次実行
