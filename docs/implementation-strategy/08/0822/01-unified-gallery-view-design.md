# 汎用ギャラリービューコンポーネント設計書

## 概要

現在の `BlueprintGalleryView` をベースに、TableViewのような汎用的なギャラリーコンポーネントを作成する。

## 現状分析

### 既存のギャラリー実装パターン

#### 1. メインのBlueprint Gallery（分析対象）
- **ファイル**: `src/page-components/blueprint/home/ui/GalleryView.tsx`
- **グリッド**: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4`
- **アスペクト比**: `aspect-video`
- **カードスタイル**: shadcn/ui Card + CardContent
- **機能**: ホバー効果、バッジ、リンクナビゲーション

#### 2. その他の実装パターン
- **BlueprintGallery**: `grid-cols-2 lg:grid-cols-3 xl:grid-cols-4`, `aspect-square`
- **BlueprintUploadGallery**: `grid-cols-2 lg:grid-cols-3`, drag-and-drop
- **UploadGalleryView**: `grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4`, `aspect-[4/3]`
- **DifferenceGallery**: `grid-cols-2`, 専用機能
- **ProjectKanbanView**: 水平フレックスレイアウト

### 共通パターンの発見

1. **グリッド設定の多様性**
   - Full responsive: `1 → 2 → 3 → 4` 
   - Progressive: `1 → 2 → 3 → 4` (smブレークポイント含む)
   - Simple: `2 → 3 → 4`
   - Two-column: `1 → 2`

2. **アスペクト比の使い分け**
   - `aspect-video` (16:9): 図面画像用
   - `aspect-square` (1:1): サムネイル・アップロード用
   - `aspect-[4/3]`: ファイルプレビュー用

3. **カードスタイルのパターン**
   - shadcn/ui: `Card` + `CardContent`
   - カスタム: `border rounded-lg`

## 要件定義

### 機能要件

1. **レスポンシブグリッド制御**
   - xs, sm, md, lg, xlの各ブレークポイントでカラム数指定可能
   - 1-12カラムまで対応

2. **サムネイル表示制御**
   - サムネイル表示のオン/オフ
   - アスペクト比の選択（video, square, 4/3, カスタム）
   - 画像ソース取得関数

3. **コンテンツカスタマイズ**
   - カードコンテンツの完全カスタマイズ
   - render関数によるコンテンツ定義

4. **リンク機能**
   - カスタムリンク生成関数
   - リンク無効化オプション

5. **スタイリングオプション**
   - カードスタイル選択（shadcn vs border）
   - ホバー効果の制御

6. **状態管理**
   - ローディング状態
   - 空状態メッセージ
   - エラー状態

## 技術設計

### アーキテクチャ

```
src/shared/view/gallery-view/
├── ui/
│   ├── GalleryView.tsx        # メインコンポーネント
│   ├── GalleryCard.tsx        # 個別カードコンポーネント
│   └── index.ts
├── lib/
│   ├── useGalleryGrid.ts      # グリッド設定管理
│   ├── useGalleryCard.ts      # カード状態管理
│   └── index.ts
├── model/
│   ├── types.ts               # 型定義
│   └── index.ts
└── index.ts
```

### 型定義

```typescript
// グリッド設定
interface GalleryGridConfig {
  xs?: number;  // 1-12
  sm?: number;
  md?: number;
  lg?: number;
  xl?: number;
}

// サムネイル設定
interface ThumbnailConfig<T> {
  enabled: boolean;
  getThumbnailUrl: (item: T) => string;
  aspectRatio: 'video' | 'square' | '4/3' | string;
  placeholder?: string;
}

// カード設定
interface CardConfig<T> {
  style: 'shadcn' | 'border' | 'custom';
  enableHover: boolean;
  className?: string;
  render: (item: T) => React.ReactNode;
}

// リンク設定
interface LinkConfig<T> {
  enabled: boolean;
  getHref?: (item: T) => string;
  target?: '_blank' | '_self';
}

// 統合設定
interface GalleryViewConfig<T> {
  gridConfig: GalleryGridConfig;
  thumbnailConfig?: ThumbnailConfig<T>;
  cardConfig: CardConfig<T>;
  linkConfig?: LinkConfig<T>;
  getRowId?: (item: T) => string;
  className?: string;
}

// メインProps（シンプル化）
interface GalleryViewProps<T> {
  data: T[];
  config: GalleryViewConfig<T>;
  loading?: boolean;
}
```

### 実装方針

#### 1. グリッド設定の動的生成

```typescript
const useGalleryGrid = (config: GalleryGridConfig) => {
  return useMemo(() => {
    const classes = ['grid'];
    
    if (config.xs) classes.push(`grid-cols-${config.xs}`);
    if (config.sm) classes.push(`sm:grid-cols-${config.sm}`);
    if (config.md) classes.push(`md:grid-cols-${config.md}`);
    if (config.lg) classes.push(`lg:grid-cols-${config.lg}`);
    if (config.xl) classes.push(`xl:grid-cols-${config.xl}`);
    
    return classes.join(' ');
  }, [config]);
};
```

#### 2. メインコンポーネントの実装

```typescript
export function GalleryView<T>({ 
  data, 
  config, 
  loading = false 
}: GalleryViewProps<T>) {
  const gridClasses = useGalleryGrid(config.gridConfig);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-gray-500">読み込み中...</div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500 text-sm">
        データがありません
      </div>
    );
  }

  return (
    <div className={`overflow-auto flex-1 ${config.className || ''}`}>
      <div className={`${gridClasses} gap-6 p-1`}>
        {data.map((item) => {
          const rowId = config.getRowId?.(item) || String(Math.random());
          return (
            <GalleryCard
              key={rowId}
              item={item}
              config={config}
            />
          );
        })}
      </div>
    </div>
  );
}

interface GalleryCardProps<T> {
  item: T;
  config: GalleryViewConfig<T>;
}

function GalleryCard<T>({ item, config }: GalleryCardProps<T>) {
  const { thumbnailConfig, cardConfig, linkConfig } = config;
  const CardWrapper = linkConfig?.enabled ? Link : 'div';
  const cardProps = linkConfig?.enabled ? {
    href: linkConfig.getHref?.(item) || '#',
    target: linkConfig.target
  } : {};

  return (
    <CardWrapper {...cardProps}>
      <Card className={`overflow-hidden hover:shadow-md transition-shadow duration-200 group cursor-pointer p-0 ${
        cardConfig.enableHover ? 'hover:shadow-lg' : ''
      }`}>
        {/* サムネイル部分 */}
        {thumbnailConfig?.enabled && (
          <div className={`overflow-hidden bg-gray-100 ${getAspectRatioClass(thumbnailConfig.aspectRatio)}`}>
            <img
              src={thumbnailConfig.getThumbnailUrl(item)}
              alt=""
              className={`w-full h-full object-cover ${
                cardConfig.enableHover ? 'group-hover:scale-105 transition-transform duration-200' : ''
              }`}
            />
          </div>
        )}
        
        {/* カスタムコンテンツ */}
        {cardConfig.render(item)}
      </Card>
    </CardWrapper>
  );
}
```

## 移行計画

### Phase 1: コアコンポーネント実装
1. 基本的な型定義作成
2. GalleryView メインコンポーネント実装
3. グリッド設定ユーティリティ実装

### Phase 2: カスタマイズ機能拡張
1. サムネイル制御機能
2. カードスタイルオプション
3. リンク機能

### Phase 3: 既存実装の移行
1. BlueprintGalleryView → 汎用GalleryView移行
2. config ファイル作成（TSXでカスタマイズ）
3. 他のギャラリー実装の段階的移行

### Phase 4: 高度な機能
1. 選択機能（マルチセレクト）
2. フィルタリング統合
3. ページネーション対応

## 設定ファイル例（TSX）

```typescript
// src/page-components/blueprint/home/lib/blueprintGalleryConfig.tsx
import { Badge, CardContent } from "@/shared/shadcnui";
import { GalleryViewConfig } from "@/shared/view/gallery-view";
import { Blueprint } from "./blueprintColumns";

export const createBlueprintGalleryConfig = (): GalleryViewConfig<Blueprint> => ({
  gridConfig: {
    xs: 1,
    md: 2,
    lg: 3,
    xl: 4
  },
  
  thumbnailConfig: {
    enabled: true,
    getThumbnailUrl: (blueprint) => blueprint.image,
    aspectRatio: 'video'
  },
  
  cardConfig: {
    style: 'shadcn',
    enableHover: true,
    render: (blueprint) => (
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
    )
  },
  
  linkConfig: {
    enabled: true,
    getHref: (blueprint) => `/blueprint/${blueprint.internalNumber}/basic-information`
  },
  
  getRowId: (blueprint) => blueprint.internalNumber
});
```

## 利点

1. **統一性**: TableViewと同じアプローチで一貫したAPI
2. **柔軟性**: TSX configで完全カスタマイズ可能
3. **再利用性**: 様々なデータ型とレイアウトに対応
4. **保守性**: 共通ロジックの集約
5. **型安全性**: TypeScriptによる型チェック

## 課題と対策

### 課題1: CSS クラスの動的生成
- **問題**: Tailwind CSS のパージ機能で使用されないクラスが削除される
- **対策**: safelist設定またはプリセットクラス使用

### 課題2: パフォーマンス
- **問題**: 大量データでのレンダリング性能
- **対策**: 仮想化ライブラリとの組み合わせ

### 課題3: アクセシビリティ
- **問題**: キーボードナビゲーション、スクリーンリーダー対応
- **対策**: ARIA属性の適切な設定

## まとめ

この設計により、TableViewと同様の汎用性と柔軟性を持つGalleryViewコンポーネントが実現でき、既存の複数のギャラリー実装を統一できる。configファイルをTSXで記述することで、完全にカスタマイズ可能でありながら統一感のあるUIを提供できる。