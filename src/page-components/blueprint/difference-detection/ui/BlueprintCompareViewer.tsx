'use client';
import { useState, useRef, useEffect } from 'react';
import {
  Button,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Lock,
  Unlock,
  RotateCw,
  RotateCcw,
} from 'lucide-react';
import { differenceDetectionData } from '../data';

type ViewMode = 'difference' | 'old' | 'new';

type ToleranceLevel = '1px' | '5px' | '10px' | '15px';

interface BlueprintCompareViewerProps {
  onStateChange?: (
    zoom: number,
    position: { x: number; y: number },
    containerSize: { width: number; height: number },
    imageSize: { width: number; height: number },
    imageUrl: string,
  ) => void;
  externalZoom?: number;
  externalPosition?: { x: number; y: number };
  onToleranceChange?: (tolerance: ToleranceLevel) => void;
  // TODO: 後で図面データのpropsを追加
}

export function BlueprintCompareViewer({
  onStateChange,
  externalZoom,
  externalPosition,
  onToleranceChange,
}: BlueprintCompareViewerProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('difference');
  const [tolerance, setTolerance] = useState<ToleranceLevel>('1px');
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  // 外部からのズーム・位置変更を監視
  useEffect(() => {
    if (externalZoom !== undefined && externalZoom !== zoom) {
      setZoom(externalZoom);
    }
  }, [externalZoom]);

  useEffect(() => {
    if (
      externalPosition &&
      (externalPosition.x !== position.x || externalPosition.y !== position.y)
    ) {
      setPosition(externalPosition);
    }
  }, [externalPosition]);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isZoomLocked, setIsZoomLocked] = useState(false);
  const [rotation, setRotation] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });

  // コンテナサイズと画像サイズを監視
  useEffect(() => {
    const updateSizes = () => {
      if (containerRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect();
        setContainerSize({
          width: containerRect.width,
          height: containerRect.height,
        });
      }
      if (imageRef.current) {
        setImageSize({
          width: imageRef.current.naturalWidth,
          height: imageRef.current.naturalHeight,
        });
      }
    };

    updateSizes();
    window.addEventListener('resize', updateSizes);
    return () => window.removeEventListener('resize', updateSizes);
  }, []);

  // 状態変更時にコールバック呼び出し
  const notifyStateChange = (
    newZoom: number,
    newPosition: { x: number; y: number },
  ) => {
    if (containerSize.width > 0 && imageSize.width > 0) {
      onStateChange?.(
        newZoom,
        newPosition,
        containerSize,
        imageSize,
        getImageUrl(),
      );
    }
  };

  // ズーム機能
  const handleZoomIn = () => {
    if (!isZoomLocked) {
      const newZoom = Math.min(zoom * 1.2, 5);
      setZoom(newZoom);
      notifyStateChange(newZoom, position);
    }
  };

  const handleZoomOut = () => {
    if (!isZoomLocked) {
      const newZoom = Math.max(zoom / 1.2, 0.1);
      setZoom(newZoom);
      notifyStateChange(newZoom, position);
    }
  };

  const handleFitToScreen = () => {
    if (!isZoomLocked) {
      const newZoom = 1;
      const newPosition = { x: 0, y: 0 };
      setZoom(newZoom);
      setPosition(newPosition);
      notifyStateChange(newZoom, newPosition);
    }
  };

  // 表示モード変更時もコールバック呼び出し
  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
    notifyStateChange(zoom, position);
  };

  const toggleZoomLock = () => {
    setIsZoomLocked((prev) => !prev);
  };

  // 回転機能
  const handleRotateClockwise = () => {
    if (!isZoomLocked) {
      setRotation((prev) => (prev + 90) % 360);
    }
  };

  const handleRotateCounterClockwise = () => {
    if (!isZoomLocked) {
      setRotation((prev) => prev - 90);
    }
  };

  // マウスホイールでズーム
  const handleWheel = (e: React.WheelEvent) => {
    if (!isZoomLocked) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? 0.9 : 1.1;
      const newZoom = Math.max(0.1, Math.min(5, zoom * delta));
      setZoom(newZoom);
      notifyStateChange(newZoom, position);
    }
  };

  // ドラッグ機能
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const newPosition = {
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    };
    setPosition(newPosition);
    notifyStateChange(zoom, newPosition);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // 画像URL取得（mockDataから取得）
  const getImageUrl = () => {
    return differenceDetectionData.differenceDetection[viewMode].imageUrl;
  };

  const getViewModeLabel = () => {
    return differenceDetectionData.differenceDetection[viewMode].label;
  };

  const handleToleranceChange = (newTolerance: ToleranceLevel) => {
    setTolerance(newTolerance);
    onToleranceChange?.(newTolerance);
  };

  return (
    <div
      ref={containerRef}
      className='relative h-full w-full overflow-hidden bg-gray-100'
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
    >
      {/* 左上: 表示モード切り替えタブ */}
      <div className='absolute top-6 left-6 z-10'>
        <div className='rounded-lg border border-gray-200 bg-white/95 shadow-lg backdrop-blur-sm'>
          <div className='flex'>
            {[
              { mode: 'difference' as ViewMode, label: '図面差分' },
              { mode: 'old' as ViewMode, label: '過去図面' },
              { mode: 'new' as ViewMode, label: '新規図面' },
            ].map((tab, index) => (
              <button
                key={tab.mode}
                onClick={() => handleViewModeChange(tab.mode)}
                className={`px-4 py-2 text-sm font-medium transition-colors ${index === 0 ? 'rounded-l-lg' : ''} ${index === 2 ? 'rounded-r-lg' : ''} ${
                  viewMode === tab.mode
                    ? 'bg-primary text-primary-foreground'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                } `}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 右上: 許容誤差ドロップダウン */}
      <div className='absolute top-6 right-6 z-10'>
        <div className='rounded-lg border border-gray-200 bg-white/95 p-3 shadow-lg backdrop-blur-sm'>
          <div className='flex items-center gap-2'>
            <label className='text-sm font-medium text-gray-700'>
              許容誤差:
            </label>
            <Select value={tolerance} onValueChange={handleToleranceChange}>
              <SelectTrigger className='h-8 w-20'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='1px'>1px</SelectItem>
                <SelectItem value='5px'>5px</SelectItem>
                <SelectItem value='10px'>10px</SelectItem>
                <SelectItem value='15px'>15px</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* 図面画像 */}
      <div
        className='absolute inset-0 flex items-center justify-center'
        style={{
          transform: `translate(${position.x}px, ${position.y}px)`,
        }}
      >
        <img
          ref={imageRef}
          src={getImageUrl()}
          alt={getViewModeLabel()}
          className='max-w-none border border-gray-300 shadow-lg'
          style={{
            transform: `scale(${zoom}) rotate(${rotation}deg)`,
            transformOrigin: 'center',
            transition: isDragging ? 'none' : 'transform 0.1s ease-out',
          }}
          onLoad={() => {
            if (imageRef.current) {
              setImageSize({
                width: imageRef.current.naturalWidth,
                height: imageRef.current.naturalHeight,
              });
            }
          }}
          draggable={false}
        />
      </div>

      {/* 右下ズーム・回転コントロール */}
      <div className='absolute right-6 bottom-6 space-y-2 rounded-lg bg-white/95 p-3 shadow-lg backdrop-blur-sm'>
        <div className='flex flex-col items-center gap-2'>
          {/* ズーム・回転・フィットコントロール - ロック時は非表示 */}
          {!isZoomLocked && (
            <div className='animate-in slide-in-from-top-2 flex flex-col items-center gap-2 duration-300'>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={handleZoomIn}
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
                    onClick={handleZoomOut}
                    disabled={zoom <= 0.1}
                    className='h-10 w-10 p-0'
                  >
                    <ZoomOut className='h-4 w-4' />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side='left'>縮小</TooltipContent>
              </Tooltip>

              <div className='h-px w-full bg-gray-300' />

              {/* 回転コントロール */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={handleRotateCounterClockwise}
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
                    onClick={handleRotateClockwise}
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
                    onClick={handleFitToScreen}
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

          {/* ロックボタンは常に表示 */}
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

      {/* 操作ヒント（初回表示用） */}
      {zoom === 1 && position.x === 0 && position.y === 0 && (
        <div className='bg-primary/10 border-primary/30 text-primary absolute bottom-6 left-6 rounded-lg border p-3 text-sm'>
          <div className='mb-1 font-medium'>操作方法:</div>
          <div className='space-y-1 text-xs'>
            <div>• ドラッグで移動</div>
            <div>• マウスホイールでズーム</div>
            <div>• 左上タブで表示切り替え</div>
          </div>
        </div>
      )}
    </div>
  );
}
