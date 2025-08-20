# BasicDataTable

汎用的なデータテーブルコンポーネント。ソート、編集、ページネーション、固定列（sticky columns）などの機能を提供します。

## 機能

- ✅ **ソート機能**: 文字列、数値、日付のソート
- ✅ **インライン編集**: セル単位での編集機能
- ✅ **固定列**: 左右の列を固定表示
- ✅ **ページネーション**: 大量データの分割表示
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

### 2. カラム設定の作成

```typescript
import { DataTableColumn } from '@/shared/basic-data-table';

export const MY_COLUMNS: DataTableColumn<MyData>[] = [
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
];
```

### 3. コンポーネントでの使用

```typescript
import { BasicDataTable } from '@/shared/basic-data-table';
import { MY_COLUMNS } from './myColumns';

function MyTableView({ data }: { data: MyData[] }) {
  const handleUpdate = (rowId: string, field: string, value: unknown) => {
    console.log('Updated:', { rowId, field, value });
  };

  return (
    <BasicDataTable
      data={data}
      columns={MY_COLUMNS}
      onItemUpdate={handleUpdate}
      getRowId={(item) => item.id}
      emptyMessage="データがありません"
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

## ページネーション

```typescript
function MyTableWithPagination({ data }: { data: MyData[] }) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const paginationConfig = {
    enabled: true,
    currentPage,
    itemsPerPage,
    totalItems: data.length,
    onPageChange: setCurrentPage,
    showTotalItems: true,
  };

  return (
    <BasicDataTable
      data={data}
      columns={MY_COLUMNS}
      pagination={paginationConfig}
    />
  );
}
```

## 実装例

プロジェクトでの実際の使用例を以下に示します：

### Blueprint Table (`src/page-components/blueprint/home/`)

```typescript
// blueprintColumns.tsx
export const createBlueprintColumns = (): DataTableColumn<Blueprint>[] => [
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
    stickyLeft: 50, // 前の列の後に固定
    sortable: true,
    editable: true,
    locked: false,
    inputType: 'text',
    sortType: 'string',
  },
  {
    key: 'companyField',
    label: '全社項目',
    width: 128,
    stickyRight: 0, // 右端固定
    sortable: true,
    editable: true,
    locked: false,
    inputType: 'text',
    sortType: 'string',
  },
];

// BlueprintContainer.tsx
export default function BlueprintContainer() {
  return (
    <TableView 
      blueprints={filteredBlueprints}
      currentPage={currentPage}
      totalItems={filteredBlueprints.length}
      itemsPerPage={itemsPerPage}
      onPageChange={setCurrentPage}
    />
  );
}

// TableView.tsx
export function TableView({ blueprints, currentPage, totalItems, itemsPerPage, onPageChange }) {
  const columns = createBlueprintColumns();
  
  const paginationConfig = {
    enabled: true,
    currentPage,
    itemsPerPage,
    totalItems,
    onPageChange,
    showTotalItems: true,
  };

  return (
    <BasicDataTable
      data={blueprints}
      columns={columns}
      pagination={paginationConfig}
      emptyMessage="図面データがありません"
    />
  );
}
```

### Project Table (`src/page-components/project/home/`)

```typescript
// projectColumns.tsx
export const PROJECT_COLUMNS: DataTableColumn<Project>[] = [
  {
    key: 'detail',
    label: '詳細',
    width: 50,
    stickyLeft: 0, // 左端固定
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
];

// ProjectTableView.tsx
export function ProjectTableView({ projects, currentPage, totalItems, itemsPerPage, onPageChange }) {
  return (
    <BasicDataTable
      data={projects}
      columns={PROJECT_COLUMNS}
      getRowId={(project) => project.projectId}
      pagination={{
        enabled: true,
        currentPage,
        itemsPerPage,
        totalItems,
        onPageChange,
        showTotalItems: true,
      }}
      emptyMessage="プロジェクトがありません"
    />
  );
}
```

## 設計思想

- **型安全性**: TypeScriptを活用した型安全な設計
- **再利用性**: 様々なデータ構造に対応できる汎用的な設計
- **パフォーマンス**: 大量データでも快適に動作
- **カスタマイズ性**: render関数による柔軟な表示カスタマイズ
- **アクセシビリティ**: 適切なARIA属性とキーボード操作をサポート

## ディレクトリ構造

```
src/shared/basic-data-table/
├── ui/                         # UIコンポーネント
│   ├── BasicDataTable.tsx      # メインコンポーネント
│   ├── TableHeaderCell.tsx     # ヘッダーセル
│   ├── TableDataCell.tsx       # データセル
│   └── TablePagination.tsx     # ページネーション
├── lib/                        # ビジネスロジック
│   ├── useColumnResize.ts      # 列幅調整
│   ├── useTableSort.ts         # ソート機能
│   ├── useCellEdit.ts          # セル編集
│   └── useStickyColumns.ts     # 固定列
├── model/                      # 型定義
│   └── types.ts                # インターフェース定義
└── index.ts                    # エクスポート
```