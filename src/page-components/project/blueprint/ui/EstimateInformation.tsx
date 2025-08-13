import React, { useState, useEffect } from "react";
import { Button, Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/shadcnui";
import { Save, Plus, Trash2 } from "lucide-react";
import { BlueprintFile, EstimateInformation as EstimateInfo } from "../data/types";
import materialMasterData from "@/page-components/setting/material-master/data/materialMaster.json";
import processMasterData from "@/page-components/setting/process-master/data/processMaster.json";

interface EstimateInformationProps {
  activeFile: BlueprintFile | null;
  onSave?: (estimateData: Partial<EstimateInfo>) => void;
}

interface MaterialSelection {
  id: string;
  materialName: string;
  formula: string;
  price: number;
}

interface ProcessSelection {
  id: string;
  processName: string;
  formula: string;
  time: number;
  price: number;
}

interface OtherCost {
  id: string;
  name: string;
  price: number;
}

// 基本情報（実際は基本情報から取得）
const DIMENSIONS = {
  length: 150.5,
  width: 80.2,
  height: 45,
  weight: 2.5 // 適当に設定
};

// 計算式を安全に実行する関数
const calculateFormula = (formula: string, dimensions: typeof DIMENSIONS): number => {
  try {
    const { length, width, height, weight } = dimensions;
    const result = Function('"use strict"; return (' + 
      formula
        .replace(/length/g, length.toString())
        .replace(/width/g, width.toString())
        .replace(/height/g, height.toString())
        .replace(/weight/g, weight.toString()) + 
    ')')();
    return Math.round(result);
  } catch (error) {
    console.error('計算エラー:', error);
    return 0;
  }
};

export function EstimateInformation({ activeFile, onSave }: EstimateInformationProps) {
  const [materialSelection, setMaterialSelection] = useState<MaterialSelection | null>(null);
  const [processSelections, setProcessSelections] = useState<ProcessSelection[]>([]);
  const [otherCosts, setOtherCosts] = useState<OtherCost[]>([]);
  const [isModified, setIsModified] = useState(false);

  useEffect(() => {
    if (activeFile) {
      // 既存データがあれば復元（今回は初期化）
      setMaterialSelection(null);
      setProcessSelections([]);
      setOtherCosts([]);
      setIsModified(false);
    }
  }, [activeFile]);

  // 材料選択
  const handleMaterialSelect = (materialId: string) => {
    const material = materialMasterData.find(m => m.id === materialId);
    if (material) {
      const price = calculateFormula(material.formula, DIMENSIONS);
      setMaterialSelection({
        id: material.id,
        materialName: material.materialName,
        formula: material.formula,
        price
      });
      setIsModified(true);
    }
  };

  // 工程追加
  const handleProcessAdd = (processId: string) => {
    const process = processMasterData.find(p => p.id === processId);
    if (process) {
      const newProcess: ProcessSelection = {
        id: `${process.id}_${Date.now()}`,
        processName: process.processName,
        formula: process.customFormula,
        time: 0,
        price: 0
      };
      setProcessSelections(prev => [...prev, newProcess]);
      setIsModified(true);
    }
  };

  // 工程時間変更
  const handleProcessTimeChange = (id: string, time: number) => {
    setProcessSelections(prev => prev.map(p => {
      if (p.id === id) {
        const basePrice = calculateFormula(p.formula, DIMENSIONS);
        return { ...p, time, price: Math.round(basePrice * time / 60) }; // 時間単位で計算
      }
      return p;
    }));
    setIsModified(true);
  };

  // 工程削除
  const handleProcessRemove = (id: string) => {
    setProcessSelections(prev => prev.filter(p => p.id !== id));
    setIsModified(true);
  };

  // その他費用追加
  const handleOtherCostAdd = () => {
    const newCost: OtherCost = {
      id: `other_${Date.now()}`,
      name: '',
      price: 0
    };
    setOtherCosts(prev => [...prev, newCost]);
    setIsModified(true);
  };

  // その他費用変更
  const handleOtherCostChange = (id: string, field: 'name' | 'price', value: string | number) => {
    setOtherCosts(prev => prev.map(c => 
      c.id === id ? { ...c, [field]: value } : c
    ));
    setIsModified(true);
  };

  // その他費用削除
  const handleOtherCostRemove = (id: string) => {
    setOtherCosts(prev => prev.filter(c => c.id !== id));
    setIsModified(true);
  };

  // 合計計算
  const materialCost = materialSelection?.price || 0;
  const processCost = processSelections.reduce((sum, p) => sum + p.price, 0);
  const otherCost = otherCosts.reduce((sum, c) => sum + c.price, 0);
  const totalCost = materialCost + processCost + otherCost;


  const handleSave = () => {
    const estimateData = {
      materialCost: materialCost.toString(),
      processingCost: processCost.toString(), 
      totalCost: totalCost.toString(),
      // その他のデータも必要に応じて追加
    };
    if (onSave) {
      onSave(estimateData);
    }
    setIsModified(false);
    console.log("見積もり情報保存:", { materialSelection, processSelections, otherCosts, totalCost });
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* 1. 材料選択 */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">材料選択</h3>
          <div className="border rounded-lg">
            {materialSelection ? (
              <div className="flex justify-between items-center p-3 border-b">
                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setMaterialSelection(null)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <span>{materialSelection.materialName}</span>
                </div>
                <div className="font-medium">{materialSelection.price.toLocaleString()}円</div>
              </div>
            ) : (
              <div className="p-3">
                <Select onValueChange={handleMaterialSelect}>
                  <SelectTrigger className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="材料を選択" />
                  </SelectTrigger>
                  <SelectContent>
                    {materialMasterData.map((material) => (
                      <SelectItem key={material.id} value={material.id}>
                        {material.materialName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </div>

        {/* 2. 工程選択 */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">工程選択</h3>
          <div className="border rounded-lg">
            {processSelections.map((process) => (
              <div key={process.id} className="flex justify-between items-center p-3 border-b">
                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleProcessRemove(process.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <span>{process.processName}</span>
                  <div className="flex items-center gap-1">
                    <Input
                      type="number"
                      value={process.time}
                      onChange={(e) => handleProcessTimeChange(process.id, Number(e.target.value))}
                      className="w-16"
                      placeholder="0"
                    />
                    <span className="text-sm text-gray-600">分</span>
                  </div>
                </div>
                <div className="font-medium">{process.price.toLocaleString()}円</div>
              </div>
            ))}
            <div className="p-3">
              <Select onValueChange={handleProcessAdd} value="">
                <SelectTrigger className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="工程を追加" />
                </SelectTrigger>
                <SelectContent>
                  {processMasterData.map((process) => (
                    <SelectItem key={process.id} value={process.id}>
                      {process.processName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* 3. その他費用 */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">その他費用</h3>
          <div className="border rounded-lg">
            {otherCosts.map((cost) => (
              <div key={cost.id} className="flex justify-between items-center p-3 border-b">
                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleOtherCostRemove(cost.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <Input
                    value={cost.name}
                    onChange={(e) => handleOtherCostChange(cost.id, 'name', e.target.value)}
                    placeholder="項目名を入力"
                    className="w-48"
                  />
                </div>
                <div>
                  <Input
                    type="number"
                    value={cost.price}
                    onChange={(e) => handleOtherCostChange(cost.id, 'price', Number(e.target.value))}
                    className="w-32"
                    placeholder="円"
                  />
                </div>
              </div>
            ))}
            <div className="p-3">
              <Button
                variant="outline"
                onClick={handleOtherCostAdd}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                項目を追加
              </Button>
            </div>
          </div>
        </div>

        {/* 4. 見積もり結果 */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">見積もり結果</h3>
          <div className="border rounded-lg p-4 bg-gray-50">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>材料費:</span>
                <span>{materialCost.toLocaleString()}円</span>
              </div>
              <div className="flex justify-between">
                <span>工程費:</span>
                <span>{processCost.toLocaleString()}円</span>
              </div>
              <div className="flex justify-between">
                <span>その他:</span>
                <span>{otherCost.toLocaleString()}円</span>
              </div>
              <hr className="my-2" />
              <div className="flex justify-between text-lg font-bold">
                <span>合計:</span>
                <span>{totalCost.toLocaleString()}円</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-4 border-t">
        <Button
          onClick={handleSave}
          disabled={!isModified}
          className="w-full gap-2"
          variant={isModified ? "default" : "outline"}
        >
          <Save className="h-4 w-4" />
          見積もりを確定
        </Button>
      </div>
    </div>
  );
}