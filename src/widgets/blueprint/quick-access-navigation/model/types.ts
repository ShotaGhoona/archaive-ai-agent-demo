// Quick Access Navigation関連の型定義

import { LeafProductDataInterface } from '@/dummy-data-er-fix/blueprint/interfaces/types';

// Props interfaces
export interface RevisionBlueprintBarContainerProps {
  blueprints: LeafProductDataInterface[];
}


export interface RevisionBlueprintCompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentBlueprint?: LeafProductDataInterface;
  revisionBlueprint?: LeafProductDataInterface | null;
}

export interface QuickAccessControlsProps {
  showRevision: boolean;
  onToggleRevision: () => void;
}
