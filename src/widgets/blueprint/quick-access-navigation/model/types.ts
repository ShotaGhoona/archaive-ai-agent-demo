// Quick Access Navigation関連の型定義

export interface RevisionBlueprint {
  id: string;
  name: string;
  filename: string;
  imageUrl: string;
  deliveryDate: string;
  customerName: string;
  projectNumber: string;
  projectId: string;
  similarity: number;
  description: string;
  isActive?: boolean;
}

export interface SameProjectBlueprint {
  id: string;
  name: string;
  filename: string;
  status: 'completed' | 'in_progress' | 'pending';
  imageUrl: string;
  projectId: string;
  isActive?: boolean;
  basicInformation?: {
    productName: string;
    customerName: string;
    orderDate: string;
  };
  estimateInformation?: {
    totalCost: number;
    materialCost: number;
    processingCost: number;
  };
}

// Props interfaces
export interface RevisionBlueprintBarProps {
  revisionBlueprints: RevisionBlueprint[];
  onCompare?: (blueprint: RevisionBlueprint) => void;
}

export interface SameProjectBlueprintBarProps {
  sameProjectBlueprints: SameProjectBlueprint[];
  projectId: string;
}

export interface RevisionBlueprintCompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentBlueprint?: any; // BlueprintView型 - オプショナル
  revisionBlueprint?: RevisionBlueprint; // オプショナル
}

export interface QuickAccessControlsProps {
  showSameProject: boolean;
  showRevision: boolean;
  onToggleSameProject: () => void;
  onToggleRevision: () => void;
}