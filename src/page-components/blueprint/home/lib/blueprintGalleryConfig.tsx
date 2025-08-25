import React from 'react';
import { Badge, GalleryViewConfig } from '@/shared';
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
      <>
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm text-gray-600">
            {blueprint.orderSource}
          </p>
          <Badge variant="outline" className="text-xs">
            {blueprint.companyField}
          </Badge>
        </div>
        <h3 className="font-medium text-gray-900 mb-1">
          {blueprint.productName}
        </h3>
        <div className="flex items-center justify-between">
          <Badge variant="outline" className="font-mono text-xs">
            {blueprint.customerNumber}
          </Badge>
          <span className="text-xs text-gray-500">
            {blueprint.orderQuantity}個
          </span>
        </div>
        <div className="mt-2 text-xs text-gray-500">
          {blueprint.orderDate} 〜 {blueprint.deliveryDate}
        </div>
      </>
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