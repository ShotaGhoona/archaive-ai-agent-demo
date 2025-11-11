import { Node, Edge } from 'reactflow';
import { BomNode } from '../../shared/data/types';
import { SectionNodeData } from './types';
import { calculateChildPositions, getChildNodes } from './layoutUtils';

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
  const newNodes: Node<SectionNodeData>[] = childNodes.map((child, index) => ({
    id: child.id,
    type: 'sectionCard',
    position: childPositions[index],
    data: {
      bomNode: child,
      isExpanded: false,
      onExpand: () => handleExpand(child.id, child),
    },
  }));

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

  return { nodes: updatedNodes, edges: updatedEdges };
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
  const updatedEdges = currentEdges.filter(
    (e) => !allDescendantIds.has(e.target) && !allDescendantIds.has(e.source)
  );

  return { nodes: updatedNodes, edges: updatedEdges };
}
