export interface FilterConfig<T = Record<string, unknown>> {
  key: keyof T;
  label: string;
  type: 'text' | 'select' | 'date' | 'dateRange' | 'number' | 'datetime-local';
  options?: string[];
  placeholder?: string;
  defaultValue?: unknown;
}

export interface FilterState {
  [key: string]: unknown;
}

export interface DateRangeFilter {
  from?: string;
  to?: string;
}

export interface AdvancedFilterProps<T = Record<string, unknown>> {
  isOpen: boolean;
  onToggle: () => void;
  filters: FilterState<T>;
  onFiltersChange: (filters: FilterState<T>) => void;
  onClearFilters: () => void;
  config: FilterConfig<T>[];
  title?: string;
  className?: string;
}

export interface FilterControlProps<T = Record<string, unknown>> {
  config: FilterConfig<T>;
  value: unknown;
  onChange: (value: unknown) => void;
}

export interface FilterToggleButtonProps {
  isOpen: boolean;
  onToggle: () => void;
  className?: string;
  children?: React.ReactNode;
}