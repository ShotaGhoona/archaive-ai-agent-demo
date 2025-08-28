import React from 'react';
import { Input } from '@/shared';
import { DataTableColumn, CellContentData } from '../../model';

interface DateTypeCellProps<T> {
  item: T;
  column: DataTableColumn<T>;
  cellContent: CellContentData;
  onCellClick: (item: T, field: string) => void;
}

export function DateTypeCell<T>({
  item,
  column,
  cellContent,
  onCellClick,
}: DateTypeCellProps<T>) {
  if (cellContent.isEditing) {
    return (
      <Input
        ref={cellContent.inputRef}
        value={String(cellContent.value)}
        onChange={(e) => cellContent.onChange!(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') cellContent.onSave!();
          if (e.key === 'Escape') cellContent.onCancel!();
        }}
        onBlur={cellContent.onSave!}
        className="h-8 text-sm border-0 bg-transparent p-1 focus:ring-1 focus:ring-primary"
        type="date"
      />
    );
  }

  const renderDateDisplay = () => {
    if (!cellContent.value) {
      return <span className="text-gray-400">未設定</span>;
    }

    const date = new Date(String(cellContent.value));
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) {
      return (
        <span className="text-blue-600">
          今日 {date.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })}
        </span>
      );
    }
    
    if (diffInDays > 0 && diffInDays <= 6) {
      return (
        <span className="text-orange-600">
          {diffInDays}日前 {date.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })}
        </span>
      );
    }
    
    return (
      <span className="text-gray-600">
        {date.toLocaleDateString('ja-JP', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        })} {date.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })}
      </span>
    );
  };

  return (
    <div 
      className={column.editable && !column.locked ? 'cursor-pointer' : undefined}
      onClick={column.editable && !column.locked ? () => onCellClick(item, column.key as string) : undefined}
    >
      {renderDateDisplay()}
    </div>
  );
}