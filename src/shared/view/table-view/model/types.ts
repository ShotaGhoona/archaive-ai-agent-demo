// 汎用的なデータテーブルの型定義

// 利用可能な色定数（12種類）
export const TABLE_COLORS = {
  red: 'red',
  orange: 'orange',
  yellow: 'yellow',
  green: 'green',
  blue: 'blue',
  indigo: 'indigo',
  purple: 'purple',
  pink: 'pink',
  gray: 'gray',
  slate: 'slate',
  emerald: 'emerald',
  sky: 'sky',
} as const;

export type TableColor = keyof typeof TABLE_COLORS;

export interface SelectOption {
  label: string;
  color: TableColor;
}

export interface DataTableColumn<T = unknown> {
  key: keyof T | string;
  label: string;
  width: number;
  minWidth?: number;
  sortable: boolean;
  editable: boolean;
  locked: boolean;
  inputType?: 'text' | 'number' | 'date' | 'select' | 'user' | 'boolean';
  sortType?: 'string' | 'number' | 'date';
  selectOptions?: SelectOption[];
  render?: (item: T, value: unknown) => React.ReactNode;
  headerRender?: (column: DataTableColumn<T>) => React.ReactNode;
  stickyLeft?: number;
  stickyRight?: number;
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
    type: 'text' | 'number' | 'date' | 'select' | 'user' | 'boolean';
    label: string;
    options?: SelectOption[];
  };
}

export interface SortableFields {
  [key: string]: {
    type: 'string' | 'number' | 'date';
    label: string;
  };
}

// TableView props
export interface TableViewProps<T = unknown> {
  data: T[];
  config: TableViewConfig<T>;
  onItemUpdate?: (rowId: string, field: string, value: unknown) => void;
  getRowId?: (item: T) => string;
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
  selectOptions?: SelectOption[];
}

// Sort icon の戻り値型
export interface SortIconData {
  type: 'none' | 'asc' | 'desc';
}

// ページネーション設定
export interface PaginationConfig {
  enabled: boolean;
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange?: (itemsPerPage: number) => void;
  showItemsPerPageSelector?: boolean;
}

// Config-based Table設定
export type TablePaginationConfig =
  | {
      enabled: false;
    }
  | {
      enabled: true;
      defaultItemsPerPage: number;
      allowedItemsPerPage: number[];
      showItemsPerPageSelector: boolean;
      maxVisiblePages: number;
    };

export interface TableViewConfig<T = unknown> {
  columns: DataTableColumn<T>[];
  pagination?: TablePaginationConfig;
}
