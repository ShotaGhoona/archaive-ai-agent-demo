"use client";
import { useState, useMemo } from "react";
import type { SearchConfig, UseSearchbarReturn } from "../model/types";

export function useSearchbar<T>(
  data: T[],
  searchConfig: SearchConfig<T>
): UseSearchbarReturn<T> {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState(
    searchConfig.basicFilter?.defaultOption || "全て"
  );

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      // 設定ベースの検索ロジック
      const matchesSearch = searchConfig.searchableFields.some(fieldKey => {
        const value = String(item[fieldKey]);
        return value.toLowerCase().includes(searchTerm.toLowerCase());
      });

      // 基本フィルターの適用
      const matchesBasicFilter = searchConfig.basicFilter
        ? selectedFilter === searchConfig.basicFilter.defaultOption || 
          item[searchConfig.basicFilter.filterKey] === selectedFilter
        : true;

      return matchesSearch && matchesBasicFilter;
    });
  }, [data, searchTerm, selectedFilter, searchConfig]);

  return {
    searchTerm,
    setSearchTerm,
    selectedFilter,
    setSelectedFilter,
    filteredData,
  };
}