// 見積もり計算で使用する共通の型定義

// 基本的なアイテム型
export interface EstimateItem {
  id: string;
  name: string;
  price: number;
}

// 工程アイテム型（時間とチャージレートを持つ）
export interface ProcessItem {
  id: string;
  name: string;
  timeMinutes: number;
  chargeRate: number; // 円/分
}

// 図面の寸法情報
export interface Dimensions {
  length: number;
  width: number;
  height: number;
  weight: number;
}

// 各カテゴリの個数設定
export interface EstimateQuantities {
  material: number;
  process: number;
  setup: number;
}

// 見積もり状態の全体管理
export interface EstimateState {
  materials: EstimateItem[];
  processes: ProcessItem[];
  setupCosts: EstimateItem[];
  otherCosts: EstimateItem[];
  quantities: EstimateQuantities;
}

// 計算結果の型定義
export interface EstimateCosts {
  // 単価
  materialUnitCost: number;
  processUnitCost: number;
  setupUnitCost: number;
  otherCost: number; // 固定費
  
  // 総額
  materialTotalCost: number;
  processTotalCost: number;
  setupTotalCost: number;
  
  // 最終合計
  finalTotal: number;
}

// Props型定義
export interface EstimateCalculationProps {
  dimensions: Dimensions;
  onSave?: (estimateData: EstimateData) => void;
  className?: string;
}

// 保存用データ型
export interface EstimateData {
  materialCost: string;
  processingCost: string;
  setupCost: string;
  otherCost: string;
  totalCost: string;
}

// フック戻り値型
export interface UseEstimateCalculationResult {
  state: EstimateState;
  costs: EstimateCosts;
  actions: EstimateActions;
}

// アクション型定義
export interface EstimateActions {
  // 材料関連
  addMaterial: () => void;
  updateMaterialField: (id: string, field: 'name' | 'price', value: string | number) => void;
  deleteMaterial: (id: string) => void;
  
  // 工程関連
  addProcess: () => void;
  updateProcessField: (id: string, field: 'name' | 'timeMinutes' | 'chargeRate', value: string | number) => void;
  deleteProcess: (id: string) => void;
  
  // 段取り工程費用関連
  addSetupCost: () => void;
  updateSetupCostField: (id: string, field: 'name' | 'price', value: string | number) => void;
  deleteSetupCost: (id: string) => void;
  
  // その他費用関連
  addOtherCost: () => void;
  updateOtherCostField: (id: string, field: 'name' | 'price', value: string | number) => void;
  deleteOtherCost: (id: string) => void;
  
  // 個数関連
  updateMaterialQuantity: (quantity: number) => void;
  updateProcessQuantity: (quantity: number) => void;
  updateSetupQuantity: (quantity: number) => void;
}