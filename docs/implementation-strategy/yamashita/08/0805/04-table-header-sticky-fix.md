# テーブルヘッダー固定の実装

## 問題の概要

BasicDataTableコンポーネントで`sticky top-0`を適用していたにも関わらず、テーブルヘッダーが正しく固定されない問題がありました。

## 根本原因の分析

### 問題のあった構造（修正前）

```jsx
<div className='flex min-h-0 flex-1 flex-col'>
  {' '}
  {/* BasicDataTable */}
  <div className='flex-1 overflow-auto'>
    {' '}
    {/* スクロールコンテナ */}
    <Table>
      {' '}
      {/* shadcn/ui Table */}
      <div className='relative w-full overflow-x-auto'>
        {' '}
        {/* Table内のwrapper */}
        <table className='w-full caption-bottom text-sm'>
          <thead className='sticky top-0 z-50 bg-white'>
            {' '}
            {/* ❌ 効かない */}
            ...
          </thead>
          <tbody>...</tbody>
        </table>
      </div>
    </Table>
  </div>
</div>
```

### 問題の原因

1. **スクロールコンテナと sticky 要素の階層問題**
   - `overflow-auto` が適用されている要素と `thead` の間に複数の要素が介在
   - `position: sticky` は最も近いスクロール可能な親要素に対して固定されるが、構造上正しく適用されない

2. **shadcn/ui Table コンポーネントの制約**
   - Table コンポーネントが内部で `div` ラッパーを作成し、`overflow-x-auto` を適用
   - この中間レイヤーが sticky の適用を阻害

3. **CSS の sticky 動作条件違反**
   - sticky 要素はスクロールコンテナの直接の子要素である必要がある
   - 現在の構造では、この条件を満たしていない

## 解決策

### 修正後の構造

```jsx
<div className='flex min-h-0 flex-1 flex-col'>
  {' '}
  {/* BasicDataTable */}
  <div className='relative flex-1 overflow-auto'>
    {' '}
    {/* スクロールコンテナ */}
    <table className='w-full caption-bottom text-sm'>
      {' '}
      {/* 直接table要素 */}
      <thead className='sticky top-0 z-50 border-b bg-white shadow-sm backdrop-blur-sm'>
        {' '}
        {/* ✅ 正常動作 */}
        ...
      </thead>
      <tbody>...</tbody>
    </table>
  </div>
</div>
```

### 主な変更点

1. **shadcn/ui Table コンポーネントの削除**
   - 直接 `table` 要素を使用することで、中間レイヤーを排除
   - スクロールコンテナとstickyヘッダーの直接の親子関係を確立

2. **スクロールコンテナの最適化**
   - `overflow-auto` を `table` 要素の直接の親に配置
   - `relative` positioning を追加して、sticky の基準点を明確化

3. **ヘッダーのスタイリング強化**
   - `backdrop-blur-sm`: スクロール時の視覚的な分離効果
   - `border-b`: ヘッダーとボディの境界を明確化
   - `shadow-sm`: ヘッダーの浮遊感を演出

## 実装詳細

### 修正されたファイル

- `src/shared/basic-data-table/ui/BasicDataTable.tsx`

### 変更内容

```typescript
// 修正前のインポート
import {
  Table,          // ❌ 削除
  TableBody,
  TableHeader,
  TableRow,
} from '@/shared/shadcnui';

// 修正後のインポート
import {
  TableBody,
  TableHeader,
  TableRow,
} from '@/shared/shadcnui';

// JSX構造の変更
return (
  <div className={`flex-1 flex flex-col min-h-0 ${className}`}>
    {/* スクロールコンテナを移動し、table要素の直接の親にする */}
    <div className="flex-1 relative overflow-auto">
      <table className="w-full caption-bottom text-sm">
        {/* 固定ヘッダー - スクロールコンテナの直接の子要素として正しく固定される */}
        <TableHeader className="sticky top-0 bg-white z-50 shadow-sm border-b backdrop-blur-sm">
          {/* ... */}
        </TableHeader>
        <TableBody>
          {/* ... */}
        </TableBody>
      </table>
    </div>
    {/* ページネーション */}
  </div>
);
```

## CSS の sticky 動作原理

### 正しい sticky の適用条件

1. **親要素にスクロール可能領域が存在**
   - `overflow: auto`, `overflow: scroll`, `overflow: hidden` のいずれかが設定されている

2. **sticky要素がスクロールコンテナの直接の子要素**
   - 中間にblockレベル要素が存在しないこと

3. **sticky要素に明確な位置指定**
   - `top`, `bottom`, `left`, `right` のいずれかが指定されている

4. **親要素の高さが十分に確保されている**
   - スクロールが発生する十分なコンテンツ量

### 今回の修正による効果

- ✅ スクロール時にヘッダーが画面上部に固定される
- ✅ ヘッダーとコンテンツの視覚的分離が明確
- ✅ 水平・垂直スクロール両方に対応
- ✅ レスポンシブデザインを維持
- ✅ 既存のレイアウト構造（`h-[calc(100vh-45px)]`）との互換性

## テスト項目

実装後は以下の動作を確認：

1. **縦スクロール時のヘッダー固定**
   - テーブルを下にスクロールしてもヘッダーが上部に残る

2. **横スクロール時の動作**
   - 列幅が画面幅を超える場合の水平スクロール

3. **ページネーションとの連携**
   - ページ切り替え時のヘッダー表示

4. **リサイズ・編集機能**
   - 既存の列リサイズ・セル編集機能が正常動作

5. **複数テーブルでの一貫性**
   - Blueprint、Customer、Projectの全テーブルで同様に動作

## 注意事項

- shadcn/ui の `Table` コンポーネントを使用しなくなったため、将来的なupdateの影響は限定的
- 直接 `table` 要素を使用しているが、shadcn/uiの `TableHeader`, `TableBody`, `TableRow` コンポーネントは引き続き使用してスタイリングの一貫性を維持
- `backdrop-blur-sm` は比較的新しいCSS機能のため、古いブラウザでは代替スタイリングが適用される
