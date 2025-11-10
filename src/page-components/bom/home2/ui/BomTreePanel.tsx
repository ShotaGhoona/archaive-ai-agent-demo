'use client';

import { useState } from 'react';
import { Directory, BomNode, LeafProduct } from '../../shared/data/types';
import { Search, ChevronRight, ChevronDown, FolderOpen, Folder, SquareChartGantt } from 'lucide-react';
import {
  ScrollArea,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared';

interface BomTreePanelProps {
  rootNode: Directory;
  selectedNode: BomNode | null;
  onSelectNode: (node: BomNode) => void;
}

export default function BomTreePanel({ rootNode, selectedNode, onSelectNode }: BomTreePanelProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set([rootNode.id]));

  const toggleNode = (nodeId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId);
    } else {
      newExpanded.add(nodeId);
    }
    setExpandedNodes(newExpanded);
  };

  const renderNode = (node: BomNode, level: number = 0): React.ReactNode | null => {
    if (node.type === 'document') return null; // Documentは非表示

    const isDirectory = node.type === 'directory';
    const isExpanded = expandedNodes.has(node.id);
    const isSelected = selectedNode?.id === node.id;
    const hasChildren = isDirectory && (node as Directory).children && (node as Directory).children!.length > 0;

    // 検索フィルター
    const matchesSearch = !searchQuery || node.name.toLowerCase().includes(searchQuery.toLowerCase());

    // タイプフィルター
    let matchesType = true;
    if (typeFilter !== 'all') {
      if (isDirectory) {
        const dir = node as Directory;
        matchesType = typeFilter === dir.directoryTypeName.toLowerCase();
      } else {
        matchesType = typeFilter === 'leafproduct';
      }
    }

    // フィルタに合致するかどうか
    const isFiltered = !matchesSearch || !matchesType;

    return (
      <div key={node.id}>
        <button
          onClick={() => onSelectNode(node)}
          className={`
            flex w-full items-center gap-2 rounded py-1.5 text-left transition-colors
            ${isSelected ? 'bg-blue-100 text-blue-900' : isFiltered ? 'text-gray-400 hover:bg-gray-50' : 'text-gray-700 hover:bg-gray-100'}
          `}
          style={{
            paddingLeft: `${level * 24 + 8}px`,
            paddingRight: '8px'
          }}
        >
          {/* 展開/折りたたみアイコン領域 */}
          <span onClick={(e) => hasChildren && toggleNode(node.id, e)} className="flex-shrink-0 w-4">
            {hasChildren ? (
              isExpanded ? (
                <ChevronDown className={`h-4 w-4 ${isFiltered ? 'text-gray-300' : 'text-gray-500'}`} />
              ) : (
                <ChevronRight className={`h-4 w-4 ${isFiltered ? 'text-gray-300' : 'text-gray-500'}`} />
              )
            ) : (
              <span className="h-4 w-4" />
            )}
          </span>

          {/* タイプアイコン */}
          <span className="flex-shrink-0">
            {isDirectory ? (
              isExpanded ? (
                <FolderOpen className={`h-4 w-4 ${isFiltered ? 'text-gray-300' : 'text-primary'}`} />
              ) : (
                <Folder className={`h-4 w-4 ${isFiltered ? 'text-gray-300' : 'text-primary'}`} />
              )
            ) : (
              <SquareChartGantt className={`h-4 w-4 ${isFiltered ? 'text-gray-300' : 'text-primary'}`} />
            )}
          </span>

          {/* ノード名 */}
          <span className="flex-1 truncate font-medium text-sm">
            {node.name}
          </span>

          {/* シーケンス番号/バージョン */}
          <span className={`flex-shrink-0 text-xs ${isFiltered ? 'text-gray-300' : 'text-gray-400'}`}>
            #{isDirectory ? (node as Directory).seqNumber : (node as LeafProduct).revisionNumber}
          </span>
        </button>

        {isDirectory && isExpanded && (node as Directory).children && (
          <div>
            {(node as Directory).children!.map((child) => renderNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex h-full flex-col border-r border-gray-200 bg-white">
      {/* 検索とフィルター */}
      <div className="border-b border-gray-200 p-3">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="検索"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded border border-gray-300 py-1.5 pl-8 pr-2 text-sm focus:border-primary focus:outline-none"
            />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger size="sm" className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全て</SelectItem>
              <SelectItem value="製品">製品</SelectItem>
              <SelectItem value="assy">Assy</SelectItem>
              <SelectItem value="subassy">SubAssy</SelectItem>
              <SelectItem value="leafproduct">LeafProduct</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      {/* ツリー */}
      <ScrollArea className="flex-1">
        <div className="p-2">{renderNode(rootNode)}</div>
      </ScrollArea>
    </div>
  );
}
