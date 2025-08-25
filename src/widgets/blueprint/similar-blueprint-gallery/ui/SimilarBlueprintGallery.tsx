"use client";
import React from "react";
import { GalleryView, Loading } from "@/shared";
import { createSimilarBlueprintGalleryConfig } from "@/page-components";
import { SimilarBlueprintGalleryProps } from "../model";
import { useSimilarBlueprintGallery } from "../lib";

export function SimilarBlueprintGallery({
  similarBlueprints = [],
  activeView,
  onDifferenceDetection,
  onDetailedComparison,
  isLoading = false,
  className = ""
}: SimilarBlueprintGalleryProps) {
  const {
    isInitialLoading,
    sortedSimilarBlueprints,
    handleDifferenceDetection,
    handleDetailedComparison
  } = useSimilarBlueprintGallery({
    similarBlueprints,
    activeView,
    onDifferenceDetection,
    onDetailedComparison,
    initialLoading: isLoading
  });

  // ギャラリー設定を作成
  const galleryConfig = createSimilarBlueprintGalleryConfig(
    handleDifferenceDetection,
    handleDetailedComparison
  );

  // 初期ローディング状態のUI
  if (isInitialLoading) {
    return (
      <Loading
        title="類似図面を検索中..."
        description="AIが図面を解析しています"
        fullHeight
        className={className}
      />
    );
  }

  if (sortedSimilarBlueprints.length === 0) {
    return (
      <div className={`h-full flex flex-col items-center justify-center ${className}`}>
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
    <div className={`h-full flex flex-col ${className}`}>
      <div className="flex-1 overflow-y-auto p-4 min-h-0">
        <GalleryView
          data={sortedSimilarBlueprints}
          config={galleryConfig}
        />
      </div>
    </div>
  );
}