# BOM Directory詳細ページ実装ドキュメント

## 概要

BOMのDirectory詳細ページは、製品構成管理システムにおける階層構造の各Directoryノードの詳細情報を表示・管理するためのページです。以下の2つの主要なタブで構成されています：

1. **基本情報（Basic Information）**: Directoryのメタデータと配下要素のギャラリー表示
2. **BOMツリー（BOM Tree）**: 階層構造のツリービューと選択ノードの詳細表示

## ルーティング構造

```
/bom/directory/[id]/basic-information
/bom/directory/[id]/bomtree
```

- `[id]`: DirectoryのユニークID
- 両ページとも同じDirectory IDを使用し、異なる視点で情報を表示

---

## 1. 基本情報ページ（Basic Information）

### 1.1 ページ構成

**レイアウト**: 水平2分割（ResizableLayout）
- **左側（50%）**: Directory情報フォーム
- **右側（50%）**: 子要素ギャラリー（Directory/帳票/図面）

### 1.2 実装ファイル

#### `BasicInformationContainer.tsx`
**場所**: `src/page-components/bom/directory-detail/basic-information/ui/BasicInformationContainer.tsx`

**責務**:
- URLパラメータからDirectory IDを取得
- BOMツリーデータから該当Directoryを検索
- ResizableLayoutで左右パネルを配置

**主な機能**:
```typescript
// Directory検索ロジック
function findDirectoryById(node: BomNode, targetId: string): Directory | null {
  if (node.type === 'directory') {
    const dir = node as Directory;
    if (dir.id === targetId) return dir;
    for (const child of dir.children) {
      const found = findDirectoryById(child, targetId);
      if (found) return found;
    }
  }
  return null;
}
```

**レイアウト設定**: `basicInfoResizableLayoutConfig.ts`
```typescript
{
  direction: 'horizontal',
  panels: [
    { initialWidth: 50, minWidth: 30, maxWidth: 70 },
    { initialWidth: 50, minWidth: 30, maxWidth: 70 },
  ],
}
```

#### `DirectoryInfoForm.tsx`
**場所**: `src/page-components/bom/directory-detail/basic-information/ui/DirectoryInfoForm.tsx`

**責務**: Directory情報の表示（読み取り専用）

**セクション構成**:
1. **基本情報**
   - ULID（必須）
   - シーケンス番号（必須）
   - 名称（必須）
   - タイプ
   - 備考

2. **カスタム項目**
   - `customItems`オブジェクトから動的に生成
   - 3カラムグリッドレイアウト

3. **システム情報**
   - 作成者/更新者
   - 作成日/更新日（日本語フォーマット）

**保存ボタン**: 現在はコンソールログのみ（API実装予定）

#### `ChildElementsGallery.tsx`
**場所**: `src/page-components/bom/directory-detail/basic-information/ui/ChildElementsGallery.tsx`

**責務**: 配下要素のタブ切り替え式ギャラリー表示

**タブ構成**:
1. **Directoryタブ**
   - 直下のDirectory要素をカード形式で表示
   - クリックで該当Directoryの詳細ページへ遷移
   - 表示内容: タイプ名、名称、ULID、シーケンス番号

2. **帳票タブ**
   - DirectoryDocuments（`directoryData.documents`）を表示
   - プレビュー画像付きカード
   - 最新バージョン情報を表示

3. **図面タブ**
   - 直下のLeafProduct配下の全図面を平坦化して表示
   - プレビュー画像付きカード
   - 所属LeafProduct名も表示

**重要なパターン**:
```typescript
// タブコンテンツの正しいレイアウトパターン（TargetBlueprintPanel参考）
<div className="flex flex-1 overflow-hidden">
  {selectedTab === 'directories' && (
    <div className="w-full overflow-y-auto px-6 py-4">
      {/* コンテンツ */}
    </div>
  )}
</div>
```

---

## 2. BOMツリーページ（BOM Tree）

### 2.1 ページ構成

**レイアウト**: 固定幅2分割（Resizable非対応）
- **左側（w-120）**: BOMツリーサイドバー
- **右側（flex-1）**: 選択ノードの詳細パネル

### 2.2 実装ファイル

#### `BomTreeContainer.tsx`
**場所**: `src/page-components/bom/directory-detail/bomtree/ui/BomTreeContainer.tsx`

**責務**:
- URLパラメータからDirectory IDを取得
- 製品全体のルートDirectoryと現在のDirectoryを管理
- 選択ノード（`selectedNode`）の状態管理
- ノードタイプに応じた詳細パネルの出し分け

**詳細パネルの出し分けロジック**:
```typescript
{selectedNode ? (
  <>
    {selectedNode.type === 'directory' && (
      <DirectoryDetailPanel directoryData={selectedNode as Directory} />
    )}
    {selectedNode.type === 'leaf-product' && (
      <LeafProductDetailPanel leafProductData={selectedNode as LeafProduct} />
    )}
    {selectedNode.type === 'document' && (
      <DocumentDetailPanel documentNode={selectedNode as DocumentNode} />
    )}
  </>
) : (
  <div>ノードを選択してください</div>
)}
```

#### `DirectoryBomTreeSidebar.tsx`
**場所**: `src/page-components/bom/directory-detail/bomtree/ui/DirectoryBomTreeSidebar.tsx`

**責務**: BOMツリーのタブ切り替え式表示

**タブ構成**:
1. **製品全体タブ**
   - `rootDirectory`全体を表示
   - 現在のDirectoryをオレンジ色でハイライト（`bg-orange-50`）

2. **現在のDirectoryタブ**
   - `directoryData`配下のみを表示
   - ハイライトなし

**ツリーノード機能**:
- **階層表示**: インデント、展開/折りたたみアイコン
- **アイコン**: Directory（フォルダ）、LeafProduct（ガントチャート）、Document（ファイル）
- **選択状態**: 青色ハイライト（`bg-blue-100`）
- **ダブルクリック**: Directoryの場合、詳細ページへ遷移
- **デフォルト展開**: 2階層まで自動展開

**ドキュメントノードの生成**:
```typescript
// Directory/LeafProductのdocumentsをchildrenとして扱う
const docNodes: DocumentNode[] = dir.documents.map((doc) => ({
  id: `doc_${doc.id}`,
  ulid: doc.ulid,
  type: 'document' as const,
  parentId: dir.id,
  document: doc,
}));
children = [...children, ...docNodes];
```

**スクロール**: `overflow-y-auto scrollbar-hide`（ScrollAreaは使用しない）

---

## 3. 詳細パネル（Detail Panels）

### 3.1 DirectoryDetailPanel
**場所**: `src/page-components/bom/directory-detail/bomtree/ui/DirectoryDetailPanel.tsx`

**表示内容**: `DirectoryInfoForm`と同様（保存ボタンなし）
- 基本情報
- カスタム項目
- システム情報

### 3.2 LeafProductDetailPanel
**場所**: `src/page-components/bom/directory-detail/bomtree/ui/LeafProductDetailPanel.tsx`

**タブ構成**:
1. **図面タブ**
   - `PicturePreviewContainer`で最初の図面を表示
   - 背景: `white-dot`バリアント

2. **基本情報タブ**
   - ULID、リビジョン番号、名称、タイプ、備考
   - カスタム項目
   - システム情報

3. **類似図面検索タブ**（実装予定）
4. **見積もり情報タブ**（実装予定）

**図面プレビュー実装**:
```typescript
const firstDrawing = leafProductData.drawings.length > 0
  ? leafProductData.drawings[0]
  : null;

<PicturePreviewContainer
  activeFile={firstDrawing ? { imageUrl: firstDrawing.previewImageUrl } : null}
  backgroundVariant="white-dot"
/>
```

### 3.3 DocumentDetailPanel
**場所**: `src/page-components/bom/directory-detail/bomtree/ui/DocumentDetailPanel.tsx`

**タブ構成**:
1. **[ドキュメント名]タブ**（動的ラベル）
   - `PicturePreviewContainer`で最新バージョンのプレビュー画像を表示
   - 背景: `white-dot`バリアント

2. **基本情報タブ**
   - 基本情報: ULID、タイプ名、備考
   - 最新バージョン情報: バージョン番号、名称、拡張子、ファイルサイズ
   - カスタム項目
   - システム情報

**最新バージョン取得**:
```typescript
const latestVersion = documentNode.document.versions[
  documentNode.document.versions.length - 1
];
```

---

## 4. PicturePreviewContainer拡張

### 4.1 背景バリアント機能追加

**場所**: `src/shared/components/picture-preview/ui/PicturePreviewContainer.tsx`

**新規プロップ**:
```typescript
interface PicturePreviewContainerProps {
  activeFile: PictureFile | null;
  backgroundVariant?: 'gray' | 'white-dot'; // 追加
}
```

**バリアント定義**:
- **gray**（デフォルト）: `bg-gray-100`
- **white-dot**: `bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-[size:20px_20px]`

**実装**:
```typescript
const backgroundClass = backgroundVariant === 'white-dot'
  ? 'bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-[size:20px_20px]'
  : 'bg-gray-100';

<div className={`relative h-full w-full overflow-hidden ${backgroundClass}`}>
```

**使用理由**: 白い部分がある画像でも輪郭が分かりやすくなる

---

## 5. データ型定義

### 5.1 主要な型

**BomNode**:
```typescript
type BomNode = Directory | LeafProduct | DocumentNode;
```

**Directory**:
```typescript
interface Directory {
  id: string;
  ulid: string;
  type: 'directory';
  seqNumber: number;
  name: string;
  directoryTypeName: string;
  remarks?: string;
  children: BomNode[];
  documents?: DirectoryDocument[];
  customItems?: Record<string, any>;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
  parentId?: string;
}
```

**LeafProduct**:
```typescript
interface LeafProduct {
  id: string;
  ulid: string;
  type: 'leaf-product';
  revisionNumber: string;
  name: string;
  leafProductTypeName: string;
  remarks?: string;
  drawings: DrawingFile[];
  documents?: DirectoryDocument[];
  customItems?: Record<string, any>;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
  parentId: string;
}
```

**DocumentNode**（ツリー表示用）:
```typescript
interface DocumentNode {
  id: string;
  ulid: string;
  type: 'document';
  parentId: string;
  document: DirectoryDocument;
}
```

---

## 6. 参考にしたコードパターン

### 6.1 DirectoryInfoForm
**参考**: `src/page-components/bom/project-detail/basic-information/ui/ProjectInfoForm.tsx`
- フォームレイアウト
- セクション分割
- グリッドレスポンシブデザイン

### 6.2 ChildElementsGallery
**参考**: `src/page-components/bom/similar/similar-detail/ui/TargetBlueprintPanel.tsx`
- タブコンテンツの正しいレイアウトパターン
- `flex flex-1 overflow-hidden` + `w-full overflow-y-auto`

### 6.3 DirectoryBomTreeSidebar
**参考**: `src/page-components/bom/home/ui/BomTreeSidebar.tsx`
- ツリーノードの再帰構造
- 展開/折りたたみロジック
- アイコン表示

---

## 7. 重要な技術的決定

### 7.1 レイアウト

**基本情報ページ**: ResizableLayout（50:50、調整可能）
**BOMツリーページ**: 固定幅レイアウト（左w-120、右flex-1）

**理由**: BOMツリーは固定幅の方が使いやすいとの判断

### 7.2 スクロール処理

**ScrollArea不使用**: `overflow-y-auto`を使用

**理由**: ScrollAreaでスクロールが機能しない問題が発生したため

### 7.3 ハイライト表現

**製品全体タブ**: 現在のDirectoryをオレンジ色（`bg-orange-50`）
**透明度は使用しない**: 見にくいため廃止

### 7.4 データ検索

**再帰的検索**: `findDirectoryById`関数でBOMツリー全体を探索

```typescript
function findDirectoryById(node: BomNode, targetId: string): Directory | null {
  if (node.type === 'directory') {
    const dir = node as Directory;
    if (dir.id === targetId) return dir;
    for (const child of dir.children) {
      const found = findDirectoryById(child, targetId);
      if (found) return found;
    }
  }
  return null;
}
```

---

## 8. ファイル構成

```
src/page-components/bom/directory-detail/
├── basic-information/
│   ├── lib/
│   │   └── basicInfoResizableLayoutConfig.ts    # 50:50分割設定
│   └── ui/
│       ├── BasicInformationContainer.tsx         # メインコンテナ
│       ├── DirectoryInfoForm.tsx                 # Directory情報フォーム
│       └── ChildElementsGallery.tsx              # 子要素ギャラリー
│
└── bomtree/
    ├── lib/
    │   └── bomTreeResizableLayoutConfig.ts       # 使用されていない
    └── ui/
        ├── BomTreeContainer.tsx                  # メインコンテナ
        ├── DirectoryBomTreeSidebar.tsx           # BOMツリーサイドバー
        ├── DirectoryDetailPanel.tsx              # Directory詳細パネル
        ├── LeafProductDetailPanel.tsx            # LeafProduct詳細パネル
        └── DocumentDetailPanel.tsx               # Document詳細パネル
```

---

## 9. 今後の実装予定

### 9.1 基本情報ページ
- [ ] 保存機能のAPI連携
- [ ] バリデーション
- [ ] 編集モード/閲覧モード切り替え

### 9.2 BOMツリーページ
- [ ] LeafProduct詳細パネルの類似図面検索タブ
- [ ] LeafProduct詳細パネルの見積もり情報タブ
- [ ] 複数図面の選択・切り替え機能
- [ ] ドキュメントの全バージョン表示

### 9.3 共通
- [ ] エラーハンドリング
- [ ] ローディング状態
- [ ] 権限制御
- [ ] 楽観的更新

---

## 10. 使用方法

### 10.1 ページへのアクセス

```typescript
// 基本情報ページ
router.push(`/bom/directory/${directoryId}/basic-information`);

// BOMツリーページ
router.push(`/bom/directory/${directoryId}/bomtree`);
```

### 10.2 コンポーネントの使用

```typescript
import { BasicInformationContainer } from '@/page-components/bom/directory-detail/basic-information/ui';
import { BomTreeContainer } from '@/page-components/bom/directory-detail/bomtree/ui';

// 基本情報ページ
<BasicInformationContainer directoryId={id} />

// BOMツリーページ
<BomTreeContainer directoryId={id} />
```

---

## 11. トラブルシューティング

### 11.1 右側に空白ができる

**原因**: タブコンテンツのレイアウトパターンが間違っている

**解決方法**:
```typescript
// 正しいパターン
<div className="flex flex-1 overflow-hidden">
  {selectedTab === 'tab1' && (
    <div className="w-full overflow-y-auto px-6 py-4">
      {/* コンテンツ */}
    </div>
  )}
</div>

// 間違ったパターン
<div className="overflow-y-auto"> {/* flex flex-1がない */}
  {selectedTab === 'tab1' && (
    <div> {/* w-fullがない */}
      {/* コンテンツ */}
    </div>
  )}
</div>
```

### 11.2 ツリーがスクロールしない

**解決方法**: `ScrollArea`ではなく`overflow-y-auto`を使用

```typescript
// 動作する
<div className="flex-1 overflow-y-auto scrollbar-hide">

// 動作しない
<ScrollArea className="flex-1">
```

### 11.3 Directory IDが取得できない

**確認事項**:
1. URLパラメータが正しいか
2. `useParams()`が呼ばれているか
3. `findDirectoryById`がルートから検索しているか

---

## 12. パフォーマンス最適化

### 12.1 useMemo使用箇所

```typescript
// ルートDirectoryのメモ化
const rootDirectory = useMemo(() => {
  const bomTree = bomTreeData as BomTree;
  return bomTree.root as Directory;
}, []);

// Directory検索のメモ化
const directoryData = useMemo(() => {
  if (!id) return rootDirectory;
  const found = findDirectoryById(rootDirectory, id);
  return found || rootDirectory;
}, [id, rootDirectory]);
```

### 12.2 再レンダリング最小化

- `selectedNode`状態のみでパネルを切り替え
- 不要な状態の持ち上げを避ける
- コンポーネント分割による影響範囲の限定

---

## 13. アクセシビリティ

### 13.1 キーボード操作
- Tabキーでフォーカス移動
- Enterキーでノード選択
- 矢印キーでツリー展開/折りたたみ（今後実装予定）

### 13.2 セマンティックHTML
- `<button>`要素の適切な使用
- `<label>`とフォーム要素の関連付け
- 適切な見出しレベル（h3）

---

## 14. スタイリング規約

### 14.1 Tailwind CSS使用パターン

**レイアウト**:
- `flex`, `flex-col`, `flex-1`
- `overflow-hidden`, `overflow-y-auto`
- `w-full`, `h-full`

**スペーシング**:
- `p-4`, `px-6`, `py-4`
- `gap-2`, `gap-4`, `space-y-4`, `space-y-6`

**カラー**:
- Primary: `text-primary`, `border-primary`
- Gray: `bg-gray-50`, `bg-gray-100`, `text-gray-700`
- Blue（選択）: `bg-blue-100`, `text-blue-900`
- Orange（ハイライト）: `bg-orange-50`, `text-orange-900`

**フォント**:
- 見出し: `text-lg font-bold`
- ラベル: `text-sm font-medium`
- 入力: `text-sm`

---

## 15. まとめ

BOM Directory詳細ページは、製品構成管理の中核となる機能を提供します。ResizableLayoutによる柔軟なレイアウト、TabNavigationによる情報の整理、PicturePreviewContainerによる視覚的なプレビュー機能を組み合わせ、ユーザーフレンドリーなインターフェースを実現しています。

今後のAPI連携や追加機能の実装により、さらに実用的なシステムへと成長していく予定です。
