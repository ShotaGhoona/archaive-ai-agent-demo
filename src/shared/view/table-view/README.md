# TableView

汎用的なデータテーブルコンポーネント。Config-based設計により、ソート、編集、ページネーション、固定列（sticky columns）などの機能を統一的に管理できます。

## 機能

- ✅ **Config-based設計**: 設定オブジェクトによる一元管理
- ✅ **ソート機能**: 文字列、数値、日付のソート
- ✅ **インライン編集**: セル単位での編集機能
- ✅ **固定列**: 左右の列を固定表示
- ✅ **自動ページネーション**: 設定による自動ページネーション管理
- ✅ **列幅調整**: マウスドラッグでのリサイズ
- ✅ **カスタムレンダリング**: セルの表示内容をカスタマイズ
- ✅ **TypeScript対応**: 型安全な実装

## 基本的な使い方

### 1. データ型の定義

```typescript
// データの型を定義
export interface MyData {
  id: string;
  name: string;
  status: string;
  createdAt: string;
  price: number;
}
```

### 2. Table設定ファイルの作成（推奨）

```typescript
// src/page-components/[feature]/lib/myTableConfig.tsx
import React from 'react';
import { Badge, DataTableColumn } from '@/shared';
import { TableViewConfig } from '@/shared/view/table-view';

export interface MyData {
  id: string;
  name: string;
  status: string;
  createdAt: string;
  price: number;
}

export const createMyTableConfig = (): TableViewConfig<MyData> => ({
  columns: [
    {
      key: 'name',
      label: '名前',
      width: 200,
      sortable: true,
      editable: true,
      locked: false,
      inputType: 'text',
      sortType: 'string',
    },
    {
      key: 'status',
      label: 'ステータス',
      width: 120,
      sortable: true,
      editable: true,
      locked: false,
      inputType: 'select',
      sortType: 'string',
      selectOptions: ['active', 'inactive', 'pending'],
      render: (item, value) => (
        <Badge className={getStatusColor(String(value))}>
          {String(value)}
        </Badge>
      ),
    },
    {
      key: 'price',
      label: '価格',
      width: 100,
      sortable: true,
      editable: true,
      locked: false,
      inputType: 'number',
      sortType: 'number',
    },
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

### 3. コンポーネントでの使用

```typescript
import { TableView } from '@/shared/view/table-view';
import { createMyTableConfig } from '../lib/myTableConfig';

function MyTableView({ data }: { data: MyData[] }) {
  const config = createMyTableConfig();
  
  const handleUpdate = (rowId: string, field: string, value: unknown) => {
    console.log('Updated:', { rowId, field, value });
  };

  return (
    <TableView
      data={data}
      config={config}
      onItemUpdate={handleUpdate}
      getRowId={(item) => item.id}
    />
  );
}
```

## カラム設定（DataTableColumn）

### 必須プロパティ

| プロパティ | 型 | 説明 |
|------------|----|----|
| `key` | `keyof T \| string` | データのフィールド名 |
| `label` | `string` | 列のヘッダー表示名 |
| `width` | `number` | 列の幅（px） |
| `sortable` | `boolean` | ソート可能かどうか |
| `editable` | `boolean` | 編集可能かどうか |
| `locked` | `boolean` | 編集ロックするかどうか |

### オプションプロパティ

| プロパティ | 型 | 説明 |
|------------|----|----|
| `minWidth` | `number` | 最小幅（px） |
| `inputType` | `'text' \| 'number' \| 'date' \| 'email' \| 'tel' \| 'select'` | 編集時の入力タイプ |
| `sortType` | `'string' \| 'number' \| 'date'` | ソートの種類 |
| `selectOptions` | `string[]` | select時の選択肢 |
| `render` | `(item: T, value: unknown) => React.ReactNode` | カスタムレンダリング関数 |
| `headerRender` | `(column: DataTableColumn<T>) => React.ReactNode` | ヘッダーのカスタムレンダリング |
| `stickyLeft` | `number` | 左側固定時の位置（px） |
| `stickyRight` | `number` | 右側固定時の位置（px） |

## 固定列（Sticky Columns）

左右の列を固定表示できます。

```typescript
const COLUMNS_WITH_STICKY: DataTableColumn<MyData>[] = [
  {
    key: 'actions',
    label: '操作',
    width: 80,
    stickyLeft: 0, // 左端に固定
    sortable: false,
    editable: false,
    locked: true,
    render: (item) => (
      <Button size="sm">編集</Button>
    ),
  },
  {
    key: 'name',
    label: '名前',
    width: 200,
    stickyLeft: 80, // 前の列の幅分オフセット
    sortable: true,
    editable: true,
    locked: false,
  },
  // 通常の列...
  {
    key: 'status',
    label: 'ステータス',
    width: 120,
    stickyRight: 0, // 右端に固定
    sortable: true,
    editable: true,
    locked: false,
  },
];
```

## Config-based設計の詳細

### TableViewConfig インターフェース

```typescript
export interface TableViewConfig<T = unknown> {
  columns: DataTableColumn<T>[];
  pagination?: TablePaginationConfig;
}

export interface TablePaginationConfig {
  enabled: boolean;
  defaultItemsPerPage: number;         // デフォルト: 20
  allowedItemsPerPage: number[];       // [10, 20, 50, 100]
  showItemsPerPageSelector: boolean;
  maxVisiblePages: number;
}
```

### レガシーサポート（手動ページネーション）

既存のTableViewコンポーネントも引き続きサポートされます：

```typescript
function MyTableWithManualPagination({ data }: { data: MyData[] }) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const paginationConfig = {
    enabled: true,
    currentPage,
    itemsPerPage,
    totalItems: data.length,
    onPageChange: setCurrentPage,
  };

  return (
    <TableView
      data={data}
      columns={MY_COLUMNS}
      pagination={paginationConfig}
    />
  );
}
```

## プロジェクト内実装例

### Blueprint Table (`src/page-components/blueprint/home/`)

```typescript
// lib/blueprintTableConfig.tsx
export const createBlueprintTableConfig = (): TableViewConfig<Blueprint> => ({
  columns: [
    {
      key: 'detail',
      label: '詳細',
      width: 50,
      stickyLeft: 0, // 左端固定
      sortable: false,
      editable: false,
      locked: true,
      render: (blueprint) => (
        <Link href={`/blueprint/${blueprint.internalNumber}/basic-information`}>
          <Button size="sm" variant="outline">開く</Button>
        </Link>
      ),
    },
    {
      key: 'filename',
      label: 'ファイル名',
      width: 256,
      sortable: true,
      editable: true,
      locked: false,
      inputType: 'text',
      sortType: 'string',
    },
    // ... 他のカラム
  ],
  pagination: {
    enabled: true,
    defaultItemsPerPage: 20,
    allowedItemsPerPage: [10, 20, 50, 100],
    showItemsPerPageSelector: true,
    maxVisiblePages: 7,
  },
});

// ui/BlueprintTableView.tsx
export function BlueprintTableView({ blueprints, onBlueprintUpdate }) {
  const config = createBlueprintTableConfig();
  
  return (
    <TableView
      data={blueprints}
      config={config}
      onItemUpdate={onBlueprintUpdate}
      getRowId={(blueprint) => blueprint.internalNumber}
    />
  );
}

// ui/BlueprintHomeContainer.tsx
export function BlueprintHomeContainer() {
  return (
    <div className="flex-1 flex flex-col min-h-0 px-4">
      <BlueprintTableView 
        blueprints={filteredBlueprints}
      />
    </div>
  );
}
```

### Project Table (`src/page-components/project/home/`)

```typescript
// lib/projectTableConfig.tsx
export const createProjectTableConfig = (): TableViewConfig<Project> => ({
  columns: [
    {
      key: 'detail',
      label: '詳細',
      width: 50,
      stickyLeft: 0,
      sortable: false,
      editable: false,
      locked: true,
      render: (project) => (
        <Link href={`/project/${project.projectId}/basic-information`}>
          <Button size="sm" variant="outline">開く</Button>
        </Link>
      ),
    },
    {
      key: 'projectStatus',
      label: '案件状況',
      width: 120,
      sortable: true,
      editable: true,
      locked: false,
      inputType: 'select',
      sortType: 'string',
      selectOptions: ['問い合わせ', '見積もり中', '納品'],
      render: (project, value) => (
        <Badge className={getStatusColor(String(value), 'project')}>
          {String(value)} 
        </Badge>
      ),
    },
    // ... 他のカラム
  ],
  pagination: {
    enabled: true,
    defaultItemsPerPage: 20,
    allowedItemsPerPage: [10, 20, 50, 100],
    showItemsPerPageSelector: true,
    maxVisiblePages: 7,
  },
});

// ui/ProjectTableView.tsx
export function ProjectTableView({ projects, onProjectUpdate }) {
  const config = createProjectTableConfig();

  return (
    <TableView
      data={projects}
      config={config}
      onItemUpdate={onProjectUpdate}
      getRowId={(project) => project.projectId}
    />
  );
}
```

## 設計思想

- **Config-based設計**: 設定オブジェクトによる宣言的な管理
- **型安全性**: TypeScriptを活用した型安全な設計
- **一元管理**: ページネーション設定の統一管理
- **再利用性**: 様々なデータ構造に対応できる汎用的な設計
- **パフォーマンス**: usePaginatedTableフックによる最適化
- **カスタマイズ性**: render関数による柔軟な表示カスタマイズ
- **一貫性**: GalleryViewと統一されたConfig-based設計パターン
- **アクセシビリティ**: 適切なARIA属性とキーボード操作をサポート

## 利用可能なコンポーネント

### TableView（推奨）
```typescript
import { TableView } from '@/shared/view/table-view';
```
- 設定オブジェクトベースのアプローチ
- 自動ページネーション管理
- usePaginatedTableフック内蔵

## ディレクトリ構造

```
src/shared/view/table-view/
├── ui/                            # UIコンポーネント
│   ├── TableView.tsx             # メインコンポーネント
│   ├── TableHeaderCell.tsx       # ヘッダーセル
│   ├── TableDataCell.tsx         # データセル
│   └── TablePagination.tsx       # ページネーション
├── lib/                          # ビジネスロジック
│   ├── useColumnResize.ts        # 列幅調整
│   ├── useTableSort.ts           # ソート機能
│   ├── useCellEdit.ts            # セル編集
│   ├── useStickyColumns.ts       # 固定列
│   └── usePaginatedTable.ts      # ページネーション管理
├── model/                        # 型定義
│   └── types.ts                  # インターフェース定義
└── index.ts                      # エクスポート
```

## 移行ガイド

### 既存コンポーネントの移行手順

1. **カラム定義をTableConfig形式に変更**
2. **TableViewの使用**
3. **手動ページネーション状態の削除**
4. **Containerコンポーネントの簡素化**

詳細は実装例を参照してください。