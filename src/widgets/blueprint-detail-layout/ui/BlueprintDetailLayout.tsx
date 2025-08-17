'use client';
import { useState, useEffect } from "react";
import { BlueprintViewer } from "./BlueprintViewer";
import { BlueprintTabNavigation } from "@/shared/basic-layout/ui/BlueprintTabNavigation";
import { ResizableLayout, ResizablePanel, ResizableHandle } from "@/features/resizable-layout";
import { blueprintDetailConfig } from "../lib/resizableLayoutConfig";
import { BlueprintDetailSidebar } from "./BlueprintDetailSidebar";
import blueprintData from "../data/blueprints.json";
import { BlueprintView } from "../model/types";

interface BlueprintDetailLayoutProps {
  children: React.ReactNode;
}

export function BlueprintDetailLayout({ 
  children
}: BlueprintDetailLayoutProps) {
  const [blueprintViews, setBlueprintViews] = useState<BlueprintView[]>(blueprintData.blueprintViews);
  const [activeView, setActiveView] = useState<BlueprintView | null>(null);

  // 初期アクティブビューを設定
  useEffect(() => {
    const activeBlueprint = blueprintViews.find(view => view.isActive);
    if (activeBlueprint) {
      setActiveView(activeBlueprint);
    }
  }, [blueprintViews]);

  // ビュー選択ハンドラー
  const handleViewSelect = (viewId: string) => {
    const selectedView = blueprintViews.find(view => view.id === viewId);
    if (selectedView) {
      setBlueprintViews(prev => prev.map(view => ({
        ...view,
        isActive: view.id === viewId
      })));
      setActiveView(selectedView);
    }
  };

  // ビュー削除ハンドラー
  const handleViewRemove = (viewId: string) => {
    setBlueprintViews(prev => {
      const newViews = prev.filter(view => view.id !== viewId);
      // 削除されたビューがアクティブだった場合、新しいアクティブビューを設定
      if (activeView?.id === viewId) {
        const newActiveView = newViews.length > 0 ? newViews[0] : null;
        setActiveView(newActiveView);
        if (newActiveView) {
          return newViews.map(view => ({
            ...view,
            isActive: view.id === newActiveView.id
          }));
        }
      }
      return newViews;
    });
  };

  // ビュー追加ハンドラー
  const handleViewAdd = (newView: BlueprintView) => {
    setBlueprintViews(prev => [...prev, newView]);
  };

  return (
    <div className="h-[calc(100vh-45px)] flex">
      {/* 左側: BlueprintDetailSidebar */}
      <BlueprintDetailSidebar
        views={blueprintViews}
        onViewSelect={handleViewSelect}
        onViewRemove={handleViewRemove}
        onViewAdd={handleViewAdd}
      />
      
      {/* 中央・右側: リサイザブルエリア */}
      <div className="flex-1 min-w-0">
        <ResizableLayout 
          config={blueprintDetailConfig}
          className="h-full"
        >
          {/* 中央: BlueprintViewer */}
          <ResizablePanel index={0} className="bg-gray-50 relative">
            <BlueprintViewer activeFile={activeView} />
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
      </div>
    </div>
  );
}