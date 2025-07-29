import React, { useState, useEffect } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/shared/shadcnui';
import type { CarouselApi } from '@/shared/shadcnui';
import { PreviewableFile, PreviewRenderOptions } from '../model/types';
import { useFilePreview } from '../lib/useFilePreview';
import { PreviewProviderManager } from '../lib/previewProviders';

interface PreviewViewerProps {
  files: PreviewableFile[];
  currentIndex: number;
  zoom: number;
  rotation: number;
  isMultipleFiles: boolean;
  providerManager: PreviewProviderManager;
  onIndexChange: (index: number) => void;
  className?: string;
}

export function PreviewViewer({
  files,
  currentIndex,
  zoom,
  rotation,
  isMultipleFiles,
  providerManager,
  onIndexChange,
  className = ''
}: PreviewViewerProps) {
  const [api, setApi] = useState<CarouselApi>();

  useEffect(() => {
    if (!api || !isMultipleFiles) return;

    api.scrollTo(currentIndex);

    api.on("select", () => {
      const newIndex = api.selectedScrollSnap();
      if (newIndex !== currentIndex) {
        onIndexChange(newIndex);
      }
    });
  }, [api, currentIndex, isMultipleFiles, onIndexChange]);

  const renderPreview = (file: PreviewableFile, index: number) => {
    const provider = providerManager.getProviderForFile(file);
    const renderOptions: PreviewRenderOptions = {
      zoom: index === currentIndex ? zoom : 1,
      rotation: index === currentIndex ? rotation : 0,
      onZoomChange: () => {}, // これらは実際には使用されない（親で管理）
      onRotationChange: () => {},
      className: 'transition-transform duration-200 ease-in-out'
    };

    return provider.render(file, renderOptions);
  };

  if (!isMultipleFiles) {
    // 単一ファイルの場合
    const currentFile = files[0];
    if (!currentFile) return null;

    return (
      <div className={`flex items-center justify-center h-full p-4 ${className}`}>
        {renderPreview(currentFile, 0)}
      </div>
    );
  }

  // 複数ファイルの場合はカルーセル
  return (
    <div className={`flex-1 overflow-hidden bg-gray-100 ${className}`}>
      <Carousel
        setApi={setApi}
        className="w-full h-full"
        opts={{
          align: "start",
          loop: false,
        }}
      >
        <CarouselContent className="h-[calc(90vh-120px)]">
          {files.map((file, index) => (
            <CarouselItem key={file.id} className="h-full">
              <div className="flex items-center justify-center h-full p-4">
                {renderPreview(file, index)}
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        
        <CarouselPrevious className="left-4" />
        <CarouselNext className="right-4" />
        
        {/* インジケーター */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10">
          <div className="flex items-center space-x-2 bg-black/50 backdrop-blur-sm rounded-full px-3 py-2">
            {files.map((_, index) => (
              <button
                key={index}
                onClick={() => api?.scrollTo(index)}
                className={`w-2 h-2 rounded-full transition-all duration-200 ${
                  index === currentIndex ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/75'
                }`}
              />
            ))}
          </div>
        </div>
      </Carousel>
    </div>
  );
}