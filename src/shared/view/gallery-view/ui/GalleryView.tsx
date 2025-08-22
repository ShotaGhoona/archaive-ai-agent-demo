import React from 'react';
import { GalleryViewProps } from '../model';
import { useGalleryLayout } from '../lib';
import { GalleryItem } from './GalleryItem';

export function GalleryView<T>({ 
  data, 
  config, 
  loading = false 
}: GalleryViewProps<T>) {
  const { gridClasses, aspectRatioClass } = useGalleryLayout(config.layoutConfig);

  // ローディング状態
  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-gray-500">読み込み中...</div>
      </div>
    );
  }

  // 空の状態
  if (data.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500 text-sm">
        データがありません
      </div>
    );
  }

  return (
    <div className={`overflow-auto flex-1 ${config.className || ''}`}>
      <div className={`${gridClasses} gap-6 p-1`}>
        {data.map((item) => {
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
  );
}