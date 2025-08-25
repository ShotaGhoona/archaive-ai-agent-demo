"use client";

import React, { useState, useEffect } from "react";
import { Button, Input } from "@/shared";
import { Save } from "lucide-react";
import { BlueprintFile, BasicInformation as BasicInfo } from "@/widgets";

interface BasicInformationProps {
  activeFile: BlueprintFile | null;
  onSave?: (basicData: Partial<BasicInfo>) => void;
}

const basicInputFields: Array<{
  label: string;
  key: keyof BasicInfo;
  readOnly?: boolean;
}> = [
  { label: "ファイル名", key: "fileName", readOnly: true },
  { label: "ページ番号", key: "pageNumber" },
  { label: "顧客名", key: "customerName" },
  { label: "製品名", key: "productName" },
  { label: "社内製番", key: "internalProductNumber" },
  { label: "客先製番", key: "customerProductNumber" },
  { label: "CAD名", key: "cadName" },
  { label: "CAM名", key: "camName" },
  { label: "受注個数", key: "orderQuantity" },
  { label: "受注日", key: "orderDate" },
  { label: "納品日", key: "deliveryDate" },
  { label: "最大寸法(長さ)", key: "maxLength" },
  { label: "最大寸法(幅)", key: "maxWidth" },
  { label: "最大寸法(高さ)", key: "maxHeight" },
  { label: "テスト", key: "test" },
  { label: "全社項目", key: "companyItem" },
  { label: "項目G", key: "itemG" },
  { label: "項目I", key: "itemI" },
  { label: "備考", key: "remarks" }
];

export function BasicInformation({ activeFile, onSave }: BasicInformationProps) {
  const [formData, setFormData] = useState<Partial<BasicInfo>>(activeFile?.basicInformation || {});
  const [isModified, setIsModified] = useState(false);

  useEffect(() => {
    if (activeFile) {
      setFormData(activeFile.basicInformation || {});
      setIsModified(false);
    }
  }, [activeFile]);

  const handleInputChange = (field: keyof BasicInfo, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setIsModified(true);
  };

  const handleSave = () => {
    if (onSave) {
      onSave(formData);
    }
    setIsModified(false);
    console.log("基本情報保存:", formData);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {basicInputFields.map((field) => (
            <div key={field.key} className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                {field.label}
              </label>
              <Input
                value={formData[field.key] || ''}
                onChange={(e) => handleInputChange(field.key, e.target.value)}
                readOnly={field.readOnly}
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
          基本情報を保存
        </Button>
      </div>
    </div>
  );
}