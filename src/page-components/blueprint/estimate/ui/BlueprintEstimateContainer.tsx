"use client";
import React from "react";
import { EstimateInformation, EstimateCalculation } from "@/widgets";
import { BlueprintViewContainer } from "@/widgets/blueprint/blueprint-view/ui/BlueprintViewContainer";
import { ResizableLayout, ResizablePanel, ResizableHandle } from "@/shared";
import { blueprintEstimateResizableLayoutConfig } from "../lib";

interface BlueprintEstimateContainerProps {
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
    <ResizableLayout config={blueprintEstimateResizableLayoutConfig}>
      {/* 左側: 図面ビューエリア */}
      <ResizablePanel index={0}>
        <BlueprintViewContainer />
      </ResizablePanel>
      
      <ResizableHandle />
      
      {/* 右側: 見積計算フォーム */}
      <ResizablePanel index={1}>
        <div className="h-full overflow-auto">
          <EstimateCalculation
            dimensions={DIMENSIONS}
            onSave={handleSave}
          />
        </div>
      </ResizablePanel>
    </ResizableLayout>
  );
}