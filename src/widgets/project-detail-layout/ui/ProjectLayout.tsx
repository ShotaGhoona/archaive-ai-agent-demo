'use client';
import { ProjectTabNavigation } from "@/shared/basic-layout/ui/ProjectTabNavigation";

interface ProjectLayoutProps {
  children: React.ReactNode;
}

export function ProjectLayout({ 
  children
}: ProjectLayoutProps) {
  return (
    <div className="h-[calc(100vh-45px)] flex flex-col overflow-hidden">
      {/* ページヘッダー */}
      <div className="flex-shrink-0 p-4 border-b bg-white">
        <div className="flex items-center justify-between">
          <ProjectTabNavigation />
        </div>
      </div>

      {/* メインコンテンツエリア */}
      <div className="flex-1 overflow-hidden">
        {children}
      </div>
    </div>
  );
}