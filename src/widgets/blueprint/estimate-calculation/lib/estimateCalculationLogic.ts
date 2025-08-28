// 見積もり計算のビジネスロジック
import {
  EstimateItem,
  ProcessItem,
  EstimateQuantities,
  EstimateState,
  EstimateCosts
} from '../model';

// ヘルパー関数
export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

// 単価計算関数
export const calculateUnitCosts = (state: EstimateState): EstimateCosts => {
  // 材料費単価 = 全材料の単価合計
  const materialUnitCost = state.materials.reduce((sum, item) => sum + item.price, 0);
  
  // 工程費単価 = 全工程の(時間 × チャージ)の合計
  const processUnitCost = state.processes.reduce((sum, item) => sum + (item.timeMinutes * item.chargeRate), 0);
  
  // 段取り工程費用単価 = 全段取り項目の単価合計
  const setupUnitCost = state.setupCosts.reduce((sum, item) => sum + item.price, 0);
  
  // その他費用 = 全その他項目の金額合計（固定費）
  const otherCost = state.otherCosts.reduce((sum, item) => sum + item.price, 0);

  // 総額計算
  const materialTotalCost = materialUnitCost * state.quantities.material;
  const processTotalCost = processUnitCost * state.quantities.process;
  const setupTotalCost = setupUnitCost * state.quantities.setup;
  
  // 最終見積金額
  const finalTotal = materialTotalCost + processTotalCost + setupTotalCost + otherCost;

  return {
    materialUnitCost,
    processUnitCost,
    setupUnitCost,
    otherCost,
    materialTotalCost,
    processTotalCost,
    setupTotalCost,
    finalTotal
  };
};

// 材料関連の操作
export const createMaterial = (): EstimateItem => ({
  id: generateId(),
  name: "",
  price: 0
});

export const updateMaterial = (
  materials: EstimateItem[], 
  id: string, 
  field: 'name' | 'price', 
  value: string | number
): EstimateItem[] => {
  return materials.map(item => 
    item.id === id ? { ...item, [field]: value } : item
  );
};

export const removeMaterial = (materials: EstimateItem[], id: string): EstimateItem[] => {
  return materials.filter(item => item.id !== id);
};

// 工程関連の操作
export const createProcess = (): ProcessItem => ({
  id: generateId(),
  name: "",
  timeMinutes: 0,
  chargeRate: 0
});

export const updateProcess = (
  processes: ProcessItem[], 
  id: string, 
  field: keyof ProcessItem, 
  value: string | number
): ProcessItem[] => {
  return processes.map(item => 
    item.id === id ? { ...item, [field]: value } : item
  );
};

export const removeProcess = (processes: ProcessItem[], id: string): ProcessItem[] => {
  return processes.filter(item => item.id !== id);
};

// 段取り工程費用関連の操作
export const createSetupCost = (): EstimateItem => ({
  id: generateId(),
  name: "",
  price: 0
});

export const updateSetupCost = (
  setupCosts: EstimateItem[], 
  id: string, 
  field: 'name' | 'price', 
  value: string | number
): EstimateItem[] => {
  return setupCosts.map(item => 
    item.id === id ? { ...item, [field]: value } : item
  );
};

export const removeSetupCost = (setupCosts: EstimateItem[], id: string): EstimateItem[] => {
  return setupCosts.filter(item => item.id !== id);
};

// その他費用関連の操作
export const createOtherCost = (): EstimateItem => ({
  id: generateId(),
  name: "",
  price: 0
});

export const updateOtherCost = (
  otherCosts: EstimateItem[], 
  id: string, 
  field: 'name' | 'price', 
  value: string | number
): EstimateItem[] => {
  return otherCosts.map(item => 
    item.id === id ? { ...item, [field]: value } : item
  );
};

export const removeOtherCost = (otherCosts: EstimateItem[], id: string): EstimateItem[] => {
  return otherCosts.filter(item => item.id !== id);
};

// 個数更新
export const updateQuantity = (
  quantities: EstimateQuantities, 
  type: keyof EstimateQuantities, 
  value: number
): EstimateQuantities => {
  return { ...quantities, [type]: value };
};