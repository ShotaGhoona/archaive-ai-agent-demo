'use client';

import { useState } from 'react';
import { ChevronRight, ChevronDown, FolderOpen, Folder, SquareChartGantt, FileText } from 'lucide-react';
import type { BomNode, BomTree, Directory, DocumentNode } from '../../shared/data';
import { ScrollArea } from '@/shared';

interface BomTreeSidebarProps {
  bomTree: BomTree;
  selectedNode: BomNode | null;
  onSelectNode: (node: BomNode) => void;
}

export function BomTreeSidebar({ bomTree, selectedNode, onSelectNode }: BomTreeSidebarProps) {
  return (
    <div className="flex h-full flex-col border-r border-gray-200 bg-white">
      {/* ヘッダー */}
      <div className="border-b border-gray-200 p-4">
        <h2 className="text-lg font-semibold text-gray-900">BOM構成</h2>
        <p className="text-sm text-gray-500">{bomTree.customerName}</p>
      </div>

      {/* ツリーリスト */}
      <ScrollArea className="flex-1">
        <div className="p-2">
          <TreeNode
            node={bomTree.root}
            level={0}
            selectedNode={selectedNode}
            onSelectNode={onSelectNode}
          />
        </div>
      </ScrollArea>
    </div>
  );
}

interface TreeNodeProps {
  node: BomNode;
  level: number;
  selectedNode: BomNode | null;
  onSelectNode: (node: BomNode) => void;
}

function TreeNode({ node, level, selectedNode, onSelectNode }: TreeNodeProps) {
  const [isExpanded, setIsExpanded] = useState(level < 2); // デフォルトで2階層まで展開

  const isDirectory = node.type === 'directory';
  const isLeafProduct = node.type === 'leaf-product';
  const isDocument = node.type === 'document';
  const isSelected = selectedNode?.id === node.id;

  // 子要素の計算（Directory/LeafProductの場合、documentsもchildrenとして扱う）
  let children: BomNode[] = [];
  if (isDirectory) {
    const dir = node as Directory;
    children = [...dir.children];
    if (dir.documents) {
      const docNodes: DocumentNode[] = dir.documents.map((doc) => ({
        id: `doc_${doc.id}`,
        ulid: doc.ulid,
        type: 'document' as const,
        parentId: dir.id,
        document: doc,
      }));
      children = [...children, ...docNodes];
    }
  } else if (isLeafProduct) {
    const leaf = node as any;
    if (leaf.documents) {
      const docNodes: DocumentNode[] = leaf.documents.map((doc: any) => ({
        id: `doc_${doc.id}`,
        ulid: doc.ulid,
        type: 'document' as const,
        parentId: leaf.id,
        document: doc,
      }));
      children = docNodes;
    }
  }

  const hasChildren = children.length > 0;

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasChildren) {
      setIsExpanded(!isExpanded);
    }
  };

  const handleClick = () => {
    onSelectNode(node);
  };

  return (
    <div>
      {/* ノード本体 */}
      <button
        onClick={handleClick}
        className={`
          flex w-full items-center gap-2 rounded py-1.5 text-left text-sm transition-colors
          ${isSelected ? 'bg-blue-100 text-blue-900' : 'text-gray-700 hover:bg-gray-100'}
        `}
        style={{
          paddingLeft: `${level * 24 + 8}px`,
          paddingRight: '8px'
        }}
      >
        {/* 展開/折りたたみアイコン領域（常に同じ幅を確保） */}
        <span onClick={handleToggle} className="flex-shrink-0 w-4">
          {hasChildren ? (
            isExpanded ? (
              <ChevronDown className="h-4 w-4 text-gray-500" />
            ) : (
              <ChevronRight className="h-4 w-4 text-gray-500" />
            )
          ) : (
            <span className="h-4 w-4" />
          )}
        </span>

        {/* タイプアイコン（常に表示） */}
        <span className="flex-shrink-0">
          {isDirectory ? (
            isExpanded ? (
              <FolderOpen className="h-4 w-4 text-primary" />
            ) : (
              <Folder className="h-4 w-4 text-primary" />
            )
          ) : isDocument ? (
            <FileText className="h-4 w-4 text-primary" />
          ) : (
            <SquareChartGantt className="h-4 w-4 text-primary" />
          )}
        </span>

        {/* ノード名 */}
        <span className="flex-1 truncate font-medium">
          {isDocument ? (node as DocumentNode).document.typeName : (node as any).name}
        </span>

        {/* シーケンス番号/バージョン */}
        {!isDocument && (
          <span className="flex-shrink-0 text-xs text-gray-400">
            #{isDirectory ? (node as Directory).seqNumber : (node as any).revisionNumber}
          </span>
        )}
        {isDocument && (
          <span className="flex-shrink-0 text-xs text-gray-400">
            v{(node as DocumentNode).document.versions[0].version}
          </span>
        )}
      </button>

      {/* 子要素（再帰） */}
      {hasChildren && isExpanded && (
        <div>
          {children.map((child) => (
            <TreeNode
              key={child.id}
              node={child}
              level={level + 1}
              selectedNode={selectedNode}
              onSelectNode={onSelectNode}
            />
          ))}
        </div>
      )}
    </div>
  );
}
