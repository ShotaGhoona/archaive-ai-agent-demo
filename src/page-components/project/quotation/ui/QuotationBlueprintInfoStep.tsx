"use client";

import { useState } from "react";
import { FormData, QuotationBlueprint, EstimateData } from "../model";
import { GalleryView } from "@/shared";
import { createQuotationBlueprintGalleryConfig } from "../lib";
import { BlueprintEstimateDialog } from "./BlueprintEstimateDialog";
import blueprintsData from "../data/blueprints.json";

interface QuotationBlueprintInfoStepProps {
  formData: FormData;
  setFormData: (data: FormData) => void;
}

export function QuotationBlueprintInfoStep({}: QuotationBlueprintInfoStepProps) {
  const [blueprints, setBlueprints] = useState<QuotationBlueprint[]>(blueprintsData as QuotationBlueprint[]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBlueprint, setSelectedBlueprint] = useState<QuotationBlueprint | null>(null);
  
  // 見積もりボタンクリック時の処理
  const handleEstimate = (blueprint: QuotationBlueprint) => {
    setSelectedBlueprint(blueprint);
    setIsModalOpen(true);
  };

  // 見積もりモーダルを閉じる
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedBlueprint(null);
  };

  // 見積もりデータ保存
  const handleSaveEstimate = (blueprintId: string, estimateData: EstimateData) => {
    // 図面データを更新
    setBlueprints(prev => prev.map(blueprint => 
      blueprint.id === blueprintId 
        ? { ...blueprint, estimateInformation: { ...blueprint.estimateInformation, ...estimateData } }
        : blueprint
    ));
    
    // モーダルを閉じる
    handleCloseModal();
    console.log("見積もりデータ保存完了:", { blueprintId, estimateData });
  };
  
  // GalleryView設定を生成
  const galleryConfig = createQuotationBlueprintGalleryConfig(handleEstimate);

  return (
    <div className="h-full">
      <div className="flex-1 overflow-auto p-4">
        <GalleryView
          data={blueprints}
          config={galleryConfig}
          loading={false}
        />
      </div>

      {/* 見積もりモーダル */}
      <BlueprintEstimateDialog
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        blueprint={selectedBlueprint}
        onSave={handleSaveEstimate}
      />
    </div>
  );
}