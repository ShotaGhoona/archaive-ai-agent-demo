'use client';
import React, { useState, useCallback, useEffect } from 'react';
import { Button } from '@/shared';
import { Download, Printer, Pencil } from 'lucide-react';
import { PicturePreviewContainer } from '@/shared';
import { BlueprintDetailSidebar } from './BlueprintDetailSidebar';
import { BlueprintDetailDataInterface } from '@/dummy-data-er-fix/blueprint/interfaces/types';

interface BlueprintViewContainerProps {
  blueprints: BlueprintDetailDataInterface[];
  activeBlueprintId: number;
  onBlueprintChange: (blueprintId: number) => void;
  onEdit?: () => void;
}

export function BlueprintViewContainer({
  blueprints,
  activeBlueprintId,
  onBlueprintChange,
  onEdit,
}: BlueprintViewContainerProps) {
  const [views, setViews] = useState<BlueprintDetailDataInterface[]>(blueprints);
  
  // 現在のアクティブビューのデータを取得
  const activeViewData = views.find((view) => view.id === activeBlueprintId);

  // アクティブビューが変更された時の処理
  useEffect(() => {
    setViews((prev) =>
      prev.map((view) => ({
        ...view,
        isActive: view.id === activeBlueprintId,
      })),
    );
  }, [activeBlueprintId]);

  const handleViewSelect = useCallback(
    (viewId: number) => {
      onBlueprintChange(viewId);
    },
    [onBlueprintChange],
  );

  const handleViewRemove = useCallback(
    (viewId: number) => {
      setViews((prev) => prev.filter((view) => view.id !== viewId));
      // アクティブビューが削除された場合、最初のビューをアクティブにする
      if (activeBlueprintId === viewId) {
        const remainingViews = views.filter((view) => view.id !== viewId);
        if (remainingViews.length > 0) {
          onBlueprintChange(remainingViews[0].id);
        }
      }
    },
    [activeBlueprintId, views, onBlueprintChange],
  );

  // TODO: 図面を追加する機能の実装


  return (
    <div className='relative h-full'>
      <BlueprintDetailSidebar
        views={views}
        activeBlueprintId={activeBlueprintId}
        onViewSelect={handleViewSelect}
        onViewRemove={handleViewRemove}
      />

      <PicturePreviewContainer
        activeFile={
          activeViewData ? { imageUrl: activeViewData.s3_url || '' } : null
        }
      />

      {/* Action buttons overlay */}
      {activeViewData && (
        <div className='absolute top-6 right-6 z-20 space-y-2'>
          <div className='flex items-center gap-2'>
            <Button
              variant='outline'
              size='lg'
              onClick={() => {
                // TODO: ダウンロード機能の実装
              }}
              title='ダウンロード'
            >
              <Download className='h-5 w-5' />
              <span className='text-sm'>ダウンロード</span>
            </Button>

            <Button
              variant='outline'
              size='lg'
              onClick={() => {
                // TODO: 印刷機能の実装
              }}
              title='印刷'
            >
              <Printer className='h-5 w-5' />
              <span className='text-sm'>印刷</span>
            </Button>

            <Button size='lg' onClick={() => onEdit?.()}>
              <Pencil className='h-5 w-5' />
              <span className='text-sm'>書き込み</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
