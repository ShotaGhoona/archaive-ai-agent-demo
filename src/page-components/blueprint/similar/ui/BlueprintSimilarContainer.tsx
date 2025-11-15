'use client';
import React, { useState } from 'react';
import { SimilarBlueprintGallery, BlueprintViewContainer } from '@/widgets';
import { ResizableLayout, ResizablePanel, ResizableHandle } from '@/shared';
import { blueprintSimilarResizableLayoutConfig } from '../lib';
import { BlueprintDetailDataInterface, blueprintDetailData } from '@/dummy-data-er-fix/blueprint';
export function BlueprintSimilarContainer() {
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

  // アクティブな図面の類似図面を取得
  const similarBlueprints = activeBlueprintData?.similar_blueprints || [];

  return (
    <ResizableLayout config={blueprintSimilarResizableLayoutConfig}>
      {/* 左側: 図面ビューエリア */}
      <ResizablePanel index={0}>
        <BlueprintViewContainer 
          blueprints={blueprints}
          activeBlueprintId={activeBlueprintId || blueprints[0]?.id}
          onBlueprintChange={handleBlueprintChange}
        />
      </ResizablePanel>

      <ResizableHandle />

      {/* 右側: 類似図面ギャラリー */}
      <ResizablePanel index={1}>
        <div className='h-full overflow-auto'>
          <SimilarBlueprintGallery
            similarBlueprints={similarBlueprints}
            activeView={activeBlueprintData}
            showDetailViewButton={true}
          />
        </div>
      </ResizablePanel>
    </ResizableLayout>
  );
}
