import React from 'react';
import { GalleryViewConfig } from '@/shared/view/gallery-view';

export interface RegisterBlueprint {
  id: string;
  filename: string;
  productName: string;
  thumbnailUrl: string;
  uploadDate: string;
}

export const createRegisterBlueprintGalleryConfig = (): GalleryViewConfig<RegisterBlueprint> => ({
  layoutConfig: {
    grid: { xs: 2, lg: 3, xl: 4 },
    aspectRatio: 'video'
  },
  
  itemConfig: {
    showThumbnail: true,
    getThumbnailUrl: (blueprint) => blueprint.thumbnailUrl,
    
    contentRender: (blueprint) => (
      <div className="space-y-1">
        <p className="text-xs font-medium truncate" title={blueprint.filename}>
          {blueprint.filename}
        </p>
        <p className="text-xs text-gray-500 truncate" title={blueprint.productName}>
          {blueprint.productName}
        </p>
      </div>
    )
  },
  
  pagination: {
    enabled: false // アップロード画面では全件表示
  },
  
  getRowId: (blueprint) => blueprint.id
});