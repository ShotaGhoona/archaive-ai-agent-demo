# V2 Sidebar - フレキシブルフォルダシステム

## 概要

V2 Sidebarは、アーカイブv2.1のフレキシブルフォルダシステムの中核コンポーネントです。macのFinderのように、企業が自由に階層構造を構築できるマルチカラムサイドバーを提供します。

## 背景・目的

中小企業製造業のDXにおいて、企業ごとに大きく異なるワークフローに対応するため開発されました：

- **パターン1**: 案件概念なし、図面のみの管理
- **パターン2**: 案件 → 図面の2階層管理  
- **パターン3**: 案件 → 製品 → パーツの3階層管理

固定的な階層構造では対応できないこれらの多様なニーズに、動的なフォルダ構造で応えます。

## 主な機能

### 1. マルチカラムUI
- **動的カラム表示**: フォルダクリックで右側に新しいカラムを展開
- **カラム折りたたみ**: 各カラムを個別に折りたたみ可能
- **選択状態管理**: 現在選択中のアイテムをハイライト表示

### 2. アイテム管理
- **動的追加**: フォルダ・ページを右クリックまたはPlusボタンで追加
- **ドラッグ＆ドロップ**: アイテムの並び替えが可能
- **編集・削除**: 各アイテムのコンテキストメニューから操作

### 3. アイテムタイプ
- **フォルダー**: 階層構造を作るコンテナ
- **図面ページ**: 図面管理用のページ
- **案件基本情報ページ**: 案件の基本データ管理
- **見積書ページ**: 見積書作成・管理
- **納期ページ**: 納期管理
- **検査ページ**: 品質検査データ管理
- **カスタムページ**: 企業独自のページタイプ

## ファイル構成

```
src/widgets/v2-sidebar/
├── init-data/
│   └── v2-sidebar.tsx       # 初期データとアイテムタイプ定義
├── lib/
│   ├── columnLogic.ts       # カラム操作ロジック
│   ├── dragDropLogic.ts     # ドラッグ&ドロップ処理
│   └── sidebarUtils.ts      # ユーティリティ関数
├── model/
│   └── types.ts             # TypeScript型定義
├── ui/
│   ├── NewItemDialog.tsx    # 新規アイテム追加ダイアログ
│   └── sidebar.tsx          # メインコンポーネント
└── README.md
```

## 技術仕様

### コアコンポーネント

#### V2Sidebar (`ui/sidebar.tsx`)
メインのサイドバーコンポーネント。状態管理、イベントハンドリング、UI レンダリングを担当。

#### NewItemDialog (`ui/NewItemDialog.tsx`)  
新規アイテム追加用のモーダルダイアログ。アイテムタイプとアイコンカラーの選択機能付き。

### ロジック層

#### columnLogic.ts
- `handleItemClick`: アイテムクリック時のカラム展開処理
- `handleColumnToggle`: カラム折りたたみ処理
- `updateColumnsAfterAdd/Delete`: アイテム追加・削除後のカラム更新

#### dragDropLogic.ts  
- ドラッグ開始、ドラッグオーバー、ドロップ処理
- アイテムの並び替え機能

#### sidebarUtils.ts
- `findItemById`: ID による再帰的アイテム検索
- `addItemToTree/deleteItemFromTree`: ツリー構造への追加・削除
- `generateId`: ユニークID生成

### データ型

#### V2SidebarItem
```typescript
interface V2SidebarItem {
  id: string;
  name: string;
  type: 'folder' | 'blueprint' | 'project-info' | 'quotation' | 'delivery' | 'inspection' | 'custom';
  icon: React.ReactNode;
  iconColor: string;
  children?: V2SidebarItem[];
  parentId?: string;
}
```

#### Column
```typescript
interface Column {
  id: string;
  items: V2SidebarItem[];
  selectedItemId?: string;
  parentItem?: V2SidebarItem;
  isCollapsed?: boolean;
}
```

## 使用方法

```tsx
import { V2Sidebar } from './src/widgets/v2-sidebar/ui/sidebar';

function App() {
  return (
    <div className="flex">
      <V2Sidebar />
      <main>{/* メインコンテンツ */}</main>
    </div>
  );
}
```

## 期待効果

このシステムにより：
- **柔軟性**: 企業規模や業務フローに関係なく最適化されたワークフローを構築
- **直感性**: Finderライクな操作で学習コストを最小化
- **拡張性**: 新しいページタイプやワークフローの追加が容易
- **統一性**: テンプレートシステムによる一貫したユーザー体験

中小企業製造業のDX推進において、真に使いやすい業務管理システムの基盤となることを目指しています。