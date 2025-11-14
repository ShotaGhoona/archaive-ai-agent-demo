'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronRight, ChevronDown, FolderOpen, Folder, SquareChartGantt, FileText, Layers, FolderTree } from 'lucide-react';
import { ScrollArea, TabNavigation } from '@/shared';
import type { BomNode, Directory, LeafProduct, DocumentNode } from '@/page-components/bom/shared/data/data-type';

interface DirectoryBomTreeSidebarProps {
  directoryData: Directory;
  rootDirectory: Directory; // 製品全体のルート
  selectedNode: BomNode | null;
  onSelectNode: (node: BomNode) => void;
}

type BomTreeTabKey = 'full' | 'current';

export function DirectoryBomTreeSidebar({
  directoryData,
  rootDirectory,
  selectedNode,
  onSelectNode
}: DirectoryBomTreeSidebarProps) {
  const [selectedTab, setSelectedTab] = useState<BomTreeTabKey>('current');

  // タブアイテム定義
  const tabItems = [
    {
      key: 'full',
      label: '製品全体',
      icon: Layers,
    },
    {
      key: 'current',
      label: '現在のDirectory',
      icon: FolderTree,
    },
  ];

  const displayNode = selectedTab === 'full' ? rootDirectory : directoryData;

  return (
    <div className="flex h-full w-full flex-col bg-white">
      {/* タブナビゲーション */}
      <TabNavigation
        items={tabItems}
        selectedKey={selectedTab}
        onTabChange={(key) => setSelectedTab(key as BomTreeTabKey)}
      />

      {/* ツリーリスト */}
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        <div className="p-2">
          <TreeNode
            node={displayNode}
            level={0}
            selectedNode={selectedNode}
            onSelectNode={onSelectNode}
            currentDirectoryId={selectedTab === 'full' ? directoryData.id : undefined}
          />
        </div>
      </div>
    </div>
  );
}

interface TreeNodeProps {
  node: BomNode;
  level: number;
  selectedNode: BomNode | null;
  onSelectNode: (node: BomNode) => void;
  currentDirectoryId?: string; // 製品全体表示時に現在のDirectoryをハイライト
}

function TreeNode({
  node,
  level,
  selectedNode,
  onSelectNode,
  currentDirectoryId,
}: TreeNodeProps) {
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(level < 2); // デフォルトで2階層まで展開

  const isDirectory = node.type === 'directory';
  const isLeafProduct = node.type === 'leaf-product';
  const isDocument = node.type === 'document';
  const isSelected = selectedNode?.id === node.id;
  const isCurrentDirectory = currentDirectoryId && node.id === currentDirectoryId;

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
    const leaf = node as LeafProduct;
    if (leaf.documents) {
      const docNodes: DocumentNode[] = leaf.documents.map((doc) => ({
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

  const handleDoubleClick = () => {
    // Directoryの場合のみ詳細ページへ遷移
    if (isDirectory) {
      router.push(`/bom/directory/${node.id}/basic-information`);
    }
  };

  return (
    <div>
      {/* ノード本体 */}
      <button
        onClick={handleClick}
        onDoubleClick={handleDoubleClick}
        className={`
          flex w-full items-center rounded py-1.5 text-left text-sm transition-colors
          ${
            isSelected
              ? 'bg-blue-100 text-blue-900'
              : isCurrentDirectory
              ? 'bg-orange-50 text-orange-900 hover:bg-orange-100'
              : 'text-gray-700 hover:bg-gray-100'
          }
        `}
        style={{
          paddingLeft: `${level * 24 + 8}px`,
          paddingRight: '8px'
        }}
      >
        {/* 展開/折りたたみアイコン領域（常に同じ幅を確保） */}
        <span onClick={handleToggle} className="flex-shrink-0">
          {hasChildren ? (
            isExpanded ? (
              <ChevronDown className="h-4 w-4 text-gray-500 mr-2" />
            ) : (
              <ChevronRight className="h-4 w-4 text-gray-500 mr-2" />
            )
          ) : (
            <span className="" />
          )}
        </span>

        {/* タイプアイコン（常に表示） */}
        <span className="flex-shrink-0 mr-2">
          {isDirectory ? (
            isExpanded ? (
              <FolderOpen className="h-4 w-4 text-primary" />
            ) : (
              <Folder className="h-4 w-4 text-primary" />
            )
          ) : isDocument ? (
            <FileText className="h-4 w-4 text-gray-500" />
          ) : (
            <SquareChartGantt className="h-4 w-4 text-orange-500" />
          )}
        </span>

        {/* ノード名 */}
        <span className="flex-1 truncate font-medium">
          {isDocument
            ? (node as DocumentNode).document.typeName
            : (node as Directory | LeafProduct).name}
        </span>

        {/* シーケンス番号/リビジョン番号 */}
        {!isDocument && (
          <span className="flex-shrink-0 text-xs text-gray-400">
            #{isDirectory
              ? (node as Directory).seqNumber
              : (node as LeafProduct).revisionNumber}
          </span>
        )}
        {isDocument && (
          <span className="flex-shrink-0 text-xs text-gray-400">
            v{(node as DocumentNode).document.versions[(node as DocumentNode).document.versions.length - 1].version}
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
              currentDirectoryId={currentDirectoryId}
            />
          ))}
        </div>
      )}
    </div>
  );
}
