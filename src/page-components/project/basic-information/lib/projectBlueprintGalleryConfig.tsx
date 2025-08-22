import React from 'react';
import { GalleryViewConfig } from '@/shared/view/gallery-view';
import { Blueprint } from '@/page-components/blueprint/home/lib/blueprintColumns';

export const createProjectBlueprintGalleryConfig = (): GalleryViewConfig<Blueprint> => ({
  layoutConfig: {
    grid: { xs: 2, lg: 3 },
    aspectRatio: 'video'
  },
  
  itemConfig: {
    showThumbnail: true,
    getThumbnailUrl: (blueprint) => blueprint.image || "https://jp.meviy.misumi-ec.com/info/ja/wp-content/uploads/2022/04/y1-1.jpg",
    contentRender: (blueprint) => (
      <div className="space-y-1">
        <p className="text-sm font-medium truncate" title={blueprint.filename}>
          {blueprint.filename}
        </p>
        <p className="text-xs text-gray-500 truncate" title={blueprint.productName}>
          {blueprint.productName}
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
  
  getRowId: (blueprint) => blueprint.internalNumber
});