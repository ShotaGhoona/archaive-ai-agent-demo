"use client"
import { useState, useMemo } from 'react';
import { UseEstimateCalculationResult, EstimateQuantities, EstimateItem, ProcessItem, EstimateState } from '../model';
import {
  calculateUnitCosts,
  createMaterial,
  updateMaterial,
  removeMaterial,
  createProcess,
  updateProcess,
  removeProcess,
  createSetupCost,
  updateSetupCost,
  removeSetupCost,
  createOtherCost,
  updateOtherCost,
  removeOtherCost,
  updateQuantity
} from './estimateCalculationLogic';

export const useEstimateCalculation = (): UseEstimateCalculationResult => {
  // 状態管理
  const [materials, setMaterials] = useState<EstimateItem[]>([]);
  const [processes, setProcesses] = useState<ProcessItem[]>([]);
  const [setupCosts, setSetupCosts] = useState<EstimateItem[]>([]);
  const [otherCosts, setOtherCosts] = useState<EstimateItem[]>([]);
  const [quantities, setQuantities] = useState<EstimateQuantities>({
    material: 1,
    process: 1,
    setup: 1
  });

  // 現在の状態
  const state: EstimateState = useMemo(() => ({
    materials,
    processes,
    setupCosts,
    otherCosts,
    quantities
  }), [materials, processes, setupCosts, otherCosts, quantities]);

  // 計算結果（メモ化）
  const costs = useMemo(() => calculateUnitCosts(state), [state]);

  // アクション定義
  const actions = useMemo(() => ({
    // 材料関連
    addMaterial: () => setMaterials(prev => [...prev, createMaterial()]),
    updateMaterialField: (id: string, field: 'name' | 'price', value: string | number) => {
      setMaterials(prev => updateMaterial(prev, id, field, value));
    },
    deleteMaterial: (id: string) => setMaterials(prev => removeMaterial(prev, id)),

    // 工程関連
    addProcess: () => setProcesses(prev => [...prev, createProcess()]),
    updateProcessField: (id: string, field: 'name' | 'timeMinutes' | 'chargeRate', value: string | number) => {
      setProcesses(prev => updateProcess(prev, id, field, value));
    },
    deleteProcess: (id: string) => setProcesses(prev => removeProcess(prev, id)),

    // 段取り工程費用関連
    addSetupCost: () => setSetupCosts(prev => [...prev, createSetupCost()]),
    updateSetupCostField: (id: string, field: 'name' | 'price', value: string | number) => {
      setSetupCosts(prev => updateSetupCost(prev, id, field, value));
    },
    deleteSetupCost: (id: string) => setSetupCosts(prev => removeSetupCost(prev, id)),

    // その他費用関連
    addOtherCost: () => setOtherCosts(prev => [...prev, createOtherCost()]),
    updateOtherCostField: (id: string, field: 'name' | 'price', value: string | number) => {
      setOtherCosts(prev => updateOtherCost(prev, id, field, value));
    },
    deleteOtherCost: (id: string) => setOtherCosts(prev => removeOtherCost(prev, id)),

    // 個数関連
    updateMaterialQuantity: (quantity: number) => {
      setQuantities(prev => updateQuantity(prev, 'material', quantity));
    },
    updateProcessQuantity: (quantity: number) => {
      setQuantities(prev => updateQuantity(prev, 'process', quantity));
    },
    updateSetupQuantity: (quantity: number) => {
      setQuantities(prev => updateQuantity(prev, 'setup', quantity));
    }
  }), []);

  return {
    state,
    costs,
    actions
  };
};