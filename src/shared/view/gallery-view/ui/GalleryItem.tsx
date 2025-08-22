import React from 'react';
import Link from 'next/link';
import { GalleryViewConfig, AspectRatioClass } from '../model';

interface GalleryItemProps<T> {
  item: T;
  config: GalleryViewConfig<T>;
  aspectRatioClass: AspectRatioClass;
}

export function GalleryItem<T>({ 
  item, 
  config, 
  aspectRatioClass 
}: GalleryItemProps<T>) {
  const { itemConfig, behaviorConfig } = config;
  const isLinkEnabled = behaviorConfig?.linkConfig?.enabled;
  
  const content = (
    <div className="relative bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow group">
      {/* サムネイル部分 */}
      {itemConfig.showThumbnail && itemConfig.getThumbnailUrl && (
        <div className={`overflow-hidden bg-gray-50 relative ${aspectRatioClass}`}>
          <img
            src={itemConfig.getThumbnailUrl(item)}
            alt=""
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          />
          
          {/* サムネイルオーバーレイ */}
          {itemConfig.thumbnailOverlayRender && (
            itemConfig.thumbnailOverlayRender(item)
          )}
        </div>
      )}
      
      {/* カスタムコンテンツ */}
      <div className="p-3">
        {itemConfig.contentRender(item)}
      </div>
    </div>
  );

  return isLinkEnabled ? (
    <Link
      href={behaviorConfig.linkConfig!.getHref(item)}
      target={behaviorConfig.linkConfig!.target || '_self'}
    >
      {content}
    </Link>
  ) : (
    <>{content}</>
  );
}