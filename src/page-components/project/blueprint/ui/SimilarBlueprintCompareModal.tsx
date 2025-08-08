import React, { useState } from "react";
import { Dialog, DialogContent, Button } from "@/shared/shadcnui";
import { Save } from "lucide-react";
import { BlueprintFile, SimilarBlueprint, BasicInformation, EstimateInformation } from "../data/types";
import { EditableComparisonField, ReadOnlyComparisonField } from "../lib/comparison-field-components";

interface SimilarBlueprintCompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentBlueprint: BlueprintFile | null;
  similarBlueprint: SimilarBlueprint | null;
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

export function SimilarBlueprintCompareModal({
  isOpen,
  onClose,
  currentBlueprint,
  similarBlueprint
}: SimilarBlueprintCompareModalProps) {
  const [activeTab, setActiveTab] = useState<'blueprint' | 'basic' | 'estimate'>('blueprint');
  const [basicFormData, setBasicFormData] = useState<Partial<BasicInformation>>({});
  const [estimateFormData, setEstimateFormData] = useState<Partial<EstimateInformation>>({});
  const [isBasicModified, setIsBasicModified] = useState(false);
  const [isEstimateModified, setIsEstimateModified] = useState(false);

  React.useEffect(() => {
    if (currentBlueprint) {
      setBasicFormData(currentBlueprint.basicInformation || {});
      setEstimateFormData(currentBlueprint.estimateInformation || {});
      setIsBasicModified(false);
      setIsEstimateModified(false);
    }
  }, [currentBlueprint]);

  const handleBasicInputChange = (field: keyof BasicInformation, value: string) => {
    setBasicFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setIsBasicModified(true);
  };

  const handleEstimateInputChange = (field: keyof EstimateInformation, value: string) => {
    setEstimateFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setIsEstimateModified(true);
  };

  const handleBasicSave = () => {
    console.log("基本情報保存:", basicFormData);
    setIsBasicModified(false);
  };

  const handleEstimateSave = () => {
    console.log("見積もり情報保存:", estimateFormData);
    setIsEstimateModified(false);
  };

  if (!currentBlueprint || !similarBlueprint) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="min-w-[90vw] h-[90vh] flex flex-col">
        
        {/* タブナビゲーション */}
        <div className="border-b flex">
          <button
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors border-b-2 ${
              activeTab === 'blueprint'
                ? 'border-primary text-primary bg-primary/10'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('blueprint')}
          >
            図面比較
          </button>
          <button
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors border-b-2 ${
              activeTab === 'basic'
                ? 'border-primary text-primary bg-primary/10'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('basic')}
          >
            基本情報比較
          </button>
          <button
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors border-b-2 ${
              activeTab === 'estimate'
                ? 'border-primary text-primary bg-primary/10'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('estimate')}
          >
            見積もり情報比較
          </button>
        </div>

        <div className="flex-1 overflow-hidden">
          {activeTab === 'blueprint' && (
            /* 図面比較ビュー */
            <div className="h-full flex flex-col">
              {/* タイトルエリア */}
              <div className="p-4 pb-2 flex gap-1">
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-gray-800 border-b border-gray-200 pb-2">現在の図面</h4>
                </div>
                <div className="w-px bg-gray-300 mx-2"></div>
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-blue-800 border-b border-blue-200 pb-2">類似図面</h4>
                </div>
              </div>
              
              {/* 図面コンテンツエリア */}
              <div className="flex-1 flex p-4 pt-2 gap-1">
                {/* 左側: 現在の図面 */}
                <div className="flex-1 flex flex-col bg-gray-50 rounded-lg overflow-hidden">
                  <div className="flex-1 p-4 flex items-center justify-center">
                    <img
                      src={currentBlueprint.imageUrl}
                      alt={currentBlueprint.name}
                      className="max-w-full max-h-full object-contain rounded border"
                    />
                  </div>
                </div>

                {/* 中央の区切り線 */}
                <div className="w-px bg-gray-300 mx-2"></div>

                {/* 右側: 類似図面 */}
                <div className="flex-1 flex flex-col bg-blue-50 rounded-lg overflow-hidden">
                  <div className="flex-1 p-4 flex items-center justify-center">
                    <img
                      src={similarBlueprint.imageUrl}
                      alt={similarBlueprint.name}
                      className="max-w-full max-h-full object-contain rounded border"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'basic' && (
            /* 基本情報比較ビュー */
            <div className="h-full flex flex-col">
              {/* タイトルエリア */}
              <div className="p-4 pb-2 flex gap-1">
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-gray-800 border-b border-gray-200 pb-2">現在の図面の基本情報</h4>
                </div>
                <div className="w-px bg-gray-300 mx-2"></div>
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-blue-800 border-b border-blue-200 pb-2">類似図面の基本情報</h4>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto">
                <div className="px-4 pb-4 flex gap-1">
                  {/* 左側: 現在の図面の基本情報（編集可能） */}
                  <div className="flex-1">
                    <div className="grid grid-cols-2 gap-4">
                      {basicInputFields.map((field) => (
                        <div key={field.key} className="flex flex-col space-y-1">
                          <label className="text-sm font-medium text-gray-700">
                            {field.label}
                          </label>
                          <EditableComparisonField
                            value={basicFormData[field.key] || ''}
                            onChange={(value) => handleBasicInputChange(field.key, value)}
                            readOnly={field.readOnly}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 中央の区切り線 */}
                  <div className="w-px bg-gray-300 mx-2"></div>

                  {/* 右側: 類似図面の基本情報（参照のみ） */}
                  <div className="flex-1">
                    <div className="grid grid-cols-2 gap-4">
                      {basicInputFields.map((field) => (
                        <div key={field.key} className="flex flex-col space-y-1">
                          <label className="text-sm font-medium text-blue-700">
                            {field.label}
                          </label>
                          <ReadOnlyComparisonField
                            value={similarBlueprint.basicInformation?.[field.key] || ''}
                            compareValue={basicFormData[field.key] || ''}
                            showDifferences={true}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* 下部固定保存ボタン */}
              <div className="bg-white p-4">
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
          )}

          {activeTab === 'estimate' && (
            /* 見積もり情報比較ビュー */
            <div className="h-full flex flex-col">
              {/* タイトルエリア */}
              <div className="p-4 pb-2 flex gap-1">
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-gray-800 border-b border-gray-200 pb-2">現在の図面の見積もり情報</h4>
                </div>
                <div className="w-px bg-gray-300 mx-2"></div>
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-blue-800 border-b border-blue-200 pb-2">類似図面の見積もり情報</h4>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto">
                <div className="px-4 pb-4 flex gap-1">
                  {/* 左側: 現在の図面の見積もり情報（編集可能） */}
                  <div className="flex-1">
                    <div className="grid grid-cols-2 gap-4">
                      {estimateInputFields.map((field) => (
                        <div key={field.key} className="flex flex-col space-y-1">
                          <label className="text-sm font-medium text-gray-700">
                            {field.label}
                          </label>
                          <EditableComparisonField
                            value={estimateFormData[field.key] || ''}
                            onChange={(value) => handleEstimateInputChange(field.key, value)}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 中央の区切り線 */}
                  <div className="w-px bg-gray-300 mx-2"></div>

                  {/* 右側: 類似図面の見積もり情報（参照のみ） */}
                  <div className="flex-1">
                    <div className="grid grid-cols-2 gap-4">
                      {estimateInputFields.map((field) => (
                        <div key={field.key} className="flex flex-col space-y-1">
                          <label className="text-sm font-medium text-blue-700">
                            {field.label}
                          </label>
                          <ReadOnlyComparisonField
                            value={similarBlueprint.estimateInformation?.[field.key] || ''}
                            compareValue={estimateFormData[field.key] || ''}
                            showDifferences={true}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* 下部固定保存ボタン */}
              <div className="bg-white p-4">
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
      </DialogContent>
    </Dialog>
  );
}