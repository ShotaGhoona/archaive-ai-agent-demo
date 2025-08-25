import { useState, useCallback } from "react";
import { 
  EstimateCalculationState, 
  MaterialSelection, 
  ProcessSelection, 
  OtherCost, 
  Dimensions, 
  EstimateResult 
} from "../model/types";
import { calculateFormula } from "./calculateFormula";
import { materialMasterData, processMasterData } from "@/page-components";

// 初期状態
const initialState: EstimateCalculationState = {
  materialSelection: null,
  processSelections: [],
  otherCosts: [],
  materialMultiplier: 100,
  processMultiplier: 100,
  isManualEdit: false,
  hasManualEdit: false,
  manualMaterialCost: 0,
  manualProcessCost: 0,
  manualOtherCost: 0,
  isModified: false
};

export const useEstimateCalculation = (
  dimensions: Dimensions,
  initialData?: Partial<EstimateCalculationState>
) => {
  const [state, setState] = useState<EstimateCalculationState>({
    ...initialState,
    ...initialData
  });

  // 材料選択
  const handleMaterialSelect = useCallback((materialId: string) => {
    const material = materialMasterData.find(m => m.id === materialId);
    if (material) {
      const price = calculateFormula(material.formula, dimensions);
      const materialSelection: MaterialSelection = {
        id: material.id,
        materialName: material.materialName,
        formula: material.formula,
        price
      };
      setState(prev => ({
        ...prev,
        materialSelection,
        isModified: true
      }));
    }
  }, [dimensions]);

  // 材料削除
  const handleMaterialRemove = useCallback(() => {
    setState(prev => ({
      ...prev,
      materialSelection: null,
      isModified: true
    }));
  }, []);

  // 工程追加
  const handleProcessAdd = useCallback((processId: string) => {
    const process = processMasterData.find(p => p.id === processId);
    if (process) {
      const newProcess: ProcessSelection = {
        id: `${process.id}_${Date.now()}`,
        processName: process.processName,
        formula: process.customFormula,
        time: 0,
        price: 0
      };
      setState(prev => ({
        ...prev,
        processSelections: [...prev.processSelections, newProcess],
        isModified: true
      }));
    }
  }, []);

  // 工程時間変更
  const handleProcessTimeChange = useCallback((id: string, time: number) => {
    setState(prev => ({
      ...prev,
      processSelections: prev.processSelections.map(p => {
        if (p.id === id) {
          const basePrice = calculateFormula(p.formula, dimensions);
          return { ...p, time, price: Math.round(basePrice * time / 60) };
        }
        return p;
      }),
      isModified: true
    }));
  }, [dimensions]);

  // 工程削除
  const handleProcessRemove = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      processSelections: prev.processSelections.filter(p => p.id !== id),
      isModified: true
    }));
  }, []);

  // その他費用追加
  const handleOtherCostAdd = useCallback(() => {
    const newCost: OtherCost = {
      id: `other_${Date.now()}`,
      name: '',
      price: 0
    };
    setState(prev => ({
      ...prev,
      otherCosts: [...prev.otherCosts, newCost],
      isModified: true
    }));
  }, []);

  // その他費用変更
  const handleOtherCostChange = useCallback((id: string, field: 'name' | 'price', value: string | number) => {
    setState(prev => ({
      ...prev,
      otherCosts: prev.otherCosts.map(c => 
        c.id === id ? { ...c, [field]: value } : c
      ),
      isModified: true
    }));
  }, []);

  // その他費用削除
  const handleOtherCostRemove = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      otherCosts: prev.otherCosts.filter(c => c.id !== id),
      isModified: true
    }));
  }, []);

  // 掛け率変更
  const handleMultiplierChange = useCallback((type: 'material' | 'process', value: number) => {
    setState(prev => ({
      ...prev,
      [`${type}Multiplier`]: value,
      isModified: true
    }));
  }, []);

  // 手動編集開始
  const handleStartManualEdit = useCallback(() => {
    const materialBaseCost = state.materialSelection?.price || 0;
    const calculatedMaterialCost = Math.round(materialBaseCost * (state.materialMultiplier / 100));
    const processBaseCost = state.processSelections.reduce((sum, p) => sum + p.price, 0);
    const calculatedProcessCost = Math.round(processBaseCost * (state.processMultiplier / 100));
    const calculatedOtherCost = state.otherCosts.reduce((sum, c) => sum + c.price, 0);

    setState(prev => ({
      ...prev,
      manualMaterialCost: prev.hasManualEdit ? prev.manualMaterialCost : calculatedMaterialCost,
      manualProcessCost: prev.hasManualEdit ? prev.manualProcessCost : calculatedProcessCost,
      manualOtherCost: prev.hasManualEdit ? prev.manualOtherCost : calculatedOtherCost,
      isManualEdit: true,
      isModified: true
    }));
  }, [state.materialSelection, state.materialMultiplier, state.processSelections, state.processMultiplier, state.otherCosts]);

  // 手動編集キャンセル
  const handleCancelManualEdit = useCallback(() => {
    setState(prev => ({
      ...prev,
      isManualEdit: false,
      isModified: true
    }));
  }, []);

  // 手動編集確定
  const handleConfirmManualEdit = useCallback(() => {
    setState(prev => ({
      ...prev,
      isManualEdit: false,
      hasManualEdit: true,
      isModified: true
    }));
  }, []);

  // 手動コスト変更
  const handleManualCostChange = useCallback((type: 'material' | 'process' | 'other', value: number) => {
    setState(prev => ({
      ...prev,
      [`manual${type.charAt(0).toUpperCase() + type.slice(1)}Cost`]: value,
      isModified: true
    }));
  }, []);

  // 合計計算
  const calculateResult = useCallback((): EstimateResult => {
    const materialBaseCost = state.materialSelection?.price || 0;
    const calculatedMaterialCost = Math.round(materialBaseCost * (state.materialMultiplier / 100));
    const processBaseCost = state.processSelections.reduce((sum, p) => sum + p.price, 0);
    const calculatedProcessCost = Math.round(processBaseCost * (state.processMultiplier / 100));
    const calculatedOtherCost = state.otherCosts.reduce((sum, c) => sum + c.price, 0);
    
    const materialCost = state.hasManualEdit ? state.manualMaterialCost : calculatedMaterialCost;
    const processCost = state.hasManualEdit ? state.manualProcessCost : calculatedProcessCost;
    const otherCost = state.hasManualEdit ? state.manualOtherCost : calculatedOtherCost;
    const totalCost = materialCost + processCost + otherCost;

    return { materialCost, processCost, otherCost, totalCost };
  }, [state]);

  // 工程の表示価格を掛け率適用後で計算
  const getProcessDisplayPrice = useCallback((process: ProcessSelection) => {
    return Math.round(process.price * (state.processMultiplier / 100));
  }, [state.processMultiplier]);

  // リセット
  const resetState = useCallback((newInitialData?: Partial<EstimateCalculationState>) => {
    setState({
      ...initialState,
      ...newInitialData
    });
  }, []);

  return {
    state,
    result: calculateResult(),
    handlers: {
      handleMaterialSelect,
      handleMaterialRemove,
      handleProcessAdd,
      handleProcessTimeChange,
      handleProcessRemove,
      handleOtherCostAdd,
      handleOtherCostChange,
      handleOtherCostRemove,
      handleMultiplierChange,
      handleStartManualEdit,
      handleCancelManualEdit,
      handleConfirmManualEdit,
      handleManualCostChange
    },
    utils: {
      getProcessDisplayPrice,
      resetState
    }
  };
};