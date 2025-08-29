# gallery-view

Config-based設計による高度カスタマイズ可能なギャラリービューコンポーネント
- Configファイルの中で色々カスタマイズできるようにしてる
- uiとして統一感が出るようにある程度肩は決めた上でcontentRender、hoverOverlayRenderはTSXでカスタムできる
- データを流し込む部分で繋ぎ込みが必要
- ページネーションも考慮が必要

## ディレクトリ構成

```
gallery-view/
├── README.md                        # 詳細なドキュメント
├── lib/
│   ├── useGalleryLayout.ts         # レスポンシブグリッドレイアウト管理
│   └── usePaginatedGallery.ts      # ページネーション管理
├── model/
│   └── types.ts                    # GalleryViewConfig、GalleryLayoutConfig等の型定義
└── ui/
    ├── GalleryView.tsx             # メインギャラリーコンポーネント
    ├── GalleryItem.tsx             # 個別アイテムコンポーネント
    └── GalleryPagination.tsx       # ページネーションコンポーネント

呼び出し側の例 (src/page-components/blueprint/home):
├── lib/blueprintGalleryConfig.tsx   # GalleryViewConfig設定
└── ui/BlueprintGalleryView.tsx      # GalleryView使用
```

## 概要

**TSX設定ファイルによる完全カスタマイズ可能なギャラリーシステム:**

### Config-based カスタマイズの核心機能

#### 1. **GalleryLayoutConfig** (レイアウト制御)
- **レスポンシブグリッド**: `{ xs: 1, md: 2, lg: 3, xl: 4 }` でブレークポイント別カラム数指定
- **アスペクト比制御**: `'video' | 'square' | '4/3' | 'auto' | カスタム値` で画像比率統一
- **動的レスポンシブ**: 画面サイズに応じた自動グリッド調整

#### 2. **GalleryItemConfig** (アイテム表示制御)
- **サムネイル制御**: `showThumbnail: boolean` でサムネイル表示切り替え
- **カスタムURL取得**: `getThumbnailUrl: (item) => string` で画像URL動的生成
- **TSXコンテンツレンダリング**: `contentRender: (item) => JSX.Element` で完全カスタム表示
- **ホバーオーバーレイ**: `hoverOverlayRender` でインタラクティブな追加コンテンツ
- **リンク機能**: `linkConfig` で新しいタブ/現在のタブ対応

#### 3. **高度なカスタマイズ例**
```tsx
// blueprintGalleryConfig.tsx の実例
export const createBlueprintGalleryConfig = (): GalleryViewConfig<Blueprint> => ({
  layoutConfig: {
    grid: { xs: 1, md: 2, lg: 3, xl: 4 },  // レスポンシブ設定
    aspectRatio: 'video'                    // 16:9比率
  },
  itemConfig: {
    showThumbnail: true,
    getThumbnailUrl: (blueprint) => blueprint.image,  // 動的URL取得
    contentRender: (blueprint) => (                   // カスタムJSX
      <div className="space-y-1">
        <h3>{blueprint.productName}</h3>
        <p><Calendar size={14} />{blueprint.orderDate}</p>
      </div>
    )
  }
})
```

### 技術特徴
- **完全型安全**: TypeScript ジェネリクスによる型推論
- **TSX設定**: 設定ファイル内でのReactコンポーネント記述
- **パフォーマンス最適化**: 仮想化・メモ化による大量データ対応
- **デザインシステム統合**: Tailwind CSS による統一デザイン
- **アクセシビリティ**: キーボードナビゲーション・スクリーンリーダー対応

### 使用場面
- **図面ギャラリー**: サムネイル付き図面一覧
- **画像ライブラリ**: 写真・素材管理
- **プロダクトカタログ**: 商品・サービス紹介
- **ポートフォリオ**: 作品・実績表示

Configファイル1つで見た目と動作を完全にコントロール可能。
EOF < /dev/null