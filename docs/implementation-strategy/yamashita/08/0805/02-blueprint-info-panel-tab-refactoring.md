# Blueprint Info Panel タブ統合実装戦略

## 現在の実装状況

### Container.tsx の現状 (src/page-components/blueprint-detail/Container.tsx)

- 右側パネルで3つの状態を条件分岐で切り替え:
  1. `isSearchingBlueprints` → `SimilarBlueprintsLoadingPanel`
  2. `showSimilarBlueprints` → `SimilarBlueprintsPanel`
  3. デフォルト → `BlueprintInfoPanel`

### BlueprintInfoPanel.tsx の現状

- 基本情報フォーム（ファイル名、顧客名、製品名など）
- フォーム項目19個
- 保存機能

### SimilarBlueprintsPanel.tsx の現状

- 類似図面一覧（2列グリッド）
- プレビュー・比較機能
- 類似度による表示順序

## 要求される変更内容

1. **右側パネルの統合**
   - BlueprintInfoPanel内にタブ機能を実装
   - 基本情報タブ（現在のBlueprintInfoPanel内容）
   - 類似図面情報タブ（SimilarBlueprintsPanel内容）

2. **削除する要素**
   - `SimilarBlueprintsLoadingPanel`の使用停止

## 実装戦略

### 1. 新しいコンポーネント構造

```
BlueprintInfoPanel
├── BlueprintInfo (新規作成)
│   ├── Tab: 基本情報
│   │   └── BlueprintBasicInfo (リファクタリング)
│   └── Tab: 類似図面情報
│       └── SimilarBlueprintsContent (リファクタリング)
```

### 2. 実装手順

#### Phase 1: コンポーネント分割

1. `BlueprintBasicInfo.tsx` 作成
   - 現在の`BlueprintInfoPanel.tsx`のフォーム部分を抽出
   - propsとしてactiveFileとonSaveを受け取る

2. `SimilarBlueprintsContent.tsx` 作成
   - `SimilarBlueprintsPanel.tsx`の内容部分を抽出
   - ヘッダー（タイトル・閉じるボタン）は除外
   - activeFileとonSimilarBlueprintClickをpropsで受け取る

#### Phase 2: タブコンポーネント実装

3. `BlueprintInfo.tsx` 作成
   - shadcn/uiのTabsコンポーネントまたは独自実装
   - 2つのタブ: "基本情報", "類似図面情報"
   - 各タブ内容を上記コンポーネントで表示

#### Phase 3: BlueprintInfoPanel統合

4. `BlueprintInfoPanel.tsx` 改修
   - タブコンポーネントを内包する構造に変更
   - activeFileがnullの場合の処理は維持

#### Phase 4: Container.tsx簡素化

5. `Container.tsx` 改修
   - `showSimilarBlueprints`, `isSearchingBlueprints` state削除
   - 条件分岐を削除し、常に`BlueprintInfoPanel`を表示
   - `handleSimilarBlueprintSearch`でタブ切り替えロジックに変更

### 3. 状態管理の変更

#### 削除する状態

- `showSimilarBlueprints`
- `isSearchingBlueprints`
- `handleCloseSimilarBlueprints`
- `handleSimilarBlueprintSearch`のローディング部分

#### 新規追加する状態

- `activeInfoTab`: "basic" | "similar" （BlueprintInfoPanel内で管理）

### 4. UI/UX考慮事項

- タブ切り替えはスムーズなアニメーション
- 類似図面検索ボタンクリック時は自動で類似図面タブに切り替え
- 類似図面がない場合のフォールバック表示
- ローディング状態は類似図面タブ内で表示

### 5. ファイル変更一覧

#### 新規作成

- `src/page-components/blueprint-detail/ui/BlueprintInfo.tsx`
- `src/page-components/blueprint-detail/ui/BlueprintBasicInfo.tsx`
- `src/page-components/blueprint-detail/ui/SimilarBlueprintsContent.tsx`

#### 修正

- `src/page-components/blueprint-detail/Container.tsx`
- `src/page-components/blueprint-detail/ui/BlueprintInfoPanel.tsx`

#### 削除対象

- `src/page-components/blueprint-detail/ui/SimilarBlueprintsLoadingPanel.tsx` (使用停止)

## 実装後の期待される動作

1. 右側パネルは常にBlueprintInfoPanelが表示される
2. パネル上部にタブが表示される（基本情報・類似図面情報）
3. 基本情報タブでは現在のフォーム内容が表示される
4. 類似図面情報タブでは類似図面一覧が表示される
5. BlueprintViewerの類似図面検索ボタンクリック時は類似図面タブに自動切り替え
6. ローディング状態は類似図面タブ内で適切に表示される
