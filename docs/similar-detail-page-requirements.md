# 類似図面詳細ページ要件定義

## 概要

既存の類似図面検索機能を拡張し、より柔軟な検索とフィルタリングが可能な詳細ページを新規作成する。

## 現状の問題点

### 1. 検索対象の制限
- 案件登録・図面登録済みのものしか類似図面検索ができない
- 野良の図面（未登録図面）をアップロードして検索する機能がない

### 2. フィルタリング機能の不足
- 類似図面が並ぶだけで絞り込みができない
- 顧客別、案件別などの条件検索に対応していない

## 新規ページ仕様

### ルーティング
```
/blueprint/[id]/similar-detail
```

### レイアウト構成

```
┌──────────────────────────────────────────────────────────────┐
│ [フィルターコントロール: 顧客選択、案件選択など]              │
├────────────────────┬─────────────────────────────────────────┤
│                    │                                         │
│  対象図面表示      │    類似図面ギャラリー                  │
│  (左側 1/3)        │    (右側 2/3)                           │
│                    │                                         │
│  - 選択中の図面    │    - 類似度順に表示                     │
│  - または          │    - フィルター適用後の結果             │
│    アップロード    │    - グリッド/リスト表示               │
│    された図面      │                                         │
│                    │                                         │
└────────────────────┴─────────────────────────────────────────┘
```

### 画面比率
- 左側（対象図面）: 1/3
- 右側（類似図面ギャラリー）: 2/3

### ヘッダーエリア機能

#### フィルター機能
既存の `AdvancedFilterSidebar` を再利用
- 実装場所: `@/shared/advanced-filter` (src/page-components/blueprint/home/ui/BlueprintHomeContainer.tsx:66-73で使用中)
- 設定: `BLUEPRINT_FILTER_CONFIG` (src/page-components/blueprint/home/lib/blueprintFilterConfig.ts:4-124)

**フィルター項目**:
- 顧客名 (customer_name)
- 会社名 (company_name)
- 製品名 (leaf_product_name)
- 図面番号 (drawing_number)
- 図面カテゴリ (drawing_category_name)
- ファイル拡張子 (drawing_file_extension)
- 材質、表面処理、熱処理、検査レベル（カスタム項目）
- 作成日時・更新日時の範囲指定

### 左側パネル: 対象図面表示エリア

#### 表示内容
- 検索対象となる図面を1枚表示
- 図面の基本情報表示
- ズーム・パン操作対応

#### データソース
1. 登録済み図面（URLパラメータから図面ID取得）
2. アップロードされた野良図面

### 右側パネル: 類似図面ギャラリー

既存の `SimilarBlueprintGallery` を再利用・拡張
- 実装場所: src/widgets/blueprint/similar-blueprint-gallery/ui/SimilarBlueprintGallery.tsx
- 設定: `createSimilarBlueprintGalleryConfig` (src/widgets/blueprint/similar-blueprint-gallery/lib/similarBlueprintGalleryConfig.tsx)

#### 表示内容
- 類似図面のサムネイル一覧（グリッド表示: xs=1列, md=2列）
- 図面ファイル名
- ホバー時のオーバーレイボタン（「差分検出」など）

#### 既存機能
- ページネーション（10/20/50/100件切り替え可能）
- ローディング状態表示
- 空状態のUI（「類似図面が見つかりませんでした」）

#### 追加機能
- フィルター条件に応じた動的表示
- 類似度スコアの表示
- 「詳細を見る」ボタンの追加（similar-detailページへの遷移用）

## ページ遷移動線

### 動線1: 登録済み図面からの遷移

**起点**: `/blueprint/[id]/similar` ページの右側ギャラリー

**操作**:
1. 類似図面ギャラリー内の図面カードに「詳細を見る」ボタンを配置
2. ボタンクリックで `/blueprint/[id]/similar-detail` へ遷移
3. URL パラメータとして図面IDを引き継ぐ

**想定URL例**:
```
/blueprint/123/similar-detail
```

### 動線2: 野良図面のアップロード

**起点**: 図面一覧ページ（`/blueprint`）

**実装状況**:
- 既に `SimilarBlueprintSearchDialog` コンポーネントが実装済み
- `BlueprintPageHeader` の右上に配置済み (src/page-components/blueprint/home/ui/BlueprintPageHeader.tsx:85)

**操作**:
1. ページ右上の「類似図面検索」ボタンをクリック
2. Popoverが開き、図面ドロップゾーンを表示
3. 図面ファイルをドラッグ&ドロップまたはクリックしてファイル選択
4. アップロード完了後、`/blueprint/similar-detail` へ遷移
5. アップロードされた図面データをクエリパラメータまたはセッションストレージで引き継ぐ

**想定URL例**:
```
/blueprint/similar-detail?uploaded=true&fileId=xxxxx
```

**修正が必要な箇所**:
- src/page-components/blueprint/home/ui/SimilarBlueprintSearchDialog.tsx:25
  - 現在: `router.push('/project/INT-2024-001/blueprint');` ← 削除
  - 変更後: `router.push('/blueprint/similar-detail?uploaded=true');`

## 技術要件

### 再利用する既存コンポーネント

1. **AdvancedFilterSidebar** (`@/shared/advanced-filter`)
   - フィルターサイドバーUI
   - `useAdvancedFilter` フック
   - `BLUEPRINT_FILTER_CONFIG` 設定

2. **SimilarBlueprintGallery** (`@/widgets/blueprint/similar-blueprint-gallery`)
   - ギャラリー表示コンポーネント
   - `createSimilarBlueprintGalleryConfig` 設定
   - ページネーション機能

3. **SimilarBlueprintSearchDialog** (`@/page-components/blueprint/home/ui`)
   - 図面アップロード用Popover
   - ドラッグ&ドロップ機能

4. **BlueprintViewContainer** (`@/widgets`)
   - 左側の図面表示用（既存のものを流用）

### 状態管理
- 対象図面データ（登録済み or アップロード）
- フィルター条件（useAdvancedFilterで管理）
- 類似図面検索結果
- ページネーション状態（GalleryView内で管理）
- サイドバー開閉状態

### データフロー
1. ページ読込時に対象図面データを取得
   - URLパラメータから図面ID取得 or アップロードフラグ確認
2. 類似図面検索APIをコール（ダミーデータ使用）
3. フィルター条件変更時に再検索
4. 結果をギャラリーに表示

### APIエンドポイント（想定）
- `POST /api/blueprints/search-similar` - 類似図面検索
- `POST /api/blueprints/upload-temp` - 一時アップロード
- `GET /api/blueprints/[id]` - 図面詳細取得

## ユーザーストーリー

### ストーリー1: 登録済み図面から詳細検索
```
As a ユーザー
I want to 登録済み図面の類似図面を詳細に検索したい
So that より精度の高い類似図面を見つけられる
```

**シナリオ**:
1. `/blueprint/123/similar` ページで図面を閲覧
2. 右側ギャラリーの図面カードから「詳細を見る」をクリック
3. `similar-detail` ページへ遷移
4. ヘッダーでフィルター条件を設定
5. 絞り込まれた類似図面を確認

### ストーリー2: 野良図面の類似検索
```
As a ユーザー
I want to 未登録の図面をアップロードして類似図面を検索したい
So that 案件登録前でも図面の重複や類似性を確認できる
```

**シナリオ**:
1. 図面一覧ページの右上ボタンをクリック
2. ポップオーバーに図面をドロップ
3. `similar-detail` ページへ遷移
4. アップロードした図面が左側に表示される
5. 類似図面が右側に表示される
6. フィルターで顧客や案件を絞り込み

## ファイル構造

### ディレクトリツリー

```
src/page-components/blueprint/similar-detail/
├── ui/
│   ├── index.ts
│   ├── BlueprintSimilarDetailContainer.tsx     # メインコンテナ
│   ├── SimilarDetailHeader.tsx                 # ヘッダー（検索バー、フィルタートグルなど）
│   └── TargetBlueprintPanel.tsx                # 左側: 対象図面表示パネル
├── lib/
│   ├── index.ts
│   ├── similarDetailFilterConfig.ts            # フィルター設定（BLUEPRINT_FILTER_CONFIGを再利用）
│   └── useSimilarDetailData.ts                 # データ取得・管理フック
└── model/
    ├── index.ts
    └── types.ts                                 # 型定義
```

### 各ファイルの責務

#### ui/BlueprintSimilarDetailContainer.tsx
- メインコンテナコンポーネント
- 全体レイアウト管理（左1/3、右2/3）
- `AdvancedFilterSidebar` の統合
- `SimilarDetailHeader` の配置
- `TargetBlueprintPanel` と `SimilarBlueprintGallery` の配置
- 状態管理（フィルター、サイドバー開閉）

#### ui/SimilarDetailHeader.tsx
- ヘッダーコンポーネント
- 検索バー（オプション）
- フィルタートグルボタン
- その他アクション（CSV出力など、必要に応じて）

#### ui/TargetBlueprintPanel.tsx
- 左側の対象図面表示パネル
- 登録済み図面またはアップロード図面の表示
- 図面のズーム・パン操作
- 図面メタデータ表示

#### lib/similarDetailFilterConfig.ts
- フィルター設定のエクスポート
- `BLUEPRINT_FILTER_CONFIG` を再利用または拡張

#### lib/useSimilarDetailData.ts
- データ取得・管理フック
- URLパラメータの解析
- 対象図面データの取得
- 類似図面データの取得
- フィルター適用後のデータ更新

#### model/types.ts
- 型定義
- `SimilarDetailContainerProps`
- `TargetBlueprintData`
- `SimilarDetailHeaderProps`
- その他必要な型

### ページファイル

```
src/app/blueprint/similar-detail/
└── page.tsx                                     # ページエントリーポイント
```

### データフロー

```
page.tsx
  └─> BlueprintSimilarDetailContainer
       ├─> useSimilarDetailData (データ取得)
       │    ├─> URLパラメータ解析
       │    ├─> 対象図面データ取得
       │    └─> 類似図面データ取得
       │
       ├─> AdvancedFilterSidebar (左サイドバー)
       │    └─> useAdvancedFilter
       │
       ├─> SimilarDetailHeader (ヘッダー)
       │
       └─> メインコンテンツエリア
            ├─> TargetBlueprintPanel (左1/3)
            │    └─> 対象図面表示
            │
            └─> SimilarBlueprintGallery (右2/3)
                 └─> フィルター済み類似図面リスト
```

## 実装優先度

### Phase 1: 基本機能（既存コンポーネント統合）
- [ ] `/blueprint/similar-detail` ページ作成
- [ ] ページレイアウト作成（左1/3、右2/3）
- [ ] `AdvancedFilterSidebar` の統合
- [ ] `SimilarBlueprintGallery` の統合
- [ ] `SimilarBlueprintSearchDialog` の遷移先修正（src/page-components/blueprint/home/ui/SimilarBlueprintSearchDialog.tsx:25）

### Phase 2: 遷移動線の実装
- [ ] 動線1: `/blueprint/[id]/similar` の類似図面ギャラリーに「詳細を見る」ボタン追加
- [ ] 動線2: `SimilarBlueprintSearchDialog` から `similar-detail` への遷移実装
- [ ] URLパラメータの処理実装

### Phase 3: データ連携
- [ ] アップロードされた図面データの受け渡し実装
- [ ] フィルター適用後の類似図面再検索
- [ ] ダミーデータとの連携確認

## 参考: 既存ページとの関係

### `/blueprint/[id]/similar` との違い

| 項目 | /similar | /similar-detail |
|------|----------|----------------|
| レイアウト | 左: 図面ビュー (ResizablePanel)<br>右: 類似図面 (小) | 左: 対象図面 (1/3)<br>右: 類似図面 (2/3) |
| フィルター | なし | あり（ヘッダー） |
| 検索対象 | 登録済みのみ | 登録済み + 野良図面 |
| 用途 | 簡易プレビュー | 詳細検索・分析 |
| 動線 | タブから直接 | similarページから or アップロードから |

## 注意事項

- 既存の `/blueprint/[id]/similar` ページは維持する
- レイアウトコンポーネント（`BlueprintTabNavigation`など）は共通化を検討
- アップロードされた図面の一時保存期間を定義する必要がある
- セキュリティ: アップロードファイルのバリデーション必須
