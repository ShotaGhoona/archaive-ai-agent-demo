import React, { useState } from "react";
import { Dialog, DialogContent, Button, Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared";
import { Save } from "lucide-react";
import { BlueprintFile, SimilarBlueprint, BasicInformation, EstimateInformation } from "@/widgets";
import { EditableComparisonField, ReadOnlyComparisonField } from "../lib";

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

export function ProjectSimilarBlueprintCompareModal({
  isOpen,
  onClose,
  currentBlueprint,
  similarBlueprint
}: SimilarBlueprintCompareModalProps) {
  const [activeTab, setActiveTab] = useState<'basic' | 'estimate'>('estimate');
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
        
        {/* shadcn/ui タブナビゲーション */}
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'basic' | 'estimate')} className="h-full flex flex-col">
          <div className="p-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="estimate">見積もり情報比較</TabsTrigger>
              <TabsTrigger value="basic">基本情報比較</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="estimate" className="flex-1 overflow-hidden mt-0">
            <div className="h-full overflow-y-auto">
              {/* タイトルエリア */}
              <div className="p-4 pb-2 flex gap-1">
                <div className="flex-1">
                  <h4 className="text-base font-semibold text-gray-900 border-b-2 border-gray-300 pb-3 bg-gray-50/50 px-3 py-2 rounded-t-lg">現在の図面</h4>
                </div>
                <div className="w-px bg-gray-300 mx-2"></div>
                <div className="flex-1">
                  <h4 className="text-base font-semibold text-blue-900 border-b-2 border-blue-300 pb-3 bg-blue-50/50 px-3 py-2 rounded-t-lg">類似図面</h4>
                </div>
              </div>
              
              {/* 図面コンテンツエリア */}
              <div className="flex p-4 pt-2 gap-1">
                {/* 左側: 現在の図面 */}
                <div className="flex-1 bg-gray-50 rounded-lg overflow-hidden p-4 flex items-center justify-center">
                  <img
                    src={currentBlueprint.imageUrl}
                    alt={currentBlueprint.name}
                    className="max-w-full max-h-full object-contain rounded border"
                  />
                </div>

                {/* 中央の区切り線 */}
                <div className="w-px bg-gray-300 mx-2"></div>

                {/* 右側: 類似図面 */}
                <div className="flex-1 bg-blue-50 rounded-lg overflow-hidden p-4 flex items-center justify-center">
                  <img
                    src={similarBlueprint.imageUrl}
                    alt={similarBlueprint.name}
                    className="max-w-full max-h-full object-contain rounded border"
                  />
                </div>
              </div>

              {/* 見積もり情報比較エリア */}
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
          </TabsContent>

          <TabsContent value="basic" className="flex-1 overflow-hidden mt-0">
            <div className="h-full overflow-y-auto">
              {/* タイトルエリア */}
              <div className="p-4 pb-2 flex gap-1">
                <div className="flex-1">
                  <h4 className="text-base font-semibold text-gray-900 border-b-2 border-gray-300 pb-3 bg-gray-50/50 px-3 py-2 rounded-t-lg">現在の図面</h4>
                </div>
                <div className="w-px bg-gray-300 mx-2"></div>
                <div className="flex-1">
                  <h4 className="text-base font-semibold text-blue-900 border-b-2 border-blue-300 pb-3 bg-blue-50/50 px-3 py-2 rounded-t-lg">類似図面</h4>
                </div>
              </div>
              
              {/* 図面コンテンツエリア */}
              <div className="flex p-4 pt-2 gap-1">
                {/* 左側: 現在の図面 */}
                <div className="flex-1 bg-gray-50 rounded-lg overflow-hidden p-4 flex items-center justify-center">
                  <img
                    src={currentBlueprint.imageUrl}
                    alt={currentBlueprint.name}
                    className="max-w-full max-h-full object-contain rounded border"
                  />
                </div>

                {/* 中央の区切り線 */}
                <div className="w-px bg-gray-300 mx-2"></div>

                {/* 右側: 類似図面 */}
                <div className="flex-1 bg-blue-50 rounded-lg overflow-hidden p-4 flex items-center justify-center">
                  <img
                    src={similarBlueprint.imageUrl}
                    alt={similarBlueprint.name}
                    className="max-w-full max-h-full object-contain rounded border"
                  />
                </div>
              </div>

              {/* 基本情報比較エリア */}
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
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}