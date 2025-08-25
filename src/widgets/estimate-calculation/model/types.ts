// 見積もり計算で使用する共通の型定義

export interface MaterialSelection {
  id: string;
  materialName: string;
  formula: string;
  price: number;
}

export interface ProcessSelection {
  id: string;
  processName: string;
  formula: string;
  time: number;
  price: number;
}

export interface OtherCost {
  id: string;
  name: string;
  price: number;
}

export interface Dimensions {
  length: number;
  width: number;
  height: number;
  weight: number;
}

export interface EstimateCalculationState {
  materialSelection: MaterialSelection | null;
  processSelections: ProcessSelection[];
  otherCosts: OtherCost[];
  materialMultiplier: number;
  processMultiplier: number;
  isManualEdit: boolean;
  hasManualEdit: boolean;
  manualMaterialCost: number;
  manualProcessCost: number;
  manualOtherCost: number;
  isModified: boolean;
}

export interface EstimateResult {
  materialCost: number;
  processCost: number;
  otherCost: number;
  totalCost: number;
}

export interface EstimateCalculationProps {
  dimensions: Dimensions;
  initialState?: Partial<EstimateCalculationState>;
  onSave?: (estimateData: { materialCost: number; processCost: number; otherCost: number; totalCost: number }) => void;
  className?: string;
}