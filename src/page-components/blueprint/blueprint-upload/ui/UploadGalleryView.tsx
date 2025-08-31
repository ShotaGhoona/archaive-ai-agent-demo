'use client';
import { useState } from 'react';
import { Button } from '@/shared';
import { FileImage, ZoomIn, RotateCcw, Trash2 } from 'lucide-react';
import { FilePreviewModal, PreviewableFile } from '@/widgets';
import { AddFileCard, StackedCard } from '../ui';
import { UploadGalleryViewProps, UploadedFile, DragItem } from '../model';

export function UploadGalleryView({
  files,
  fileStacks,
  selectedFiles,
  selectedStacks,
  viewMode,
  onRemoveFile,
  onRestoreFile,
  onToggleSelection,
  onToggleStackSelection,
  onUnstackFiles,
  onRemoveStack,
  onAddFiles,
  onDragStart,
}: UploadGalleryViewProps) {
  const [viewModalFile, setViewModalFile] = useState<UploadedFile | null>(null);

  const handleCardClick = (file: UploadedFile, e: React.MouseEvent) => {
    e.preventDefault();
    if (!(e.target as HTMLElement).closest('button')) {
      onToggleSelection(file.id);
    }
  };

  const handleViewClick = (file: UploadedFile, e: React.MouseEvent) => {
    e.stopPropagation();
    setViewModalFile(file);
  };

  const handleFileDragStart = (file: UploadedFile, e: React.DragEvent) => {
    const dragItem: DragItem = {
      type: 'file',
      id: file.id,
      files: [file],
    };
    onDragStart?.(dragItem);

    // ドラッグ効果を設定
    e.dataTransfer.effectAllowed = 'move';
  };

  // UploadedFile を PreviewableFile に変換
  const convertToPreviewableFile = (file: UploadedFile): PreviewableFile => ({
    id: file.id,
    name: file.name,
    url: file.url,
    type: file.type,
    size: file.size,
    metadata: {
      createdAt: file.createdAt,
    },
  });

  return (
    <>
      <div className='flex-1 overflow-auto'>
        <div className='grid grid-cols-1 gap-6 p-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
          {/* アップロードビューの場合、最初に追加カードを表示 */}
          {viewMode === 'uploaded' && <AddFileCard onAddFiles={onAddFiles} />}

          {/* 重ねられたファイルスタック（uploadedモードのみ） */}
          {viewMode === 'uploaded' &&
            fileStacks.map((stack) => (
              <StackedCard
                key={stack.id}
                stackId={stack.id}
                stackedFiles={stack.files}
                isSelected={selectedStacks.includes(stack.id)}
                onToggleSelection={() => onToggleStackSelection(stack.id)}
                onUnstackFiles={() => onUnstackFiles(stack.id)}
                onRemoveStack={() => onRemoveStack(stack.id)}
                onDragStart={onDragStart}
              />
            ))}

          {/* 通常のファイル */}
          {files.map((file) => {
            const isSelected = selectedFiles.includes(file.id);

            return (
              <div
                key={file.id}
                className='group cursor-pointer'
                draggable={viewMode === 'uploaded'}
                onClick={(e) => handleCardClick(file, e)}
                onDragStart={(e) => handleFileDragStart(file, e)}
              >
                <div
                  className={`relative overflow-hidden rounded-lg border bg-white transition-all duration-200 hover:shadow-md ${isSelected ? 'border-primary ring-primary/30 border-2 shadow-xl ring-4' : 'border-gray-200'} `}
                >
                  <div className='relative aspect-[4/3] bg-gray-50'>
                    {file.type.startsWith('image/') ? (
                      <img
                        src={file.url}
                        alt={file.name}
                        className='h-full w-full object-cover'
                      />
                    ) : (
                      <div className='flex h-full w-full items-center justify-center bg-gray-100'>
                        <div className='space-y-2 text-center'>
                          <FileImage className='mx-auto h-12 w-12 text-gray-400' />
                          <div className='text-sm font-medium text-gray-600'>
                            {file.name.split('.').pop()?.toUpperCase()}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* ファイル名とボタン群 */}
                  <div className='space-y-2 p-3'>
                    <h4 className='truncate text-sm font-medium text-gray-900'>
                      {file.name}
                    </h4>

                    {/* ボタン群 */}
                    <div className='flex gap-2'>
                      <Button
                        size='sm'
                        variant='outline'
                        onClick={(e) => handleViewClick(file, e)}
                        className='flex-1 text-xs'
                      >
                        <ZoomIn className='mr-1 h-3 w-3' />
                        拡大
                      </Button>
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (viewMode === 'uploaded') {
                            onRemoveFile?.(file.id);
                          } else {
                            onRestoreFile?.(file.id);
                          }
                        }}
                        variant='outline'
                        size='sm'
                      >
                        {viewMode === 'uploaded' ? (
                          <>
                            <Trash2 className='h-3 w-3' />
                          </>
                        ) : (
                          <>
                            <RotateCcw className='mr-1 h-3 w-3' />
                            復元
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 拡大表示モーダル */}
      {viewModalFile && (
        <FilePreviewModal
          files={[convertToPreviewableFile(viewModalFile)]}
          isOpen={!!viewModalFile}
          onClose={() => setViewModalFile(null)}
        />
      )}
    </>
  );
}
