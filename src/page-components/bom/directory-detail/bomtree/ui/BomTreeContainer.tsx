'use client';

import { useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { DirectoryBomTreeSidebar } from './DirectoryBomTreeSidebar';
import { DirectoryDetailPanel } from './DirectoryDetailPanel';
import { LeafProductDetailPanel } from './LeafProductDetailPanel';
import { DocumentDetailPanel } from './DocumentDetailPanel';
import bomTreeData from '@/page-components/bom/shared/data/mock6LayerRobotArm.json';
import { BomTree, Directory, BomNode, LeafProduct, DocumentNode } from '@/page-components/bom/shared/data/data-type';

interface BomTreeContainerProps {
  directoryId?: string;
}

// BOMツリーから指定IDのDirectoryを再帰的に検索
function findDirectoryById(node: BomNode, targetId: string): Directory | null {
  if (node.type === 'directory') {
    const dir = node as Directory;
    if (dir.id === targetId) {
      return dir;
    }
    // 子要素を再帰的に検索
    for (const child of dir.children) {
      const found = findDirectoryById(child, targetId);
      if (found) return found;
    }
  }
  return null;
}

export function BomTreeContainer({ directoryId }: BomTreeContainerProps) {
  const params = useParams();
  const id = (params?.id as string) || directoryId;

  // 製品全体のルートDirectory
  const rootDirectory = useMemo(() => {
    const bomTree = bomTreeData as BomTree;
    return bomTree.root as Directory;
  }, []);

  // URLパラメータからDirectoryを検索
  const directoryData = useMemo(() => {
    if (!id) {
      return rootDirectory;
    }
    const found = findDirectoryById(rootDirectory, id);
    return found || rootDirectory;
  }, [id, rootDirectory]);

  const [selectedNode, setSelectedNode] = useState<BomNode | null>(null);

  if (!directoryData) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-gray-500">Directory not found (ID: {id})</p>
      </div>
    );
  }

  return (
    <div className="flex flex-1 overflow-hidden">
      {/* 左側: BOMツリー */}
      <div className="w-120 flex-shrink-0 border-r border-gray-200">
        <DirectoryBomTreeSidebar
          directoryData={directoryData}
          rootDirectory={rootDirectory}
          selectedNode={selectedNode}
          onSelectNode={setSelectedNode}
        />
      </div>

      {/* 右側: 詳細パネル */}
      <div className="flex-1 overflow-hidden">
        {selectedNode ? (
          <>
            {selectedNode.type === 'directory' && (
              <DirectoryDetailPanel directoryData={selectedNode as Directory} />
            )}
            {selectedNode.type === 'leaf-product' && (
              <LeafProductDetailPanel leafProductData={selectedNode as LeafProduct} />
            )}
            {selectedNode.type === 'document' && (
              <DocumentDetailPanel documentNode={selectedNode as DocumentNode} />
            )}
          </>
        ) : (
          <div className="flex h-full items-center justify-center bg-white p-8">
            <p className="text-gray-500">ノードを選択してください</p>
          </div>
        )}
      </div>
    </div>
  );
}
