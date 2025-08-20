import { useState, useCallback, useEffect } from "react";
import { ComparisonConfig, ComparisonData, UseComparisonModalReturn } from "./types";

export function useComparisonModal(
  config: ComparisonConfig,
  currentItem: ComparisonData | null,
  defaultTab?: string
): UseComparisonModalReturn {
  const [activeTab, setActiveTab] = useState<string>(
    defaultTab || config.tabs[0]?.key || ''
  );
  const [formData, setFormData] = useState<{ [tabKey: string]: ComparisonData }>({});
  const [modifiedTabs, setModifiedTabs] = useState<Set<string>>(new Set());

  // フォームデータの初期化
  const resetFormData = useCallback(() => {
    if (!currentItem) return;

    const initialFormData: { [tabKey: string]: ComparisonData } = {};
    
    config.tabs.forEach(tab => {
      if (config.dataExtractors?.[tab.key]) {
        // カスタム抽出関数がある場合
        initialFormData[tab.key] = config.dataExtractors[tab.key](currentItem);
      } else {
        // デフォルトの抽出: currentItemから直接取得
        const tabData: ComparisonData = {};
        tab.fields.forEach(field => {
          tabData[field.key] = currentItem[field.key] || '';
        });
        initialFormData[tab.key] = tabData;
      }
    });

    setFormData(initialFormData);
    setModifiedTabs(new Set());
  }, [currentItem, config]);

  // currentItemが変更された時にフォームデータをリセット
  useEffect(() => {
    resetFormData();
  }, [resetFormData]);

  // 入力値変更ハンドラー
  const handleInputChange = useCallback((tabKey: string, fieldKey: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [tabKey]: {
        ...prev[tabKey],
        [fieldKey]: value
      }
    }));

    setModifiedTabs(prev => {
      const newSet = new Set(prev);
      newSet.add(tabKey);
      return newSet;
    });
  }, []);

  // 保存ハンドラー
  const handleSave = useCallback((tabKey: string) => {
    if (config.saveHandlers?.[tabKey] && formData[tabKey]) {
      config.saveHandlers[tabKey](formData[tabKey]);
      
      setModifiedTabs(prev => {
        const newSet = new Set(prev);
        newSet.delete(tabKey);
        return newSet;
      });
    }
  }, [config.saveHandlers, formData]);

  return {
    activeTab,
    setActiveTab,
    formData,
    modifiedTabs,
    handleInputChange,
    handleSave,
    resetFormData,
  };
}