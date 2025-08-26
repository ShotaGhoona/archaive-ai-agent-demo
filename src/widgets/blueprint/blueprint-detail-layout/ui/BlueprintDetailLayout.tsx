'use client';
import { useState, useEffect } from "react";
import { usePathname, useParams } from "next/navigation";
import { Layers3, History } from "lucide-react";
import { ResizableLayout, ResizablePanel, ResizableHandle, BlueprintTabNavigation, Button } from "@/shared";
import { blueprintDetailResizableLayoutConfig } from "../lib";
import { BlueprintView, RevisionBlueprint, RevisionBlueprintsData, SameProjectBlueprintsData } from "../model";
import { BlueprintViewer, BlueprintDetailSidebar, RevisionBlueprintCompareModal, RevisionBlueprintBar, SameProjectBlueprintBar } from "../ui";
import blueprintData from "../data/blueprints.json";
import blueprintDetailData from "../data/blueprints.json";

interface BlueprintDetailLayoutProps {
  children: React.ReactNode;
}

export function BlueprintDetailLayout({ 
  children
}: BlueprintDetailLayoutProps) {
  const pathname = usePathname();
  const params = useParams();
  const [blueprintViews, setBlueprintViews] = useState<BlueprintView[]>(blueprintData.blueprintViews);
  const [activeView, setActiveView] = useState<BlueprintView | null>(null);
  const [showSameProjectBlueprints, setShowSameProjectBlueprints] = useState(false);
  const [showRevisionBlueprints, setShowRevisionBlueprints] = useState(false);
  const [compareRevision, setCompareRevision] = useState<RevisionBlueprint | null>(null);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  
  // 同一案件図面データの取得
  const sameProjectData = {
    projectId: blueprintDetailData.productId,
    sameProjectBlueprints: blueprintDetailData.sameProjectBlueprints
  } as SameProjectBlueprintsData;
  
  // リビジョン図面データの取得
  const revisionData = {
    revisionBlueprints: blueprintDetailData.revisionBlueprints
  } as RevisionBlueprintsData;
  
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

  // リビジョン比較ハンドラー
  const handleCompareRevision = (revision: RevisionBlueprint) => {
    setCompareRevision(revision);
    setIsCompareModalOpen(true);
  };

  const handleCloseCompareModal = () => {
    setIsCompareModalOpen(false);
    setCompareRevision(null);
  };

  return (
    <div className="h-[calc(100vh-45px)] flex flex-col">
      {/* 全体上部: タブナビゲーション */}
      <div className="flex-shrink-0 p-4 border-b">
        <div className="flex items-center justify-between">
          <BlueprintTabNavigation />
          
          <div className="flex items-center gap-3">
            {/* 同一案件図面ボタン */}
            <Button
              variant={showSameProjectBlueprints ? "default" : "outline"}
              size="lg"
              onClick={() => {
                setShowSameProjectBlueprints(!showSameProjectBlueprints);
                if (showRevisionBlueprints) setShowRevisionBlueprints(false);
              }}
              className="flex items-center gap-2"
            >
              <Layers3 className="h-4 w-4" />
              { showSameProjectBlueprints ? '閉じる' : '同一案件の図面を見る' }
            </Button>
            
            {/* リビジョン図面ボタン */}
            <Button
              variant={showRevisionBlueprints ? "default" : "outline"}
              size="lg"
              onClick={() => {
                setShowRevisionBlueprints(!showRevisionBlueprints);
                if (showSameProjectBlueprints) setShowSameProjectBlueprints(false);
              }}
              className="flex items-center gap-2"
            >
              <History className="h-4 w-4" />
              { showRevisionBlueprints ? '閉じる' : 'リビジョン図面を見る' }
            </Button>
          </div>
        </div>
      </div>
      
      {/* メインコンテンツエリア */}
      <div className="flex-1 flex min-h-0 relative">
        {/* 同一案件図面バー - オーバーレイ */}
        {showSameProjectBlueprints && (
          <SameProjectBlueprintBar
            blueprints={sameProjectData.sameProjectBlueprints}
            projectId={sameProjectData.projectId}
            currentPath={getCurrentPath()}
          />
        )}
        
        {/* リビジョン図面バー - オーバーレイ */}
        {showRevisionBlueprints && (
          <RevisionBlueprintBar
            blueprints={revisionData.revisionBlueprints}
            currentPath={getCurrentPath()}
            onCompare={handleCompareRevision}
          />
        )}
        <div className="flex-1 min-w-0">
          <ResizableLayout 
            config={blueprintDetailResizableLayoutConfig}
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
      
      {/* リビジョン比較モーダル */}
      <RevisionBlueprintCompareModal
        isOpen={isCompareModalOpen}
        onClose={handleCloseCompareModal}
        currentView={activeView}
        revisionBlueprint={compareRevision}
      />
    </div>
  );
}