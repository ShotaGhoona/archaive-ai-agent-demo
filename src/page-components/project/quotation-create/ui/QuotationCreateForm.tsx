"use client";

import { useState } from "react";
import { FormData, QuotationCreateBlueprint, EstimateData } from "../model";
import { GalleryView } from "@/shared";
import { createQuotationCreateBlueprintGalleryConfig } from "../lib";
import { BlueprintEstimateDialog } from "./BlueprintEstimateDialog";
import blueprintsData from "../data/blueprints.json";
import {
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
} from "@/shared";

interface QuotationCreateFormProps {
  formData: FormData;
  setFormData: (data: FormData) => void;
}

export function QuotationCreateForm({ formData, setFormData }: QuotationCreateFormProps) {
  const [blueprints, setBlueprints] = useState<QuotationCreateBlueprint[]>(blueprintsData as QuotationCreateBlueprint[]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBlueprint, setSelectedBlueprint] = useState<QuotationCreateBlueprint | null>(null);
  
  const updateFormField = (field: keyof FormData, value: unknown) => {
    setFormData({ ...formData, [field]: value });
  };

  // 見積もりボタンクリック時の処理
  const handleEstimate = (blueprint: QuotationCreateBlueprint) => {
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
  const galleryConfig = createQuotationCreateBlueprintGalleryConfig(handleEstimate);

  return (
    <div className="h-full overflow-y-auto p-6 space-y-8">
      {/* 上部: 基本情報 */}
      <div>
        <h2 className="text-lg font-semibold mb-4">基本情報</h2>
        
        {/* 基本情報 */}
        <div className="grid grid-cols-12 gap-4 mb-6">
          <div className="col-span-4">
            <Label className="text-sm font-medium">取引先</Label>
            <Select value={formData.clientName} onValueChange={(value) => updateFormField('clientName', value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="取引先を選択してください" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="株式会社STAR UP">株式会社STAR UP</SelectItem>
                <SelectItem value="株式会社ABC商事">株式会社ABC商事</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="col-span-2">
            <Label className="text-sm font-medium">&nbsp;</Label>
            <Select value={formData.honorific} onValueChange={(value) => updateFormField('honorific', value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="御中" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="御中">御中</SelectItem>
                <SelectItem value="様">様</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="col-span-6">
            <Label className="text-sm font-medium">見積書番号</Label>
            <Input 
              placeholder="見積書番号を入力してください"
              value={formData.quotationNumber}
              onChange={(e) => updateFormField('quotationNumber', e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-sm font-medium">発行日</Label>
            <Select value={formData.issueDate} onValueChange={(value) => updateFormField('issueDate', value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="発行日を選択してください" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2025/08/08">2025/08/08</SelectItem>
                <SelectItem value="2025/08/09">2025/08/09</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-sm font-medium">有効期限</Label>
            <Select value={formData.validUntil} onValueChange={(value) => updateFormField('validUntil', value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="有効期限を選択してください" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2025/09/08">2025/09/08</SelectItem>
                <SelectItem value="2025/09/15">2025/09/15</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* 中部: 図面ギャラリー */}
      <div>
        <h2 className="text-lg font-semibold mb-4">図面別見積もり</h2>
        <div className="min-h-[400px]">
          <GalleryView
            data={blueprints}
            config={galleryConfig}
          />
        </div>
      </div>

      {/* 下部: 備考 */}
      <div>
        <h2 className="text-lg font-semibold mb-4">備考</h2>
        <Textarea 
          placeholder="備考を入力してください"
          value={formData.remarks}
          onChange={(e) => updateFormField('remarks', e.target.value)}
          className="min-h-[100px]"
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