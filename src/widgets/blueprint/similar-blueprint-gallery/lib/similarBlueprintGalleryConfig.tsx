import React from 'react';
import { Button, GalleryViewConfig } from '@/shared';
import { Search } from 'lucide-react';
import { BlueprintDetailDataInterface } from '@/dummy-data-er-fix/blueprint/interfaces/types';

export const createSimilarBlueprintGalleryConfig = (
  handleDifferenceDetection: (blueprint: BlueprintDetailDataInterface) => void,
  // handleDetailedComparison: (blueprint: BlueprintDetailDataInterface) => void,
): GalleryViewConfig<BlueprintDetailDataInterface> => ({
  layoutConfig: {
    grid: { xs: 1, md: 2 },
    aspectRatio: '4/3',
  },

  itemConfig: {
    showThumbnail: true,
    getThumbnailUrl: (blueprint) => blueprint.s3_url,

    // ホバー時のオーバーレイボタン
    thumbnailOverlayRender: (blueprint) => (
      <div className='absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/50 opacity-0 transition-opacity duration-200 group-hover:opacity-100'>
        <Button
          variant='outline'
          onClick={(e) => {
            e.stopPropagation();
            handleDifferenceDetection(blueprint);
          }}
        >
          <Search className='mr-1 h-4 w-4' />
          差分検出
        </Button>
        {/* <Button
          onClick={(e) => {
            e.stopPropagation();
            handleDetailedComparison(blueprint);
          }}
        >
          <GitCompareArrows className='mr-1 h-4 w-4' />
          詳細比較
        </Button> */}
      </div>
    ),

    // カード下部のコンテンツ
    contentRender: (blueprint) => (
      <h4 className='truncate text-sm font-medium text-gray-900'>
        {blueprint.drawing_file_name}
      </h4>
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
