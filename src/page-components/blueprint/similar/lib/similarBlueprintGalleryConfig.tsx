import React from 'react';
import { Button, CardContent } from '@/shared/shadcnui';
import { Search, GitCompareArrows } from 'lucide-react';
import { GalleryViewConfig } from '@/shared/view/gallery-view';
import { SimilarBlueprint } from '@/widgets/blueprint-detail-layout/model/types';

export const createSimilarBlueprintGalleryConfig = (
  handleDifferenceDetection: (blueprint: SimilarBlueprint) => void,
  handleDetailedComparison: (blueprint: SimilarBlueprint) => void
): GalleryViewConfig<SimilarBlueprint> => ({
  layoutConfig: {
    grid: { xs: 1, md: 2 },
    aspectRatio: '4/3'
  },
  
  itemConfig: {
    showThumbnail: true,
    getThumbnailUrl: (blueprint) => blueprint.imageUrl,
    
    // ホバー時のオーバーレイボタン
    thumbnailOverlayRender: (blueprint) => (
      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center gap-2">
        <Button
          variant="outline"
          onClick={(e) => {
            e.stopPropagation();
            handleDifferenceDetection(blueprint);
          }}
        >
          <Search className="h-4 w-4 mr-1" />
          差分検出
        </Button>
        <Button
          onClick={(e) => {
            e.stopPropagation();
            handleDetailedComparison(blueprint);
          }}
        >
          <GitCompareArrows className="h-4 w-4 mr-1" />
          詳細比較
        </Button>
      </div>
    ),
    
    // カード下部のコンテンツ
    contentRender: (blueprint) => (
      <h4 className="text-sm font-medium text-gray-900 truncate">
        {blueprint.name}
      </h4>
    )
  },
  
  getRowId: (blueprint) => blueprint.id
});