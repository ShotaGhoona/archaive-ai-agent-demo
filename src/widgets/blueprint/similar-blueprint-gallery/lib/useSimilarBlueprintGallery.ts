'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BlueprintDetailDataInterface } from '@/dummy-data-er-fix/blueprint/interfaces/types';

interface UseSimilarBlueprintGalleryProps {
  similarBlueprints?: BlueprintDetailDataInterface[];
  activeView?: BlueprintDetailDataInterface | null;
  onDifferenceDetection?: (blueprint: BlueprintDetailDataInterface) => void;
  onDetailedComparison?: (blueprint: BlueprintDetailDataInterface) => void;
  onDetailView?: (blueprint: BlueprintDetailDataInterface) => void;
}

export function useSimilarBlueprintGallery({
  activeView,
  onDifferenceDetection,
  onDetailedComparison,
  onDetailView,
}: UseSimilarBlueprintGalleryProps) {
  const router = useRouter();
  const [compareBlueprint, setCompareBlueprint] =
    useState<BlueprintDetailDataInterface | null>(null);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  
  const handleDifferenceDetection = (blueprint: BlueprintDetailDataInterface) => {
    if (onDifferenceDetection) {
      onDifferenceDetection(blueprint);
    } else {
      const differenceUrl = `/blueprint/difference-detection?source=${encodeURIComponent(activeView?.drawing_file_name || '')}&target=${encodeURIComponent(blueprint.drawing_file_name)}&sourceId=${activeView?.id}&targetId=${blueprint.id}`;
      window.open(differenceUrl, '_blank');
    }
  };

  const handleDetailedComparison = (blueprint: BlueprintDetailDataInterface) => {
    if (onDetailedComparison) {
      onDetailedComparison(blueprint);
    } else {
      setCompareBlueprint(blueprint);
      setIsCompareOpen(true);
    }
  };

  const handleDetailView = (blueprint: BlueprintDetailDataInterface) => {
    if (onDetailView) {
      onDetailView(blueprint);
    } else {
      router.push(`/blueprint/similar-detail?blueprintId=${blueprint.id}`);
    }
  };

  const handleCloseCompare = () => {
    setIsCompareOpen(false);
    setCompareBlueprint(null);
  };

  return {
    compareBlueprint,
    isCompareOpen,
    handleDifferenceDetection,
    handleDetailedComparison,
    handleDetailView,
    handleCloseCompare,
  };
}
