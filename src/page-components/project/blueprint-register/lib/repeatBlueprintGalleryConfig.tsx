import React from 'react';
import { Button } from '@/shared';
import { Plus } from 'lucide-react';
import { GalleryViewConfig } from '@/shared/view/gallery-view';
import { DrawingPageBaseDataInterface } from '@/dummy-data-er-fix/blueprint';

interface CreateRepeatBlueprintGalleryConfigOptions {
  onRepeatRegister: (blueprint: DrawingPageBaseDataInterface) => void;
}

export const createRepeatBlueprintGalleryConfig = ({
  onRepeatRegister,
}: CreateRepeatBlueprintGalleryConfigOptions): GalleryViewConfig<DrawingPageBaseDataInterface> => ({
  layoutConfig: {
    grid: { xs: 1, md: 2, lg: 3 },
    aspectRatio: 'video',
  },

  itemConfig: {
    showThumbnail: true,
    getThumbnailUrl: (blueprint) => blueprint.s3_url,

    // ホバー時にリピート品登録ボタンを表示
    thumbnailOverlayRender: (blueprint) => (
      <div className='absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity duration-200 group-hover:opacity-100'>
        <Button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onRepeatRegister(blueprint);
          }}
        >
          <Plus className='mr-2 h-4 w-4' />
          リピート品として登録
        </Button>
      </div>
    ),

    contentRender: (blueprint) => (
      <div className='space-y-1'>
        <p className='truncate text-xs font-medium' title={blueprint.drawing_file_name}>
          {blueprint.drawing_file_name}
        </p>
        <p
          className='truncate text-xs text-gray-500'
          title={blueprint.leaf_product_name}
        >
          {blueprint.leaf_product_name}
        </p>
      </div>
    ),
  },

  behaviorConfig: {
    linkConfig: {
      enabled: true,
      getHref: (blueprint) =>
        `/blueprint/${blueprint.id}/basic-information`,
      target: '_blank',
    },
  },

  pagination: {
    enabled: true,
    defaultItemsPerPage: 10,
    allowedItemsPerPage: [5, 10, 20, 50],
    showItemsPerPageSelector: true,
    maxVisiblePages: 5,
  },

  getRowId: (blueprint) => blueprint.id.toString(),
});
