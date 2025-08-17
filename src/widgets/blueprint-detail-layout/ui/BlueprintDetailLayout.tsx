'use client';
import { BlueprintViewer } from "@/widgets/blueprint-view/ui/BlueprintViewer";
import { BlueprintTabNavigation } from "@/shared/basic-layout/ui/BlueprintTabNavigation";
import { ResizableLayout, ResizablePanel, ResizableHandle } from "@/features/resizable-layout";
import { blueprintDetailConfig } from "../lib/resizableLayoutConfig";

interface BlueprintDetailLayoutProps {
  children: React.ReactNode;
}

export function BlueprintDetailLayout({ 
  children
}: BlueprintDetailLayoutProps) {
  return (
    <ResizableLayout 
      config={blueprintDetailConfig}
      className="h-[calc(100vh-45px)]"
    >
      {/* 左側: BlueprintViewer */}
      <ResizablePanel index={0} className="bg-gray-50">
        <BlueprintViewer activeFile={null} />
      </ResizablePanel>

      <ResizableHandle />

      {/* 右側: タブナビゲーション + コンテンツ */}
      <ResizablePanel index={1} className="flex flex-col bg-white">
        {/* 右側上部: タブナビゲーション */}
        <div className="flex-shrink-0 p-4 border-b">
          <BlueprintTabNavigation />
        </div>

        {/* 右側下部: 各コンテナ */}
        <div className="flex-1 overflow-hidden">
          {children}
        </div>
      </ResizablePanel>
    </ResizableLayout>
  );
}