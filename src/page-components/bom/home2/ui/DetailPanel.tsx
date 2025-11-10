'use client';

import { BomNode } from '../../shared/data/types';
import DetailHeader from './components/DetailHeader';
import DirectoryDetail from './components/DirectoryDetail';
import LeafProductDetail from './components/LeafProductDetail';

interface DetailPanelProps {
  selectedNode: BomNode | null;
}

export default function DetailPanel({ selectedNode }: DetailPanelProps) {
  if (!selectedNode) {
    return (
      <div className="flex h-full items-center justify-center bg-gray-50 text-gray-500">
        ノードを選択してください
      </div>
    );
  }

  if (selectedNode.type === 'document') {
    return (
      <div className="flex h-full items-center justify-center bg-gray-50 text-gray-500">
        文書は表示できません
      </div>
    );
  }

  const isDirectory = selectedNode.type === 'directory';

  return (
    <div className="flex h-full flex-col bg-white @container">
      {/* Header */}
      <DetailHeader node={selectedNode} />

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {isDirectory ? (
          <DirectoryDetail node={selectedNode} />
        ) : (
          <LeafProductDetail node={selectedNode} />
        )}
      </div>
    </div>
  );
}
