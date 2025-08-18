import { useRef, useState, useCallback, useEffect } from "react";
import { Button, Tooltip, TooltipTrigger, TooltipContent } from "@/shared/shadcnui";
import { ZoomIn, ZoomOut, Maximize2, Download, Printer, Lock, Unlock, RotateCw, RotateCcw, Pencil } from "lucide-react";
import { BlueprintFile, BlueprintView } from "../model/types";

interface BlueprintViewerProps {
  activeFile: BlueprintFile | BlueprintView | null;
}

export function BlueprintViewer({ activeFile }: BlueprintViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  // Zoom state
  const [zoom, setZoom] = useState(1);
  const [isZoomLocked, setIsZoomLocked] = useState(false);
  
  // Drag state
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  // Rotation state
  const [rotation, setRotation] = useState(0);

  // Reset all when activeFile changes
  useEffect(() => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
    setRotation(0);
    setIsDragging(false);
  }, [activeFile?.id]);

  // Zoom functions
  const zoomIn = useCallback(() => {
    if (!isZoomLocked) {
      setZoom(prev => Math.min(prev * 1.2, 5));
    }
  }, [isZoomLocked]);

  const zoomOut = useCallback(() => {
    if (!isZoomLocked) {
      setZoom(prev => Math.max(prev / 1.2, 0.1));
    }
  }, [isZoomLocked]);

  const fitToScreen = useCallback(() => {
    if (!isZoomLocked) {
      setZoom(1);
      setPosition({ x: 0, y: 0 });
    }
  }, [isZoomLocked]);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (!isZoomLocked) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? 0.9 : 1.1;
      setZoom(prev => Math.max(0.1, Math.min(5, prev * delta)));
    }
  }, [isZoomLocked]);

  const toggleZoomLock = useCallback(() => {
    setIsZoomLocked(prev => !prev);
  }, []);

  // Drag functions
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  }, [position]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  }, [isDragging, dragStart]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Rotation functions
  const rotateClockwise = useCallback(() => {
    if (!isZoomLocked) {
      setRotation(prev => (prev + 90) % 360);
    }
  }, [isZoomLocked]);

  const rotateCounterClockwise = useCallback(() => {
    if (!isZoomLocked) {
      setRotation(prev => prev - 90);
    }
  }, [isZoomLocked]);

  // File operations
  const downloadFile = useCallback((imageUrl: string, fileName: string) => {
    try {
      const link = document.createElement('a');
      link.href = imageUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Download failed:', error);
    }
  }, []);

  const printFile = useCallback((imageUrl: string, fileName: string) => {
    try {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>印刷: ${fileName}</title>
              <style>
                body {
                  margin: 0;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  min-height: 100vh;
                }
                img {
                  max-width: 100%;
                  max-height: 100%;
                }
              </style>
            </head>
            <body>
              <img src="${imageUrl}" alt="${fileName}" />
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.print();
      }
    } catch (error) {
      console.error('Print failed:', error);
    }
  }, []);

  if (!activeFile) {
    return (
      <div className="h-full w-full bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-6xl text-gray-300">📋</div>
          <div className="space-y-2">
            <h3 className="text-xl font-medium text-gray-500">
              図面を選択してください
            </h3>
            <p className="text-sm text-gray-400">
              左のサイドバーから図面をクリックして表示
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
          transform: `translate(${position.x + 48}px, ${position.y}px)`
        }}
      >
        <img
          ref={imageRef}
          src={activeFile.imageUrl}
          alt={activeFile.name}
          className="max-w-none shadow-lg border border-gray-300"
          style={{
            transform: `scale(${zoom}) rotate(${rotation}deg)`,
            transformOrigin: 'center',
            transition: isDragging ? 'none' : 'transform 0.1s ease-out'
          }}
          draggable={false}
        />
      </div>

      <div className="absolute top-6 right-6 space-y-2">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="lg"
            onClick={() => downloadFile(activeFile.imageUrl, activeFile.name)}
            title="ダウンロード"
          >
            <Download className="h-5 w-5" />
            <span className="text-sm">ダウンロード</span>
          </Button>
          
          <Button
            variant="outline"
            size="lg"
            onClick={() => printFile(activeFile.imageUrl, activeFile.name)}
            title="印刷"
          >
            <Printer className="h-5 w-5" />
            <span className="text-sm">印刷</span>
          </Button>
          
          <Button size="lg">
            <Pencil className="h-5 w-5" />
            <span className="text-sm">書き込み</span>
          </Button>
        </div>
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