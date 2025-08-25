"use client";
import React from "react";
import { BlueprintFile, EstimateInformation, BlueprintDetailLayout, EstimateCalculation } from "@/widgets";

interface BlueprintEstimateContainerProps {
  activeFile: BlueprintFile | null;
  onSave?: (estimateData: Partial<EstimateInformation >) => void;
}

// 基本情報（実際は基本情報から取得）
const DIMENSIONS = {
  length: 150.5,
  width: 80.2,
  height: 45,
  weight: 2.5 // 適当に設定
};

export function BlueprintEstimateContainer({ onSave }: BlueprintEstimateContainerProps) {
  const handleSave = (estimateData: { materialCost: number; processCost: number; totalCost: number }) => {
    const formattedData = {
      materialCost: estimateData.materialCost.toString(),
      processingCost: estimateData.processCost.toString(), 
      totalCost: estimateData.totalCost.toString(),
    };
    if (onSave) {
      onSave(formattedData);
    }
  };

  return (
    <BlueprintDetailLayout>
      <EstimateCalculation
        dimensions={DIMENSIONS}
        onSave={handleSave}
      />
    </BlueprintDetailLayout>
  );
}