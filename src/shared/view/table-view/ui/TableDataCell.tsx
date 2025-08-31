import React from 'react';
import { TableCell, Tooltip, TooltipTrigger, TooltipContent } from '@/shared';
import { Lock } from 'lucide-react';
import { DataTableColumn, CellContentData } from '../model';
import { useStickyColumns } from '../lib';
import {
  TextTypeCell,
  NumberTypeCell,
  DateTypeCell,
  SelectTypeCell,
  UserTypeCell,
  BooleanTypeCell,
} from './table-cell-components';

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
  getCellClassName,
}: TableDataCellProps<T>) {
  const { getStickyStyle } = useStickyColumns();

  // ロックされたセルでカスタムrenderがない場合のみロック表示
  if (column.locked && !column.render) {
    return (
      <TableCell
        className={getCellClassName(column.key as string, isEditing)}
        style={getStickyStyle(column, getColumnWidth)}
      >
        <div className='flex items-center gap-1'>
          <Tooltip>
            <TooltipTrigger>
              <Lock className='h-3 w-3 text-gray-400' />
            </TooltipTrigger>
            <TooltipContent>
              <p>この項目はロックされています</p>
            </TooltipContent>
          </Tooltip>
          <span className='text-gray-500'>{String(cellContent.value)}</span>
        </div>
      </TableCell>
    );
  }

  // inputType別のコンポーネントをレンダリング
  const renderTypedCell = () => {
    // カスタムrenderがある場合は優先（非編集時のみ）
    if (!cellContent.isEditing && column.render) {
      return column.render(item, cellContent.value);
    }

    // inputType別のコンポーネントを使用
    const commonProps = {
      item,
      column,
      cellContent,
      onCellClick,
    };

    switch (column.inputType) {
      case 'text':
        return <TextTypeCell {...commonProps} />;
      case 'number':
        return <NumberTypeCell {...commonProps} />;
      case 'date':
        return <DateTypeCell {...commonProps} />;
      case 'select':
        return <SelectTypeCell {...commonProps} />;
      case 'user':
        return <UserTypeCell {...commonProps} />;
      case 'boolean':
        return <BooleanTypeCell {...commonProps} />;
      default:
        return <TextTypeCell {...commonProps} />;
    }
  };

  // 編集可能セル
  return (
    <TableCell
      className={getCellClassName(column.key as string, isEditing)}
      style={getStickyStyle(column, getColumnWidth)}
    >
      {renderTypedCell()}
    </TableCell>
  );
}
