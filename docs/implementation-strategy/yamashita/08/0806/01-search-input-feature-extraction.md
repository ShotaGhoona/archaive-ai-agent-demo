# 検索機能のFeature化と保守性向上戦略

## 修正・新規作成ファイル一覧

```
📁 src/
├── 🆕 shared/
│   └── 🆕 GenericSearch/
│       ├── 🆕 lib/
│       │   └── 🆕 useGenericSearch.ts
│       ├── 🆕 model/
│       │   └── 🆕 types.ts
│       ├── 🆕 ui/
│       │   └── 🆕 SearchInput.tsx
│       └── 🆕 index.ts
├── 📝 page-components/
│   ├── 📝 blueprint/home/
│   │   ├── 🆕 lib/
│   │   │   └── 🆕 blueprintSearchbarConfig.ts
│   │   └── 📝 ui/
│   │       ├── 📝 BlueprintContainer.tsx        # 検索ロジック削除、useGenericSearch使用
│   │       └── 📝 BlueprintPageHeader.tsx       # SearchInputコンポーネント使用
│   ├── 📝 project/
│   │   ├── 🆕 lib/
│   │   │   └── 🆕 projectSearchbarConfig.ts
│   │   └── 📝 ui/
│   │       ├── 📝 ProjectContainer.tsx          # 検索ロジック削除、useGenericSearch使用
│   │       └── 📝 ProjectPageHeader.tsx         # SearchInputコンポーネント使用
│   ├── 📝 customer/
│   │   ├── 📝 contact/
│   │   │   ├── 🆕 lib/
│   │   │   │   └── 🆕 contactSearchbarConfig.ts
│   │   │   └── 📝 ui/
│   │   │       ├── 📝 CustomerContactContainer.tsx    # 検索ロジック削除、useGenericSearch使用
│   │   │       └── 📝 CustomerContactPageHeader.tsx   # SearchInputコンポーネント使用
│   │   └── 📝 home/
│   │       ├── 🆕 lib/
│   │       │   └── 🆕 customerSearchbarConfig.ts
│   │       └── 📝 ui/
│   │           ├── 📝 CustomerContainer.tsx     # 検索ロジック削除、useGenericSearch使用
│   │           └── 📝 CustomerPageHeader.tsx    # SearchInputコンポーネント使用
```

**凡例:**

- 🆕 新規作成ファイル
- 📝 修正対象ファイル

## 現状分析

### 検索ロジックの重複実装状況

現在、4つのContainer（Blueprint, Project, Contact, Customer）で同一パターンの検索ロジックが重複実装されています：

```typescript
// 各Containerで繰り返される検索ロジック
const filteredData = filteredByAdvancedFilter.filter((item) => {
  const matchesSearch =
    item.field1.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.field2.toLowerCase().includes(searchTerm.toLowerCase()) ||
    // ... 複数フィールドでのOR検索
  return matchesSearch && matchesBasicFilter;
});
```

### 検索対象フィールドの差異

- **Blueprint**: 5フィールド（filename, orderSource, productName, internalNumber, customerNumber）
- **Project**: 6フィールド（projectId, customerName, assignee, projectStatus, quotationStatus, deliveryStatus）
- **Contact**: 4フィールド（contactName, department, position, contactType）
- **Customer**: 5フィールド（customerCode, customerName, contactPerson, salesRepresentative, industry）

### 共通パターンと課題

#### 共通パターン

1. `searchTerm` 状態管理
2. `useAdvancedFilter` との連携
3. `toLowerCase().includes()` による部分一致検索
4. OR条件での複数フィールド検索

#### 保守性の課題

1. **重複コード**: 同じロジックが4箇所に分散
2. **一貫性の欠如**: フィールド追加時の修正漏れリスク
3. **テスタビリティ**: 各Containerでテストが必要
4. **拡張性**: 新しい検索機能追加時の影響範囲が広い

## 提案する解決策

### Phase 1: 設定ベース検索フックの実装【即効性: 高】

#### 1.1 汎用検索設定の型定義（簡素化版）

```typescript
// src/shared/GenericSearch/model/types.ts
export interface SearchConfig<T> {
  searchableFields: (keyof T)[];
  basicFilter?: {
    filterKey: keyof T;
    filterOptions: string[];
    defaultOption: string;
  };
}
```

#### 1.2 汎用検索フックの実装

```typescript
// src/shared/GenericSearch/lib/useGenericSearch.ts
export function useGenericSearch<T>(
  data: T[],
  searchConfig: SearchConfig<T>,
  advancedFilterConfig: FilterConfig<T>[],
) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState(
    searchConfig.basicFilter?.defaultOption || '全て',
  );

  const {
    filteredData: filteredByAdvancedFilter,
    isOpen: isFilterSidebarOpen,
    toggleSidebar,
    filters,
    setFilters,
    clearFilters,
  } = useAdvancedFilter(data, advancedFilterConfig);

  const filteredData = useMemo(() => {
    return filteredByAdvancedFilter.filter((item) => {
      // 設定ベースの検索ロジック（簡素化）
      const matchesSearch = searchConfig.searchableFields.some((fieldKey) => {
        const value = String(item[fieldKey]);
        return value.toLowerCase().includes(searchTerm.toLowerCase());
      });

      // 基本フィルターの適用
      const matchesBasicFilter = searchConfig.basicFilter
        ? selectedFilter === searchConfig.basicFilter.defaultOption ||
          item[searchConfig.basicFilter.filterKey] === selectedFilter
        : true;

      return matchesSearch && matchesBasicFilter;
    });
  }, [filteredByAdvancedFilter, searchTerm, selectedFilter, searchConfig]);

  return {
    // 検索状態
    searchTerm,
    setSearchTerm,
    selectedFilter,
    setSelectedFilter,
    filteredData,

    // Advanced Filter 状態
    isFilterSidebarOpen,
    toggleSidebar,
    filters,
    setFilters,
    clearFilters,
  };
}
```

#### 1.3 各エンティティの検索設定ファイル

```typescript
// src/page-components/blueprint/home/lib/blueprintSearchbarConfig.ts
export const BLUEPRINT_SEARCHBAR_CONFIG: SearchConfig<Blueprint> = {
  searchableFields: [
    'filename',
    'orderSource',
    'productName',
    'internalNumber',
    'customerNumber',
  ],
  basicFilter: {
    filterKey: 'companyField',
    filterOptions: ['全て', '製造業', 'IT', '建設業'],
    defaultOption: '全て',
  },
};

// src/page-components/customer/contact/lib/contactSearchbarConfig.ts
export const CONTACT_SEARCHBAR_CONFIG: SearchConfig<Contact> = {
  searchableFields: ['contactName', 'department', 'position', 'contactType'],
};
```

#### 1.4 Containerの簡素化

```typescript
// src/page-components/blueprint/home/ui/BlueprintContainer.tsx（リファクタ後）
export default function BlueprintContainer() {
  const [viewMode, setViewMode] = useState<"table" | "gallery">("table");

  // 汎用検索フックで状態とロジックを統合管理
  const {
    searchTerm,
    setSearchTerm,
    selectedFilter,
    setSelectedFilter,
    filteredData: filteredBlueprints,
    isFilterSidebarOpen,
    toggleSidebar,
    filters,
    setFilters,
    clearFilters,
  } = useGenericSearch(
    blueprintsData as Blueprint[],
    BLUEPRINT_SEARCHBAR_CONFIG,
    BLUEPRINT_FILTER_CONFIG
  );

  return (
    <div className="h-[calc(100vh-45px)] flex overflow-hidden">
      {/* 既存のJSX構造は変更なし */}
      <AdvancedFilterSidebar
        isOpen={isFilterSidebarOpen}
        onToggle={toggleSidebar}
        filters={filters}
        onFiltersChange={setFilters}
        onClearFilters={clearFilters}
        config={BLUEPRINT_FILTER_CONFIG}
      />
      {/* ... */}
    </div>
  );
}
```

### Phase 2: 検索UIの軽量共通化【実用性重視】

#### 2.1 シンプルな検索入力コンポーネント

```typescript
// src/shared/GenericSearch/ui/SearchInput.tsx
interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}

export function SearchInput({ value, onChange, placeholder }: SearchInputProps) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
      <Input
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-12 w-96 h-10 text-base" // w-96に統一
      />
    </div>
  );
}
```

#### 2.2 既存PageHeaderの簡素な修正

各PageHeaderで検索窓部分のみを`SearchInput`コンポーネントに置き換え：

```typescript
// BlueprintPageHeader.tsx（修正例）
<SearchInput
  value={searchTerm}
  onChange={setSearchTerm}
  placeholder="ファイル名、発注元、製品名、整番で検索"
/>
```

**Phase 3は削除**: Feature化は現状では過剰と判断

## 実装ロードマップ（簡素化版）

### 短期（1週間）: Phase 1実装

- **目標**: 検索ロジックの重複排除
- **作業**:
  1. `useGenericSearch` フック実装
  2. 各エンティティの検索設定作成
  3. Blueprintで動作確認
  4. 他のContainerに段階的適用

### 中期（1週間）: Phase 2実装

- **目標**: 検索UIの軽量共通化
- **作業**:
  1. `SearchInput` コンポーネント実装（w-96統一）
  2. 各PageHeaderの検索窓部分を置き換え

## 期待される効果

### 保守性の向上

- **DRY原則**: 検索ロジックの一元化（~200行 → ~50行）
- **Single Source of Truth**: 設定ベースの管理
- **修正影響の局所化**: 1箇所の修正で全体に反映

### 一貫性の確保

- **UI統一**: 同じコンポーネントによる統一感
- **動作統一**: 同じロジックによる予測可能な動作
- **設定統一**: 同じパターンによる設定管理

### 拡張性の向上

- **新エンティティ対応**: 設定ファイル追加のみで対応
- **機能拡張**: フックレベルでの機能追加
- **テスタビリティ**: 独立したフックとコンポーネントによるテスト容易性

### 開発効率の向上

- **実装時間短縮**: 新しい検索画面の実装時間を60%削減
- **バグ減少**: 共通ロジックによるバグ混入リスク軽減
- **メンテナンス工数削減**: 修正箇所の一元化

## 結論

**最小限の変更で最大の効果を目指す実用的なアプローチ**

1. **Phase 1**: 検索ロジックの設定ベース化で重複排除
2. **Phase 2**: 検索UIの軽量共通化（w-96統一）
3. **過剰な抽象化は回避**: Feature化やTemplate化は見送り

この戦略により、オーバーエンジニアリングを避けつつ、保守性を実用的なレベルで向上させることができます。

### **オーバーエンジニアリング回避のポイント**

- ❌ transform関数は不要（isActive除外により）
- ❌ Feature化は過剰（シンプルな機能のため）
- ❌ 複雑なUI分割は不要（ViewModeはBlueprintのみ）
- ✅ 設定ベースの汎用フック（適切な抽象化）
- ✅ シンプルな検索入力コンポーネント（UI統一）
