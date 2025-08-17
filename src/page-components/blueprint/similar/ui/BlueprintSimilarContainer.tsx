"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/shared/shadcnui";
import { Search, GitCompareArrows } from "lucide-react";
import { SimilarBlueprintCompareModal } from "./SimilarBlueprintCompareModal";
import { SimilarBlueprint, BlueprintView } from "@/widgets/blueprint-detail-layout/model/types";
import blueprintData from "@/widgets/blueprint-detail-layout/data/blueprints.json";

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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {similarBlueprints
          .sort((a, b) => b.similarity - a.similarity)
          .map((blueprint) => (
            <div
              key={blueprint.id}
              className="group cursor-pointer"
            >
              <div className="relative bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                <div className="aspect-[4/3] bg-gray-50 relative">
                  <img
                    src={blueprint.imageUrl}
                    alt={blueprint.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                  
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center gap-2">
                    <Button
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDifferenceDetection(blueprint);
                      }}
                    >
                      <Search className="h-4 w-4 mr-1" />
                      差分検出
                    </Button>
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDetailedComparison(blueprint);
                      }}
                    >
                      <GitCompareArrows className="h-4 w-4 mr-1" />
                      詳細比較
                    </Button>
                  </div>
                </div>
                
                <div className="p-3">
                  <h4 className="text-sm font-medium text-gray-900 truncate">
                    {blueprint.name}
                  </h4>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <SimilarBlueprintCompareModal
        isOpen={isCompareOpen}
        onClose={handleCloseCompare}
        currentBlueprint={activeView ? {
          id: activeView.id,
          name: activeView.name,
          description: activeView.description,
          size: 0,
          type: "blueprint-view",
          imageUrl: activeView.imageUrl,
          createdAt: activeView.createdAt,
          isActive: activeView.isActive,
          basicInformation: blueprintData.basicInformation,
          estimateInformation: blueprintData.estimateInformation,
          similarBlueprints: activeView.similarBlueprints
        } : null}
        similarBlueprint={compareBlueprint}
      />
    </div>
  );
}