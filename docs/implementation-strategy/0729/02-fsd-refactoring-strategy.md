# FSDアーキテクチャ適用リファクタリング戦略

## 概要
現在のBlueprintとProjectページの詳細フィルター機能・CSV出力機能を、FSD（Feature-Sliced Design）アーキテクチャに従ってfeature層に分離し、再利用可能なコンポーネントとして整理する。

## 現状分析

### 現在の構造
```
src/page-components/
├── blueprint/
│   ├── data/blueprint.json
│   ├── lib/blueprintColumns.tsx
│   ├── ui/
│   │   ├── BlueprintContainer.tsx
│   │   ├── BlueprintPageHeader.tsx
│   │   ├── FilterSidebar.tsx           # 🎯 フィルター機能
│   │   ├── CsvExportDialog.tsx         # 🎯 CSV出力機能
│   │   └── ...
└── project/
    ├── data/project.json
    ├── lib/projectColumns.tsx
    ├── ui/
    │   ├── ProjectContainer.tsx
    │   ├── ProjectPageHeader.tsx
    │   ├── ProjectFilterSidebar.tsx     # 🎯 フィルター機能（重複）
    │   ├── ProjectCsvExportDialog.tsx   # 🎯 CSV出力機能（重複）
    │   └── ...
```

### 問題点
1. **機能重複**: フィルター機能とCSV出力機能が各ページで重複実装
2. **FSD違反**: feature層を利用せず、page-components層で完結している
3. **再利用性の欠如**: 他のテーブル型ページで再利用困難
4. **保守性の問題**: 機能修正時に複数箇所の変更が必要

## リファクタリング戦略

### Phase 1: Features層にコア機能を移動

#### 1.1 詳細フィルター機能の分離

**新規作成ファイル:**
```
src/features/
├── advanced-filter/                    # 📁 NEW
│   ├── ui/
│   │   ├── AdvancedFilterSidebar.tsx   # 🆕 汎用フィルターサイドバー
│   │   └── FilterControls.tsx          # 🆕 フィルターコントロール群
│   ├── model/
│   │   ├── types.ts                    # 🆕 フィルター型定義
│   │   ├── useAdvancedFilter.ts        # 🆕 フィルターロジック
│   │   └── filterUtils.ts              # 🆕 フィルターユーティリティ
│   └── index.ts                        # 🆕 Public API
```

#### 1.2 CSV出力機能の分離

**新規作成ファイル:**
```
src/features/
├── csv-export/                         # 📁 NEW
│   ├── ui/
│   │   ├── CsvExportDialog.tsx         # 🆕 汎用CSV出力ダイアログ
│   │   ├── ColumnSelector.tsx          # 🆕 カラム選択コンポーネント
│   │   └── ExportPreview.tsx           # 🆕 出力プレビュー
│   ├── model/
│   │   ├── types.ts                    # 🆕 エクスポート型定義
│   │   ├── useCsvExport.ts             # 🆕 エクスポートロジック
│   │   └── exportUtils.ts              # 🆕 エクスポートユーティリティ
│   └── index.ts                        # 🆕 Public API
```

### Phase 2: Shared層の整理

#### 2.1 不要ファイルの削除

**削除ファイル:**
```
src/shared/basic-layout/
└── BlueprintSidebar.tsx                # ❌ DELETE: 仮置きファイル、不要
```

*注意: src/shared/basic-data-table/ は既存の共通テーブルコンポーネントとして十分な機能を提供しているため、追加の共通コンポーネントは作成しない*

### Phase 3: Page-components層のリファクタリング

#### 3.1 Blueprint ページの更新

**変更ファイル:**
```
src/page-components/blueprint/
├── ui/
│   ├── BlueprintContainer.tsx          # 🔄 MODIFY: features使用に変更
│   ├── BlueprintPageHeader.tsx         # 🔄 MODIFY: features使用に変更
│   ├── FilterSidebar.tsx               # ❌ DELETE: features/advanced-filterに移動
│   ├── CsvExportDialog.tsx             # ❌ DELETE: features/data-exportに移動
│   └── ...
```

#### 3.2 Project ページの更新

**変更ファイル:**
```
src/page-components/project/
├── ui/
│   ├── ProjectContainer.tsx            # 🔄 MODIFY: features使用に変更  
│   ├── ProjectPageHeader.tsx           # 🔄 MODIFY: features使用に変更
│   ├── ProjectFilterSidebar.tsx        # ❌ DELETE: features/advanced-filterに移動
│   ├── ProjectCsvExportDialog.tsx      # ❌ DELETE: features/data-exportに移動
│   └── ...
```

## 詳細設計

### Advanced Filter Feature

#### 型定義 (features/advanced-filter/model/types.ts)
```typescript
export interface FilterConfig<T = any> {
  key: keyof T;
  label: string;
  type: 'text' | 'select' | 'date' | 'dateRange' | 'number';
  options?: string[];
  placeholder?: string;
}

export interface FilterState<T = any> {
  [key: string]: any;
}

export interface AdvancedFilterProps<T = any> {
  isOpen: boolean;
  onToggle: () => void;
  filters: FilterState<T>;
  onFiltersChange: (filters: FilterState<T>) => void;
  onClearFilters: () => void;
  config: FilterConfig<T>[];
  title?: string;
}
```

#### フィルターフック (features/advanced-filter/model/useAdvancedFilter.ts)
```typescript
export function useAdvancedFilter<T>(
  data: T[],
  initialFilters: FilterState<T>,
  config: FilterConfig<T>[]
) {
  const [filters, setFilters] = useState(initialFilters);
  const [isOpen, setIsOpen] = useState(false);

  const filteredData = useMemo(() => {
    return applyFilters(data, filters, config);
  }, [data, filters, config]);

  const clearFilters = useCallback(() => {
    setFilters(initialFilters);
  }, [initialFilters]);

  return {
    filters,
    setFilters,
    filteredData,
    isOpen,
    setIsOpen,
    clearFilters,
  };
}
```

### Data Export Feature

#### 型定義 (features/data-export/model/types.ts)
```typescript
export interface ExportColumn<T = any> {
  key: keyof T;
  label: string;
  enabled: boolean;
  formatter?: (value: any, item: T) => string;
}

export interface ExportConfig {
  encoding: 'utf-8' | 'shift_jis';
  includeHeader: boolean;
  filename?: string;
}

export interface CsvExportProps<T = any> {
  data: T[];
  columns: ExportColumn<T>[];
  title?: string;
}
```

#### エクスポートフック (features/data-export/model/useCsvExport.ts)
```typescript
export function useCsvExport<T>(
  data: T[],
  initialColumns: ExportColumn<T>[]
) {
  const [columns, setColumns] = useState(initialColumns);
  const [config, setConfig] = useState<ExportConfig>({
    encoding: 'utf-8',
    includeHeader: true,
  });

  const exportCsv = useCallback(() => {
    const csvContent = generateCsvContent(data, columns, config);
    downloadCsv(csvContent, config);
  }, [data, columns, config]);

  return {
    columns,
    setColumns,
    config,
    setConfig,
    exportCsv,
  };
}
```

## ファイル変更一覧

### 🆕 新規作成 (17ファイル)

```
src/features/advanced-filter/
├── ui/
│   ├── AdvancedFilterSidebar.tsx
│   └── FilterControls.tsx
├── model/
│   ├── types.ts
│   ├── useAdvancedFilter.ts
│   └── filterUtils.ts
└── index.ts

src/features/data-export/
├── ui/
│   ├── CsvExportDialog.tsx
│   ├── ColumnSelector.tsx
│   └── ExportPreview.tsx
├── model/
│   ├── types.ts
│   ├── useCsvExport.ts
│   └── exportUtils.ts
└── index.ts

src/shared/ui/data-table/
├── DataTableToolbar.tsx
├── DataTablePagination.tsx
└── DataTableActions.tsx
```

### 🔄 変更 (4ファイル)

```
src/page-components/blueprint/ui/
├── BlueprintContainer.tsx          # features/advanced-filter使用
└── BlueprintPageHeader.tsx         # features/data-export使用

src/page-components/project/ui/
├── ProjectContainer.tsx            # features/advanced-filter使用
└── ProjectPageHeader.tsx           # features/data-export使用
```

### ❌ 削除 (4ファイル)

```
src/page-components/blueprint/ui/
├── FilterSidebar.tsx               # → features/advanced-filter/に移行
└── CsvExportDialog.tsx             # → features/data-export/に移行

src/page-components/project/ui/
├── ProjectFilterSidebar.tsx        # → features/advanced-filter/に移行
└── ProjectCsvExportDialog.tsx      # → features/data-export/に移行
```

## 実装順序

### Step 1: Features層の基盤作成
1. `features/advanced-filter/` の型定義とユーティリティ
2. `features/data-export/` の型定義とユーティリティ
3. 各featureのフック実装

### Step 2: UIコンポーネント移行
1. 既存のフィルターコンポーネントを汎用化
2. 既存のCSV出力コンポーネントを汎用化
3. Shared層の共通コンポーネント作成

### Step 3: Page-components更新
1. Blueprintページの更新
2. Projectページの更新
3. 不要ファイルの削除

### Step 4: テスト・最適化
1. 機能テスト
2. パフォーマンス確認
3. 型安全性の確認

## 期待効果

### 1. 再利用性の向上
- 他のテーブル型ページで同じフィルター・エクスポート機能を簡単に利用可能
- 設定ベースでカスタマイズ可能

### 2. 保守性の向上
- 機能修正時は1箇所のみ変更
- FSDの依存関係ルールに準拠

### 3. 型安全性の強化
- ジェネリクス活用によるタイプセーフな実装
- TypeScript型推論の最大活用

### 4. コード品質向上
- 責務分離による可読性向上
- テスタブルな設計

## 将来的な拡張

### 次期対応予定機能
1. **フィルター設定の永続化**: LocalStorageやサーバーサイドでの設定保存
2. **高度なエクスポート**: Excel、PDF出力対応
3. **フィルタープリセット**: よく使用するフィルター組み合わせの保存
4. **リアルタイムフィルタリング**: 検索入力のデバウンス処理

この戦略により、現在の機能を維持しながらFSDアーキテクチャに準拠し、将来的な拡張性と保守性を大幅に向上させることができます。