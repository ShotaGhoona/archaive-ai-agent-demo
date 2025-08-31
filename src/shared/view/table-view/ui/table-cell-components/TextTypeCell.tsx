import React from 'react';
import { Input } from '@/shared';
import { DataTableColumn, CellContentData } from '../../model';

interface TextTypeCellProps<T> {
  item: T;
  column: DataTableColumn<T>;
  cellContent: CellContentData;
  onCellClick: (item: T, field: string) => void;
}

export function TextTypeCell<T>({
  item,
  column,
  cellContent,
  onCellClick,
}: TextTypeCellProps<T>) {
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
        className='focus:ring-primary h-8 border-0 bg-transparent p-1 text-sm focus:ring-1'
        type='text'
      />
    );
  }

  return (
    <span
      className={
        column.editable && !column.locked ? 'cursor-pointer' : undefined
      }
      onClick={
        column.editable && !column.locked
          ? () => onCellClick(item, column.key as string)
          : undefined
      }
    >
      {String(cellContent.value)}
    </span>
  );
}
