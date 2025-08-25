"use client";

import React, { useState, useRef } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared";
import { Search, Settings, Calculator } from "lucide-react";
import { SimilarBlueprintsContent, BasicInformation, EstimateInformation } from "../ui";
import { BlueprintFile, BasicInformation as BasicInfo, EstimateInformation as EstimateInfo } from "@/widgets";

interface BlueprintUtilitiesProps {
  activeFile: BlueprintFile | null;
  onBasicSave?: (basicData: Partial<BasicInfo>) => void;
  onEstimateSave?: (estimateData: Partial<EstimateInfo>) => void;
}

export function BlueprintUtilities({ 
  activeFile, 
  onBasicSave, 
  onEstimateSave 
}: BlueprintUtilitiesProps) {
  const [activeTab, setActiveTab] = useState("similar");
  const hasVisitedSimilar = useRef(false);

  return (
    <div className="h-full flex flex-col">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
        <div className="p-4">
          <TabsList className="grid w-full grid-cols-1 lg:grid-cols-3">
            <TabsTrigger value="similar" className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              類似図面
            </TabsTrigger>
            <TabsTrigger value="basic" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              基本情報
            </TabsTrigger>
            <TabsTrigger value="estimate" className="flex items-center gap-2">
              <Calculator className="h-4 w-4" />
              見積もり
            </TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="similar" className="flex-1 overflow-hidden mt-0">
          <SimilarBlueprintsContent 
            activeFile={activeFile} 
            isInitialVisit={!hasVisitedSimilar.current}
            onInitialLoadComplete={() => { hasVisitedSimilar.current = true; }}
          />
        </TabsContent>
        
        <TabsContent value="basic" className="flex-1 overflow-hidden mt-0">
          <BasicInformation activeFile={activeFile} onSave={onBasicSave} />
        </TabsContent>
        
        <TabsContent value="estimate" className="flex-1 overflow-hidden mt-0">
          <EstimateInformation activeFile={activeFile} onSave={onEstimateSave} />
        </TabsContent>
      </Tabs>
    </div>
  );
}