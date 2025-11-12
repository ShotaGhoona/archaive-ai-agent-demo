import { Node } from 'reactflow';
import { Directory, BomNode, DocumentNode } from '../../shared/data/types';
import { SectionNodeData } from './types';
import {
  getDirectoryChildren,
  getLeafProductChildren,
  getDocumentChildren,
  getAllChildren,
  HORIZONTAL_GAP,
  VERTICAL_GAP
} from './layoutUtils';

// React Flowのnode.positionは左上座標を表します
// 以下の座標変換関数は、中央座標を使う場合のために残していますが、現在は使用していません

// /**
//  * 左上座標からReact Flowの中央座標に変換
//  */
// function topLeftToCenterPosition(
//   topLeftX: number,
//   topLeftY: number,
//   width: number,
//   height: number
// ): { x: number; y: number } {
//   return {
//     x: topLeftX + width / 2,
//     y: topLeftY + height / 2,
//   };
// }

// /**
//  * React Flowの中央座標から左上座標に変換
//  */
// function centerToTopLeftPosition(
//   centerX: number,
//   centerY: number,
//   width: number,
//   height: number
// ): { x: number; y: number } {
//   return {
//     x: centerX - width / 2,
//     y: centerY - height / 2,
//   };
// }

/**
 * コンテンツからノードの高さを予測
 */
function estimateNodeHeight(bomNode: BomNode): number {
  const BASE_HEIGHT = 80; // ヘッダー + padding
  const ROW_HEIGHT = 32; // メタデータ1行の高さ

  const nodeType = bomNode.type;

  if (nodeType === 'directory') {
    const directory = bomNode as Directory;
    // メタデータの行数を計算
    let metadataRows = 2; // 基本2行（コード、タイプ）
    if (directory.customItems?.weight) metadataRows++;
    if (directory.customItems?.material) metadataRows++;
    if (directory.customItems?.maxPressure) metadataRows++;
    if (directory.customItems?.flowRate) metadataRows++;

    return BASE_HEIGHT + metadataRows * ROW_HEIGHT;
  } else if (nodeType === 'leaf-product' || nodeType === 'document') {
    // 画像表示用の高さ
    return 300;
  }

  return BASE_HEIGHT;
}

/**
 * ノードの実際の高さを取得（nodeSizesMap → style.height → measured → 予測）
 */
function getNodeHeight(node: Node<SectionNodeData>, nodeSizesMap?: Map<string, { width: number; height: number }>): number {
  // 1. nodeSizesMapに記録されているサイズを使用（最優先）
  if (nodeSizesMap?.has(node.id)) {
    return nodeSizesMap.get(node.id)!.height;
  }
  // 2. ユーザーがリサイズした場合はstyle.heightが設定されている
  if (node.style?.height && typeof node.style.height === 'number') {
    return node.style.height;
  }
  // 3. measured
  const measured = (node as { measured?: { width?: number; height?: number } }).measured;
  if (measured?.height) {
    return measured.height;
  }
  // 4. 予測
  return estimateNodeHeight(node.data.bomNode);
}

/**
 * ノードの実際の幅を取得（nodeSizesMap → style.width → measured → デフォルト）
 */
function getNodeWidth(node: Node<SectionNodeData>, nodeSizesMap?: Map<string, { width: number; height: number }>): number {
  // 1. nodeSizesMapに記録されているサイズを使用（最優先）
  if (nodeSizesMap?.has(node.id)) {
    return nodeSizesMap.get(node.id)!.width;
  }
  // 2. ユーザーがリサイズした場合はstyle.widthが設定されている
  if (node.style?.width && typeof node.style.width === 'number') {
    return node.style.width;
  }
  // 3. measured
  const measured = (node as { measured?: { width?: number; height?: number } }).measured;
  if (measured?.width) {
    return measured.width;
  }
  // 4. デフォルト幅を予測（帳票があるかどうかで変わる）
  const isDirectory = node.data.bomNode.type === 'directory';
  const directory = node.data.bomNode as Directory;
  const hasDocuments = isDirectory && (directory.documents || []).length > 0;
  return hasDocuments ? 650 : 400;
}

/**
 * 展開済みの子ノードのみを取得（タイプ別展開状態を考慮）
 */
function getExpandedChildren(node: Node<SectionNodeData>, allNodes: Node<SectionNodeData>[]): Node<SectionNodeData>[] {
  const expandedChildBomNodes: BomNode[] = [];

  // Directory の子（展開されている場合のみ）
  if (node.data.isDirectoryExpanded) {
    expandedChildBomNodes.push(...getDirectoryChildren(node.data.bomNode));
  }

  // LeafProduct の子（展開されている場合のみ）
  if (node.data.isLeafProductExpanded) {
    expandedChildBomNodes.push(...getLeafProductChildren(node.data.bomNode));
  }

  // Document の子（展開されている場合のみ）
  if (node.data.isDocumentExpanded) {
    expandedChildBomNodes.push(...getDocumentChildren(node.data.bomNode));
  }

  return expandedChildBomNodes
    .map((childBomNode) => allNodes.find((n) => n.id === childBomNode.id))
    .filter((n): n is Node<SectionNodeData> => n !== undefined);
}

/**
 * サブツリー全体の高さを計算（展開済みの子のみを再帰的に含める）
 */
function calculateSubtreeHeight(node: Node<SectionNodeData>, allNodes: Node<SectionNodeData>[], nodeSizesMap?: Map<string, { width: number; height: number }>): number {
  const nodeHeight = getNodeHeight(node, nodeSizesMap);

  // すべてのタイプが展開されていない場合
  const hasAnyExpanded = node.data.isDirectoryExpanded || node.data.isLeafProductExpanded || node.data.isDocumentExpanded;
  if (!hasAnyExpanded) {
    return nodeHeight;
  }

  const children = getExpandedChildren(node, allNodes);
  if (children.length === 0) {
    return nodeHeight;
  }

  // 各子のサブツリー高さを再帰的に計算
  const childSubtreeHeights = children.map((child) => calculateSubtreeHeight(child, allNodes, nodeSizesMap));

  // 子のサブツリーの合計高さ + 子間のギャップ
  const childrenTotalHeight =
    childSubtreeHeights.reduce((sum, h) => sum + h, 0) + (children.length - 1) * VERTICAL_GAP;

  // 自身の高さと子のサブツリーの高さの大きい方を返す
  return Math.max(nodeHeight, childrenTotalHeight);
}

/**
 * サブツリー全体の幅を計算（展開済みの子のみを再帰的に含める）
 */
function calculateSubtreeWidth(node: Node<SectionNodeData>, allNodes: Node<SectionNodeData>[], nodeSizesMap?: Map<string, { width: number; height: number }>): number {
  const nodeWidth = getNodeWidth(node, nodeSizesMap);

  // すべてのタイプが展開されていない場合
  const hasAnyExpanded = node.data.isDirectoryExpanded || node.data.isLeafProductExpanded || node.data.isDocumentExpanded;
  if (!hasAnyExpanded) {
    return nodeWidth;
  }

  const children = getExpandedChildren(node, allNodes);
  if (children.length === 0) {
    return nodeWidth;
  }

  // 子のサブツリー幅の最大値を再帰的に取得
  const maxChildSubtreeWidth = Math.max(...children.map((child) => calculateSubtreeWidth(child, allNodes, nodeSizesMap)));

  // 自身の幅 + 親子Gap + 子のサブツリー最大幅
  return nodeWidth + HORIZONTAL_GAP + maxChildSubtreeWidth;
}

/**
 * ルートノードを見つける
 */
function findRootNode(nodes: Node<SectionNodeData>[]): Node<SectionNodeData> | null {
  // 親がいないノード（どのエッジのtargetにもなっていない）を探す
  // 簡易的に、最初のノードをルートとみなす
  return nodes[0] || null;
}

/**
 * ノード階層を再帰的に整列（左上座標基準）
 */
function alignHierarchy(
  node: Node<SectionNodeData>,
  parentLeftX: number,
  parentTopY: number,
  parentWidth: number,
  isRoot: boolean,
  allNodes: Node<SectionNodeData>[],
  nodeSizesMap?: Map<string, { width: number; height: number }>
): Map<string, { x: number; y: number }> {
  const positions = new Map<string, { x: number; y: number }>();

  // 現在のノードの左上座標
  const currentLeftX = isRoot ? parentLeftX : parentLeftX + parentWidth + HORIZONTAL_GAP;
  const currentTopY = parentTopY;

  positions.set(node.id, { x: currentLeftX, y: currentTopY });

  // すべてのタイプが展開されていない場合は終了
  const hasAnyExpanded = node.data.isDirectoryExpanded || node.data.isLeafProductExpanded || node.data.isDocumentExpanded;
  if (!hasAnyExpanded) {
    return positions;
  }

  const children = getExpandedChildren(node, allNodes);
  if (children.length === 0) {
    return positions;
  }

  // 現在のノードのサイズ
  const currentWidth = getNodeWidth(node, nodeSizesMap);

  // 各子のサブツリー高さを計算
  const childSubtreeHeights = children.map((child) => calculateSubtreeHeight(child, allNodes, nodeSizesMap));

  // 親の上端 = 長男の上端（top-align）
  const parentTop = currentTopY;
  const firstChildTop = parentTop;

  // 各子を配置
  let currentChildTop = firstChildTop;
  children.forEach((child, index) => {
    // 子の左上座標
    const childTopY = currentChildTop;

    // 再帰的に子を配置
    const childPositions = alignHierarchy(child, currentLeftX, childTopY, currentWidth, false, allNodes, nodeSizesMap);

    // 結果をマージ
    childPositions.forEach((pos, id) => {
      positions.set(id, pos);
    });

    // 次の兄弟の上端 = 現在の子の上端 + サブツリー高さ + 兄弟Gap
    currentChildTop += childSubtreeHeights[index] + VERTICAL_GAP;
  });

  return positions;
}

/**
 * 全ノードを整列させる
 */
export function alignAllNodes(nodes: Node<SectionNodeData>[], nodeSizesMap?: Map<string, { width: number; height: number }>): Node<SectionNodeData>[] {
  if (nodes.length === 0) return nodes;

  // ルートノードを見つける
  const rootNode = findRootNode(nodes);
  if (!rootNode) return nodes;

  // ルートノードは現在の位置をそのまま使用（左上座標として）
  const rootTopLeft = { x: rootNode.position.x, y: rootNode.position.y };

  // 階層を整列（左上座標で計算）
  const topLeftPositions = alignHierarchy(rootNode, rootTopLeft.x, rootTopLeft.y, 0, true, nodes, nodeSizesMap);

  // 左上座標をそのまま適用（React Flowは左上座標を使用）
  return nodes.map((node) => {
    const topLeft = topLeftPositions.get(node.id);
    if (!topLeft) return node;

    return {
      ...node,
      position: topLeft,
    };
  });
}
