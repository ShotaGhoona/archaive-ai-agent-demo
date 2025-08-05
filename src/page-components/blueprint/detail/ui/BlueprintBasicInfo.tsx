import React, { useState } from "react";
import { Button, Input } from "@/shared/shadcnui";
import { Save } from "lucide-react";

interface BlueprintFile {
  id: string;
  name: string;
  description: string;
  size: number;
  type: string;
  imageUrl: string;
  createdAt: string;
  isActive?: boolean;
}

interface BlueprintBasicInfoProps {
  activeFile: BlueprintFile | null;
  onSave?: (data: BlueprintInfoData) => void;
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

const initialData: BlueprintInfoData = {
  fileName: "",
  pageNumber: "1",
  customerName: "顧客名",
  productName: "製品名",
  internalProductNumber: "社内製番",
  customerProductNumber: "客先製番",
  cadName: "CAD名",
  camName: "CAM名",
  orderQuantity: "受注個数",
  orderDate: "受注日",
  deliveryDate: "納品日",
  maxLength: "最大寸法(長さ)",
  maxWidth: "最大寸法(幅)",
  maxHeight: "最大寸法(高さ)",
  test: "テスト",
  companyItem: "全社項目",
  itemG: "項目G",
  itemI: "項目I",
  remarks: "備考"
};

export function BlueprintBasicInfo({ activeFile, onSave }: BlueprintBasicInfoProps) {
  const [formData, setFormData] = useState<BlueprintInfoData>(initialData);
  const [isModified, setIsModified] = useState(false);

  React.useEffect(() => {
    if (activeFile) {
      setFormData(prev => ({
        ...prev,
        fileName: activeFile.name
      }));
      setIsModified(false);
    }
  }, [activeFile]);

  const handleInputChange = (field: keyof BlueprintInfoData, value: string) => {
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
    console.log("保存されたデータ:", formData);
  };

  const inputFields = [
    { label: "ファイル名", key: "fileName" as keyof BlueprintInfoData, readOnly: true },
    { label: "ページ番号", key: "pageNumber" as keyof BlueprintInfoData },
    { label: "顧客名", key: "customerName" as keyof BlueprintInfoData },
    { label: "製品名", key: "productName" as keyof BlueprintInfoData },
    { label: "社内製番", key: "internalProductNumber" as keyof BlueprintInfoData },
    { label: "客先製番", key: "customerProductNumber" as keyof BlueprintInfoData },
    { label: "CAD名", key: "cadName" as keyof BlueprintInfoData },
    { label: "CAM名", key: "camName" as keyof BlueprintInfoData },
    { label: "受注個数", key: "orderQuantity" as keyof BlueprintInfoData },
    { label: "受注日", key: "orderDate" as keyof BlueprintInfoData },
    { label: "納品日", key: "deliveryDate" as keyof BlueprintInfoData },
    { label: "最大寸法(長さ)", key: "maxLength" as keyof BlueprintInfoData },
    { label: "最大寸法(幅)", key: "maxWidth" as keyof BlueprintInfoData },
    { label: "最大寸法(高さ)", key: "maxHeight" as keyof BlueprintInfoData },
    { label: "テスト", key: "test" as keyof BlueprintInfoData },
    { label: "全社項目", key: "companyItem" as keyof BlueprintInfoData },
    { label: "項目G", key: "itemG" as keyof BlueprintInfoData },
    { label: "項目I", key: "itemI" as keyof BlueprintInfoData },
    { label: "備考", key: "remarks" as keyof BlueprintInfoData }
  ];

  return (
    <div className="space-y-4 overflow-y-auto flex-1">
      {inputFields.map((field) => (
        <div key={field.key} className="space-y-1">
          <label className="text-sm font-medium text-gray-700">
            {field.label}
          </label>
          <Input
            value={formData[field.key]}
            onChange={(e) => handleInputChange(field.key, e.target.value)}
            readOnly={field.readOnly}
            className={`h-10 ${field.readOnly ? 'bg-gray-50' : ''}`}
          />
        </div>
      ))}
      
      <div className="pt-4 border-t sticky bottom-0 bg-white">
        <Button
          onClick={handleSave}
          disabled={!isModified}
          className="w-full h-10 gap-2"
          variant={isModified ? "default" : "outline"}
        >
          <Save className="h-4 w-4" />
          変更内容を保存
        </Button>
      </div>
    </div>
  );
}