import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Badge } from '@/shared';
import { DataTableColumn, CellContentData, SelectOption, TableColor } from '../../model';

const getColorStyles = (color: TableColor): string => {
  switch (color) {
    case 'red': return 'bg-red-100 text-red-800';
    case 'orange': return 'bg-orange-100 text-orange-800';
    case 'yellow': return 'bg-yellow-100 text-yellow-800';
    case 'green': return 'bg-green-100 text-green-800';
    case 'blue': return 'bg-blue-100 text-blue-800';
    case 'indigo': return 'bg-indigo-100 text-indigo-800';
    case 'purple': return 'bg-purple-100 text-purple-800';
    case 'pink': return 'bg-pink-100 text-pink-800';
    case 'gray': return 'bg-gray-100 text-gray-800';
    case 'slate': return 'bg-slate-100 text-slate-800';
    case 'emerald': return 'bg-emerald-100 text-emerald-800';
    case 'sky': return 'bg-sky-100 text-sky-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getIconColorClass = (color: TableColor): string => {
  switch (color) {
    case 'red': return 'bg-red-500';
    case 'orange': return 'bg-orange-500';
    case 'yellow': return 'bg-yellow-500';
    case 'green': return 'bg-green-500';
    case 'blue': return 'bg-blue-500';
    case 'indigo': return 'bg-indigo-500';
    case 'purple': return 'bg-purple-500';
    case 'pink': return 'bg-pink-500';
    case 'gray': return 'bg-gray-500';
    case 'slate': return 'bg-slate-500';
    case 'emerald': return 'bg-emerald-500';
    case 'sky': return 'bg-sky-500';
    default: return 'bg-gray-500';
  }
};

interface SelectTypeCellProps<T> {
  item: T;
  column: DataTableColumn<T>;
  cellContent: CellContentData;
  onCellClick: (item: T, field: string) => void;
}

export function SelectTypeCell<T>({
  item,
  column,
  cellContent,
  onCellClick,
}: SelectTypeCellProps<T>) {
  if (cellContent.isEditing && cellContent.selectOptions) {
    return (
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
          {cellContent.selectOptions.map((option: SelectOption) => (
            <SelectItem key={option.label} value={option.label}>
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${getIconColorClass(option.color)}`} />
                {option.label}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }

  if (column.selectOptions) {
    const option = column.selectOptions.find(opt => opt.label === String(cellContent.value));
    return (
      <div 
        className={column.editable && !column.locked ? 'cursor-pointer' : undefined}
        onClick={column.editable && !column.locked ? () => onCellClick(item, column.key as string) : undefined}
      >
        <Badge className={getColorStyles(option?.color || 'gray')}>
          {String(cellContent.value)}
        </Badge>
      </div>
    );
  }

  return (
    <span 
      className={column.editable && !column.locked ? 'cursor-pointer' : undefined}
      onClick={column.editable && !column.locked ? () => onCellClick(item, column.key as string) : undefined}
    >
      {String(cellContent.value)}
    </span>
  );
}