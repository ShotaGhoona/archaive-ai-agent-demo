'use client';
import {
  Card,
  CardContent,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  Button,
  Badge,
} from '@/shared/shadcnui';
import { LeafProductDataInterface } from '@/dummy-data-er-fix/blueprint/interfaces/types';
import { RevisionBlueprintBarContainerProps } from '../model/types';
import {
  FileText,
  ExternalLink,
  Briefcase,
  Star,
  FolderOpen,
  Building,
  Calendar,
} from 'lucide-react';

export function RevisionBlueprintBarContainer({
  blueprints,
}: RevisionBlueprintBarContainerProps) {
  const handleOpenBlueprintPage = (blueprintId: number) => {
    window.open(`/blueprint/${blueprintId}/basic-information`, '_blank');
  };

  const handleOpenProjectPage = (directoryId: number) => {
    window.open(`/project/${directoryId}/basic-information`, '_blank');
  };


  const handleButtonClick = (e: React.MouseEvent, action: () => void) => {
    e.preventDefault();
    e.stopPropagation();
    action();
  };

  const getCustomItemColor = (item: { value: string; color?: string; type: string }) => {
    if (item.type === 'select' && item.color) {
      return item.color;
    }
    return 'gray';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
    });
  };

  return (
    <div className='absolute top-0 right-0 left-0 z-20 border-b bg-gradient-to-b from-white via-white/50 to-transparent backdrop-blur-sm'>
      <div className='flex h-full items-center gap-3 overflow-x-auto p-4'>
        {blueprints?.map((blueprint) => (
          <Tooltip key={blueprint.id} delayDuration={300}>
            <TooltipTrigger asChild>
              <div className='flex-shrink-0'>
                <Card className={`w-40 p-0 transition-all duration-200 hover:shadow-md`}>
                  <CardContent className='p-2'>
                    <div className='space-y-2'>
                      {/* プレースホルダー画像部分 */}
                      <div className='aspect-video w-full overflow-hidden rounded bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center'>
                        <FileText className='h-8 w-8 text-gray-400' />
                      </div>

                      {/* 製品名とリビジョン情報 */}
                      <div className='space-y-1 px-1'>
                        <h4
                          className='truncate text-xs font-medium text-gray-900'
                          title={blueprint.leaf_product_custom_items['製品名']?.value || `製品 ${blueprint.id}`}
                        >
                          {blueprint.leaf_product_custom_items['製品名']?.value || `製品 ${blueprint.id}`}
                        </h4>
                        <div className='flex items-center gap-1'>
                          <span className='text-xs text-gray-500'>
                            Rev.{blueprint.revision_number}
                          </span>
                          {blueprint.is_latest && (
                            <Star className='h-3 w-3 text-yellow-500 fill-yellow-500' />
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TooltipTrigger>
            <TooltipContent
              side='bottom'
              className='w-96 border-0 p-0 shadow-2xl backdrop-blur-sm'
              style={{ filter: 'drop-shadow(0 25px 50px rgba(0, 0, 0, 0.25))' }}
            >
              <div className='overflow-hidden rounded-lg bg-white'>
                {/* 大きなプレースホルダー画像 */}
                <div className='aspect-video w-full bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center'>
                  <FileText className='h-16 w-16 text-gray-400' />
                </div>

                {/* 詳細情報部分 */}
                <div className='space-y-3 p-4'>
                  {/* 基本情報セクション */}
                  <div>
                    <h3 className='font-medium text-gray-900 mb-2'>
                      {blueprint.leaf_product_custom_items['製品名']?.value || `製品 ${blueprint.id}`} Rev.{blueprint.revision_number}
                      {blueprint.is_latest && (
                        <Star className='ml-2 h-4 w-4 text-yellow-500 fill-yellow-500 inline' />
                      )}
                    </h3>
                    <div className='space-y-1 text-sm text-gray-600'>
                      <div className='flex items-center gap-2'>
                        <Briefcase className='h-4 w-4' />
                        <span className='font-medium'>案件:</span>
                        <span>{blueprint.directory_name}</span>
                      </div>
                      <div className='flex items-center gap-2'>
                        <Building className='h-4 w-4' />
                        <span className='font-medium'>顧客:</span>
                        <span>{blueprint.customer_name}</span>
                      </div>
                      <div className='flex items-center gap-2 mb-2'>
                        <Calendar className='h-4 w-4' />
                        <span className='font-medium'>作成:</span>
                        <span>{formatDate(blueprint.created_at)}</span>
                      </div>
                    </div>
                  </div>

                  {/* カスタム項目セクション */}
                  <div className='border-t pt-3'>
                    <div className='space-y-2 text-sm'>
                      {Object.entries(blueprint.leaf_product_custom_items).map(([key, item]) => (
                        <div key={key} className='flex justify-between items-center'>
                          <span className='text-gray-600'>{key}:</span>
                          {item.type === 'select' && item.color ? (
                            <Badge 
                              variant="outline" 
                              className={`bg-${item.color}-100 text-${item.color}-800 border-${item.color}-200`}
                            >
                              {item.value}
                            </Badge>
                          ) : (
                            <span className='text-gray-900'>{item.value}</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* メタ情報 */}
                  <div className='border-t pt-3 text-sm text-gray-600'>
                    {blueprint.remarks && (
                      <p>{blueprint.remarks}</p>
                    )}
                  </div>

                  {/* アクションボタン */}
                  <div className='border-t pt-3 space-y-2'>
                    <div className='flex gap-2'>
                      <Button
                        onClick={(e) =>
                          handleButtonClick(e, () =>
                            handleOpenBlueprintPage(blueprint.id)
                          )
                        }
                        size='sm'
                        className='flex-1'
                      >
                        <ExternalLink className='mr-1 h-3 w-3' />
                        図面ページを開く
                      </Button>
                      <Button
                        onClick={(e) =>
                          handleButtonClick(e, () =>
                            handleOpenProjectPage(blueprint.directory_id)
                          )
                        }
                        size='sm'
                        className='flex-1'
                      >
                        <Briefcase className='mr-1 h-3 w-3' />
                        案件ページを開く
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </TooltipContent>
          </Tooltip>
        ))}

        {(!blueprints || blueprints.length === 0) && (
          <div className='text-sm text-gray-500'>
            リビジョン図面はありません
          </div>
        )}
      </div>
    </div>
  );
}