import React from 'react';
import { Switch } from '@/shared';
import { DataTableColumn, CellContentData } from '../../model';

interface BooleanTypeCellProps<T> {
  item: T;
  column: DataTableColumn<T>;
  cellContent: CellContentData;
  onCellClick: (item: T, field: string) => void;
}

export function BooleanTypeCell<T>({
  item,
  column,
  cellContent,
  onCellClick,
}: BooleanTypeCellProps<T>) {
  if (cellContent.isEditing) {
    return (
      <Switch
        checked={Boolean(cellContent.value)}
        onCheckedChange={(checked) => {
          cellContent.onChange!(checked);
          cellContent.onSave!();
        }}
        className="h-8"
      />
    );
  }

  return (
    <div 
      className={column.editable && !column.locked ? 'cursor-pointer' : undefined}
      onClick={column.editable && !column.locked ? () => onCellClick(item, column.key as string) : undefined}
    >
      <span className={cellContent.value ? 'text-green-600 font-medium' : 'text-gray-500'}>
        {cellContent.value ? 'はい' : 'いいえ'}
      </span>
    </div>
  );
}