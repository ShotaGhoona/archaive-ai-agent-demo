# BlueprintView vs PicturePreview コンポーネント比較分析

## 概要
`src/widgets/blueprint/blueprint-view` を削除し、`src/shared/components/picture-preview` に統合するための分析。

## BlueprintView コンポーネント

### BlueprintViewContainer.tsx
- **Props**: `activeFile: BlueprintFile | BlueprintView | null`
- **Hook**: `useBlueprintView({ activeFileId: activeFile?.id })`
- **Empty State**: 図面選択を促すメッセージ（📋 アイコン）
- **Transform**: `translate(${position.x + 96}px, ${position.y}px)` - 96pxのオフセット有り
- **Image**: `activeFile.imageUrl`, `alt={activeFile.name}`

### useBlueprintView.ts
- **Props**: `activeFileId?: string`
- **Reset条件**: `activeFileId` 変更時

## PicturePreview コンポーネント

### PicturePreviewContainer.tsx
- **Props**: `activeFile: PictureFile | null`
- **Hook**: `usePicturePreview({ imageUrl: activeFile?.imageUrl })`
- **Empty State**: 画像選択を促すメッセージ（🖼️ アイコン）
- **Transform**: `translate(${position.x}px, ${position.y}px)` - オフセット無し
- **Image**: `activeFile.imageUrl`, `alt="プレビュー画像"`

### usePicturePreview.ts
- **Props**: `imageUrl?: string`
- **Reset条件**: `imageUrl` 変更時

## 主な違い

1. **型定義**: `BlueprintFile | BlueprintView` vs `PictureFile`
2. **Hook Props**: `activeFileId` vs `imageUrl`
3. **Transform**: 96pxオフセット vs オフセット無し
4. **Empty State**: 図面用メッセージ vs 画像用メッセージ
5. **Alt Text**: `activeFile.name` vs 固定文字列

## 統合の方針

PicturePreviewを拡張して以下を対応：
1. より汎用的な型定義（`BlueprintFile | BlueprintView | PictureFile`）
2. 動的なempty stateメッセージ
3. 動的なalt text
4. オプショナルなtransformオフセット
5. より柔軟なreset条件

## 機能的差分

両コンポーネントの機能は完全に同一：
- ズーム機能（拡大・縮小・fit to screen）
- 回転機能（時計回り・反時計回り）
- ドラッグ移動
- ズームロック
- 同一のUI/UX（ツールチップ、ボタン配置、スタイル）