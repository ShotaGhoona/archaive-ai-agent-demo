import { useState, useMemo, useCallback } from 'react';
import { FilterConfig, FilterState } from './types';
import { applyFilters, createInitialFilters, hasActiveFilters } from './filterUtils';

export interface UseAdvancedFilterReturn<T> {
  // フィルター状態
  filters: FilterState<T>;
  setFilters: (filters: FilterState<T>) => void;
  
  // フィルタリングされたデータ
  filteredData: T[];
  
  // サイドバー状態
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  toggleSidebar: () => void;
  
  // フィルター操作
  clearFilters: () => void;
  updateFilter: (key: string, value: unknown) => void;
  
  // 状態チェック
  hasActiveFilters: boolean;
}

/**
 * 高度なフィルタリング機能を提供するカスタムフック
 */
export function useAdvancedFilter<T>(
  data: T[],
  config: FilterConfig<T>[],
  options?: {
    initialFilters?: FilterState<T>;
    initialOpen?: boolean;
  }
): UseAdvancedFilterReturn<T> {
  // 初期フィルター状態の作成
  const initialFilters = useMemo(() => {
    return options?.initialFilters || createInitialFilters(config);
  }, [config, options?.initialFilters]);

  // フィルター状態の管理
  const [filters, setFilters] = useState<FilterState<T>>(initialFilters);
  
  // サイドバー開閉状態の管理
  const [isOpen, setIsOpen] = useState(options?.initialOpen || false);

  // フィルタリングされたデータの計算
  const filteredData = useMemo(() => {
    return applyFilters(data, filters, config);
  }, [data, filters, config]);

  // フィルターをクリアする
  const clearFilters = useCallback(() => {
    setFilters(initialFilters);
  }, [initialFilters]);

  // 個別フィルターを更新する
  const updateFilter = useCallback((key: string, value: unknown) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  // サイドバーを切り替える
  const toggleSidebar = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  // アクティブなフィルターがあるかチェック
  const hasActiveFiltersValue = useMemo(() => {
    return hasActiveFilters(filters, initialFilters);
  }, [filters, initialFilters]);

  return {
    // フィルター状態
    filters,
    setFilters,
    
    // フィルタリングされたデータ
    filteredData,
    
    // サイドバー状態
    isOpen,
    setIsOpen,
    toggleSidebar,
    
    // フィルター操作
    clearFilters,
    updateFilter,
    
    // 状態チェック
    hasActiveFilters: hasActiveFiltersValue,
  };
}