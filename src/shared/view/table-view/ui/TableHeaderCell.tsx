import React from 'react';
import { TableHead } from '@/shared';
import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';
import { DataTableColumn, SortIconData } from '../model';
import { useStickyColumns } from '../lib';

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
  getHeaderClassName,
}: TableHeaderCellProps<T>) {
  const { getStickyStyle } = useStickyColumns();
  const renderSortIcon = () => {
    if (!column.sortable) return null;

    if (sortIcon.type === 'none') {
      return (
        <div
          className='cursor-pointer transition-colors hover:text-gray-600'
          onClick={(e) => {
            e.stopPropagation();
            onSort(column.key as string);
          }}
          title='ソート'
        >
          <ChevronsUpDown className='h-4 w-4 text-gray-400' />
        </div>
      );
    }

    return sortIcon.type === 'asc' ? (
      <div
        className='hover:text-primary cursor-pointer transition-colors'
        onClick={(e) => {
          e.stopPropagation();
          onSort(column.key as string);
        }}
        title='降順でソート'
      >
        <ChevronUp className='text-primary h-4 w-4' />
      </div>
    ) : (
      <div
        className='hover:text-primary cursor-pointer transition-colors'
        onClick={(e) => {
          e.stopPropagation();
          onSort(column.key as string);
        }}
        title='昇順でソート'
      >
        <ChevronDown className='text-primary h-4 w-4' />
      </div>
    );
  };

  return (
    <TableHead
      className={`${getHeaderClassName(column.key as string)} relative`}
      style={getStickyStyle(column, getColumnWidth, { isHeader: true })}
    >
      <div className='flex items-center gap-2'>
        <span>{column.label}</span>
        {renderSortIcon()}
      </div>
      {column.key !== 'actions' && (
        <div
          className='hover:bg-primary hover:border-primary absolute top-0 right-0 z-20 h-full w-2 cursor-col-resize border-r border-gray-300 bg-transparent transition-all'
          onMouseDown={(e) => onMouseDown(e, column.key as string)}
          onClick={(e) => e.stopPropagation()}
          title='列幅をリサイズ'
        />
      )}
    </TableHead>
  );
}
