# Resizable Layout

2つのパネルをマウスドラッグでリサイズできるレイアウトコンポーネントです。水平・垂直の両方向に対応し、ドラッグハンドルによる直感的な操作が可能です。

## 使用場面

- **画面分割レイアウト**: エディタ＋プレビュー、ファイルリスト＋コンテンツなど
- **サイドバー付きレイアウト**: メインコンテンツ＋詳細パネル
- **上下分割レイアウト**: ヘッダー＋コンテンツ、チャット＋入力エリアなど

## 基本的な使い方

**⚠️ 重要: 設定ファイルは必ず`lib`ディレクトリに配置してください**

### 1. 設定ファイルの作成

`lib/***ResizableLayoutConfig.ts`にConfig設定を定義します（ファイル名は用途に応じて命名）：

```typescript
// src/page-components/project/example/lib/exampleResizableLayoutConfig.ts
import { ResizableLayoutConfig } from "@/features";

export const exampleResizableLayoutConfig: ResizableLayoutConfig = {
  direction: 'horizontal',
  panels: [
    { initialWidth: 60, minWidth: 20, maxWidth: 80 },
    { initialWidth: 40, minWidth: 20, maxWidth: 80 }
  ]
} as const;
```

### 2. コンポーネントでの使用

```tsx
import { ResizableLayout, ResizablePanel, ResizableHandle } from '@/features/resizable-layout';
import { exampleResizableLayoutConfig } from '../lib';

function MyComponent() {
  return (
    <ResizableLayout config={exampleResizableLayoutConfig} className="h-full">
      <ResizablePanel index={0}>
        <div>左側コンテンツ</div>
      </ResizablePanel>
      
      <ResizableHandle />
      
      <ResizablePanel index={1}>
        <div>右側コンテンツ</div>
      </ResizablePanel>
    </ResizableLayout>
  );
}
```

## Config設定項目

### ResizableLayoutConfig

```typescript
interface ResizableLayoutConfig {
  direction: 'horizontal' | 'vertical';  // リサイズ方向
  panels: [PanelConfig, PanelConfig];     // 2つのパネル設定
}
```

### PanelConfig

| プロパティ | 型 | 説明 | デフォルト |
|-----------|---|------|----------|
| `initialWidth` | `number?` | 水平方向の初期サイズ（%） | 50 |
| `minWidth` | `number?` | 水平方向の最小サイズ（%） | 10 |
| `maxWidth` | `number?` | 水平方向の最大サイズ（%） | 90 |
| `initialHeight` | `number?` | 垂直方向の初期サイズ（%） | 50 |
| `minHeight` | `number?` | 垂直方向の最小サイズ（%） | 10 |
| `maxHeight` | `number?` | 垂直方向の最大サイズ（%） | 90 |

**注意**: `direction`に応じて適切なプロパティを設定してください
- `horizontal`: `initialWidth`, `minWidth`, `maxWidth`
- `vertical`: `initialHeight`, `minHeight`, `maxHeight`

## 設定例

### 水平分割（エディタ風）

```typescript
// lib/editorResizableLayoutConfig.ts
export const editorResizableLayoutConfig: ResizableLayoutConfig = {
  direction: 'horizontal',
  panels: [
    { initialWidth: 70, minWidth: 30, maxWidth: 90 }, // エディタ
    { initialWidth: 30, minWidth: 10, maxWidth: 70 }  // プレビュー
  ]
} as const;
```

### 垂直分割（チャット風）

```typescript
// lib/chatResizableLayoutConfig.ts
export const chatResizableLayoutConfig: ResizableLayoutConfig = {
  direction: 'vertical',
  panels: [
    { initialHeight: 80, minHeight: 50, maxHeight: 95 }, // メッセージエリア
    { initialHeight: 20, minHeight: 5, maxHeight: 50 }   // 入力エリア
  ]
} as const;
```

### 固定サイドバー風

```typescript
// lib/sidebarResizableLayoutConfig.ts
export const sidebarResizableLayoutConfig: ResizableLayoutConfig = {
  direction: 'horizontal',
  panels: [
    { initialWidth: 20, minWidth: 15, maxWidth: 40 }, // サイドバー
    { initialWidth: 80, minWidth: 60, maxWidth: 85 }  // メインコンテンツ
  ]
} as const;
```

## 技術的特徴

- **Context API**: パネル間の状態共有にReact Contextを使用
- **パーセンテージベース**: レスポンシブ対応で、親要素のサイズに自動追従
- **制約チェック**: 最小・最大サイズの制約を自動適用
- **マウスイベント**: ドキュメント全体でのマウス追跡により、スムーズなドラッグ操作
- **TailwindCSS**: スタイリングにTailwindCSSを使用、カスタマイズ可能

## 注意事項

- パネルは必ず2つのみ対応
- `ResizablePanel`の`index`は`0`または`1`のみ
- `ResizableHandle`は`ResizableLayout`内に配置する必要があります
- 親要素に適切な高さ・幅を設定してください（`h-full`など）
- **設定ファイルは必ず`lib/***ResizableLayoutConfig.ts`に配置してください** - コンポーネント内でのインライン定義は避けてください