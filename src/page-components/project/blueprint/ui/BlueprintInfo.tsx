import React, { useState } from "react";
import { Button, Input } from "@/shared/shadcnui";
import { Save, Settings, ChevronUp, Calculator } from "lucide-react";
import { BlueprintFile, BasicInformation, EstimateInformation } from "../data/types";

interface BlueprintInfoProps {
  activeFile: BlueprintFile | null;
  onSave?: (basicData: Partial<BasicInformation>, estimateData: Partial<EstimateInformation>) => void;
}

const basicInputFields: Array<{
  label: string;
  key: keyof BasicInformation;
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

const estimateInputFields: Array<{
  label: string;
  key: keyof EstimateInformation;
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


export function BlueprintInfo({ activeFile, onSave }: BlueprintInfoProps) {
  const [activeTab, setActiveTab] = useState<'basic' | 'estimate'>('basic');
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<BasicInformation>>(activeFile?.basicInformation || {});
  const [estimateData, setEstimateData] = useState<Partial<EstimateInformation>>(activeFile?.estimateInformation || {});
  const [isBasicModified, setIsBasicModified] = useState(false);
  const [isEstimateModified, setIsEstimateModified] = useState(false);

  React.useEffect(() => {
    if (activeFile) {
      setFormData(activeFile.basicInformation || {});
      setEstimateData(activeFile.estimateInformation || {});
      setIsBasicModified(false);
      setIsEstimateModified(false);
    }
  }, [activeFile]);

  const handleBasicInputChange = (field: keyof BasicInformation, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setIsBasicModified(true);
  };

  const handleEstimateInputChange = (field: keyof EstimateInformation, value: string) => {
    setEstimateData(prev => ({
      ...prev,
      [field]: value
    }));
    setIsEstimateModified(true);
  };

  const handleBasicSave = () => {
    if (onSave) {
      onSave(formData, estimateData);
    }
    setIsBasicModified(false);
    console.log("基本情報保存:", formData);
  };

  const handleEstimateSave = () => {
    if (onSave) {
      onSave(formData, estimateData);
    }
    setIsEstimateModified(false);
    console.log("見積もり情報保存:", estimateData);
  };

  const handleTabClick = (tab: 'basic' | 'estimate') => {
    if (activeTab === tab && isOpen) {
      // 同じタブを再クリックした場合はパネルを閉じる
      setIsOpen(false);
    } else {
      // 異なるタブをクリックした場合、またはパネルが閉じている場合
      setActiveTab(tab);
      setIsOpen(true);
    }
  };



  return (
    <div>
      {/* タブボタン */}
      <div className="border-t bg-white grid grid-cols-2">
        <Button
          variant={activeTab === 'basic' ? "default" : "ghost"}
          className="h-10 rounded-none border-none flex items-center justify-center gap-2"
          onClick={() => handleTabClick('basic')}
        >
          <Settings className="h-4 w-4" />
          <span className="text-sm">基本情報</span>
          {activeTab === 'basic' && (
            <ChevronUp 
              className={`h-4 w-4 transition-transform duration-200 ${
                isOpen ? 'rotate-180' : ''
              }`}
            />
          )}
        </Button>
        
        <Button
          variant={activeTab === 'estimate' ? "default" : "ghost"}
          className="h-10 rounded-none border-none flex items-center justify-center gap-2"
          onClick={() => handleTabClick('estimate')}
        >
          <Calculator className="h-4 w-4" />
          <span className="text-sm">見積もり情報</span>
          {activeTab === 'estimate' && (
            <ChevronUp 
              className={`h-4 w-4 transition-transform duration-200 ${
                isOpen ? 'rotate-180' : ''
              }`}
            />
          )}
        </Button>
      </div>

      {/* 開閉パネル */}
      <div className={`
        bg-white border-t transition-all duration-300 ease-in-out overflow-hidden
        ${isOpen ? 'h-80' : 'h-0'}
      `}>
        <div className="p-4 h-full">
          <div className="h-full flex flex-col overflow-hidden">
            {/* コンテンツエリア */}
            <div className="flex-1 flex flex-col overflow-hidden">
              {activeTab === 'basic' ? (
                <div className="h-full flex flex-col overflow-hidden">
                  {/* スクロール可能なフィールドエリア */}
                  <div className="flex-1 overflow-y-auto pr-2">
                    <div className="grid grid-cols-3 gap-4">
                      {basicInputFields.map((field) => (
                        <div key={field.key} className="space-y-1">
                          <label className="text-sm font-medium text-gray-700">
                            {field.label}
                          </label>
                          <Input
                            value={formData[field.key] || ''}
                            onChange={(e) => handleBasicInputChange(field.key, e.target.value)}
                            readOnly={field.readOnly}
                            className={`h-10 ${field.readOnly ? 'bg-gray-50' : ''}`}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* 固定保存ボタン */}
                  <div className="bg-white flex-shrink-0 pt-4">
                    <Button
                      onClick={handleBasicSave}
                      disabled={!isBasicModified}
                      className="w-full h-10 gap-2"
                      variant={isBasicModified ? "default" : "outline"}
                    >
                      <Save className="h-4 w-4" />
                      基本情報を保存
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col overflow-hidden">
                  {/* スクロール可能なフィールドエリア */}
                  <div className="flex-1 overflow-y-auto pr-2">
                    <div className="grid grid-cols-3 gap-4">
                      {estimateInputFields.map((field) => (
                        <div key={field.key} className="space-y-1">
                          <label className="text-sm font-medium text-gray-700">
                            {field.label}
                          </label>
                          <Input
                            value={estimateData[field.key] || ''}
                            onChange={(e) => handleEstimateInputChange(field.key, e.target.value)}
                            className="h-10"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* 固定保存ボタン */}
                  <div className="bg-white flex-shrink-0 pt-4">
                    <Button
                      onClick={handleEstimateSave}
                      disabled={!isEstimateModified}
                      className="w-full h-10 gap-2"
                      variant={isEstimateModified ? "default" : "outline"}
                    >
                      <Save className="h-4 w-4" />
                      見積もり情報を保存
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}