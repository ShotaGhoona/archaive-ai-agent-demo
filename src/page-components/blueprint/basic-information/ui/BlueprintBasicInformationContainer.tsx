'use client';
import React, { useState } from 'react';
import { BasicInformationContainer } from '@/widgets';
import { BlueprintViewContainer } from '@/widgets/blueprint/blueprint-view/ui/BlueprintViewContainer';
import { ResizableLayout, ResizablePanel, ResizableHandle } from '@/shared';
import { blueprintBasicInformationResizableLayoutConfig } from '../lib';
import { BlueprintDetailDataInterface } from '@/dummy-data-er-fix/blueprint/interfaces/types';
import blueprintDetailData from '@/dummy-data-er-fix/blueprint/blueprint-detail-data.json';

export function BlueprintBasicInformationContainer() {
  const config = blueprintBasicInformationResizableLayoutConfig;
  const [activeBlueprintId, setActiveBlueprintId] = useState<number | null>(null);
  
  // ER図ベースのデータを型キャスト
  const blueprints = blueprintDetailData as BlueprintDetailDataInterface[];
  
  // アクティブな図面データを取得
  const activeBlueprintData = activeBlueprintId 
    ? blueprints.find(bp => bp.id === activeBlueprintId) 
    : blueprints[0]; // デフォルトは最初のデータ

  const handleBlueprintChange = (blueprintId: number) => {
    setActiveBlueprintId(blueprintId);
  };

  return (
    <ResizableLayout config={config}>
      {/* 左側: 図面ビューエリア */}
      <ResizablePanel index={0}>
        <BlueprintViewContainer 
          blueprints={blueprints}
          activeBlueprintId={activeBlueprintId || blueprints[0]?.id}
          onBlueprintChange={handleBlueprintChange}
        />
      </ResizablePanel>

      <ResizableHandle />

      {/* 右側: 基本情報フォーム */}
      <ResizablePanel index={1}>
        <div className='h-full overflow-auto'>
          {activeBlueprintData && (
            <BasicInformationContainer 
              blueprintData={activeBlueprintData}
            />
          )}
        </div>
      </ResizablePanel>
    </ResizableLayout>
  );
}
