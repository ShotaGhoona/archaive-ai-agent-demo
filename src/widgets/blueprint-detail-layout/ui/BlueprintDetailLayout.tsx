'use client';
import { BlueprintViewer } from "@/widgets/blueprint-view/ui/BlueprintViewer";
import { BlueprintTabNavigation } from "@/shared/basic-layout/ui/BlueprintTabNavigation";
import { useResizablePanel } from "../lib/useResizablePanel";

interface BlueprintDetailLayoutProps {
  children: React.ReactNode;
}

export function BlueprintDetailLayout({ 
  children
}: BlueprintDetailLayoutProps) {
  const {
    panelWidth,
    centerWidth,
    isDragging,
    resizableAreaRef,
    handleMouseDown
  } = useResizablePanel({
    initialWidth: 30,
    minWidth: 25,
    maxWidth: 50
  });

  return (
    <div className="h-[calc(100vh-45px)] flex overflow-hidden" ref={resizableAreaRef}>
      {/* 左側: BlueprintViewer */}
      <div 
        className="bg-gray-50 overflow-hidden"
        style={{ width: `${centerWidth}%` }}
      >
        <BlueprintViewer activeFile={null} />
      </div>

      {/* リサイズハンドル */}
      <div
        className={`w-1 bg-gray-200 hover:bg-gray-300 cursor-col-resize flex items-center justify-center transition-colors ${
          isDragging ? 'bg-gray-300' : ''
        }`}
        onMouseDown={handleMouseDown}
      >
        <div className="w-0.5 h-8 bg-gray-400 rounded-full" />
      </div>

      {/* 右側: タブナビゲーション + コンテンツ */}
      <div 
        className="flex flex-col overflow-hidden bg-white"
        style={{ width: `${panelWidth}%` }}
      >
        {/* 右側上部: タブナビゲーション */}
        <div className="flex-shrink-0 p-4 border-b">
          <BlueprintTabNavigation />
        </div>

        {/* 右側下部: 各コンテナ */}
        <div className="flex-1 overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  );
}