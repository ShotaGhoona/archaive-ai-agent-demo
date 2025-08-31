'use client';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  ResizableLayout,
  ResizablePanel,
  ResizableHandle,
  PicturePreviewContainer,
} from '@/shared';
import {
  EstimateCalculation,
  BasicInformationContainer,
  SimilarBlueprintGallery,
} from '@/widgets';
import { BlueprintDetailDataInterface } from '@/dummy-data-er-fix/blueprint';
import { EstimateInformation } from '../model';
import { blueprintEstimateDialogResizableLayoutConfig } from '../lib';

interface BlueprintEstimateDialogProps {
  isOpen: boolean;
  onClose: () => void;
  blueprint: BlueprintDetailDataInterface | null;
  onSave: (blueprintId: string, estimateData: EstimateInformation) => void;
}

export function BlueprintEstimateDialog({
  isOpen,
  onClose,
  blueprint,
  onSave,
}: BlueprintEstimateDialogProps) {
  const [activeTab, setActiveTab] = useState('blueprint');

  if (!blueprint) return null;

  const handleSave = (estimateData: EstimateInformation) => {
    onSave(blueprint.id.toString(), estimateData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='h-[90vh] w-full max-w-[90vw] min-w-[90vw] p-0'>
        <ResizableLayout
          config={blueprintEstimateDialogResizableLayoutConfig}
          className='h-full'
        >
          {/* 左側: タブコンテンツ */}
          <ResizablePanel index={0}>
            <div className='flex h-full flex-col'>
              <div className='flex-shrink-0 border-b p-4'>
                <Tabs
                  value={activeTab}
                  onValueChange={setActiveTab}
                  className='w-full'
                >
                  <TabsList className='grid w-full grid-cols-3'>
                    <TabsTrigger value='blueprint'>図面</TabsTrigger>
                    <TabsTrigger value='basic-info'>基本情報</TabsTrigger>
                    <TabsTrigger value='similar'>類似図面</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              <div className='min-h-0 flex-1'>
                <Tabs value={activeTab} className='h-full'>
                  <TabsContent value='blueprint' className='m-0 h-full p-0'>
                    <PicturePreviewContainer
                      activeFile={{ imageUrl: blueprint.s3_url }}
                    />
                  </TabsContent>

                  <TabsContent value='basic-info' className='m-0 h-full p-0'>
                    <BasicInformationContainer
                      blueprintData={blueprint}
                    />
                  </TabsContent>

                  <TabsContent value='similar' className='m-0 h-full p-0'>
                    <SimilarBlueprintGallery
                      similarBlueprints={blueprint.similar_blueprints || []}
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
            <EstimateCalculation onSave={handleSave as (data: { materialCost: string; processingCost: string; setupCost: string; otherCost: string; totalCost: string; }) => void} />
          </ResizablePanel>
        </ResizableLayout>
      </DialogContent>
    </Dialog>
  );
}
