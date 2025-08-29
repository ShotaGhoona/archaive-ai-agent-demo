"use client";
import React from "react";
import { BasicInformationForm } from "@/widgets";
import { blueprintData } from "@/page-components/blueprint/home/data";
import { BlueprintViewContainer } from "@/widgets/blueprint/blueprint-view/ui/BlueprintViewContainer";
import { ResizableLayout, ResizablePanel, ResizableHandle } from "@/shared";
import { blueprintBasicInformationResizableLayoutConfig } from "../lib";

export function BlueprintBasicInformationContainer() {
  const config = blueprintBasicInformationResizableLayoutConfig;
  
  return (
    <ResizableLayout config={config}>
      {/* 左側: 図面ビューエリア */}
      <ResizablePanel index={0}>
        <BlueprintViewContainer />
      </ResizablePanel>
      
      <ResizableHandle />
      
      {/* 右側: 基本情報フォーム */}
      <ResizablePanel index={1}>
        <div className="h-full overflow-auto">
          <BasicInformationForm 
            initialData={blueprintData.basicInformation || {}}
          />
        </div>
      </ResizablePanel>
    </ResizableLayout>
  );
}