'use client';

import { ArrowRight, FileText, Folder, SquareChartGantt } from 'lucide-react';
import type { BomNode, Directory, DocumentNode, LeafProduct } from '../../../shared/data';
import { Button } from '@/shared';

interface BomDetailHeaderProps {
  selectedNode: BomNode;
  onNavigateToDetail?: () => void;
}

export function BomDetailHeader({ selectedNode, onNavigateToDetail }: BomDetailHeaderProps) {
  const isDirectory = selectedNode.type === 'directory';
  const isDocument = selectedNode.type === 'document';
  const isLeafProduct = selectedNode.type === 'leaf-product';

  // アイコンの決定
  const Icon = isDirectory ? Folder : isDocument ? FileText : SquareChartGantt;

  const title = isDocument ? selectedNode.document.typeName : isDirectory ? selectedNode.name : selectedNode.name;

  return (
    <div className="border-b border-gray-200 bg-white px-6 py-3">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4 flex-1">
          <div className="rounded-lg bg-primary/10 p-3">
            <Icon className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1 flex items-center">
              <h1 className="text-xl font-bold text-gray-900">{title}</h1>
          </div>
        </div>

        <Button
          variant="default"
          size="lg"
          onClick={onNavigateToDetail}
          className="flex-shrink-0"
        >
          詳細ページへ
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
