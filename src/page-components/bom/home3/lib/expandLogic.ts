import { Node, Edge } from 'reactflow';
import { BomNode, Directory } from '../../shared/data/types';
import { SectionNodeData } from './types';
import { getDirectoryChildren, getLeafProductChildren, getDocumentChildren, getAllChildren } from './layoutUtils';
import { alignAllNodes } from './alignLogic';

/**
 * セクションタイプ別の色定義（エッジとボタンで使用）
 */
const SECTION_COLORS = {
  directory: '#36adbf',      // primary
  'leaf-product': '#eab308', // yellow-500
  document: '#9ca3af',       // gray-500
} as const;

/**
 * ノードの初期サイズを計算
 */
export function calculateInitialNodeSize(bomNode: BomNode): { width: number; height: number } {
  const BASE_HEIGHT = 80;
  const ROW_HEIGHT = 32;
  const BASE_WIDTH = 400;

  const nodeType = bomNode.type;

  if (nodeType === 'directory') {
    const directory = bomNode as Directory;
    // メタデータの行数
    let metadataRows = 2;
    if (directory.customItems?.weight) metadataRows++;
    if (directory.customItems?.material) metadataRows++;
    if (directory.customItems?.maxPressure) metadataRows++;
    if (directory.customItems?.flowRate) metadataRows++;

    const height = BASE_HEIGHT + metadataRows * ROW_HEIGHT;
    return { width: BASE_WIDTH, height };
  } else if (nodeType === 'leaf-product' || nodeType === 'document') {
    // 画像表示用のサイズ
    return { width: BASE_WIDTH, height: 300 };
  }

  return { width: BASE_WIDTH, height: BASE_HEIGHT };
}

/**
 * ノードを展開する処理（タイプ別）
 */
export function expandNodeByType(
  nodeId: string,
  bomNode: BomNode,
  expandType: 'directory' | 'leaf-product' | 'document',
  currentNodes: Node<SectionNodeData>[],
  currentEdges: Edge[],
  handleExpandDirectory: (nodeId: string, bomNode: BomNode) => void,
  handleExpandLeafProduct: (nodeId: string, bomNode: BomNode) => void,
  handleExpandDocument: (nodeId: string, bomNode: BomNode) => void,
  nodeSizesMap: Map<string, { width: number; height: number }>
): {
  nodes: Node<SectionNodeData>[];
  edges: Edge[];
} {
  // 親ノードを取得
  const parentNode = currentNodes.find((n) => n.id === nodeId);
  if (!parentNode) {
    return { nodes: currentNodes, edges: currentEdges };
  }

  // タイプ別に子ノードを取得
  let childNodes: BomNode[] = [];
  if (expandType === 'directory') {
    childNodes = getDirectoryChildren(bomNode);
  } else if (expandType === 'leaf-product') {
    childNodes = getLeafProductChildren(bomNode);
  } else if (expandType === 'document') {
    childNodes = getDocumentChildren(bomNode);
  }

  if (childNodes.length === 0) {
    return { nodes: currentNodes, edges: currentEdges };
  }

  // 新しいノードを作成（仮配置）
  const newNodes: Node<SectionNodeData>[] = childNodes.map((child) => {
    // サイズを取得（優先順位: nodeSizesMap > 既存ノードのstyle > 初期サイズ）
    let size: { width: number; height: number };

    if (nodeSizesMap.has(child.id)) {
      // 1. nodeSizesMapに記録されているサイズを使用（最優先）
      size = nodeSizesMap.get(child.id)!;
    } else {
      const existingNode = currentNodes.find((n) => n.id === child.id);
      if (existingNode?.style?.width && existingNode?.style?.height) {
        // 2. 既存のノードがあればそのサイズを使用
        size = { width: existingNode.style.width as number, height: existingNode.style.height as number };
      } else {
        // 3. 初期サイズを計算
        size = calculateInitialNodeSize(child);
      }
    }

    return {
      id: child.id,
      type: 'sectionCard',
      position: { x: parentNode.position.x + 500, y: parentNode.position.y }, // 仮配置
      data: {
        bomNode: child,
        isDirectoryExpanded: false,
        isLeafProductExpanded: false,
        isDocumentExpanded: false,
        onExpandDirectory: () => handleExpandDirectory(child.id, child),
        onExpandLeafProduct: () => handleExpandLeafProduct(child.id, child),
        onExpandDocument: () => handleExpandDocument(child.id, child),
      },
      style: {
        width: size.width,
        height: size.height,
      },
    };
  });

  // 親ノードの展開状態を更新
  const updatedNodes = currentNodes
    .map((n) => {
      if (n.id === nodeId) {
        const updatedData = { ...n.data };
        if (expandType === 'directory') updatedData.isDirectoryExpanded = true;
        if (expandType === 'leaf-product') updatedData.isLeafProductExpanded = true;
        if (expandType === 'document') updatedData.isDocumentExpanded = true;
        return { ...n, data: updatedData };
      }
      return n;
    })
    .concat(newNodes);

  // 新しいエッジを作成（親から各子へ、子のタイプに応じた色と接続位置）
  const newEdges: Edge[] = childNodes.map((child) => ({
    id: `${nodeId}-${child.id}`,
    source: nodeId,
    target: child.id,
    sourceHandle: child.type, // タイプに応じたハンドルID
    type: 'smoothstep',
    style: {
      stroke: SECTION_COLORS[child.type as keyof typeof SECTION_COLORS] || '#3b82f6',
      strokeWidth: 3,
    },
    animated: false,
  }));

  const updatedEdges = [...currentEdges, ...newEdges];

  // 展開後に自動整列
  const alignedNodes = alignAllNodes(updatedNodes, nodeSizesMap);

  return { nodes: alignedNodes, edges: updatedEdges };
}

/**
 * ノードを折りたたむ処理（タイプ別、子孫ノードを再帰的に削除）
 */
export function collapseNodeByType(
  nodeId: string,
  bomNode: BomNode,
  collapseType: 'directory' | 'leaf-product' | 'document',
  currentNodes: Node<SectionNodeData>[],
  currentEdges: Edge[],
  nodeSizesMap: Map<string, { width: number; height: number }>
): {
  nodes: Node<SectionNodeData>[];
  edges: Edge[];
} {
  // タイプ別に子ノードのIDを取得
  let childNodes: BomNode[] = [];
  if (collapseType === 'directory') {
    childNodes = getDirectoryChildren(bomNode);
  } else if (collapseType === 'leaf-product') {
    childNodes = getLeafProductChildren(bomNode);
  } else if (collapseType === 'document') {
    childNodes = getDocumentChildren(bomNode);
  }

  const childIds = new Set(childNodes.map((child) => child.id));

  // 子ノードとその子孫を再帰的に収集
  const collectDescendants = (ids: Set<string>, nodes: Node<SectionNodeData>[]): Set<string> => {
    const nodesToRemove = nodes.filter((n) => ids.has(n.id));
    nodesToRemove.forEach((node) => {
      const descendants = getAllChildren(node.data.bomNode);
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

  // 削除する前に、子孫ノードのサイズ情報をnodeSizesMapに保存
  currentNodes.forEach((node) => {
    if (allDescendantIds.has(node.id)) {
      if (node.style?.width && node.style?.height) {
        nodeSizesMap.set(node.id, {
          width: node.style.width as number,
          height: node.style.height as number,
        });
      }
    }
  });

  // 子孫ノードを削除 & 親の展開状態を更新
  const updatedNodes = currentNodes
    .filter((n) => !allDescendantIds.has(n.id))
    .map((n) => {
      if (n.id === nodeId) {
        const updatedData = { ...n.data };
        if (collapseType === 'directory') updatedData.isDirectoryExpanded = false;
        if (collapseType === 'leaf-product') updatedData.isLeafProductExpanded = false;
        if (collapseType === 'document') updatedData.isDocumentExpanded = false;
        return { ...n, data: updatedData };
      }
      return n;
    });

  // 関連するエッジを削除
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
  const alignedNodes = alignAllNodes(updatedNodes, nodeSizesMap);

  return { nodes: alignedNodes, edges: updatedEdges };
}
