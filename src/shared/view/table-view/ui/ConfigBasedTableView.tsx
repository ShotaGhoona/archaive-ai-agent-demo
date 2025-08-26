import React, { useMemo } from 'react';
import {
  TableBody,
  TableHeader,
  TableRow,
} from '@/shared';
import { ConfigBasedTableViewProps } from '../model';
import { useColumnResize, useTableSort, useCellEdit, usePaginatedTable } from '../lib';
import { TableHeaderCell, TableDataCell, TablePagination } from '../ui';

export function ConfigBasedTableView<T>({
  data,
  config,
  onItemUpdate,
  getRowId = (item: T) => String((item as Record<string, unknown>).id || Math.random())
}: ConfigBasedTableViewProps<T>) {
  const { columns, pagination } = config;

  // ページネーション設定
  const paginationConfig = pagination || {
    enabled: false,
    defaultItemsPerPage: 20,
    allowedItemsPerPage: [10, 20, 50, 100],
    showItemsPerPageSelector: true,
    maxVisiblePages: 7,
  };

  // Custom hooks
  const { 
    handleMouseDown, 
    getColumnWidth 
  } = useColumnResize({ columns });
  
  const { 
    handleSort, 
    getSortedData, 
    getSortIcon, 
    getHeaderClassName 
  } = useTableSort({ columns });
  
  const {
    editingCell,
    handleCellClick,
    getCellContent,
    getCellClassName,
  } = useCellEdit({ 
    columns, 
    getRowId, 
    onUpdate: onItemUpdate 
  });

  // ソート済みのデータを取得
  const sortedData = getSortedData(data);

  // usePaginatedTableフックをソート済みデータに適用
  const {
    currentPage,
    itemsPerPage,
    totalPages,
    currentData,
    totalItems,
    setCurrentPage,
    setItemsPerPage,
  } = usePaginatedTable({
    data: sortedData,
    initialItemsPerPage: paginationConfig.enabled ? paginationConfig.defaultItemsPerPage : 10,
    initialPage: 1,
  });

  // 表示データの決定
  const displayData = paginationConfig.enabled ? currentData : sortedData;

  // ページネーション用のprops
  const paginationProps = useMemo(() => {
    if (!paginationConfig.enabled) {
      return null;
    }

    return {
      currentPage,
      totalPages,
      totalItems,
      itemsPerPage,
      onPageChange: setCurrentPage,
      onItemsPerPageChange: setItemsPerPage,
      showItemsPerPageSelector: paginationConfig.enabled ? paginationConfig.showItemsPerPageSelector : false,
      maxVisiblePages: paginationConfig.enabled ? paginationConfig.maxVisiblePages : 5,
    };
  }, [
    paginationConfig.enabled,
    paginationConfig.enabled ? paginationConfig.showItemsPerPageSelector : false,
    paginationConfig.enabled ? paginationConfig.maxVisiblePages : 5,
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    setCurrentPage,
    setItemsPerPage,
  ]);

  if (data.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500 text-sm">
        データがありません
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* スクロールコンテナ */}
      <div className="flex-1 relative overflow-auto">
        <table className="w-full caption-bottom text-base">
          {/* 固定ヘッダー */}
          <TableHeader className="sticky top-0 bg-white z-50 shadow-sm border-b backdrop-blur-sm">
            <TableRow>
              {columns.map((column) => (
                <TableHeaderCell
                  key={column.key as string}
                  column={column}
                  sortIcon={getSortIcon(column.key as string)}
                  onSort={handleSort}
                  onMouseDown={handleMouseDown}
                  getColumnWidth={getColumnWidth}
                  getHeaderClassName={getHeaderClassName}
                />
              ))}
            </TableRow>
          </TableHeader>
          {/* スクロール可能なボディ */}
          <TableBody>
            {displayData.map((item) => {
              const rowId = getRowId(item);
              return (
                <TableRow key={rowId} className="hover:bg-gray-50">
                  {columns.map((column) => {
                    const isEditing = editingCell?.rowId === rowId && editingCell?.field === column.key;
                    const cellContent = getCellContent(item, column.key as string);
                    
                    return (
                      <TableDataCell
                        key={column.key as string}
                        item={item}
                        column={column}
                        isEditing={isEditing}
                        cellContent={cellContent}
                        onCellClick={handleCellClick}
                        getColumnWidth={getColumnWidth}
                        getCellClassName={getCellClassName}
                      />
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </table>
      </div>
      
      {/* ページネーション */}
      {paginationProps && (
        <div className="flex-shrink-0 px-4 py-2">
          <TablePagination {...paginationProps} />
        </div>
      )}
    </div>
  );
}