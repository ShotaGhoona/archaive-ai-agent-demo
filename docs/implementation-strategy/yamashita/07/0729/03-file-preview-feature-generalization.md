# ファイルプレビュー機能の汎用化戦略

## 概要

現在blueprint-uploadコンポーネント内にあるBlueprintViewModalを汎用化し、feature層に移動してアプリケーション全体で再利用可能にする。さらにblueprintテーブルの操作列にプレビュー機能を追加する。

## ファイル変更計画

```
📁 変更ファイル構成
├── 🆕 src/features/file-preview/
│   ├── 🆕 index.ts                           # Public API
│   ├── 🆕 lib/
│   │   ├── 🆕 index.ts                       # Lib exports
│   │   ├── 🆕 useFilePreview.ts              # プレビュー管理hook
│   │   ├── 🆕 fileTypeDetector.ts            # ファイル形式判定
│   │   └── 🆕 previewProviders.ts            # プレビュープロバイダー
│   ├── 🆕 model/
│   │   ├── 🆕 index.ts                       # Model exports
│   │   └── 🆕 types.ts                       # 型定義
│   └── 🆕 ui/
│       ├── 🆕 index.ts                       # UI exports
│       ├── 🆕 FilePreviewModal.tsx           # 汎用プレビューモーダル
│       ├── 🆕 PreviewViewer.tsx              # プレビュー表示コンポーネント
│       └── 🆕 PreviewToolbar.tsx             # ツールバーコンポーネント
├── 🔄 src/page-components/blueprint/lib/blueprintColumns.tsx  # プレビューアクション追加
├── 🔄 src/page-components/blueprint-upload/ui/
│   ├── 🔄 UploadGalleryView.tsx              # 新しいPreviewModal使用
│   └── 🔄 StackedCard.tsx                    # 新しいPreviewModal使用
└── ❌ src/page-components/blueprint-upload/ui/BlueprintViewModal.tsx  # 削除
```

## 汎用化設計方針

### 1. 拡張可能なファイル形式サポート

```typescript
// ファイル形式プロバイダーパターン
interface PreviewProvider {
  supportedTypes: string[];
  canPreview: (file: PreviewableFile) => boolean;
  render: (file: PreviewableFile, options: PreviewOptions) => ReactNode;
}

// 組み込みプロバイダー
const imageProvider: PreviewProvider = {
  /* 画像用 */
};
const pdfProvider: PreviewProvider = {
  /* PDF用 */
};
const dwgProvider: PreviewProvider = {
  /* CAD図面用 */
};
```

### 2. 汎用的なファイル型定義

```typescript
interface PreviewableFile {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  metadata?: Record<string, any>;
}

interface PreviewOptions {
  initialZoom?: number;
  enableDownload?: boolean;
  enableRotation?: boolean;
  customActions?: PreviewAction[];
}
```

### 3. Hook-based状態管理

```typescript
const useFilePreview = (files: PreviewableFile[], options?: PreviewOptions) => {
  // ズーム、回転、ナビゲーション状態管理
  // プロバイダー選択ロジック
  // ダウンロード機能
};
```

## 実装ステップ

### Phase 1: Feature層の構築

1. ✅ `src/features/file-preview/` ディレクトリ作成
2. ✅ 型定義とインターフェース設計
3. ✅ プレビュープロバイダーシステム実装
4. ✅ 汎用FilePreviewModal作成

### Phase 2: 既存コンポーネントの移行

1. ✅ blueprint-upload → 新しいPreviewModal使用
2. ✅ 既存BlueprintViewModal削除

### Phase 3: Blueprint テーブル連携

1. ✅ blueprintColumns.tsxにプレビューアクション追加
2. ✅ プレビューボタンのUIデザイン
3. ✅ テーブル行データから PreviewableFile への変換

## 技術的考慮事項

### 拡張性の確保

- **プロバイダーパターン**: 新しいファイル形式の追加が容易
- **設定可能オプション**: 用途に応じてUI/機能をカスタマイズ
- **外部データソース対応**: URL以外のデータソースにも対応

### パフォーマンス

- **遅延読み込み**: プレビュー時のみファイル読み込み
- **キャッシュ機能**: 同じファイルの再表示時の高速化
- **仮想化**: 大量ファイルのカルーセル表示最適化

### アクセシビリティ

- **キーボードナビゲーション**: 矢印キーでのファイル切り替え
- **スクリーンリーダー対応**: 適切なARIAラベル
- **色覚対応**: カラーバリアフリーなUI

## 期待される効果

1. **コードの再利用性向上**: 他のコンポーネントでも簡単にプレビュー機能追加
2. **保守性向上**: 機能が集約されメンテナンスが容易
3. **一貫したUX**: アプリケーション全体で統一されたプレビュー体験
4. **拡張性**: 新しいファイル形式やプレビュー機能の追加が容易

## リスク と対策

### リスク

- 汎用化による複雑性の増大
- 既存機能の一時的な不安定化
- パフォーマンス劣化の可能性

### 対策

- 段階的な移行（既存機能を残しながら新機能をテスト）
- 十分なテスト実装
- パフォーマンステストの実施
- フォールバック機能の実装
