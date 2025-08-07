'use client';
import { DetailTabNavigation } from "@/shared/basic-layout/ui/DetailTabNavigation";

interface BlueprintDetailLayoutProps {
  children: React.ReactNode;
  params: { id: string };
}

export default function BlueprintDetailLayout({ 
  children, 
  params 
}: BlueprintDetailLayoutProps) {
  return (
    <div className="h-[calc(100vh-45px)] flex flex-col overflow-hidden">
      {/* ページヘッダー */}
      <div className="flex-shrink-0 p-4 border-b bg-white">
        <div className="flex items-center justify-between">
          <DetailTabNavigation />
        </div>
      </div>

      {/* メインコンテンツエリア */}
      <div className="flex-1 overflow-hidden">
        {children}
      </div>
    </div>
  );
}