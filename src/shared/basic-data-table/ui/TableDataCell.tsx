import React from 'react';
import { TableCell, Input, Tooltip, TooltipTrigger, TooltipContent, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/shadcnui';
import { Lock } from 'lucide-react';
import { DataTableColumn, CellContentData } from '../model';

interface TableDataCellProps<T> {
  item: T;
  column: DataTableColumn<T>;
  isEditing: boolean;
  cellContent: CellContentData;
  onCellClick: (item: T, field: string) => void;
  getColumnWidth: (field: string) => number;
  getCellClassName: (field: string, isEditing: boolean) => string;
}

export function TableDataCell<T>({
  item,
  column,
  isEditing,
  cellContent,
  onCellClick,
  getColumnWidth,
  getCellClassName
}: TableDataCellProps<T>) {
  // カスタムレンダー関数がある場合
  if (column.render && !isEditing) {
    return (
      <TableCell 
        className={getCellClassName(column.key as string, isEditing)}
        style={{ width: getColumnWidth(column.key as string), minWidth: getColumnWidth(column.key as string) }}
        onClick={column.editable ? () => onCellClick(item, column.key as string) : undefined}
      >
        {column.render(item, cellContent.value)}
      </TableCell>
    );
  }

  // ロックされたフィールドの場合
  if (column.locked) {
    return (
      <TableCell 
        className={getCellClassName(column.key as string, false)}
        style={{ width: getColumnWidth(column.key as string), minWidth: getColumnWidth(column.key as string) }}
      >
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center gap-2">
              <Lock className="h-3 w-3 text-gray-400" />
              <span>{String(cellContent.value)}</span>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            このフィールドは編集できません
          </TooltipContent>
        </Tooltip>
      </TableCell>
    );
  }

  // 編集可能セル
  return (
    <TableCell 
      className={getCellClassName(column.key as string, isEditing)}
      style={{ width: getColumnWidth(column.key as string), minWidth: getColumnWidth(column.key as string) }}
      onClick={column.editable ? () => onCellClick(item, column.key as string) : undefined}
    >
      {isEditing ? (
        cellContent.inputType === 'select' && cellContent.selectOptions ? (
          <Select
            value={String(cellContent.value)}
            onValueChange={cellContent.onChange!}
            onOpenChange={(open) => {
              if (!open) cellContent.onSave!();
            }}
          >
            <SelectTrigger className="h-8 text-sm border-0 bg-transparent p-1 focus:ring-1 focus:ring-primary">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {cellContent.selectOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
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
            type={cellContent.inputType}
          />
        )
      ) : (
        <span>{String(cellContent.value)}</span>
      )}
    </TableCell>
  );
}