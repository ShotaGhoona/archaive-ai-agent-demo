import React from 'react';
import { Button } from '@/shared';
import { Plus } from 'lucide-react';
import { GalleryViewConfig } from '@/shared/view/gallery-view';

export interface RepeatBlueprint {
  filename: string;
  orderSource: string;
  productName: string;
  internalNumber: string;
  customerNumber: string;
  cadName: string;
  camName: string;
  orderQuantity: number;
  orderDate: string;
  deliveryDate: string;
  maxDimensionL: number;
  maxDimensionD: number;
  maxDimensionH: number;
  companyField: string;
  image: string;
}

interface CreateRepeatBlueprintGalleryConfigOptions {
  onRepeatRegister: (blueprint: RepeatBlueprint) => void;
}

export const createRepeatBlueprintGalleryConfig = ({
  onRepeatRegister
}: CreateRepeatBlueprintGalleryConfigOptions): GalleryViewConfig<RepeatBlueprint> => ({
  layoutConfig: {
    grid: { xs: 1, md: 2, lg: 2 },
    aspectRatio: 'video'
  },
  
  itemConfig: {
    showThumbnail: true,
    getThumbnailUrl: (blueprint) => blueprint.image,
    
    // ホバー時にリピート品登録ボタンを表示
    thumbnailOverlayRender: (blueprint) => (
      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
        <Button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onRepeatRegister(blueprint);
          }}
          className="bg-primary hover:bg-primary/90"
        >
          <Plus className="h-4 w-4 mr-2" />
          リピート品として登録
        </Button>
      </div>
    ),
    
    contentRender: (blueprint) => (
      <>
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm text-gray-600 truncate">
            {blueprint.orderSource}
          </p>
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
            {blueprint.companyField}
          </span>
        </div>
        <h3 className="font-medium text-gray-900 mb-1 line-clamp-1">
          {blueprint.productName}
        </h3>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-gray-500 font-mono">
            {blueprint.customerNumber}
          </span>
          <span className="text-xs text-gray-500">
            {blueprint.orderQuantity}個
          </span>
        </div>
        <div className="text-xs text-gray-500">
          {blueprint.orderDate} 〜 {blueprint.deliveryDate}
        </div>
      </>
    )
  },
  
  behaviorConfig: {
    linkConfig: {
      enabled: true,
      getHref: (blueprint) => `/blueprint/${blueprint.internalNumber}/basic-information`,
      target: '_blank'
    }
  },
  
  pagination: {
    enabled: true,
    defaultItemsPerPage: 10,
    allowedItemsPerPage: [5, 10, 20, 50],
    showItemsPerPageSelector: true,
    maxVisiblePages: 5,
  },
  
  getRowId: (blueprint) => blueprint.internalNumber
});