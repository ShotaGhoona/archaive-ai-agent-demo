import React from 'react';
import { TableHead } from '@/shared/shadcnui';
import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';
import { DataTableColumn, SortIconData } from '../model';

interface TableHeaderCellProps<T> {
  column: DataTableColumn<T>;
  sortIcon: SortIconData;
  onSort: (field: string) => void;
  onMouseDown: (e: React.MouseEvent, field: string) => void;
  getColumnWidth: (field: string) => number;
  getHeaderClassName: (field: string) => string;
}

export function TableHeaderCell<T>({
  column,
  sortIcon,
  onSort,
  onMouseDown,
  getColumnWidth,
  getHeaderClassName
}: TableHeaderCellProps<T>) {
  const renderSortIcon = () => {
    if (!column.sortable) return null;
    
    if (sortIcon.type === 'none') {
      return (
        <div 
          className="cursor-pointer hover:text-gray-600 transition-colors" 
          onClick={(e) => {
            e.stopPropagation();
            onSort(column.key as string);
          }}
          title="ソート"
        >
          <ChevronsUpDown className="h-4 w-4 text-gray-400" />
        </div>
      );
    }
    
    return sortIcon.type === 'asc' 
      ? (
          <div 
            className="cursor-pointer hover:text-primary transition-colors" 
            onClick={(e) => {
              e.stopPropagation();
              onSort(column.key as string);
            }}
            title="降順でソート"
          >
            <ChevronUp className="h-4 w-4 text-primary" />
          </div>
        )
      : (
          <div 
            className="cursor-pointer hover:text-primary transition-colors" 
            onClick={(e) => {
              e.stopPropagation();
              onSort(column.key as string);
            }}
            title="昇順でソート"
          >
            <ChevronDown className="h-4 w-4 text-primary" />
          </div>
        );
  };

  return (
    <TableHead 
      className={`${getHeaderClassName(column.key as string)} relative`}
      style={{ width: getColumnWidth(column.key as string), minWidth: getColumnWidth(column.key as string) }}
    >
      <div className="flex items-center gap-2">
        <span>{column.label}</span>
        {renderSortIcon()}
      </div>
      {column.key !== 'actions' && (
        <div 
          className="absolute right-0 top-0 w-2 h-full cursor-col-resize hover:bg-primary bg-transparent border-r border-gray-300 hover:border-primary transition-all z-20"
          onMouseDown={(e) => onMouseDown(e, column.key as string)}
          onClick={(e) => e.stopPropagation()}
          title="列幅をリサイズ"
        />
      )}
    </TableHead>
  );
}