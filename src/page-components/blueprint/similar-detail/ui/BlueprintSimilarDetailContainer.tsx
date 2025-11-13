'use client';
import React from 'react';
import {
  AdvancedFilterSidebar,
  useAdvancedFilter,
  Loading,
  ResizableLayout,
  ResizablePanel,
  ResizableHandle,
} from '@/shared';
import { SimilarBlueprintGallery } from '@/widgets';
import { TargetBlueprintPanel, SimilarGalleryHeader } from '../ui';
import {
  useSimilarDetailData,
  SIMILAR_DETAIL_FILTER_CONFIG,
  similarDetailResizableLayoutConfig,
} from '../lib';
import { SimilarDetailContainerProps } from '../model';

export function BlueprintSimilarDetailContainer({
  initialBlueprintId,
}: SimilarDetailContainerProps) {
  // データ取得
  const { targetBlueprint, similarBlueprints, isLoading } =
    useSimilarDetailData(initialBlueprintId);

  // フィルター管理
  const {
    filteredData: filteredSimilarBlueprints,
    isOpen: isFilterSidebarOpen,
    toggleSidebar,
    filters,
    setFilters,
    clearFilters,
  } = useAdvancedFilter(similarBlueprints, SIMILAR_DETAIL_FILTER_CONFIG);

  if (isLoading) {
    return (
      <Loading
        title='類似図面を検索中...'
        description='AIが図面を解析しています'
        fullHeight
      />
    );
  }

  return (
    <div className='flex h-[calc(100vh-45px)] overflow-hidden'>
      {/* フィルターサイドバー */}
      <AdvancedFilterSidebar
        isOpen={isFilterSidebarOpen}
        onToggle={toggleSidebar}
        filters={filters}
        onFiltersChange={setFilters}
        onClearFilters={clearFilters}
        config={SIMILAR_DETAIL_FILTER_CONFIG}
      />

      {/* メインコンテンツ */}
      <div
        className={`flex flex-1 overflow-hidden transition-all duration-300 ${
          isFilterSidebarOpen ? 'ml-80' : 'ml-0'
        }`}
      >
        <ResizableLayout
          config={similarDetailResizableLayoutConfig}
          className='h-full'
        >
          {/* 左側: 対象図面パネル */}
          <ResizablePanel index={0}>
            <TargetBlueprintPanel targetBlueprint={targetBlueprint} />
          </ResizablePanel>

          <ResizableHandle />

          {/* 右側: 類似図面ギャラリー */}
          <ResizablePanel index={1}>
            <div className='flex h-full flex-col overflow-hidden'>
              {/* ギャラリーヘッダー */}
              <SimilarGalleryHeader
                onToggleFilterSidebar={toggleSidebar}
                isFilterSidebarOpen={isFilterSidebarOpen}
              />

              {/* ギャラリーコンテンツ */}
              <div className='flex-1 overflow-y-auto'>
                <SimilarBlueprintGallery
                  similarBlueprints={filteredSimilarBlueprints}
                  activeView={targetBlueprint.blueprint}
                />
              </div>
            </div>
          </ResizablePanel>
        </ResizableLayout>
      </div>
    </div>
  );
}
