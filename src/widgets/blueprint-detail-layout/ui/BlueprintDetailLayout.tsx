'use client';
import { BlueprintViewer } from "@/widgets/blueprint-view/ui/BlueprintViewer";
import { BlueprintTabNavigation } from "@/shared/basic-layout/ui/BlueprintTabNavigation";

interface BlueprintDetailLayoutProps {
  children: React.ReactNode;
}

export function BlueprintDetailLayout({ 
  children
}: BlueprintDetailLayoutProps) {
  return (
    <div className="h-[calc(100vh-45px)] flex overflow-hidden">
      {/* 左側: BlueprintViewer */}
      <div className="flex-1 border-r bg-gray-50">
        <BlueprintViewer activeFile={null} />
      </div>

      {/* 右側: タブナビゲーション + コンテンツ */}
      <div className="w-96 flex flex-col overflow-hidden bg-white">
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