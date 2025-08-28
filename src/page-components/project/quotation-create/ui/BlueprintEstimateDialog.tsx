"use client";
import { useState } from "react";
import { Dialog, DialogContent, Tabs, TabsList, TabsTrigger, TabsContent, ResizableLayout, ResizablePanel, ResizableHandle } from "@/shared";
import { EstimateCalculation, BasicInformationForm, SimilarBlueprintGallery } from "@/widgets";
import { PicturePreviewContainer } from "@/shared/components/picture-preview";
import { QuotationCreateBlueprint, EstimateData } from "../model";
import { blueprintEstimateDialogResizableLayoutConfig } from "../lib";

interface BlueprintEstimateDialogProps {
  isOpen: boolean;
  onClose: () => void;
  blueprint: QuotationCreateBlueprint | null;
  onSave: (blueprintId: string, estimateData: EstimateData) => void;
}

export function BlueprintEstimateDialog({ isOpen, onClose, blueprint, onSave }: BlueprintEstimateDialogProps) {
  const [activeTab, setActiveTab] = useState("blueprint");
  
  if (!blueprint) return null;

  // 図面の寸法データ（basicInformationから取得）
  const dimensions = {
    length: parseFloat(blueprint.basicInformation.maxLength) || 0,
    width: parseFloat(blueprint.basicInformation.maxWidth) || 0,
    height: parseFloat(blueprint.basicInformation.maxHeight) || 0,
    weight: 2.5 // デフォルト値
  };

  const handleSave = (estimateData: EstimateData) => {
    onSave(blueprint.id, estimateData);
  };


  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="min-w-[90vw] max-w-[90vw] w-full h-[90vh] p-0">
        <ResizableLayout config={blueprintEstimateDialogResizableLayoutConfig} className="h-full">
          {/* 左側: タブコンテンツ */}
          <ResizablePanel index={0}>
            <div className="h-full flex flex-col">
              <div className="flex-shrink-0 p-4 border-b">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="blueprint">図面</TabsTrigger>
                    <TabsTrigger value="basic-info">基本情報</TabsTrigger>
                    <TabsTrigger value="similar">類似図面</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
              
              <div className="flex-1 min-h-0">
                <Tabs value={activeTab} className="h-full">
                  <TabsContent value="blueprint" className="h-full m-0 p-0">
                    <PicturePreviewContainer activeFile={{ imageUrl: blueprint.imageUrl }} />
                  </TabsContent>
                  
                  <TabsContent value="basic-info" className="h-full m-0 p-0">
                    <BasicInformationForm 
                      initialData={blueprint.basicInformation}
                    />
                  </TabsContent>
                  
                  <TabsContent value="similar" className="h-full m-0 p-0">
                    <SimilarBlueprintGallery 
                      similarBlueprints={blueprint.similarBlueprints || []}
                      isLoading={true}
                    />
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </ResizablePanel>
          
          <ResizableHandle />
          
          {/* 右側: 見積もり画面 */}
          <ResizablePanel index={1}>
            <EstimateCalculation
              dimensions={dimensions}
              onSave={handleSave}
            />
          </ResizablePanel>
        </ResizableLayout>
      </DialogContent>
    </Dialog>
  );
}
