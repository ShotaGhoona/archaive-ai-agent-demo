'use client';

import { useState } from 'react';
import type { BomNode } from '../../shared/data';
import { mockBomData } from '../../shared/data';
import { BomTreeSidebar } from './BomTreeSidebar';
import { BomDetailPanel } from './BomDetailPanel';
import { ResizableLayout, ResizablePanel, ResizableHandle } from '@/shared';
import { bomResizableLayoutConfig } from '../lib';

export function BomPage() {
  const [selectedNode, setSelectedNode] = useState<BomNode | null>(null);

  return (
    <div className="w-full overflow-hidden bg-gray-50" style={{ height: 'calc(100vh - 60px)' }}>
      <ResizableLayout config={bomResizableLayoutConfig} className="h-full">
        {/* 左サイドバー: ツリーリスト */}
        <ResizablePanel index={0}>
          <BomTreeSidebar
            bomTree={mockBomData}
            selectedNode={selectedNode}
            onSelectNode={setSelectedNode}
          />
        </ResizablePanel>

        <ResizableHandle />

        {/* 右側エリア: 詳細表示 */}
        <ResizablePanel index={1}>
          <BomDetailPanel selectedNode={selectedNode} />
        </ResizablePanel>
      </ResizableLayout>
    </div>
  );
}
