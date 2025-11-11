'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import ReactFlow, {
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  BackgroundVariant,
  Node,
  Edge,
} from 'reactflow';
import 'reactflow/dist/style.css';

import { Directory, BomNode } from '../../shared/data/types';
import { allProducts } from '../../shared/data';
import ProductSelector from './ProductSelector';
import SectionCard from './components/SectionCard';
import AlignButton from './components/AlignButton';
import { SectionNodeData } from '../lib/types';
import { INITIAL_POSITION } from '../lib/layoutUtils';
import { expandNodeByType, collapseNodeByType, calculateInitialNodeSize } from '../lib/expandLogic';
import { alignAllNodes } from '../lib/alignLogic';

// カスタムノードタイプの定義
const nodeTypes = {
  sectionCard: SectionCard,
};

export default function Home3Page() {
  // 製品選択状態
  const [selectedProduct, setSelectedProduct] = useState<Directory>(allProducts[0]);

  // React Flowのノードとエッジ
  const [nodes, setNodes, onNodesChange] = useNodesState<Node<SectionNodeData>>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  // ノードサイズを記録（折りたたみ後も保持）
  const nodeSizesRef = useRef<Map<string, { width: number; height: number }>>(new Map());

  // ノード変更時の処理（リサイズをノード自体に反映 & 記録）
  const handleNodesChange = useCallback(
    (changes: any[]) => {
      // リサイズイベントを検知してノードのstyleに反映 & 記録
      changes.forEach((change) => {
        if (change.type === 'dimensions' && change.dimensions) {
          // サイズマップに記録
          nodeSizesRef.current.set(change.id, {
            width: change.dimensions.width,
            height: change.dimensions.height,
          });

          // ノードのstyleに反映
          setNodes((nds) =>
            nds.map((node) =>
              node.id === change.id
                ? {
                    ...node,
                    style: {
                      ...node.style,
                      width: change.dimensions.width,
                      height: change.dimensions.height,
                    },
                  }
                : node
            )
          );
        }
      });
      onNodesChange(changes);
    },
    [onNodesChange, setNodes]
  );

  // ノード展開処理（Directory）
  const handleExpandDirectory = useCallback(
    (nodeId: string, bomNode: BomNode) => {
      setNodes((nds) => {
        const currentNode = nds.find((n) => n.id === nodeId);
        if (!currentNode) return nds;

        const isCurrentlyExpanded = currentNode.data.isDirectoryExpanded;

        if (isCurrentlyExpanded) {
          // 折りたたみ（エッジと同時に更新）
          const currentEdges = edges;
          const { nodes: updatedNodes, edges: updatedEdges } = collapseNodeByType(
            nodeId,
            bomNode,
            'directory',
            nds,
            currentEdges,
            nodeSizesRef.current
          );
          setEdges(updatedEdges);
          return updatedNodes;
        } else {
          // 展開
          let finalEdges: Edge[] = [];
          setEdges((eds) => {
            const { nodes: updatedNodes, edges: updatedEdges } = expandNodeByType(
              nodeId,
              bomNode,
              'directory',
              nds,
              eds,
              handleExpandDirectory,
              handleExpandLeafProduct,
              handleExpandDocument,
              nodeSizesRef.current
            );
            finalEdges = updatedEdges;
            return updatedEdges;
          });
          const { nodes: updatedNodes } = expandNodeByType(
            nodeId,
            bomNode,
            'directory',
            nds,
            finalEdges,
            handleExpandDirectory,
            handleExpandLeafProduct,
            handleExpandDocument,
            nodeSizesRef.current
          );
          return updatedNodes;
        }
      });
    },
    [setNodes, setEdges]
  );

  // ノード展開処理（LeafProduct）
  const handleExpandLeafProduct = useCallback(
    (nodeId: string, bomNode: BomNode) => {
      setNodes((nds) => {
        const currentNode = nds.find((n) => n.id === nodeId);
        if (!currentNode) return nds;

        const isCurrentlyExpanded = currentNode.data.isLeafProductExpanded;

        if (isCurrentlyExpanded) {
          // 折りたたみ
          let finalEdges: Edge[] = [];
          setEdges((eds) => {
            const { nodes: updatedNodes, edges: updatedEdges } = collapseNodeByType(
              nodeId,
              bomNode,
              'leaf-product',
              nds,
              eds,
              nodeSizesRef.current
            );
            finalEdges = updatedEdges;
            return updatedEdges;
          });
          const { nodes: updatedNodes } = collapseNodeByType(
            nodeId,
            bomNode,
            'leaf-product',
            nds,
            finalEdges,
            nodeSizesRef.current
          );
          return updatedNodes;
        } else {
          // 展開
          let finalEdges: Edge[] = [];
          setEdges((eds) => {
            const { nodes: updatedNodes, edges: updatedEdges } = expandNodeByType(
              nodeId,
              bomNode,
              'leaf-product',
              nds,
              eds,
              handleExpandDirectory,
              handleExpandLeafProduct,
              handleExpandDocument,
              nodeSizesRef.current
            );
            finalEdges = updatedEdges;
            return updatedEdges;
          });
          const { nodes: updatedNodes } = expandNodeByType(
            nodeId,
            bomNode,
            'leaf-product',
            nds,
            finalEdges,
            handleExpandDirectory,
            handleExpandLeafProduct,
            handleExpandDocument,
            nodeSizesRef.current
          );
          return updatedNodes;
        }
      });
    },
    [setNodes, setEdges]
  );

  // ノード展開処理（Document）
  const handleExpandDocument = useCallback(
    (nodeId: string, bomNode: BomNode) => {
      setNodes((nds) => {
        const currentNode = nds.find((n) => n.id === nodeId);
        if (!currentNode) return nds;

        const isCurrentlyExpanded = currentNode.data.isDocumentExpanded;

        if (isCurrentlyExpanded) {
          // 折りたたみ
          let finalEdges: Edge[] = [];
          setEdges((eds) => {
            const { nodes: updatedNodes, edges: updatedEdges } = collapseNodeByType(
              nodeId,
              bomNode,
              'document',
              nds,
              eds,
              nodeSizesRef.current
            );
            finalEdges = updatedEdges;
            return updatedEdges;
          });
          const { nodes: updatedNodes } = collapseNodeByType(
            nodeId,
            bomNode,
            'document',
            nds,
            finalEdges,
            nodeSizesRef.current
          );
          return updatedNodes;
        } else {
          // 展開
          let finalEdges: Edge[] = [];
          setEdges((eds) => {
            const { nodes: updatedNodes, edges: updatedEdges } = expandNodeByType(
              nodeId,
              bomNode,
              'document',
              nds,
              eds,
              handleExpandDirectory,
              handleExpandLeafProduct,
              handleExpandDocument,
              nodeSizesRef.current
            );
            finalEdges = updatedEdges;
            return updatedEdges;
          });
          const { nodes: updatedNodes } = expandNodeByType(
            nodeId,
            bomNode,
            'document',
            nds,
            finalEdges,
            handleExpandDirectory,
            handleExpandLeafProduct,
            handleExpandDocument,
            nodeSizesRef.current
          );
          return updatedNodes;
        }
      });
    },
    [setNodes, setEdges]
  );

  // 製品切り替え時の処理
  const handleProductChange = useCallback(
    (product: Directory) => {
      setSelectedProduct(product);

      // ルートノードを作成
      const rootSize = calculateInitialNodeSize(product);
      const rootNode: Node<SectionNodeData> = {
        id: product.id,
        type: 'sectionCard',
        position: INITIAL_POSITION,
        data: {
          bomNode: product,
          isDirectoryExpanded: false,
          isLeafProductExpanded: false,
          isDocumentExpanded: false,
          onExpandDirectory: () => handleExpandDirectory(product.id, product),
          onExpandLeafProduct: () => handleExpandLeafProduct(product.id, product),
          onExpandDocument: () => handleExpandDocument(product.id, product),
        },
        style: {
          width: rootSize.width,
          height: rootSize.height,
        },
      };

      setNodes([rootNode]);
      setEdges([]);
    },
    [setNodes, setEdges, handleExpandDirectory, handleExpandLeafProduct, handleExpandDocument]
  );

  // 初回表示時にルートノードを作成
  useEffect(() => {
    handleProductChange(selectedProduct);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // 整列処理
  const handleAlign = useCallback(() => {
    setNodes((nds) => alignAllNodes(nds, nodeSizesRef.current));
  }, [setNodes]);

  return (
    <div className="relative h-[calc(100vh-45px)] w-full">
      {/* 製品セレクター */}
      <ProductSelector
        products={allProducts}
        selectedProduct={selectedProduct}
        onSelectProduct={handleProductChange}
      />

      {/* 整列ボタン */}
      <AlignButton onAlign={handleAlign} />

      {/* React Flow Canvas */}
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={handleNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        minZoom={0.1}
        maxZoom={2}
        defaultViewport={{ x: 0, y: 0, zoom: 1 }}
        className="bg-gray-50"
      >
        {/* 背景（ドットパターン） */}
        <Background variant={BackgroundVariant.Dots} gap={16} size={1} color="#d1d5db" />
      </ReactFlow>
    </div>
  );
}
