"use client";
import React, { useState, useEffect } from "react";
import { SimilarBlueprint, BlueprintView, blueprintData, SimilarBlueprintGallery } from "@/widgets";
import { BlueprintViewContainer } from "@/widgets/blueprint/blueprint-view/ui/BlueprintViewContainer";
import { ResizableLayout, ResizablePanel, ResizableHandle } from "@/shared";
import { BlueprintSimilarCompareModal } from "../ui";
import { blueprintSimilarResizableLayoutConfig } from "../lib";
export function BlueprintSimilarContainer() {
  const [compareBlueprint, setCompareBlueprint] = useState<SimilarBlueprint | null>(null);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [activeView, setActiveView] = useState<BlueprintView | null>(null);
  // アクティブなビューを取得
  useEffect(() => {
    const currentActiveView = blueprintData.blueprintViews.find(view => view.isActive);
    setActiveView(currentActiveView || blueprintData.blueprintViews[0]);
  }, []);

  const handleDetailedComparison = (blueprint: SimilarBlueprint) => {
    setCompareBlueprint(blueprint);
    setIsCompareOpen(true);
  };

  const handleCloseCompare = () => {
    setIsCompareOpen(false);
    setCompareBlueprint(null);
  };

  const similarBlueprints = activeView?.similarBlueprints || [];

  return (
    <ResizableLayout config={blueprintSimilarResizableLayoutConfig}>
      {/* 左側: 図面ビューエリア */}
      <ResizablePanel index={0}>
        <BlueprintViewContainer />
      </ResizablePanel>
      
      <ResizableHandle />
      
      {/* 右側: 類似図面ギャラリー */}
      <ResizablePanel index={1}>
        <div className="h-full overflow-auto">
          <SimilarBlueprintGallery 
            similarBlueprints={similarBlueprints}
            activeView={activeView}
            onDetailedComparison={handleDetailedComparison}
            isLoading={true}
          />
          
          <BlueprintSimilarCompareModal
            isOpen={isCompareOpen}
            onClose={handleCloseCompare}
            currentView={activeView}
            similarBlueprint={compareBlueprint}
          />
        </div>
      </ResizablePanel>
    </ResizableLayout>
  );
}