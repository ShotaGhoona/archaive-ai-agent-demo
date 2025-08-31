'use client';
import { useState, useMemo } from 'react';

export interface PaginatedTableState<T> {
  currentPage: number;
  itemsPerPage: number;
  totalPages: number;
  currentData: T[];
  totalItems: number;
}

export interface UsePaginatedTableProps<T> {
  data: T[];
  initialItemsPerPage?: number;
  initialPage?: number;
}

export interface UsePaginatedTableReturn<T> extends PaginatedTableState<T> {
  setCurrentPage: (page: number) => void;
  setItemsPerPage: (itemsPerPage: number) => void;
  goToFirstPage: () => void;
  goToLastPage: () => void;
}

export function usePaginatedTable<T>({
  data,
  initialItemsPerPage = 20,
  initialPage = 1,
}: UsePaginatedTableProps<T>): UsePaginatedTableReturn<T> {
  const [currentPage, setCurrentPageState] = useState(initialPage);
  const [itemsPerPage, setItemsPerPageState] = useState(initialItemsPerPage);

  // 総ページ数を計算
  const totalPages = useMemo(() => {
    return Math.ceil(data.length / itemsPerPage);
  }, [data.length, itemsPerPage]);

  // 現在のページデータを計算
  const currentData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return data.slice(startIndex, endIndex);
  }, [data, currentPage, itemsPerPage]);

  // ページ変更時に範囲チェック
  const setCurrentPage = (page: number) => {
    const validPage = Math.max(1, Math.min(page, totalPages));
    setCurrentPageState(validPage);
  };

  // 項目数変更時にページをリセット
  const setItemsPerPage = (newItemsPerPage: number) => {
    setItemsPerPageState(newItemsPerPage);
    setCurrentPageState(1); // 最初のページにリセット
  };

  // ユーティリティ関数
  const goToFirstPage = () => setCurrentPage(1);
  const goToLastPage = () => setCurrentPage(totalPages);

  return {
    currentPage,
    itemsPerPage,
    totalPages,
    currentData,
    totalItems: data.length,
    setCurrentPage,
    setItemsPerPage,
    goToFirstPage,
    goToLastPage,
  };
}
