"use client";
import React, { useState, useEffect } from "react";
import { GalleryView } from "@/shared/view/gallery-view";
import { SimilarBlueprintCompareModal } from "./SimilarBlueprintCompareModal";
import { SimilarBlueprint, BlueprintView } from "@/widgets/blueprint-detail-layout/model/types";
import blueprintData from "@/widgets/blueprint-detail-layout/data/blueprints.json";
import { createSimilarBlueprintGalleryConfig } from "../lib/similarBlueprintGalleryConfig";

export default function BlueprintSimilarContainer() {
  const [compareBlueprint, setCompareBlueprint] = useState<SimilarBlueprint | null>(null);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [activeView, setActiveView] = useState<BlueprintView | null>(null);

  // アクティブなビューを取得
  useEffect(() => {
    const currentActiveView = blueprintData.blueprintViews.find(view => view.isActive);
    setActiveView(currentActiveView || blueprintData.blueprintViews[0]);
  }, []);

  // 初期ローディング
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialLoading(false);
    }, 1000 + Math.random() * 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleDifferenceDetection = (blueprint: SimilarBlueprint) => {
    const differenceUrl = `/blueprint/difference-detection?source=${encodeURIComponent(activeView?.name || '')}&target=${encodeURIComponent(blueprint.name)}&sourceId=${activeView?.id}&targetId=${blueprint.id}`;
    window.open(differenceUrl, '_blank');
  };

  const handleDetailedComparison = (blueprint: SimilarBlueprint) => {
    setCompareBlueprint(blueprint);
    setIsCompareOpen(true);
  };

  const handleCloseCompare = () => {
    setIsCompareOpen(false);
    setCompareBlueprint(null);
  };

  const similarBlueprints = activeView?.similarBlueprints || [];

  // ソート済みデータを準備
  const sortedSimilarBlueprints = similarBlueprints.sort((a, b) => b.similarity - a.similarity);

  // ギャラリー設定を作成
  const galleryConfig = createSimilarBlueprintGalleryConfig(
    handleDifferenceDetection,
    handleDetailedComparison
  );

  // 初期ローディング状態のUI
  if (isInitialLoading) {
    return (
      <div className="h-full flex flex-col items-center justify-center">
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="relative">
              <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
            </div>
            <div className="text-center space-y-2">
              <p className="text-sm font-medium text-gray-700">類似図面を検索中...</p>
              <p className="text-xs text-gray-500">AIが図面を解析しています</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (similarBlueprints.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center">
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center space-y-2">
            <div className="text-4xl text-gray-300">🔍</div>
            <div className="text-sm text-gray-500">
              類似図面が見つかりませんでした
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full">
      <div className="flex-1 overflow-y-auto p-4">
        <GalleryView
          data={sortedSimilarBlueprints}
          config={galleryConfig}
        />
      </div>
      
      <SimilarBlueprintCompareModal
        isOpen={isCompareOpen}
        onClose={handleCloseCompare}
        currentView={activeView}
        similarBlueprint={compareBlueprint}
      />
    </div>
  );
}