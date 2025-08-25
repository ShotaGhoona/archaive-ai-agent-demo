import React from 'react';
import { GalleryViewProps } from '../model';
import { useGalleryLayout, usePaginatedGallery } from '../lib';
import { GalleryItem, GalleryPagination } from '../ui';
import { LoadingSkeleton } from '@/shared';

export function GalleryView<T>({ 
  data, 
  config, 
  loading = false 
}: GalleryViewProps<T>) {
  const { gridClasses, aspectRatioClass } = useGalleryLayout(config.layoutConfig);
  
  // ページネーション設定
  const paginationConfig = config.pagination || { enabled: false };
  
  // ページネーション機能
  const {
    currentData,
    currentPage,
    totalPages,
    itemsPerPage,
    totalItems,
    setCurrentPage,
    setItemsPerPage,
  } = usePaginatedGallery({
    data,
    initialItemsPerPage: paginationConfig.enabled ? (paginationConfig.defaultItemsPerPage || 20) : data.length,
    initialPage: 1,
  });

  // 表示するデータを決定
  const displayData = paginationConfig.enabled ? currentData : data;
  // 空の状態
  if (data.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500 text-sm">
        データがありません
      </div>
    );
  }

  return (
    <div className={`h-full flex flex-col ${config.className || ''}`}>
      {/* ギャラリーアイテム */}
      <div className="flex-1 overflow-auto min-h-0">
        <div className={`${gridClasses} gap-6 p-1`}>
          {displayData.map((item) => {
            const rowId = config.getRowId?.(item) || String(Math.random());
            return (
              <GalleryItem
                key={rowId}
                item={item}
                config={config}
                aspectRatioClass={aspectRatioClass}
              />
            );
          })}
        </div>
      </div>
      
      {/* ページネーション */}
      {paginationConfig.enabled && (
        <div className="flex-shrink-0 px-4 py-2 bg-white border-t">
          <GalleryPagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={setItemsPerPage}
            showItemsPerPageSelector={paginationConfig.showItemsPerPageSelector}
            maxVisiblePages={paginationConfig.maxVisiblePages}
            allowedItemsPerPage={paginationConfig.allowedItemsPerPage}
          />
        </div>
      )}
    </div>
  );
}