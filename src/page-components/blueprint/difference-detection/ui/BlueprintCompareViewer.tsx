"use client";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/shared/shadcnui";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/shadcnui";
import { ZoomIn, ZoomOut, Maximize2, Lock, Unlock, RotateCw, RotateCcw } from "lucide-react";
import mockData from "../data/mockData.json";

type ViewMode = "difference" | "old" | "new";

type ToleranceLevel = "1px" | "5px" | "10px" | "15px";

interface BlueprintCompareViewerProps {
  onStateChange?: (zoom: number, position: { x: number; y: number }, containerSize: { width: number; height: number }, imageSize: { width: number; height: number }, imageUrl: string) => void;
  externalZoom?: number;
  externalPosition?: { x: number; y: number };
  onToleranceChange?: (tolerance: ToleranceLevel) => void;
  // TODO: 後で図面データのpropsを追加
}

export function BlueprintCompareViewer({ onStateChange, externalZoom, externalPosition, onToleranceChange }: BlueprintCompareViewerProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("difference");
  const [tolerance, setTolerance] = useState<ToleranceLevel>("1px");
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  // 外部からのズーム・位置変更を監視
  useEffect(() => {
    if (externalZoom !== undefined && externalZoom !== zoom) {
      setZoom(externalZoom);
    }
  }, [externalZoom]);

  useEffect(() => {
    if (externalPosition && (externalPosition.x !== position.x || externalPosition.y !== position.y)) {
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
        setContainerSize({ width: containerRect.width, height: containerRect.height });
      }
      if (imageRef.current) {
        setImageSize({ width: imageRef.current.naturalWidth, height: imageRef.current.naturalHeight });
      }
    };

    updateSizes();
    window.addEventListener('resize', updateSizes);
    return () => window.removeEventListener('resize', updateSizes);
  }, []);

  // 状態変更時にコールバック呼び出し
  const notifyStateChange = (newZoom: number, newPosition: { x: number; y: number }) => {
    if (containerSize.width > 0 && imageSize.width > 0) {
      onStateChange?.(newZoom, newPosition, containerSize, imageSize, getImageUrl());
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
    setIsZoomLocked(prev => !prev);
  };

  // 回転機能
  const handleRotateClockwise = () => {
    setRotation(prev => (prev + 90) % 360);
  };

  const handleRotateCounterClockwise = () => {
    setRotation(prev => (prev - 90 + 360) % 360);
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
      y: e.clientY - position.y
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const newPosition = {
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    };
    setPosition(newPosition);
    notifyStateChange(zoom, newPosition);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // 画像URL取得（mockDataから取得）
  const getImageUrl = () => {
    return mockData.differenceDetection[viewMode].imageUrl;
  };

  const getViewModeLabel = () => {
    return mockData.differenceDetection[viewMode].label;
  };

  const handleToleranceChange = (newTolerance: ToleranceLevel) => {
    setTolerance(newTolerance);
    onToleranceChange?.(newTolerance);
  };

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
      {/* 左上: 表示モード切り替えタブ */}
      <div className="absolute top-6 left-6 z-10">
        <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200">
          <div className="flex">
            {([
              { mode: "difference" as ViewMode, label: "図面差分" },
              { mode: "old" as ViewMode, label: "過去図面" },
              { mode: "new" as ViewMode, label: "新規図面" }
            ]).map((tab, index) => (
              <button
                key={tab.mode}
                onClick={() => handleViewModeChange(tab.mode)}
                className={`
                  px-4 py-2 text-sm font-medium transition-colors
                  ${index === 0 ? 'rounded-l-lg' : ''}
                  ${index === 2 ? 'rounded-r-lg' : ''}
                  ${viewMode === tab.mode 
                    ? 'bg-primary text-primary-foreground' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }
                `}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 右上: 許容誤差ドロップダウン */}
      <div className="absolute top-6 right-6 z-10">
        <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200 p-3">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">許容誤差:</label>
            <Select value={tolerance} onValueChange={handleToleranceChange}>
              <SelectTrigger className="w-20 h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1px">1px</SelectItem>
                <SelectItem value="5px">5px</SelectItem>
                <SelectItem value="10px">10px</SelectItem>
                <SelectItem value="15px">15px</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* 図面画像 */}
      <div 
        className="absolute inset-0 flex items-center justify-center"
        style={{
          transform: `translate(${position.x}px, ${position.y}px)`
        }}
      >
        <img
          ref={imageRef}
          src={getImageUrl()}
          alt={getViewModeLabel()}
          className="max-w-none shadow-lg border border-gray-300"
          style={{
            transform: `scale(${zoom}) rotate(${rotation}deg)`,
            transformOrigin: 'center',
            transition: isDragging ? 'none' : 'transform 0.1s ease-out'
          }}
          onLoad={() => {
            if (imageRef.current) {
              setImageSize({ width: imageRef.current.naturalWidth, height: imageRef.current.naturalHeight });
            }
          }}
          draggable={false}
        />
      </div>

      {/* 右下ズーム・回転コントロール */}
      <div className="absolute bottom-6 right-6 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-3 space-y-2">
        <div className="flex flex-col items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleZoomIn}
            disabled={zoom >= 5 || isZoomLocked}
            className="w-10 h-10 p-0"
            title={isZoomLocked ? "ズームがロックされています" : "拡大"}
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          
          <div className="text-xs font-mono text-gray-600 min-w-12 text-center">
            {Math.round(zoom * 100)}%
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleZoomOut}
            disabled={zoom <= 0.1 || isZoomLocked}
            className="w-10 h-10 p-0"
            title={isZoomLocked ? "ズームがロックされています" : "縮小"}
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          
          <div className="w-full h-px bg-gray-300" />
                    
          {/* 回転コントロール */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleRotateCounterClockwise}
            className="w-10 h-10 p-0"
            title="反時計回りに90°回転"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
          
          <div className="text-xs font-mono text-gray-600 min-w-12 text-center">
            {rotation}°
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleRotateClockwise}
            className="w-10 h-10 p-0"
            title="時計回りに90°回転"
          >
            <RotateCw className="h-4 w-4" />
          </Button>
          
          <div className="w-full h-px bg-gray-300" />
          <Button
            variant="outline"
            size="sm"
            onClick={handleFitToScreen}
            disabled={isZoomLocked}
            className="w-10 h-10 p-0"
            title={isZoomLocked ? "ズームがロックされています" : "画面に合わせる"}
          >
            <Maximize2 className="h-4 w-4" />
          </Button>
          
          <Button
            variant={isZoomLocked ? "default" : "outline"}
            size="sm"
            onClick={toggleZoomLock}
            className="w-10 h-10 p-0"
            title={isZoomLocked ? "ズームロックを解除" : "ズームをロック"}
          >
            {isZoomLocked ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
          </Button>          
        </div>
      </div>

      {/* 操作ヒント（初回表示用） */}
      {zoom === 1 && position.x === 0 && position.y === 0 && (
        <div className="absolute bottom-6 left-6 bg-primary/10 border border-primary/30 rounded-lg p-3 text-sm text-primary">
          <div className="font-medium mb-1">操作方法:</div>
          <div className="space-y-1 text-xs">
            <div>• ドラッグで移動</div>
            <div>• マウスホイールでズーム</div>
            <div>• 左上タブで表示切り替え</div>
          </div>
        </div>
      )}
    </div>
  );
}