import React from 'react';
import { GalleryViewConfig } from '@/shared';
import { Calendar, Building2 } from 'lucide-react';
import { DrawingPageBaseDataInterface } from '@/dummy-data-er-fix/blueprint';

export const createBlueprintGalleryConfig =
  (): GalleryViewConfig<DrawingPageBaseDataInterface> => ({
    layoutConfig: {
      grid: { xs: 1, md: 2, lg: 3, xl: 4 },
      aspectRatio: 'video',
    },

    itemConfig: {
      showThumbnail: true,
      getThumbnailUrl: (blueprint) => blueprint.s3_url,
      contentRender: (blueprint) => (
        <div className='space-y-1'>
          <h3 className='text-lg font-semibold text-gray-900'>
            {blueprint.leaf_product_name}
          </h3>
          <p className='flex items-center gap-1 text-sm text-gray-600'>
            <Calendar size={14} />
            {blueprint.created_at}
          </p>
          <p className='flex items-center gap-1 text-sm text-gray-600'>
            <Building2 size={14} />
            {blueprint.customer_name}
          </p>
        </div>
      ),
    },

    behaviorConfig: {
      linkConfig: {
        enabled: true,
        getHref: (blueprint) =>
          `/blueprint/${blueprint.id}/basic-information`,
      },
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
