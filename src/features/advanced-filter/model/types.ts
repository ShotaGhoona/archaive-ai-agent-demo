export interface FilterConfig<T = any> {
  key: keyof T;
  label: string;
  type: 'text' | 'select' | 'date' | 'dateRange' | 'number' | 'datetime-local';
  options?: string[];
  placeholder?: string;
  defaultValue?: any;
}

export interface FilterState<T = any> {
  [key: string]: any;
}

export interface DateRangeFilter {
  from?: string;
  to?: string;
}

export interface AdvancedFilterProps<T = any> {
  isOpen: boolean;
  onToggle: () => void;
  filters: FilterState<T>;
  onFiltersChange: (filters: FilterState<T>) => void;
  onClearFilters: () => void;
  config: FilterConfig<T>[];
  title?: string;
  className?: string;
}

export interface FilterControlProps<T = any> {
  config: FilterConfig<T>;
  value: any;
  onChange: (value: any) => void;
}

export interface FilterToggleButtonProps {
  isOpen: boolean;
  onToggle: () => void;
  className?: string;
  children?: React.ReactNode;
}