import React, { useState, useEffect } from "react";
import { Button, Input } from "@/shared/shadcnui";
import { Save } from "lucide-react";
import { BlueprintFile, EstimateInformation as EstimateInfo } from "../data/types";

interface EstimateInformationProps {
  activeFile: BlueprintFile | null;
  onSave?: (estimateData: Partial<EstimateInfo>) => void;
}

const estimateInputFields: Array<{
  label: string;
  key: keyof EstimateInfo;
}> = [
  { label: "材料費", key: "materialCost" },
  { label: "加工費", key: "processingCost" },
  { label: "人件費", key: "laborCost" },
  { label: "設備費", key: "equipmentCost" },
  { label: "間接費", key: "overheadCost" },
  { label: "利益率(%)", key: "profitMargin" },
  { label: "総コスト", key: "totalCost" },
  { label: "単価", key: "unitPrice" },
  { label: "総価格", key: "totalPrice" },
  { label: "納期(日)", key: "deliveryDays" },
  { label: "段取費", key: "setupCost" },
  { label: "輸送費", key: "transportCost" },
  { label: "梱包費", key: "packagingCost" },
  { label: "品質保証費", key: "qualityAssuranceCost" },
  { label: "備考", key: "remarks" }
];

export function EstimateInformation({ activeFile, onSave }: EstimateInformationProps) {
  const [estimateData, setEstimateData] = useState<Partial<EstimateInfo>>(activeFile?.estimateInformation || {});
  const [isModified, setIsModified] = useState(false);

  useEffect(() => {
    if (activeFile) {
      setEstimateData(activeFile.estimateInformation || {});
      setIsModified(false);
    }
  }, [activeFile]);

  const handleInputChange = (field: keyof EstimateInfo, value: string) => {
    setEstimateData(prev => ({
      ...prev,
      [field]: value
    }));
    setIsModified(true);
  };

  const handleSave = () => {
    if (onSave) {
      onSave(estimateData);
    }
    setIsModified(false);
    console.log("見積もり情報保存:", estimateData);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {estimateInputFields.map((field) => (
            <div key={field.key} className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                {field.label}
              </label>
              <Input
                value={estimateData[field.key] || ''}
                onChange={(e) => handleInputChange(field.key, e.target.value)}
              />
            </div>
          ))}
        </div>
      </div>
      
      <div className="p-4 border-t">
        <Button
          onClick={handleSave}
          disabled={!isModified}
          className="w-full gap-2"
          variant={isModified ? "default" : "outline"}
        >
          <Save className="h-4 w-4" />
          見積もり情報を保存
        </Button>
      </div>
    </div>
  );
}