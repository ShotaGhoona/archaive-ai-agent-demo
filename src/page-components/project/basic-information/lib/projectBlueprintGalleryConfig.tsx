import React from 'react';
import { GalleryViewConfig, Button } from '@/shared';
import { BlueprintDetailDataInterface } from '@/dummy-data-er-fix/blueprint';
import { Eye, Focus } from 'lucide-react';

export const createProjectBlueprintGalleryConfig = (
  onShowDetail: (blueprint: BlueprintDetailDataInterface) => void,
  onFullPage: (blueprint: BlueprintDetailDataInterface) => void,
): GalleryViewConfig<BlueprintDetailDataInterface> => ({
  layoutConfig: {
    grid: { xs: 2, lg: 3 },
    aspectRatio: 'video',
  },

  itemConfig: {
    showThumbnail: true,
    getThumbnailUrl: (blueprint) => blueprint.s3_url,
    thumbnailOverlayRender: (blueprint) => (
      <div className='absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/50 opacity-0 transition-opacity duration-200 group-hover:opacity-100'>
        <Button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onShowDetail(blueprint);
          }}
        >
          <Eye size={16} />
          ちょっと見る
        </Button>
        <Button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onFullPage(blueprint);
          }}
        >
          <Focus size={16} />
          しっかり見る
        </Button>
      </div>
    ),
    contentRender: (blueprint) => (
      <div className='space-y-1'>
        <p className='truncate text-sm font-medium' title={blueprint.drawing_file_name}>
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

  pagination: {
    enabled: true,
    defaultItemsPerPage: 20,
    allowedItemsPerPage: [10, 20, 50, 100],
    showItemsPerPageSelector: true,
    maxVisiblePages: 7,
  },

  getRowId: (blueprint) => blueprint.id.toString(),
});
