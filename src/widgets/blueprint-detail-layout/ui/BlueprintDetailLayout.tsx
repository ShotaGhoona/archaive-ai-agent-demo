'use client';
import { useState, useEffect } from "react";
import { usePathname, useParams } from "next/navigation";
import { BlueprintViewer } from "./BlueprintViewer";
import { BlueprintTabNavigation } from "@/shared/basic-layout/ui/BlueprintTabNavigation";
import { RelatedBlueprintsBar } from "./RelatedBlueprintsBar";
import { ResizableLayout, ResizablePanel, ResizableHandle } from "@/features/resizable-layout";
import { blueprintDetailConfig } from "../lib/resizableLayoutConfig";
import { BlueprintDetailSidebar } from "./BlueprintDetailSidebar";
import { Button } from "@/shared/shadcnui";
import { Layers3, ChevronLeft } from "lucide-react";
import blueprintData from "../data/blueprints.json";
import relatedBlueprintsData from "../data/relatedBlueprints.json";
import { BlueprintView } from "../model/types";
import { RelatedBlueprintsData } from "../model/relatedBlueprintTypes";
import Link from "next/link";

interface BlueprintDetailLayoutProps {
  children: React.ReactNode;
}

export function BlueprintDetailLayout({ 
  children
}: BlueprintDetailLayoutProps) {
  const pathname = usePathname();
  const params = useParams();
  const blueprintId = params.id as string;
  const [blueprintViews, setBlueprintViews] = useState<BlueprintView[]>(blueprintData.blueprintViews);
  const [activeView, setActiveView] = useState<BlueprintView | null>(null);
  const [showRelatedBlueprints, setShowRelatedBlueprints] = useState(false);
  
  // 関連図面データの型キャスト
  const relatedData = relatedBlueprintsData as RelatedBlueprintsData;
  
  // 現在のパスから図面のパスを取得 (basic-information, estimate, similar など)
  const getCurrentPath = () => {
    const pathSegments = pathname.split('/');
    return pathSegments[pathSegments.length - 1] || 'basic-information';
  };

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
    <div className="h-[calc(100vh-45px)] flex flex-col">
      {/* 全体上部: タブナビゲーション */}
      <div className="flex-shrink-0 p-4 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <Link href="/blueprint">
                <Button variant="outline" size="lg" className="h-12 p-0">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              </Link>
              <div className="flex flex-col">
                <span className="text-lg font-bold text-gray-900">
                  {blueprintData.productName}
                </span>
                <span className="text-sm text-gray-400">
                  {blueprintId}
                </span>
              </div>
            </div>
            <BlueprintTabNavigation />
          </div>
          
          {/* 関連図面ボタン */}
          <Button
            variant={showRelatedBlueprints ? "default" : "outline"}
            size="lg"
            onClick={() => setShowRelatedBlueprints(!showRelatedBlueprints)}
            className="flex items-center gap-2"
          >
            <Layers3 className="h-4 w-4" />
            { showRelatedBlueprints ? '閉じる' : '関連図面を見る' }
          </Button>
        </div>
      </div>
      
      {/* メインコンテンツエリア */}
      <div className="flex-1 flex min-h-0 relative">
        {/* 関連図面バー - オーバーレイ */}
        {showRelatedBlueprints && (
          <RelatedBlueprintsBar
            blueprints={relatedData.relatedBlueprints}
            projectId={relatedData.projectId}
            currentPath={getCurrentPath()}
          />
        )}
        <div className="flex-1 min-w-0">
          <ResizableLayout 
            config={blueprintDetailConfig}
            className="h-full"
          >
            {/* 右: BlueprintViewer */}
            <ResizablePanel index={0} className="bg-gray-50 relative">
              
              <BlueprintDetailSidebar
                views={blueprintViews}
                onViewSelect={handleViewSelect}
                onViewRemove={handleViewRemove}
                onViewAdd={handleViewAdd}
              />
              <BlueprintViewer activeFile={activeView} />
            </ResizablePanel>

            <ResizableHandle />

            {/* 右側: コンテンツ */}
            <ResizablePanel index={1}>
              {children}
            </ResizablePanel>
          </ResizableLayout>
        </div>
      </div>
    </div>
  );
}