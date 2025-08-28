"use client";

import { useRef } from "react";
import { Button, Tooltip, TooltipTrigger, TooltipContent } from "@/shared";
import { ZoomIn, ZoomOut, Maximize2, Lock, Unlock, RotateCw, RotateCcw } from "lucide-react";
import { PictureFile } from "../model";
import { usePicturePreview } from "../lib";

interface PicturePreviewContainerProps {
  activeFile: PictureFile | null;
}

export function PicturePreviewContainer({ activeFile }: PicturePreviewContainerProps) {
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

  if (!activeFile) {
    return (
      <div className="h-full w-full bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-6xl text-gray-300">🖼️</div>
          <div className="space-y-2">
            <h3 className="text-xl font-medium text-gray-500">
              画像を選択してください
            </h3>
            <p className="text-sm text-gray-400">
              画像をクリックして表示
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className="h-full w-full bg-gray-100 relative overflow-hidden"
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
    >
      <div 
        className="absolute inset-0 flex items-center justify-center"
        style={{
          transform: `translate(${position.x + 96}px, ${position.y}px)`
        }}
      >
        <img
          ref={imageRef}
          src={activeFile.imageUrl}
          alt="プレビュー画像"
          className="max-w-none shadow-lg border border-gray-300"
          style={{
            transform: `scale(${zoom}) rotate(${rotation}deg)`,
            transformOrigin: 'center',
            transition: isDragging ? 'none' : 'transform 0.1s ease-out'
          }}
          draggable={false}
        />
      </div>

      <div className="absolute bottom-6 right-6 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-3 space-y-2">
        <div className="flex flex-col items-center gap-2">
          {!isZoomLocked && (
            <div className="flex flex-col items-center gap-2 animate-in slide-in-from-top-2 duration-300">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={zoomIn}
                    disabled={zoom >= 5}
                    className="w-10 h-10 p-0"
                  >
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="left">
                  拡大
                </TooltipContent>
              </Tooltip>
              
              <div className="text-xs font-mono text-gray-600 min-w-12 text-center">
                {Math.round(zoom * 100)}%
              </div>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={zoomOut}
                    disabled={zoom <= 0.1}
                    className="w-10 h-10 p-0"
                  >
                    <ZoomOut className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="left">
                  縮小
                </TooltipContent>
              </Tooltip>
              
              <div className="w-full h-px bg-gray-300" />
                        
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={rotateCounterClockwise}
                    className="w-10 h-10 p-0"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="left">
                  反時計回りに90°回転
                </TooltipContent>
              </Tooltip>
              
              <div className="text-xs font-mono text-gray-600 min-w-12 text-center">
                {rotation}°
              </div>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={rotateClockwise}
                    className="w-10 h-10 p-0"
                  >
                    <RotateCw className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="left">
                  時計回りに90°回転
                </TooltipContent>
              </Tooltip>
              
              <div className="w-full h-px bg-gray-300" />
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={fitToScreen}
                    className="w-10 h-10 p-0"
                  >
                    <Maximize2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="left">
                  画面に合わせる
                </TooltipContent>
              </Tooltip>
              
              <div className="w-full h-px bg-gray-300" />
            </div>
          )}
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={isZoomLocked ? "default" : "outline"}
                size="sm"
                onClick={toggleZoomLock}
                className="w-10 h-10 p-0"
              >
                {isZoomLocked ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              {isZoomLocked ? "ズームロックを解除" : "ズームをロック"}
            </TooltipContent>
          </Tooltip>          
        </div>
      </div>
    </div>
  );
}