'use client';

import { useState, useCallback, useEffect, useMemo } from 'react';
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
import { SectionNodeData } from '../lib/types';
import { INITIAL_POSITION } from '../lib/layoutUtils';
import { expandNode, collapseNode } from '../lib/expandLogic';

// カスタムノードタイプの定義
const nodeTypes = {
  sectionCard: SectionCard,
};

export default function Home3Page() {
  // 製品選択状態
  const [selectedProduct, setSelectedProduct] = useState<Directory>(allProducts[0]);

  // 展開状態の管理（ノードIDをキーに）
  const [expandedNodeIds, setExpandedNodeIds] = useState<Set<string>>(new Set());

  // React Flowのノードとエッジ
  const [nodes, setNodes, onNodesChange] = useNodesState<Node<SectionNodeData>>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  // ノード展開/折りたたみ処理
  const handleExpand = useCallback((nodeId: string, bomNode: BomNode) => {
    setExpandedNodeIds((prev) => {
      const newSet = new Set(prev);
      const isCurrentlyExpanded = prev.has(nodeId);

      if (isCurrentlyExpanded) {
        // 折りたたみ
        newSet.delete(nodeId);

        setNodes((nds) => {
          setEdges((eds) => {
            const { nodes: updatedNodes, edges: updatedEdges } = collapseNode(
              nodeId,
              bomNode,
              nds,
              eds
            );
            setEdges(updatedEdges);
            return updatedEdges;
          });
          const { nodes: updatedNodes } = collapseNode(nodeId, bomNode, nds, []);
          return updatedNodes;
        });
      } else {
        // 展開
        newSet.add(nodeId);

        setNodes((nds) => {
          setEdges((eds) => {
            const { nodes: updatedNodes, edges: updatedEdges } = expandNode(
              nodeId,
              bomNode,
              nds,
              eds,
              handleExpand
            );
            setEdges(updatedEdges);
            return updatedEdges;
          });
          const { nodes: updatedNodes } = expandNode(nodeId, bomNode, nds, [], handleExpand);
          return updatedNodes;
        });
      }

      return newSet;
    });
  }, [setNodes, setEdges]);

  // 製品切り替え時の処理
  const handleProductChange = useCallback((product: Directory) => {
    setSelectedProduct(product);
    setExpandedNodeIds(new Set());

    // ルートノードを作成
    const rootNode: Node<SectionNodeData> = {
      id: product.id,
      type: 'sectionCard',
      position: INITIAL_POSITION,
      data: {
        bomNode: product,
        isExpanded: false,
        onExpand: () => handleExpand(product.id, product),
      },
    };

    setNodes([rootNode]);
    setEdges([]);
  }, [setNodes, setEdges, handleExpand]);

  // 初回表示時にルートノードを作成
  useEffect(() => {
    handleProductChange(selectedProduct);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="relative h-[calc(100vh-45px)] w-full">
      {/* 製品セレクター */}
      <ProductSelector
        products={allProducts}
        selectedProduct={selectedProduct}
        onSelectProduct={handleProductChange}
      />

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
