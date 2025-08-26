# GalleryView

汎用的なギャラリービューコンポーネント。カスタマイズ可能な設定ファイル（TSX）を使用して、様々なデータ構造に対応できるレスポンシブなギャラリーレイアウトを提供します。

## 機能

- ✅ **レスポンシブグリッド**: xs/sm/md/lg/xlブレークポイントでカラム数制御
- ✅ **アスペクト比制御**: video/square/4:3/autoの選択またはカスタム指定
- ✅ **サムネイル表示**: オン/オフ切り替え、カスタムURL取得関数
- ✅ **ホバーオーバーレイ**: サムネイル上のインタラクティブコンテンツ
- ✅ **カスタムコンテンツ**: TSXでの完全カスタマイズ可能
- ✅ **リンク機能**: 新しいタブ/現在のタブ対応
- ✅ **自動ページネーション**: 設定による自動ページネーション管理
- ✅ **統一デザイン**: 統一されたホバー効果・パディング・空状態
- ✅ **TypeScript対応**: 完全な型安全性

## 基本的な使い方

### 1. データ型の定義

```typescript
// データの型を定義
export interface MyItem {
  id: string;
  name: string;
  imageUrl: string;
  // その他のプロパティ...
}
```

### 2. 設定ファイルの作成（TSX）

```typescript
// src/page-components/[feature]/lib/myGalleryConfig.tsx
import React from 'react';
import { GalleryViewConfig } from '@/shared/view/gallery-view';

export const createMyGalleryConfig = (): GalleryViewConfig<MyItem> => ({
  layoutConfig: {
    grid: { xs: 1, md: 2, lg: 3, xl: 4 },
    aspectRatio: 'video'  // 'video' | 'square' | '4/3' | 'auto' | string
  },
  
  itemConfig: {
    showThumbnail: true,
    getThumbnailUrl: (item) => item.imageUrl,
    contentRender: (item) => (
      <div>
        <h3 className="font-medium text-gray-900">
          {item.name}
        </h3>
      </div>
    )
  },
  
  behaviorConfig: {
    linkConfig: {
      enabled: true,
      getHref: (item) => `/item/${item.id}`,
      target: '_self'  // '_self' | '_blank'
    }
  },
  
  pagination: {
    enabled: true,
    defaultItemsPerPage: 20,
    allowedItemsPerPage: [10, 20, 50, 100],
    showItemsPerPageSelector: true,
    maxVisiblePages: 7,
  },
  
  getRowId: (item) => item.id
});
```

### 3. コンポーネントでの使用

```typescript
import React from 'react';
import { GalleryView } from '@/shared/view/gallery-view';
import { createMyGalleryConfig } from '../lib/myGalleryConfig';

interface MyGalleryViewProps {
  items: MyItem[];
  loading?: boolean;
}

export function MyGalleryView({ items, loading }: MyGalleryViewProps) {
  const galleryConfig = createMyGalleryConfig();
  
  return (
    <GalleryView
      data={items}
      config={galleryConfig}
      loading={loading}
    />
  );
}
```

## 設定オプション詳細

### GalleryViewConfig<T>

#### layoutConfig (必須)

| プロパティ | 型 | 説明 |
|------------|----|----|
| `grid.xs` | `number` | xsブレークポイント（390px未満）でのカラム数 |
| `grid.sm` | `number` | smブレークポイント（640px以上）でのカラム数 |
| `grid.md` | `number` | mdブレークポイント（768px以上）でのカラム数 |
| `grid.lg` | `number` | lgブレークポイント（1024px以上）でのカラム数 |
| `grid.xl` | `number` | xlブレークポイント（1280px以上）でのカラム数 |
| `aspectRatio` | `'video' \| 'square' \| '4/3' \| 'auto' \| string` | サムネイルのアスペクト比 |

#### itemConfig (必須)

| プロパティ | 型 | 説明 |
|------------|----|----|
| `showThumbnail` | `boolean` | サムネイル表示のオン/オフ |
| `getThumbnailUrl` | `(item: T) => string` | サムネイルURL取得関数（showThumbnail=trueの場合必須） |
| `thumbnailOverlayRender` | `(item: T) => React.ReactNode` | サムネイル上のオーバーレイコンテンツ |
| `contentRender` | `(item: T) => React.ReactNode` | カード下部のカスタムコンテンツ |

#### behaviorConfig (オプション)

| プロパティ | 型 | 説明 |
|------------|----|----|
| `linkConfig.enabled` | `boolean` | リンク機能の有効/無効 |
| `linkConfig.getHref` | `(item: T) => string` | リンクURL生成関数 |
| `linkConfig.target` | `'_self' \| '_blank'` | リンクターゲット |

#### pagination (オプション)

| プロパティ | 型 | 説明 |
|------------|----|----|
| `enabled` | `boolean` | ページネーション機能の有効/無効 |
| `defaultItemsPerPage` | `number` | デフォルト表示件数（推奨: 20） |
| `allowedItemsPerPage` | `number[]` | 選択可能な表示件数（推奨: [10, 20, 50, 100]） |
| `showItemsPerPageSelector` | `boolean` | 表示件数セレクターの表示/非表示 |
| `maxVisiblePages` | `number` | ページ番号の最大表示数（推奨: 7） |

#### その他

| プロパティ | 型 | 説明 |
|------------|----|----|
| `getRowId` | `(item: T) => string` | 一意キー生成関数（デフォルト：ランダム値） |
| `className` | `string` | 追加CSSクラス |

## 実装例

### 基本的なギャラリー

```typescript
export const createBasicGalleryConfig = (): GalleryViewConfig<Product> => ({
  layoutConfig: {
    grid: { xs: 2, lg: 4 },
    aspectRatio: 'square'
  },
  itemConfig: {
    showThumbnail: true,
    getThumbnailUrl: (product) => product.imageUrl,
    contentRender: (product) => (
      <h3 className="font-medium">{product.name}</h3>
    )
  },
  pagination: {
    enabled: true,
    defaultItemsPerPage: 20,
    allowedItemsPerPage: [10, 20, 50, 100],
    showItemsPerPageSelector: true,
    maxVisiblePages: 7,
  },
  getRowId: (product) => product.id
});
```

### インタラクティブギャラリー（ホバーボタン付き）

```typescript
export const createInteractiveGalleryConfig = (
  onEdit: (item: Item) => void,
  onDelete: (item: Item) => void
): GalleryViewConfig<Item> => ({
  layoutConfig: {
    grid: { xs: 1, md: 2 },
    aspectRatio: '4/3'
  },
  itemConfig: {
    showThumbnail: true,
    getThumbnailUrl: (item) => item.thumbnail,
    
    // ホバー時のオーバーレイボタン
    thumbnailOverlayRender: (item) => (
      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2">
        <Button onClick={() => onEdit(item)}>編集</Button>
        <Button variant="destructive" onClick={() => onDelete(item)}>削除</Button>
      </div>
    ),
    
    contentRender: (item) => (
      <div>
        <h3 className="font-medium">{item.title}</h3>
        <p className="text-sm text-gray-600">{item.description}</p>
      </div>
    )
  },
  pagination: {
    enabled: true,
    defaultItemsPerPage: 20,
    allowedItemsPerPage: [10, 20, 50, 100],
    showItemsPerPageSelector: true,
    maxVisiblePages: 7,
  },
  getRowId: (item) => item.id
});
```

### リンク付きギャラリー

```typescript
export const createLinkedGalleryConfig = (): GalleryViewConfig<Article> => ({
  layoutConfig: {
    grid: { xs: 1, md: 2, lg: 3, xl: 4 },
    aspectRatio: 'video'
  },
  itemConfig: {
    showThumbnail: true,
    getThumbnailUrl: (article) => article.coverImage,
    contentRender: (article) => (
      <>
        <h3 className="font-medium">{article.title}</h3>
        <p className="text-xs text-gray-500">{article.publishedAt}</p>
      </>
    )
  },
  behaviorConfig: {
    linkConfig: {
      enabled: true,
      getHref: (article) => `/articles/${article.slug}`,
      target: '_blank'
    }
  },
  pagination: {
    enabled: true,
    defaultItemsPerPage: 20,
    allowedItemsPerPage: [10, 20, 50, 100],
    showItemsPerPageSelector: true,
    maxVisiblePages: 7,
  },
  getRowId: (article) => article.id
});
```

## プロジェクト内の実装例

### BlueprintGalleryView
- **用途**: 図面ホーム画面での図面一覧表示
- **特徴**: 4列レスポンシブ、詳細情報表示、図面詳細ページへのリンク、**ページネーション対応**
- **ファイル**: `src/page-components/blueprint/home/lib/blueprintGalleryConfig.tsx`

### SimilarBlueprintGallery
- **用途**: 類似図面表示
- **特徴**: 2列レイアウト、ホバーオーバーレイボタン、比較機能、**ページネーション対応**
- **ファイル**: `src/page-components/blueprint/similar/lib/similarBlueprintGalleryConfig.tsx`

### ProjectBlueprintGallery
- **用途**: プロジェクト内の図面一覧
- **特徴**: コンパクト表示、ファイル名・商品名表示、**ページネーション対応**
- **ファイル**: `src/page-components/project/basic-information/lib/projectBlueprintGalleryConfig.tsx`

### QuotationBlueprintGallery
- **用途**: 見積書作成用図面一覧
- **特徴**: 見積もりボタン、ステータス表示、**ページネーション対応**
- **ファイル**: `src/page-components/project/quotation/lib/quotationBlueprintGalleryConfig.tsx`

## 統一されたデザイン仕様

### 自動適用される機能

- **ホバー効果**: サムネイル画像の1.05倍スケール + カード影効果
- **パディング**: コンテンツエリアに自動的に `p-3` が適用
- **空状態**: 「データがありません」メッセージを統一表示
- **ローディング状態**: 「読み込み中...」メッセージを統一表示
- **ページネーション**: 設定に基づく自動ページネーション表示（TableViewと統一されたUI）

### カードデザイン

- **基本スタイル**: 白背景、角丸、ボーダー、ホバー時シャドウ
- **サムネイル**: 指定アスペクト比、オーバーフロー非表示、グレー背景
- **トランジション**: 200ms duration の統一アニメーション

## 設計思想

- **カスタマイズ性重視**: TSX設定ファイルによる完全な表示制御
- **統一感確保**: 共通UIパターンとアニメーションの統一
- **型安全性**: TypeScriptによる完全な型チェック
- **再利用性**: 様々なデータ構造とレイアウトに対応
- **保守性**: 設定ファイル分離による変更の局所化
- **TableViewとの一貫性**: 統一されたConfig-based設計とページネーション体験

## ディレクトリ構造

```
src/shared/view/gallery-view/
├── ui/
│   ├── GalleryView.tsx         # メインコンポーネント（ページネーション統合）
│   ├── GalleryItem.tsx         # アイテムコンポーネント
│   ├── GalleryPagination.tsx   # ページネーションコンポーネント
│   └── index.ts
├── lib/
│   ├── useGalleryLayout.ts     # レイアウト管理フック
│   ├── usePaginatedGallery.ts  # ページネーション管理フック
│   └── index.ts
├── model/
│   ├── types.ts                # 型定義（ページネーション含む）
│   └── index.ts
├── index.ts                    # エクスポート
└── README.md                   # このファイル
```

## ページネーション機能の使用方法

### 基本的な使用方法

設定で `pagination.enabled: true` にするだけで自動的にページネーション機能が有効になります：

```typescript
export const createPaginatedGalleryConfig = (): GalleryViewConfig<Item> => ({
  // ... 他の設定
  pagination: {
    enabled: true,                          // ページネーション有効化
    defaultItemsPerPage: 20,               // デフォルト表示数
    allowedItemsPerPage: [10, 20, 50, 100], // 選択可能な表示数
    showItemsPerPageSelector: true,         // 表示数セレクター表示
    maxVisiblePages: 7,                     // ページ番号最大表示数
  },
  // ...
});
```

### ページネーション無効化

ページネーション設定を省略するか、`enabled: false` に設定すると従来通り全件表示されます：

```typescript
export const createNonPaginatedGalleryConfig = (): GalleryViewConfig<Item> => ({
  // ... 他の設定
  // paginationを省略 または
  pagination: { enabled: false },
});
```

### TableViewとの統一性

- **同じデフォルト値**: `defaultItemsPerPage: 20`
- **同じ選択肢**: `allowedItemsPerPage: [10, 20, 50, 100]`
- **同じUI**: TablePaginationと同じコンポーネントベース
- **同じ操作感**: ページ切り替えと表示数変更の統一体験