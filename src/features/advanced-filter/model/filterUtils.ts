import { FilterConfig, FilterState, DateRangeFilter } from './types';

/**
 * フィルター条件に基づいてデータをフィルタリングする
 */
export function applyFilters<T>(
  data: T[],
  filters: FilterState<T>,
  config: FilterConfig<T>[]
): T[] {
  return data.filter((item) => {
    return config.every((filterConfig) => {
      const filterValue = filters[filterConfig.key as string];
      const itemValue = item[filterConfig.key];

      // フィルター値が空の場合はスキップ
      if (!filterValue && filterValue !== 0) {
        return true;
      }

      // dateRangeの場合は空の from/to をチェック
      if (filterConfig.type === 'dateRange' || filterConfig.type === 'datetime-local') {
        const rangeValue = filterValue as DateRangeFilter;
        if (!rangeValue.from && !rangeValue.to) {
          return true;
        }
      }

      return matchesFilter(itemValue, filterValue, filterConfig);
    });
  });
}

/**
 * 個別のフィルター条件をチェックする
 */
function matchesFilter<T>(
  itemValue: any,
  filterValue: any,
  config: FilterConfig<T>
): boolean {
  switch (config.type) {
    case 'text':
      return matchesTextFilter(itemValue, filterValue);
    
    case 'select':
      return matchesSelectFilter(itemValue, filterValue);
    
    case 'date':
      return matchesDateFilter(itemValue, filterValue);
    
    case 'dateRange':
      return matchesDateRangeFilter(itemValue, filterValue);
    
    case 'number':
      return matchesNumberFilter(itemValue, filterValue);

    case 'datetime-local':
      return matchesDateTimeFilter(itemValue, filterValue);
    
    default:
      return true;
  }
}

/**
 * テキストフィルターのマッチング
 */
function matchesTextFilter(itemValue: any, filterValue: string): boolean {
  if (!itemValue) return false;
  return itemValue.toString().toLowerCase().includes(filterValue.toLowerCase());
}

/**
 * セレクトフィルターのマッチング
 */
function matchesSelectFilter(itemValue: any, filterValue: string): boolean {
  if (filterValue === 'all') return true;
  return itemValue === filterValue;
}

/**
 * 日付フィルターのマッチング
 */
function matchesDateFilter(itemValue: any, filterValue: string): boolean {
  if (!itemValue) return false;
  const itemDate = new Date(itemValue).toISOString().split('T')[0];
  return itemDate === filterValue;
}

/**
 * 日付範囲フィルターのマッチング
 */
function matchesDateRangeFilter(itemValue: any, filterValue: DateRangeFilter): boolean {
  if (!itemValue) {
    // 空の値の場合、範囲フィルターが設定されていれば除外
    return !filterValue.from && !filterValue.to;
  }

  const itemDate = new Date(itemValue).toISOString().split('T')[0];
  
  if (filterValue.from && itemDate < filterValue.from) {
    return false;
  }
  
  if (filterValue.to && itemDate > filterValue.to) {
    return false;
  }
  
  return true;
}

/**
 * 数値フィルターのマッチング
 */
function matchesNumberFilter(itemValue: any, filterValue: string): boolean {
  if (!itemValue && itemValue !== 0) return false;
  return itemValue.toString().includes(filterValue);
}

/**
 * 日時フィルターのマッチング
 */
function matchesDateTimeFilter(itemValue: any, filterValue: DateRangeFilter): boolean {
  if (!itemValue) {
    return !filterValue.from && !filterValue.to;
  }

  const itemDateTime = new Date(itemValue).toISOString();
  
  if (filterValue.from) {
    const fromDateTime = new Date(filterValue.from).toISOString();
    if (itemDateTime < fromDateTime) {
      return false;
    }
  }
  
  if (filterValue.to) {
    const toDateTime = new Date(filterValue.to).toISOString();
    if (itemDateTime > toDateTime) {
      return false;
    }
  }
  
  return true;
}

/**
 * フィルター状態を初期化する
 */
export function createInitialFilters<T>(config: FilterConfig<T>[]): FilterState<T> {
  const initialFilters: FilterState<T> = {};
  
  config.forEach((filterConfig) => {
    const key = filterConfig.key as string;
    
    switch (filterConfig.type) {
      case 'dateRange':
      case 'datetime-local':
        initialFilters[key] = { from: '', to: '' };
        break;
      case 'select':
        initialFilters[key] = filterConfig.defaultValue || 'all';
        break;
      default:
        initialFilters[key] = filterConfig.defaultValue || '';
    }
  });
  
  return initialFilters;
}

/**
 * フィルターが適用されているかチェックする
 */
export function hasActiveFilters<T>(
  filters: FilterState<T>,
  initialFilters: FilterState<T>
): boolean {
  return Object.keys(filters).some((key) => {
    const current = filters[key];
    const initial = initialFilters[key];
    
    if (typeof current === 'object' && current !== null) {
      // 日付範囲の場合
      return current.from !== initial.from || current.to !== initial.to;
    }
    
    return current !== initial;
  });
}