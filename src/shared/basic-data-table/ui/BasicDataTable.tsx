import React, { useMemo } from 'react';
import {
  TableBody,
  TableHeader,
  TableRow,
} from '@/shared/shadcnui';
import { BasicDataTableProps } from '../model';
import { useColumnResize, useTableSort, useCellEdit } from '../lib';
import { TableHeaderCell } from './TableHeaderCell';
import { TableDataCell } from './TableDataCell';
import { TablePagination } from './TablePagination';

export function BasicDataTable<T>({
  data,
  columns,
  onItemUpdate,
  getRowId = (item: T) => String((item as Record<string, unknown>).id || Math.random()),
  className = '',
  emptyMessage = 'データがありません',
  pagination
}: BasicDataTableProps<T>) {
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

  // ページネーション有効時はデータをスライシング
  const displayData = useMemo(() => {
    if (!pagination?.enabled) {
      return sortedData;
    }
    
    const startIndex = (pagination.currentPage - 1) * pagination.itemsPerPage;
    const endIndex = startIndex + pagination.itemsPerPage;
    return sortedData.slice(startIndex, endIndex);
  }, [sortedData, pagination]);

  // ページネーション設定を計算
  const paginationProps = useMemo(() => {
    if (!pagination?.enabled) {
      return null;
    }

    const totalPages = Math.ceil(data.length / pagination.itemsPerPage);
    
    return {
      currentPage: pagination.currentPage,
      totalPages,
      totalItems: data.length,
      itemsPerPage: pagination.itemsPerPage,
      onPageChange: pagination.onPageChange,
      onItemsPerPageChange: pagination.onItemsPerPageChange,
      showItemsPerPageSelector: pagination.showItemsPerPageSelector,
      showTotalItems: pagination.showTotalItems,
    };
  }, [pagination, data.length]);

  if (data.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500 text-sm">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className={`flex-1 flex flex-col min-h-0 ${className}`}>
      {/* スクロールコンテナを移動し、table要素の直接の親にする */}
      <div className="flex-1 relative overflow-auto">
        <table className="w-full caption-bottom text-base">
          {/* 固定ヘッダー - スクロールコンテナの直接の子要素として正しく固定される */}
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