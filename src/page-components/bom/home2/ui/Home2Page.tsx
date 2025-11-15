'use client';

import { useState } from 'react';
import { Directory, BomNode } from '../../shared/data/types';
import { allProducts } from '../../shared/data';
import { ResizableLayout, ResizablePanel, ResizableHandle } from '@/shared';
import { home2ResizableLayoutConfig } from '../lib/home2ResizableLayoutConfig';
import ProductListSidebar from './ProductListSidebar';
import BomTreePanel from './BomTreePanel';
import DetailPanel from './DetailPanel';

export default function Home2Page() {
  // 製品選択状態
  const [selectedProduct, setSelectedProduct] = useState<Directory>(allProducts[0]);

  // ノード選択状態
  const [selectedNode, setSelectedNode] = useState<BomNode | null>(allProducts[0]);

  return (
    <div className="flex h-[calc(100vh-60px)] flex-col">
      {/* Main Content - 3カラムレイアウト */}
      <div className="flex flex-1 overflow-hidden">
        {/* 左: 製品リスト (固定280px) */}
        <ProductListSidebar
          products={allProducts}
          selectedProduct={selectedProduct}
          onSelectProduct={(product) => {
            setSelectedProduct(product);
            setSelectedNode(product);
          }}
        />

        {/* 中央と右: リサイザブルレイアウト */}
        <ResizableLayout config={home2ResizableLayoutConfig} className="flex-1">
          {/* 中央: BOMツリー */}
          <ResizablePanel index={0}>
            <BomTreePanel
              rootNode={selectedProduct}
              selectedNode={selectedNode}
              onSelectNode={setSelectedNode}
            />
          </ResizablePanel>

          <ResizableHandle />

          {/* 右: 詳細パネル */}
          <ResizablePanel index={1}>
            <DetailPanel selectedNode={selectedNode} />
          </ResizablePanel>
        </ResizableLayout>
      </div>
    </div>
  );
}
