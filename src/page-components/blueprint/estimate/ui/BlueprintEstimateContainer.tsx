"use client";
import React from "react";
import { EstimateInformation, BlueprintDetailLayout, EstimateCalculation } from "@/widgets";
import { BlueprintFile } from "@/widgets/blueprint/blueprint-view/model";

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
  const handleSave = (estimateData: { materialCost: string; processingCost: string; totalCost: string }) => {
    if (onSave) {
      onSave(estimateData);
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