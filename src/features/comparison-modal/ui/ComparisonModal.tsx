import React from "react";
import { Dialog, DialogContent, Button, Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared";
import { Save } from "lucide-react";
import { ComparisonModalProps, useComparisonModal } from "../model";
import { EditableComparisonField, ReadOnlyComparisonField } from "../lib";

export function ComparisonModal({
  isOpen,
  onClose,
  currentItem,
  comparisonItem,
  config,
  currentItemTitle = "現在のアイテム",
  comparisonItemTitle = "比較対象",
  currentItemImageUrl,
  comparisonItemImageUrl,
  defaultTab
}: ComparisonModalProps) {
  const {
    activeTab,
    setActiveTab,
    formData,
    modifiedTabs,
    handleInputChange,
    handleSave,
  } = useComparisonModal(config, currentItem, defaultTab);

  if (!currentItem || !comparisonItem) {
    return null;
  }

  // 比較対象アイテムからデータを抽出
  const getComparisonData = (tabKey: string) => {
    if (config.dataExtractors?.[tabKey]) {
      return config.dataExtractors[tabKey](comparisonItem);
    }
    // デフォルト: フラットなオブジェクトとして扱う
    return comparisonItem;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="min-w-[90vw] h-[90vh] flex flex-col">
        
        {/* shadcn/ui タブナビゲーション */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
          <div className="p-4">
            <TabsList className="grid w-full" style={{ gridTemplateColumns: `repeat(${config.tabs.length}, 1fr)` }}>
              {config.tabs.map(tab => (
                <TabsTrigger key={tab.key} value={tab.key}>{tab.label}</TabsTrigger>
              ))}
            </TabsList>
          </div>

          {config.tabs.map(tab => (
            <TabsContent key={tab.key} value={tab.key} className="flex-1 overflow-hidden mt-0">
              <div className="h-full overflow-y-auto">
                {/* タイトルエリア */}
                <div className="p-4 pb-2 flex gap-1">
                  <div className="flex-1">
                    <h4 className="text-base font-semibold text-gray-900 border-b-2 border-gray-300 pb-3 bg-gray-50/50 px-3 py-2 rounded-t-lg">
                      {currentItemTitle}
                    </h4>
                  </div>
                  <div className="w-px bg-gray-300 mx-2"></div>
                  <div className="flex-1">
                    <h4 className="text-base font-semibold text-blue-900 border-b-2 border-blue-300 pb-3 bg-blue-50/50 px-3 py-2 rounded-t-lg">
                      {comparisonItemTitle}
                    </h4>
                  </div>
                </div>
                
                {/* 画像コンテンツエリア */}
                {(currentItemImageUrl || comparisonItemImageUrl) && (
                  <div className="flex p-4 pt-2 gap-1">
                    {/* 左側: 現在のアイテム */}
                    <div className="flex-1 bg-gray-50 rounded-lg overflow-hidden p-4 flex items-center justify-center">
                      {currentItemImageUrl ? (
                        <img
                          src={currentItemImageUrl}
                          alt={currentItemTitle}
                          className="max-w-full max-h-full object-contain rounded border"
                        />
                      ) : (
                        <div className="text-gray-400 text-sm">画像なし</div>
                      )}
                    </div>

                    {/* 中央の区切り線 */}
                    <div className="w-px bg-gray-300 mx-2"></div>

                    {/* 右側: 比較対象 */}
                    <div className="flex-1 bg-blue-50 rounded-lg overflow-hidden p-4 flex items-center justify-center">
                      {comparisonItemImageUrl ? (
                        <img
                          src={comparisonItemImageUrl}
                          alt={comparisonItemTitle}
                          className="max-w-full max-h-full object-contain rounded border"
                        />
                      ) : (
                        <div className="text-gray-400 text-sm">画像なし</div>
                      )}
                    </div>
                  </div>
                )}

                {/* フィールド比較エリア */}
                <div className="px-4 pb-4 flex gap-1">
                  {/* 左側: 現在のアイテム（編集可能） */}
                  <div className="flex-1">
                    <div className="grid grid-cols-2 gap-4">
                      {tab.fields.map((field) => (
                        <div key={field.key} className="flex flex-col space-y-1">
                          <label className="text-sm font-medium text-gray-700">
                            {field.label}
                          </label>
                          <EditableComparisonField
                            config={field}
                            currentValue={formData[tab.key]?.[field.key] || ''}
                            comparisonValue={getComparisonData(tab.key)[field.key] || ''}
                            onChange={(value) => handleInputChange(tab.key, field.key, value)}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 中央の区切り線 */}
                  <div className="w-px bg-gray-300 mx-2"></div>

                  {/* 右側: 比較対象（参照のみ） */}
                  <div className="flex-1">
                    <div className="grid grid-cols-2 gap-4">
                      {tab.fields.map((field) => (
                        <div key={field.key} className="flex flex-col space-y-1">
                          <label className="text-sm font-medium text-blue-700">
                            {field.label}
                          </label>
                          <ReadOnlyComparisonField
                            config={field}
                            currentValue={formData[tab.key]?.[field.key] || ''}
                            comparisonValue={getComparisonData(tab.key)[field.key] || ''}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 下部固定保存ボタン */}
                {config.saveHandlers?.[tab.key] && (
                  <div className="bg-white p-4">
                    <Button
                      onClick={() => handleSave(tab.key)}
                      disabled={!modifiedTabs.has(tab.key)}
                      className="w-full h-10 gap-2"
                      variant={modifiedTabs.has(tab.key) ? "default" : "outline"}
                    >
                      <Save className="h-4 w-4" />
                      {tab.label}を保存
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}