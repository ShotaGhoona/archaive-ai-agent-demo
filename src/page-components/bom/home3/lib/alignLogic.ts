import { Node } from 'reactflow';
import { Directory, BomNode } from '../../shared/data/types';
import { SectionNodeData } from './types';
import { getChildNodes } from './layoutUtils';

// 定数
const HORIZONTAL_GAP = 300; // 親子間の横間隔
const VERTICAL_GAP = 100; // 兄弟間の縦間隔

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
 * ノードの実際の高さを取得（measuredがあればそれを使用、なければ予測）
 */
function getNodeHeight(node: Node<SectionNodeData>): number {
  if (node.measured?.height) {
    return node.measured.height;
  }
  return estimateNodeHeight(node.data.bomNode);
}

/**
 * ノードの実際の幅を取得（measuredがあればそれを使用、なければデフォルト）
 */
function getNodeWidth(node: Node<SectionNodeData>): number {
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
 * ルートノードを見つける
 */
function findRootNode(nodes: Node<SectionNodeData>[]): Node<SectionNodeData> | null {
  // 親がいないノード（どのエッジのtargetにもなっていない）を探す
  // 簡易的に、最初のノードをルートとみなす
  return nodes[0] || null;
}

/**
 * ノードの階層構造を構築
 */
interface NodeHierarchy {
  node: Node<SectionNodeData>;
  children: NodeHierarchy[];
}

function buildHierarchy(
  nodeId: string,
  allNodes: Node<SectionNodeData>[]
): NodeHierarchy | null {
  const node = allNodes.find((n) => n.id === nodeId);
  if (!node) return null;

  const childBomNodes = getChildNodes(node.data.bomNode);
  const children: NodeHierarchy[] = [];

  for (const childBomNode of childBomNodes) {
    const childNode = allNodes.find((n) => n.id === childBomNode.id);
    if (childNode) {
      const childHierarchy = buildHierarchy(childNode.id, allNodes);
      if (childHierarchy) {
        children.push(childHierarchy);
      }
    }
  }

  return { node, children };
}

/**
 * サブツリー全体の高さを計算（自身 + 全子孫を展開した時の高さ）
 */
function calculateSubtreeHeight(hierarchy: NodeHierarchy): number {
  const nodeHeight = getNodeHeight(hierarchy.node);

  // 子がいない場合は自身の高さのみ
  if (hierarchy.children.length === 0) {
    return nodeHeight;
  }

  // 子のサブツリー高さを再帰的に計算
  const childSubtreeHeights = hierarchy.children.map((child) =>
    calculateSubtreeHeight(child)
  );

  // 子のサブツリーの合計高さ + 子間のギャップ
  const childrenTotalHeight =
    childSubtreeHeights.reduce((sum, h) => sum + h, 0) +
    (hierarchy.children.length - 1) * VERTICAL_GAP;

  // 自身の高さと子のサブツリーの高さの大きい方を返す
  return Math.max(nodeHeight, childrenTotalHeight);
}

/**
 * 階層を再帰的に整列
 */
function alignHierarchy(
  hierarchy: NodeHierarchy,
  parentX: number,
  parentY: number,
  parentWidth: number,
  parentHeight: number,
  isRoot: boolean = false
): Map<string, { x: number; y: number }> {
  const positions = new Map<string, { x: number; y: number }>();

  // 現在のノードの位置
  const currentX = isRoot ? parentX : parentX + parentWidth + HORIZONTAL_GAP;
  const currentY = parentY;

  positions.set(hierarchy.node.id, { x: currentX, y: currentY });

  // 子ノードがない場合は終了
  if (hierarchy.children.length === 0) {
    return positions;
  }

  // 現在のノードのサイズ
  const currentWidth = getNodeWidth(hierarchy.node);
  const currentHeight = getNodeHeight(hierarchy.node);

  // 各子のサブツリー全体の高さを計算
  const childSubtreeHeights = hierarchy.children.map((child) =>
    calculateSubtreeHeight(child)
  );

  // 親の上端と長男の上端を揃える
  // 親の上端Y座標 = 親の中央Y - 親の高さ / 2
  const parentTop = currentY - currentHeight / 2;

  // 最初の子（長男）の上端Y座標 = 親の上端
  const firstChildTop = parentTop;

  // 各子ノードを配置
  let currentChildTop = firstChildTop;
  hierarchy.children.forEach((child, index) => {
    // 子自身の高さを取得
    const childNodeHeight = getNodeHeight(child.node);

    // 子の中央Y座標 = 子の上端 + 子自身の高さ / 2
    const childY = currentChildTop + childNodeHeight / 2;

    // 子の位置を計算
    const childPositions = alignHierarchy(
      child,
      currentX,
      childY,
      currentWidth,
      currentHeight,
      false
    );

    // 結果をマージ
    childPositions.forEach((pos, id) => {
      positions.set(id, pos);
    });

    // 次の子の上端Y座標を計算
    // = 現在の子の上端 + 現在の子のサブツリー全体の高さ + VERTICAL_GAP
    currentChildTop += childSubtreeHeights[index] + VERTICAL_GAP;
  });

  return positions;
}

/**
 * 全ノードを整列させる
 */
export function alignAllNodes(
  nodes: Node<SectionNodeData>[]
): Node<SectionNodeData>[] {
  if (nodes.length === 0) return nodes;

  // ルートノードを見つける
  const rootNode = findRootNode(nodes);
  if (!rootNode) return nodes;

  // 階層構造を構築
  const hierarchy = buildHierarchy(rootNode.id, nodes);
  if (!hierarchy) return nodes;

  // 整列計算
  const positions = alignHierarchy(
    hierarchy,
    rootNode.position.x,
    rootNode.position.y,
    0,
    0,
    true
  );

  // ノードの位置を更新
  return nodes.map((node) => {
    const newPos = positions.get(node.id);
    if (newPos) {
      return {
        ...node,
        position: newPos,
      };
    }
    return node;
  });
}
