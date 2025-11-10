'use client';

import type { BomNode, Directory, DocumentNode, LeafProduct } from '../../shared/data';
import { Folder } from 'lucide-react';
import { ResizableLayout, ResizablePanel, ResizableHandle } from '@/shared';
import { bomDetailResizableLayoutConfig } from '../lib';
import {
  BomDetailHeader,
  BomMetadataPanel,
  BomLeafProductContent,
  BomDocumentContent,
  BomDirectoryContent,
} from './components';

interface BomDetailPanelProps {
  selectedNode: BomNode | null;
  onSelectNode?: (node: BomNode) => void;
}

export function BomDetailPanel({ selectedNode, onSelectNode }: BomDetailPanelProps) {
  // 未選択状態
  if (!selectedNode) {
    return (
      <div className="flex h-full items-center justify-center bg-gray-50">
        <div className="text-center">
          <Folder className="mx-auto h-16 w-16 text-gray-300" />
          <p className="mt-4 text-lg font-medium text-gray-500">
            左のツリーからアイテムを選択してください
          </p>
        </div>
      </div>
    );
  }

  const isDirectory = selectedNode.type === 'directory';
  const isDocument = selectedNode.type === 'document';
  const isLeafProduct = selectedNode.type === 'leaf-product';

  return (
    <div className="flex h-full flex-col bg-gray-50">
      {/* ヘッダー（全タイプ共通） */}
      <BomDetailHeader selectedNode={selectedNode} />

      {/* メインコンテンツとメタデータのリサイザブルエリア */}
      <ResizableLayout config={bomDetailResizableLayoutConfig} className="flex-1">
        {/* 左: メインコンテンツ */}
        <ResizablePanel index={0}>
          <div className="h-full bg-white">
            {isDirectory && (
              <BomDirectoryContent
                node={selectedNode as Directory}
                onSelectNode={onSelectNode}
              />
            )}
            {isLeafProduct && <BomLeafProductContent node={selectedNode as LeafProduct} />}
            {isDocument && <BomDocumentContent node={selectedNode as DocumentNode} />}
          </div>
        </ResizablePanel>

        {/* リサイズハンドル */}
        <ResizableHandle />

        {/* 右: メタデータパネル */}
        <ResizablePanel index={1}>
          <BomMetadataPanel selectedNode={selectedNode} />
        </ResizablePanel>
      </ResizableLayout>
    </div>
  );
}
