'use client';
import { useState } from 'react';
import {
  Button,
  Card,
  CardContent,
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/shared';
import { Plus, X, FileText, Expand } from 'lucide-react';
import { BlueprintDetailDataInterface } from '@/dummy-data-er-fix/blueprint/interfaces/types';

interface BlueprintDetailSidebarProps {
  views: BlueprintDetailDataInterface[];
  activeBlueprintId: number;
  onViewSelect: (viewId: number) => void;
  onViewRemove: (viewId: number) => void;
}

export function BlueprintDetailSidebar({
  views,
  activeBlueprintId,
  onViewSelect,
  onViewRemove,
}: BlueprintDetailSidebarProps) {
  
  const [isGalleryMode, setIsGalleryMode] = useState(false);

  // TODO: 図面を追加する機能（ファイルアップロード、ドラッグ&ドロップ）の実装


  const handleViewClick = (viewId: number) => {
    onViewSelect(viewId);
    if (isGalleryMode) {
      setIsGalleryMode(false);
    }
  };

  const handleRemoveView = (viewId: number) => {
    onViewRemove(viewId);
  };

  return (
    <div
      className={`absolute top-0 left-0 flex h-full flex-col transition-all duration-300 ${
        isGalleryMode
          ? 'w-full bg-white/10 backdrop-blur-md z-50'
          : 'w-48 bg-gradient-to-r from-white/80 via-white/60 to-transparent z-10'
      }`}
    >
      {/* 図面ビュー一覧 */}
      <div className='scrollbar-hidden flex-1 overflow-y-auto p-4'>
        <div
          className={`${isGalleryMode ? 'grid grid-cols-4 gap-4' : 'space-y-3'}`}
        >
          <div
            className={`cursor-pointer rounded-lg border-2 border-dashed p-4 text-center transition-colors border-gray-300 hover:border-gray-400`}
            onClick={() => {
              // TODO: 図面追加機能の実装
              console.log('図面追加機能は未実装です');
            }}
          >
            <div className='flex h-full w-full items-center justify-center gap-2'>
              <Plus className='h-6 w-6 text-gray-400' />
              <div className='mr-2 text-sm text-gray-600'>図面を追加</div>
            </div>
          </div>

          {/* 図面ビューリスト */}
          {views.map((view) => (
            <div key={view.id} className='w-full'>
              <Card
                className={`group relative cursor-pointer py-1 transition-all duration-200 ${
                  view.id === activeBlueprintId
                    ? 'ring-primary ring-2'
                    : 'hover:bg-gray-50 hover:shadow-md'
                } `}
                onClick={() => handleViewClick(view.id)}
              >
                {/* 展開ボタン (サイドバーモード時のみ) */}
                {!isGalleryMode && (
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsGalleryMode(true);
                    }}
                    className='absolute top-2 left-2 h-6 w-6 p-0 opacity-0 transition-opacity group-hover:opacity-100'
                  >
                    <Expand className='h-3 w-3' />
                  </Button>
                )}

                {/* 削除ボタン */}
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant='destructive'
                      size='sm'
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                      className='absolute top-2 right-2 h-6 w-6 p-0 opacity-0 transition-opacity group-hover:opacity-100'
                    >
                      <X className='h-3 w-3' />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        図面ビューを削除しますか？
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        「{view.leaf_product_name}」を削除します。この操作は取り消せません。
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>キャンセル</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleRemoveView(view.id)}
                        className='bg-red-500 text-white hover:bg-red-600'
                      >
                        削除
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

                <CardContent className='p-2'>
                  <div className='space-y-2'>
                    <div className='aspect-video w-full overflow-hidden rounded bg-gray-100'>
                      {view.s3_url ? (
                        <img
                          src={view.s3_url}
                          alt={view.leaf_product_name}
                          className='h-full w-full object-cover'
                        />
                      ) : (
                        <div className='flex h-full w-full items-center justify-center'>
                          <FileText className='h-8 w-8 text-gray-400' />
                        </div>
                      )}
                    </div>
                    <div className='px-1'>
                      <h4 className='truncate text-xs font-medium text-gray-900'>
                        {view.leaf_product_name}
                      </h4>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}

          {views.length === 0 && (
            <div className='py-8 text-center'>
              <FileText className='mx-auto mb-3 h-12 w-12 text-gray-300' />
              <p className='text-sm text-gray-500'>図面ビューがありません</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
