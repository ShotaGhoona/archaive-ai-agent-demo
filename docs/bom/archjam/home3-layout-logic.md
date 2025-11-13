# Home3 座標計算ロジック解析

## 現在の実装状況

### 1. 展開時の座標計算 (`layoutUtils.ts`)

#### 使用される関数
```typescript
calculateChildPositions(parentPosition, childCount): Position[]
```

#### 計算ロジック
```typescript
const SECTION_WIDTH = 400;      // 固定値
const SECTION_HEIGHT = 200;     // 固定値
const HORIZONTAL_GAP = 300;
const VERTICAL_GAP = 100;

// 子のX座標
const childX = parentPosition.x + SECTION_WIDTH + HORIZONTAL_GAP;

// 全体の高さ（全て同じ高さと仮定）
const totalHeight = childCount * SECTION_HEIGHT + (childCount - 1) * VERTICAL_GAP;

// 親の中央を基準に上下に配置
const startY = parentPosition.y - totalHeight / 2 + SECTION_HEIGHT / 2;

// 各子の位置
return [{
  x: childX,
  y: startY + index * (SECTION_HEIGHT + VERTICAL_GAP)
}];
```

#### 問題点
- ❌ **固定サイズ定数を使用**（SECTION_WIDTH=400, SECTION_HEIGHT=200）
- ❌ **実際のノードサイズを無視**
- ❌ **親ノードの実際の幅を考慮しない**
- ❌ **各子ノードの実際の高さを考慮しない**
- ❌ **リサイズ後のサイズが反映されない**

---

### 2. 整列時の座標計算 (`alignLogic.ts`)

#### 使用される関数
```typescript
alignAllNodes(nodes): Node[]
  ↓
buildHierarchy(nodeId, allNodes): NodeHierarchy
  ↓
alignHierarchy(hierarchy, parentX, parentY, parentWidth, parentHeight, isRoot): Map<id, position>
  ↓
calculateSubtreeHeight(hierarchy): number
```

#### 計算ロジック

**ノードサイズ取得（優先順位）:**
```typescript
getNodeHeight(node): number {
  if (node.style?.height) return node.style.height;  // 1. ユーザーリサイズ
  if (node.measured?.height) return node.measured.height; // 2. React Flow測定値
  return estimateNodeHeight(node.data.bomNode); // 3. コンテンツから予測
}

getNodeWidth(node): number {
  if (node.style?.width) return node.style.width;  // 1. ユーザーリサイズ
  if (node.measured?.width) return node.measured.width; // 2. React Flow測定値
  return (帳票あり ? 650 : 400); // 3. デフォルト
}
```

**サブツリー高さ計算:**
```typescript
calculateSubtreeHeight(hierarchy): number {
  const nodeHeight = getNodeHeight(hierarchy.node);

  if (子なし) {
    return nodeHeight;
  }

  // 子のサブツリー高さを再帰的に計算
  const childSubtreeHeights = hierarchy.children.map(child =>
    calculateSubtreeHeight(child)
  );

  // 子の合計高さ + ギャップ
  const childrenTotalHeight =
    sum(childSubtreeHeights) + (childCount - 1) * VERTICAL_GAP;

  // 自身の高さと子の合計の大きい方
  return Math.max(nodeHeight, childrenTotalHeight);
}
```

**座標計算:**
```typescript
alignHierarchy(...) {
  // 現在のノードの位置
  const currentX = isRoot ? parentX : parentX + parentWidth + HORIZONTAL_GAP;
  const currentY = parentY;

  positions.set(hierarchy.node.id, { x: currentX, y: currentY });

  // 子がいない場合は終了
  if (子なし) return positions;

  // 現在のノードのサイズ
  const currentWidth = getNodeWidth(hierarchy.node);
  const currentHeight = getNodeHeight(hierarchy.node);

  // 各子のサブツリー高さ
  const childSubtreeHeights = hierarchy.children.map(child =>
    calculateSubtreeHeight(child)
  );

  // 親の上端と長男の上端を揃える（top-align）
  const parentTop = currentY - currentHeight / 2;
  const firstChildTop = parentTop;

  // 各子を配置
  let currentChildTop = firstChildTop;
  hierarchy.children.forEach((child, index) => {
    const childNodeHeight = getNodeHeight(child.node);

    // 子の中央Y座標 = 子の上端 + 子自身の高さ / 2
    const childY = currentChildTop + childNodeHeight / 2;

    // 再帰的に子を配置
    const childPositions = alignHierarchy(child, currentX, childY, currentWidth, currentHeight, false);

    // 次の子の上端 = 現在の子の上端 + サブツリー高さ + GAP
    currentChildTop += childSubtreeHeights[index] + VERTICAL_GAP;
  });

  return positions;
}
```

#### 特徴
- ✅ **実際のノードサイズを使用**（style → measured → estimate）
- ✅ **サブツリー全体の高さを考慮**
- ✅ **親と長男の上端を揃える（top-align）**
- ✅ **リサイズ後のサイズを優先**

---

## 問題の原因

### **展開時と整列時でロジックが異なる**

| 項目 | 展開時 (layoutUtils) | 整列時 (alignLogic) |
|------|---------------------|-------------------|
| 親の幅 | **固定値 400px** | **実際の幅を取得** |
| 子の高さ | **固定値 200px** | **実際の高さを取得** |
| サブツリー | **考慮しない** | **再帰的に計算** |
| リサイズ | **反映されない** | **優先的に反映** |
| 垂直配置 | **親の中央基準** | **親の上端基準** |

### 具体的なバグシナリオ

#### シナリオ1: 帳票があるノードを展開
1. 親ノードの実際の幅 = 650px（帳票あり）
2. 展開時の計算: `childX = parentX + 400 + 300 = parentX + 700`
3. 実際の親の右端: `parentX + 650`
4. **結果:** 子ノードが親から250px離れすぎる（または重なる）

#### シナリオ2: ノードをリサイズ後に展開
1. ユーザーがノードを800px幅にリサイズ
2. 展開時の計算: `childX = parentX + 400 + 300` （固定値使用）
3. 実際の親の右端: `parentX + 800`
4. **結果:** 子ノードが親に重なる

#### シナリオ3: 高さが異なる子ノード
1. 子1の実際の高さ = 300px（メタデータ多い）
2. 子2の実際の高さ = 150px（メタデータ少ない）
3. 展開時の計算: 両方とも200pxとして計算
4. **結果:** 子ノード同士が重なる、または間隔が不均等

#### シナリオ4: 孫ノードがいる状態で展開
1. 子1が既に展開済み（孫ノードあり）
2. サブツリー全体の高さ = 500px
3. 展開時の計算: 子1の高さ = 200px として計算
4. **結果:** 子1の孫ノードと子2が重なる

---

## 解決策の方向性

### オプション1: 展開時も alignLogic を使用
- 展開時に `alignAllNodes()` を呼び出して再計算
- メリット: ロジックが一元化、バグが減る
- デメリット: パフォーマンスへの影響

### オプション2: layoutUtils を alignLogic と同等に修正
- `calculateChildPositions` を実際のノードサイズを使うように変更
- サブツリー高さ計算を追加
- メリット: 展開時のパフォーマンスが良い
- デメリット: ロジックの重複

### オプション3: 展開時は簡易配置、ユーザーが整列ボタンで調整
- 現状維持、整列ボタンで正確な配置
- メリット: 実装が簡単
- デメリット: UX が悪い（毎回整列が必要）

---

## 推奨アプローチ

**オプション1を推奨: 展開後に自動整列**

```typescript
// expandNode() の最後
const updatedEdges = [...currentEdges, ...newEdges];

// 整列を自動実行
const alignedNodes = alignAllNodes(updatedNodes);

return { nodes: alignedNodes, edges: updatedEdges };
```

または

```typescript
// Home3Page.tsx の handleExpand
const handleExpand = useCallback((nodeId, bomNode) => {
  setExpandedNodeIds((prev) => {
    // ... 展開処理

    setNodes((nds) => {
      const { nodes: updatedNodes } = expandNode(...);
      // 展開後に自動整列
      return alignAllNodes(updatedNodes);
    });

    return newSet;
  });
}, []);
```

### メリット
- ✅ 常に正確な配置
- ✅ ロジックの一元化
- ✅ リサイズ対応
- ✅ バグが出にくい

### デメリット対策
- パフォーマンス: React Flowの最適化により実用上問題なし
- 大規模BOM: 必要に応じて最適化（LOD、仮想化）

---

## まとめ

### 現状の問題
1. **展開時**: 固定サイズで計算 → 実際のサイズと乖離
2. **整列時**: 実際のサイズで計算 → 正確
3. **結果**: 展開直後は不正確、整列後は正確という不整合

### 解決方針
**展開後に自動的に `alignAllNodes()` を実行する**

これにより、常に正確な座標で配置され、リサイズ機能とも完全に統合される。
