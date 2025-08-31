'use client';
import React, { useState } from 'react';
import { EstimateCalculation } from '@/widgets';
import { BlueprintViewContainer } from '@/widgets/blueprint/blueprint-view/ui/BlueprintViewContainer';
import { ResizableLayout, ResizablePanel, ResizableHandle } from '@/shared';
import { blueprintEstimateResizableLayoutConfig } from '../lib';
import { BlueprintDetailDataInterface } from '@/dummy-data-er-fix/blueprint/interfaces/types';
import blueprintDetailData from '@/dummy-data-er-fix/blueprint/blueprint-detail-data.json';

interface BlueprintEstimateContainerProps {
  onSave?: (estimateData: {
    materialCost: string;
    processingCost: string;
    setupCost: string;
    otherCost: string;
    totalCost: string;
  }) => void;
}


export function BlueprintEstimateContainer({
  onSave,
}: BlueprintEstimateContainerProps) {
  const [activeBlueprintId, setActiveBlueprintId] = useState<number | null>(null);
  
  // ER図ベースのデータを型キャスト
  const blueprints = blueprintDetailData as BlueprintDetailDataInterface[];
  
  const handleBlueprintChange = (blueprintId: number) => {
    setActiveBlueprintId(blueprintId);
  };

  const handleSave = (estimateData: {
    materialCost: string;
    processingCost: string;
    setupCost: string;
    otherCost: string;
    totalCost: string;
  }) => {
    if (onSave) {
      onSave(estimateData);
    }
  };

  return (
    <ResizableLayout config={blueprintEstimateResizableLayoutConfig}>
      {/* 左側: 図面ビューエリア */}
      <ResizablePanel index={0}>
        <BlueprintViewContainer 
          blueprints={blueprints}
          activeBlueprintId={activeBlueprintId || blueprints[0]?.id}
          onBlueprintChange={handleBlueprintChange}
        />
      </ResizablePanel>

      <ResizableHandle />

      {/* 右側: 見積計算フォーム */}
      <ResizablePanel index={1}>
        <div className='h-full overflow-auto'>
          <EstimateCalculation onSave={handleSave} />
        </div>
      </ResizablePanel>
    </ResizableLayout>
  );
}
