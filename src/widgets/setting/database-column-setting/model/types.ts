export interface SelectOption {
  id: string;
  label: string;
  color: string;
}

export interface ColumnConfig {
  id: string;
  name: string;
  description?: string;
  displayEnabled: boolean;
  filterEnabled: boolean;
  dataType: 'text' | 'number' | 'date' | 'select' | 'user' | 'boolean';
  order: number;
  options?: SelectOption[]; // select用の選択肢（色付き）
}

export interface DatabaseConfig {
  columns: ColumnConfig[];
  lastUpdated: string;
}


// Widget用のプロパティ型
export interface DatabaseColumnSettingProps {
  defaultColumns: ColumnConfig[];
  databaseType: string;
  pageTitle: string;
}