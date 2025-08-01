import { useState, useCallback } from 'react';
import { SortConfig, SortableFields, DataTableColumn, SortIconData } from '../model';

interface UseTableSortProps<T> {
  columns: DataTableColumn<T>[];
}

export function useTableSort<T>({ columns }: UseTableSortProps<T>) {
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);

  // columns からソート可能フィールドを動的に生成
  const sortableFields = columns.reduce((acc, col) => {
    if (col.sortable) {
      acc[col.key as string] = { 
        type: col.sortType || 'string', 
        label: col.label 
      };
    }
    return acc;
  }, {} as SortableFields);

  const handleSort = useCallback((field: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    
    if (sortConfig?.field === field && sortConfig?.direction === 'asc') {
      direction = 'desc';
    }
    
    setSortConfig({ field, direction });
  }, [sortConfig]);

  const getSortedData = useCallback((data: T[]) => {
    if (!sortConfig) return data;

    const { field, direction } = sortConfig;
    const fieldConfig = sortableFields[field];
    
    return [...data].sort((a, b) => {
      const aValue = (a as Record<string, unknown>)[field];
      const bValue = (b as Record<string, unknown>)[field];
      
      let comparison = 0;
      
      if (fieldConfig?.type === 'number') {
        comparison = Number(aValue) - Number(bValue);
      } else if (fieldConfig?.type === 'date') {
        comparison = new Date(aValue).getTime() - new Date(bValue).getTime();
      } else {
        // string型
        comparison = String(aValue).localeCompare(String(bValue), 'ja');
      }
      
      return direction === 'desc' ? -comparison : comparison;
    });
  }, [sortConfig, sortableFields]);

  const getSortIcon = useCallback((field: string): SortIconData => {
    if (!sortConfig || sortConfig.field !== field) {
      return { type: 'none' };
    }
    
    return { 
      type: sortConfig.direction === 'asc' ? 'asc' : 'desc' 
    };
  }, [sortConfig]);

  const getHeaderClassName = useCallback((field: string) => {
    const isSortable = field in sortableFields;
    let baseClass = "font-medium text-gray-700";
    
    if (isSortable) {
      baseClass += " cursor-pointer hover:bg-gray-100 transition-colors select-none";
    }
    
    return baseClass;
  }, [sortableFields]);

  const isSortable = useCallback((field: string) => {
    return field in sortableFields;
  }, [sortableFields]);

  return {
    sortConfig,
    handleSort,
    getSortedData,
    getSortIcon,
    getHeaderClassName,
    isSortable,
    setSortConfig
  };
}