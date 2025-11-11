'use client';

import { useState, useCallback, useEffect } from 'react';
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

  // ノード展開処理（Directory）
  const handleExpandDirectory = useCallback(
    (nodeId: string, bomNode: BomNode) => {
      setNodes((nds) => {
        const currentNode = nds.find((n) => n.id === nodeId);
        if (!currentNode) return nds;

        const isCurrentlyExpanded = currentNode.data.isDirectoryExpanded;

        if (isCurrentlyExpanded) {
          // 折りたたみ
          setEdges((eds) => {
            const { nodes: updatedNodes, edges: updatedEdges } = collapseNodeByType(
              nodeId,
              bomNode,
              'directory',
              nds,
              eds
            );
            return updatedEdges;
          });
          const { nodes: updatedNodes } = collapseNodeByType(
            nodeId,
            bomNode,
            'directory',
            nds,
            []
          );
          return updatedNodes;
        } else {
          // 展開
          setEdges((eds) => {
            const { nodes: updatedNodes, edges: updatedEdges } = expandNodeByType(
              nodeId,
              bomNode,
              'directory',
              nds,
              eds,
              handleExpandDirectory,
              handleExpandLeafProduct,
              handleExpandDocument
            );
            return updatedEdges;
          });
          const { nodes: updatedNodes } = expandNodeByType(
            nodeId,
            bomNode,
            'directory',
            nds,
            [],
            handleExpandDirectory,
            handleExpandLeafProduct,
            handleExpandDocument
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
          setEdges((eds) => {
            const { nodes: updatedNodes, edges: updatedEdges } = collapseNodeByType(
              nodeId,
              bomNode,
              'leaf-product',
              nds,
              eds
            );
            return updatedEdges;
          });
          const { nodes: updatedNodes } = collapseNodeByType(
            nodeId,
            bomNode,
            'leaf-product',
            nds,
            []
          );
          return updatedNodes;
        } else {
          // 展開
          setEdges((eds) => {
            const { nodes: updatedNodes, edges: updatedEdges } = expandNodeByType(
              nodeId,
              bomNode,
              'leaf-product',
              nds,
              eds,
              handleExpandDirectory,
              handleExpandLeafProduct,
              handleExpandDocument
            );
            return updatedEdges;
          });
          const { nodes: updatedNodes } = expandNodeByType(
            nodeId,
            bomNode,
            'leaf-product',
            nds,
            [],
            handleExpandDirectory,
            handleExpandLeafProduct,
            handleExpandDocument
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
          setEdges((eds) => {
            const { nodes: updatedNodes, edges: updatedEdges } = collapseNodeByType(
              nodeId,
              bomNode,
              'document',
              nds,
              eds
            );
            return updatedEdges;
          });
          const { nodes: updatedNodes } = collapseNodeByType(
            nodeId,
            bomNode,
            'document',
            nds,
            []
          );
          return updatedNodes;
        } else {
          // 展開
          setEdges((eds) => {
            const { nodes: updatedNodes, edges: updatedEdges } = expandNodeByType(
              nodeId,
              bomNode,
              'document',
              nds,
              eds,
              handleExpandDirectory,
              handleExpandLeafProduct,
              handleExpandDocument
            );
            return updatedEdges;
          });
          const { nodes: updatedNodes } = expandNodeByType(
            nodeId,
            bomNode,
            'document',
            nds,
            [],
            handleExpandDirectory,
            handleExpandLeafProduct,
            handleExpandDocument
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
    setNodes((nds) => alignAllNodes(nds));
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
        onNodesChange={onNodesChange}
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
