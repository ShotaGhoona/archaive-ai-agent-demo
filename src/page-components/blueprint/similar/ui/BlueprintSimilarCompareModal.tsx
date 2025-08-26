import React from "react";
import { BlueprintView, SimilarBlueprint, blueprintData } from "@/widgets";
import { ComparisonModal } from "@/features";
import { SIMILAR_COMPARISON_CONFIG } from "../lib";

interface SimilarBlueprintCompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentView: BlueprintView | null;
  similarBlueprint: SimilarBlueprint | null;
}

export function BlueprintSimilarCompareModal({
  isOpen,
  onClose,
  currentView,
  similarBlueprint
}: SimilarBlueprintCompareModalProps) {
  if (!currentView || !similarBlueprint) {
    return null;
  }

  // 現在のアイテムデータを準備
  const currentItemData = {
    ...blueprintData,
    imageUrl: currentView.imageUrl,
    name: currentView.name,
  };

  // 比較対象データを準備
  const comparisonItemData = {
    ...similarBlueprint,
  };

  return (
    <ComparisonModal
      isOpen={isOpen}
      onClose={onClose}
      currentItem={currentItemData}
      comparisonItem={comparisonItemData}
      config={SIMILAR_COMPARISON_CONFIG}
      currentItemTitle="現在のビュー"
      comparisonItemTitle="類似図面"
      currentItemImageUrl={currentView.imageUrl}
      comparisonItemImageUrl={similarBlueprint.imageUrl}
      defaultTab="estimate"
    />
  );
}