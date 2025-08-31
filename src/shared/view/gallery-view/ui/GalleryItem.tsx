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
  aspectRatioClass,
}: GalleryItemProps<T>) {
  const { itemConfig, behaviorConfig } = config;
  const isLinkEnabled = behaviorConfig?.linkConfig?.enabled;

  const content = (
    <div className='group relative overflow-hidden rounded-lg border border-gray-200 bg-white transition-shadow hover:shadow-md'>
      {/* サムネイル部分 */}
      {itemConfig.showThumbnail && itemConfig.getThumbnailUrl && (
        <div
          className={`relative overflow-hidden bg-gray-50 ${aspectRatioClass}`}
        >
          <img
            src={itemConfig.getThumbnailUrl(item)}
            alt=''
            className='h-full w-full object-cover transition-transform duration-200 group-hover:scale-105'
          />

          {/* サムネイルオーバーレイ */}
          {itemConfig.thumbnailOverlayRender &&
            itemConfig.thumbnailOverlayRender(item)}
        </div>
      )}

      {/* カスタムコンテンツ */}
      <div className='p-3'>{itemConfig.contentRender(item)}</div>
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
