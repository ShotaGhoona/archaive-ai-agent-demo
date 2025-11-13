# BOM Home3 - 無限キャンバスUI コンセプト設計

## 概要

BOM Home3は、FigJam/Miroのような無限キャンバス上でBOM構造を視覚的に展開・探索できる革新的なUIパターンです。従来のツリー表示とは異なり、空間的な配置と視覚的な関係性で製品構成を直感的に理解できます。

## 重要な概念

### Canvas（キャンバス）
- **1 Canvas = 1 Product**
- 一つのキャンバスで一つの製品（Product/Directory）の詳細を表示
- 無限にスクロール可能な作業領域
- 製品を切り替えるとキャンバス全体が切り替わる

### Section（セクション）
- **1 Section = 1 BomNode (Directory, LeafProduct, or Document)**
- home2のBomTreeの一行に相当する要素をカード形式で表示
- **3種類のセクションタイプ**:
  - **Directory**: 組み立て品（製品、Assy、SubAssy）- シアン色（primary）
  - **LeafProduct**: 部品（最小単位の製品）- 黄色
  - **Document**: 帳票ノード（仕様書、図面など）- グレー
- セクション内のコンテンツはタイプによって異なる:
  - **Directory**: ヘッダー + Metadataテーブル（製品コード、タイプ、重量、材質等）
  - **LeafProduct**: ヘッダー + 図面プレビュー画像
  - **Document**: ヘッダー + 帳票プレビュー画像

### 配置ルール

#### 階層と配置方向
- **下層（子要素）**: 親の**右側**に配置
- **同階層（兄弟要素）**: **縦並び（下方向）**に配置

```
親Section (x: 100, y: 200)
  │
  └─→ 子Section1 (x: 500, y: 100)  ← 右側 + 上
  └─→ 子Section2 (x: 500, y: 300)  ← 右側 + 中央
  └─→ 子Section3 (x: 500, y: 500)  ← 右側 + 下
```

#### 展開ボタンと矢印（タイプ別）
- **展開ボタン**: 親Sectionの**右端**に最大3つのボタンが縦に配置される
  - **上（33%）**: Directoryタイプの子を展開 - シアン色（primary）
  - **中央（50%）**: LeafProductタイプの子を展開 - 黄色
  - **下（67%）**: Documentタイプの子を展開 - グレー
  - 子が存在するタイプのみボタンが表示される
- **矢印接続**:
  - 起点: 親Sectionの**右端**の対応する位置（33%/50%/67%）
  - 終点: 子Sectionの**左端中央**
  - スタイル: smoothstep（角丸の直線的な曲線）
  - **色**: 子のタイプに応じて色分け
    - Directory子: シアン（#36adbf）
    - LeafProduct子: 黄色（#eab308）
    - Document子: グレー（#9ca3af）
  - **太さ**: 3px

#### 座標計算の考慮事項（実装済み）
- **親子間のGap**: 100px（HORIZONTAL_GAP）
- **兄弟間のGap**: 50px（VERTICAL_GAP）
- **配置アルゴリズム**: Top-align（親の上端 = 長男の上端）
  - 親ノードの上端と最初の子ノードの上端を揃える
  - 子ノードは縦に等間隔で配置
  - サブツリー全体の高さを再帰的に計算し、重ならないように配置
- **自動整列**: 展開・折りたたみ時に全ノードを自動で整列（alignAllNodes関数）
- **サイズ記憶**: ユーザーがリサイズしたサイズは折りたたみ後も記憶される

### 実装の段階的アプローチ

#### Phase 1: Canvas作成 ✅ 完了
- ✅ React Flowのセットアップ
- ✅ 無限キャンバスの基本機能（パン、ズーム）
- ✅ 製品セレクター（右上）

#### Phase 2: Section展開機能 ✅ 完了
- ✅ Sectionカード（カスタムノード）の作成
- ✅ タイプ別 `+` ボタン（3つ縦並び）による展開機能
- ✅ 座標計算ロジック（Top-align、自動整列）
- ✅ 矢印の自動描画（タイプ別色分け）
- ✅ タイプ別の展開・折りたたみ機能
- ✅ エッジの保持（展開・折りたたみ時にエッジが消えない）
- ✅ ノードリサイズとサイズ記憶

#### Phase 3: Section内部コンテンツ ✅ 完了
- ✅ Directoryタイプ: Metadata Table表示
- ✅ LeafProductタイプ: 図面プレビュー表示
- ✅ Documentタイプ: 帳票プレビュー表示
- ✅ タイプ別の色分けUI

#### Phase 4: 拡張機能（未実装）
- ⬜ 整列ボタン（手動整列トリガー）
- ⬜ ツールバー
- ⬜ 注釈・書き込み機能
- ⬜ 検索・フィルター
- ⬜ エクスポート機能

## コンセプトイメージ

参考画像:
- `docs/CleanShot 2025-11-10 at 20.30.34@2x.png` - FigJamベースデザイン
- `docs/CleanShot 2025-11-10 at 20.58.05@2x.png` - 実装イメージ

### 基本レイアウト

```
┌─────────────────────────────────────────────────────────────────────┐
│  [≡] 無限  無料        [産業用ポンプ PRD-1000 ▼]    [共有] [0:00]  │ ← ヘッダー
└─────────────────────────────────────────────────────────────────────┘
│                                                                       │
│  ┌─────────────────┐                                                │
│  │ 産業用ポンプ      │──┐                                            │
│  │ PRD-1000      [+]│  │                                            │
│  ├─────────────────┤  │                                            │
│  │製品コード│PRD-1000│  │                                            │
│  │タイプ   │製品    │  │                                            │
│  └─────────────────┘  │                                            │
│                       │                                             │
│                       ├──→ ┌─────────────────┐                     │
│                       │    │ ポンプ本体Assy   │──┐                 │
│                       │    │ ASSY-2000    [+]│  │                 │
│                       │    ├─────────────────┤  │                 │
│                       │    │製品コード│ASSY-2000│ │                 │
│                       │    │タイプ   │Assy    │  │                 │
│                       │    ├─────────────────┤  │                 │
│                       │    │[図面1][図面2]    │  │                 │
│                       │    └─────────────────┘  │                 │
│                       │                         │                  │
│                       │                         ├→ ┌──────────┐   │
│                       │                         │  │吸込側配管  │   │
│                       │                         │  │SubAssy  [+]│  │
│                       │                         │  └──────────┘   │
│                       │                         │                  │
│                       │                         ├→ ┌──────────┐   │
│                       │                         │  │吐出側配管  │   │
│                       │                         │  │SubAssy  [+]│  │
│                       │                         │  └──────────┘   │
│                       │                         │                  │
│                       ├──→ ┌─────────────────┐                     │
│                       │    │ 配管接続部Assy   │                     │
│                       │    │ ASSY-3000       │                     │
│                       │    └─────────────────┘                     │
│                       │                                             │
│                       └──→ ┌─────────────────┐                     │
│                            │ 電装部Assy    [+]│                     │
│                            │ ASSY-4000       │                     │
│                            └─────────────────┘                     │
│                                                                       │
│                        (無限キャンバス - ドラッグで移動)              │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────────────┐
│  [▶︎] [✋] [📌] [□] [○] [T] [📊] [👤] [⚙️] [+]    [-] [+] [?]      │ ← ツールバー
└─────────────────────────────────────────────────────────────────────┘
```

## 主要機能

### 1. 無限キャンバス操作

#### 基本操作
- **パン（移動）**:
  - 手のひらツール選択時: ドラッグで移動
  - ショートカット: `Space` + ドラッグ
  - マウス中ボタンドラッグ
- **ズーム**:
  - マウスホイール
  - ピンチジェスチャー（タッチデバイス）
  - `Cmd/Ctrl` + `+/-`
- **フィット**: 全体を画面に収める（`Cmd/Ctrl` + `0`）

#### ナビゲーション
- **ミニマップ**（右下）: 全体俯瞰とクイック移動
- **座標表示**: 現在の表示位置
- **ズームレベル**: 25% - 400%

### 2. セクションカード（実装済み）

各BOMノード（Directory/LeafProduct/Document）を視覚的なカードとして表示

#### カード構成要素（タイプ別）

**Directoryタイプ**:
```
┌─────────────────────────────┐
│ ポンプ本体Assy            [+]│ ← ヘッダー（名前）+ 展開ボタン×3（縦並び）
├─────────────────────────────┤
│ Metadata Table              │
│ ┌─────────┬───────────────┐│
│ │製品コード│ASSY-2000      ││
│ │タイプ   │Assy          ││
│ │重量     │25kg          ││
│ │材質     │SUS304        ││
│ └─────────┴───────────────┘│
└─────────────────────────────┘
```

**LeafProductタイプ**:
```
┌─────────────────────────────┐
│ フランジ部品              [+]│ ← ヘッダー
├─────────────────────────────┤
│     ┌───────────────┐       │
│     │   図面画像     │       │ ← 図面プレビュー
│     │   [📷]        │       │
│     └───────────────┘       │
└─────────────────────────────┘
```

**Documentタイプ**:
```
┌─────────────────────────────┐
│ 組立仕様書                   │ ← ヘッダー（document.typeName）
├─────────────────────────────┤
│     ┌───────────────┐       │
│     │   帳票画像     │       │ ← 帳票プレビュー
│     │   [📄]        │       │
│     └───────────────┘       │
└─────────────────────────────┘
```

#### カード機能（実装済み）
- ✅ **ドラッグ移動**: カード全体をドラッグして自由配置
- ✅ **タイプ別展開ボタン**: 右端に最大3つの`[+]`/`[-]`ボタン（33%, 50%, 67%）
  - 上: Directoryタイプの子を展開（シアン）
  - 中央: LeafProductタイプの子を展開（黄色）
  - 下: Documentタイプの子を展開（グレー）
- ✅ **折りたたみ**: `[-]`で該当タイプの子孫ノードを全て非表示
- ✅ **クリック**: カード全体をクリックで選択（枠ハイライト）
- ✅ **リサイズ**: 選択時に表示されるハンドルでサイズ調整可能
- ✅ **サイズ記憶**: リサイズしたサイズは折りたたみ後も保持

#### カード内容（実装済み）
- **Directoryタイプ**:
  - ヘッダー: ノード名（directory.name）
  - Metadata Table: 製品コード、タイプ、重量、材質、最大圧力、流量など
  - 2列レイアウト（ラベル | 値）
- **LeafProductタイプ**:
  - ヘッダー: 部品名（leafProduct.name）
  - 図面プレビュー: drawings[0].previewImageUrl
- **Documentタイプ**:
  - ヘッダー: 帳票タイプ名（document.typeName）
  - 帳票プレビュー: versions[0].previewImageUrl

### 3. 階層展開ロジック（実装済み）

#### 展開動作
1. セクションカード右端の**タイプ別**`[+]`ボタンをクリック
   - 上（33%）: Directoryタイプの子のみ展開
   - 中央（50%）: LeafProductタイプの子のみ展開
   - 下（67%）: Documentタイプの子のみ展開
2. 該当タイプの子要素が**縦並び**で右側に配置される
3. 親カードの対応する位置から各子カードの左端中央へ矢印が自動描画
4. 展開後、全ノードが自動整列される（alignAllNodes）

#### 配置ルール（実装済み）
```
親ノード (Directory)
  │
  ├──[33%]──→ Directory子1 (シアン線)
  │           │
  │           ├──[50%]──→ LeafProduct孫1 (黄色線)
  │           └──[67%]──→ Document孫1 (グレー線)
  │
  ├──[33%]──→ Directory子2 (シアン線)
  │
  └──[50%]──→ LeafProduct子1 (黄色線)
```

- **X軸**: 左から右へ階層深度ごとに配置（間隔: HORIZONTAL_GAP = 100px）
- **Y軸**: 兄弟ノードは縦並び（間隔: VERTICAL_GAP = 50px）
- **Top-align**: 親ノードの上端 = 長男の上端
- **サブツリー高さ**: 子孫を含めた全体の高さを再帰的に計算し、重ならないように配置

#### 折りたたみ（実装済み）
- タイプ別の`[-]`ボタンで該当タイプの子孫ノードを**再帰的に全て非表示**
- 関連する矢印も全て非表示
- ボタンは`[+]`に戻る
- 他のタイプの展開状態は影響を受けない

#### 再展開（実装済み）
- **サイズ記憶**: nodeSizesMapにリサイズしたサイズを記録
- 折りたたみ前のサイズは再展開時に復元される
- 展開状態（isDirectoryExpanded, isLeafProductExpanded, isDocumentExpanded）は個別に管理

### 4. 矢印（エッジ）（実装済み）

#### 描画スタイル
- **タイプ**: smoothstep（角丸の直線的な曲線）
- **タイプ別の色**:
  - Directory子: シアン（`#36adbf`）
  - LeafProduct子: 黄色（`#eab308`）
  - Document子: グレー（`#9ca3af`）
- **太さ**: 3px
- **アニメーション**: なし（animated: false）

#### 動的追従（実装済み）
- カードを移動すると矢印も自動的に追従（React Flow組み込み機能）
- 接続点:
  - 起点: 親の右端の対応する位置（33%/50%/67%）- sourceHandle指定
  - 終点: 子の左端中央（target handle）

#### エッジの保持（実装済み）
- 展開・折りたたみ時にエッジが消えないように`finalEdges`パターンを使用
- setEdges と expandNodeByType/collapseNodeByType を同期的に実行

### 5. 製品セレクター（実装済み）

#### UI
```
┌────────────────────────┐
│ 産業用ポンプ PRD-1000 ▼ │ ← クリックでドロップダウン
└────────────────────────┘
```

#### 機能（実装済み）
- ✅ 現在表示中の製品名を表示
- ✅ クリックでドロップダウンメニュー
- ✅ 製品一覧（allProducts）から選択
- ✅ 切り替え時:
  - キャンバスをクリア（setNodes, setEdges）
  - 新しい製品のルートノードを初期位置に配置（INITIAL_POSITION）
  - 展開状態をリセット

### 6. ツールバー（下部）

#### ツール一覧
```
[▶︎] [✋] [📌] [□] [○] [T] [📊] [👤] [⚙️] [+]
```

1. **選択ツール** `[▶︎]` (デフォルト)
   - カードの選択・移動
   - ショートカット: `V`

2. **手のひらツール** `[✋]`
   - キャンバス移動専用モード
   - ショートカット: `H` または `Space` 長押し

3. **付箋** `[📌]`
   - 色付き付箋を追加（黄、青、緑、赤）
   - テキスト入力可能
   - ドラッグ移動可能

4. **矩形** `[□]`
   - 矩形を描画
   - 色・枠線調整可能

5. **円** `[○]`
   - 円を描画
   - 色・枠線調整可能

6. **テキスト** `[T]`
   - テキストボックス追加
   - フォントサイズ、色調整可能

7. **表** `[📊]`
   - カスタムメモ用の表を追加
   - 行列数調整可能

8. **画像** `[👤]`
   - 画像アップロード
   - ドラッグ＆ドロップ対応

9. **設定** `[⚙️]`
   - グリッド表示切替
   - スナップ機能
   - テーマ切替

10. **追加** `[+]`
    - その他のツール・プラグイン

#### ズームコントロール（右下）
```
[-] [100%] [+] [?]
```
- `[-]`: ズームアウト
- `[100%]`: ズーム倍率表示（クリックで100%に）
- `[+]`: ズームイン
- `[?]`: ヘルプ

### 7. 注釈・書き込み機能

#### 付箋
- **サイズ**: 200px × 150px
- **色**: 黄、青、緑、赤、紫
- **テキスト**: Markdown対応
- **移動**: ドラッグ可能
- **削除**: 選択して`Delete`キー

#### テキストボックス
- **自由配置**: クリックした位置に追加
- **編集**: ダブルクリックで編集モード
- **スタイル**: フォント、サイズ、色、太字、斜体

#### 図形
- **矩形・円**: サイズ調整可能
- **矢印**: カスタム矢印（BOM矢印とは別）
- **線**: 直線、曲線
- **スタイル**: 色、太さ、破線

#### ハイライト
- **カード強調**: 枠を太く、色付き
- **パス強調**: 特定の経路（ルート→末端）を強調表示

### 8. 検索・フィルター

#### 検索機能
```
┌────────────────────┐
│ 🔍 部品名検索      │
└────────────────────┘
```
- **インクリメンタル検索**: 入力に応じてリアルタイムフィルタ
- **ハイライト**: マッチしたカードを黄色枠で強調
- **自動パン**: 最初のマッチにズームイン
- **ナビゲーション**: `↑↓`キーで次/前のマッチに移動

#### フィルター
- **タイプフィルター**: 製品/Assy/SubAssy/LeafProduct
- **表示/非表示**: フィルタ外を半透明表示 or 完全非表示
- **パスハイライト**: ルートから選択ノードまでの経路を強調

#### パスハイライト
```
[パスハイライト: 吸込側配管SubAssy まで]
→ PRD-1000 → ポンプ本体Assy → 吸込側配管SubAssy
  (この経路のカードと矢印を強調表示)
```

### 9. レイアウト自動整列

#### 整列オプション
1. **ツリー状配置** (デフォルト)
   - 左から右、階層ごとに配置
   - Dagreアルゴリズム使用

2. **縦並び整列**
   - 選択した複数カードを縦に等間隔配置

3. **横並び整列**
   - 選択した複数カードを横に等間隔配置

4. **グリッド整列**
   - カードをグリッドに沿って配置

#### 自動レイアウト実行
- 初回表示時: ルートのみ中央配置
- 展開時: 子ノードを自動配置
- 手動調整後: 配置を記憶
- リセット: 「レイアウトをリセット」ボタンで再計算

### 10. コラボレーション（将来機能）

#### リアルタイム編集
- **複数ユーザーのカーソル**: 色分けして表示
- **編集同期**: WebSocketでリアルタイム反映
- **ロック機能**: 編集中のカードをロック

#### コメント
- カードにコメントを付与
- スレッド形式で会話
- 通知機能

#### 共有
- **URLで共有**: 閲覧専用/編集可能
- **埋め込み**: iframeでウェブサイトに埋め込み
- **招待**: メールでチームメンバーを招待

### 11. エクスポート

#### 画像エクスポート
- **PNG**: 現在の表示範囲 or 全体
- **SVG**: ベクター形式で高品質
- **解像度**: 1x, 2x, 3x

#### PDF出力
- **ページ分割**: A4サイズで自動分割
- **全体を1ページ**: 縮小して1ページに収める

#### スナップショット保存
- **キャンバス状態**: JSON形式で保存
- **読み込み**: 保存したスナップショットを復元
- **バージョン管理**: 複数のスナップショットを保存

### 12. 履歴・バージョン管理

#### Undo/Redo
- **ショートカット**: `Cmd/Ctrl + Z` / `Cmd/Ctrl + Shift + Z`
- **対象操作**: カード移動、追加、削除、テキスト編集
- **履歴数**: 50件まで

#### 自動保存
- **頻度**: 30秒ごと
- **保存先**: LocalStorage or サーバー
- **復元**: ページリロード時に自動復元

## MockDataの活用方法

### 既存データ構造の活用

#### BOMノード → セクションカード
```typescript
// 既存のDirectory/LeafProductをそのまま使用
const sectionCard = {
  id: generateUlid(),
  bomNodeId: directory.id, // BomNodeへの参照
  bomNode: directory, // 実際のデータ
  position: { x: 100, y: 100 }, // キャンバス上の座標
  size: { width: 320, height: 'auto' }, // カードサイズ
  isExpanded: false, // 展開状態
};
```

#### 図面・帳票データ
- `directory.documents` → 帳票ギャラリー
- `leafProduct.drawings` → 図面ギャラリー
- `previewImageUrl` → サムネイル表示

#### メタデータテーブル
- `directory.customItems` → カスタム項目
- `directory.directoryTypeName` → タイプ表示
- `directory.name` → ヘッダー表示

### 追加データ構造

#### キャンバス状態
```typescript
interface CanvasState {
  id: string;
  productId: string; // 現在表示中の製品（Directory.id）
  viewport: {
    x: number; // パン位置
    y: number;
    zoom: number; // ズーム倍率（0.25 - 4.0）
  };
  sections: Section[]; // 配置されたセクションカード
  edges: Edge[]; // 矢印
  annotations: Annotation[]; // 注釈・付箋
  createdAt: string;
  updatedAt: string;
}
```

#### セクションカード
```typescript
interface Section {
  id: string;
  bomNodeId: string; // BomNode（Directory/LeafProduct）のID
  bomNodeType: 'directory' | 'leaf-product';
  position: { x: number; y: number };
  size?: { width: number; height: number }; // 省略時は自動計算
  isExpanded: boolean; // 子要素を展開しているか
  style?: {
    backgroundColor?: string;
    borderColor?: string;
    borderWidth?: number;
  };
}
```

#### エッジ（矢印）
```typescript
interface Edge {
  id: string;
  source: string; // 親Section ID
  target: string; // 子Section ID
  quantity?: number; // 数量（BOMに数量情報がある場合）
  style?: {
    strokeColor?: string;
    strokeWidth?: number;
    animated?: boolean; // アニメーション効果
  };
}
```

#### 注釈
```typescript
interface Annotation {
  id: string;
  type: 'text' | 'sticky-note' | 'arrow' | 'rectangle' | 'circle' | 'image';
  position: { x: number; y: number };
  size?: { width: number; height: number };
  content?: string; // テキスト/付箋の内容
  style?: {
    color?: string;
    backgroundColor?: string;
    fontSize?: number;
    fontWeight?: 'normal' | 'bold';
  };
  imageUrl?: string; // 画像タイプの場合
}
```

### レイアウト戦略

#### 初期配置
```typescript
// ルートノードを中央左に配置
const initialPosition = {
  x: 100,
  y: viewportHeight / 2,
};
```

#### 展開時の配置計算
```typescript
function calculateChildPositions(
  parentSection: Section,
  children: BomNode[]
): Position[] {
  const childHeight = 250; // カードの平均高さ
  const verticalGap = 50; // 縦間隔
  const horizontalOffset = 400; // 横間隔

  const totalHeight = children.length * (childHeight + verticalGap) - verticalGap;
  const startY = parentSection.position.y - totalHeight / 2;

  return children.map((child, index) => ({
    x: parentSection.position.x + horizontalOffset,
    y: startY + index * (childHeight + verticalGap),
  }));
}
```

#### 自動レイアウト（Dagre使用）
```typescript
import dagre from 'dagre';

function autoLayout(sections: Section[], edges: Edge[]) {
  const g = new dagre.graphlib.Graph();
  g.setGraph({ rankdir: 'LR', ranksep: 400, nodesep: 50 });

  sections.forEach(section => {
    g.setNode(section.id, { width: 320, height: 250 });
  });

  edges.forEach(edge => {
    g.setEdge(edge.source, edge.target);
  });

  dagre.layout(g);

  // 計算された位置をsectionsに反映
  return sections.map(section => ({
    ...section,
    position: g.node(section.id),
  }));
}
```

## 技術スタック

### 推奨ライブラリ

#### React Flow（最推奨）
```bash
npm install reactflow
```

**選定理由:**
- 無限キャンバス、ズーム、パンが組み込み
- カスタムノード完全対応
- エッジ自動描画・自動追従
- TypeScript完全対応
- パフォーマンス最適化済み
- 活発なコミュニティ

**基本実装例:**
```typescript
import ReactFlow, { Node, Edge } from 'reactflow';
import 'reactflow/dist/style.css';
import SectionCard from './SectionCard';

const nodeTypes = {
  sectionCard: SectionCard,
};

function Home3Page() {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      nodeTypes={nodeTypes}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      fitView
    />
  );
}
```

#### 代替案: Konva + React Konva
```bash
npm install react-konva konva
```

**選定理由:**
- より自由度の高いキャンバス描画
- パフォーマンス優秀
- 複雑な図形描画に強い

**デメリット:**
- エッジ管理を自前で実装する必要
- ズーム・パンも自前実装

### 状態管理

#### Zustand（推奨）
```bash
npm install zustand
```

```typescript
interface CanvasStore {
  sections: Section[];
  edges: Edge[];
  viewport: Viewport;
  addSection: (section: Section) => void;
  updateSection: (id: string, updates: Partial<Section>) => void;
  expandSection: (id: string) => void;
}

const useCanvasStore = create<CanvasStore>((set) => ({
  sections: [],
  edges: [],
  viewport: { x: 0, y: 0, zoom: 1 },
  // ... actions
}));
```

### レイアウトアルゴリズム

#### Dagre
```bash
npm install dagre @types/dagre
```

自動レイアウト計算に使用

### UI コンポーネント

- **shadcn/ui**: 既存のコンポーネントを継続使用
- **lucide-react**: アイコン
- **Tailwind CSS**: スタイリング

## 実装フェーズ

### Phase 1: 基本キャンバス（MVP）
- [x] React Flow セットアップ
- [ ] カスタムSectionCardノード作成
- [ ] 製品セレクター（右上）
- [ ] ルートノード表示
- [ ] +ボタンで子ノード展開
- [ ] 矢印自動描画

**成果物:** ルートから1階層展開できる

### Phase 2: 階層展開
- [ ] 再帰的展開（SubAssy → LeafProduct）
- [ ] 折りたたみ機能
- [ ] 自動レイアウト（Dagre）
- [ ] カード移動＆配置記憶
- [ ] ミニマップ

**成果物:** 全階層を自由に展開・折りたたみ可能

### Phase 3: 注釈・ツールバー
- [ ] ツールバーUI
- [ ] 付箋追加
- [ ] テキスト追加
- [ ] 図形追加（矩形、円）
- [ ] 選択・削除

**成果物:** キャンバスに自由に書き込み可能

### Phase 4: 検索・フィルター
- [ ] 検索機能
- [ ] タイプフィルター
- [ ] パスハイライト
- [ ] ハイライト表示

**成果物:** 大規模BOMでも目的のノードを素早く発見

### Phase 5: エクスポート・保存
- [ ] PNG/SVGエクスポート
- [ ] スナップショット保存（LocalStorage）
- [ ] 自動保存
- [ ] Undo/Redo

**成果物:** 作業内容を保存・共有可能

### Phase 6: コラボレーション（将来）
- [ ] WebSocketサーバー
- [ ] リアルタイム編集同期
- [ ] 複数ユーザーカーソル
- [ ] コメント機能

**成果物:** チームでの共同作業

## 驚くべきポイント・価値提案

### 1. 視覚的な関係性把握
- ツリー表示: 縦スクロールで全体が見えにくい
- Home3: 空間的配置で一目瞭然

### 2. 柔軟な探索
- 必要な部分だけ+ボタンで深堀り
- 不要な部分は折りたたんでスッキリ

### 3. プレゼンテーション
- そのまま会議で使える
- 注釈を加えて説明
- スクリーンショット共有

### 4. 比較分析
- 複数ブランチを横に並べて比較
- 代替案の検討が視覚的に

### 5. 自由な配置
- 重要な部分を大きく表示
- メモや図解を自由に追加
- ホワイトボード感覚

### 6. 既存データの再活用
- mockIndustrialPumpDataをそのまま使用
- home1/home2との互換性維持
- データ構造の変更不要

## 懸念点と解決策

### 1. パフォーマンス
**問題:** 大規模BOM（1000+ノード）では重くなる可能性

**解決策:**
- React Flowの仮想化機能を活用
- 表示範囲外のノードは簡略表示
- LOD（Level of Detail）: ズームアウト時は詳細を省略
- 遅延ロード: 展開時に子ノードを動的に取得

### 2. レイアウトの複雑さ
**問題:** 自動配置が見づらくなる可能性

**解決策:**
- 複数のレイアウトアルゴリズムを用意
- 手動調整を許可
- レイアウトリセット機能
- テンプレート保存

### 3. データ永続化
**問題:** キャンバス状態の保存が必要

**解決策:**
- LocalStorage: クライアントサイド保存（MVP）
- データベース: サーバーサイド保存（本番）
- エクスポート/インポート機能

### 4. 学習コスト
**問題:** 新しいUIパラダイムの習得

**解決策:**
- オンボーディングチュートリアル
- ツールチップでヒント表示
- デモ動画
- サンプルキャンバス

### 5. モバイル対応
**問題:** タッチ操作の最適化

**解決策:**
- ピンチズーム対応
- 2本指スクロール
- タッチジェスチャー最適化
- レスポンシブツールバー

## 次のステップ

### 即座に開始可能なタスク

1. **環境セットアップ**
   ```bash
   npm install reactflow dagre @types/dagre
   ```

2. **ディレクトリ作成**
   ```
   src/page-components/bom/home3/
   ├── ui/
   │   ├── Home3Page.tsx
   │   ├── SectionCard.tsx
   │   ├── Toolbar.tsx
   │   ├── ProductSelector.tsx
   │   └── components/
   │       ├── MetadataTable.tsx
   │       ├── GalleryThumbnails.tsx
   │       └── ExpandButton.tsx
   └── lib/
       ├── useCanvasStore.ts
       ├── layoutUtils.ts
       └── canvasTypes.ts
   ```

3. **プロトタイプ実装**
   - React Flow基本セットアップ
   - カスタムSectionCardノード
   - 産業用ポンプPRD-1000をルートノードとして表示
   - +ボタンで子Assyを3つ展開

4. **デザイン検討**
   - SectionCardのデザイン詳細化
   - ツールバーアイコン選定
   - カラースキーム決定

### ディスカッション事項

1. **Phase 1のスコープ確認**
   - どこまでをMVPとするか？
   - デモ可能なレベルはどこか？

2. **データ保存方針**
   - 初期はLocalStorageで十分か？
   - サーバーサイド保存は必須か？

3. **注釈機能の優先度**
   - Phase 1に含めるか？
   - 後回しでよいか？

4. **レイアウトアルゴリズム**
   - Dagre自動レイアウトで十分か？
   - 他のアルゴリズムも検討すべきか？

## まとめ

BOM Home3は、従来のツリー表示（home1/home2）とは全く異なる、視覚的・探索的なBOM管理UIです。FigJam/Miroの使い勝手と製造業のドメイン知識を組み合わせることで、より直感的で柔軟な製品構成管理を実現します。

**最大の価値:**
- 空間的配置による直感的理解
- タイプ別展開による柔軟な探索
- 自由な配置とリサイズ
- プレゼンテーション・コラボレーションへの応用
- 既存データ構造の再活用

**実装済みの主要機能（Phase 1-3完了）:**
- ✅ React Flow無限キャンバス
- ✅ タイプ別（Directory/LeafProduct/Document）のセクションカード
- ✅ タイプ別の展開ボタン（最大3つ縦並び）
- ✅ タイプ別の色分け（エッジも含む）
- ✅ Top-align配置アルゴリズム
- ✅ 自動整列（展開・折りたたみ時）
- ✅ ノードリサイズとサイズ記憶
- ✅ エッジの保持（展開・折りたたみでも消えない）
- ✅ 製品セレクター

**次のフェーズ（Phase 4）:**
- ⬜ 整列ボタン（手動整列トリガー）
- ⬜ ツールバー
- ⬜ 注釈・書き込み機能
- ⬜ 検索・フィルター
- ⬜ エクスポート機能

---

**作成日:** 2025-11-10
**更新日:** 2025-11-11
**ステータス:** Phase 1-3 実装完了、Phase 4 未実装
**次のアクション:** Phase 4機能の優先順位決定と実装
