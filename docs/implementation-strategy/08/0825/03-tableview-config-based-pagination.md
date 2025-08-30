# TableView Config-Based Pagination 実装戦略

## 概要

現在のTableViewのページネーション実装は、各Containerコンポーネントで`itemsPerPage = 20`がハードコーディングされている問題があります。GalleryViewと同様のConfig-based設計に変更し、一元管理と保守性の向上を図ります。

## 現状の問題点

### 1. ハードコーディングされた値の散在

以下のファイルで`const itemsPerPage = 20;`が重複定義されています：

- `src/page-components/blueprint/home/ui/BlueprintHomeContainer.tsx:12`
- `src/page-components/project/home/ui/ProjectContainer.tsx:12`
- `src/page-components/customer/home/ui/CustomerContainer.tsx:12`
- `src/page-components/customer/contact/ui/CustomerContactContainer.tsx:17`
- `src/page-components/setting/master/process-master/ui/ProcessMasterContainer.tsx:14`
- `src/page-components/setting/master/material-master/ui/MaterialMasterContainer.tsx:15`

### 2. 現在のアーキテクチャ

```
Container → SpecificTableView → TableView → TablePagination
```

各レイヤーで手動的にページネーション状態を管理し、propsで渡している構造です。

### 3. 未使用のusePaginatedTableフック

既に包括的なページネーション機能を提供する`usePaginatedTable`フックが存在しますが、どのコンポーネントでも使用されていません。

## 提案する改善方向

### 1. Config-Based設計への移行

GalleryViewと同様に、設定をconfig objectで管理する方式に変更します。

#### 新しいインターフェース設計

```typescript
// TableViewConfig インターフェース（新規追加）
export interface TableViewConfig<T> {
  columns: DataTableColumn<T>[];
  pagination?: {
    enabled: boolean;
    defaultItemsPerPage: number;
    allowedItemsPerPage?: number[]; // [10, 20, 50, 100]
    showItemsPerPageSelector?: boolean;
    maxVisiblePages?: number;
  };
  // 将来の拡張性を考慮した追加設定
  sorting?: {
    enabled: boolean;
    defaultSortKey?: keyof T;
    defaultSortOrder?: 'asc' | 'desc';
  };
  editing?: {
    enabled: boolean;
    mode: 'inline' | 'modal';
  };
}

// usePaginatedTableフックの活用
export interface UsePaginatedTableProps<T> {
  data: T[];
  config: TableViewConfig<T>; // configから設定を読み取る
}
```

### 2. 新しいアーキテクチャ

```
Container → TableView (with config)
```

Containerは設定オブジェクトを渡すだけで、TableView内部でページネーション状態を管理します。

## 修正が必要なファイル

### Core Files（必修）

#### 1. 型定義の拡張
**File:** `src/shared/view/table-view/model/types.ts`

```typescript
// 新しいconfig インターフェースの追加
export interface TableViewConfig<T> {
  columns: DataTableColumn<T>[];
  pagination?: TablePaginationConfig;
  sorting?: TableSortingConfig;
  editing?: TableEditingConfig;
}

export interface TablePaginationConfig {
  enabled: boolean;
  defaultItemsPerPage: number;
  allowedItemsPerPage: number[];
  showItemsPerPageSelector: boolean;
  maxVisiblePages: number;
}
```

#### 2. メインコンポーネントの修正
**File:** `src/shared/view/table-view/ui/TableView.tsx`

**変更内容:**
- `usePaginatedTable`フックの統合
- config objectからページネーション設定を読み取る
- 直接的なpagination propsの削除

**修正前:**
```typescript
interface TableViewProps<T> {
  data: T[];
  columns: DataTableColumn<T>[];
  pagination?: PaginationConfig;
  // ...
}
```

**修正後:**
```typescript
interface TableViewProps<T> {
  data: T[];
  config: TableViewConfig<T>;
  // pagination propsは削除
}
```

### Configuration Files（各機能別）

#### 3. Column設定ファイルの修正

**Files:**
- `src/page-components/blueprint/home/lib/blueprintColumns.tsx`
- `src/page-components/project/home/lib/projectColumns.tsx`
- `src/page-components/customer/home/lib/customerColumns.tsx`

**変更内容:**
列定義からconfig objectを返すファンクションに変更

**修正前:**
```typescript
export const BLUEPRINT_COLUMNS: DataTableColumn<Blueprint>[] = [
  // カラム定義
];
```

**修正後:**
```typescript
export const createBlueprintTableConfig = (): TableViewConfig<Blueprint> => ({
  columns: [
    // 既存のカラム定義
  ],
  pagination: {
    enabled: true,
    defaultItemsPerPage: 20,
    allowedItemsPerPage: [10, 20, 50, 100],
    showItemsPerPageSelector: true,
    maxVisiblePages: 7,
  },
  sorting: {
    enabled: true,
  },
  editing: {
    enabled: true,
    mode: 'inline',
  },
});
```

### Component Files（呼び出し側）

#### 4. Specific TableViewコンポーネントの簡素化

**Files:**
- `src/page-components/blueprint/home/ui/BlueprintTableView.tsx`
- `src/page-components/project/home/ui/ProjectTableView.tsx`

**変更内容:**
- manual pagination props の削除
- config objectの使用

**修正前:**
```typescript
export function BlueprintTableView({ 
  blueprints, 
  currentPage, 
  totalItems, 
  itemsPerPage, 
  onPageChange 
}) {
  const paginationConfig = {
    enabled: true,
    currentPage,
    itemsPerPage,
    totalItems,
    onPageChange,
  };

  return (
    <TableView
      data={blueprints}
      columns={BLUEPRINT_COLUMNS}
      pagination={paginationConfig}
    />
  );
}
```

**修正後:**
```typescript
export function BlueprintTableView({ blueprints }) {
  const config = createBlueprintTableConfig();
  
  return (
    <TableView
      data={blueprints}
      config={config}
    />
  );
}
```

#### 5. Containerコンポーネントの簡素化

**Files:**
- `src/page-components/blueprint/home/ui/BlueprintHomeContainer.tsx`
- `src/page-components/project/home/ui/ProjectContainer.tsx`

**変更内容:**
- manual pagination stateの削除
- props の簡素化

**修正前:**
```typescript
export default function BlueprintHomeContainer() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20; // <- 削除対象

  return (
    <BlueprintTableView
      blueprints={filteredBlueprints}
      currentPage={currentPage}
      totalItems={filteredBlueprints.length}
      itemsPerPage={itemsPerPage}
      onPageChange={setCurrentPage}
    />
  );
}
```

**修正後:**
```typescript
export default function BlueprintHomeContainer() {
  return (
    <BlueprintTableView
      blueprints={filteredBlueprints}
    />
  );
}
```

## 実装の段階的アプローチ

### Phase 1: Core Infrastructure（優先度: 高）
1. `TableViewConfig`インターフェースの定義
2. `TableView.tsx`での`usePaginatedTable`フック統合
3. 1つのfeature（例: Blueprint）での動作確認

### Phase 2: Migration（優先度: 中）
4. 各feature配下のconfig ファイル修正
5. Specific TableViewコンポーネントの修正
6. Containerコンポーネントの修正

### Phase 3: Cleanup & Enhancement（優先度: 低）
7. 不要なpagination propsの削除
8. 追加設定項目の実装（sorting, editing）
9. TypeScript型エラーの解消

## 期待される効果

### 1. 保守性の向上
- ページネーション設定の一元管理
- 設定変更時の影響範囲が明確

### 2. 一貫性の確保
- GalleryViewと統一されたConfig-based設計
- 新機能追加時の設計パターンの統一

### 3. 開発体験の改善
- Containerでの手動状態管理が不要
- より宣言的な設定方式

### 4. 将来の拡張性
- ソート、編集、フィルタリングなど他機能の統一管理
- Table feature全体の設定可能化

## 注意事項

### Breaking Changes
- 既存のTableViewコンポーネントのprops構造が変更されます
- 各featureのTableView呼び出し方法が変更されます

### 移行戦略
- 段階的移行により、機能停止を最小限に抑制
- 新旧両方式の一時的共存期間を設ける可能性

## 参考実装

GalleryViewの設計パターンを参考に、統一感のあるConfig-based設計を目指します。

- `src/shared/view/gallery-view/model/types.ts`
- `src/page-components/blueprint/home/lib/blueprintGalleryConfig.tsx`