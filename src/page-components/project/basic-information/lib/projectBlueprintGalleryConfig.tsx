import React from 'react';
import { GalleryViewConfig, Button } from '@/shared';
import { Blueprint } from '@/page-components';
import { Eye, Focus } from 'lucide-react';

export const createProjectBlueprintGalleryConfig = (
  onShowDetail: (blueprint: Blueprint) => void,
  onFullPage: (blueprint: Blueprint) => void
): GalleryViewConfig<Blueprint> => ({
  layoutConfig: {
    grid: { xs: 2, lg: 3 },
    aspectRatio: 'video'
  },
  
  itemConfig: {
    showThumbnail: true,
    getThumbnailUrl: (blueprint) => blueprint.image || "https://jp.meviy.misumi-ec.com/info/ja/wp-content/uploads/2022/04/y1-1.jpg",
    thumbnailOverlayRender: (blueprint) => (
      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center gap-2">
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
  
  pagination: {
    enabled: true,
    defaultItemsPerPage: 20,
    allowedItemsPerPage: [10, 20, 50, 100],
    showItemsPerPageSelector: true,
    maxVisiblePages: 7,
  },
  
  getRowId: (blueprint) => blueprint.internalNumber
});