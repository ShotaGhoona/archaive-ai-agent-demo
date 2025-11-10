'use client';

import { ArrowRight, FileText, Folder, SquareChartGantt } from 'lucide-react';
import type { BomNode } from '../../../shared/data/types';
import { Button } from '@/shared';

interface DetailHeaderProps {
  node: BomNode;
  onNavigateToDetail?: () => void;
}

export default function DetailHeader({ node, onNavigateToDetail }: DetailHeaderProps) {
  const isDirectory = node.type === 'directory';
  const isDocument = node.type === 'document';
  const isLeafProduct = node.type === 'leaf-product';

  // アイコンの決定
  const Icon = isDirectory ? Folder : isDocument ? FileText : SquareChartGantt;

  const title = isDocument ? (node as any).document.typeName : node.name;

  return (
    <div className="border-b border-gray-200 bg-white px-6 py-3 h-[58px] flex items-center">
      <div className="flex items-center justify-between gap-4 w-full">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="rounded-lg bg-primary/10 p-2 flex-shrink-0">
            <Icon className="h-5 w-5 text-primary" />
          </div>
          <h1 className="text-lg font-bold text-gray-900 truncate">{title}</h1>
        </div>

        <Button
          variant="default"
          size="sm"
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
