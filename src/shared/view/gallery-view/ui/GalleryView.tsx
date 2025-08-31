import React from 'react';
import { GalleryViewProps } from '../model';
import { useGalleryLayout, usePaginatedGallery } from '../lib';
import { GalleryItem, GalleryPagination } from '../ui';

export function GalleryView<T>({ data, config }: GalleryViewProps<T>) {
  const { gridClasses, aspectRatioClass } = useGalleryLayout(
    config.layoutConfig,
  );

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
    initialItemsPerPage: paginationConfig.enabled
      ? paginationConfig.defaultItemsPerPage || 20
      : data.length,
    initialPage: 1,
  });

  // 表示するデータを決定
  const displayData = paginationConfig.enabled ? currentData : data;
  // 空の状態
  if (data.length === 0) {
    return (
      <div className='flex flex-1 items-center justify-center text-sm text-gray-500'>
        データがありません
      </div>
    );
  }

  return (
    <div className={`flex h-full flex-col ${config.className || ''}`}>
      {/* ギャラリーアイテム */}
      <div className='min-h-0 flex-1 overflow-auto'>
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
        <div className='flex-shrink-0 border-t px-4 py-2'>
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
