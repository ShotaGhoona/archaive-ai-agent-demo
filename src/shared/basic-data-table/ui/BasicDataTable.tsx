import React from 'react';
import {
  Table,
  TableBody,
  TableHeader,
  TableRow,
} from '@/shared/shadcnui';
import { BasicDataTableProps } from '../model';
import { useColumnResize, useTableSort, useCellEdit } from '../lib';
import { TableHeaderCell } from './TableHeaderCell';
import { TableDataCell } from './TableDataCell';

export function BasicDataTable<T>({
  data,
  columns,
  onItemUpdate,
  getRowId = (item: T) => String((item as any).id || Math.random()),
  className = '',
  emptyMessage = 'データがありません'
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

  if (data.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500 text-sm">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className={`flex-1 flex flex-col min-h-0 ${className}`}>
      <div className="flex-1 overflow-auto">
        <Table>
          {/* 固定ヘッダー */}
          <TableHeader className="sticky top-0 bg-white z-50 shadow-sm">
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
            {sortedData.map((item) => {
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
        </Table>
      </div>
    </div>
  );
}