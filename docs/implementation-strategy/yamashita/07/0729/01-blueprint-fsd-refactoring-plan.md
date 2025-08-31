# Blueprint機能のFSDリファクタリング戦略

## 概要

現在のblueprint機能をFSD（Feature-Sliced Design）アーキテクチャに準拠してリファクタリングする包括的な戦略を策定します。

## 現状分析

### 現在のファイル構造

```
src/components/feature/blueprint/
├── Container.tsx                    # メイン一覧コンテナ
├── components/                      # UI コンポーネント群
│   ├── BlueprintPageHeader.tsx
│   ├── TableView.tsx               # テーブル表示（リファクタリング済み）
│   ├── GalleryView.tsx
│   ├── FilterSidebar.tsx
│   ├── BlueprintPagination.tsx
│   └── ...（多数のコンポーネント）
├── data/
│   └── blueprint.json              # モックデータ
└── lib/
    └── blueprintColumns.tsx        # テーブル設定

src/components/feature/blueprint-detail/
├── Container.tsx                   # 詳細画面コンテナ
├── components/                     # 詳細画面専用コンポーネント
│   ├── DetailTabNavigation.tsx
│   ├── SimilarBlueprintsPanel.tsx
│   └── ...
└── data/
    └── blueprints.json            # 詳細用モックデータ

src/components/feature/blueprint-upload/
├── index.tsx                      # アップロード機能
└── components/                    # アップロード専用コンポーネント

app/blueprints/                   # ページレベル
├── page.tsx                       # 一覧ページ
└── [id]/page.tsx                  # 詳細ページ
```

### 課題と改善点

1. **レイヤー境界の曖昧さ**: feature層が巨大化、責務が不明確
2. **コンポーネントの重複**: 類似機能の重複実装
3. **データ取得の非統一**: JSON直読み、API未統合
4. **状態管理の分散**: ローカル状態のみ、グローバル状態なし
5. **再利用性の欠如**: 他のドメインで活用困難

## FSDリファクタリング戦略

### 1. エンティティ層（entities/blueprint/）

#### 1.1 型定義とドメインモデル

```typescript
// entities/blueprint/model/types.ts
export interface Blueprint {
  // 基本情報
  id: string;
  filename: string;
  title?: string;
  description?: string;

  // 発注・製品情報
  orderSource: string;
  productName: string;
  internalNumber: string;
  customerNumber: string;

  // CAD/CAM情報
  cadName?: string;
  camName?: string;

  // 受注情報
  orderQuantity: number;
  orderDate: string;
  deliveryDate: string;

  // 寸法情報
  maxDimensionL: number;
  maxDimensionD: number;
  maxDimensionH: number;

  // その他
  companyField?: string;
  status: BlueprintStatus;

  // ファイル管理
  files: BlueprintFile[];
  thumbnailUrl?: string;

  // メタデータ
  createdAt: string;
  updatedAt: string;
  createdBy: string;

  // 関連データ
  similarBlueprints?: SimilarBlueprint[];
  tags?: string[];
  category?: string;
}

export interface BlueprintFile {
  id: string;
  filename: string;
  fileUrl: string;
  fileType: 'pdf' | 'dwg' | 'jpg' | 'png';
  fileSize: number;
  uploadedAt: string;
}

export interface SimilarBlueprint {
  blueprintId: string;
  similarity: number;
  title: string;
  thumbnailUrl: string;
}

export type BlueprintStatus =
  | 'draft'
  | 'review'
  | 'approved'
  | 'production'
  | 'completed';

// フィルター・検索用
export interface BlueprintFilter {
  searchText: string;
  orderSource: string[];
  productName: string[];
  status: BlueprintStatus[];
  dateRange?: {
    start: string;
    end: string;
  };
  dimensionRange?: {
    minL?: number;
    maxL?: number;
    minD?: number;
    maxD?: number;
    minH?: number;
    maxH?: number;
  };
}

// API用
export interface CreateBlueprintDto {
  filename: string;
  orderSource: string;
  productName: string;
  // ... 必要なフィールド
}

export interface UpdateBlueprintDto extends Partial<CreateBlueprintDto> {
  id: string;
}
```

#### 1.2 API統合

```typescript
// entities/blueprint/api/blueprintApi.ts
export class BlueprintApi {
  // CRUD操作
  static async getBlueprints(filter?: BlueprintFilter): Promise<Blueprint[]>;
  static async getBlueprintById(id: string): Promise<Blueprint>;
  static async createBlueprint(data: CreateBlueprintDto): Promise<Blueprint>;
  static async updateBlueprint(data: UpdateBlueprintDto): Promise<Blueprint>;
  static async deleteBlueprint(id: string): Promise<void>;

  // 専用機能
  static async searchSimilarBlueprints(
    blueprintId: string,
  ): Promise<SimilarBlueprint[]>;
  static async uploadBlueprintFiles(
    blueprintId: string,
    files: File[],
  ): Promise<BlueprintFile[]>;
  static async exportBlueprintsToCSV(filter?: BlueprintFilter): Promise<Blob>;

  // 画像解析
  static async analyzeBlueprintImage(file: File): Promise<{
    extractedText: string;
    suggestedTags: string[];
    estimatedDimensions?: {
      length: number;
      width: number;
      height: number;
    };
  }>;
}
```

#### 1.3 状態管理（Redux Toolkit）

```typescript
// entities/blueprint/model/blueprintSlice.ts
export interface BlueprintState {
  // データ
  blueprints: Blueprint[];
  currentBlueprint: Blueprint | null;

  // UI状態
  loading: {
    list: boolean;
    detail: boolean;
    upload: boolean;
    similarSearch: boolean;
  };
  error: string | null;

  // フィルター・検索
  filter: BlueprintFilter;
  searchResults: Blueprint[];

  // ページネーション
  pagination: {
    page: number;
    limit: number;
    total: number;
  };

  // 表示設定
  viewMode: 'table' | 'gallery';
  selectedIds: string[];
}

// アクション
export const blueprintSlice = createSlice({
  // ... standard CRUD actions
  // setFilter, setViewMode, toggleSelection など
});
```

#### 1.4 MSWハンドラー

```typescript
// shared/api/mock-handlers/blueprint.ts
export const blueprintHandlers = [
  rest.get('/api/blueprints', (req, res, ctx) => {
    // フィルタリング・ページネーション対応
  }),
  rest.get('/api/blueprints/:id', (req, res, ctx) => {
    // 詳細取得、関連データ含む
  }),
  rest.post('/api/blueprints', (req, res, ctx) => {
    // 新規作成
  }),
  rest.put('/api/blueprints/:id', (req, res, ctx) => {
    // 更新
  }),
  rest.delete('/api/blueprints/:id', (req, res, ctx) => {
    // 削除
  }),
  rest.get('/api/blueprints/:id/similar', (req, res, ctx) => {
    // 類似図面検索（AI解析シミュレーション）
  }),
  rest.post('/api/blueprints/:id/files', (req, res, ctx) => {
    // ファイルアップロード
  }),
  rest.post('/api/blueprints/analyze', (req, res, ctx) => {
    // 画像解析
  }),
];
```

### 2. フィーチャー層（features/）

#### 2.1 blueprint-filtering

```typescript
// features/blueprint-filtering/
├── ui/
│   ├── BlueprintSearchBar.tsx          # 基本検索
│   ├── BlueprintFilterPanel.tsx        # 詳細フィルター
│   └── BlueprintFilterChips.tsx        # 適用中フィルター表示
├── lib/
│   ├── useBlueprintFiltering.ts        # フィルタリングロジック
│   └── filterUtils.ts                  # フィルター計算ユーティリティ
└── model/
    └── types.ts                        # フィルター固有の型
```

#### 2.2 blueprint-upload

```typescript
// features/blueprint-upload/
├── ui/
│   ├── BlueprintUploadZone.tsx         # ドラッグ&ドロップエリア
│   ├── BlueprintUploadProgress.tsx     # アップロード進捗
│   ├── BlueprintFileStack.tsx          # ファイルスタック管理
│   └── BlueprintMetadataForm.tsx       # メタデータ入力
├── lib/
│   ├── useBlueprintUpload.ts           # アップロードロジック
│   ├── useFileStacking.ts              # ファイルスタック管理
│   └── uploadUtils.ts                  # アップロードユーティリティ
└── model/
    └── types.ts                        # アップロード固有の型
```

#### 2.3 blueprint-similar-search

```typescript
// features/blueprint-similar-search/
├── ui/
│   ├── SimilarBlueprintSearchTrigger.tsx    # 検索トリガーボタン
│   ├── SimilarBlueprintResultsPanel.tsx     # 結果表示パネル
│   ├── SimilarBlueprintCompareModal.tsx     # 比較モーダル
│   └── SimilarBlueprintLoadingState.tsx     # ローディング状態
├── lib/
│   ├── useSimilarBlueprintSearch.ts         # 類似検索ロジック
│   └── similarityUtils.ts                  # 類似度計算ユーティリティ
└── model/
    └── types.ts                             # 類似検索固有の型
```

#### 2.4 blueprint-edit

```typescript
// features/blueprint-edit/
├── ui/
│   ├── BlueprintEditModal.tsx          # 編集モーダル
│   ├── BlueprintCreateModal.tsx        # 新規作成モーダル
│   └── BlueprintDeleteDialog.tsx       # 削除確認ダイアログ
├── lib/
│   ├── useBlueprintEdit.ts             # 編集ロジック
│   └── blueprintValidation.ts          # バリデーション
└── model/
    └── types.ts                        # 編集固有の型
```

### 3. ウィジェット層（widgets/）

#### 3.1 blueprint-table

```typescript
// widgets/blueprint-table/
├── ui/
│   └── BlueprintTable.tsx              # テーブル表示widget
└── lib/
    └── useBlueprintTable.ts            # テーブル表示ロジック
```

#### 3.2 blueprint-gallery

```typescript
// widgets/blueprint-gallery/
├── ui/
│   ├── BlueprintGallery.tsx            # ギャラリー表示widget
│   └── BlueprintCard.tsx               # 図面カード
└── lib/
    └── useBlueprintGallery.ts          # ギャラリー表示ロジック
```

#### 3.3 blueprint-viewer

```typescript
// widgets/blueprint-viewer/
├── ui/
│   ├── BlueprintViewer.tsx             # 図面ビューアー
│   ├── BlueprintThumbnail.tsx          # サムネイル表示
│   └── BlueprintFileList.tsx           # ファイル一覧
└── lib/
    └── useBlueprintViewer.ts           # ビューアーロジック
```

### 4. ページコンポーネント層（page-components/）

#### 4.1 blueprints-list

```typescript
// page-components/blueprints-list/
├── ui/
│   └── BlueprintsListContainer.tsx     # 一覧ページコンテナ
├── model/
│   └── useBlueprintsListPage.ts        # ページ状態管理
└── lib/
    └── blueprintsListLogic.ts          # ページ固有ロジック
```

#### 4.2 blueprint-detail

```typescript
// page-components/blueprint-detail/
├── ui/
│   └── BlueprintDetailContainer.tsx    # 詳細ページコンテナ
├── model/
│   └── useBlueprintDetailPage.ts       # ページ状態管理
└── lib/
    └── blueprintDetailLogic.ts         # ページ固有ロジック
```

#### 4.3 blueprint-upload-page

```typescript
// page-components/blueprint-upload-page/
├── ui/
│   └── BlueprintUploadPageContainer.tsx # アップロードページコンテナ
├── model/
│   └── useBlueprintUploadPage.ts        # ページ状態管理
└── lib/
    └── blueprintUploadPageLogic.ts      # ページ固有ロジック
```

### 5. 共有レイヤー強化（shared/）

#### 5.1 basic-data-table の拡張

既に実装済みのBasicDataTableをさらに強化：

```typescript
// shared/basic-data-table の機能拡張
- 行選択機能（複数選択対応）
- カラムの表示/非表示切り替え
- カラム順序の保存/復元
- エクスポート機能の統合
- フィルター状態の永続化
```

#### 5.2 ファイル管理系コンポーネント

```typescript
// shared/file-upload/
├── ui/
│   ├── FileUploadZone.tsx              # 汎用ファイルアップロード
│   ├── FilePreview.tsx                 # ファイルプレビュー
│   └── FileProgressIndicator.tsx       # 進捗表示
└── lib/
    └── useFileUpload.ts                # ファイルアップロードロジック
```

## 実装フェーズ

### Phase 1: 基盤構築（1-2日）

1. **entities/blueprint/** の完全実装
   - 型定義の統一・拡張
   - Redux Sliceの作成
   - API層の実装（MSW対応）
   - モックデータの強化

2. **shared層の強化**
   - BasicDataTableの機能拡張
   - ファイルアップロード系コンポーネントの作成

### Phase 2: フィーチャー分離（2-3日）

1. **blueprint-filtering** の独立化
2. **blueprint-upload** の独立化
3. **blueprint-similar-search** の独立化
4. **blueprint-edit** の独立化

### Phase 3: ウィジェット構築（1-2日）

1. **blueprint-table** widget の作成
2. **blueprint-gallery** widget の作成
3. **blueprint-viewer** widget の作成

### Phase 4: ページ統合（1日）

1. **page-components** の作成
2. **app/ページ** の更新
3. 全体の動作確認

### Phase 5: テストと最適化（1日）

1. 機能テスト
2. パフォーマンス最適化
3. エラーハンドリング強化

## 期待される効果

### 1. 保守性の向上

- 明確な責務分離
- 依存関係の整理
- テストしやすい構造

### 2. 再利用性の向上

- 他のドメイン（商品マスター等）での活用可能
- コンポーネントの独立性確保

### 3. 開発効率の向上

- 新機能追加の容易性
- バグ修正の局所化
- コードレビューの効率化

### 4. スケーラビリティの確保

- 機能追加時の影響範囲最小化
- パフォーマンス最適化の容易性

## 技術的な注意点

### 1. 段階的移行

既存の機能を保ちながら段階的にリファクタリングを進める

### 2. 下位互換性

既存のページ・コンポーネントが動作し続けるよう配慮

### 3. TypeScript型安全性

anyの使用を避け、厳密な型定義を維持

### 4. パフォーマンス

大量データの表示・フィルタリング性能を保持

このリファクタリング計画により、blueprint機能がFSD原則に準拠した、保守性・再利用性・スケーラビリティの高いアーキテクチャに生まれ変わります。
