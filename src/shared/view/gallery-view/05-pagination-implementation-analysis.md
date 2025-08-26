# Gallery-View ページネーション導入調査結果

**調査日**: 2025-08-25  
**目的**: table-viewのページネーション機能をgallery-viewに導入する実現可能性調査

## 📊 現在のアーキテクチャ比較

### Table-View（既存）
```
src/shared/view/table-view/
├── lib/
│   └── usePaginatedTable.ts      # ページネーション管理
├── model/
│   └── types.ts                  # TablePaginationConfig
├── ui/
│   ├── ConfigBasedTableView.tsx  # メイン統合
│   └── TablePagination.tsx       # UIコンポーネント
```

### Gallery-View（現在）
```
src/shared/view/gallery-view/
├── lib/
│   └── useGalleryLayout.ts       # レイアウト管理のみ
├── model/
│   └── types.ts                  # ページネーション設定なし
├── ui/
│   ├── GalleryView.tsx           # メインコンポーネント
│   └── GalleryItem.tsx           # 個別アイテム
```

## ✅ 実現可能性評価

### 🟢 高い実現可能性
1. **統一されたConfig-based設計** - 両システムとも同じ設計パターン
2. **TypeScript完全対応** - 型安全な実装が可能
3. **UIコンポーネントベース作成** - GalleryPagination.tsxをTablePagination.tsxベースで新規作成
4. **フック再利用** - usePaginatedTable.tsxの構造を流用可能

### 🟡 考慮が必要な点
1. **統一された設定値** - テーブルと同じデフォルト値（itemsPerPage: 20）で一貫性確保
2. **レスポンシブ対応** - グリッドレイアウトとページサイズの調和
3. **Loading状態** - ページ切り替え時のローディング表示

## 🎯 実装戦略

### Phase 1: 核となる機能実装
```typescript
// 1. usePaginatedGallery.ts（新規作成）
export function usePaginatedGallery<T>({
  data,
  initialItemsPerPage = 20,  // テーブルと同じデフォルト値
  initialPage = 1,
}: UsePaginatedGalleryProps<T>): UsePaginatedGalleryReturn<T>

// 2. types.ts拡張
export interface GalleryPaginationConfig {
  enabled: boolean;
  defaultItemsPerPage: number;        // デフォルト: 20
  allowedItemsPerPage: number[];      // [10, 20, 50, 100] テーブルと同じ
  showItemsPerPageSelector: boolean;
  maxVisiblePages: number;
}

export interface GalleryViewConfig<T> {
  layoutConfig: GalleryLayoutConfig;
  itemConfig: GalleryItemConfig<T>;
  behaviorConfig?: GalleryBehaviorConfig<T>;
  pagination?: GalleryPaginationConfig; // 新規追加
  getRowId?: (item: T) => string;
  className?: string;
}
```

### Phase 2: UI統合
```typescript
// GalleryView.tsx修正
export function GalleryView<T>({ data, config, loading }: GalleryViewProps<T>) {
  const paginationConfig = config.pagination || { enabled: false };
  
  const {
    currentData,
    currentPage,
    totalPages,
    itemsPerPage,
    setCurrentPage,
    setItemsPerPage,
  } = usePaginatedGallery({
    data,
    initialItemsPerPage: paginationConfig.defaultItemsPerPage || 20,
  });

  const displayData = paginationConfig.enabled ? currentData : data;

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* ギャラリーアイテム */}
      <div className="flex-1 overflow-auto">
        <div className={`${gridClasses} gap-6 p-1`}>
          {displayData.map((item) => (
            <GalleryItem key={getRowId(item)} item={item} config={config} />
          ))}
        </div>
      </div>
      
      {/* ページネーション（GalleryPagination新規作成）*/}
      {paginationConfig.enabled && (
        <div className="flex-shrink-0 px-4 py-2 bg-white border-t">
          <GalleryPagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={data.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={setItemsPerPage}
            showItemsPerPageSelector={paginationConfig.showItemsPerPageSelector}
            maxVisiblePages={paginationConfig.maxVisiblePages}
          />
        </div>
      )}
    </div>
  );
}
```

## 🛠 修正が必要なファイル

```
src/shared/view/gallery-view/
├── lib/
│   ├── usePaginatedGallery.ts           # 新規作成（usePaginatedTableベース）
│   └── index.ts                         # export追加
├── model/
│   └── types.ts                         # GalleryPaginationConfig追加
└── ui/
    ├── GalleryView.tsx                  # ページネーション統合
    ├── GalleryPagination.tsx            # 新規作成（TablePaginationベース）
    └── index.ts                         # export追加

既存コンフィグファイルの更新:
├── src/page-components/blueprint/home/lib/blueprintGalleryConfig.tsx
└── その他のgalleryConfigファイル         # pagination設定追加
```

### 各ファイルの修正内容

#### `usePaginatedGallery.ts`（新規作成）
- usePaginatedTable.tsをベースに作成
- テーブルと同じデフォルト値（itemsPerPage: 20）
- 同じインターフェースと機能を提供

#### `types.ts`（拡張）
- `GalleryPaginationConfig`インターフェース追加
- `GalleryViewConfig`に`pagination?`プロパティ追加
- 必要な型定義をtable-viewから参照

#### `GalleryPagination.tsx`（新規作成）
- TablePagination.tsxをベースに作成
- ギャラリー向けのスタイリング調整
- 同じ機能とpropsインターフェース

#### `GalleryView.tsx`（修正）
- `usePaginatedGallery`フック統合
- `displayData`ロジック追加
- `GalleryPagination`コンポーネント統合
- レイアウト調整（flex-col、ページネーション専用領域）

#### 既存コンフィグファイル（任意更新）
```typescript
// 例: blueprintGalleryConfig.tsx
export const createBlueprintGalleryConfig = (): GalleryViewConfig<Blueprint> => ({
  // ... 既存設定
  pagination: {
    enabled: true,
    defaultItemsPerPage: 20,
    allowedItemsPerPage: [10, 20, 50, 100],
    showItemsPerPageSelector: true,
    maxVisiblePages: 7,
  },
});
```

## 🎯 推奨実装アプローチ

### ✅ オーバーエンジニアリング回避策
1. **UIコンポーネントベース作成** - GalleryPagination.tsxをTablePagination.tsxベースで作成
2. **フック構造踏襲** - usePaginatedTable.tsの実証済み設計をそのまま流用
3. **段階的導入** - まず基本機能のみ実装、後から高度な機能を追加
4. **設定統一** - テーブルと同じ選択肢・デフォルト値で一貫性確保

### 🎯 統一された設定値
1. **統一デフォルト値** - itemsPerPage: 20（テーブルと同じ）
2. **統一選択肢** - [10, 20, 50, 100]でテーブルと完全一致
3. **一貫したUX** - ユーザーが両方のビューで同じ体験

## 🚀 期待される効果

1. **パフォーマンス向上** - 大量画像の分割表示でレンダリング負荷軽減
2. **UX向上** - 直感的なページナビゲーション
3. **一貫性** - table-viewと統一されたページネーション体験
4. **保守性** - 既存の実証済みアーキテクチャ流用でバグリスク最小化

## 📋 実装チェックリスト

### Phase 1: 核となる機能
- [ ] `lib/usePaginatedGallery.ts` 作成
- [ ] `model/types.ts` 拡張（GalleryPaginationConfig）
- [ ] `lib/index.ts` export追加

### Phase 2: UI統合
- [ ] `ui/GalleryPagination.tsx` 作成（TablePaginationベース）
- [ ] `ui/GalleryView.tsx` 修正
- [ ] `ui/index.ts` export追加
- [ ] レイアウト調整とスタイリング

### Phase 3: 設定更新（オプション）
- [ ] blueprintGalleryConfig.tsx ページネーション設定追加
- [ ] その他必要なgalleryConfigファイル更新

---

**結論**: table-viewとgallery-viewの統一されたアーキテクチャにより、ページネーション機能の導入は**高い実現可能性**があり、**最小限の修正**で実装可能。TablePaginationをベースとしたGalleryPagination.tsxの新規作成とフック構造の流用により、**オーバーエンジニアリングを回避**しつつテーブルと統一された体験を提供できる。