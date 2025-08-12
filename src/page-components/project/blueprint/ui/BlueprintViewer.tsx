import { useState, useRef, useEffect } from "react";
// import { useRouter } from "next/navigation";
import { Button, Tooltip, TooltipTrigger, TooltipContent } from "@/shared/shadcnui";
import { ZoomIn, ZoomOut, Maximize2, Download, Printer, Lock, Unlock, RotateCw, RotateCcw, Bot } from "lucide-react";

interface BlueprintFile {
  id: string;
  name: string;
  description: string;
  size: number;
  type: string;
  imageUrl: string;
  createdAt: string;
  isActive?: boolean;
}

interface BlueprintViewerProps {
  activeFile: BlueprintFile | null;
}

export function BlueprintViewer({ activeFile }: BlueprintViewerProps) {
  // const router = useRouter();
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isZoomLocked, setIsZoomLocked] = useState(false);
  const [rotation, setRotation] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  // ズーム機能
  const handleZoomIn = () => {
    if (!isZoomLocked) {
      setZoom(prev => Math.min(prev * 1.2, 5));
    }
  };

  const handleZoomOut = () => {
    if (!isZoomLocked) {
      setZoom(prev => Math.max(prev / 1.2, 0.1));
    }
  };

  const handleFitToScreen = () => {
    if (!isZoomLocked) {
      setZoom(1);
      setPosition({ x: 0, y: 0 });
    }
  };

  const toggleZoomLock = () => {
    setIsZoomLocked(prev => !prev);
  };

  // 回転機能
  const handleRotateClockwise = () => {
    if (!isZoomLocked) {
      setRotation(prev => (prev + 90) % 360);
    }
  };

  const handleRotateCounterClockwise = () => {
    if (!isZoomLocked) {
      setRotation(prev => prev - 90);
    }
  };

  // マウスホイールでズーム
  const handleWheel = (e: React.WheelEvent) => {
    if (!isZoomLocked) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? 0.9 : 1.1;
      setZoom(prev => Math.max(0.1, Math.min(5, prev * delta)));
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
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // ファイル変更時にリセット
  useEffect(() => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
    setRotation(0);
  }, [activeFile?.id]);

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
      {/* 図面画像 */}
      <div 
        className="absolute inset-0 flex items-center justify-center"
        style={{
          transform: `translate(${position.x}px, ${position.y}px)`
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

      {/* 右上アクションボタン */}
      <div className="absolute top-6 right-6 space-y-2">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="lg"
            onClick={() => {
              // ダウンロード処理
              const link = document.createElement('a');
              link.href = activeFile.imageUrl;
              link.download = activeFile.name;
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }}
            title="ダウンロード"
          >
            <Download className="h-5 w-5" />
            <span className="text-sm">ダウンロード</span>
          </Button>
          
          <Button
            variant="outline"
            size="lg"
            onClick={() => {
              // 印刷処理
              const printWindow = window.open('', '_blank');
              if (printWindow) {
                printWindow.document.write(`
                  <html>
                    <head><title>印刷: ${activeFile.name}</title></head>
                    <body style="margin:0;display:flex;justify-content:center;align-items:center;min-height:100vh;">
                      <img src="${activeFile.imageUrl}" style="max-width:100%;max-height:100%;" />
                    </body>
                  </html>
                `);
                printWindow.document.close();
                printWindow.print();
              }
            }}
            title="印刷"
          >
            <Printer className="h-5 w-5" />
            <span className="text-sm">印刷</span>
          </Button>
          <Button
            size="lg"
          >
            <Bot className="h-5 w-5" />
            <span className="text-sm">AI見積もり</span>
          </Button>
        </div>
      </div>

      {/* 操作コントロール */}
      <div className="absolute bottom-6 right-6 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-3 space-y-2">
        <div className="flex flex-col items-center gap-2">
          {/* ズーム・回転・フィットコントロール - ロック時は非表示 */}
          {!isZoomLocked && (
            <div className="flex flex-col items-center gap-2 animate-in slide-in-from-top-2 duration-300">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleZoomIn}
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
                    onClick={handleZoomOut}
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
                        
              {/* 回転コントロール */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRotateCounterClockwise}
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
                    onClick={handleRotateClockwise}
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
                    onClick={handleFitToScreen}
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
          
          {/* ロックボタンは常に表示 */}
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


      {/* 操作ヒント（初回表示用） */}
      {zoom === 1 && position.x === 0 && position.y === 0 && (
        <div className="absolute bottom-6 left-6 bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-700">
          <div className="font-medium mb-1">操作方法:</div>
          <div className="space-y-1 text-xs">
            <div>• ドラッグで移動</div>
            <div>• マウスホイールでズーム</div>
            <div>• 右下のボタンで拡大/縮小</div>
          </div>
        </div>
      )}
    </div>
  );
}