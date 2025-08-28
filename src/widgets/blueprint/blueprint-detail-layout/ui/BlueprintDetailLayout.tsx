'use client';
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Layers3, History, Download, Printer, Pencil } from "lucide-react";
import { ResizableLayout, ResizablePanel, ResizableHandle, BlueprintTabNavigation, Button } from "@/shared";
import { blueprintDetailResizableLayoutConfig } from "../lib";
import { RevisionBlueprint, RevisionBlueprintsData, SameProjectBlueprintsData } from "../model";
import { BlueprintView } from "../model";
import { BlueprintDetailSidebar, RevisionBlueprintCompareModal, RevisionBlueprintBar, SameProjectBlueprintBar } from "../ui";
import { PicturePreviewContainer } from "@/shared/components/picture-preview";
import blueprintData from "../data/blueprints.json";
import blueprintDetailData from "../data/blueprints.json";

interface BlueprintDetailLayoutProps {
  children: React.ReactNode;
}

export function BlueprintDetailLayout({ 
  children
}: BlueprintDetailLayoutProps) {
  const pathname = usePathname();
  const [blueprintViews, setBlueprintViews] = useState<BlueprintView[]>(blueprintData.blueprintViews as BlueprintView[]);
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

  // File operations
  const downloadFile = (imageUrl: string, fileName: string) => {
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
  };

  const printFile = (imageUrl: string, fileName: string) => {
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
              <PicturePreviewContainer activeFile={activeView} />
              
              {/* Action buttons overlay */}
              {activeView && (
                <div className="absolute top-6 right-6 space-y-2">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => downloadFile(activeView.imageUrl, activeView.name)}
                      title="ダウンロード"
                    >
                      <Download className="h-5 w-5" />
                      <span className="text-sm">ダウンロード</span>
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => printFile(activeView.imageUrl, activeView.name)}
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
              )}
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