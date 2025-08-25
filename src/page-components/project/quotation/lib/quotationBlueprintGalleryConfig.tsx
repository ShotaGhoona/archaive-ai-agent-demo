import React from 'react';
import { GalleryViewConfig } from '@/shared/view/gallery-view';
import { Button } from '@/shared';
import { PlusIcon } from 'lucide-react';
import { QuotationBlueprint } from '../model';

// 見積もりステータスの判定
const getEstimateStatus = (blueprint: QuotationBlueprint) => {
  // totalCostが0または空文字列でない場合は見積もり完了とみなす
  if (blueprint.estimateInformation.totalCost && blueprint.estimateInformation.totalCost !== "0") {
    return { status: "完了", color: "text-green-600 bg-green-50" };
  }
  return { status: "未完了", color: "text-orange-600 bg-orange-50" };
};

// 見積書作成用図面ギャラリー設定
export const createQuotationBlueprintGalleryConfig = (
  onEstimate: (blueprint: QuotationBlueprint) => void
): GalleryViewConfig<QuotationBlueprint> => ({
  layoutConfig: {
    grid: { xs: 1, sm: 2, md: 2, lg: 3 },
    aspectRatio: 'video' // 16:9 アスペクト比
  },
  
  itemConfig: {
    showThumbnail: true,
    getThumbnailUrl: (blueprint) => blueprint.imageUrl,
    
    // ホバー時のオーバーレイ（見積もるボタン）
    thumbnailOverlayRender: (blueprint) => (
      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
        <Button 
          onClick={() => onEstimate(blueprint)}
          size="lg"
        >
          <PlusIcon className="w-4 h-4" />
          見積もる
        </Button>
      </div>
    ),
    
    // カード下部のコンテンツ（図面名 + ステータス）
    contentRender: (blueprint) => {
      const { status, color } = getEstimateStatus(blueprint);
      
      return (
        <div className="space-y-2">
          <div>
            <h3 className="font-medium text-gray-900 text-sm truncate">
              {blueprint.name}
            </h3>
          </div>
          
          <div className="flex items-center justify-between">
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${color}`}>
              {status}
            </span>
            {status === "完了" && (
              <span className="text-xs text-gray-600">
                ¥{parseInt(blueprint.estimateInformation.totalCost).toLocaleString()}
              </span>
            )}
          </div>
        </div>
      );
    }
  },
  
  pagination: {
    enabled: true,
    defaultItemsPerPage: 20,
    allowedItemsPerPage: [10, 20, 50, 100],
    showItemsPerPageSelector: true,
    maxVisiblePages: 7,
  },
  
  getRowId: (blueprint) => blueprint.id,
});