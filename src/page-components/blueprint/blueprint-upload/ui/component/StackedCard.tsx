'use client';
import { useState } from 'react';
import { Button } from '@/shared';
import { FileImage, ZoomIn, Ungroup, Trash2, Layers } from 'lucide-react';
import { FilePreviewModal, PreviewableFile } from '@/widgets';
import { StackedCardProps, UploadedFile, DragItem } from '../../model';

export function StackedCard({
  stackedFiles,
  isSelected,
  onToggleSelection,
  onUnstackFiles,
  onRemoveStack,
  onDragStart,
  stackId,
}: StackedCardProps) {
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  // 代表として最初のファイルを使用
  const representativeFile = stackedFiles[0];
  const stackCount = stackedFiles.length;

  const handleViewClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsViewModalOpen(true);
  };

  const handleCardClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!(e.target as HTMLElement).closest('button')) {
      onToggleSelection();
    }
  };

  const handleStackDragStart = (e: React.DragEvent) => {
    const dragItem: DragItem = {
      type: 'stack',
      id: stackId,
      files: stackedFiles,
    };
    onDragStart?.(dragItem);

    // ドラッグ効果を設定
    e.dataTransfer.effectAllowed = 'move';
  };

  // UploadedFile を PreviewableFile に変換
  const convertToPreviewableFiles = (
    files: UploadedFile[],
  ): PreviewableFile[] =>
    files.map((file) => ({
      id: file.id,
      name: file.name,
      url: file.url,
      type: file.type,
      size: file.size,
      metadata: {
        createdAt: file.createdAt,
      },
    }));

  return (
    <>
      <div
        className='group cursor-pointer'
        onClick={handleCardClick}
        draggable
        onDragStart={handleStackDragStart}
      >
        <div className='relative'>
          {/* 重なりを表現する背景カード（複数の影） */}
          <div className='absolute inset-0 translate-x-1 translate-y-1 rounded-lg bg-gray-200 opacity-60'></div>
          <div className='absolute inset-0 translate-x-2 translate-y-2 rounded-lg bg-gray-300 opacity-40'></div>

          {/* メインカード */}
          <div
            className={`relative overflow-hidden rounded-lg border bg-white transition-all duration-200 hover:shadow-md ${isSelected ? 'border-primary ring-primary/30 border-2 shadow-xl ring-4' : 'border-gray-200'} `}
          >
            <div className='relative aspect-[4/3] bg-gray-50'>
              {representativeFile.type.startsWith('image/') ? (
                <img
                  src={representativeFile.url}
                  alt={representativeFile.name}
                  className='h-full w-full object-cover'
                />
              ) : (
                <div className='flex h-full w-full items-center justify-center bg-gray-100'>
                  <div className='space-y-2 text-center'>
                    <FileImage className='mx-auto h-12 w-12 text-gray-400' />
                    <div className='text-sm font-medium text-gray-600'>
                      {representativeFile.name.split('.').pop()?.toUpperCase()}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* スタック枚数表示（右上） */}
            <div className='absolute top-2 right-2 z-10'>
              <div className='flex items-center gap-1 rounded-full bg-blue-600 px-2 py-1 text-xs font-medium text-white backdrop-blur-sm'>
                <Layers className='h-3 w-3' />
                {stackCount}
              </div>
            </div>

            {/* ファイル名とボタン群 */}
            <div className='space-y-2 p-3'>
              <h4 className='truncate text-sm font-medium text-gray-900'>
                {representativeFile.name} 他{stackCount - 1}件
              </h4>

              {/* ボタン群 */}
              <div className='flex gap-2'>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={handleViewClick}
                  className='flex-1 text-xs'
                >
                  <ZoomIn className='mr-1 h-3 w-3' />
                  表示
                </Button>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={(e) => {
                    e.stopPropagation();
                    onUnstackFiles();
                  }}
                  className='flex-1 text-xs'
                >
                  <Ungroup className='mr-1 h-3 w-3' />
                  分離
                </Button>
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveStack();
                  }}
                  variant='outline'
                  size='sm'
                  className='flex-1 text-xs'
                >
                  <Trash2 className='mr-1 h-3 w-3' />
                  削除
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* スタックファイル表示モーダル */}
      <FilePreviewModal
        files={convertToPreviewableFiles(stackedFiles)}
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        initialFileIndex={0}
      />
    </>
  );
}
