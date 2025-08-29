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
}

export interface DatabaseConfig {
  columns: DatabaseColumnSettingConfig[];
  lastUpdated: string;
}