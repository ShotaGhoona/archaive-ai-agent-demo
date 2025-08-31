import React from 'react';
import { GalleryViewConfig } from '@/shared/view/gallery-view';
import { BlueprintDetailDataInterface } from '@/dummy-data-er-fix/blueprint';

export const createRegisterBlueprintGalleryConfig =
  (): GalleryViewConfig<BlueprintDetailDataInterface> => ({
    layoutConfig: {
      grid: { xs: 2, lg: 3, xl: 4 },
      aspectRatio: 'video',
    },

    itemConfig: {
      showThumbnail: true,
      getThumbnailUrl: (blueprint) => blueprint.s3_url,

      contentRender: (blueprint) => (
        <div className='space-y-1'>
          <p
            className='truncate text-xs font-medium'
            title={blueprint.drawing_file_name}
          >
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
