'use client';

import { FileText, Folder, SquareChartGantt } from 'lucide-react';
import type { BomNode, Directory } from '../../../shared/data';
import { ScrollArea } from '@/shared';

interface BomDirectoryContentProps {
  node: Directory;
  onSelectNode?: (node: BomNode) => void;
}

export function BomDirectoryContent({ node, onSelectNode }: BomDirectoryContentProps) {
  // 子要素とドキュメントを統合
  const allChildren: Array<{ node: BomNode; type: 'child' | 'document' }> = [
    ...node.children.map((child) => ({ node: child, type: 'child' as const })),
  ];

  // ドキュメントもノードとして追加
  if (node.documents) {
    node.documents.forEach((doc) => {
      allChildren.push({
        node: {
          id: `doc_${doc.id}`,
          ulid: doc.ulid,
          type: 'document',
          parentId: node.id,
          document: doc,
        },
        type: 'document',
      });
    });
  }

  if (allChildren.length === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <Folder className="mx-auto h-16 w-16 text-gray-300" />
          <p className="mt-4 text-sm text-gray-500">子要素がありません</p>
        </div>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="p-6">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {allChildren.map(({ node: childNode }) => (
            <ChildNodeCard
              key={childNode.id}
              node={childNode}
              onClick={() => onSelectNode?.(childNode)}
            />
          ))}
        </div>
      </div>
    </ScrollArea>
  );
}

// 子ノードカード
function ChildNodeCard({ node, onClick }: { node: BomNode; onClick?: () => void }) {
  const isDirectory = node.type === 'directory';
  const isDocument = node.type === 'document';
  const isLeafProduct = node.type === 'leaf-product';

  // アイコンの決定
  const Icon = isDirectory ? Folder : isDocument ? FileText : SquareChartGantt;

  // 名前の決定
  let name = '';
  let badge = '';

  if (isDocument) {
    const docNode = node as any;
    name = docNode.document.typeName;
    badge = `v${docNode.document.versions[0].version}`;
  } else if (isDirectory) {
    const dirNode = node as any;
    name = dirNode.name;
    badge = `#${dirNode.seqNumber}`;
  } else {
    const leafNode = node as any;
    name = leafNode.name;
    badge = `#${leafNode.revisionNumber}`;
  }

  return (
    <button
      onClick={onClick}
      className="group relative aspect-square overflow-hidden rounded-lg border border-gray-200 bg-white p-4 transition-all hover:border-primary hover:shadow-md"
    >
      {/* アイコンエリア */}
      <div className="flex h-full flex-col items-center justify-center">
        <div className="rounded-lg bg-primary/10 p-3 transition-colors group-hover:bg-primary/20">
          <Icon className="h-8 w-8 text-primary" />
        </div>

        {/* 名前 */}
        <p className="mt-3 text-center text-sm font-medium text-gray-900 line-clamp-2">
          {name}
        </p>

        {/* バッジ */}
        <span className="mt-1 text-xs text-gray-500">{badge}</span>
      </div>

      {/* ホバーオーバーレイ */}
      <div className="absolute inset-0 bg-primary/5 opacity-0 transition-opacity group-hover:opacity-100" />
    </button>
  );
}
