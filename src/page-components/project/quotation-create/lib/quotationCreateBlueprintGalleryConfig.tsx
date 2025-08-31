import React from 'react';
import { Button, GalleryViewConfig } from '@/shared';
import { PlusIcon } from 'lucide-react';
import { BlueprintDetailDataInterface } from '@/dummy-data-er-fix/blueprint';

// 見積もりステータスの判定
const getEstimateStatus = (blueprint: BlueprintDetailDataInterface) => {
  // totalCostが0または空文字列でない場合は見積もり完了とみなす
  if (
    blueprint.estimate_information?.totalCost &&
    blueprint.estimate_information.totalCost !== '0'
  ) {
    return { status: '完了', color: 'text-green-600 bg-green-50' };
  }
  return { status: '未完了', color: 'text-orange-600 bg-orange-50' };
};

// 見積書作成用図面ギャラリー設定
export const createQuotationCreateBlueprintGalleryConfig = (
  onEstimate: (blueprint: BlueprintDetailDataInterface) => void,
): GalleryViewConfig<BlueprintDetailDataInterface> => ({
  layoutConfig: {
    grid: { xs: 1, sm: 2, md: 2, lg: 3 },
    aspectRatio: 'video', // 16:9 アスペクト比
  },

  itemConfig: {
    showThumbnail: true,
    getThumbnailUrl: (blueprint) => blueprint.s3_url,

    // ホバー時のオーバーレイ（見積もるボタン）
    thumbnailOverlayRender: (blueprint) => (
      <div className='absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity duration-200 group-hover:opacity-100'>
        <Button onClick={() => onEstimate(blueprint)} size='lg'>
          <PlusIcon className='h-4 w-4' />
          見積もる
        </Button>
      </div>
    ),

    // カード下部のコンテンツ（図面名 + ステータス）
    contentRender: (blueprint) => {
      const { status, color } = getEstimateStatus(blueprint);

      return (
        <div className='space-y-2'>
          <div>
            <h3 className='truncate text-sm font-medium text-gray-900'>
              {blueprint.drawing_file_name}
            </h3>
          </div>

          <div className='flex items-center justify-between'>
            <span
              className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${color}`}
            >
              {status}
            </span>
            {status === '完了' && (
              <span className='text-xs text-gray-600'>
                ¥
                {parseInt(
                  blueprint.estimate_information?.totalCost || '0',
                ).toLocaleString()}
              </span>
            )}
          </div>
        </div>
      );
    },
  },

  pagination: {
    enabled: false,
  },

  getRowId: (blueprint) => blueprint.id.toString(),
});
