import { SimilarBlueprint, BlueprintView } from "../../blueprint-detail-layout/model/types";

export interface SimilarBlueprintGalleryProps {
  similarBlueprints?: SimilarBlueprint[];
  activeView?: BlueprintView | null;
  onDifferenceDetection?: (blueprint: SimilarBlueprint) => void;
  onDetailedComparison?: (blueprint: SimilarBlueprint) => void;
  isLoading?: boolean;
  className?: string;
}