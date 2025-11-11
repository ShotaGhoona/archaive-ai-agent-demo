import { Node } from 'reactflow';
import { Directory, BomNode } from '../../shared/data/types';
import { SectionNodeData } from './types';
import { getChildNodes } from './layoutUtils';

// 定数
const HORIZONTAL_GAP = 300; // 親子間の横間隔
const VERTICAL_GAP = 100; // 兄弟間の縦間隔

/**
 * 左上座標からReact Flowの中央座標に変換
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

/**
 * コンテンツからノードの高さを予測
 */
function estimateNodeHeight(bomNode: BomNode): number {
  const BASE_HEIGHT = 80; // ヘッダー + padding
  const ROW_HEIGHT = 32; // メタデータ1行の高さ

  const isDirectory = bomNode.type === 'directory';
  const directory = bomNode as Directory;

  // メタデータの行数を計算
  let metadataRows = 2; // 基本2行（コード、タイプ）
  if (isDirectory) {
    if (directory.customItems?.weight) metadataRows++;
    if (directory.customItems?.material) metadataRows++;
    if (directory.customItems?.maxPressure) metadataRows++;
    if (directory.customItems?.flowRate) metadataRows++;
  }

  // 帳票の高さ
  const documents = isDirectory ? (directory.documents || []) : [];
  const documentHeight = documents.length > 0 ? 180 : 0; // 帳票エリアの高さ

  return BASE_HEIGHT + metadataRows * ROW_HEIGHT + documentHeight;
}

/**
 * ノードの実際の高さを取得（style.height → measured → 予測）
 */
function getNodeHeight(node: Node<SectionNodeData>): number {
  // ユーザーがリサイズした場合はstyle.heightが設定されている
  if (node.style?.height && typeof node.style.height === 'number') {
    return node.style.height;
  }
  if (node.measured?.height) {
    return node.measured.height;
  }
  return estimateNodeHeight(node.data.bomNode);
}

/**
 * ノードの実際の幅を取得（style.width → measured → デフォルト）
 */
function getNodeWidth(node: Node<SectionNodeData>): number {
  // ユーザーがリサイズした場合はstyle.widthが設定されている
  if (node.style?.width && typeof node.style.width === 'number') {
    return node.style.width;
  }
  if (node.measured?.width) {
    return node.measured.width;
  }
  // デフォルト幅を予測（帳票があるかどうかで変わる）
  const isDirectory = node.data.bomNode.type === 'directory';
  const directory = node.data.bomNode as Directory;
  const hasDocuments = isDirectory && (directory.documents || []).length > 0;
  return hasDocuments ? 650 : 400;
}

/**
 * 展開済みの子ノードのみを取得
 */
function getExpandedChildren(node: Node<SectionNodeData>, allNodes: Node<SectionNodeData>[]): Node<SectionNodeData>[] {
  const childBomNodes = getChildNodes(node.data.bomNode);
  return childBomNodes
    .map((childBomNode) => allNodes.find((n) => n.id === childBomNode.id))
    .filter((n): n is Node<SectionNodeData> => n !== undefined);
}

/**
 * サブツリー全体の高さを計算（展開済みの子のみを再帰的に含める）
 */
function calculateSubtreeHeight(node: Node<SectionNodeData>, allNodes: Node<SectionNodeData>[]): number {
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
  const childSubtreeHeights = children.map((child) => calculateSubtreeHeight(child, allNodes));

  // 子のサブツリーの合計高さ + 子間のギャップ
  const childrenTotalHeight =
    childSubtreeHeights.reduce((sum, h) => sum + h, 0) + (children.length - 1) * VERTICAL_GAP;

  // 自身の高さと子のサブツリーの高さの大きい方を返す
  return Math.max(nodeHeight, childrenTotalHeight);
}

/**
 * サブツリー全体の幅を計算（展開済みの子のみを再帰的に含める）
 */
function calculateSubtreeWidth(node: Node<SectionNodeData>, allNodes: Node<SectionNodeData>[]): number {
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
  const maxChildSubtreeWidth = Math.max(...children.map((child) => calculateSubtreeWidth(child, allNodes)));

  // 自身の幅 + 親子Gap + 子のサブツリー最大幅
  return nodeWidth + HORIZONTAL_GAP + maxChildSubtreeWidth;
}

/**
 * 親子間のGap
 */
function calculateHorizontalGap(): number {
  return HORIZONTAL_GAP;
}

/**
 * 兄弟間のGap
 */
function calculateVerticalGap(): number {
  return VERTICAL_GAP;
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
  allNodes: Node<SectionNodeData>[]
): Map<string, { x: number; y: number }> {
  const positions = new Map<string, { x: number; y: number }>();

  // 現在のノードの左上座標
  const currentLeftX = isRoot ? parentLeftX : parentLeftX + parentWidth + calculateHorizontalGap();
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

  // 各子のサブツリー高さを計算
  const childSubtreeHeights = children.map((child) => calculateSubtreeHeight(child, allNodes));

  // 親の上端 = 長男の上端（top-align）
  const parentTop = currentTopY;
  const firstChildTop = parentTop;

  // 各子を配置
  let currentChildTop = firstChildTop;
  children.forEach((child, index) => {
    // 子の左上座標
    const childTopY = currentChildTop;

    // 再帰的に子を配置
    const childPositions = alignHierarchy(child, currentLeftX, childTopY, currentWidth, false, allNodes);

    // 結果をマージ
    childPositions.forEach((pos, id) => {
      positions.set(id, pos);
    });

    // 次の兄弟の上端 = 現在の子の上端 + サブツリー高さ + 兄弟Gap
    currentChildTop += childSubtreeHeights[index] + calculateVerticalGap();
  });

  return positions;
}

/**
 * 全ノードを整列させる
 */
export function alignAllNodes(nodes: Node<SectionNodeData>[]): Node<SectionNodeData>[] {
  if (nodes.length === 0) return nodes;

  // ルートノードを見つける
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
  const topLeftPositions = alignHierarchy(rootNode, rootTopLeft.x, rootTopLeft.y, 0, true, nodes);

  // React Flowの中央座標に変換して適用
  return nodes.map((node) => {
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
