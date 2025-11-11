import { Node, Edge } from 'reactflow';
import { BomNode, Directory } from '../../shared/data/types';
import { SectionNodeData } from './types';
import { calculateChildPositions, getChildNodes } from './layoutUtils';
import { alignAllNodes } from './alignLogic';

/**
 * ノードの初期サイズを計算
 */
export function calculateInitialNodeSize(bomNode: BomNode): { width: number; height: number } {
  const BASE_HEIGHT = 80;
  const ROW_HEIGHT = 32;
  const BASE_WIDTH = 400;

  const isDirectory = bomNode.type === 'directory';
  const directory = bomNode as Directory;

  // メタデータの行数
  let metadataRows = 2;
  if (isDirectory) {
    if (directory.customItems?.weight) metadataRows++;
    if (directory.customItems?.material) metadataRows++;
    if (directory.customItems?.maxPressure) metadataRows++;
    if (directory.customItems?.flowRate) metadataRows++;
  }

  // 帳票の有無で幅を決定
  const documents = isDirectory ? (directory.documents || []) : [];
  const width = documents.length > 0 ? 650 : BASE_WIDTH;

  // 帳票の高さ
  const documentHeight = documents.length > 0 ? 180 : 0;

  const height = BASE_HEIGHT + metadataRows * ROW_HEIGHT + documentHeight;

  return { width, height };
}

/**
 * ノードを展開する処理
 */
export function expandNode(
  nodeId: string,
  bomNode: BomNode,
  currentNodes: Node<SectionNodeData>[],
  currentEdges: Edge[],
  handleExpand: (nodeId: string, bomNode: BomNode) => void
): {
  nodes: Node<SectionNodeData>[];
  edges: Edge[];
} {
  // 子ノードを取得
  const childNodes = getChildNodes(bomNode);
  if (childNodes.length === 0) {
    return { nodes: currentNodes, edges: currentEdges };
  }

  // 親ノードの位置を取得
  const parentNode = currentNodes.find((n) => n.id === nodeId);
  if (!parentNode) {
    return { nodes: currentNodes, edges: currentEdges };
  }

  // 子ノードの位置を計算
  const childPositions = calculateChildPositions(parentNode.position, childNodes.length);

  // 新しいノードを作成
  const newNodes: Node<SectionNodeData>[] = childNodes.map((child, index) => {
    const size = calculateInitialNodeSize(child);
    return {
      id: child.id,
      type: 'sectionCard',
      position: childPositions[index],
      data: {
        bomNode: child,
        isExpanded: false,
        onExpand: () => handleExpand(child.id, child),
      },
      style: {
        width: size.width,
        height: size.height,
      },
    };
  });

  // 親ノードの展開状態を更新
  const updatedNodes = currentNodes
    .map((n) =>
      n.id === nodeId
        ? {
            ...n,
            data: { ...n.data, isExpanded: true },
          }
        : n
    )
    .concat(newNodes);

  // 新しいエッジを作成（親から各子へ）
  const newEdges: Edge[] = childNodes.map((child) => ({
    id: `${nodeId}-${child.id}`,
    source: nodeId,
    target: child.id,
    type: 'smoothstep',
    style: { stroke: '#3b82f6', strokeWidth: 2 },
    animated: false,
  }));

  const updatedEdges = [...currentEdges, ...newEdges];

  // 展開後に自動整列
  const alignedNodes = alignAllNodes(updatedNodes);

  return { nodes: alignedNodes, edges: updatedEdges };
}

/**
 * ノードを折りたたむ処理（子孫ノードを再帰的に削除）
 */
export function collapseNode(
  nodeId: string,
  bomNode: BomNode,
  currentNodes: Node<SectionNodeData>[],
  currentEdges: Edge[]
): {
  nodes: Node<SectionNodeData>[];
  edges: Edge[];
} {
  // 子ノードのIDを取得
  const childNodes = getChildNodes(bomNode);
  const childIds = new Set(childNodes.map((child) => child.id));

  // 子ノードとその子孫を再帰的に収集
  const collectDescendants = (ids: Set<string>, nodes: Node<SectionNodeData>[]): Set<string> => {
    const nodesToRemove = nodes.filter((n) => ids.has(n.id));
    nodesToRemove.forEach((node) => {
      const descendants = getChildNodes(node.data.bomNode);
      descendants.forEach((desc) => {
        if (!ids.has(desc.id)) {
          ids.add(desc.id);
          collectDescendants(ids, nodes);
        }
      });
    });
    return ids;
  };

  const allDescendantIds = collectDescendants(childIds, currentNodes);

  // 子孫ノードを削除
  const updatedNodes = currentNodes
    .filter((n) => !allDescendantIds.has(n.id))
    .map((n) =>
      n.id === nodeId
        ? {
            ...n,
            data: { ...n.data, isExpanded: false },
          }
        : n
    );

  // 関連するエッジを削除
  // - 子孫ノードが source または target になっているエッジ
  // - 親ノード（nodeId）から子へのエッジ
  const updatedEdges = currentEdges.filter((e) => {
    // 親から子への直接エッジを削除
    if (e.source === nodeId && childIds.has(e.target)) {
      return false;
    }
    // 子孫ノードが関係するエッジを削除
    if (allDescendantIds.has(e.target) || allDescendantIds.has(e.source)) {
      return false;
    }
    return true;
  });

  // 折りたたみ後に自動整列
  const alignedNodes = alignAllNodes(updatedNodes);

  return { nodes: alignedNodes, edges: updatedEdges };
}
