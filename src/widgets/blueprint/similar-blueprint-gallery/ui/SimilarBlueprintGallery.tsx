'use client';
import React from 'react';
import { GalleryView, Loading, Button } from '@/shared';
import { ChevronRight } from 'lucide-react';
import { createSimilarBlueprintGalleryConfig } from '../lib';
import { SimilarBlueprintGalleryProps } from '../model';
import { useSimilarBlueprintGallery } from '../lib';

export function SimilarBlueprintGallery({
  similarBlueprints = [],
  activeView,
  onDifferenceDetection,
  onDetailView,
  showDetailViewButton = false,
  isLoading = false,
}: SimilarBlueprintGalleryProps) {
  const {
    handleDifferenceDetection,
    handleDetailView,
  } = useSimilarBlueprintGallery({
    similarBlueprints,
    activeView,
    onDifferenceDetection,
    onDetailView,
  });

  // ギャラリー設定を作成
  const galleryConfig = createSimilarBlueprintGalleryConfig(
    handleDifferenceDetection,
  );

  // ローディング状態のUI
  if (isLoading) {
    return (
      <Loading
        title='類似図面を検索中...'
        description='AIが図面を解析しています'
        fullHeight
      />
    );
  }

  if (similarBlueprints.length === 0) {
    return (
      <div
        className={`flex h-full flex-col items-center justify-center`}
      >
        <div className='flex flex-1 items-center justify-center p-4'>
          <div className='space-y-2 text-center'>
            <div className='text-4xl text-gray-300'>🔍</div>
            <div className='text-sm text-gray-500'>
              類似図面が見つかりませんでした
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex h-full flex-col`}>
      {/* オプショナルヘッダー */}
      {showDetailViewButton && (
        <div className='flex items-center justify-between p-4'>
          <h3 className='text-lg font-semibold text-primary'>類似図面</h3>
          <Button
            variant='outline'
            size='sm'
            onClick={() => handleDetailView(activeView!)}
            disabled={!activeView}
          >
            <ChevronRight className='mr-1 h-4 w-4' />
            類似図面詳細ページへ
          </Button>
        </div>
      )}

      <div className='min-h-0 flex-1 overflow-y-auto p-4'>
        <GalleryView data={similarBlueprints} config={galleryConfig} />
      </div>
    </div>
  );
}
