import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/shared/shadcnui/tabs";
import { BlueprintBasicInfo } from "./BlueprintBasicInfo";
import { SimilarBlueprintsContent } from "./SimilarBlueprintsContent";

interface SimilarBlueprint {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  similarity: number;
  createdAt: string;
}

interface BlueprintFile {
  id: string;
  name: string;
  description: string;
  size: number;
  type: string;
  imageUrl: string;
  createdAt: string;
  isActive?: boolean;
  similarBlueprints?: SimilarBlueprint[];
}

interface BlueprintInfoData {
  fileName: string;
  pageNumber: string;
  customerName: string;
  productName: string;
  internalProductNumber: string;
  customerProductNumber: string;
  cadName: string;
  camName: string;
  orderQuantity: string;
  orderDate: string;
  deliveryDate: string;
  maxLength: string;
  maxWidth: string;
  maxHeight: string;
  test: string;
  companyItem: string;
  itemG: string;
  itemI: string;
  remarks: string;
}

interface BlueprintInfoProps {
  activeFile: BlueprintFile | null;
  onSave?: (data: BlueprintInfoData) => void;
  onSimilarBlueprintClick?: (blueprint: SimilarBlueprint) => void;
  activeTab?: string;
  onTabChange?: (value: string) => void;
  isSearchingBlueprints?: boolean;
}

export function BlueprintInfo({ 
  activeFile, 
  onSave, 
  onSimilarBlueprintClick,
  activeTab = "basic",
  onTabChange,
  isSearchingBlueprints = false
}: BlueprintInfoProps) {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="h-full flex flex-col">
      <div className="px-4 pb-2">
        <TabsList className="w-full">
          <TabsTrigger value="basic" className="flex-1">基本情報</TabsTrigger>
          <TabsTrigger value="similar" className="flex-1">類似図面情報</TabsTrigger>
        </TabsList>
      </div>
      
      <TabsContent value="basic" className="flex-1 px-4 pb-4 overflow-y-auto">
        <BlueprintBasicInfo 
          activeFile={activeFile}
          onSave={onSave}
        />
      </TabsContent>
      
      <TabsContent value="similar" className="flex-1 px-0 pb-0 overflow-y-auto flex flex-col">
        <SimilarBlueprintsContent
          activeFile={activeFile}
          onSimilarBlueprintClick={onSimilarBlueprintClick}
          isLoading={isSearchingBlueprints}
        />
      </TabsContent>
    </Tabs>
  );
}