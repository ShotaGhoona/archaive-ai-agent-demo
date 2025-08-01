// 汎用的なデータテーブルの型定義

export interface DataTableColumn<T = unknown> {
  key: keyof T | string;
  label: string;
  width: number;
  minWidth?: number;
  sortable: boolean;
  editable: boolean;
  locked: boolean;
  inputType?: 'text' | 'number' | 'date' | 'email' | 'tel' | 'select';
  sortType?: 'string' | 'number' | 'date';
  selectOptions?: string[];
  render?: (item: T, value: unknown) => React.ReactNode;
  headerRender?: (column: DataTableColumn<T>) => React.ReactNode;
}

export interface EditingCell {
  rowId: string;
  field: string;
  value: unknown;
}

export interface SortConfig {
  field: string;
  direction: 'asc' | 'desc';
}

export interface ColumnWidths {
  [key: string]: number;
}

export interface ResizeState {
  isResizing: boolean;
  startX: number;
  startWidth: number;
  columnField: string;
}

export interface EditableFields {
  [key: string]: {
    type: 'text' | 'number' | 'date' | 'email' | 'tel' | 'select';
    label: string;
    options?: string[];
  };
}

export interface SortableFields {
  [key: string]: {
    type: 'string' | 'number' | 'date';
    label: string;
  };
}

// データテーブルのメイン props
export interface BasicDataTableProps<T = unknown> {
  data: T[];
  columns: DataTableColumn<T>[];
  onItemUpdate?: (rowId: string, field: string, value: unknown) => void;
  getRowId?: (item: T) => string;
  className?: string;
  emptyMessage?: string;
}

// Cell content の戻り値型
export interface CellContentData {
  isEditing: boolean;
  value: unknown;
  inputRef: React.RefObject<HTMLInputElement | null> | null;
  onChange: ((value: unknown) => void) | null;
  onSave: (() => void) | null;
  onCancel: (() => void) | null;
  inputType: string;
  selectOptions?: string[];
}

// Sort icon の戻り値型
export interface SortIconData {
  type: 'none' | 'asc' | 'desc';
}