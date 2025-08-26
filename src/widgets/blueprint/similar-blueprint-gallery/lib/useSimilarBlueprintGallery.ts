"use client";
import { useState, useEffect } from "react";
import { SimilarBlueprint, BlueprintView } from "@/widgets";

interface UseSimilarBlueprintGalleryProps {
  similarBlueprints?: SimilarBlueprint[];
  activeView?: BlueprintView | null;
  onDifferenceDetection?: (blueprint: SimilarBlueprint) => void;
  onDetailedComparison?: (blueprint: SimilarBlueprint) => void;
  initialLoading?: boolean;
}

export function useSimilarBlueprintGallery({
  similarBlueprints = [],
  activeView,
  onDifferenceDetection,
  onDetailedComparison,
  initialLoading = false
}: UseSimilarBlueprintGalleryProps) {
  const [compareBlueprint, setCompareBlueprint] = useState<SimilarBlueprint | null>(null);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(initialLoading);

  // 初期ローディング
  useEffect(() => {
    if (initialLoading) {
      const timer = setTimeout(() => {
        setIsInitialLoading(false);
      }, 1000 + Math.random() * 1000);

      return () => clearTimeout(timer);
    }
  }, [initialLoading]);

  const handleDifferenceDetection = (blueprint: SimilarBlueprint) => {
    if (onDifferenceDetection) {
      onDifferenceDetection(blueprint);
    } else {
      const differenceUrl = `/blueprint/difference-detection?source=${encodeURIComponent(activeView?.name || '')}&target=${encodeURIComponent(blueprint.name)}&sourceId=${activeView?.id}&targetId=${blueprint.id}`;
      window.open(differenceUrl, '_blank');
    }
  };

  const handleDetailedComparison = (blueprint: SimilarBlueprint) => {
    if (onDetailedComparison) {
      onDetailedComparison(blueprint);
    } else {
      setCompareBlueprint(blueprint);
      setIsCompareOpen(true);
    }
  };

  const handleCloseCompare = () => {
    setIsCompareOpen(false);
    setCompareBlueprint(null);
  };

  // ソート済みデータを準備
  const sortedSimilarBlueprints = [...similarBlueprints].sort((a, b) => b.similarity - a.similarity);

  return {
    compareBlueprint,
    isCompareOpen,
    isInitialLoading,
    sortedSimilarBlueprints,
    handleDifferenceDetection,
    handleDetailedComparison,
    handleCloseCompare
  };
}