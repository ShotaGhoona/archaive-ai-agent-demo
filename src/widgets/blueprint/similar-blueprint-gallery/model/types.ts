import { BlueprintDetailDataInterface } from '@/dummy-data-er-fix/blueprint/interfaces/types';

export interface SimilarBlueprintGalleryProps {
  similarBlueprints?: BlueprintDetailDataInterface[];
  activeView?: BlueprintDetailDataInterface | null;
  onDifferenceDetection?: (blueprint: BlueprintDetailDataInterface) => void;
  onDetailedComparison?: (blueprint: BlueprintDetailDataInterface) => void;
  onDetailView?: (blueprint: BlueprintDetailDataInterface) => void;
  showDetailViewButton?: boolean;
  isLoading?: boolean;
}
