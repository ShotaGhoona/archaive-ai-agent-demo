'use client';

import { useRef } from 'react';
import { Button, Tooltip, TooltipTrigger, TooltipContent } from '@/shared';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Lock,
  Unlock,
  RotateCw,
  RotateCcw,
} from 'lucide-react';
import { PictureFile } from '../model';
import { usePicturePreview } from '../lib';

interface PicturePreviewContainerProps {
  activeFile: PictureFile | null;
  backgroundVariant?: 'gray' | 'white-dot';
}

export function PicturePreviewContainer({
  activeFile,
  backgroundVariant = 'gray',
}: PicturePreviewContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const {
    zoom,
    isZoomLocked,
    position,
    isDragging,
    rotation,
    zoomIn,
    zoomOut,
    fitToScreen,
    handleWheel,
    toggleZoomLock,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    rotateClockwise,
    rotateCounterClockwise,
  } = usePicturePreview({ imageUrl: activeFile?.imageUrl });

  // 背景スタイルの決定
  const backgroundClass = backgroundVariant === 'white-dot'
    ? 'bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-[size:20px_20px]'
    : 'bg-gray-100';

  if (!activeFile) {
    return (
      <div className='flex h-full w-full items-center justify-center bg-gray-50'>
        <div className='space-y-4 text-center'>
          <div className='text-6xl text-gray-300'>🖼️</div>
          <div className='space-y-2'>
            <h3 className='text-xl font-medium text-gray-500'>
              画像を選択してください
            </h3>
            <p className='text-sm text-gray-400'>画像をクリックして表示</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`relative h-full w-full overflow-hidden ${backgroundClass}`}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
    >
      <div
        className='absolute inset-0 flex items-center justify-center'
        style={{
          transform: `translate(${position.x}px, ${position.y}px)`,
        }}
      >
        <img
          ref={imageRef}
          src={activeFile.imageUrl}
          alt='プレビュー画像'
          className='max-w-none border border-gray-300 shadow-lg'
          style={{
            transform: `scale(${zoom}) rotate(${rotation}deg)`,
            transformOrigin: 'center',
            transition: isDragging ? 'none' : 'transform 0.1s ease-out',
          }}
          draggable={false}
        />
      </div>

      <div className='absolute right-6 bottom-6 space-y-2 rounded-lg bg-white/95 p-3 shadow-lg backdrop-blur-sm'>
        <div className='flex flex-col items-center gap-2'>
          {!isZoomLocked && (
            <div className='animate-in slide-in-from-top-2 flex flex-col items-center gap-2 duration-300'>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={zoomIn}
                    disabled={zoom >= 5}
                    className='h-10 w-10 p-0'
                  >
                    <ZoomIn className='h-4 w-4' />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side='left'>拡大</TooltipContent>
              </Tooltip>

              <div className='min-w-12 text-center font-mono text-xs text-gray-600'>
                {Math.round(zoom * 100)}%
              </div>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={zoomOut}
                    disabled={zoom <= 0.1}
                    className='h-10 w-10 p-0'
                  >
                    <ZoomOut className='h-4 w-4' />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side='left'>縮小</TooltipContent>
              </Tooltip>

              <div className='h-px w-full bg-gray-300' />

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={rotateCounterClockwise}
                    className='h-10 w-10 p-0'
                  >
                    <RotateCcw className='h-4 w-4' />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side='left'>反時計回りに90°回転</TooltipContent>
              </Tooltip>

              <div className='min-w-12 text-center font-mono text-xs text-gray-600'>
                {rotation}°
              </div>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={rotateClockwise}
                    className='h-10 w-10 p-0'
                  >
                    <RotateCw className='h-4 w-4' />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side='left'>時計回りに90°回転</TooltipContent>
              </Tooltip>

              <div className='h-px w-full bg-gray-300' />

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={fitToScreen}
                    className='h-10 w-10 p-0'
                  >
                    <Maximize2 className='h-4 w-4' />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side='left'>画面に合わせる</TooltipContent>
              </Tooltip>

              <div className='h-px w-full bg-gray-300' />
            </div>
          )}

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={isZoomLocked ? 'default' : 'outline'}
                size='sm'
                onClick={toggleZoomLock}
                className='h-10 w-10 p-0'
              >
                {isZoomLocked ? (
                  <Lock className='h-4 w-4' />
                ) : (
                  <Unlock className='h-4 w-4' />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent side='left'>
              {isZoomLocked ? 'ズームロックを解除' : 'ズームをロック'}
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </div>
  );
}
