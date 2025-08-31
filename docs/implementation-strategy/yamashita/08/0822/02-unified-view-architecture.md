# 統一Viewアーキテクチャ設計書

## 概要

TableViewと同様の設計思想でGalleryViewを実装し、今後他のViewコンポーネント（ListView、CardView等）も追加できる統一的なアーキテクチャを構築する。

## TableViewの設計思想分析

### 現在のTableViewアーキテクチャ

```
src/shared/view/table-view/
├── ui/
│   ├── TableView.tsx          # メインコンポーネント
│   ├── TableHeaderCell.tsx    # セル単位のUI
│   ├── TableDataCell.tsx      # セル単位のUI
│   └── TablePagination.tsx    # 機能単位のUI
├── lib/
│   ├── useColumnResize.ts     # 機能別フック
│   ├── useTableSort.ts        # 機能別フック
│   ├── useCellEdit.ts         # 機能別フック
│   └── useStickyColumns.ts    # 機能別フック
├── model/
│   └── types.ts               # 型定義
└── index.ts                   # エクスポート
```

### TableViewの設計原則

1. **Column-Based Configuration**: カラム定義によるデータ構造
2. **Props型の明確化**: `TableViewProps<T>` でジェネリック対応
3. **機能別フック分離**: 各機能を独立したカスタムフックで管理
4. **UI コンポーネント分離**: 責任領域ごとにコンポーネント分割
5. **型安全性**: TypeScriptによる完全な型チェック

### TableViewの使用パターン

```typescript
// 1. カラム定義（TSX）
export const BLUEPRINT_COLUMNS: DataTableColumn<Blueprint>[] = [
  {
    key: 'filename',
    label: 'ファイル名',
    width: 256,
    sortable: true,
    editable: true,
    inputType: 'text',
    sortType: 'string',
  },
  // ...
];

// 2. コンポーネントでの使用
<TableView
  data={blueprints}
  columns={BLUEPRINT_COLUMNS}
  onItemUpdate={handleUpdate}
  getRowId={(item) => item.id}
  emptyMessage="データがありません"
/>
```

## 統一View設計思想

### 1. 共通設計原則

#### A. Configuration-Driven Architecture

- すべてのViewは設定オブジェクトで制御
- 設定は型安全なTSXファイルで定義
- メインProps は `data` + `config` + 最小限のオプション

#### B. 責任分離アーキテクチャ

```
src/shared/view/[view-name]/
├── ui/
│   ├── [ViewName].tsx         # メインコンポーネント
│   ├── [ViewName]Item.tsx     # アイテム単位のコンポーネント
│   └── [ViewName]Controls.tsx # 制御用コンポーネント（必要に応じて）
├── lib/
│   ├── use[ViewName]Layout.ts # レイアウト管理フック
│   ├── use[ViewName]Item.ts   # アイテム状態管理フック
│   └── use[ViewName]State.ts  # View状態管理フック
├── model/
│   └── types.ts               # 型定義
└── index.ts                   # エクスポート
```

#### C. 型安全性の確保

- すべてのViewで `ViewProps<T>` + `ViewConfig<T>` パターン
- ジェネリック型による完全な型推論
- 設定ファイルでの型チェック

### 2. GalleryView統一設計

#### アーキテクチャ構造

```
src/shared/view/gallery-view/
├── ui/
│   ├── GalleryView.tsx        # メインコンポーネント
│   ├── GalleryItem.tsx        # アイテム単位のコンポーネント
│   └── index.ts
├── lib/
│   ├── useGalleryLayout.ts    # グリッドレイアウト管理
│   ├── useGalleryItem.ts      # アイテム状態管理
│   └── index.ts
├── model/
│   ├── types.ts               # 型定義
│   └── index.ts
└── index.ts                   # エクスポート
```

#### 統一された型設計

```typescript
// 1. 基本Props構造（TableViewと統一）
interface GalleryViewProps<T> {
  data: T[];
  config: GalleryViewConfig<T>;
  loading?: boolean;
}

// 2. Config構造（機能ごとに分離）
interface GalleryViewConfig<T> {
  // レイアウト設定（TableViewのcolumnsに相当）
  layoutConfig: GalleryLayoutConfig;

  // アイテム設定（TableViewのrenderに相当）
  itemConfig: GalleryItemConfig<T>;

  // 動作設定（TableViewのinteractionに相当）
  behaviorConfig?: GalleryBehaviorConfig<T>;

  // ユーティリティ（TableViewと共通）
  getRowId?: (item: T) => string;
  className?: string;
}

// 3. 機能別Config（TableViewのColumn構造を参考）
interface GalleryLayoutConfig {
  // グリッド設定（カスタマイズ性優先）
  grid: {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };

  // アスペクト比設定（カスタマイズ性優先）
  aspectRatio: 'video' | 'square' | '4/3' | 'auto' | string;
}

interface GalleryItemConfig<T> {
  // サムネイル表示設定（カスタマイズ性優先）
  showThumbnail: boolean;
  getThumbnailUrl?: (item: T) => string;

  // サムネイル上のオーバーレイ（ホバー時のボタンなど）
  thumbnailOverlayRender?: (item: T) => React.ReactNode;

  // コンテンツレンダラー（TableViewのrenderと同じ思想）
  contentRender: (item: T) => React.ReactNode;
}

interface GalleryBehaviorConfig<T> {
  // リンク設定
  linkConfig?: {
    enabled: boolean;
    getHref: (item: T) => string;
    target?: '_blank' | '_self';
  };

  // 選択設定（将来拡張用）
  selectionConfig?: {
    enabled: boolean;
    multiple?: boolean;
    onSelect?: (items: T[]) => void;
  };
}
```

#### 使用パターン（TableViewと統一）

```typescript
// 1. Config定義（TSX）
// src/page-components/blueprint/home/lib/blueprintGalleryConfig.tsx
import { GalleryViewConfig } from "@/shared/view/gallery-view";

export const createBlueprintGalleryConfig = (): GalleryViewConfig<Blueprint> => ({
  layoutConfig: {
    grid: { xs: 1, md: 2, lg: 3, xl: 4 },
    aspectRatio: 'video'
  },

  itemConfig: {
    showThumbnail: true,
    getThumbnailUrl: (blueprint) => blueprint.image,
    contentRender: (blueprint) => (
      <Card className="overflow-hidden hover:shadow-md transition-shadow duration-200 group cursor-pointer p-0">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">
              {blueprint.orderSource}
            </p>
            <Badge variant="outline" className="text-xs">
              {blueprint.companyField}
            </Badge>
          </div>
          <h3 className="font-medium text-gray-900 mb-1">
            {blueprint.productName}
          </h3>
          <div className="flex items-center justify-between">
            <Badge variant="outline" className="font-mono text-xs">
              {blueprint.customerNumber}
            </Badge>
            <span className="text-xs text-gray-500">
              {blueprint.orderQuantity}個
            </span>
          </div>
          <div className="mt-2 text-xs text-gray-500">
            {blueprint.orderDate} 〜 {blueprint.deliveryDate}
          </div>
        </CardContent>
      </Card>
    )
  },

  behaviorConfig: {
    linkConfig: {
      enabled: true,
      getHref: (blueprint) => `/blueprint/${blueprint.internalNumber}/basic-information`
    }
  },

  getRowId: (blueprint) => blueprint.internalNumber
});

// 2. コンポーネントでの使用（TableViewと同じパターン）
import { GalleryView } from "@/shared/view/gallery-view";
import { createBlueprintGalleryConfig } from "../lib/blueprintGalleryConfig";

export function BlueprintGalleryView({ blueprints }: { blueprints: Blueprint[] }) {
  const galleryConfig = createBlueprintGalleryConfig();

  return (
    <GalleryView
      data={blueprints}
      config={galleryConfig}
    />
  );
}
```

### 3. 将来拡張のための設計

#### A. 新しいViewの追加パターン

将来的にListView、CardViewなどを追加する際は、GalleryViewと同じパターンで実装：

```typescript
// 例：ListView
interface ListViewProps<T> {
  data: T[];
  config: ListViewConfig<T>;
  loading?: boolean;
}

interface ListViewConfig<T> {
  layoutConfig: ListLayoutConfig;
  itemConfig: ListItemConfig<T>;
  behaviorConfig?: ListBehaviorConfig<T>;
  getRowId?: (item: T) => string;
  className?: string;
}
```

同じAPI設計により学習コストを削減し、一貫した開発体験を提供。

### 4. 統一された開発体験

#### A. 一貫したAPI設計

```typescript
// すべてのViewで同じパターン
<TableView data={items} config={tableConfig} />
<GalleryView data={items} config={galleryConfig} />
<ListView data={items} config={listConfig} />
<CardView data={items} config={cardConfig} />
```

#### B. 一貫したConfig作成パターン

```typescript
// すべてのConfigで同じファイル構造
src/page-components/[feature]/[page]/lib/
├── [feature]TableConfig.tsx    # テーブル用設定
├── [feature]GalleryConfig.tsx  # ギャラリー用設定
├── [feature]ListConfig.tsx     # リスト用設定
└── [feature]Columns.tsx        # 共通データ型とユーティリティ
```

#### C. 一貫したドキュメント構造

```markdown
# ViewName

## 基本的な使い方

### 1. データ型の定義

### 2. Config設定の作成

### 3. コンポーネントでの使用

## Config設定（ViewNameConfig）

### 必須プロパティ

### オプションプロパティ

## 実装例
```

## 移行計画

## 実装対象の分析

### BlueprintSimilarContainer での要件

`src/page-components/blueprint/similar/ui/BlueprintSimilarContainer.tsx` を分析したところ、以下の機能が必要：

1. **サムネイル表示**: ✅ 対応可能（`showThumbnail`, `getThumbnailUrl`）
2. **コンテンツ表示**: ✅ 対応可能（`contentRender`）
3. **ホバーオーバーレイ**: 🆕 新機能として追加（`thumbnailOverlayRender`）

#### ホバーオーバーレイの実装例

```typescript
// BlueprintSimilarContainer用のconfig例
export const createSimilarBlueprintGalleryConfig = (): GalleryViewConfig<SimilarBlueprint> => ({
  layoutConfig: {
    grid: { xs: 1, md: 2 },
    aspectRatio: '4/3'
  },

  itemConfig: {
    showThumbnail: true,
    getThumbnailUrl: (blueprint) => blueprint.imageUrl,

    // ホバー時のオーバーレイボタン
    thumbnailOverlayRender: (blueprint) => (
      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center gap-2">
        <Button
          variant="outline"
          onClick={(e) => {
            e.stopPropagation();
            handleDifferenceDetection(blueprint);
          }}
        >
          <Search className="h-4 w-4 mr-1" />
          差分検出
        </Button>
        <Button
          onClick={(e) => {
            e.stopPropagation();
            handleDetailedComparison(blueprint);
          }}
        >
          <GitCompareArrows className="h-4 w-4 mr-1" />
          詳細比較
        </Button>
      </div>
    ),

    // カード下部のコンテンツ
    contentRender: (blueprint) => (
      <div className="p-3">
        <h4 className="text-sm font-medium text-gray-900 truncate">
          {blueprint.name}
        </h4>
      </div>
    )
  }
});
```

### Phase 1: GalleryView実装

1. TableViewアーキテクチャを参考にGalleryView実装
2. `thumbnailOverlayRender` 機能を追加
3. BlueprintGalleryViewの移行とテスト
4. BlueprintSimilarContainerの移行とテスト

## 統一感 vs カスタマイズ性の方針

### 統一感を優先（削除するプロパティ）

- `cardStyle`: shadcn/ui Cardで統一
- `enableHover`: デフォルトのホバー効果で統一
- `gap`: `gap-6`で統一
- `padding`: `p-1`で統一

### カスタマイズ性を優先（残すプロパティ）

- `aspectRatio`: データの性質によって大きく異なるため
- `grid`: 画面サイズとコンテンツに依存するため
- `showThumbnail`: 機能的要件として必要
- `contentRender`: 完全カスタマイズが核心機能
- `thumbnailOverlayRender`: サムネイル上のホバー操作に必要

### Phase 2: 共通基盤整備（必要になった時に実装）

1. 共通機能の抽出は後回し
2. 基底型とユーティリティは将来対応

### Phase 3: 他View実装（必要に応じて）

1. ListView実装
2. CardView実装
3. その他必要なView追加

### Phase 4: 高度な機能統合（必要に応じて）

1. フィルタリング・ソート統合
2. ページネーション統合
3. 選択機能統合
4. 共通機能の抽象化（この段階で必要に応じて実装）

## まとめ

この統一アーキテクチャにより：

1. **一貫性**: すべてのViewが同じパターンで実装される
2. **保守性**: 共通機能の変更が全Viewに反映される
3. **学習コスト削減**: 1つのViewを理解すれば他も理解できる
4. **型安全性**: 完全な型推論とコンパイル時チェック
5. **柔軟性**: TSX Configによる完全カスタマイズ
6. **拡張性**: 新しいViewの追加が容易

TableViewの優れた設計思想を継承しつつ、より汎用的で拡張可能なアーキテクチャを構築できる。
