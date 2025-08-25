"use client";
import React, { useState, useEffect } from "react";
import { BlueprintSimilarCompareModal } from "../ui";
import { SimilarBlueprint, BlueprintView, BlueprintDetailLayout, blueprintData } from "@/widgets";
import { SimilarBlueprintGallery } from "@/widgets/similar-blueprint-gallery";

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
    <BlueprintDetailLayout>
      <div className="h-full">
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
    </BlueprintDetailLayout>
  );
}