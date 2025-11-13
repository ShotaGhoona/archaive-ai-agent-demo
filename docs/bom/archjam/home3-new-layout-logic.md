# Home3 新座標計算ロジック設計

## 基本方針

### 座標系
- **完全に左上座標 (x, y) を使用**
- React Flowの中央座標は使用しない
- すべての計算は左上基準で行う

### 展開状態の再帰的考慮
- 展開済みの子のみサブツリー計算に含める
- 子が展開している場合、さらにその孫も再帰的に計算
- 折りたたまれているノードのサブツリーサイズは0

---

## データ構造

### Section のプロパティ

```typescript
interface SectionMetrics {
  // 基本プロパティ
  id: string;
  x: number;  // 左上のX座標
  y: number;  // 左上のY座標
  width: number;  // 自身の幅（リサイズ可能）
  height: number; // 自身の高さ（リサイズ可能）
  isExpanded: boolean; // 展開状態

  // 計算プロパティ
  subtreeWidth: number;  // サブツリー全体の幅（計算）
  subtreeHeight: number; // サブツリー全体の高さ（計算）
}
```

---

## 計算関数

### 1. ノードサイズ取得

```typescript
/**
 * ノードの幅を取得
 * 優先順位: style.width → measured.width → 初期推定値
 */
function getNodeWidth(node: Node): number {
  if (node.style?.width && typeof node.style.width === 'number') {
    return node.style.width;
  }
  if (node.measured?.width) {
    return node.measured.width;
  }
  return estimateInitialWidth(node.data.bomNode);
}

/**
 * ノードの高さを取得
 * 優先順位: style.height → measured.height → 初期推定値
 */
function getNodeHeight(node: Node): number {
  if (node.style?.height && typeof node.style.height === 'number') {
    return node.style.height;
  }
  if (node.measured?.height) {
    return node.measured.height;
  }
  return estimateInitialHeight(node.data.bomNode);
}
```

### 2. サブツリーサイズ計算（再帰的、展開状態考慮）

```typescript
/**
 * サブツリー全体の高さを計算
 * 展開済みの子のみを再帰的に含める
 */
function calculateSubtreeHeight(node: Node, allNodes: Node[]): number {
  const nodeHeight = getNodeHeight(node);

  // 展開されていない、または子がいない場合
  if (!node.data.isExpanded) {
    return nodeHeight;
  }

  const children = getExpandedChildren(node, allNodes);
  if (children.length === 0) {
    return nodeHeight;
  }

  // 各子のサブツリー高さを再帰的に計算
  const childSubtreeHeights = children.map(child =>
    calculateSubtreeHeight(child, allNodes)
  );

  // 子のサブツリー合計高さ + 兄弟間Gap
  const childrenTotalHeight =
    childSubtreeHeights.reduce((sum, h) => sum + h, 0) +
    (children.length - 1) * VERTICAL_GAP;

  // 自身の高さと子の合計高さの大きい方
  return Math.max(nodeHeight, childrenTotalHeight);
}

/**
 * サブツリー全体の幅を計算
 * 展開済みの子のみを再帰的に含める
 */
function calculateSubtreeWidth(node: Node, allNodes: Node[]): number {
  const nodeWidth = getNodeWidth(node);

  // 展開されていない、または子がいない場合
  if (!node.data.isExpanded) {
    return nodeWidth;
  }

  const children = getExpandedChildren(node, allNodes);
  if (children.length === 0) {
    return nodeWidth;
  }

  // 子のサブツリー幅の最大値を再帰的に取得
  const maxChildSubtreeWidth = Math.max(
    ...children.map(child => calculateSubtreeWidth(child, allNodes))
  );

  // 自身の幅 + 親子Gap + 子のサブツリー最大幅
  return nodeWidth + HORIZONTAL_GAP + maxChildSubtreeWidth;
}

/**
 * 展開済みの子ノードのみを取得
 */
function getExpandedChildren(node: Node, allNodes: Node[]): Node[] {
  const childBomNodes = getChildNodes(node.data.bomNode);
  return childBomNodes
    .map(childBomNode => allNodes.find(n => n.id === childBomNode.id))
    .filter((n): n is Node => n !== undefined);
}
```

### 3. Gap計算関数

```typescript
/**
 * 親子間のGap
 */
function calculateHorizontalGap(parentNode: Node, childNode: Node): number {
  // 固定Gap（将来的に親のサイズに応じて調整可能）
  return HORIZONTAL_GAP; // 300
}

/**
 * 兄弟間のGap
 */
function calculateVerticalGap(upperSibling: Node, lowerSibling: Node): number {
  // 固定Gap（将来的にノードサイズに応じて調整可能）
  return VERTICAL_GAP; // 100
}
```

### 4. 整列ロジック（左上座標基準）

```typescript
/**
 * ノード階層を再帰的に整列
 * すべて左上座標で計算
 */
function alignHierarchy(
  node: Node,
  parentLeftX: number,
  parentTopY: number,
  parentWidth: number,
  parentHeight: number,
  isRoot: boolean,
  allNodes: Node[]
): Map<string, { x: number; y: number }> {
  const positions = new Map<string, { x: number; y: number }>();

  // 現在のノードの左上座標
  const currentLeftX = isRoot
    ? parentLeftX
    : parentLeftX + parentWidth + calculateHorizontalGap(parent, node);
  const currentTopY = parentTopY;

  positions.set(node.id, { x: currentLeftX, y: currentTopY });

  // 子がいない、または展開されていない場合は終了
  if (!node.data.isExpanded) {
    return positions;
  }

  const children = getExpandedChildren(node, allNodes);
  if (children.length === 0) {
    return positions;
  }

  // 現在のノードのサイズ
  const currentWidth = getNodeWidth(node);
  const currentHeight = getNodeHeight(node);

  // 各子のサブツリー高さを計算
  const childSubtreeHeights = children.map(child =>
    calculateSubtreeHeight(child, allNodes)
  );

  // 親の上端 = 長男の上端（top-align）
  const parentTop = currentTopY;
  const firstChildTop = parentTop;

  // 各子を配置
  let currentChildTop = firstChildTop;
  children.forEach((child, index) => {
    const childHeight = getNodeHeight(child);

    // 子の左上座標
    const childTopY = currentChildTop;

    // 再帰的に子を配置
    const childPositions = alignHierarchy(
      child,
      currentLeftX,
      childTopY,
      currentWidth,
      currentHeight,
      false,
      allNodes
    );

    // 結果をマージ
    childPositions.forEach((pos, id) => {
      positions.set(id, pos);
    });

    // 次の兄弟の上端 = 現在の子の上端 + サブツリー高さ + 兄弟Gap
    currentChildTop += childSubtreeHeights[index] + calculateVerticalGap(child, children[index + 1]);
  });

  return positions;
}
```

### 5. React Flow座標への変換

```typescript
/**
 * 左上座標からReact Flowの中央座標に変換
 * React Flowへの最終出力時のみ使用
 */
function topLeftToCenterPosition(
  topLeftX: number,
  topLeftY: number,
  width: number,
  height: number
): { x: number; y: number } {
  return {
    x: topLeftX + width / 2,
    y: topLeftY + height / 2,
  };
}

/**
 * React Flowの中央座標から左上座標に変換
 * 入力データ読み込み時のみ使用
 */
function centerToTopLeftPosition(
  centerX: number,
  centerY: number,
  width: number,
  height: number
): { x: number; y: number } {
  return {
    x: centerX - width / 2,
    y: centerY - height / 2,
  };
}
```

### 6. 全体整列関数

```typescript
/**
 * すべてのノードを整列
 */
function alignAllNodes(nodes: Node[]): Node[] {
  if (nodes.length === 0) return nodes;

  // ルートノードを見つける（親がいないノード）
  const rootNode = findRootNode(nodes);
  if (!rootNode) return nodes;

  // ルートノードの左上座標を取得
  const rootWidth = getNodeWidth(rootNode);
  const rootHeight = getNodeHeight(rootNode);
  const rootTopLeft = centerToTopLeftPosition(
    rootNode.position.x,
    rootNode.position.y,
    rootWidth,
    rootHeight
  );

  // 階層を整列（左上座標で計算）
  const topLeftPositions = alignHierarchy(
    rootNode,
    rootTopLeft.x,
    rootTopLeft.y,
    0,
    0,
    true,
    nodes
  );

  // React Flowの中央座標に変換して適用
  return nodes.map(node => {
    const topLeft = topLeftPositions.get(node.id);
    if (!topLeft) return node;

    const width = getNodeWidth(node);
    const height = getNodeHeight(node);
    const centerPos = topLeftToCenterPosition(topLeft.x, topLeft.y, width, height);

    return {
      ...node,
      position: centerPos,
    };
  });
}
```

### 7. エッジ接続点の計算

```typescript
/**
 * 親ノードの右端中央（エッジの始点）
 */
function getParentEdgeSourcePoint(node: Node): { x: number; y: number } {
  const width = getNodeWidth(node);
  const height = getNodeHeight(node);

  // React Flowの中央座標から計算
  return {
    x: node.position.x + width / 2,  // 右端
    y: node.position.y,              // 中央（React Flowは既に中央）
  };
}

/**
 * 子ノードの左端中央（エッジの終点）
 */
function getChildEdgeTargetPoint(node: Node): { x: number; y: number } {
  const width = getNodeWidth(node);
  const height = getNodeHeight(node);

  return {
    x: node.position.x - width / 2,  // 左端
    y: node.position.y,              // 中央
  };
}
```

---

## 定数

```typescript
const HORIZONTAL_GAP = 300; // 親子間の横間隔
const VERTICAL_GAP = 100;   // 兄弟間の縦間隔
const INITIAL_ROOT_POSITION = { x: 100, y: 300 }; // ルートノードの左上座標
```

---

## 実装の流れ

### 1. 展開時
```typescript
// expandNode() 内
const newNodes = childNodes.map((child, index) => {
  const size = calculateInitialNodeSize(child);

  // 左上座標で計算（仮配置）
  const tempTopLeft = { x: parentX + parentWidth + HORIZONTAL_GAP, y: parentY };

  // React Flow用に中央座標に変換
  const centerPos = topLeftToCenterPosition(
    tempTopLeft.x,
    tempTopLeft.y,
    size.width,
    size.height
  );

  return {
    id: child.id,
    type: 'sectionCard',
    position: centerPos,
    data: { ... },
    style: { width: size.width, height: size.height },
  };
});

// 展開後、自動的に整列
const alignedNodes = alignAllNodes([...currentNodes, ...newNodes]);
return { nodes: alignedNodes, edges: updatedEdges };
```

### 2. 整列ボタン押下時
```typescript
const handleAlign = useCallback(() => {
  setNodes(nds => alignAllNodes(nds));
}, [setNodes]);
```

### 3. SectionCard の +ボタン位置
```typescript
// SectionCard.tsx
function SectionCard({ data, selected }: SectionCardProps) {
  // カードサイズを取得（親から渡される style または測定値）
  const cardWidth = /* style.width または measured.width */;
  const cardHeight = /* style.height または measured.height */;

  // +ボタンの位置（右端中央）
  // カードの左上が原点なので
  const buttonStyle = {
    position: 'absolute',
    left: cardWidth,           // 右端
    top: cardHeight / 2,       // 中央
    transform: 'translate(-50%, -50%)', // 中央揃え調整
  };

  return (
    <div className="relative w-full h-full">
      {/* カード本体 */}
      <div className="...">...</div>

      {/* +ボタン */}
      {hasChildren && (
        <button style={buttonStyle} onClick={onExpand}>
          {isExpanded ? <Minus /> : <Plus />}
        </button>
      )}
    </div>
  );
}
```

---

## 重要なポイント

### ✅ 完全左上座標系
- すべての内部計算は左上座標で行う
- React Flowとのやり取り時のみ中央座標に変換
- 変換関数は明確に分離

### ✅ 展開状態の再帰的考慮
- `isExpanded` が `false` ならサブツリーサイズは0
- 展開済みの子のみを取得して再帰計算
- 孫、ひ孫も同様に再帰的に考慮

### ✅ リサイズ対応
- `style.width/height` を最優先で使用
- 整列時に常に最新のサイズを取得
- ユーザーのリサイズが即座に反映

### ✅ Gap関数
- 将来的な拡張性のため関数化
- 現在は固定値を返すが、後でロジック追加可能

### ✅ エッジ接続点
- ノードの実際のサイズに基づいて計算
- 右端中央 → 左端中央の正確な接続

---

## 次のステップ

1. `alignLogic.ts` を完全書き換え（左上座標系）
2. `expandLogic.ts` の展開後に `alignAllNodes()` を呼び出し
3. `SectionCard.tsx` の+ボタン位置を左上座標で計算
4. React Flow座標変換の一元管理
5. テスト・デバッグ
