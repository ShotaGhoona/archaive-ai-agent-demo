// 汎用的な比較データインターフェース
export interface ComparisonData {
  [key: string]: unknown;
}

// フィールド設定のインターフェース
export interface ComparisonFieldConfig {
  key: string;
  label: string;
  readOnly?: boolean;
  formatter?: (value: unknown) => string;
}

// タブ設定のインターフェース
export interface ComparisonTabConfig {
  key: string;
  label: string;
  fields: ComparisonFieldConfig[];
}

// 比較設定の全体構造
export interface ComparisonConfig {
  tabs: ComparisonTabConfig[];
  saveHandlers?: {
    [tabKey: string]: (data: ComparisonData) => void;
  };
  dataExtractors?: {
    [tabKey: string]: (item: ComparisonData) => ComparisonData;
  };
}

// 比較モーダルのプロパティ
export interface ComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentItem: ComparisonData | null;
  comparisonItem: ComparisonData | null;
  config: ComparisonConfig;
  currentItemTitle?: string;
  comparisonItemTitle?: string;
  currentItemImageUrl?: string;
  comparisonItemImageUrl?: string;
  defaultTab?: string;
}

// フック用の返却型
export interface UseComparisonModalReturn {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  formData: { [tabKey: string]: ComparisonData };
  modifiedTabs: Set<string>;
  handleInputChange: (tabKey: string, fieldKey: string, value: string) => void;
  handleSave: (tabKey: string) => void;
  resetFormData: () => void;
}

// 比較フィールドコンポーネントのプロパティ
export interface ComparisonFieldProps {
  config: ComparisonFieldConfig;
  currentValue: unknown;
  comparisonValue: unknown;
  isEditable?: boolean;
  onChange?: (value: string) => void;
}

// 比較モーダルの表示アイテムインターフェース
export interface ComparisonItem {
  name?: string;
  title?: string;
  imageUrl?: string;
  data: ComparisonData;
}