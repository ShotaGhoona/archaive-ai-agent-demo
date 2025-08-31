'use client';
import React from 'react';
import { GalleryView, Loading } from '@/shared';
import { createSimilarBlueprintGalleryConfig } from '../lib';
import { SimilarBlueprintGalleryProps } from '../model';
import { useSimilarBlueprintGallery } from '../lib';

export function SimilarBlueprintGallery({
  similarBlueprints = [],
  activeView,
  onDifferenceDetection,
  // onDetailedComparison,
  isLoading = false,
}: SimilarBlueprintGalleryProps) {
  const {
    handleDifferenceDetection,
    // handleDetailedComparison,
  } = useSimilarBlueprintGallery({
    similarBlueprints,
    activeView,
    onDifferenceDetection,
    // onDetailedComparison,
  });

  // ギャラリー設定を作成
  const galleryConfig = createSimilarBlueprintGalleryConfig(
    handleDifferenceDetection,
    // handleDetailedComparison,
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
      <div className='min-h-0 flex-1 overflow-y-auto p-4'>
        <GalleryView data={similarBlueprints} config={galleryConfig} />
      </div>
    </div>
  );
}
