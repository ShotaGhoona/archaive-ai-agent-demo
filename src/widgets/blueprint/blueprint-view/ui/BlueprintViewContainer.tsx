'use client';
import React, { useState, useCallback, useEffect } from 'react';
import {
  Button,
} from '@/shared';
import {
  Download,
  Printer,
  Pencil,
} from 'lucide-react';
import { PicturePreviewContainer } from '@/shared';
import { BlueprintDetailSidebar } from './BlueprintDetailSidebar';
import { BlueprintViewContainerData } from '../model';
import { blueprintViewsData } from '../data';

interface BlueprintViewContainerProps {
  blueprintViews?: BlueprintViewContainerData[];
  activeView?: string;
  onViewChange?: (viewId: string) => void;
  onAddView?: () => void;
  onDownload?: () => void;
  onPrint?: () => void;
  onEdit?: () => void;
  onRevisionComparison?: () => void;
  onSameBlueprints?: () => void;
  onFileDrop?: (files: File[]) => void;
}

export function BlueprintViewContainer({
  blueprintViews,
  activeView = 'front-view',
  onViewChange,
  onAddView,
  onDownload,
  onPrint,
  onEdit
}: BlueprintViewContainerProps) {
  const [views, setViews] = useState<BlueprintViewContainerData[]>(
    blueprintViews || (blueprintViewsData.blueprintViews as BlueprintViewContainerData[])
  );
  const [currentActiveView, setCurrentActiveView] = useState<string>(activeView);
  
  // 現在のアクティブビューのデータを取得
  const activeViewData = views.find(view => view.id === currentActiveView);
  
  // アクティブビューが変更された時の処理
  useEffect(() => {
    setViews(prev => prev.map(view => ({
      ...view,
      isActive: view.id === currentActiveView
    })));
  }, [currentActiveView]);

  const handleViewSelect = useCallback((viewId: string) => {
    setCurrentActiveView(viewId);
    onViewChange?.(viewId);
  }, [onViewChange]);

  const handleViewRemove = useCallback((viewId: string) => {
    setViews(prev => prev.filter(view => view.id !== viewId));
    // アクティブビューが削除された場合、最初のビューをアクティブにする
    if (currentActiveView === viewId) {
      const remainingViews = views.filter(view => view.id !== viewId);
      if (remainingViews.length > 0) {
        setCurrentActiveView(remainingViews[0].id);
      }
    }
  }, [currentActiveView, views]);

  const handleViewAdd = useCallback((newView: BlueprintViewContainerData) => {
    setViews(prev => [...prev, newView]);
    onAddView?.();
  }, [onAddView]);

  const downloadFile = useCallback((url?: string, name?: string) => {
    if (!url || !name) return;
    const link = document.createElement('a');
    link.href = url;
    link.download = name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onDownload?.();
  }, [onDownload]);

  const printFile = useCallback((url?: string) => {
    if (!url) return;
    const printWindow = window.open(url, '_blank');
    printWindow?.print();
    onPrint?.();
  }, [onPrint]);

  const handleEdit = useCallback(() => {
    onEdit?.();
  }, [onEdit]);

  return (
    <div className="h-full relative">
      <BlueprintDetailSidebar
        views={views}
        onViewSelect={handleViewSelect}
        onViewRemove={handleViewRemove}
        onViewAdd={handleViewAdd}
      />
      
      <PicturePreviewContainer 
        activeFile={activeViewData ? { imageUrl: activeViewData.imageUrl || '' } : null}
      />
      
      {/* Action buttons overlay */}
      {activeViewData && (
        <div className="absolute top-6 right-6 space-y-2 z-20">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="lg"
              onClick={() => downloadFile(activeViewData.imageUrl, activeViewData.name)}
              title="ダウンロード"
            >
              <Download className="h-5 w-5" />
              <span className="text-sm">ダウンロード</span>
            </Button>
            
            <Button
              variant="outline"
              size="lg"
              onClick={() => printFile(activeViewData.imageUrl)}
              title="印刷"
            >
              <Printer className="h-5 w-5" />
              <span className="text-sm">印刷</span>
            </Button>
            
            <Button 
              size="lg"
              onClick={handleEdit}
            >
              <Pencil className="h-5 w-5" />
              <span className="text-sm">書き込み</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}