# テーブルページネーション リファクタリング戦略

## 文書情報

- **文書種別**: 実装戦略
- **日付**: 2025-08-05
- **作成者**: Claude Code Assistant
- **バージョン**: 1.0

## 概要

現在のテーブルとページネーションアーキテクチャをリファクタリングし、コードの重複を排除し、保守性を向上させるための戦略を示します。**オーバーエンジニアリングを避け、既存の3つの重複ページネーションコンポーネントを統一し、BasicDataTableとの統合を図ることが主目的です。**

## 現在のアーキテクチャ分析

### BasicDataTableコンポーネント

**場所**: `src/shared/basic-data-table/ui/BasicDataTable.tsx`

**現在の機能**:

- 列ベースの設定を持つ汎用テーブルコンポーネント
- ソート、リサイズ、セル編集機能を内蔵
- 機能ごとにカスタムフック使用（`useColumnResize`, `useTableSort`, `useCellEdit`）
- ページネーション統合なし

**長所**:

- 関心の分離がしっかりしている
- 汎用的で再利用可能
- TypeScriptサポートが充実
- フックベースのモジュラーアーキテクチャ

**制限事項**:

- ページネーション機能なし
- 総データ数の処理なし
- ページレベルのデータ管理なし

### ページネーションコンポーネント

**場所**:

- `src/page-components/blueprint/ui/BlueprintPagination.tsx`
- `src/page-components/customer/ui/CustomerPagination.tsx`
- `src/page-components/project/ui/ProjectPagination.tsx`

**現在の状態**:

- **3つのコンポーネント間で100%のコード重複**
- インターフェースと実装が同一
- 前後ページとページ番号のシンプルなページネーションロジック
- 表示ページ数は5つまで

**インターフェースパターン**:

```typescript
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
}
```

### 列設定ファイル

**場所**:

- `src/page-components/blueprint/lib/blueprintColumns.tsx`
- `src/page-components/customer/lib/customerColumns.tsx`

**現在の構造**:

- コールバック付きの列作成ファクトリ関数
- レンダリング、編集、ソート機能を持つ豊富な列定義
- データモデルの型安全なインターフェース
- ドロップダウンメニュー付きアクション列

**観察された良い慣行**:

- 拡張性のためのコールバックベースアーキテクチャ
- 静的エクスポートによる後方互換性
- 豊富なレンダリング機能
- 型安全性

### コンテナコンポーネント

**場所**:

- `src/page-components/blueprint/ui/BlueprintContainer.tsx`
- `src/page-components/customer/ui/CustomerContainer.tsx`

**現在の責務**:

- データ管理とフィルタリング
- ページネーション計算
- 検索機能
- 高度フィルタリング統合
- 現在ページの状態管理

**ページネーションロジックパターン**:

```typescript
// 全てのコンテナで繰り返されるコード
const totalPages = Math.ceil(filteredData.length / itemsPerPage);
const startIndex = (currentPage - 1) * itemsPerPage;
const currentData = filteredData.slice(startIndex, startIndex + itemsPerPage);
```

## 現在のアプローチの問題点

### 1. コードの重複

- **ページネーションコンポーネント**: 3つ以上のコンポーネントで100%同じコード
- **コンテナロジック**: 全てのコンテナで同じページネーション計算
- **保守負担**: 変更時に複数ファイルを修正する必要

### 2. 統合の欠如

- **関心の分離**: テーブルとページネーションが完全に分離
- **手動調整**: 開発者がページネーションをテーブルに手動で接続する必要
- **エラーが起きやすい**: 新しいテーブルビュー作成時にページネーションを忘れがち

### 3. 一貫性のないUX

- **実装のばらつき**: 時間の経過とともに微細な違いが生じる可能性
- **機能ギャップ**: 新しいページネーション機能を全コンポーネントに追加する必要

### 4. アーキテクチャの制限

- **標準化の不足**: テーブル+ページネーションの強制パターンなし
- **拡張性の制限**: 「ページ当たり項目数」セレクターなどの機能追加が困難
- **型安全性の問題**: ページネーション統合のコンパイル時保証なし

## 提案する新しいアーキテクチャ

### 1. 統一TablePaginationコンポーネント

**場所**: `src/shared/basic-data-table/ui/TablePagination.tsx`

```typescript
interface TablePaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange?: (itemsPerPage: number) => void;
  showItemsPerPageSelector?: boolean;
  showTotalItems?: boolean;
  maxVisiblePages?: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}
```

**機能**:

- **基本ページネーション**（ShadCN/UI Paginationコンポーネント使用）
- **総項目数表示**（「150項目中1-20を表示」）
- **既存機能と同等レベル**（現在の3つの重複コンポーネントの置き換え）

**実装方針**: 既存のShadCN/UIコンポーネントを最大限活用し、オーバーエンジニアリングを避ける

### 2. ページネーション統合型BasicDataTable

**場所**: `src/shared/basic-data-table/ui/BasicDataTable.tsx`

```typescript
interface PaginationConfig {
  enabled: boolean;
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange?: (itemsPerPage: number) => void;
  showItemsPerPageSelector?: boolean;
  showTotalItems?: boolean;
}

interface BasicDataTableProps<T> {
  // ... 既存のprops
  pagination?: PaginationConfig;
  loading?: boolean;
  loadingMessage?: string;
}
```

**新機能**:

- **統合ページネーション**（オプション設定として）
- **内部データスライシング処理**（ページネーション提供時）

**実装方針**:

- 必要最小限の機能追加に留め、既存のBasicDataTableの安定性を保つ
- **重要**: 既存のレイアウト構造（`flex-1 flex flex-col min-h-0`）を維持し、スクロール動作を保持する

### 3. テーブル設定システム

**移行パス**: 列ファイル → テーブル設定ファイル

**新しい構造**:

```typescript
// src/page-components/blueprint/lib/blueprintTableConfig.tsx
export interface BlueprintTableConfig {
  columns: DataTableColumn<Blueprint>[];
  pagination: {
    itemsPerPage: number;
    showItemsPerPageSelector: boolean;
    showTotalItems: boolean;
  };
  features: {
    sorting: boolean;
    editing: boolean;
    resizing: boolean;
    filtering: boolean;
  };
  callbacks?: {
    onPreview?: (item: Blueprint) => void;
    onEdit?: (item: Blueprint) => void;
    onDelete?: (item: Blueprint) => void;
  };
}
```

### 4. usePaginatedTableフック

**場所**: `src/shared/basic-data-table/lib/usePaginatedTable.ts`

```typescript
interface PaginatedTableState<T> {
  currentPage: number;
  itemsPerPage: number;
  totalPages: number;
  currentData: T[];
  totalItems: number;
}

interface UsePaginatedTableProps<T> {
  data: T[];
  initialItemsPerPage?: number;
  initialPage?: number;
}

export function usePaginatedTable<T>({
  data,
  initialItemsPerPage = 20,
  initialPage = 1,
}: UsePaginatedTableProps<T>): PaginatedTableState<T> & {
  setCurrentPage: (page: number) => void;
  setItemsPerPage: (itemsPerPage: number) => void;
};
```

## 実装戦略

### フェーズ1: 共有コンポーネント作成（第1週）

#### 1.1 TablePaginationコンポーネント

```bash
src/shared/basic-data-table/ui/TablePagination.tsx  # 単一ファイル（ShadCN/UI使用）
```

**実装方針**:

- 既存のShadCN/UI Paginationコンポーネントを活用
- オーバーエンジニアリングを避け、シンプルな置き換えに留める
- 現在の3つの重複ページネーションコンポーネントの統一版として作成

#### 1.2 usePaginatedTableフック

```bash
src/shared/basic-data-table/lib/usePaginatedTable.ts  # 単一ファイル
```

**実装方針**:

- 既存コンテナの重複ページネーションロジックを統一
- 複雑な機能は追加せず、現在の機能と同等レベルに留める

#### 1.3 BasicDataTable拡張

- オプションのページネーションprop追加
- TablePaginationコンポーネント統合
- 後方互換性の維持

#### 1.4 重要なレイアウト設計の保持

既存のレイアウト設計を維持することが重要：

```typescript
// BlueprintContainer.tsx の重要なレイアウト構造
return (
  <div className="h-[calc(100vh-45px)] flex overflow-hidden"> {/* 画面全体固定高さ */}
    {/* メインコンテンツ */}
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="flex-shrink-0 p-4">         {/* ヘッダー: 固定 */}
        <PageHeader ... />
      </div>
      <div className="flex-1 flex flex-col min-h-0 px-4"> {/* テーブル: スクロール可能 */}
        <BasicDataTable ... />
      </div>
      <div className="flex-shrink-0 p-4">         {/* ページネーション: 固定 */}
        <Pagination ... />
      </div>
    </div>
  </div>
);
```

**重要なポイント**:

- `h-[calc(100vh-45px)]`: 画面全体の高さを固定
- `flex-shrink-0`: ヘッダーとページネーションを固定サイズに
- `flex-1 min-h-0`: テーブル部分をスクロール可能に
- `overflow-hidden`: 外側コンテナでオーバーフロー制御
- `overflow-auto`: BasicDataTable内でスクロール有効化

### フェーズ2: 移行戦略（第2週）

#### 2.1 段階的移行アプローチ

**ステップ1**: 後方互換性のためのラッパーコンポーネント作成

```typescript
// src/page-components/blueprint/ui/BlueprintPagination.tsx (レガシー)
export function BlueprintPagination(props: BlueprintPaginationProps) {
  return <TablePagination {...props} />;
}
```

**ステップ2**: 一度に一つのコンテナを更新

- Blueprintコンテナから開始
- 十分にテスト
- 他のコンテナに同じパターンを適用

**ステップ3**: 全移行後にレガシーページネーションコンポーネントを削除

#### 2.2 コンテナ移行パターン

**変更前**:

```typescript
// コンテナ内の手動ページネーションロジック
const totalPages = Math.ceil(filteredData.length / itemsPerPage);
const currentData = filteredData.slice(startIndex, startIndex + itemsPerPage);

return (
  <>
    <BasicDataTable data={currentData} columns={columns} />
    <BlueprintPagination currentPage={currentPage} totalPages={totalPages} />
  </>
);
```

**変更後**:

```typescript
// 統合ページネーション使用
const paginationConfig = {
  enabled: true,
  currentPage,
  itemsPerPage,
  totalItems: filteredData.length,
  onPageChange: setCurrentPage,
  showTotalItems: true
};

return (
  <div className="h-[calc(100vh-45px)] flex overflow-hidden">
    {/* フィルターサイドバー */}
    <AdvancedFilterSidebar ... />

    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="flex-shrink-0 p-4">         {/* ヘッダー: 固定 */}
        <PageHeader ... />
      </div>
      <div className="flex-1 flex flex-col min-h-0 px-4"> {/* テーブル: スクロール可能 */}
        <BasicDataTable
          data={filteredData}
          columns={columns}
          pagination={paginationConfig}  {/* ページネーション統合 */}
        />
      </div>
      {/* ページネーションは BasicDataTable 内に統合されるため不要 */}
    </div>
  </div>
);
```

**重要**: 既存のレイアウト構造を維持し、ページネーションをBasicDataTable内に統合する

### フェーズ3: テーブル設定システム（第3週）

#### 3.1 テーブル設定ファイル作成

**列ファイルからの移行**:

```bash
# 旧構造
src/page-components/blueprint/lib/blueprintColumns.tsx

# 新構造
src/page-components/blueprint/lib/blueprintTableConfig.tsx
```

#### 3.2 後方互換性レイヤー

- 既存の列ファイルを維持
- 新しい設定ファイルから列をエクスポート
- インポートの段階的移行

#### 3.3 拡張設定機能

- テーブル毎のデフォルトページネーション設定
- 機能トグル（ソート、編集など）
- 一元化されたコールバック管理

### フェーズ4: 最終調整とクリーンアップ（第4週）

#### 4.1 最終テストと調整

- **全機能の動作確認**
- **既存機能の回帰テスト**
- **パフォーマンステスト**

#### 4.2 レガシーコンポーネント削除

- **重複ページネーションコンポーネント削除**
- **未使用インポートのクリーンアップ**
- **ドキュメント更新**

**注意**: 高度な機能追加は避け、基本的なリファクタリング完了に集中する

## ファイル構造の変更

### 作成する新しいファイル

```
src/shared/basic-data-table/
├── ui/
│   └── TablePagination.tsx          # 単一ファイル（ShadCN/UI使用）
└── lib/
    └── usePaginatedTable.ts         # 単一ファイル
```

**注意**: オーバーエンジニアリングを避け、必要最小限のファイル構成とする

### 修正するファイル

```
src/shared/basic-data-table/
├── ui/BasicDataTable.tsx          # ページネーション統合追加
├── model/types.ts                 # ページネーションインターフェース追加
└── index.ts                       # 新しいコンポーネントエクスポート

src/page-components/*/ui/
├── *Container.tsx                 # 新しいページネーションシステムに移行
└── *TableView.tsx                # テーブル使用法更新
```

### 最終的に削除するファイル

```
src/page-components/blueprint/ui/BlueprintPagination.tsx
src/page-components/customer/ui/CustomerPagination.tsx
src/page-components/project/ui/ProjectPagination.tsx
```

## 移行タイムライン

### 第1週: 基盤

- [ ] TablePaginationコンポーネント作成
- [ ] usePaginatedTableフック作成
- [ ] BasicDataTableのページネーション拡張
- [ ] 包括的なテスト作成

### 第2週: コンテナ移行

- [ ] 後方互換性ラッパー作成
- [ ] Blueprintコンテナ移行
- [ ] Customerコンテナ移行
- [ ] Projectコンテナ移行
- [ ] 全テーブル使用法更新

### 第3週: 設定システム

- [ ] テーブル設定ファイル作成
- [ ] 後方互換性実装
- [ ] インポートの段階的移行
- [ ] ドキュメント更新

### 第4週: 最終調整とクリーンアップ

- [ ] 全機能の動作確認
- [ ] 既存機能の回帰テスト
- [ ] レガシーページネーションコンポーネント削除
- [ ] 未使用インポートのクリーンアップ
- [ ] ドキュメント更新

## テスト戦略

### ユニットテスト

- **TablePaginationコンポーネント** - 全propsとインタラクション
- **usePaginatedTableフック** - 状態管理と計算
- **BasicDataTable統合** - ページネーション動作
- **ユーティリティ関数** - エッジケースと境界条件

### 統合テスト

- **コンテナコンポーネント** - エンドツーエンドページネーションフロー
- **テーブル設定** - 列とページネーションの統合
- **ユーザーインタラクション** - ページ変更、ページ当たり項目数変更

### ビジュアル回帰テスト

- **ページネーションUI** - 全サイズバリアントと状態
- **テーブルレイアウト** - ページネーション有無
- **レスポンシブ動作** - モバイルとデスクトップビュー

## リスク軽減

### 後方互換性リスク

- **軽減策**: 既存APIを保持するラッパーコンポーネント作成
- **ロールバック計画**: 移行完了まで古いコンポーネント保持
- **テスト**: 既存機能の広範囲な回帰テスト

### パフォーマンスリスク

- **大量データセット**: 仮想スクロールと遅延読み込みフック実装
- **再レンダリング**: React.memoとuseCallbackで最適化
- **バンドルサイズ**: 高度機能のコード分割

### ユーザーエクスペリエンスリスク

- **破壊的変更**: 機能フラグ付き段階的ロールアウト
- **アクセシビリティ**: 包括的ARIA実装とテスト
- **モバイル体験**: タッチフレンドリーコントロール付きレスポンシブデザイン

## 成功指標

### コード品質

- **DRY原則**: ページネーションコンポーネント重複の100%排除
- **保守性**: ページネーションロジックの単一情報源
- **型安全性**: 全新コンポーネントの完全TypeScript対応

### パフォーマンス

- **バンドルサイズ**: 最小限の増加（gzip圧縮で5KB未満）
- **実行時パフォーマンス**: テーブルレンダリング速度の回帰なし
- **メモリ使用量**: 効率的なページネーション状態管理

### 開発者体験

- **API一貫性**: 全テーブル実装での統一インターフェース
- **ドキュメント**: 包括的ガイドと例
- **使いやすさ**: 新しいテーブル実装のセットアップ時間短縮

## 結論

このリファクタリング戦略は、現在のテーブルとページネーションシステムにおけるコード重複の問題に対処します。**オーバーエンジニアリングを避け、シンプルな置き換えに留めることで以下を実現します：**

1. **DRY原則**: 重複ページネーションコンポーネントの排除
2. **シンプルな統合**: BasicDataTableとページネーションの基本的な連携
3. **保守性**: ページネーションロジックの単一情報源
4. **後方互換性**: 破壊的変更のないスムーズな移行パス

**重要**: 既存機能の置き換えに留め、不要な機能追加は行わない段階的アプローチにより、最小限のリスクで確実な改善を実現します。
