import React from 'react';
import { GalleryViewConfig } from '@/shared';
import { Calendar, Building2 } from 'lucide-react';
import { Blueprint } from '../lib';

export const createBlueprintGalleryConfig = (): GalleryViewConfig<Blueprint> => ({
  layoutConfig: {
    grid: { xs: 1, md: 2, lg: 3, xl: 4 },
    aspectRatio: 'video'
  },
  
  itemConfig: {
    showThumbnail: true,
    getThumbnailUrl: (blueprint) => blueprint.image,
    contentRender: (blueprint) => (
      <div className="space-y-1">
        <h3 className="text-lg font-semibold text-gray-900">
          {blueprint.productName}
        </h3>
        <p className="text-sm text-gray-600 flex items-center gap-1">
          <Calendar size={14} />
          {blueprint.orderDate}
        </p>
        <p className="text-sm text-gray-600 flex items-center gap-1">
          <Building2 size={14} />
          {blueprint.orderSource}
        </p>
      </div>
    )
  },
  
  behaviorConfig: {
    linkConfig: {
      enabled: true,
      getHref: (blueprint) => `/blueprint/${blueprint.internalNumber}/basic-information`
    }
  },
  
  pagination: {
    enabled: true,
    defaultItemsPerPage: 20,
    allowedItemsPerPage: [10, 20, 50, 100],
    showItemsPerPageSelector: true,
    maxVisiblePages: 7,
  },
  
  getRowId: (blueprint) => blueprint.internalNumber
});