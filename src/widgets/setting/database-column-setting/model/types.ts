export interface SelectOption {
  id: string;
  label: string;
  color: string;
}

export interface DatabaseColumnSettingConfig {
  id: string;
  name: string;
  description?: string;
  dataType: 'text' | 'number' | 'date' | 'select' | 'user' | 'boolean';
  options?: SelectOption[]; // select用の選択肢（色付き）
  editable?: boolean; // 編集可能かどうか（デフォルト: true）
  isRequired: boolean; // 必須かどうか（デフォルト: false）
  showInBasicInfo: boolean; // 基本情報に表示するか（デフォルト: true）
  showInTable: boolean; // テーブルに表示するか（デフォルト: true）
}

export interface DatabaseConfig {
  columns: DatabaseColumnSettingConfig[];
  lastUpdated: string;
}