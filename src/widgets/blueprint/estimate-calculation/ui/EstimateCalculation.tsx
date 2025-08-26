"use client";
import React from "react";
import { Button, Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared";
import { Save, Plus, Trash2, Edit, Check, X } from "lucide-react";
import { EstimateCalculationProps } from "../model/types";
import { useEstimateCalculation } from "../lib/useEstimateCalculation";
import { materialMasterData, processMasterData } from "@/shared/data/master";

export function EstimateCalculation({
  dimensions,
  initialState,
  onSave,
  className = ""
}: EstimateCalculationProps) {
  const {
    state,
    result,
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
    utils: { getProcessDisplayPrice }
  } = useEstimateCalculation(dimensions, initialState);

  const handleSave = () => {
    if (onSave) {
      const estimateData = {
        materialCost: result.materialCost.toString(),
        processingCost: result.processCost.toString(),
        totalCost: result.totalCost.toString(),
      };
      onSave(estimateData);
    }
    console.log("見積もり情報保存:", { 
      materialSelection: state.materialSelection, 
      processSelections: state.processSelections, 
      otherCosts: state.otherCosts, 
      totalCost: result.totalCost 
    });
  };

  return (
    <div className={`h-full flex flex-col ${className}`}>
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* 1. 材料選択 */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">材料選択</h3>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">掛け率:</span>
              <Input
                type="number"
                value={state.materialMultiplier}
                onChange={(e) => handleMultiplierChange('material', Number(e.target.value))}
                className="w-20"
                min="0"
                step="1"
              />
              <span className="text-sm text-gray-600">%</span>
            </div>
          </div>
          <div className="border rounded-lg bg-gray-50">
            {state.materialSelection ? (
              <div className="flex justify-between items-center p-3">
                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleMaterialRemove}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <span>{state.materialSelection.materialName}</span>
                </div>
                <div className="font-medium">{result.materialCost.toLocaleString()}円</div>
              </div>
            ) : (
              <Select onValueChange={handleMaterialSelect}>
                <SelectTrigger className="w-full border-0">
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
            )}
          </div>
        </div>

        {/* 2. 工程選択 */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">工程選択</h3>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">掛け率:</span>
              <Input
                type="number"
                value={state.processMultiplier}
                onChange={(e) => handleMultiplierChange('process', Number(e.target.value))}
                className="w-20"
                min="0"
                step="1"
              />
              <span className="text-sm text-gray-600">%</span>
            </div>
          </div>
          <div className="border rounded-lg py-2 bg-gray-50">
            {state.processSelections.map((process) => (
              <div key={process.id} className="flex justify-between items-center px-3 py-1">
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
                <div className="font-medium">{getProcessDisplayPrice(process).toLocaleString()}円</div>
              </div>
            ))}
            <Select onValueChange={handleProcessAdd} value="">
              <SelectTrigger className="w-full border-0">
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

        {/* 3. その他費用 */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">その他費用</h3>
          <div className="border rounded-lg py-2 bg-gray-50">
            {state.otherCosts.map((cost) => (
              <div key={cost.id} className="flex justify-between items-center px-3 py-1">
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
            <div className="">
              <Button
                variant="ghost"
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
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">見積もり結果</h3>
            <div className="flex items-center gap-2">
              {!state.isManualEdit ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleStartManualEdit}
                  className="gap-2"
                >
                  <Edit className="h-4 w-4" />
                  手動編集
                </Button>
              ) : (
                <div className="flex gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleConfirmManualEdit}
                    className="gap-1"
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCancelManualEdit}
                    className="gap-1"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>
          <div className="border rounded-lg p-4 bg-gray-50">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span>材料費:</span>
                {state.isManualEdit ? (
                  <Input
                    type="number"
                    value={state.manualMaterialCost}
                    onChange={(e) => handleManualCostChange('material', Number(e.target.value))}
                    className="w-32 text-right"
                  />
                ) : (
                  <span>{result.materialCost.toLocaleString()}円</span>
                )}
              </div>
              <div className="flex justify-between items-center">
                <span>工程費:</span>
                {state.isManualEdit ? (
                  <Input
                    type="number"
                    value={state.manualProcessCost}
                    onChange={(e) => handleManualCostChange('process', Number(e.target.value))}
                    className="w-32 text-right"
                  />
                ) : (
                  <span>{result.processCost.toLocaleString()}円</span>
                )}
              </div>
              <div className="flex justify-between items-center">
                <span>その他:</span>
                {state.isManualEdit ? (
                  <Input
                    type="number"
                    value={state.manualOtherCost}
                    onChange={(e) => handleManualCostChange('other', Number(e.target.value))}
                    className="w-32 text-right"
                  />
                ) : (
                  <span>{result.otherCost.toLocaleString()}円</span>
                )}
              </div>
              <hr className="my-2" />
              <div className="flex justify-between text-lg font-bold">
                <span>合計:</span>
                <span>{result.totalCost.toLocaleString()}円</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {onSave && (
        <div className="p-4 border-t">
          <Button
            onClick={handleSave}
            disabled={!state.isModified}
            className="w-full gap-2"
            variant={state.isModified ? "default" : "outline"}
          >
            <Save className="h-4 w-4" />
            見積もりを確定
          </Button>
        </div>
      )}
    </div>
  );
}